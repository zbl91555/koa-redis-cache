'use strict';

var should = require('should'),
  request = require('supertest'),
  koa = require('koa'),
  cache = require('../');

describe('## option - route config', function() {
  var options = {
    expire: 3,
    routes: [
      '/m3/*', {
        path: '/m1/*',
        expire: 2
      }, {
        path: '/m2/*',
        expire: 1
      }
    ]
  };

  var app = koa();
  app.use(cache(options));

  app.use(function * () {
    this.body = {
      name: 'hello'
    };
  });

  app = app.listen(3000);

  describe('# get json from m1', function() {
    it('no cache', function(done) {
      request(app)
        .get('/m1/json')
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
        .get('/m1/json')
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

    it('delay - 1000 ms', function(done) {
      setTimeout(function() {
        done();
      }, 1000);
    });

    it('from cache', function(done) {
      request(app)
        .get('/m1/json')
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

    it('delay - 1000 ms', function(done) {
      setTimeout(function() {
        done();
      }, 1000);
    });

    it('no cache', function(done) {
      request(app)
        .get('/m1/json')
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

  describe('# get json from m2', function() {
    it('no cache', function(done) {
      request(app)
        .get('/m2/json')
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
        .get('/m2/json')
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

    it('delay - 800 ms', function(done) {
      setTimeout(function() {
        done();
      }, 800);
    });

    it('from cache', function(done) {
      request(app)
        .get('/m2/json')
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

    it('delay - 200 ms', function(done) {
      setTimeout(function() {
        done();
      }, 200);
    });

    it('no cache', function(done) {
      request(app)
        .get('/m2/json')
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

  describe('# get json from m3', function() {
    it('no cache', function(done) {
      request(app)
        .get('/m3/json')
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
        .get('/m3/json')
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

    it('delay - 2000 ms', function(done) {
      setTimeout(function() {
        done();
      }, 2000);
    });

    it('from cache', function(done) {
      request(app)
        .get('/m3/json')
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

    it('delay - 1000 ms', function(done) {
      setTimeout(function() {
        done();
      }, 1000);
    });

    it('no cache', function(done) {
      request(app)
        .get('/m3/json')
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