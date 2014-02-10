verz – Compress short messages
==============================

**verz** compresses very short messages. It encodes data by using statistical
models to predict each byte based on the previous byte. The same model is
used during decompression.

Compression is based on Markov-Huffman coding. High probability byte sequences
can be compressed into very few bits. Therefore it is best to use a model that
matches the type of message to be compressed. In that sense, a **verz** model
is domain specific.

**verz** makes it trivial to construct compression models based on a set of
sample data that you provide. A compression model can be serialized to a binary
representation of roughly 10-40K, with an absolute upper limit of 82K.
Compression models are built-in for:
- English text
- email addresses
- domain names


Installation
------------

For NodeJS:

```
npm install verz
```

A [minified distributable **verz**][1] is available for browsers. It requires
Javascript typed array (`Uint8Array`) support, which qualifies Chrome 7+,
Firefox 4+, Internet Explorer 10+, Opera 11.6+ and Safari 5.1+.

The browser package does not ship with any of the standard compression models.
You can [download the models][2] if you need them.

[1]: https://github.com/rolftimmermans/verz/blob/master/dist/verz.min.js
[2]: https://github.com/rolftimmermans/verz/blob/master/lib/models/


Usage
-----

### Compressing English text

``` javascript
var source = "There is no such thing as a long piece of work, except one that you dare not start."

verz.english.encode(source)
// <Buffer 58 6c df 55 ec 71 5a bf 3b d8 ...>

verz.english.encodeBase64(source)
// 'WGzfVexxWr872BhSBLFhzMl7f0U-y5qEOVn09FKVD1DXt9xzFaY'
```

The English compression model is created from a number of English books.

### Compressing email addresses

``` javascript
var source = "r.w.timmermans@gmail.com"

verz.email.encode(source)
//=> <Buffer 5e 3a f0 d9 e8 e5 da d5 40 c7 c0>

verz.email.encodeBase64(source)
//=> 'Xjrw2ejl2tVAx8'
```

### Custom compression models

``` javascript
var model = new verz.Model
model.push("Hello world!")

var coder = model.getCoder()

coder.encode("Hello")
// <Buffer ef>

coder.encodeBase64("Hello")
// '7w'
```

