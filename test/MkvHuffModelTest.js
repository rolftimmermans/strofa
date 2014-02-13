/* Copyright 2013-2014  Rolf W. Timmermans

   Licensed under the Apache License, Version 2.0; you may not use this file
   except in compliance with the License. See the file LICENSE for details. */

var assert = require("chai").assert

var MkvHuffModel = require("../lib/MkvHuffModel")
var MkvHuffCoder = require("../lib/MkvHuffCoder")
var TreeSerializer = require("../lib/TreeSerializer")

describe("MkvHuffModel", function() {
  var model

  beforeEach(function() {
    model = new MkvHuffModel
  })

  describe("push", function() {
    it("should count state transition frequencies", function() {
      model.push("aaa")
      assert.equal(model._freqs[97][97], 2)
    })
  })

  describe("createCoder", function() {
    it("should return coder", function() {
      assert.instanceOf(model.createCoder(), MkvHuffCoder)
    })
  })

  describe("toJSON", function() {
    it("should return huffman prefix code trees", function() {
      model.push("aaaaaabababcacacac")
      var json = model.toJSON()
      assert.deepEqual(json[97].pop(), [98, 97])
      assert.deepEqual(json[98].shift(), 97)
      assert.deepEqual(json[98].pop().pop(), 99)
      assert.deepEqual(json[99].pop(), 97)
    })

    it("should drop tree for relatively uncommon character", function() {
      var data = ""
      for (var i = 0; i < 20; i++) {
        data += "abcdefghijklmnopqrstuvwabcdefghijklmnopqrstu"
      }
      for (var i = 0; i < 100; i++) model.push(data)

      model.push("xa")

      var json = model.toJSON()
      assert.equal(json[120], null)
    })
  })

  describe("toBuffer", function() {
    it("should write serialization format version", function() {
      assert.deepEqual(model.toBuffer().slice(0, 1), new Buffer([TreeSerializer.version]))
    })

    it("should return huffman prefix code trees", function() {
      model.push("aaaaaabababcacacac")
      var offset = 1 + 97 + 320
      assert.deepEqual(model.toBuffer().slice(offset - 2, offset), new Buffer([98, 97]))
    })
  })
})
