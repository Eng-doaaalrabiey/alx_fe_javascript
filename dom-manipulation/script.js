// ----------------- Quotes Array -----------------
let quotes = [];

// ----------------- DOM Elements -----------------
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

// ----------------- Local Storage -----------------
function loadQuotes() {
    quotes = JSON.parse(localStorage.getItem("quotes")) || [];
}

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ----------------- Display Functions -----------------
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    sessionStorage.setItem("lastQuoteIndex", randomIndex);

    quoteDisplay.innerHTML = `"${quote.text}" <br> <small>Category: ${quote.category}</small>`;
}

// ----------------- Add Quote -----------------
function addQuote() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");

    const text = textInput.value.trim();
    const category = categoryInput.value.trim();
    if (!text || !category) {
        alert("Please enter both quote and category.");
        return;
    }

    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    filterQuotes();

    postQuoteToServer(newQuote); // POST to server

    textInput.value = "";
    categoryInput.value = "";
}

// ----------------- Category Filter -----------------
function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
    const last = localStorage.getItem("lastCategory") || "all";
    categoryFilter.value = last;
}

function filterQuotes() {
    const selected = categoryFilter.value;
    localStorage.setItem("lastCategory", selected);
    const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);

    quoteDisplay.innerHTML = "";
    filtered.forEach(q => {
        const p = document.createElement("p");
        p.innerHTML = `"${q.text}" <br> <small>Category: ${q.category}</small>`;
        quoteDisplay.appendChild(p);
    });
}

// ----------------- JSON Import/Export -----------------
function exportToJson() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const imported = JSON.parse(e.target.result);
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
    };
    reader.readAsText(event.target.files[0]);
}

// ----------------- Server Sync Functions -----------------
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Fetch quotes from server
async function fetchQuotesFromServer() {
    try {
        const res = await fetch(SERVER_URL);
        const data = await res.json();
        const serverQuotes = data.slice(0, 5).map(item => ({ text: item.title, category: "Server" }));

        // Conflict resolution: server data takes priority
        quotes = serverQuotes;
        saveQuotes();
        populateCategories();
        filterQuotes();

        notification.textContent = "Quotes updated from server!";
        setTimeout(() => { notification.textContent = ""; }, 5000);
    } catch(err) {
        console.error("Error fetching server quotes:", err);
    }
}

// Post new quote to server
async function postQuoteToServer(quote) {
    try {
        await fetch(SERVER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quote)
        });
    } catch(err) {
        console.error("Error posting quote to server:", err);
    }
}

// Sync quotes periodically
function syncQuotes() {
    fetchQuotesFromServer();
}
setInterval(syncQuotes, 30000);

// ----------------- Event Listeners -----------------
newQuoteButton.addEventListener("click", showRandomQuote);

// ----------------- Initialize -----------------
loadQuotes();
populateCategories();
filterQuotes();
