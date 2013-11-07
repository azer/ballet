var pubsub = require("pubsub");
var onMessage = pubsub();

module.exports = {
  start: start,
  onMessage: onMessage
};

window.__gJC = function (message) {
  console.log(';;', message);
  if (message.handshake) {
    send('/uzoio/continue/' + message.handshake);
    return;
  }
  onMessage.publish(message);
}

function send (url) {
  var scr = document.createElement('script');
  scr.src = url;
  scr.onload = keep;
  document.documentElement.appendChild(scr);
}

function start () {
  send('/uzoio/new');
}

function keep () {
  console.log('keep');
  return;
  setTimeout(function () {
    send();
  }, 1500);
}
