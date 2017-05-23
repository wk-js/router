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

router.createConcern('errors', function() {

  router.route('404', function() {
    console.log('404')
  })

  router.route('500', function() {
    console.log('500')
  })

})

router.createConcern('classic', function() {

  router.route('contact', function() {
    console.log('contact')
  })

  router.route('about', function() {
    console.log('about')
  })

})

router.concern('/:country', [ 'errors' ])
router.scope('/:country/:locale', function() {

  router.route('/', function(parameters) {
    console.log('HOME', parameters)
  })

})

router.route('/', function() {
  console.log('home home')
})

router.default('/:country', 'FR')
router.default('/:country/:locale', 'fr')

router.go('/GB/en') // /GB/en
router.go('/:country/:locale') // By default: /FR/fr
router.go('/:country/:locale', { parameters: { country: 'US', locale: 'en' } }) // /US/en

console.log(router.getRoutes())
