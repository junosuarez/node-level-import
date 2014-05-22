var chai = require('chai')
chai.should()

var levelMem = require('level-mem')
var from = require('from')

describe('level-import', function () {
  var levelImport = require('../')
  
  it('streams in data', function (done) {

    var data = from(JSON.stringify([
      {key:'s', value: 't'},
      {key:'t', value: 'r'},
      {key:'e', value: 'a'},
      {key:'a', value: '!'}
    ],null,1).split('\n'))

    var db = levelMem('test2')
    data
      .pipe(levelImport(db))
      .then(done, done)
    

  })

  it('is rejected if no db', function (done) {
    levelImport()
      .then(function () {
        throw new Error('should not be resolved')
      }, function (e) {
        e.message.should.equal('missing required parameter: db')
      })
      .then(done, done)
  })
  
  it('it parses JSON streams', function (done) {
    var db = levelMem('test1')

    var data = from(JSON.stringify([
      {key:'a', value: 'o'},
      {key:'b', value: 'm'},
      {key:'c', value: 'g'},
      {key:'d', value: '!'}
    ],null,1).split('\n'))

    data.pipe(levelImport(db))
      .then(function () {
        var count = 0
        db.createReadStream()
          .on('data', function () { count++ })
          .on('end', function () {
            count.should.equal(4)
            done()
          })
      })
      .catch(done)
  })

  it('it rejects on JSON error', function (done) {
    var db = levelMem('test3')
    var data = from(['asdasdasfrg'])

    data.pipe(levelImport(db))
      .then(function () {
        throw new Error('should not resolve')
      }, function (err) {
        err.message.should.match(/^JSONError: /)
      })
      .then(done, done)
  })

  it('it is rejected on non-key-value pairs', function (done) {
    var db = levelMem('test4')

    var data = from(JSON.stringify([
      {key:'a', value: 'o'},
      {key:'b', value: 'm'},
      {foo: 'bar'},
      {key:'d', value: '!'}
    ],null,1).split('\n'))

    data.pipe(levelImport(db))
      .then(function () {
        throw new Error('should not resolve')
      }, function (err) {
        err.message.should.match(/^JSONError: not a key-value pair/)
      })
      .then(done, done)
  })


})