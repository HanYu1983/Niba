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

  public function new(message:String, ?popupTitle:String = "操作失敗", ?ctxKey:String = "game-error") {
    super(message);
    this.popupTitle = popupTitle;
    this.ctxKey = ctxKey;
  }
}

