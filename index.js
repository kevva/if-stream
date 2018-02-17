'use strict';
const streamLib = require('stream');
const isStream = require('is-stream');
const matchCondition = require('match-condition');
const peekStream = require('peek-stream');

module.exports = (condition, stream, fn, opts) => {
	opts = Object.assign({}, opts);

	const haveFn = isStream(fn) || typeof fn === 'function';

	if (fn && !haveFn) {
		opts = fn;
	}

	return peekStream(opts, (data, swap) => {
		if (!matchCondition(data, condition) && !haveFn) {
			swap(null, new streamLib.PassThrough());
			return;
		}

		if (!matchCondition(data, condition)) {
			swap(null, typeof fn === 'function' ? fn() : fn);
			return;
		}

		swap(null, typeof stream === 'function' ? stream() : stream);
	});
};
