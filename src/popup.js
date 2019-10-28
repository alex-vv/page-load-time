function set(id, total, current, noacc, avg, avgTotal) {
  var length = Math.round(current.end - current.start);
  var x = Math.round(current.start / total * 100);
  document.getElementById(id + 'When').innerHTML = Math.round(current.start);
  document.querySelector('#r-' + id + ' .current-perf').style.cssText =
    'position: absolute;' +
    'top: 0;' +
    'bottom: 50%;' +
    'width: ' + Math.round(length / total * 100) + '%;' +
    'background-color: orange;' +
    'opacity: .5;' +
    'left: ' + x + '%;';
  if (typeof avg !== 'undefined') {
    avg.length = Math.round(avg.end - avg.start);
    avg.x = Math.round(avg.start / avgTotal * 100);
    document.querySelector('#r-' + id + ' .average-perf').style.cssText =
      'position: absolute;' +
      'top: 50%;' +
      'bottom: 0;' +
      'width: ' + Math.round(avg.length / avgTotal * 100) + '%;' +
      'background-color: green;' +
      'opacity: .5;' +
      'left: ' + avg.x + '%;';
  }

  document.getElementById(id).innerHTML = length;
  document.getElementById(id + 'Total').innerHTML = noacc ? '-' : Math.round(current.end);
  document.getElementById('r-' + id).style.cssText = 'position:relative;';
}

function updatePageTime(performanceData, datas) {
  var total = performanceData.duration;
  var currentData = {
    redirect: {
      start: performanceData.redirectStart,
      end: performanceData.redirectEnd,
    },
    dns: {
      start: performanceData.domainLookupStart,
      end: performanceData.domainLookupEnd
    },
    connect: {
      start: performanceData.connectStart,
      end: performanceData.connectEnd
    },
    request: {
      start: performanceData.requestStart,
      end: performanceData.responseStart
    },
    response: {
      start: performanceData.responseStart,
      end: performanceData.responseEnd
    },
    dom: {
      start: performanceData.responseStart,
      end: performanceData.domComplete
    },
    domInteractive: {
      start: performanceData.domInteractive,
      end: performanceData.domInteractive
    },
    contentLoaded: {
      start: performanceData.domContentLoadedEventStart,
      end: performanceData.domContentLoadedEventEnd
    },
    load: {
      start: performanceData.loadEventStart,
      end: performanceData.loadEventEnd
    },
    duration: 0,
  };

  var average = {};
  if (typeof datas !== 'undefined') {
    var nbrElem = datas.length;
    average = datas.reduce(function (sumObj, data, index) {
      sumObj.load.start += data.timing.loadEventStart;
      sumObj.load.end += data.timing.loadEventEnd;
      sumObj.redirect.start += data.timing.redirectEnd;
      sumObj.redirect.end += data.timing.redirectEnd;
      sumObj.dns.start += data.timing.domainLookupStart;
      sumObj.dns.end += data.timing.domainLookupEnd;
      sumObj.connect.start += data.timing.connectStart;
      sumObj.connect.end += data.timing.connectEnd;
      sumObj.request.start += data.timing.requestStart;
      sumObj.request.end += data.timing.responseStart;
      sumObj.response.start += data.timing.responseStart;
      sumObj.response.end += data.timing.responseEnd;
      sumObj.dom.start += data.timing.responseStart;
      sumObj.dom.end += data.timing.domComplete;
      sumObj.domInteractive.start += data.timing.domInteractive;
      sumObj.domInteractive.end += data.timing.domInteractive;
      sumObj.contentLoaded.start += data.timing.domContentLoadedEventStart;
      sumObj.contentLoaded.end += data.timing.domContentLoadedEventEnd;
      sumObj.duration += data.timing.duration;

      if ((index + 1) === nbrElem) {
        sumObj.load.start /= nbrElem;
        sumObj.load.end /= nbrElem;
        sumObj.redirect.start /= nbrElem;
        sumObj.redirect.end /= nbrElem;
        sumObj.dns.start /= nbrElem;
        sumObj.dns.end /= nbrElem;
        sumObj.connect.start /= nbrElem;
        sumObj.connect.end /= nbrElem;
        sumObj.request.start /= nbrElem;
        sumObj.request.end /= nbrElem;
        sumObj.response.start /= nbrElem;
        sumObj.response.end /= nbrElem;
        sumObj.dom.start /= nbrElem;
        sumObj.dom.end /= nbrElem;
        sumObj.domInteractive.start /= nbrElem;
        sumObj.domInteractive.end /= nbrElem;
        sumObj.contentLoaded.start /= nbrElem;
        sumObj.contentLoaded.end /= nbrElem;
        sumObj.duration /= nbrElem;
      }
      return sumObj;
    }, {
      redirect: {
        start: 0,
        end: 0,
      },
      dns: {
        start: 0,
        end: 0,
      },
      connect: {
        start: 0,
        end: 0,
      },
      request: {
        start: 0,
        end: 0,
      },
      response: {
        start: 0,
        end: 0,
      },
      dom: {
        start: 0,
        end: 0,
      },
      domInteractive: {
        start: 0,
        end: 0,
      },
      contentLoaded: {
        start: 0,
        end: 0,
      },
      load: {
        start: 0,
        end: 0,
      },
      duration: 0,
    });
  }

  // https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/NavigationTiming/Overview.html#processing-model
  set('redirect', total, currentData.redirect, false, average.redirect, average.duration);
  set('dns', total, currentData.dns, false, average.dns, average.duration);
  set('connect', total, currentData.connect, false, average.connect, average.duration);
  set('request', total, currentData.request, false, average.request, average.duration);
  set('response', total, currentData.response, false, average.response, average.duration);
  set('dom', total, currentData.dom, false, average.dom, average.duration);
  set('domInteractive', total, currentData.domInteractive, true, average.domInteractive, average.duration);
  set('contentLoaded', total, currentData.contentLoaded, true, average.contentLoaded, average.duration);
  document.getElementById("total").innerHTML = Math.round(performanceData.duration) + ' / ' + Math.round(average.duration);
}

var checkReady = setInterval(() => {
  if (document.readyState === "complete") {
    clearInterval(checkReady);
    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
        if (request.source === "background") {
          updatePageTime(request.currentPerf.timing, request.performance[request.currentPerf.location]);
        }
        else {
          // Loading page
          updatePageTime(request.timing);
        }
      }
    );
  }
});
