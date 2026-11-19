const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors({
origin: [
"https://prajwals18pro.github.io"
]
}));

app.use(express.json({ limit: "20kb" }));

const ai = new GoogleGenAI({
apiKey: process.env.GEMINI_API_KEY
});

const SYSTEM_PROMPT = `
You are SupportAI, an advanced AI assistant similar
to a general-purpose conversational AI.

YOUR CAPABILITIES:

1. GENERAL KNOWLEDGE
   Answer questions about science, technology,
   history, education, geography and daily life.

2. PROGRAMMING
   Explain programming concepts, debug code,
   write programs and teach step by step.

3. WRITING
   Help with emails, essays, summaries,
   professional writing and creative writing.

4. CUSTOMER SUPPORT
   Help with orders, refunds, payments,
   delivery, accounts and technical problems.

5. REASONING
   Solve problems logically and explain answers.

6. CONVERSATION
   Remember previous conversation context.
   Understand follow-up questions.
   Avoid repeating information unnecessarily.

RESPONSE STYLE:

- Be intelligent, friendly and natural.
- Give accurate and useful answers.
- Explain complex topics simply.
- Use examples when helpful.
- Format answers clearly.
- Never pretend to know information you do not know.
- Never invent live information or current events.
- If current information is required and unavailable,
  clearly tell the user.

You are SupportAI.
`;

app.get("/", (req, res) => {
res.json({
status: "online",
project: "SupportAI",
version: "3.0"
});
});

app.post("/chat", async (req, res) => {
try {
const { message, history = [] } = req.body;

    if (typeof message !== "string" || !message.trim()) {
        return res.status(400).json({
            error: "Please enter a message."
        });
    }

    if (message.length > 2000) {
        return res.status(400).json({
            error: "Message is too long."
        });
    }

    const safeHistory = Array.isArray(history)
        ? history.slice(-8).filter(item =>
            item &&
            ["user", "assistant"].includes(item.role) &&
            typeof item.text === "string"
        )
        : [];

    const conversation = safeHistory.map(item =>
        `${item.role}: ${item.text.slice(0, 2000)}`
    ).join("\n");

    const prompt = `

${SYSTEM_PROMPT}

PREVIOUS CONVERSATION:
${conversation || "No previous conversation."}

CURRENT MESSAGE:
${message}

Answer the user directly and helpfully.
`;

    const result = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt
    });

    res.json({
        success: true,
        reply: result.text
    });

} catch (error) {
    console.error("SupportAI error:", error.message);

    res.status(503).json({
        success: false,
        error: "AI service temporarily unavailable."
    });
}

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
console.log("SupportAI v3.0 is running");
});
