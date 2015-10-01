module.exports = [
  require("./babel-globalize2-default-into-globalize"),
  require("../extract-transforms/babel-react2-default-into-react"),
  require("../extract-transforms/babel-react-globalize"),

  // Should run after babel transforms.
  require("../extract-transforms/react-globalize-fn-expression-into-fn-identifier")
];
