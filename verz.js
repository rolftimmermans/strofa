/* Copyright 2013-2014  Rolf W. Timmermans

   Licensed under the Apache License, Version 2.0; you may not use this file
   except in compliance with the License. See the file LICENSE for details. */

var fs = require("fs")
var MkvHuffCoder = require("./lib/MkvHuffCoder")

var loadModelSync = function(model) {
  var buffer = fs.readFileSync(__dirname + "/lib/models/" + model + ".vzm")
  return MkvHuffCoder.fromBuffer(buffer)
}

var lazyLoad = function(target, name, fn) {
  Object.defineProperty(target, name, {
    configurable: true,
    get: function() {
      Object.defineProperty(this, name, {
        value: fn()
      })
      return target[name]
    }
  })
}

module.exports = {
  Coder: MkvHuffCoder
}

lazyLoad(module.exports, "Model", function() {
  return require("./lib/MkvHuffModel")
})

lazyLoad(module.exports, "domain", function() {
  return loadModelSync("domain")
})

lazyLoad(module.exports, "email", function() {
  return loadModelSync("email")
})

lazyLoad(module.exports, "english", function() {
  return loadModelSync("english")
})
