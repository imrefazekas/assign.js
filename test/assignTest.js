var assigner = require('../lib/assign');

var a = {
	name: 'A',
	walking: function(){}
};
var b = {
	name: 'B',
	sulking: function(){}
};

console.log( assigner.assign( a, b, true ) );
