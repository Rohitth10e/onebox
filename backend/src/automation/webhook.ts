import fetch from "node-fetch";

export async function triggerInterestedWebhook(payload: any) {
  try {
    const WEBHOOK_URL = process.env.INTERESTED_WEBHOOK_URL;

    if (!WEBHOOK_URL) {
      console.error("[Webhook] Missing INTERESTED_WEBHOOK_URL env variable");
      return;
    }

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("[Webhook] Triggered automation webhook.");
  } catch (error) {
    console.error("[Webhook] Error triggering webhook:", error);
  }
}
