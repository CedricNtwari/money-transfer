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
 * @param {Element} tab - The tab to display.
 */
function showTab(tab) {
    tab.style.display = "block";
}

/**
 * Function to update button labels and icons
 * @param {Element} prevBtn - The Previous button.
 * @param {Element} continueBtn - The Continue button.
 * @param {number} i - The index of the tab to display.
 * @param {number} totalTabs - The total number of tabs.
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


function calculateReceiveAmount(sendAmount, selectedCountry, selectedCurrency) {
    if (!isNaN(sendAmount) && selectedCountry in exchangeRates) {
        const exchangeRate = exchangeRates[selectedCountry][selectedCurrency];
        if (exchangeRate !== undefined) {
            calculateFee(sendAmount, selectedCurrency);
            renderResults(sendAmount, exchangeRate, selectedCurrency);
        } else {
            currencySelect.value = 'EUR';
            calculateReceiveAmount(sendAmount, selectedCountry, 'EUR');
        }
    }
}

function renderResults(sendAmount, exchangeRate, selectedCurrency) {
    // Your code for updating the display element
    const fee = calculateFeeValue(sendAmount, selectedCurrency);
    const feeCurrency = getFeeCurrency();
    const totalAmount = sendAmount + fee;

    feePrice.textContent = `+ ${fee.toFixed(2)} ${feeCurrency}`;
    price.textContent = `${totalAmount.toFixed(2)} ${feeCurrency}`;
    exchangeRateElement.textContent = `1.00 ${selectedCurrency} = ${exchangeRate} ${feeCurrency}`;
    receiveAmountInput.value = (sendAmount * exchangeRate).toFixed(2);
}


// ---- Helper Functions --------


function calculateFeeValue(sendAmount, selectedCurrency) {
    const feePercentage = getFeePercentage(selectedCurrency);
    return sendAmount * feePercentage;
}

function getFeePercentage(selectedCurrency) {
    // Your code for getting fee percentage
    if (selectedCurrency === 'EUR') {
        return 0.07; // 7% fee for EUR
    } else if (selectedCurrency === 'USD') {
        return 0.06; // 6% fee for USD
    } else if (selectedCurrency === 'BIF' || selectedCurrency === 'RWF') {
        return 0.05; // 5% fee for BIF and RWF
    } else {
        // Fallback to a default fee percentage if the currency is not recognized
        return 0.05;
    }
}


function getFeeCurrency() {
    const currencyChoose = document.getElementById('currency-chosed');
    return currencyChoose.value;
}


function handleSendAmountInput() {
    const sendAmount = parseFloat(this.value);
    calculateReceiveAmount(sendAmount, countrySelect.value, currencySelect.value);
    if (!countrySelect.value) {
        alert("Please choose a country before adding the 'You send' amount.");
    }
}

function handleCurrencySelectChange() {
    const sendAmount = parseFloat(sendAmountInput.value);
    const selectedCountry = countrySelect.value;
    const selectedCurrency = this.value;
    calculateReceiveAmount(sendAmount, selectedCountry, selectedCurrency);
}

function handleCurrencyChosenChange() {
    const sendAmount = parseFloat(sendAmountInput.value);
    const selectedCountry = countrySelect.value;
    const selectedCurrency = currencySelect.value;
    calculateReceiveAmount(sendAmount, selectedCountry, selectedCurrency);
}

function handleCountrySelectChange() {
    const selectedCountry = this.value;
    const selectedCurrency = currencySelect.value;

    if (selectedCountry in exchangeRates) {
        const exchangeRate = exchangeRates[selectedCountry][selectedCurrency];
        if (exchangeRate !== undefined) {
            const exchangeRateElement = document.getElementById('exchange-rate');
            exchangeRateElement.textContent = `1.00 ${selectedCurrency} = ${exchangeRate} (${selectedCountry})`;
        }

        updateAvailableCurrencyOptions(selectedCountry);

        const sendAmount = parseFloat(sendAmountInput.value);
        calculateReceiveAmount(sendAmount, selectedCountry, selectedCurrency);
    }
}


function calculateFee() {
    const sendAmount = parseFloat(sendAmountInput.value);
    const selectedCurrency = currencySelect.value;

    if (!isNaN(sendAmount)) {
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

        const fee = sendAmount * feePercentage;

        // Update the fee price
        feePrice.textContent = `+ ${fee.toFixed(2)} ${getFeeCurrency()} (${(feePercentage * 100).toFixed(2)} %)`;
    }
}

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

            // Set the selected currency to the first available currency
            if (!availableCurrencies.includes(selectedCurrency)) {
                currencySelect.value = availableCurrencies[0];
                selectedCurrency = availableCurrencies[0];
            }
        } else {
            console.error(`Exchange rates for ${selectedCountry} are not defined.`);
        }
    }
    calculateReceiveAmount(sendAmount, selectedCountry, selectedCurrency);
}

