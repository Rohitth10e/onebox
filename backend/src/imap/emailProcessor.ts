export async function processNewEmail(accountLabel: string, client: any, uid: number) {
  console.log(`[${accountLabel}] New email detected. UID = ${uid}`);

  const msg = await client.fetchOne(uid, { source: true, envelope: true });

  const subject = msg.envelope.subject;
  const from = msg.envelope.from?.[0]?.address;
  const raw = msg.source.toString();

  console.log("Subject:", subject);
  console.log("From:", from);

  // Later: store to Elasticsearch
}