class Route {

  redirect:boolean = false

  constructor(public path:string, public closure:() => void) {}

  get name() {
    return this.path.replace(/(\/|\\)/g, '')
  }

}

export default Route