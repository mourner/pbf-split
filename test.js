'use strict';

var test = require('tap').test;
var Pbf = require('pbf');
var fs = require('fs');
var pbfsplit = require('./');

var lengths = [10, 1000, 1234, 60000, 30, 20000, 5, 3, 1000000, 2];

var pbf = new Pbf();

for (var i = 0; i < lengths.length; i++) {
    pbf.writeBytes(new Buffer(lengths[i]));
}
var buffer = pbf.finish();

test('splits a stream of protobuf strings', function (t) {
    var k = 0;

    fs.writeFileSync('temp.pbf', buffer);

    fs.createReadStream('temp.pbf')
    .pipe(pbfsplit())
    .on('data', function (data) {
        t.equals(data.length, lengths[k++]);
    })
    .on('end', function () {
        t.end();
        fs.unlinkSync('temp.pbf');
    });
});
