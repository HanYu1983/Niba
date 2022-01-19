const hideCategory = [
  //"updateCommand",
  //"getTip",
  "recurRequire",
  "getTargetType",
  "triggerTextEvent",
];
let filterCategory = true;

export const log = (category: string, msg: any) => {
  if (filterCategory) {
    if (hideCategory.includes(category)) {
      return;
    }
  }
  console.log(`[${category}] [${new Date().toLocaleTimeString()}]`, msg);
};
