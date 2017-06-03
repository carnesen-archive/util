'use strict'
const util = require('../index')

const interval = 50
const data = 'foo'

const emitter = {
  once (name, callback) {
    setTimeout(() => callback('foo'), interval)
  },
  removeListener () {},
}

function succeed (arg1, arg2, callback) {
  callback(null, arg1, arg2)
}

function fail (arg, callback) {
  callback(new Error(arg), arg)
}

describe('promisify', function () {
  it('returns a promise that is fulfilled on success', async function () {
    const returnValue = await util.promisify(succeed)('foo', 'bar')
    returnValue.should.eql('foo')
  })

  it('returns a promise that is rejected on error', async function () {
    try {
      await util.promisify(fail)('foo')
      throw new Error('should not be thrown')
    } catch (ex) {
      ex.message.should.equal('foo')
    }
  })

  it('resolves an object if resolveMultiple is an array', async function () {
    const returnValue = await util.promisify(succeed, {resolveMultiple: ['arg1', 'arg2']})('foo', 'bar')
    returnValue.should.deep.equal({arg1: 'foo', arg2: 'bar'})
  })

  it('rejects an object with properties if rejectMultiple is an array', async function () {
    try {
      await util.promisify(fail, {rejectMultiple: ['arg1']})('foo')
    } catch (ex) {
      ex.arg1.should.equal('foo')
    }
  })

  it('throws if rejectMultiple is not an array', function () {
    function throws () {
      util.promisify(fail, {rejectMultiple: 'not an array'})
    }
    throws.should.throw()
  })
})

describe('waitForEvent', function () {
  it('returns a promise that resolves later', function () {
    const initialTime = Date.now()
    return util.waitForEvent(emitter, 'does not matter')
      .then(ret => {
        const elapsedTime = Date.now() - initialTime
        elapsedTime.should.be.above(30)
        elapsedTime.should.be.below(100)
        ret.should.eql(data)
      })
  })

  it('returns a promise that rejects if interval is set', function () {
    const initialTime = Date.now()
    return util.waitForEvent(emitter, 'does not matter', interval / 2)
      .then(() => {
        throw new Error('An error message that does not start with "Timed out"')
      })
      .catch(err => {
        const elapsedTime = Date.now() - initialTime
        elapsedTime.should.be.above(interval / 4)
        elapsedTime.should.be.below(interval)
        err.message.startsWith('Timed out').should.equal(true)
      })
  })
})

describe('waitForNonEvent', function () {
  it('returns a promise that rejects if an event arrives', function () {
    const initialTime = Date.now()
    return util.waitForNonEvent(emitter, 'does not matter', interval * 2)
      .then(() => {
        throw new Error('An error message that is not the event data')
      })
      .catch(err => {
        const elapsedTime = Date.now() - initialTime
        elapsedTime.should.be.above(30)
        elapsedTime.should.be.below(100)
        err.should.be.an.instanceOf(Error)
      })
  })

  it('returns a promise that resolves if the interval times out', function () {
    const initialTime = Date.now()
    return util.waitForNonEvent(emitter, 'does not matter', interval / 2)
      .then(() => {
        const elapsedTime = Date.now() - initialTime
        elapsedTime.should.be.above(interval / 4)
        elapsedTime.should.be.below(interval)
      })
  })
})

describe('delay', function () {
  it('resolves the elapsed time after the specified interval', function () {
    return util.delay(50).then(elapsedTime => {
      elapsedTime.should.be.above(30)
      elapsedTime.should.be.below(70)
    })
  })
})
