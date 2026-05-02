package impl_ver1;

import game.GameIds;
import game.IBoard;
import game.IGameMatch;
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
 * Ver1 賽局：零件工廠與賽局狀態皆於此；友元見 {@literal @:allow(impl_ver1)}。
 */
@:allow(impl_ver1)
class GameMatch implements IGameMatch {
  /** TODO: 骨架預設步幅；骰子／路網／計策修正後應由此衍生有效 delta（見 {@link #applyMenuLeaf} Move）。 */
  public static inline var DEFAULT_MOVE_DELTA = 3;

  var _board:Board;
  var _monarchs:Array<Monarch>;
  var _activeId:MonarchId;
  var _activeSliceComplete:Bool;

  var _tileEventByIndex:Map<Int, ITileEvent>;
  var _pendingTileEvent:Null<ITileEvent>;
  /** 格子事件「選將」暫存列（與計策共用 {@link IJiCeStagingPreviewRow} 展示模型）。 */
  var _tileEventStagingRows:Array<IJiCeStagingPreviewRow>;

  var _pendingJiCe:Null<IJiCe>;
  var _jiCeStagingTargetId:Null<MonarchId>;
  var _jiCeStagingRows:Array<IJiCeStagingPreviewRow>;

  /** 君主所持計策實例列表（順序對應選單 decisionToken 索引）。 */
  var _ownedJiCe:Map<MonarchId, Array<IJiCe>>;

  /** 空白賽局；由 {@link Game#createGameMatch} 透過 {@link #createBoard}／{@link #createMonarch} 等組立局面。 */
  public function new() {
    _board = cast null;
    _monarchs = [];
    _activeId = "";
    _activeSliceComplete = false;
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

  public function bindTileEvent(at:TileIndex, handler:ITileEvent):Void {
    _tileEventByIndex.set(at, handler);
  }

  public function createTile(index:TileIndex, kind:TileKind):ITile
    return new Tile(index, kind);

  public function createBoard(tiles:Array<ITile>):IBoard {
    if (_board != null)
      throw "GameMatch.createBoard: board already set";
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
    throw 'GameMatch: monarch "$mid" not registered';
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
    throw 'GameMatch.createJiCe: owner "$ownerMonarchId" not in monarchs';
  }

  public function createJiCe(key:JiCeKey, ownerMonarchId:MonarchId):IJiCe {
    requireOwnerMonarch(ownerMonarchId);
    var card:IJiCe = switch key {
      case LuoshiJiCe.REGISTRY_KEY:
        new LuoshiJiCe(this);
      default:
        throw 'GameMatch.createJiCe: unknown key "$key"';
    };
    _ownedJiCe.get(ownerMonarchId).push(card);
    return card;
  }

  public function pendingTileEvent():Null<ITileEvent>
    return _pendingTileEvent;

  public function pendingJiCe():Null<IJiCe>
    return _pendingJiCe;

  public function jiCeStagingTargetMonarchId():Null<MonarchId>
    return _jiCeStagingTargetId;

  public function jiCeStagingPreviewRows():Array<IJiCeStagingPreviewRow> {
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
      throw "GameMatch.enterTileEventGeneralStaging: handler 須為當前 pendingTileEvent";
    _tileEventStagingRows = previewRows.copy();
  }

  public function tileEventStagingPreviewRows():Array<IJiCeStagingPreviewRow>
    return _tileEventStagingRows.copy();

  public function createPlayerMenu(actor:IPlayer):IPlayerMenu {
    var pend = pendingTileEvent();
    var jiPending = pendingJiCe();
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

    // TODO: 依規剘過濾／排序／灰階可用計策（冷卻、目標合法性、同名堆疊等）；現為 availableJiCe 全列不過濾。
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

  function settleAfterMoveLanding():Void {
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
      throw "GameMatch: TileEventPick 但無 pendingTileEvent";
    var tok = leaf.decisionToken();
    if (tok == null)
      throw "GameMatch: TileEventPick 需要 decisionToken";
    ev.resolveChoice(actor, tok);
    if (_tileEventStagingRows.length > 0)
      return;
    _pendingTileEvent = null;
    _activeSliceComplete = true;
  }

  function handleJiCePick(actor:IPlayer, leaf:IPlayerMenuEntry):Void {
    var tok = leaf.decisionToken();
    if (tok == null)
      throw "GameMatch: JiCePick 需要 decisionToken（機械鍵）";

    var card = pendingJiCe();
    if (card != null) {
      card.resolveChoice(actor, tok);
      clearJiCeStaging();
      syncActiveSliceAfterMenuLeaf(JiCePick);
      return;
    }

    var ev = pendingTileEvent();
    if (ev != null && _tileEventStagingRows.length > 0) {
      ev.resolveStagingGeneral(actor, tok);
      clearTileEventStagingRows();
      _pendingTileEvent = null;
      _activeSliceComplete = true;
      syncActiveSliceAfterMenuLeaf(JiCePick);
      return;
    }

    throw "GameMatch: JiCePick 但無進行中之計策暫存或事件選將暫存";
  }

  public function applyMenuLeaf(actor:IPlayer, leaf:IPlayerMenuEntry, ?playedJiCe:IJiCe, ?jiCeTargetMonarchId:MonarchId):Void {
    if (!leaf.isEnabled())
      throw "GameMatch.applyMenuLeaf: leaf disabled (" + leaf.caption() + ")";

    if (actor.monarchId() != activeMonarch().id())
      throw "GameMatch.applyMenuLeaf: actor must be active monarch";

    switch leaf.kind() {
      case Move:
        var ruler = cast(activeMonarch(), Monarch);
        // TODO: 移動份量應來自骰子／計策修正／路網過費等規剘，勿長期固定 DEFAULT_MOVE_DELTA。
        ruler.advanceOnBoard(DEFAULT_MOVE_DELTA, board().length());
        settleAfterMoveLanding();
      case TileEventPick:
        handleTileEventPick(actor, leaf);
      case JiCePick:
        handleJiCePick(actor, leaf);
      case JiCe:
        if (pendingJiCe() != null)
          throw "GameMatch: 已有進行中之計策暫存，請先完成計策選項";
        var card = playedJiCe != null ? playedJiCe : resolvePlayedJiCeFromLeaf(actor, leaf);
        if (jiCeTargetMonarchId == null)
          throw "GameMatch.applyMenuLeaf: JiCe leaf requires jiCeTargetMonarchId";
        card.applyAgainstMonarch(actor, jiCeTargetMonarchId);
        syncActiveSliceAfterMenuLeaf(JiCe);
      case Status:
        syncActiveSliceAfterMenuLeaf(Status);
      case ConfirmDone:
        syncActiveSliceAfterMenuLeaf(ConfirmDone);
        advanceActiveMonarchAfterConfirmDone();
    }
  }

  /** 「結束本階段」後將行動權輪至 {@link #monarchs} 陣列之下一位（環狀）；僅一人時維持同君主。 */
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
      throw 'GameMatch.advanceActiveMonarchAfterConfirmDone: active ($_activeId) not in monarchs';
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
    throw 'GameMatch.activeMonarch: id not in roster ($_activeId)';
  }

  public function availableJiCe(monarchId:MonarchId):Array<IJiCe> {
    var row = _ownedJiCe.get(monarchId);
    return row != null ? row.copy() : [];
  }

  function resolvePlayedJiCeFromLeaf(actor:IPlayer, leaf:IPlayerMenuEntry):IJiCe {
    var tok = leaf.decisionToken();
    if (tok == null)
      throw "GameMatch.applyMenuLeaf: JiCe leaf 須傳 playedJiCe，或選單葉 decisionToken（所持計策索引）";
    var idx = Std.parseInt(tok);
    if (idx == null)
      throw "GameMatch.applyMenuLeaf: JiCe decisionToken 須為所持計策索引數字";
    var owned = _ownedJiCe.get(actor.monarchId());
    if (owned == null || idx < 0 || idx >= owned.length)
      throw "GameMatch.applyMenuLeaf: 所持計策索引超出範圍 (" + tok + ")";
    return owned[idx];
  }

  public function isActivePlayerSliceComplete():Bool
    return _activeSliceComplete;
}
