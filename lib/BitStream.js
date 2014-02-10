/* Copyright 2013-2014  Rolf W. Timmermans

   Licensed under the Apache License, Version 2.0 you may not use this file
   except in compliance with the License. See the file LICENSE for details. */

var ByteStream = require("./ByteStream")

var BitStream = function(stream) {
  this.eof = false
  this._readbuf = 0x100
  this._writebuf = 0x1

  if (stream) {
    this._str = stream
    this.length = this._str.length * 8
  } else {
    this._str = new ByteStream
    this.length = 0
  }
}

BitStream.fromBuffer = function(buffer) {
  return new BitStream(ByteStream.fromBuffer(buffer))
}

BitStream.fromBase64 = function(string) {
  /* Add and subsequently remove all trailing null bytes. */
  var stream = ByteStream.fromBase64(string + Array(5 - string.length % 4).join("A"))
  while (stream._buf[stream.length - 1] == 0) stream.length -= 1
  return new BitStream(stream)
}

BitStream.prototype.read = function() {
  if ((this._readbuf & 0xff) == 0) {
    if (this._str.eof) {
      this.eof = true
      return null
    }

    this._readbuf = this._str.read() << 1

    if (!this._str.eof) this._readbuf |= 1
  }

  if (this._readbuf == 0x100) {
    this.eof = true
    return null
  }

  var bit = (this._readbuf & 0x100) ? 1 : 0
  this._readbuf <<= 1
  return bit
}

BitStream.prototype.readString = function(n) {
  /* Test me */
  // if (n > 31) {
  //   val = this.readString(n - 16) * 0x10000
  //   return val + this.readString(16)
  // }

  var bit, val = 0
  for (var i = 0; i < n; i++) {
    val <<= 1
    if (this.read() > 0) val++
    if (this.eof) return null
  }

  return val
}

BitStream.prototype.write = function(bit) {
  this.length++
  this._writebuf <<= 1

  if (bit) this._writebuf |= 1

  if (this._writebuf & 0x100) {
    this._str.write(this._writebuf & 0xff)
    this._writebuf = 0x1
  }
}

BitStream.prototype.writeString = function(n, val) {
  /* Test me */
  // if (n > 32) {
  //   var low = (val & 0xffff)
  //   var high = (val - low) / 0x10000
  //
  //   this.writeString(n - 16, high)
  //   this.writeString(16, low)
  //   return
  // }

  for (var i = n - 1; i >= 0; i--) {
    this.write((val >> i) & 0x1)
  }
}

BitStream.prototype.flush = function() {
  if (this.length % 8) {
    this._str.write(this._writebuf << (8 - this.length % 8) & 0xff)
  }
}

BitStream.prototype._finalize = function() {
  this.write(1)
  this.flush()
}

BitStream.prototype.toBuffer = function() {
  this._finalize()
  return this._str.toBuffer()
}

BitStream.prototype.toBase64 = function() {
  this._finalize()
  return this._str.toBase64().slice(0, Math.ceil(this.length / 6))
}

module.exports = BitStream
