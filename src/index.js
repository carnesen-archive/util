'use strict'
const semver = require('semver')

function makeExpectedError (value, name, typeString) {
  const an = startsWithVowel(typeString) ? 'an' : 'a'
  const message = `Expected argument "${name}" to be ${an} ${typeString}. Got ${value}`
  return new TypeError(message)
}

function startsWithVowel (str) {
  return (/^[aeiou]$/i).test(str)
}

function isArray (value) {
  return Array.isArray(value)
}

function isBoolean (value) {
  return typeof value === 'boolean'
}

function isDefined (value) {
  return !isUndefined(value)
}

function isEmptyObject (value) {
  return isObject(value) && Object.keys(value).length === 0 && value.constructor === Object
}

function isFunction (value) {
  return typeof value === 'function'
}

function isNumber (value) {
  return typeof value === 'number' && !isNaN(value)
}

function isObject (value) {
  return value === Object(value)
}

function isPositiveNumber (value) {
  return isNumber(value) && value > 0
}

function isString (value) {
  return typeof value === 'string'
}

function isUndefined (value) {
  return typeof value === 'undefined'
}

function throwIfNotNonEmptyString (value, name = 'value') {
  if (!(isString(value) && value.length > 0)) {
    throw makeExpectedError(value, name, 'non-empty string')
  }
}

function throwIf (condition, message) {
  if (condition) {
    throw new Error(message)
  }
}

function throwIfEmptyObject (value, name) {
  if (isEmptyObject(value)) {
    throw makeExpectedError(value, name, 'not to be an empty object')
  }
}

function throwIfNot (condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function throwIfNotArray (value, name = 'value') {
  if (!isArray(value)) {
    throw makeExpectedError(value, name, 'array')
  }
}

function throwIfNotBoolean (value, name = 'value') {
  if (!isBoolean(value)) {
    throw makeExpectedError(value, name, 'boolean')
  }
}

function throwIfNotFunction (value, name = 'value') {
  if (!isFunction(value)) {
    throw makeExpectedError(value, name, 'function')
  }
}

function throwIfNotObject (value, name = 'value') {
  if (!isObject(value)) {
    throw makeExpectedError(value, name, 'object')
  }
}

function throwIfNotPositiveNumber (value, name = 'value') {
  if (!isPositiveNumber(value)) {
    throw makeExpectedError(value, name, 'positive number')
  }
}

function throwIfNotString (value, name = 'value') {
  if (!isString(value)) {
    throw makeExpectedError(value, name, 'string')
  }
}

function throwIfNotNonEmptyObject (value, name = 'value') {
  if (!(isObject(value) && !isEmptyObject(value))) {
    throw makeExpectedError(value, name, 'non-empty object')
  }
}

function throwIfDefined (value, name = 'value') {
  if (isDefined(value)) {
    throw makeExpectedError(value, name, 'undefined value')
  }
}

function throwIfUndefined (value, name = 'value') {
  if (isUndefined(value)) {
    throw makeExpectedError(value, name, 'defined value')
  }
}

function throwIfNotValidSemver (value, name = 'value') {
  if (!semver.valid(value)) {
    throw makeExpectedError(value, name)
  }
}

function promisify (func, options = {}) {
  throwIfNotFunction(func, 'func')
  throwIfNotObject(options, 'options')
  const {resolveMultiple = [], rejectMultiple = []} = options
  throwIfNotArray(resolveMultiple, 'options.resolveMultiple')
  throwIfNotArray(rejectMultiple, 'options.rejectMultiple')
  return function (...args) {
    return new Promise(executor)
    function executor (resolve, reject) {
      func(...args, callback)
      function callback (err, ...returnValues) {
        if (err) {
          let i = 0
          for (let returnValueName of rejectMultiple) {
            err[returnValueName] = returnValues[i]
            i++
          }
          reject(err)
        } else {
          if (resolveMultiple.length > 0) {
            const returnValue = {}
            let i = 0
            for (let returnValueName of resolveMultiple) {
              returnValue[returnValueName] = returnValues[i]
              i++
            }
            resolve(returnValue)
          } else {
            resolve(returnValues[0])
          }
        }
      }
    }
  }
}

function attachTimedEventCallback ({event, timeout}) {
  throwIfNotFunction(event.emitter.once, 'event.emitter.once')
  throwIfNotFunction(event.emitter.removeListener, 'event.emitter.removeListener')
  throwIfNotNonEmptyString(event.name, 'event.name')
  throwIfNotFunction(event.callback, 'event.callback')
  throwIfNotFunction(timeout.callback, 'timeout.callback')

  if (isDefined(timeout.interval)) {
    throwIfNotPositiveNumber(timeout.interval, 'timeout.interval')
  }

  let timeoutId

  function eventHandler (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    event.callback(...args)
  }

  function timeoutHandler () {
    event.emitter.removeListener(event.name, eventHandler)
    timeout.callback()
  }

  if (timeout.interval) {
    timeoutId = setTimeout(timeoutHandler, timeout.interval)
  }

  event.emitter.once(event.name, eventHandler)
}

function waitForEvent (emitter, name, interval) {
  return new Promise((resolve, reject) => {
    attachTimedEventCallback({
      event: {
        emitter,
        name,
        callback (value) {
          resolve(value)
        },
      },
      timeout: {
        interval,
        callback () {
          const message = `Timed out after ${interval} milliseconds waiting for event "${name}"`
          reject(new Error(message))
        },
      },
    })
  })
}

function waitForNonEvent (emitter, name, interval) {
  return new Promise((resolve, reject) => {
    attachTimedEventCallback({
      event: {
        emitter,
        name,
        callback (value) {
          const err = new Error(`Emitter emitted event "${name}"`)
          err.value = value
          reject(err)
        },
      },
      timeout: {
        interval,
        callback: resolve,
      },
    })
  })
}

function delay (interval) {
  const startTime = Date.now()
  return new Promise(resolve =>
    setTimeout(() => resolve(Date.now() - startTime), interval)
  )
}

function print (...args) {
  console.log(...args) // eslint-disable-line no-console
}

function print2 (...args) {
  console.error(...args) // eslint-disable-line no-console
}

module.exports = {
  delay,
  isArray,
  isBoolean,
  isDefined,
  isEmptyObject,
  isFunction,
  isPositiveNumber,
  isNumber,
  isObject,
  isString,
  isUndefined,
  print,
  print2,
  promisify,
  throwIf,
  throwIfDefined,
  throwIfEmptyObject,
  throwIfNot,
  throwIfNotArray,
  throwIfNotBoolean,
  throwIfNotNonEmptyObject,
  throwIfNotNonEmptyString,
  throwIfUndefined,
  throwIfNotValidSemver,
  throwIfNotString,
  throwIfNotObject,
  throwIfNotPositiveNumber,
  throwIfNotFunction,
  startsWithVowel,
  waitForEvent,
  waitForNonEvent,
}
