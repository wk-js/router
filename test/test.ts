import Router from '../lib/router'

const router = new Router

// Create a route
router.route('/hello', function() {
  console.log('Hello John!')
})

// Create a scope with a route
router.scope('/hello', function() {
  router.route('/world', function() {
    console.log('Hello Lord !')
  })
})

// Override route or scope
router.route('/hello/world', function() {
  console.log('Hello World')
})

// Create concern
router.createConcern('errors', function() {

  router.route('404', function() {
    console.log('404')
  })

  router.route('500', function() {
    console.log('500')
  })

})

router.createConcern('common', function() {

  router.route('contact', function(parameters) {
    console.log('Contact', parameters)
  })

  router.route('about', function(parameters) {
    console.log('About', parameters)
  })

})

router.concern('/:country/:locale', [ 'errors', 'common' ])

// Scope with default route
router.scope('/:country/:locale', function() {

  router.route('/', function(parameters) {
    if (parameters.locale === 'en') console.log('Home', parameters)
    if (parameters.locale === 'fr') console.log('Accueil', parameters)
  })

})

router.route('/', function() {
  console.log('home home')
})

// Set default
router.default('/:country', 'FR')
router.default('/:country/:locale', 'fr')

router.go('/GB/en') // /GB/en
router.go('/:country/:locale') // By default: /FR/fr
router.go('/:country/:locale', { parameters: { country: 'US', locale: 'en' } }) // /US/en
router.go('/FR/fr/contact')

// Redirection
router.redirect('/lol', '/hello')

router.go('/lol')

// Naming routes
router.route('/:country/:locale/legals', function(parameters) {
  console.log('Legals', parameters)
}, { name: "mentions legales" })

router.go('mentions legales')

// List routes
console.log(router.getRoutes())
