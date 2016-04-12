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
      password: geddy.config.redis_password,
      host: geddy.config.redis_host,
      port: geddy.config.redis_port,
      timeout: 0});

    geddy.redis_cli.on("error", function (err) {
      geddy.log.error("Error " + err);
    });
  });
};

exports.init = init;
