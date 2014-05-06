'use strict';

var should = require('should'),
  request = require('supertest'),
  koa = require('koa'),
  cache = require('../');

describe('### koa-redis-cache', function() {
  describe('## options - routes', function() {
    var options = {
      exclude: ['/e2/*']
    };
    var app = koa();
    app.use(cache(options));
    app.use(function * () {
      if (this.url === '/e1/json') {
        this.body = {
          name: 'hello'
        };
        return;
      }
      if (this.url === '/e2/json') {
        this.body = {
          name: 'hello'
        };
        return;
      }
    });

    app = app.listen(3000);

    it('# get json from e1', function(done) {
      request(app)
        .get('/e1/json')
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

    it('# get json from e1 - cache', function(done) {
      request(app)
        .get('/e1/json')
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

    it('# get json from e2', function(done) {
      request(app)
        .get('/e2/json')
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

    it('# get json from e2 - no cache', function(done) {
      request(app)
        .get('/e2/json')
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
  });
});