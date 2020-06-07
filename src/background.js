// Setting a toolbar badge text
browser.runtime.onMessage.addListener((request, sender) => {
  // This cache stores page load time for each tab, so they don't interfere
  browser.storage.local.get('cache').then(data => {
    if (!data.cache) data.cache = {};
    data.cache['tab' + sender.tab.id] = request.timing;
    browser.storage.local.set(data);
  });
  browser.browserAction.setBadgeText({text: request.time, tabId: sender.tab.id});
  browser.browserAction.setPopup({tabId: sender.tab.id, popup: "popup.html"})
});

// cache eviction
browser.tabs.onRemoved.addListener(tabId => {
  browser.storage.local.get('cache').then(data => {
    if (data.cache) delete data.cache['tab' + tabId];
    browser.storage.local.set(data);
  });
});
