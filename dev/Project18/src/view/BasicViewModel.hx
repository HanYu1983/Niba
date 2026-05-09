package view;

import game.GameIds;
import game.IBoard;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.IJiCe;
import game.IJiCeMovementStepHook;
import game.IJiCeStagingPreviewRow;
import game.IMonarch;
import game.IPlayer;
import game.IPlayerMenu;
import game.ITile;
import game.ITileEvent;
import game.MatchTerminationReason;
import game.MenuFormWidget;
import game.IGameMatch;
import game.GameError;
import game.IPopupMessage;
import game.PopupPayload;
import game.MenuClientConfirm;
import game.TerrainKind;
import game.TileGrowth;
import game.CityLevel;
import game.AiDecision;
import js.Browser;
import rx.disposables.ISubscription;
import view.UiEvent;
import view.AiUiFlow;
import view.UiSnapshot;

/**
 * 最小可用的 ViewModel 包裝：直接委派到底層 IGameMatch（以便快速把 HTML view 跑起來）。
 */
class BasicViewModel implements IViewModel {
  final match:IGameMatch;
  var evSub:Null<ISubscription> = null;
  var _presentationSnapshot:Null<UiSnapshot> = null;

  public function new(match:IGameMatch) {
    this.match = match;
    evSub = EventCenter.eventSubject.subscribe(handleUiEvent);
  }

  public function dispose():Void {
    if (evSub != null) {
      evSub.unsubscribe();
      evSub = null;
    }
  }

  function handleUiEvent(ev:UiEvent):Void {
    switch ev {
      case TileClick(_):
      case PlayerClick(_):
      case Slider(node, widgetIndex, value):
        applySliderToNode(node, widgetIndex, value);
        // Slider 互動不應觸發整體重繪，否則 DOM 會被重建導致滑桿被重置，看起來像「無法拖動」。
      case GeneralMultiPick(node, widgetIndex, selectedGeneralIds):
        applyGeneralMultiPickToNode(node, widgetIndex, selectedGeneralIds);
      case MonarchSinglePick(node, widgetIndex, selectedMonarchIds):
        applyMonarchSinglePickToNode(node, widgetIndex, selectedMonarchIds);
      case TileSinglePick(node, widgetIndex, selectedTileIndexes):
        applyTileSinglePickToNode(node, widgetIndex, selectedTileIndexes);
      case MenuClick(node, entry):
        applyMenuClick(node, entry);
        EventCenter.publishEvent(OutboxRefresh);
        EventCenter.publishEvent(PopupRefresh);
        EventCenter.publishEvent(AnimationRefresh);
        EventCenter.publishViewModel(this);
      case AiStep:
        if (runAiStepOnce()) {
          EventCenter.publishEvent(OutboxRefresh);
          EventCenter.publishEvent(PopupRefresh);
          EventCenter.publishEvent(AnimationRefresh);
          EventCenter.publishViewModel(this);
        }
      case PopupClose(popupId):
        var mid = match.activeMonarch().id();
        match.ackOutbox(mid, popupId);
        match.ackPopup(mid, popupId);
        EventCenter.publishEvent(OutboxRefresh);
        EventCenter.publishEvent(PopupRefresh);
        EventCenter.publishEvent(AnimationRefresh);
        EventCenter.publishViewModel(this);
      case PopupRefresh:
      case AnimationRefresh:
      case OutboxRefresh:
    }
  }

  public function isAiMonarch(monarchId:MonarchId):Bool {
    return match.playerForMonarch(monarchId).isAi();
  }

  public function setPresentationSnapshot(snapshot:Null<UiSnapshot>):Void {
    _presentationSnapshot = snapshot;
  }

  public function presentationSnapshot():Null<UiSnapshot> {
    return _presentationSnapshot;
  }

  function runAiStepOnce():Bool {
    var mid = match.activeMonarch().id();
    if (!isAiMonarch(mid))
      return false;
    switch match.getTerminationReason() {
      case Draw | Victory(_):
        return false;
      case NotEnded:
    }

    var actor:IPlayer = match.playerForMonarch(mid);
    var d = match.aiSuggest(actor);
    if (d == null)
      return false;
    applyAiDecision(actor, d);
    return true;
  }

  function applyAiDecision(actor:IPlayer, d:AiDecision):Void {
    AiUiFlow.applyAiDecision(match, actor, d, function(node, entry) {
      // 走既有 applyMenuClick 的錯誤處理路徑（含 GameError→popup）
      applyMenuClick(node, entry);
    });
  }

  static function resolveNodeByPath(roots:Array<IPlayerMenuNode>, path:Array<Int>):Null<IPlayerMenuNode> {
    if (path == null || path.length == 0)
      return null;
    var cur:Null<IPlayerMenuNode> = null;
    var kids = roots;
    for (i in 0...path.length) {
      var idx = path[i];
      if (kids == null || idx < 0 || idx >= kids.length)
        return null;
      cur = kids[idx];
      kids = cur.children();
    }
    return cur;
  }

  static function findEntryOnNode(node:IPlayerMenuNode, kind:game.PlayerMenuKind, tok:Null<String>):Null<IPlayerMenuEntry> {
    var leaf = node.leaf();
    if (leaf != null && leaf.kind() == kind && (tok == null || leaf.decisionToken() == tok))
      return leaf;
    var ws = node.formWidgets();
    if (ws != null)
      for (w in ws)
        switch w {
          case Button(e):
            if (e.kind() == kind && (tok == null || e.decisionToken() == tok))
              return e;
          default:
        }
    return null;
  }

  function applySliderToNode(node:IPlayerMenuNode, widgetIndex:Int, value:Int):Void {
    var widgets = node.formWidgets();
    if (widgets == null || widgetIndex < 0 || widgetIndex >= widgets.length)
      return;
    switch widgets[widgetIndex] {
      case Slider(lbl, min, max, step, _):
        widgets[widgetIndex] = Slider(lbl, min, max, step, value);
      default:
    }
  }

  function applyMenuClick(node:IPlayerMenuNode, entry:IPlayerMenuEntry):Void {
    // 若為表單內 Button，需標記 activationEntry
    node.setActivationEntry(entry);
    var hint:Null<MenuClientConfirm> = entry.clientConfirm();
    if (hint != null) {
      var hasWindow:Bool = untyped __js__("typeof window !== 'undefined' && typeof window.confirm !== 'undefined'");
      if (hasWindow) {
        var ok = Browser.window.confirm(hint.title + "\n\n" + hint.message);
        if (!ok) {
          node.setActivationEntry(null);
          return;
        }
      }
    }
    var a = match.activeMonarch();
    var actor:IPlayer = match.playerForMonarch(a.id());
    try {
      match.applyMenuLeaf(actor, node);
    } catch (e:GameError) {
      // 只攔截遊戲規則錯誤，轉成 popup，避免整個 UI 流程中斷
      node.setActivationEntry(null);
      match.pushInfoPopup(actor.monarchId(), e.popupTitle, PopupPayload.Plain(e.message), e.ctxKey);
    } catch (e:Dynamic) {
      // 非 GameError：視為系統/程式錯誤，使用 alert 直接顯示（方便回報與除錯）
      node.setActivationEntry(null);
      var hasWindow:Bool = untyped __js__("typeof window !== 'undefined' && typeof window.alert !== 'undefined'");
      if (hasWindow) {
        var msg = "系統錯誤（非 GameError）\n\n" + Std.string(e);
        Browser.window.alert(msg);
      }
      throw e;
    }
    // NOTE(popup): 目前僅攔截 GameError 並轉 popup；其他例外會直接拋出（利於除錯）。
    // 若要做「正式版更友善」的錯誤呈現，可在非開發模式也攔截一般例外並顯示「系統錯誤」popup（同時保留堆疊供回報）。
    //
    // NOTE(popup): 若 catch 規則變複雜，建議抽出 presenter（例如 view/GameErrorPresenter），
    // 避免 BasicViewModel 逐步長大後 catch 區塊變成各種特例堆疊。
  }

  function snapshotWrapMonarchs(xs:Array<IMonarch>):Array<IMonarch> {
    if (_presentationSnapshot == null)
      return xs;
    var out:Array<IMonarch> = [];
    for (m in xs)
      out.push(snapshotWrapMonarch(m));
    return out;
  }

  function snapshotWrapMonarch(m:IMonarch):IMonarch {
    var s = _presentationSnapshot;
    if (s == null)
      return m;
    // 若 snapshot 沒提供任何該 monarch 的覆寫，直接回傳原物件
    var id = m.id();
    var has = false;
    if (s.monarchPawnIndexById != null && s.monarchPawnIndexById.exists(id))
      has = true;
    if (s.monarchTroopsById != null && s.monarchTroopsById.exists(id))
      has = true;
    if (s.monarchGrainById != null && s.monarchGrainById.exists(id))
      has = true;
    if (s.monarchGoldById != null && s.monarchGoldById.exists(id))
      has = true;
    return has ? new SnapshotMonarch(m, s) : m;
  }

  function applyGeneralMultiPickToNode(node:IPlayerMenuNode, widgetIndex:Int, selectedGeneralIds:Array<String>):Void {
    var widgets = node.formWidgets();
    if (widgets == null || widgetIndex < 0 || widgetIndex >= widgets.length)
      return;
    switch widgets[widgetIndex] {
      case GeneralMultiPick(lbl, choices, _):
        widgets[widgetIndex] = GeneralMultiPick(lbl, choices, selectedGeneralIds.copy());
      default:
    }
  }

  function applyMonarchSinglePickToNode(node:IPlayerMenuNode, widgetIndex:Int, selectedMonarchIds:Array<String>):Void {
    var widgets = node.formWidgets();
    if (widgets == null || widgetIndex < 0 || widgetIndex >= widgets.length)
      return;
    switch widgets[widgetIndex] {
      case MonarchSinglePick(lbl, choices, _):
        widgets[widgetIndex] = MonarchSinglePick(lbl, choices, selectedMonarchIds.copy());
      default:
    }
  }

  function applyTileSinglePickToNode(node:IPlayerMenuNode, widgetIndex:Int, selectedTileIndexes:Array<Int>):Void {
    var widgets = node.formWidgets();
    if (widgets == null || widgetIndex < 0 || widgetIndex >= widgets.length)
      return;
    switch widgets[widgetIndex] {
      case TileSinglePick(lbl, choices, _):
        widgets[widgetIndex] = TileSinglePick(lbl, choices, selectedTileIndexes.copy());
      default:
    }
  }

  public function board():IBoard
    return match.board();

  public function monarchs():Array<IMonarch>
    return snapshotWrapMonarchs(match.monarchs());

  public function activeMonarch():IMonarch
    return snapshotWrapMonarch(match.activeMonarch());

  public function roundNumber():Int
    return match.roundNumber();

  public function hasMovedThisTurn():Bool
    return match.hasMovedThisTurn();

  public function canUseStrategyPreMove():Bool
    return match.canUseStrategyPreMove();

  public function canUseStrategyPostMove():Bool
    return match.canUseStrategyPostMove();

  public function monarchById(monarchId:MonarchId):IMonarch
    return snapshotWrapMonarch(match.monarchById(monarchId));

  public function pawnIndexOfPlayer(player:IPlayer):TileIndex
    return match.pawnIndexOfPlayer(player);

  public function pawnIndexOfMonarch(monarchId:MonarchId):TileIndex
    return match.pawnIndexOfMonarch(monarchId);

  public function playerForMonarch(monarchId:MonarchId):IPlayer
    return match.playerForMonarch(monarchId);

  public function tileAt(index:TileIndex):ITile
    return match.tileAt(index);

  public function forceGetTileTerrain(at:TileIndex):TerrainKind
    return match.forceGetTileTerrain(at);

  public function forceGetTileGrowth(at:TileIndex):TileGrowth
    return match.forceGetTileGrowth(at);

  public function availableJiCe(monarchId:MonarchId):Array<IJiCe>
    return match.availableJiCe(monarchId);

  public function isActivePlayerSliceComplete():Bool
    return match.isActivePlayerSliceComplete();

  public function getTerminationReason():MatchTerminationReason
    return match.getTerminationReason();

  public function scoreOfMonarch(monarchId:MonarchId):Int
    return match.scoreOfMonarch(monarchId);

  public function aiSuggest(actor:IPlayer):Null<game.AiDecision>
    return match.aiSuggest(actor);

  public function movementStepHooks():Array<IJiCeMovementStepHook>
    return match.movementStepHooks();

  public function forceGetPendingTileEvent():Null<ITileEvent>
    return match.forceGetPendingTileEvent();

  public function forceGetPendingTileEventEffectMultiplier():Float
    return match.forceGetPendingTileEventEffectMultiplier();

  public function forceGetPendingLandingTile():Null<TileIndex>
    return match.forceGetPendingLandingTile();

  public function forceGetLastRolledMoveDelta():Null<Int>
    return match.forceGetLastRolledMoveDelta();

  public function forceGetPendingJiCe():Null<IJiCe>
    return match.forceGetPendingJiCe();

  public function forceHasPendingStaging():Bool
    return match.forceHasPendingStaging();

  public function forceGetPendingStagingKey():Null<String>
    return match.forceGetPendingStagingKey();

  public function forceGetPendingStagingLabel():Null<String>
    return match.forceGetPendingStagingLabel();

  public function forceJiCeStagingPreviewRows():Array<IJiCeStagingPreviewRow>
    return match.forceJiCeStagingPreviewRows();

  public function forceStagingPreviewRows():Array<IJiCeStagingPreviewRow>
    return match.forceStagingPreviewRows();

  public function cityVacantNoGarrison(at:TileIndex):Bool
    return match.cityVacantNoGarrison(at);

  public function forceGetPendingEmptyCityOccupyTile():Null<TileIndex>
    return match.forceGetPendingEmptyCityOccupyTile();

  public function forceGetCityStoredTroops(at:TileIndex):Int
    return match.forceGetCityStoredTroops(at);

  public function forceGetCityStoredGrain(at:TileIndex):Int
    return match.forceGetCityStoredGrain(at);

  public function forceGetCityStoredGold(at:TileIndex):Int
    return match.forceGetCityStoredGold(at);

  public function forceGetCityLevel(at:TileIndex):game.CityLevel
    return match.forceGetCityLevel(at);

  public function forceGetCityOwner(at:TileIndex):Null<MonarchId>
    return match.forceGetCityOwner(at);

  public function forceGetCityGarrisonGeneralIds(at:TileIndex):Array<GeneralId>
    return match.forceGetCityGarrisonGeneralIds(at);

  public function forceGetPendingFriendlyCityVisitTile():Null<TileIndex>
    return match.forceGetPendingFriendlyCityVisitTile();

  public function forceGetPendingVillageTile():Null<TileIndex>
    return match.forceGetPendingVillageTile();

  public function forceGetPendingResourceTile():Null<TileIndex>
    return match.forceGetPendingResourceTile();

  public function forceGetPendingGeneralTile():Null<TileIndex>
    return match.forceGetPendingGeneralTile();

  public function forceGetPendingShopTile():Null<TileIndex>
    return match.forceGetPendingShopTile();

  public function forceGetVillageFriendly(at:TileIndex, monarchId:MonarchId):Int
    return match.forceGetVillageFriendly(at, monarchId);

  public function forceGetVillageOwner(at:TileIndex):Null<MonarchId>
    return match.forceGetVillageOwner(at);

  public function forceGetVillageStoredGold(at:TileIndex):Int
    return match.forceGetVillageStoredGold(at);

  public function forceGetVillageStoredGrain(at:TileIndex):Int
    return match.forceGetVillageStoredGrain(at);

  public function forceGetVillageStoredTroops(at:TileIndex):Int
    return match.forceGetVillageStoredTroops(at);

  public function forceGetVillageLevel(at:TileIndex):CityLevel
    return match.forceGetVillageLevel(at);

  public function forceGetPendingHostileCityTile():Null<TileIndex>
    return match.forceGetPendingHostileCityTile();

  public function forceGetHostileCityFlowPhase():Null<String>
    return match.forceGetHostileCityFlowPhase();

  public function forceGetHostileCitySettlementSummary():Null<String>
    return match.forceGetHostileCitySettlementSummary();

  public function cityOwnedByActiveMonarch(at:TileIndex):Bool
    return match.cityOwnedByActiveMonarch(at);

  public function createPlayerMenu(actor:IPlayer):IPlayerMenu
    return match.createPlayerMenu(actor);

  public function pendingPopups(monarchId:MonarchId):Array<IPopupMessage>
    return match.pendingPopups(monarchId);

  public function ackPopup(monarchId:MonarchId, popupId:String):Void
    match.ackPopup(monarchId, popupId);

  public function pendingAnimations(monarchId:MonarchId):Array<game.IAnimationMessage>
    return match.pendingAnimations(monarchId);

  public function ackAnimation(monarchId:MonarchId, animationId:String):Void
    match.ackAnimation(monarchId, animationId);

  public function pendingOutbox(monarchId:MonarchId):Array<game.IOutboxMessage>
    return match.pendingOutbox(monarchId);

  public function ackOutbox(monarchId:MonarchId, outboxId:String):Void
    match.ackOutbox(monarchId, outboxId);

  static function popupPayloadText(p:PopupPayload):String {
    return switch p {
      case Plain(text): text;
    };
  }
}

private class SnapshotMonarch implements game.IMonarch {
  final base:game.IMonarch;
  final snap:UiSnapshot;

  public function new(base:game.IMonarch, snap:UiSnapshot) {
    this.base = base;
    this.snap = snap;
  }

  public function id():MonarchId return base.id();
  public function seat():Int return base.seat();

  public function pawnIndex():TileIndex {
    var m = snap.monarchPawnIndexById;
    return (m != null && m.exists(base.id())) ? m.get(base.id()) : base.pawnIndex();
  }

  public function roster():Array<game.IGeneral> return base.roster();

  public function troops():Int {
    var m = snap.monarchTroopsById;
    return (m != null && m.exists(base.id())) ? m.get(base.id()) : base.troops();
  }

  public function grain():Int {
    var m = snap.monarchGrainById;
    return (m != null && m.exists(base.id())) ? m.get(base.id()) : base.grain();
  }

  public function gold():Int {
    var m = snap.monarchGoldById;
    return (m != null && m.exists(base.id())) ? m.get(base.id()) : base.gold();
  }

  public function prestige():Int return base.prestige();

  public function grantTroops(n:Int):Void base.grantTroops(n);
  public function grantGrain(n:Int):Void base.grantGrain(n);
  public function grantGold(n:Int):Void base.grantGold(n);
  public function grantPrestige(n:Int):Void base.grantPrestige(n);
}

