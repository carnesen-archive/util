'use strict';

require('chai').should();

const util = require('../..');

function succeed(arg1, arg2, callback) {
  callback(null, arg1, arg2);
}

function fail(arg, callback) {
  callback(new Error(arg));
}

describe('tests', function () {

  it('isArray return true if an array is passed', function () {
    util.isArray([]).should.equal(true);
  });

  it('isArray return false if a non-array is passed', function () {
    util.isArray().should.equal(false);
    util.isArray('foo').should.equal(false);
    util.isArray({}).should.equal(false);
    util.isArray(null).should.equal(false);
  });

  it('firstDefined returns the first argument that is not undefined', function () {
    (util.firstDefined() === undefined).should.equal(true);
    util.firstDefined(undefined, 'foo').should.equal('foo');
    util.firstDefined(undefined, 0, undefined).should.equal(0);
  });

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

    return util.promisify(succeed)('foo', 'bar')
      .then(ret => ret.should.eql('foo'));
  });

  it('promisify returns a promise that is rejected on error', function () {

    return util.promisify(fail)('foo')
      .then(() => {
        // this should not be called
        throw new Error('Test failed');
      })
      .catch(err => {
        err.message.should.equal('foo');
      });
  });

  it('promisify returns an array if returnArray is true', function () {
    return util.promisify(succeed, { returnArray: true })('foo', 'bar')
      .then(ret => ret.should.eql(['foo', 'bar']));
  });

});
