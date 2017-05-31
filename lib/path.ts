
const TRIM_REGEX = /(^\/)|(\/$)/g
const MULTIPLE_SLASH = /\/+/g

class Path {

  public slashname: string
  public basename: string
  public defaultValue: string

  public parameters: string

  constructor(path: string) {
    const split = path.split('?')

    this.slashname = Path.slash(split[0])
    this.basename = Path.clean(split[0])

    this.parameters = split[1]
  }

  get is_dynamic() {
    return !this.is_root && !!this.basename.match(/^:/)
  }

  get has_parameter(): boolean {
    return !this.is_root
  }

  get is_root() {
    return this.basename.length === 0
  }

  constraint(value: string) {
    return true
  }

  extractParameters() {
    const parameters = {}

    if (this.parameters) {
      this.parameters.split('&').forEach(function (key_value) {
        const kv = key_value.split('=')
        parameters[kv[0]] = kv[1]
      })
    }

    return parameters
  }

  static trim(path: string): string {
    return path.replace(TRIM_REGEX, '')
  }

  static clean(path: string): string {
    return Path.trim(path).replace(MULTIPLE_SLASH, '/')
  }

  static slash(path: string): string {
    return '/' + Path.clean(path)
  }

  static split(path: string): string[] {
    return path.split('/')
  }

  static join(parts: string[]): string {
    return parts.join('/')
  }

}

export default Path