package impl_ver1;

import game.GameIds;
import game.IBoard;
import game.IGameMatch;
import game.MatchTerminationReason;
import game.IGeneral;
import game.IJiCe;
import game.IJiCeStagingPreviewRow;
import game.IMonarch;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.ITile;
import game.ITileEvent;
import game.MenuFieldIds;
import game.MenuGeneralChoice;
import game.MenuFormWidget;
import game.PlayerMenuKind;
import game.TileKind;

/**
 * Ver1 賽局核心：終局／「移動」葉委派 {@link GameMatchVer1Ops}（傳入 {@code this}，不靠建構注入）。
 * 友元見 {@literal @:allow(impl_ver1)}。
 */
@:allow(impl_ver1)
class GameMatchCore implements IGameMatch {
  public static inline var DEFAULT_MOVE_DELTA = 3;

  /** 與空城進駐表單 {@link MenuFormWidget.Slider} fieldId 對齊。 */
  public static inline var OCCUPY_FIELD_TROOPS:String = "occupy_troops";

  public static inline var OCCUPY_FIELD_GRAIN:String = "occupy_grain";

  /** 我方城池調度表單 {@link MenuFormWidget.Slider} fieldId。 */
  public static inline var DISPATCH_FIELD_TROOPS:String = "dispatch_troops";

  public static inline var DISPATCH_FIELD_GRAIN:String = "dispatch_grain";

  /** 空城進駐表單 {@link MenuFormWidget.GeneralMultiPick} fieldId／{@link #applyMenuLeaf} formStringListFields 鍵。 */
  public static inline var EMPTY_CITY_GARRISON_FIELD:String = "empty_city_garrison_generals";

  var _board:Board;
  var _monarchs:Array<Monarch>;
  var _activeId:MonarchId;
  var _activeSliceComplete:Bool;
  var _terminationReason:MatchTerminationReason;

  var _tileEventByIndex:Map<Int, ITileEvent>;
  var _pendingTileEvent:Null<ITileEvent>;

  var _pendingJiCe:Null<IJiCe>;
  var _jiCeStagingTargetId:Null<MonarchId>;
  var _jiCeStagingRows:Array<IJiCeStagingPreviewRow>;

  var _ownedJiCe:Map<MonarchId, Array<IJiCe>>;

  /** 城池格索引 → 駐守武將 id 列表；無鍵或空陣列視為無駐將（空城語意）。 */
  var _cityGarrisonGenerals:Map<Int, Array<GeneralId>>;

  var _cityStockTroops:Map<Int, Int>;
  var _cityStockGrain:Map<Int, Int>;
  var _pendingEmptyCityTileIndex:Null<TileIndex>;

  var _cityOwner:Map<Int, MonarchId>;
  var _pendingFriendlyCityTileIndex:Null<TileIndex>;

  public function new() {
    _board = cast null;
    _monarchs = [];
    _activeId = "";
    _activeSliceComplete = false;
    _terminationReason = NotEnded;
    _tileEventByIndex = new Map();
    _pendingTileEvent = null;
    _ownedJiCe = new Map();
    _cityGarrisonGenerals = new Map();
    _cityStockTroops = new Map();
    _cityStockGrain = new Map();
    _pendingEmptyCityTileIndex = null;
    _cityOwner = new Map();
    _pendingFriendlyCityTileIndex = null;
    clearJiCeStaging();
  }

  function clearJiCeStaging():Void {
    _pendingJiCe = null;
    _jiCeStagingTargetId = null;
    _jiCeStagingRows = ([] : Array<IJiCeStagingPreviewRow>);
  }

  public function forceBindTileEvent(at:TileIndex, handler:ITileEvent):Void {
    _tileEventByIndex.set(at, handler);
  }

  public function createTile(index:TileIndex, kind:TileKind):ITile
    return new Tile(index, kind);

  public function createBoard(tiles:Array<ITile>):IBoard {
    if (_board != null)
      throw "GameMatchCore.createBoard: board already set";
    var b = new Board(tiles);
    _board = b;
    return b;
  }

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
    return _pendingJiCe;

  public function forceGetJiCeStagingTargetMonarchId():Null<MonarchId>
    return _jiCeStagingTargetId;

  public function forceJiCeStagingPreviewRows():Array<IJiCeStagingPreviewRow> {
    if (_pendingJiCe == null)
      return [];
    return _jiCeStagingRows.copy();
  }

  public function enterJiCeStaging(card:IJiCe, targetMonarchId:MonarchId, previewRows:Array<IJiCeStagingPreviewRow>):Void {
    _pendingJiCe = card;
    _jiCeStagingTargetId = targetMonarchId;
    _jiCeStagingRows = previewRows.copy();
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

  public function cityOwnedByActiveMonarch(at:TileIndex):Bool {
    if (_board == null)
      return false;
    if (_board.tileAt(at).kind() != City)
      return false;
    return _cityOwner.exists(at) && _cityOwner.get(at) == activeMonarch().id();
  }

  function clampInt(v:Int, lo:Int, hi:Int):Int {
    if (v < lo)
      return lo;
    if (v > hi)
      return hi;
    return v;
  }

  public function createPlayerMenu(actor:IPlayer):IPlayerMenu {
    var pend = _pendingTileEvent;
    var jiPending = _pendingJiCe;
    var stagingActive = jiPending != null;
    var ctx = actor.monarchId() + "-" + isActivePlayerSliceComplete();
    if (pend != null)
      ctx += "-evt-" + pend.registryKey();
    if (stagingActive && jiPending != null)
      ctx += "-jice-" + jiPending.registryKey();
    if (_pendingEmptyCityTileIndex != null)
      ctx += "-empty-city-" + _pendingEmptyCityTileIndex;
    if (_pendingFriendlyCityTileIndex != null)
      ctx += "-friendly-city-" + _pendingFriendlyCityTileIndex;

    var roots:Array<IPlayerMenuNode> = [];

    if (_pendingFriendlyCityTileIndex != null) {
      var fidx = _pendingFriendlyCityTileIndex;
      var rulerF = cast(activeMonarch(), Monarch);
      var cityTroop = forceGetCityStoredTroops(fidx);
      var cityGrain = forceGetCityStoredGrain(fidx);
      var maxTroopSlider = rulerF.troops();
      var maxGrainSlider = rulerF.grain();
      var defTroop = clampInt(cityTroop, 0, maxTroopSlider);
      var defGrain = clampInt(cityGrain, 0, maxGrainSlider);
      var dispatchApplyLeaf = createPlayerMenuEntry(FriendlyCityDispatchApply, "確認調度", true, "dispatch_apply");
      var dispatchWidgets:Array<MenuFormWidget> = [
        Slider(DISPATCH_FIELD_TROOPS, "調度兵力（目標城池兵力）", 0, maxTroopSlider, 1, defTroop),
        Slider(DISPATCH_FIELD_GRAIN, "調度糧食（目標城池糧食）", 0, maxGrainSlider, 1, defGrain),
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
        GeneralMultiPick(EMPTY_CITY_GARRISON_FIELD, "複選駐守武將（可不選）", choices, defGarrison),
        Slider(OCCUPY_FIELD_TROOPS, "進駐兵力（君主池扣除）", 0, troopMax, 1, 0),
        Slider(OCCUPY_FIELD_GRAIN, "進駐糧食（君主池扣除）", 0, grainMax, 1, 0),
        Button(confirmLeaf),
        Button(abortLeaf),
      ];
      roots.push(createPlayerMenuNode('空城進駐（格 $idx）', null, [], occupyForm));
    }

    if (pend != null) {
      var evRoots = pend.buildPlayerMenu(actor).rootNodes();
      roots.push(createPlayerMenuNode("事件：" + pend.registryKey(), null, evRoots));
    }

    if (stagingActive && jiPending != null) {
      var jiRoots = jiPending.buildPlayerMenu(actor).rootNodes();
      roots.push(createPlayerMenuNode("計策：" + jiPending.designLabel(), null, jiRoots));
    }

    var blockBasics =
      pend != null || stagingActive || _pendingEmptyCityTileIndex != null || _pendingFriendlyCityTileIndex != null;
    var jiEnabledBase =
      !stagingActive && pend == null && _pendingEmptyCityTileIndex == null && _pendingFriendlyCityTileIndex == null;

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

    var actions:Array<IPlayerMenuNode> = [
      createPlayerMenuNode("移動", createPlayerMenuEntry(Move, "移動", !blockBasics), ([] : Array<IPlayerMenuNode>)),
      createPlayerMenuNode("計策", null, jiChildren),
      createPlayerMenuNode("狀態", createPlayerMenuEntry(Status, "狀態（前端用，無後端結算）", true), ([] : Array<IPlayerMenuNode>)),
    ];
    var allowConfirm =
      isActivePlayerSliceComplete()
      && pend == null
      && !stagingActive
      && _pendingEmptyCityTileIndex == null
      && _pendingFriendlyCityTileIndex == null;
    if (allowConfirm)
      actions.push(createPlayerMenuNode("結束", createPlayerMenuEntry(ConfirmDone, "結束本階段", true), ([] : Array<IPlayerMenuNode>)));

    roots.push(createPlayerMenuNode("本回合", null, actions));
    return new PlayerMenu(actor, ctx, roots);
  }

  function syncActiveSliceAfterMenuLeaf(kind:PlayerMenuKind):Void {
    switch kind {
      case ConfirmDone:
        _activeSliceComplete = false;
      case JiCe:
      case JiCeStagingSubmit:
      case Status:
      case Move:
      case TileEventPick:
      case EmptyCityOccupySubmit:
      case EmptyCityOccupyAbort:
      case FriendlyCityDispatchApply:
      case FriendlyCityVisitEnd:
    }
  }

  /** 子類 {@link #_applyMenuLeafForMove} 完成棋子位移後呼叫，處理落地與切片旗標。 */
  public function settleAfterMoveLanding():Void {
    var ruler = cast(activeMonarch(), Monarch);
    considerLandingAt(ruler.pawnIndex());
    _activeSliceComplete =
      _pendingTileEvent == null && _pendingEmptyCityTileIndex == null && _pendingFriendlyCityTileIndex == null;
  }

  function considerLandingAt(idx:TileIndex):Void {
    _pendingTileEvent = null;
    _pendingEmptyCityTileIndex = null;
    _pendingFriendlyCityTileIndex = null;
    var tile = board().tileAt(idx);
    switch tile.kind() {
      case Event:
        _pendingTileEvent = _tileEventByIndex.get(idx);
      case City:
        if (_cityOwner.exists(idx) && _cityOwner.get(idx) == activeMonarch().id())
          _pendingFriendlyCityTileIndex = idx;
        else if (cityVacantNoGarrison(idx))
          _pendingEmptyCityTileIndex = idx;
      case Plain:
      case Battle:
      case Scheme:
    }
  }

  function handleTileEventPick(actor:IPlayer, leaf:IPlayerMenuEntry, formStringListFields:Null<Map<String, Array<String>>>):Void {
    var ev = _pendingTileEvent;
    if (ev == null)
      throw "GameMatchCore: TileEventPick 但無 forceGetPendingTileEvent";
    var tok = leaf.decisionToken();
    if (tok == null)
      throw "GameMatchCore: TileEventPick 需要 decisionToken";
    ev.resolveChoice(actor, tok, formStringListFields);
    _pendingTileEvent = null;
    _activeSliceComplete = true;
  }

  function parseJiCeStagingGeneralIds(formStringListFields:Null<Map<String, Array<String>>>):GeneralId {
    var raw = formStringListFields != null && formStringListFields.exists(MenuFieldIds.JiCeStagingGenerals)
      ? formStringListFields.get(MenuFieldIds.JiCeStagingGenerals)
      : ([] : Array<String>);
    var seen = new Map<String, Bool>();
    var uniq:Array<GeneralId> = [];
    for (id in raw) {
      if (seen.exists(id))
        continue;
      seen.set(id, true);
      uniq.push(id);
    }
    if (uniq.length != 1)
      throw "GameMatchCore: 計策選將須恰好選擇一名麾下武將（JiCeStagingSubmit）";
    var gid = uniq[0];
    var allowed = new Map<String, Bool>();
    for (r in _jiCeStagingRows)
      allowed.set(r.generalId(), true);
    if (!allowed.exists(gid))
      throw 'GameMatchCore: 計策選將 "$gid" 不在暫存預覽列';
    var ruler = cast(activeMonarch(), Monarch);
    var ok = new Map<String, Bool>();
    for (g in ruler.roster())
      ok.set(g.id(), true);
    if (!ok.exists(gid))
      throw 'GameMatchCore: 計策選將含非麾下武將 "$gid"';
    return gid;
  }

  function handleJiCeStagingSubmit(actor:IPlayer, leaf:IPlayerMenuEntry, formStringListFields:Null<Map<String, Array<String>>>):Void {
    var card = _pendingJiCe;
    if (card == null)
      throw "GameMatchCore: JiCeStagingSubmit 但無進行中之計策暫存";
    var gid = parseJiCeStagingGeneralIds(formStringListFields);
    card.resolveChoice(actor, gid);
    clearJiCeStaging();
    syncActiveSliceAfterMenuLeaf(JiCeStagingSubmit);
  }

  function parseOccupyGarrisonGeneralIds(formStringListFields:Null<Map<String, Array<String>>>):Array<GeneralId> {
    var raw = formStringListFields != null && formStringListFields.exists(EMPTY_CITY_GARRISON_FIELD)
      ? formStringListFields.get(EMPTY_CITY_GARRISON_FIELD)
      : ([] : Array<String>);
    var seen = new Map<String, Bool>();
    var uniq:Array<GeneralId> = [];
    for (id in raw) {
      if (seen.exists(id))
        continue;
      seen.set(id, true);
      uniq.push(id);
    }
    var ruler = cast(activeMonarch(), Monarch);
    var ok = new Map<String, Bool>();
    for (g in ruler.roster())
      ok.set(g.id(), true);
    for (gid in uniq)
      if (!ok.exists(gid))
        throw 'GameMatchCore: 複選駐將含非麾下武將 "$gid"';
    return uniq;
  }

  function handleEmptyCityOccupySubmit(actor:IPlayer, leaf:IPlayerMenuEntry, formNumericFields:Null<Map<String, Int>>, formStringListFields:Null<Map<String, Array<String>>>):Void {
    if (_pendingEmptyCityTileIndex == null)
      throw "GameMatchCore: EmptyCityOccupySubmit 但無 pending 空城";
    if (formNumericFields == null)
      throw "GameMatchCore: EmptyCityOccupySubmit 須附 formNumericFields";
    var idx = _pendingEmptyCityTileIndex;
    var tt = formNumericFields.exists(OCCUPY_FIELD_TROOPS) ? formNumericFields.get(OCCUPY_FIELD_TROOPS) : 0;
    var gg = formNumericFields.exists(OCCUPY_FIELD_GRAIN) ? formNumericFields.get(OCCUPY_FIELD_GRAIN) : 0;
    var ruler = cast(activeMonarch(), Monarch);
    if (tt < 0 || gg < 0 || tt > ruler.troops() || gg > ruler.grain())
      throw "GameMatchCore: 進駐數值超出君主可用資源";
    var garrisonIds = parseOccupyGarrisonGeneralIds(formStringListFields);
    ruler.reduceTroops(tt);
    ruler.reduceGrain(gg);
    var prevT = _cityStockTroops.exists(idx) ? _cityStockTroops.get(idx) : 0;
    var prevG = _cityStockGrain.exists(idx) ? _cityStockGrain.get(idx) : 0;
    _cityStockTroops.set(idx, prevT + tt);
    _cityStockGrain.set(idx, prevG + gg);
    _cityOwner.set(idx, ruler.id());
    _cityGarrisonGenerals.set(idx, garrisonIds.copy());
    _pendingEmptyCityTileIndex = null;
    _activeSliceComplete = true;
    syncActiveSliceAfterMenuLeaf(EmptyCityOccupySubmit);
  }

  function handleEmptyCityOccupyAbort(actor:IPlayer, leaf:IPlayerMenuEntry):Void {
    if (_pendingEmptyCityTileIndex == null)
      throw "GameMatchCore: EmptyCityOccupyAbort 但無 pending 空城";
    _pendingEmptyCityTileIndex = null;
    _activeSliceComplete = true;
    syncActiveSliceAfterMenuLeaf(EmptyCityOccupyAbort);
  }

  function handleFriendlyCityDispatchApply(actor:IPlayer, leaf:IPlayerMenuEntry, formNumericFields:Null<Map<String, Int>>):Void {
    if (_pendingFriendlyCityTileIndex == null)
      throw "GameMatchCore: FriendlyCityDispatchApply 但無 pending 我方城池拜訪";
    if (formNumericFields == null)
      throw "GameMatchCore: FriendlyCityDispatchApply 須附 formNumericFields";
    var idx = _pendingFriendlyCityTileIndex;
    var tt = formNumericFields.exists(DISPATCH_FIELD_TROOPS) ? formNumericFields.get(DISPATCH_FIELD_TROOPS) : 0;
    var gg = formNumericFields.exists(DISPATCH_FIELD_GRAIN) ? formNumericFields.get(DISPATCH_FIELD_GRAIN) : 0;
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
    if (dT > 0)
      ruler.reduceTroops(dT);
    else if (dT < 0)
      ruler.grantTroops(-dT);
    if (dG > 0)
      ruler.reduceGrain(dG);
    else if (dG < 0)
      ruler.grantGrain(-dG);
    _cityStockTroops.set(idx, tt);
    _cityStockGrain.set(idx, gg);
    syncActiveSliceAfterMenuLeaf(FriendlyCityDispatchApply);
  }

  function handleFriendlyCityVisitEnd(actor:IPlayer, leaf:IPlayerMenuEntry):Void {
    if (_pendingFriendlyCityTileIndex == null)
      throw "GameMatchCore: FriendlyCityVisitEnd 但無 pending 我方城池拜訪";
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

  public function applyMenuLeaf(actor:IPlayer, leaf:IPlayerMenuEntry, ?playedJiCe:IJiCe, ?jiCeTargetMonarchId:MonarchId, ?formNumericFields:Map<String, Int>, ?formStringListFields:Map<String, Array<String>>):Void {
    if (!leaf.isEnabled())
      throw "GameMatchCore.applyMenuLeaf: leaf disabled (" + leaf.caption() + ")";

    if (actor.monarchId() != activeMonarch().id())
      throw "GameMatchCore.applyMenuLeaf: actor must be active monarch";

    switch leaf.kind() {
      case Move:
        GameMatchVer1Ops.applyMenuLeafForMove(this, actor);
      case TileEventPick:
        handleTileEventPick(actor, leaf, formStringListFields);
      case JiCeStagingSubmit:
        handleJiCeStagingSubmit(actor, leaf, formStringListFields);
      case JiCe:
        if (_pendingJiCe != null)
          throw "GameMatchCore: 已有進行中之計策暫存，請先完成計策選項";
        var card = playedJiCe != null ? playedJiCe : resolvePlayedJiCeFromLeaf(actor, leaf);
        if (jiCeTargetMonarchId == null)
          throw "GameMatchCore.applyMenuLeaf: JiCe leaf requires jiCeTargetMonarchId";
        card.applyAgainstMonarch(actor, jiCeTargetMonarchId);
        syncActiveSliceAfterMenuLeaf(JiCe);
      case Status:
        syncActiveSliceAfterMenuLeaf(Status);
      case ConfirmDone:
        syncActiveSliceAfterMenuLeaf(ConfirmDone);
        advanceActiveMonarchAfterConfirmDone();
      case EmptyCityOccupySubmit:
        handleEmptyCityOccupySubmit(actor, leaf, formNumericFields, formStringListFields);
      case EmptyCityOccupyAbort:
        handleEmptyCityOccupyAbort(actor, leaf);
      case FriendlyCityDispatchApply:
        handleFriendlyCityDispatchApply(actor, leaf, formNumericFields);
      case FriendlyCityVisitEnd:
        handleFriendlyCityVisitEnd(actor, leaf);
    }
    evaluateTermination();
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
