'use strict';

var util = require('util');
var Transform = require('stream').Transform;
var readVarint = require('varint').decode;

module.exports = PBFSplit;


function PBFSplit(options) {
    if (!(this instanceof PBFSplit)) return new PBFSplit(options);

    Transform.call(this, options);

    this._remainders = [];
}

util.inherits(PBFSplit, Transform);


PBFSplit.prototype._transform = function (chunk, encoding, done) {
    var pos = 0;

    if (this._remainders.length > 0) {
        if (chunk) this._remainders.push(chunk);
        chunk = Buffer.concat(this._remainders);
        this._remainders = [];
    }

    do {
        var len = this._lastLen;

        if (!len) {
            len = this._lastLen = readVarint(chunk, pos);
            pos += readVarint.bytes;
        }

        if (pos + len <= chunk.length) {
            this.push(chunk.slice(pos, pos + len));
            pos += len;
            this._lastLen = null;

        } else break;

    } while (pos + 10 < chunk.length);

    if (pos < chunk.length) this._remainders.push(chunk.slice(pos, chunk.length));

    done();
};

PBFSplit.prototype._flush = function (done) {
    if (this._remainders.length > 0) this._transform(null, 'buffer', done);
    else done();
};
