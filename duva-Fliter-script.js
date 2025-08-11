
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
  
  // Test case-insensitive field detection
  console.log('🧪 Testing case-insensitive field detection:');
  console.log('Field type for "WATTAGE":', getFieldType({ textContent: 'WATTAGE' }));
  console.log('Field type for "wattage":', getFieldType({ textContent: 'wattage' }));
  console.log('Field type for "Wattage":', getFieldType({ textContent: 'Wattage' }));
  console.log('Field type for "EFFICACY":', getFieldType({ textContent: 'EFFICACY' }));
  console.log('Field type for "efficancy":', getFieldType({ textContent: 'efficancy' }));
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
// === Case-insensitive field type detection & normalization ===
function getFieldType(field) {
  const parent = field.closest('[data-type]');
  const map = {
    'wattage': 'Wattage',
    'lumen': 'Lumen',
    'cct': 'CCT',
    'beam': 'Beam',
    'cri': 'CRI',
    'ugr': 'UGR',
    'efficacy': 'Efficacy',   // preferred
    'efficancy': 'Efficancy', // legacy safety
    'ip': 'IP',
    'ik': 'IK',
    'finish': 'Finish Color',
    'finish color': 'Finish Color'
  };

  if (parent) {
    const raw = (parent.getAttribute('data-type') || '').trim().toLowerCase();
    if (map[raw]) return map[raw];
  }

  const t = (field.textContent || '').toLowerCase();
  if (t.includes('watt')) return 'Wattage';
  if (t.includes('lumen')) return 'Lumen';
  if (t.includes('cct')) return 'CCT';
  if (t.includes('beam')) return 'Beam';
  if (t.includes('cri')) return 'CRI';
  if (t.includes('ugr')) return 'UGR';
  if (t.includes('effic')) return 'Efficacy';
  if (t.includes('ip')) return 'IP';
  if (t.includes('ik')) return 'IK';
  if (t.includes('finish')) return 'Finish Color';
  return 'Wattage';
}

// Initialize filter checkboxes
function initializeFilterCheckboxes() {
  const checkboxes = document.querySelectorAll('.sub-filter-wrapper');
  
  checkboxes.forEach((wrapper, index) => {
    const text = wrapper.querySelector('.sub-filter-wattage');
    const checkmark = wrapper.querySelector('.filter-checkmark');
    
    if (text && checkmark) {
      // Add click handler only to the checkmark
      checkmark.addEventListener('click', () => {
        const isActive = wrapper.classList.contains('active');
        
        if (isActive) {
          // Uncheck
          wrapper.classList.remove('active');
          checkmark.classList.remove('active');
          const filterType = getCheckboxFilterType(wrapper);
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
          const filterType = getCheckboxFilterType(wrapper);
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
    }
  });
}

// Get checkbox filter type
function getCheckboxFilterType(wrapper) {
  // First try to get from data-filter attribute of parent
  const parentFilter = wrapper.closest('[data-filter]');
  if (parentFilter) {
    const f = (parentFilter.getAttribute('data-filter') || '').toLowerCase();
    if (f === 'application type') return 'applicationType';
    if (f === 'mounting type')   return 'mountingType';
    if (f === 'form factor')     return 'formFactor';
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
             lowerText.includes('strip') || lowerText.includes('tube') || lowerText.includes('trimless')) {
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
  
  // Check main page category filters (URL parameters)
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  
  if (categoryParam) {
    const category = categoryParam.toLowerCase().trim();
    const searchText = cmsData.allText;
    let categoryMatch = false;
    
    // Map category parameters to search terms - More specific matching
    switch (category) {
      case 'outdoor':
        categoryMatch = searchText.includes('outdoor') || searchText.includes('exterior') || searchText.includes('external');
        break;
      case 'indoor':
        categoryMatch = searchText.includes('indoor') || searchText.includes('interior') || searchText.includes('internal');
        break;
      case 'flex-strip':
        categoryMatch = searchText.includes('flex') || searchText.includes('strip') || searchText.includes('flexible') || searchText.includes('linear');
        break;
      case 'custom-light':
        // More specific matching for custom light - avoid false positives
        categoryMatch = (searchText.includes('custom') && (searchText.includes('light') || searchText.includes('lamp') || searchText.includes('fixture'))) ||
                       searchText.includes('bespoke lighting') ||
                       searchText.includes('tailored lighting');
        break;
      case 'decorative-light':
        // More specific matching for decorative light - avoid false positives
        categoryMatch = (searchText.includes('decorative') && (searchText.includes('light') || searchText.includes('lamp') || searchText.includes('fixture'))) ||
                       searchText.includes('ornamental lighting') ||
                       searchText.includes('aesthetic lighting');
        break;
      case 'weather-proof':
        categoryMatch = searchText.includes('weather') || searchText.includes('waterproof') || searchText.includes('ip') || searchText.includes('outdoor');
        break;
    }
    
    if (!categoryMatch) {
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
  const noResultsMessage = document.querySelector('.no-results-message');
  
  let visibleCount = 0;
  
  productCards.forEach(card => {
    const cmsData = getCMSDataFromCard(card);
    const matches = checkProductMatchWithCMSData(cmsData);
    
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

// Apply category filter on page load if URL has category parameter
function applyCategoryFilterOnLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  
  if (categoryParam) {
    console.log(`🎯 Applying category filter on load: ${categoryParam}`);
    
    // Wait for the filter system to be ready, then apply filters
    setTimeout(() => {
      applyFilters();
      console.log(`✅ Category filter applied for: ${categoryParam}`);
    }, 2000);
  }
}

// Initialize category filter on page load
document.addEventListener('DOMContentLoaded', applyCategoryFilterOnLoad);

// Also try when Webflow loads
if (window.Webflow) {
  window.Webflow.push(() => {
    applyCategoryFilterOnLoad();
  });
}

// Retry after a delay
setTimeout(applyCategoryFilterOnLoad, 3000);
