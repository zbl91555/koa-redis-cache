'use strict'

const request = require('supertest')
const should = require('should')
const cache = require('..')
const koa = require('koa')

describe('## options - prefix', () => {
  describe('# old prefix', () => {
    const options = {
      prefix: 'old-koa-redis-cache:'
    }
    let app = koa()
    app.use(cache(options))
    app.use(function* () {
      this.body = {
        name: 'old prefix'
      }
    })

    app = app.listen(3006)

    it('no cache', (done) => {
      request(app)
        .get('/prefix/json')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          should.not.exist(res.headers['x-koa-redis-cache'])
          res.body.name.should.equal('old prefix')
          done()
        })
    })

    it('from cache', (done) => {
      request(app)
        .get('/prefix/json')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          res.headers['x-koa-redis-cache'].should.equal('true')
          res.body.name.should.equal('old prefix')
          done()
        })
    })
  })

  describe('# new prefix', () => {
    var options = {
      prefix: 'new-koa-redis-cache:'
    }
    var app = koa()
    app.use(cache(options))
    app.use(function* () {
      this.body = {
        name: 'new prefix'
      }
    })

    app = app.listen(3000)

    it('no cache', (done) => {
      request(app)
        .get('/prefix/json')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          should.not.exist(res.headers['x-koa-redis-cache'])
          res.body.name.should.equal('new prefix')
          done()
        })
    })

    it('from cache', (done) => {
      request(app)
        .get('/prefix/json')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          res.headers['x-koa-redis-cache'].should.equal('true')
          res.body.name.should.equal('new prefix')
          done()
        })
    })
  })
})
