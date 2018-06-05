(function(){
  'use strict';

  if (document.readyState === 'complete') {
    startCollect();
  } else {
    window.addEventListener('load', startCollect);
  }

  const LoadPerformance = function() {
    const l = {};
    const timing = performance.timing;
    if (window.PerformanceNavigationTiming) {
      // implement https://www.w3.org/TR/navigation-timing-2
      const ntEntry = performance.getEntriesByType('navigation')[0];
      l.redirectCount = ntEntry.redirectCount;

      // the l.startTime reflects a start time at the beginning of resource timing
      // can not sum time between unload event started and ended before resource timing
      l.startTime     = ntEntry.redirectStart;

      l.unloadEventStart = ntEntry.unloadEventStart;
      l.unloadEventTime  = ntEntry.unloadEventEnd - ntEntry.unloadEventStart;
      l.redirectStart = ntEntry.redirectStart;
      l.redirectTime  = ntEntry.redirectEnd - ntEntry.redirectStart;
      l.fetchStart    = ntEntry.fetchStart;
      l.domainLookupStart = ntEntry.domainLookupStart;
      l.domainLooupTime   = ntEntry.domainLookupEnd - ntEntry.domainLookupStart;
      l.connectStart  = ntEntry.connectStart;
      l.connectTime   = ntEntry.connectEnd - ntEntry.connectStart;
      l.requestStart  = ntEntry.requestStart;
      l.requestTime   = ntEntry.responseStart - ntEntry.requestStart;
      l.responseStart = ntEntry.responseStart;
      l.responseTime  = ntEntry.responseEnd - ntEntry.responseStart;
      l.domInteractive= ntEntry.domInteractive;
      l.domContentLoadedEventStart = ntEntry.domContentLoadedEventStart;
      l.domContentLoadedEventTime  =
        ntEntry.domContentLoadedEventEnd - ntEntry.domContentLoadedEventStart;
      l.domComplete   = ntEntry.domComplete;
      l.loadEventStart= ntEntry.loadEventStart;
      l.loadEventTime = ntEntry.loadEventEnd - ntEntry.loadEventStart;

      l.totalTime     = ntEntry.loadEventEnd - l.startTime;
    } else {
      l.redirectCount = performance.navigation.redirectCount;
      l.startTime     =
        timing.redirectStart === 0 ? timing.fetchStart:timing.redirectStart;

      // timing.unloadEventStart maybe larger than l.startTime
      l.unloadEventStart = timing.unloadEventStart;

      l.unloadEventTime  = timing.unloadEventEnd - timing.unloadEventStart;

      l.redirectStart = timing.redirectStart;
      l.redirectTime  = timing.redirectEnd - timing.redirectStart;
      l.fetchStart    = timing.fetchStart - l.startTime;
      l.domainLookupStart = timing.domainLookupStart - l.startTime;
      l.domainLooupTime   = timing.domainLookupEnd - timing.domainLookupStart;
      l.connectStart  = timing.connectStart - l.startTime;
      l.connectTime   = timing.connectEnd - timing.connectStart;
      l.requestStart  = timing.requestStart - l.startTime;
      l.requestTime   = timing.responseStart - timing.requestStart;
      l.responseStart = timing.responseStart - l.startTime;
      l.responseTime  = timing.responseEnd - timing.responseStart;
      l.domInteractive= timing.domInteractive - l.startTime;
      l.domContentLoadedEventStart =
        timing.domContentLoadedEventStart - l.startTime;
      l.domContentLoadedEventTime  =
        timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart;
      l.domComplete   = timing.domComplete - l.startTime;
      l.loadEventStart= timing.loadEventStart - l.startTime;
      l.loadEventTime = timing.loadEventEnd - timing.loadEventStart;

      l.totalTime     = timing.loadEventEnd - l.startTime;
    }

    l.domLoading = timing.domLoading - (
      timing.redirectStart === 0 ? timing.fetchStart:timing.redirectStart);
    l.domComplete = timing.domComplete - timing.domLoading;

    for (var k in l) {
      l[k] = Math.round(l[k]);
    }

    return l;
  };

  function startCollect() {
    setTimeout(function() {
      const l = LoadPerformance();
      if (l.totalTime > 0) {
        // we have only 4 chars in our disposal including decimal point
        var t = String((l.totalTime / 1000).toPrecision(3)).substring(0, 4);
        var roe = chrome.runtime && chrome.runtime.sendMessage ?
          'runtime':'extension';

        chrome[roe].sendMessage({time: t, timing: l});
      }
    }, 0);
  }
})();