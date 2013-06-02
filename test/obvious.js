var afd = process.env.AFD_COVERAGE ? require('../lib-cov/afd.js') : require('..'),
    assert = require('chai').assert

describe('Obvious', function () {
  var node = afd()
  
  before(function () {
    for(var i = 1; i < 100; i ++) {
      node.report(Date.now() + i * 1000)
    }
  })
  
  it('mean should be almost exactly one second', function () {
    assert.ok(999 <=  node._mean && node._mean <= 1001)
  })
  
  it('should be pretty certain everything is fine', function () {
    assert.ok(node.phi() <= 0.01)
    
    assert.ok(node.phi(Date.now() + 120 * 1000) > 9.0)
    assert.ok(node.phi(Date.now() + 120 * 1000) < 9.2)
    
    assert.ok(node.phi(Date.now() + 200 * 1000) > 40)
    assert.ok(node.phi(Date.now() + 200 * 1000) < 50)
  })
})