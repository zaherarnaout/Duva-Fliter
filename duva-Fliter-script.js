
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
      console.log(`🔍 Input field "${fieldType}" changed to: "${input.value}"`);
      updateFieldFilterState(fieldType, input.value);
      console.log(`🔍 Updated filter state:`, filterState);
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
  const checkboxes = document.querySelectorAll('.sub-filter-wrapper');
  
  checkboxes.forEach((wrapper, index) => {
    const text = wrapper.querySelector('.sub-filter-wattage');
    const checkmark = wrapper.querySelector('.filter-checkmark');
    
    if (text && checkmark) {
      // Remove any existing listeners to prevent duplicates
      const newCheckmark = checkmark.cloneNode(true);
      checkmark.parentNode.replaceChild(newCheckmark, checkmark);
      
      // Add click handler only to the checkmark
      newCheckmark.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = wrapper.classList.contains('active');
        
        // Debug: Check if text element exists
        if (!text) {
          console.error('❌ Text element not found for filter checkbox');
          return;
        }
        
        // Get filter type and value outside the if/else blocks so they're accessible everywhere
        const filterType = getCheckboxFilterType(wrapper);
        const filterValue = text.textContent.trim().toLowerCase();
        
        if (isActive) {
          // Uncheck
          wrapper.classList.remove('active');
          newCheckmark.classList.remove('active');
          
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
          newCheckmark.classList.add('active');
          
          console.log(`🔍 Check section - filterValue: ${filterValue}, filterType: ${filterType}`);
          
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
        
        console.log(`🔍 Filter clicked: ${filterValue} (${filterType}) - Active: ${!isActive}`);
        console.log(`🔍 Current filter state:`, filterState);
        
        console.log('🔍 About to call applyFilters()...');
        applyFilters();
        console.log('🔍 applyFilters() called successfully');
      });
    }
  });
  
  console.log(`✅ Initialized ${checkboxes.length} filter checkboxes`);
}

// Get checkbox filter type
function getCheckboxFilterType(wrapper) {
  // First try to get from data-filter attribute of parent
  const parentFilter = wrapper.closest('[data-filter]');
  if (parentFilter) {
    const filterType = parentFilter.getAttribute('data-filter');
    if (filterType === 'Application Type') return 'applicationType';
    if (filterType === 'Mounting Type') return 'mountingType';
    if (filterType === 'Form Factor') return 'formFactor';
  }
  
  // Fallback to text content
  const text = wrapper.querySelector('.sub-filter-wattage')?.textContent || '';
  const lowerText = text.toLowerCase();
  if (lowerText.includes('outdoor') || lowerText.includes('indoor') || lowerText.includes('facade') || 
      lowerText.includes('retail') || lowerText.includes('landscape') || lowerText.includes('architectural')) {
    return 'applicationType';
  } else if (lowerText.includes('surface') || lowerText.includes('recessed') || lowerText.includes('flex') || 
             lowerText.includes('pendant') || lowerText.includes('track') || lowerText.includes('bollard')) {
    return 'mountingType';
  } else if (lowerText.includes('linear') || lowerText.includes('circular') || lowerText.includes('square') || 
             lowerText.includes('spotlight') || lowerText.includes('downlight') || lowerText.includes('floodlight') ||
             lowerText.includes('strip') || lowerText.includes('tube') || lowerText.includes('trimless') ||
             lowerText.includes('round') || lowerText.includes('rectangular') || lowerText.includes('oval') ||
             lowerText.includes('wall') || lowerText.includes('ceiling') || lowerText.includes('floor') ||
             lowerText.includes('step') || lowerText.includes('path') || lowerText.includes('garden') ||
             lowerText.includes('post') || lowerText.includes('bollard') || lowerText.includes('column') ||
             lowerText.includes('pendant') || lowerText.includes('track') || lowerText.includes('surface') ||
             lowerText.includes('recessed') || lowerText.includes('flex') || lowerText.includes('flexible') ||
             lowerText.includes('led') || lowerText.includes('bulb') || lowerText.includes('lamp') ||
             lowerText.includes('fixture') || lowerText.includes('luminaire') || lowerText.includes('lighting')) {
    return 'formFactor';
  }
  return 'applicationType'; // Default
}

// Update field filter state
function updateFieldFilterState(fieldType, value) {
  console.log(`🔍 updateFieldFilterState called with fieldType: "${fieldType}", value: "${value}"`);
  
  // Normalize field type to handle case variations
  const normalizedFieldType = fieldType.toLowerCase();
  
  if (normalizedFieldType === 'wattage') {
    filterState.performanceSpecs.wattage = value;
    console.log(`🔍 Set performanceSpecs.wattage to: "${value}"`);
  } else if (normalizedFieldType === 'cct') {
    filterState.performanceSpecs.cct = value;
    console.log(`🔍 Set performanceSpecs.cct to: "${value}"`);
  } else if (normalizedFieldType === 'beam') {
    filterState.performanceSpecs.beam = value;
    console.log(`🔍 Set performanceSpecs.beam to: "${value}"`);
  } else if (normalizedFieldType === 'cri') {
    filterState.performanceSpecs.cri = value;
    console.log(`🔍 Set performanceSpecs.cri to: "${value}"`);
  } else if (normalizedFieldType === 'ugr') {
    filterState.performanceSpecs.ugr = value;
    console.log(`🔍 Set performanceSpecs.ugr to: "${value}"`);
  } else if (normalizedFieldType === 'efficacy') {
    filterState.performanceSpecs.efficacy = value;
    console.log(`🔍 Set performanceSpecs.efficacy to: "${value}"`);
  } else if (normalizedFieldType === 'ip') {
    filterState.technicalSpecs.ip = value;
    console.log(`🔍 Set technicalSpecs.ip to: "${value}"`);
  } else if (normalizedFieldType === 'ik') {
    filterState.technicalSpecs.ik = value;
    console.log(`🔍 Set technicalSpecs.ik to: "${value}"`);
  } else if (normalizedFieldType === 'finish color') {
    filterState.technicalSpecs.finishcolor = value;
    console.log(`🔍 Set technicalSpecs.finishcolor to: "${value}"`);
  } else {
    console.warn(`⚠️ Unknown field type: "${fieldType}" (normalized: "${normalizedFieldType}")`);
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
  
  // Debug: Log what we found
  console.log('🔍 Data attributes found:', {
    application: card.dataset.application,
    mounting: card.dataset.mounting,
    form: card.dataset.form,
    ip: card.dataset.ip,
    lumen: card.dataset.lumen,
    name: card.dataset.name,
    cct: card.dataset.cct,
    wattage: card.dataset.wattage,
    beam: card.dataset.beam,
    feature: card.dataset.feature,
    finish: card.dataset.finish,
    cri: card.dataset.cri,
    tags: card.dataset.tags
  });
  
  // Debug: Check if CCT data exists in the card
  if (card.dataset.cct) {
    console.log(`🔍 CCT data found in card: "${card.dataset.cct}"`);
  } else {
    console.log(`🔍 No CCT data found in card dataset`);
  }
  
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
  
  // Note: Category filtering is now handled by script.js through simulated clicks
  // This ensures proper sync with filterState and visual consistency
  
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
          console.log(`🔍 CCT filtering: searchValue="${searchValue}", cmsData.cct="${cmsData.cct}"`);
          const cctValues = cmsData.cct.toLowerCase().split(',').map(v => v.trim());
          console.log(`🔍 CCT values after split:`, cctValues);
          
          // Smart CCT matching: handle both "3000" and "3000K" formats
          found = cctValues.some(val => {
            const valWithoutK = val.replace('k', '');
            const searchWithoutK = searchValue.replace('k', '');
            return val === searchValue || valWithoutK === searchWithoutK;
          });
          console.log(`🔍 CCT match found:`, found);
        }
        
        if (key === 'lumen' && cmsData.lumen) {
          const lumenValues = cmsData.lumen.toLowerCase().split(',').map(v => v.trim());
          found = lumenValues.some(val => val === searchValue);
        }
        
        if (key === 'beam' && cmsData.beamAngle) {
          console.log(`🔍 Beam filtering: searchValue="${searchValue}", cmsData.beamAngle="${cmsData.beamAngle}"`);
          const beamValues = cmsData.beamAngle.toLowerCase().split(',').map(v => v.trim());
          console.log(`🔍 Beam values after split:`, beamValues);
          
          // Smart beam matching: handle both "15" and "15°" formats
          found = beamValues.some(val => {
            const valWithoutDegree = val.replace('°', '').replace('deg', '');
            const searchWithoutDegree = searchValue.replace('°', '').replace('deg', '');
            return val === searchValue || valWithoutDegree === searchWithoutDegree;
          });
          console.log(`🔍 Beam match found:`, found);
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
          console.log(`🔍 IP filtering: searchValue="${searchValue}", cmsData.ipRating="${cmsData.ipRating}"`);
          const ipValues = cmsData.ipRating.toLowerCase().split(',').map(v => v.trim());
          console.log(`🔍 IP values after split:`, ipValues);
          
          // Smart IP matching: handle both "IP65" and "65" formats
          found = ipValues.some(val => {
            const valWithoutIP = val.replace('ip', '');
            const searchWithoutIP = searchValue.replace('ip', '');
            return val === searchValue || valWithoutIP === searchWithoutIP;
          });
          console.log(`🔍 IP match found:`, found);
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
          console.log(`🔍 Finish color filtering: searchValue="${searchValue}", cmsData.finishColor="${cmsData.finishColor}"`);
          const finishValues = cmsData.finishColor.toLowerCase().split(',').map(v => v.trim());
          console.log(`🔍 Finish values after split:`, finishValues);
          
          // Smart finish color matching: handle abbreviations
          const colorMappings = {
            'wh': 'white',
            'white': 'white',
            'bk': 'black', 
            'black': 'black',
            'gr': 'grey',
            'grey': 'grey',
            'gray': 'grey',
            'ss': 'stainless',
            'stainless': 'stainless'
          };
          
          const normalizedSearch = colorMappings[searchValue] || searchValue;
          found = finishValues.some(val => {
            const normalizedVal = colorMappings[val] || val;
            return val === searchValue || normalizedVal === normalizedSearch;
          });
          console.log(`🔍 Finish color match found:`, found);
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
  console.log('🔍 applyFilters() called');
  console.log('🔍 Current filter state:', filterState);
  
  const cardsContainer = document.querySelector('.cards-container');
  if (!cardsContainer) {
    console.log('⚠️ No cards container found');
    return;
  }
  
  const productCards = cardsContainer.querySelectorAll('.collection-item, .w-dyn-item');
  console.log(`🔍 Found ${productCards.length} product cards`);
  
  const noResultsMessage = document.querySelector('.no-results-message');
  
  let visibleCount = 0;
  
  productCards.forEach((card, index) => {
    const cmsData = getCMSDataFromCard(card);
    console.log(`🔍 Card ${index + 1} data:`, cmsData);
    
    // TEMPORARY: Add sample data for testing if data attributes are empty
    if (!cmsData.allText || cmsData.allText.trim() === '') {
      console.log('🔧 Adding sample data for testing');
      // Add sample data to test the filter
      cmsData.allText = 'indoor surface mounted led downlight 3000k warm white';
      cmsData.application = 'indoor';
      cmsData.mounting = 'surface mounted';
      cmsData.form = 'downlight';
      cmsData.cct = '3000k';
      cmsData.finish = 'warm white';
    }
    
    const matches = checkProductMatchWithCMSData(cmsData);
    console.log(`🔍 Card ${index + 1} matches:`, matches);
    
    if (matches) {
      // Remove any inline display style to let CSS handle the layout
      card.style.removeProperty('display');
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  
  console.log(`🔍 Total visible cards: ${visibleCount}`);
  
  // Show/hide no results message
  if (noResultsMessage) {
    if (visibleCount === 0) {
      // No cards match the filter
      noResultsMessage.style.display = 'block';
      console.log('⚠️ No results message shown');
    } else {
      // Cards are visible
      noResultsMessage.style.display = 'none';
      console.log('✅ Results found, hiding no results message');
    }
  }
  
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

// Note: Category filtering is now handled by script.js through simulated clicks
// This ensures proper sync with filterState and visual consistency
