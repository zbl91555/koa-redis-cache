[![NPM](https://nodei.co/npm/koa-redis-cache.png?downloads=true)](https://nodei.co/npm/koa-redis-cache/)

### koa-redis-cache

how to use
```js
var koa = require('koa'),
  app = koa(),
  cache = require('koa-redis-cache');

var options = {};
app.use(cache(options));
```

* options
  - prefix: String, redis key prefix, default is `koa-redis-cache:`
  - expire: Number, redis expire time (second), default is `30 * 60` (30 min)
  - routes: Array, the routes to cache
  - redis: redis options
  - redis.port
  - redis.host
  - redis.options, see [node_redis](https://github.com/mranney/node_redis)

### License
MIT