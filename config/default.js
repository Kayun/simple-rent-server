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
    store: MongooseStore
  },
  cookie: {
    maxAge: 86400000,
    httpOnly: true,
    domain: null,
    path: '/',
    secure: false
  },
  store: {
    model: 'Session',
    collection: 'sessions',
    expires: 60 * 60 * 24 * 3,
    connection: null // нужно переопределить при создании сессии
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
  },
  validators: {
    password: {
      length: 6
    },
    email: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  }
}
