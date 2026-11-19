// SUPPORTAI - ADVANCED SYSTEM

let tickets = JSON.parse(
    localStorage.getItem("supportTickets")
) || [];

const faqs = [
{
question: "What is your refund policy?",
keywords: ["refund", "money back", "return"],
answer: "Eligible customers can request a refund within 7 days of purchase."
},
{
question: "How can I track my order?",
keywords: ["track", "order", "delivery", "shipping"],
answer: "You can track your order using your order ID."
},
{
question: "How can I contact support?",
keywords: ["contact", "support", "help", "agent"],
answer: "You can contact our support team through this chatbot."
},
{
question: "What are your working hours?",
keywords: ["hours", "timing", "available"],
answer: "Our automated support assistant is available 24/7."
},
{
question: "How do I reset my password?",
keywords: ["password", "reset", "login", "forgot"],
answer: "Use the Forgot Password option to reset your password."
},
{
question: "How can I cancel my order?",
keywords: ["cancel", "cancellation"],
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

// CHAT SYSTEM

function openChat() {
    document.getElementById("chatWindow").style.display = "flex";
}

function closeChat() {
    document.getElementById("chatWindow").style.display = "none";
}

function addMessage(message, type) {
    const messages = document.getElementById("messages");

    const div = document.createElement("div");
    div.className = type;
    div.textContent = message;

    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
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

    saveTickets();

    return ticket;
}

function saveTickets() {
    localStorage.setItem(
        "supportTickets",
        JSON.stringify(tickets)
    );
}

// CHATBOT ENGINE

function getResponse(message) {

    const text = message.toLowerCase();

    if (
        ["complaint", "problem", "issue",
         "not working", "damaged", "wrong item"]
        .some(word => text.includes(word))
    ) {
        const ticket = createTicket(message);

        return "I'm sorry about this issue! Your support ticket has been generated. Ticket ID: " +
        ticket.id + ". Our support team can review your request.";
    }

    for (const faq of faqs) {

        if (faq.keywords.some(word => text.includes(word))) {
            return faq.answer;
        }
    }

    if (text.includes("hello") || text.includes("hi")) {
        return "Hello! Welcome to SupportAI. How can I help you?";
    }

    if (text.includes("thank")) {
        return "You're welcome! Happy to help.";
    }

    if (text.includes("bye")) {
        return "Goodbye! Have a wonderful day.";
    }

    return "I couldn't find an exact answer. Please describe your problem or complaint and I can create a support ticket.";
}

// SEND MESSAGE

function sendMessage() {

    const input = document.getElementById("userInput");
    const message = input.value.trim();

    if (!message) return;

    addMessage(message, "user-message");

    input.value = "";

    setTimeout(() => {
        addMessage(getResponse(message), "bot-message");
    }, 500);
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

// DASHBOARD STATISTICS

function displayTickets() {

    const list = document.getElementById("ticketList");

    list.innerHTML = "";

    const total = tickets.length;

    const open = tickets.filter(t => t.status === "Open").length;

    const progress = tickets.filter(
        t => t.status === "In Progress"
    ).length;

    const resolved = tickets.filter(
        t => t.status === "Resolved"
    ).length;

    const rate = total === 0
        ? 0
        : Math.round((resolved / total) * 100);

    // STATISTICS

    const dashboard = document.createElement("div");

    dashboard.className = "feature-grid";

    const stats = [
        ["📊", "Total Tickets", total],
        ["🟠", "Open Tickets", open],
        ["🔵", "In Progress", progress],
        ["🟢", "Resolved", resolved],
        ["📈", "Resolution Rate", rate + "%"]
    ];

    stats.forEach(stat => {

        const card = document.createElement("div");
        card.className = "feature";

        const icon = document.createElement("span");
        icon.textContent = stat[0];

        const title = document.createElement("h3");
        title.textContent = stat[1];

        const value = document.createElement("h2");
        value.textContent = stat[2];

        card.append(icon, title, value);
        dashboard.appendChild(card);

    });

    list.appendChild(dashboard);

    // TICKET HEADING

    const heading = document.createElement("h2");
    heading.textContent = "Customer Support Tickets";
    heading.style.margin = "30px 0 20px";

    list.appendChild(heading);

    if (total === 0) {

        const empty = document.createElement("p");
        empty.textContent = "No customer tickets received yet.";

        list.appendChild(empty);
        return;
    }

    // INDIVIDUAL TICKETS

    tickets.forEach(ticket => {

        const card = document.createElement("div");
        card.className = "faq-item";

        const title = document.createElement("h3");
        title.textContent = "Ticket: " + ticket.id;

        const query = document.createElement("p");
        query.textContent = "Customer Query: " + ticket.query;

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

            if (ticket.status === value) {
                option.selected = true;
            }

            select.appendChild(option);

        });

        select.onchange = function() {

            ticket.status = select.value;

            saveTickets();
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
