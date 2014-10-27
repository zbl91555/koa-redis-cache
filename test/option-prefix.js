'use strict';

var request = require('supertest'),
  should = require('should'),
  cache = require('..'),
  koa = require('koa');

describe('## options - prefix', function() {
  describe('# old prefix', function() {
    var options = {
      prefix: 'old-koa-redis-cache:'
    };
    var app = koa();
    app.use(cache(options));
    app.use(function * () {
      this.body = {
        name: 'old prefix'
      };
    });

    app = app.listen(3000);

    it('no cache', function(done) {
      request(app)
        .get('/prefix/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          should.not.exist(res.headers['x-koa-redis-cache']);
          res.body.name.should.equal('old prefix');
          done();
        });
    });

    it('from cache', function(done) {
      request(app)
        .get('/prefix/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          res.headers['x-koa-redis-cache'].should.equal('true');
          res.body.name.should.equal('old prefix');
          done();
        });
    });
  });

  describe('# new prefix', function() {
    var options = {
      prefix: 'new-koa-redis-cache:'
    };
    var app = koa();
    app.use(cache(options));
    app.use(function * () {
      this.body = {
        name: 'new prefix'
      };
    });

    app = app.listen(3000);

    it('no cache', function(done) {
      request(app)
        .get('/prefix/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          should.not.exist(res.headers['x-koa-redis-cache']);
          res.body.name.should.equal('new prefix');
          done();
        });
    });

    it('from cache', function(done) {
      request(app)
        .get('/prefix/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          res.headers['x-koa-redis-cache'].should.equal('true');
          res.body.name.should.equal('new prefix');
          done();
        });
    });
  });
});
