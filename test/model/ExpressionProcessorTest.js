'use strict';

const ExpressionProcessor = require('../../model/ExpressionProcessor'),
	assert = require('assert');

describe('ExpressionProcessor', function() {
	it('should properly process expression', function(done) {
		const expression = '(5)+(100)*(657)-(-78)/(-23)';
		const result = ExpressionProcessor.process(expression);
		assert.equal(result, eval(expression));
		done();
	});
	
	it('should throw error if expression result is invalid', function(done) {
		assert.throws(function() {
			ExpressionProcessor.process('notanexpression');
		}, Error);
		done();
	});
});