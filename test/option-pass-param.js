'use strict'

const request = require('supertest')
const should = require('should')
const cache = require('..')
const Koa = require('koa')

describe('## options - passParam', () => {
  const options = {
    passParam: 'cache'
  }
  let app = new Koa()
  app.use(cache(options))
  app.use(async (ctx) => {
    ctx.body = {
      name: 'hello'
    }
  })

  app = app.listen(3005)

  describe('# get json from pass', () => {
    it('no cache', (done) => {
      request(app)
        .get('/pass')
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
        .get('/pass')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          res.headers['x-koa-redis-cache'].should.equal('true')
          res.body.name.should.equal('hello')
          done()
        })
    })

    it('no cache', (done) => {
      request(app)
        .get('/pass?cache=no')
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
