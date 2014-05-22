# level-import
import a json file of key value pairs into a level-db database

see also: [level-export](https://npm.im/level-export)

## usage
```js
var levelImport = require('level-import')
var fs = require('fs')
var level = require('level')

var db = level('./db')
fs.createReadStream('./export.json')
  .pipe(levelImport(db))
```


## api


## installation

    $ npm install level-import


## running the tests

From package root:

    $ npm install
    $ npm test


## contributors

- jden <jason@denizac.org>


## license

ISC. (c) MMXIV jden <jason@denizac.org>. See LICENSE.md
