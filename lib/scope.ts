import Route from './route'
import { guid } from './utils/guid'

class Scope {

  routes:Route[] = []
  children:any   = {}

  name:string
  uuid:string
  parent_uuid:string

  redirect:boolean = false

  constraint?:(value:string) => boolean

  static SCOPES = {}

  constructor(path:string, parent?:Scope) {
    this.name = path.replace(/(\/|\\)/g, '')
    this.uuid = guid()
    if (parent) this.parent_uuid = parent.uuid
    Scope.SCOPES[this.uuid] = this
  }

  get parent() {
    return Scope.findByUUID(this.parent_uuid)
  }

  get has_parameters() {
    return this.getParameters().length > 0
  }

  /**
   * Get scope path
   *
   * @returns {String}
   *
   * @memberof Scope
   */
  getPath() : string {
    const scopes:Scope[] = this.getScopes()

    const path = scopes.map(function(scope) {
      return scope.name
    }).join('/')

    return path.length === 0 ? '/' : path
  }

  getScopes() : Scope[] {
    const scopes:Scope[] = [ this ]
    let next     = true
    let name:string

    let current:Scope = this

    while(next) {
      if (current.parent) {
        scopes.unshift(current.parent)
        current = current.parent
        continue
      }
      next = false
    }

    return scopes
  }

  getParameters() {
    return this.getPath().match(/:[a-z]+/gi) || []
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
   * @returns {Scope}
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

  static findByUUID(uuid:string) : Scope {
    return Scope.SCOPES[uuid]
  }

}

export default Scope