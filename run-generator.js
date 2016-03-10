'use strict';

const PORT = process.argv[2] || 8000,
	GENERATOR_ID = process.argv[3] || 1,
	INTERVAL = process.argv[4] || 500;

require('./model/Generator').init(PORT, GENERATOR_ID, INTERVAL);