'use strict';

var should = require('should'),
  request = require('supertest'),
  koa = require('koa'),
  cache = require('../');

describe('## koa-redis-cache', function() {
  describe('# options - passParam', function() {
    var options = {
      passParam: 'cache'
    };
    var app = koa();
    app.use(cache(options));
    app.use(function * () {
      if (this.path === '/pass') {
        this.body = {
          name: 'hello'
        };
        return;
      }
    });

    app = app.listen(3001);

    it('get json from pass', function(done) {
      request(app)
        .get('/pass')
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

    it('get json from pass - cache', function(done) {
      request(app)
        .get('/pass')
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

    it('get json from pass - no cache', function(done) {
      request(app)
        .get('/pass?cache=no')
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