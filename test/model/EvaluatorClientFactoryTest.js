'use strict';

const assert = require('assert'),
	EvaluatorClientFactory = require('../../model/EvaluatorClientFactory');

describe('EvaluatorClientFactory', function() {
	let client;
	
	afterEach(function() {
		client.disconnect();
	});
	
	it('should build an evaluator websocket client', function(done) {
		const evaluatorConfig = {
			namespace:	'node1',
			protocol:	'http',
			host:		'localhost',
			port:		8000
		};
		const uri = evaluatorConfig.protocol + '://' + evaluatorConfig.host + ':' + evaluatorConfig.port + '/' + evaluatorConfig.namespace;
		
		client = EvaluatorClientFactory.build(evaluatorConfig.namespace, evaluatorConfig, function() {});
		
		assert(client.io.uri === uri);
		done();
	});
	
	it('should throw an error if unable to create client factory', function(done) {
		assert.throws(function() { 
			client = EvaluatorClientFactory.build('node1', null, function() {});
		}, Error);
		done();
	});
});