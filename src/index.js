'use strict';

function isDefined(value) {
  return typeof value !== 'undefined';
}

module.exports = {

  isDefined,

  isFunction(value) {
    return typeof value === 'function';
  },

  throwIfUndefined(value, name = 'value') {
    if (!isDefined(value)) {
      throw new Error('Expected ' + name + ' to be defined');
    }
  },

  promisify(func) {
    return (...args) => new Promise((resolve, reject) => {
      func(...args, (err, ret) => {
        if (err) {
          reject(err);
        } else {
          resolve(ret);
        }
      });
    });
  }

};
