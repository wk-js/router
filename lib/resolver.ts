import Route from './route'
import Scope from './scope'
import Part from './part'
import Router from './router'
import { split, join, slash, clean } from './utils/path'

interface ResolverResult {
  route?:Route,
  args?:any,
  path:string
}

class Resolver {

  resolve(router:Router, path:string, options?) : ResolverResult {
    path = clean(path)

    const route = router.defaultScope.resolve(path)
    let result:ResolverResult = <ResolverResult>{ path: path }

    // if (route && !route.has_parameters) {
    //   result.route = route
    //   return result
    // }

    // const routes = this.getRoutes(router.defaultScope)

    // for (let i = 0, ilen = routes.length; i < ilen; i++) {
    //   result.args = this.match(routes[i], path)
    //   if (result.args) {
    //     result.route = routes[i]
    //     break
    //   }
    // }

    return result
  }

  getRoutes(scope) {
    let routes = []

    for (let i = 0, ilen = scope.routes.length; i < ilen; i++) {
      routes.push( scope.findRoute(scope.routes[i].part.basename) )
    }

    for (const k in scope.children) {
      routes = routes.concat(this.getRoutes(scope.children[k]))
    }

    return routes
  }

  getValues(path) {

    return split(path)

    // const parts = split(path)
    // const arr   = []

    // for (let i = 0; i < parts.length; i++) {
    //   if (parts[i] || parts[i].length > 0) arr.push(parts[i])
    // }

    // return arr
  }

  match(route, path) {
    const parts = this.getValues(slash(path)).map(function(v) {
      return new Part(slash(v))
    })

    console.log(parts)
    console.log('--')
    console.log(route.getScopes().map(function(s:Scope) {
      console.log(s.uuid)
      return s.part
    }))

    console.log('--------------------')


    // const values = this.getValues(path)
    // const route_params = route.getParameters()
    // const scopes:Scope[] = route.getScopes().slice(1)

    // console.log(values, route.name, route_params)


    // const args:any = {}

    // const resPath = join(scopes.map(function(scope, i) {
    //   if (((!values[i]) || (values[i] && values[i].match(/^:/))) && scope.default) {
    //     values[i] = scope.default
    //   }

    //   if (route_params.indexOf(scope.part.basename) === -1) {
    //     return scope.part.basename !== values[i] ? scope.part.basename : values[i]
    //   }

    //   if (scope.constraint && values[i] && !scope.constraint(values[i])) {
    //     return scope.part.basename
    //   }

    //   return values[i] !== scope.part.basename ? args[scope.part.basename.slice(1)] = values[i] : scope.part.basename
    // }))

    // // console.log(resPath, path)

    // if (slash(resPath) === path) return args

    // return null
  }

}

export default Resolver