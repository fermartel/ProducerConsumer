'use strict';

const fs = require('fs'),
	config = require('./config/generator.js'),
	log = require('bunyan').createLogger({name: "ProducerConsumer: index"});

const generators = config.GENERATORS;
const keys = Object.keys(generators),
	path = './bin/';

var id = '', 
	script = '', 
	fileName = '',
	namespace = '';
	
// Loop through generators
for (let generator in keys) {
	namespace = keys[generator];
	id = namespace.replace('node', '');
	// Create a script for each generator
	script = 'node run-generator.js ' + generators[namespace].port + ' ' + id;
	// Create file for each generator
	let fileName = 'generator' + id + '.sh';
	
	// Create bin folder if it does not exist
	if (!fs.existsSync(path)) {
	    fs.mkdirSync(path);
	}
	
	// Write script file
	fs.writeFile(path + fileName, script, function(err) {
	    if (err) {
	    	log.error('Error: ' + err);
	    }
	    
	    // Change file permissions
	    fs.chmodSync(path + fileName, '777');
	
	    log.info('The file ' + fileName + ' was saved!');
	});
}