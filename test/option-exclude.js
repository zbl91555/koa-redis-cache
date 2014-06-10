'use strict';

var should = require('should'),
  request = require('supertest'),
  koa = require('koa'),
  cache = require('../');

describe('## options - exclude', function() {
  var options = {
    exclude: ['/e2/*']
  };
  var app = koa();
  app.use(cache(options));
  app.use(function * () {
    if (this.path === '/e1/json') {
      this.body = {
        name: 'hello'
      };
      return;
    }
    if (this.path === '/e2/json') {
      this.body = {
        name: 'hello'
      };
      return;
    }
  });

  app = app.listen(3000);

  describe('# get json from e1', function() {
    it('no cache', function(done) {
      request(app)
        .get('/e1/json')
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
        .get('/e1/json')
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
        .get('/e1/json?name=xxoo')
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
        .get('/e1/json?name=xxoo')
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

  describe('# get json from e2', function() {
    it('no cache', function(done) {
      request(app)
        .get('/e2/json')
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
        .get('/e2/json')
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
        .get('/e2/json?name=xxoo')
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
        .get('/e2/json?name=xxoo')
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