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

assigner.copyObject = function ( source, props, object ) {
	var self = this
	object = object || { }

	var index = -1,
		length = props.length

	while (++index < length) {
		var key = props[index]
		if ( self.options.validvalues && (source[key] === null || source[key] === undefined) )
			continue
		if ( this.options.attributes && this.options.attributes.indexOf(key) === -1 )
			continue
		if (_.isPlainObject( object[key] ) && self.options.recursive )
			self.copyObject( source[key], Object.keys(source[key]), object[key] )
		else
			if ( !self.options.respect || object[key] === null || object[key] === undefined )
				object[key] = source[key]
	}
	return object
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
		self.copyObject( element, Object.keys(element), obj )
	})
	return obj
}

module.exports = Assigner
