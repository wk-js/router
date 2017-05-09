import Route from './route'

class Scope {

  routes:Route[] = []
  children:any   = {}

  constructor(public path:string, public parent?:Scope) {}

  get name() {
    return this.path.replace(/(\/|\\)/g, '')
  }

  get is_parameter() {
    return this.name.match(/^:/)
  }

  findRoute(name) : Route {
    for (let i = 0, ilen = this.routes.length; i < ilen; i++) {
      if (this.routes[i].name === name) return this.routes[i]
    }

    return null
  }

  /**
   * Return the route from path
   *
   * @param {String} path
   * @returns {Route}
   *
   * @memberof Scope
   */
  resolve( path:string ) : Route {
    const parts = path.replace(/^(\/|\\)/g, '').split('/')
    const name  = parts.pop()
    const scope = this.resolveScope( parts.join('/') )

    return (scope && scope.findRoute(name)) || (this.parent && this.parent.resolve(path))
  }

  /**
   * Return the scope from path
   *
   * @param {String} path
   * @returns {Scope}
   *
   * @memberof Scope
   */
  resolveScope( path?:string ) : Scope {
    if (!path) return this

    const parts = path.replace(/^(\/|\\)/g, '').split('/')

    let scope:Scope = this

    for (let i = 0, ilen = parts.length; i < ilen; i++) {
      if (scope) {
        scope = scope.children['/' + parts[i]]
      }
    }

    return scope || (this.parent && this.parent.resolveScope(path))
  }

  /**
   * Get scope path
   *
   * @returns {String}
   *
   * @memberof Scope
   */
  getPath() : string {
    const path  = [ this.name ]
    let next    = true
    let name:string

    let current:Scope = this

    while(next) {
      if (current.parent) {
        name = current.parent.name
        if (name.length > 0) path.push(name)
        current = current.parent
        continue
      }
      next = false
    }

    return '/' + path.reverse().join('/')
  }

}

export default Scope