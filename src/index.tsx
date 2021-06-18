import React from "react";
import ReactDOM from "react-dom";
import App from "./app/app";
declare global {
  interface Window {
    dataLayer: Array<Object>;
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
