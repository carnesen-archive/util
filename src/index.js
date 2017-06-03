'use strict'

const {
  throwIfNotArray,
  throwIfNotFunction,
  throwIfNotObject,
  throwIfNotNonEmptyString,
  isDefined,
  throwIfNotPositiveNumber,
} = require('@carnesen/checks')

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

module.exports = {
  promisify,
  delay,
  waitForEvent,
  waitForNonEvent,
}
