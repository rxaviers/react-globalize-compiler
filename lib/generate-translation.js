var async = require("async");
var fs = require("fs");
var mkdirp = require("mkdirp");
var path = require("path");

function generateTranslation(attributes, callback) {
  var defaultLocale, defaultMessages, filepath;

  attributes = attributes || {};

  // Required attributes.
  filepath = attributes.filepath;
  defaultLocale = attributes.defaultLocale || attributes.locale;
  defaultMessages = attributes.defaultMessages;

  // TODO
  //assert();

  async.series([
    function(callback) {
      mkdirp(path.dirname(filepath), callback);
    },
    function(callback) {
      var data = {};
      data[defaultLocale] = defaultMessages;
      fs.writeFile(filepath, JSON.stringify(data, null, "  "), callback);
    }
  ], callback);
}

module.exports = generateTranslation;
