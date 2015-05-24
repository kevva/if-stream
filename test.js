'use strict';
var csvParser = require('csv-parser');
var test = require('ava');
var through = require('through2');
var ifStream = require('./');

function isCsv(data) {
	return data.toString().indexOf(',') !== -1;
}

test('meet condition', function (t) {
	t.plan(2);

	var stream = ifStream(isCsv, csvParser, {maxBuffer: 10000});

	stream.on('data', function (data) {
		t.assert(data.foo === 'bar');
		t.assert(data.unicorn === 'cat');
	});

	stream.end('foo,unicorn\nbar,cat\n');
});

test('doesn\'t meet condition', function (t) {
	t.plan(1);

	var stream = ifStream(isCsv, csvParser);

	stream.on('data', function (data) {
		t.assert(data.toString() === '{"hello":"world"}{"hello":"space"}');
	});

	stream.end('{"hello":"world"}{"hello":"space"}');
});

test('doesn\'t meet condition with a custom stream', function (t) {
	t.plan(1);

	var optionalStream = through(function (data, enc, cb) {
		cb(null, 'foobar');
	});

	var stream = ifStream(isCsv, csvParser, optionalStream);

	stream.on('data', function (data) {
		t.assert(data.toString() === 'foobar');
	});

	stream.end('{"hello":"world"}{"hello":"space"}');
});
