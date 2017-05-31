import { EventEmitter } from 'eventemitter3'
import Path from './path'
import Node from './node'
import Route from './route'
import Stack from './stack'
import Resolver from './resolver'
import Extension from './extensions/_extension'

class Router {

  public root:Route
  public stack:Stack
  public events:EventEmitter
  public currentScope:Route
  public concerns = {}
  public extensions = []

  constructor() {
    this.root   = new Route('/', null)
    this.stack  = new Stack('/')
    this.events = new EventEmitter

    this.currentScope = this.root
  }

  getRoutes() {
    return Resolver.getRoutes(this.root).map(function(route) {
      return Path.slash(route.getPath())
    })
  }

  route(path:string, closure:(parameters:any) => void, options?:any) {
    options = options || {}

    let route:Route

    if (!path || path.length === 0 || path === '/') {
      this.currentScope.closure = closure
      route = this.currentScope
    } else {
      route = this.currentScope.findOrCreate(path, closure)
    }

    if (options.constraint)   this.constraint(route, options.constraint)
    if (options.defaultValue) this.default(route, options.defaultValue)

    // Set extension parameters
    for (let i = 0, ilen = this.extensions.length; i < ilen; i++) {
      if (options[this.extensions[i].name]) this.extensions[i].set( route, options[this.extensions[i].name] )
    }

    return route
  }

  scope(path:string, closure:(parameters:any) => void) {

    const current = this.currentScope

    // Find or create scope
    const scope = this.currentScope.findOrCreate(path)

    this.currentScope = scope
    closure.call(this.currentScope)
    this.currentScope = current

    return scope
  }

  constraint(pathOrRoute:string | Route, constraint:((value:string) => boolean)|RegExp|string) {

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

    route.path.constraint = constraint as ((value:string) => boolean)
  }

  default(pathOrRoute:string | Route, defaultValue:string) {
    let route:Route

    if (typeof pathOrRoute === 'string') {
      route = this.currentScope.findOrCreate(pathOrRoute as string)
    } else {
      route = pathOrRoute
    }

    route.path.defaultValue = defaultValue
  }

  extension(ExtensionClass) : Extension {
    const extension = new ExtensionClass(this)
    this.extensions.push( extension )
    return extension
  }

  go(path:string, options?:any) {
    options = Object.assign({}, options || {})

    if (options.redirect) {
      const redirect = options.redirect
      return this.go(redirect.path, redirect.options)
    }

    const result = Resolver.resolve(path, this, options)

    if (result && (this.stack.go(result.path) || options.force)) {
      const route = result.route
      const args  = result.args
      if (!options.ignoreClosure) route.closure.call(route, args)

      return true
    }

    return false
  }

  forward() {
    if (this.stack.forward()) this.go(this.stack.path, { force: true })

    // const result = Resolver.resolve(this.stack.path, this)

    // if (result && valid) {
    //   const route = result.route
    //   const args  = result.args
    //   route.closure.call(route, args)

    //   return true
    // }

    // return false
  }

  backward() {
    if (this.stack.backward()) this.go(this.stack.path, { force: true })
    // const result = Resolver.resolve(this.stack.path, this)

    // if (result && valid) {
    //   const route = result.route
    //   const args  = result.args
    //   route.closure.call(route, args)

    //   return true
    // }

    // return false
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