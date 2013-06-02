var afd = process.env.AFD_COVERAGE ? require('../lib-cov/afd.js') : require('..'),
    assert = require('chai').assert

describe('Cassandra', function () {
  var node = afd(4, 0)
  
  node.report(111)
  node.report(222)
  node.report(333)
  node.report(444)
  node.report(555)
  
  var expected = 0.4342;
  var actual = node.phi(666);
  assert.ok(expected - 0.01 <= actual && actual <= expected + 0.01);
  
  //oh noes, a much higher timestamp, something went wrong!
  expected = 9.566;
  actual = node.phi(3000);
  assert.ok(expected - 0.01 <= actual && actual <= expected + 0.01);
})