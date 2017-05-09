import Router from './router'

class Resolver {

  resolve(router:Router, path:string, options?) {
    const route = router.defaultScope.resolve(path)
    let result  = { route: null, args: null }

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
    const params = this.getValues(route.getPath())
    const route_params = route.parameters

    const args:any = {}

    const resPath = '/' + params.map(function(p, i) {
      if (route_params.indexOf(p) === -1) {
        return p !== values[i] ? '' : values[i]
      }

      return values[i] !== p ? args[p.slice(1)] = values[i] : ''
    }).join('/')

    if (resPath === path) return args

    return null
  }

}

export default Resolver