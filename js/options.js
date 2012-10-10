function save() {
  chrome.storage.sync.set({"b_email": document.getElementById('email').value, "b_api_key": document.getElementById('api_key').value}, function() {
    console.log('saved.');
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
    save();
  });
});

// 添加「onload」事件
window.addEventListener("load", function () {
  load();
}, false);