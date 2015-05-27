/**
 * I18n support for React applications using Globalize.
 *
 * Copyright Rafael Xavier de Souza
 * Released under the MIT license
 * https://github.com/rxaviers/grunt-react-globalize/blob/master/LICENSE-MIT
 */

"use strict";

var Globalize, GlobalizeCompiler, _loadCldr, React, scope;

var assert = require("assert");
var path = require("path");

var cache = {};
cache.cldrLoaded = {};
cache.defaultTranslation = {};


function amd(config) {
  var requirejs;
  if(cache.initialized) {
    throw new Error("Already initialized");
  }

  // AMD setup.
  config.nodeRequire = require;
  requirejs = require("requirejs");
  requirejs.config(config);
  Globalize = requirejs("globalize");
  ["currency", "date", "message", "number", "plural", "relative-time"].forEach(function(module) {
    requirejs("globalize/" + module);
  });
  GlobalizeCompiler = require(path.join(requirejs.toUrl("globalize"), "../../tools/compiler"));
  React = requirejs("react");
  scope = {
    Globalize: Globalize,
    React: React,
    requirejs: requirejs
  };
  _loadCldr = function(locale) {
    Globalize.load(
      requirejs("cldr-data!main/" + locale + "/{ca-gregorian,characters,currencies,dateFields,delimiters,languages,layout,listPatterns,localeDisplayNames,measurementSystemNames,numbers,posix,scripts,territories,timeZoneNames,transformNames,units,variants}"),
      requirejs("cldr-data!entireSupplemental")
    );
  };

  cache.initialized = true;
}

function assertLocale(locale) {
  assert(typeof locale === "string", "must include `locale` argument (e.g., \"en\")");
}

function assertMessages(messages) {
  if (Array.isArray(messages)) {
    return messages.forEach(assertMessages);
  }
  assert(typeof messages === "object", "missing or invalid messages argument, object or array of objects expected (e.g., {\"en\": ...} or [{\"en\": ...}, {\"pt\": ...}])");
  Globalize.load(messages);
}

function assertReactElements(reactElements) {
  if (Array.isArray(reactElements)) {
    return reactElements.forEach(assertReactElements);
  }
  assert(typeof reactElements === "function" || React.isValidElement(reactElements), "invalid react element `" + reactElements + "` (" + typeof reactElements + ")");
}

function defaultOnBuildWrite(locale, content) {
  return content;
}

function loadCldr(locale) {
  if (cache.cldrLoaded[locale]) {
    return;
  }
  _loadCldr(locale);
  cache.cldrLoaded[locale] = true;
}

function loadMessages(messages) {
  if (Array.isArray(messages)) {
    return messages.forEach(loadMessages);
  }
  Globalize.loadMessages(messages);
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
        // Overwrite Arrays
        destination[prop] = source[prop];
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

function init() {
  if(cache.initialized) {
    return;
  }

  // CommonJS setup.
  Globalize = require("globalize");
  GlobalizeCompiler = require("globalize/tools/compiler");
  React = require("react");
  scope = {
    Globalize: Globalize,
    React: React
  };
  _loadCldr = function(locale) {
    Globalize.load(require("cldr-data").entireSupplemental());
    Globalize.load(require("cldr-data").entireMainFor(locale));
  };

  cache.initialized = true;
}

function orderedStringify(obj) {
  return JSON.stringify(obj, function(key, value) {
    if (value instanceof Object && !Array.isArray(value)) {
      return Object.keys(value).sort().reduce(function(ret, key) {
        ret[key] = value[key];
        return ret;
      }, {});
    }
    return value;
  }, "  ");
}

function _reactElements(reactElements, ret) {
  ret = ret || [];
  if (React.isValidElement(reactElements)) {
    return ret.push(reactElements);
  }
  if (typeof reactElements === "function") {
    return _reactElements(reactElements.call(scope), ret);
  }
  if (Array.isArray(reactElements)) {
    reactElements.forEach(function(i) { 
      _reactElements(i, ret);
    });
  }
  return ret;
}

/**
 * generateBundle(locale, reactElements)
 */
function generateBundle(locale, messages, reactElements, options) {
  var builtContent;
  var onBuildWrite = options.onBuildWrite || defaultOnBuildWrite;
  options = options || {};

  init();

  assertLocale(locale);
  assertMessages(messages);
  assertReactElements(reactElements);

  // Load i18n content.
  loadCldr(locale);
  loadMessages(messages);

  // Set locale.
  Globalize.locale(locale);

  // Have react to render all passed components, therefore the formatters in
  // use will be created in Globalize.cache.
  _reactElements(reactElements).forEach(function(reactElement) {
    React.renderToString(reactElement);
   });

  // Compile all generated formatters.
  builtContent = GlobalizeCompiler(Globalize.cache);

  // Cleanup.
  Globalize.cache = {};

  return onBuildWrite(locale, builtContent);
}

/**
 * generateDefaultTranslation(defaultLocale, reactElements)
 */
function generateDefaultTranslation(defaultLocale, reactElements) {
  var data = {};

  init();

  if (cache.defaultTranslation[defaultLocale]) {
    return cache.defaultTranslation[defaultLocale];
  }

  assertReactElements(reactElements);

  // Load i18n content.
  loadCldr(defaultLocale);

  // Set default locale.
  Globalize.locale(defaultLocale);

  // Have react to render all passed components, therefore the formatters in
  // use will be created in Globalize.cache.
  _reactElements(reactElements).forEach(function(reactElement) {
    React.renderToString(reactElement);
  });

  data[Globalize.cldr.attributes.bundle] = Globalize.cldr.get("globalize-messages/{bundle}");

  return cache.defaultTranslation[defaultLocale] = data;
}

/**
 * initOrUpdateTranslation(locale, translation, defaultLocale)
 */
function initOrUpdateTranslation(locale, translation, defaultLocale) {
  var defaultLocaleBundle, localeBundle, merged;
  var aux = {};

  init();

  // Load i18n content.
  loadCldr(defaultLocale);
  loadCldr(locale);

  defaultLocaleBundle = new Globalize(defaultLocale).cldr.attributes.bundle;
  localeBundle = new Globalize(locale).cldr.attributes.bundle;

  assertLocale(locale);
  assert(typeof translation === "object", "missing or invalid `translation` argument, JSON expected (e.g., {\"en\": ...})");
  assert(typeof defaultLocale === "string", "missing or invalid `defaultLocale` argument, String expected (e.g., \"en\")");

  aux[localeBundle] = generateDefaultTranslation(defaultLocale)[defaultLocaleBundle];
  merged = merge({}, aux, translation);
  if (orderedStringify(translation) !== orderedStringify(merged)) {
    return merged;
  }
}

module.exports = {
  generateBundle: generateBundle,
  generateDefaultTranslation: generateDefaultTranslation,
  initOrUpdateTranslation: initOrUpdateTranslation,
  amd: amd,
  stringify: orderedStringify
};
