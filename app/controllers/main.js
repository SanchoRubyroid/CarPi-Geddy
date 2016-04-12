/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

var redis_utils = require('../../lib/redis-utils.js');

var Main = function () {
  this.index = function (req, resp, params) {
    var sub_client = geddy.redis_cli.duplicate();

    geddy.io.sockets.on('connection', function(socket) {
      redis_utils.emitCarsList(socket);

      setInterval(function(){
        redis_utils.emitCarsList(socket);
      }, 2000);

      sub_client.on("message", function (channel, key) {
        if(key == 'car-online') redis_utils.emitCarsList(socket);
      });
      sub_client.subscribe('__keyevent@0__:set');
    });

    this.respond({params: params}, {
      format: 'html'
    , template: 'app/views/main/index'
    });
  };
};

exports.Main = Main;
