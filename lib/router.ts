import Route from './route'
import Scope from './scope'
import Resolver from './resolver'

class Router {

  private resolver:Resolver = new Resolver

  private defaultScope:Scope
  private currentScope:Scope
  public stack:string[] = []
  private path:string
  private position:number

  public routes:string[]

  constructor() {
    this.defaultScope = new Scope('/')
    this.currentScope = this.defaultScope

    this.path = this.defaultScope.getPath()

    this.stack.push( this.path )
    this.position = 0
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

  go(path, options?:any) {
    const route = this.defaultScope.resolve(path)

    options = Object.assign({
      push: true
    }, options || {})

    if (route && route.path !== this.path) {
      if (!route.redirect) {
        this.path = route.path
        options.push ? this.stack.push( this.path ) : void(0)
      }
      route.closure()
      return true
    }

    return false
  }

  backward() {
    this.position--
    const index = this.stack.length + this.position - 1
    if (this.stack[index]) this.go( this.stack[index], { push: false })
  }

  forward() {
    this.position++
    const index = this.stack.length + this.position - 1
    if (this.stack[index]) this.go( this.stack[index], { push: false })
  }

}

const RouterSingleton = new Router
export default RouterSingleton