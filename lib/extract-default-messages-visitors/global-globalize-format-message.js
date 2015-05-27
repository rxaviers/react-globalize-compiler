var escodegen = require("escodegen");
var esprima = require("esprima");
var sanitizePath = require("../util/sanitize-message-path");

var Syntax = esprima.Syntax;

module.exports = {
  test: function(node) {
    return node.type === Syntax.CallExpression &&
      node.callee.type === Syntax.MemberExpression &&
      node.callee.object.type === Syntax.Identifier &&
      node.callee.object.name === "Globalize" &&
      node.callee.property.type === Syntax.Identifier &&
      node.callee.property.name === "formatMessage";
  },

  getDefaultMessage: function(node) {
    /*jslint evil: true */
    var message = escodegen.generate(node.arguments[0]);
    return {
      path: sanitizePath(message),
      message: message
    };
  }
};
