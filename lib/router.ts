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

    if (options.validate) {
      const validate = options.validate

      if (options.validate instanceof RegExp) {
        options.validate = function(value) {
          return !!value.match(validate)
        }
      } else if (typeof options.validate === 'string') {
        options.validate = function(value) {
          return value === validate
        }
      }

      route.validate = options.validate
    }
  }

}

export default Router