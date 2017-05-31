import Router from '../lib/router'
import RedirectExtension from '../lib/extensions/redirect'

const router = new Router

const redirect = router.extension(RedirectExtension) as RedirectExtension

router.route('/', function () {
  console.log('Home')
})

router.route('/404', function(parameters) {
  console.log('404')
})

router.route('/500', function() {
  console.log('500')
})

router.route('/home', function() {

}, { redirect: { path: '/' } })

router.route('/:something', function(parameters) {
  console.log('Redirect is not working')
}, { redirect: { path: '/404' } })


router.go('/lol') // Redirect not working
router.go('/:something', { parameters: { something: 'lol' } })
router.go('/home')

// console.log(router.getRoutes())