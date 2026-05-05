package game;

import game.GameIds;
import game.IJiCe;
import game.IPlayer;
import game.ITileEvent;
import game.IPlayerMenu;
import game.IJiCeMovementStepHook;
import game.IJiCeStagingPreviewRow;
import game.IBoard;
import game.IMonarch;
import game.IPlayerMenuNode;
import game.ITile;

/**
 * 賽局「唯讀」視角：狀態查詢＋選單快照生成（不得改變賽局內容）。
 *
 * 供 ViewModel/前端讀取狀態使用；任何狀態突變應由 {@link IGameMatch}（setter 介面）負責。
 */
interface IGameMatchGetter {
  /** 環狀棋盤本體。 */
  function board():IBoard;

  /**
   * 四位君主；陣列順序應與 seat 遞增一致或以契約另行說明。
   * monarchs().length 之設計語意為 4。
   */
  function monarchs():Array<IMonarch>;

  /** 當前具行動權之君主。 */
  function activeMonarch():IMonarch;

  /** 回合數（完整輪轉一圈算一回合；起始為 1）。 */
  function roundNumber():Int;

  /** 本回合是否已完成一次「移動」指令。 */
  function hasMovedThisTurn():Bool;

  /** 是否仍可使用「移動前」策略（每回合一次）。 */
  function canUseStrategyPreMove():Bool;

  /** 是否仍可使用「移動後」策略（每回合一次）。 */
  function canUseStrategyPostMove():Bool;

  /** 依君主 id 取得君主（不存在則拋錯）。 */
  function monarchById(monarchId:MonarchId):IMonarch;

  /** 依玩家（其 monarchId）查詢目前所在格索引。 */
  function pawnIndexOfPlayer(player:IPlayer):TileIndex;

  /** 依君主 id 查詢目前所在格索引。 */
  function pawnIndexOfMonarch(monarchId:MonarchId):TileIndex;

  /** 依格索引取得棋盤格（等同 {@link #board}.tileAt）。 */
  function tileAt(index:TileIndex):ITile;

  /**
   * 指定君主當下可打出的计策視圖。
   * 手牌上限、共用牌庫或冷卻堆疊由實作模型補充。
   */
  function availableJiCe(monarchId:MonarchId):Array<IJiCe>;

  /**
   * 行動切片是否已到「可收束」狀態（例如移動並完成踩點結算後為 true）。
   * 典型用途：為 true 時主選單才出現「結束／確認」類葉節點；為 false 時僅允許進行中指令（移動、計策等）。
   * 選擇 ConfirmDone 並 apply 後，實作應清回 false，以便下一回合切片重新計算。
   */
  function isActivePlayerSliceComplete():Bool;

  /** 終局語意：進行中為 {@link MatchTerminationReason.NotEnded}。 */
  function getTerminationReason():MatchTerminationReason;

  /**
   * 當前已登錄、於「移動逐步前進」每步落地後會依序呼叫的勾子（回傳為拷貝快照）。
   */
  function movementStepHooks():Array<IJiCeMovementStepHook>;

  /** 除錯／測試：踩點後待結算之事件腳本；無則 null。 */
  function forceGetPendingTileEvent():Null<ITileEvent>;

  /** 除錯／測試：移動完成但尚未落地分流時之落點索引；用於移動後策略窗口。 */
  function forceGetPendingLandingTile():Null<TileIndex>;

  /** 除錯／測試：上一個擲出的移動步數（未擲骰時為 null）。 */
  function forceGetLastRolledMoveDelta():Null<Int>;

  /** 除錯／測試：計策打出後尚待 resolveChoice 之腳本。 */
  function forceGetPendingJiCe():Null<IJiCe>;

  /** 除錯／測試：目前是否存在任何暫存（計策/休整/未來村落等）。 */
  function forceHasPendingStaging():Bool;

  /** 除錯／測試：暫存指令 registryKey；無暫存時為 null。 */
  function forceGetPendingStagingKey():Null<String>;

  /** 除錯／測試：暫存指令顯示名稱；無暫存時為 null。 */
  function forceGetPendingStagingLabel():Null<String>;

  /** 除錯／測試：暫存計策對應之武將預覽列；無暫存時為空陣列。 */
  function forceJiCeStagingPreviewRows():Array<IJiCeStagingPreviewRow>;

  /** 除錯／測試：暫存指令之預覽列（計策/休整/未來村落等共用）；無暫存時為空陣列。 */
  function forceStagingPreviewRows():Array<IJiCeStagingPreviewRow>;

  /**
   * 該索引格子為 {@link TileKind.City} 且無武將駐守時為 true；
   * 非城池或已有駐將為 false。
   */
  function cityVacantNoGarrison(at:TileIndex):Bool;

  /** 除錯／測試：踩中空城後待進駐表單結算時為該格索引；否則 null。 */
  function forceGetPendingEmptyCityOccupyTile():Null<TileIndex>;

  /** 除錯／測試：城池格累計進駐兵力（無紀錄為 0）。 */
  function forceGetCityStoredTroops(at:TileIndex):Int;

  /** 除錯／測試：城池格累計進駐糧食（無紀錄為 0）。 */
  function forceGetCityStoredGrain(at:TileIndex):Int;

  /** 除錯／測試：該城池格駐守武將 id 列表（無則空陣列）。 */
  function forceGetCityGarrisonGeneralIds(at:TileIndex):Array<GeneralId>;

  /** 除錯／測試：踩中我方城池後尚待「結束拜訪」時為該格索引；否則 null。 */
  function forceGetPendingFriendlyCityVisitTile():Null<TileIndex>;

  /** 除錯／測試：踩中村落格後，尚待完成互動指令時為該格索引；否則 null。 */
  function forceGetPendingVillageTile():Null<TileIndex>;

  /** 除錯／測試：踩中非友方且有駐軍城池後之多階段對峙尚未結束時為該格索引；否則 null。 */
  function forceGetPendingHostileCityTile():Null<TileIndex>;

  /** 除錯／測試：敵城對峙流程階段（字串）；無 pending 時為 null。 */
  function forceGetHostileCityFlowPhase():Null<String>;

  /** 除錯／測試：結算階段攻方節點標題所用之預算文案；非該階段時為 null。 */
  function forceGetHostileCitySettlementSummary():Null<String>;

  /** 該城格 {@link TileKind.City} 之屬主為當前行動君主時為 true。 */
  function cityOwnedByActiveMonarch(at:TileIndex):Bool;

  /**
   * 依當前賽局×操作者建立主選單快照（移動／計策／狀態／確認等）。
   * 賽局狀態變更後須重新呼叫，不得假定與賽局隱式同步。
   */
  function createPlayerMenu(actor:IPlayer):IPlayerMenu;
}

