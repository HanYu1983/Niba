package game;

/**
 * 骨架：跨回合/跨指令效果掛載點（供策略「激勵」「負面狀態」等使用）。
 * 目前僅定義形狀，不強制進入 IGeneral 介面（避免介面過重）。
 */
enum GeneralEffect {
  /** 下一次指令效果倍率（例如 1.2）。 */
  NextCommandMultiplier(multiplier:Float);

  /** 解除一個負面狀態（占位）。 */
  CleanseOneDebuff;
}

