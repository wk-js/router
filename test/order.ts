import Router from '../lib/router'
import * as assert from 'assert'

const router = new Router
const order  = router.extension('order')

router.route('/route0', function() {}, { order: 0 })
router.route('/route1', function() {}, { order: 1 })
router.route('/route2', function() {}, { order: 2 })

describe('order', function () {

  it('order', function () {
    const routes = router.getRoutes()
    assert.deepEqual(routes, [ '/', '/route2', '/route1', '/route0' ])
  })

  it('reorder 1', function () {
    order.set('/route0', 10)
    const routes = router.getRoutes()
    assert.deepEqual(routes, [ '/', '/route0', '/route2', '/route1' ])
  })

  it('reorder 2', function () {
    order.set('/route0', 0)
    const routes = router.getRoutes()
    assert.deepEqual(routes, [ '/', '/route2', '/route1', '/route0' ])
  })

})