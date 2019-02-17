

var logs = {}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if ("request" in request && request.request == "getLogs") {
            console.log("sending logs to popup")
            sendResponse(logs);
        } else {
            console.log("received messages");
            logs = request.request;
        }
    });