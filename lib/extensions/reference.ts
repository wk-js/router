import Route from '../route'
import Extension from './_extension'

class Reference extends Extension {

  public references: { [key: string]: Route } = {}
  public name:string = 'reference'

  set(pathOrRoute: string | Route, name?: string) : Route {
    const route: Route = super.set(pathOrRoute)
    this.references[name] = route
    return route
  }

  resolve(path:string, options) : Route | null {
    return this.references[path]
  }

}

export default Reference