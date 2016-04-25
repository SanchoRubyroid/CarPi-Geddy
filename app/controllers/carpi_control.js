var CarpiControl = function () {
  this.index = function (req, resp, params) {
    geddy.io.sockets.on('connection', function(socket) {
      socket.on('car-control', function(data) {
        var vehicle_socket = geddy.vehicleConnectionUtils.getSocketByName(params['id'])
        vehicle_socket.write(new Buffer(data))
      });
    });

    this.respond({params: params}, {
      format: 'html'
    , template: 'app/views/carpi_control/index'
    });
  };
};

exports.CarpiControl = CarpiControl;
