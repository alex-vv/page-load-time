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

      // we have only 4 chars in our disposal including decimal point
      var time = (timing.duration / 1000).toFixed(2);
      var promise = browser.runtime.sendMessage({time: time, timing: timing});
      promise.catch((reason) => console.log(reason));
    } else {
      setTimeout(startCollect, 100);
    }
  }
})();