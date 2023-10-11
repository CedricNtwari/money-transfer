 // Current tab is set to be the first tab (0)
var currentTab = 0;

// Display the current tab
displayTab(currentTab);

/**
 * Display the specified tab of the form 
 * and update the navigation buttons.
 *
 * @param {number} n - The index of the tab to display.
 */
function displayTab(n) {
    // This function will display the specified tab of the form ...
    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    // ... and fix the Previous/Next buttons:
    if (n == 0) {
      document.getElementById("prevBtn").style.display = "none";
    } else {
      document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
      document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
      document.getElementById("nextBtn").innerHTML = "Next";
    }
  }



/**
 * Navigate to the next or previous tab in the form.
 *
 * @param {number} n - A positive number to move to the next tab, or a negative number to move to the previous tab.
 * @returns {boolean} - Returns `false` if any field in the current tab is invalid and prevents navigation.
 */
function nextPrev(n) {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("tab");
    
    // Hide the current tab:
    x[currentTab].style.display = "none";
    
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    
    // if you have reached the end of the form... :
    if (currentTab >= x.length) {
      //...the form gets submitted:
      document.getElementById("regForm").submit();
      return false;
    }
    
    // Otherwise, display the correct tab:
    displayTab(currentTab);
  }
  