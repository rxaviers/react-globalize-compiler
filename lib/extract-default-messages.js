var esprima = require("esprima");
var extend = require("util")._extend;
var fs = require("fs");
var transforms = require("./extract-transforms/index");
var visitors = require("./extract-default-messages-visitors/index");

function traverse(ast, iterate) {
  JSON.stringify(ast, function(key, value) {
    if (typeof value !== "object" || value === null) {
      return value;
    }
    iterate(value);
    return value;
  });
}

/**
 * extractor(filename|fileContent|ast)
 *
 * @filename [String]
 *
 * @fileContent [String]
 *
 * @ast [Object]
 *
 * Return an array of default messages statically extracted from given input.
 */
function extractor(input) {
  var ast;
  var defaultMessages = {};

  if (typeof input === "string") {

    // input as a filename.
    if ((/\.js$/i).test(input) && !(/\n/).test(input)) {
      input = fs.readFileSync(input);
    }

    // input as a file content.
    ast = esprima.parse(input);

  // input as an AST.
  } else {
    ast = input;
  }

  // Traverse AST and perform transforms.
  traverse(ast, function(node) {
    transforms.forEach(function(visitor) {
      if (visitor.test(node)) {
        visitor.transform(node);
      }
    });
  });

  // Traverse AST and collect default messages.
  traverse(ast, function(node) {
    extend(defaultMessages, visitors.filter(function(visitor) {
      return visitor.test(node);
    }).reduce(function(defaultMessages, visitor) {
      var aux = visitor.getDefaultMessage(node);
      defaultMessages[aux.path] = aux.message;
      return defaultMessages;
    }, {}));
  });

  return defaultMessages;
}

module.exports = extractor;
