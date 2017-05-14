import { slash, clean, trim } from './utils/path'

class Part {

  public basename?:string

  constructor(public path:string, public dflt:string = '') {
    this.path = slash(this.path)

    const basename = clean(this.path)
    if (basename.length > 0) this.basename = basename
  }

  get is_dynamic() {
    return this.is_parameter && !!this.basename.match(/^:/)
  }

  get is_parameter() {
    return !!this.basename
  }

  get is_root() {
    return !this.basename
  }

}

export default Part