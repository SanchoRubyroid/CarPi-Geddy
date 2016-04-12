exports.emitCarsList = function(socket) {
  geddy.redis_cli.client('list', function(err, reply) {
    var clients = []
    reply.split("\n").forEach(function(client){
      client.split(' ').forEach(function(key_value){
        var key_value_arr = key_value.split('=')
        if(key_value_arr[0] == 'name' && key_value_arr[1].match(/__vehicle__/)){
          clients.push(key_value_arr[1].replace(/__vehicle__/, ''))
        }
      });
    });
    socket.emit('cars-list', clients);
  })
};
