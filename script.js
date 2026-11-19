// =====================================
// SUPPORTAI - MAIN JAVASCRIPT
// =====================================

const API_URL = "https://supportai-chatbot.onrender.com/chat";

let chatHistory = [];
let isSending = false;

// Get HTML elements
const chatWindow = document.getElementById("chatWindow");
const messagesContainer = document.getElementById("messages");
const userInput = document.getElementById("userInput");

// =====================================
// OPEN CHAT
// =====================================

function openChat() {
    if (chatWindow) {
        chatWindow.style.display = "flex";
        chatWindow.classList.add("active");
    }

    if (userInput) {
        setTimeout(() => userInput.focus(), 200);
    }
}

// =====================================
// CLOSE CHAT
// =====================================

function closeChat() {
    if (chatWindow) {
        chatWindow.classList.remove("active");
        chatWindow.style.display = "none";
    }
}

// =====================================
// ADD MESSAGE
// =====================================

function addMessage(text, sender) {

    if (!messagesContainer) return;

    const message = document.createElement("div");

    message.className =
        sender === "user"
            ? "message user-message"
            : "message bot-message";

    const content = document.createElement("div");

    content.className = "message-content";
    content.textContent = text;

    message.appendChild(content);
    messagesContainer.appendChild(message);

    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;
}

// =====================================
// TYPING INDICATOR
// =====================================

function showTyping() {

    if (!messagesContainer) return;

    const typing = document.createElement("div");

    typing.id = "typingIndicator";
    typing.className = "message bot-message";

    typing.textContent = "SupportAI is typing...";

    messagesContainer.appendChild(typing);

    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;
}

function hideTyping() {

    const typing =
        document.getElementById("typingIndicator");

    if (typing) {
        typing.remove();
    }
}

// =====================================
// GEMINI AI RESPONSE
// =====================================

async function getAIResponse(message) {

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                message: message,

                history: chatHistory.slice(-8)

            })

        });

        const data = await response.json();

        if (!response.ok || !data.reply) {

            throw new Error(
                data.error || "AI response unavailable"
            );

        }

        return data.reply;

    } catch (error) {

        console.error("SupportAI Error:", error);

        throw error;

    }

}

// =====================================
// SEND MESSAGE
// =====================================

async function sendMessage() {

    if (!userInput || isSending) return;

    const message = userInput.value.trim();

    if (!message) return;

    if (message.length > 2000) {

        addMessage(
            "Please keep your message under 2000 characters.",
            "assistant"
        );

        return;
    }

    isSending = true;

    userInput.value = "";

    addMessage(message, "user");

    chatHistory.push({

        role: "user",
        text: message

    });

    showTyping();

    try {

        const answer = await getAIResponse(message);

        hideTyping();

        addMessage(answer, "assistant");

        chatHistory.push({

            role: "assistant",
            text: answer

        });

        chatHistory = chatHistory.slice(-10);

    } catch (error) {

        hideTyping();

        addMessage(
            "I'm having trouble connecting right now. Please try again in a moment.",
            "assistant"
        );

    } finally {

        isSending = false;

        if (userInput) {
            userInput.focus();
        }

    }

}

// =====================================
// FAQ BUTTONS
// =====================================

function askFAQ(question) {

    if (!userInput) return;

    userInput.value = question;

    openChat();

    sendMessage();

}

// =====================================
// ADMIN PANEL
// =====================================

function toggleAdmin() {

    const panel = document.getElementById("adminPanel");

    if (!panel) return;

    panel.style.display =
        panel.style.display === "none"
            ? "block"
            : "none";

}

function closeAdmin() {

    const panel = document.getElementById("adminPanel");

    if (panel) {
        panel.style.display = "none";
    }

}

// =====================================
// BUTTON EVENT CONNECTIONS
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    // Send button
    const sendButton = document.getElementById("sendBtn");

    if (sendButton) {

        sendButton.addEventListener("click", function (event) {

            event.preventDefault();

            sendMessage();

        });

    }

    // Enter key
    if (userInput) {

        userInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter" && !event.shiftKey) {

                event.preventDefault();

                sendMessage();

            }

        });

    }

    // FAQ buttons
    document.querySelectorAll("[data-question]").forEach(button => {

        button.addEventListener("click", function () {

            askFAQ(this.dataset.question);

        });

    });

    // Open chat buttons
    document.querySelectorAll("[data-open-chat]").forEach(button => {

        button.addEventListener("click", openChat);

    });

    // Close chat buttons
    document.querySelectorAll("[data-close-chat]").forEach(button => {

        button.addEventListener("click", closeChat);

    });

});

// =====================================
// MAKE FUNCTIONS AVAILABLE TO HTML
// =====================================

window.openChat = openChat;
window.closeChat = closeChat;
window.sendMessage = sendMessage;
window.addMessage = addMessage;
window.getAIResponse = getAIResponse;
window.askFAQ = askFAQ;
window.toggleAdmin = toggleAdmin;
window.closeAdmin = closeAdmin;
