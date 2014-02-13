/* Copyright 2013-2014  Rolf W. Timmermans

   Licensed under the Apache License, Version 2.0; you may not use this file
   except in compliance with the License. See the file LICENSE for details. */

var fs = require("fs")
var readline = require("readline")
var Model = require("../strofa").Model

Model.fromFiles = function(files, callback) {
  var model = new Model

  var complete = 0
  for (var i = 0; i < files.length; i++) {
    fs.readFile(files[i], function(err, buffer) {
      complete++
      model.push(buffer)
      if (complete == files.length) callback(err, model)
    })
  }
}

Model.fromFilesByLine = function(files, callback) {
  var model = new Model

  var n = 0
  var complete = 0
  for (var i = 0; i < files.length; i++) {
    readline.createInterface({
      input: fs.createReadStream(files[i]),
      terminal: false
    }).on("line", function(line) {
      n++
      if (n % 1000000 == 0) console.log(n)
      model.push(line)
    }).on("close", function() {
      complete++
      if (complete == files.length) callback(null, model)
    })
  }
}


var email = [
  __dirname + "/email/adobe.txt",
]

Model.fromFilesByLine(email, function(err, model) {
  fs.writeFileSync(__dirname + "/../lib/models/email.vzm", model.toBuffer())
})


var english = [
  __dirname + "/english/heart-of-darkness.txt",
  __dirname + "/english/night-and-day.txt",
  __dirname + "/english/sons-and-lovers.txt",
  __dirname + "/english/this-side-of-paradise.txt",
  __dirname + "/english/ulysses.txt",
]

Model.fromFiles(english, function(err, model) {
  fs.writeFileSync(__dirname + "/../lib/models/english.vzm", model.toBuffer())
})


var hostname = [
  __dirname + "/hostname/alexa-top-1m.txt",
  __dirname + "/hostname/common-crawl.txt",
]

Model.fromFilesByLine(hostname, function(err, model) {
  fs.writeFileSync(__dirname + "/../lib/models/hostname.vzm", model.toBuffer())
})
