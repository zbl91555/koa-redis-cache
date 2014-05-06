'use strict';

var should = require('should'),
  request = require('supertest'),
  koa = require('koa'),
  cache = require('../');

describe('## koa-redis-cache', function() {
  describe('# options - routes', function() {
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

    it('get json from v1', function(done) {
      request(app)
        .get('/v1/json')
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

    it('get json from v1 - cache', function(done) {
      request(app)
        .get('/v1/json')
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

    it('get json from v2', function(done) {
      request(app)
        .get('/v2/json')
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

    it('get json from v2 - no cache', function(done) {
      request(app)
        .get('/v2/json')
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