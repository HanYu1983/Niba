package game;

import game.IPlayerMenuEntry;

/**
 * AI 建議（純資料、無副作用）：
 * - 由 match（全息狀態）+ 當下 menu 快照推導
 * - 交由 ViewModel/Controller 套用表單值後呼叫 applyMenuLeaf
 */
typedef AiDecision = {
  /** 節點定位：以「rootNodes/children 的索引路徑」定位到某個 IPlayerMenuNode。 */
  var nodePath:Array<Int>;

  /** 若需點擊表單 Button（如 StagingSubmit），指定該 entry 的 kind+token；否則可為 null（代表用 node.leaf）。 */
  var activation:Null<AiActivation>;

  /** 表單填值修補。 */
  var widgetPatches:Array<AiWidgetPatch>;
}

typedef AiActivation = {
  var kind:PlayerMenuKind;
  var decisionToken:Null<String>;
}

enum AiWidgetPatch {
  SetSlider(widgetIndex:Int, value:Int);
  SetGeneralMultiPick(widgetIndex:Int, ids:Array<String>);
  SetMonarchSinglePick(widgetIndex:Int, ids:Array<String>);
  SetTileSinglePick(widgetIndex:Int, idxs:Array<Int>);
}

