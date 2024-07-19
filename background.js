// chrome.storage.local.get(['screenTimeData'], (result) => {
//   if (result.screenTimeData) {
//     Object.assign(screenTimeData, result.screenTimeData);
//   }
// });

let currentTabId = null;
let lastActiveTime = Date.now();
const screenTimeData = {};

// Update screen time when tab is activated
chrome.tabs.onActivated.addListener(activeInfo => {
  const { tabId } = activeInfo;

  if (currentTabId !== null) {
    const currentTime = Date.now();
    if (!screenTimeData[currentTabId]) {
      screenTimeData[currentTabId] = { time: 0, title: '' };
    }
    screenTimeData[currentTabId].time += currentTime - lastActiveTime;
  }

  currentTabId = tabId;
  lastActiveTime = Date.now();

  chrome.tabs.get(tabId, (tab) => {
    const { title } = tab;
    if (!screenTimeData[tabId]) {
      screenTimeData[tabId] = { time: 0, title };
    } else {
      screenTimeData[tabId].title = title;
    }
  });

  chrome.storage.local.set({ screenTimeData });
});

// Remove data when tab is closed
chrome.tabs.onRemoved.addListener(tabId => {
  delete screenTimeData[tabId];
  chrome.storage.local.set({ screenTimeData });
});

// Update screen time when idle state changes
chrome.idle.onStateChanged.addListener(newState => {
  const currentTime = Date.now();
  if (newState === 'active') {
    if (currentTabId !== null && screenTimeData[currentTabId]) {
      screenTimeData[currentTabId].time += currentTime - lastActiveTime;
    }
    lastActiveTime = currentTime;
  } else {
    if (currentTabId !== null && screenTimeData[currentTabId]) {
      screenTimeData[currentTabId].time += currentTime - lastActiveTime;
      lastActiveTime = currentTime;
    }
  }
  chrome.storage.local.set({ screenTimeData });
});

chrome.runtime.onStartup.addListener(() => {
  currentTabId = null;
  lastActiveTime = Date.now();
});

chrome.runtime.onInstalled.addListener(() => {
  currentTabId = null;
  lastActiveTime = Date.now();
});
