'use strict'

const request = require('supertest')
const { equal } = require('assert')
const should = require('should')
const cache = require('..')
const Koa = require('koa')

describe('## options - maxLength', () => {
  const options = {
    maxLength: 4
  }
  let app = new Koa()
  app.use(cache(options))
  app.use(async (ctx) => {
    if (ctx.path === '/max/length/json') {
      ctx.body = {
        name: 'hello'
      }
      return
    }
    if (ctx.path === '/max/length/string') {
      ctx.body = 'hello'
      return
    }
    if (ctx.path === '/max/length/buffer') {
      ctx.body = new Buffer('hello')
      return
    }
  })

  app = app.listen(3004)

  describe('# no cache', () => {
    it('json', (done) => {
      request(app)
        .get('/max/length/json')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          should.not.exist(res.headers['x-koa-redis-cache'])
          res.body.name.should.equal('hello')
          done()
        })
    })

    it('string', (done) => {
      request(app)
        .get('/max/length/string')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('text/plain; charset=utf-8')
          should.not.exist(res.headers['x-koa-redis-cache'])
          equal(res.text, 'hello')
          done()
        })
    })

    it('buffer', (done) => {
      request(app)
        .get('/max/length/buffer')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/octet-stream')
          should.not.exist(res.headers['x-koa-redis-cache'])
          equal(res.body, 'hello')
          done()
        })
    })
  })

  describe('# still no cache', () => {
    it('json', (done) => {
      request(app)
        .get('/max/length/json')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          should.not.exist(res.headers['x-koa-redis-cache'])
          res.body.name.should.equal('hello')
          done()
        })
    })

    it('string', (done) => {
      request(app)
        .get('/max/length/string')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('text/plain; charset=utf-8')
          should.not.exist(res.headers['x-koa-redis-cache'])
          should.equal(res.text, 'hello')
          done()
        })
    })

    it('buffer', (done) => {
      request(app)
        .get('/max/length/buffer')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/octet-stream')
          should.not.exist(res.headers['x-koa-redis-cache'])
          equal(res.body, 'hello')
          done()
        })
    })
  })
})
