import React, { useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { test } from "./debug";
import { initJsonfp } from "./tool/tool/basic/jsonfpHelper";
import { AppView } from "./view/component/appView";

const App = (props: any) => {
  useEffect(() => {
    initJsonfp();
    test();
  }, []);
  return <div>{<AppView></AppView>}</div>;
};

ReactDOM.render(<App />, document.getElementById("root"));
