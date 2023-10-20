
// ---- Helper Functions (Utility Functions)--------

/**
 * Get the selected fee currency from the 'currency-chosed' element
 * This helps to retrieve the fee currency dynamically
 * @param {*} sendAmount - Amount to be sent
 * @param {*} selectedCurrency - Selected currency code
 * @returns {number} - The calculated fee amount
 */
function getFeeCurrency() {
    const currencyChoose = document.getElementById('currency-chosed');
    return currencyChoose.value;
}


/**
 * Calculate fee value based on  selected currency & send amount
 * @param {*} sendAmount - Amount to be sent
 * @param {*} selectedCurrency - Selected currency code
 * @returns {number} - Calculated fee amount
 */
function calculateFeeValue(sendAmount, selectedCurrency) {
    // Get the fee percentage based on the selected currency
    const feePercentage = getFeePercentage(selectedCurrency);
     // Calculate and return the fee amount
    return sendAmount * feePercentage;
}


/**
 * Get fee percentage based on the selected currency
 * @param {*} selectedCurrency - Selected currency value (EUR, USD, RWF, BIF)
 * @returns {number} - Fee percentage for selected currency
 */
function getFeePercentage(selectedCurrency) {
    // Check the selected currency and return the corresponding fee percentage
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


/**
 * Handles change event when user selects different currency for receiving
 * Updates calculations based on selected currency
 */
function handleCurrencySelectChange() {
    const sendAmount = parseFloat(sendAmountInput.value);
    const selectedCountry = countrySelect.value;
    const selectedCurrency = this.value;
    calculateReceiveAmount(sendAmount, selectedCountry, selectedCurrency);
}


/**
 * Handles change event when user selects different currency for sending
 * Updates calculations based on selected currency
 */
function handleCurrencyChosenChange() {
    const sendAmount = parseFloat(sendAmountInput.value);
    const selectedCountry = countrySelect.value;
    const selectedCurrency = currencySelect.value;
    calculateReceiveAmount(sendAmount, selectedCountry, selectedCurrency);
}

export { getFeeCurrency, calculateFeeValue, getFeePercentage, handleCurrencySelectChange, handleCurrencyChosenChange };
 
