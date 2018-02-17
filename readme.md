# if-stream [![Build Status](https://travis-ci.org/kevva/if-stream.svg?branch=master)](https://travis-ci.org/kevva/if-stream)

> Conditionally return a stream


## Install

```
$ npm install if-stream
```


## Usage

```js
const csvParser = require('csv-parser');
const ifStream = require('if-stream');

const isCsv = data => data.toString().indexOf(',') !== -1;
const stream = ifStream(isCsv, csvParser);

stream.on('data', data => {
	console.log(data);
	//=> {foo: 'bar', unicorn: 'cat'}
});

stream.end('foo,unicorn\nbar,cat\n');
```


## API

### ifStream(condition, stream, [optionalStream], [options])

#### condition

Type: `Function` `string` `boolean` `RegExp`

Condition to match the stream buffer against.

#### stream

Type: `Stream`

The stream to be returned if the condition is met.

#### optionalStream

Type: `Stream`<br>
Default: `stream.Transform`

An optional stream to be returned if the condition isn't met. By default a
`stream.Transform` is returned.

#### options

Type: `Object`

Options to pass to [peek-stream](https://github.com/mafintosh/peek-stream).


## License

MIT © [Kevin Martensson](http://github.com/kevva)
