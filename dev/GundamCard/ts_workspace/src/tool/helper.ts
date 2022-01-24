export function getCustomFunction(script: string): any {
  console.log(script);
  eval.apply(null, [script]);
  // 避免混淆器
  return eval.apply(null, ["main"]);
}

export function getCustomFunctionString(fn: any): string {
  // 手動加入匿名方法的function name
  // 無法按下列這樣做，因為編譯器會把匿名方法的function name拿掉
  // (function main(){}).toString()
  return fn.toString().replace("function", "function main");
}