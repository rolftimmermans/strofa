/* Copyright 2013-2014  Rolf W. Timmermans

   Licensed under the Apache License, Version 2.0; you may not use this file
   except in compliance with the License. See the file LICENSE for details. */

var ByteStream = require("./ByteStream")
var HuffTree = require("./HuffTree")
var TreeSerializer = require("./TreeSerializer")
var MkvHuffCoder = require("./MkvHuffCoder")

var START = 256

function zeroArray(length) {
  var array = new Array(length)
  for (var i = 0; i < length; i++) {
    array[i] = 0
  }
  return array
}

var MkvHuffModel = function() {
  this._freqs = []
}

MkvHuffModel.prototype.push = function(text) {
  var bytes = ByteStream.fromString(text)

  var state = START
  for (var i = 0, len = bytes.length; i < len; i++) {
    state = this._incState(state, bytes.read())
  }
}

MkvHuffModel.prototype.getCoder = function() {
  return MkvHuffCoder.fromJSON(this.toJSON())
}

MkvHuffModel.prototype.toJSON = function() {
  return this._createTrees()
}

MkvHuffModel.prototype.toBuffer = function() {
  var stream = new ByteStream

  var trees = this._createTrees()
  for (var i = 0, len = trees.length; i < len; i++) {
    TreeSerializer.dump(stream, trees[i])
  }

  return stream.toBuffer()
}

MkvHuffModel.prototype._incState = function(prev, next) {
  if (!this._freqs[prev]) {
    this._freqs[prev] = zeroArray(START)
  }

  this._freqs[prev][next]++
  return next
}

MkvHuffModel.prototype._createTrees = function() {
  var trees = []

  var freqs
  for (var chr = 0; chr <= START; chr++) {
    if (freqs = this._freqs[chr]) {
      trees[chr] = HuffTree(freqs)
    }
  }

  return trees
}

module.exports = MkvHuffModel
