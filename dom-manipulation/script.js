// ----------------- Quotes Array -----------------
let quotes = [];

// ----------------- DOM Elements -----------------
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// ----------------- Local Storage Functions -----------------
function loadQuotes() {
    const storedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    quotes = storedQuotes;
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

    quoteDisplay.innerHTML = "";
    const quoteText = document.createElement("p");
    quoteText.textContent = `"${quote.text}"`;

    const quoteCategory = document.createElement("small");
    quoteCategory.textContent = `Category: ${quote.category}`;

    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
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

    const newQuoteObj = { text, category };
    quotes.push(newQuoteObj);
    saveQuotes();

    // Update categories dropdown
    populateCategories();

    // Clear inputs
    textInput.value = "";
    categoryInput.value = "";

    alert("Quote added successfully!");
}

// ----------------- Category Filtering -----------------
function populateCategories() {
    // Get unique categories
    const categories = [...new Set(quotes.map(q => q.category))];

    // Clear existing options except 'all'
    const selected = categoryFilter.value || "all";
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });

    // Restore last selected filter
    const lastFilter = localStorage.getItem("lastCategory") || selected;
    categoryFilter.value = lastFilter;
}

// Filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem("lastCategory", selectedCategory);

    const filteredQuotes = selectedCategory === "all"
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);

    quoteDisplay.innerHTML = "";

    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes in this category.";
        return;
    }

    filteredQuotes.forEach(quote => {
        const quoteText = document.createElement("p");
        quoteText.textContent = `"${quote.text}"`;

        const quoteCategory = document.createElement("small");
        quoteCategory.textContent = `Category: ${quote.category}`;

        quoteDisplay.appendChild(quoteText);
        quoteDisplay.appendChild(quoteCategory);
    });
}

// ----------------- JSON Import/Export -----------------
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

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (!Array.isArray(importedQuotes)) throw new Error();

            quotes.push(...importedQuotes);
            saveQuotes();
            populateCategories();
            filterQuotes();

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
populateCategories();
filterQuotes();
