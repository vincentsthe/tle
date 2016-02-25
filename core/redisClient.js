var redis = require('redis');
var redisConfig = require('../config.json').redis;

var client = redis.createClient({
  host: redisConfig.host,
  port: redisConfig.port
});

client.on("error", function (err) {
  console.error("redis connection error: " + err);
});

module.exports = client;