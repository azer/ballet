;(function(process){  require.m = { 0:[function(require,module,exports){ var uzo = require("./");

window.io = window.uzo = uzo;
 },{"./":11}],11:[function(require,module,exports){ var connect = require("./lib/connect");
var sub = require("./lib/sub");
var settings = require("./lib/settings");

connect();

module.exports = settings;
module.exports.settings = settings;
module.exports.sub = sub;
module.exports.pub = pub;

function pub () {

}
 },{"./lib/connect":12,"./lib/sub":17,"./lib/settings":18}],12:[function(require,module,exports){ var transport = require("./transport");
var sub = require('./sub');

module.exports = connect;

function connect () {
  console.log('connecting');
  transport.start();
  transport.onMessage(sub.publish);
}
 },{"./transport":13,"./sub":17}],17:[function(require,module,exports){ var pubsub = require("pubsub");

module.exports = pubsub();
 },{"pubsub":16}],18:[function(require,module,exports){ var attrs = require("attr").attrs;

module.exports = attrs({
  host: '/'
});
 },{"attr":19}],13:[function(require,module,exports){ var transports = require('./transports');

module.exports = transports.jsonp;
 },{"./transports":14}],14:[function(require,module,exports){ var jsonp = require("./jsonp");

module.exports = {
  jsonp: jsonp
};

 },{"./jsonp":15}],15:[function(require,module,exports){ var pubsub = require("pubsub");
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
 },{"pubsub":16}],16:[function(require,module,exports){ module.exports = PubSub;

function PubSub(mix){

  var proxy = mix || function pubsubProxy(){
    arguments.length && sub.apply(undefined, arguments);
  };

  function sub(callback){
    subscribe(proxy, callback);
  }

  function subOnce(callback){
    once(proxy, callback);
  }

  function unsubOnce(callback){
    unsubscribeOnce(proxy, callback);
  }

  function unsub(callback){
    unsubscribe(proxy, callback);
  }

  function pub(){
    var args = [proxy];
    Array.prototype.push.apply(args, arguments);
    publish.apply(undefined, args);
  }

  proxy.subscribers        = [];
  proxy.subscribersForOnce = [];

  proxy.subscribe          = sub;
  proxy.subscribe.once     = subOnce;
  proxy.unsubscribe        = unsub;
  proxy.unsubscribe.once   = unsubOnce;
  proxy.publish            = pub;

  return proxy;
}

/**
 * Publish "from" by applying given args
 *
 * @param {Function} from
 * @param {...Any} args
 */
function publish(from){

  var args = Array.prototype.slice.call(arguments, 1);

  if (from && from.subscribers && from.subscribers.length > 0) {
    from.subscribers.forEach(function(cb, i){
      if(!cb) return;

      try {
        cb.apply(undefined, args);
      } catch(exc) {
        setTimeout(function(){ throw exc; }, 0);
      }
    });
  }

  if (from && from.subscribersForOnce && from.subscribersForOnce.length > 0) {
    from.subscribersForOnce.forEach(function(cb, i){
      if(!cb) return;

      try {
        cb.apply(undefined, args);
      } catch(exc) {
        setTimeout(function(){ throw exc; }, 0);
      }
    });

    from.subscribersForOnce = [];

  }

}

/**
 * Subscribe callback to given pubsub object.
 *
 * @param {Pubsub} to
 * @param {Function} callback
 */
function subscribe(to, callback){
  if(!callback) return false;
  return to.subscribers.push(callback);
}


/**
 * Subscribe callback to given pubsub object for only one publish.
 *
 * @param {Pubsub} to
 * @param {Function} callback
 */
function once(to, callback){
  if(!callback) return false;

  return to.subscribersForOnce.push(callback);
}

/**
 * Unsubscribe callback to given pubsub object.
 *
 * @param {Pubsub} to
 * @param {Function} callback
 */
function unsubscribe(to, callback){
  var i = to.subscribers.length;

  while(i--){
    if(to.subscribers[i] && to.subscribers[i] == callback){
      to.subscribers[i] = undefined;

      return i;
    }
  }

  return false;
}


/**
 * Unsubscribe callback subscribed for once to specified pubsub.
 *
 * @param {Pubsub} to
 * @param {Function} callback
 * @return {Boolean or Number}
 */
function unsubscribeOnce(to, callback){
  var i = to.subscribersForOnce.length;

  while(i--){
    if(to.subscribersForOnce[i] && to.subscribersForOnce[i] == callback){
      to.subscribersForOnce[i] = undefined;

      return i;
    }
  }

  return false;
}
 },{}],19:[function(require,module,exports){ var pubsub = require("pubsub"),
    prop   = require("property");

module.exports        = attr;
module.exports.attrs  = attrs;
module.exports.all    = attrs;
module.exports.object = attrs;

function attr(){
  var obj = pubsub(prop.apply(null, arguments).extend(function(raw){

    return function(newValue){
      var oldValue = raw(),
          ret      = raw.apply(undefined, arguments);

      if(arguments.length && oldValue != ret ){
        obj.publish(ret, oldValue);
      }

      return ret;
    };

  }));

  return obj;
}

function attrs(raw, exceptions){
  var obj = {}, key, val;

  for(key in raw){
    val = raw[key];
    obj[key] = ( ! Array.isArray(exceptions) || exceptions.indexOf(key) == -1 )
      && ( typeof val != 'object' || !val || val.constructor != Object )
      && ( typeof val != 'function' )
      ? attr(val)
      : val;
  }

  return obj;
}
 },{"pubsub":16,"property":20}],20:[function(require,module,exports){ module.exports = prop;

/**
 * Create and return a new property.
 *
 * @param {Anything} rawValue (optional)
 * @param {Function} getter (optional)
 * @param {Function} setter (optional)
 * @return {AdaProperty}
 */
function prop(rawValue, getter, setter){

  var raw = (function(value){

    return function raw(update){
      if( arguments.length ){
        value = update;
      }

      return value;
    };

  }());

  function proxy(update, options){
    if(arguments.length > 0){
      raw( setter ? setter(update, raw()) : update );
    }

    return getter ? getter(raw()) : raw();
  };

  proxy.extend = function(ext){
    raw = ext(raw);
    return proxy;
  }

  proxy.getter = function(newGetter){
    getter = newGetter;
    return proxy;
  };

  proxy.setter = function(newSetter){
    setter = newSetter;
    return proxy;
  };

  proxy.isAdaProperty = true;
  proxy.raw           = raw;

  raw(setter ? setter(rawValue) : rawValue);

  return proxy;
}
 },{}] }; function require(o){ if(o[2]) return o[2].exports; o[0](function(u){ if(!require.m[o[1][u]]) { throw new Error('Cannot find module "' + u + '"'); } return require(require.m[o[1][u]]); }, o[2] = { exports: {} }, o[2].exports); return o[2].exports; };  return require(require.m[0]); }({ env:{} }));