'use strict';

const checks = require('./checks');
const waits = require('./waits');

module.exports = Object.assign({
  createLogger: require('./createLogger')
}, checks, waits);
