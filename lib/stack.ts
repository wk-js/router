import Path from './path'

class Stack {

  public index:number
  public path:string
  public stack:string[]

  constructor(path:string) {
    this.path  = Path.slash(path)
    this.stack = [ this.path ]
    this.index = this.stack.length - 1
  }

  go(path, options?:any) {
    options = options || {}

    path = Path.slash(path)

    if (path !== this.path || options.force) {
      const deleteCount = Math.max(this.stack.length - this.index - 1, 0)
      this.stack.splice(this.index+1, deleteCount, path)
      this.index = this.stack.length - 1
      this.updatePath()
      return true
    }

    return false
  }

  replace(path, options?:any) {
    this.index = Math.max(this.index-1, 0)
    this.go(path, options)
  }

  forward() {
    this.index = Math.min(this.index+1, this.stack.length-1)
    this.updatePath()
  }

  backward() {
    this.index = Math.max(this.index-1, 0)
    this.updatePath()
  }

  updatePath() {
    if (this.path === this.stack[this.index])
      return false

    this.path = this.stack[this.index]

    return true
  }

}

export default Stack