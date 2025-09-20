// popup.js
document.addEventListener('DOMContentLoaded', () => {
  const complifyBtn = document.getElementById('complifyBtn');
  const timeWastedEl = document.getElementById('timeWasted');

  // Check if elements exist
  if (!complifyBtn || !timeWastedEl) {
    console.error('Required elements not found');
    return;
  }

  // Load saved time wasted from storage
  try {
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['timeWasted'], (result) => {
        try {
          const timeWasted = result && result.timeWasted ? result.timeWasted : 0;
          timeWastedEl.textContent = `Time wasted: ${timeWasted} minutes`;
        } catch (err) {
          console.error('Error updating time display:', err);
          timeWastedEl.textContent = `Time wasted: 0 minutes`;
        }
      });
    } else {
      timeWastedEl.textContent = `Time wasted: 0 minutes`;
    }
  } catch (err) {
    console.error('Error accessing storage:', err);
    timeWastedEl.textContent = `Time wasted: 0 minutes`;
  }

  // Listen for time wasted updates from content script
  try {
    if (chrome && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        try {
          if (message && message.action === 'updateTimeWasted') {
            const newTime = message.timeWasted || 0;
            timeWastedEl.textContent = `Time wasted: ${newTime} minutes`;
          }
        } catch (err) {
          console.error('Error handling message:', err);
        }
      });
    }
  } catch (err) {
    console.error('Error setting up message listener:', err);
  }

  complifyBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.id) return;

      // Autofill the form
      if (chrome && chrome.tabs && chrome.tabs.sendMessage) {
        console.log('Sending autofill message to tab:', tab.id);
        chrome.tabs.sendMessage(tab.id, {
          action: 'autofill_random',
          options: { includeSelects: true, includeCheckboxes: true, seedCount: 200 }
        }, (resp) => {
          console.log('Autofill response:', resp);
          if (chrome.runtime.lastError) {
            console.error('Chrome runtime error:', chrome.runtime.lastError);
          }
        });
      } else {
        console.error('Chrome tabs API not available');
      }
    } catch (err) {
      console.error('Error in complify button click:', err);
    }
  });
});
