'use strict';

require('chai').should();

const checks = require('../checks');

function succeed(arg1, arg2, callback) {
  callback(null, arg1, arg2);
}

function fail(arg, callback) {
  callback(new Error(arg));
}

describe('tests', function () {

  it('isArray return true if an array is passed', function () {
    checks.isArray([]).should.equal(true);
  });

  it('isArray return false if a non-array is passed', function () {
    checks.isArray().should.equal(false);
    checks.isArray('foo').should.equal(false);
    checks.isArray({}).should.equal(false);
    checks.isArray(null).should.equal(false);
  });

  it('firstDefined returns the first argument that is not undefined', function () {
    (checks.firstDefined() === undefined).should.equal(true);
    checks.firstDefined(undefined, 'foo').should.equal('foo');
    checks.firstDefined(undefined, 0, undefined).should.equal(0);
  });

  it('isDefined return false if value is undefined', function () {
    checks.isDefined().should.equal(false);
  });

  it('isDefined return true if value is defined', function () {
    checks.isDefined('').should.equal(true);
  });

  it('isFunction return true if value is a function', function () {
    checks.isFunction(() => {}).should.equal(true);
    checks.isFunction(function () {}).should.equal(true);
  });

  it('isFunction return false if value is not a function', function () {
    checks.isFunction().should.equal(false);
    checks.isFunction('').should.equal(false);
    checks.isFunction({}).should.equal(false);
  });

  it('throwIfUndefined should throw if value is not defined', function () {
    checks.throwIfUndefined.should.throw(/value/);
  });

  it('throwIfUndefined should throw second arg if value is not defined', function () {
    (() => checks.throwIfUndefined(undefined, 'foo')).should.throw(/foo/);
  });

  it('promisify returns a promise that is fulfilled on success', function () {

    return checks.promisify(succeed)('foo', 'bar')
      .then(ret => ret.should.eql('foo'));
  });

  it('promisify returns a promise that is rejected on error', function () {

    return checks.promisify(fail)('foo')
      .then(() => {
        // this should not be called
        throw new Error('Test failed');
      })
      .catch(err => {
        err.message.should.equal('foo');
      });
  });

  it('promisify returns an array if returnArray is true', function () {
    return checks.promisify(succeed, { returnArray: true })('foo', 'bar')
      .then(ret => ret.should.eql(['foo', 'bar']));
  });

});
