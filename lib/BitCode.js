/* Copyright 2013-2014  Rolf W. Timmermans

   Licensed under the Apache License, Version 2.0; you may not use this file
   except in compliance with the License. See the file LICENSE for details. */

var BitCode = function(val, len) {
  this.val = val ? val : 0
  this.len = len ? len : 0
}

BitCode.prototype = {
  get left() {
    return new BitCode(this.val << 1 | 0, this.len + 1)
  },

  get right() {
    return new BitCode(this.val << 1 | 1, this.len + 1)
  }
}

module.exports = BitCode
