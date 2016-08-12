'use strict';

function isArray(value) {
  return Array.isArray(value);
}

function isBoolean(value) {
  return typeof value === 'boolean';
}

function isDefined(value) {
  return typeof value !== 'undefined';
}

function isEmptyObject(value) {
  return isObject(value) && Object.keys(value).length === 0 && value.constructor === Object
}

function isObject(value) {
  return value === Object(value);
}

function isString(value) {
  return typeof value === 'string';
}

function makeExpectedError(name, typeString) {
  return new Error('Expected argument "' + name + '" to be ' + typeString);
}

module.exports = {

  firstDefined(...args) {
    for (let arg of [...args]) {
      if (isDefined(arg)) {
        return arg;
      }
    }
  },

  isArray,

  isBoolean,

  isDefined,

  isEmptyObject,

  isFunction(value) {
    return typeof value === 'function';
  },

  isString,

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
  },

  throwIf(condition, message) {
    if (condition) {
      throw new Error(message);
    }
  },

  throwIfNot(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  },

  throwIfNotArray(value, name = 'value') {
    if (!isArray(value)) {
      throw makeExpectedError(name, 'an array');
    }
  },

  throwIfNotBoolean(value, name = 'value') {
    if (!isBoolean(value)) {
      throw makeExpectedError(name, 'a boolean');
    }
  },

  throwIfNotFunction(value, name = 'value') {
    if (!isFunction(value)) {
      throw makeExpectedError(name, 'a function');
    }
  },

  throwIfNotObject(value, name = 'value') {
    if (!isObject(value)) {
      throw makeExpectedError(name, 'an object');
    }
  },

  throwIfNotString(value, name = 'value') {
    if (!isString(value)) {
      throw makeExpectedError(name, 'a string');
    }
  },

  throwIfUndefined(value, name = 'value') {
    if (!isDefined(value)) {
      throw makeExpectedError(name, 'defined');
    }
  }

};
