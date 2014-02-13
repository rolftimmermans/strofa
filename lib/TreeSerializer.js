/* Copyright 2013-2014  Rolf W. Timmermans

   Licensed under the Apache License, Version 2.0; you may not use this file
   except in compliance with the License. See the file LICENSE for details. */

var BitStream = require("./BitStream")

/* Increment with backwards incompatible format changes. */
var VERSION = 2

var dumpNodes = function(stream, node) {
  if (Array.isArray(node)) {
    stream.write(1)
    dumpNodes(stream, node[0])
    dumpNodes(stream, node[1])
  } else {
    stream.write(0)
  }
}

var dumpValues = function(stream, node) {
  if (Array.isArray(node)) {
    dumpValues(stream, node[0])
    dumpValues(stream, node[1])
  } else {
    stream.write(node)
  }
}

var loadNodes = function(stream) {
  if (stream.read()) {
    return [loadNodes(stream), loadNodes(stream)]
  } else {
    return null
  }
}

var loadValues = function(stream, node) {
  if (Array.isArray(node)) {
    node[0] = loadValues(stream, node[0])
    node[1] = loadValues(stream, node[1])
  } else {
    node = stream.read()
  }
  return node
}

var dump = function(stream, tree) {
  if (!tree) {
    stream.write(0)
  } else {
    var bits = new BitStream(stream)
    dumpNodes(bits, tree)
    bits.flush()

    dumpValues(stream, tree)
  }
}

var load = function(stream) {
  var tree = loadNodes(new BitStream(stream))
  if (!tree) {
    return null
  } else {
    return loadValues(stream, tree)
  }
}

var TreeSerializer = {
  version: VERSION,
  dump: dump,
  load: load,
}

module.exports = TreeSerializer
