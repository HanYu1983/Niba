import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { start } from "../model";
import { askImgSrc } from "../tool/data";

const App = (props: any) => {
  useEffect(() => {
    start();
  });
  return (
    <div>
      {/* {Object.keys(datas).map((k: any) => {
        return <img key={k} src={askImgSrc(datas[k].img)}></img>;
      })} */}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
