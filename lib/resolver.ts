import Path from './path'
import Route from './route'
import Router from './router'

interface ResolverResult {
  route?:Route,
  args?:any,
  path:string
}

class Resolver {

  static resolve(path:string, router:Router) : ResolverResult {
    const route = router.root.find(path) as Route

    let result:ResolverResult = { path: path } as ResolverResult

    if (route) {
      result.route = route
      result.args  = {}
      return result
    }

    // TODO: See dynamic property part
    const routes = Resolver.getRoutes(router.root)
    result = null

    for (let i = 0, ilen = routes.length; i < ilen; i++) {
      result = Resolver.match(path, routes[i])
      if (result) break
    }

    return result
  }

  static getRoutes(root:Route) {
    return Object.keys(root.nodes).map(function(key) {
      return root.nodes[key]
    })
  }

  static match(path:string, route:Route) : ResolverResult {
    const user_paths = Path.split(Path.slash(path)).map(function(str) {
      return new Path(str)
    })

    const args = {}
    const route_paths = route.getPaths()
    const sameLength  = user_paths.length === route_paths.length

    let isValid = sameLength

    if (isValid) {
      for (let i = 0, ilen = user_paths.length; i < ilen; i++) {
        if (route_paths[i].is_dynamic) {
          args[route_paths[i].basename.slice(1)] = user_paths[i].basename
          continue
        } else if (route_paths[i].has_parameter && route_paths[i].basename === user_paths[i].basename) {
          continue
        } else if (route_paths[i].is_root && user_paths[i].is_root) {
          continue
        }

        isValid = false
      }

      return isValid ? { args, route, path } : null
    }

    return null
  }

}

export default Resolver