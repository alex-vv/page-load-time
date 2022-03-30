// Setting a toolbar badge text
chrome.runtime.onMessage.addListener((request, sender) => {
  // This cache stores page load time for each tab, so they don't interfere
  chrome.storage.local.get('cache').then(data => {
    if (!data.cache) data.cache = {};
    data.cache['tab' + sender.tab.id] = request.timing;
    chrome.storage.local.set(data).then(() => {
      chrome.action.setBadgeText({text: request.time, tabId: sender.tab.id});
      chrome.action.setPopup({tabId: sender.tab.id, popup: "popup.html"})
    });
  });

});

// cache eviction
chrome.tabs.onRemoved.addListener(tabId => {
  chrome.storage.local.get('cache').then(data => {
    if (data.cache) delete data.cache['tab' + tabId];
    chrome.storage.local.set(data);
  });
});
