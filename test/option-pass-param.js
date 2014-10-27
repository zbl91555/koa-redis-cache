'use strict';

var request = require('supertest'),
  should = require('should'),
  cache = require('..'),
  koa = require('koa');

describe('## options - passParam', function() {
  var options = {
    passParam: 'cache'
  };
  var app = koa();
  app.use(cache(options));
  app.use(function * () {
    this.body = {
      name: 'hello'
    };
  });

  app = app.listen(3001);

  describe('# get json from pass', function() {
    it('no cache', function(done) {
      request(app)
        .get('/pass')
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
        .get('/pass')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          res.headers['x-koa-redis-cache'].should.equal('true');
          res.body.name.should.equal('hello');
          done();
        });
    });

    it('no cache', function(done) {
      request(app)
        .get('/pass?cache=no')
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
