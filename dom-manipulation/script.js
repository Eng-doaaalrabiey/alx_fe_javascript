// Quotes array
let quotes = [];

// Select DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

// ----------------- Local Storage Functions -----------------

// Load quotes from localStorage
function loadQuotes() {
    const storedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    quotes = storedQuotes;
}

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ----------------- Main Functionality -----------------

// Show a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    // Session storage: remember last shown quote
    sessionStorage.setItem("lastQuoteIndex", randomIndex);

    // Display quote
    quoteDisplay.innerHTML = "";
    const quoteText = document.createElement("p");
    quoteText.textContent = `"${quote.text}"`;

    const quoteCategory = document.createElement("small");
    quoteCategory.textContent = `Category: ${quote.category}`;

    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
}

// Add a new quote dynamically
function addQuote() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");

    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (!text || !category) {
        alert("Please enter both quote and category.");
        return;
    }

    const newQuoteObj = { text, category };
    quotes.push(newQuoteObj);

    // Save to localStorage
    saveQuotes();

    // Clear inputs
    textInput.value = "";
    categoryInput.value = "";

    alert("Quote added successfully!");
}

// ----------------- JSON Import/Export -----------------

// Export quotes as JSON file
function exportToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();

    URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (!Array.isArray(importedQuotes)) throw new Error();

            quotes.push(...importedQuotes);
            saveQuotes();

            alert("Quotes imported successfully!");
        } catch {
            alert("Invalid JSON file.");
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// ----------------- Event Listeners -----------------
newQuoteButton.addEventListener("click", showRandomQuote);

// ----------------- Initialize -----------------
loadQuotes();
