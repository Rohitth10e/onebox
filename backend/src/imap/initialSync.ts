import { ImapFlow } from "imapflow";
import { processNewEmail } from "./emailProcessor";

export async function initialSync(accountLabel: string, client: ImapFlow) {
  console.log(`[${accountLabel}] Starting initial sync (last 30 days)...`);

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - 30);

  const searchQuery = {
    since: sinceDate
  };

  const uidsResult = await client.search(searchQuery, { uid: true });
  const uids: number[] = Array.isArray(uidsResult) ? uidsResult : [];

  console.log(`[${accountLabel}] Found ${uids.length} emails`);

  for (const uid of uids) {
    await processNewEmail(accountLabel, client, uid);
  }

  console.log(`[${accountLabel}] Initial sync complete.`);
}
