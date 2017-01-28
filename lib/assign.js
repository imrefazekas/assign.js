'use strict'

var _ = require('isa.js')

function Assigner ( options ) {
	this.init( options )
}

var assigner = Assigner.prototype

assigner.init = function (options) {
	this.options = options || {}
	this.options.recursive = true
	return this
}

assigner.logger = function ( logger ) {
	this.options.logger = logger
	return this
}

assigner.validvalues = function ( validvalues ) {
	this.options.validvalues = validvalues
	return this
}

assigner.respect = function ( respect ) {
	this.options.respect = respect
	return this
}

assigner.recursive = function (recursive) {
	this.options.recursive = recursive
	return this
}

assigner.attributes = function (list) {
	this.options.attributes = list
	return this
}

assigner.excluded = function (list) {
	this.options.excluded = list
	return this
}

assigner.primitives = function (list) {
	this.options.primitives = list
	return this
}

assigner.blueprinting = function ( blueprinting ) {
	this.options.blueprinting = blueprinting
	return this
}

assigner.forceful = function ( forceful ) {
	this.options.forceful = forceful
	return this
}

assigner.typed = function ( typed ) {
	this.options.typed = typed
	return this
}

assigner.copyObject = function ( source, object ) {
	var self = this
	object = object || { }

	var props = self.options.blueprinting ? Object.keys(object) : Object.keys(source)

	var index = -1,
		length = props.length

	while (++index < length) {
		var key = props[index]
		if ( self.options.validvalues && (source[key] === null || source[key] === undefined) )
			continue
		if ( this.options.attributes && this.options.attributes.indexOf(key) === -1 )
			continue
		if ( this.options.excluded && this.options.excluded.indexOf(key) !== -1 )
			continue

		var ref = this.options.forceful ? source[key] : object[key]
		if (_.isPlainObject( ref ) && self.options.recursive && (!this.options.primitives || this.options.primitives.indexOf(key) === -1) ) {
			if (this.options.forceful && !object[key]) object[key] = {}
			self.copyObject( source[key], object[key] )
		} else
			if ( !self.options.respect || object[key] === null || object[key] === undefined )
				object[key] = self.cloneObject( source[key] )
			else if ( self.options.logger )
				self.options.logger.warn( 'The following attribute is defined and respected: ' + key )
	}
	return object
}

assigner.cloneObject = function ( source ) {
	var self = this

	if (!source) return source

	if (this.options.primitives && this.options.primitives.indexOf(key) !== -1)
		return source

	if (_.isPlainObject( source ) ) {
		var object = { }
		var index = -1, props = Object.keys( source ), length = props.length

		while (++index < length) {
			var key = props[index]

			if ( self.options.excluded && self.options.excluded.indexOf(key) !== -1 )
				continue
			if (self.options.typed && source[key]._type )
				object[ key ] = source.value || source.defaultValue || source.defaultvalue
			else
				object[ key ] = self.cloneObject( source[key] )
		}

		return object
	}
	else if (_.isArray( source ) ) {
		var array = []
		source.forEach( function ( element ) {
			array.push( self.cloneObject( element ) )
		} )
		return array
	}

	return source
}

assigner.mask = function (source, mask) {
	var self = this

	if (!source || !mask) return source

	if (_.isPlainObject( source ) ) {
		var object = { }
		var index = -1, props = Object.keys( mask ), length = props.length

		while (++index < length) {
			var key = props[index]
			if ( !mask[key] ) continue
			object[ key ] = _.isPlainObject( mask[key] ) ? self.mask( source[key], mask[key] ) : source[key]
		}

		return object
	}
	else if (_.isArray( source ) ) {
		var array = []
		source.forEach( function ( element ) {
			array.push( self.mask( element, mask ) )
		} )
		return array
	}

	return source
}

assigner.purify = function (source, mask) {
	var self = this

	if (!source || !mask) return source

	if (_.isPlainObject( source ) ) {
		var object = { }
		var index = -1, props = Object.keys( source ), length = props.length

		while (++index < length) {
			var key = props[index]
			if ( !mask[key] ) object[ key ] = source[key]
			else if ( _.isPlainObject(mask[key]) ) object[ key ] = self.purify( source[key], mask[key] )
		}

		return object
	}
	else if (_.isArray( source ) ) {
		var array = []
		source.forEach( function ( element ) {
			array.push( self.purify( element, mask ) )
		} )
		return array
	}

	return source
}


assigner.pick = function (object, properties) {
	var obj = { }
	if ( !Array.isArray( arguments[1] ) )
		properties = Array.prototype.slice.call( arguments, 1, arguments.length )
	properties.forEach( function ( property ) {
		obj[ property ] = object[property]
	} )
	return obj
}

assigner.assign = function () {
	var self = this
	var obj = arguments[0]
	var args = Array.prototype.slice.call( arguments, 1, arguments.length )
	args.forEach(function ( element ) {
		if ( element )
			self.copyObject( element, obj )
	})
	return obj
}

module.exports = Assigner
