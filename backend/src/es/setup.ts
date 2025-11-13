import { Client } from "@elastic/elasticsearch";

const client = new Client({
  node: process.env.ES_URL,
});

export async function setupEmailIndex() {
  console.log("creating elasticsearch index");

  const indexName = "emails";

  try {
    const exists = await client.indices.exists({ index: indexName });

    if (!exists) {
      await client.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              subject: { type: "text" },
              from: { type: "keyword" },
              to: { type: "keyword" },
              date: { type: "date" },
              text: { type: "text" },
            },
          },
        },
      });

      console.log("Index created!");
    } else {
      console.log("Index already exists");
    }
  } catch (err) {
    console.error("Error creating index:", err);
  }
}
