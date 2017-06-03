const util = require('../index')

function succeed (arg1, arg2, callback) {
  callback(null, arg1, arg2)
}

function fail (arg, callback) {
  callback(new Error(arg), arg)
}

describe(__filename, function () {
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
