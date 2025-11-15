import { GoogleGenerativeAI } from "@google/generative-ai";
import { EmailLabel } from "./emailLabels";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0,
    responseMimeType: "application/json"
  }
});

export async function classifyEmail(email: {
  subject: string;
  from: string;
  text: string;
  html?: string;
}): Promise<EmailLabel> {

  const prompt = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
Your task is to classify an email into EXACTLY ONE of the following labels:
- Interested
- Meeting Booked
- Not Interested
- Spam
- Out of Office

Rules:
- Interested: positive signs, curiosity, wants more info
- Meeting Booked: suggests a time or accepts meeting link
- Not Interested: declining or rejecting
- Spam: irrelevant marketing, promo, or mass content
- Out of Office: automatic OOO messages

You MUST output ONLY valid JSON:
{
  "label": "Interested"
}

Email:
Subject: ${email.subject}
From: ${email.from}
Body: ${email.text || ""}
`
          }
        ]
      }
    ]
  };

  try {
    const result = await model.generateContent(prompt);
    const json = result.response.text();
    const parsed = JSON.parse(json);

    return parsed.label as EmailLabel;

  } catch (err) {
    console.warn("[AI] Gemini classification failed → rule-based fallback");

    const body = (email.text || "").toLowerCase();

    if (body.includes("out of office") || body.includes("ooo"))
      return "Out of Office";

    if (body.includes("unsubscribe") || body.includes("buy now"))
      return "Spam";

    if (
      body.includes("schedule") ||
      body.includes("meeting") ||
      body.includes("calendar")
    )
      return "Meeting Booked";

    if (body.includes("not interested") || body.includes("no thanks"))
      return "Not Interested";

    return "Interested";
  }
}
