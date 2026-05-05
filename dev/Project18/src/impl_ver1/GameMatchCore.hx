package impl_ver1;

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
import game.MenuActivation;
import game.MenuGeneralChoice;
import game.MenuFormWidget;
import game.PlayerMenuKind;
import game.TileKind;
import impl_ver1.JiCeStagingAction;
import impl_ver1.RestStagingAction;

/**
 * Ver1 賽局核心：終局／「移動」葉委派 {@link GameMatchVer1Ops}（傳入 {@code this}，不靠建構注入）。
 * 友元見 {@literal @:allow(impl_ver1)}。
 */
@:allow(impl_ver1)
class GameMatchCore implements IGameMatch {
  public static inline var DEFAULT_MOVE_DELTA = 3;

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
  var _activeSliceComplete:Bool;
  var _terminationReason:MatchTerminationReason;

  /** --- 環上格子事件綁定與落地 pending --- */
  var _tileEventByIndex:Map<Int, ITileEvent>;
  var _pendingTileEvent:Null<ITileEvent>;

  /** --- 計策暫存與君主所持牌 --- */
  var _pendingStaging:Null<IStagingAction>;
  var _stagingPreviewRows:Array<IJiCeStagingPreviewRow>;
  var _ownedJiCe:Map<MonarchId, Array<IJiCe>>;

  /** --- 移動逐步結算：已登錄之計策／場地效果勾子 --- */
  var _movementStepHooks:Array<IJiCeMovementStepHook>;

  /** --- 城池：駐軍、儲備、屬主；踩中空城／我方城 pending --- */
  /** 城池格索引 → 駐守武將 id 列表；無鍵或空陣列視為無駐將（空城語意）。 */
  var _cityGarrisonGenerals:Map<Int, Array<GeneralId>>;
  var _cityStockTroops:Map<Int, Int>;
  var _cityStockGrain:Map<Int, Int>;
  var _pendingEmptyCityTileIndex:Null<TileIndex>;
  var _cityOwner:Map<Int, MonarchId>;
  var _pendingFriendlyCityTileIndex:Null<TileIndex>;

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
    _activeSliceComplete = false;
    _terminationReason = NotEnded;
    _tileEventByIndex = new Map();
    _pendingTileEvent = null;
    _pendingStaging = null;
    _ownedJiCe = new Map();
    _cityGarrisonGenerals = new Map();
    _cityStockTroops = new Map();
    _cityStockGrain = new Map();
    _pendingEmptyCityTileIndex = null;
    _cityOwner = new Map();
    _pendingFriendlyCityTileIndex = null;
    _movementStepHooks = [];
    clearHostileCityConfrontation();
    clearStaging();
  }

  function clearStaging():Void {
    _pendingStaging = null;
    _stagingPreviewRows = ([] : Array<IJiCeStagingPreviewRow>);
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

  public function forceRegisterMovementStepHook(h:IJiCeMovementStepHook):Void {
    for (x in _movementStepHooks)
      if (x == h)
        return;
    _movementStepHooks.push(h);
  }

  public function forceUnregisterMovementStepHook(h:IJiCeMovementStepHook):Void {
    var i = _movementStepHooks.length;
    while (i-- > 0)
      if (_movementStepHooks[i] == h)
        _movementStepHooks.splice(i, 1);
  }

  public function forceBindTileEvent(at:TileIndex, handler:ITileEvent):Void {
    tileEventBind(at, handler);
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

  public function createMonarch(id:MonarchId, seat:Int, pawnIndex:TileIndex, ?troops:Int, ?grain:Int):IMonarch {
    var t = troops != null ? troops : 0;
    var g = grain != null ? grain : 0;
    var m = new Monarch(id, seat, pawnIndex, t, g);
    _monarchs.push(m);
    _ownedJiCe.set(id, []);
    if (_monarchs.length == 1)
      _activeId = m.id();
    return m;
  }

  function monarchWithId(mid:MonarchId):Monarch {
    for (m in _monarchs)
      if (m.id() == mid)
        return m;
    throw 'GameMatchCore: monarch "$mid" not registered';
  }

  public function createPlayer(monarchId:MonarchId, displayName:String):IPlayer
    return new Player(monarchId, displayName);

  public function createPlayerMenuEntry(kind:PlayerMenuKind, caption:String, enabled:Bool, ?decisionToken:String):IPlayerMenuEntry
    return new PlayerMenuEntry(kind, caption, enabled, decisionToken);

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

  public function forceAssignCityGarrison(at:TileIndex, generalId:GeneralId):Void {
    if (_board == null)
      throw "GameMatchCore.forceAssignCityGarrison: board not set";
    if (_board.tileAt(at).kind() != City)
      throw "GameMatchCore.forceAssignCityGarrison: not a City tile";
    _cityGarrisonGenerals.set(at, [generalId]);
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

  public function forceGetPendingFriendlyCityVisitTile():Null<TileIndex>
    return _pendingFriendlyCityTileIndex;

  public function forceGetPendingHostileCityTile():Null<TileIndex>
    return _pendingHostileCityTileIndex;

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
    GameMatchVer1Ops.applyHostileCitySettlementAck(this, actor, menuNode);
    clearHostileCityConfrontation();
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
    var jiEnabledBase =
      !stagingActive
      && pend == null
      && _pendingEmptyCityTileIndex == null
      && _pendingFriendlyCityTileIndex == null
      && !hostilePending;

    var ownedJiCe = availableJiCe(actor.monarchId());
    var jiChildren:Array<IPlayerMenuNode> = [];
    if (ownedJiCe.length == 0)
      jiChildren.push(
        createPlayerMenuNode(
          "(無所持計策)",
          createPlayerMenuEntry(JiCe, "（尚無所持計策）", false, null),
          ([] : Array<IPlayerMenuNode>)
        )
      );
    else
      for (i in 0...ownedJiCe.length) {
        var j = ownedJiCe[i];
        jiChildren.push(
          createPlayerMenuNode(
            j.designLabel(),
            createPlayerMenuEntry(JiCe, "打出：" + j.designLabel(), jiEnabledBase, Std.string(i)),
            ([] : Array<IPlayerMenuNode>)
          )
        );
      }

    var actions:Array<IPlayerMenuNode> = [];
    // 規則：一旦切片已完成（可結束），移動主項先不再出現；直到 ConfirmDone 結算後（切片重置）才再次出現。
    if (!isActivePlayerSliceComplete())
      actions.push(createPlayerMenuNode("移動", createPlayerMenuEntry(Move, "移動", !blockBasics), ([] : Array<IPlayerMenuNode>)));
    actions.push(createPlayerMenuNode("計策", null, jiChildren));
    // 休整：目前先做成 staging 指令（選將→提交→resolve）
    if (!isActivePlayerSliceComplete())
      actions.push(createPlayerMenuNode("休整", createPlayerMenuEntry(Rest, "休整（回復體力）", !blockBasics), ([] : Array<IPlayerMenuNode>)));
    actions.push(createPlayerMenuNode("狀態", createPlayerMenuEntry(Status, "狀態（前端用，無後端結算）", true), ([] : Array<IPlayerMenuNode>)));
    var allowConfirm =
      isActivePlayerSliceComplete()
      && pend == null
      && !stagingActive
      && _pendingEmptyCityTileIndex == null
      && _pendingFriendlyCityTileIndex == null
      && !hostilePending;
    if (allowConfirm)
      actions.push(createPlayerMenuNode("結束", createPlayerMenuEntry(ConfirmDone, "結束本階段", true), ([] : Array<IPlayerMenuNode>)));

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
      case JiCe:
      case StagingSubmit:
      case Status:
      case Move:
      case Rest:
        _hasMovedThisTurn = true;
      case TileEventPick:
      case EmptyCityOccupySubmit:
      case EmptyCityOccupyAbort:
      case FriendlyCityDispatchApply:
      case FriendlyCityVisitEnd:
      case HostileCityAttackerPick:
      case HostileCityDefenderAck:
      case HostileCityDefenderPickSubmit:
      case HostileCitySettlementAck:
    }
  }

  /** 子類 {@link #_applyMenuLeafForMove} 完成棋子位移後呼叫，處理落地與切片旗標。 */
  public function settleAfterMoveLanding():Void {
    var ruler = cast(activeMonarch(), Monarch);
    considerLandingAt(ruler.pawnIndex());
    _activeSliceComplete =
      _pendingTileEvent == null
      && _pendingEmptyCityTileIndex == null
      && _pendingFriendlyCityTileIndex == null
      && _pendingHostileCityTileIndex == null;
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
      case Plain:
      case Battle:
      case Scheme:
    }
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
    stg.resolveChoice(actor, menuNode);
    clearStaging();
    syncActiveSliceAfterMenuLeaf(StagingSubmit);
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
    _pendingEmptyCityTileIndex = null;
    _activeSliceComplete = true;
    syncActiveSliceAfterMenuLeaf(EmptyCityOccupySubmit);
  }

  function handleEmptyCityOccupyAbort(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (_pendingEmptyCityTileIndex == null)
      throw "GameMatchCore: EmptyCityOccupyAbort 但無 pending 空城";
    GameMatchVer1Ops.onEmptyCityOccupyAbort(this);
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
    syncActiveSliceAfterMenuLeaf(FriendlyCityDispatchApply);
  }

  function handleFriendlyCityVisitEnd(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (_pendingFriendlyCityTileIndex == null)
      throw "GameMatchCore: FriendlyCityVisitEnd 但無 pending 我方城池拜訪";
    GameMatchVer1Ops.onFriendlyCityVisitEnd(this);
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
          case TileEventPick:
            handleTileEventPick(actor, menuNode);
          case StagingSubmit:
            handleStagingSubmit(actor, menuNode);
          case JiCe:
            if (_pendingStaging != null)
              throw "GameMatchCore: 已有進行中之計策暫存，請先完成計策選項";
            var card = resolvePlayedJiCeFromLeaf(actor, leaf);
            forceEnterJiCeStaging(card);
            // 目前 previewRows 先留空；後續各指令可自行實作 previewRows
            if (_pendingStaging != null)
              _stagingPreviewRows = _pendingStaging.previewRows(actor);
            syncActiveSliceAfterMenuLeaf(JiCe);
          case Rest:
            if (_pendingStaging != null)
              throw "GameMatchCore: 已有進行中之暫存，請先完成";
            _pendingStaging = new RestStagingAction(this);
            _stagingPreviewRows = _pendingStaging.previewRows(actor);
            syncActiveSliceAfterMenuLeaf(Rest);
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
    if (activeMonarch().seat() == 0)
      _roundNumber += 1;
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

  public function isActivePlayerSliceComplete():Bool
    return _activeSliceComplete;
}
