'use strict';

var request = require('supertest'),
  should = require('should'),
  cache = require('..'),
  koa = require('koa');

describe('## options - exclude', function() {
  var options = {
    exclude: ['/exclude/2/(.*)']
  };
  var app = koa();
  app.use(cache(options));
  app.use(function * () {
    this.body = {
      name: 'hello'
    };
  });

  app = app.listen(3000);

  describe('# get json from exclude/1', function() {
    it('no cache', function(done) {
      request(app)
        .get('/exclude/1/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          should.not.exist(res.headers['x-koa-redis-cache']);
          res.body.name.should.equal('hello');
          done();
        });
    });

    it('from cache', function(done) {
      request(app)
        .get('/exclude/1/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          res.headers['x-koa-redis-cache'].should.equal('true');
          res.body.name.should.equal('hello');
          done();
        });
    });

    it('no cache - with params', function(done) {
      request(app)
        .get('/exclude/1/json?name=xxoo')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          should.not.exist(res.headers['x-koa-redis-cache']);
          res.body.name.should.equal('hello');
          done();
        });
    });

    it('from cache - with params', function(done) {
      request(app)
        .get('/exclude/1/json?name=xxoo')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          res.headers['x-koa-redis-cache'].should.equal('true');
          res.body.name.should.equal('hello');
          done();
        });
    });
  });

  describe('# get json from exclude/2', function() {
    it('no cache', function(done) {
      request(app)
        .get('/exclude/2/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          should.not.exist(res.headers['x-koa-redis-cache']);
          res.body.name.should.equal('hello');
          done();
        });
    });

    it('no cache', function(done) {
      request(app)
        .get('/exclude/2/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          should.not.exist(res.headers['x-koa-redis-cache']);
          res.body.name.should.equal('hello');
          done();
        });
    });

    it('no cache - with params', function(done) {
      request(app)
        .get('/exclude/2/json?name=xxoo')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          should.not.exist(res.headers['x-koa-redis-cache']);
          res.body.name.should.equal('hello');
          done();
        });
    });

    it('no cache - with params', function(done) {
      request(app)
        .get('/exclude/2/json?name=xxoo')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          should.not.exist(res.headers['x-koa-redis-cache']);
          res.body.name.should.equal('hello');
          done();
        });
    });
  });
});
