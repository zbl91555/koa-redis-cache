'use strict'

const request = require('supertest')
const { equal } = require('assert')
const should = require('should')
const cache = require('..')
const koa = require('koa')
const fs = require('fs')

describe('## stream support', () => {
  let app = koa()
  app.use(cache({
    maxLength: 1000
  }))
  app.use(function* () {
    this.type = 'js'

    if (this.path === '/stream/js/1') {
      this.body = fs.createReadStream(__dirname + '/hook.js')
    } else if (this.path === '/stream/js/2') {
      this.body = fs.createReadStream(__filename)
    }
  })

  app = app.listen(3010)

  describe('# stream', () => {
    it('get file', (done) => {
      request(app)
        .get('/stream/js/1')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/javascript; charset=utf-8')
          equal(res.text, fs.readFileSync(__dirname + '/hook.js', 'utf8'))
          should.not.exist(res.headers['x-koa-redis-cache'])
          done()
        })
    })

    it('get file from cache', (done) => {
      request(app)
        .get('/stream/js/1')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/javascript; charset=utf-8')
          equal(res.text, fs.readFileSync(__dirname + '/hook.js', 'utf8'))
          res.headers['x-koa-redis-cache'].should.equal('true')
          done()
        })
    })
  })

  describe('# max length', () => {
    it('get file', (done) => {
      request(app)
        .get('/stream/js/2')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/javascript; charset=utf-8')
          equal(res.text, fs.readFileSync(__filename, 'utf8'))
          should.not.exist(res.headers['x-koa-redis-cache'])
          done()
        })
    })

    it('get file no cache', (done) => {
      request(app)
        .get('/stream/js/2')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/javascript; charset=utf-8')
          equal(res.text, fs.readFileSync(__filename, 'utf8'))
          should.not.exist(res.headers['x-koa-redis-cache'])
          done()
        })
    })
  })
})
