import Router from '../lib/router'
import ReferenceExtension from '../lib/extensions/reference'

const router = new Router

const Reference = router.extension(ReferenceExtension) as ReferenceExtension

router.route('/', function () {
  console.log('Home')
}, { reference: 'home' })

router.route('/404', function() {
  console.log('Not found')
}, { reference: 'not_found' })

router.go('not_found')
router.go('home')

// console.log(router.getRoutes())