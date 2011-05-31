(function() {
    (function check() {
        (document.readyState == "complete") ? measure() : setTimeout(check, 100);
    })();
    
    function measure() {
        var t = performance.timing;
        if (t.loadEventEnd > 0) {
            // we have only 4 chars in our disposal including decimal point
            var time = String(((t.loadEventEnd - t.fetchStart) / 1000).toPrecision(3)).substring(0, 4);
            chrome.extension.sendRequest({time: time, timing: t});
        }
    }
})();