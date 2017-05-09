import Router from '../lib/router'

Router.route('/', function() {
  console.log('home?')
})

Router.route('/foo', function() {
  console.log('foo')
})

Router.route('/bar', function() {
  console.log('bar')
})

Router.redirect('/baz', '/bar')

Router.go('/')
Router.go('/bar')
Router.go('/foo')
Router.go('/baz')
console.log('---------------')
console.log(Router.stack)
console.log('---------------')
Router.backward()
Router.backward()
Router.backward()
Router.forward()
