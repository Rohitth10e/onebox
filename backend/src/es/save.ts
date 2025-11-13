import { es } from './client'

export async function saveEmailToES(account: string, email: any) {
  try {
    await es.index({
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
