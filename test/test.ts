import Router from '../lib/router'

const router = new Router

router.scope('/hello', function() {
  router.route('/world', function() {
    console.log('Hello World !')
  })
})

// router.go('/hello')

router.route('/hello', function() {
  console.log('Hello John!')
})

// router.go('/hello')

router.concern('errors', function() {

  router.route('404', function() {
    console.log('404')
  })

  router.route('500', function() {
    console.log('500')
  })

})

router.concern('classic', function() {

  router.route('contact', function() {
    console.log('contact')
  })

  router.route('about', function() {
    console.log('about')
  })

})

router.addConcern('/:country', [ 'errors' ])
router.scope('/:country/:locale', function() {

  router.route('/', function(parameters) {
    console.log('HOME', parameters)
  })

})

router.route('/', function() {
  console.log('home home')
})


router.go('/FR/fr')
// router.go('/:country/:locale', { country: 'FR', locale: 'fr' })

console.log(router.getRoutes())
