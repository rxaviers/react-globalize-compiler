var esprima = require("esprima");

var Syntax = esprima.Syntax;

module.exports = function getObjectKey(node, name) {
  return node.type === Syntax.ObjectExpression &&
    node.properties.filter(function(node) {
      return node.key.name === name;
    })[0];
};
