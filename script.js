// SUPPORTAI - MAIN JAVASCRIPT

let tickets = JSON.parse(localStorage.getItem("supportTickets")) || [];

const faqs = [
    {
        question: "What is your refund policy?",
        keywords: ["refund", "money back", "return"],
        answer: "Our refund policy allows eligible customers to request a refund within 7 days of purchase."
    },
    {
        question: "How can I track my order?",
        keywords: ["track", "order", "delivery", "shipping"],
        answer: "You can track your order using your order ID through our order tracking service."
    },
    {
        question: "How can I contact support?",
        keywords: ["contact", "support", "help", "agent"],
        answer: "You can contact our support team through this chatbot or submit a support ticket."
    },
    {
        question: "What are your working hours?",
        keywords: ["hours", "timing", "open", "available"],
        answer: "Our automated support assistant is available 24/7."
    },
    {
        question: "How do I reset my password?",
        keywords: ["password", "reset", "login", "forgot"],
        answer: "Use the Forgot Password option on the login page to reset your password."
    },
    {
        question: "How can I cancel my order?",
        keywords: ["cancel", "cancellation"],
        answer: "Please submit your order ID through a support ticket so our team can assist you."
    }
];

// FAQ DISPLAY

function loadFAQs() {
    const list = document.getElementById("faq-list");

    list.innerHTML = "";

    faqs.forEach(faq => {
        list.innerHTML += `
            <div class="faq-item">
                <h3>${faq.question}</h3>
                <p>${faq.answer}</p>
            </div>
        `;
    });
}

// OPEN CHAT

function openChat() {
    document.getElementById("chatWindow").style.display = "flex";
}

// CLOSE CHAT

function closeChat() {
    document.getElementById("chatWindow").style.display = "none";
}

// DISPLAY MESSAGE

function addMessage(message, type) {
    const messages = document.getElementById("messages");

    const div = document.createElement("div");
    div.className = type;
    div.textContent = message;

    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

// CREATE SUPPORT TICKET

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

// CHATBOT RESPONSE ENGINE

function getResponse(message) {

    const text = message.toLowerCase();

    if (
        text.includes("complaint") ||
        text.includes("problem") ||
        text.includes("issue") ||
        text.includes("not working") ||
        text.includes("damaged") ||
        text.includes("wrong item")
    ) {

        const ticket = createTicket(message);

        return "I'm sorry you're facing this issue. I've created a support ticket for you. Your ticket ID is " + ticket.id + ". Our support team can review your request.";
    }

    for (const faq of faqs) {

        const match = faq.keywords.some(keyword =>
            text.includes(keyword)
        );

        if (match) {
            return faq.answer;
        }
    }

    if (text.includes("hello") || text.includes("hi")) {
        return "Hello! 👋 Welcome to SupportAI. How can I help you today?";
    }

    if (text.includes("thank")) {
        return "You're welcome! 😊 I'm always happy to help.";
    }

    if (text.includes("bye")) {
        return "Goodbye! Have a wonderful day.";
    }

    return "I couldn't find an exact answer to your question. Please describe your issue using the word 'complaint' or 'problem' so I can create a support ticket for you.";
}

// SEND CHAT MESSAGE

function sendMessage() {

    const input = document.getElementById("userInput");

    const message = input.value.trim();

    if (!message) return;

    addMessage(message, "user-message");

    input.value = "";

    setTimeout(() => {

        const response = getResponse(message);

        addMessage(response, "bot-message");

    }, 500);
}

// ADMIN DASHBOARD

function showAdmin() {

    document.getElementById("adminPanel").style.display = "block";

    document.getElementById("adminPanel").scrollIntoView({
        behavior: "smooth"
    });

    document.querySelector(".hero").style.display = "none";
    document.querySelector(".features").style.display = "none";
    document.querySelector(".faq").style.display = "none";

    displayTickets();
}

function hideAdmin() {

    document.getElementById("adminPanel").style.display = "none";

    document.querySelector(".hero").style.display = "flex";
    document.querySelector(".features").style.display = "block";
    document.querySelector(".faq").style.display = "block";
}

// DISPLAY CUSTOMER TICKETS

function displayTickets() {

    const list = document.getElementById("ticketList");

    list.innerHTML = "";

    if (tickets.length === 0) {
        list.innerHTML = "<p>No customer queries received yet.</p>";
        return;
    }

    tickets.forEach((ticket, index) => {

        const card = document.createElement("div");

        card.className = "faq-item";

        const heading = document.createElement("h3");
        heading.textContent = "Ticket: " + ticket.id;

        const query = document.createElement("p");
        query.textContent = "Customer Query: " + ticket.query;

        const date = document.createElement("p");
        date.textContent = "Date: " + ticket.date;

        const status = document.createElement("p");
        status.textContent = "Status: " + ticket.status;

        const button = document.createElement("button");
        button.textContent = "Resolve Ticket";

        button.onclick = function() {

            tickets[index].status = "Resolved";

            localStorage.setItem(
                "supportTickets",
                JSON.stringify(tickets)
            );

            displayTickets();
        };

        card.appendChild(heading);
        card.appendChild(query);
        card.appendChild(date);
        card.appendChild(status);
        card.appendChild(button);

        list.appendChild(card);

    });
}

// INITIALIZE WEBSITE

loadFAQs();
