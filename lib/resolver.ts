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
    // Check with the root
    let result:ResolverResult = this.match(path, router.root)

    if (result) {
      return result
    } else {
      // Search in every routes
      const route = router.root.find(path) as Route
      if (route) {
        result = { path, route }
        result.args  = {}
        return result
      }
    }

    // Search in every routes (advanced)
    const routes = Resolver.getRoutes(router.root)

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
    const user_paths = Path.split(Path.clean(path)).map(function(str) {
      return new Path(str)
    })

    const args = {}
    const route_paths = route.getPaths()
    const sameLength  = user_paths.length === route_paths.length

    let isValid = sameLength

    if (isValid) {
      for (let i = 0, ilen = user_paths.length; i < ilen; i++) {
        if (route_paths[i].is_dynamic) {
          if (route_paths[i].constraint(user_paths[i].basename)) {
            args[route_paths[i].basename.slice(1)] = user_paths[i].basename
            continue
          }
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