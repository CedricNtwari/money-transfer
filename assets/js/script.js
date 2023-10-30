/* 
   This JSHint directive is used to specify the ECMAScript version for the code. 
   Setting it to ES6 (ECMAScript 2015) allows us to use ES6 features like 'const' and 'let'. 
   Without this directive, JSHint may produce an error when encountering ES6 syntax.
   'async functions' is only available in ES8 (use 'esversion: 8').
*/
/* jshint esversion: 8 */

//                       --------- form tab navigation Code---------------

// Current tab is set to be the first tab (0)
var currentTab = 0;

// Initialize the accordion functionality
setupAccordion();

// Display the current tab
displayTab(currentTab);

/**
 * Display the specified tab of the form 
 * and update the navigation buttons.
 *
 * @param {number} i - The index of the tab to display.
 */
function displayTab(i) {
    const tabs = document.getElementsByClassName("tab");
    const prevBtn = document.getElementById("prevBtn");
    const continueBtn = document.getElementById("continueBtn");

    // Hide all tabs
    hideAllTabs(tabs);

    // Display the current tab
    showTab(tabs[i]);

    // Determine button labels and icons based on the tab index
    updateButtonLabels(prevBtn, continueBtn, i, tabs.length);
}

/**
 * Function to hide all tabs
 * @param {HTMLCollectionOf<Element>} tabs - All tabs in the form.
 */
function hideAllTabs(tabs) {
    for (const tab of tabs) {
        tab.style.display = "none";
    }
}

/**
 * Function to show a specific tab
 * @param {Element} tab - Tab to display.
 */
function showTab(tab) {
    tab.style.display = "block";
}

/**
 * Function to update button labels and icons
 * @param {Element} prevBtn - Previous button.
 * @param {Element} continueBtn - Continue button.
 * @param {number} i - Index of the tab to display.
 * @param {number} totalTabs - Total number of tabs.
 */
function updateButtonLabels(prevBtn, continueBtn, i, totalTabs) {
    const isFirstTab = i === 0;
    const isLastTab = i === totalTabs - 1;

    prevBtn.style.display = isFirstTab ? "none" : "inline";
    continueBtn.innerHTML = isLastTab ? "Submit <i class='fa-solid fa-paper-plane'></i>"
        : "Continue <i class='fa-solid fa-caret-right'></i>";
}


/**
 * Navigate to the next or previous tab in the form.
 *
 * @param {number} n - A positive number to move to the next tab, or a negative number to move to the previous tab.
 * @returns {boolean} - Returns `false` if any field in the current tab is invalid and prevents navigation.
 * 
 */
function continueButton(n) {
    const tab = document.getElementsByClassName("tab");

    // Hide the current tab:
    tab[currentTab].style.display = "none";

    // Increase or decrease the current tab by 1:
    currentTab += n;

    // if you have reached the end of the form
    if (currentTab >= tab.length) {
        // Submit the form
        const form = document.getElementById("booknow-form");
        if (form) {
            // Add an alert when the form is submitted
            alert('Thank you for your submission. We have received your request.');

            // Delay the page reload for a brief moment
            setTimeout(function () {
                window.location.reload();
            }, 10);
            //submit form
            form.submit();
        } else {
            console.error("Form element not found.");
        }
        return false;
    }

    // Otherwise, display the correct tab:
    displayTab(currentTab);
}

// Add event listeners for the buttons in your script
document.getElementById("prevBtn").addEventListener("click", function () {
    continueButton(-1);
});

document.getElementById("continueBtn").addEventListener("click", function () {

    // Check if the "You send" input is empty or 0
    const sendAmount = parseFloat(sendAmountInput.value);
    if (isNaN(sendAmount) || sendAmount <= 0) {
        alert("Please enter an amount in the 'You send' field.");
        return; // Prevent continuing if the input is invalid
    }

    // Continue with the form submission or navigation
    // This function navigates to the next tab as in your original code
    continueButton(1);
});


//          --------- Accordion Code ---------------

/**
 * Function to initialize the accordion functionality.
 * Adds click event listeners to accordion elements.
 */
function setupAccordion() {
    // Select all elements with the "accordion" class
    const accordions = document.getElementsByClassName('accordion');

    // Add a click event listener to each accordion element
    for (const accordion of accordions) {
        accordion.addEventListener('click', toggleAccordion);
    }
}

/**
 * Function to toggle an accordion 
 * @param {Event} event - The click event.
 */
function toggleAccordion(event) {
    event.preventDefault();
    // Toggle the "active" class on the accordion element
    this.classList.toggle('active');
    const panel = this.nextElementSibling;
    panel.classList.toggle('active');
    panel.style.display = panel.classList.contains('active') ? 'block' : 'none';
}


//             ------- Calculate receive amount Code ---------------

let isSendAmountCleared = false; // Flag to track if the send-amount has been cleared

// Define exchange rates for different countries
const exchangeRates = {
    Burundi: {
        EUR: null,
        USD: null,
    },
    Rwanda: {
        EUR: null,
        USD: null,
    },
};


/**
 * Fetch exchange rate data for a specific currency pair
 * @param {*} baseCurrency - base currency code (e.g., EUR).
 * @param {*} targetCurrency - target currency code (e.g., BIF)
 * @returns - exchange rate
 */
async function fetchExchangeRate(baseCurrency, targetCurrency) {
    const apiUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${baseCurrency.toLowerCase()}/${targetCurrency.toLowerCase()}.json`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        // Round the exchange rate value to the nearest whole number
        const exchangeRate = Math.round(data[targetCurrency.toLowerCase()]);
        return exchangeRate;
    } catch (error) {
        console.error(`Error fetching exchange rate (${baseCurrency} to ${targetCurrency}):`, error);
        return null;
    }
}


/**
 * update the exchangeRates object with specific exchange rate data
 */
async function updateExchangeRates() {
    // Fetch exchange rate data for EUR to BIF
    exchangeRates.Burundi.EUR = await fetchExchangeRate("eur", "bif");

    // Fetch exchange rate data for USD to BIF
    exchangeRates.Burundi.USD = await fetchExchangeRate("usd", "bif");

    // Fetch exchange rate data for EUR to RWF
    exchangeRates.Rwanda.EUR = await fetchExchangeRate("eur", "rwf");

    // Fetch exchange rate data for USD to RWF
    exchangeRates.Rwanda.USD = await fetchExchangeRate("usd", "rwf");
}

// Variable to track if exchange rate data has been loaded
let hasLoadedExchangeRateData = false;

// Fetch exchange rate data only on the first load if not already loaded
if (!hasLoadedExchangeRateData) {
    updateExchangeRates().then(function() {
        hasLoadedExchangeRateData = true;
        // Continue with calculations & UI updates
    });
}


const sendAmountInput = document.getElementById('send-amount');
const receiveAmountInput = document.getElementById('receive-amount');
const feePrice = document.getElementById('fee-price');
const price = document.getElementById('price');
const countrySelect = document.getElementById('countrySelect');
const currencySelect = document.getElementById('currency-chosed');
const receiveCurrencySelect = document.getElementById('currency-selected');
const exchangeRateElement = document.getElementById('exchange-rate');

// Add event listeners to elements
sendAmountInput.addEventListener('input', handleSendAmountInput);
sendAmountInput.addEventListener('focus', function () {
    if (!isSendAmountCleared) {
        this.value = ''; // Clear the input only if it hasn't been cleared already
        isSendAmountCleared = true; // Set the flag to true
    }
});
countrySelect.addEventListener('change', handleCountrySelectChange);
currencySelect.addEventListener('change', handleCurrencyChosenChange);
currencySelect.addEventListener('change', handleCurrencyChosenChange);

// Fetch exchange rate data and set exchange rates
async function initializePage() {
    await updateExchangeRates(); // Wait for exchange rates to be fetched

    // Set the default country to Burundi
    countrySelect.value = 'Burundi';

    // Initialize the page with default values
    handleCountrySelectChange();
}

// Initialize the page when the document is ready
document.addEventListener("DOMContentLoaded", function () {
    initializePage();
});



/**
 * Calculates & updates receive amount and related values based on the provided input
 *
 * @param {number} sendAmount - Aamount to send
 * @param {string} selectedCountry - Selected country
 * @param {string} selectedCurrency - Selected currency
 */
function calculateReceiveAmount(sendAmount, selectedCountry, selectedCurrency) {
    if (!isNaN(sendAmount) && selectedCountry in exchangeRates) {
        const exchangeRate = exchangeRates[selectedCountry][selectedCurrency];

        if (exchangeRate !== null &&exchangeRate !== undefined) {
            let receiveCurrency;

            if (selectedCountry === 'Burundi') {
                receiveCurrency = 'BIF';
                receiveCurrencySelect.value = 'BIF'; // Update the "They receive" currency dropdown
            } else if (selectedCountry === 'Rwanda') {
                receiveCurrency = 'RWF';
                receiveCurrencySelect.value = 'RWF'; // Update the "They receive" currency dropdown
            } else {
                receiveCurrency = selectedCurrency;
            }

            const fee = sendAmount * 0.05;
            const feeCurrency = selectedCurrency;

            const totalAmount = sendAmount + fee;

            feePrice.textContent = `+ ${fee.toFixed(2)} ${feeCurrency} (5%)`;
            price.textContent = `${totalAmount.toFixed(2)} ${selectedCurrency}`;

            exchangeRateElement.textContent = `1.00 ${selectedCurrency} = ${exchangeRate} ${receiveCurrency}`;
            receiveAmountInput.value = (sendAmount * exchangeRate).toFixed(2);
        } else {
            console.error(`Exchange rates for ${selectedCountry} and ${selectedCurrency} are not defined.`);
        }
    }
}


/**
 * Event handler for the "change" event of the country select input
 */
function handleCountrySelectChange() {
    const selectedCountry = document.getElementById('countrySelect').value;

    // Display the selected country's currency symbol
    const countryCurrencySymbol = getCountryCurrencySymbol(selectedCountry);
    const receiveAmountLabel = document.querySelector('label[for="receive-amount"]');
    receiveAmountLabel.textContent = `They receive (${countryCurrencySymbol}):`;

    // Update the "exchange rate" field immediately
    const selectedCurrency = document.getElementById('currency-chosed').value;
    calculateReceiveAmount(0, selectedCountry, selectedCurrency);
}


/**
 * Event handler for the "input" event of the send-amount input
 */
function handleSendAmountInput() {
    const sendAmount = parseFloat(this.value);
    const selectedCountry = countrySelect.value;
    const selectedCurrency = currencySelect.value;
    if (isNaN(sendAmount)) {
        // Handle empty or invalid input
        receiveAmountInput.value = '0.00';
        feePrice.textContent = '+ 0.00 ' + selectedCurrency + ' (5%)';
        price.textContent = '0.00 ' + selectedCurrency;
        this.placeholder = '0.00'; // Add the placeholder value
    } else {
        calculateReceiveAmount(sendAmount, selectedCountry, selectedCurrency);
    }
}


/**
 * Event handler for the "change" event of the currency select input
 */
function handleCurrencyChosenChange() {
    const sendAmount = parseFloat(sendAmountInput.value);
    const selectedCountry = countrySelect.value;
    const selectedCurrency = currencySelect.value;
    calculateReceiveAmount(sendAmount, selectedCountry, selectedCurrency);
}


/**
 * Get the currency symbol for a selected country
 *
 * @param {string} selectedCountry - Selected country
 * @returns {string} - Currency symbol
 */
function getCountryCurrencySymbol(selectedCountry) {
    switch (selectedCountry) {
        case 'Burundi':
            return 'BIF';
        case 'Rwanda':
            return 'RWF';
        default:
            return '';
    }
}