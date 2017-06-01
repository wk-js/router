import Router from '../lib/router'
import RedirectExtension from '../lib/extensions/redirect'
import OrderExtension from '../lib/extensions/order'
import * as assert from 'assert'

const router   = new Router
const order    = router.extension(OrderExtension)
const redirect = router.extension(RedirectExtension)

describe('redirect', function() {

  it('create a new route for redirect', function() {
    redirect.set('/:anything', '/404')

    const routes = router.getRoutes()
    assert.deepEqual(routes, [ '/', '/:anything' ])
  })

  it('redirect to /:anything', function(done) {
    router.route('/:error_code', function(parameters, result) {
      assert.ok(true)
      done()
    }, { constraint: /(404|500)/, order: 1 })

    router.go('/lol')
  })

})