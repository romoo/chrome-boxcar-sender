function $(x) {
  return document.getElementById(x);
}

var email = '',
api_key = '';

function load() {
  chrome.storage.sync.get(["b_email","b_api_key"],function(date){
    $('email').value = (date.b_email ? date.b_email : '');
    $('api_key').value = (date.b_api_key ? date.b_api_key : 'SNGrQsRGuIbIEfraKJK0');
  });
  console.log('body loaded.');
}

function save() {
  chrome.storage.sync.set({"b_email": $('email').value, "b_api_key": $('api_key').value}, function() {
    console.log('saved.');
  });
}

function notify(text) {
  if(window.webkitNotifications) {
    if(window.webkitNotifications.checkPermission() > 0) {
      RequestPermission(notify);
    } else {
      var notification = webkitNotifications.createNotification(
        './48.png',
        'Sended',
        text
      );
      notification.ondisplay = function() {
        setTimeout('notification.cancel()', 5000);
      };
      notification.show();
    }
  }
}

function RequestPermission(callback) {
  window.webkitNotifications.requestPermission(callback);
}

function boxcar(sendmessage) {
  console.log('hah');
  var message = (sendmessage ? sendmessage : document.getElementById('message').value);

  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    // TODO: do sth here based on failure/success.
    if (req.readyState == 4){
      // 4 = "loaded"
      if (req.status == 200) {
        console.log('Send it.');
        // notify(message).show();
        // background 不能触发 show() !?
      }
      else if(req.status == 400){
        console.log('No application/event defined');
      }
      else if(req.status == 401){
        console.log('Invalid username/password');
      }
    }
  };
  chrome.storage.sync.get(["b_email","b_api_key"], function(date){
    // email= (date.b_email ? date.b_email : chrome.tabs.create({url: "options.html#email"}));
    // api_key = (date.b_api_key ? date.b_api_key : chrome.tabs.create({url: "options.html#email"}));
    email= (date.b_email ? date.b_email : window.open({url: "options.html#email"}));
    api_key = (date.b_api_key ? date.b_api_key : window.open({url: "options.html#email"}));
    
    var params = 'email=' + email + '&notification[from_screen_name]=Chrome&notification[message]=' + message;
    req.open('POST', 'http://boxcar.io/devices/providers/' + api_key + '/notifications?' + params, true);
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
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
