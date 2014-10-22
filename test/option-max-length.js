'use strict';

var request = require('supertest'),
  should = require('should'),
  cache = require('..'),
  koa = require('koa');

describe('## options - maxLength', function() {
  var options = {
    maxLength: 4
  };
  var app = koa();
  app.use(cache(options));
  app.use(function * () {
    if (this.path === '/max/length/json') {
      this.body = {
        name: 'hello'
      };
      return;
    }
    if (this.path === '/max/length/string') {
      this.body = 'hello';
      return;
    }
    if (this.path === '/max/length/buffer') {
      this.body = new Buffer('hello');
      return;
    }
  });

  app = app.listen(3000);

  describe('# no cache', function() {
    it('json', function(done) {
      request(app)
        .get('/max/length/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          should.not.exist(res.headers['from-redis-cache']);
          res.body.name.should.equal('hello');
          done();
        });
    });

    it('string', function(done) {
      request(app)
        .get('/max/length/string')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('text/plain; charset=utf-8');
          should.not.exist(res.headers['from-redis-cache']);
          res.text.should.equal('hello');
          done();
        });
    });

    it('buffer', function(done) {
      request(app)
        .get('/max/length/buffer')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/octet-stream');
          should.not.exist(res.headers['from-redis-cache']);
          res.text.should.equal('hello');
          done();
        });
    });
  });

  describe('# still no cache', function() {
    it('json', function(done) {
      request(app)
        .get('/max/length/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          should.not.exist(res.headers['from-redis-cache']);
          res.body.name.should.equal('hello');
          done();
        });
    });

    it('string', function(done) {
      request(app)
        .get('/max/length/string')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('text/plain; charset=utf-8');
          should.not.exist(res.headers['from-redis-cache']);
          res.text.should.equal('hello');
          done();
        });
    });

    it('buffer', function(done) {
      request(app)
        .get('/max/length/buffer')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/octet-stream');
          should.not.exist(res.headers['from-redis-cache']);
          res.text.should.equal('hello');
          done();
        });
    });
  });
});
