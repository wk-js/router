import Route from './route'
import Scope from './scope'
import Router from './router'

interface ResolverResult {
  route?:Route,
  args?:any,
  path:string
}

class Resolver {

  resolve(router:Router, path:string, options?) : ResolverResult {
    const route = router.defaultScope.resolve(path)
    let result:ResolverResult = <ResolverResult>{ path: path }

    if (route && !route.has_parameters) {
      result.route = route
      return result
    }

    const routes = this.getRoutes(router.defaultScope)

    for (let i = 0, ilen = routes.length; i < ilen; i++) {
      result.args = this.match(routes[i], path)
      if (result.args) {
        result.route = routes[i]
        break
      }
    }

    return result
  }

  getRoutes(scope) {
    let routes = []

    for (let i = 0, ilen = scope.routes.length; i < ilen; i++) {
      routes.push( scope.findRoute(scope.routes[i].name) )
    }

    for (const k in scope.children) {
      routes = routes.concat(this.getRoutes(scope.children[k]))
    }

    return routes
  }

  getValues(path) {
    const tmp = path.replace(/(^\/|\/$)/g, '').split('/')
    const arr = []

    for (let i = 0; i < tmp.length; i++) {
      if (tmp[i] || tmp[i].length > 0) arr.push(tmp[i])
    }

    return arr
  }

  match(route, path) {
    const values = this.getValues(path)
    const route_params = route.getParameters()
    const scopes:Scope[] = route.getScopes().slice(1)

    const args:any = {}

    const resPath = '/' + scopes.map(function(scope, i) {
      if (route_params.indexOf(scope.name) === -1) {
        return scope.name !== values[i] ? '' : values[i]
      }

      if (scope.constraint && values[i] && !scope.constraint(values[i])) {
        return ''
      }

      return values[i] !== scope.name ? args[scope.name.slice(1)] = values[i] : ''
    }).join('/').replace(/^\/|\/$/, '')

    if (resPath === path) return args

    return null
  }

}

export default Resolver