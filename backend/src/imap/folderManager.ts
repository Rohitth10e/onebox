import { ImapFlow } from "imapflow";

/**
 * Get list of available folders from IMAP server
 */
export async function getAvailableFolders(client: ImapFlow): Promise<string[]> {
  try {
    const mailboxes = await client.list();
    const folderNames = mailboxes.map((m: any) => m.path);
    
    console.log("Available folders:", folderNames);

    // Return all folders
    return folderNames;
  } catch (err) {
    console.error("Failed to list folders:", err);
    // Default to just INBOX if folder listing fails
    return ["INBOX"];
  }
}

/**
 * Get folders to sync - prioritizes main folders
 * Returns folders that should be synced during initial setup
 */
export async function getFoldersToSync(client: ImapFlow): Promise<string[]> {
  try {
    const mailboxes = await client.list();
    const folderNames = mailboxes.map((m: any) => m.path);
    
    console.log("Available folders for sync:", folderNames);

    // Always include INBOX
    const foldersToSync: Set<string> = new Set();
    foldersToSync.add("INBOX");

    // Look for common folder patterns
    const patterns = [
      { keywords: ["spam", "junk"], isSentinel: true },
      { keywords: ["important", "starred"], isSentinel: true },
      { keywords: ["trash", "bin"], isSentinel: true },
      { keywords: ["draft"], isSentinel: true },
      { keywords: ["sent"], isSentinel: true },
      { keywords: ["archive", "all"], isSentinel: true },
    ];

    for (const folder of folderNames) {
      const lowerFolder = folder.toLowerCase();
      
      // Add folders matching important patterns
      for (const pattern of patterns) {
        if (pattern.keywords.some((kw) => lowerFolder.includes(kw))) {
          foldersToSync.add(folder);
          break;
        }
      }
    }

    return Array.from(foldersToSync);
  } catch (err) {
    console.error("Failed to list folders for sync:", err);
    return ["INBOX"];
  }
}
