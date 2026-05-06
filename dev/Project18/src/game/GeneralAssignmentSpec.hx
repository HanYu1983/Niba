package game;

import game.GameIds;

/**
 * 通用：一次「指派武將」的規格（此處只描述意圖與成本，不含隨機）。
 * - kind 決定語意（資源加成/事件規避/...）
 * - statUsed 決定主要判定維度（如智力/統率/政治/武力）
 */
typedef GeneralAssignmentSpec = {
  kind:GeneralAssignmentKind,
  generalId:GeneralId,
  statUsed:GeneralStat,
  staminaCost:Int,
};

