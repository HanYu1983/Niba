const hideCategory: string[] = [
  "triggerEvent",
  "getPlayEffects",
  "getConditionTitleFn",
  //"doEffect",
  //"applyFlow",
  "handleAttackDamage",
  "getGlobalEffects",
  "getEffectTips",
  "createEffectTips",
  "getActionTitleFn"
];
let filterCategory = true;

export const logCategory = (category: string, ...msg: any[]) => {
  if (filterCategory) {
    if (hideCategory.find(c => c == category)) {
      return;
    }
  }
  console.log(`[${new Date().toLocaleTimeString()}][${category}]`, ...msg);
};
