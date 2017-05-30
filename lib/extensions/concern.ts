import Router from '../router'
import Route from '../route'
import Extension from './_extension'

class Concern extends Extension {

  public name:string = 'concern'
  public concerns:{ [key:string]: () => void } = {}

  create(name: string, closure: () => void) {
    this.concerns[name] = closure
  }

  set(pathOrRoute: string | Route, concern?: string | string[]) : Route {
    const route: Route = super.set(pathOrRoute)

    if (typeof concern === 'string') concern = [concern]

    for (let i = 0, ilen = concern.length; i < ilen; i++) {
      const closure = this.concerns[concern[i]]

      if (closure) {
        const current = this.router.currentScope
        this.router.currentScope = route
        closure()
        this.router.currentScope = current
      }
    }

    return route
  }

}

export default Concern