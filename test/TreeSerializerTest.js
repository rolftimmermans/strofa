/* Copyright 2013-2014  Rolf W. Timmermans

   Licensed under the Apache License, Version 2.0; you may not use this file
   except in compliance with the License. See the file LICENSE for details. */

var assert = require("chai").assert

var TreeSerializer = require("../lib/TreeSerializer")
var ByteStream = require("../lib/ByteStream")

describe("TreeSerializer", function() {
  describe("dump", function() {
    var stream

    beforeEach(function() {
      stream = new ByteStream
    })

    it("should dump tree to stream", function() {
      TreeSerializer.dump(stream, [1, [2, 3]])
      assert.deepEqual(stream.toBuffer(), new Buffer([0xa0, 1, 2, 3]))
    })

    it("should dump null to stream", function() {
      TreeSerializer.dump(stream, null)
      assert.deepEqual(stream.toBuffer(), new Buffer([0]))
    })
  })

  describe("load", function() {
    var stream

    beforeEach(function() {
      stream = new ByteStream(new Buffer([0xa0, 1, 2, 3]))
    })

    it("should load tree from stream", function() {
      var tree = TreeSerializer.load(stream)
      assert.deepEqual(tree, [1, [2, 3]])
    })

    it("should load null from stream", function() {
      stream = new ByteStream(new Buffer([0, 0xff]))
      assert.equal(TreeSerializer.load(stream), null)
    })
  })
})
