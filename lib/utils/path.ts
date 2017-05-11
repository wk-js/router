const TRIM_REGEX = /(^\/)|(\/$)/g

export function trim(path:string) : string {
  return path.replace(TRIM_REGEX, '')
}