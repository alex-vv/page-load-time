// Setting a toolbar badge text
var roe = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';
chrome[roe].onMessage.addListener(
    function(request, sender, sendResponse) {
        // This cache stores page load time for each tab, so they don't interfere
        chrome.storage.local.get('cache', function(data) {
            if (!data.cache) data.cache = {};
            data.cache['tab' + sender.tab.id] = request.timing;
            chrome.storage.local.set(data);
        });
        chrome.browserAction.setBadgeText({text: request.time, tabId: sender.tab.id});
    }
);

// cache eviction
chrome.tabs.onRemoved.addListener(function(tabId) {
    chrome.storage.local.get('cache', function(data) {
        if (data.cache) delete data.cache['tab' + tabId];
        chrome.storage.local.set(data);
    });
});
