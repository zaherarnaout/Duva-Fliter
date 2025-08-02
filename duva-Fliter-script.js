
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
    cri: ''
  },
  technicalSpecs: {
    ip: '',
    ik: '',
    outdoor: '',
    indoor: '',
    finishcolor: ''
  }
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
      filterArrow.style.transform = 'rotate(0deg)';
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
        filterArrow.style.transform = 'rotate(0deg)';
      }
    } else {
      // Expand
      filterBg.classList.add('expanded');
      if (filterArrow) {
        filterArrow.style.transform = 'rotate(180deg)';
      }
    }
    
  }
}

// Initialize filter fields (dropdowns and inputs)
function initializeFilterFields() {
  // Initialize dropdowns
  const dropdownFields = document.querySelectorAll('.selection-filter-text');
  console.log('Found', dropdownFields.length, 'dropdown fields');
  
  dropdownFields.forEach((field, index) => {
    const fieldType = getFieldType(field);
    const options = DROPDOWN_OPTIONS[fieldType] || [];
    
    console.log(`Dropdown ${index}:`, {
      fieldType: fieldType,
      optionsCount: options.length,
      fieldElement: field
    });
    
    if (options.length > 0) {
      // Replace the div with an input field that can also trigger dropdowns
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'filter-input-field';
      input.placeholder = 'Enter value';
      input.style.cssText = `
        border: none;
        background: transparent;
        padding: 4px 8px;
        font-size: 12px;
        width: 100px;
        text-align: center;
        color: #333;
        font-weight: 500;
      `;
      
      // Replace the existing content
      const existingContent = field.querySelector('.text-filed');
      if (existingContent) {
        existingContent.replaceWith(input);
        console.log('Replaced existing content with input');
      }
      
      // Create dropdown menu
      const dropdownMenu = document.createElement('div');
      dropdownMenu.className = 'filter-dropdown-menu';
      dropdownMenu.style.cssText = `
        position: fixed;
        background-color: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
        display: none;
        margin-top: 4px;
        scrollbar-width: none;
        -ms-overflow-style: none;
      `;
      
      // Add options to dropdown
      options.forEach(option => {
        const item = document.createElement('div');
        item.className = 'filter-dropdown-item';
        item.textContent = option;
        item.style.cssText = `
          padding: 12px 16px;
          cursor: pointer;
          color: #666666;
          font-size: 14px;
          transition: all 0.2s ease;
        `;
        
        item.addEventListener('click', () => {
          input.value = option;
          updateFieldFilterState(fieldType, option);
          dropdownMenu.classList.remove('active');
          applyFilters();
        });
        
        dropdownMenu.appendChild(item);
      });
      
      // Add dropdown to field
      field.appendChild(dropdownMenu);
      console.log('Added dropdown menu with', options.length, 'options');
      
      // Add click handler to input
      input.addEventListener('click', () => {
        console.log('Input clicked, toggling dropdown');
        toggleDropdown(dropdownMenu);
      });
      
      // Add input handler for manual entry
      input.addEventListener('input', () => {
        updateFieldFilterState(fieldType, input.value);
        applyFilters();
      });
      
      // Add dropdown arrow click handler
      const dropdownArrow = field.querySelector('.sub-filter-dropdown');
      if (dropdownArrow) {
        dropdownArrow.addEventListener('click', (e) => {
          e.stopPropagation();
          console.log('Dropdown arrow clicked');
          toggleDropdown(dropdownMenu);
        });
      } else {
        console.log('No dropdown arrow found for field', index);
      }
    }
  });
  
  // Initialize checkboxes
  initializeFilterCheckboxes();
}

// Get field type from the field element
function getFieldType(field) {
  const text = field.textContent || '';
  if (text.includes('Wattage')) return 'Wattage';
  if (text.includes('CCT')) return 'CCT';
  if (text.includes('Beam')) return 'Beam';
  if (text.includes('CRI')) return 'CRI';
  if (text.includes('IP')) return 'IP';
  if (text.includes('IK')) return 'IK';
  if (text.includes('Finish')) return 'Finish Color';
  return 'Wattage'; // Default
}

// Initialize filter checkboxes
function initializeFilterCheckboxes() {
  const checkboxes = document.querySelectorAll('.sub-filter-wrapper');
  
  checkboxes.forEach((wrapper, index) => {
    const text = wrapper.querySelector('.sub-filter-wattage');
    const checkmark = wrapper.querySelector('.filter-checkmark');
    
    if (text && checkmark) {
      // Add click handler to the entire wrapper
      wrapper.addEventListener('click', () => {
        const isActive = wrapper.classList.contains('active');
        
        if (isActive) {
          // Uncheck
          wrapper.classList.remove('active');
          checkmark.classList.remove('active');
          const filterType = getCheckboxFilterType(text.textContent);
          const filterValue = text.textContent.trim().toLowerCase();
          
          if (filterType === 'applicationType') {
            filterState.applicationType = filterState.applicationType.filter(v => v !== filterValue);
          } else if (filterType === 'mountingType') {
            filterState.mountingType = filterState.mountingType.filter(v => v !== filterValue);
          } else if (filterType === 'formFactor') {
            filterState.formFactor = filterState.formFactor.filter(v => v !== filterValue);
          }
        } else {
          // Check
          wrapper.classList.add('active');
          checkmark.classList.add('active');
          const filterType = getCheckboxFilterType(text.textContent);
          const filterValue = text.textContent.trim().toLowerCase();
          
          if (filterType === 'applicationType') {
            if (!filterState.applicationType.includes(filterValue)) {
              filterState.applicationType.push(filterValue);
            }
          } else if (filterType === 'mountingType') {
            if (!filterState.mountingType.includes(filterValue)) {
              filterState.mountingType.push(filterValue);
            }
          } else if (filterType === 'formFactor') {
            if (!filterState.formFactor.includes(filterValue)) {
              filterState.formFactor.push(filterValue);
            }
          }
        }
        
        applyFilters();
      });
      
      // Add specific click handler to checkmark for better UX
      checkmark.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent double triggering
        wrapper.click(); // Trigger the wrapper click
      });
    }
  });
}

// Get checkbox filter type
function getCheckboxFilterType(text) {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('downlight') || lowerText.includes('bulkhead') || lowerText.includes('surface')) {
    return 'applicationType';
  } else if (lowerText.includes('ceiling') || lowerText.includes('wall') || lowerText.includes('surface')) {
    return 'mountingType';
  } else if (lowerText.includes('round') || lowerText.includes('square') || lowerText.includes('rectangular')) {
    return 'formFactor';
  }
  return 'applicationType'; // Default
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
  filterState.performanceSpecs = { wattage: '', cct: '', beam: '', lumen: '', cri: '' };
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
  });
  
  // Close all dropdowns
  closeAllDropdowns();
  
  // Show all products
  showAllProducts();
}

// Close all dropdowns
function closeAllDropdowns() {
  document.querySelectorAll('.filter-dropdown-menu').forEach(dropdown => {
    dropdown.classList.remove('active');
  });
}

// Toggle dropdown visibility
function toggleDropdown(dropdownMenu) {
  console.log('toggleDropdown called for:', dropdownMenu);
  
  // Close all other dropdowns first
  const allDropdowns = document.querySelectorAll('.filter-dropdown-menu');
  allDropdowns.forEach(dropdown => {
    if (dropdown !== dropdownMenu) {
      dropdown.classList.remove('active');
    }
  });

  // Toggle current dropdown
  const isActive = dropdownMenu.classList.contains('active');
  console.log('Dropdown is currently active:', isActive);

  if (!isActive) {
    // Position the dropdown correctly
    const field = dropdownMenu.closest('.selection-filter-text');
    const fieldRect = field.getBoundingClientRect();

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
  console.log('Dropdown active after toggle:', dropdownMenu.classList.contains('active'));
}

// Get CMS data from Webflow collection item
function getCMSDataFromCard(card) {
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
    allText: ''
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
  
  // Method 2: Try to get data from Webflow's CMS binding elements
  const searchTagsElement = card.querySelector('[data-wf-cms-bind="search-tags"], [data-wf-cms-bind="searchTags"], [data-wf-cms-bind="tags"]');
  if (searchTagsElement) {
    cmsData.searchTags = searchTagsElement.textContent || searchTagsElement.innerText || '';
  }
  
  // Method 3: Fallback to visible text content
  const allText = card.textContent || card.innerText || '';
  cmsData.allText = allText.toLowerCase();
  
  return cmsData;
}

// Check if a product matches the filter criteria using CMS data
function checkProductMatchWithCMSData(cmsData) {
  
  // Check application type filters
  if (filterState.applicationType.length > 0) {
    const searchText = cmsData.allText;
    const hasMatchingApplication = filterState.applicationType.some(type => 
      searchText.includes(type.toLowerCase())
    );
    if (!hasMatchingApplication) {
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
      return false;
    }
  }
  
  // Check performance specs
  for (const [key, value] of Object.entries(filterState.performanceSpecs)) {
    if (value && value.trim() !== '') {
      const searchValue = value.toLowerCase().trim();
      let found = false;
      
      // First priority: Check Search Tags field
      if (cmsData.searchTags) {
        const searchTags = cmsData.searchTags.toLowerCase();
        const regex = new RegExp(`\\b${searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        found = regex.test(searchTags);
      }
      
      // Second priority: Check specific CMS fields
      if (!found) {
        if (key === 'cct' && cmsData.cct) {
          const cctValues = cmsData.cct.toLowerCase().split(',').map(v => v.trim());
          found = cctValues.some(val => val === searchValue);
        }
        
        if (key === 'lumen' && cmsData.lumen) {
          const lumenValues = cmsData.lumen.toLowerCase().split(',').map(v => v.trim());
          found = lumenValues.some(val => val === searchValue);
        }
        
        if (key === 'beam' && cmsData.beamAngle) {
          const beamValues = cmsData.beamAngle.toLowerCase().split(',').map(v => v.trim());
          found = beamValues.some(val => val === searchValue);
        }
        
        if (key === 'cri' && cmsData.cri) {
          const criValues = cmsData.cri.toLowerCase().split(',').map(v => v.trim());
          found = criValues.some(val => val === searchValue);
        }
        
        if (key === 'wattage' && cmsData.wattage) {
          const wattageValues = cmsData.wattage.toLowerCase().split(',').map(v => v.trim());
          found = wattageValues.some(val => val === searchValue);
        }
      }
      
      // Third priority: Check in all text
      if (!found) {
        const regex = new RegExp(`\\b${searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        found = regex.test(cmsData.allText);
      }
      
      if (!found) {
        return false;
      }
    }
  }
  
  // Check technical specs
  for (const [key, value] of Object.entries(filterState.technicalSpecs)) {
    if (value && value.trim() !== '') {
      const searchValue = value.toLowerCase().trim();
      let found = false;
      
      // First priority: Check Search Tags field
      if (cmsData.searchTags) {
        const searchTags = cmsData.searchTags.toLowerCase();
        const regex = new RegExp(`\\b${searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        found = regex.test(searchTags);
      }
      
      // Second priority: Check specific CMS fields
      if (!found) {
        if (key === 'ip' && cmsData.ipRating) {
          const ipValues = cmsData.ipRating.toLowerCase().split(',').map(v => v.trim());
          found = ipValues.some(val => val === searchValue);
        }
        
        if (key === 'ik' && cmsData.ikRating) {
          const ikValues = cmsData.ikRating.toLowerCase().split(',').map(v => v.trim());
          found = ikValues.some(val => val === searchValue);
        }
        
        if (key === 'outdoor' && cmsData.location) {
          found = cmsData.location.toLowerCase() === searchValue;
        }
        
        if (key === 'indoor' && cmsData.location) {
          found = cmsData.location.toLowerCase() === searchValue;
        }
        
        if (key === 'finishcolor' && cmsData.finishColor) {
          const finishValues = cmsData.finishColor.toLowerCase().split(',').map(v => v.trim());
          found = finishValues.some(val => val === searchValue);
        }
      }
      
      // Third priority: Check in all text
      if (!found) {
        const regex = new RegExp(`\\b${searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        found = regex.test(cmsData.allText);
      }
      
      if (!found) {
        return false;
      }
    }
  }
  
  return true;
}

// Apply filters to show/hide products
function applyFilters() {
  
  const cardsContainer = document.querySelector('.cards-container');
  if (!cardsContainer) {
    return;
  }
  
  const productCards = cardsContainer.querySelectorAll('.collection-item, .w-dyn-item');
  
  let visibleCount = 0;
  
  productCards.forEach(card => {
    const cmsData = getCMSDataFromCard(card);
    const matches = checkProductMatchWithCMSData(cmsData);
    
    if (matches) {
      card.style.display = 'block';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  
}

// Show all products
function showAllProducts() {
  const cardsContainer = document.querySelector('.cards-container');
  if (!cardsContainer) return;
  
  const productCards = cardsContainer.querySelectorAll('.collection-item, .w-dyn-item');
  productCards.forEach(card => {
    card.style.display = 'block';
  });
  
}

// Start the filter when the page loads
initializeFilter();
