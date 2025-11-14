import { Router } from "express";
import { es } from "../es/client";

const router = Router();

/*
 * GET /search?q=keyword&accountId=abc&folder=INBOX&page=1&limit=20
*/
router.get("/", async (req, res) => {
  try {
    const { q, accountId, folder, page = 1, limit = 20 } = req.query;

    const from = (Number(page) - 1) * Number(limit);

    const must: any[] = [];
    const filter: any[] = [];

    if (q) {
      must.push({
        multi_match: {
          query: q,
          fields: ["subject", "text", "from"],
        },
      });
    } else {
      must.push({ match_all: {} });
    }

    if (accountId) {
      filter.push({ term: { accountId } });
    }

    if (folder) {
      filter.push({ term: { folder } });
    }

    const result = await es.search({
      index: "emails",
      from,
      size: Number(limit),
      body: {
        query: {
          bool: { must, filter },
        },
      },
    });

    const hits = result.hits.hits.map((h: any) => ({
      id: h._id,
      ...h._source,
    }));

    res.json({
      page: Number(page),
      limit: Number(limit),
      results: hits,
      total: typeof result.hits.total === 'number' ? result.hits.total : result.hits.total?.value,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
