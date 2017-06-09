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

// Returns new deeply merged JSON.
//
// Eg.
// merge({a: {b: 1, c: 2}}, {a: {b: 3, d: 4}})
// -> {a: {b: 3, c: 2, d: 4}}
//
// Borrowed from cldrjs.
function merge() {
  var destination = {};
  var sources = [].slice.call(arguments, 0);
  sources.forEach(function(source) {
    var prop;
    for (prop in source) {
      if (prop in destination && Array.isArray(destination[prop])) {
        // Clone Arrays
        destination[prop] = source[prop].slice(0);
      } else if (prop in destination && typeof destination[prop] === "object") {
        // Merge Objects
        destination[prop] = merge(destination[prop], source[prop]);
      } else {
        // Set new values
        destination[prop] = source[prop];
      }
    }
  });
  return destination;
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
    defaultMessages = merge(defaultMessages,visitors.filter(function(visitor) {
      return visitor.test(node);
    }).reduce(function(defaultMessages, visitor) {
      var aux = visitor.getDefaultMessage(node);
      return aux.path.split("/").reduceRight(function(acc, property) {
        return { [property]: acc };
      }, aux.message);
    }, {}));
  });

  return defaultMessages;
}

module.exports = extractor;
