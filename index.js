'use strict';
const isStream = require('is-stream');
const matchCondition = require('match-condition');
const peekStream = require('peek-stream');
const through = require('through2');

module.exports = (condition, stream, fn, opts) => {
	if (fn && !isStream(fn) && typeof fn !== 'function') {
		opts = fn;
	}

	opts = opts || {};

	return peekStream(opts, (data, swap) => {
		if (!matchCondition(data, condition) && !isStream(fn) && typeof fn !== 'function') {
			swap(null, through());
			return;
		}

		if (!matchCondition(data, condition)) {
			swap(null, typeof fn === 'function' ? fn() : fn);
			return;
		}

		swap(null, typeof stream === 'function' ? stream() : stream);
	});
};
