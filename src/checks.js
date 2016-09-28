export function isArray (value) {
  return Array.isArray(value)
}

export function isBoolean (value) {
  return typeof value === 'boolean'
}

export function isDefined (value) {
  return !isUndefined(value)
}

export function isEmptyObject (value) {
  return isObject(value) && Object.keys(value).length === 0 && value.constructor === Object
}

export function isFunction (value) {
  return typeof value === 'function'
}

export function isNumber (value) {
  return typeof value === 'number' && !isNaN(value)
}

export function isObject (value) {
  return value === Object(value)
}

export function isPositiveNumber (value) {
  return isNumber(value) && value > 0
}

export function isString (value) {
  return typeof value === 'string'
}

export function makeExpectedError (value, name, typeString) {
  const an = startsWithVowel(typeString) ? 'an' : 'a'
  const message = `Expected argument "${name}" to be ${an} ${typeString}. Got ${value}`
  return new Error(message)
}

export function startsWithVowel (str) {
  return (/^[aeiou]$/i).test(str)
}

export function isUndefined (value) {
  return typeof value === 'undefined'
}

export function throwIfNotNonEmptyString (value, name = 'value') {
  if (!(isString(value) && value.length > 0)) {
    throw makeExpectedError(value, name, 'non-empty string')
  }
}

export function promisify (func, options) {
  options = options || {}
  return (...args) => new Promise((resolve, reject) => {
    func(...args, (err, ...rets) => {
      if (err) {
        reject(err)
      } else {
        if (options.returnArray) {
          resolve([...rets])
        } else {
          resolve([...rets][0])
        }
      }
    })
  })
}

export function firstDefined (...args) {
  for (let arg of [...args]) {
    if (isDefined(arg)) {
      return arg
    }
  }
}

export function throwIf (condition, message) {
  if (condition) {
    throw new Error(message)
  }
}

export function throwIfEmptyObject (value, name) {
  if (isEmptyObject(value)) {
    throw makeExpectedError(value, name, 'not to be an empty object')
  }
}

export function throwIfNot (condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

export function throwIfNotArray (value, name = 'value') {
  if (!isArray(value)) {
    throw makeExpectedError(value, name, 'array')
  }
}

export function throwIfNotBoolean (value, name = 'value') {
  if (!isBoolean(value)) {
    throw makeExpectedError(value, name, 'boolean')
  }
}

export function throwIfNotFunction (value, name = 'value') {
  if (!isFunction(value)) {
    throw makeExpectedError(value, name, 'function')
  }
}

export function throwIfNotObject (value, name = 'value') {
  if (!isObject(value)) {
    throw makeExpectedError(value, name, 'object')
  }
}

export function throwIfNotPositiveNumber (value, name = 'value') {
  if (!isPositiveNumber(value)) {
    throw makeExpectedError(value, name, 'positive number')
  }
}

export function throwIfNotString (value, name = 'value') {
  if (!isString(value)) {
    throw makeExpectedError(value, name, 'string')
  }
}

export function throwIfNotNonEmptyObject (value, name = 'value') {
  if (!(isObject(value) && !isEmptyObject(value))) {
    throw makeExpectedError(value, name, 'non-empty object')
  }
}

export function throwIfDefined (value, name = 'value') {
  if (isDefined(value)) {
    throw makeExpectedError(value, name, 'undefined value')
  }
}

export function throwIfUndefined (value, name = 'value') {
  if (isUndefined(value)) {
    throw makeExpectedError(value, name, 'defined value')
  }
}
