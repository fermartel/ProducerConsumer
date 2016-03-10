'use strict';

const rewire = require('rewire'),
	Expression = rewire('../../model/Expression'),
	assert = require('assert');

describe('Expression', function() {
	it('should properly add operand', function(done) {
		const operand = 345;
		Expression.addOperand(operand);
		assert(operand.toString().indexOf(operand) > -1);
		Expression.clear();
		done();
	});
	
	it('should properly add operator', function(done) {
		const operator = '+';
		Expression.addOperator(operator);
		assert(operator.toString().indexOf(operator) > -1);
		Expression.clear();
		done();
	});
	
	it('should clear expression', function(done) {
		Expression.addOperand(345);
		Expression.clear();
		assert.equal(Expression.get(), '');
		done();
	});
	
	it('should get expression', function(done) {
		Expression.addOperand(345);
		Expression.addOperator('+');
		Expression.addOperand(45);
		assert.equal(Expression.get(), '345 + 45 ');
		Expression.clear();
		done();
	});
	
	it('should throw error if operand is invalid', function(done) {
		assert.throws(function() { 
			Expression.addOperand('notanumber');
		}, Error);
		done();
	});
	
	it('should check if operator is valid', function(done) {
		const isOperator = Expression.__get__('isOperator');
		assert(isOperator('/'));
		done();
	});
	
	it('should throw error if operator is invalid', function(done) {
		assert.throws(function() { 
			Expression.addOperator('^');
		}, Error);
		done();
	});
});