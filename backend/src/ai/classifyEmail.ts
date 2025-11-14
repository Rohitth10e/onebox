import OpenAI from "openai";
import { EmailLabel } from "./emailLabels";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function classifyEmail(email: {
  subject: string;
  from: string;
  text: string;
  html?: string;
}): Promise<EmailLabel> {
  const prompt = `
You are an AI email classifier for a sales outreach platform.

Classify the following email into EXACTLY ONE of these labels:
- Interested
- Meeting Booked
- Not Interested
- Spam
- Out of Office

Rules:
- "Interested" → if they want to know more, ask for details, are positive
- "Meeting Booked" → if they propose a time slot OR accept a meeting link
- "Not Interested" → polite declines
- "Spam" → marketing, irrelevant, mass content
- "Out of Office" → automatic OOO replies

Return ONLY the JSON:
{
  "label": "Interested"
}

Email Content:
Subject: ${email.subject}
From: ${email.from}
Body: ${email.text || ""}
  `;

  try {
    const resp = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    const output = resp.output_text;

    const parsed = JSON.parse(output);

    return parsed.label as EmailLabel;
  } catch (err) {
    console.error("[AI] Classification failed, falling back to rule-based:", err);

    const body = (email.text || "").toLowerCase();

    if (body.includes("out of office") || body.includes("ooo")) {
      return "Out of Office";
    }

    if (body.includes("unsubscribe") || body.includes("buy now")) {
      return "Spam";
    }

    if (
      body.includes("schedule") ||
      body.includes("meeting") ||
      body.includes("calendar")
    ) {
      return "Meeting Booked";
    }

    if (body.includes("not interested") || body.includes("no thanks")) {
      return "Not Interested";
    }

    // default fallback:
    return "Interested";
  }
}
