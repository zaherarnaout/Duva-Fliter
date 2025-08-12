
/* === DUVA Filter Script (Complete Version) === */

// Filter state management
const filterState = {
  applicationType: [],
  mountingType: [],
  formFactor: [],
  performanceSpecs: {
    wattage: '',
    cct: '',
    beam: '',
    lumen: '',
    cri: '',
    ugr: '',
    efficacy: ''
  },
  technicalSpecs: {
    ip: '',
    ik: '',
    outdoor: '',
    indoor: '',
    finishcolor: ''
  }
};

// Input field configuration - Users can enter any value
const INPUT_FIELDS = {
  'Wattage': 'Wattage',
  'Lumen': 'Lumen',
  'CCT': 'CCT',
  'Beam': 'Beam',
  'CRI': 'CRI',
  'UGR': 'UGR',
  'Efficacy': 'Efficacy',
  'IP': 'IP',
  'IK': 'IK',
  'Finish Color': 'Finish Color'
};

// Initialize filter functionality
function initializeFilter() {
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFilterComponents);
  } else {
    initializeFilterComponents();
  }
  
  // Retry initialization after a delay to catch late-loading CMS items
  setTimeout(() => {
    initializeFilterComponents();
  }, 3000);
  
  // Listen for Webflow's CMS load events
  if (window.Webflow) {
    window.Webflow.push(() => {
      initializeFilterComponents();
    });
  }
}

// Initialize all filter components
function initializeFilterComponents() {
  // Wait a bit for Webflow to render CMS items
  setTimeout(() => {
    initializeFilterToggle();
    initializeFilterFields();
    initializeApplyFilterButton();
    initializeResetFilterButton();
  }, 1000);
}

// Initialize filter toggle functionality
function initializeFilterToggle() {
  const filterBg = document.querySelector('.filter-bg');
  const filterHeader = document.querySelector('.filter-header-wrapper');
  const filterArrow = document.querySelector('.filter-header-toggle-arrow');
  
  if (filterBg && filterHeader) {
    // Ensure filter starts in collapsed state
    filterBg.classList.remove('expanded');
    if (filterArrow) {
      filterArrow.classList.remove('rotated');
    }
    
    // Remove any existing event listeners to prevent conflicts
    filterHeader.removeEventListener('click', handleFilterToggle);
    
    // Add the event listener
    filterHeader.addEventListener('click', handleFilterToggle);
    
  }
}

// Separate function for handling the toggle
function handleFilterToggle(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const filterBg = document.querySelector('.filter-bg');
  const filterArrow = document.querySelector('.filter-header-toggle-arrow');
  
  if (filterBg) {
    const isExpanded = filterBg.classList.contains('expanded');
    
    if (isExpanded) {
      // Collapse
      filterBg.classList.remove('expanded');
      if (filterArrow) {
        filterArrow.classList.remove('rotated');
      }
    } else {
      // Expand
      filterBg.classList.add('expanded');
      if (filterArrow) {
        filterArrow.classList.add('rotated');
      }
    }
    
  }
}

// Initialize filter fields (input fields only)
function initializeFilterFields() {
  // Initialize input fields
  const inputFields = document.querySelectorAll('.selection-filter-text');
  
  inputFields.forEach((field, index) => {
    const fieldType = getFieldType(field);
    
    // Replace the div with an input field
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'filter-input-field';
    input.placeholder = INPUT_FIELDS[fieldType] || 'Enter value';
    // CSS handles all styling for .filter-input-field
    
    // Replace the existing content
    const existingContent = field.querySelector('.text-filed');
    if (existingContent) {
      existingContent.replaceWith(input);
    }
    
    // Add input handler for manual entry
    input.addEventListener('input', () => {
      updateFieldFilterState(fieldType, input.value);
      applyFilters();
      
      // Update text label color based on input value
      const wrapper = field.closest('.sub-filter-wrapper');
      if (wrapper) {
        if (input.value.trim() !== '') {
          wrapper.classList.add('has-input');
        } else {
          wrapper.classList.remove('has-input');
        }
      }
    });
  });
  
  // Initialize checkboxes
  initializeFilterCheckboxes();
}

// Get field type from the field element
function getFieldType(field) {
  // First try to get from data-type attribute of the parent wrapper
  const parentWrapper = field.closest('[data-type]');
  if (parentWrapper) {
    const dataType = parentWrapper.getAttribute('data-type');
    if (dataType) {
      return dataType;
    }
  }
  
  // Fallback to text content
  const text = field.textContent || '';
  if (text.includes('Wattage')) return 'Wattage';
  if (text.includes('Lumen')) return 'Lumen';
  if (text.includes('CCT')) return 'CCT';
  if (text.includes('Beam')) return 'Beam';
  if (text.includes('CRI')) return 'CRI';
  if (text.includes('UGR')) return 'UGR';
      if (text.includes('Efficacy')) return 'Efficacy';
  if (text.includes('IP')) return 'IP';
  if (text.includes('IK')) return 'IK';
  if (text.includes('Finish')) return 'Finish Color';
  return 'Wattage'; // Default
}

// Initialize filter checkboxes
function initializeFilterCheckboxes() {
  // Initialize checkboxes for data-attribute based filtering
  const checkboxes = document.querySelectorAll('[data-type]');
  
  checkboxes.forEach((checkbox) => {
    // Add click handler to the checkbox element
    checkbox.addEventListener('click', () => {
      const isActive = checkbox.classList.contains('active') || 
                      (checkbox.querySelector('input[type="checkbox"]') && 
                       checkbox.querySelector('input[type="checkbox"]').checked);
      
      if (isActive) {
        // Uncheck
        checkbox.classList.remove('active');
        const input = checkbox.querySelector('input[type="checkbox"]');
        if (input) {
          input.checked = false;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } else {
        // Check
        checkbox.classList.add('active');
        const input = checkbox.querySelector('input[type="checkbox"]');
        if (input) {
          input.checked = true;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      
      applyFilters();
    });
  });
  
  // Also handle direct checkbox input changes
  const checkboxInputs = document.querySelectorAll('[data-type] input[type="checkbox"]');
  checkboxInputs.forEach((input) => {
    input.addEventListener('change', () => {
      const wrapper = input.closest('[data-type]');
      if (wrapper) {
        if (input.checked) {
          wrapper.classList.add('active');
        } else {
          wrapper.classList.remove('active');
        }
      }
      applyFilters();
    });
  });
}

// Get checkbox filter type (DEPRECATED - Now using data-attribute system)
function getCheckboxFilterType(wrapper) {
  // This function is deprecated - filter types are now determined by data-filter attributes
  console.log('ℹ️ getCheckboxFilterType is deprecated - using data-attribute system');
  return 'applicationType'; // Default fallback
}

// Update field filter state
function updateFieldFilterState(fieldType, value) {
  if (fieldType === 'Wattage') {
    filterState.performanceSpecs.wattage = value;
  } else if (fieldType === 'CCT') {
    filterState.performanceSpecs.cct = value;
  } else if (fieldType === 'Beam') {
    filterState.performanceSpecs.beam = value;
  } else if (fieldType === 'CRI') {
    filterState.performanceSpecs.cri = value;
  } else if (fieldType === 'UGR') {
    filterState.performanceSpecs.ugr = value;
  } else if (fieldType === 'Efficacy') {
    filterState.performanceSpecs.efficacy = value;
  } else if (fieldType === 'IP') {
    filterState.technicalSpecs.ip = value;
  } else if (fieldType === 'IK') {
    filterState.technicalSpecs.ik = value;
  } else if (fieldType === 'Finish Color') {
    filterState.technicalSpecs.finishcolor = value;
  }
}

// Initialize apply filter button
function initializeApplyFilterButton() {
  const applyButton = document.querySelector('.filter-apply-button');
  if (applyButton) {
    applyButton.addEventListener('click', () => {
      closeAllDropdowns();
      applyFilters();
    });
  }
}

// Initialize reset filter button
function initializeResetFilterButton() {
  const resetButton = document.querySelector('.filter-reset-button');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      resetAllFilters();
    });
  }
}

// Reset all filters
function resetAllFilters() {
  // Reset filter state
  filterState.applicationType = [];
  filterState.mountingType = [];
  filterState.formFactor = [];
  filterState.performanceSpecs = { wattage: '', cct: '', beam: '', lumen: '', cri: '', ugr: '', efficacy: '' };
  filterState.technicalSpecs = { ip: '', ik: '', outdoor: '', indoor: '', finishcolor: '' };
  
  // Reset checkboxes - remove active class from both wrapper and checkbox
  document.querySelectorAll('.sub-filter-wrapper').forEach(wrapper => {
    wrapper.classList.remove('active');
    const checkmark = wrapper.querySelector('.filter-checkmark');
    if (checkmark) {
      checkmark.classList.remove('active');
    }
  });
  
  // Reset input fields
  document.querySelectorAll('.filter-input-field').forEach(input => {
    input.value = '';
    
    // Reset text label color for input fields
    const wrapper = input.closest('.sub-filter-wrapper');
    if (wrapper) {
      wrapper.classList.remove('has-input');
    }
  });
  
  // Clear main page category filter from URL
  const url = new URL(window.location);
  url.searchParams.delete('category');
  
  // Update URL without page reload
  window.history.replaceState({}, '', url);
  
  // Close all dropdowns
  closeAllDropdowns();
  
  // Show all products
  showAllProducts();
}

// Close all dropdowns (no longer needed but kept for compatibility)
function closeAllDropdowns() {
  // No dropdowns to close in input-only version
}

// Get CMS data from Webflow collection item
// Get CMS data from a product card (DEPRECATED - Now using data-attribute system)
function getCMSDataFromCard(card) {
  // This function is deprecated - now using data attributes directly on cards
  console.log('ℹ️ getCMSDataFromCard is deprecated - using data-attribute system');
  return {};
}

// Check if a product matches the filter criteria using CMS data (DEPRECATED)
function checkProductMatchWithCMSData(cmsData) {
  // This function is deprecated - now using checkProductMatchWithDataAttributes
  console.log('ℹ️ checkProductMatchWithCMSData is deprecated - using data-attribute system');
  return true;
}

// Apply filters to show/hide products (Data-Attribute Based)
function applyFilters() {
  const cardsContainer = document.querySelector('.cards-container');
  if (!cardsContainer) {
    return;
  }
  
  const productCards = cardsContainer.querySelectorAll('.collection-item, .w-dyn-item');
  const noResultsMessage = document.querySelector('.no-results-message');
  
  let visibleCount = 0;
  
  productCards.forEach(card => {
    const matches = checkProductMatchWithDataAttributes(card);
    
    if (matches) {
      // Remove any inline display style to let CSS handle the layout
      card.style.removeProperty('display');
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  
  // Show/hide no results message
  if (noResultsMessage) {
    if (visibleCount === 0) {
      // No cards match the filter
      noResultsMessage.style.display = 'block';
    } else {
      // Cards are visible
      noResultsMessage.style.display = 'none';
    }
  }
}

// Check if a product card matches the current filter state using data attributes
function checkProductMatchWithDataAttributes(card) {
  const norm = s => (s||'').toString().toLowerCase().trim();
  function splitList(v) { return norm(v).split(',').map(s=>s.trim()).filter(Boolean); }
  
  // Get all active filter groups
  const activeGroups = {};
  
  // Check each filter group for active options
  Object.keys(GROUPS).forEach(groupName => {
    const groupSelector = `[data-filter="${groupName}"]`;
    const groupElement = document.querySelector(groupSelector);
    
    if (groupElement) {
      const activeOptions = groupElement.querySelectorAll('[data-type].active, input[type="checkbox"]:checked');
      if (activeOptions.length > 0) {
        activeGroups[groupName] = Array.from(activeOptions).map(option => {
          return norm(option.getAttribute('data-type') || option.value || option.textContent);
        });
      }
    }
  });
  
  // If no active filters, show all products
  if (Object.keys(activeGroups).length === 0) {
    return true;
  }
  
  // Check each active group against the card's data attributes
  for (const [groupName, activeOptions] of Object.entries(activeGroups)) {
    const groupConfig = GROUPS[groupName];
    if (!groupConfig || !groupConfig.attr) continue;
    
    const cardValue = card.dataset[groupConfig.attr];
    if (!cardValue) {
      // If card doesn't have this attribute and we have active filters for this group, hide it
      return false;
    }
    
    const cardValues = splitList(cardValue);
    const hasMatch = activeOptions.some(option => 
      cardValues.some(cardVal => norm(cardVal) === norm(option))
    );
    
    if (!hasMatch) {
      return false;
    }
  }
  
  return true;
}

// Show all products
function showAllProducts() {
  const cardsContainer = document.querySelector('.cards-container');
  if (!cardsContainer) return;
  
  const productCards = cardsContainer.querySelectorAll('.collection-item, .w-dyn-item');
  const noResultsMessage = document.querySelector('.no-results-message');
  
  productCards.forEach(card => {
    // Remove any inline display style to let CSS handle the layout
    card.style.removeProperty('display');
  });
  
  // Hide no results message when showing all products
  if (noResultsMessage) {
    noResultsMessage.style.display = 'none';
  }
  
}

// Start the filter when the page loads
initializeFilter();

// Apply category filter on page load if URL has category parameter (DEPRECATED)
// This functionality is now handled by the DUVA Filter Bridge in script.js
function applyCategoryFilterOnLoad() {
  // This function is deprecated - category filtering is now handled by the bridge
  console.log('ℹ️ Category filter on load is now handled by DUVA Filter Bridge');
}

// Note: Category filtering is now handled by the DUVA Filter Bridge in script.js
// which provides better integration and performance

/* ============================
   DUVA FILTER PUBLIC API (Data-Attribute Based)
   - Exposes functions for external scripts to interact with the filter system
   ============================ */

// Define filter groups and their corresponding data attributes
const GROUPS = window.DUVA_GROUPS || (window.DUVA_GROUPS = {});
GROUPS['Application Type'] = { attr: 'application' };
GROUPS['Form Factor']      = { attr: 'form' };
GROUPS['Mounting Type']    = { attr: 'mounting' };
GROUPS['Feature Lighting'] = { attr: 'feature' };

// Expose DUVA Filter API globally
window.DUVA_FILTER = window.DUVA_FILTER || {};

/**
 * Activates the same code path as a real user click on a filter option.
 * labelText: the visible text of the checkbox/label (e.g. "Indoor", "Flex Strip")
 * groupText: optional group label (e.g. "Application Type"). If omitted, match by label across groups.
 */
window.DUVA_FILTER.activateCheckboxByLabel = function(labelText, groupText) {
  console.log(`🎯 DUVA API: Activating checkbox for label: "${labelText}"${groupText ? ` in group: "${groupText}"` : ''}`);
  
  const norm = s => (s||'').toString().trim().toLowerCase();
  const labelSel = groupText
    ? `[data-filter="${groupText}"] [data-type]`
    : `[data-type]`;

  const target = [...document.querySelectorAll(labelSel)]
    .find(el => norm(el.getAttribute('data-type')) === norm(labelText));

  if (!target) {
    console.warn(`❌ DUVA API: Could not find checkbox for label "${labelText}"${groupText ? ` in group "${groupText}"` : ''}`);
    return false;
  }

  // If there is a real checkbox inside, ensure it's checked and dispatch events; otherwise click the label.
  const input = target.querySelector('input[type="checkbox"]');
  if (input) {
    if (!input.checked) {
      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    // ensure the UI wrapper looks active too
    input.closest('[data-type]')?.classList.add('active');
  } else {
    target.click();
  }

  // call DUVA's existing "apply/update filters" function
  if (typeof applyFilters === 'function') applyFilters();
  if (typeof updateActiveChips === 'function') updateActiveChips();
  
  console.log(`✅ DUVA API: Successfully activated checkbox for "${labelText}"`);
  return true;
};

// Consume category parameter on load (DISABLED - Now handled by DUVA Filter Bridge in script.js)
// This functionality has been moved to the bridge to prevent double-trigger issues
(function consumeCategoryParam() {
  // This function is disabled - category filtering is now handled by the DUVA Filter Bridge
  // which provides better integration and prevents double-trigger issues
  console.log('ℹ️ Category parameter consumption disabled - handled by DUVA Filter Bridge');
})();

// Dispatch ready event when DUVA Filter is fully initialized
function dispatchDuvaReadyEvent() {
  console.log('🚀 DUVA Filter ready - dispatching duva:ready event');
  window.dispatchEvent(new CustomEvent('duva:ready', {
    detail: { 
      timestamp: Date.now(),
      filterState: window.DUVA_FILTER.getFilterState()
    }
  }));
}

// Dispatch ready event after initialization
setTimeout(dispatchDuvaReadyEvent, 2000);

// Also dispatch when Webflow loads
if (window.Webflow) {
  window.Webflow.push(() => {
    setTimeout(dispatchDuvaReadyEvent, 1000);
  });
}
