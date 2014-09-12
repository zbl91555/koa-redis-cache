'use strict';

var should = require('should'),
  request = require('supertest'),
  koa = require('koa'),
  cache = require('../');

describe('## options - prefix', function() {
  var options = {
    prefix: 'new-koa-redis-cache:'
  };
  var app = koa();
  app.use(cache(options));
  app.use(function * () {
    /*
     * path same to 'koa-redis-cache.js'
     * it will confict if prefix not works
     */
    this.body = {
      name: 'hello'
    };
  });

  app = app.listen(3000);

  describe('# get json', function() {
    it('no cache', function(done) {
      request(app)
        .get('/app/json')
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
        .get('/app/json')
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
});
