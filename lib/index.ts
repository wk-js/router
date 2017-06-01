import Router from './router'

Router.Extensions.order     = require('./extensions/order').default
Router.Extensions.concern   = require('./extensions/concern').default
Router.Extensions.redirect  = require('./extensions/redirect').default
Router.Extensions.reference = require('./extensions/reference').default

if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = Router
}

if (typeof window !== 'undefined') {
  (window as any).Router = Router
  if (window.history) Router.Extensions.history = require('./extensions/history').default
}