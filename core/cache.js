var redisClient= require('./redisClient');

var cache = {};

var getValueFromCache = function (key, expireTime, updateExpireTime, retrieveFunction, callback) {
  redisClient.get(key, function (err, valueString) {
    if (err) {
      callback(err);
    } else if (valueString) {
      var value = JSON.parse(valueString);
      if (updateExpireTime) {
        redisClient.expire(key, expireTime);
      }
      callback(null, value);
    } else {
      retrieveFunction(function (err, value) {
        if (err) {
          callback(err);
        } else {
          var valueString = JSON.stringify(value);
          redisClient.set(key, valueString);
          redisClient.expire(key, expireTime);

          callback(null, value);
        }
      });
    }
  });
};

cache.getCacheValue = function (key, expireTime, retrieveFunction, callback) {
  getValueFromCache(key, expireTime, false, retrieveFunction, callback);
};

/**
 * The difference between this function and the above function is
 * this cache implementation will update the expire time every
 * time cache is accessed.
 */
cache.getUpdateCacheValue = function (key, expireTime, retrieveFunction, callback) {
  getValueFromCache(key, expireTime, true, retrieveFunction, callback);
};

module.exports = cache;