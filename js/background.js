var email = '',
  api_key = '';
console.log(chrome.i18n.getMessage("test"));

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
  chrome.storage.sync.get(["b_email", "b_api_key"], function(date) {
    var email_page = chrome.extension.getURL('options.html#email');
    // var api_key_page = chrome.extension.getURL('options.html#email');
    // console.log(email_page);
    email = (date.b_email ? date.b_email : '');
    api_key = (date.b_api_key ? date.b_api_key : '');
    // email= (date.b_email ? date.b_email : window.open(email_page, "popup"));
    // api_key= (date.b_api_key ? date.b_api_key : window.open(api_key_page, "popup"));
    console.log(api_key);

    var params = 'email=' + email + '&notification[from_screen_name]=Chrome&notification[message]=' + message;
    req.open('POST', 'http://boxcar.io/devices/providers/' + api_key + '/notifications', true);
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.onreadystatechange = function() {
      // TODO: do sth here based on failure/success.
      if(req.readyState == 4) {
        // 4 = "loaded"
        if(req.status == 200) {
          console.log('Send it.');
          notify(title, message);
        } else if(req.status == 400 || req.status == 405 || req.status == 404) {
          // console.log('No application/event defined');
          chrome.tabs.create({
            url: email_page
          });
        } else if(req.status == 401) {
          console.log('Invalid username/password');
        }
      }
    };
    req.send(params);
  });
  // $('console').innerHTML = 'send it!';
}

document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.sync.get(["b_email", "b_api_key"], function(date) {
    if(date.b_email === "") {
      chrome.tabs.create({
        url: chrome.extension.getURL('options.html#email')
      });
    }
  });
});

chrome.extension.onMessage.addListener(
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
