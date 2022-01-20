import React, { useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { test } from "./debug";
import { AppView } from "./view/component/appView";

const App = (props: any) => {
  useEffect(() => {
    test();
  }, []);
  return (
    <div>
      {
        //<AppView></AppView>
      }
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
