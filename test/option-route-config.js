'use strict'

const request = require('supertest')
const should = require('should')
const cache = require('..')
const Koa = require('koa')

describe('## option - route config', () => {
  const options = {
    expire: 3,
    routes: [
      '/m3/(.*)', {
        path: '/m1/(.*)',
        expire: 2
      }, {
        path: '/m2/(.*)',
        expire: 1
      }
    ]
  }

  let app = new Koa()
  app.use(cache(options))

  app.use(async (ctx) => {
    ctx.body = {
      name: 'hello'
    }
  })

  app = app.listen(3008)

  describe('# get json from m1', () => {
    it('no cache', (done) => {
      request(app)
        .get('/m1/json')
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
        .get('/m1/json')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          res.headers['x-koa-redis-cache'].should.equal('true')
          res.body.name.should.equal('hello')
          done()
        })
    })

    it('delay - 1000 ms', (done) => {
      setTimeout(() => {
        done()
      }, 1000)
    })

    it('from cache', (done) => {
      request(app)
        .get('/m1/json')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          res.headers['x-koa-redis-cache'].should.equal('true')
          res.body.name.should.equal('hello')
          done()
        })
    })

    it('delay - 1000 ms', (done) => {
      setTimeout(() => {
        done()
      }, 1000)
    })

    it('no cache', (done) => {
      request(app)
        .get('/m1/json')
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

  describe('# get json from m2', () => {
    it('no cache', (done) => {
      request(app)
        .get('/m2/json')
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
        .get('/m2/json')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          res.headers['x-koa-redis-cache'].should.equal('true')
          res.body.name.should.equal('hello')
          done()
        })
    })

    it('delay - 800 ms', (done) => {
      setTimeout(() => {
        done()
      }, 800)
    })

    it('from cache', (done) => {
      request(app)
        .get('/m2/json')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          res.headers['x-koa-redis-cache'].should.equal('true')
          res.body.name.should.equal('hello')
          done()
        })
    })

    it('delay - 200 ms', (done) => {
      setTimeout(() => {
        done()
      }, 200)
    })

    it('no cache', (done) => {
      request(app)
        .get('/m2/json')
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

  describe('# get json from m3', () => {
    it('no cache', (done) => {
      request(app)
        .get('/m3/json')
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
        .get('/m3/json')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          res.headers['x-koa-redis-cache'].should.equal('true')
          res.body.name.should.equal('hello')
          done()
        })
    })

    it('delay - 2000 ms', (done) => {
      setTimeout(() => {
        done()
      }, 2000)
    })

    it('from cache', (done) => {
      request(app)
        .get('/m3/json')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          res.headers['x-koa-redis-cache'].should.equal('true')
          res.body.name.should.equal('hello')
          done()
        })
    })

    it('delay - 1000 ms', (done) => {
      setTimeout(() => {
        done()
      }, 1000)
    })

    it('no cache', (done) => {
      request(app)
        .get('/m3/json')
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
