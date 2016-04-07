var CarpiControl = function () {
  this.index = function (req, resp, params) {
    geddy.io.sockets.on('connection', function(socket) {
      socket.on('car-control', function(data) {
        geddy.redis_cli.hmset('ctrlcarName', data)
        geddy.redis_cli.expire('ctrlcarName', 3)
      });
    });
    
    this.respond({params: params}, {
      format: 'html'
    , template: 'app/views/carpi_control/index'
    });
  };
};

exports.CarpiControl = CarpiControl;
