import PropTypes from "prop-types";
import React, { PureComponent } from "react";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
// style
import vsDark from "react-syntax-highlighter/dist/esm/styles/prism/twilight";
// languages
import go from "react-syntax-highlighter/dist/esm/languages/prism/go";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import sass from "react-syntax-highlighter/dist/esm/languages/prism/sass";
import php from "react-syntax-highlighter/dist/esm/languages/prism/php";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import protobuf from "react-syntax-highlighter/dist/esm/languages/prism/protobuf";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";
SyntaxHighlighter.registerLanguage("go", go);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("sass", sass);
SyntaxHighlighter.registerLanguage("php", php);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("protobuf", protobuf);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("html", yaml);
SyntaxHighlighter.registerLanguage("html", yaml);

class CodeBlock extends PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    language: PropTypes.string,
  };

  static defaultProps = { language: null };

  render() {
    const { language, value } = this.props as any;
    return (
      <SyntaxHighlighter
        language={language ? language : "bash"}
        style={vsDark}
        showLineNumbers={true}
        wrapLines
      >
        {value}
      </SyntaxHighlighter>
    );
  }
}

export default CodeBlock;
