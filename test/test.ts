import Router from '../lib/router'

const router = new Router

router.concern('errors', function() {

  router.route('/500', function() {
    console.log('Error 500')
  })

  router.route('/400', function() {
    console.log('Error 400')
  })

})

// router.scope('/:country', function() {
//   router.scope('/:locale', function() {

//     router.route('/', function() {
//       console.log('Home')
//     })

//     router.route('/:page', function(params) {
//       console.log('Show', params.page)
//     }, {
//       constraint: /contact|about/
//     })

//     router.redirect('/:anything', '/404')

//   }, { concern: 'errors' })
// })

router.route('/404', function() {
  console.log('Not found')
})


router.scope('/:country/:locale', function() {

  router.route('/', function() {
    console.log('Home')
  })

  router.route('/:page', function(params) {
    console.log('Show', params.page)
  }, {
    constraint: /contact|about/
  })

  router.redirect('/:anything', '/404')

}, { concern: { ":locale": 'errors' }, default: { ":country": "FR", ":locale": "fr" } })

// Test
router.go('/:country/:locale')
// router.go('/FR/fr/about')
// router.go('/FR/fr/contact')
// router.go('/FR/fr/lol')

// router.go('/FR/fr/500')

console.log(router.getRoutes())