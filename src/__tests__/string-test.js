const util = require('../index')

describe(__filename, function () {
  it('stripWhitespace', function () {
    const str = util.stripWhitespace('\n foo \r\n\n bar ')
    str.should.equal('foobar')
  })
  it('kebabCase', function () {
    util.kebabCase('Foo bar').should.equal('foo-bar')
  })
  it('camelCase', function () {
    util.camelCase('foo bar').should.equal('fooBar')
  })
})
