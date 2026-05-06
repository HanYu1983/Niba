package impl_ver1.core;

import game.GameIds;
import game.IBoard;
import game.IGameMatch;
import game.MatchTerminationReason;
import game.IGeneral;
import game.IJiCe;
import game.IJiCeMovementStepHook;
import game.IJiCeStagingPreviewRow;
import game.IMonarch;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.IStagingAction;
import game.ITile;
import game.ITileEvent;
import game.IPlayerCommand;
import game.Balance;
import game.IEquipment;
import game.IPopupMessage;
import game.MenuClientConfirm;
import game.MenuActivation;
import game.MenuGeneralChoice;
import game.MenuFormWidget;
import game.PopupAudience;
import game.PopupOption;
import game.PopupPayload;
import game.PlayerMenuKind;
import game.StrategyPhase;
import game.TileKind;
import game.CityLevel;
import impl_ver1.commands.Ver1MainCommands;
import impl_ver1.flows.HostileCityPhase;
import impl_ver1.jice.JiCeRegistry;
import impl_ver1.model.Board;
import impl_ver1.model.General;
import impl_ver1.model.Monarch;
import impl_ver1.model.Player;
import impl_ver1.model.PlayerMenu;
import impl_ver1.model.PlayerMenuEntry;
import impl_ver1.model.PlayerMenuNode;
import impl_ver1.model.PopupMessage;
import impl_ver1.model.Tile;
import impl_ver1.equipment.WeaponCatalog;
import impl_ver1.rules.GameMatchVer1Ops;
import impl_ver1.staging.FriendlyCityDevelopStagingAction;
import impl_ver1.staging.FriendlyCityRestStagingAction;
import impl_ver1.staging.JiCeStagingAction;
import impl_ver1.staging.RestStagingAction;
import impl_ver1.staging.VillageConquerStagingAction;
import impl_ver1.staging.VillagePlunderStagingAction;
import impl_ver1.staging.VillageTradeStagingAction;

/**
 * Ver1 賽局核心：終局／「移動」葉委派 {@link GameMatchVer1Ops}（傳入 {@code this}，不靠建構注入）。
 * 友元見 {@literal @:allow(impl_ver1)}。
 */
@:allow(impl_ver1)
class GameMatchCore implements IGameMatch {
  public static inline var DEFAULT_MOVE_DELTA = 3;
  public static inline var DICE_MIN = 1;
  public static inline var DICE_MAX = 6;

  // ========== 私有欄位（依狀態分區，後續重構時維持對應私有方法區塊）==========

  /** --- 棋盤 --- */
  var _board:Board;

  /** --- 君主列、當前行動方、行動切片、終局 --- */
  var _monarchs:Array<Monarch>;
  var _activeId:MonarchId;
  var _roundNumber:Int;
  var _hasMovedThisTurn:Bool;
  var _strategyPreUsed:Bool;
  var _strategyPostUsed:Bool;
  var _pendingStrategyPhase:Null<StrategyPhase>;
  var _activeSliceComplete:Bool;
  var _terminationReason:MatchTerminationReason;

  /** --- 環上格子事件綁定與落地 pending --- */
  var _tileEventByIndex:Map<Int, ITileEvent>;
  var _pendingTileEvent:Null<ITileEvent>;

  /** --- 彈窗 outbox（apply 產生、view 消費）--- */
  var _popupSeq:Int;
  var _popupsByMonarchId:Map<MonarchId, Array<IPopupMessage>>;

  /** 移動完成但尚未「落地分流」時，暫存落點索引（用於移動後策略窗口）。 */
  var _pendingLandingTileIndex:Null<TileIndex>;

  /** --- 計策暫存與君主所持牌 --- */
  var _pendingStaging:Null<IStagingAction>;
  var _stagingPreviewRows:Array<IJiCeStagingPreviewRow>;
  var _ownedJiCe:Map<MonarchId, Array<IJiCe>>;

  /** --- 移動逐步結算：已登錄之計策／場地效果勾子 --- */
  var _movementStepHooks:Array<IJiCeMovementStepHook>;

  /** --- 移動：骰點/步數規剘骨架 --- */
  var _fixedMoveDelta:Null<Int>;
  var _lastRolledMoveDelta:Null<Int>;

  /** --- 城池：駐軍、儲備、屬主；踩中空城／我方城 pending --- */
  /** 城池格索引 → 駐守武將 id 列表；無鍵或空陣列視為無駐將（空城語意）。 */
  var _cityGarrisonGenerals:Map<Int, Array<GeneralId>>;
  var _cityStockTroops:Map<Int, Int>;
  var _cityStockGrain:Map<Int, Int>;
  var _pendingEmptyCityTileIndex:Null<TileIndex>;
  var _cityOwner:Map<Int, MonarchId>;
  var _cityLevel:Map<Int, CityLevel>;
  var _pendingFriendlyCityTileIndex:Null<TileIndex>;

  /** --- 村落互動 pending（交易/搶奪/攻占）--- */
  var _pendingVillageTileIndex:Null<TileIndex>;
  /** 村落格索引 →（君主 id → 友好度 0~100）。 */
  var _villageFriendly:Map<Int, Map<MonarchId, Int>>;

  /** --- 武將格/商店格 pending（骨架）--- */
  var _pendingGeneralTileIndex:Null<TileIndex>;
  var _pendingShopTileIndex:Null<TileIndex>;

  /** 武將格：本次落地的招募清單（程序化生成；離開格子或招募後刷新）。 */
  var _generalOffersByTile:Map<Int, Array<GeneralRecruitOffer>>;

  /** 商店格：本次落地的商品清單（程序化生成；購買後從清單移除）。 */
  var _shopStocksByTile:Map<Int, Array<ShopStockItem>>;

  /** --- 策略（指定格子）暫存效果骨架 --- */
  // TODO(strategy): 目前僅存放「下回合加成」等占位資料；需定義：
  // - 加成何時結算（回合開始？落地結算？指令結算？）
  // - 加成如何消耗/衰減（僅一次/維持 N 回合）
  // - 與城池等級/產出模型整合（目前尚無 gold/城等級資料）
  var _tileNextTurnGrainBonus:Map<Int, Int>;
  var _tileNextTurnGoldBonus:Map<Int, Int>;
  var _tileDefenseBonus:Map<Int, Float>;

  /** --- 起點獎勵骨架 --- */
  static inline var START_TILE_INDEX:TileIndex = 0;

  /** --- 敵城對峙多階段 --- */
  var _pendingHostileCityTileIndex:Null<TileIndex>;
  var _hostileCityPhase:Null<HostileCityPhase>;
  var _hostileCityAttackerId:MonarchId;
  var _hostileCityDefenderId:MonarchId;
  var _hostileCityAwaitingDuel:Bool;
  var _hostileCityAttackerChoiceToken:String;
  var _hostileCityAttackerGeneralIds:Array<GeneralId>;
  var _hostileCityDefenderGeneralId:Null<GeneralId>;
  var _hostileCitySettlementSummary:String;

  public function new() {
    _board = cast null;
    _monarchs = [];
    _activeId = "";
    _roundNumber = 1;
    _hasMovedThisTurn = false;
    _strategyPreUsed = false;
    _strategyPostUsed = false;
    _pendingStrategyPhase = null;
    _activeSliceComplete = false;
    _terminationReason = NotEnded;
    _tileEventByIndex = new Map();
    _pendingTileEvent = null;
    _popupSeq = 0;
    _popupsByMonarchId = new Map();
    _pendingLandingTileIndex = null;
    _pendingStaging = null;
    _ownedJiCe = new Map();
    _cityGarrisonGenerals = new Map();
    _cityStockTroops = new Map();
    _cityStockGrain = new Map();
    _pendingEmptyCityTileIndex = null;
    _cityOwner = new Map();
    _cityLevel = new Map();
    _pendingFriendlyCityTileIndex = null;
    _pendingVillageTileIndex = null;
    _pendingGeneralTileIndex = null;
    _pendingShopTileIndex = null;
    _generalOffersByTile = new Map();
    _shopStocksByTile = new Map();
    _villageFriendly = new Map();
    _tileNextTurnGrainBonus = new Map();
    _tileNextTurnGoldBonus = new Map();
    _tileDefenseBonus = new Map();
    _movementStepHooks = [];
    _fixedMoveDelta = null;
    _lastRolledMoveDelta = null;
    clearHostileCityConfrontation();
    clearStaging();
  }

  /** 規剘：擲骰（1~6）取得本次移動步數。 */
  public function rollMoveDelta():Int {
    if (_fixedMoveDelta != null) {
      _lastRolledMoveDelta = _fixedMoveDelta;
      return _fixedMoveDelta;
    }
    var d = Std.random(DICE_MAX) + DICE_MIN;
    _lastRolledMoveDelta = d;
    return d;
  }

  /** 測試/除錯：固定每次移動骰點（設為 null 代表恢復隨機）。 */
  public function forceSetFixedMoveDelta(delta:Null<Int>):Void {
    if (delta == null) {
      _fixedMoveDelta = null;
      return;
    }
    if (delta < DICE_MIN || delta > DICE_MAX)
      throw "GameMatchCore.forceSetFixedMoveDelta: delta out of range";
    _fixedMoveDelta = delta;
  }

  /** 除錯/UI：上一個擲出的移動步數（尚未擴充到 IGameMatchGetter）。 */
  public function forceGetLastRolledMoveDelta():Null<Int>
    return _lastRolledMoveDelta;

  /** 規剘：經過起點給予獎勵（骨架：以 prestige 分三段）。 */
  public function onPassStartTile(ruler:Monarch):Void {
    // 先用簡化規剘：高/中/低聲望三段獎勵（之後可搬到 Balance 或資料表）
    var p = ruler.prestige();
    if (p >= 70) {
      ruler.grantGold(200);
      ruler.grantGrain(100);
      ruler.grantTroops(100);
    } else if (p >= 40) {
      ruler.grantGold(100);
      ruler.grantGrain(100);
    } else {
      ruler.grantGold(50);
    }
  }

  function clearStaging():Void {
    _pendingStaging = null;
    _stagingPreviewRows = ([] : Array<IJiCeStagingPreviewRow>);
    _pendingStrategyPhase = null;
  }

  // ========== 私有行為（依欄位分組；公開方法與友元僅委派至此）==========

  // --- 格子事件綁定 ---
  private function tileEventBind(at:TileIndex, handler:ITileEvent):Void {
    _tileEventByIndex.set(at, handler);
  }

  // --- 棋盤（單例安裝）---
  private function boardInstallOnce(tiles:Array<ITile>):IBoard {
    if (_board != null)
      throw "GameMatchCore.createBoard: board already set";
    var b = new Board(tiles);
    _board = b;
    return b;
  }

  // --- 暫存（staging）寫入／友元讀取用（不將欄位暴露給套件外）---
  private function stagingEnterJiCe(card:IJiCe):Void {
    _pendingStaging = new JiCeStagingAction(this, card);
    _stagingPreviewRows = ([] : Array<IJiCeStagingPreviewRow>);
  }

  /** 與暫存選單建構同步：直接回傳暫存列（勿在暫存期外依賴其內容）。 */
  private function stagingPreviewRowsLive():Array<IJiCeStagingPreviewRow>
    return _stagingPreviewRows;

  private function stagingMatchesJiCe(card:IJiCe):Bool {
    if (_pendingStaging == null)
      return false;
    var c = _pendingStaging.asJiCe();
    return c != null && c == card;
  }

  private function stagingPredictedTroopLossForGeneralOrThrow(gid:GeneralId):Int {
    for (r in _stagingPreviewRows)
      if (r.generalId() == gid)
        return r.predictedTroopLoss();
    throw 'GameMatchCore: unknown general $gid in staging rows';
  }

  private function monarchTroopCount(mid:MonarchId):Int
    return monarchWithId(mid).troops();

  private function monarchApplyTroopLoss(mid:MonarchId, loss:Int):Void
    monarchWithId(mid).reduceTroops(loss);

  // --- 城池圖資：進駐／調度結果寫回（君主池已由規剘扣除或加回）---
  private function cityMapsDepositOccupy(
    tileIndex:TileIndex,
    ownerMonarchId:MonarchId,
    troops:Int,
    grain:Int,
    garrisonIds:Array<GeneralId>
  ):Void {
    var prevT = _cityStockTroops.exists(tileIndex) ? _cityStockTroops.get(tileIndex) : 0;
    var prevG = _cityStockGrain.exists(tileIndex) ? _cityStockGrain.get(tileIndex) : 0;
    _cityStockTroops.set(tileIndex, prevT + troops);
    _cityStockGrain.set(tileIndex, prevG + grain);
    _cityOwner.set(tileIndex, ownerMonarchId);
    _cityGarrisonGenerals.set(tileIndex, garrisonIds.copy());
  }

  private function cityMapsApplyFriendlyDispatchTargets(tileIndex:TileIndex, targetTroops:Int, targetGrain:Int):Void {
    _cityStockTroops.set(tileIndex, targetTroops);
    _cityStockGrain.set(tileIndex, targetGrain);
  }

  // --- 落地 surface：清空事件／空城／友城 pending 並重置敵城對峙 ---
  private function landingClearSurfacePendings():Void {
    _pendingTileEvent = null;
    _pendingEmptyCityTileIndex = null;
    _pendingFriendlyCityTileIndex = null;
    _pendingVillageTileIndex = null;
    _pendingGeneralTileIndex = null;
    _pendingShopTileIndex = null;
    hostileCityResetAll();
  }

  private function landingArmPendingTileEventAt(idx:TileIndex):Void {
    _pendingTileEvent = _tileEventByIndex.get(idx);
  }

  /** 君主踩在 {@link game.TileKind.City}：依屬主／空城／駐軍決定 pending（語意集中於此）。 */
  private function landingResolveCityTile(idx:TileIndex):Void {
    if (_cityOwner.exists(idx) && _cityOwner.get(idx) == activeMonarch().id())
      _pendingFriendlyCityTileIndex = idx;
    else if (_cityOwner.exists(idx) && !cityVacantNoGarrison(idx))
      hostileCityEnterConfrontationAt(idx);
    else if (cityVacantNoGarrison(idx))
      _pendingEmptyCityTileIndex = idx;
  }

  // --- 敵城對峙 ---
  private function hostileCityResetAll():Void {
    _pendingHostileCityTileIndex = null;
    _hostileCityPhase = null;
    _hostileCityAttackerId = "";
    _hostileCityDefenderId = "";
    _hostileCityAwaitingDuel = false;
    _hostileCityAttackerChoiceToken = "";
    _hostileCityAttackerGeneralIds = [];
    _hostileCityDefenderGeneralId = null;
    _hostileCitySettlementSummary = "";
  }

  private function hostileCityEnterConfrontationAt(idx:TileIndex):Void {
    if (!_cityOwner.exists(idx))
      throw "GameMatchCore.hostileCityEnterConfrontationAt: city has no owner";
    _pendingHostileCityTileIndex = idx;
    _hostileCityPhase = AttackerChoosing;
    _hostileCityAttackerId = activeMonarch().id();
    _hostileCityDefenderId = _cityOwner.get(idx);
    _hostileCityAwaitingDuel = false;
    _hostileCityAttackerChoiceToken = "";
    _hostileCityAttackerGeneralIds = [];
    _hostileCityDefenderGeneralId = null;
    _hostileCitySettlementSummary = "";
  }

  private function hostileCityRecordAttackerChoice(tok:String, picks:Array<GeneralId>):Void {
    _hostileCityAttackerChoiceToken = tok;
    _hostileCityAttackerGeneralIds = picks.copy();
    _hostileCityAwaitingDuel = tok == "duel";
    _hostileCityPhase = DefenderResponse;
  }

  /** 依暫存攻方選項與將面組結算摘要文案。 */
  private function hostileCityComputeSettlementSummaryText():String {
    var tileIdx = _pendingHostileCityTileIndex != null ? _pendingHostileCityTileIndex : -1;
    var tok = _hostileCityAttackerChoiceToken;
    var atkG = _hostileCityAttackerGeneralIds.length > 0 ? _hostileCityAttackerGeneralIds[0] : "(無)";
    switch tok {
      case "pay_toll":
        return '結算：過路費已付｜城池格 $tileIdx';
      case "negotiate":
        return '結算：談判（攻將 $atkG）｜協議草案已備';
      case "attrition":
        return '結算：消耗戰（攻將 $atkG）｜損耗預估完成';
      case "siege":
        return '結算：攻城戰（攻將 $atkG）｜城防推演完成';
      case "duel":
        var defG = _hostileCityDefenderGeneralId != null ? _hostileCityDefenderGeneralId : "?";
        return '結算：單挑（攻將 $atkG vs 守將 $defG）｜勝負已裁定';
      default:
        throw 'GameMatchCore.hostileCityComputeSettlementSummaryText: 未知選項 $tok';
    }
  }

  private function hostileCityPublishSettlementPreview():Void {
    _hostileCitySettlementSummary = hostileCityComputeSettlementSummaryText();
    _hostileCityPhase = AttackerSettlement;
  }

  public function movementStepHooks():Array<IJiCeMovementStepHook>
    return _movementStepHooks.copy();

  /** 規剘：登錄移動逐步勾子（正式 API；非 force）。 */
  public function registerMovementStepHook(h:IJiCeMovementStepHook):Void {
    for (x in _movementStepHooks)
      if (x == h)
        return;
    _movementStepHooks.push(h);
  }

  public function forceRegisterMovementStepHook(h:IJiCeMovementStepHook):Void {
    // TODO(convention): force* 僅供測試/除錯使用；正式規剘請改呼叫 registerMovementStepHook。
    registerMovementStepHook(h);
  }

  /** 規剘：移除先前登錄之勾子（正式 API；非 force）。 */
  public function unregisterMovementStepHook(h:IJiCeMovementStepHook):Void {
    var i = _movementStepHooks.length;
    while (i-- > 0)
      if (_movementStepHooks[i] == h)
        _movementStepHooks.splice(i, 1);
  }

  public function forceUnregisterMovementStepHook(h:IJiCeMovementStepHook):Void {
    // TODO(convention): force* 僅供測試/除錯使用；正式規剘請改呼叫 unregisterMovementStepHook。
    unregisterMovementStepHook(h);
  }

  /** 關卡/規剘：將事件腳本綁至環上索引（正式 API；非 force）。 */
  public function bindTileEvent(at:TileIndex, handler:ITileEvent):Void {
    tileEventBind(at, handler);
  }

  public function forceBindTileEvent(at:TileIndex, handler:ITileEvent):Void {
    // TODO(convention): force* 僅供測試/除錯使用；正式規剘請改呼叫 bindTileEvent。
    bindTileEvent(at, handler);
  }

  public function createTile(index:TileIndex, kind:TileKind):ITile
    return new Tile(index, kind);

  public function createBoard(tiles:Array<ITile>):IBoard
    return boardInstallOnce(tiles);

  public function createGeneral(id:GeneralId, owner:MonarchId, command:Int, might:Int, wit:Int, stewardship:Int):IGeneral {
    var gen = new General(id, owner, command, might, wit, stewardship);
    monarchWithId(owner).addGeneral(gen);
    return gen;
  }

  /**
   * docs/裝備系統.md：裝備裝上不可拆下。
   * ver1 暫提供 force API，供 demo/測試/關卡組立注入武器。
   */
  public function forceEquipWeaponByName(generalId:GeneralId, equipmentId:EquipmentId, weaponName:String, ?price:Int):Void {
    var g = requireGeneral(generalId);
    var eq = WeaponCatalog.spawnByName(equipmentId, weaponName, price);
    g.addEquipment(eq);
  }

  /** demo/測試：直接注入任意裝備實例。 */
  public function forceEquipEquipment(generalId:GeneralId, eq:IEquipment):Void {
    var g = requireGeneral(generalId);
    g.addEquipment(eq);
  }

  function requireGeneral(gid:GeneralId):General {
    for (m in _monarchs)
      for (g in m.roster())
        if (g != null && g.id() == gid)
          return cast g;
    throw 'GameMatchCore: general "$gid" not found';
  }

  public function createMonarch(id:MonarchId, seat:Int, pawnIndex:TileIndex, ?troops:Int, ?grain:Int):IMonarch {
    var t = troops != null ? troops : 0;
    var g = grain != null ? grain : 0;
    var m = new Monarch(id, seat, pawnIndex, t, g);
    _monarchs.push(m);
    _ownedJiCe.set(id, []);
    _popupsByMonarchId.set(id, []);
    if (_monarchs.length == 1)
      _activeId = m.id();
    return m;
  }

  public function pendingPopups(monarchId:MonarchId):Array<IPopupMessage> {
    if (!_popupsByMonarchId.exists(monarchId))
      return [];
    return _popupsByMonarchId.get(monarchId).copy();
  }

  public function ackPopup(monarchId:MonarchId, popupId:String):Void {
    if (!_popupsByMonarchId.exists(monarchId))
      return;
    var xs = _popupsByMonarchId.get(monarchId);
    var i = xs.length;
    while (i-- > 0)
      if (xs[i] != null && xs[i].id() == popupId) {
        xs.splice(i, 1);
        return;
      }
  }

  public function pushInfoPopup(monarchId:MonarchId, title:String, payload:PopupPayload, ctxKey:String):Void {
    pushPopupToMonarch(monarchId, title, payload, Ok, ctxKey);
  }

  function pushPopupToMonarch(monarchId:MonarchId, title:String, payload:PopupPayload, option:PopupOption, ctxKey:String):String {
    if (!_popupsByMonarchId.exists(monarchId))
      _popupsByMonarchId.set(monarchId, []);
    var id = popupId(monarchId, ctxKey);
    _popupsByMonarchId.get(monarchId).push(new PopupMessage(id, ToMonarch(monarchId), title, payload, option));
    return id;
  }

  function popupId(monarchId:MonarchId, ctxKey:String):String {
    _popupSeq++;
    return "pop-" + monarchId + "-" + ctxKey + "-" + _roundNumber + "-" + _popupSeq;
  }

  function monarchWithId(mid:MonarchId):Monarch {
    for (m in _monarchs)
      if (m.id() == mid)
        return m;
    throw 'GameMatchCore: monarch "$mid" not registered';
  }

  public function createPlayer(monarchId:MonarchId, displayName:String):IPlayer
    return new Player(monarchId, displayName);

  public function createPlayerMenuEntry(kind:PlayerMenuKind, caption:String, enabled:Bool, ?decisionToken:String, ?clientConfirm:MenuClientConfirm):IPlayerMenuEntry
    return new PlayerMenuEntry(kind, caption, enabled, decisionToken, clientConfirm);

  public function createPlayerMenuNode(caption:String, leaf:Null<IPlayerMenuEntry>, children:Array<IPlayerMenuNode>, ?formWidgets:Array<MenuFormWidget>):IPlayerMenuNode
    return new PlayerMenuNode(caption, leaf, children, formWidgets);

  function requireOwnerMonarch(ownerMonarchId:MonarchId):Void {
    for (mon in _monarchs)
      if (mon.id() == ownerMonarchId)
        return;
    throw 'GameMatchCore.createJiCe: owner "$ownerMonarchId" not in monarchs';
  }

  public function createJiCe(key:JiCeKey, ownerMonarchId:MonarchId):IJiCe {
    requireOwnerMonarch(ownerMonarchId);
    var card = JiCeRegistry.spawn(this, key);
    _ownedJiCe.get(ownerMonarchId).push(card);
    return card;
  }

  public function forceGetPendingTileEvent():Null<ITileEvent>
    return _pendingTileEvent;

  public function forceGetPendingLandingTile():Null<TileIndex>
    return _pendingLandingTileIndex;

  public function forceGetPendingJiCe():Null<IJiCe>
    return _pendingStaging != null ? _pendingStaging.asJiCe() : null;

  public function forceHasPendingStaging():Bool
    return _pendingStaging != null;

  public function forceGetPendingStagingKey():Null<String>
    return _pendingStaging != null ? _pendingStaging.registryKey() : null;

  public function forceGetPendingStagingLabel():Null<String>
    return _pendingStaging != null ? _pendingStaging.designLabel() : null;

  public function forceJiCeStagingPreviewRows():Array<IJiCeStagingPreviewRow> {
    return forceStagingPreviewRows();
  }

  public function forceStagingPreviewRows():Array<IJiCeStagingPreviewRow> {
    if (_pendingStaging == null)
      return [];
    return _stagingPreviewRows.copy();
  }

  public function forceEnterJiCeStaging(card:IJiCe):Void {
    // 相容層：舊測試/除錯入口仍可用（無 actor 脈絡，因此不填 preview rows）
    stagingEnterJiCe(card);
  }

  public function cityVacantNoGarrison(at:TileIndex):Bool {
    if (_board == null)
      return false;
    var tile = _board.tileAt(at);
    if (tile.kind() != City)
      return false;
    if (!_cityGarrisonGenerals.exists(at))
      return true;
    return _cityGarrisonGenerals.get(at).length == 0;
  }

  public function forceGetPendingEmptyCityOccupyTile():Null<TileIndex>
    return _pendingEmptyCityTileIndex;

  public function forceGetCityStoredTroops(at:TileIndex):Int
    return _cityStockTroops.exists(at) ? _cityStockTroops.get(at) : 0;

  public function forceGetCityStoredGrain(at:TileIndex):Int
    return _cityStockGrain.exists(at) ? _cityStockGrain.get(at) : 0;

  public function forceGetCityLevel(at:TileIndex):CityLevel {
    if (_cityLevel.exists(at))
      return _cityLevel.get(at);
    return CityLevel.SmallCity;
  }

  public function forceSetCityLevel(at:TileIndex, level:CityLevel):Void {
    if (_board == null)
      throw "GameMatchCore.forceSetCityLevel: board not set";
    if (_board.tileAt(at).kind() != City)
      throw "GameMatchCore.forceSetCityLevel: not a City tile";
    _cityLevel.set(at, level);
  }

  function ensureVillageRow(at:TileIndex):Map<MonarchId, Int> {
    if (_villageFriendly.exists(at))
      return _villageFriendly.get(at);
    var row = new Map<MonarchId, Int>();
    for (m in _monarchs)
      row.set(m.id(), 50);
    _villageFriendly.set(at, row);
    return row;
  }

  public function forceGetVillageFriendly(at:TileIndex, monarchId:MonarchId):Int {
    if (_board == null)
      throw "GameMatchCore.forceGetVillageFriendly: board not set";
    if (_board.tileAt(at).kind() != Village)
      throw "GameMatchCore.forceGetVillageFriendly: not a Village tile";
    var row = ensureVillageRow(at);
    if (!row.exists(monarchId))
      row.set(monarchId, 50);
    return row.get(monarchId);
  }

  public function forceSetVillageFriendly(at:TileIndex, monarchId:MonarchId, friendly:Int):Void {
    if (_board == null)
      throw "GameMatchCore.forceSetVillageFriendly: board not set";
    if (_board.tileAt(at).kind() != Village)
      throw "GameMatchCore.forceSetVillageFriendly: not a Village tile";
    monarchWithId(monarchId);
    var v = Balance.clampInt(friendly, 0, 100);
    ensureVillageRow(at).set(monarchId, v);
  }

  public function forceAssignCityGarrison(at:TileIndex, generalId:GeneralId):Void {
    if (_board == null)
      throw "GameMatchCore.forceAssignCityGarrison: board not set";
    if (_board.tileAt(at).kind() != City)
      throw "GameMatchCore.forceAssignCityGarrison: not a City tile";
    _cityGarrisonGenerals.set(at, [generalId]);
  }

  /** 關卡/規剘：標記城池格已有駐守武將（正式 API；非 force）。 */
  public function assignCityGarrison(at:TileIndex, generalId:GeneralId):Void {
    forceAssignCityGarrison(at, generalId);
  }

  public function forceGetCityGarrisonGeneralIds(at:TileIndex):Array<GeneralId> {
    if (!_cityGarrisonGenerals.exists(at))
      return [];
    return _cityGarrisonGenerals.get(at).copy();
  }

  public function forceSetCityOwner(at:TileIndex, ownerMonarchId:MonarchId):Void {
    if (_board == null)
      throw "GameMatchCore.forceSetCityOwner: board not set";
    if (_board.tileAt(at).kind() != City)
      throw "GameMatchCore.forceSetCityOwner: not a City tile";
    monarchWithId(ownerMonarchId);
    _cityOwner.set(at, ownerMonarchId);
    if (!_cityLevel.exists(at))
      _cityLevel.set(at, CityLevel.SmallCity);
  }

  /** 關卡/規剘：標記城池格屬主（正式 API；非 force）。 */
  public function setCityOwner(at:TileIndex, ownerMonarchId:MonarchId):Void {
    forceSetCityOwner(at, ownerMonarchId);
  }

  public function forcePutCityStores(at:TileIndex, troops:Int, grain:Int):Void {
    if (_board == null)
      throw "GameMatchCore.forcePutCityStores: board not set";
    if (_board.tileAt(at).kind() != City)
      throw "GameMatchCore.forcePutCityStores: not a City tile";
    if (troops < 0 || grain < 0)
      throw "GameMatchCore.forcePutCityStores: negative stock";
    _cityStockTroops.set(at, troops);
    _cityStockGrain.set(at, grain);
  }

  /** 規剘：寫入城池格儲備（正式 API；非 force）。 */
  public function putCityStores(at:TileIndex, troops:Int, grain:Int):Void {
    forcePutCityStores(at, troops, grain);
  }

  public function forceGetPendingFriendlyCityVisitTile():Null<TileIndex>
    return _pendingFriendlyCityTileIndex;

  public function forceGetPendingVillageTile():Null<TileIndex>
    return _pendingVillageTileIndex;

  public function forceGetPendingGeneralTile():Null<TileIndex>
    return _pendingGeneralTileIndex;

  public function forceGetPendingShopTile():Null<TileIndex>
    return _pendingShopTileIndex;

  public function forceGetPendingHostileCityTile():Null<TileIndex>
    return _pendingHostileCityTileIndex;

  public function forceGetHostileCityAttackerId():Null<MonarchId> {
    return _hostileCityAttackerId != "" ? _hostileCityAttackerId : null;
  }

  public function forceGetHostileCityDefenderId():Null<MonarchId> {
    return _hostileCityDefenderId != "" ? _hostileCityDefenderId : null;
  }

  public function forceGetHostileCityAttackerChoiceToken():Null<String> {
    return _hostileCityAttackerChoiceToken != "" ? _hostileCityAttackerChoiceToken : null;
  }

  public function forceGetHostileCityAttackerGeneralId():Null<GeneralId> {
    return _hostileCityAttackerGeneralIds.length > 0 ? _hostileCityAttackerGeneralIds[0] : null;
  }

  public function forceGetHostileCityFlowPhase():Null<String> {
    if (_hostileCityPhase == null)
      return null;
    return switch _hostileCityPhase {
      case AttackerChoosing: "AttackerChoosing";
      case DefenderResponse: "DefenderResponse";
      case AttackerSettlement: "AttackerSettlement";
    };
  }

  public function forceGetHostileCitySettlementSummary():Null<String> {
    if (_pendingHostileCityTileIndex == null || _hostileCityPhase != AttackerSettlement)
      return null;
    return _hostileCitySettlementSummary;
  }

  public function cityOwnedByActiveMonarch(at:TileIndex):Bool {
    if (_board == null)
      return false;
    if (_board.tileAt(at).kind() != City)
      return false;
    return _cityOwner.exists(at) && _cityOwner.get(at) == activeMonarch().id();
  }

  public function forceGetCityOwner(at:TileIndex):Null<MonarchId> {
    if (_board == null)
      throw "GameMatchCore.forceGetCityOwner: board not set";
    if (_board.tileAt(at).kind() != City)
      throw "GameMatchCore.forceGetCityOwner: not a City tile";
    return _cityOwner.exists(at) ? _cityOwner.get(at) : null;
  }

  function menuChoicesFromRoster(mon:Monarch):Array<MenuGeneralChoice> {
    var out:Array<MenuGeneralChoice> = [];
    for (g in mon.roster())
      out.push({generalId: g.id(), caption: g.id()});
    return out;
  }

  function appendHostileCityMenuRoots(actor:IPlayer, roots:Array<IPlayerMenuNode>):Void {
    var idx = _pendingHostileCityTileIndex;
    if (idx == null || _hostileCityPhase == null)
      return;

    var atkId = _hostileCityAttackerId;
    var defId = _hostileCityDefenderId;

    if (actor.monarchId() == atkId && _hostileCityPhase == AttackerChoosing) {
      var atkMon = cast(monarchWithId(atkId), Monarch);
      var choices = menuChoicesFromRoster(atkMon);
      var defSel = choices.length > 0 ? [choices[0].generalId] : ([] : Array<String>);

      function optNode(caption:String, token:String, needPick:Bool):IPlayerMenuNode {
        var optLeaf = createPlayerMenuEntry(HostileCityAttackerPick, caption, true, token);
        if (!needPick)
          return createPlayerMenuNode(caption, null, ([] : Array<IPlayerMenuNode>), [Button(optLeaf)]);
        var form:Array<MenuFormWidget> = [
          GeneralMultiPick("選擇武將", choices, defSel),
          Button(optLeaf),
        ];
        return createPlayerMenuNode(caption, null, ([] : Array<IPlayerMenuNode>), form);
      }

      var atkChildren:Array<IPlayerMenuNode> = [
        optNode("付過路費", "pay_toll", false),
        optNode("談判", "negotiate", true),
        optNode("消耗戰", "attrition", true),
        optNode("攻城戰", "siege", true),
        optNode("單挑", "duel", true),
      ];
      roots.push(createPlayerMenuNode('敵城對峙（格 $idx）', null, atkChildren));
    }

    if (actor.monarchId() == defId && _hostileCityPhase == DefenderResponse) {
      if (_hostileCityAwaitingDuel) {
        var defMon = cast(monarchWithId(defId), Monarch);
        var dChoices = menuChoicesFromRoster(defMon);
        var dDef = dChoices.length > 0 ? [dChoices[0].generalId] : ([] : Array<String>);
        var duelLeaf = createPlayerMenuEntry(HostileCityDefenderPickSubmit, "確認應戰武將", true, "def_duel_pick");
        var duelForm:Array<MenuFormWidget> = [
          GeneralMultiPick("守方單挑武將", dChoices, dDef),
          Button(duelLeaf),
        ];
        roots.push(createPlayerMenuNode("守方：單挑應戰", null, ([] : Array<IPlayerMenuNode>), duelForm));
      } else {
        var ackLeaf = createPlayerMenuEntry(HostileCityDefenderAck, "確認（無單挑）", true, "def_ack");
        roots.push(createPlayerMenuNode("守方：結束", null, ([] : Array<IPlayerMenuNode>), [Button(ackLeaf)]));
      }
    }

    if (actor.monarchId() == atkId && _hostileCityPhase == AttackerSettlement) {
      var settleLeaf = createPlayerMenuEntry(HostileCitySettlementAck, "確認結算", true, "atk_settle_ok");
      roots.push(createPlayerMenuNode(_hostileCitySettlementSummary, null, ([] : Array<IPlayerMenuNode>), [Button(settleLeaf)]));
    }
  }

  function extractFirstGeneralMultiPickSelections(widgets:Array<MenuFormWidget>):Array<GeneralId> {
    for (w in widgets)
      switch w {
        case GeneralMultiPick(_, _, sel):
          return sel.copy();
        case Slider(_, _, _, _, _):
        case MonarchSinglePick(_, _, _):
        case Button(_):
        case TileSinglePick(_, _, _):
      }
    return [];
  }

  function assertGeneralOwnedBy(monarchId:MonarchId, gid:GeneralId):Void {
    var mon = cast(monarchWithId(monarchId), Monarch);
    for (g in mon.roster())
      if (g.id() == gid)
        return;
    throw 'GameMatchCore: 武將 "$gid" 非君主 $monarchId 麾下';
  }

  function handleHostileCityAttackerPick(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (_pendingHostileCityTileIndex == null || _hostileCityPhase != AttackerChoosing)
      throw "GameMatchCore: HostileCityAttackerPick 與對峙階段不符";
    var leaf = MenuActivation.activatingEntry(menuNode);
    var tok = leaf.decisionToken();
    if (tok == null)
      throw "GameMatchCore: HostileCityAttackerPick 需要 decisionToken";
    var picks = extractFirstGeneralMultiPickSelections(menuNode.formWidgets());
    switch tok {
      case "pay_toll":
        if (picks.length != 0)
          throw "GameMatchCore: 付過路費不可附帶武將選取";
      case "negotiate", "attrition", "siege", "duel":
        if (picks.length != 1)
          throw "GameMatchCore: 此攻勢選項須恰好選擇一名攻方武將";
        assertGeneralOwnedBy(_hostileCityAttackerId, picks[0]);
      default:
        throw 'GameMatchCore: 未知敵城攻方選項 $tok';
    }
    hostileCityRecordAttackerChoice(tok, picks);
    GameMatchVer1Ops.onHostileCityAttackerConfirmed(this, actor, menuNode);
    syncActiveSliceAfterMenuLeaf(HostileCityAttackerPick);
  }

  function handleHostileCityDefenderAck(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (_pendingHostileCityTileIndex == null || _hostileCityPhase != DefenderResponse)
      throw "GameMatchCore: HostileCityDefenderAck 與對峙階段不符";
    if (_hostileCityAwaitingDuel)
      throw "GameMatchCore: 單挑時不可使用守方簡認確認";
    hostileCityPublishSettlementPreview();
    GameMatchVer1Ops.onHostileCityDefenderAck(this, actor, menuNode);
    syncActiveSliceAfterMenuLeaf(HostileCityDefenderAck);
  }

  function handleHostileCityDefenderPickSubmit(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (_pendingHostileCityTileIndex == null || _hostileCityPhase != DefenderResponse)
      throw "GameMatchCore: HostileCityDefenderPickSubmit 與對峙階段不符";
    if (!_hostileCityAwaitingDuel)
      throw "GameMatchCore: 僅攻方選單挑時守方選將";
    var picks = extractFirstGeneralMultiPickSelections(menuNode.formWidgets());
    if (picks.length != 1)
      throw "GameMatchCore: 守方單挑須恰好選擇一名武將";
    assertGeneralOwnedBy(_hostileCityDefenderId, picks[0]);
    _hostileCityDefenderGeneralId = picks[0];
    hostileCityPublishSettlementPreview();
    GameMatchVer1Ops.onHostileCityDefenderDuelPickConfirmed(this, actor, menuNode);
    syncActiveSliceAfterMenuLeaf(HostileCityDefenderPickSubmit);
  }

  function handleHostileCitySettlementAck(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (_pendingHostileCityTileIndex == null || _hostileCityPhase != AttackerSettlement)
      throw "GameMatchCore: HostileCitySettlementAck 與對峙階段不符";
    var sum = _hostileCitySettlementSummary;
    var atkId = _hostileCityAttackerId;
    GameMatchVer1Ops.applyHostileCitySettlementAck(this, actor, menuNode);
    clearHostileCityConfrontation();
    pushInfoPopup(atkId, "戰鬥結果", Plain(sum), "hostile-settle");
    _activeSliceComplete = true;
    syncActiveSliceAfterMenuLeaf(HostileCitySettlementAck);
  }

  function assertHostileCityApplyActor(actor:IPlayer, kind:PlayerMenuKind):Void {
    switch kind {
      case HostileCityAttackerPick:
        if (actor.monarchId() != _hostileCityAttackerId || _hostileCityPhase != AttackerChoosing)
          throw "GameMatchCore.applyMenuLeaf: 僅攻方於攻勢選擇階段可操作 HostileCityAttackerPick";
      case HostileCityDefenderAck, HostileCityDefenderPickSubmit:
        if (actor.monarchId() != _hostileCityDefenderId || _hostileCityPhase != DefenderResponse)
          throw "GameMatchCore.applyMenuLeaf: 僅守方於守方應對階段可操作";
      case HostileCitySettlementAck:
        if (actor.monarchId() != _hostileCityAttackerId || _hostileCityPhase != AttackerSettlement)
          throw "GameMatchCore.applyMenuLeaf: 僅攻方於結算確認階段可操作 HostileCitySettlementAck";
      default:
        throw "GameMatchCore.assertHostileCityApplyActor: internal";
    }
  }

  public function createPlayerMenu(actor:IPlayer):IPlayerMenu {
    var pend = _pendingTileEvent;
    var stg = _pendingStaging;
    var stagingActive = stg != null;
    var hostilePending = _pendingHostileCityTileIndex != null;
    var ctx = actor.monarchId() + "-" + isActivePlayerSliceComplete();
    if (pend != null)
      ctx += "-evt-" + pend.registryKey();
    if (stagingActive && stg != null)
      ctx += "-stg-" + stg.registryKey();
    if (_pendingEmptyCityTileIndex != null)
      ctx += "-empty-city-" + _pendingEmptyCityTileIndex;
    if (_pendingFriendlyCityTileIndex != null)
      ctx += "-friendly-city-" + _pendingFriendlyCityTileIndex;
    if (hostilePending) {
      var phaseTag = forceGetHostileCityFlowPhase();
      ctx += "-hostile-city-" + (phaseTag != null ? phaseTag : "?");
    }
    if (_pendingGeneralTileIndex != null)
      ctx += "-general-" + _pendingGeneralTileIndex;
    if (_pendingShopTileIndex != null)
      ctx += "-shop-" + _pendingShopTileIndex;

    var roots:Array<IPlayerMenuNode> = [];

    appendHostileCityMenuRoots(actor, roots);

    if (_pendingFriendlyCityTileIndex != null) {
      var fidx = _pendingFriendlyCityTileIndex;
      var rulerF = cast(activeMonarch(), Monarch);
      var caps = GameMatchVer1Ops.friendlyCityDispatchSliderDefaults(this, fidx, rulerF);
      var dispatchApplyLeaf = createPlayerMenuEntry(FriendlyCityDispatchApply, "確認調度", true, "dispatch_apply");
      var dispatchWidgets:Array<MenuFormWidget> = [
        Slider("調度兵力（目標城池兵力）", 0, caps.maxTroopSlider, 1, caps.defTroop),
        Slider("調度糧食（目標城池糧食）", 0, caps.maxGrainSlider, 1, caps.defGrain),
        Button(dispatchApplyLeaf),
      ];
      roots.push(createPlayerMenuNode("調度", null, [], dispatchWidgets));
      roots.push(createPlayerMenuNode("開發", createPlayerMenuEntry(FriendlyCityDevelop, "開發（示範）", true, "friendly_dev"), []));
      roots.push(createPlayerMenuNode("休整", createPlayerMenuEntry(FriendlyCityRest, "休整（示範）", true, "friendly_rest"), []));
      roots.push(
        createPlayerMenuNode(
          "結束拜訪",
          createPlayerMenuEntry(FriendlyCityVisitEnd, "結束拜訪", true, "visit_end"),
          ([] : Array<IPlayerMenuNode>)
        )
      );
    }

    if (_pendingEmptyCityTileIndex != null) {
      var idx = _pendingEmptyCityTileIndex;
      var ruler = cast(activeMonarch(), Monarch);
      var choices:Array<MenuGeneralChoice> = [];
      for (g in ruler.roster()) {
        var gid = g.id();
        choices.push({generalId: gid, caption: gid});
      }
      var rosterMember = new Map<String, Bool>();
      for (g in ruler.roster())
        rosterMember.set(g.id(), true);
      var defGarrison:Array<String> = [];
      for (gid in forceGetCityGarrisonGeneralIds(idx))
        if (rosterMember.exists(gid))
          defGarrison.push(gid);
      var troopMax = ruler.troops();
      var grainMax = ruler.grain();
      var confirmLeaf = createPlayerMenuEntry(EmptyCityOccupySubmit, "確認進駐（套用表單）", true, "confirm_occupy");
      var abortLeaf = createPlayerMenuEntry(EmptyCityOccupyAbort, "離開（不放資源）", true, "abort_occupy");
      var occupyForm:Array<MenuFormWidget> = [
        GeneralMultiPick("複選駐守武將（可不選）", choices, defGarrison),
        Slider("進駐兵力（君主池扣除）", 0, troopMax, 1, 0),
        Slider("進駐糧食（君主池扣除）", 0, grainMax, 1, 0),
        Button(confirmLeaf),
        Button(abortLeaf),
      ];
      roots.push(createPlayerMenuNode('空城進駐（格 $idx）', null, [], occupyForm));
    }

    if (_pendingGeneralTileIndex != null) {
      var idx = _pendingGeneralTileIndex;
      var offers = _generalOffersByTile.exists(idx) ? _generalOffersByTile.get(idx) : [];
      var children:Array<IPlayerMenuNode> = [];
      for (o in offers) {
        var tok = o.offerId;
        var cap = '${o.displayName}｜${Std.string(o.rarity)}｜金 ${o.costGold}\n'
          + '統率 ${o.command}｜武力 ${o.might}｜智力 ${o.wit}｜政治 ${o.stewardship}';
        children.push(createPlayerMenuNode(cap, createPlayerMenuEntry(GeneralRecruit, "招募", true, tok), []));
      }
      children.push(createPlayerMenuNode("回合結束（武將格）", createPlayerMenuEntry(GeneralEndTurn, "回合結束", true, "general_end"), []));
      roots.push(createPlayerMenuNode('武將格（格 $idx）', null, children));
    }

    if (_pendingShopTileIndex != null) {
      var idx = _pendingShopTileIndex;
      var stocks = _shopStocksByTile.exists(idx) ? _shopStocksByTile.get(idx) : [];
      var ruler = cast(activeMonarch(), Monarch);
      var choices:Array<MenuGeneralChoice> = [];
      for (g in ruler.roster())
        choices.push({generalId: g.id(), caption: g.id()});
      var defSel:Array<String> = choices.length > 0 ? [choices[0].generalId] : [];

      var shopChildren:Array<IPlayerMenuNode> = [];
      for (it in stocks) {
        var eq = WeaponCatalog.spawnByName(it.stockId, it.weaponName, it.priceGold);
        var disabled = choices.length == 0 || ruler.gold() < it.priceGold;
        var leaf = createPlayerMenuEntry(ShopBuy, "購買並裝備", !disabled, it.stockId);
        var widgets:Array<MenuFormWidget> = [
          GeneralMultiPick("裝備給（需恰選 1 名武將）", choices, defSel),
          Button(leaf),
        ];
        var title = '${eq.name()}｜${Std.string(eq.rarity())}｜${Std.string(eq.bonusStat())}+${eq.bonusValue()}｜忠誠+${eq.loyaltyBonus()}｜金 ${it.priceGold}';
        shopChildren.push(createPlayerMenuNode(title, null, ([] : Array<IPlayerMenuNode>), widgets));
      }
      shopChildren.push(createPlayerMenuNode("回合結束（商店格）", createPlayerMenuEntry(ShopEndTurn, "回合結束", true, "shop_end"), []));
      roots.push(createPlayerMenuNode('商店格（格 $idx）', null, shopChildren));
    }

    if (pend != null) {
      var evRoots = pend.buildPlayerMenu(actor).rootNodes();
      roots.push(createPlayerMenuNode("事件：" + pend.registryKey(), null, evRoots));
    }

    if (stagingActive && stg != null) {
      var stgRoots = stg.buildPlayerMenu(actor).rootNodes();
      roots.push(createPlayerMenuNode("暫存：" + stg.designLabel(), null, stgRoots));
    }

    var blockBasics =
      pend != null
      || stagingActive
      || _pendingEmptyCityTileIndex != null
      || _pendingFriendlyCityTileIndex != null
      || hostilePending;
    var actions:Array<IPlayerMenuNode> = [];
    // 指令抽象：主指令由 command registry 產生（含計策列牌 children）。
    for (cmd in Ver1MainCommands.build(this, actor)) {
      var n = cmd.buildActionNode(actor);
      if (n != null)
        actions.push(n);
    }

    roots.push(createPlayerMenuNode("本回合", null, actions));
    return new PlayerMenu(actor, ctx, roots);
  }

  function syncActiveSliceAfterMenuLeaf(kind:PlayerMenuKind):Void {
    switch kind {
      case ConfirmDone:
        _activeSliceComplete = false;
        _hasMovedThisTurn = false;
        _strategyPreUsed = false;
        _strategyPostUsed = false;
        _pendingStrategyPhase = null;

      // 任一玩家操作（除 ConfirmDone 外）都視為「本回合已行動過」，因此移動後策略才可用。
      case Move, LandingContinue, JiCe, StagingSubmit, Status, StrategyPre, StrategyPost, Rest, VillageTrade, VillageConquer, VillagePlunder, VillageEndTurn, GeneralRecruit, GeneralEndTurn, ShopBuy, ShopEndTurn, FriendlyCityDevelop, FriendlyCityRest:
        _hasMovedThisTurn = true;

      // 這些 leaf 不改動 hasMovedThisTurn（但通常也不會在回合開始前出現）
      case TileEventPick,
        EmptyCityOccupySubmit,
        EmptyCityOccupyAbort,
        FriendlyCityDispatchApply,
        FriendlyCityVisitEnd,
        HostileCityAttackerPick,
        HostileCityDefenderAck,
        HostileCityDefenderPickSubmit,
        HostileCitySettlementAck:
    }
  }

  /** 子類 {@link #_applyMenuLeafForMove} 完成棋子位移後呼叫，處理落地與切片旗標。 */
  public function settleAfterMoveLanding():Void {
    // Ver2：移動後先進入「落地前」窗口（允許移動後策略一次），由 LandingContinue 再觸發 considerLandingAt。
    var ruler = cast(activeMonarch(), Monarch);
    _pendingLandingTileIndex = ruler.pawnIndex();
    _activeSliceComplete = false;
  }

  function handleLandingContinue(actor:IPlayer):Void {
    if (_pendingLandingTileIndex == null)
      throw "GameMatchCore: LandingContinue 但無 pendingLanding";
    var idx = _pendingLandingTileIndex;
    _pendingLandingTileIndex = null;
    considerLandingAt(idx);
    _activeSliceComplete =
      _pendingTileEvent == null
      && _pendingEmptyCityTileIndex == null
      && _pendingFriendlyCityTileIndex == null
      && _pendingHostileCityTileIndex == null
      && _pendingVillageTileIndex == null
      && _pendingGeneralTileIndex == null
      && _pendingShopTileIndex == null;
  }

  function clearHostileCityConfrontation():Void {
    hostileCityResetAll();
  }

  function considerLandingAt(idx:TileIndex):Void {
    landingClearSurfacePendings();
    var tile = board().tileAt(idx);
    switch tile.kind() {
      case Event:
        landingArmPendingTileEventAt(idx);
      case City:
        landingResolveCityTile(idx);
      case Village:
        // 骨架：第一次踩到某村落時，初始化每位君主友好度預設 50
        ensureVillageRow(idx);
        _pendingVillageTileIndex = idx;
      case Resource:
        landingApplyResourceTile(idx);
      case General:
        generalTileRefreshOffers(idx);
        _pendingGeneralTileIndex = idx;
      case Shop:
        shopTileRefreshStock(idx);
        _pendingShopTileIndex = idx;
      case Start:
      case Plain:
      case Battle:
      case Scheme:
    }
  }

  function landingApplyResourceTile(idx:TileIndex):Void {
    // 骨架：資源格落地直接給最小收益，避免卡在 staging/menu。
    var ruler = cast(activeMonarch(), Monarch);
    ruler.grantGold(30);
    ruler.grantGrain(30);
    pushInfoPopup(
      ruler.id(),
      "資源格收益",
      Plain('格位 ${idx}\n獲得：金錢 +30\n獲得：糧食 +30'),
      "resource-tile"
    );
    _activeSliceComplete = true;
  }

  // --- 武將格/商店格：程序化生成（先用可重現的簡易規則）---

  static inline function clampInt(x:Int, lo:Int, hi:Int):Int {
    if (x < lo)
      return lo;
    if (x > hi)
      return hi;
    return x;
  }

  static function fnv1a32(s:String):Int {
    var h:Int = 0x811C9DC5;
    for (i in 0...s.length) {
      h ^= s.charCodeAt(i);
      h = (h + (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24));
    }
    return h;
  }

  static inline function hash01(seed:String):Float {
    var h = fnv1a32(seed);
    var x = h & 0xFFFFFF;
    return x / 16777215.0;
  }

  function generalTileRefreshOffers(tileIdx:TileIndex):Void {
    var ruler = cast(activeMonarch(), Monarch);
    var seedBase = 'general|t=${tileIdx}|r=${roundNumber()}|m=${ruler.id()}';
    var count = 3 + Std.int(Math.floor(hash01(seedBase + "|n") * 3)); // 3~5
    var out:Array<GeneralRecruitOffer> = [];
    for (i in 0...count) {
      var id = 'gen-${tileIdx}-${roundNumber()}-${i}';
      var s = seedBase + "|i=" + i;
      var cmd = 10 + Std.int(Math.floor(hash01(s + "|c") * 91)); // 10..100
      var mig = 10 + Std.int(Math.floor(hash01(s + "|m") * 91));
      var wit = 10 + Std.int(Math.floor(hash01(s + "|w") * 91));
      var stw = 10 + Std.int(Math.floor(hash01(s + "|s") * 91));
      var rarity = rarityFrom01(hash01(s + "|rar"));
      var base = baseRecruitCost(rarity, cmd, mig, wit, stw);
      var finalCost = applyPrestigeRecruitModifier(ruler.prestige(), base, hash01(s + "|mod"));
      out.push({
        offerId: id,
        displayName: "武將#" + (i + 1),
        rarity: rarity,
        command: cmd,
        might: mig,
        wit: wit,
        stewardship: stw,
        costGold: finalCost,
      });
    }
    _generalOffersByTile.set(tileIdx, out);
  }

  function shopTileRefreshStock(tileIdx:TileIndex):Void {
    var ruler = cast(activeMonarch(), Monarch);
    var seedBase = 'shop|t=${tileIdx}|r=${roundNumber()}|m=${ruler.id()}';
    var count = 3 + Std.int(Math.floor(hash01(seedBase + "|n") * 3)); // 3~5
    var names = WeaponCatalog.allNames();
    var out:Array<ShopStockItem> = [];
    for (i in 0...count) {
      var pick = Std.int(Math.floor(hash01(seedBase + "|pick=" + i) * names.length));
      if (pick < 0)
        pick = 0;
      if (pick >= names.length)
        pick = names.length - 1;
      var nm = names[pick];
      var eqId:EquipmentId = 'shop-${tileIdx}-${roundNumber()}-${i}';
      var eq = WeaponCatalog.spawnByName(eqId, nm);
      // 價格再受聲望做些微調整（高聲望略便宜）；先保持可重現
      var p = applyPrestigeShopPriceModifier(ruler.prestige(), eq.price(), hash01(seedBase + "|pmod=" + i));
      out.push({
        stockId: eqId,
        weaponName: nm,
        priceGold: p,
      });
    }
    _shopStocksByTile.set(tileIdx, out);
  }

  function rarityFrom01(u:Float):game.Rarity {
    // 先用簡化分佈：Common 50%, Fine 30%, Epic 15%, Legendary 5%
    if (u < 0.50)
      return Common;
    if (u < 0.80)
      return Fine;
    if (u < 0.95)
      return Epic;
    return Legendary;
  }

  function baseRecruitCost(r:game.Rarity, c:Int, m:Int, w:Int, s:Int):Int {
    var rarityBase = switch r {
      case Common: 200;
      case Fine: 500;
      case Epic: 1200;
      case Legendary: 3000;
    };
    // 以能力總和做線性放大
    var sum = c + m + w + s;
    return rarityBase + sum * 5;
  }

  function applyPrestigeRecruitModifier(prestige:Int, base:Int, u:Float):Int {
    // 依 GDD：高聲望折扣、中聲望不變、低聲望加價；用 u 決定區間內幅度
    var mult:Float;
    if (prestige >= 70) {
      var d = 0.20 + u * 0.10; // 20%~30%
      mult = 1.0 - d;
    } else if (prestige >= 40) {
      mult = 1.0;
    } else {
      var up = 0.20 + u * 0.30; // 20%~50%
      mult = 1.0 + up;
    }
    var v = Std.int(Math.round(base * mult));
    if (v < 1)
      v = 1;
    return v;
  }

  function applyPrestigeShopPriceModifier(prestige:Int, base:Int, u:Float):Int {
    // shop 沒寫聲望折扣規則；先做「高聲望 -5%~10%，低聲望 +5%~15%」的輕微調整
    var mult:Float;
    if (prestige >= 70) {
      mult = 1.0 - (0.05 + u * 0.05);
    } else if (prestige >= 40) {
      mult = 1.0;
    } else {
      mult = 1.0 + (0.05 + u * 0.10);
    }
    var v = Std.int(Math.round(base * mult));
    if (v < 1)
      v = 1;
    return v;
  }

  function handleTileEventPick(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    var ev = _pendingTileEvent;
    if (ev == null)
      throw "GameMatchCore: TileEventPick 但無 forceGetPendingTileEvent";
    var leaf = MenuActivation.activatingEntry(menuNode);
    if (leaf.decisionToken() == null)
      throw "GameMatchCore: TileEventPick 需要 decisionToken";
    ev.resolveChoice(actor, menuNode);
    _pendingTileEvent = null;
    _activeSliceComplete = true;
  }

  function handleStagingSubmit(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    var stg = _pendingStaging;
    if (stg == null)
      throw "GameMatchCore: StagingSubmit 但無進行中之暫存";
    var phase = _pendingStrategyPhase;
    var asJiCe = stg.asJiCe();
    stg.resolveChoice(actor, menuNode);
    // docs/策略系統.md：每階段僅能提交一次（先以「提交即消耗」處理）
    if (asJiCe != null && phase != null)
      switch phase {
        case PreMove:
          _strategyPreUsed = true;
        case PostMove:
          _strategyPostUsed = true;
      }
    clearStaging();
    // 若本次 staging 發生於村落互動，提交後視為已完成落地互動，可結束切片
    if (_pendingVillageTileIndex != null) {
      _pendingVillageTileIndex = null;
      _activeSliceComplete = true;
    }
    // 於我方領地拜訪下，staging 提交後仍停留在拜訪選單（由 VisitEnd 結束）
    syncActiveSliceAfterMenuLeaf(StagingSubmit);
  }

  public function enterStaging(actor:IPlayer, action:IStagingAction, kindForSync:PlayerMenuKind):Void {
    if (_pendingStaging != null)
      throw "GameMatchCore: 已有進行中之暫存，請先完成";
    _pendingStaging = action;
    _stagingPreviewRows = action.previewRows(actor);
    syncActiveSliceAfterMenuLeaf(kindForSync);
  }

  function dedupeGeneralIds(raw:Array<String>):Array<GeneralId> {
    var seen = new Map<String, Bool>();
    var uniq:Array<GeneralId> = [];
    for (id in raw) {
      if (seen.exists(id))
        continue;
      seen.set(id, true);
      uniq.push(id);
    }
    return uniq;
  }

  function validateGarrisonAgainstRoster(uniq:Array<GeneralId>, ruler:Monarch):Void {
    var ok = new Map<String, Bool>();
    for (g in ruler.roster())
      ok.set(g.id(), true);
    for (gid in uniq)
      if (!ok.exists(gid))
        throw 'GameMatchCore: 複選駐將含非麾下武將 "$gid"';
  }

  function parseEmptyCityOccupyFromWidgets(widgets:Array<MenuFormWidget>, ruler:Monarch):{troops:Int, grain:Int, garrisonIds:Array<GeneralId>} {
    var garrisonRaw:Array<String> = [];
    var sliders:Array<Int> = [];
    for (x in widgets)
      switch x {
        case GeneralMultiPick(_, _, sel):
          garrisonRaw = sel.copy();
        case Slider(_, _, _, _, v):
          sliders.push(v);
        case MonarchSinglePick(_, _, _):
        case Button(_):
        case TileSinglePick(_, _, _):
      }
    if (sliders.length < 2)
      throw "GameMatchCore: 空城進駐節點須含 MultiPick 後至少兩個 Slider（兵力／糧食）";
    var tt = sliders[0];
    var gg = sliders[1];
    var garrisonIds = dedupeGeneralIds(garrisonRaw);
    validateGarrisonAgainstRoster(garrisonIds, ruler);
    return {troops: tt, grain: gg, garrisonIds: garrisonIds};
  }

  function parseFriendlyDispatchTargets(widgets:Array<MenuFormWidget>):{tt:Int, gg:Int} {
    var sliders:Array<Int> = [];
    for (x in widgets)
      switch x {
        case Slider(_, _, _, _, v):
          sliders.push(v);
        case GeneralMultiPick(_, _, _):
        case MonarchSinglePick(_, _, _):
        case Button(_):
        case TileSinglePick(_, _, _):
      }
    if (sliders.length < 2)
      throw "GameMatchCore: 我方城池調度節點須含至少兩個 Slider（兵力／糧食）";
    return {tt: sliders[0], gg: sliders[1]};
  }

  function handleEmptyCityOccupySubmit(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (_pendingEmptyCityTileIndex == null)
      throw "GameMatchCore: EmptyCityOccupySubmit 但無 pending 空城";
    var idx = _pendingEmptyCityTileIndex;
    var ruler = cast(activeMonarch(), Monarch);
    var parsed = parseEmptyCityOccupyFromWidgets(menuNode.formWidgets(), ruler);
    var tt = parsed.troops;
    var gg = parsed.grain;
    var garrisonIds = parsed.garrisonIds;
    if (tt < 0 || gg < 0 || tt > ruler.troops() || gg > ruler.grain())
      throw "GameMatchCore: 進駐數值超出君主可用資源";
    GameMatchVer1Ops.applyEmptyCityOccupySubmit(this, idx, ruler, tt, gg, garrisonIds);
    var gTxt = garrisonIds.length > 0 ? garrisonIds.join(", ") : "（無）";
    pushInfoPopup(
      ruler.id(),
      "進駐完成",
      Plain('城池格 ${idx}\n進駐兵力：${tt}\n進駐糧食：${gg}\n駐守武將：${gTxt}'),
      "empty-city-occupy"
    );
    _pendingEmptyCityTileIndex = null;
    _activeSliceComplete = true;
    syncActiveSliceAfterMenuLeaf(EmptyCityOccupySubmit);
  }

  function handleEmptyCityOccupyAbort(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (_pendingEmptyCityTileIndex == null)
      throw "GameMatchCore: EmptyCityOccupyAbort 但無 pending 空城";
    GameMatchVer1Ops.onEmptyCityOccupyAbort(this);
    pushInfoPopup(actor.monarchId(), "已取消", Plain("未進駐空城。"), "empty-city-abort");
    _pendingEmptyCityTileIndex = null;
    _activeSliceComplete = true;
    syncActiveSliceAfterMenuLeaf(EmptyCityOccupyAbort);
  }

  function handleFriendlyCityDispatchApply(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (_pendingFriendlyCityTileIndex == null)
      throw "GameMatchCore: FriendlyCityDispatchApply 但無 pending 我方城池拜訪";
    var idx = _pendingFriendlyCityTileIndex;
    var parsed = parseFriendlyDispatchTargets(menuNode.formWidgets());
    var tt = parsed.tt;
    var gg = parsed.gg;
    var oldT = forceGetCityStoredTroops(idx);
    var oldG = forceGetCityStoredGrain(idx);
    var ruler = cast(activeMonarch(), Monarch);
    if (tt < 0 || gg < 0)
      throw "GameMatchCore: 調度目標不可為負";
    var dT = tt - oldT;
    var dG = gg - oldG;
    if (dT > ruler.troops())
      throw "GameMatchCore: 自君主池調出兵力不足";
    if (dG > ruler.grain())
      throw "GameMatchCore: 自君主池調出糧食不足";
    GameMatchVer1Ops.applyFriendlyCityDispatch(this, idx, ruler, tt, gg);
    pushInfoPopup(
      ruler.id(),
      "調度完成",
      Plain('城池格 ${idx}\n城池兵力調整為：${tt}\n城池糧食調整為：${gg}'),
      "friendly-dispatch"
    );
    syncActiveSliceAfterMenuLeaf(FriendlyCityDispatchApply);
  }

  function handleFriendlyCityVisitEnd(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (_pendingFriendlyCityTileIndex == null)
      throw "GameMatchCore: FriendlyCityVisitEnd 但無 pending 我方城池拜訪";
    GameMatchVer1Ops.onFriendlyCityVisitEnd(this);
    pushInfoPopup(actor.monarchId(), "結束拜訪", Plain("已離開我方城池。"), "friendly-visit-end");
    _pendingFriendlyCityTileIndex = null;
    _activeSliceComplete = true;
    syncActiveSliceAfterMenuLeaf(FriendlyCityVisitEnd);
  }

  /**
   * 終局規剘：僅在仍為 {@link MatchTerminationReason.NotEnded} 時呼叫；已終局不重算。
   */
  function evaluateTermination():Void {
    GameMatchVer1Ops.evaluateTermination(this);
  }

  /**
   * 供 {@link GameMatchVer1Ops}／規剘寫入終局（已非 {@link MatchTerminationReason.NotEnded} 時不重寫）。
   */
  function assignTerminationReason(reason:MatchTerminationReason):Void {
    _terminationReason = reason;
  }

  public function getTerminationReason():MatchTerminationReason
    return _terminationReason;

  public function applyMenuLeaf(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    var leaf = MenuActivation.activatingEntry(menuNode);
    if (!leaf.isEnabled())
      throw "GameMatchCore.applyMenuLeaf: activating entry disabled (" + leaf.caption() + ")";

    var lk = leaf.kind();
    switch lk {
      case HostileCityAttackerPick:
        assertHostileCityApplyActor(actor, lk);
        handleHostileCityAttackerPick(actor, menuNode);
      case HostileCityDefenderAck:
        assertHostileCityApplyActor(actor, lk);
        handleHostileCityDefenderAck(actor, menuNode);
      case HostileCityDefenderPickSubmit:
        assertHostileCityApplyActor(actor, lk);
        handleHostileCityDefenderPickSubmit(actor, menuNode);
      case HostileCitySettlementAck:
        assertHostileCityApplyActor(actor, lk);
        handleHostileCitySettlementAck(actor, menuNode);
      default:
        if (actor.monarchId() != activeMonarch().id())
          throw "GameMatchCore.applyMenuLeaf: actor must be active monarch";

        switch lk {
          case Move:
            GameMatchVer1Ops.applyMenuLeafForMove(this, actor);
            syncActiveSliceAfterMenuLeaf(Move);
            var dMove = forceGetLastRolledMoveDelta();
            var pos = pawnIndexOfMonarch(actor.monarchId());
            pushInfoPopup(
              actor.monarchId(),
              "移動",
              Plain((dMove != null ? '本次移動步數：${dMove}\n' : "") + '目前位置：格 ${pos}'),
              "move"
            );
          case TileEventPick:
            handleTileEventPick(actor, menuNode);
          case StagingSubmit:
            handleStagingSubmit(actor, menuNode);
          case LandingContinue:
            handleLandingContinue(actor);
          case StrategyPre, StrategyPost:
            throw "GameMatchCore.applyMenuLeaf: StrategyPre/StrategyPost 不應為 leaf kind（父節點無 entry）";
          case JiCe:
            var card = resolvePlayedJiCeFromLeaf(actor, leaf);
            // docs/策略系統.md：依是否處於 pendingLanding 窗口決定階段
            if (forceGetPendingLandingTile() != null) {
              if (!canUseStrategyPostMove())
                throw "GameMatchCore: StrategyPost 不可用";
              _pendingStrategyPhase = PostMove;
              assertJiCeAllowedInPhase(card, PostMove);
              enterStaging(actor, new JiCeStagingAction(this, card), StrategyPost);
            } else {
              if (!canUseStrategyPreMove())
                throw "GameMatchCore: StrategyPre 不可用";
              _pendingStrategyPhase = PreMove;
              assertJiCeAllowedInPhase(card, PreMove);
              enterStaging(actor, new JiCeStagingAction(this, card), StrategyPre);
            }
          case Rest:
            enterStaging(actor, new RestStagingAction(this), Rest);
          case VillageTrade:
            enterStaging(actor, new VillageTradeStagingAction(this), VillageTrade);
          case VillageConquer:
            enterStaging(actor, new VillageConquerStagingAction(this), VillageConquer);
          case VillagePlunder:
            enterStaging(actor, new VillagePlunderStagingAction(this), VillagePlunder);
          case VillageEndTurn:
            if (_pendingVillageTileIndex == null)
              throw "GameMatchCore: VillageEndTurn 但無 pendingVillage";
            pushInfoPopup(actor.monarchId(), "村落", Plain("已結束村落互動。"), "village-end");
            _pendingVillageTileIndex = null;
            _activeSliceComplete = true;
            syncActiveSliceAfterMenuLeaf(VillageEndTurn);
          case GeneralRecruit:
            if (_pendingGeneralTileIndex == null)
              throw "GameMatchCore: GeneralRecruit 但無 pendingGeneral";
            if (leaf.decisionToken() == null)
              throw "GameMatchCore: GeneralRecruit 需要 decisionToken";
            var tileIdx = _pendingGeneralTileIndex;
            var offers = _generalOffersByTile.exists(tileIdx) ? _generalOffersByTile.get(tileIdx) : [];
            var picked:Null<GeneralRecruitOffer> = null;
            for (o in offers)
              if (o.offerId == leaf.decisionToken()) {
                picked = o;
                break;
              }
            if (picked == null)
              throw "GameMatchCore: GeneralRecruit 找不到 offer";
            var ruler = cast(activeMonarch(), Monarch);
            if (ruler.gold() < picked.costGold)
              throw "GameMatchCore: 金錢不足，無法招募";
            ruler.reduceGold(picked.costGold);
            var newId:GeneralId = picked.offerId; // 先用 offerId 當一般 id（可重現且不衝突）
            createGeneral(newId, ruler.id(), picked.command, picked.might, picked.wit, picked.stewardship);
            // 招募後從清單移除，允許繼續招募其他人；切片不結束，須按「回合結束」離開武將格
            var rest:Array<GeneralRecruitOffer> = [];
            for (o in offers)
              if (o.offerId != picked.offerId)
                rest.push(o);
            _generalOffersByTile.set(tileIdx, rest);
            pushInfoPopup(
              actor.monarchId(),
              "招募成功",
              Plain('武將格 ${tileIdx}\n招募：${picked.displayName}（${Std.string(picked.rarity)}）\n花費：金 ${picked.costGold}\n統率 ${picked.command}｜武力 ${picked.might}｜智力 ${picked.wit}｜政治 ${picked.stewardship}'),
              "general-recruit"
            );
            syncActiveSliceAfterMenuLeaf(GeneralRecruit);
          case GeneralEndTurn:
            if (_pendingGeneralTileIndex == null)
              throw "GameMatchCore: GeneralEndTurn 但無 pendingGeneral";
            pushInfoPopup(actor.monarchId(), "武將格", Plain("已離開武將格。"), "general-end");
            _pendingGeneralTileIndex = null;
            _activeSliceComplete = true;
            syncActiveSliceAfterMenuLeaf(GeneralEndTurn);
          case ShopBuy:
            if (_pendingShopTileIndex == null)
              throw "GameMatchCore: ShopBuy 但無 pendingShop";
            if (leaf.decisionToken() == null)
              throw "GameMatchCore: ShopBuy 需要 decisionToken（stockId）";
            var tileIdx = _pendingShopTileIndex;
            var stocks = _shopStocksByTile.exists(tileIdx) ? _shopStocksByTile.get(tileIdx) : [];
            var picked:Null<ShopStockItem> = null;
            for (x in stocks)
              if (x.stockId == leaf.decisionToken()) {
                picked = x;
                break;
              }
            if (picked == null)
              throw "GameMatchCore: ShopBuy 找不到商品";
            var ruler = cast(activeMonarch(), Monarch);
            if (ruler.gold() < picked.priceGold)
              throw "GameMatchCore: 金錢不足，無法購買";

            // 解析表單：需恰好選一名武將
            var sel = extractFirstGeneralMultiPickSelections(menuNode.formWidgets());
            if (sel.length != 1)
              throw "GameMatchCore: 商店購買需恰好選擇 1 名武將";
            var gid:GeneralId = sel[0];
            var g = requireGeneral(gid);
            if (g.owner() != ruler.id())
              throw "GameMatchCore: 只能替自己麾下武將購買裝備";

            ruler.reduceGold(picked.priceGold);
            var eq = WeaponCatalog.spawnByName(picked.stockId, picked.weaponName, picked.priceGold);
            g.addEquipment(eq);

            // 移除已購買商品；切片不結束，須按「回合結束」離開商店格
            var rest:Array<ShopStockItem> = [];
            for (x in stocks)
              if (x.stockId != picked.stockId)
                rest.push(x);
            _shopStocksByTile.set(tileIdx, rest);
            pushInfoPopup(
              actor.monarchId(),
              "購買成功",
              Plain('商店格 ${tileIdx}\n購買：${eq.name()}（${Std.string(eq.rarity())}）\n花費：金 ${picked.priceGold}\n裝備給：${gid}\n效果：${Std.string(eq.bonusStat())}+${eq.bonusValue()}｜忠誠+${eq.loyaltyBonus()}'),
              "shop-buy"
            );
            syncActiveSliceAfterMenuLeaf(ShopBuy);
          case ShopEndTurn:
            if (_pendingShopTileIndex == null)
              throw "GameMatchCore: ShopEndTurn 但無 pendingShop";
            pushInfoPopup(actor.monarchId(), "商店格", Plain("已離開商店格。"), "shop-end");
            _pendingShopTileIndex = null;
            _activeSliceComplete = true;
            syncActiveSliceAfterMenuLeaf(ShopEndTurn);
          case FriendlyCityDevelop:
            enterStaging(actor, new FriendlyCityDevelopStagingAction(this), FriendlyCityDevelop);
          case FriendlyCityRest:
            enterStaging(actor, new FriendlyCityRestStagingAction(this), FriendlyCityRest);
          case Status:
            syncActiveSliceAfterMenuLeaf(Status);
          case ConfirmDone:
            syncActiveSliceAfterMenuLeaf(ConfirmDone);
            advanceActiveMonarchAfterConfirmDone();
          case EmptyCityOccupySubmit:
            handleEmptyCityOccupySubmit(actor, menuNode);
          case EmptyCityOccupyAbort:
            handleEmptyCityOccupyAbort(actor, menuNode);
          case FriendlyCityDispatchApply:
            handleFriendlyCityDispatchApply(actor, menuNode);
          case FriendlyCityVisitEnd:
            handleFriendlyCityVisitEnd(actor, menuNode);
          case HostileCityAttackerPick, HostileCityDefenderAck, HostileCityDefenderPickSubmit, HostileCitySettlementAck:
            throw "GameMatchCore.applyMenuLeaf: internal hostile routing";
        }
    }
    evaluateTermination();
    menuNode.setActivationEntry(null);
  }

  function advanceActiveMonarchAfterConfirmDone():Void {
    var n = _monarchs.length;
    if (n == 0)
      return;
    var idx = -1;
    for (i in 0...n)
      if (_monarchs[i].id() == _activeId) {
        idx = i;
        break;
      }
    if (idx < 0)
      throw 'GameMatchCore.advanceActiveMonarchAfterConfirmDone: active ($_activeId) not in monarchs';
    _activeId = _monarchs[(idx + 1) % n].id();
    // 完整輪轉一圈（回到 seat=0）算一回合
    if (activeMonarch().seat() == 0) {
      _roundNumber += 1;
      applyEndOfRoundSettlement();
    }
  }

  function applyEndOfRoundSettlement():Void {
    // 1) 回合末武將體力回復（全體）
    for (m in _monarchs) {
      var mon = cast(m, Monarch);
      for (g in mon.roster()) {
        var gg = cast(g, General);
        gg.setStamina(Balance.clampInt(gg.stamina() + Balance.STAMINA_RECOVER_PER_TURN, 0, 100));
      }
    }

    // 2) 套用「下回合」格子 bonus（目前只把 bonus 寫回城池儲備/君主金錢；之後再接城等級/地形產出）
    for (at => amt in _tileNextTurnGrainBonus) {
      if (amt <= 0)
        continue;
      if (_cityOwner.exists(at)) {
        var prev = forceGetCityStoredGrain(at);
        _cityStockGrain.set(at, prev + amt);
      }
    }
    for (at => amt in _tileNextTurnGoldBonus) {
      if (amt <= 0)
        continue;
      if (_cityOwner.exists(at)) {
        var owner = _cityOwner.get(at);
        monarchWithId(owner).grantGold(amt);
      }
    }
    _tileNextTurnGrainBonus = new Map();
    _tileNextTurnGoldBonus = new Map();
    // _tileDefenseBonus 先不清除（目前尚未有消耗點）；後續接上戰鬥/攻城時再定義生命周期。

    // 3) 每回合糧食消耗（士兵維持費）
    for (m in _monarchs) {
      var mon = cast(m, Monarch);
      var cost = Balance.grainUpkeepForTroops(mon.troops());
      if (cost <= 0)
        continue;
      if (mon.grain() >= cost)
        mon.reduceGrain(cost);
      else {
        // 糧食不足先扣到 0；士兵逃亡尚未落地（留給下一輪）
        mon.reduceGrain(mon.grain());
      }
    }

    // 4) 最小領地產出：依城池等級給屬主每回合基本 gold/grain
    if (_board != null) {
      var len = _board.length();
      for (i in 0...len) {
        if (_cityOwner.exists(i)) {
          var owner = _cityOwner.get(i);
          var lvl = forceGetCityLevel(i);
          var inc = Balance.cityBaseIncome(lvl);
          monarchWithId(owner).grantGold(inc.gold);
          monarchWithId(owner).grantGrain(inc.grain);
        }
      }
    }
  }

  public function board():IBoard
    return _board;

  public function monarchs():Array<IMonarch>
    return cast _monarchs;

  public function activeMonarch():IMonarch {
    for (m in _monarchs)
      if (m.id() == _activeId)
        return m;
    throw 'GameMatchCore.activeMonarch: id not in roster ($_activeId)';
  }

  public function roundNumber():Int
    return _roundNumber;

  // TODO(strategy-tile): 後續若 UI 要顯示格子加成/防禦，補進 IGameMatchGetter 對應 query。
  public function forceAddTileNextTurnGrainBonus(at:TileIndex, amount:Int):Void {
    var prev = _tileNextTurnGrainBonus.exists(at) ? _tileNextTurnGrainBonus.get(at) : 0;
    _tileNextTurnGrainBonus.set(at, prev + amount);
  }

  public function forceAddTileNextTurnGoldBonus(at:TileIndex, amount:Int):Void {
    var prev = _tileNextTurnGoldBonus.exists(at) ? _tileNextTurnGoldBonus.get(at) : 0;
    _tileNextTurnGoldBonus.set(at, prev + amount);
  }

  public function forceAddTileDefenseBonus(at:TileIndex, amount:Float):Void {
    var prev = _tileDefenseBonus.exists(at) ? _tileDefenseBonus.get(at) : 0.0;
    _tileDefenseBonus.set(at, prev + amount);
  }

  public function hasMovedThisTurn():Bool
    return _hasMovedThisTurn;

  public function canUseStrategyPreMove():Bool
    return !_strategyPreUsed && !_hasMovedThisTurn;

  public function canUseStrategyPostMove():Bool
    return !_strategyPostUsed && _hasMovedThisTurn;

  public function monarchById(monarchId:MonarchId):IMonarch
    return monarchWithId(monarchId);

  public function pawnIndexOfPlayer(player:IPlayer):TileIndex
    return pawnIndexOfMonarch(player.monarchId());

  public function pawnIndexOfMonarch(monarchId:MonarchId):TileIndex
    return monarchWithId(monarchId).pawnIndex();

  public function tileAt(index:TileIndex):ITile
    return board().tileAt(index);

  public function availableJiCe(monarchId:MonarchId):Array<IJiCe> {
    var row = _ownedJiCe.get(monarchId);
    return row != null ? row.copy() : [];
  }

  function resolvePlayedJiCeFromLeaf(actor:IPlayer, leaf:IPlayerMenuEntry):IJiCe {
    var tok = leaf.decisionToken();
    if (tok == null)
      throw "GameMatchCore.applyMenuLeaf: JiCe leaf 須傳 playedJiCe，或選單葉 decisionToken（所持計策索引）";
    var idx = Std.parseInt(tok);
    if (idx == null)
      throw "GameMatchCore.applyMenuLeaf: JiCe decisionToken 須為所持計策索引數字";
    var owned = _ownedJiCe.get(actor.monarchId());
    if (owned == null || idx < 0 || idx >= owned.length)
      throw "GameMatchCore.applyMenuLeaf: 所持計策索引超出範圍 (" + tok + ")";
    return owned[idx];
  }

  function assertJiCeAllowedInPhase(card:IJiCe, phase:StrategyPhase):Void {
    var allowed = card.allowedPhases();
    for (p in allowed)
      if (p == phase)
        return;
    throw 'GameMatchCore: 計策 "${card.designLabel()}" 不可於階段 ${Std.string(phase)} 使用';
  }

  public function isActivePlayerSliceComplete():Bool
    return _activeSliceComplete;
}

private typedef GeneralRecruitOffer = {
  offerId:String,
  displayName:String,
  rarity:game.Rarity,
  command:Int,
  might:Int,
  wit:Int,
  stewardship:Int,
  costGold:Int,
};

private typedef ShopStockItem = {
  stockId:EquipmentId,
  weaponName:String,
  priceGold:Int,
};
