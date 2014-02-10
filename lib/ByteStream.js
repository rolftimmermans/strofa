/* Copyright 2013-2014  Rolf W. Timmermans

   Licensed under the Apache License, Version 2.0; you may not use this file
   except in compliance with the License. See the file LICENSE for details. */

var BASESIZE = 64

var ByteStream = function(buffer) {
  this.eof = false
  this._pos = 0

  if (buffer) {
    this._buf = buffer
    this.length = this._buf.length
  } else {
    this._buf = new Buffer(BASESIZE)
    this.length = 0
  }
}

ByteStream.fromBuffer = function(buffer) {
  return new ByteStream(buffer)
}

ByteStream.fromString = function(string) {
  return new ByteStream(new Buffer(string, "utf8"))
}

ByteStream.fromBase64 = function(string) {
  string = string.replace(/-/g, "+").replace(/_/g, "/")
  return new ByteStream(new Buffer(string, "base64"))
}

ByteStream.prototype.read = function() {
  if (this.eof) return null
  if (this._pos + 1 == this.length) this.eof = true
  return this._buf[this._pos++]
}

ByteStream.prototype.write = function(byte) {
  this._ensureSize(++this.length)
  this._buf[this._pos++] = byte
}

ByteStream.prototype.toBuffer = function() {
  return this._buf.slice(0, this.length)
}

ByteStream.prototype.toString = function() {
  return this._buf.toString("utf8", 0, this.length)
}

ByteStream.prototype.toBase64 = function() {
  var string = this._buf.toString("base64", 0, this.length)
  return string.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

ByteStream.prototype._ensureSize = function(required) {
  if (required > this._buf.length) {
    var size = BASESIZE
    while (size < required) size <<= 1
    var buf = new Buffer(size)

    this._buf.copy(buf)
    this._buf = buf
  }
}

module.exports = ByteStream
