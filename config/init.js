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


    geddy.io.sockets.on('connection', function(socket) {
      setInterval(function(){
        geddy.redis_cli.keys('car*', function(err, carNames){
          // carNames.forEach(function (name){
          //   geddy.redis_cli.get(name, function(err, status){
          //     socket.emit('car-status', name, status);
          //   })
          // })

          socket.emit('cars-list', carNames);
        })
      }, 1000);
    });

    geddy.io.sockets.on('online', function(car_name) {
      geddy.redis_cli.setex('car'+car_name, 2, '')
    });
  })
};

exports.init = init;
