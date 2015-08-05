'use strict';

var Transform = require('stream').Transform,
    inherits = require('util').inherits,
    readVarint = require('varint').decode;

module.exports = pbfsplit;


function pbfsplit(options) {
    return new PBFSplit(options);
}

function PBFSplit(options) {
    Transform.call(this, options);
    this._remainders = [];
}

inherits(PBFSplit, Transform);

PBFSplit.prototype._transform = function (chunk, encoding, done) {

    // prepend unprocessed parts from previous chunks if any
    if (this._remainders.length > 0) {
        if (chunk) this._remainders.push(chunk);
        chunk = Buffer.concat(this._remainders);
        this._remainders = [];
    }

    var pos = 0,
        chunkLen = chunk.length;

    // slice out messages iteratively
    do {
        // reuse the message length in case we read it but didn't yet output the message
        var len = this._lastLen;

        if (!len) {
            len = this._lastLen = readVarint(chunk, pos);
            pos += readVarint.bytes;
        }

        // slice out the message from the current chunk if possible
        if (pos + len <= chunkLen) {
            this._lastLen = null;
            this.push(chunk.slice(pos, pos + len));
            pos += len;

        } else break;

    // make sure we can always read message length (up to 10 bytes varint)
    } while (pos + 10 < chunkLen);

    // if we didn't process the whole chunk, save the remainder for later processing
    if (pos < chunkLen) this._remainders.push(chunk.slice(pos, chunkLen));

    done();
};

PBFSplit.prototype._flush = function (done) {
    // process any remaining parts after everything was read
    if (this._remainders.length > 0) this._transform(null, 'buffer', done);
    else done();
};
