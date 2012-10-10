function get_text(info, tab) {
  var text = info.selectionText;
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
    console.log("ready to send.");
    chrome.tabs.sendMessage(tab.id, {
      "greeting": "hello",
      "text": text
    });
  });
}

chrome.contextMenus.create({
  "type": "normal",
  "title": "Send '%s' to Boxcar",
  "contexts": ["selection"],
  "onclick": get_text
});