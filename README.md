# Synopsis

This is a simple Product (Generator) / Consumer (Evaluator) application in which Generators produce arithmetic expressions every 500ms and an Evaluator processes them if valid, returning the results back to the respective Generator. The application is meant to run with two Generators, but can be configured to use more. The expressions generated include 2 to 5 operands ranging from -999 to 999 (even though the instructions indicated to use positive integers, this extra functionality was added) with their respective operators (+,-,/,*,%). All of these application defaults can easily be configured by referring to the Configuration section.

# Motivation

This project is meant to showcase the ability to implement a multi-process communication application (Producer / Consumer) using Node.js' asynchronous event driven framework. It logs all pertinent information and errors, and is fully unit tested and properly documented, using sequence and activity diagrams to convey the details of how the application functions.

A common approach to the Producer / Consumer implementation is to use a queue to hold the messages sent by the Producer(s) so they can be consumed as they are made available. This decouples the Producer from the Consumer and can allow for greater flexibility when scaling the application. For this simple use case, where there are no long running and complex business processes, it would have been unnecessary and was therefore not utilized. Also, to simplify the bi-directional nature of the communication between the Producer and the Consumer, websockets with multiplexing were used, allowing for the Consumer to directly send the expression results back to the Producer via promises.

# Requirements

The application was tested using a MacBook Pro running OS X El Capitan.

# Installation

To install the application, open up the terminal, go to the root directory, and run the following commands:

```shell
npm install
npm start
```

# Usage

Once these commands have successfully executed, two scripts should have been generated in the bin folder, one per generator.
Run the following commands in separate terminal windows (going to the root directory of the application for each) to start the application:

```shell
node run-evaluator.js
bin/generator1.sh
bin/generator2.sh
```

# Tests

To test the application, open up the terminal, go to the root directory, and run the following commands:

```shell
npm test
```

Once the command has successfully executed, it should show all tests passing, meaning that the application is behaving as expected.

# Configuration

The following parameters, found in the config/evaluator.js file, are used to configure the way the expressions are generated:

```javascript
// Maximum value for random operand
MAX_OPERAND: 999,
// Minimum value for random operand
MIN_OPERAND: -999,
// Maximum amount of allowed operands
MAX_OPERAND_COUNT: 5,
// Minimum amount of allowed operands
MIN_OPERAND_COUNT: 2,
// Allowed operators
OPERATORS: ["+","-","/","*","%"]
```

The following parameters, found in the config/generator.js file, are used to configure the way the generators are created. The default setting uses only two:

```javascript
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
	}
}
```

# Diagrams

Sequence Diagram:

![alt tag](https://raw.githubusercontent.com/fermartel/ProducerConsumer/master/ProducerConsumerSequenceDiagram.png)

Activity Diagram:

![alt tag](https://raw.githubusercontent.com/fermartel/ProducerConsumer/master/ProducerConsumerActivityDiagram.png)

# License

The MIT License (MIT)

Copyright (c) [2016] [Fernando Martel]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.