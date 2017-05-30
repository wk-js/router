import Path from './path'
import Route from './route'
import Router from './router'

interface ResolverResult {
  route?:Route,
  args?:any,
  path:string
}

class Resolver {

  static resolve(path:string, router:Router, options?:any) : ResolverResult {

    let result:ResolverResult, route:Route

    // Check with root
    result = Resolver._resolveByRoute(path, router.root, options)

    // Check with extensions resolve() method
    if (!result) {
      for (let i = 0, ilen = router.extensions.length; i < ilen; i++) {
        route = router.extensions[i].resolve(path, options)
        if (route) {
          return Resolver._resolveByRoute(route.getPath(), route, options)
        }
      }
    }

    // Check with children
    if (!result) {
      route = router.root.find(path)
      if (route) result = Resolver._resolveByRoute(path, route, options)
    }

    // Check with every routes
    if (!result) {
      const routes = Resolver.getRoutes(router.root)

      for (let i = 0, ilen = routes.length; i < ilen; i++) {
        route = routes[i]
        result = Resolver._resolveByRoute(path, route, options)
        if (result) break
      }
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
      let rPath, uPath, basename, route_basename

      for (let i = 0, ilen = user_paths.length; i < ilen; i++) {
        uPath = user_paths[i]
        rPath = route_paths[i]

        basename       = uPath.basename
        route_basename = rPath.basename

        if (rPath.is_dynamic && route_basename !== basename) {
          if (rPath.constraint(basename)) {
            args[route_basename.slice(1)] = basename
            continue
          }
        } else if (!rPath.is_dynamic && rPath.has_parameter && route_basename === basename) {
          continue
        } else if (rPath.is_root && uPath.is_root) {
          continue
        }

        isValid = false
      }

      return isValid ? { args, route, path: Path.slash(path) } : null
    }

    return null
  }

  private static _resolveByRoute(path:string, route:Route, options?:any) : ResolverResult | null {
    const parameters = options && options.parameters ? options.parameters : {}
    const paths = route.getPaths()

    for (const key in parameters) {
      path = path.replace(':'+key, parameters[key])
    }

    for (let i = 0, ilen = paths.length; i < ilen; i++) {
      if (paths[i].is_dynamic && paths[i].defaultValue) {
        path = path.replace(paths[i].basename, paths[i].defaultValue)
      }
    }

    return Resolver.match(path, route)
  }
}

export default Resolver