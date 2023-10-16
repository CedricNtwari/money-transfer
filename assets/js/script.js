// Current tab is set to be the first tab (0)
var currentTab = 0;

// Initialize the accordion functionality
initAccordion();

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
    continueBtn.innerHTML = isLastTab
        ? "Submit <i class='fa-solid fa-paper-plane'></i>"
        : "Continue <i class='fa-solid fa-caret-right'></i>";
}



/**
 * Navigate to the next or previous tab in the form.
 *
 * @param {number} n - A positive number to move to the next tab, or a negative number to move to the previous tab.
 * @returns {boolean} - Returns `false` if any field in the current tab is invalid and prevents navigation.
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


/**
 * Function to initialize the accordion functionality.
 * Adds click event listeners to accordion elements.
 */
 function initAccordion() {
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


/**
 * Function to update the "They receive" input based on exchange rate
 */
// Define exchange rates for different countries
const exchangeRates = {
    Burundi: {
        BIF: 3074.00,
        EUR: 1.00,  // Example exchange rate for Euro to BIF
        USD: 1.18,  // Example exchange rate for USD to BIF
    },
    Rwanda: {
        RWF: 3120.00,
        EUR: 1.00,  // Example exchange rate for Euro to RWF
        USD: 1.18,  // Example exchange rate for USD to RWF
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

// Function to update the "They receive" input based on exchange rate, selected country, and currency
function updateReceiveAmount() {
    const sendAmountInput = document.getElementById('send-amount');
    const receiveAmountInput = document.getElementById('receive-amount');
    const exchangeRateElement = document.getElementById('exchange-rate');
    const countrySelect = document.getElementById('country');
    const currencySelect = document.getElementById('currency-selected');
    const currencyChoose = document.getElementById('currency-chosed');
    const feePrice = document.getElementById('fee-price');
    const price = document.getElementById('price');

    function calculateReceiveAmount() {
        const sendAmount = parseFloat(sendAmountInput.value);
        const selectedCountry = countrySelect.value;
        const selectedCurrency = currencySelect.value;
        const currencyChosed = currencyChoose.value;
    
        if (!isNaN(sendAmount) && selectedCountry in exchangeRates) {
            const exchangeRate = exchangeRates[selectedCountry][selectedCurrency];
            if (exchangeRate !== undefined) {
                const receiveAmount = sendAmount * exchangeRate;
    
                // Calculate the fee (5% of the send amount)
                const fee = sendAmount * 0.05;
    
                // Define the selected currency symbol
                let currencySymbol;
                if (currencyChosed === 'currency-chose-EUR') {
                    currencySymbol = 'EUR';
                } else if (currencyChosed === 'currency-chose-USD') {
                    currencySymbol = 'USD';
                }
                console.log(currencySymbol);
                feePrice.textContent = `+ ${fee.toFixed(2)} ${currencySymbol}`;
                
                // Calculate the total amount using the selected currency symbol
                const totalAmount = sendAmount + fee;
                price.textContent = `${totalAmount.toFixed(2)} ${currencySymbol}`;
    
                // Update the displayed exchange rate with the selected currency symbol
                exchangeRateElement.textContent = `1.00 ${selectedCurrency} = ${exchangeRate} ${currencySymbol} (${selectedCountry})`;
                console.log(currencySymbol);
                receiveAmountInput.value = receiveAmount.toFixed(2);
            } else {
                // Fallback to Euro if the selected currency is not found
                currencySelect.value = 'EUR';
                calculateReceiveAmount(); // Recalculate with the fallback currency
            }
        }
    }
    
    

    sendAmountInput.addEventListener('input', calculateReceiveAmount);
    currencySelect.addEventListener('change', calculateReceiveAmount);

    countrySelect.addEventListener('change', function () {
        const selectedCountry = countrySelect.value;
        if (selectedCountry in exchangeRates) {
            const exchangeRate = exchangeRates[selectedCountry][currencySelect.value];
            if (exchangeRate !== undefined) {
                exchangeRateElement.textContent = `1.00 ${currencySelect.value} = ${exchangeRate} (${selectedCountry})`;
            }

            // Update the currency selection to match the selected country's available currencies
            updateCurrencyOptions(selectedCountry);

            // Trigger the calculation of receive amount
            calculateReceiveAmount();
        }
    });

    function updateCurrencyOptions(selectedCountry) {
        // Define the available currencies based on the selected country
        const availableCurrencies = Object.keys(exchangeRates[selectedCountry]);
        for (let i = 0; i < currencySelect.options.length; i++) {
            const option = currencySelect.options[i];
            if (availableCurrencies.includes(option.value)) {
                option.style.display = 'block';
            } else {
                option.style.display = 'none';
            }
        }
    }

    // Initialize the calculation and currency options
    calculateReceiveAmount();
    updateCurrencyOptions(countrySelect.value);
}

// Call the function to initialize the event listeners
updateReceiveAmount();
