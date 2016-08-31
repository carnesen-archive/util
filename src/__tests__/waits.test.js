'use strict';

const { waitForEvent, waitForNonEvent } = require('../waits');

const interval = 50;
const data = 'foo';

const emitter = {
  once(name, callback) {
    setTimeout(() => callback('foo'), interval);
  },
  removeListener() {}
};

describe('waitForEvent', function (){

  it('returns a promise that resolves later', function () {
    const initialTime = Date.now();
    return waitForEvent(emitter, 'does not matter')
      .then(ret => {
        const elapsedTime = Date.now() - initialTime;
        elapsedTime.should.be.above(30);
        elapsedTime.should.be.below(100);
        ret.should.eql(data);
      });
  });

  it('returns a promise that rejects if interval is set', function () {
    const initialTime = Date.now();
    return waitForEvent(emitter, 'does not matter', interval / 2)
      .then(() => {
        throw new Error('An error message that does not start with "Timed out"');
      })
      .catch(err => {
        const elapsedTime = Date.now() - initialTime;
        elapsedTime.should.be.above(interval / 4);
        elapsedTime.should.be.below(interval);
        err.message.startsWith('Timed out').should.equal(true);
      });

  });

});

describe('waitForNonEvent', function (){

  it('returns a promise that rejects if an event arrives', function () {
    const initialTime = Date.now();
    return waitForNonEvent(emitter, 'does not matter', interval * 2)
      .then(() => {
        throw new Error('An error message that is not the event data');
      })
      .catch(err => {
        const elapsedTime = Date.now() - initialTime;
        elapsedTime.should.be.above(30);
        elapsedTime.should.be.below(100);
        err.should.be.an.instanceOf(Error);
      });
  });

  it('returns a promise that resolves if the interval times out', function () {
    const initialTime = Date.now();
    return waitForNonEvent(emitter, 'does not matter', interval / 2)
      .then(() => {
        const elapsedTime = Date.now() - initialTime;
        elapsedTime.should.be.above(interval / 4);
        elapsedTime.should.be.below(interval);
      });

  });

});
