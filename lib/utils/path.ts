const TRIM_REGEX = /(^\/)|(\/$)/g
const MULTIPLE_SLASH = /\/+/g

export function trim(path:string) : string {
  return path.replace(TRIM_REGEX, '')
}

export function clean(path:string) : string {
  return trim(path).replace(MULTIPLE_SLASH, '/')
}

export function slash(path:string) : string {
  return '/' + clean(path)
}

export function split(path:string) : string[] {
  return clean(path).split('/')
}

export function join(parts:string[]) : string {
  return clean(parts.join('/'))
}