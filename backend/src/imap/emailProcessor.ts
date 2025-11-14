import { simpleParser } from "mailparser";
import { saveEmailToES } from "../es/save";
import { classifyEmail } from "../ai/classifyEmail";
import { updateEmailLabel } from "../es/save";

export async function processNewEmail(accountLabel: string, client: any, uid: number) {
  console.log(`[${accountLabel}] New email detected: UID ${uid}`);

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
  console.log(`[AI] ${accountLabel}-${uid} categorized as ${label}`);

  console.log(`[${accountLabel}] Email UID ${uid} indexed.`);
}
