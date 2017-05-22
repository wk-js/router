import Node from './node'

function NOOP() { console.log(`[Route: "${this.path.slashname}"]`, 'NOOP') }

class Route extends Node {

  constructor(path, parent:Node, public closure?:() => void) {
    super(path, parent)
    if (!this.closure) this.closure = NOOP
  }

  create(path:string, parent?:Node, closure?:() => void) : Route {
    const child = new Route(path, this, closure)
    this.addChild(child)
    return child
  }

  findOrCreate(path:string, parent?:Node, closure?:() => void) : Route {
    const route = super.findOrCreate(path) as Route
    if (parent)  route.parent_uuid = parent.uuid
    if (closure) route.closure     = closure
    return route
  }

}

export default Route