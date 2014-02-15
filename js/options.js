function save(title) {
  chrome.storage.sync.set({"b_acces_token": document.getElementById('acces_token').value}, function() {
    chrome.tabs.query({
      currentWindow: true,
      active: true
    }, function(tab) {
      chrome.extension.sendMessage(tab.id, {
        "greeting": "saved",
        "title": title,
        "text": ""
      });
    });
  });
}

function load() {
  chrome.storage.sync.get(["b_acces_token"],function(date){
    document.getElementById('acces_token').value = (date.b_acces_token ? date.b_acces_token : '');
  });
}

// 添加「点击」事件
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('btn_save').addEventListener('click', function () {
    save(chrome.i18n.getMessage("btn_save_text"));
  });
  document.getElementById('acces_token').addEventListener("keydown", function(event) {
    if(event.keyCode === 13) {
      save(chrome.i18n.getMessage("btn_save_text"));
    }
  }, false);
  // i18n
  document.getElementById('acces_token').placeholder = chrome.i18n.getMessage('settings_acces_token_placeholder');
});

// 添加「onload」事件
window.addEventListener("load", function () {
  load();
}, false);
