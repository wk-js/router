import Router from './router'

if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = Router
}

if (typeof window !== 'undefined') {
  (window as any).Router = Router
}