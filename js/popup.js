
document.addEventListener('DOMContentLoaded', function() {
  var trans = function () {
    var text = document.getElementById('message').value;
    console.log(text);
    chrome.tabs.query({
      currentWindow: true,
      active: true
    }, function(tab) {
      console.log("ready to send.");
      chrome.extension.sendMessage(tab.id, {
        "greeting": "hello",
        "title": "Send",
        "text": text
      });
    });
  };
  // Add Click Event
  document.getElementById('btn_sent').addEventListener('click', trans);
  // Add Keydown Event
  document.getElementById('message').addEventListener("keydown", function(event) {
    if(event.keyCode === 13) {
      trans();
    }
  }, false);
});