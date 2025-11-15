import fetch from "node-fetch";

export async function sendSlackNotification(text: string) {
  try {
    const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL;

    if (!SLACK_WEBHOOK) {
      console.error("[Slack] Missing SLACK_WEBHOOK_URL environment variable");
      return;
    }

    await fetch(SLACK_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    console.log("[Slack] Notification sent.");
  } catch (error) {
    console.error("[Slack] Error sending notification:", error);
  }
}
