const util = require('../index')

describe('delay', function () {
  it('resolves the elapsed time after the specified interval', function () {
    return util.delay(50).then(elapsedTime => {
      elapsedTime.should.be.above(30)
      elapsedTime.should.be.below(70)
    })
  })
})
