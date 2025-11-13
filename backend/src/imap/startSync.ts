import { accounts } from "./imapAccountConfig";
import { createImapClient } from "./imapClient";
import { processNewEmail } from "./emailProcessor";
import { initialSync } from "./initialSync";
import { saveEmailToES } from "../es/save";


export async function startImapSync() {
  for (const account of accounts) {
    const client = createImapClient(account);

    // console.log(`Connecting IMAP for ${account.label} (${account.user})...`);
    await client.connect();
    await client.mailboxOpen("INBOX");

    // console.log(`IMAP connected: ${account.label}`);
    await initialSync(account.label, client);

    client.on("exists", async () => {
      const lock = await client.getMailboxLock("INBOX");
      try {
        const uid = client.mailbox && client.mailbox.exists; 
        await processNewEmail(account.label, client, uid);
      } finally {
        lock.release();
      }
    });

    client.idle();
  }
}
