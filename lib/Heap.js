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
  if (this.size == 0) return

  var item = this._nodes[0]
  this._siftDown(0)

  return item
}

Heap.prototype._siftDown = function(idx) {
  var nodes = this._nodes
  var cmp = this._cmp

  nodes[idx] = nodes[--this.size]
  nodes[this.size] = null

  while (true) {
    var left = (idx << 1) + 1
    var right = (idx << 1) + 2
    var min = idx

    if (left < this.size && cmp(nodes[left], nodes[min]) < 0) {
      min = left
    }

    if (right < this.size && cmp(nodes[right], nodes[min]) < 0) {
      min = right
    }

    if (min == idx) break

    var tmp = nodes[idx]
    nodes[idx] = nodes[min]
    nodes[min] = tmp
    idx = min
  }
}

module.exports = Heap
