'use strict';

module.exports = {	
	// List of generators and their respective configurations 
	GENERATORS: {
		node1: {
			protocol: 'http',
			host: 'localhost',
			port: 8000,
			// Interval at which data is sent to the evaluator
			interval: 500
		},
		node2: {
			protocol: 'http',
			host: 'localhost',
			port: 8001,
			// Interval at which data is sent to the evaluator
			interval: 500
		},
	},
};