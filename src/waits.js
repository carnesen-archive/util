'use strict';

const checks = require('./checks');

function attachTimedEventCallback({ event, timeout }) {

  checks.throwIfNotFunction(event.emitter.once, 'event.emitter.once');
  checks.throwIfNotFunction(event.emitter.removeListener, 'event.emitter.removeListener');
  checks.throwIfNotPositiveLengthString(event.name, 'event.name');
  checks.throwIfNotFunction(event.callback, 'event.callback');
  checks.throwIfNotFunction(timeout.callback, 'timeout.callback');

  if (checks.isDefined(timeout.interval)) {
    checks.throwIfNotPositiveNumber(timeout.interval, 'timeout.interval');
  }

  let timeoutId;

  function eventHandler(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    event.callback(...args);
  }

  function timeoutHandler() {
    event.emitter.removeListener(event.name, eventHandler);
    timeout.callback();
  }

  if (timeout.interval) {
    timeoutId = setTimeout(timeoutHandler, timeout.interval);
  }

  event.emitter.once(event.name, eventHandler);

}

function waitForEvent(emitter, name, interval) {

  return new Promise((resolve, reject) => {
    attachTimedEventCallback({
      event: {
        emitter,
        name,
        callback(value) {
          resolve(value);
        }
      },
      timeout: {
        interval,
        callback() {
          const message = `Timed out after ${ interval } milliseconds waiting for event "${ name }"`;
          reject(new Error(message));
        }
      }
    });
  });

}

function waitForNonEvent(emitter, name, interval) {

  return new Promise((resolve, reject) => {
    attachTimedEventCallback({
      event: {
        emitter,
        name,
        callback(value) {
          const err = new Error(`Emitter emitted event "${ name }"`);
          err.value = value;
          reject(err);
        }
      },
      timeout: {
        interval,
        callback: resolve
      }
    });
  });

}

function delay(interval) {
  const startTime = Date.now();
  return new Promise(resolve =>
    setTimeout(() => resolve(Date.now() - startTime), interval)
  );
}

module.exports = {
  delay,
  waitForEvent,
  waitForNonEvent
};
