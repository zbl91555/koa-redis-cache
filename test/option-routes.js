'use strict'

const request = require('supertest')
const should = require('should')
const cache = require('..')
const koa = require('koa')

describe('## options - routes', () => {
  const options = {
    routes: ['/v1/(.*)']
  }
  let app = koa()
  app.use(cache(options))
  app.use(function* () {
    this.body = {
      name: 'hello'
    }
  })

  app = app.listen(3009)

  describe('# get json from v1', () => {
    it('no cache', (done) => {
      request(app)
        .get('/v1/json')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          should.not.exist(res.headers['x-koa-redis-cache'])
          res.body.name.should.equal('hello')
          done()
        })
    })

    it('from cache', (done) => {
      request(app)
        .get('/v1/json')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          res.headers['x-koa-redis-cache'].should.equal('true')
          res.body.name.should.equal('hello')
          done()
        })
    })

    it('no cache - with params', (done) => {
      request(app)
        .get('/v1/json?name=xxoo')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          should.not.exist(res.headers['x-koa-redis-cache'])
          res.body.name.should.equal('hello')
          done()
        })
    })

    it('from cache - with params', (done) => {
      request(app)
        .get('/v1/json?name=xxoo')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          res.headers['x-koa-redis-cache'].should.equal('true')
          res.body.name.should.equal('hello')
          done()
        })
    })
  })

  describe('get json from v2', () => {
    it('no cache', (done) => {
      request(app)
        .get('/v2/json')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          should.not.exist(res.headers['x-koa-redis-cache'])
          res.body.name.should.equal('hello')
          done()
        })
    })

    it('no cache', (done) => {
      request(app)
        .get('/v2/json')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          should.not.exist(res.headers['x-koa-redis-cache'])
          res.body.name.should.equal('hello')
          done()
        })
    })

    it('no cache - with params', (done) => {
      request(app)
        .get('/v2/json?name=xxoo')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          should.not.exist(res.headers['x-koa-redis-cache'])
          res.body.name.should.equal('hello')
          done()
        })
    })

    it('no cache - with params', (done) => {
      request(app)
        .get('/v2/json?name=xxoo')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          should.not.exist(res.headers['x-koa-redis-cache'])
          res.body.name.should.equal('hello')
          done()
        })
    })
  })
})
