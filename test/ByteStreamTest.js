/* Copyright 2013-2014  Rolf W. Timmermans

   Licensed under the Apache License, Version 2.0; you may not use this file
   except in compliance with the License. See the file LICENSE for details. */

var assert = require("chai").assert

var ByteStream = require("../lib/ByteStream")

describe("ByteStream", function() {
  var str

  beforeEach(function() {
    str = new ByteStream
  })

  describe("write", function() {
    it("should add byte to buffer", function() {
      str.write(126)
      assert.equal(str._buf.slice(0, 1).toString(), "~")
    })

    it("should increment length", function() {
      str.write(126)
      str.write(127)
      str.write(128)
      assert.equal(str.length, 3)
    })

    it("should resize buffer if needed", function() {
      for (var i = 0; i < 65; i++) {
        str.write(126)
      }
      assert.equal(str._buf.length, 128)
    })

    it("should resize existing buffer rounded to power of two", function() {
      str = ByteStream.fromString("foo")
      for (var i = 0; i < 65; i++) {
        str.write(126)
      }
      assert.equal(str._buf.length, 128)
    })
  })

  describe("read", function() {
    it("should read byte from existing buffer", function() {
      str = ByteStream.fromString("foo")
      assert.equal(str.read(), 102)
    })

    it("should read byte from new buffer", function() {
      str.write(126)
      str = ByteStream.fromBuffer(str.toBuffer())
      assert.equal(str.read(), 126)
    })

    it("should read subsequent bytes from buffer", function() {
      str.write(126)
      str.write(128)
      str = ByteStream.fromBuffer(str.toBuffer())
      str.read()
      assert.equal(str.read(), 128)
    })

    it("should set eof before buffer ends", function() {
      str.write(126)
      str = ByteStream.fromBuffer(str.toBuffer())
      str.read()
      assert.equal(str.eof, true)
    })

    it("should return eof if buffer ended", function() {
      str.write(126)
      str = ByteStream.fromBuffer(str.toBuffer())
      str.read()
      assert.equal(str.read(), null)
    })
  })

  describe("toString", function() {
    it("should return empty string if empty", function() {
      assert.equal(str.toString(), "")
    })

    it("should return string representation", function() {
      str.write(97)
      str.write(98)
      str = ByteStream.fromBuffer(str.toBuffer())
      assert.equal(str.toString(), "ab")
    })
  })
})
