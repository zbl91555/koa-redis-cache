'use strict';

var should = require('should'),
  request = require('supertest'),
  koa = require('koa'),
  cache = require('../');

describe('## koa-redis-cache', function() {
  describe('# default options', function() {
    var options = {};
    var app = koa();
    app.use(cache(options));
    app.use(function * () {
      if (this.path === '/app/json') {
        this.body = {
          name: 'hello'
        };
        return;
      }
      if (this.path === '/app/text') {
        this.body = 'hello';
        return;
      }
      if (this.path === '/app/html') {
        this.body = '<h1>hello</h1>';
        return;
      }
      if (this.path === '/app/buffer') {
        this.body = new Buffer('buffer');
        return;
      }
    });

    app = app.listen(3000);

    it('get json', function(done) {
      request(app)
        .get('/app/json')
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

    it('get text', function(done) {
      request(app)
        .get('/app/text')
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('text/plain; charset=utf-8');
          should.not.exist(res.headers['from-redis-cache']);
          res.text.should.equal('hello');
          done();
        });
    });

    it('get html', function(done) {
      request(app)
        .get('/app/html')
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('text/html; charset=utf-8');
          should.not.exist(res.headers['from-redis-cache']);
          res.text.should.equal('<h1>hello</h1>');
          done();
        });
    });

    it('get buffer', function(done) {
      request(app)
        .get('/app/buffer')
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/octet-stream');
          should.not.exist(res.headers['from-redis-cache']);
          res.text.should.equal('buffer');
          done();
        });
    });

    it('get json - from cache', function(done) {
      request(app)
        .get('/app/json')
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

    it('get text - from cache', function(done) {
      request(app)
        .get('/app/text')
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('text/plain; charset=utf-8');
          res.headers['from-redis-cache'].should.equal('true');
          res.text.should.equal('hello');
          done();
        });
    });

    it('get html - from cache', function(done) {
      request(app)
        .get('/app/html')
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('text/html; charset=utf-8');
          res.headers['from-redis-cache'].should.equal('true');
          res.text.should.equal('<h1>hello</h1>');
          done();
        });
    });

    it('get buffer - from cache', function(done) {
      request(app)
        .get('/app/buffer')
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.headers['content-type'].should.equal('application/octet-stream');
          res.headers['from-redis-cache'].should.equal('true');
          res.text.should.equal('buffer');
          done();
        });
    });
  });
});