'use strict'
const semver = require('semver')
const kebabCase = require('lodash.kebabcase')
const camelCase = require('lodash.camelcase')

function startsWithVowel (str) {
  return (/^[aeiou]$/i).test(str)
}

function stripWhitespace (str) {
  return str.replace(/[\n\r ]/g, '')
}

function createTypeError (name, description) {
  const message = `Expected ${name} to be ${description}`
  return new TypeError(message)
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

function isKebabCasedString (value) {
  return isString(value) && kebabCase(value) === value
}

function assertKebabCasedString (value, name = 'value') {
  if (!isKebabCasedString(value)) {
    throw createTypeError(name, 'a kebab-cased string')
  }
}

function isCamelCasedString (value) {
  return isString(value) && camelCase(value) === value
}

function assertCamelCasedString (value, name = 'value') {
  if (!isCamelCasedString(value)) {
    throw createTypeError(name, 'a camel-cased string')
  }
}

function isUndefined (value) {
  return typeof value === 'undefined'
}

function assertNonEmptyString (value, name = 'value') {
  if (!(isString(value) && value.length > 0)) {
    throw createTypeError(name, 'a non-empty string')
  }
}

function assertArray (value, name = 'value') {
  if (!isArray(value)) {
    throw createTypeError(name, 'an array')
  }
}

function assertNonEmptyArray (value, name = 'value') {
  assertArray(value, name)
  if (value.length === 0) throw createTypeError(name, 'a non-empty array')
}

function assertBoolean (value, name = 'value') {
  if (!isBoolean(value)) {
    throw createTypeError(name, 'a boolean')
  }
}

function assertFunction (value, name = 'value') {
  if (!isFunction(value)) {
    throw createTypeError(name, 'a function')
  }
}

function assertObject (value, name = 'value') {
  if (!isObject(value)) {
    throw createTypeError(name, 'an object')
  }
}

function assertPositiveNumber (value, name = 'value') {
  if (!isPositiveNumber(value)) {
    throw createTypeError(name, 'a positive number')
  }
}

function assertString (value, name = 'value') {
  if (!isString(value)) {
    throw createTypeError(name, 'a string')
  }
}

function assertNonEmptyObject (value, name = 'value') {
  if (!(isObject(value) && !isEmptyObject(value))) {
    throw createTypeError(name, 'a non-empty object')
  }
}

function assertUndefined (value, name = 'value') {
  if (isDefined(value)) {
    throw createTypeError(name, 'undefined')
  }
}

function assertDefined (value, name = 'value') {
  if (isUndefined(value)) {
    throw createTypeError(name, 'defined')
  }
}

function assertSemver (value, name = 'value') {
  if (!semver.valid(value)) {
    throw createTypeError(name, 'a semver string')
  }
}

function promisify (func, options = {}) {
  assertFunction(func, 'func')
  assertObject(options, 'options')
  const {resolveMultiple = [], rejectMultiple = []} = options
  assertArray(resolveMultiple, 'options.resolveMultiple')
  assertArray(rejectMultiple, 'options.rejectMultiple')
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
  assertFunction(event.emitter.once, 'event.emitter.once')
  assertFunction(event.emitter.removeListener, 'event.emitter.removeListener')
  assertNonEmptyString(event.name, 'event.name')
  assertFunction(event.callback, 'event.callback')
  assertFunction(timeout.callback, 'timeout.callback')

  if (isDefined(timeout.interval)) {
    assertPositiveNumber(timeout.interval, 'timeout.interval')
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
  assertUndefined,
  assertArray,
  assertBoolean,
  assertCamelCasedString,
  assertDefined,
  assertFunction,
  assertKebabCasedString,
  assertNonEmptyArray,
  assertNonEmptyObject,
  assertNonEmptyString,
  assertObject,
  assertPositiveNumber,
  assertSemver,
  assertString,
  camelCase,
  createTypeError,
  delay,
  isArray,
  isBoolean,
  isCamelCasedString,
  isDefined,
  isEmptyObject,
  isFunction,
  isKebabCasedString,
  isPositiveNumber,
  isNumber,
  isObject,
  isString,
  isUndefined,
  kebabCase,
  print,
  print2,
  promisify,
  startsWithVowel,
  waitForEvent,
  waitForNonEvent,
  stripWhitespace,
}
