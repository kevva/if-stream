import csvParser from 'csv-parser';
import rfpify from 'rfpify';
import test from 'ava';
import through from 'through2';
import fn from './';

function isCsv(data) {
	return data.toString().indexOf(',') !== -1;
}

test('meet condition', async t => {
	const stream = fn(isCsv, csvParser, {maxBuffer: 10000});
	stream.end('foo,unicorn\nbar,cat\n');
	const data = await rfpify(stream.once.bind(stream))('data');

	t.is(data.foo, 'bar');
	t.is(data.unicorn, 'cat');
});

test('doesn\'t meet condition', async t => {
	const stream = fn(isCsv, csvParser);
	stream.end('{"hello":"world"}{"hello":"space"}');
	const data = await rfpify(stream.once.bind(stream))('data');

	t.is(data.toString(), '{"hello":"world"}{"hello":"space"}');
});

test('doesn\'t meet condition with a custom stream', async t => {
	const optionalStream = through((data, enc, cb) => {
		cb(null, 'foobar');
	});

	const stream = fn(isCsv, csvParser, optionalStream);
	stream.end('{"hello":"world"}{"hello":"space"}');
	const data = await rfpify(stream.once.bind(stream))('data');

	t.is(data.toString(), 'foobar');
});
