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

  // TODO(game-error): 建議新增 error code（例如 enum GameErrorCode）：
  // - 讓 UI 可用 code 做在地化/一致文案（而不是依 message 字串比對）
  // - 讓測試可 assert code，而非 assert message
  //
  // TODO(game-error): 可提供一些靜態建構子（例如 GameError.insufficientGold(required, current)）
  // 讓 core 不必重複拼字串/ctxKey，並避免文案散落。
}

