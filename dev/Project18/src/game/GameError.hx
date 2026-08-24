package game;

import haxe.Exception;

/**
 * 遊戲專用錯誤：代表「可預期且可回饋給玩家」的規則拒絕。
 *
 * - 只用於遊戲規則/資源不足/選擇不合法等情境
 * - 不用於程式 bug（null、越界、unmatched patterns 等），那些應直接拋出以利除錯
 */
class GameError extends Exception {
  public var popupTitle(default, null):String;
  public var ctxKey(default, null):String;
  /** 穩定代碼（給 UI/測試使用）；可為 null 代表未分類。 */
  public var code(default, null):Null<String>;

  public function new(message:String, ?popupTitle:String = "操作失敗", ?ctxKey:String = "game-error", ?code:Null<String> = null) {
    super(message);
    this.popupTitle = popupTitle;
    this.ctxKey = ctxKey;
    this.code = code;
  }

  // NOTE(game-error): 建議 UI 優先依 code 呈現一致文案（避免依 message 字串比對）。
  // NOTE(game-error): 若日後需要更強型別，可再抽 enum（或 union）取代 String code。

  public static inline function insufficientGold(required:Int, current:Int, ?ctxKey:String = "economy/insufficient-gold"):GameError {
    return new GameError("金錢不足（需要 " + required + "，目前 " + current + "）。", "資源不足", ctxKey, "INSUFFICIENT_GOLD");
  }

  public static inline function insufficientGrain(required:Int, current:Int, ?ctxKey:String = "economy/insufficient-grain"):GameError {
    return new GameError("糧食不足（需要 " + required + "，目前 " + current + "）。", "資源不足", ctxKey, "INSUFFICIENT_GRAIN");
  }

  public static inline function insufficientTroops(required:Int, current:Int, ?ctxKey:String = "economy/insufficient-troops"):GameError {
    return new GameError("兵力不足（需要 " + required + "，目前 " + current + "）。", "資源不足", ctxKey, "INSUFFICIENT_TROOPS");
  }
}

