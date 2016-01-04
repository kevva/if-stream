# if-stream [![Build Status](https://travis-ci.org/kevva/if-stream.svg?branch=master)](https://travis-ci.org/kevva/if-stream)

> Conditionally return a stream


## Install

```
$ npm install --save if-stream
```


## Usage

```js
const csvParser = require('csv-parser');
const ifStream = require('if-stream');

function isCsv(data) {
	return data.toString().indexOf(',') !== -1;
}

const stream = ifStream(isCsv, csvParser);

stream.on('data', data => {
	console.log(data);
	//=> {foo: 'bar', unicorn: 'cat'}
});

stream.end('foo,unicorn\nbar,cat\n');
```


## API

### ifStream(condition, stream, [optionalStream], options)

#### condition

*Required*  
Type: `function`, `string`, `boolean` or `regex`

Condition to match the stream buffer against.

#### stream

*Required*  
Type: `stream`

The stream to be returned if the condition is met.

#### optionalStream

Type: `stream`

An optional stream to be returned if the condition isn't met. By default a 
transform stream is returned.

#### options

Type: `object`

Options to pass to [peek-stream](https://github.com/mafintosh/peek-stream).


## License

MIT © [Kevin Martensson](http://github.com/kevva)
