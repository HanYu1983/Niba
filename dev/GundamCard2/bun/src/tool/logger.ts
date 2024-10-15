const hideCategory: string[] = [
  "triggerEvent",
  "getPlayEffects",
  "getConditionTitleFn",
  "doEffect",
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
  "doItemSetRollState",
  "doActiveEffect",
  //"testCompress",
  "createPlayerScore",
  "AppContextProvider",
  "OnClickFlowConfirm",
  "OnViewModel",
  "onCardChange",
  "onActionStart",
  "onActionEnd",
  "onItemAdd",
  //
  "onSetPhase",
  "onItemStateChange",
  "onItemStateDestroyReasonChange",
  "onAddImmediateEffect",
  "onEvent",
  "onEffectStart",
  "onEffectEnd",
  "onItemMove",
  // 
  "createTextsFromSpecialEffect",
  "getCardIdsCanPayRollCost",
  "getCardIdsCanPayRollColor",
  "getCardHasSpeicalEffect",
  "getCardTexts",
  "getCardSpecialText",
  "getCardBattlePoint",
  "getCardTotalCostLength",
  "createPlayCommandText",
  "createPlayCardConditions",
  "createPlayCardEffect",
  "doItemMove",
  "createPlayCharacterOperationEffect",
  "createPlayStayEffect",
  "createPlayUnitEffect",
  "getGlobalEffects",
  "createAllCardTexts",
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
