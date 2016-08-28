'use strict';

const checks = require('./checks');
const waits = require('./waits');

module.exports = Object.assign({}, checks, waits);
