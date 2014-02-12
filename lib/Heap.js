/* Copyright 2013-2014  Rolf W. Timmermans

   Licensed under the Apache License, Version 2.0 you may not use this file
   except in compliance with the License. See the file LICENSE for details. */

var Heap = function(cmp) {
  this._cmp = cmp
  this._nodes = []
  this.size = 0
}

Heap.prototype.push = function(item) {
  var nodes = this._nodes
  var cmp = this._cmp
  var idx = this.size++

  var parentidx, parent
  while (idx > 0) {
    parentidx = (idx - 1) >> 1
    parent = nodes[parentidx]

    if (cmp(parent, item) < 0) break

    nodes[idx] = parent
    idx = parentidx
  }

  nodes[idx] = item
}

Heap.prototype.pop = function() {
  if (!this.size) return

  var nodes = this._nodes
  var cmp = this._cmp
  var idx = 0
  var item = nodes[0]

  var newitem = nodes[idx] = nodes[--this.size]
  nodes[this.size] = null

  var endidx = this.size
  var leftidx, rightidx, minidx
  while (true) {
    leftidx = (idx << 1) + 1
    rightidx = (idx << 1) + 2
    minidx = idx

    if (leftidx < endidx && cmp(nodes[leftidx], nodes[minidx]) < 0) {
      minidx = leftidx
    }

    if (rightidx < endidx && cmp(nodes[rightidx], nodes[minidx]) < 0) {
      minidx = rightidx
    }

    if (minidx == idx) break

    nodes[idx] = nodes[minidx]
    nodes[minidx] = newitem
    idx = minidx
  }

  return item
}

module.exports = Heap
