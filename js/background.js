var ACCES_TOKEN = '',
  sounds = '',
  local = [];

function RequestPermission(callback) {
  window.webkitNotifications.requestPermission(callback);
}

function notify(title, text) {
  if(window.webkitNotifications) {
    if(window.webkitNotifications.checkPermission() > 0) {
      RequestPermission(notify);
    } else {
      var notification = webkitNotifications.createNotification('./48.png', title, text);
      notification.show();
      setTimeout(function(){ notification.cancel(); },5000);
    }
  }
}

function boxcar(title, message) {
  console.log("boxcar:" + message);
  var req = new XMLHttpRequest();
  chrome.storage.sync.get(["b_acces_token", "b_messages", "b_sounds"], function(date) {
    var acces_token_page = chrome.extension.getURL('options.html#acces_token');
    ACCES_TOKEN = (date.b_acces_token ? date.b_acces_token : '');
    sounds = (date.b_sounds ? date.b_sounds : 'bird-1');
    local = date.b_messages ? date.b_messages : [];
    local.push(message);

    var params = '&user_credentials=' + ACCES_TOKEN + '&notification[title]=Chrome&notification[sound]='+ sounds +'&notification[long_message]=' + message;
    req.open('POST', 'https://new.boxcar.io/api/notifications', true);
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.onreadystatechange = function() {
      // TODO: do sth here based on failure/success.
      if(req.readyState == 4) {
        // 4 = "loaded"
        if(req.status == 201 ) {
          console.log('Send it.');
          notify(title, message);
        } else if(req.status == 400 || req.status == 405 || req.status == 404) {
          chrome.tabs.create({
            url: acces_token_page
          });
        } else if(req.status == 401) {
          console.log('Invalid username/password');
        }
      }
    };
    req.send(params);
    chrome.storage.sync.set({"b_messages": local}, function (date) {
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.sync.get(["b_acces_token"], function(date) {
    if(date.b_acces_token === "") {
      chrome.tabs.create({
        url: chrome.extension.getURL('options.html#acces_token')
      });
    }
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "hello"){
      boxcar(request.title, request.text);
      console.log(request.title + request.text);
    }
    if (request.greeting == "saved") {
      notify(request.title, "");
    }
  }
);

chrome.contextMenus.create({
  "type": "normal",
  "title": chrome.i18n.getMessage("contextMenus_selection_title"),
  "contexts": ["selection"],
  "onclick": function(info, tab) {
    boxcar(chrome.i18n.getMessage("contextMenus_selection_title_notify"), info.selectionText);
  }
});

chrome.contextMenus.create({
  "type": "normal",
  "title": chrome.i18n.getMessage("contextMenus_link_title"),
  "contexts": ["link"],
  "onclick": function(info, tab) {
    boxcar(chrome.i18n.getMessage("contextMenus_selection_title_notify"), info.linkUrl);
  }
});

chrome.contextMenus.create({
  "type": "normal",
  "title": chrome.i18n.getMessage("contextMenus_page_title"),
  "contexts": ["page"],
  "onclick": function(info, tab) {
    boxcar(chrome.i18n.getMessage("contextMenus_selection_title_notify"), info.pageUrl);
  }
});

chrome.contextMenus.create({
  "type": "normal",
  "title": chrome.i18n.getMessage("contextMenus_image_title"),
  "contexts": ["image"],
  "onclick": function(info, tab) {
    boxcar(chrome.i18n.getMessage("contextMenus_selection_title_notify"), info.srcUrl);
  }
});
