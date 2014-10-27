'use strict';

var request = require('supertest'),
  should = require('should'),
  cache = require('..'),
  koa = require('koa'),
  fs = require('fs');

describe('## stream support', function() {
  var app = koa();
  app.use(cache({
    maxLength: 1000
  }));
  app.use(function * () {
    this.type = 'js';

    if (this.path === '/stream/js/1') {
      this.body = fs.createReadStream(__dirname + '/hook.js');
    } else if (this.path === '/stream/js/2') {
      this.body = fs.createReadStream(__filename);
    }
  });

  app = app.listen(3000);

  describe('# stream', function() {
    it('get file', function(done) {
      request(app)
        .get('/stream/js/1')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/javascript; charset=utf-8');
          res.text.should.equal(fs.readFileSync(__dirname + '/hook.js', 'utf8'));
          should.not.exist(res.headers['x-koa-redis-cache']);
          done();
        });
    });

    it('get file from cache', function(done) {
      request(app)
        .get('/stream/js/1')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/javascript; charset=utf-8');
          res.text.should.equal(fs.readFileSync(__dirname + '/hook.js', 'utf8'));
          res.headers['x-koa-redis-cache'].should.equal('true');
          done();
        });
    });
  });

  describe('# max length', function() {
    it('get file', function(done) {
      request(app)
        .get('/stream/js/2')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/javascript; charset=utf-8');
          res.text.should.equal(fs.readFileSync(__filename, 'utf8'));
          should.not.exist(res.headers['x-koa-redis-cache']);
          done();
        });
    });

    it('get file no cache', function(done) {
      request(app)
        .get('/stream/js/2')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/javascript; charset=utf-8');
          res.text.should.equal(fs.readFileSync(__filename, 'utf8'));
          should.not.exist(res.headers['x-koa-redis-cache']);
          done();
        });
    });
  });
});
