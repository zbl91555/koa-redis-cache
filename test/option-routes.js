'use strict';

var should = require('should'),
  request = require('supertest'),
  koa = require('koa'),
  cache = require('../');

describe('## options - routes', function() {
  var options = {
    routes: ['/v1/*']
  };
  var app = koa();
  app.use(cache(options));
  app.use(function * () {
    if (this.path === '/v1/json') {
      this.body = {
        name: 'hello'
      };
      return;
    }
    if (this.path === '/v2/json') {
      this.body = {
        name: 'hello'
      };
      return;
    }
  });

  app = app.listen(3000);

  describe('# get json from v1', function() {
    it('no cache', function(done) {
      request(app)
        .get('/v1/json')
        .expect(200)
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
        .expect(200)
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
        .expect(200)
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
        .expect(200)
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
        .expect(200)
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
        .expect(200)
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
        .expect(200)
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
        .expect(200)
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