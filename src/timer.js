function check() {
    (document.readyState == "complete") ? measure() : setTimeout(check, 100);
};
check();

function measure() {
    var t = performance.timing;
    var end = t.loadEventEnd; // or t.domContentLoadedEventEnd
    var time = String((end - t.fetchStart) / 1000).substring(0, 4);
    chrome.extension.sendRequest({time: time, timing: t});
}