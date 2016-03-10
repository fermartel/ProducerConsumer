'use strict';

const assert = require('assert'),
	rewire = require('rewire'),
	ioClient = require('socket.io-client'),
	Generator = rewire('../../model/Generator');

describe('Generator', function() {
	let client = null;
	const result = 'test';
	const port = 8000;
	const id = 1;
	const interval = 500;
	const uri = 'http://localhost:' + port + '/node' + id;
	
	afterEach(function() {
		try {
			Generator.close();
			client.disconnect();
		}
		catch (e) {}
	});
	
	it('should build a generator', function(done) {
		let buildServer = Generator.__get__('buildServer');
		let server = buildServer(port, id, interval);
		assert(server.name == '/node' + id);
		server.server.close();
		done();
	});
	
	it('should throw an error if unable to build a generator', function(done) {
		let buildServer = Generator.__get__('buildServer');
		assert.throws(function() {
			buildServer(null, id, interval);
		}, Error);
		done();
	});
	
	it('should succesfully close generator', function(done) {
		let disconnect = Generator.__get__('disconnect');
		
		// Create evaluator
		client = ioClient
			.connect(uri)
			.on('expression', function(msg, callback) {
				callback(null, msg);
			})
			.on('error', function(e) { console.log('Evaluator socket error: ' + e.toString()); });
		
		Generator.__set__({
	        'disconnect': function(id) {
	        	assert(1 === 1);
	        	done();
	        }
	    });
		
		Generator.init(port, id, interval);
		setTimeout(function() {
			Generator.close();
			
			Generator.__set__({
		        'disconnect': disconnect
		    });
		}, 100);
	});
	
	it('should close generator', function(done) {
		let disconnect = Generator.__get__('disconnect');
		
		// Create evaluator
		client = ioClient
			.connect(uri)
			.on('expression', function(msg, callback) {
				callback(null, msg);
			})
			.on('error', function(e) { console.log('Evaluator socket error: ' + e.toString()); });
		
		Generator.__set__({
	        'disconnect': function(id) {
	        	assert(1 === 1);
	        	done();
	        }
	    });
		
		Generator.init(port, id, interval);
		setTimeout(function() {
			Generator.close();
			
			Generator.__set__({
		        'disconnect': disconnect
		    });
		}, 100);
	});
	
	it('should send data to an evaluator', function(done) {
		// Create evaluator
		client = ioClient
			.connect(uri)
			.on('expression', function(msg) { 
				 assert(msg.expression === result);
				 done();
			})
			.on('error', function(e) { console.log('Evaluator socket error: ' + e.toString()); });
		
		const ExpressionFactoryMock = {};
		ExpressionFactoryMock.build = function() {
			return result;
		};
		
		Generator.__set__({
	        'ExpressionFactory': ExpressionFactoryMock
	    });
		
		Generator.init(port, id, interval);
	});
	
	it('should receive data from an evaluator', function(done) {
		// Create evaluator
		client = ioClient
			.connect(uri)
			.on('expression', function(msg, callback) {
				callback(null, msg);
			})
			.on('error', function(e) { console.log('Evaluator socket error: ' + e.toString()); });
		
		const ExpressionFactoryMock = {};
		ExpressionFactoryMock.build = function() {
			return result;
		};
		
		Generator.__set__({
	        'ExpressionFactory': ExpressionFactoryMock
	    });
		
		Generator.__set__({
	        'promiseResult': function(data, id) {
	        	assert(data.expression === result);
	        	done();
	        }
	    });
		
		Generator.init(port, id, interval);
	});
});