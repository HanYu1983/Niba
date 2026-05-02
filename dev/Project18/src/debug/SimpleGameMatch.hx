package debug;

import game.GameIds;
import game.IBoard;
import game.IGameMatch;
import game.IJiCe;
import game.IJiCeStagingPreviewRow;
import game.IGeneral;
import game.IMonarch;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.ITile;
import game.ITileEvent;
import game.PlayerMenuKind;
import game.TileKind;

class SimpleGameMatch implements IGameMatch {
  public static inline var DEFAULT_MOVE_DELTA = 3;

  /** 僅供特定 level（如 tile/event）測試驗證事件腳本實例；一般對局為 null。 */
  public var debugForkLoot:Null<SimpleLootForkTileEvent> = null;

  var _game:SimpleGame;
  var _board:IBoard;
  var _monarchs:Array<IMonarch>;
  var _activeId:MonarchId;
  var _activeSliceComplete:Bool;

  var _tileEventByIndex:Map<Int, ITileEvent>;
  var _pendingTileEvent:Null<ITileEvent>;

  var _pendingJiCe:Null<IJiCe>;
  var _jiCeStagingTargetId:Null<MonarchId>;
  var _jiCeStagingRows:Array<IJiCeStagingPreviewRow>;

  public function new(game:SimpleGame, level_key:String) {
    _game = game;
    _activeSliceComplete = false;
    _tileEventByIndex = new Map();
    _pendingTileEvent = null;
    clearJiCeStaging();

    var boot = MatchLevels.bootstrap(game, level_key);
    _board = boot.board;
    _monarchs = boot.monarchs;
    _activeId = boot.activeMonarchId;
    if (boot.postInit != null)
      boot.postInit(this);
  }

  function clearJiCeStaging():Void {
    _pendingJiCe = null;
    _jiCeStagingTargetId = null;
    _jiCeStagingRows = ([] : Array<IJiCeStagingPreviewRow>);
  }

  public function bindTileEvent(at:TileIndex, handler:ITileEvent):Void {
    _tileEventByIndex.set(at, handler);
  }

  public function createTile(index:TileIndex, kind:TileKind):ITile
    return _game.createTile(index, kind);

  public function createBoard(tiles:Array<ITile>):IBoard
    return _game.createBoard(tiles);

  public function createGeneral(id:GeneralId, owner:MonarchId, command:Int, might:Int, wit:Int, stewardship:Int):IGeneral
    return _game.createGeneral(id, owner, command, might, wit, stewardship);

  public function createMonarch(id:MonarchId, seat:Int, pawnIndex:TileIndex, roster:Array<IGeneral>, ?troops:Int, ?grain:Int):IMonarch
    return _game.createMonarch(id, seat, pawnIndex, roster, troops, grain);

  public function createPlayer(monarchId:MonarchId, displayName:String):IPlayer
    return _game.createPlayer(monarchId, displayName);

  public function createPlayerMenuEntry(kind:PlayerMenuKind, caption:String, enabled:Bool, ?decisionToken:String):IPlayerMenuEntry
    return _game.createPlayerMenuEntry(kind, caption, enabled, decisionToken);

  public function createPlayerMenuNode(caption:String, leaf:Null<IPlayerMenuEntry>, children:Array<IPlayerMenuNode>):IPlayerMenuNode
    return _game.createPlayerMenuNode(caption, leaf, children);

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

  public function createPlayerMenu(actor:IPlayer):IPlayerMenu {
    var pend = pendingTileEvent();
    var jiPending = pendingJiCe();
    var stagingActive = jiPending != null;
    var ctx = actor.monarchId() + "-" + isActivePlayerSliceComplete();
    if (pend != null)
      ctx += "-evt-" + pend.registryKey();
    if (stagingActive)
      ctx += "-jice-" + jiPending.registryKey();

    var roots:Array<IPlayerMenuNode> = [];

    if (pend != null) {
      var evRoots = pend.buildPlayerMenu(actor).rootNodes();
      roots.push(createPlayerMenuNode("事件：" + pend.registryKey(), null, evRoots));
    }

    if (stagingActive && jiPending != null) {
      var jiRoots = jiPending.buildPlayerMenu(actor).rootNodes();
      roots.push(createPlayerMenuNode("計策：" + jiPending.designLabel(), null, jiRoots));
    }

    var blockBasics = pend != null || stagingActive;
    var actions:Array<IPlayerMenuNode> = [
      createPlayerMenuNode("移動", createPlayerMenuEntry(Move, "移動", !blockBasics), []),
      createPlayerMenuNode("計策", createPlayerMenuEntry(JiCe, "計策（打出後暫存並選將）", !stagingActive && pend == null), []),
      createPlayerMenuNode("狀態", createPlayerMenuEntry(Status, "狀態（前端用，無後端結算）", true), []),
    ];
    var allowConfirm = isActivePlayerSliceComplete() && pend == null && !stagingActive;
    if (allowConfirm)
      actions.push(createPlayerMenuNode("結束", createPlayerMenuEntry(ConfirmDone, "結束本階段", true), []));

    roots.push(createPlayerMenuNode("本回合", null, actions));
    return new SimplePlayerMenu(actor, ctx, roots);
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
    var ruler = cast(activeMonarch(), SimpleMonarch);
    considerLandingAt(ruler.pawnIndex());
    _activeSliceComplete = _pendingTileEvent == null;
  }

  function considerLandingAt(idx:TileIndex):Void {
    _pendingTileEvent = null;
    var tile = board().tileAt(idx);
    if (tile.kind() != Event)
      return;
    _pendingTileEvent = _tileEventByIndex.get(idx);
  }

  function handleTileEventPick(actor:IPlayer, leaf:IPlayerMenuEntry):Void {
    var ev = _pendingTileEvent;
    if (ev == null)
      throw "SimpleGameMatch: TileEventPick 但無 pendingTileEvent";
    var tok = leaf.decisionToken();
    if (tok == null)
      throw "SimpleGameMatch: TileEventPick 需要 decisionToken";
    ev.resolveChoice(actor, tok);
    _pendingTileEvent = null;
    _activeSliceComplete = true;
  }

  function handleJiCePick(actor:IPlayer, leaf:IPlayerMenuEntry):Void {
    var card = pendingJiCe();
    if (card == null)
      throw "SimpleGameMatch: JiCePick 但無 pendingJiCe";
    var tok = leaf.decisionToken();
    if (tok == null)
      throw "SimpleGameMatch: JiCePick 需要 decisionToken（機械鍵）";

    card.resolveChoice(actor, tok);

    clearJiCeStaging();
    syncActiveSliceAfterMenuLeaf(JiCePick);
  }

  public function applyMenuLeaf(actor:IPlayer, leaf:IPlayerMenuEntry, ?playedJiCe:IJiCe, ?jiCeTargetMonarchId:MonarchId):Void {
    if (!leaf.isEnabled())
      throw "SimpleGameMatch.applyMenuLeaf: leaf disabled (" + leaf.caption() + ")";

    if (actor.monarchId() != activeMonarch().id())
      throw "SimpleGameMatch.applyMenuLeaf: actor must be active monarch";

    switch leaf.kind() {
      case Move:
        var ruler = cast(activeMonarch(), SimpleMonarch);
        ruler.advanceOnBoard(DEFAULT_MOVE_DELTA, board().length());
        settleAfterMoveLanding();
      case TileEventPick:
        handleTileEventPick(actor, leaf);
      case JiCePick:
        handleJiCePick(actor, leaf);
      case JiCe:
        if (pendingJiCe() != null)
          throw "SimpleGameMatch: 已有進行中之計策暫存，請先完成計策選項";
        if (playedJiCe == null)
          throw "SimpleGameMatch.applyMenuLeaf: JiCe leaf requires playedJiCe";
        if (jiCeTargetMonarchId == null)
          throw "SimpleGameMatch.applyMenuLeaf: JiCe leaf requires jiCeTargetMonarchId";
        playedJiCe.applyAgainstMonarch(actor, jiCeTargetMonarchId);
        syncActiveSliceAfterMenuLeaf(JiCe);
      case Status:
        syncActiveSliceAfterMenuLeaf(Status);
      case ConfirmDone:
        syncActiveSliceAfterMenuLeaf(ConfirmDone);
    }
  }

  public function board():IBoard
    return _board;

  public function monarchs():Array<IMonarch>
    return _monarchs;

  public function activeMonarch():IMonarch {
    for (m in _monarchs)
      if (m.id() == _activeId)
        return m;
    throw 'SimpleGameMatch.activeMonarch: id not in roster ($_activeId)';
  }

  public function availableJiCe(monarchId:MonarchId):Array<IJiCe> {
    return [];
  }

  public function isActivePlayerSliceComplete():Bool
    return _activeSliceComplete;
}
