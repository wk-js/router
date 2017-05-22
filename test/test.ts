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

router.scope('/:country/:locale', function() {

  router.route('/', function(parameters) {
    console.log('HOME', parameters)
  })

})

router.route('/', function() {
  console.log('home home')
})

router.go('/FR/fr')

console.log(router.getRoutes())