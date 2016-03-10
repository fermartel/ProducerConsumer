/**
 * A factory that builds random arithmetic expressions.
 * 
 * @module model/ExpressionFactory
 */
'use strict';

const config = require('../config/expression'),
	ExpressionEntity = require('../model/Expression'),
	log = require('bunyan').createLogger({name: "ProducerConsumer: ExpressionFactory"});

var ExpressionFactory = {};

const MAX_RANDOM_NUMBER = (config.MAX_OPERAND * 2) + 1,
	MAX_RANDOM_OPERANDS = config.MAX_OPERAND_COUNT - 1,
	MAX_RANDOM_OPERATORS = config.OPERATORS.length - 1;

/**
 * Builds an expression from the configured list of random operators, as many as are allowed by the configuration,
 * with random operands based on the configured minimum and maximum accepted values and minimum and maximum accepted amounts.
 * 
 * @returns {number} The result of the expression.
 */
ExpressionFactory.build = function() {
	let expression = '';
	const operandMax = generateRandomNumber(MAX_RANDOM_OPERANDS, config.MIN_OPERAND_COUNT);
	
	try {
		for (let i = 0; i < operandMax; i++) {
			// Add a random operand to the expression
			ExpressionEntity.addOperand(generateRandomOperand());
			// Add a random operator to the expression except when adding the last operand
			if (i !== operandMax - 1) {
				ExpressionEntity.addOperator(generateRandomOperator());
			}
		}
		
		// Get the expression once completed
		expression = ExpressionEntity.get();
	}
	catch (e) {
		log.error('Error generating expression: ' + expression);
	}
	
	// Log expression result
	log.info('Expression generated: ' + expression);
	// Clear expression
	ExpressionEntity.clear();
	
	return expression;
};

/**
 * Generates a random operand based on the configured minimum and maximum accepted values.
 * 
 * @param {number} max - The maximum operand.
 * @param {number} min - The minimum operand.
 * @returns {number} The random operand.
 */
function generateRandomOperand() {
	return generateRandomNumber(MAX_RANDOM_NUMBER, config.MIN_OPERAND);
};

/**
 * Generates a random operator from the configured list of valid operators.
 * 
 * @returns {string} The random operator.
 */
function generateRandomOperator() {
	return config.OPERATORS[generateRandomNumber(MAX_RANDOM_OPERATORS, 1)];
};

/**
 * Generates a random number between max and min.
 * 
 * @param {number} max - The maximum number.
 * @param {number} min - The minimum number.
 * @returns {number} The random number.
 */
function generateRandomNumber(max, min) {
	return Math.floor(Math.random() * (max)) + (min);
};

module.exports = ExpressionFactory;