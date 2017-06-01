'use strict'

const { FuseBox, UglifyJSPlugin } = require('fuse-box')

const fuse = FuseBox.init({
  homeDir: "../lib",
  output: "../build/$name.js",
  tsConfig: `../tsconfig.json`,
  useCache: false,
  globals: { default: "Router" }
})

fuse.bundle('router')
    .instructions('>index.ts')

fuse.bundle('router.min.js')
    .instructions('> index.ts')
    .plugin( UglifyJSPlugin() )

fuse.run()