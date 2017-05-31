import Router from '../lib/router'
import * as assert from 'assert'

const router = new Router

router.route('/hello', function() {
  // console.log('[Hello] Hello World')
})

router.route('/hello/:someone', function(parameters) {
  // console.log(`[Hello] Hello ${parameters.someone} !`)
}, { defaultValue: 'John' })

describe('basic', function() {

  it("check routes", function() {
    const routes = router.getRoutes()
    assert.deepEqual(routes, [ '/', '/hello', '/hello/:someone' ])
  })

  it('go to /hello', function() {
    const result = router.go('/hello')
    assert.equal(result.path, '/hello')
  })

  it('go to /hello/Max', function() {
    const result = router.go('/hello/Max')
    assert.equal(result.path, '/hello/Max')
  })

  it('go to /hello/John', function() {
    const result = router.go('/hello/:someone')
    assert.equal(result.path, '/hello/John')
  })

  it('go to /hello/Eddy', function() {
    const result = router.go('/hello/:someone', {
      parameters: {
        someone: 'Eddy'
      }
    })
    assert.equal(result.path, '/hello/Eddy')
  })

  it('go back to /hello/John', function() {
    const result = router.backward()
    assert.equal(result.path, '/hello/John')
  })

  it('go forward to /hello/Eddy', function() {
    const result = router.forward()
    assert.equal(result.path, '/hello/Eddy')
  })

  it("can't go forward", function() {
    const result = router.forward()
    assert.ok(!result)
  })

})