const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.get("/", (req, res) => {
    res.json({
        status: "online",
        project: "SupportAI",
        message: "AI backend is running"
    });
});

app.post("/chat", async (req, res) => {

    try {

        const { message, history = [] } = req.body;

        if (!message || typeof message !== "string") {
            return res.status(400).json({
                error: "Please enter a valid message"
            });
        }

        if (message.length > 2000) {
            return res.status(400).json({
                error: "Message is too long"
            });
        }

        const prompt = `
You are SupportAI, an intelligent customer
support assistant.

Your responsibilities:
- Answer customer questions politely.
- Help with orders, refunds and complaints.
- Explain solutions clearly.
- Never invent order or payment information.
- If you cannot resolve an issue, recommend
  contacting a human support agent.

Conversation:
${history.slice(-8).map(item =>
    `${item.role}: ${String(item.text).slice(0, 2000)}`
).join("\n")}

Customer: ${message}
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt
        });

        res.json({
            success: true,
            reply: response.text
        });

    } catch (error) {

        console.error("Gemini error:", error.message);

        res.status(500).json({
            success: false,
            error: "AI service temporarily unavailable."
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("SupportAI backend running on port " + PORT);
});
