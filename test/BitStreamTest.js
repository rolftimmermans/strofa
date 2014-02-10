/* Copyright 2013-2014  Rolf W. Timmermans

   Licensed under the Apache License, Version 2.0; you may not use this file
   except in compliance with the License. See the file LICENSE for details. */

var assert = require("chai").assert

var BitStream = require("../lib/BitStream")

describe("BitStream", function() {
  var str

  beforeEach(function() {
    str = new BitStream
  })

  describe("write", function() {
    it("should add bits to buffer", function() {
      str.write(0), str.write(1), str.write(1), str.write(0)
      str.write(0), str.write(1), str.write(1), str.write(0)
      assert.equal(str._str.toString(), "f")
    })

    it("should increment length", function() {
      str.write(1)
      str.write(1)
      str.write(1)
      assert.equal(str.length, 3)
    })

    it("should resize buffer if needed", function() {
      for (var i = 0; i < 65 * 8; i++) {
        str.write(1)
      }
      assert.equal(str._str._buf.length, 128)
    })
  })

  describe("read", function() {
    it("should read bit from existing buffer", function() {
      str = BitStream.fromBuffer(new Buffer("foo"))
      assert.deepEqual([str.read(), str.read(), str.read(), str.read(), str.read(),
        str.read(), str.read(), str.read()], [0, 1, 1, 0, 0, 1, 1, 0])
    })

    it("should read bits from new buffer", function() {
      str.write(1), str.write(0), str.write(0), str.write(0)
      str.write(0), str.write(0), str.write(0), str.write(0)
      str = BitStream.fromBuffer(str.toBuffer())
      assert.deepEqual([str.read(), str.read()], [1, 0])
    })

    it("should read bits until eof from new buffer", function() {
      str = BitStream.fromBuffer(new Buffer([0x40]))
      assert.deepEqual([str.read(), str.read()], [0, null])
    })

    it("should read bits until eof from new buffer with byte aligned end", function() {
      str = BitStream.fromBuffer(new Buffer([0x80]))
      assert.deepEqual([str.read(), str.read()], [null, null])
    })
  })

  describe("toBuffer", function() {
    it("should return finalized buffer if empty", function() {
      assert.deepEqual(str.toBuffer().slice(0, 1), new Buffer([0x80]))
    })

    it("should return finalized buffer representation", function() {
      str.write(0), str.write(1), str.write(1), str.write(0)
      str.write(0), str.write(1), str.write(1), str.write(0)
      assert.deepEqual(str.toBuffer().slice(0, 1), new Buffer("f"))
    })
  })

  describe("toBase64", function() {
    it("should return finalized string if empty", function() {
      assert.equal(str.toBase64(), "g")
    })

    it("should return finalized string representation", function() {
      str.write(0), str.write(1), str.write(1), str.write(0)
      str.write(0), str.write(1), str.write(1), str.write(0)
      str.write(0)
      assert.equal(str.toBase64(), "Zk")
    })
  })
})
