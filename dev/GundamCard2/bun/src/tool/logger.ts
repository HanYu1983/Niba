const hideCategory: string[] = [
  "triggerEvent",
  "getPlayEffects",
  "getConditionTitleFn",
  //"doEffect",
  "applyFlow",
  "handleAttackDamage",
  "getGlobalEffects",
  "getEffectTips",
  "createEffectTips",
  "getActionTitleFn",
  "getLogicTreeActionConditions",
  "createCommandEffectTips",
  "setEffectTips",
  "doTriggerEvent",
  "createPlayEffects",
  "getConditionTitleFn",
  "createPlayCardEffects",
  "addImmediateEffectIfCanPayCost",
  //"testCompress",
  // "onAddImmediateEffect",
  // "onSetPhase",
  // "onEvent",
  // "onEffectStart",
  // "onEffectEnd",
  // "onActionStart",
  // "onActionEnd",
  // "onItemMove",
  // "onItemAdd",
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
