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
        //the form gets submitted:
        // Display an alert
        alert('Thank you for your submission. We have received your request.');

        // Add a delay before reloading the page
        setTimeout(function () {
            window.location.reload();
        }, 10);
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
