import Route from './route'
import { guid } from './utils/guid'
import { clean, split, join, slash } from './utils/path'

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
    this.name = clean(path)
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

    const path = join(scopes.map(function(scope) {
      return scope.name
    }))

    return slash(path)
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
    const parts = split(path)
    const name  = parts.pop()
    const scope = this.resolveScope( join(parts) )

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

    const parts = split(path)

    let scope:Scope = this

    for (let i = 0, ilen = parts.length; i < ilen; i++) {
      if (scope) {
        scope = scope.children[slash(parts[i])]
      }
    }

    return scope || (this.parent && this.parent.resolveScope(path))
  }

  static findByUUID(uuid:string) : Scope {
    return Scope.SCOPES[uuid]
  }

}

export default Scope