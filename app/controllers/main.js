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
var redis = require("redis")

var Main = function () {
  redis_cli = redis.createClient();

  redis_cli.on("error", function (err) {
    geddy.log.error("Error " + err);
  });
  redis_cli.set("string key", "string val", redis.print);
  redis_cli.hset("hash key", "hashtest 1", "some value", redis.print);
  redis_cli.hset(["hash key", "hashtest 2", "some other value"], redis.print);
  redis_cli.hkeys("hash key", function (err, replies) {
    geddy.log.notice(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        geddy.log.notice("    " + i + ": " + reply);
    });
    redis_cli.quit();
  });


  this.index = function (req, resp, params) {
    this.respond({params: params}, {
      format: 'html'
    , template: 'app/views/main/index'
    });
  };
};

exports.Main = Main;
