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
      node.arguments[0].name === "FormatRelativeTime";
  },

  getFormatter: function(node) {
    var options;
    var args = [];

    args.push(getObjectKey(node.arguments[1], "unit").value);
    if (options = getObjectKey(node.arguments[1], "options")) {
      args.push(options.value);
    }

    return "Globalize.relativeTimeFormatter(" +
      args.map(function(argumentNode) {
        return escodegen.generate(argumentNode);
      }).join(", ") +
      ")";
  }
};
