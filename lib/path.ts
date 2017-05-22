
const TRIM_REGEX = /(^\/)|(\/$)/g
const MULTIPLE_SLASH = /\/+/g

class Path {

  public slashname:string
  public basename:string

  constructor(path:string) {
    this.slashname = Path.slash(path)
    this.basename  = Path.clean(path)
  }

  get is_dynamic() {
    return !this.is_root && !!this.basename.match(/^:/)
  }

  get has_parameter() : boolean {
    return !this.is_root
  }

  get is_root() {
    return this.basename.length === 0
  }

  constraint(value:string) {
    return true
  }

  static trim(path:string) : string {
    return path.replace(TRIM_REGEX, '')
  }

  static clean(path:string) : string {
    return Path.trim(path).replace(MULTIPLE_SLASH, '/')
  }

  static slash(path:string) : string {
    return '/' + Path.clean(path)
  }

  static split(path:string) : string[] {
    return path.split('/')
  }

  static join(parts:string[]) : string {
    return parts.join('/')
  }

}

export default Path