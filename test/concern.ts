import Router from '../lib/router'
import ConcernExtension from '../lib/extensions/concern'

const router = new Router

const concern = router.extension(ConcernExtension) as ConcernExtension

concern.create('common', function() {

  router.route('/contact', function() {
    console.log('[Common] Contact')
  })

  router.route('/about', function() {
    console.log('[Common] About')
  })

})

concern.create('errors', function() {

  router.route('/404', function() {
    console.log('[Errors] 404')
  })

  router.route('/500', function() {
    console.log('[Errors] 500')
  })

})

concern.create('admin', function() {

  router.scope('/admin', function() {

    router.route('/users', function() {
      console.log('[Admin] List users')
    })

    router.route('/settings', function() {
      console.log('[Admin] Settings page')
    })

  })

})

router.route('/', function() {
  console.log('Home')
}, { concern: [ 'common', 'errors' ] })

concern.set('/', [ 'admin' ])

router.go('/contact')
router.go('/about')
router.go('/404')
router.go('/500')
router.go('/admin/users')
router.go('/admin/settings')

console.log(router.getRoutes())