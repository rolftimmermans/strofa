/* Copyright 2013-2014  Rolf W. Timmermans

   Licensed under the Apache License, Version 2.0; you may not use this file
   except in compliance with the License. See the file LICENSE for details. */

var assert = require("chai").assert

var strofa = require("../strofa")

describe("Strofa", function() {
  describe("model", function() {
    it("should create model", function() {
      var model = new strofa.Model
      model.push("abc")
      assert.equal(model.toJSON().length, 257)
    })
  })

  describe("coder", function() {
    it("should load from json", function() {
      var coder = strofa.Coder.fromJSON([[97, 98]])
      assert.equal(coder.encode("\x00ab").length, 3)
    })
  })

  var base64perc = 4 / 3

  describe("email", function() {
    var email = strofa.email

    var inputs = [
      "riojasm66@yahoo.com",
      "felicityfinancialhome@outlook.com",
      "hazanmohammed1@aol.fr",
      "cooperativesvillagegoldminers@yahoo.com",
      "paul@example.com",
      "paulx@example.com",
    ]

    describe("encode", function() {
      it("should be efficient", function() {
        for (var i = 0; i < inputs.length; i++) {
          assert.closeTo(email.encode(inputs[i]).length / inputs[i].length, 0.5, 0.15)
        }
      })

      it("should be correct", function() {
        for (var i = 0; i < inputs.length; i++) {
          assert.equal(email.decode(email.encode(inputs[i])), inputs[i])
        }
      })
    })

    describe("encodeBase64", function() {
      it("should be efficient", function() {
        for (var i = 0; i < inputs.length; i++) {
          assert.closeTo(email.encodeBase64(inputs[i]).length / inputs[i].length, 0.5 * base64perc, 0.15)
        }
      })

      it("should be correct", function() {
        for (var i = 0; i < inputs.length; i++) {
          assert.equal(email.decodeBase64(email.encodeBase64(inputs[i])), inputs[i])
        }
      })
    })
  })

  describe("english", function() {
    var english = strofa.english

    /* Examples from Smaz. */
    var inputs = [
      "This is a small string",
      "Smaz is a simple compression library",
      "Nothing is more difficult, and therefore more precious, than to be able to decide",
      "this is an example of what works very well with smaz",
      "1000 numbers 2000 will 10 20 30 compress very little",
      "Nel mezzo del cammin di nostra vita, mi ritrovai in una selva oscura",
      "L'autore di questa libreria vive in Sicilia",
    ]

    describe("encode", function() {
      it("should be efficient", function() {
        for (var i = 0; i < inputs.length; i++) {
          assert.closeTo(english.encode(inputs[i]).length / inputs[i].length, 0.5, 0.15)
        }
      })

      it("should be correct", function() {
        for (var i = 0; i < inputs.length; i++) {
          assert.equal(english.decode(english.encode(inputs[i])), inputs[i])
        }
      })
    })

    describe("encodeBase64", function() {
      it("should be efficient", function() {
        for (var i = 0; i < inputs.length; i++) {
          assert.closeTo(english.encodeBase64(inputs[i]).length / inputs[i].length, 0.5 * base64perc, 0.15)
        }
      })

      it("should be correct", function() {
        for (var i = 0; i < inputs.length; i++) {
          assert.equal(english.decodeBase64(english.encodeBase64(inputs[i])), inputs[i])
        }
      })
    })
  })

  describe("hostname", function() {
    var hostname = strofa.hostname

    var inputs = [
      "www.gmail.com",
      "news.ycombinator.com",
      "www.youtube.com",
    ]

    describe("encode", function() {
      it("should be efficient", function() {
        for (var i = 0; i < inputs.length; i++) {
          assert.closeTo(hostname.encode(inputs[i]).length / inputs[i].length, 0.4, 0.15)
        }
      })

      it("should be correct", function() {
        for (var i = 0; i < inputs.length; i++) {
          assert.equal(hostname.decode(hostname.encode(inputs[i])), inputs[i])
        }
      })
    })

    describe("encodeBase64", function() {
      it("should be efficient", function() {
        for (var i = 0; i < inputs.length; i++) {
          assert.closeTo(hostname.encodeBase64(inputs[i]).length / inputs[i].length, 0.4 * base64perc, 0.15)
        }
      })

      it("should be correct", function() {
        for (var i = 0; i < inputs.length; i++) {
          assert.equal(hostname.decodeBase64(hostname.encodeBase64(inputs[i])), inputs[i])
        }
      })
    })
  })
})
