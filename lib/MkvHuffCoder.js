/* Copyright 2013-2014  Rolf W. Timmermans

   Licensed under the Apache License, Version 2.0; you may not use this file
   except in compliance with the License. See the file LICENSE for details. */

var BitCode = require("./BitCode")
var ByteStream = require("./ByteStream")
var BitStream = require("./BitStream")
var TreeSerializer = require("./TreeSerializer")

var START = 256

var MkvHuffCoder = function(trees) {
  this._trees = trees
  this._codes = []

  this._writeCodes()
}

MkvHuffCoder.fromJSON = function(json) {
  return new MkvHuffCoder(json)
}

MkvHuffCoder.fromBuffer = function(buffer) {
  var stream = ByteStream.fromBuffer(buffer)

  var trees = []
  while (!stream.eof) {
    trees.push(TreeSerializer.load(stream))
  }

  return new MkvHuffCoder(trees)
}

MkvHuffCoder.prototype.encode = function(text) {
  return this._encode(ByteStream.fromString(text)).toBuffer()
}

MkvHuffCoder.prototype.encodeBase64 = function(text) {
  return this._encode(ByteStream.fromString(text)).toBase64()
}

MkvHuffCoder.prototype.decode = function(text) {
  return this._decode(BitStream.fromBuffer(text)).toString()
}

MkvHuffCoder.prototype.decodeBase64 = function(text) {
  return this._decode(BitStream.fromBase64(text)).toString()
}

MkvHuffCoder.prototype._writeCodes = function(node, code) {
  for (var i = 0, len = this._trees.length; i < len; i++) {
    if (this._trees[i]) {
      this._codes[i] = this._buildCodes([], this._trees[i], new BitCode)
    }
  }
}

MkvHuffCoder.prototype._buildCodes = function(table, node, code) {
  if (Array.isArray(node)) {
    this._buildCodes(table, node[0], code.left)
    this._buildCodes(table, node[1], code.right)
  } else {
    table[node] = code
  }
  return table
}

MkvHuffCoder.prototype._encode = function(bytes) {
  var bits = new BitStream

  var next, state = START
  while ((next = bytes.read()) != null) {
    if (this._codes[state]) {
      var code = this._codes[state][next]
      bits.writeString(code.len, code.val)
    } else {
      /* No statistics available, output binary value. */
      bits.writeString(8, next)
    }
    state = next
  }

  return bits
}

MkvHuffCoder.prototype._decode = function(bits) {
  var bytes = new ByteStream

  var bit, node = this._trees[START]
  while ((bit = bits.read()) != null) {
    node = node[bit]
    if (!Array.isArray(node)) {
      bytes.write(node)
      node = this._trees[node]
    }
    while (!node && (node = bits.readString(8)) != null) {
      /* No statistics available, read binary value. */
      bytes.write(node)
      node = this._trees[node]
    }
  }

  return bytes
}

module.exports = MkvHuffCoder
