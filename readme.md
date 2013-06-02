# Accrual Failure Detector

[![NPM version](https://badge.fury.io/js/afd.png)](http://badge.fury.io/js/afd)
[![Build Status](https://secure.travis-ci.org/kordon/afd.png)](http://travis-ci.org/kordon/afd)
[![Dependency Status](https://gemnasium.com/kordon/afd.png)](https://gemnasium.com/kordon/afd)
[![Coverage Status](https://coveralls.io/repos/kordon/afd/badge.png?branch=master)](https://coveralls.io/r/kordon/afd?branch=master)

## install

```bash
$ npm install afd
```
```bash
$ component install kordon/afd
```

## example

```js
var afd = require('afd')
var peers = {}

server.on('message', function(msg) {
  if(msg.type !== 'ping') return
  if(!peers[server.id]) peers[server.id] = afd()
  peers[server.id].report()
})

setInterval(function() {
  Object.keys(peers).forEach(function (id) {
    if(peers[id].phi() > 8) console.error('Node %s has probably failed!', id)
    else console.log('Node %s is alive!', id)
  })
}, 1000)
```

## [documentation](kordon.github.io/afd)

## license

 * Original [racker/node-failure-detector](https://github.com/racker/node-failure-detector) code is under the [MIT license](license/joyent)
 * Updates from [Rackspace](https://github.com/rackspace) are under the [Apache 2.0 license](license/rackspace)
 * Original [bpot/node-gossip](https://github.com/bpot/node-gossip) code is under the [MIT license](license/bpot)
 * Updates from [kordon/afd](https://github.com/kordon/afd) are under the [MIT license](license/kordon)