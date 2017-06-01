import Router from './router'

Router.Extensions.order     = require('./extensions/order').default
Router.Extensions.concern   = require('./extensions/concern').default
Router.Extensions.redirect  = require('./extensions/redirect').default
Router.Extensions.reference = require('./extensions/reference').default

if (typeof window !== 'undefined') {
  if (window.history) Router.Extensions.history = require('./extensions/history').default
}

module.exports = Router
