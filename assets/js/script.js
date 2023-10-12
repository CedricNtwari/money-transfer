 // Current tab is set to be the first tab (0)
var currentTab = 0;

// Display the current tab
displayTab(currentTab);

/**
 * Display the specified tab of the form 
 * and update the navigation buttons.
 *
 * @param {number} i - The index of the tab to display.
 */
function displayTab(i) {
    let tab = document.getElementsByClassName("tab");
    tab[i].style.display = "block";
    // fix the Previous/Next buttons
    if (i == 0) {
      document.getElementById("prevBtn").style.display = "none";
    } else {
      document.getElementById("prevBtn").style.display = "inline";
    }
    if (i == (tab.length - 1)) {
      document.getElementById("continueBtn").innerHTML = "Submit";
    } else {
      document.getElementById("continueBtn").innerHTML = "Continue";
    }
  }


/**
 * Navigate to the next or previous tab in the form.
 *
 * @param {number} n - A positive number to move to the next tab, or a negative number to move to the previous tab.
 * @returns {boolean} - Returns `false` if any field in the current tab is invalid and prevents navigation.
 */
function continueButton(n) {
    let tab = document.getElementsByClassName("tab");
    
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
      setTimeout(function() {
          window.location.reload();
      }, 10);
      return false;
    }
    
    // Otherwise, display the correct tab:
    displayTab(currentTab);
  }
  