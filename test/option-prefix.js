'use strict';

var should = require('should'),
  request = require('supertest'),
  koa = require('koa'),
  cache = require('../');

describe('### koa-redis-cache', function() {
  describe('## options - expire', function() {
    var options = {
      prefix: 'new-koa-redis-cache:'
    };
    var app = koa();
    app.use(cache(options));
    app.use(function * () {
      /*
       * url same to 'koa-redis-cache.js'
       * it will confict if prefix not works
       */
      if (this.url === '/app/json') {
        this.body = {
          name: 'hello'
        };
        return;
      }
    });

    app = app.listen(3000);

    it('# get json', function(done) {
      request(app)
        .get('/app/json')
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json');
          should.not.exist(res.headers['last-modified']);
          res.body.name.should.equal('hello');
          done();
        });
    });

    it('# get json - cache', function(done) {
      request(app)
        .get('/app/json')
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json');
          should.exist(res.headers['last-modified']);
          res.body.name.should.equal('hello');
          done();
        });
    });
  });
});