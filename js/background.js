var email = '',
api_key = '';

function RequestPermission(callback) {
  window.webkitNotifications.requestPermission(callback);
}

function notify(text) {
  if(window.webkitNotifications) {
    if(window.webkitNotifications.checkPermission() > 0) {
      RequestPermission(notify);
    } else {
      var notification = webkitNotifications.createNotification(
        './48.png',
        'Send.',
        text
      );
      notification.ondisplay = function() {
        // setTimeout('notification.cancel()', 5000);
      };
      notification.show();
    }
  }
}

function boxcar(message) {
  console.log("boxcar:" + message);
  var req = new XMLHttpRequest();
  chrome.storage.sync.get(["b_email","b_api_key"], function(date){
    var email_page = chrome.extension.getURL('options.html#email');
    var api_key_page = chrome.extension.getURL('options.html#email');
    console.log(email_page);
    // chrome.tabs.create or window.open ?
    email= (date.b_email ? date.b_email : chrome.tabs.create({url: email_page}));
    api_key= (date.b_api_key ? date.b_api_key : chrome.tabs.create({url: api_key_page}));
    // email= (date.b_email ? date.b_email : window.open(email_page, "popup"));
    // api_key= (date.b_api_key ? date.b_api_key : window.open(api_key_page, "popup"));
    console.log(api_key);
    
    var params = 'email=' + email + '&notification[from_screen_name]=Chrome&notification[message]=' + message;
    req.open('POST', 'http://boxcar.io/devices/providers/' + api_key + '/notifications', true);
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.onreadystatechange = function() {
      // TODO: do sth here based on failure/success.
      if (req.readyState == 4){
        // 4 = "loaded"
        if (req.status == 200) {
          console.log('Send it.');
          notify(message).show();
        }
        else if(req.status == 400){
          console.log('No application/event defined');
        }
        else if(req.status == 401){
          console.log('Invalid username/password');
        }
      }
    };
    req.send(params);
  });
  // $('console').innerHTML = 'send it!';
}

chrome.extension.onMessage.addListener(
function(request, sender, sendResponse) {
  if(request.greeting == "hello") {
    boxcar(request.text);
    console.log(request.text);
  }
});

chrome.contextMenus.create({
  "type": "normal",
  "title": "Send '%s' to Boxcar",
  "contexts": ["selection"],
  "onclick": function (info, tab) {
    boxcar(info.selectionText);
  }
});

chrome.contextMenus.create({
  "type": "normal",
  "title": "Send Link to Boxcar",
  "contexts": ["link"],
  "onclick": function (info, tab) {
    boxcar(info.linkUrl);
  }
});

chrome.contextMenus.create({
  "type": "normal",
  "title": "Send Page to Boxcar",
  "contexts": ["page"],
  "onclick": function (info, tab) {
    boxcar(info.pageUrl);
  }
});

chrome.contextMenus.create({
  "type": "normal",
  "title": "Send Image to Boxcar",
  "contexts": ["image"],
  "onclick": function (info, tab) {
    boxcar(info.srcUrl);
  }
});