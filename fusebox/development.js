'use strict'

const { FuseBox } = require('fuse-box')
const express     = require('express')
const path        = require('path')

const fuse = FuseBox.init({
  homeDir: "../lib",
  output: "../tmp/$name.js",
  tsConfig: `../tsconfig.json`,
  useCache: false,
  globals: { default: "Router" }
})

fuse.bundle('router')
    .instructions('>index.ts')
    .watch()

fuse.dev({ root: false }, (server) => {
  const dist = path.resolve('examples')
  const app  = server.httpServer.app

  app.use(express.static(dist))
  app.use(express.static(path.resolve('tmp')))

  app.get('*', function(req, res) {
    res.sendFile(path.join(dist, 'index.html'))
  })
})

fuse.run()