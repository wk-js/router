import Router from '../lib/router'
import Route from '../lib/route'
import * as assert from 'assert'

const router = new Router

router.scope('/user', function () {

  router.route('/', function () {
    // console.log('[User] Display users')
  })

  router.route('/create', function () {
    // console.log('[User] Create user')
  })

  router.scope('/:id', function () {

    router.route('/', function (parameters) {
      // console.log('[User] Get user with id', parameters.id)
    }, { constraint: /\d/ })

    router.route('/update', function (parameters) {
      // console.log('[User] Update user with id', parameters.id)
    })

  })

  router.route('/:anything', function () {
    // console.log('[User] No id found')
  })

})


describe('scope', function() {

  it("check routes", function () {
    const routes = router.getRoutes()
    assert.deepEqual(routes, [
      '/',
      '/user',
      '/user/create',
      '/user/:id',
      '/user/:id/update',
      '/user/:anything'
    ])
  })

  it('go to /user', function() {
    const result = router.go('/user')
    assert.equal(result.path, '/user')
  })

  it('go to /user/:id', function() {
    const result = router.go('/user/10')
    assert.equal(result.route.getPath(), '/user/:id')
  })

  it('go to /user/:id/update', function() {
    const result = router.go('/user/10/update')
    assert.equal(result.route.getPath(), '/user/:id/update')
  })

  it('go to /user/:anything', function() {
    const result = router.go('/user/not_an_id')
    assert.equal(result.route.getPath(), '/user/:anything')
  })

  it('override /user closure', function() {
    const route = router.root.find('/user') as Route

    const previousClosure = route.closure

    router.route('/user', function() {
      // console.log('[User] Display all users')
    })

    assert.notEqual(route.closure, previousClosure)
  })

})