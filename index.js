
'use strict'

const pathToRegExp = require('path-to-regexp')
const wrapper = require('co-redis')
const readall = require('readall')
const crypto = require('crypto')
const Redis = require('redis')

module.exports = function(options = {}) {
  let redisAvailable = false

  const {
    redisInstance = null,
    prefix = 'koa-redis-cache:',
    expire = 30 * 60, // 30 min
    routes = ['(.*)'],
    exclude = [],
    passParam = '',
    maxLength = Infinity,
    onerror = function() {}
  } = options

  const {
    host:redisHost = 'localhost',
    port:redisPort = 6379,
    url:redisUrl = `redis://${redisHost}:${redisPort}/`,
    options:redisOptions = {}
  } = options.redis || {}

  /**
   * redisClient
   */
  const redisClient = wrapper(redisInstance || Redis.createClient(redisUrl, redisOptions))
  redisClient.on('error', (error)=> {
    redisAvailable = false
    onerror(error)
  })
  redisClient.on('end', () => {
    redisAvailable = false
  })
  redisClient.on('connect', () => {
    redisAvailable = true
  })

  return async function cache(ctx, next) {
    const { url, path } = ctx.request
    const resolvedPrefix = typeof prefix === 'function' ? prefix.call(ctx, ctx) : prefix;
    const key = resolvedPrefix + md5(url)
    const tkey = key + ':type'
    let match = false
    let routeExpire = false

    for (let i = 0; i < routes.length; i++) {
      let route = routes[i]

      if (typeof routes[i] === 'object') {
        route = routes[i].path
        routeExpire = routes[i].expire
      }

      if (paired(route, path)) {
        match = true
        break
      }
    }

    for (let j = 0; j < exclude.length; j++) {
      if (paired(exclude[j], path)) {
        match = false
        break
      }
    }

    if (!redisAvailable || !match || (passParam && ctx.request.query[passParam])) {
      return await next()
    }

    let ok = false
    try {
      ok = await getCache(ctx, key, tkey)
    } catch (e) {
      ok = false
    }
    if (ok) {
      return
    }

    await next()

    try {
      let trueExpire = routeExpire || expire
      await setCache(ctx, key, tkey, trueExpire)
    } catch (e) {}
    routeExpire = false
  }

  /**
   * getCache
   */
  async function getCache(ctx, key, tkey) {
    let value = await redisClient.get(key)
    let type
    let ok = false

    if (value) {
      ctx.response.status = 200
      type = (await redisClient.get(tkey)) || 'text/html'
      // can happen if user specified return_buffers: true in redis options
      if (Buffer.isBuffer(type)) type = type.toString()
      ctx.response.set('X-Koa-Redis-Cache', 'true')
      ctx.response.type = type
      ctx.response.body = value
      ok = true
    }

    return ok
  }

  /**
   * setCache
   */
  async function setCache(ctx, key, tkey, expire) {
    let body = ctx.response.body

    if ((ctx.request.method !== 'GET') || (ctx.response.status !== 200) || !body) {
      return
    }

    if (typeof body === 'string') {
      // string
      if (Buffer.byteLength(body) > maxLength) return
      await redisClient.setex(key, expire, body)
    } else if (Buffer.isBuffer(body)) {
      // buffer
      if (body.length > maxLength) return
      await redisClient.setex(key, expire, body)
    } else if (typeof body === 'object' && ctx.response.type === 'application/json') {
      // json
      body = JSON.stringify(body)
      if (Buffer.byteLength(body) > maxLength) return
      await redisClient.setex(key, expire, body)
    } else if (typeof body.pipe === 'function') {
      // stream
      body = await read(body)
      ctx.response.body = body
      if (Buffer.byteLength(body) > maxLength) return
      await redisClient.setex(key, expire, body)
    } else {
      return
    }

    await cacheType(ctx, tkey, expire)
  }

  /**
   * cacheType
   */
  async function cacheType(ctx, tkey, expire) {
    let type = ctx.response.type
    if (type) {
      await redisClient.setex(tkey, expire, type)
    }
  }
}

function paired(route, path) {
  let options = {
    sensitive: true,
    strict: true,
  }

  return pathToRegExp(route, [], options).exec(path)
}

function read(stream) {
  return new Promise((resolve, reject) => {
    readall(stream, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex')
}
