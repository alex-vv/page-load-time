var isChrome = typeof browser === "undefined";

function getSelectedTab(callback) {
  if (isChrome) {
    chrome.tabs.getSelected(null, callback)
  } else {
    browser.tabs.query({active: true}).then(function(tabs) {
      callback(tabs[0]);
    })
  }
}

function storageLocal() {
  if (isChrome) {
    return chrome.storage.local;
  } else {
    return browser.storage.local;
  }
}