/**
 * Accrual Failure Detector
 * @module afd
 */


/**
 * @constructor
 * @param {Number} {ws=100} How many heartbeat intervals we keep track of (window size)
 * @param {Number} {last=Date.now()} Last report timestamp
 */
var afd = function (ws, last) {
  if(!exists(last)) last = Date.now()
  if(!exists(ws)) ws = 100
  
  this._ws = ws
  this._last = last
  this._intervals = Array()
  this._variance = -1
  this._mean = -1
}

/**
 * Report a received heartbeat
 * @param {Number} when
 */
afd.prototype.report = function (when) {
  if(this._intervals.length > this._ws) this.intervals.shift()
  if(!when) when = Date.now()

  var interval = when - this._last
  this._intervals.push(interval)
  this._last = when
  
  if(!this._intervals.length) return
  
  this._variance = this.variance()
  this._mean = this.mean()
}

/**
 * Get the current phi to determine failure
 * See {@link https://issues.apache.org/jira/browse/CASSANDRA-2597 CASSANDRA-2597} for an explanation of the math at work here.
 * Using 1 as a threshold means the likeliness of mistaken failure is 10%
 * Using 2 as a threshold means the likeliness of mistaken failure is 1%
 * Using 3 as a threshold means the likeliness of mistaken failure is 0.1%
 *
 * @param {Number} when
 */
afd.prototype.phi = function (when) {
  // We haven't yet got any data via report.
  if(this._mean === -1) return -1
  if(!when) when = Date.now()
  
  var interval = when - this._last
  
  // If it's only 5 seconds from the start - let's give the system some
  // slack and allow it to fuck up.
  if((this._intervals.length < 3) && (interval < 5000)) return 0
  
  var probability = Math.pow(Math.E, -1 * interval / this._mean)

  return (-1) * (Math.log(probability) / Math.LN10)
}

/**
 * Get the mean interval
 * @returns mean
 */
afd.prototype.mean = function () {
  return this._intervals.reduce(function (prev, curr) {
    return prev + curr
  }) / this._intervals.length
}

/**
 * Get the variance
 * @returns variance
 */
afd.prototype.variance = function () {
  var mean = this._mean
  
  return this._intervals.reduce(function (prev, curr) {
    var x = curr - mean
    return prev + (x * x)
  }) / this._intervals.length
}


/**
 * Exports the afd constructor
 */
module.exports = function (ws, last) {
  return new afd(ws, last)
}

var exists = function (e) {
  return !((typeof e === 'undefined') || (e === null))
}