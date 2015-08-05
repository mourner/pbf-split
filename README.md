## pbf-split

A Node stream that splits a stream of multiple [Protocol Buffer](https://developers.google.com/protocol-buffers/docs/overview) messages into individual messages.

## How to use

The [recommended way](https://developers.google.com/protocol-buffers/docs/techniques#streaming) to stream protocol buffers is to encode them like this:

```
[message_length][message][message_length][message] ...
```

The pbf-split stream splits and reassembles an incoming stream so that it outputs individual message buffers which can then be decoded conveniently in a streaming way.

```js
var pbfsplit = require('pbfsplit');

fs.createReadStream('data.pbf')
.pipe(pbfsplit())
.on('data', function (message) {
    // decode the message
});
```
