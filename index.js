require('polyfill-promise')
var JSONstream = require('JSONstream')
var through = require('through0')
var Writable = require('readable-stream').Writable
var Through = require('readable-stream').PassThrough

function levelImport (db) {  
  var ts = new Through
  var _resolve
  var _reject
  var p = new Promise(function (resolve, reject) {
    _resolve = resolve
    _reject = reject
  })

  ts.then = p.then.bind(p)
  ts.catch = p.catch.bind(p)

  if (typeof db !== 'object') {
    _reject(new Error('missing required parameter: db'))
    return ts
  }  


  ts.pipe(JSONstream.parse('*'))
  .on('error', function (e) {
    _reject(new Error('JSONError: ' + e))
  })
  .pipe(through(function (obj) {
    if (!(obj && obj.key && obj.value)) {
      _reject(new Error('JSONError: not a key-value pair: ' + JSON.stringify(obj)))
      return null
    }
    obj.type = 'put'
    return obj
  }))
  .pipe(db.createWriteStream())
  .on('close', function () {
    _resolve()
  })


  return ts
}

module.exports = levelImport