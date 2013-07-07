var type = require('component-type'),
    mean = require('mean')

/**
 * afd constructor
 *
 *     var afd = require('afd')
 *
 *     // create new afd instance
 *     var peer = afd()
 *     // report that the peer is live
 *     peer.report()
 *     // get the phi
 *     peer.phi()
 *
 * @param {Number} [ws=100] How many heartbeat we keep track of
 * @param {Number} [last=Date.now()] Last report timestamp
 * @returns {afd}
 */
var afd = module.exports = function (ws, last) {
  if(!(this instanceof afd)) return new afd(ws, last)
  
  if(type(ws) !== 'number') ws = 100
  if(type(last) !== 'number') last = Date.now()
  
  this.ws = ws
  this.last = last
  this.intervals = []
}

/**
 * Report a received heartbeat
 *
 * @param {Number} [when=Date.now()]
 */
afd.prototype.report = function (when) {
  if(this.intervals.length > this.ws) this.intervals.shift()
  if(!when) when = Date.now()

  var interval = when - this.last
  this.intervals.push(interval)
  this.last = when
}

/**
 * Get the current phi to determine failure.
 *
 * See [CASSANDRA-2597](https://issues.apache.org/jira/browse/CASSANDRA-2597) for an explanation of the math at work here.
 *
 *  * Using `1` as a threshold means the likeliness of mistaken failure is `10%`
 *
 *  * Using `2` as a threshold means the likeliness of mistaken failure is `1%`
 *
 *  * Using `3` as a threshold means the likeliness of mistaken failure is `0.1%`
 *
 * @param {Number} [when=Date.now()]
 * @returns {Number} the current phi
 */
afd.prototype.phi = function (when) {
  if(!when) when = Date.now()
  
  var interval = when - this.last
  
  // If it's only 5 seconds from the start - let's give the system some
  // slack and allow it to fuck up.
  if((this.intervals.length < 3) && (interval < 5000)) return 0
  
  var probability = Math.pow(Math.E, -1 * interval / mean(this.intervals))

  return (-1) * (Math.log(probability) / Math.LN10)
}