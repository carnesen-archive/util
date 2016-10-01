import { should } from 'chai'
import * as util from '../index'

should()

const interval = 50
const data = 'foo'

const emitter = {
  once (name, callback) {
    setTimeout(() => callback('foo'), interval)
  },
  removeListener () {}
}

function succeed (arg1, arg2, callback) {
  callback(null, arg1, arg2)
}

function fail (arg, callback) {
  callback(new Error(arg))
}

describe('promisify', function () {
  it('returns a promise that is fulfilled on success', function () {
    return util.promisify(succeed)('foo', 'bar')
      .then(ret => ret.should.eql('foo'))
  })

  it('returns a promise that is rejected on error', function () {
    return util.promisify(fail)('foo')
      .then(() => {
        // this should not be called
        throw new Error('Test failed')
      })
      .catch(err => {
        err.message.should.equal('foo')
      })
  })

  it('returns an array if returnArray is true', function () {
    return util.promisify(succeed, { returnArray: true })('foo', 'bar')
      .then(ret => ret.should.eql(['foo', 'bar']))
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
