package game;

import game.GameIds;

/**
 * 通用：指派武將前的「預覽」資料（給 UI/選單顯示用）。
 * - 成功率的定義由規則層提供（ver1 先沿用 Balance.strategySuccessRate 的型態）
 */
typedef GeneralAssignmentPreview = {
  kind:GeneralAssignmentKind,
  generalId:GeneralId,
  statUsed:GeneralStat,
  staminaCost:Int,

  /** 0..1 */
  successRate:Float,

  /** 給 UI 顯示的人類可讀摘要（避免 view 端硬組字）。 */
  summary:String,
};

