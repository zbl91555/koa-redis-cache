'use strict';

var request = require('supertest'),
  should = require('should'),
  cache = require('..'),
  koa = require('koa');

describe('## options - redis', function() {
  var options = {
    redis: {
      port: 3333,
      host: 'localhost'
    }
  };
  var app = koa();
  app.use(cache(options));
  app.use(function * () {
    this.body = {
      name: 'hello'
    };
  });

  app = app.listen(3000);

  describe('# redis unavailable', function() {
    it('no cache', function(done) {
      request(app)
        .get('/redis/json')
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
        .get('/redis/json')
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
