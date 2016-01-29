var babel = require("babel-core");
var fs = require("fs");
var esprima = require("esprima");
var expect = require("chai").expect;
var reactGlobalizeCompiler = require("../index");

function getFixtureAst(filename) {
  var code = fs.readFileSync(__dirname + "/fixtures/" + filename);
  var options = { presets: ["es2015", "react"] };

  return esprima.parse( babel.transform(code, options).code );
}

var fixtures = {
  es6: getFixtureAst("es6.jsx"),
  es6addons: getFixtureAst("es6-addOn.jsx"),
  es6both: getFixtureAst("es6-both.jsx"),
  jsx1: getFixtureAst("jsx1.jsx"),
  jsx2: getFixtureAst("jsx2.jsx"),
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

  it("should extract default messages when using react/addons", function() {
    var defaultMessages = reactGlobalizeCompiler.extractDefaultMessages(fixtures.es6addons);
    expect(defaultMessages).to.be.an("object");
    expect(defaultMessages).to.include.keys(
      "View More People"
    );
  });

  it("should extract from both components and Globalize functions", function() {
    var defaultMessages = reactGlobalizeCompiler.extractDefaultMessages(fixtures.es6both);
    expect(defaultMessages).to.be.an("object");
    expect(defaultMessages).to.include.keys(
      "(user)'s (count, plural, one (photo) other (photos))",
      "Header",
      "My Header"
    );
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
