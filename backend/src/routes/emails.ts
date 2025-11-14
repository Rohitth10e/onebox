import { Router } from "express";
import { getEmailById, listEmails, updateEmailLabel } from "../es/save";

const router = Router();

/*
 * GET /emails
 * List emails (optionally filter by account, folder)
*/
router.get("/", async (req, res) => {
  try {
    const { accountId, folder } = req.query;

    const emails = await listEmails({
      accountId: accountId?.toString(),
      folder: folder?.toString(),
    });

    res.json(emails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});

/*
 * GET /emails/:id
 * Fetch a single email
*/
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const email = await getEmailById(id);

    if (!email) return res.status(404).json({ error: "Email not found" });

    res.json(email);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch email" });
  }
});

/**
 * POST /emails/:id/label
 * Update label manually or from AI
*/
router.post("/:id/label", async (req, res) => {
  try {
    const id = req.params.id;
    const { label } = req.body;

    await updateEmailLabel(id, label);
    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update label" });
  }
});

export default router;
