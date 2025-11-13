import { simpleParser } from "mailparser";

export async function processNewEmail(accountLabel: string, client: any, uid: number) {
  console.log(`[${accountLabel}] New email detected: UID ${uid}`);

  // Fetch the raw email + envelope
  const msg = await client.fetchOne(uid, { envelope: true, source: true });

  const envelope = msg.envelope;

  // Parse the raw MIME message
  const parsed = await simpleParser(msg.source);

  const subject = envelope.subject || "";
  const from = envelope.from?.[0]?.address || "";
  const html = parsed.html || "";
  const text = parsed.text || "";

  console.log("Subject:", subject);
  console.log("From:", from);
  console.log("Text:", text.slice(0, 100));
}
