var afd = process.env.AFD_COVERAGE ? require('../lib-cov/afd.js') : require('..'),
    assert = require('chai').assert

describe('Cassandra', function () {
  var peer = afd(4, 0)
  
  peer.report(111)
  peer.report(222)
  peer.report(333)
  peer.report(444)
  peer.report(555)
  
  var expected = 0.4342;
  var actual = peer.phi(666);
  assert.ok(expected - 0.01 <= actual && actual <= expected + 0.01);
  
  //oh noes, a much higher timestamp, something went wrong!
  expected = 9.566;
  actual = peer.phi(3000);
  assert.ok(expected - 0.01 <= actual && actual <= expected + 0.01);
})