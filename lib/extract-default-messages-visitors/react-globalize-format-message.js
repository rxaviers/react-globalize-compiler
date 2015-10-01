var escodegen = require("escodegen");
var esprima = require("esprima");
var getObjectKey = require("../util/get-object-key");
var sanitizePath = require("../util/sanitize-message-path");

var Syntax = esprima.Syntax;

module.exports = {
  displayName: "<FormatMessage> visitor",

  test: function(node) {
    return node.type === Syntax.CallExpression &&
      node.callee.type === Syntax.MemberExpression &&
      node.callee.object.type === Syntax.Identifier &&
      node.callee.object.name === "React" &&
      node.callee.property.type === Syntax.Identifier &&
      node.callee.property.name === "createElement" &&
      Array.isArray(node.arguments) && node.arguments.length >= 3 &&
      node.arguments[0].type === Syntax.Identifier &&
      node.arguments[0].name === "FormatMessage";
  },

  getDefaultMessage: function(node) {
    /*jslint evil: true */
    var message, path, scope;

    message = eval("(" + escodegen.generate(node.arguments[2]) + ")");
    path = sanitizePath(message);

    if (scope = getObjectKey(node.arguments[1], "scope")) {
      scope = eval("(" + escodegen.generate(scope.value) + ")");
      path = [scope, path].join("/");
    }

    return {
      path: path,
      message: message
    };
  }
};
