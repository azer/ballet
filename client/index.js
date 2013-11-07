var connect = require("./lib/connect");
var sub = require("./lib/sub");
var settings = require("./lib/settings");

connect();

module.exports = settings;
module.exports.settings = settings;
module.exports.sub = sub;
module.exports.pub = pub;

function pub () {

}
