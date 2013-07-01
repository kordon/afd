var mean = require('mean')


/**
 * Wrapper around the `afd` constructor
 * @param {Number} [ws=100] How many heartbeat we keep track of
 * @param {Number} [last=Date.now()] Last report timestamp
 * @returns {afd}
 */
module.exports = function (ws, last) {
  return new afd(ws, last)
}

/**
 * @param {Number} [ws=100] How many heartbeat we keep track of
 * @param {Number} [last=Date.now()] Last report timestamp
 */
var afd = module.exports.afd = function (ws, last) {
  if(typeof ws !== 'number') ws = 100
  if(typeof last !== 'number') last = Date.now()
  
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