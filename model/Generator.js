/**
 * A generator which will create a websocket server, build a random arithmetic expression, send it to an evaluator, and report the result.
 * 
 * @module model/Generator
 */
'use strict';

const promise = require("bluebird"),
	log = require('bunyan').createLogger({name: "ProducerConsumer: Generator"}),
	ioServer = require('socket.io');

var ExpressionFactory = require("../model/ExpressionFactory");

var Generator = {};

var server = null;

/**
 * Initializes the generator.
 * 
 * @param {number} port - The port the generator is listening on.
 * @param {number} id - The id of the generator.
 * @param {number} interval - The interval at which the expressions are generated.
 */
Generator.init = function(port, id, interval) {	
	try {
		server = buildServer(port, id, interval);
	}
	catch (e) {
		log.error('Generator creation error: ' + e.message);
	}
};

/**
 * Closes the generator connection.
 */
Generator.close = function() {
	if (server !== null) {
		server.server.close();
	}
};

/**
 * Builds a generator server
 * 
 * @param {number} port - The port the generator is listening on.
 * @param {number} id - The id of the generator.
 * @param {number} interval - The interval at which the expressions are generated.
 */
function buildServer(port, id, interval) {
	let expression = '';
	
	return ioServer
		// Set server to listen on specified port
		.listen(port)
		// Set server namespace
		.of('/node' + id)
		// Handle server connection
		.on('connection', function(socket) {
			log.info('Generator ' + id + ' connected');
			
			// Set the interval for the expression generation
			setInterval(function() {					
				expression = ExpressionFactory.build();
				if (expression !== '') {
					// Promisify the socket emit method
					socket.emitAsync = promise.promisify(socket.emit);
					// Send the expression
					socket.emitAsync("expression", {
						expression:expression, generator:id
					// Handle promise result
					}).then(function(data) {
						promiseResult(data, id);
					// Handle promise error
					}).catch(function(e) {
						log.error('Promise error: ' + e.toString());
					});
				}
			}, interval);
			
			// Handle socket disconnect
			socket.on('disconnect', function() {
				disconnect(id);
			});
			
			// Handle socket error
			socket.on('error', function(e) {
				log.error('Generator socket error: ' + e.message);
				socket.destroy();
			});
		});
};

/**
 * Logs when the websocket server has been disconnected.
 * 
 * @param {number} id - ID of the generator.
 */
function disconnect(id) {
	log.info('Generator ' + id + ' disconnected');
}

/**
 * The promise result which logs the expression returned from the evaluator and the generator that reported it.
 * 
 * @param {Object} data - Data returned from the promise.
 * @param {number} id - ID of the generator.
 */
function promiseResult(data, id) {
	log.info('Generator ' + id + ' received expression result: ' + data);
}

module.exports = Generator;