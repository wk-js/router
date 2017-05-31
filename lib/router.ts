// import { EventEmitter } from 'eventemitter3'
import Path from './path'
import Node from './node'
import Route from './route'
import Stack from './stack'
import Resolver from './resolver'
import { ResolverResult } from './resolver'

class Router {

  static Extensions = {
    order: require('./extensions/order').default,
    concern: require('./extensions/concern').default,
    redirect: require('./extensions/redirect').default,
    reference: require('./extensions/reference').default
  }

  public root:Route
  public stack:Stack
  // public events:EventEmitter
  public currentScope:Route
  public concerns = {}
  public extensions = []
  public _extensions = {}

  constructor() {
    this.root   = new Route('/', null)
    this.stack  = new Stack('/')
    // this.events = new EventEmitter

    this.currentScope = this.root
  }

  getRoutes() {
    const routes = Resolver.getRoutes(this.root).map(function(route) {
      return route.getPath()
    })

    routes.unshift(this.root.getPath())

    return routes
  }

  route(path: string, closure: (parameters:any, result:any) => void, options?: any) {
    options = options || {}

    let route:Route

    if (!path || path.length === 0 || path === '/') {
      this.currentScope.closure = closure
      route = this.currentScope
    } else {
      route = this.currentScope.findOrCreate(path, closure)
    }

    if (options.constraint)   this.constraint(route, options.constraint)
    if (options.defaultValue) this.defaultValue(route, options.defaultValue)

    // Set extension parameters
    for (let i = 0, ilen = this.extensions.length; i < ilen; i++) {
      if (options[this.extensions[i].name]) this.extensions[i].set( route, options[this.extensions[i].name] )
    }

    return route
  }

  scope(path: string, closure: (parameters:any) => void) {

    const current = this.currentScope

    // Find or create scope
    const scope = this.currentScope.findOrCreate(path)

    this.currentScope = scope
    closure.call(this.currentScope)
    this.currentScope = current

    return scope
  }

  constraint(pathOrRoute: string | Route, constraint: ((value: string) => boolean) | RegExp | string) {

    let route:Route

    if (typeof pathOrRoute === 'string') {
      route = this.currentScope.findOrCreate(pathOrRoute as string)
    } else {
      route = pathOrRoute
    }

    const c = constraint
    let regex:RegExp

    if (typeof constraint != 'function') {
      if (constraint instanceof RegExp) {
        regex = c as RegExp
      } else if (typeof constraint === 'string') {
        regex = new RegExp(c as string)
      }

      constraint = function(value) {
        return !!value.match(regex)
      }
    }

    route.path.constraint = constraint as ((value: string) => boolean)
  }

  defaultValue(pathOrRoute: string | Route, defaultValue: string) {
    let route:Route

    if (typeof pathOrRoute === 'string') {
      route = this.currentScope.findOrCreate(pathOrRoute as string)
    } else {
      route = pathOrRoute
    }

    route.path.defaultValue = defaultValue
  }

  extension(extension:any) {
    // Getter
    if (typeof extension === 'string' && this._extensions[extension]) {
      return this._extensions[extension]
    }

    // Setter
    let ext = null, extension_class = null

    if (typeof extension === 'string' && Router.Extensions[extension]) {
      extension_class = Router.Extensions[extension]
    } else if (typeof extension === 'function') {
      extension_class = extension
    }

    if (extension_class) {
      ext = new extension_class( this )
      this._extensions[ext.name] = ext
      this.extensions.push( ext )
      return ext
    }

    return ext
  }

  go(path: string, options?: any): ResolverResult | null {
    options = Object.assign({}, options || {})

    const result = Resolver.resolve(path, this, options)

    if (result && ((options.replace ? this.stack.replace(result.path) : this.stack.go(result.path)) || options.force)) {
      const route = result.route
      const args  = result.args
      if (!options.ignoreClosure) route.closure.call(route, args, result)

      return result
    }

    return null
  }

  forward(): ResolverResult | null {
    if (this.stack.forward())
      return this.go(this.stack.path, { force: true })

    return null
  }

  backward(): ResolverResult | null {
    if (this.stack.backward())
      return this.go(this.stack.path, { force: true })

    return null
  }

  updatePath() {
    const valid = this.stack.updatePath()

    // this.plugins.forEach((plugin) => {
    //   if (plugin.update) plugin.update(this.stack.path)
    // })

    return valid
  }

}

export default Router