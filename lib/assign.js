var _ = require('isa.js');
module.exports = {
	copyObject: function(source, props, object, respect) {
		var self = this;
		object = object || { };

		var index = -1,
		length = props.length;

		while (++index < length) {
			var key = props[index];
			if( _.isObject( object[key] ) ){
				self.copyObject( source[key], Object.keys(source[key]), object[key], respect );
			}
			else
				if( !respect || !object[key] )
					object[key] = source[key];
		}
		return object;
	},
	assign: function( ){
		var self = this;
		var obj = arguments[0];
		var respect = arguments.length > 1 && _.isBoolean( arguments[ arguments.length-1 ] );
		var args = Array.prototype.slice.call(arguments, 1, respect ? arguments.length-1 : arguments.length );
		args.forEach(function( element ){
			self.copyObject( element, Object.keys(element), obj, respect );
		});
		return obj;
	}
};
