import Scope from './scope'
import Part from './part'
import { guid } from './utils/guid'
import { slash, join } from './utils/path'

class Route extends Part {

  constructor(path:string, parent:Scope, public closure:(args:any) => void) {
    super(path, parent.uuid)
  }

  // part:Part
  // uuid:string
  // scope_uuid:string
  // redirect:boolean = false
  // constraint?:(value:string) => boolean
  // default?:string

  // constructor(path:string, scope:Scope, public closure:(args:any) => void) {
  //   this.part = new Part(path)
  //   this.uuid = guid()

  //   this.scope_uuid = scope.uuid
  // }

  // get scope() : Scope | null {
  //   return Scope.findByUUID(this.scope_uuid)
  // }

  // getPath() : string {
  //   let path = this.scope.getPath()
  //   return slash(join( [ path, this.part.path ] ))
  // }
  // getParameters() {
  //   return this.getPath().match(/:[a-z]+/gi) || []
  // }
}

export default Route