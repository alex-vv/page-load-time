(function(){
  'use strict';

  if (document.readyState === 'complete') {
    startCollect();
  } else {
    window.addEventListener('load', startCollect);
  }

  function startCollect() {
    setTimeout(function() {
      const navigation = performance.getEntriesByType('navigation')[0].toJSON();
      if (navigation.duration > 0) {
        chrome.runtime.sendMessage(navigation);
      }
    }, 0);
  }
})();