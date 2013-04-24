document.addEventListener('DOMContentLoaded', function() {
  var msg = document.getElementById('message');
  var list = document.querySelector('.history_list');
  var btn_his = document.querySelector('.btn_history');
  var more = document.getElementById('btn_more_history');
  var local = "";

  // Get value from Chrome Storage
  chrome.storage.sync.get(["b_message", "b_messages"],function(date){
    msg.value = (date.b_message ? date.b_message : '');
    local = date.b_messages ? date.b_messages : [];
    local.reverse();
    console.log(local.length);
    if ( local.length !== 0 ) { btn_his.style.display = "block";} else{}
  });
  var trans = function () {
    var text = msg.value;
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
      chrome.storage.sync.set({'b_message': ''});
    });
  };
  // Add Click Event
  document.getElementById('btn_sent').addEventListener('click', trans);
  // Add Keydown Event
  msg.addEventListener('keyup', function(event) {
    chrome.storage.sync.set({'b_message': msg.value},function () {
      console.log(msg.value);
    });
    if(event.keyCode === 13) {
      trans();
    }
  }, false);

  // btn_history
  btn_his.onclick = function () {
    list.className = "history_list animate";
    this.className = "btn_history btn_history_r";

    var temp = "";
    var local_num = "";
    var history_list = document.querySelector('.history_list');

    console.log(local.length);
    if ( local.length > 5 ) {
      local_num = 5;
      more.style.display = "block";
    } else{
      local_num = local.length;
    }
    for (var j = 0; j < local_num; j++) {
      temp += '<li title="' + local[j] + '">' + local[j] + '</li>';
    }
    history_list.innerHTML = temp;

    // History
    var his = list.getElementsByTagName('li');
    for (var i = 0; i < his.length; i++) {
      his[i].onclick = function () {
        msg.value = this.firstChild.nodeValue;
      };
    }
  };

  // i18n
  msg.placeholder = chrome.i18n.getMessage('pop_message_placeholder');
});
