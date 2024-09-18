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
  "getPlayEffects",
  "getGlobalEffects",
];
let filterCategory = true;

export const log = (category: string, ...msg: any[]) => {
  if (filterCategory) {
    if (hideCategory.find(c => c == category)) {
      return;
    }
  }
  console.log(`[${new Date().toLocaleTimeString()}][${category}]`, ...msg);
};
