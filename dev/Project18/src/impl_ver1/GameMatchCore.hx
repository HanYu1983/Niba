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
import game.PlayerMenuKind;
import game.TileKind;

/**
 * Ver1 賽局核心：終局／「移動」葉委派 {@link GameMatchVer1Ops}（傳入 {@code this}，不靠建構注入）。
 * 友元見 {@literal @:allow(impl_ver1)}。
 */
@:allow(impl_ver1)
class GameMatchCore implements IGameMatch {
  public static inline var DEFAULT_MOVE_DELTA = 3;

  var _board:Board;
  var _monarchs:Array<Monarch>;
  var _activeId:MonarchId;
  var _activeSliceComplete:Bool;
  var _terminationReason:MatchTerminationReason;

  var _tileEventByIndex:Map<Int, ITileEvent>;
  var _pendingTileEvent:Null<ITileEvent>;
  var _tileEventStagingRows:Array<IJiCeStagingPreviewRow>;

  var _pendingJiCe:Null<IJiCe>;
  var _jiCeStagingTargetId:Null<MonarchId>;
  var _jiCeStagingRows:Array<IJiCeStagingPreviewRow>;

  var _ownedJiCe:Map<MonarchId, Array<IJiCe>>;

  public function new() {
    _board = cast null;
    _monarchs = [];
    _activeId = "";
    _activeSliceComplete = false;
    _terminationReason = NotEnded;
    _tileEventByIndex = new Map();
    _pendingTileEvent = null;
    clearTileEventStagingRows();
    _ownedJiCe = new Map();
    clearJiCeStaging();
  }

  function clearJiCeStaging():Void {
    _pendingJiCe = null;
    _jiCeStagingTargetId = null;
    _jiCeStagingRows = ([] : Array<IJiCeStagingPreviewRow>);
  }

  function clearTileEventStagingRows():Void {
    _tileEventStagingRows = ([] : Array<IJiCeStagingPreviewRow>);
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

  public function createPlayerMenuNode(caption:String, leaf:Null<IPlayerMenuEntry>, children:Array<IPlayerMenuNode>):IPlayerMenuNode
    return new PlayerMenuNode(caption, leaf, children);

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

  public function enterTileEventGeneralStaging(handler:ITileEvent, previewRows:Array<IJiCeStagingPreviewRow>):Void {
    if (_pendingTileEvent != handler)
      throw "GameMatchCore.enterTileEventGeneralStaging: handler 須為當前 forceGetPendingTileEvent()";
    _tileEventStagingRows = previewRows.copy();
  }

  public function forceTileEventStagingPreviewRows():Array<IJiCeStagingPreviewRow>
    return _tileEventStagingRows.copy();

  public function createPlayerMenu(actor:IPlayer):IPlayerMenu {
    var pend = _pendingTileEvent;
    var jiPending = _pendingJiCe;
    var stagingActive = jiPending != null;
    var ctx = actor.monarchId() + "-" + isActivePlayerSliceComplete();
    if (pend != null)
      ctx += "-evt-" + pend.registryKey();
    if (stagingActive && jiPending != null)
      ctx += "-jice-" + jiPending.registryKey();

    var roots:Array<IPlayerMenuNode> = [];

    if (pend != null) {
      if (_tileEventStagingRows.length > 0) {
        var evPickNodes:Array<IPlayerMenuNode> = [];
        for (r in _tileEventStagingRows)
          evPickNodes.push(
            createPlayerMenuNode(
              r.generalId(),
              createPlayerMenuEntry(JiCePick, r.outcomeDescription(), true, r.generalId()),
              ([] : Array<IPlayerMenuNode>)
            )
          );
        roots.push(createPlayerMenuNode("事件：" + pend.registryKey() + "·選將", null, evPickNodes));
      } else {
        var evRoots = pend.buildPlayerMenu(actor).rootNodes();
        roots.push(createPlayerMenuNode("事件：" + pend.registryKey(), null, evRoots));
      }
    }

    if (stagingActive && jiPending != null) {
      var jiRoots = jiPending.buildPlayerMenu(actor).rootNodes();
      roots.push(createPlayerMenuNode("計策：" + jiPending.designLabel(), null, jiRoots));
    }

    var blockBasics = pend != null || stagingActive;
    var jiEnabledBase = !stagingActive && pend == null;

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
    var allowConfirm = isActivePlayerSliceComplete() && pend == null && !stagingActive;
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
      case JiCePick:
      case Status:
      case Move:
      case TileEventPick:
    }
  }

  /** 子類 {@link #_applyMenuLeafForMove} 完成棋子位移後呼叫，處理落地與切片旗標。 */
  public function settleAfterMoveLanding():Void {
    var ruler = cast(activeMonarch(), Monarch);
    considerLandingAt(ruler.pawnIndex());
    _activeSliceComplete = _pendingTileEvent == null;
  }

  function considerLandingAt(idx:TileIndex):Void {
    _pendingTileEvent = null;
    clearTileEventStagingRows();
    var tile = board().tileAt(idx);
    if (tile.kind() != Event)
      return;
    _pendingTileEvent = _tileEventByIndex.get(idx);
  }

  function handleTileEventPick(actor:IPlayer, leaf:IPlayerMenuEntry):Void {
    var ev = _pendingTileEvent;
    if (ev == null)
      throw "GameMatchCore: TileEventPick 但無 forceGetPendingTileEvent";
    var tok = leaf.decisionToken();
    if (tok == null)
      throw "GameMatchCore: TileEventPick 需要 decisionToken";
    ev.resolveChoice(actor, tok);
    if (_tileEventStagingRows.length > 0)
      return;
    _pendingTileEvent = null;
    _activeSliceComplete = true;
  }

  function handleJiCePick(actor:IPlayer, leaf:IPlayerMenuEntry):Void {
    var tok = leaf.decisionToken();
    if (tok == null)
      throw "GameMatchCore: JiCePick 需要 decisionToken（機械鍵）";

    var card = _pendingJiCe;
    if (card != null) {
      card.resolveChoice(actor, tok);
      clearJiCeStaging();
      syncActiveSliceAfterMenuLeaf(JiCePick);
      return;
    }

    var ev = _pendingTileEvent;
    if (ev != null && _tileEventStagingRows.length > 0) {
      ev.resolveStagingGeneral(actor, tok);
      clearTileEventStagingRows();
      _pendingTileEvent = null;
      _activeSliceComplete = true;
      syncActiveSliceAfterMenuLeaf(JiCePick);
      return;
    }

    throw "GameMatchCore: JiCePick 但無進行中之計策暫存或事件選將暫存";
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

  public function applyMenuLeaf(actor:IPlayer, leaf:IPlayerMenuEntry, ?playedJiCe:IJiCe, ?jiCeTargetMonarchId:MonarchId):Void {
    if (!leaf.isEnabled())
      throw "GameMatchCore.applyMenuLeaf: leaf disabled (" + leaf.caption() + ")";

    if (actor.monarchId() != activeMonarch().id())
      throw "GameMatchCore.applyMenuLeaf: actor must be active monarch";

    switch leaf.kind() {
      case Move:
        GameMatchVer1Ops.applyMenuLeafForMove(this, actor);
      case TileEventPick:
        handleTileEventPick(actor, leaf);
      case JiCePick:
        handleJiCePick(actor, leaf);
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
