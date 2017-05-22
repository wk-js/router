import Scope from './scope'

class Route extends Scope {

  constructor(path:string, parent:Scope, public closure:(args:any) => void) {
    super(path, parent)
  }

}

export default Route