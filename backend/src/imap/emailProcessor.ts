import { simpleParser } from "mailparser";
import { saveEmailToES } from "../es/save";
import { classifyEmail } from "../ai/classifyEmail";
import { updateEmailLabel } from "../es/save";
import { sendSlackNotification } from "../automation/slack";
import { triggerInterestedWebhook } from "../automation/webhook";
import { logInfo, logSuccess } from "../utils/logger";

export async function processNewEmail(accountLabel: string, client: any, uid: number) {
  logInfo(`${accountLabel}: New email → UID ${uid}`);

  // Fetch complete message
  const msg = await client.fetchOne(uid, { envelope: true, source: true });

  const { envelope } = msg;

  // Parse MIME
  const parsed = await simpleParser(msg.source);

  const parsedEmail = {
    uid,
    folder: msg.mailbox || "INBOX",
    subject: envelope.subject || "",
    from: envelope.from?.[0]?.address || "",
    to: envelope.to?.map((x) => x.address) || [],
    cc: envelope.cc?.map((x) => x.address) || [],
    bcc: envelope.bcc?.map((x) => x.address) || [],
    date: envelope.date || new Date(),
    text: parsed.text || "",
    html: parsed.html || "",
    messageId: parsed.messageId || "",
    inReplyTo: parsed.inReplyTo || null,
    references: parsed.references || [],
    headers: Object.fromEntries(parsed.headers) || {},
    label: null, // To be filled by AI later
    snippet: (parsed.text || "").slice(0, 200),
  };

  // Save to Elasticsearch
  await saveEmailToES(accountLabel, parsedEmail);
  const label = await classifyEmail(parsedEmail);
  await updateEmailLabel(`${accountLabel}-${uid}`, label);
  logSuccess(`AI: ${accountLabel}-${uid} → ${label}`);

  if (label === "Interested") {
    const message = `
🔥 *New Interested Lead!*
From: ${parsedEmail.from}
Subject: ${parsedEmail.subject}
Snippet: ${parsedEmail.text?.slice(0, 120)}...
  `;

    await sendSlackNotification(message);

    await triggerInterestedWebhook({
      emailId: `${accountLabel}-${uid}`,
      from: parsedEmail.from,
      subject: parsedEmail.subject,
      snippet: parsedEmail.text?.slice(0, 200),
      date: parsedEmail.date,
    });

    logSuccess(`Automation triggered → ${accountLabel}-${uid}`);
  }

  logSuccess(`${accountLabel}: Indexed UID ${uid}`);
}
