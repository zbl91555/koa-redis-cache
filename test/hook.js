'use strict';

var Redis = require('redis'),
  client = Redis.createClient(),
  should = require('should');

after(function(done) {
  client.flushdb(function(error) {
    console.log('## flush db');
    should.not.exist(error);
    done();
  });
});
