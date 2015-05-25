'use strict';
var isStream = require('is-stream');
var matchCondition = require('match-condition');
var peekStream = require('peek-stream');
var through = require('through2');

module.exports = function (condition, stream, fn, opts) {
	opts = opts || {};

	if (fn && !isStream(fn) && typeof fn !== 'function') {
		opts = fn;
	}

	var peek = peekStream(opts, function (data, swap) {
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

	return peek;
};
