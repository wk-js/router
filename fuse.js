'use strict'

const { FuseBox, UglifyJSPlugin } = require('fuse-box')

const fuse = FuseBox.init({
  homeDir: "lib",
  output: "dist/$name.js",
  tsConfig: `tsconfig.json`,
  useCache: false
})

if (process.env.NODE_ENV === 'release') {
  fuse.bundle('main')
      .instructions('>index.ts')

  fuse.bundle('main.min.js')
      .instructions('> index.ts')
      .plugin( UglifyJSPlugin() )
} else {
  fuse.bundle('main')
      .tsConfig('tsconfig.json')
      .instructions('> index.ts')
      .watch()

  fuse.dev()
}

fuse.run()