// This cache stores page load time for each tab, so they don't interfere
cache = {};

// Setting a toolbar badge text
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
       cache[sender.tab.id] = request.timing;
       chrome.browserAction.setBadgeText({text: request.time, tabId: sender.tab.id});
       sendResponse({});
});

// cache eviction
chrome.tabs.onRemoved.addListener(function(tabId) { delete cache[tabId] });
