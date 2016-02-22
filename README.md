Assign.js - dependency-free very minimal assign function

[![NPM](https://nodei.co/npm/assign.js.png)](https://nodei.co/npm/assign.js/)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

========

[Assign.js](https://github.com/imrefazekas/assign.js) is an extremely tiny helper function to assign objects

[Usage](#usage)
[Rules](#rules)


## Usage

Command line:

	npm install assign.js --save

In JS code:

	var assigner = require('assign.js');
	...
	assigner.assign( obj1, obj2[, obj3[, respect]] );

Respect will force assignment if propery already exist
