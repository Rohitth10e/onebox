import { es } from "./client";

export async function saveEmailToES(account: string, email: any) {
  try {
    const doc = {
      account,
      uid: email.uid,
      folder: email.folder || "INBOX",
      subject: email.subject,
      from: email.from,
      to: email.to,
      date: email.date,
      text: email.text,
      html: email.html,
      messageId: email.messageId,
      label: email.label || null,   // Will be filled by AI later
      headers: email.headers || {},
    };

    await es.index({
      index: "emails",
      id: `${account}-${email.uid}`,
      document: doc,
    });

    console.log(`[ES] Indexed email ${email.uid} (${email.subject})`);

  } catch (error) {
    console.error("[ES] Failed to index email:", error);
  }
}

export async function listEmails(filters: { account?: string; folder?: string }) {
  const must: any[] = [];
  const filter: any[] = [];

  if (filters.account) filter.push({ term: { account: filters.account } });
  if (filters.folder) filter.push({ term: { folder: filters.folder } });

  const result = await es.search({
    index: "emails",
    body: {
      query: {
        bool: { must, filter },
      },
      sort: [{ date: { order: "desc" } }],
    },
    size: 50, // default limit
  });

  return result.hits.hits.map((h: any) => ({
    id: h._id,
    ...h._source,
  }));
}

// GET EMAIL BY ID
export async function getEmailById(id: string) {
  try {
    const result = await es.get({
      index: "emails",
      id,
    });

    return result?._source || null;
  } catch (err: any) {
    if (err.meta?.statusCode === 404) return null;
    throw err;
  }
}

// UPDATE EMAIL LABEL
export async function updateEmailLabel(id: string, label: string) {
  try {
    await es.update({
      index: "emails",
      id,
      doc: { label },
    });

    return true;
  } catch (err) {
    console.error("[ES] Failed to update label:", err);
    throw err;
  }
}
