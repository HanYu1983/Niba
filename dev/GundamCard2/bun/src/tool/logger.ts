const hideCategory: string[] = [
  "triggerEvent",
  "getPlayEffects",
  "getConditionTitleFn",
  //"doEffect",
  //"applyFlow",
  "handleAttackDamage",
  "getGlobalEffects",
  "getEffectTips",
];
let filterCategory = true;

export const logCategory = (category: string, ...msg: any[]) => {
  return
  if (filterCategory) {
    if (hideCategory.find(c => c == category)) {
      return;
    }
  }
  console.log(`[${new Date().toLocaleTimeString()}][${category}]`, ...msg);
};
