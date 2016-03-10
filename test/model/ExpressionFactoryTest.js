'use strict';

const rewire = require('rewire'),
	config = require('../../config/expression'),
	ExpressionFactory = rewire('../../model/ExpressionFactory'),
	assert = require('assert');

describe('ExpressionFactory', function() {
	it('should generate a valid expression', function(done) {
		assert(!isNaN(eval(ExpressionFactory.build())));
		done();
	});
	
	it('should generate a number', function(done) {
		const generateRandomNumber = ExpressionFactory.__get__('generateRandomNumber');
		const max = (500 * 2) + 1;
		const min = -500;
		assert(!isNaN(generateRandomNumber(max, min)));
		done();
	});
	
	it('should generate random numbers', function(done) {
		const generateRandomNumber = ExpressionFactory.__get__('generateRandomNumber');
		const max = (500 * 2) + 1;
		const min = -500;
		assert.notEqual(generateRandomNumber(max, min), generateRandomNumber(max, min));
		done();
	});
	
	it('should generate random operand within mix / max values', function(done) {
		const generateRandomOperand = ExpressionFactory.__get__('generateRandomOperand');
		const randomOperand = generateRandomOperand();
		assert(randomOperand <= config.MAX_OPERAND && randomOperand >= config.MIN_OPERAND);
		done();
	});
	
	it('should generate an operator', function(done) {
		const generateRandomOperator = ExpressionFactory.__get__('generateRandomOperator');
		assert(config.OPERATORS.indexOf(generateRandomOperator()) !== -1);
		done();
	});
});