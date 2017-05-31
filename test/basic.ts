import Router from '../lib/router'

const router = new Router

router.route('/hello', function() {
  console.log('[Hello] Hello World')
})

router.route('/hello/:someone', function(parameters) {
  console.log(`[Hello] Hello ${parameters.someone} !`)
}, { defaultValue: 'John' })

router.go('/hello')
router.go('/hello/:someone')
router.go('/hello/Max')
router.go('/hello/:someone', { parameters: { someone: 'Eddy' } })

router.backward()
router.backward()
router.forward()
router.forward()

// console.log(router.getRoutes())