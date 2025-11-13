import { Client } from "@elastic/elasticsearch";

const client = new Client({
  node: process.env.ES_URL!,
  headers: {
    "Content-Type": "application/vnd.elasticsearch+json; compatible-with=8",
    Accept: "application/vnd.elasticsearch+json; compatible-with=8",
  }
});

export async function saveEmailToES(account: string, email: any) {
  try {
    await client.index({
      index: "emails",
      id: `${account}-${email.uid}`,
      document: {
        account,
        uid: email.uid,
        subject: email.subject,
        from: email.from,
        to: email.to,
        date: email.date,
        text: email.text,
      },
    });

    console.log(`[ES] Stored email UID ${email.uid} from ${account}`);
  } catch (err) {
    console.error("[ES] Error saving email:", err);
  }
}
