var total = 0;

function set(id, start, length, noacc) {
  var x = Math.round(start / total * 300);
  document.getElementById(id + 'When').innerHTML = start;
  document.getElementById(id).innerHTML = length;
  document.getElementById(id + 'Total').innerHTML = noacc ? '-' : (start + length);
  document.getElementById('r-' + id).style.cssText =
    'background-size:' + Math.round(length / total * 300) + 'px 100%;' +
    'background-position-x:' + (x >= 300 ? 299 : x) + 'px;';
}

getSelectedTab(function(tab) {
  storageLocal().get('cache', function(data) {
    var t = data.cache['tab' + tab.id];
    total = t.totalTime;

    // https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/NavigationTiming/Overview.html#processing-model
    set('redirect', 0, t.redirectTime);
    set('dns', t.domainLookupStart, t.domainLookupTime);
    set('connect', t.connectStart, t.connectTime);
    set('request', t.requestStart, t.requestTime);
    set('response', t.responseStart, t.responseTime);
    set('dom', t.domLoading, t.domComplete);
    set('domInteractive', t.domInteractive, 0, true);
    set('contentLoaded', t.domContentLoadedEventStart,
        t.domContentLoadedEventTime, true);
    set('load', t.loadEventStart, t.loadEventTime);
    document.getElementById("total").innerHTML = t.loadEventStart + t.loadEventTime;
  });
});