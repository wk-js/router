import Router from '../../lib/router'
import ConcernExtension from '../../lib/extensions/concern'
import RedirectExtension from '../../lib/extensions/redirect'
import ReferenceExtension from '../../lib/extensions/reference'

const router = new Router

const concern   = router.extension( ConcernExtension ) as ConcernExtension
const redirect  = router.extension( RedirectExtension ) as RedirectExtension
const reference = router.extension( ReferenceExtension ) as ReferenceExtension

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
concern.create('errors', function() {

  router.route('404', function() {
    console.log('404')
  })

  router.route('500', function() {
    console.log('500')
  })

})

concern.create('common', function() {

  router.route('contact', function(parameters) {
    console.log('Contact', parameters)
  })

  router.route('about', function(parameters) {
    console.log('About', parameters)
  })

  redirect.set('/languages', {
    path: '/:country/:locale',
    parameters: {
      country: 'GB',
      locale: 'en'
    }
  })

})

concern.set('/:country/:locale', [ 'errors', 'common' ])

// Scope with default route
router.scope('/:country/:locale', function() {

  router.route('/', function(parameters) {
    if (parameters.locale === 'en') console.log('Home', parameters)
    if (parameters.locale === 'fr') console.log('Accueil', parameters)
    if (parameters.locale === 'es') console.log('Recepción', parameters)
    if (parameters.locale === 'pl') console.log('Powitanie', parameters)
  })

})

router.route('/', function() {
  console.log('home home')
})

// Set default
router.default('/:country', 'FR')
router.default('/:country/:locale', 'fr')

// router.go('/GB/en') // /GB/en
// router.go('/:country/:locale') // By default: /FR/fr
// router.go('/:country/:locale', { parameters: { country: 'US', locale: 'en' } }) // /US/en
// router.go('/FR/fr/contact')

// Redirection
redirect.set('/redirect', { path: '/:country/:locale', parameters: { country: 'GB', locale: 'en' } })

// router.go('/lol')

// Naming routes
router.route('/:country/:locale/legals', function(parameters) {
  console.log('Legals', parameters)
}, { reference: 'mentions_legales' })

// router.go('mentions legales')
// router.backward()
// router.backward()
// router.forward()

router.go('/FR/fr')
router.go('/FR/fr/about')
router.go('mentions_legales')
router.go('/:country/:locale/languages', { parameters: { country: 'FR', locale: 'fr' } })

// router.go('/GB/en')
// router.go('/PL/pl')
// router.replace('/ES/es')

// List routes
console.log(router.getRoutes())