var compileDynamically = require("./lib/dynamic-compiler");
var extract = require( "./lib/extract" );
var extractDefaultMessages = require( "./lib/extract-default-messages" );
var generateTranslation = require("./lib/generate-translation");
var initOrUpdateTranslation = require("./lib/init-or-update-translation");

module.exports = {
  compileDynamically: compileDynamically,
  extract: extract,
  extractDefaultMessages: extractDefaultMessages,
  generateTranslation: generateTranslation,
  initOrUpdateTranslation: initOrUpdateTranslation
};
