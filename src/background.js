// Setting a toolbar badge text
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    // This cache stores page load time for each tab, so they don't interfere

    chrome.browserAction.setBadgeText({text: request.time, tabId: sender.tab.id});
    chrome.browserAction.setPopup({tabId: sender.tab.id, popup: "popup.html"});
    chrome.storage.sync.get(['performance'], (perf) => {
      var tmpPerf = Object.keys(perf).length ? perf : { performance: {} };
      console.log('perf', request, sender, tmpPerf, perf, tmpPerf.performance.hasOwnProperty(request.location), tmpPerf[request.location], typeof tmpPerf[request.location]);
      if (tmpPerf.performance.hasOwnProperty(request.location)) {
        tmpPerf.performance[request.location].push(request);
      }
      else {
        tmpPerf.performance[request.location] = [request];
      }
      var dataToStore = { performance: tmpPerf.performance, currentPerf: request };
      console.log('back', dataToStore);
      chrome.storage.sync.set(dataToStore, () => {
        console.log('send message')
        chrome.runtime.sendMessage({ ...dataToStore, source: "background" });
        sendResponse();
      });
    });
  }
);

// cache eviction
chrome.tabs.onRemoved.addListener(function(tabId) {
  chrome.storage.local.get('cache', function(data) {
    if (data.cache) delete data.cache['tab' + tabId];
    chrome.storage.local.set(data);
  });
});
