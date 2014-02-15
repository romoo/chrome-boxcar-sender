function send(text) {
  var r = confirm(chrome.i18n.getMessage("history_send"));
  if ( r === true ) {
    chrome.runtime.sendMessage({
      'greeting': 'hello',
      'title': chrome.i18n.getMessage('trans_send_title'),
      'text': text
    });
    location.reload();
  } else{ console.log('no'); }
}

function loadhistory () {
  chrome.storage.sync.get(["b_messages"],function(date){
    var inner = document.querySelector(".settings_inner");
    if ( date.b_messages ) { // 有数据
      var local = date.b_messages;
      local.reverse();
      var temp = "";
      for (var i = 0; i < local.length; i++) {
        temp += '<li title="' + local[i] + '">' + local[i] + '</li>';
      }
      var loading = document.querySelector('.settings h3');
      var tip = document.querySelector('.history_tip');
      var history_all = document.querySelector('.history_all');
      loading.style.display = "none";
      tip.style.display = "block";
      history_all.innerHTML = temp;
      var history_one = document.querySelectorAll('.history_all li');
      for (var j = 0; j < history_one.length; j++) {
        var text = history_one[j].firstChild.nodeValue;
        history_one[j].addEventListener('click', function(event){
          send(text);
        }, false);
      }
    } else{
      inner.innerHTML = '<h3>现在还没有数据</h3>';
    }
  });
}



// 添加「onload」事件
window.addEventListener("load", function () {
  loadhistory();
  var btn_clear = document.querySelector('.btn_clear');
  btn_clear.onclick = function () {
    var r = confirm(chrome.i18n.getMessage("history_delete"));
    if (r === true) {
      chrome.storage.sync.set({"b_messages": ""}, function() {});
      location.reload();
    } else {
      console.log("no");
    }
  };
}, false);

// storage
chrome.storage.sync.get(null, function (Items) {console.log(Items);});

