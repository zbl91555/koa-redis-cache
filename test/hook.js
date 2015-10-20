'use strict'

const Redis = require('redis')
const client = Redis.createClient()
const should = require('should')

after((done) => {
  client.flushdb((error) => {
    console.log('## flush db')
    should.not.exist(error)
    done()
  })
})
