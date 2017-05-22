import Node from './node'
import Route from './route'
import Resolver from './resolver'

class Router {

  public root:Route
  public currentScope:Route
  public concerns = {}

  constructor() {
    this.root = new Route('/', null)
    this.currentScope = this.root
  }

  getRoutes() {
    return Resolver.getRoutes(this.root).map(function(route) {
      return route.getPath()
    })
  }

  route(path, closure:(parameters:any) => void, options?:any) {
    let route:Route

    if (!path || path.length === 0 || path === '/') {
      this.currentScope.closure = closure
      route = this.currentScope
    } else {
      route = this.currentScope.findOrCreate(path, closure)
    }

    if (options && options.constraint) this.addConstraint(route, options.constraint)
    if (options && options.concern)    this.addConcern(route, options.concern)

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

  concern(name:string, closure:() => void) {
    this.concerns[name] = closure
  }

  addConstraint(pathOrRoute:string | Route, constraint:((value:string) => boolean)|RegExp|string) {

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

  addConcern(pathOrRoute:string | Route, concern:string|string[]) {
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

  go(path:string) {
    const result = Resolver.resolve(path, this)

    if (result) {
      const route = result.route
      const args  = result.args
      route.closure.call(route, args)
    }
  }

}

export default Router