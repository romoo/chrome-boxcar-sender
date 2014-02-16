function save(title) {
  chrome.storage.sync.set({
    "b_acces_token": document.getElementById('acces_token').value,
    "b_sounds": document.getElementById('settings_sounds').value
  }, function() {
    chrome.runtime.sendMessage({
      "greeting": "saved",
      "title": title,
      "text": ""
    });
  });
}

function load() {
  chrome.storage.sync.get(["b_acces_token", "b_sounds"],function(date){
    document.getElementById('acces_token').value = (date.b_acces_token ? date.b_acces_token : '');
    document.getElementById('settings_sounds').value = (date.b_sounds ? date.b_sounds : 'bird-1');
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
