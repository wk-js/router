'use strict'

const { FuseBox, StylusPlugin } = require('fuse-box')

const fuse = FuseBox.init({
  homeDir: "lib",
  output: "dist/$name.js"
})

fuse.bundle('main')
  .instructions('> index.ts')
  .watch()

fuse.dev()
fuse.run()