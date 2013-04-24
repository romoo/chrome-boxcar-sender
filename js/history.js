function loadhistory () {
  chrome.storage.sync.get(["b_messages"],function(date){
    console.log("local: " + local + " date: " + date.b_messages);
    var inner = document.querySelector(".settings_inner");
    if ( date.b_messages ) {
      console.log("有数据");
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
      console.log(history_all);
      var history_one = history_all.getElementsByTagName('li');
      for (var j = 0; j < history_one.length; j++) {
        history_one[j].onclick = function () {
          var r = confirm(chrome.i18n.getMessage("history_send"));
          if ( r === true ) {
            var text = this.firstChild.nodeValue;
            console.log(text);
            chrome.tabs.query({
              currentWindow: true,
              active: true
            }, function(tab) {
              console.log('ready to send.');
              chrome.extension.sendMessage(tab.id, {
                'greeting': 'hello',
                'title': chrome.i18n.getMessage('trans_send_title'),
                'text': text
              });
              location.reload();
            });
          } else{ console.log('no'); }
        };
      }
    } else{
      inner.innerHTML = '<h3>现在还没有数据</h3>';
    }
  });
}
loadhistory();



// 添加「onload」事件
window.addEventListener("load", function () {
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

