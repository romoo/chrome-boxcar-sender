/**
 * Returns a handler which will open a new window when activated.
 */
function get_text(info, tab) {
  var text = info.selectionText;
  chrome.tabs.getSelected(null, function (tab) {
    chrome.tabs.sendMessage(tab.id, {"greeting": "hello", "text": text});
    console.log('send');
  });
  console.log(text);
}

/**
 * Create a context menu which will only show up for images.
 */
chrome.contextMenus.create({
  "type":"normal",
  "title":"Send '%s' to Boxcar",
  "contexts":["selection"],
  "onclick": get_text
});
