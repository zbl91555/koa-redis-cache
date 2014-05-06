'use strict';

var should = require('should'),
  request = require('supertest'),
  koa = require('koa'),
  cache = require('../');

describe('## options - expire', function() {
  var options = {
    expire: 1
  };
  var app = koa();
  app.use(cache(options));
  app.use(function * () {
    if (this.path === '/e/json') {
      this.body = {
        name: 'hello'
      };
      return;
    }
  });

  app = app.listen(3000);

  describe('# get json', function() {
    it('no cache', function(done) {
      request(app)
        .get('/e/json')
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json');
          should.not.exist(res.headers['from-redis-cache']);
          res.body.name.should.equal('hello');
          done();
        });
    });

    it('from cache', function(done) {
      request(app)
        .get('/e/json')
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json');
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
        .get('/e/json')
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json');
          should.not.exist(res.headers['from-redis-cache']);
          res.body.name.should.equal('hello');
          done();
        });
    });
  });
});