/**
 * A processor which evaluates arithmetic expressions.
 * 
 * @module model/ExpressionProcessor
 */
'use strict';

var ExpressionProcessor = {};

/**
 * Processes an arithmetic expression.
 * 
 * @param {string} expression - The expression to be processed.
 * @returns {number} The result of the expression.
 * @throws Throws an error if the expression is invalid.
 */
ExpressionProcessor.process = function(expression) {
	return eval(expression);
};

module.exports = ExpressionProcessor;