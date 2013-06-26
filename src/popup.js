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

chrome.tabs.getSelected(null, function (tab) {
    chrome.storage.local.get('cache', function(data) {
        var t = data.cache['tab' + tab.id],
        start = t.redirectStart == 0 ?t.fetchStart : t.redirectStart;

        total = t.loadEventEnd - start;

        // https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/NavigationTiming/Overview.html#processing-model
        set('redirect', 0, t.redirectEnd - t.redirectStart);
        set('dns', t.domainLookupStart - start, t.domainLookupEnd - t.domainLookupStart);
        set('connect', t.connectStart - start, t.connectEnd - t.connectStart);
        set('request', t.requestStart - start, t.responseStart - t.requestStart);
        set('response', t.responseStart - start, t.responseEnd - t.responseStart);
        set('dom', t.domLoading - start, t.domComplete - t.domLoading);
        set('domInteractive', t.domInteractive - start, 0, true);
        set('contentLoaded', t.domContentLoadedEventStart - start,
            t.domContentLoadedEventEnd - t.domContentLoadedEventStart, true);
        set('load', t.loadEventStart - start, t.loadEventEnd - t.loadEventStart);
    });
});