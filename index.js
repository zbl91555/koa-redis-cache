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
    passParam = options.passParam || '',
    redisAvailable = true,
    onerror = options.onerror || function() {};

  var redisClient = wrapper(Redis.createClient(redisOptions.port, redisOptions.host, redisOptions.options));
  redisClient.on('error', function(error) {
    redisAvailable = false;
    onerror(error);
  });
  redisClient.on('end', function() {
    redisAvailable = false;
  });
  redisClient.on('connect', function() {
    redisAvailable = true;
  });

  return function * cache(next) {
    var ctx = this,
      url = ctx.request.url,
      path = ctx.request.path,
      key = prefix + url,
      tkey = prefix + url + ':type',
      match = false,
      routeExpire = false;

    for (var i = 0; i < routes.length; i++) {
      var route = routes[i];

      if (typeof routes[i] === 'object') {
        route = routes[i].path;
        routeExpire = routes[i].expire;
      }

      if (pathToRegExp(route, []).exec(path)) {
        match = true;
        break;
      }
    }

    for (var j = 0; j < exclude.length; j++) {
      if (pathToRegExp(exclude[j], []).exec(path)) {
        match = false;
        break;
      }
    }

    if (!redisAvailable || !match || (passParam && ctx.request.query[passParam])) {
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
      var trueExpire = routeExpire || expire;
      yield setCache(key, tkey, trueExpire, ctx, redisClient);
      routeExpire = false;
    } catch (e) {
      routeExpire = false;
    }
  };
};

function * getCache(key, tkey, ctx, redisClient) {
  var value = yield redisClient.get(key),
    type,
    ok = false;

  if (value) {
    ctx.response.status = 200;
    type = (yield redisClient.get(tkey)) || 'text/html';
    ctx.response.set('from-redis-cache', 'true');
    ctx.response.type = type;
    ctx.response.body = value;
    ok = true;
  }

  return ok;
}

function * setCache(key, tkey, expire, ctx, redisClient) {
  var body = ctx.response.body,
    type;

  if ((ctx.request.method !== 'GET') || (ctx.response.status !== 200) || !body) {
    return;
  }

  if ((typeof body === 'string') || Buffer.isBuffer(body)) {
    // string, buffer
    yield redisClient.setex(key, expire, body);

    type = ctx.response.type;
    if (type) {
      yield redisClient.setex(tkey, expire, type);
    }
  } else if ((typeof body === 'object') && (typeof body.pipe !== 'function')) {
    // json
    yield redisClient.setex(key, expire, JSON.stringify(body));

    type = ctx.response.type;
    if (type) {
      yield redisClient.setex(tkey, expire, type);
    }
  }
}
