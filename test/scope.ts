import Router from '../lib/router'

const router = new Router

router.scope('/user', function () {

  router.route('/', function () {
    console.log('[User] Display users')
  })

  router.route('/create', function () {
    console.log('[User] Create user')
  })

  router.scope('/:id', function () {

    router.route('/', function (parameters) {
      console.log('[User] Get user with id', parameters.id)
    }, { constraint: /\d/ })

    router.route('/update', function (parameters) {
      console.log('[User] Update user with id', parameters.id)
    })

  })

  router.route('/:anything', function () {
    console.log('[User] No id found')
  })

})

router.go('/user')
router.go('/user/create')
router.go('/user/10')
router.go('/user/10/update')
router.go('/user/not_an_id')

// Override
router.route('/user', function() {
  console.log('[User] Display all users')
})

router.go('/user')

// console.log(router.getRoutes())