verz – Compress short messages
==============================

Use **verz** to compress very short messages. It encodes data by using a
statistical model to predict each byte based on the previous byte. The same
model is used during decompression.

Compression is based on Markov-Huffman coding. High probability byte sequences
can be compressed into very few bits. Models work best if they match the type
of message to be compressed. A compression model is domain-specific.

With **verz** it is trivial to construct compression models based on a set of
sample data that you provide. A compression model can be serialized to a binary
representation of roughly 10-30K, with an absolute upper limit of 82K.
Compression models are built-in for:
- English text
- email addresses
- host names
- URLs


Installation
------------

The **verz** comression algorithm is written in Javascript. Use it with node
Node.js:

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
verz.english.encode("All which is not prose is verse...");
// <Buffer 41 ec 2f 68 5f fa af 6f a5 18 d3 7d 44 78 cf 98 c4>

/* Compress as URL-safe base64. */
verz.english.encodeBase64("and all which is not verse is prose.");
// 'YfgyF7Qv_Ve30jxm-ooxp8g'
```

The English compression model is created from a number of English books.

### Email addresses

``` javascript
/* Compress as Buffer/Uint8Array. */
verz.email.encode("r.w.timmermans@gmail.com");
//=> <Buffer 5e 3a f0 d9 e8 e5 da d5 40 c7 c0>

/* Compress as URL-safe base64. */
verz.email.encodeBase64("r.w.timmermans@gmail.com");
//=> 'Xjrw2ejl2tVAx8'
```

### Host names


### URLs



### Customized compression models

``` javascript
var model = new verz.Model;

/* Provide as much sample data as possible. */
model.push("Hello world!");
// model.push("...")

/* Create a compressor based on your sample data. */
var coder = model.createCoder();

/* Compression is best when messages resemble your model. */
coder.encode("Hello");
// <Buffer ef>

coder.encode("Hi!");
// <Buffer b6 08 60>

coder.encodeBase64("Hello");
// '7w'
```


API
---

When used with Node.js, require the `verz` module first:

``` javascript
var verz = require("verz");
```

### Built-in compression

#### `verz.email`

Loads and returns the built-in compressor for [email
addresses](#email-addresses). Loading is synchronous, you should call this
during your app's initialization. Returns the same compressor when accessed
multiple times.

#### `verz.english`

Loads and returns the built-in compressor for [English text](#english-text).
Loading is synchronous, you should call this during your app's initialization.
Returns the same compressor when accessed multiple times.

### Model

#### `new verz.Model`

Creates and returns a new compression model.

#### `model.push(string)`

Improves the model with the given sample message `string`. You should add as
many samples as possible.

#### `model.createCoder()`

Creates and returns a new `Coder` based on the model. The coder can be used to
compress and decompress messages.

#### `model.toBuffer()`

Serializes the model into a binary format that can be used at a later stage to
instantiate a `Coder`. Returns a `Buffer`. The browser version returns a
`Uint8Array` with a few additional functions mimicking a `Buffer`.

#### `model.toJSON()`

Serializes the model into a JSON format that can be used at a later stage to
instantiate a `Coder`. When serialized to a string the JSON format is
significantly larger than the binary format, so you should almost always use
`toBuffer()` if you want to store a compression model.

### Coder

#### `verz.Coder.fromBuffer(buffer)`

Creates and returns a new `Coder` base on the serialized model stored in the
given `buffer`. Note: this requires a [compatible](#compatibility)
serialization format.

#### `verz.Coder.fromJSON(json)`

Creates and returns a new `Coder` base on the serialized model stored as JSON.
Note: this requires a [compatible](#compatibility) serialization format.

#### `coder.encode(string)`

Compresses the given string. The string is stored internally as UTF-8.
Compression happens per byte. Non-ASCII characters are encoded but generally
don't compress very well, because most context information is unavailable.
Returns a `Buffer`. The browser version returns a `Uint8Array` with a few
additional functions mimicking a `Buffer`. Use `decode()` to decompress.

#### `coder.encodeBase64(string)`

Same as `encode()`, but returns the compressed representation as an [URL-safe
base64][3] encoded string. Use `decodeBase64()` to decompress.

[3]: http://tools.ietf.org/html/rfc4648#section-5

#### `coder.decode(buffer)`

Decompresses the given buffer returned by `encode()`. Returns the original
string when used with the same coder object or with a coder object created from
the exact same model serialization. Note: this requires a
[compatible](#compatibility) compression format.

#### `coder.decodeBase64(string)`

Decompresses the given URL-safe base64 encoded string returned by
`encodeBase64()`. Returns the original string when used with the same coder
object or with a coder object created from the exact same model serialization.
Note: this requires a [compatible](#compatibility) compression format.


Compatibility
-------------

Releases of **verz** follow [semantic versioning][4]. Compression output and
compression model compatibility is treated as an API compatibility. That means:

- **Before 1.0** the compression output, serialization format and the API **may
  not be compatible** between minor versions. You should be explicit when
  adding a dependency in your `package.json` file, for example: `"verz":
  "0.2.x"`
- **Starting at 1.0** the compression output, serialization format and the API
  will be **compatible** between **minor** versions and **patch** versions.
- **Starting at 1.0** breaking changes in compression output, serialization
  format and the API will be limited to **major** versions only. You should be
  explcity when adding a dependency in your `package.json` file, for example:
  `"verz": "1.x"`

[4]: http://semver.org/


License
-------

Copyright 2013-2014 Rolf W. Timmermans.

The **verz** compression library and algorithm are licensed under the Apache
License, Version 2.0; you may not use this project except in compliance with the
License. See the file [LICENSE][5] for details.

[5]: https://github.com/rolftimmermans/verz/blob/master/LICENSE
