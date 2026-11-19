// SUPPORTAI - GEMINI AI INTEGRATION

const API_URL = "https://supportai-chatbot.onrender.com/chat";

let tickets = JSON.parse(
    localStorage.getItem("supportTickets") || "[]"
);

let chatHistory = [];

const faqs = [
{
    question: "What is your refund policy?",
    answer: "Eligible customers can request a refund within 7 days."
},
{
    question: "How can I track my order?",
    answer: "You can track your order using your order ID."
},
{
    question: "How can I contact support?",
    answer: "You can contact our support team through this chatbot."
},
{
    question: "What are your working hours?",
    answer: "Our automated support assistant is available 24/7."
},
{
    question: "How do I reset my password?",
    answer: "Use the Forgot Password option to reset your password."
},
{
    question: "How can I cancel my order?",
    answer: "Submit a support ticket with your order ID."
}
];

// FAQ SYSTEM

function loadFAQs() {

    const list = document.getElementById("faq-list");

    list.innerHTML = "";

    faqs.forEach(faq => {

        const item = document.createElement("div");
        item.className = "faq-item";

        const title = document.createElement("h3");
        title.textContent = faq.question;

        const answer = document.createElement("p");
        answer.textContent = faq.answer;

        item.append(title, answer);
        list.appendChild(item);

    });
}

// CHAT WINDOW

function openChat() {
    document.getElementById("chatWindow").style.display = "flex";
}

function closeChat() {
    document.getElementById("chatWindow").style.display = "none";
}

// DISPLAY MESSAGES

function addMessage(message, type) {

    const messages = document.getElementById("messages");

    const div = document.createElement("div");

    div.className = type;
    div.textContent = message;

    messages.appendChild(div);

    messages.scrollTop = messages.scrollHeight;

    return div;
}

// TICKET GENERATION

function createTicket(message) {

    const ticket = {

        id: "SAI-" + Date.now().toString().slice(-8),

        query: message,

        status: "Open",

        date: new Date().toLocaleString()

    };

    tickets.push(ticket);

    localStorage.setItem(
        "supportTickets",
        JSON.stringify(tickets)
    );

    return ticket;
}

// COMPLAINT DETECTION

// ADVANCED COMPLAINT DETECTION

function isComplaint(message) {

    const text = message.toLowerCase();

    const keywords = [
        "complaint",
        "problem",
        "issue",
        "not working",
        "damaged",
        "wrong item",
        "broken",
        "missing",
        "not delivered",
        "late delivery",
        "delayed",
        "not received",
        "never received",
        "refund",
        "cancel my order",
        "payment failed",
        "charged twice",
        "defective",
        "poor service",
        "unhappy",
        "unsatisfied",
        "return my order",
        "lost package"
    ];

    return keywords.some(word => text.includes(word));
}

    return words.some(word =>
        message.toLowerCase().includes(word)
    );
}

// GEMINI AI CHAT

async function getAIResponse(message) {

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

    if (!response.ok) {
        throw new Error("AI server error");
    }

    const data = await response.json();

    if (!data.success || !data.reply) {
        throw new Error("Invalid AI response");
    }

    return data.reply;
}

// SEND MESSAGE

async function sendMessage() {

    const input = document.getElementById("userInput");

    const message = input.value.trim();

    if (!message) return;

    addMessage(message, "user-message");

    input.value = "";

    const loading = addMessage(
        "SupportAI is thinking...",
        "bot-message"
    );

    let ticket = null;

    if (isComplaint(message)) {

        ticket = createTicket(message);

    }

    try {

        const answer = await getAIResponse(message);

        loading.textContent = answer;

        if (ticket) {

            loading.textContent +=
                "\n\nYour support ticket ID: " +
                ticket.id;

        }

        chatHistory.push(
            { role: "user", text: message },
            { role: "assistant", text: answer }
        );

    } catch (error) {

        console.error(error);

        loading.textContent =
            "Sorry! Our AI assistant is temporarily unavailable. Please try again shortly.";

        if (ticket) {

            loading.textContent +=
                "\nYour support ticket ID: " + ticket.id;

        }

    }

}

// ADMIN DASHBOARD

function showAdmin() {

    document.getElementById("adminPanel").style.display = "block";

    document.querySelector(".hero").style.display = "none";

    document.querySelector(".features").style.display = "none";

    document.querySelector(".faq").style.display = "none";

    displayTickets();

    document.getElementById("adminPanel").scrollIntoView({
        behavior: "smooth"
    });

}

function hideAdmin() {

    document.getElementById("adminPanel").style.display = "none";

    document.querySelector(".hero").style.display = "flex";

    document.querySelector(".features").style.display = "block";

    document.querySelector(".faq").style.display = "block";

}

// ADMIN STATISTICS

function displayTickets() {

    const list = document.getElementById("ticketList");

    list.innerHTML = "";

    const total = tickets.length;

    const open = tickets.filter(
        t => t.status === "Open"
    ).length;

    const progress = tickets.filter(
        t => t.status === "In Progress"
    ).length;

    const resolved = tickets.filter(
        t => t.status === "Resolved"
    ).length;

    const rate = total
        ? Math.round((resolved / total) * 100)
        : 0;

    const stats = [
        ["📊 Total Tickets", total],
        ["🟠 Open Tickets", open],
        ["🔵 In Progress", progress],
        ["🟢 Resolved", resolved],
        ["📈 Resolution Rate", rate + "%"]
    ];

    const dashboard = document.createElement("div");

    dashboard.className = "feature-grid";

    stats.forEach(stat => {

        const card = document.createElement("div");

        card.className = "feature";

        const title = document.createElement("h3");

        title.textContent = stat[0];

        const value = document.createElement("h2");

        value.textContent = stat[1];

        card.append(title, value);

        dashboard.appendChild(card);

    });

    list.appendChild(dashboard);

    const heading = document.createElement("h2");

    heading.textContent = "Customer Support Tickets";

    heading.style.margin = "30px 0";

    list.appendChild(heading);

    if (!total) {

        const empty = document.createElement("p");

        empty.textContent = "No customer tickets received yet.";

        list.appendChild(empty);

        return;

    }

    tickets.forEach((ticket, index) => {

        const card = document.createElement("div");

        card.className = "faq-item";

        const title = document.createElement("h3");

        title.textContent = "Ticket: " + ticket.id;

        const query = document.createElement("p");

        query.textContent = "Query: " + ticket.query;

        const date = document.createElement("p");

        date.textContent = "Date: " + ticket.date;

        const status = document.createElement("p");

        status.textContent = "Status: " + ticket.status;

        const select = document.createElement("select");

        select.style.padding = "12px";

        select.style.marginTop = "15px";

        select.style.background = "#252d48";

        select.style.color = "white";

        select.style.borderRadius = "8px";

        ["Open", "In Progress", "Resolved"].forEach(value => {

            const option = document.createElement("option");

            option.value = value;

            option.textContent = value;

            option.selected = ticket.status === value;

            select.appendChild(option);

        });

        select.onchange = function() {

            tickets[index].status = select.value;

            localStorage.setItem(
                "supportTickets",
                JSON.stringify(tickets)
            );

            displayTickets();

        };

        card.append(
            title,
            query,
            date,
            status,
            select
        );

        list.appendChild(card);

    });

}

// INITIALIZE

loadFAQs();
