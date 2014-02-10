/* Copyright 2013-2014  Rolf W. Timmermans

   Licensed under the Apache License, Version 2.0; you may not use this file
   except in compliance with the License. See the file LICENSE for details. */

var assert = require("chai").assert

var MkvHuffModel = require("../lib/MkvHuffModel")
var MkvHuffCoder = require("../lib/MkvHuffCoder")

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
      assert.instanceOf(model.getCoder(), MkvHuffCoder)
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
  })

  describe("toBuffer", function() {
    it("should return huffman prefix code trees", function() {
      model.push("aaaaaabababcacacac")
      var offset = 97 + 320
      assert.deepEqual(model.toBuffer().slice(offset - 2, offset), new Buffer([98, 97]))
    })
  })
})
