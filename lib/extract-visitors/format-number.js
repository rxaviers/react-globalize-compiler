var escodegen = require("escodegen");
var esprima = require("esprima");
var getObjectKey = require("../util/get-object-key");

var Syntax = esprima.Syntax;

module.exports = {
  test: function(node) {
    return node.type === Syntax.CallExpression &&
      node.callee.type === Syntax.MemberExpression &&
      node.callee.object.type === Syntax.Identifier &&
      node.callee.object.name === "React" &&
      node.callee.property.type === Syntax.Identifier &&
      node.callee.property.name === "createElement" &&
      Array.isArray(node.arguments) && node.arguments.length >= 1 &&
      node.arguments[0].type === Syntax.Identifier &&
      node.arguments[0].name === "FormatNumber";
  },

  getFormatter: function(node) {
    var options = getObjectKey(node.arguments[1], "options");
    return "Globalize.numberFormatter(" +
      (options ? escodegen.generate(options.value) : "") +
      ")";
  }
};
