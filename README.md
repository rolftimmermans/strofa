verz – Compress short messages
==============================

Use **verz** to compress very short messages. It encodes data by using a
statistical model to predict each byte based on the previous byte. The same
model is used during decompression.

Compression is based on Markov-Huffman coding. High probability byte sequences
can be compressed into very few bits. Models work best if they match the type
of message to be compressed. Therefore a **verz** model is domain-specific.

With **verz** it is trivial to construct compression models based on a set of
sample data that you provide. A compression model can be serialized to a binary
representation of roughly 10-30K, with an absolute upper limit of 82K.
Compression models are built-in for:
- English text
- email addresses
- domain names


Installation
------------

The **verz** comression algorithm is written in Javascript. Use it with node
NodeJS:

```
npm install verz
```

For browsers a [minified version][1] is available. It requires Javascript
`Uint8Array` typed array support, which qualifies Chrome 7+, Firefox 4+,
Internet Explorer 10+, Opera 11.6+ and Safari 5.1+.

This distributable does not ship with any of the standard compression models.
You can [download the models][2] in binary format if you need them.

[1]: https://github.com/rolftimmermans/verz/blob/master/dist/verz.min.js
[2]: https://github.com/rolftimmermans/verz/blob/master/lib/models/


Usage
-----

### English text

``` javascript
/* Compress as Buffer/Uint8Array. */
verz.english.encode("All which is not prose is verse...")
// <Buffer 41 ec 2f 68 5f fa af 6f a5 18 d3 7d 44 78 cf 98 c4>

/* Compress as URL-safe base64. */
verz.english.encodeBase64("and all which is not verse is prose.")
// 'YfgyF7Qv_Ve30jxm-ooxp8g'
```

The English compression model is created from a number of English books.

### Email addresses

``` javascript
/* Compress as Buffer/Uint8Array. */
verz.email.encode("r.w.timmermans@gmail.com")
//=> <Buffer 5e 3a f0 d9 e8 e5 da d5 40 c7 c0>

/* Compress as URL-safe base64. */
verz.email.encodeBase64("r.w.timmermans@gmail.com")
//=> 'Xjrw2ejl2tVAx8'
```

### Customized compression models

``` javascript
var model = new verz.Model

/* Provide as much sample data as possible. */
model.push("Hello world!")
// model.push("...")

/* Create a compressor based on your sample data. */
var coder = model.createCoder()

/* Compression is best when messages resemble your model. */
coder.encode("Hello")
// <Buffer ef>

coder.encode("Hi!")
// <Buffer b6 08 60>

coder.encodeBase64("Hello")
// '7w'
```

