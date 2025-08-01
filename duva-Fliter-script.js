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
  console.log('Initializing filter...');
  
  // Debug: Check if elements exist
  console.log('Filter elements found:', {
    filterHeader: document.querySelector('.filter-header-wraper'),
    filterBg: document.querySelector('.filter-bg'),
    toggleArrow: document.querySelector('.filter-header-toggle-arrow'),
    filterFields: document.querySelectorAll('.selection-filter-text'),
    dropdownArrows: document.querySelectorAll('.sub-filter-dropdown'),
    checkboxes: document.querySelectorAll('.filter-checkmark')
  });
  
  // Initialize filter header (expand/collapse)
  initializeFilterHeader();
  
  // Initialize filter fields (dropdowns and inputs)
  initializeFilterFields();
  
  // Initialize checkboxes
  initializeFilterCheckboxes();
  
  // Initialize apply filter button
  initializeApplyFilterButton();
  
  // Initialize reset filter button
  initializeResetFilterButton();
  
  console.log('Filter initialization complete');
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
  
  console.log('Found filter fields:', filterFields.length);
  
  filterFields.forEach((field, index) => {
    console.log(`Processing field ${index + 1}:`, field);
    
    const textField = field.querySelector('.text-filed div');
    const specType = field.closest('.sub-filter-wrapper').querySelector('.sub-filter-wattage').textContent.trim();
    
    console.log(`Spec type for field ${index + 1}:`, specType);
    
    // Create input field for all specs (can be used for both dropdown and manual input)
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'lumen-input-field';
    input.placeholder = `Enter ${specType} value`;
    
    // Replace the div with input
    if (textField && textField.parentNode) {
      textField.parentNode.replaceChild(input, textField);
      console.log(`Replaced text field with input for ${specType}`);
    }
    
    // Add dropdown functionality
    const dropdownMenu = createDropdownMenu(specType);
    field.appendChild(dropdownMenu);
    console.log(`Added dropdown menu for ${specType}`);
    
    // Add click handler for dropdown toggle - now works with the dropdown arrow
    const dropdownArrow = field.querySelector('.sub-filter-dropdown');
    console.log(`Dropdown arrow for ${specType}:`, dropdownArrow);
    
    if (dropdownArrow) {
      // Ensure the arrow is clickable
      dropdownArrow.style.pointerEvents = 'auto';
      dropdownArrow.style.cursor = 'pointer';
      dropdownArrow.style.zIndex = '1000';
      
      dropdownArrow.addEventListener('click', function(e) {
        console.log(`Dropdown arrow clicked for ${specType}`);
        e.stopPropagation();
        e.preventDefault();
        toggleDropdown(dropdownMenu);
      });
      
      console.log(`Added click listener to dropdown arrow for ${specType}`);
    } else {
      console.warn(`No dropdown arrow found for ${specType}`);
    }
    
    // Also allow clicking on the field itself to toggle dropdown
    field.addEventListener('click', function(e) {
      if (e.target === input || e.target.closest('.sub-filter-dropdown')) {
        console.log('Click on input or arrow, not toggling dropdown');
        return; // Don't toggle when clicking input or arrow
      }
      console.log(`Field clicked for ${specType}, toggling dropdown`);
      e.stopPropagation();
      toggleDropdown(dropdownMenu);
    });
    
    // Add input event listener for real-time filtering
    input.addEventListener('input', function() {
      const value = this.value.trim();
      console.log(`Input value changed for ${specType}:`, value);
      updateFieldFilterState(specType, value);
      applyFilters();
    });
    
    // Add click handler for input to prevent dropdown toggle
    input.addEventListener('click', function(e) {
      console.log('Input clicked, preventing dropdown toggle');
      e.stopPropagation();
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.selection-filter-text')) {
      const allDropdowns = document.querySelectorAll('.filter-dropdown-menu');
      allDropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
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
    
    item.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent event bubbling
      
      const input = this.closest('.selection-filter-text').querySelector('.lumen-input-field');
      input.value = option;
      
      // Update filter state
      updateFieldFilterState(specType, option);
      
      // Apply filters in real-time
      applyFilters();
      
      // Close dropdown immediately after selection
      dropdownMenu.classList.remove('active');
      
      // Remove selected class from all items and add to current
      dropdownMenu.querySelectorAll('.filter-dropdown-item').forEach(item => {
        item.classList.remove('selected');
      });
      this.classList.add('selected');
    });
    
    dropdownMenu.appendChild(item);
  });
  
  return dropdownMenu;
}

// Toggle dropdown visibility with proper positioning
function toggleDropdown(dropdownMenu) {
  console.log('toggleDropdown called with:', dropdownMenu);
  
  // Close all other dropdowns first
  const allDropdowns = document.querySelectorAll('.filter-dropdown-menu');
  console.log('Found dropdowns:', allDropdowns.length);
  
  allDropdowns.forEach(dropdown => {
    if (dropdown !== dropdownMenu) {
      dropdown.classList.remove('active');
      console.log('Closed other dropdown');
    }
  });
  
  // Toggle current dropdown
  const isActive = dropdownMenu.classList.contains('active');
  console.log('Current dropdown active state:', isActive);
  
  if (!isActive) {
    // Position the dropdown correctly
    const field = dropdownMenu.closest('.selection-filter-text');
    const fieldRect = field.getBoundingClientRect();
    
    console.log('Field rect:', fieldRect);
    
    dropdownMenu.style.top = (fieldRect.bottom + 4) + 'px';
    dropdownMenu.style.left = fieldRect.left + 'px';
    dropdownMenu.style.width = fieldRect.width + 'px';
    
    console.log('Positioned dropdown at:', {
      top: dropdownMenu.style.top,
      left: dropdownMenu.style.left,
      width: dropdownMenu.style.width
    });
  }
  
  dropdownMenu.classList.toggle('active');
  console.log('Dropdown active state after toggle:', dropdownMenu.classList.contains('active'));
  
  // Force display block if active
  if (dropdownMenu.classList.contains('active')) {
    dropdownMenu.style.display = 'block';
    dropdownMenu.style.visibility = 'visible';
    dropdownMenu.style.opacity = '1';
    console.log('Forced dropdown to be visible');
  }
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
  // Clear any existing value for this spec type first
  if (specType === 'Wattage' || specType === 'Lumen' || specType === 'CCT' || 
      specType === 'Beam' || specType === 'CRI' || specType === 'UGR' || specType === 'Efficancy') {
    delete filterState.performanceSpecs[specType.toLowerCase()];
  } else if (specType === 'IP' || specType === 'IK' || specType === 'Finish Color') {
    delete filterState.technicalSpecs[specType.toLowerCase().replace(' ', '')];
  }
  
  // Only add the value if it's not empty
  if (value && value.trim() !== '') {
    if (specType === 'Wattage' || specType === 'Lumen' || specType === 'CCT' || 
        specType === 'Beam' || specType === 'CRI' || specType === 'UGR' || specType === 'Efficancy') {
      filterState.performanceSpecs[specType.toLowerCase()] = value.trim();
    } else if (specType === 'IP' || specType === 'IK' || specType === 'Finish Color') {
      filterState.technicalSpecs[specType.toLowerCase().replace(' ', '')] = value.trim();
    }
  }
  
  console.log('Field filter state updated:', filterState);
}

// Apply filters to products
function applyFilters() {
  console.log('Applying filters:', filterState);
  
  // Get all existing product cards from Webflow CMS
  const existingProductCards = document.querySelectorAll('.collection-item');
  
  console.log('Found', existingProductCards.length, 'product cards');
  
  existingProductCards.forEach((card, index) => {
    // Get CMS data attributes from the card
    const cmsData = getCMSDataFromCard(card);
    
    console.log(`Product ${index + 1}:`, cmsData);
    
    // Check if this product matches the filter criteria
    const shouldShow = checkProductMatchWithCMSData(cmsData);
    
    // Show/hide the card based on filter results
    if (shouldShow) {
      card.style.display = 'block';
      console.log(`Product "${cmsData.productCode}" - SHOWING`);
    } else {
      card.style.display = 'none';
      console.log(`Product "${cmsData.productCode}" - HIDDEN`);
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

// Get CMS data from Webflow collection item
function getCMSDataFromCard(card) {
  // Try to get data from Webflow's CMS attributes
  const cmsData = {
    productCode: '',
    name: '',
    family: '',
    shortDescription: '',
    fullDescription: '',
    wattage: '',
    lumen: '',
    cct: '',
    voltage: '',
    overviewTitle: '',
    ipRating: '',
    ikRating: '',
    beamAngle: '',
    cri: '',
    location: '',
    finishColor: '',
    searchTags: '',
    allText: '' // Will contain all text from the card for comprehensive searching
  };
  
  // Method 1: Try to get data from Webflow's data attributes (exact field names from CSV)
  if (card.dataset) {
    cmsData.productCode = card.dataset.productCode || card.dataset['product-code'] || '';
    cmsData.name = card.dataset.name || card.dataset['name-en'] || '';
    cmsData.family = card.dataset.family || card.dataset.familyname || '';
    cmsData.shortDescription = card.dataset.shortDescription || card.dataset['short-description'] || '';
    cmsData.fullDescription = card.dataset.fullDescription || card.dataset['full-description'] || '';
    cmsData.wattage = card.dataset.wattage || '';
    cmsData.lumen = card.dataset.lumen || '';
    cmsData.cct = card.dataset.cct || '';
    cmsData.voltage = card.dataset.voltage || '';
    cmsData.overviewTitle = card.dataset.overviewTitle || card.dataset['overview-title'] || '';
    cmsData.ipRating = card.dataset.ipRating || card.dataset['ip-rating'] || card.dataset.ip || '';
    cmsData.ikRating = card.dataset.ikRating || card.dataset['ik-rating'] || card.dataset.ik || '';
    cmsData.beamAngle = card.dataset.beamAngle || card.dataset['beam-angle'] || card.dataset.beam || '';
    cmsData.cri = card.dataset.cri || '';
    cmsData.location = card.dataset.location || '';
    cmsData.finishColor = card.dataset.finishColor || card.dataset['finish-color'] || '';
    cmsData.searchTags = card.dataset.searchTags || card.dataset['search-tags'] || card.dataset.tags || '';
  }
  
  // Method 2: Try to get data from Webflow's CMS binding elements (exact field names from CSV)
  const productCodeElement = card.querySelector('[data-wf-cms-bind="product-code"], [data-wf-cms-bind="productCode"]');
  if (productCodeElement) {
    cmsData.productCode = productCodeElement.textContent || productCodeElement.innerText || '';
  }
  
  const nameElement = card.querySelector('[data-wf-cms-bind="name-en"], [data-wf-cms-bind="name"]');
  if (nameElement) {
    cmsData.name = nameElement.textContent || nameElement.innerText || '';
  }
  
  const familyElement = card.querySelector('[data-wf-cms-bind="family"], [data-wf-cms-bind="familyname"]');
  if (familyElement) {
    cmsData.family = familyElement.textContent || familyElement.innerText || '';
  }
  
  const wattageElement = card.querySelector('[data-wf-cms-bind="wattage"]');
  if (wattageElement) {
    cmsData.wattage = wattageElement.textContent || wattageElement.innerText || '';
  }
  
  const lumenElement = card.querySelector('[data-wf-cms-bind="lumen"]');
  if (lumenElement) {
    cmsData.lumen = lumenElement.textContent || lumenElement.innerText || '';
  }
  
  const cctElement = card.querySelector('[data-wf-cms-bind="cct"]');
  if (cctElement) {
    cmsData.cct = cctElement.textContent || cctElement.innerText || '';
  }
  
  const ipElement = card.querySelector('[data-wf-cms-bind="ip-rating"], [data-wf-cms-bind="ip"], [data-wf-cms-bind="ipRating"]');
  if (ipElement) {
    cmsData.ipRating = ipElement.textContent || ipElement.innerText || '';
  }
  
  const ikElement = card.querySelector('[data-wf-cms-bind="ik-rating"], [data-wf-cms-bind="ik"], [data-wf-cms-bind="ikRating"]');
  if (ikElement) {
    cmsData.ikRating = ikElement.textContent || ikElement.innerText || '';
  }
  
  const beamElement = card.querySelector('[data-wf-cms-bind="beam-angle"], [data-wf-cms-bind="beam"], [data-wf-cms-bind="beamAngle"]');
  if (beamElement) {
    cmsData.beamAngle = beamElement.textContent || beamElement.innerText || '';
  }
  
  const criElement = card.querySelector('[data-wf-cms-bind="cri"]');
  if (criElement) {
    cmsData.cri = criElement.textContent || criElement.innerText || '';
  }
  
  const locationElement = card.querySelector('[data-wf-cms-bind="location"]');
  if (locationElement) {
    cmsData.location = locationElement.textContent || locationElement.innerText || '';
  }
  
  const finishColorElement = card.querySelector('[data-wf-cms-bind="finish-color"], [data-wf-cms-bind="finishColor"]');
  if (finishColorElement) {
    cmsData.finishColor = finishColorElement.textContent || finishColorElement.innerText || '';
  }
  
  // Look for Search Tags field specifically (this is the most important field!)
  const searchTagsElement = card.querySelector('[data-wf-cms-bind="search-tags"], [data-wf-cms-bind="searchTags"], [data-wf-cms-bind="tags"]');
  if (searchTagsElement) {
    cmsData.searchTags = searchTagsElement.textContent || searchTagsElement.innerText || '';
  }
  
  // Method 3: Fallback to visible text content
  if (!cmsData.productCode) {
    const mainCodeText = card.querySelector('.main-code-text');
    cmsData.productCode = mainCodeText ? mainCodeText.textContent : '';
  }
  
  if (!cmsData.shortDescription) {
    const itemDescription = card.querySelector('.item-description');
    cmsData.shortDescription = itemDescription ? itemDescription.textContent : '';
  }
  
  if (!cmsData.fullDescription) {
    const backTitle = card.querySelector('.back-title');
    cmsData.fullDescription = backTitle ? backTitle.textContent : '';
  }
  
  // Method 4: Get all text from wattage elements (back of card)
  const wattageElements = card.querySelectorAll('.wattage');
  const wattageTexts = Array.from(wattageElements).map(el => el.textContent).join(' ');
  
  // Method 5: Extract specific data patterns from wattage text
  if (!cmsData.cct) {
    const cctMatch = wattageTexts.match(/(\d{4}K)/g);
    if (cctMatch) {
      cmsData.cct = cctMatch.join(', ');
    }
  }
  
  if (!cmsData.ipRating) {
    const ipMatch = wattageTexts.match(/(IP\d{2})/g);
    if (ipMatch) {
      cmsData.ipRating = ipMatch.join(', ');
    }
  }
  
  if (!cmsData.ikRating) {
    const ikMatch = wattageTexts.match(/(IK\d{2})/g);
    if (ikMatch) {
      cmsData.ikRating = ikMatch.join(', ');
    }
  }
  
  if (!cmsData.beamAngle) {
    const beamMatch = wattageTexts.match(/(\d+°)/g);
    if (beamMatch) {
      cmsData.beamAngle = beamMatch.join(', ');
    }
  }
  
  if (!cmsData.lumen) {
    const lumenMatch = wattageTexts.match(/(\d+lm)/gi);
    if (lumenMatch) {
      cmsData.lumen = lumenMatch.join(', ');
    }
  }
  
  if (!cmsData.cri) {
    const criMatch = wattageTexts.match(/(CRI\s*\d+)/gi);
    if (criMatch) {
      cmsData.cri = criMatch.join(', ');
    }
  }
  
  // Method 6: Search in all descriptions and text content
  const allText = (cmsData.shortDescription + ' ' + cmsData.fullDescription + ' ' + wattageTexts).toLowerCase();
  cmsData.allText = allText;
  
  // Extract any missing data from all text
  if (!cmsData.ipRating) {
    const ipMatch = allText.match(/(ip\d{2})/gi);
    if (ipMatch) {
      cmsData.ipRating = ipMatch.join(', ');
    }
  }
  
  if (!cmsData.ikRating) {
    const ikMatch = allText.match(/(ik\d{2})/gi);
    if (ikMatch) {
      cmsData.ikRating = ikMatch.join(', ');
    }
  }
  
  if (!cmsData.beamAngle) {
    const beamMatch = allText.match(/(\d+°)/g);
    if (beamMatch) {
      cmsData.beamAngle = beamMatch.join(', ');
    }
  }
  
  if (!cmsData.lumen) {
    const lumenMatch = allText.match(/(\d+lm)/gi);
    if (lumenMatch) {
      cmsData.lumen = lumenMatch.join(', ');
    }
  }
  
  if (!cmsData.cri) {
    const criMatch = allText.match(/(cri\s*\d+)/gi);
    if (criMatch) {
      cmsData.cri = criMatch.join(', ');
    }
  }
  
  if (!cmsData.location) {
    if (allText.includes('outdoor') || allText.includes('exterior')) {
      cmsData.location = 'outdoor';
    } else if (allText.includes('indoor') || allText.includes('interior')) {
      cmsData.location = 'indoor';
    }
  }
  
  return cmsData;
}

// Check if a product matches the filter criteria using CMS data
function checkProductMatchWithCMSData(cmsData) {
  console.log('Checking product match for:', cmsData.productCode);
  console.log('CMS Data:', cmsData);
  console.log('Filter state:', filterState);
  
  // Check application type filters
  if (filterState.applicationType.length > 0) {
    const searchText = cmsData.allText;
    const hasMatchingApplication = filterState.applicationType.some(type => 
      searchText.includes(type.toLowerCase())
    );
    if (!hasMatchingApplication) {
      console.log('No matching application type found');
      return false;
    }
  }
  
  // Check mounting type filters
  if (filterState.mountingType.length > 0) {
    const searchText = cmsData.allText;
    const hasMatchingMounting = filterState.mountingType.some(type => 
      searchText.includes(type.toLowerCase())
    );
    if (!hasMatchingMounting) {
      console.log('No matching mounting type found');
      return false;
    }
  }
  
  // Check form factor filters
  if (filterState.formFactor.length > 0) {
    const searchText = cmsData.allText;
    const hasMatchingFormFactor = filterState.formFactor.some(type => 
      searchText.includes(type.toLowerCase())
    );
    if (!hasMatchingFormFactor) {
      console.log('No matching form factor found');
      return false;
    }
  }
  
  // Check performance specs - now prioritizing Search Tags field
  for (const [key, value] of Object.entries(filterState.performanceSpecs)) {
    if (value && value.trim() !== '') {
      const searchValue = value.toLowerCase().trim();
      console.log(`Searching for "${searchValue}" in CMS data`);
      
      let found = false;
      
      // First priority: Check Search Tags field (most accurate)
      if (cmsData.searchTags) {
        const searchTags = cmsData.searchTags.toLowerCase();
        // Use word boundaries for exact matching in search tags
        const regex = new RegExp(`\\b${searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        found = regex.test(searchTags);
        console.log(`Searching in Search Tags: ${cmsData.searchTags}, searching for: ${searchValue}, found: ${found}`);
      }
      
      // Second priority: Check specific CMS fields
      if (!found) {
        if (key === 'cct' && cmsData.cct) {
          const cctValues = cmsData.cct.toLowerCase().split(',').map(v => v.trim());
          found = cctValues.some(val => val === searchValue);
          console.log(`CCT values in CMS: ${cmsData.cct}, searching for: ${searchValue}, found: ${found}`);
        }
        
        if (key === 'lumen' && cmsData.lumen) {
          const lumenValues = cmsData.lumen.toLowerCase().split(',').map(v => v.trim());
          found = lumenValues.some(val => val === searchValue);
          console.log(`Lumen values in CMS: ${cmsData.lumen}, searching for: ${searchValue}, found: ${found}`);
        }
        
        if (key === 'beam' && cmsData.beamAngle) {
          const beamValues = cmsData.beamAngle.toLowerCase().split(',').map(v => v.trim());
          found = beamValues.some(val => val === searchValue);
          console.log(`Beam values in CMS: ${cmsData.beamAngle}, searching for: ${searchValue}, found: ${found}`);
        }
        
        if (key === 'cri' && cmsData.cri) {
          const criValues = cmsData.cri.toLowerCase().split(',').map(v => v.trim());
          found = criValues.some(val => val === searchValue);
          console.log(`CRI values in CMS: ${cmsData.cri}, searching for: ${searchValue}, found: ${found}`);
        }
        
        if (key === 'wattage' && cmsData.wattage) {
          // For wattage, look for exact wattage values in wattage field
          const wattageValues = cmsData.wattage.toLowerCase().split(',').map(v => v.trim());
          found = wattageValues.some(val => val === searchValue);
          console.log(`Wattage search in wattage field: ${cmsData.wattage}, searching for: ${searchValue}, found: ${found}`);
        }
      }
      
      // Third priority: Check in all text if not found in specific fields
      if (!found) {
        // Use word boundaries for more precise matching
        const regex = new RegExp(`\\b${searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        found = regex.test(cmsData.allText);
        console.log(`Searching in all text for "${searchValue}", found: ${found}`);
      }
      
      if (!found) {
        console.log(`"${searchValue}" not found in CMS data`);
        return false;
      } else {
        console.log(`"${searchValue}" found in CMS data`);
      }
    }
  }
  
  // Check technical specs - now prioritizing Search Tags field
  for (const [key, value] of Object.entries(filterState.technicalSpecs)) {
    if (value && value.trim() !== '') {
      const searchValue = value.toLowerCase().trim();
      console.log(`Searching for "${searchValue}" in CMS data`);
      
      let found = false;
      
      // First priority: Check Search Tags field (most accurate)
      if (cmsData.searchTags) {
        const searchTags = cmsData.searchTags.toLowerCase();
        // Use word boundaries for exact matching in search tags
        const regex = new RegExp(`\\b${searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        found = regex.test(searchTags);
        console.log(`Searching in Search Tags: ${cmsData.searchTags}, searching for: ${searchValue}, found: ${found}`);
      }
      
      // Second priority: Check specific CMS fields
      if (!found) {
        if (key === 'ip' && cmsData.ipRating) {
          const ipValues = cmsData.ipRating.toLowerCase().split(',').map(v => v.trim());
          found = ipValues.some(val => val === searchValue);
          console.log(`IP values in CMS: ${cmsData.ipRating}, searching for: ${searchValue}, found: ${found}`);
        }
        
        if (key === 'ik' && cmsData.ikRating) {
          const ikValues = cmsData.ikRating.toLowerCase().split(',').map(v => v.trim());
          found = ikValues.some(val => val === searchValue);
          console.log(`IK values in CMS: ${cmsData.ikRating}, searching for: ${searchValue}, found: ${found}`);
        }
        
        if (key === 'outdoor' && cmsData.location) {
          found = cmsData.location.toLowerCase() === searchValue;
          console.log(`Location values in CMS: ${cmsData.location}, searching for: ${searchValue}, found: ${found}`);
        }
        
        if (key === 'indoor' && cmsData.location) {
          found = cmsData.location.toLowerCase() === searchValue;
          console.log(`Location values in CMS: ${cmsData.location}, searching for: ${searchValue}, found: ${found}`);
        }
        
        if (key === 'finishcolor' && cmsData.finishColor) {
          const finishValues = cmsData.finishColor.toLowerCase().split(',').map(v => v.trim());
          found = finishValues.some(val => val === searchValue);
          console.log(`Finish Color values in CMS: ${cmsData.finishColor}, searching for: ${searchValue}, found: ${found}`);
        }
      }
      
      // Third priority: Check in all text if not found in specific fields
      if (!found) {
        // Use word boundaries for more precise matching
        const regex = new RegExp(`\\b${searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        found = regex.test(cmsData.allText);
        console.log(`Searching in all text for "${searchValue}", found: ${found}`);
      }
      
      if (!found) {
        console.log(`"${searchValue}" not found in CMS data`);
        return false;
      } else {
        console.log(`"${searchValue}" found in CMS data`);
      }
    }
  }
  
  console.log('Product matches all filter criteria');
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

// Initialize the apply filter button
function initializeApplyFilterButton() {
  const applyButton = document.querySelector('.filter-apply-button');
  if (applyButton) {
    applyButton.addEventListener('click', function() {
      console.log('Apply filter button clicked');
      applyFilters();
      closeAllDropdowns();
    });
  }
}

// Initialize the reset filter button
function initializeResetFilterButton() {
  const resetButton = document.querySelector('.filter-reset-button');
  if (resetButton) {
    resetButton.addEventListener('click', function() {
      console.log('Reset filter button clicked');
      resetAllFilters();
    });
  }
}

// Reset all filters and show all products
function resetAllFilters() {
  console.log('Resetting all filters...');
  
  // Reset filter state
  filterState = {
    applicationType: [],
    mountingType: [],
    formFactor: [],
    performanceSpecs: {
      cct: '',
      lumen: '',
      beam: '',
      cri: ''
    },
    technicalSpecs: {
      ip: '',
      ik: '',
      outdoor: '',
      indoor: ''
    }
  };
  
  // Reset all checkboxes and their text colors
  const allCheckboxes = document.querySelectorAll('.filter-checkmark');
  allCheckboxes.forEach(checkbox => {
    checkbox.classList.remove('active');
    // Reset the wrapper to remove active state from text
    const wrapper = checkbox.closest('.sub-filter-wrapper');
    if (wrapper) {
      wrapper.classList.remove('active');
    }
  });
  
  // Reset all input fields
  const allInputFields = document.querySelectorAll('.lumen-input-field');
  allInputFields.forEach(input => {
    input.value = '';
  });
  
  // Reset all dropdown selections
  const allDropdownItems = document.querySelectorAll('.filter-dropdown-item');
  allDropdownItems.forEach(item => {
    item.classList.remove('selected');
  });
  
  // Show all products
  const existingProductCards = document.querySelectorAll('.collection-item');
  existingProductCards.forEach(card => {
    card.style.display = 'block';
  });
  
  // Hide empty state message if it exists
  const emptyState = document.querySelector('.filter-empty-state');
  if (emptyState) {
    emptyState.remove();
  }
  
  console.log('All filters reset, all products shown');
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

// Close all dropdowns
function closeAllDropdowns() {
  const dropdowns = document.querySelectorAll('.filter-dropdown-menu');
  dropdowns.forEach(dropdown => {
    dropdown.classList.remove('active');
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded - Initializing filter');
  initializeFilter();
  initializeMainSearch(); // Add main search initialization
  
  // Ensure search bar is visible immediately
  setTimeout(() => {
    ensureSearchBarVisibility();
  }, 100);
  
  // Test dropdown functionality after a short delay
  setTimeout(() => {
    console.log('Testing dropdown functionality...');
    const dropdownArrows = document.querySelectorAll('.sub-filter-dropdown');
    console.log('Found dropdown arrows:', dropdownArrows.length);
    
    dropdownArrows.forEach((arrow, index) => {
      console.log(`Dropdown arrow ${index + 1}:`, arrow);
      console.log(`Arrow clickable:`, arrow.style.pointerEvents);
      console.log(`Arrow cursor:`, arrow.style.cursor);
      console.log(`Arrow z-index:`, arrow.style.zIndex);
    });
  }, 1000);
  
  // Run delayed cleanup for Webflow elements
  setTimeout(() => {
    console.log('Running delayed cleanup for Webflow elements...');
    cleanupDuplicateText();
    fixSearchBarAlignment();
    aggressiveSearchBarCleanup();
  }, 3000);
});

// Also initialize when Webflow loads
if (typeof Webflow !== 'undefined') {
  Webflow.push(function() {
    console.log('Webflow loaded - Initializing filter');
    initializeFilter();
    initializeMainSearch(); // Add main search initialization
    
    // Ensure search bar is visible after Webflow loads
    setTimeout(() => {
      ensureSearchBarVisibility();
    }, 100);
    
    // Run delayed cleanup for Webflow elements
    setTimeout(() => {
      console.log('Running delayed cleanup for Webflow elements...');
      cleanupDuplicateText();
      fixSearchBarAlignment();
      aggressiveSearchBarCleanup();
    }, 3000);
  });
}

// Initialize main header search functionality
function initializeMainSearch() {
  console.log('Initializing main search...');
  
  // Check if we've already initialized to prevent duplicates
  if (window.searchInitialized) {
    console.log('Search already initialized, skipping...');
    return;
  }
  
  // First, let's check what elements we actually have
  console.log('Available elements:', {
    searchInputStyle: document.querySelector('.search-input-style'),
    searchWrapper: document.querySelector('.search-wrapper'),
    searchIcon: document.querySelector('.search-icon'),
    allInputs: document.querySelectorAll('input'),
    allElements: document.querySelectorAll('*')
  });
  
  // Try to find the search input with multiple strategies
  let searchInput = null;
  
  // Strategy 1: Look for input inside search containers
  const searchContainers = document.querySelectorAll('.search-input-style, .search-wrapper');
  console.log('Found search containers:', searchContainers.length);
  for (const container of searchContainers) {
    const inputs = container.querySelectorAll('input');
    console.log('Inputs in container:', inputs.length);
    if (inputs.length > 0) {
      searchInput = inputs[0]; // Use the first input
      console.log('Found input in container:', container.className);
      break;
    }
  }
  
  // Strategy 2: Look for input by placeholder
  if (!searchInput) {
    searchInput = document.querySelector('input[placeholder*="Search"], input[placeholder*="search"]');
    if (searchInput) {
      console.log('Found input by placeholder');
    }
  }
  
  // Strategy 3: Look for any input that might be a search input
  if (!searchInput) {
    const allInputs = document.querySelectorAll('input');
    for (const input of allInputs) {
      if (input.placeholder && input.placeholder.toLowerCase().includes('search')) {
        searchInput = input;
        console.log('Found input by placeholder text');
        break;
      }
    }
  }
  
  // Strategy 4: If no input exists, create one
  if (!searchInput) {
    console.log('No search input found, creating one...');
    const searchContainer = document.querySelector('.search-input-style, .search-wrapper');
    if (searchContainer) {
      // Check if there's already an input in the container
      const existingInput = searchContainer.querySelector('input');
      if (existingInput) {
        searchInput = existingInput;
        console.log('Found existing input in container');
      } else {
        // Create a new input element only if none exists
        searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search products...';
        searchInput.setAttribute('data-search-input', 'true');
        searchInput.style.cssText = `
          background: transparent !important;
          border: none !important;
          outline: none !important;
          width: 100% !important;
          height: 100% !important;
          padding: 0 40px 0 40px !important;
          margin: 0 !important;
          font-family: inherit !important;
          font-size: inherit !important;
          color: #000 !important;
          cursor: text !important;
          pointer-events: auto !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          z-index: 1000 !important;
          display: block !important;
          opacity: 1 !important;
          visibility: visible !important;
          user-select: text !important;
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
        `;
        
        // Make container relative positioned
        searchContainer.style.position = 'relative';
        
        // Add the input to the container
        searchContainer.appendChild(searchInput);
        console.log('Created new search input');
      }
    }
  }
  
  if (searchInput) {
    console.log('Search input found/created:', searchInput);
    
    // Ensure the input is properly configured
    searchInput.type = 'text';
    searchInput.setAttribute('autocomplete', 'off');
    searchInput.setAttribute('spellcheck', 'false');
    
    // Make sure it's not disabled or readonly
    searchInput.disabled = false;
    searchInput.readOnly = false;
    
    // Add event listeners for real-time search
    searchInput.addEventListener('input', function(e) {
      console.log('Input event triggered:', e);
      const searchValue = this.value.trim();
      console.log('Main search input:', searchValue);
      
      // Hide placeholder and icon when user starts typing
      if (searchValue !== '') {
        hideSearchPlaceholderAndIcon();
      } else {
        showSearchPlaceholderAndIcon();
      }
      
      if (searchValue === '') {
        // If search is empty, show all products
        showAllProducts();
      } else {
        // Apply search filter
        applySearchFilter(searchValue);
      }
    });
    
    // Add event listener for Enter key
    searchInput.addEventListener('keypress', function(e) {
      console.log('Keypress event:', e.key);
      if (e.key === 'Enter') {
        const searchValue = this.value.trim();
        if (searchValue !== '') {
          applySearchFilter(searchValue);
        }
      }
    });
    
    // Add focus event to handle placeholder and icon
    searchInput.addEventListener('focus', function() {
      console.log('Search input focused');
      this.style.color = '#000'; // Ensure text is visible when typing
      
      // Hide placeholder text and icon when focused
      hideSearchPlaceholderAndIcon();
    });
    
    // Add blur event
    searchInput.addEventListener('blur', function() {
      console.log('Search input blurred');
      
      // Show placeholder and icon if input is empty
      if (this.value.trim() === '') {
        showSearchPlaceholderAndIcon();
      }
    });
    
    // Add click event to ensure it's clickable
    searchInput.addEventListener('click', function(e) {
      console.log('Search input clicked');
      e.stopPropagation(); // Prevent event bubbling
    });
    
    // Add event listener for search icon click (if exists)
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
      searchIcon.addEventListener('click', function() {
        console.log('Search icon clicked');
        // Focus the input when icon is clicked
        searchInput.focus();
        const searchValue = searchInput.value.trim();
        if (searchValue !== '') {
          applySearchFilter(searchValue);
        }
      });
    }
    
    // Also make the entire search container clickable to focus the input
    const searchContainer = searchInput.closest('.search-input-style, .search-wrapper');
    if (searchContainer) {
      searchContainer.addEventListener('click', function(e) {
        console.log('Search container clicked');
        // Don't focus if clicking on the icon
        if (!e.target.classList.contains('search-icon')) {
          searchInput.focus();
        }
      });
    }
    
    // Clean up any duplicate text elements
    cleanupDuplicateText();
    
    // Fix search bar alignment
    fixSearchBarAlignment();
    
    // Perform aggressive cleanup
    aggressiveSearchBarCleanup();
    
    // Ensure search bar is always visible
    setTimeout(() => {
      ensureSearchBarVisibility();
      // Also clean up duplicates after a delay to catch any late-rendering elements
      cleanupDuplicateText();
      fixSearchBarAlignment();
      aggressiveSearchBarCleanup();
    }, 1000);
    
    // Mark as initialized to prevent duplicates
    window.searchInitialized = true;
    console.log('Main search initialized successfully');
    
    // Set up periodic cleanup to catch any late-rendering duplicate elements
    setInterval(() => {
      cleanupDuplicateText();
      fixSearchBarAlignment();
      aggressiveSearchBarCleanup();
    }, 2000); // Check every 2 seconds
  } else {
    console.log('Failed to find or create search input');
  }
}

// Function to ensure search bar is always visible
function ensureSearchBarVisibility() {
  console.log('Ensuring search bar visibility...');
  
  // Find all search inputs and containers
  const searchInputs = document.querySelectorAll('.search-input-style input, .search-wrapper input, input[data-search-input="true"]');
  const searchContainers = document.querySelectorAll('.search-input-style, .search-wrapper');
  
  // Ensure search inputs are visible
  searchInputs.forEach(input => {
    input.style.display = 'block';
    input.style.visibility = 'visible';
    input.style.opacity = '1';
    input.style.pointerEvents = 'auto';
    input.style.position = 'relative';
    input.style.zIndex = '1000';
    console.log('Ensured input visibility:', input);
  });
  
  // Ensure search containers are visible
  searchContainers.forEach(container => {
    container.style.display = 'block';
    container.style.visibility = 'visible';
    container.style.opacity = '1';
    container.style.pointerEvents = 'auto';
    container.style.position = 'relative';
    container.style.overflow = 'visible';
    console.log('Ensured container visibility:', container);
  });
}

// Function to fix search bar alignment and remove duplicates
function fixSearchBarAlignment() {
  console.log('Fixing search bar alignment...');
  
  // Try multiple selectors to find the search container
  const searchContainer = document.querySelector('.search-input-style, .search-wrapper, [class*="search"], [class*="Search"]');
  if (!searchContainer) {
    console.log('No search container found');
    return;
  }
  
  // Ensure proper positioning
  searchContainer.style.position = 'relative';
  searchContainer.style.display = 'flex';
  searchContainer.style.alignItems = 'center';
  searchContainer.style.justifyContent = 'center';
  
  // Find the main search input
  const mainSearchInput = searchContainer.querySelector('input');
  if (mainSearchInput) {
    // Ensure the input is properly positioned
    mainSearchInput.style.position = 'relative';
    mainSearchInput.style.zIndex = '1000';
    mainSearchInput.style.width = '100%';
    mainSearchInput.style.height = '100%';
    mainSearchInput.style.border = 'none';
    mainSearchInput.style.outline = 'none';
    mainSearchInput.style.background = 'transparent';
    mainSearchInput.style.color = '#000';
    mainSearchInput.style.fontSize = 'inherit';
    mainSearchInput.style.fontFamily = 'inherit';
    
    console.log('Fixed main search input positioning');
  }
  
  // Hide any duplicate elements within the search container
  const allElements = searchContainer.querySelectorAll('*');
  const searchTextElements = [];
  
  allElements.forEach(el => {
    if (el.tagName !== 'INPUT' && el.tagName !== 'IMG') {
      const text = el.textContent.trim();
      if (text === 'Search products...' || text === 'Search products') {
        searchTextElements.push(el);
      }
    }
  });
  
  // Keep only the first text element, hide the rest
  if (searchTextElements.length > 1) {
    console.log('Found duplicate text elements in search container:', searchTextElements.length);
    for (let i = 1; i < searchTextElements.length; i++) {
      searchTextElements[i].style.display = 'none';
      searchTextElements[i].style.visibility = 'hidden';
      searchTextElements[i].style.opacity = '0';
    }
  }
}

// Function to aggressively clean up search bar issues
function aggressiveSearchBarCleanup() {
  console.log('Performing aggressive search bar cleanup...');
  
  // Find all elements that might contain search text
  const allElements = document.querySelectorAll('*');
  const searchTextElements = [];
  
  allElements.forEach(el => {
    const text = el.textContent.trim();
    if (text === 'Search products...' || text === 'Search products') {
      searchTextElements.push(el);
    }
  });
  
  console.log('Found search text elements:', searchTextElements.length);
  
  // If we have multiple elements with the same text, keep only the first one
  if (searchTextElements.length > 1) {
    console.log('Multiple search text elements found, hiding duplicates...');
    for (let i = 1; i < searchTextElements.length; i++) {
      const element = searchTextElements[i];
      element.style.display = 'none';
      element.style.visibility = 'hidden';
      element.style.opacity = '0';
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      console.log('Hidden duplicate element:', element);
    }
  }
  
  // Also check for any input elements that might be duplicates
  const searchInputs = document.querySelectorAll('input[placeholder*="Search"], input[placeholder*="search"]');
  if (searchInputs.length > 1) {
    console.log('Multiple search inputs found, keeping only the first one');
    for (let i = 1; i < searchInputs.length; i++) {
      searchInputs[i].style.display = 'none';
      searchInputs[i].style.visibility = 'hidden';
      searchInputs[i].style.opacity = '0';
    }
  }
}

// Apply search filter using existing filter logic
function applySearchFilter(searchValue) {
  console.log('Applying search filter:', searchValue);
  
  // Get all existing product cards from Webflow CMS
  const existingProductCards = document.querySelectorAll('.collection-item');
  
  console.log('Found', existingProductCards.length, 'product cards for search');
  
  let foundProducts = 0;
  
  existingProductCards.forEach((card, index) => {
    // Get CMS data attributes from the card (reuse existing function)
    const cmsData = getCMSDataFromCard(card);
    
    // Check if this product matches the search criteria
    const shouldShow = checkProductMatchSearch(cmsData, searchValue);
    
    // Show/hide the card based on search results
    if (shouldShow) {
      card.style.display = 'block';
      foundProducts++;
      console.log(`Product "${cmsData.productCode}" - SHOWING (search match)`);
    } else {
      card.style.display = 'none';
      console.log(`Product "${cmsData.productCode}" - HIDDEN (no search match)`);
    }
  });
  
  // Show empty state if no products are visible
  if (foundProducts === 0) {
    showSearchEmptyState(searchValue);
  } else {
    hideSearchEmptyState();
  }
  
  console.log(`Search completed. Found ${foundProducts} matching products`);
}

// Check if a product matches the search criteria
function checkProductMatchSearch(cmsData, searchValue) {
  const searchLower = searchValue.toLowerCase().trim();
  
  // Search in multiple fields with priority order
  const searchFields = [
    cmsData.productCode,           // Product code (highest priority)
    cmsData.name,                  // Product name
    cmsData.family,                // Family name
    cmsData.searchTags,            // Search tags (comprehensive data)
    cmsData.wattage,               // Wattage
    cmsData.lumen,                 // Lumen
    cmsData.cct,                   // CCT
    cmsData.ipRating,              // IP Rating
    cmsData.ikRating,              // IK Rating
    cmsData.beamAngle,             // Beam Angle
    cmsData.cri,                   // CRI
    cmsData.location,              // Location (Indoor/Outdoor)
    cmsData.finishColor,           // Finish Color
    cmsData.shortDescription,      // Short description
    cmsData.allText                // All text (fallback)
  ];
  
  // Check each field for matches
  for (const field of searchFields) {
    if (field && field.toLowerCase().includes(searchLower)) {
      console.log(`Search match found in field: "${field}" for search: "${searchValue}"`);
      return true;
    }
  }
  
  // Also check for exact word boundaries in search tags (most comprehensive field)
  if (cmsData.searchTags) {
    const searchTags = cmsData.searchTags.toLowerCase();
    const regex = new RegExp(`\\b${searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(searchTags)) {
      console.log(`Exact word match found in search tags for: "${searchValue}"`);
      return true;
    }
  }
  
  console.log(`No search match found for: "${searchValue}"`);
  return false;
}

// Show all products (when search is cleared)
function showAllProducts() {
  console.log('Showing all products (search cleared)');
  
  const existingProductCards = document.querySelectorAll('.collection-item');
  existingProductCards.forEach(card => {
    card.style.display = 'block';
  });
  
  // Hide any empty state messages
  hideSearchEmptyState();
  hideEmptyState(); // Also hide filter empty state
}

// Show empty state for search
function showSearchEmptyState(searchValue) {
  const productContainer = document.querySelector('.cards-container');
  if (productContainer) {
    // Remove existing search empty state
    const existingEmpty = productContainer.querySelector('.search-empty-state');
    if (existingEmpty) {
      existingEmpty.remove();
    }
    
    // Create new empty state
    const emptyState = document.createElement('div');
    emptyState.className = 'search-empty-state w-dyn-empty';
    emptyState.innerHTML = `<p>No products found for "${searchValue}". Try different keywords like product code, family name, wattage, or specifications.</p>`;
    productContainer.querySelector('.collection-list-wrapper').appendChild(emptyState);
  }
}

// Hide empty state for search
function hideSearchEmptyState() {
  const emptyState = document.querySelector('.search-empty-state');
  if (emptyState) {
    emptyState.remove();
  }
}

// Function to hide placeholder text and search icon
function hideSearchPlaceholderAndIcon() {
  console.log('Hiding placeholder and icon');
  
  // Hide search icon only
  const searchIcon = document.querySelector('.search-icon');
  if (searchIcon) {
    searchIcon.style.opacity = '0';
    searchIcon.style.visibility = 'hidden';
  }
  
  // Ensure the search input itself is always visible
  const searchInputs = document.querySelectorAll('.search-input-style input, .search-wrapper input, input[data-search-input="true"]');
  searchInputs.forEach(input => {
    input.style.display = 'block';
    input.style.visibility = 'visible';
    input.style.opacity = '1';
    input.style.pointerEvents = 'auto';
  });
}

// Function to show placeholder text and search icon
function showSearchPlaceholderAndIcon() {
  console.log('Showing placeholder and icon');
  
  // Show search icon only
  const searchIcon = document.querySelector('.search-icon');
  if (searchIcon) {
    searchIcon.style.opacity = '0.3';
    searchIcon.style.visibility = 'visible';
  }
  
  // Ensure the search input itself is always visible
  const searchInputs = document.querySelectorAll('.search-input-style input, .search-wrapper input, input[data-search-input="true"]');
  searchInputs.forEach(input => {
    input.style.display = 'block';
    input.style.visibility = 'visible';
    input.style.opacity = '1';
    input.style.pointerEvents = 'auto';
  });
}

// Function to clean up duplicate text elements
function cleanupDuplicateText() {
  console.log('Cleaning up duplicate text elements...');
  
  // Find all search containers
  const searchContainers = document.querySelectorAll('.search-input-style, .search-wrapper');
  
  searchContainers.forEach(container => {
    // Find all text elements that might be duplicates
    const textElements = container.querySelectorAll('div, span, p, label');
    const searchTexts = [];
    
    textElements.forEach(el => {
      const text = el.textContent.trim();
      if (text.toLowerCase().includes('search') && text.toLowerCase().includes('product')) {
        searchTexts.push(el);
      }
    });
    
    // If we find multiple elements with "Search products" text, keep only the first one
    if (searchTexts.length > 1) {
      console.log('Found duplicate search text elements:', searchTexts.length);
      for (let i = 1; i < searchTexts.length; i++) {
        searchTexts[i].style.display = 'none';
        searchTexts[i].style.visibility = 'hidden';
        searchTexts[i].style.opacity = '0';
        console.log('Hidden duplicate text element:', searchTexts[i]);
      }
    }
  });
  
  // Also check for any input elements with duplicate placeholders
  const searchInputs = document.querySelectorAll('input[placeholder*="Search"], input[placeholder*="search"]');
  if (searchInputs.length > 1) {
    console.log('Found multiple search inputs:', searchInputs.length);
    // Keep only the first input visible, hide the rest
    for (let i = 1; i < searchInputs.length; i++) {
      searchInputs[i].style.display = 'none';
      searchInputs[i].style.visibility = 'hidden';
      searchInputs[i].style.opacity = '0';
      console.log('Hidden duplicate search input:', searchInputs[i]);
    }
  }
  
  // Remove any duplicate text that might be outside search containers
  const allTextElements = document.querySelectorAll('div, span, p, label');
  const duplicateSearchTexts = [];
  
  allTextElements.forEach(el => {
    const text = el.textContent.trim();
    if (text === 'Search products...' || text === 'Search products') {
      duplicateSearchTexts.push(el);
    }
  });
  
  if (duplicateSearchTexts.length > 1) {
    console.log('Found duplicate "Search products" text elements:', duplicateSearchTexts.length);
    // Keep only the first one, hide the rest
    for (let i = 1; i < duplicateSearchTexts.length; i++) {
      duplicateSearchTexts[i].style.display = 'none';
      duplicateSearchTexts[i].style.visibility = 'hidden';
      duplicateSearchTexts[i].style.opacity = '0';
      console.log('Hidden duplicate text element outside containers:', duplicateSearchTexts[i]);
    }
  }
}
