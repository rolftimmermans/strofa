/* Copyright 2013-2014  Rolf W. Timmermans

   Licensed under the Apache License, Version 2.0; you may not use this file
   except in compliance with the License. See the file LICENSE for details. */

var ByteStream = require("./ByteStream")
var HuffTree = require("./HuffTree")
var TreeSerializer = require("./TreeSerializer")
var MkvHuffCoder = require("./MkvHuffCoder")

var SYMBOLCOUNT = 256

function zeroArray(length) {
  var array = new Array(length)
  for (var i = 0; i < length; i++) {
    array[i] = 0
  }
  return array
}

var MkvHuffModel = function() {
  this._count = 0
  this._freqs = []
}

MkvHuffModel.prototype.push = function(text) {
  var bytes = ByteStream.fromString(text)

  var state = SYMBOLCOUNT
  for (var i = 0, len = bytes.length; i < len; i++) {
    state = this._incState(state, bytes.read())
  }

  this._count += bytes.length
}

MkvHuffModel.prototype.createCoder = function() {
  return MkvHuffCoder.fromJSON(this.toJSON())
}

MkvHuffModel.prototype.toJSON = function() {
  return this._createTrees()
}

MkvHuffModel.prototype.toBuffer = function() {
  var trees = this._createTrees()

  var stream = new ByteStream
  stream.write(TreeSerializer.version)

  for (var i = 0, len = trees.length; i < len; i++) {
    TreeSerializer.dump(stream, trees[i])
  }

  return stream.toBuffer()
}

MkvHuffModel.prototype._incState = function(prev, next) {
  if (!this._freqs[prev]) {
    this._freqs[prev] = zeroArray(SYMBOLCOUNT)
  }

  this._freqs[prev][next]++
  return next
}

MkvHuffModel.prototype._createTrees = function() {
  var trees = []

  /* Drop trees for extremely uncommon characters, they're unreliable. */
  var minFreq = Math.floor(Math.sqrt(this._count) / SYMBOLCOUNT)

  var freqs
  for (var chr = 0; chr <= SYMBOLCOUNT; chr++) {
    if (freqs = this._freqs[chr]) {
      var sum = 0
      for (var i = 0, len = freqs.length; i < len; i++) {
        sum += freqs[i]
      }

      if (sum > minFreq) {
        trees[chr] = HuffTree(freqs)
      }
    }
  }

  return trees
}

module.exports = MkvHuffModel
