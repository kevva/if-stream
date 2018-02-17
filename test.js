import {Transform} from 'stream';
import csvParser from 'csv-parser';
import getStream from 'get-stream';
import test from 'ava';
import m from '.';

const isCsv = data => data.toString().indexOf(',') !== -1;
const throughStream = fn => new Transform({
	transform(data, enc, cb) {
		fn(data, enc, cb);
	}
});

test('meet condition', async t => {
	const stream = m(isCsv, csvParser, {chunkLength: 10000});
	stream.end('foo,unicorn\nbar,cat\n');
	const data = await getStream.array(stream);
	t.is(data[0].foo, 'bar');
	t.is(data[0].unicorn, 'cat');
});

test('doesn\'t meet condition', async t => {
	const stream = m(isCsv, csvParser);
	stream.end('{"hello":"world"}{"hello":"space"}');
	const data = await getStream(stream);
	t.is(data.toString(), '{"hello":"world"}{"hello":"space"}');
});

test('doesn\'t meet condition with a custom stream', async t => {
	const optionalStream = throughStream((data, enc, cb) => cb(null, 'foobar'));
	const stream = m(isCsv, csvParser, optionalStream);
	stream.end('{"hello":"world"}{"hello":"space"}');
	const data = await getStream(stream);
	t.is(data.toString(), 'foobar');
});
