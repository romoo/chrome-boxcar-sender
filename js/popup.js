
document.addEventListener('DOMContentLoaded', function() {
  var msg = document.getElementById('message');
  // Get value from Chrome Storage
  chrome.storage.sync.get(["b_message"],function(date){
    msg.value = (date.b_message ? date.b_message : '');
  });
  var trans = function () {
    var text = msg.value;
    console.log(text);
    chrome.tabs.query({
      currentWindow: true,
      active: true
    }, function(tab) {
      console.log('ready to send.');
      chrome.extension.sendMessage(tab.id, {
        'greeting': 'hello',
        'title': chrome.i18n.getMessage('trans_send_title'),
        'text': text
      });
      chrome.storage.sync.set({'b_message': ''});
    });
  };
  // Add Click Event
  document.getElementById('btn_sent').addEventListener('click', trans);
  // Add Keydown Event
  msg.addEventListener('keyup', function(event) {
    chrome.storage.sync.set({'b_message': msg.value},function () {
      console.log(msg.value);
    });
    if(event.keyCode === 13) {
      trans();
    }
  }, false);
  // i18n
  msg.placeholder = chrome.i18n.getMessage('pop_message_placeholder');
});