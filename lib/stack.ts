import Path from './path'

class Stack {

  public index:number
  public path:string
  public paths:string[]

  constructor(path:string) {
    this.path  = Path.slash(path)
    this.paths = [ this.path ]
    this.index = this.paths.length - 1
  }

  go(path) : boolean {
    path = Path.slash(path)

    if (path !== this.path) {
      const deleteCount = Math.max(this.paths.length - this.index - 1, 0)
      this.paths.splice(this.index+1, deleteCount, path)
      this.index = this.paths.length - 1
      this.updatePath()
      return true
    }

    return false
  }

  replace(path) : boolean {
    this.index = Math.max(this.index-1, 0)
    return this.go(path)
  }

  forward() : boolean {
    this.index = Math.min(this.index+1, this.paths.length-1)
    return this.updatePath()
  }

  backward() : boolean {
    this.index = Math.max(this.index-1, 0)
    return this.updatePath()
  }

  updatePath() : boolean {
    if (this.path === this.paths[this.index])
      return false

    this.path = this.paths[this.index]

    return true
  }

}

export default Stack