(function() {
    (function check() {
        (document.readyState == "complete") ? measure() : setTimeout(check, 100);
    })();
    
    function measure() {
        var t = performance.timing;
        var start = t.redirectStart == 0 ? t.fetchStart : t.redirectStart;
        if (t.loadEventEnd > 0) {
            // we have only 4 chars in our disposal including decimal point
            var time = String(((t.loadEventEnd - start) / 1000).toPrecision(3)).substring(0, 4);
            var roe = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';            
            chrome[roe].sendMessage({time: time, timing: t});
        }
    }
})();