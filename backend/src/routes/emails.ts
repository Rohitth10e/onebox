import { Router } from 'express';
import { es } from '../es/client';

const router = Router();

router.get("/", async (req, res) => {
    const account = req.query.account?.toString();

    if (!account) {
        return res.status(400).json({ error: "Query 'account' required" });
    }

    try {
        const result = await es.search({
            index: "emails",
            query: {
                term: { account }
            },
            sort: [
                { date: "desc" }
            ],
            size: 50
        });

        const emails = result.hits.hits.map(hit => ({
            id: hit._id,
            ...(hit._source as Record<string, unknown>)
        }));

        return res.json({ emails });

    } catch (err) {
        console.error("Inbox error:", err);
        return res.status(500).json({ error: "Inbox fetch failed" });
    }
})

export default router;