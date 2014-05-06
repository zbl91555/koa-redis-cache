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

### options
* prefix
  - type: `String`
  - redis key prefix, default is `koa-redis-cache:`
* expire
  - type: `Number`
  - redis expire time (second), default is `30 * 60` (30 min)
* passParam
  - type: `String`
  - if the passParam is existed in query string, not get from cache
* routes
  - type: `Array`
  - the routes to cache, default is `['*']`
  - It could be `['/api/*', '/view/:id']`, see [path-to-regexp](https://github.com/component/path-to-regexp)
* exclude
  - type: `Array`
  - the routes to exclude, default is `[]`
  - It could be `['/api/*', '/view/:id']`, see [path-to-regexp](https://github.com/component/path-to-regexp)
* onerror
  - type: `Function`
  - callback function for error, default is `function() {}`
* redis
  - type: `Object`
  - redis options
* redis.port
  - type: `Number`
* redis.host
  - type: `String`
* redis.options
  - type: `Object`
  - see [node_redis](https://github.com/mranney/node_redis)

### License
MIT