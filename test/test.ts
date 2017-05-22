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
