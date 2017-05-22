import { guid } from './utils/guid'
import { slash, clean, trim, join } from './utils/path'

class Part {

  public uuid:string
  public slashname:string
  public basename?:string
  public constraint?:(value:string) => boolean
  public default?:string

  static PARTS = {}

  constructor(path:string, public parent_uuid?:string) {
    this.slashname = slash(path)

    const basename = clean(this.slashname)
    this.basename = basename.length > 0 ? basename : ''

    this.uuid = guid()
    Part.PARTS[this.uuid] = this
  }

  get is_dynamic() : boolean {
    return this.is_parameter && !!this.basename.match(/^:/)
  }

  get is_parameter() : boolean {
    return !!this.basename
  }

  get is_root() : boolean {
    return !this.basename
  }

  get parent() : Part | undefined {
    return Part.find(this.parent_uuid)
  }

  resolvePath() {
    const parts:Part[] = this.resolveParts()

    const path = join(parts.map(function(part) {
      return part.basename
    }))

    return slash(path)
  }

  resolveParts() : Part[] {
    const parts:Part[] = [ this ]
    let next     = true
    let name:string

    let current:Part = this

    while(next) {
      if (current.parent) {
        parts.unshift(current.parent)
        current = current.parent
        continue
      }
      next = false
    }

    return parts
  }

  resolveParameters() : string[] {
    return this.resolvePath().match(/:[a-z]+/gi) || []
  }

  static find(uuid) : Part | undefined {
    return Part.PARTS[uuid]
  }

}

export default Part