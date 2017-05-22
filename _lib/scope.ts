import Route from './route'
import Part from './part'
import { guid } from './utils/guid'
import { clean, split, join, slash } from './utils/path'

interface ScopeChildren {
  [key:string]: Scope
}

function NOOP() {}

class Scope extends Part {

  public routes:Route[] = []

  public children:ScopeChildren = {}

  constructor(path:string, parent?:Scope) {
    super(path, parent ? parent.uuid : undefined)
    this.routes.push( new Route('/', this, NOOP) )

    if (this.parent) {
      (this.parent as Scope).children[this.slashname] = this
    }
  }

  getPath() {
    return this.resolvePath()
  }

  getScopes() {
    return this.resolveParts()
  }

  findRoute( path:string ) : Route | null {
    for (let i = 0, ilen = this.routes.length; i < ilen; i++) {
      if (this.routes[i].slashname === path) return this.routes[i]
    }

    return null
  }

  findScope( path:string ) : Scope | null {
    return this.children[path] || null
  }

  findOrCreate(path:string, parent?:Scope) {
    let scope = this.findScope(path)

    if (scope) return scope

    return new Scope(path, parent)
  }

  findOrCreateRoute(path:string, closure:(args:any) => void) {
    let route = this.findRoute(path)

    if (route) {
      route.closure = closure
      return route
    }

    route = new Route(path, this, closure)
    this.routes.push( route )
    return route
  }

  // part:Part
  // uuid:string
  // parent_uuid:string
  // routes:Route[] = []
  // children:ScopeChildren = {}
  // static SCOPES:ScopeChildren = {}
  // constraint?:(value:string) => boolean
  // default?:string

  // constructor(path:string, parent?:Scope) {
  //   this.part = new Part(path)
  //   this.uuid = guid()

  //   if (parent) this.parent_uuid = parent.uuid

  //   Scope.SCOPES[this.uuid] = this
  // }

  // get parent() {
  //   return Scope.findByUUID(this.parent_uuid)
  // }

  // get has_parameters() {
  //   return this.getParameters().length > 0
  // }

  // getParameters() {
  //   return this.getPath().match(/:[a-z]+/gi) || []
  // }

  // getPath() : string {
  //   const scopes:Scope[] = this.getScopes()

  //   const path = join(scopes.map(function(scope) {
  //     return scope.part.basename
  //   }))

  //   return slash(path)
  // }

  // getScopes() : Scope[] {
  //   const scopes:Scope[] = [ this ]
  //   let next     = true
  //   let name:string

  //   let current:Scope = this

  //   while(next) {
  //     if (current.parent) {
  //       scopes.unshift(current.parent)
  //       current = current.parent
  //       continue
  //     }
  //     next = false
  //   }

  //   return scopes
  // }

  // findRoute(name) : Route {
  //   return null
  // }

  // resolve( path?:string ) : Scope {
  //   if (!path) return this

  //   const parts = split(path)

  //   let scope:Scope = this

  //   for (let i = 0, ilen = parts.length; i < ilen; i++) {
  //     if (scope) {
  //       scope = scope.children[slash(parts[i])]
  //     }
  //   }

  //   return scope || (this.parent && this.parent.resolve(path))
  // }

  // static findByUUID(uuid:string) : Scope {
  //   return Scope.SCOPES[uuid]
  // }

}

export default Scope