import Router from '../lib/router'

const router = new Router

router.scope('/:country', function() {
  router.scope('/:locale', function() {

    router.route('/', function() {
      console.log('Home')
    })

    router.redirect('/404', '/404')

  })
})

router.route('/404', function() {
  console.log('Not found')
})

router.go('/FR/fr/404')