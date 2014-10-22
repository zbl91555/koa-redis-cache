'use strict';

var request = require('supertest'),
  should = require('should'),
  cache = require('..'),
  koa = require('koa');

describe('## options - expire', function() {
  var options = {
    expire: 1
  };
  var app = koa();
  app.use(cache(options));
  app.use(function * () {
    this.body = {
      name: 'hello'
    };
  });

  app = app.listen(3000);

  describe('# get json', function() {
    it('no cache', function(done) {
      request(app)
        .get('/expire/json')
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
        .get('/expire/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          res.headers['from-redis-cache'].should.equal('true');
          res.body.name.should.equal('hello');
          done();
        });
    });

    it('timeout', function(done) {
      setTimeout(function() {
        done();
      }, 1500);
    });

    it('no cache', function(done) {
      request(app)
        .get('/expire/json')
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
