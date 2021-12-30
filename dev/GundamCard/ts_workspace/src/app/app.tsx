import React, { useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { start } from "./model";
import { askImgSrc } from "../tool/data";
import { AppContextProvider } from "./context";
import { View } from "./view";
const App = (props: any) => {
  useEffect(() => {
    start();
  });
  return (
    <AppContextProvider>
      <View></View>
    </AppContextProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
