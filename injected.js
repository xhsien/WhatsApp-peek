var target = document.body;

var logs = {};

// Options for the observer (which mutations to observe)
var config = { childList: true, subtree: true, characterData: true, attributes: true, attributeOldValue: true, characterDataOldValue: true};

// Callback function to execute when mutations are observed
var callback = function(mutationsList, observer) {
    for (var mutation of mutationsList) {
        if (mutation.type == "characterData") {
            console.log(mutation.oldValue);

            getUnreadChats();

            chrome.runtime.sendMessage("test");
        }
    }
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(target, config);

function printlogs() {
    console.log(logs);
}


//
// GLOBAL VARS AND CONFIGS
//
var lastMessageOnChat = false;
var ignoreLastMsg = {};
var elementConfig = {
    "chats": [1, 0, 5, 2, 0, 3, 0, 0, 0],
    "chat_icons": [0, 0, 1, 1, 1, 0],
    "chat_title": [0, 0, 1, 0, 0, 0, 0],
    "chat_lastmsg": [0, 0, 1, 1, 0, 0],
    "chat_active": [0, 0],
    "selected_title": [1, 0, 5, 3, 0, 1, 1, 0, 0, 0, 0]
};

function getElement(id, parent) {
    if (!elementConfig[id]) {
        return false;
    }
    var elem = !parent ? document.body : parent;
    var elementArr = elementConfig[id];
    elementArr.forEach(function(pos) {
        if (!elem.childNodes[pos]) {
            return false;
        }
        elem = elem.childNodes[pos];
    });
    return elem;
}

function getLastMsg() {
    var messages = document.querySelectorAll('.msg');
    var pos = messages.length - 1;

    while (messages[pos] && (messages[pos].classList.contains('msg-system') || messages[pos].querySelector('.message-in'))) {
        pos--;
        if (pos <= -1) {
            return false;
        }
    }
    if (messages[pos] && messages[pos].querySelector('.selectable-text')) {
        return messages[pos].querySelector('.selectable-text').innerText.trim();
    } else {
        return false;
    }
}

function getUnreadChats() {
    var unreadchats = [];
    var chats = getElement("chats");
    if (chats) {
        chats = chats.childNodes;
        for (var i in chats) {
            if (!(chats[i] instanceof Element)) {
                continue;
            }
            var icons = getElement("chat_icons", chats[i]).childNodes;
            if (!icons) {
                continue;
            }
            for (var j in icons) {
                if (icons[j] instanceof Element) {
                    if (!(icons[j].childNodes[0].getAttribute('data-icon') == 'muted' || icons[j].childNodes[0].getAttribute('data-icon') == 'pinned')) {
                        unreadchats.push(chats[i]);

                        var count = parseInt(icons[j].childNodes[0].innerText);
                        var title = getElement("chat_title", chats[i]).title + '';
                        var msg = (getElement("chat_lastmsg", chats[i]) || {innerText: ''}).innerText.trim();

                        if (!(title in logs)) {
                            logs[title] = [];
                        }

                        if (logs[title].length == 0 || logs[title][logs[title].length - 1] != msg) {
                            logs[title].push(msg);
                        }
                        
                        break;
                    }
                }
            }
        }
    }
}
