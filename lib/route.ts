import Scope from './scope'

class Route {

  redirect:boolean = false
  name:string
  scope_uuid:string

  constructor(path:string, public closure:(args:any) => void) {
    this.name  = path.replace(/(\/|\\)/g, '')
  }

  get scope() {
    return Scope.findByUUID(this.scope_uuid)
  }

  get path() {
    const scope_path = this.scope.getPath()
    if (this.name.length === 0) return this.scope.getPath()
    return this.scope.name === '' ? '/' + this.name : this.scope.getPath() + '/' + this.name
  }

  get parameters() {
    return this.path.match(/:[a-z]+/gi) || []
  }

  get has_parameters() {
    return this.parameters.length > 0
  }

}

export default Route