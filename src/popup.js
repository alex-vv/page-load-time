var total,
  acc = 0;

function set(id, start, length, noacc) {
  var x = Math.round(start / total * 300);

  if (!noacc) {
    acc += length;
  }
  document.getElementById(id + 'When').innerHTML = start;
  document.getElementById(id).innerHTML = length;
  document.getElementById(id + 'Total').innerHTML = noacc ? '-' : acc;
  document.getElementById('r-' + id).style.cssText =
    'background-size:' + Math.round(length / total * 300) + 'px 100%;' +
    'background-position-x:' + (x >= 300 ? 299 : x) + 'px;';
}

function setCount(id, count) {
  document.getElementById(id + 'Count').innerText = count || '-';
}

chrome.tabs.getSelected(null, function (tab) {
  chrome.storage.local.get('cache', function(data) {
    var t = data.cache['tab' + tab.id];
    total = t.totalTime;

    setCount('redirect', t.redirectCount);

    // https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/NavigationTiming/Overview.html#processing-model
    set('redirect', 0, t.redirectTime);
    set('dns', t.domainLookupStart, t.domainLooupTime);
    set('connect', t.connectStart, t.connectTime);
    set('request', t.requestStart, t.requestTime);
    set('response', t.responseStart, t.responseTime);
    set('dom', t.domLoading, t.domComplete);
    set('domInteractive', t.domInteractive, 0, true);
    set('contentLoaded', t.domContentLoadedEventStart,
        t.domContentLoadedEventTime, true);
    set('load', t.loadEventStart, t.loadEventTime);
  });
});