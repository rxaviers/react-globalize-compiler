var esprima = require("esprima");
var fs = require("fs");
var visitors = require("./extract-visitors/index");
var transforms = require("./extract-transforms/index");

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
 * Return an array of formatters statically extracted from given input.
 */
function extractor(input) {
  var ast;
  var formatters = [];

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

  // Traverse AST and collect formatters.
  traverse(ast, function(node) {
    [].push.apply(formatters, visitors.filter(function(visitor) {
      return visitor.test(node);
    }).map(function(visitor) {
      return visitor.getFormatter(node);
    }));
  });

  /*jslint evil: true */
  return new Function("Globalize", "return [" + formatters.join(", ") + "];");
}

module.exports = extractor;
