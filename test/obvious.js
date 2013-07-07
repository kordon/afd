var afd = process.env.AFD_COVERAGE ? require('../lib-cov/afd.js') : require('..'),
    assert = require('assert'),
    mean = require('mean')

describe('Obvious', function () {
  var peer = afd()
  
  before(function () {
    for(var i = 1; i < 100; i ++) {
      peer.report(Date.now() + i * 1000)
    }
    
    peer.phi()
  })
  
  it('mean should be almost exactly one second', function () {
    assert.ok(999 <=  mean(peer.intervals) && mean(peer.intervals) <= 1001)
  })
  
  it('should be pretty certain everything is fine', function () {
    assert.ok(peer.phi() <= 0.01)
    
    assert.ok(peer.phi(Date.now() + 120 * 1000) > 9.0)
    assert.ok(peer.phi(Date.now() + 120 * 1000) < 9.2)
    
    assert.ok(peer.phi(Date.now() + 200 * 1000) > 40)
    assert.ok(peer.phi(Date.now() + 200 * 1000) < 50)
  })
})