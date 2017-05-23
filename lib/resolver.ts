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
    // Check with the root
    let result:ResolverResult = this.match(path, router.root)

    if (result) {
      return result
    } else {
      // Search in every routes
      const route = router.root.find(path) as Route
      if (route) {
        const parameters = options && options.parameters ? options.parameters : {}

        for (const key in parameters) {
          path = path.replace(':'+key, parameters[key])
        }

        return this.match(path, route)
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

}

export default Resolver