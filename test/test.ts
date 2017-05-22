import Router from '../lib/router'

const router = new Router

router.scope('/hello', function() {
  router.route('/world', function() {
    console.log('Hello World !')
  })
})

router.go('/hello')

router.route('/hello', function() {
  console.log('Hello John!')
})

router.go('/hello')

// router.scope('/:country', function() {
//   router.route('/:locale', function(parameters) {
//   })
// })

router.route('/:country/:locale', function(parameters) {
  console.log('HOME', parameters)
})

router.go('/FR/fr')

console.log(router.getRoutes())