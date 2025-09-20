// content.js
(() => {
  // ---------- Utilities ----------
  function textOf(el) {
    if (!el) return '';
    try {
      return ((el.innerText || el.value || (el.getAttribute && (el.getAttribute('aria-label') || el.getAttribute('title'))) || '') + '')
        .trim()
        .toLowerCase();
    } catch (e) {
      return '';
    }
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomChoice(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Realistic data generators
  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Helen', 'Mark', 'Sandra'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];
  const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Cedar Ln', 'Elm St', 'Maple Dr', 'First St', 'Second Ave', 'Park Rd', 'Washington St', 'Lincoln Ave', 'Jefferson Rd', 'Madison St', 'Franklin Ave', 'Adams Rd', 'Jackson St', 'Monroe Ave', 'Harrison Rd', 'Tyler St', 'Polk Ave'];
  const cityData = [
    { city: 'New York', state: 'NY', zip: '10001' },
    { city: 'Los Angeles', state: 'CA', zip: '90001' },
    { city: 'Chicago', state: 'IL', zip: '60601' },
    { city: 'Houston', state: 'TX', zip: '77001' },
    { city: 'Phoenix', state: 'AZ', zip: '85001' },
    { city: 'Philadelphia', state: 'PA', zip: '19101' },
    { city: 'San Antonio', state: 'TX', zip: '78201' },
    { city: 'San Diego', state: 'CA', zip: '92101' },
    { city: 'Dallas', state: 'TX', zip: '75201' },
    { city: 'San Jose', state: 'CA', zip: '95101' },
    { city: 'Austin', state: 'TX', zip: '73301' },
    { city: 'Jacksonville', state: 'FL', zip: '32099' },
    { city: 'Fort Worth', state: 'TX', zip: '76101' },
    { city: 'Columbus', state: 'OH', zip: '43201' },
    { city: 'Charlotte', state: 'NC', zip: '28201' },
    { city: 'San Francisco', state: 'CA', zip: '94101' },
    { city: 'Indianapolis', state: 'IN', zip: '46201' },
    { city: 'Seattle', state: 'WA', zip: '98101' },
    { city: 'Denver', state: 'CO', zip: '80201' },
    { city: 'Washington', state: 'DC', zip: '20001' }
  ];
  const companies = ['Acme Corp', 'Tech Solutions', 'Global Industries', 'Premier Services', 'Innovation Labs', 'Dynamic Systems', 'Elite Group', 'Advanced Technologies', 'Prime Solutions', 'Creative Works', 'Strategic Partners', 'Excellence Inc', 'Future Systems', 'Quality Services', 'Professional Group'];
  const jobTitles = ['Software Engineer', 'Marketing Manager', 'Sales Representative', 'Project Manager', 'Data Analyst', 'Product Manager', 'Business Analyst', 'Operations Manager', 'Financial Analyst', 'HR Specialist', 'Designer', 'Consultant', 'Director', 'Coordinator', 'Specialist'];

  function randFirstName() {
    return randomChoice(firstNames);
  }

  function randLastName() {
    return randomChoice(lastNames);
  }

  function randFullName() {
    return `${randFirstName()} ${randLastName()}`;
  }

  function randEmail(firstName = null, lastName = null) {
    const first = firstName || randFirstName().toLowerCase();
    const last = lastName || randLastName().toLowerCase();
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'company.com'];
    return `${first}.${last}@${randomChoice(domains)}`;
  }

  function randPhone() {
    return `${randomInt(200,999)}-${randomInt(200,999)}-${randomInt(1000,9999)}`;
  }

  function randAddress() {
    const streetNum = randomInt(100, 9999);
    const street = randomChoice(streets);
    return `${streetNum} ${street}`;
  }

  // Global variable to track selected city data for consistent address generation
  let selectedCityData = null;

  function randCityData() {
    selectedCityData = randomChoice(cityData);
    return selectedCityData;
  }

  function randCity() {
    if (!selectedCityData) {
      selectedCityData = randomChoice(cityData);
    }
    return selectedCityData.city;
  }

  function randState() {
    if (!selectedCityData) {
      selectedCityData = randomChoice(cityData);
    }
    return selectedCityData.state;
  }

  function randZipCode() {
    if (!selectedCityData) {
      selectedCityData = randomChoice(cityData);
    }
    // Generate a valid zip code in the same range as the city
    const baseZip = parseInt(selectedCityData.zip);
    const variation = randomInt(-100, 100);
    const newZip = Math.max(10000, Math.min(99999, baseZip + variation));
    return String(newZip);
  }

  function randCompany() {
    return randomChoice(companies);
  }

  function randJobTitle() {
    return randomChoice(jobTitles);
  }

  function randDate() {
    const year = randomInt(1990, 2024);
    const month = randomInt(1, 12);
    const day = randomInt(1, 28);
    return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  }

  function dispatchEvents(el) {
    try {
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (err) {}
  }

  // ---------- Navigation detection & markers ----------
  const navWords = ['next', 'prev', 'previous', 'back', 'continue', 'step', 'forward', '›', '»', '→', 'resume', 'create account', 'sign up', 'register', 'save and continue'];
  
  // Track if we've already handled navigation for this page to avoid multiple reloads
  let navigationHandled = false;

  function isNavigationLabel(el) {
    const t = textOf(el);
    if (!t) return false;
    return navWords.some(w => {
      if (t === w) return true;
      if (t.includes(w + ' ')) return true;
      if (t.includes(' ' + w)) return true;
      if (t.endsWith(w)) return true;
      if (t.startsWith(w)) return true;
      return false;
    });
  }

  function hasNoReloadMarker(el) {
    if (!el) return false;
    try {
      return !!(el.hasAttribute && el.hasAttribute('data-no-reload'));
    } catch (e) {
      return false;
    }
  }

  function isSubmitButton(submitter) {
    if (!submitter) return false;
    
    const text = textOf(submitter);
    return text === 'submit';
  }

  function shouldExcludeSubmitter(submitter) {
    if (!submitter) return false;
    if (hasNoReloadMarker(submitter)) return true;

    const tag = (submitter.tagName || '').toLowerCase();
    if (tag === 'button' || tag === 'input') {
      if (isNavigationLabel(submitter)) return true;

      // check classes and id/name heuristics
      const className = (submitter.className || '').toString().toLowerCase();
      if (/\bnext\b|\bwizard-next\b|\bstep-next\b|\bcreate-account\b|\bsignup\b|\bregister\b|\bsave-and-continue\b/.test(className)) return true;

      const idOrName = ((submitter.id || '') + ' ' + (submitter.name || '')).toLowerCase();
      if (/\bnext\b|\bcontinue\b|\bforward\b|\bcreate\b|\baccount\b|\bsignup\b|\bregister\b|\bsave\b|\bsave.*continue\b/.test(idOrName)) return true;
    }

    return false;
  }

  // Function to handle random page reload
  function handleRandomReload(context) {
    // 50% chance to reload the page
    if (Math.random() < 0.5) {
      console.log(`${context} - reloading page (50% chance)`);
      setTimeout(() => {
        try {
          window.location.reload();
        } catch (err) {
          console.error('Error reloading page:', err);
        }
      }, 100);
      return true;
    } else {
      console.log(`${context} - no reload (50% chance)`);
      return false;
    }
  }

  // ---------- track last clicked element (to help programmatic .submit cases) ----------
  let __lastClickedElement = null;
  let __lastClickedTime = 0;
  function setLastClicked(el) {
    __lastClickedElement = el;
    __lastClickedTime = Date.now();
    setTimeout(() => {
      if (Date.now() - __lastClickedTime > 2000) {
        __lastClickedElement = null;
      }
    }, 2100);
  }

  // ---------- Time tracking ----------
  function updateTimeWasted() {
    const minutesToAdd = Math.floor(Math.random() * 11) + 5; // Random 5-15 minutes
    
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['timeWasted'], (result) => {
        const currentTime = result.timeWasted || 0;
        const newTime = currentTime + minutesToAdd;
        chrome.storage.local.set({ timeWasted: newTime }, () => {
          // Notify popup of the update
          if (chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({
              action: 'updateTimeWasted',
              timeWasted: newTime
            });
          }
        });
      });
    }
  }

  // ---------- Form submit interception ----------
  function onFormSubmit(e) {
    try {
      const submitter = e.submitter || __lastClickedElement;

      // 50% chance to reload on form submission
      if (submitter) {
        handleRandomReload('Form submitted');
        return;
      }
    } catch (err) {
      // ignore errors
    }
  }
  document.addEventListener('submit', onFormSubmit, true);

  // ---------- Click listener ----------
  document.addEventListener('click', function (e) {
    const el = e.target;
    if (!el || !el.tagName) return;

    setLastClicked(el);

    const tag = el.tagName.toLowerCase();
    
    // 50% chance to reload on ANY button click
    if (tag === 'button' || tag === 'input') {
      handleRandomReload('Button clicked');
      return;
    }
  }, true);

  // ---------- Override programmatic form.submit() ----------
  try {
    const realSubmit = HTMLFormElement.prototype.submit;
    HTMLFormElement.prototype.submit = function () {
      try {
        const last = __lastClickedElement;
        if (last && last.form && last.form === this && shouldExcludeSubmitter(last)) {
          return realSubmit.call(this);
        }

        if (this.hasAttribute && this.hasAttribute('data-allow-submit')) {
          return realSubmit.call(this);
        }
      } catch (err) {
        // ignore and proceed
      }

      // 50% chance to reload on programmatic form submission
      handleRandomReload('Programmatic form submit');
      // do NOT call realSubmit -> blocks submission
    };
  } catch (err) {
    // ignore if prototype not writable
  }

  // ---------- Autofill implementation ----------
  function fillControl(el) {
    console.log('fillControl called for element:', el);
    if (!el || el.disabled) {
      console.log('Element is null or disabled');
      return false;
    }
    const tag = (el.tagName || '').toLowerCase();
    console.log('Element tag:', tag);

    if (tag === 'select') {
      console.log('Processing select element:', el);
      const options = Array.from(el.options).filter(o => !o.disabled);
      console.log('Available options:', options.length);
      if (options.length === 0) {
        console.log('No enabled options found');
        return false;
      }
      
      // Skip the first option if it's typically a placeholder (empty value or common placeholder text)
      const selectableOptions = options.filter(opt => {
        const value = (opt.value || '').trim();
        const text = (opt.text || '').trim();
        return value !== '' && 
               !text.toLowerCase().includes('select') && 
               !text.toLowerCase().includes('choose') &&
               !text.toLowerCase().includes('please') &&
               !text.toLowerCase().includes('--') &&
               text !== '';
      });
      
      // If we filtered out all options, use the original options
      const finalOptions = selectableOptions.length > 0 ? selectableOptions : options;
      const choice = randomChoice(finalOptions);
      
      console.log('Selected option:', choice.value, choice.text);
      el.value = choice.value || choice.text;
      dispatchEvents(el);
      return true;
    }

    if (tag === 'textarea') {
      const name = (el.name || el.id || el.placeholder || '').toLowerCase();
      if (name.includes('message') || name.includes('comment') || name.includes('description')) {
        el.value = 'This is a sample message for testing purposes.';
      } else if (name.includes('bio') || name.includes('about')) {
        el.value = 'Experienced professional with a passion for excellence and innovation.';
      } else {
        el.value = 'Sample text content for testing.';
      }
      dispatchEvents(el);
      return true;
    }

    // input handling
    const type = (el.getAttribute('type') || '').toLowerCase();
    const name = (el.name || el.id || el.placeholder || '').toLowerCase();
    const label = (el.getAttribute('aria-label') || '').toLowerCase();
    const allText = (name + ' ' + label).toLowerCase();
    console.log('Input details:', { type, name, label, allText });

    if (['text', '', 'search', 'url', 'tel', 'email', 'password'].includes(type)) {
      // Skip phone extension fields
      if (allText.includes('extension') || allText.includes('ext')) {
        console.log('Skipping phone extension field');
        return false;
      }
      
      if (type === 'email' || allText.includes('email')) {
        el.value = randEmail();
      } else if (allText.includes('phone') || allText.includes('tel') || type === 'tel') {
        el.value = randPhone();
      } else if (allText.includes('first') && (allText.includes('name') || allText.includes('first'))) {
        el.value = randFirstName();
      } else if (allText.includes('last') && (allText.includes('name') || allText.includes('last'))) {
        el.value = randLastName();
      } else if (allText.includes('full') && allText.includes('name')) {
        el.value = randFullName();
      } else if (allText.includes('name') && !allText.includes('first') && !allText.includes('last')) {
        el.value = randFullName();
      } else if (allText.includes('zip') || allText.includes('postal') || allText.includes('zipcode')) {
        el.value = randZipCode();
      } else if (allText.includes('address') && !allText.includes('email')) {
        el.value = randAddress();
      } else if (allText.includes('city')) {
        el.value = randCity();
      } else if (allText.includes('state') && !allText.includes('address')) {
        el.value = randState();
      } else if (allText.includes('company') || allText.includes('organization')) {
        el.value = randCompany();
      } else if (allText.includes('job') || allText.includes('title') || allText.includes('position')) {
        el.value = randJobTitle();
      } else if (allText.includes('username') || allText.includes('user')) {
        const firstName = randFirstName().toLowerCase();
        const lastName = randLastName().toLowerCase();
        el.value = `${firstName}${lastName}${randomInt(1, 99)}`;
      } else if (allText.includes('website') || allText.includes('url')) {
        el.value = `https://www.${randCompany().toLowerCase().replace(/\s+/g, '')}.com`;
      } else if (allText.includes('age')) {
        el.value = String(randomInt(18, 65));
      } else if (allText.includes('salary') || allText.includes('income')) {
        el.value = String(randomInt(30000, 150000));
      } else {
        // Generic text field - try to be smart about it
        const max = el.maxLength > 0 ? Math.max(1, el.maxLength) : 50;
        let value;
        if (max <= 10) {
          value = randFirstName();
        } else if (max <= 20) {
          value = randLastName();
        } else if (max <= 50) {
          value = randFullName();
        } else {
          value = 'Sample text for testing purposes';
        }
        console.log('Setting generic text value:', value);
        el.value = value;
      }
      console.log('Final value set:', el.value);
      dispatchEvents(el);
      return true;
    }

    if (type === 'number') {
      const min = el.min ? Number(el.min) : 0;
      const max = el.max ? Number(el.max) : min + 1000;
      if (allText.includes('age')) {
        el.value = String(randomInt(18, 65));
      } else if (allText.includes('zip') || allText.includes('postal')) {
        el.value = randZipCode();
      } else if (allText.includes('phone') || allText.includes('tel')) {
        el.value = randPhone().replace(/-/g, '');
      } else {
        el.value = String(randomInt(min, max));
      }
      dispatchEvents(el);
      return true;
    }

    if (type === 'date') {
      el.value = randDate();
      dispatchEvents(el);
      return true;
    }

    if (type === 'file') return false;

    // skip checkboxes/radios here (handled separately)
    return false;
  }

  function handleChecks(allInputs) {
    const checkboxes = allInputs.filter(i => (i.type || '').toLowerCase() === 'checkbox' && !i.disabled);
    const radios = allInputs.filter(i => (i.type || '').toLowerCase() === 'radio' && !i.disabled);

    checkboxes.forEach(cb => {
      cb.checked = Math.random() > 0.5;
      dispatchEvents(cb);
    });

    const radioGroups = {};
    radios.forEach(r => {
      const key = r.name || ('__no_name__' + (r.form ? 'form' : ''));
      radioGroups[key] = radioGroups[key] || [];
      radioGroups[key].push(r);
    });
    Object.values(radioGroups).forEach(group => {
      const chosen = randomChoice(group);
      group.forEach(r => r.checked = (r === chosen));
      dispatchEvents(chosen);
    });
  }

  async function autofillRandom({ includeSelects = true, includeCheckboxes = true, seedCount = 200 } = {}) {
    console.log('autofillRandom called with:', { includeSelects, includeCheckboxes, seedCount });
    
    // Initialize city data for consistent address generation
    selectedCityData = null;
    randCityData(); // This sets selectedCityData for the entire form
    
    const allInputs = Array.from(document.querySelectorAll('input, textarea, select'));
    console.log('Found', allInputs.length, 'total form elements');
    
    const visible = allInputs.filter(el => {
      try {
        const style = window.getComputedStyle(el);
        if (style && (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0')) return false;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return false;
        if (el.disabled) return false;
        return true;
      } catch (err) {
        return false;
      }
    });

    console.log('Found', visible.length, 'visible form elements');

    let filled = 0;
    for (const el of visible) {
      if (filled >= seedCount) break;
      const tag = (el.tagName || '').toLowerCase();
      console.log('Processing element:', el, 'tag:', tag);
      if (tag === 'select') {
        console.log('Found select element, includeSelects:', includeSelects);
        if (!includeSelects) {
          console.log('Skipping select element because includeSelects is false');
          continue;
        }
        console.log('Filling select element');
        if (fillControl(el)) filled++;
      } else if (tag === 'input') {
        const t = (el.getAttribute('type') || '').toLowerCase();
        if (t === 'checkbox' || t === 'radio') continue;
        console.log('Filling input element, type:', t);
        if (fillControl(el)) filled++;
      } else if (tag === 'textarea') {
        console.log('Filling textarea element');
        if (fillControl(el)) filled++;
      }
    }

    if (includeCheckboxes) {
      handleChecks(visible.filter(i => i.tagName && i.tagName.toLowerCase() === 'input'));
    }

    visible.forEach(el => {
      if (el.tagName && el.tagName.toLowerCase() === 'select') {
        try { dispatchEvents(el); } catch (e) {}
      }
    });

    console.log('Autofill result:', { filledCount: filled, scanned: visible.length });
    return { filledCount: filled, scanned: visible.length };
  }

  // expose for debugging
  try {
    window.__extension_autofillRandom = autofillRandom;
    window.__ext_lastClicked = () => ({ el: __lastClickedElement, time: __lastClickedTime });
    window.__ext_shouldExcludeSubmitter = shouldExcludeSubmitter;
  } catch (e) {}

  // ---------- Navigation event listeners ----------
  // Listen for beforeunload to catch page navigation
  window.addEventListener('beforeunload', () => {
    if (!navigationHandled) {
      // 50% chance to reload when navigating away
      if (Math.random() < 0.5) {
        console.log('Random navigation reload on page unload');
        // Don't actually reload here as the page is already navigating
        // This is just for logging purposes
      }
    }
  });

  // Listen for link clicks that might navigate
  document.addEventListener('click', (e) => {
    const el = e.target;
    if (el && el.tagName === 'A' && el.href) {
      // Check if it's a navigation link (not just an anchor)
      if (el.href !== window.location.href && !el.href.includes('#')) {
        handleNavigationReload();
      }
    }
  }, true);

  // ---------- Message listener (from popup) ----------
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      console.log('Content script received message:', msg);
      if (!msg || !msg.action) return;
      if (msg.action === 'autofill_random') {
        console.log('Starting autofill with options:', msg.options);
        const opts = msg.options || {};
        autofillRandom(opts).then(result => {
          console.log('Autofill completed:', result);
          sendResponse({ ok: true, result });
        }).catch(err => {
          console.error('Autofill error:', err);
          sendResponse({ ok: false, error: String(err) });
        });
        return true; // async response
      }
    });
  }

  // End of script
})();
