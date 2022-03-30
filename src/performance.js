(function(){
  'use strict';

  if (document.readyState === 'complete') {
    startCollect();
  } else {
    window.addEventListener('load', startCollect);
  }

  function startCollect() {
    const timing = performance.getEntriesByType('navigation')[0].toJSON();
    timing.start = performance.timing.requestStart;
    delete timing.serverTiming;
    if (timing.duration > 0) {
      // fetchStart sometimes negative in FF, make an adjustment based on fetchStart
      var adjustment = timing.fetchStart < 0 ? -timing.fetchStart : 0;
      ['domainLookupStart',
        'domainLookupEnd',
        'connectStart',
        'connectEnd',
        'requestStart',
        'responseStart',
        'responseEnd',
        'domComplete',
        'domInteractive',
        'domContentLoadedEventStart',
        'domContentLoadedEventEnd',
        'loadEventStart',
        'loadEventEnd',
        'duration'
      ].forEach(i => {
        timing[i] +=adjustment;
      });

      // we have only 4 chars in our disposal including decimal point (3 in Firefox 92+)
      var isFF = navigator.userAgent.indexOf("Firefox") > -1;
      var duration = timing.duration / 1000;
      var precision = (duration >= 100) ? 0 : (duration >= 10 ? 1 : 2);
      if (isFF) {
        precision = Math.max(0, precision - 1);
      }
      var time = duration.toFixed(precision).substring(0, isFF ? 3 : 4);
      var promise = chrome.runtime.sendMessage({time: time, timing: timing});
      promise.catch((reason) => console.log(reason));
    } else {
      setTimeout(startCollect, 100);
    }
  }
})();