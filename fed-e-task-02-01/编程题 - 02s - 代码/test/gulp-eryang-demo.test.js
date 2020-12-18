const test = require('ava')
const gulpEryangDemo = require('..')

// TODO: Implement module test
test('<test-title>', t => {
  const err = t.throws(() => gulpEryangDemo(100), TypeError)
  t.is(err.message, 'Expected a string, got number')

  t.is(gulpEryangDemo('w'), 'w@zce.me')
  t.is(gulpEryangDemo('w', { host: 'wedn.net' }), 'w@wedn.net')
})
