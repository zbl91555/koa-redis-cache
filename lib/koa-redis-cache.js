'use strict';

var Redis = require('redis'),
  wrapper = require('co-redis'),
  pathToRegExp = require('path-to-regexp');

module.exports = function(options) {
  options = options || {};
  var redisOptions = options.redis || {},
    prefix = options.prefix || 'koa-redis-cache:',
    expire = options.expire || 30 * 60, // 30 min
    routes = options.routes || ['*'],
    exclude = options.exclude || [];

  var redisClient = wrapper(Redis.createClient(redisOptions.port, redisOptions.host, redisOptions.options));

  return function * cache(next) {
    var self = this,
      url = self.url,
      key = prefix + url,
      tkey = prefix + url + ':type',
      match = false;

    for (var i = 0; i < routes.length; i++) {
      if (pathToRegExp(routes[i], []).exec(url)) {
        match = true;
        break;
      }
    }

    for (var j = 0; j < exclude.length; j++) {
      if (pathToRegExp(exclude[j], []).exec(url)) {
        match = false;
        break;
      }
    }

    if (!match) {
      yield * next;
      return;
    }

    var value = yield redisClient.get(key),
      type;
    if (value) {
      self.status = 200;
      type = (yield redisClient.get(tkey)) || 'text/html';
      self.lastModified = new Date();
      self.type = type;
      self.body = value;
      return;
    }

    yield * next;

    var body = self.body;
    type = undefined;
    if ((self.method !== 'GET') || (self.status !== 200) || !body) {
      return;
    }

    if ((typeof body === 'string') || Buffer.isBuffer(body)) {
      // string, buffer
      yield redisClient.setex(key, expire, body);

      type = self.type;
      if (type) {
        yield redisClient.setex(tkey, expire, type);
      }
      return;
    }

    if (typeof body.pipe !== 'function') {
      // json
      yield redisClient.setex(key, expire, JSON.stringify(body));

      type = self.type;
      if (type) {
        yield redisClient.setex(tkey, expire, type);
      }
      return;
    }
  };
};