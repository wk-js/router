import { guid } from './utils/guid'
import Path from './path'

class Node {

  public nodes:{ [key:string]: Node } = {}

  children:Node[] = []

  public path:Path
  public uuid:string
  public parent_uuid:string

  constructor(path:string, parent?:Node) {
    this.uuid = guid()
    this.path = new Path(path)

    if (parent) this.parent_uuid = parent.uuid
  }

  get is_root() {
    return !this.parent_uuid
  }

  get root() : Node | null {
    return null
  }

  get parent() : Node | null {
    return this.is_root ? null : (this.root.nodes[this.parent_uuid] ? this.root.nodes[this.parent_uuid] : this.root)
  }

  find(path:string) : Node | null {
    const parts = Path.split(Path.clean(path))
    return this.resolveParts(this, parts)
  }

  create(path:string) : Node {
    const child = new Node(path, this)
    this.addChild(child)
    return child
  }

  findOrCreate(path:string) : Node {
    let child = this.find(path)

    if (!child) {
      const parts = Path.split(Path.clean(path))

      for (let i = 0, ilen = parts.length; i < ilen; i++) {
        if (child) {
          child = child.findOrCreate(parts[i])
        } else {
          child = this.find(parts[i])
          if (!child) child = this.create(parts[i])
        }
      }
    }

    return child
  }

  addChild(child:Node) : Node {
    // Define root property
    let root = this.is_root ? this : this.root

    Object.defineProperty(child, 'root', {
      get() {
        return root
      }
    })

    root.nodes[child.uuid] = child

    this.children.push( child )

    return child
  }

  removeChild(child:Node) : Node {
    // Remove from parent
    const index = child.parent.children.indexOf(child)
    child.parent.children.splice(index, 1)

    // Remove from root
    delete child.root.nodes[child.uuid]

    Object.defineProperty(child, 'root', {
      get() {
        return null
      }
    })

    return child
  }

  resolveParts(node, parts) {
    const part = parts.shift()
    let child  = null

    child = node.path.basename === part ? node : null

    if (!child) {
      for (let i = 0, ilen = node.children.length; i < ilen; i++) {
        if (node.children[i].path.basename === part) {
          child = node.children[i]
          break
        }
      }
    }

    if (child && parts.length !== 0) return this.resolveParts(child, parts)
    return child
  }

  getPaths() : Path[] {
    const parts:Path[] = [ this.path ]
    let next     = true
    let name:string

    let current:Node = this

    while(next) {
      if (current.parent && !current.parent.is_root) {
        parts.unshift(current.parent.path)
        current = current.parent
        continue
      }
      next = false
    }

    return parts
  }

  getPath() : string {
    const paths = this.getPaths().map(function(path) {
      return path.basename
    })

    return Path.join(paths)
  }

}

export default Node