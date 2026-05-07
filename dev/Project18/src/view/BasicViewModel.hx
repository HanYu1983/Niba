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

/**
 * 最小可用的 ViewModel 包裝：直接委派到底層 IGameMatch（以便快速把 HTML view 跑起來）。
 */
class BasicViewModel implements IViewModel {
  final match:IGameMatch;
  var evSub:Null<ISubscription> = null;
  final _aiByMonarchId:Map<MonarchId, Bool> = new Map();

  public function new(match:IGameMatch) {
    this.match = match;
    evSub = EventCenter.eventSubject.subscribe(handleUiEvent);
    // 預設：demo 先把 m-b 視為 AI（若不存在則無效果）；可在 UI 透過 AiToggle 更改
    _aiByMonarchId.set("m-b", true);
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
      case AiToggle(monarchId, isAi):
        _aiByMonarchId.set(monarchId, isAi);
        EventCenter.publishViewModel(this);
      case AiStep:
        if (!ensureActiveMonarchAiOrHint())
          return;
        if (runAiStepOnce()) {
          EventCenter.publishEvent(PopupRefresh);
          EventCenter.publishViewModel(this);
        }
      case AiAuto:
        if (!ensureActiveMonarchAiOrHint())
          return;
        runAiAutoUntilStop();
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

  public function isAiMonarch(monarchId:MonarchId):Bool {
    return _aiByMonarchId.exists(monarchId) && _aiByMonarchId.get(monarchId);
  }

  function runAiStepOnce(?autoAckPopups:Bool = false):Bool {
    var mid = match.activeMonarch().id();
    if (!isAiMonarch(mid)) {
      return false;
    }
    // 終局就不再自動操作
    switch match.getTerminationReason() {
      case NotEnded:
      case _:
        return false;
    }

    var actor:IPlayer = new LocalPlayer(mid, "ai", true);
    var d = match.aiSuggest(actor);
    if (d == null) {
      return false;
    }
    applyAiDecision(actor, d);
    if (autoAckPopups) {
      // 重要：若有 popup modal，UI 必須立即重繪才能把 overlay 移除，否則看起來會「卡住」
      ackAllPopupsFor(mid);
      EventCenter.publishEvent(PopupRefresh);
    }
    return true;
  }

  function runAiAutoUntilStop():Void {
    // 保守上限：避免死循環（例如規則 bug 或無可用操作）
    var cap = 200;
    var steps = 0;
    var lastSig:Null<String> = null;
    var repeat = 0;
    while (steps < cap) {
      // 簡單卡住偵測：若連續重複同一個「狀態簽章」太多次就停止
      var sig = aiStateSignature();
      if (lastSig != null && sig == lastSig) {
        repeat++;
        if (repeat >= 8)
          break;
      } else {
        repeat = 0;
        lastSig = sig;
      }
      if (!runAiStepOnce(true))
        break;
      steps++;
      // 若切換到非 AI 或終局，停止
      var mid = match.activeMonarch().id();
      if (!isAiMonarch(mid))
        break;
      switch match.getTerminationReason() {
        case NotEnded:
        case _:
          break;
      }
    }
  }

  function ensureActiveMonarchAiOrHint():Bool {
    var mid = match.activeMonarch().id();
    if (isAiMonarch(mid))
      return true;
    match.pushInfoPopup(
      mid,
      "AI 尚未啟用",
      PopupPayload.Plain("請先在右側 Menu 勾選「AI 控制此主公」，再按 AI 執行一步 / 自動。"),
      "ui-ai-not-enabled"
    );
    EventCenter.publishEvent(PopupRefresh);
    EventCenter.publishViewModel(this);
    return false;
  }

  function ackAllPopupsFor(monarchId:MonarchId):Void {
    var xs = match.pendingPopups(monarchId);
    if (xs == null || xs.length == 0)
      return;
    // 一次清空，避免 popup modal 卡住 AI 操作
    for (p in xs)
      match.ackPopup(monarchId, p.id());
  }

  function aiStateSignature():String {
    // 只要能反映「是否有推進」即可，不追求完美
    return 'r=${match.roundNumber()}|a=${match.activeMonarch().id()}'
      + '|moved=${match.hasMovedThisTurn()}|slice=${match.isActivePlayerSliceComplete()}'
      + '|landing=${match.forceGetPendingLandingTile() != null}'
      + '|stg=${match.forceHasPendingStaging()}'
      + '|tileEv=${match.forceGetPendingTileEvent() != null}'
      + '|friendly=${match.forceGetPendingFriendlyCityVisitTile() != null}'
      + '|village=${match.forceGetPendingVillageTile() != null}'
      + '|resource=${match.forceGetPendingResourceTile() != null}'
      + '|general=${match.forceGetPendingGeneralTile() != null}'
      + '|shop=${match.forceGetPendingShopTile() != null}'
      + '|hostile=${match.forceGetPendingHostileCityTile() != null}';
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
    var actor:IPlayer = new LocalPlayer(a.id(), "active");
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
    // TODO(popup): 目前僅攔截 GameError 並轉 popup；其他例外會直接拋出（利於除錯）。
    // 下一步可評估是否要在「非開發模式」也攔截一般例外並顯示「系統錯誤」popup（但要保留堆疊供回報）。
    //
    // TODO(popup): 可把「哪些錯誤要轉 popup」的策略抽成一個 helper（例如 view/GameErrorPresenter），
    // 避免 BasicViewModel 逐步長大後 catch 區塊變成各種特例的堆疊。
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

  static function popupPayloadText(p:PopupPayload):String {
    return switch p {
      case Plain(text): text;
    };
  }
}

private class LocalPlayer implements IPlayer {
  final mid:MonarchId;
  final name:String;
  final ai:Bool;
  public function new(mid:MonarchId, name:String, isAi:Bool = false) {
    this.mid = mid;
    this.name = name;
    this.ai = isAi;
  }
  public function monarchId():MonarchId return mid;
  public function displayName():String return name;
  public function isAi():Bool return ai;
}

