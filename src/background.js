// TODO wait for 100ms after onLoad for external requests
// TODO verify it works with option disabled
// TODO adjust logging
const waitTimeout = 100;
const tabs = {};
const resourceTypes = [
  "main_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "media", "other"
];

function setBadgeAndPopup(tabId, request) {
  console.log('showing badge and popup', JSON.stringify(request))
  const ms = request.duration / 1000;
  // if duration is >= 20 then use 1 decimal point else 2
  const time = ms.toFixed(ms >= 20.0 ? 1 : 2);
  chrome.browserAction.setBadgeText({text: time, tabId: tabId});
  chrome.browserAction.setPopup({tabId: tabId, popup: "popup.html"})
  tabs[tabId].completed = true;
}

function cleanup(tabId) {
  delete tabs[tabId];
  storageLocal().remove(tabId.toString());
}

chrome.webRequest.onBeforeRequest.addListener((details) => {
  const { tabId, requestId, timeStamp } = details;
  if (tabId > 0) {
    console.log('onBeforeRequest', JSON.stringify(details));
    if (!tabs[tabId]) {
      console.log('no tab data, initializing', tabs)
      tabs[tabId] = {
        loaded: false,
        requestIds: new Set()
      }
    }
    const tab = tabs[tabId];
    if (!tab.loaded) {
      if (!tab.requestsStart && tab.initialTimestamp) {
        tab.requestsStart = timeStamp - tab.initialTimestamp;
      }
      if (!tab.initialTimestamp) {
        tab.initialTimestamp = timeStamp;
      }
      tab.requestIds.add(requestId);
    }
    console.log(tab)
  }
}, { urls: ["<all_urls>"], types: resourceTypes});

function onEnd(details) {
  const { tabId, requestId, timeStamp } = details;
  if (tabId > 0) {
    console.log('onEnd', JSON.stringify(details))
    const tab = tabs[tabId];
    tab.requestIds.delete(requestId)
    if (tab.requestIds.size === 0 && !tab.completed) {
      console.log('onEnd loaded')
      const key = tabId.toString()
      storageLocal().get(key, (result) => {
        const request = result[key] || {};
        console.log('duration', timeStamp, tab.initialTimestamp, tab.requestsStart, request.duration)
        request.externalStart = tab.requestsStart;
        request.externalEnd = Math.round(timeStamp - tab.initialTimestamp);
        request.duration = Math.max(request.duration, request.externalEnd);
        storageLocal().set({[key]: request});
        console.log('storage.local set')
        if (tab.loaded) {
          setBadgeAndPopup(tabId, request);
        }
      });
    }
  }
}

chrome.webRequest.onBeforeRedirect.addListener((details) => {
  console.log("onBeforeRedirect", JSON.stringify(details));
  if (details.redirectUrl.startsWith("chrome-extension") || details.redirectUrl.startsWith("data:")) {
    console.log("invoking onEnd")
    onEnd(details);
  }
}, { urls: ["<all_urls>"], types: resourceTypes});

chrome.webRequest.onCompleted.addListener(onEnd, { urls: ["<all_urls>"], types: resourceTypes});
chrome.webRequest.onErrorOccurred.addListener(onEnd, { urls: ["<all_urls>"], types: resourceTypes});

// Setting a toolbar badge text
chrome.runtime.onMessage.addListener((request, sender) => {
  const tabId = sender.tab.id.toString();
  const tab = tabs[tabId];
  console.log('onLoad', tab);
  tab.loaded = true;
  // This cache stores page load time for each tab, so they don't interfere
  console.log('tabId', tabId)
  const key = tabId.toString()
  storageLocal().get(key, (result) => {
    storageLocal().set({[key]: Object.assign(request, result[key])});
    if (tab.requestIds.size === 0) {
      setBadgeAndPopup(sender.tab.id, request);
    }
  });
});

// cache eviction
chrome.tabs.onRemoved.addListener(cleanup);
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId === 0) {
    console.log('webNavigation', details);
    cleanup(details.tabId);
  }
});
