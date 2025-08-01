/* === Filter Functionality === */

// Filter state management
let filterState = {
  applicationType: [],
  mountingType: [],
  formFactor: [],
  performanceSpecs: {},
  technicalSpecs: {}
};

// Dropdown options configuration - Easy to add more options
const DROPDOWN_OPTIONS = {
  'Wattage': ['12W', '24W', '36W', '48W', '60W', '72W', '96W'],
  'CCT': ['2700K', '3000K', '4000K', '5000K', '6500K'],
  'Beam': ['15°', '30°', '60°', '90°', '120°', '180°'],
  'CRI': ['80', '85', '90', '95', '98'],
  'UGR': ['16', '17', '18', '19', '20'],
  'Efficancy': ['80lm/W', '90lm/W', '100lm/W', '110lm/W', '120lm/W'],
  'IP': ['IP20', 'IP44', 'IP54', 'IP65', 'IP67', 'IP68'],
  'IK': ['IK06', 'IK08', 'IK10'],
  'Finish Color': ['White', 'Black', 'Silver', 'Bronze', 'Custom', 'Gold', 'Copper']
};

// Sample product data (replace with your actual data)
let products = [
  {
    id: 1,
    name: "Linear LED Strip",
    applicationType: ["Outdoor", "Indoor"],
    mountingType: ["Surface Mounted", "Recessed Mounted"],
    formFactor: ["Linear", "Strip"],
    performanceSpecs: {
      wattage: "24W",
      lumen: "2400lm",
      cct: "3000K",
      beam: "120°",
      cri: "90",
      ugr: "19",
      efficiency: "100lm/W"
    },
    technicalSpecs: {
      ip: "IP65",
      ik: "IK10",
      finishColor: "White"
    }
  },
  {
    id: 2,
    name: "Circular Downlight",
    applicationType: ["Indoor"],
    mountingType: ["Recessed Mounted"],
    formFactor: ["Circular", "Downlight"],
    performanceSpecs: {
      wattage: "12W",
      lumen: "1200lm",
      cct: "4000K",
      beam: "60°",
      cri: "95",
      ugr: "16",
      efficiency: "100lm/W"
    },
    technicalSpecs: {
      ip: "IP20",
      ik: "IK08",
      finishColor: "Black"
    }
  },
  {
    id: 3,
    name: "Panel Light",
    applicationType: ["Indoor", "Retail"],
    mountingType: ["Surface Mounted", "Recessed Mounted"],
    formFactor: ["Panel"],
    performanceSpecs: {
      wattage: "36W",
      lumen: "3600lm",
      cct: "3000K",
      beam: "120°",
      cri: "90",
      ugr: "19",
      efficiency: "100lm/W"
    },
    technicalSpecs: {
      ip: "IP20",
      ik: "IK08",
      finishColor: "White"
    }
  },
  {
    id: 4,
    name: "Product 4708",
    applicationType: ["Indoor", "Retail"],
    mountingType: ["Recessed Mounted"],
    formFactor: ["Circular", "Downlight"],
    performanceSpecs: {
      wattage: "7W",
      lumen: "700lm",
      cct: "3000K",
      beam: "15°",
      cri: "80",
      ugr: "16",
      efficiency: "100lm/W"
    },
    technicalSpecs: {
      ip: "IP20",
      ik: "IK08",
      finishColor: "White"
    }
  },
  {
    id: 5,
    name: "Product 4708 (10W)",
    applicationType: ["Indoor", "Retail"],
    mountingType: ["Recessed Mounted"],
    formFactor: ["Circular", "Downlight"],
    performanceSpecs: {
      wattage: "10W",
      lumen: "1000lm",
      cct: "3000K",
      beam: "24°",
      cri: "90",
      ugr: "16",
      efficiency: "100lm/W"
    },
    technicalSpecs: {
      ip: "IP44",
      ik: "IK08",
      finishColor: "Black"
    }
  }
];

// Initialize filter functionality
function initializeFilter() {
  console.log('Initializing filter functionality...');
  
  // Initialize filter header toggle
  initializeFilterHeader();
  
  // Initialize checkboxes
  initializeFilterCheckboxes();
  
  // Initialize dropdowns and input fields
  initializeFilterFields();
  
  // Initialize apply filter button
  initializeApplyFilterButton();
  
  console.log('Filter functionality initialized');
}

// Filter header expand/collapse
function initializeFilterHeader() {
  const filterHeader = document.querySelector('.filter-header-wraper');
  const filterBg = document.querySelector('.filter-bg');
  const toggleArrow = document.querySelector('.filter-header-toggle-arrow');
  
  if (filterHeader && filterBg && toggleArrow) {
    filterHeader.addEventListener('click', function() {
      const isExpanded = filterBg.classList.contains('expanded');
      
      if (isExpanded) {
        // Collapse
        filterBg.classList.remove('expanded');
        toggleArrow.classList.remove('rotated');
      } else {
        // Expand
        filterBg.classList.add('expanded');
        toggleArrow.classList.add('rotated');
      }
    });
    
    console.log('Filter header toggle initialized');
  }
}

// Initialize filter checkboxes
function initializeFilterCheckboxes() {
  const checkboxes = document.querySelectorAll('.filter-checkmark');
  
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', function() {
      const wrapper = this.closest('.sub-filter-wrapper');
      const textElement = wrapper.querySelector('.sub-filter-wattage');
      const filterText = textElement.textContent.trim();
      
      // Toggle active state
      this.classList.toggle('active');
      wrapper.classList.toggle('active');
      
      // Update filter state
      updateFilterState(filterText, this.classList.contains('active'));
      
      // Apply filters in real-time
      applyFilters();
    });
  });
  
  console.log('Filter checkboxes initialized');
}

// Initialize all filter fields (dropdowns and inputs)
function initializeFilterFields() {
  const filterFields = document.querySelectorAll('.selection-filter-text');
  
  filterFields.forEach(field => {
    const textField = field.querySelector('.text-filed div');
    const specType = field.closest('.sub-filter-wrapper').querySelector('.sub-filter-wattage').textContent.trim();
    
    // Create input field for all specs (can be used for both dropdown and manual input)
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'lumen-input-field';
    input.placeholder = `Enter ${specType} value`;
    
    // Replace the div with input
    textField.parentNode.replaceChild(input, textField);
    
    // Add dropdown functionality
    const dropdownMenu = createDropdownMenu(specType);
    field.appendChild(dropdownMenu);
    
    // Add click handler for dropdown
    field.addEventListener('click', function(e) {
      if (e.target === input) return; // Don't toggle dropdown when clicking input
      e.stopPropagation();
      toggleDropdown(dropdownMenu);
    });
    
    // Add input event listener for real-time filtering
    input.addEventListener('input', function() {
      const value = this.value.trim();
      updateFieldFilterState(specType, value);
      applyFilters();
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
      dropdownMenu.classList.remove('active');
    });
  });
  
  console.log('Filter fields initialized');
}

// Create dropdown menu with options
function createDropdownMenu(specType) {
  const dropdownMenu = document.createElement('div');
  dropdownMenu.className = 'filter-dropdown-menu';
  
  // Get options from configuration
  const options = DROPDOWN_OPTIONS[specType] || ['Option 1', 'Option 2', 'Option 3'];
  
  options.forEach(option => {
    const item = document.createElement('div');
    item.className = 'filter-dropdown-item';
    item.textContent = option;
    
    item.addEventListener('click', function() {
      const input = this.closest('.selection-filter-text').querySelector('.lumen-input-field');
      input.value = option;
      
      // Update filter state
      updateFieldFilterState(specType, option);
      
      // Apply filters in real-time
      applyFilters();
      
      // Close dropdown
      this.closest('.filter-dropdown-menu').classList.remove('active');
    });
    
    dropdownMenu.appendChild(item);
  });
  
  return dropdownMenu;
}

// Toggle dropdown visibility
function toggleDropdown(dropdownMenu) {
  dropdownMenu.classList.toggle('active');
}

// Update filter state for checkboxes
function updateFilterState(filterText, isActive) {
  // Determine which category this filter belongs to
  const applicationTypes = ['Outdoor', 'Indoor', 'Square', 'Round', 'Facade', 'Retail', 'Landscpae', 'Architectural'];
  const mountingTypes = ['Surface Mounted', 'Recessed Mounted', 'Flex Strip', 'Pendant', 'Track Mounted', 'Bollard'];
  const formFactors = ['Linear', 'Circular', 'Panel', 'Spotlight', 'Downlight', 'Floodlight', 'Strip', 'Tube'];
  
  if (applicationTypes.includes(filterText)) {
    if (isActive) {
      if (!filterState.applicationType.includes(filterText)) {
        filterState.applicationType.push(filterText);
      }
    } else {
      // Remove from filter state when unchecked
      filterState.applicationType = filterState.applicationType.filter(item => item !== filterText);
    }
  } else if (mountingTypes.includes(filterText)) {
    if (isActive) {
      if (!filterState.mountingType.includes(filterText)) {
        filterState.mountingType.push(filterText);
      }
    } else {
      // Remove from filter state when unchecked
      filterState.mountingType = filterState.mountingType.filter(item => item !== filterText);
    }
  } else if (formFactors.includes(filterText)) {
    if (isActive) {
      if (!filterState.formFactor.includes(filterText)) {
        filterState.formFactor.push(filterText);
      }
    } else {
      // Remove from filter state when unchecked
      filterState.formFactor = filterState.formFactor.filter(item => item !== filterText);
    }
  }
  
  console.log('Filter state updated:', filterState);
}

// Update filter state for input fields and dropdowns
function updateFieldFilterState(specType, value) {
  if (value) {
    if (specType === 'Wattage' || specType === 'Lumen' || specType === 'CCT' || 
        specType === 'Beam' || specType === 'CRI' || specType === 'UGR' || specType === 'Efficancy') {
      filterState.performanceSpecs[specType.toLowerCase()] = value;
    } else if (specType === 'IP' || specType === 'IK' || specType === 'Finish Color') {
      filterState.technicalSpecs[specType.toLowerCase().replace(' ', '')] = value;
    }
  } else {
    // Remove from filter state if value is empty
    if (specType === 'Wattage' || specType === 'Lumen' || specType === 'CCT' || 
        specType === 'Beam' || specType === 'CRI' || specType === 'UGR' || specType === 'Efficancy') {
      delete filterState.performanceSpecs[specType.toLowerCase()];
    } else if (specType === 'IP' || specType === 'IK' || specType === 'Finish Color') {
      delete filterState.technicalSpecs[specType.toLowerCase().replace(' ', '')];
    }
  }
  
  console.log('Field filter state updated:', filterState);
}

// Apply filters to products
function applyFilters() {
  console.log('Applying filters:', filterState);
  
  // Get all existing product cards from Webflow CMS
  const existingProductCards = document.querySelectorAll('.collection-item');
  
  existingProductCards.forEach(card => {
    // Get product data from the card (this will depend on your Webflow CMS structure)
    const productName = card.querySelector('.main-code-text')?.textContent || '';
    const productDescription = card.querySelector('.item-description')?.textContent || '';
    
    // Check if this product matches the filter criteria
    const shouldShow = checkProductMatch(productName, productDescription);
    
    // Show/hide the card based on filter results
    if (shouldShow) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
  
  // Show empty state if no products are visible
  const visibleProducts = document.querySelectorAll('.collection-item[style*="display: block"], .collection-item:not([style*="display: none"])');
  
  if (visibleProducts.length === 0) {
    showEmptyState();
  } else {
    hideEmptyState();
  }
  
  console.log('Filter applied to existing products');
}

// Check if a product matches the filter criteria
function checkProductMatch(productName, productDescription) {
  // For now, we'll do basic text matching
  // You can enhance this based on your actual product data structure
  
  const searchText = (productName + ' ' + productDescription).toLowerCase();
  
  // Check application type filters
  if (filterState.applicationType.length > 0) {
    const hasMatchingApplication = filterState.applicationType.some(type => 
      searchText.includes(type.toLowerCase())
    );
    if (!hasMatchingApplication) return false;
  }
  
  // Check mounting type filters
  if (filterState.mountingType.length > 0) {
    const hasMatchingMounting = filterState.mountingType.some(type => 
      searchText.includes(type.toLowerCase())
    );
    if (!hasMatchingMounting) return false;
  }
  
  // Check form factor filters
  if (filterState.formFactor.length > 0) {
    const hasMatchingFormFactor = filterState.formFactor.some(type => 
      searchText.includes(type.toLowerCase())
    );
    if (!hasMatchingFormFactor) return false;
  }
  
  // Check performance specs
  for (const [key, value] of Object.entries(filterState.performanceSpecs)) {
    if (value && !searchText.includes(value.toLowerCase())) {
      return false;
    }
  }
  
  // Check technical specs
  for (const [key, value] of Object.entries(filterState.technicalSpecs)) {
    if (value && !searchText.includes(value.toLowerCase())) {
      return false;
    }
  }
  
  return true;
}

// Show empty state message
function showEmptyState() {
  const productContainer = document.querySelector('.cards-container');
  if (productContainer) {
    // Remove existing empty state
    const existingEmpty = productContainer.querySelector('.filter-empty-state');
    if (existingEmpty) {
      existingEmpty.remove();
    }
    
    // Create new empty state
    const emptyState = document.createElement('div');
    emptyState.className = 'filter-empty-state w-dyn-empty';
    emptyState.innerHTML = '<p>No products match your filter criteria.</p>';
    productContainer.querySelector('.collection-list-wrapper').appendChild(emptyState);
  }
}

// Hide empty state message
function hideEmptyState() {
  const emptyState = document.querySelector('.filter-empty-state');
  if (emptyState) {
    emptyState.remove();
  }
}

// Initialize apply filter button
function initializeApplyFilterButton() {
  const applyButton = document.querySelector('.link-block-6');
  
  if (applyButton) {
    applyButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Apply filter button clicked');
      
      // Apply filters
      applyFilters();
      
      // Close all dropdowns
      const dropdowns = document.querySelectorAll('.filter-dropdown-menu');
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
      
      // Show success message
      showFilterAppliedMessage();
    });
  }
}

// Show filter applied message
function showFilterAppliedMessage() {
  // Create a temporary success message
  const message = document.createElement('div');
  message.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #c0392b;
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    z-index: 10000;
    font-family: Gotham, Georgia, sans-serif;
    font-size: 14px;
  `;
  message.textContent = 'Filters applied successfully!';
  
  document.body.appendChild(message);
  
  // Remove message after 3 seconds
  setTimeout(() => {
    message.remove();
  }, 3000);
}

// Function to add new dropdown options (for future use)
function addDropdownOption(specType, newOption) {
  if (DROPDOWN_OPTIONS[specType]) {
    DROPDOWN_OPTIONS[specType].push(newOption);
    console.log(`Added new option "${newOption}" to ${specType}`);
  } else {
    console.error(`Spec type "${specType}" not found`);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded - Initializing filter');
  initializeFilter();
});

// Also initialize when Webflow loads
if (typeof Webflow !== 'undefined') {
  Webflow.push(function() {
    console.log('Webflow loaded - Initializing filter');
    initializeFilter();
  });
}
