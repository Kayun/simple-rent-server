var path = require('path');
var pkg = require('../package.json');
var MongooseStore = require('koa-session-mongoose');

module.exports = {
  version: pkg.version,
  server: {
    host: '::',
    port: 3000,
    apiPrefix: '/api'
  },
  logs: {
    error: path.resolve(__dirname, '../data/logs/server/error.log')
  },
  secret: ['secret'],
  session: {
    key: 'sr:session',
    maxAge: 86400000,
    overwrite: true,
    signed: true,
    httpOnly: true,
    store: new MongooseStore({
      model: 'Session',
      expires: 60 * 60 * 24 * 3
    })
  },
  db: {
    host: 'mongo',
    port: 27017,
    name: 'sr-dev',
    options: {}
  },
  crypto: {
    salt: {
      size: 32
    },
    hash: {
      size: 32,
      iterations: 10000,
      digest: 'sha512'
    }
  }
}
