import Path from './path'
import Node from './node'
import Route from './route'
import Stack from './stack'
import Resolver from './resolver'

class Router {

  public root:Route
  public stack:Stack
  public currentScope:Route
  public concerns = {}
  public references = {}
  public plugins = []

  constructor() {
    this.root  = new Route('/', null)
    this.stack = new Stack('/')
    this.currentScope = this.root
  }

  getRoutes() {
    return Resolver.getRoutes(this.root).map(function(route) {
      return Path.slash(route.getPath())
    })
  }

  route(path:string, closure:(parameters:any) => void, options?:any) {
    let route:Route

    if (!path || path.length === 0 || path === '/') {
      this.currentScope.closure = closure
      route = this.currentScope
    } else {
      route = this.currentScope.findOrCreate(path, closure)
    }

    if (options && options.constraint)   this.constraint(route, options.constraint)
    if (options && options.concern)      this.concern(route, options.concern)
    if (options && options.defaultValue) this.default(route, options.defaultValue)
    if (options && options.name)         this.name(route, options.name)

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

  createConcern(name:string, closure:() => void) {
    this.concerns[name] = closure
  }

  concern(pathOrRoute:string | Route, concern:string|string[]) {
    let route:Route

    if (typeof pathOrRoute === 'string') {
      route = this.currentScope.findOrCreate(pathOrRoute as string)
    } else {
      route = pathOrRoute
    }

    if (typeof concern === 'string') concern = [ concern ]

    for (let i = 0, ilen = concern.length; i < ilen; i++) {
      const closure = this.concerns[concern[i]]

      if (closure) {
        const current = this.currentScope
        this.currentScope = route
        closure()
        this.currentScope = current
      }
    }
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

  redirect(path:string, redirect_path:string, options?:any) {
    return this.route(path, () => {
      this.go(redirect_path, options)
    })
  }

  name(pathOrRoute:string | Route, name:string) {

    let route:Route

    if (typeof pathOrRoute === 'string') {
      route = this.currentScope.findOrCreate(pathOrRoute as string)
    } else {
      route = pathOrRoute
    }

    this.references[name] = route
  }

  go(path:string, options?:any) {
    options = Object.assign({}, options || {})

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
    const valid = this.stack.forward()

    const result = Resolver.resolve(this.stack.path, this)

    if (result && valid) {
      const route = result.route
      const args  = result.args
      route.closure.call(route, args)

      return true
    }

    return false
  }

  backward() {
    const valid = this.stack.backward()

    const result = Resolver.resolve(this.stack.path, this)

    if (result && valid) {
      const route = result.route
      const args  = result.args
      route.closure.call(route, args)

      return true
    }

    return false
  }

  updatePath() {
    const valid = this.stack.updatePath()

    this.plugins.forEach((plugin) => {
      if (plugin.update) plugin.update(this.stack.path)
    })

    return valid
  }

}

export default Router