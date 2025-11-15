import { accounts } from "./imapAccountConfig";
import { createImapClient } from "./imapClient";
import { processNewEmail } from "./emailProcessor";
import { initialSync } from "./initialSync";
import { getFoldersToSync } from "./folderManager";


export async function startImapSync() {
  for (const account of accounts) {
    const client = createImapClient(account);

    // console.log(`Connecting IMAP for ${account.label} (${account.user})...`);
    await client.connect();

    // console.log(`IMAP connected: ${account.label}`);
    // Discover folders to sync on this IMAP server
    const foldersToSync = await getFoldersToSync(client);
    
    for (const folder of foldersToSync) {
      await initialSync(account.label, client, folder);
    }

    // Set up idle listener for new emails in INBOX
    await client.mailboxOpen("INBOX");
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
