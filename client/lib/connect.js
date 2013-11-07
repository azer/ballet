var transport = require("./transport");
var sub = require('./sub');

module.exports = connect;

function connect () {
  console.log('connecting');
  transport.start();
  transport.onMessage(sub.publish);
}
