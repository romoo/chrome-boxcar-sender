
// Add Click Event
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('btn_sent').addEventListener('click', function () {
    var text = document.getElementById('message').value;
    console.log(text);
    chrome.tabs.query({currentWindow: true, active: true}, function(tab) {
      console.log("ready to send.");
      chrome.extension.sendMessage(tab.id,{
        "greeting": "hello",
        "text": text
      });
    });
    // boxcar();
  });
});
