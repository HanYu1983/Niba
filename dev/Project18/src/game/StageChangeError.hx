package game;

/**
 * 狀態變更錯誤：
 * - 用於「buildPlayerMenu 與 resolveChoice 間狀態變動」導致當下提交不再合法的情境
 * - 目的：讓 UI/測試/紀錄可用型別區分此類「可重試」彈窗，避免與一般規則拒絕混在一起
 */
class StageChangeError extends GameError {
  public function new(message:String, ?ctxKey:String = "state-changed", ?code:Null<String> = "STATE_CHANGED") {
    super(message, "狀態已變更", ctxKey, code);
  }
}

