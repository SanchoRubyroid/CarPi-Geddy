var CarpiControl = function () {
  this.index = function (req, resp, params) {
    geddy.io.sockets.on('connection', function(socket) {
      socket.on('car-control', function(data) {
        geddy.redis_cli.publish(params['id'], JSON.stringify(data))      
      });
    });

    this.respond({params: params}, {
      format: 'html'
    , template: 'app/views/carpi_control/index'
    });
  };
};

exports.CarpiControl = CarpiControl;
