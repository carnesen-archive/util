const util = require('../index')

describe(__filename, function () {
  it('stripWhitespace', function () {
    const str = util.stripWhitespace('\n foo \r\n\n bar ')
    str.should.equal('foobar')
  })
})
