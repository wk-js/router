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

    // Search by name
    let result:ResolverResult, route:Route

    // Check with root
    if (!result) {
      result = Resolver._resolveByRoute(path, router.root, options)
    }

    // Check with references
    if (!result) {
      route = router.references[path]
      if (route) return Resolver._resolveByRoute(route.getPath(), route, options)
    }

    // Check with children
    if (!result) {
      route = router.root.find(path) as Route
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

    // // Check by name
    // let route:Route = router.references[path]

    // if (route) {
    //   return Resolver.match(route.getPath(), route)
    // }

    // // Check with the root
    // let result:ResolverResult = Resolver.match(path, router.root)

    // if (result) {
    //   return result
    // } else {
    //   // Search in every routes
    //   route = router.root.find(path) as Route
    //   if (route) {
    //     const parameters = options && options.parameters ? options.parameters : {}

    //     for (const key in parameters) {
    //       path = path.replace(':'+key, parameters[key])
    //     }

    //     return Resolver.match(path, route)
    //   }
    // }

    // // Search in every routes (advanced)
    // const routes = Resolver.getRoutes(router.root)

    // for (let i = 0, ilen = routes.length; i < ilen; i++) {
    //   result = Resolver.match(path, routes[i])
    //   if (result) break
    // }

    // return result
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

        if (route_basename === basename && rPath.defaultValue) {
          basename = rPath.defaultValue
        }

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

      return isValid ? { args, route, path } : null
    }

    return null
  }

  private static _resolveByRoute(path:string, route:Route, options?:any) : ResolverResult | null {
    const parameters = options && options.parameters ? options.parameters : {}

    for (const key in parameters) {
      path = path.replace(':'+key, parameters[key])
    }

    return Resolver.match(path, route)
  }
}

export default Resolver