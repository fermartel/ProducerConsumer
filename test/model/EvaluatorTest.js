'use strict';

var rewire = require('rewire'),
	ioServer = require('socket.io'),
	promise = require('bluebird'),
	config = require('../../config/generator'),
	assert = require('assert'),
	Evaluator = rewire('../../model/Evaluator'),
	EvaluatorClientFactory = rewire('../../model/EvaluatorClientFactory');

describe('Evaluator', function() {
	const result = 'test';
	const generators = config.GENERATORS;
	const keys = Object.keys(generators);
	let servers = [];
	let namespace = '';
	let id = 0;
	
	afterEach(function() {
		try {
			let server;
			for (server in servers) {
				servers[server].server.close();
			}
			Evaluator.close();
		}
		catch (e) {console.log(e.toString());}
	});
	
	it('should succesfully close an evaluator client', function(done) {
		EvaluatorClientFactory.__set__({
			'disconnect': function() {
				assert(1 === 1);
				done();
			}
		});
		
		Evaluator.__set__({
	        'EvaluatorClientFactory': EvaluatorClientFactory
	    });
		
		Evaluator.init();
		
		namespace = keys[0];
		id = namespace.replace('node', '');
		
		servers.push(ioServer
			.listen(generators[namespace].port)
			.of('/' + namespace)
			.on('connection', function(socket) {
				socket.emitAsync = promise.promisify(socket.emit);
				socket
					.emitAsync("expression", {expression:result, namespace:namespace})
					.then(function(data) {
					})
					.catch(function(e) {
						console.log('Socket error: ' + e.toString());
					}
				);
				
				socket.on('disconnect', function() {
					console.log('Generator ' + id + ' disconnected');
				});
				
				socket.on('error', function(e) {
					console.log('Generator socket error: ' + e.message);
					socket.destroy();
				});
			}));
		
		setTimeout(function() {
			Evaluator.close();
			
			Evaluator.__set__({
		        'EvaluatorClientFactory': require('../../model/EvaluatorClientFactory')
		    });
		}, 1000);
	});
	
	it('should receive data from the configured generators', function(done) {
		Evaluator.__set__({
	        'expression': function(data, cb) {
	        	assert(data.expression === result);
	        	cb(null, data);
	        }
	    });
		
		Evaluator.init();
		
		for (let generator in keys) {
			namespace = keys[generator];
			id = namespace.replace('node', '');
			
			servers.push(ioServer
				.listen(generators[namespace].port)
				.of('/' + namespace)
				.on('connection', function(socket) {
					socket.emitAsync = promise.promisify(socket.emit);
					socket
						.emitAsync("expression", {expression:result, namespace:namespace})
						.then(function(data) {
							if (data.namespace === keys[keys.length - 1]) {
				        		done();
				        	}
						})
						.catch(function(e) {
							console.log('Socket error: ' + e.toString());
						}
					);
					
					socket.on('disconnect', function() {
						console.log('Generator ' + id + ' disconnected');
					});
					
					socket.on('error', function(e) {
						console.log('Generator socket error: ' + e.message);
						socket.destroy();
					});
				}));
		}
	});
});