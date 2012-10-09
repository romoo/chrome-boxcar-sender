// 添加「点击」事件
document.addEventListener('DOMContentLoaded', function () {
  $('btn_save').addEventListener('click', function () {
    save();
  });
});

// 添加「onload」事件
window.addEventListener("load", function () {
  load();
}, false);