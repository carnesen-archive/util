
require('chai').should();

const util = require('../index');

describe('tests', function () {

  it('isDefined return false if value is undefined', function () {
    util.isDefined().should.equal(false);
  });

  it('isDefined return true if value is defined', function () {
    util.isDefined('').should.equal(true);
  });

  it('isFunction return true if value is a function', function () {
    util.isFunction(() => {}).should.equal(true);
    util.isFunction(function () {}).should.equal(true);
  });

  it('isFunction return false if value is not a function', function () {
    util.isFunction().should.equal(false);
    util.isFunction('').should.equal(false);
    util.isFunction({}).should.equal(false);
  });

  it('throwIfUndefined should throw if value is not defined', function () {
    util.throwIfUndefined.should.throw(/value/);
  });

  it('throwIfUndefined should throw second arg if value is not defined', function () {
    (() => util.throwIfUndefined(undefined, 'foo')).should.throw(/foo/);
  });

  it('promisify returns a promise that is fulfilled on success', function () {

    function succeed(arg1, arg2, callback) {
      callback(null, [arg1, arg2]);
    }

    return util.promisify(succeed)('foo', 'bar')
      .then(ret => ret.should.eql(['foo', 'bar']));
  });

  it('promisify returns a promise that is rejected on error', function () {

    function fail(arg, callback) {
      callback(new Error(arg));
    }

    return util.promisify(fail)('foo')
      .then(() => {
        // this should not be called
        throw new Error('Test failed');
      })
      .catch(err => {
        err.message.should.equal('foo');
      });
  });

});
