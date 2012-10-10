function save(title) {
  chrome.storage.sync.set({"b_email": document.getElementById('email').value, "b_api_key": document.getElementById('api_key').value}, function() {
    console.log('Saved.');
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
  chrome.storage.sync.get(["b_email","b_api_key"],function(date){
    document.getElementById('email').value = (date.b_email ? date.b_email : '');
    document.getElementById('api_key').value = (date.b_api_key ? date.b_api_key : 'SNGrQsRGuIbIEfraKJK0');
  });
  console.log('body loaded.');
}

// 添加「点击」事件
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('btn_save').addEventListener('click', function () {
    save(chrome.i18n.getMessage("btn_save_text"));
  });
  document.getElementById('email').addEventListener("keydown", function(event) {
    if(event.keyCode === 13) {
      save(chrome.i18n.getMessage("btn_save_text"));
    }
  }, false);
  document.getElementById('api_key').addEventListener("keydown", function(event) {
    if(event.keyCode === 13) {
      save(chrome.i18n.getMessage("btn_save_text"));
    }
  }, false);
  // i18n
  document.getElementById('email').placeholder = chrome.i18n.getMessage('settings_email_placeholder');
  document.getElementById('api_key').placeholder = chrome.i18n.getMessage('settings_api_key_placeholder');
  document.getElementById('api_help').title = chrome.i18n.getMessage('settings_api_help_title');
});

// 添加「onload」事件
window.addEventListener("load", function () {
  load();
}, false);
