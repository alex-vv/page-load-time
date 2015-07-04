(function() {
    if (document.readyState == "complete") {
        measure();
    } else {
        window.addEventListener("load", measure);
    }
    
    function measure() {
        setTimeout(function() {
            var t = performance.timing;
            var start = t.redirectStart == 0 ? t.fetchStart : t.redirectStart;
            if (t.loadEventEnd > 0) {
                // we have only 4 chars in our disposal including decimal point
                var time = String(((t.loadEventEnd - start) / 1000).toPrecision(3)).substring(0, 4);
                var roe = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';

                // since Chrome 43 JSON.stringify() doesn't work for PerformanceTiming
                // https://code.google.com/p/chromium/issues/detail?id=467366
                // need to manually copy properties via for .. in loop
                var timing = {};
                for (var p in t) {
                    if (typeof(t[p]) !== "function") {
                        timing[p] = t[p];
                    }
                }

                chrome[roe].sendMessage({time: time, timing: timing});
            }
        }, 0);
    }
})();

