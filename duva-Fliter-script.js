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
    
    // Add click handler for dropdown toggle - now works with the dropdown arrow
    const dropdownArrow = field.querySelector('.sub-filter-dropdown');
    if (dropdownArrow) {
      dropdownArrow.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDropdown(dropdownMenu);
      });
    }
    
    // Also allow clicking on the field itself to toggle dropdown
    field.addEventListener('click', function(e) {
      if (e.target === input || e.target.closest('.sub-filter-dropdown')) return; // Don't toggle when clicking input or arrow
      e.stopPropagation();
      toggleDropdown(dropdownMenu);
    });
    
    // Add input event listener for real-time filtering
    input.addEventListener('input', function() {
      const value = this.value.trim();
      updateFieldFilterState(specType, value);
      applyFilters();
    });
    
    // Add click handler for input to prevent dropdown toggle
    input.addEventListener('click', function(e) {
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
  // Close all other dropdowns first
  const allDropdowns = document.querySelectorAll('.filter-dropdown-menu');
  allDropdowns.forEach(dropdown => {
    if (dropdown !== dropdownMenu) {
      dropdown.classList.remove('active');
    }
  });
  
  // Toggle current dropdown
  const isActive = dropdownMenu.classList.contains('active');
  
  if (!isActive) {
    // Position the dropdown correctly
    const field = dropdownMenu.closest('.selection-filter-text');
    const fieldRect = field.getBoundingClientRect();
    
    dropdownMenu.style.top = (fieldRect.bottom + 4) + 'px';
    dropdownMenu.style.left = fieldRect.left + 'px';
    dropdownMenu.style.width = fieldRect.width + 'px';
  }
  
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
});

// Also initialize when Webflow loads
if (typeof Webflow !== 'undefined') {
  Webflow.push(function() {
    console.log('Webflow loaded - Initializing filter');
    initializeFilter();
    initializeMainSearch(); // Add main search initialization
  });
}

// Initialize main header search functionality
function initializeMainSearch() {
  console.log('Initializing main search...');
  
  // Find the main search input - try multiple approaches
  let searchInput = document.querySelector('.search-input-style input');
  
  if (!searchInput) {
    // Try finding the input within the search wrapper
    const searchWrapper = document.querySelector('.search-wrapper');
    if (searchWrapper) {
      searchInput = searchWrapper.querySelector('input');
    }
  }
  
  if (!searchInput) {
    // Try finding by placeholder text
    searchInput = document.querySelector('input[placeholder*="Search"], input[placeholder*="search"]');
  }
  
  if (!searchInput) {
    // Try finding any input within search containers
    const searchContainers = document.querySelectorAll('.search-input-style, .search-wrapper');
    for (const container of searchContainers) {
      searchInput = container.querySelector('input');
      if (searchInput) break;
    }
  }
  
  if (searchInput) {
    console.log('Found main search input:', searchInput);
    
    // Make sure the input is properly configured
    searchInput.type = 'text';
    searchInput.setAttribute('autocomplete', 'off');
    
    // Add event listeners for real-time search
    searchInput.addEventListener('input', function() {
      const searchValue = this.value.trim();
      console.log('Main search input:', searchValue);
      
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
      // The placeholder will automatically hide when user starts typing
      // The icon will remain visible as per your design
    });
    
    // Add blur event
    searchInput.addEventListener('blur', function() {
      console.log('Search input blurred');
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
        // Don't focus if clicking on the icon
        if (!e.target.classList.contains('search-icon')) {
          searchInput.focus();
        }
      });
    }
    
    console.log('Main search initialized successfully');
  } else {
    console.log('Main search input not found - check HTML structure');
    // Log available elements for debugging
    console.log('Available search-related elements:', {
      searchInputStyle: document.querySelector('.search-input-style'),
      searchWrapper: document.querySelector('.search-wrapper'),
      searchIcon: document.querySelector('.search-icon'),
      allInputs: document.querySelectorAll('input')
    });
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
