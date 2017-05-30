import Route from '../route'
import Extension from './_extension'

class Redirect extends Extension {

  public name:string = 'redirect'

  set(pathOrRoute: string | Route, options?: any) {
    const route: Route = super.set(pathOrRoute)

    route.closure = () => {
      this.router.go( options.path, options.options )
    }

    return route
  }

}

export default Redirect