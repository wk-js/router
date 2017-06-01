import Router from '../lib/router'
import ConcernExtension from '../lib/extensions/concern'
import * as assert from 'assert'

const router = new Router

const concern = router.extension(ConcernExtension)

concern.create('common', function() {

  router.route('/contact', function() {
    // console.log('[Common] Contact')
  })

  router.route('/about', function() {
    // console.log('[Common] About')
  })

})

concern.create('errors', function() {

  router.route('/404', function() {
    // console.log('[Errors] 404')
  })

  router.route('/500', function() {
    // console.log('[Errors] 500')
  })

})

concern.create('admin', function() {

  router.scope('/admin', function() {

    router.route('/users', function() {
      // console.log('[Admin] List users')
    })

    router.route('/:anything', function() {
      // console.log('[Admin] Settings page')
    })

  })

})



describe('concern', function() {

  it('add concern - method 1', function() {
    router.route('/', function() {
      console.log('Home')
    }, { concern: [ 'common', 'errors' ] })

    const routes0 = router.getRoutes()
    assert.deepEqual(routes0, [
      '/',
      '/contact',
      '/about',
      '/404',
      '/500'
    ])
  })

  it('add concern - method 2', function() {
    concern.set('/', ['admin'])

    const routes0 = router.getRoutes()
    assert.deepEqual(routes0, [
      '/',
      '/contact',
      '/about',
      '/404',
      '/500',
      '/admin',
      '/admin/users',
      '/admin/:anything'
    ])
  })

  it('go to /contact', function () {
    const result = router.go('/contact')
    assert.equal(result.route.getPath(), '/contact')
  })

  it('go to /about', function () {
    const result = router.go('/about')
    assert.equal(result.route.getPath(), '/about')
  })

  it('go to /404', function () {
    const result = router.go('/404')
    assert.equal(result.route.getPath(), '/404')
  })

  it('go to /500', function () {
    const result = router.go('/500')
    assert.equal(result.route.getPath(), '/500')
  })

  it('go to /admin/users', function () {
    const result = router.go('/admin/users')
    assert.equal(result.route.getPath(), '/admin/users')
  })

  it('go to /admin/:anything', function () {
    const result = router.go('/admin/settings')
    assert.equal(result.route.getPath(), '/admin/:anything')
  })

})