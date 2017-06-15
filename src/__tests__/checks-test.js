const util = require('..')

describe(__filename, function () {
  it('isArray return true if an array is passed', function () {
    util.isArray([]).should.equal(true)
  })

  it('isArray return false if a non-array is passed', function () {
    util.isArray().should.equal(false)
    util.isArray('foo').should.equal(false)
    util.isArray({}).should.equal(false)
    util.isArray(null).should.equal(false)
  })

  it('isDefined return false if value is undefined', function () {
    util.isDefined().should.equal(false)
  })

  it('isDefined return true if value is defined', function () {
    util.isDefined('').should.equal(true)
  })

  it('isFunction return true if value is a function', function () {
    util.isFunction(() => {}).should.equal(true)
    util.isFunction(function () {}).should.equal(true)
  })

  it('isFunction return false if value is not a function', function () {
    util.isFunction().should.equal(false)
    util.isFunction('').should.equal(false)
    util.isFunction({}).should.equal(false)
  })

  it('assertDefined should throw if value is not defined', function () {
    util.assertDefined.should.throw(TypeError)
  })

  it('assertDefined should throw second arg if value is not defined', function () {
    (() => util.assertDefined(undefined, 'foo')).should.throw(TypeError)
  })

  it('assertSemver should throw if not a valid semver', function () {
    util.assertSemver('1.2.3');
    (() => util.assertSemver('asdf')).should.throw(/Expected/)
  })

  it('assertNonEmptyArray should throw if not a non-empty array', function () {
    (() => util.assertNonEmptyArray([])).should.throw(/Expected/)
  })

  it('assertKebabCasedString should throw if not a kebab-cased string', function () {
    util.assertKebabCasedString('foo-bar');
    (() => util.assertKebabCasedString('BLARG')).should.throw(/Expected/)
  })

  it('assertCamelCasedString should throw if not a camel-cased string', function () {
    util.assertCamelCasedString('fooBar');
    (() => util.assertKebabCasedString('BLARG')).should.throw(/Expected/)
  })
})
