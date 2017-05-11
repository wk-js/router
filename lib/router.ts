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

  concerns:any

  constructor() {
    this.defaultScope = new Scope('/')
    this.currentScope = this.defaultScope

    this.concerns = {}

    this.path = this.defaultScope.getPath()

    this.stack.push( this.path )
    this.position = 0
  }

  getRoutes() : string[] {
    return this.resolver.getRoutes(this.defaultScope).map(function(route) {
      return route.getPath()
    })
  }

  create() {
    return new Router
  }

  scope(path:string, closure:(scope:Scope) => void, options?:any) : Scope {
    const current = this.currentScope

    // Find or create a scope
    let scope:Scope = current.children[path]
    if (!scope) scope = new Scope(path, current)
    current.children[path] = scope
    this._parseOptions( scope, options )

    this.currentScope = scope
    closure.call(scope)
    this.currentScope = current

    return scope
  }

  route(path, closure:(args:any) => void, options?:any) {
    const route = new Route(path, this.currentScope, closure)
    this._parseOptions( route, options )
    this.currentScope.routes.push( route )
  }

  redirect(path, route_path) {
    const route = new Route(path, this.currentScope, () => {
      console.log('Redirect to', route_path)
      this.go(route_path)
    })
    route.redirect = true
    this.currentScope.routes.push( route )
  }

  concern(name: string, closure:() => void) {
    this.concerns[name] = closure
  }

  go(path, options?:any) {
    const result = this.resolver.resolve(this, path, options)

    const route:Route = result.route
    const args:any    = result.args

    if (route && result.path !== this.path) {
      if (!route.redirect) this.path = result.path
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

  private _parseOptions( route:Scope|Route, options:any ) {
    options = options || {}

    // Constraint
    if (options.constraint) {
      const constraint = options.constraint

      if (options.constraint instanceof RegExp) {
        options.constraint = function(value) {
          return !!value.match(constraint)
        }
      } else if (typeof options.constraint === 'string') {
        options.constraint = function(value) {
          return value === constraint
        }
      }

      route.constraint = options.constraint
    }

    // Concern
    if (options.concern && this.concerns[options.concern] && route instanceof Scope) {
      const current = this.currentScope
      const scope:Scope = <Scope>route

      this.currentScope = scope
      this.concerns[options.concern].call(scope)
      this.currentScope = current
    }

  }

}

export default Router