var async = require("async");
var fs = require("fs");
var generateTranslation = require("./generate-translation");

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

function initOrUpdateTranslation(attributes, callback) {
  var defaultMessages, filepath, locale;

  attributes = attributes || {};

  defaultMessages = attributes.defaultMessages;
  filepath = attributes.filepath;
  locale = attributes.locale;

  // TODO
  // assert(defaultMessages)
  // assert(filepath)

  async.waterfall([
    function(callback) {
      fs.readFile(filepath, function(error) {
        if (error && error.code === "ENOENT") {
          return callback(null, "{}");
        }
        callback.apply(this, arguments);
      });
    },
    function(data, callback) {
      var messages;
      try {
        messages = JSON.parse(data);

        // TODO
        // assert(typeof messages === "object");

        messages = messages[locale] || {};

        // Create a new attributes copy.
        attributes = merge(attributes);

        // Populate the new messages with the default messages.
        attributes.defaultMessages = merge(defaultMessages, messages);
      }
      catch(error) {
        return callback(error);
      }
      callback(null, attributes);
    },
    generateTranslation
  ], callback);

}

module.exports = initOrUpdateTranslation;
