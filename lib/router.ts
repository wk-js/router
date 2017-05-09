import Route from './route'
import Scope from './scope'
import Resolver from './resolver'

class Router {

  private resolver:Resolver = new Resolver

  public routes:string[]

  defaultScope:Scope
  currentScope:Scope
  path:string

  constructor() {
    this.defaultScope = new Scope('/')
    this.currentScope = this.defaultScope

    this.path = this.defaultScope.getPath()
  }

  create() {
    return new Router
  }

  scope(path, closure) : Scope {
    const current = this.currentScope

    // Find or create a scope
    let scope:Scope = current.children[path]
    if (!scope) scope = new Scope(path, current)
    current.children[path] = scope

    this.currentScope = scope
    closure.call(scope)
    this.currentScope = current

    return scope
  }

  route(path, closure) {
    const route = new Route(path, closure)
    this.currentScope.routes.push( route )
  }

  redirect(path, route_path) {
    const route = new Route(path, () => {
      console.log('Redirect to', route_path)
      this.go(route_path)
    })
    route.redirect = true
    this.currentScope.routes.push( route )
  }

  go(path) {
    const route = this.defaultScope.resolve(path)

    if (route && route.path !== this.path) {
      if (!route.redirect) this.path = route.path
      route.closure()
      return true
    }

    return false
  }

}

const RouterSingleton = new Router
export default RouterSingleton