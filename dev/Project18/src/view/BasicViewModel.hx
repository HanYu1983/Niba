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
import game.IPopupMessage;
import game.PopupPayload;
import game.MenuClientConfirm;
import js.Browser;
import rx.disposables.ISubscription;
import view.UiEvent;

/**
 * 最小可用的 ViewModel 包裝：直接委派到底層 IGameMatch（以便快速把 HTML view 跑起來）。
 */
class BasicViewModel implements IViewModel {
  final match:IGameMatch;
  var evSub:Null<ISubscription> = null;

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
        EventCenter.publishEvent(PopupRefresh);
        EventCenter.publishViewModel(this);
      case PopupClose(popupId):
        var mid = match.activeMonarch().id();
        match.ackPopup(mid, popupId);
        EventCenter.publishEvent(PopupRefresh);
        EventCenter.publishViewModel(this);
      case PopupRefresh:
    }
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
    var actor:IPlayer = new LocalPlayer(a.id(), "active");
    match.applyMenuLeaf(actor, node);
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
    return match.monarchs();

  public function activeMonarch():IMonarch
    return match.activeMonarch();

  public function roundNumber():Int
    return match.roundNumber();

  public function hasMovedThisTurn():Bool
    return match.hasMovedThisTurn();

  public function canUseStrategyPreMove():Bool
    return match.canUseStrategyPreMove();

  public function canUseStrategyPostMove():Bool
    return match.canUseStrategyPostMove();

  public function monarchById(monarchId:MonarchId):IMonarch
    return match.monarchById(monarchId);

  public function pawnIndexOfPlayer(player:IPlayer):TileIndex
    return match.pawnIndexOfPlayer(player);

  public function pawnIndexOfMonarch(monarchId:MonarchId):TileIndex
    return match.pawnIndexOfMonarch(monarchId);

  public function tileAt(index:TileIndex):ITile
    return match.tileAt(index);

  public function availableJiCe(monarchId:MonarchId):Array<IJiCe>
    return match.availableJiCe(monarchId);

  public function isActivePlayerSliceComplete():Bool
    return match.isActivePlayerSliceComplete();

  public function getTerminationReason():MatchTerminationReason
    return match.getTerminationReason();

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

  static function popupPayloadText(p:PopupPayload):String {
    return switch p {
      case Plain(text): text;
    };
  }
}

private class LocalPlayer implements IPlayer {
  final mid:MonarchId;
  final name:String;
  public function new(mid:MonarchId, name:String) {
    this.mid = mid;
    this.name = name;
  }
  public function monarchId():MonarchId return mid;
  public function displayName():String return name;
}

