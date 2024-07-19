chrome.storage.local.get(['screenTimeData'], (result) => {
  if (result.screenTimeData) {
    Object.assign(screenTimeData, result.screenTimeData);
  }
});


const screenTimeData = {};
let activeTabId = null;
let activeTabStartTime = null;

function saveScreenTimeData() {
  chrome.storage.local.set({ screenTimeData });
}

function updateActiveTab(tabId) {
  if (activeTabId !== null && activeTabStartTime !== null) {
    const now = Date.now();
    const elapsedTime = now - activeTabStartTime;

    if (!screenTimeData[activeTabId]) {
      screenTimeData[activeTabId] = 0;
    }
    screenTimeData[activeTabId] += elapsedTime;
    saveScreenTimeData();
  }

  activeTabId = tabId;
  activeTabStartTime = Date.now();
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  updateActiveTab(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.status === 'complete') {
    updateActiveTab(tabId);
  }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (tabId === activeTabId) {
    updateActiveTab(null);
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    updateActiveTab(null);
  } else {
    chrome.tabs.query({ active: true, windowId }, (tabs) => {
      if (tabs.length > 0) {
        updateActiveTab(tabs[0].id);
      }
    });
  }
});

// Blink reminder functionality
chrome.alarms.create('blinkReminder', { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'blinkReminder') {
    chrome.notifications.create('blinkReminder', {
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Blink Reminder',
      message: 'Time to blink!',
      priority: 2
    });
  }
});
