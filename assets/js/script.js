/* 
   This JSHint directive is used to specify the ECMAScript version for the code. 
   Setting it to ES6 (ECMAScript 2015) allows us to use ES6 features like 'const' and 'let'. 
   Without this directive, JSHint may produce an error when encountering ES6 syntax.
*/
/* jshint esversion: 6 */

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

import { getFeeCurrency, calculateFeeValue, handleCurrencySelectChange, handleCurrencyChosenChange } from './util.js'


// Define exchange rates for different countries
const exchangeRates = {
    Burundi: {
        BIF: 3074.00,
        EUR: 1.00,  // Example exchange rate for Euro to BIF
        USD: 1.00,  // Example exchange rate for USD to BIF
    },
    Rwanda: {
        RWF: 3120.00,
        EUR: 1.00,  // Example exchange rate for Euro to RWF
        USD: 1.00,  // Example exchange rate for USD to RWF
    },
    EUR: {
        EUR: 1.00,
        USD: 1.18,
    },
    USD: {
        EUR: 0.85,
        USD: 1.00,
    },
};

const sendAmountInput = document.getElementById('send-amount');
const receiveAmountInput = document.getElementById('receive-amount');
const exchangeRateElement = document.getElementById('exchange-rate');
const feePrice = document.getElementById('fee-price');
const price = document.getElementById('price');
const countrySelect = document.getElementById('countrySelect');
const currencySelect = document.getElementById('currency-selected');


// Add event listeners to elements
sendAmountInput.addEventListener('input', handleSendAmountInput);
sendAmountInput.addEventListener('input', function () {
    calculateFee();
});
sendAmountInput.addEventListener('focus', function () {
    this.value = ''; // Clear the input
});
currencySelect.addEventListener('change', handleCurrencySelectChange);
currencySelect.addEventListener('change', function () {
    calculateFee();
});
document.getElementById('currency-chosed').addEventListener('change', handleCurrencyChosenChange);
countrySelect.addEventListener('change', handleCountrySelectChange);


/**
 * Handles input changes in the "You send" input field.
 */
function handleSendAmountInput() {
    // Parse the input value to a float
    const sendAmount = parseFloat(this.value);
    // Calculate the receive amount
    calculateReceiveAmount(sendAmount, countrySelect.value, currencySelect.value);
    if (!countrySelect.value) {
        // Display an alert if no country is selected
        alert("Please choose a country before adding the 'You send' amount.");
    }
}


/**
 * Calculate the receive amount based on the send amount, selected country, and currency
 *   @param {*} sendAmount - Aamount to be sent
 * @param {*} selectedCountry Selected country code
 * @param {*} selectedCurrency - Selected currency code
 */
function calculateReceiveAmount(sendAmount, selectedCountry, selectedCurrency) {
    // Check if sendAmount is a valid number and if the selected country is in exchangeRates.
    if (!isNaN(sendAmount) && selectedCountry in exchangeRates) {
        // Get the exchange rate
        const exchangeRate = exchangeRates[selectedCountry][selectedCurrency];
        if (exchangeRate !== undefined) {
            // Calculate the fee
            calculateFee(sendAmount, selectedCurrency);
            // Render the results
            renderResults(sendAmount, exchangeRate, selectedCurrency);
        } else {
            //fallback
            // Set the currency to EUR if the exchange rate is undefined
            currencySelect.value = 'EUR';
            // Recalculate with EUR as the currency
            calculateReceiveAmount(sendAmount, selectedCountry, 'EUR');
        }
    }
}


/**
 * Render the results on the page based on the calculations
 *  @param {*} sendAmount - Amount to be sent
 * @param {*} exchangeRate - Exchange rate for the selected currency
 * @param {*} selectedCurrency - Selected currency code
 */
function renderResults(sendAmount, exchangeRate, selectedCurrency) {
    // Calculate the fee
    const fee = calculateFeeValue(sendAmount, selectedCurrency);
    // Get the fee currency
    const feeCurrency = getFeeCurrency();
    // Calculate the total amount to be received
    const totalAmount = sendAmount + fee;

    feePrice.textContent = `+ ${fee.toFixed(2)} ${feeCurrency}`;
    price.textContent = `${totalAmount.toFixed(2)} ${feeCurrency}`;
    exchangeRateElement.textContent = `1.00 ${selectedCurrency} = ${exchangeRate} ${feeCurrency}`;
    // Set the "They receive" input
    receiveAmountInput.value = (sendAmount * exchangeRate).toFixed(2);
}


/**
 * Handles change event when user selects a different country
 * Updates exchange rate information, available currency options & recalculates amounts
 */
function handleCountrySelectChange() {
    // Get selected country from the user input
    const selectedCountry = this.value;
    // Get selected currency for receiving
    const selectedCurrency = currencySelect.value;

    if (selectedCountry in exchangeRates) {
        // Check if exchange rate for the selected currency is defined
        const exchangeRate = exchangeRates[selectedCountry][selectedCurrency];
        if (exchangeRate !== undefined) {
            const exchangeRateElement = document.getElementById('exchange-rate');
            // Update displayed exchange rate
            exchangeRateElement.textContent = `1.00 ${selectedCurrency} = ${exchangeRate} (${selectedCountry})`;
        }

        // Update available currency options based on selected country
        updateAvailableCurrencyOptions(selectedCountry);
        // Get send amount as a numeric value
        const sendAmount = parseFloat(sendAmountInput.value);
        // Recalculate receive amount and related values
        calculateReceiveAmount(sendAmount, selectedCountry, selectedCurrency);
    }
}



/**
 * Calculates & updates fee amount based on selected currency & send amount
 * Also updates the displayed fee price on the page.
 */
function calculateFee() {
    // Parse user's input as a numeric value
    const sendAmount = parseFloat(sendAmountInput.value);
    // Get selected currency for calculating the fee
    const selectedCurrency = currencySelect.value;

    if (!isNaN(sendAmount)) {
        // Check if send amount is a valid number
        let feePercentage;

        if (selectedCurrency === 'EUR') {
            feePercentage = 0.07; // 7% fee for EUR
        } else if (selectedCurrency === 'USD') {
            feePercentage = 0.06; // 6% fee for USD
        } else if (selectedCurrency === 'BIF' || selectedCurrency === 'RWF') {
            feePercentage = 0.05; // 5% fee for BIF and RWF
        } else {
            // Fallback to a default fee percentage if the currency is not recognized
            feePercentage = 0.05;
        }

        // Calculate fee amount
        const fee = sendAmount * feePercentage;

        // Update & renders fee price
        feePrice.textContent = `+ ${fee.toFixed(2)} ${getFeeCurrency()} (${(feePercentage * 100).toFixed(2)} %)`;
    }
}


/**
 * Updates available currency options based on selected country & optionally the selected currency
 * It also sets & selected currency to first available currency if necessary
 *
 * @param {string} selectedCountry - Selected country
 * @param {string} selectedCurrency - Selected currency, if provided
 */
function updateAvailableCurrencyOptions(selectedCountry, selectedCurrency) {
    const sendAmount = parseFloat(sendAmountInput.value);

    // To execute only when a country and a valid amount are selected.
    // Otherwise, potential errors are shown until the user provides the required input
    if (selectedCountry && !isNaN(sendAmount)) {
        if (exchangeRates[selectedCountry]) {
            const availableCurrencies = Object.keys(exchangeRates[selectedCountry]);
            for (let i = 0; i < currencySelect.options.length; i++) {
                const option = currencySelect.options[i];
                if (availableCurrencies.includes(option.value)) {
                    option.style.display = 'block';
                } else {
                    option.style.display = 'none';
                }
            }

            // Set selected currency to the first available currency if it's not already selected
            if (!availableCurrencies.includes(selectedCurrency)) {
                currencySelect.value = availableCurrencies[0];
                selectedCurrency = availableCurrencies[0];
            }
        } else {
            console.error(`Exchange rates for ${selectedCountry} are not defined.`);
        }
    }
    // Calculate receive amount with updated selected country & currency
    calculateReceiveAmount(sendAmount, selectedCountry, selectedCurrency);
}

