'use strict';

function isArray(value) {
  return Array.isArray(value);
}

function isBoolean(value) {
  return typeof value === 'boolean';
}

function isDefined(value) {
  return !isUndefined(value);
}

function isEmptyObject(value) {
  return isObject(value) && Object.keys(value).length === 0 && value.constructor === Object;
}

function isFunction(value) {
  return typeof value === 'function';
}

function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

function isObject(value) {
  return value === Object(value);
}

function isPositiveNumber(value) {
  return isNumber(value) && value > 0;
}

function isString(value) {
  return typeof value === 'string';
}

function makeExpectedError(value, name, typeString) {
  const an = startsWithVowel(typeString) ? 'an' : 'a';
  const message = `Expected argument "${ name }" to be ${ an } ${ typeString }. Got ${ value }`;
  return new Error(message);
}

function startsWithVowel(str) {
  return (/^[aeiou]$/i).test(str);
}

function isUndefined(value) {
  return typeof value === 'undefined';
}

function throwIfNotNonEmptyString(value, name = 'value') {
  if (!(isString(value) && value.length > 0)) {
    throw makeExpectedError(value, name, 'non-empty string');
  }
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
  isFunction,
  isObject,
  isString,
  isUndefined,

  promisify(func, options) {
    options = options || {};
    return (...args) => new Promise((resolve, reject) => {
      func(...args, (err, ...rets) => {
        if (err) {
          reject(err);
        } else {
          if (options.returnArray) {
            resolve([...rets]);
          } else {
            resolve([...rets][0]);
          }
        }
      });
    });
  },

  startsWithVowel,

  throwIf(condition, message) {
    if (condition) {
      throw new Error(message);
    }
  },

  throwIfEmptyObject(value, name) {
    if (isEmptyObject(value)) {
      throw makeExpectedError(value, name, 'not to be an empty object');
    }
  },

  throwIfNot(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  },

  throwIfNotArray(value, name = 'value') {
    if (!isArray(value)) {
      throw makeExpectedError(value, name, 'array');
    }
  },

  throwIfNotBoolean(value, name = 'value') {
    if (!isBoolean(value)) {
      throw makeExpectedError(value, name, 'boolean');
    }
  },

  throwIfNotFunction(value, name = 'value') {
    if (!isFunction(value)) {
      throw makeExpectedError(value, name, 'function');
    }
  },

  throwIfNotObject(value, name = 'value') {
    if (!isObject(value)) {
      throw makeExpectedError(value, name, 'object');
    }
  },

  throwIfNotPositiveNumber(value, name = 'value') {
    if (!isPositiveNumber(value)) {
      throw makeExpectedError(value, name, 'positive number');
    }
  },

  throwIfNotString(value, name = 'value') {
    if (!isString(value)) {
      throw makeExpectedError(value, name, 'string');
    }
  },

  throwIfNotNonEmptyObject(value, name = 'value') {
    if (!(isObject(value) && !isEmptyObject(value))) {
      throw makeExpectedError(value, name, 'non-empty object');
    }
  },

  throwIfNotNonEmptyString,

  throwIfNotPositiveLengthString: throwIfNotNonEmptyString,

  throwIfDefined(value, name = 'value') {
    if (isDefined(value)) {
      throw makeExpectedError(value, name, 'undefined value');
    }
  },

  throwIfUndefined(value, name = 'value') {
    if (isUndefined(value)) {
      throw makeExpectedError(value, name, 'defined value');
    }
  }

};
