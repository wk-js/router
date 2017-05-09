import Router from '../lib/router'


Router.route('/foo', function() {
  console.log('foo')
})

Router.route('/bar', function() {
  console.log('bar')
})

Router.redirect('/baz', '/bar')

Router.go('/bar')
Router.go('/foo')
Router.go('/lol')