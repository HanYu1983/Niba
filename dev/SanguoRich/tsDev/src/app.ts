// 注意, 只能引用類型(加上type關鍵字), 不然會編譯成require, 這樣就不能用在html中
import type { Spec, People } from "./spec";
// 使用spec, html中必須先為環境建一個exports
// ex. var exports = {}
// 之後, 只要引用exports, 就可以使用別的module
let _spec: Spec = exports.spec;
export const app = {
  main: () => {
    let a: People = {
      age: 0,
    };
    _spec.doA(a);
  },
};

app.main();
