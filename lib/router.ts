import Route from './route'
import Scope from './scope'
import Resolver from './resolver'

class Router {

  private resolver:Resolver = new Resolver

  defaultScope:Scope
  currentScope:Scope
  stack:string[] = []
  path:string
  position:number

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
    route.scope_uuid = this.currentScope.uuid
    this.currentScope.routes.push( route )
  }

  redirect(path, route_path) {
    const route = new Route(path, () => {
      console.log('Redirect to', route_path)
      this.go(route_path)
    })
    route.scope_uuid = this.currentScope.uuid
    route.redirect = true
    this.currentScope.routes.push( route )
  }

  go(path, options?:any) {
    const result = this.resolver.resolve(this, path, options)

    const route:Route = result.route
    const args:any    = result.args

    if (route && route.path !== this.path) {
      if (!route.redirect) this.path = route.path
      route.closure(args)
      return true
    }

    return false

    // const route = this.defaultScope.resolve(path)

    // options = Object.assign({
    //   // push: true
    // }, options || {})

    // if (route && route.path !== this.path) {
    //   if (!route.redirect) {
    //     this.path = route.path
    //     // options.push ? this.stack.push( this.path ) : void(0)
    //   }
    //   route.closure()
    //   return true
    // }

    // return false
  }

  // backward() {
  //   this.position--
  //   const index = this.stack.length + this.position - 1
  //   if (this.stack[index]) this.go( this.stack[index], { push: false })
  // }

  // forward() {
  //   this.position++
  //   const index = this.stack.length + this.position - 1
  //   if (this.stack[index]) this.go( this.stack[index], { push: false })
  // }

}

export default Router