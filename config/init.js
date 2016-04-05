var redis = require("redis")

var init = function(cb) {

  // Add uncaught-exception handler in prod-like environments
  if (geddy.config.environment != 'development') {
    process.addListener('uncaughtException', function (err) {
      var msg = err.message;
      if (err.stack) {
        msg += '\n' + err.stack;
      }
      if (!msg) {
        msg = JSON.stringify(err);
      }
      geddy.log.error(msg);
    });
  }
  cb();

  geddy.on('started', function() {
    // redis client setup
    geddy.redis_cli = redis.createClient({
      password: geddy.config.redis_pwd,
      timeout: 0});

    geddy.redis_cli.on("error", function (err) {
      geddy.log.error("Error " + err);
    });

    var sub_client = geddy.redis_cli.duplicate();

    geddy.io.sockets.on('connection', function(socket) {
      sub_client.on("message", function (channel, key) {
        if(key.substring(3,-1) == 'car') {
          var eventName = channel.replace('__keyevent@0__:', '');
          var carName = key.substring(3)
          socket.emit('car-action', eventName, carName);
        }
      });

      sub_client.subscribe('__keyevent@0__:expired');
      sub_client.subscribe('__keyevent@0__:set');
    });
  });
};

exports.init = init;
