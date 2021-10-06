import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { start } from "../model";

const App = (props) => {
  useEffect(() => {
    start();
  });
  return <div>xxx</div>;
};

ReactDOM.render(<App />, document.getElementById("root"));
