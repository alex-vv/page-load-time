// Saves options to chrome.storage
function saveOptions() {
  var externalRequests = document.getElementById('externalRequests').checked;
  chrome.storage.sync.set({
    externalRequests: externalRequests
  });
}

// Restores state using the preferences stored in chrome.storage.
function restoreOptions() {
    chrome.storage.sync.get({
        externalRequests: false
    }, function(items) {
        document.getElementById('externalRequests').checked = items.externalRequests;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('externalRequests').addEventListener('click', saveOptions);