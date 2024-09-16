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
  "getClientCommand",
  "getGlobalEffects",
];
let filterCategory = true;

export const log = (category: string, ...msg: any[]) => {
  if (filterCategory) {
    if (hideCategory.find(c => c == category)) {
      return;
    }
  }
  console.log(`[${category}] [${new Date().toLocaleTimeString()}]`, ...msg);
};
