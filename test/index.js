var babel = require("babel");
var fs = require("fs");
var esprima = require("esprima");
var expect = require("chai").expect;
var reactGlobalizeCompiler = require("../index");

var fixtures = {
  es6: esprima.parse(babel.transform(fs.readFileSync(__dirname + "/fixtures/es6.jsx")).code),
  jsx1: esprima.parse(babel.transform(fs.readFileSync(__dirname + "/fixtures/jsx1.jsx")).code),
  jsx2: esprima.parse(babel.transform(fs.readFileSync(__dirname + "/fixtures/jsx2.jsx")).code)
};

describe("Extract ReactGlobalize default messages", function() {
  it("should extract default messages from React elements of the form <fn> identifiers (e.g., `React.createElement(FormatMessage, ...)`)", function() {
    var defaultMessages = reactGlobalizeCompiler.extractDefaultMessages(fixtures.jsx1);
    expect(defaultMessages).to.be.an("object");
    expect(defaultMessages).to.include.keys(
      "Standalone Number",
      "What needs to be done?",
      "For more information, see the [yarsk]YARSK Readme[|yarsk], [reactGlobalize]React Globalize Readme[|reactGlobalize], and [globalize]Globalize Readme[|globalize]."
    );
    expect(defaultMessages["For more information, see the [yarsk]YARSK Readme[|yarsk], [reactGlobalize]React Globalize Readme[|reactGlobalize], and [globalize]Globalize Readme[|globalize]."]).to.equal("For more information, see the [yarsk]YARSK Readme[/yarsk], [reactGlobalize]React Globalize Readme[/reactGlobalize], and [globalize]Globalize Readme[/globalize].");
  });

  it("should extract default messages from babel-transformed-ES6-code", function() {
    var defaultMessages = reactGlobalizeCompiler.extractDefaultMessages(fixtures.es6);
    expect(defaultMessages).to.be.an("object");
    expect(defaultMessages).to.include.keys(
      "Standalone Number",
      "For more information, see the [yarsk]YARSK Readme[|yarsk], [reactGlobalize]React Globalize Readme[|reactGlobalize], and [globalize]Globalize Readme[|globalize]."
    );
    expect(defaultMessages["For more information, see the [yarsk]YARSK Readme[|yarsk], [reactGlobalize]React Globalize Readme[|reactGlobalize], and [globalize]Globalize Readme[|globalize]."]).to.equal("For more information, see the [yarsk]YARSK Readme[/yarsk], [reactGlobalize]React Globalize Readme[/reactGlobalize], and [globalize]Globalize Readme[/globalize].");
  });
});

describe("Extract ReactGlobalize formatters", function() {
  it("should extract formatters from React elements of the form <fn> identifiers (e.g., `React.createElement(FormatMessage, ...)`)", function() {
    var formatters = reactGlobalizeCompiler.extract(fixtures.jsx1);
    expect(formatters).to.be.a("function");
    expect(formatters.toString()).to.equal("function anonymous(Globalize) {\nreturn [Globalize.messageFormatter(\"Seems like creating your own React starter kit is a right of passage. So, here's mine.\"), Globalize.messageFormatter(\"Use ReactGlobalize to internationalize your React application.\"), Globalize.messageFormatter(\"Standalone Number\"), Globalize.numberFormatter(), Globalize.messageFormatter(\"Standalone Currency\"), Globalize.currencyFormatter('USD'), Globalize.messageFormatter(\"Standalone Date\"), Globalize.dateFormatter({ datetime: 'medium' }), Globalize.messageFormatter(\"Standalone Relative Time\"), Globalize.relativeTimeFormatter('second'), Globalize.messageFormatter(\"An example of a message using mixed numbers '(number)', currencies '(currency)', dates '(date)', and relative time '(relativeTime)'.\"), Globalize.messageFormatter(\"An example of a message with pluralization support: ' (count, plural, one (You have one remaining task) other (You have # remaining tasks) )'\"), Globalize.messageFormatter(\"For more information, see the [yarsk]YARSK Readme[|yarsk], [reactGlobalize]React Globalize Readme[|reactGlobalize], and [globalize]Globalize Readme[|globalize].\")];\n}");
  });

  it("should extract formatters from React elements of the form ReactGlobalize.<fn> expressions (e.g., `React.createElement(ReactGlobalize.FormatMessage, ...)`)", function() {
    var formatters = reactGlobalizeCompiler.extract(fixtures.jsx2);
    expect(formatters).to.be.a("function");
    expect(formatters.toString()).to.equal("function anonymous(Globalize) {\nreturn [Globalize.messageFormatter(\"Seems like creating your own React starter kit is a right of passage. So, here's mine.\"), Globalize.messageFormatter(\"Use ReactGlobalize to internationalize your React application.\"), Globalize.messageFormatter(\"Standalone Number\"), Globalize.numberFormatter(), Globalize.messageFormatter(\"Standalone Currency\"), Globalize.currencyFormatter('USD'), Globalize.messageFormatter(\"Standalone Date\"), Globalize.dateFormatter({ datetime: 'medium' }), Globalize.messageFormatter(\"Standalone Relative Time\"), Globalize.relativeTimeFormatter('second'), Globalize.messageFormatter(\"An example of a message using mixed numbers '(number)', currencies '(currency)', dates '(date)', and relative time '(relativeTime)'.\"), Globalize.messageFormatter(\"An example of a message with pluralization support: ' (count, plural, one (You have one remaining task) other (You have # remaining tasks) )'\"), Globalize.messageFormatter(\"For more information, see the [yarsk]YARSK Readme[|yarsk], [reactGlobalize]React Globalize Readme[|reactGlobalize], and [globalize]Globalize Readme[|globalize].\")];\n}");
  });

  it("should extract formatters from ES6 files", function() {
    var formatters = reactGlobalizeCompiler.extract(fixtures.es6);
    expect(formatters).to.be.a("function");
    expect(formatters.toString()).to.equal("function anonymous(Globalize) {\nreturn [Globalize.messageFormatter(\"Seems like creating your own React starter kit is a right of passage. So, here's mine.\"), Globalize.messageFormatter(\"Use ReactGlobalize to internationalize your React application.\"), Globalize.messageFormatter(\"Standalone Number\"), Globalize.numberFormatter(), Globalize.messageFormatter(\"Standalone Currency\"), Globalize.currencyFormatter('USD'), Globalize.messageFormatter(\"Standalone Date\"), Globalize.dateFormatter({ datetime: 'medium' }), Globalize.messageFormatter(\"Standalone Relative Time\"), Globalize.relativeTimeFormatter('second'), Globalize.messageFormatter(\"An example of a message using mixed numbers '(number)', currencies '(currency)', dates '(date)', and relative time '(relativeTime)'.\"), Globalize.messageFormatter(\"An example of a message with pluralization support: ' (count, plural, one (You have one remaining task) other (You have # remaining tasks) )'\"), Globalize.messageFormatter(\"For more information, see the [yarsk]YARSK Readme[|yarsk], [reactGlobalize]React Globalize Readme[|reactGlobalize], and [globalize]Globalize Readme[|globalize].\")];\n}");
  });
});
