package game;

import game.GeneralStat;
import game.IPlayer;

/**
 * GDD 2.1.9：可被「指派武將規避」的負面事件（可選擇跳過）。
 *
 * 實作端（impl_ver1/debug_ver1）可讓事件同時 implements ITileEvent + IAvoidableTileEvent，
 * core 會在事件選單前插入一次「規避」流程。
 */
interface IAvoidableTileEvent {
  /** 是否屬負面事件（為 false 則 core 不會提供規避流程）。 */
  function isNegative():Bool;

  /** 規避判定所用之武將屬性（智/武/政/統等）。 */
  function avoidanceStat():GeneralStat;

  /** 基礎成功率（0..1）；core 會疊加武將屬性後 clamp 到 0..1。 */
  function avoidanceBaseRate():Float;

  /** 規避成功後要執行的效果（例如彈窗提示、清負面狀態等）。 */
  function onAvoided(actor:IPlayer):Void;
}

