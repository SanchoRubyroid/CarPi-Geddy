var net = require('net');

vehicleNames = function() {
  var vehicle_names = []

  geddy.vehicles_sockets.forEach(function(vehicles_socket){
    vehicle_names.push(vehicles_socket.vehicle_name)
  })

  return vehicle_names
}

exports.getSocketByName = function(vehicle_name) {
  return geddy.vehicles_sockets.find(function(socket){
    return socket.vehicle_name === vehicle_name
  })
}

exports.initializeVehiclesServer = function() {
  geddy.vehicles_sockets = []

  geddy.vehicles_server = net.createServer(function(socket) {
    geddy.vehicles_sockets.push(socket)

    socket.on('end', () => {
      geddy.vehicles_sockets.splice(geddy.vehicles_sockets.indexOf(socket.vehicle_name),1)
      geddy.io.sockets.emit('cars-list', vehicleNames());
    });

    socket.on('data', (data) => {
      var vehicle_name_pattern = /^vn:/

      if(vehicle_name_pattern.test(data)) {
        var vehicle_name = data.toString().replace(vehicle_name_pattern, '')
        socket.vehicle_name = vehicle_name
        geddy.io.sockets.emit('cars-list', vehicleNames());
        socket.pause()
      }
    });

    // socket.write('Echo server\r\n');
    // socket.pipe(socket);
  });

  geddy.vehicles_server.listen(1337, '127.0.0.1');
}

exports.vehicleNames = vehicleNames
