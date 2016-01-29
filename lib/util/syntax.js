var esprima = require("esprima");

var Syntax = esprima.Syntax;

/**
 * Utilities for dealing with syntax trees
 */

module.exports = {
	isDefaultProperty: function(property) {
		return (property.type === Syntax.Literal && property.value === "default") ||
			(property.type === Syntax.Identifier && property.name === "default");
	}
};
