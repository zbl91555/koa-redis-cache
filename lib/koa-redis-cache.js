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
    exclude = options.exclude || [],
    passParam = options.passParam || '';

  var redisClient = wrapper(Redis.createClient(redisOptions.port, redisOptions.host, redisOptions.options));

  return function * cache(next) {
    var ctx = this,
      url = ctx.url,
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

    if (!match || (passParam && ctx.query[passParam])) {
      yield * next;
      return;
    }

    var ok = false;
    try {
      ok = yield getCache(key, tkey, ctx, redisClient);
    } catch (e) {
      ok = false;
    }
    if (ok) {
      return;
    }

    yield * next;

    try {
      yield setCache(key, tkey, expire, ctx, redisClient);
    } catch (e) {}
  };
};

function * getCache(key, tkey, ctx, redisClient) {
  var value = yield redisClient.get(key),
    type,
    ok = false;

  if (value) {
    ctx.status = 200;
    type = (yield redisClient.get(tkey)) || 'text/html';
    ctx.set('from-redis-cache', 'true');
    ctx.type = type;
    ctx.body = value;
    ok = true;
  }

  return ok;
}

function * setCache(key, tkey, expire, ctx, redisClient) {
  var body = ctx.body,
    type;

  if ((ctx.method !== 'GET') || (ctx.status !== 200) || !body) {
    return;
  }

  if ((typeof body === 'string') || Buffer.isBuffer(body)) {
    // string, buffer
    yield redisClient.setex(key, expire, body);

    type = ctx.type;
    if (type) {
      yield redisClient.setex(tkey, expire, type);
    }
    return;
  }

  if (typeof body.pipe !== 'function') {
    // json
    yield redisClient.setex(key, expire, JSON.stringify(body));

    type = ctx.type;
    if (type) {
      yield redisClient.setex(tkey, expire, type);
    }
    return;
  }
}