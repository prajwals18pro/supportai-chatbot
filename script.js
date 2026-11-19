const API_URL = "https://supportai-chatbot.onrender.com/chat";

let chatHistory = [];
let isSending = false;

const chatWindow = document.getElementById("chatWindow");
const messages = document.getElementById("messages");
const userInput = document.getElementById("userInput");

function openChat() {
chatWindow.style.display = "flex";
userInput.focus();
}

function closeChat() {
chatWindow.style.display = "none";
}

function addMessage(text, sender) {
const div = document.createElement("div");
div.className = sender === "user"
? "message user-message"
: "message bot-message";

div.textContent = text;
messages.appendChild(div);
messages.scrollTop = messages.scrollHeight;

}

function askFAQ(question) {
openChat();
userInput.value = question;
sendMessage();
}

async function sendMessage() {
const message = userInput.value.trim();

if (!message || isSending) return;

if (message.length > 2000) {
    addMessage("Please keep your message under 2000 characters.", "assistant");
    return;
}

isSending = true;
userInput.value = "";
addMessage(message, "user");

const previousHistory = chatHistory.slice(-8);

chatHistory.push({
    role: "user",
    text: message
});

const typing = document.createElement("div");
typing.className = "message bot-message";
typing.id = "typing";
typing.textContent = "SupportAI is thinking...";
messages.appendChild(typing);
messages.scrollTop = messages.scrollHeight;

try {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: message,
            history: previousHistory
        })
    });

    const data = await response.json();

    if (!response.ok || !data.reply) {
        throw new Error(data.error || "AI service unavailable");
    }

    typing.remove();
    addMessage(data.reply, "assistant");

    chatHistory.push({
        role: "assistant",
        text: data.reply
    });

    chatHistory = chatHistory.slice(-10);

} catch (error) {
    typing.remove();
    console.error(error);
    addMessage(
        "Sorry! I'm temporarily unable to connect. Please try again.",
        "assistant"
    );
} finally {
    isSending = false;
    userInput.focus();
}

}

document.getElementById("sendBtn").addEventListener("click", sendMessage);

userInput.addEventListener("keydown", function(event) {
if (event.key === "Enter") {
event.preventDefault();
sendMessage();
}
});
