const util = require('../index')

describe(__filename, function () {
  it('print', function () {
    util.print('foo')
  })
  it('print2', function () {
    util.print2('foo')
  })
})
