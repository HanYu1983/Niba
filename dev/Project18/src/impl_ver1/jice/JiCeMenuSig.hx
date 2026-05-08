package impl_ver1.jice;

import game.GameError;
import impl_ver1.util.Deterministic;

/**
 * JiCe 表單一致性簽章（menu snapshot sig）：
 * - 目的：在 resolveChoice 區分「狀態改變導致不合法」vs「流程/組裝 bug 或提交被竄改」。
 * - 注意：sig mismatch 不是一票否決；只在「當下不合法」時作為歸因依據。
 *
 * 實作策略：
 * - sig 用 deterministic hash（可重現、字串短）
 * - sig 僅建議涵蓋「會影響合法目標集合/可用性的硬依賴」，避免無關狀態造成大量 mismatch
 */
class JiCeMenuSig {
  public static inline var TOKEN_PREFIX = "sig=";

  /** 由一組片段組出 sig 字串（回傳短字串，適合塞 decisionToken）。 */
  public static function make(parts:Array<String>):String {
    var raw = parts.join("|");
    var u = Deterministic.hash01("menusig|" + raw);
    // 0..999999999 的整數字串（短且足夠區分）
    var n = Std.int(Math.floor(u * 1000000000));
    if (n < 0) n = 0;
    if (n > 999999999) n = 999999999;
    return Std.string(n);
  }

  /**
   * 將 sig 附加到 decisionToken（可含既有 token，例如 "fire_ok"）。
   * 格式："<base>|sig=<n>"
   */
  public static function attach(base:Null<String>, sig:String):String {
    var b = base != null ? base : "";
    // 避免重複附加
    var existing = parseSig(b);
    if (existing != null)
      return b;
    return (b.length > 0 ? (b + "|") : "") + TOKEN_PREFIX + sig;
  }

  /** 從 decisionToken 解析出 sig；解析不到回傳 null。 */
  public static function parseSig(token:Null<String>):Null<String> {
    if (token == null || token.length == 0)
      return null;
    var parts = token.split("|");
    for (p in parts)
      if (p != null && p.indexOf(TOKEN_PREFIX) == 0)
        return p.substr(TOKEN_PREFIX.length);
    return null;
  }

  /** 常用：sig mismatch 時的使用者提示。 */
  public static function stateChangedError(msg:String, ctxKey:String):GameError {
    return new GameError(msg, "狀態已變更", ctxKey);
  }
}

