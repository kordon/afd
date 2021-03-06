# afd(3) -- Accrual Failure Detector

## SYNOPSIS

var afd = require('afd')

*instance*
`afd`([<number> ws=100], [<number> last=Date.now()])

*void*
`.report`([<number> when])

*number*
`.phi`([<number> when]) 

## INSTALL

**$** npm install afd

**$** component install afd

## DESCRIPTION

**afd** is a [node.js](http://nodejs.org/) implementation of [The Phi Accrual Failure Detector](http://www.scribd.com/doc/50937976/The-Phi-Accrual-Failure-Detector).

Based (roughly) on the [version](https://svn.apache.org/repos/asf/cassandra/trunk/src/java/org/apache/cassandra/gms/FailureDetector.java) from [Cassandra](http://cassandra.apache.org/), which is based on the paper [The Phi Accrual Failure Detector](http://www.scribd.com/doc/50937976/The-Phi-Accrual-Failure-Detector) by Naohiro Hayashibara.

It's also a mix between [racker/node-failure-detector](https://github.com/racker/node-failure-detector) and [bpot/node-gossip/accrual_failure_detector.js](https://github.com/bpot/node-gossip/blob/master/lib/accrual_failure_detector.js).

*The Phi Accrual Failure Detector* is commonly used to detect failure of a peer in a distributed system.

## API

*instance*
`afd`([<number> ws=100], [<number> last=Date.now()])

Creates a new instance of **afd** that keeps the state of one peer. *ws* defines the number of timestamps to keep in the peer history, *last* defines the initial timestamp  that the peer starts with.

*void*
`.report`([<number> when=Date.now()])

Reports a successful signal from the peer. By calling report you're saying that in the defined timestamp, the peer is alive. *when* states the timestamp of the signal. 

*number*
`.phi`([<number> when=Date.now()])

Get the current *phi* of the peer. Optionally you can get the *phi* in a specific timestamp. The higher the Phi, the bigger the confidence that the peer has failed.

## TEST

**$** make test

**$** make test-browser

## EXAMPLE

```
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

## REFERENCES

 * Naohiro Hayashibara, Xavier Defago, Rami Yared and Takuya Katayama (2004). [The Phi Accrual Failure Detector](http://www.scribd.com/doc/50937976/The-Phi-Accrual-Failure-Detector)
 * Marcus Ljungblad (2011) [Cassandra and its Accrual Failure Detector](http://ljungblad.nu/post/44006928392/cassandra-and-its-accrual-failure-detector)
 * [cassandra/src/java/org/apache/cassandra/gms/FailureDetector.java at trunk - apache/cassandra](https://github.com/apache/cassandra/blob/trunk/src/java/org/apache/cassandra/gms/FailureDetector.java)
 * [The Apache Cassandra Project](http://cassandra.apache.org/)
 * [racker/node-failure-detector](https://github.com/racker/node-failure-detector)
 * [node-gossip/lib/accrual_failure_detector.js at master - bpot/node-gossip](https://github.com/bpot/node-gossip/blob/master/lib/accrual_failure_detector.js)

## LICENSE

 * Original [racker/node-failure-detector](https://github.com/racker/node-failure-detector) code is under the [MIT license](license/joyent)
 * Updates from [Rackspace](https://github.com/rackspace) are under the [Apache 2.0 license](license/rackspace)
 * Original [bpot/node-gossip](https://github.com/bpot/node-gossip) code is under the [MIT license](license/bpot)
 * Updates from [kordon/afd](https://github.com/kordon/afd) are under the [MIT license](license/kordon)