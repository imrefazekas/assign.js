'use strict'

var _ = require('isa.js')

function Assigner () {
	this.options = {}
}

var assigner = Assigner.prototype

assigner.init = function (options) {
	this.options = options || {}
	this.options.recursive = true
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

		var ref = this.options.forceful ? source[key] : object[key]
		if (_.isPlainObject( ref ) && self.options.recursive ) {
			if (this.options.forceful && !object[key]) object[key] = {}
			self.copyObject( source[key], object[key] )
		} else
			if ( !self.options.respect || object[key] === null || object[key] === undefined )
				object[key] = source[key]
	}
	return object
}

assigner.cloneObject = function ( source ) {
	var self = this

	if (!source) return source

	if (_.isPlainObject( source ) ) {
		var object = { }
		var index = -1, props = Object.keys( source ), length = props.length

		while (++index < length) {
			var key = props[index]

			if (this.options.typed && source[key]._type )
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
