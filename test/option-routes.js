'use strict';

var request = require('supertest'),
  should = require('should'),
  cache = require('..'),
  koa = require('koa');

describe('## options - routes', function() {
  var options = {
    routes: ['/v1/(.*)']
  };
  var app = koa();
  app.use(cache(options));
  app.use(function * () {
    this.body = {
      name: 'hello'
    };
  });

  app = app.listen(3000);

  describe('# get json from v1', function() {
    it('no cache', function(done) {
      request(app)
        .get('/v1/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          should.not.exist(res.headers['from-redis-cache']);
          res.body.name.should.equal('hello');
          done();
        });
    });

    it('from cache', function(done) {
      request(app)
        .get('/v1/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          res.headers['from-redis-cache'].should.equal('true');
          res.body.name.should.equal('hello');
          done();
        });
    });

    it('no cache - with params', function(done) {
      request(app)
        .get('/v1/json?name=xxoo')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          should.not.exist(res.headers['from-redis-cache']);
          res.body.name.should.equal('hello');
          done();
        });
    });

    it('from cache - with params', function(done) {
      request(app)
        .get('/v1/json?name=xxoo')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          res.headers['from-redis-cache'].should.equal('true');
          res.body.name.should.equal('hello');
          done();
        });
    });
  });

  describe('get json from v2', function() {
    it('no cache', function(done) {
      request(app)
        .get('/v2/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          should.not.exist(res.headers['from-redis-cache']);
          res.body.name.should.equal('hello');
          done();
        });
    });

    it('no cache', function(done) {
      request(app)
        .get('/v2/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          should.not.exist(res.headers['from-redis-cache']);
          res.body.name.should.equal('hello');
          done();
        });
    });

    it('no cache - with params', function(done) {
      request(app)
        .get('/v2/json?name=xxoo')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          should.not.exist(res.headers['from-redis-cache']);
          res.body.name.should.equal('hello');
          done();
        });
    });

    it('no cache - with params', function(done) {
      request(app)
        .get('/v2/json?name=xxoo')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          should.not.exist(res.headers['from-redis-cache']);
          res.body.name.should.equal('hello');
          done();
        });
    });
  });
});
