/* Copyright 2013-2014  Rolf W. Timmermans

   Licensed under the Apache License, Version 2.0; you may not use this file
   except in compliance with the License. See the file LICENSE for details. */

var Heap = require("./Heap")

var freqCmp = function(a, b) {
  return a[0] - b[0]
}

var createFreqHeap = function(freqs) {
  var length = freqs.length
  var heap = new Heap(freqCmp)

  for (var chr = 0; chr < length; chr++) {
    /* Frequency sums of unobserved characters may never be greater than
       sums of observed characters. */
    heap.push([freqs[chr] ? freqs[chr] + length : 1, chr])
  }

  /* Replace me with Package-Merge? */
  return heap
}

var createFreqTree = function(freqs) {
  var tree = createFreqHeap(freqs)

  var first, second
  while (tree.size > 1) {
    first = tree.pop()
    second = tree.pop()

    /* Insert new subtree with frequency equal to sum of leaves. */
    tree.push([first[0] + second[0], [first, second]])
  }

  return tree.pop()
}

var removeFreqs = function(node) {
  var right = node[1]
  if (Array.isArray(right)) {
    return [
      removeFreqs(right[0]),
      removeFreqs(right[1]),
    ]
  } else {
    return right
  }
}

var HuffTree = function(freqs) {
  return removeFreqs(createFreqTree(freqs))
}

module.exports = HuffTree
