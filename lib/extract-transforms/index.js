module.exports = [
  require("./babel-globalize2-default-into-globalize"),
  require("./babel-react2-default-into-react"),
  require("./babel-react-globalize"),

  // Should run after babel transforms.
  require("./react-globalize-fn-expression-into-fn-identifier")
];
