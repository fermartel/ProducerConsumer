/**
 * An evaluator which will build client web sockets for the connected generators and send a processed arithmetic expression back to them.
 * 
 * @module model/Evaluator
 */
'use strict';

const config = require('../config/generator'),
	ExpressionProcessor = require('../model/ExpressionProcessor'),
	log = require('bunyan').createLogger({name: "ProducerConsumer: Evaluator"});

var EvaluatorClientFactory = require('../model/EvaluatorClientFactory');

var Evaluator = {};

var clients = [];

/**
 * Initializes the evaluator by creating its respective websocket clients based on the existing generators.
 */
Evaluator.init = function() {
	const generators = config.GENERATORS;
	const keys = Object.keys(generators);
	let namespace = '';
	
	for (let generator in keys) {
		namespace = keys[generator];
		try {
			clients.push(EvaluatorClientFactory.build(namespace, generators[namespace], expression));
		}
		catch (e) {
			log.error('Error creating evaluator client: ' + e.message);
		}
	}
};

/**
 * Disconnects the existing evaluator websocket client connections.
 */
Evaluator.close = function() {
	for (let client in clients) {
		clients[client].disconnect();
	}
};

/**
 * Performs functionality after websocket client has been disconnected.
 */
function expression(msg, callback) {
	let result = ''; 
	
	try {	
		// Process the expression
		result = ExpressionProcessor.process(msg.expression);
	}
	catch (e) {
		result = e.message;
	}
	
	// Log the results of the processed expression and the generator that sent it 
	log.info('Evaluator received expression from generator ' + msg.generator + ': ' + result);
	// Return the data to the promise
	callback(null, result.toString());
};

module.exports = Evaluator;