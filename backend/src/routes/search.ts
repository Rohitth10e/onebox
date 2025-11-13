import { Router } from 'express';
import { es } from '../es/client';

const router = Router();

router.get('/', async (req, res) => {
    const q = req.query.q?.toString() || "";
    if (!q) {
        return res.status(400).json({ error: "Query 'q' required" });
    }

    try {
        const result = await es.search({
            index: "emails",
            query: {
                multi_match: {
                    query: q,
                    fields: ["subject", "from", "text"],
                    fuzziness: "AUTO",
                }
            }
        })

        const hits = result.hits.hits.map(hit => ({
            id: hit._id,
            ...(hit._source as Record<string, unknown>)
        }));

        return res.json({ hits });

    } catch (err) {
        console.error("Search error:", err);
        return res.status(500).json({ error: "Search failed" });
    }
})

export default router;