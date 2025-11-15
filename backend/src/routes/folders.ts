import { Router } from "express";
import { createImapClient } from "../imap/imapClient";
import { accounts } from "../imap/imapAccountConfig";
import { getAvailableFolders } from "../imap/folderManager";

const router = Router();

/*
 * GET /folders - Get list of available folders for the current account
 */
router.get("/", async (req, res) => {
  try {
    const accountId = req.user?.accountId;

    if (!accountId) {
      return res.status(400).json({ error: "No accountId provided" });
    }

    // Find the account
    const account = accounts.find((a) => a.label === accountId);
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    // Connect and get folders
    const client = createImapClient(account);
    await client.connect();

    const folders = await getAvailableFolders(client);
    await client.logout();

    // Add "ALL MAIL" as a special option
    const allFolders = [...folders, "ALL MAIL"];

    res.json({ folders: allFolders });
  } catch (err) {
    console.error("Failed to get folders:", err);
    res.status(500).json({ error: "Failed to retrieve folders" });
  }
});

export default router;
