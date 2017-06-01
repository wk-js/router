import Router from '../lib/router'
import ReferenceExtension from '../lib/extensions/reference'
import * as assert from 'assert'

const router = new Router
router.extension(ReferenceExtension)

router.route('/', function () {
  // console.log('Home')
}, { reference: 'home' })

router.route('/404', function() {
  // console.log('Not found')
}, { reference: 'not_found' })

describe('reference', function() {

  it('check routes', function() {
    const routes = router.getRoutes()
    assert.deepEqual(routes, [ '/', '/404' ])
  })

  it('go to /404', function() {
    const result = router.go('not_found')
    assert.equal(result.route.getPath(), '/404')
  })

  it('go to /', function() {
    const result = router.go('home')
    assert.equal(result.route.getPath(), '/')
  })

})