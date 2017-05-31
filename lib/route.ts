import Node from './node'

function NOOP() { console.log('NOOP') }

class Route extends Node {

  constructor(path, parent:Node, public closure?:(parameters:any, result:any) => void) {
    super(path, parent)
    if (!this.closure) this.closure = NOOP
  }

  create(path:string, closure?:(parameters:any, result:any) => void) : Route {
    const child = new Route(path, this, closure)
    this.addChild(child)
    return child
  }

  findOrCreate(path:string, closure?:(parameters:any, result:any) => void) : Route {
    const route = super.findOrCreate(path) as Route
    if (closure) route.closure = closure
    return route
  }

}

export default Route