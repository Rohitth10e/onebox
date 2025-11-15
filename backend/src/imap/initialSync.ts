import { ImapFlow } from "imapflow";
import { processNewEmail } from "./emailProcessor";

export async function initialSync(accountLabel: string, client: ImapFlow, folder: string = "INBOX") {
  console.log(`[${accountLabel}] Starting initial sync for folder "${folder}" (last 30 days)...`);

  try {
    await client.mailboxOpen(folder);
  } catch (err) {
    console.error(`[${accountLabel}] Failed to open folder "${folder}":`, err);
    return;
  }

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - 30);

  const searchQuery = {
    since: sinceDate
  };

  const uidsResult = await client.search(searchQuery, { uid: true });
  const uids: number[] = Array.isArray(uidsResult) ? uidsResult : [];

  console.log(`[${accountLabel}] Found ${uids.length} emails in "${folder}"`);

  for (const uid of uids) {
    await processNewEmail(accountLabel, client, uid);
  }

  console.log(`[${accountLabel}] Initial sync complete for "${folder}".`);
}
