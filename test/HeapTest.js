/* Copyright 2013-2014  Rolf W. Timmermans

   Licensed under the Apache License, Version 2.0; you may not use this file
   except in compliance with the License. See the file LICENSE for details. */

var assert = require("chai").assert

var Heap = require("../lib/Heap")

describe("Heap", function() {
  var cmp, heap

  beforeEach(function() {
    randomize = function(a, b) { return Math.random() - 0.5 }
    cmp = function(a, b) { return a - b }
    heap = new Heap(cmp)
  })

  describe("push", function() {
    it("should update size", function() {
      heap.push(1), heap.push(2), heap.push(3)
      assert.equal(heap.size, 3)
    })

    it("should prepend item if smaller", function() {
      heap.push(3), heap.push(2), heap.push(1)
      assert.equal(heap._nodes[0], 1)
    })

    it("should insert item if larger", function() {
      heap.push(1), heap.push(2), heap.push(3)
      assert.equal(heap._nodes[0], 1)
    })
  })

  describe("pop", function() {
    it("should move smallest item to front", function() {
      heap.push(3), heap.push(2), heap.push(1)
      heap.pop()
      assert.equal(heap._nodes[0], 2)
    })

    it("should return smallest item", function() {
      var i, n = 50
      for (i = 0; i < n; i++) {
        var num = Math.random() * 100
        heap.push(num)
      }

      var arr = []
      for (i = 0; i < n; i++) {
        arr.push(heap.pop())
      }

      assert.deepEqual(arr, arr.slice().sort(randomize).sort(cmp))
    })
  })
})
