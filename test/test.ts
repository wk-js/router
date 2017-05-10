import Router from '../lib/router'

const router = new Router

router.scope('/:country', function() {
  router.scope('/:locale', function() {

    router.route('/', function() {
      console.log('Home')
    })

    router.route('/:page', function(params) {
      console.log('Show', params.page)
    }, {
      constraint: /contact|about/
    })

    router.redirect('/:anything', '/404')

  })
})

router.route('/404', function() {
  console.log('Not found')
})

// Test
router.go('/FR/fr')
router.go('/FR/fr/about')
router.go('/FR/fr/contact')
router.go('/FR/fr/lol')