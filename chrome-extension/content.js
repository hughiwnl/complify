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
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Washington'];
  const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'FL', 'OH', 'NC', 'WA', 'CO', 'MI', 'GA', 'VA', 'TN', 'IN', 'MO', 'MD', 'WI', 'MA'];
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

  function randCity() {
    return randomChoice(cities);
  }

  function randState() {
    return randomChoice(states);
  }

  function randZipCode() {
    return String(randomInt(10000, 99999));
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
  const navWords = ['next', 'prev', 'previous', 'back', 'continue', 'step', 'forward', '›', '»', '→', 'resume', 'create account', 'sign up', 'register'];

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
      if (/\bnext\b|\bwizard-next\b|\bstep-next\b|\bcreate-account\b|\bsignup\b|\bregister\b/.test(className)) return true;

      const idOrName = ((submitter.id || '') + ' ' + (submitter.name || '')).toLowerCase();
      if (/\bnext\b|\bcontinue\b|\bforward\b|\bcreate\b|\baccount\b|\bsignup\b|\bregister\b/.test(idOrName)) return true;
    }

    return false;
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
    
    if (chrome.storage && chrome.storage.local) {
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

      if (submitter && shouldExcludeSubmitter(submitter)) {
        // allow submission
        return;
      }

      // Only track time if it's a "Submit" button
      if (submitter && isSubmitButton(submitter)) {
        // Update time wasted counter
        updateTimeWasted();
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
    const type = (el.getAttribute && (el.getAttribute('type') || '') || '').toLowerCase();

    const isSubmitType =
      (tag === 'button' && (type === '' || type === 'submit')) ||
      (tag === 'input' && type === 'submit');

    if (!isSubmitType) return;

    if (shouldExcludeSubmitter(el)) {
      return;
    }

    // Only track time if it's a "Submit" button
    if (isSubmitButton(el)) {
      // Update time wasted counter
      updateTimeWasted();
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

      // Only track time if the last clicked element was a "Submit" button
      if (last && isSubmitButton(last)) {
        // Update time wasted counter
        updateTimeWasted();
      }
      // do NOT call realSubmit -> blocks submission
    };
  } catch (err) {
    // ignore if prototype not writable
  }

  // ---------- Autofill implementation ----------
  function fillControl(el) {
    if (!el || el.disabled) return false;
    const tag = (el.tagName || '').toLowerCase();

    if (tag === 'select') {
      const options = Array.from(el.options).filter(o => !o.disabled);
      if (options.length === 0) return false;
      const choice = randomChoice(options);
      el.value = choice.value || choice.text;
      dispatchEvents(el);
      return true;
    }

    if (tag === 'textarea') {
      el.value = randString(randomInt(12, 60)) + ' ';
      dispatchEvents(el);
      return true;
    }

    // input handling
    const type = (el.getAttribute('type') || '').toLowerCase();
    if (['text', '', 'search', 'url', 'tel', 'email', 'password'].includes(type)) {
      const name = (el.name || el.id || el.placeholder || '').toLowerCase();
      if (type === 'email' || name.includes('email')) {
        el.value = randEmail();
      } else if (name.includes('phone') || type === 'tel') {
        el.value = randPhone();
      } else if ((name.includes('first') && name.includes('name')) || name.includes('firstname')) {
        el.value = randString(randomInt(3,8));
      } else if ((name.includes('last') && name.includes('name')) || name.includes('lastname')) {
        el.value = randString(randomInt(3,8));
      } else if (name.includes('zip') || name.includes('postal')) {
        el.value = String(randomInt(10000, 99999));
      } else if (name.includes('address')) {
        el.value = `${randomInt(1,9999)} ${randString(randomInt(5,10))} St`;
      } else {
        const max = el.maxLength > 0 ? Math.max(1, el.maxLength) : 60;
        el.value = randString(Math.min(randomInt(3, Math.min(20, max)), max));
      }
      dispatchEvents(el);
      return true;
    }

    if (type === 'number') {
      const min = el.min ? Number(el.min) : 0;
      const max = el.max ? Number(el.max) : min + 1000;
      el.value = String(randomInt(min, max));
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
      if (tag === 'select') {
        if (!includeSelects) continue;
        if (fillControl(el)) filled++;
      } else if (tag === 'input') {
        const t = (el.getAttribute('type') || '').toLowerCase();
        if (t === 'checkbox' || t === 'radio') continue;
        if (fillControl(el)) filled++;
      } else if (tag === 'textarea') {
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

  // ---------- Message listener (from popup) ----------
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

  // End of script
})();
