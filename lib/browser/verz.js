/* Copyright 2013-2014  Rolf W. Timmermans

   Licensed under the Apache License, Version 2.0; you may not use this file
   except in compliance with the License. See the file LICENSE for details. */

this["Buffer"] = require("./buffer").Buffer

var Coder = require("../MkvHuffCoder")
var CoderPrototype = Coder.prototype

Coder["fromJSON"] = Coder.fromJSON
Coder["fromBuffer"] = Coder.fromBuffer
CoderPrototype["encode"] = CoderPrototype.encode
CoderPrototype["encodeBase64"] = CoderPrototype.encodeBase64
CoderPrototype["decode"] = CoderPrototype.decode
CoderPrototype["decodeBase64"] = CoderPrototype.decodeBase64

var Model = require("../MkvHuffModel")
var ModelPrototype = Model.prototype

ModelPrototype["push"] = ModelPrototype.push
ModelPrototype["toJSON"] = ModelPrototype.toJSON
ModelPrototype["toBuffer"] = ModelPrototype.toBuffer
ModelPrototype["getCoder"] = ModelPrototype.getCoder

this["verz"] = {
  "Coder": Coder,
  "Model": Model,
}
