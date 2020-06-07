(function(){
  'use strict';

  if (document.readyState === 'complete') {
    startCollect();
  } else {
    window.addEventListener('load', startCollect);
  }

  function startCollect() {
    const timing = performance.getEntriesByType('navigation')[0].toJSON();
    if (timing.duration > 0) {
      // we have only 4 chars in our disposal including decimal point
      var time = (timing.duration / 1000).toFixed(2);
      browser.runtime.sendMessage({time: time, timing: timing});
    } else {
      setTimeout(startCollect, 100);
    }
  }
})();