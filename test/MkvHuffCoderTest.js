/* Copyright 2013-2014  Rolf W. Timmermans

   Licensed under the Apache License, Version 2.0; you may not use this file
   except in compliance with the License. See the file LICENSE for details. */

var assert = require("chai").assert
var crypto = require("crypto")

var MkvHuffModel = require("../lib/MkvHuffModel")
var MkvHuffCoder = require("../lib/MkvHuffCoder")
var HuffTree = require("../lib/HuffTree")
var TreeSerializer = require("../lib/TreeSerializer")

describe("MkvHuffCoder", function() {
  var coder

  before(function() {
    var model = new MkvHuffModel
    model.push("abcdefg")

    coder = model.createCoder()
  })

  describe("fromBuffer", function() {
    it("should succeed with current serialization format", function() {
      var buffer = new Buffer([2])
      coder = MkvHuffCoder.fromBuffer(buffer)
      assert.equal(coder.encode("foo").slice(0, 3), "foo")
    })

    it("should succeed with outdated serialization format", function() {
      var buffer = new Buffer([1])
      assert.throws(function() {
        coder = MkvHuffCoder.fromBuffer(buffer)
      }, "Incompatible encoding model format")
    })
  })

  describe("encoding", function() {
    it("should compress as buffer", function() {
      assert.equal(coder.encode("abc").constructor, Buffer)
    })

    it("should encode verbatim with untrained model", function() {
      var coder = new MkvHuffModel().createCoder()
      assert.equal(coder.encode("xyz123").slice(0, 6), "xyz123")
    })

    it("should encode to original length with evenly distributed model", function() {
      var freqs = new Array(256)
      for (var i = 0; i < 256; i++) freqs[i] = 1
      var tree = HuffTree(freqs)

      /* Reuse artificially constructed balanced Huffman tree. */
      var trees = new Array(256)
      for (var i = 0; i < 256; i++) trees[i] = tree

      var coder = new MkvHuffCoder(trees)
      /* Adjusted for trailing EOF marker. */
      assert.equal(coder.encode("abcdefghijklm").length - 1, "abcdefghijklm".length)
    })

    it("should round trip", function() {
      assert.equal(coder.decode(coder.encode("abc")), "abc")
    })

    it("should round trip string with null bytes", function() {
      assert.equal(coder.decode(coder.encode("\x00\x00abc")), "\x00\x00abc")
    })

    it("should round trip random strings", function() {
      for (var l = 0; l < 21; l++) {
        var random = ""
        for (var i = 0; i < l; i++) {
          random += String.fromCharCode(Math.random() * (1 << 16))
        }
        assert.equal(coder.decode(coder.encode(random)), random)
      }
    })

    it("should decode random data", function() {
      assert.closeTo(coder.decode(crypto.randomBytes(21)).length, 22, 5)
    })

    it("should decode empty string", function() {
      assert.equal(coder.decode(""), "")
    })
  })

  describe("encoding as base64", function() {
    it("should compress as base64 string", function() {
      assert.equal(coder.encodeBase64("abc").constructor, String)
    })

    it("should round trip", function() {
      assert.equal(coder.decodeBase64(coder.encodeBase64("abc")), "abc")
    })

    it("should round trip string with null bytes", function() {
      assert.equal(coder.decodeBase64(coder.encodeBase64("\x00\x00abc")), "\x00\x00abc")
    })

    it("should round trip random strings", function() {
      for (var l = 0; l < 21; l++) {
        var random = ""
        for (var i = 0; i < l; i++) {
          random += String.fromCharCode(Math.random() * (1 << 16))
        }
        assert.equal(coder.decodeBase64(coder.encodeBase64(random)), random)
      }
    })

    it("should decode empty string", function() {
      assert.equal(coder.decodeBase64(""), "")
    })
  })
})
