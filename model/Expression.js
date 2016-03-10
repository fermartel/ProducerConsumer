/**
 * An entity that represents an arithmetic expression.
 * 
 * @module model/Expression
 */
'use strict';

const config = require('../config/expression');

var Expression = {};

var expressionLiteral = '';

/**
 * Adds an operator to the expression.
 * 
 * @param {number} operator - The operator.
 * @throws Throws an error is the operator is invalid 
 */
Expression.addOperator = function(operator) {
	// Validate if the operator is invalid
	if (isOperator(operator) === -1) {
		throw new Error('Invalid operand: ' + operator.toString());
	}
	// Concatenate the operator to the expression
	expressionLiteral += appendSuffix(operator);
};

/**
 * Adds an operand to the expression.
 * 
 * @param {number} operand - The operand.
 * @throws Throws an error is the operand is not a number 
 */
Expression.addOperand = function(operand) {
	// Validate if the operator is not a number
	if (isNaN(operand)) {
		throw new Error('Invalid number: ' + operand.toString());
	}
	// Concatenate the operand to the expression
	expressionLiteral += appendSuffix(operand);
};

/**
 * Clears the expression.
 */
Expression.clear = function() {
	expressionLiteral = '';
};

/**
 * Gets the expression.
 * 
 * @returns {string} The expression.
 */
Expression.get = function() {
	return expressionLiteral;
};

/**
 * Concatenates a suffix to the expression element.
 * 
 * @param {string} element - The expression element.
 * @returns {string} The expression element with the concatenated suffix.
 */
function appendSuffix(element) {
	return element + ' ';
};

/**
 * Validates whether or not the operator is valid
 * 
 * @param {string} value - The value to be validated.
 * @returns {boolean} The result of the validation.
 */
function isOperator(value) {
	return config.OPERATORS.indexOf(value);
};

module.exports = Expression;