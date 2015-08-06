## pbf-split

**WARNING**: this module is a mistake. Use the clearly superior [length-prefixed-stream](https://github.com/mafintosh/length-prefixed-stream) instead (only discovered after writing this one).

[![Build Status](https://travis-ci.org/mapbox/pbf-split.svg)](https://travis-ci.org/mapbox/pbf-split)
[![Coverage Status](https://coveralls.io/repos/mapbox/pbf-split/badge.svg?branch=master)](https://coveralls.io/github/mapbox/pbf-split?branch=master)

A Node stream that splits a stream of multiple [Protocol Buffer](https://developers.google.com/protocol-buffers/docs/overview) messages into individual messages.

### How to use

The [recommended way](https://developers.google.com/protocol-buffers/docs/techniques#streaming) to stream protocol buffers is to encode them like this:

```
[message_length][message][message_length][message] ...
```

The pbf-split stream splits and reassembles an incoming stream so that it outputs individual message buffers which can then be decoded conveniently (e.g. using [pbf](https://github.com/mapbox/pbf)) in a streaming way.

```js
var pbfsplit = require('pbfsplit');

fs.createReadStream('data.pbf')
.pipe(pbfsplit())
.on('data', function (message) {
    // decode the message
});
```
