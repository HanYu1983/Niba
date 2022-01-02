import React, { useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { test } from "./debug";
const App = (props: any) => {
  useEffect(() => {
    test();
  }, []);
  return <div>app2</div>;
};

ReactDOM.render(<App />, document.getElementById("root"));
