(function() {
    function htmlEncode( html ) {
        return document.createElement( 'a' ).appendChild( 
        document.createTextNode( html ) ).parentNode.innerHTML;
    };
    function tabUpdate(win) {
        chrome.tabs.query({windowId: win}, function(tabs) {
            var html = '';
            var even = false;
            for (var i in tabs) {
                var tab = tabs[i];
                html += '<div class="fullscreen-tab'
                        + (tab.active ? ' fullscreen-tab-active' : '') 
                        + ((even = !even) ? ' fullscreen-tab-even' : ' fullscreen-tab-odd')
                        + '" data-id="' + tab.id + '">'
                        + '<img src="' + tab.favIconUrl + '" onerror="this.src=\'data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\'">' + htmlEncode(tab.title) + '</div>';
            }
            for (var i in tabs) {
                chrome.tabs.sendMessage(tabs[i].id, html);
            }
        });
    }

   chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {tabUpdate(tab.windowId);});
   chrome.tabs.onCreated.addListener(function (tab) {tabUpdate(tab.windowId);});
   chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {tabUpdate(removeInfo.windowId);});
   chrome.tabs.onActiveChanged.addListener(function (tabId, selectInfo) {tabUpdate(selectInfo.windowId);});

   chrome.runtime.onMessage.addListener(function(data) {
        if (data.action == "activate") {
            chrome.tabs.update(data.tab, {active: true});
        } else if (data.action == "close") {
            chrome.tabs.remove(data.tab);
        }
   });
})();
