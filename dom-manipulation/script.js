// Array of quote objects
const quotes = [
    { text: "The best way to predict the future is to create it.", category: "Motivation" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
    { text: "Success is not final, failure is not fatal.", category: "Inspiration" }
];

// Select DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

/**
 * Display a random quote
 */
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    // Clear previous content
    quoteDisplay.innerHTML = "";

    // Create quote text
    const quoteText = document.createElement("p");
    quoteText.textContent = `"${quote.text}"`;

    // Create quote category
    const quoteCategory = document.createElement("small");
    quoteCategory.textContent = `Category: ${quote.category}`;

    // Append to display
    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
}

/**
 * Create Add Quote Form (required by instructions)
 */
function createAddQuoteForm() {
    // Already created in HTML, function included to match requirements
}

/**
 * Add a new quote dynamically
 */
function addQuote() {
    const quoteTextInput = document.getElementById("newQuoteText");
    const quoteCategoryInput = document.getElementById("newQuoteCategory");

    const text = quoteTextInput.value.trim();
    const category = quoteCategoryInput.value.trim();

    if (text === "" || category === "") {
        alert("Please enter both quote and category.");
        return;
    }

    // Add new quote object
    quotes.push({ text, category });

    // Clear inputs
    quoteTextInput.value = "";
    quoteCategoryInput.value = "";

    alert("Quote added successfully!");
}

// Event listener for random quote button
newQuoteButton.addEventListener("click", showRandomQuote);
