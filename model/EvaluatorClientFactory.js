/**
 * A factory for building evaluator websocket clients.
 * 
 * @module model/EvaluatorClientFactory
 */
'use strict';

const ioClient = require('socket.io-client'),
	log = require('bunyan').createLogger({name: "ProducerConsumer: EvaluatorClientFactory"});

var EvaluatorClientFactory = {};

/**
 * Builds an evaluator websocket client.
 * 
 * @param {string} namespace - The namespace of the evaluator websocket client. 
 * @param {Object} generator - The generator configuration used to build the correspoding evaluator websocket client.
 * @param {Function} callback - The callback for when data is sent to the evaluator websocket client.
 * @returns {Object} The evaluator websocket client.
 * @throw Throws an error if the evaluator websocket client creation fails.
 */
EvaluatorClientFactory.build = function(namespace, generator, callback) {
	return ioClient
		// Connect client 
		.connect(generator.protocol + '://' + generator.host + ':' + generator.port + '/' + namespace)
		// Handle data send
		.on('expression', function(msg, fn) { callback(msg, fn) })
		// Handle client disconnect
		.on('disconnect', function() { disconnect(namespace); })
		// Handle client error
		.on('error', function(e) { log.error('Evaluator socket error: ' + e.toString()); });
};

/**
 * Logs when evaluator client has been disconnected.
 * 
 * @param {string} namespace - The namespace of the evaluator websocket client. 
 */
function disconnect(namespace) {
	log.info('Evaluator client ' + namespace + ' disconnected');
}

module.exports = EvaluatorClientFactory;