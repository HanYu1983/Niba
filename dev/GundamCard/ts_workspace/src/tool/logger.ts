const hideCategory: string[] = [
  "updateCommand",
  "getTip",
  "recurRequire",
  "getTargetType",
  "triggerTextEvent",
  "doConditionTarget",
  "updateEffect",
  "initJsonfp",
  "doRequireTargetActionTarget",
  "doRequireTargetAction",
  "getAbsoluteBaSyou",
  "assertTargetTypeValueLength",
  "applyFlow",
];
let filterCategory = true;

export const log2 = (category: string, ...msg: any[]) => {
  if (filterCategory) {
    if (hideCategory.includes(category)) {
      return;
    }
  }
  console.log(`[${category}] [${new Date().toLocaleTimeString()}]`, ...msg);
};
