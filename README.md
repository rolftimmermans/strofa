strofa – Compress short messages
================================

Use **strofa** to compress very short messages. It encodes data by using a
statistical model to predict each byte based on the previous byte. The same
model is used during decompression.

Compression is based on Markov-Huffman coding. High probability byte sequences
can be compressed into very few bits. Models work best if they match the type
of message to be compressed. A compression model is domain-specific.

With **strofa** it is trivial to construct compression models based on a set of
sample data that you provide. A compression model can be serialized to a binary
representation of roughly 10-30K, with an absolute upper limit of 82K.
Compression models are built-in for:
- [English text](#english-text)
- [email addresses](#email-addresses)
- [host names](#host-names)
- [URLs](#urls)


Installation
------------

The **strofa** comression algorithm is written in Javascript. Use it with node
Node.js:

```
npm install strofa
```

For browsers a [minified version][1] is available. It requires Javascript
`Uint8Array` typed array support, which qualifies Chrome 7+, Firefox 4+,
Internet Explorer 10+, Opera 11.6+ and Safari 5.1+.

This distributable does not ship with any of the standard compression models.
You can [download the models][2] in binary format if you need them.

[1]: https://github.com/rolftimmermans/strofa/blob/master/dist/strofa.min.js
[2]: https://github.com/rolftimmermans/strofa/tree/master/lib/models/


Usage
-----

### English text

``` javascript
/* Compress as Buffer/Uint8Array. */
strofa.english.encode("All which is not prose is verse...");
// <Buffer 41 ec 2f 68 5f fa af 6f a5 18 d3 7d 44 78 cf 98 c4>

/* Compress as URL-safe base64. */
strofa.english.encodeBase64("and all which is not verse is prose.");
// 'YfgyF7Qv_Ve30jxm-ooxp8g'
```

The English compression model is created from a number of English books.

### Email addresses

``` javascript
/* Compress as Buffer/Uint8Array. */
strofa.email.encode("r.w.timmermans@gmail.com");
//=> <Buffer 5e 3a f0 d9 e8 e5 da d5 40 c7 c0>

/* Compress as URL-safe base64. */
strofa.email.encodeBase64("r.w.timmermans@gmail.com");
//=> 'Xjrw2ejl2tVAx8'
```

The email address compression model is based on 150 million email addresses that
were part of the [leaked Adobe accounts][4] database. Needless to say the email
addresses are not included in this repository, nor are they recoverable from
the compression model.

#### Benefits:
- Commonly used domains are compressed very efficiently: `gmail.com` uses just
  12 bits.
- Predictable patterns in the username part of an address occur. They can be
  compressed by about half.
- Email addresses do not have to be valid.

#### Caveats:
- There may be a strong bias towards Western email addresses.
- Email addresses should be lower case. Upper case characters are unexpected
  and a single one takes about 3-4 bytes to encode (although any that follow
  will use exactly 1 byte).
- No UTF-8 email addresses are included.
- The username and the domain parts follow different patterns but the
  compressor makes no distinction.

[4]: http://nakedsecurity.sophos.com/2013/11/04/anatomy-of-a-password-disaster-adobes-giant-sized-cryptographic-blunder/

### Host names


### URLs



### Customized compression models

``` javascript
var model = new strofa.Model;

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

When used with Node.js, require the `strofa` module first:

``` javascript
var strofa = require("strofa");
```

### Built-in compression

#### `strofa.email`

Loads and returns the built-in compressor for [email
addresses](#email-addresses). Loading is synchronous, you should call this
during your app's initialization. Returns the same compressor when accessed
multiple times.

#### `strofa.english`

Loads and returns the built-in compressor for [English text](#english-text).
Loading is synchronous, you should call this during your app's initialization.
Returns the same compressor when accessed multiple times.

### Model

#### `new strofa.Model`

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

#### `strofa.Coder.fromBuffer(buffer)`

Creates and returns a new `Coder` base on the serialized model stored in the
given `buffer`. This requires serialization format
[compatibility](#compatibility).

#### `strofa.Coder.fromJSON(json)`

Creates and returns a new `Coder` base on the serialized model stored as JSON.
This requires serialization format [compatibility](#compatibility).

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
the exact same model serialization. This requires compression format
[compatibility](#compatibility).

No validation is performed. That means that a single incorrect bit may
completely alter the message beyond recognition. You should add validation
checks yourself if required. Checksums are best appended to the end of the
message.

#### `coder.decodeBase64(string)`

Decompresses the given URL-safe base64 encoded string returned by
`encodeBase64()`. Returns the original string when used with the same coder
object or with a coder object created from the exact same model serialization.
This requires compression format [compatibility](#compatibility).


Compatibility
-------------

Releases of **strofa** follow [semantic versioning][5]. Compression output and
compression model compatibility is treated as an API compatibility. That means:

- **Before 1.0** the compression output, the model serialization format and the
  API **may not be compatible** between minor versions. You should be explicit
  when adding a dependency in your `package.json` file, for example: `"strofa":
  "0.2.x"`.
- **Starting at 1.0** the compression output, the model serialization format
  and the API will be **compatible** between **minor** versions and **patch**
  versions.
- **Starting at 1.0** breaking changes will be limited to **major** versions
  only. You should be explicit when adding a dependency in your `package.json`
  file, for example: `"strofa": "1.x"`.

[5]: http://semver.org/


License
-------

Copyright 2013-2014 Rolf W. Timmermans.

The **strofa** compression library and algorithm are licensed under the Apache
License, Version 2.0; you may not use this project except in compliance with the
License. See the file [LICENSE][6] for details.

[6]: https://github.com/rolftimmermans/strofa/blob/master/LICENSE
