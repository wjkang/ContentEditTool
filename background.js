var $ = require("jquery");
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.query == 1) {
            var tplStr = $("#tpl").html();
            var cssTplStr=$("#cssTpl").html();
            sendResponse({ htmlTpl: tplStr ,cssTpl:cssTplStr});
        }
    });