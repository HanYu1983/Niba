package debug_ver1;

import game.AiDecision;
import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.LevelKeys;
import game.MatchTerminationReason;
import game.MenuFormWidget;
import game.PlayerMenuKind;
import game.TileKind;
import debug_ver1.GranaryFireAvoidableTileEvent;

/**
 * 模擬 UI 的 AI 迴圈（全息 aiSuggest → 建 menu → 依 nodePath 定位 → 套用 widgets → setActivationEntry → apply）。
 *
 * 設定：
 * - 4 名 AI 玩家
 * - 先快轉到終局前 2 回合（round=98，因時限勝利上限為 100）
 * - 再讓 AI 跑到遊戲結束
 * - for loop 上限 100（避免死循環）
 */
class AiFourPlayersToTerminationTest {
  public static function testAiFourPlayersToTermination(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(1);

    // 場景：複製「測試頁4（AI）」的環境（避免測試與 UI 實際不一致）
    initLikeTestPage4Ai(match);

    // 先快轉到 round=98（終局前 2 回合）
    match.forceSetRoundNumber(98);

    // AI 迴圈：直到終局或步數耗盡
    for (step in 0...100) {
      switch match.getTerminationReason() {
        case NotEnded:
        case _:
          trace("[AiFourPlayersToTerminationTest] terminated at step=" + step + " reason=" + Std.string(match.getTerminationReason()));
          return;
      }

      var mid = match.activeMonarch().id();
      var actor:IPlayer = new AiPlayer(mid, "ai-" + mid);
      var d:Null<AiDecision> = match.aiSuggest(actor);
      if (d == null)
        throw "AiFourPlayersToTerminationTest: aiSuggest returned null at step " + step;

      // 依 UI 流程：重新建 menu，依 nodePath 定位 node，套用 widgets/activation，再 apply
      var menu:IPlayerMenu = match.createPlayerMenu(actor);
      var node = resolveNodeByPath(menu.rootNodes(), d.nodePath);
      if (node == null)
        throw "AiFourPlayersToTerminationTest: nodePath not found at step " + step;

      // 套用 widget patches（目前 policy 回傳空陣列也 OK）
      if (d.widgetPatches != null)
        for (p in d.widgetPatches)
          applyWidgetPatch(node, p);

      var entry:Null<IPlayerMenuEntry> = null;
      if (d.activation != null) {
        entry = findEntryOnNode(node, d.activation.kind, d.activation.decisionToken);
        if (entry == null)
          throw "AiFourPlayersToTerminationTest: activation entry not found at step " + step;
      } else {
        entry = node.leaf();
      }
      if (entry == null)
        throw "AiFourPlayersToTerminationTest: missing entry at step " + step;

      // 方便定位卡住：印出本步要按的 kind
      //（測試輸出可直接看到是否一直重複某個 leaf）
      trace('[AiFourPlayersToTerminationTest] step=$step mid=$mid pick=${Std.string(entry.kind())}');

      node.setActivationEntry(entry);
      match.applyMenuLeaf(actor, node);

      // 模擬 UI：任何 apply 後若產生 popup，必須能被 ack 掉，不然 UI 會被 modal 卡住
      ackAllPopups(match, mid);
      var remain = match.pendingPopups(mid);
      if (remain != null && remain.length > 0)
        throw "AiFourPlayersToTerminationTest: popups not cleared after ack at step " + step;
    }

    throw "AiFourPlayersToTerminationTest: reached loop cap=100 without termination (round=" + match.roundNumber() + ")";
  }

  static function initLikeTestPage4Ai(match:IGameMatch):Void {
    var kinds:Array<TileKind> = [
      Start,   // 0
      Plain,   // 1
      City,    // 2
      Plain,   // 3
      Village, // 4
      Plain,   // 5
      Resource,// 6
      Plain,   // 7
      Event,   // 8
      Plain,   // 9
      City,    // 10
      Plain,   // 11
    ];
    var tiles:Array<game.ITile> = [];
    for (i in 0...kinds.length)
      tiles.push(match.createTile(i, kinds[i]));
    match.createBoard(tiles);

    match.createMonarch("m-a", 0, 0, 800, 400);
    match.createMonarch("m-b", 1, 3, 800, 400);
    match.createMonarch("m-c", 2, 6, 800, 400);
    match.createMonarch("m-d", 3, 9, 800, 400);

    match.createGeneral("g-a-1", "m-a", 60, 40, 55, 70);
    match.createGeneral("g-a-2", "m-a", 30, 80, 25, 20);
    match.createGeneral("g-a-3", "m-a", 45, 35, 90, 30);

    match.createGeneral("g-b-1", "m-b", 70, 60, 30, 40);
    match.createGeneral("g-b-2", "m-b", 20, 25, 80, 75);
    match.createGeneral("g-b-3", "m-b", 55, 55, 55, 55);

    match.createGeneral("g-c-1", "m-c", 40, 70, 40, 30);
    match.createGeneral("g-c-2", "m-c", 75, 25, 45, 55);
    match.createGeneral("g-c-3", "m-c", 35, 35, 90, 25);

    match.createGeneral("g-d-1", "m-d", 50, 50, 20, 80);
    match.createGeneral("g-d-2", "m-d", 25, 85, 25, 25);
    match.createGeneral("g-d-3", "m-d", 65, 35, 65, 35);

    match.forceSetCityOwner(2, "m-a");
    match.forceSetCityOwner(10, "m-b");

    match.forceBindTileEvent(8, new GranaryFireAvoidableTileEvent(match, 120));

    // 避免維持費把兵耗光導致提早終局/平局，補足糧
    var ids:Array<MonarchId> = ["m-a", "m-b", "m-c", "m-d"];
    for (id in ids) {
      var mon = cast(match.monarchById(id), impl_ver1.model.Monarch);
      mon.grantGrain(5000);
    }
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

  static function findEntryOnNode(node:IPlayerMenuNode, kind:PlayerMenuKind, tok:Null<String>):Null<IPlayerMenuEntry> {
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

  static function applyWidgetPatch(node:IPlayerMenuNode, p:game.AiWidgetPatch):Void {
    var ws = node.formWidgets();
    if (ws == null)
      return;
    switch p {
      case SetSlider(i, v):
        if (i < 0 || i >= ws.length)
          return;
        switch ws[i] {
          case Slider(lbl, min, max, step, _):
            ws[i] = Slider(lbl, min, max, step, v);
          default:
        }
      case SetGeneralMultiPick(i, ids):
        if (i < 0 || i >= ws.length)
          return;
        switch ws[i] {
          case GeneralMultiPick(lbl, choices, _):
            ws[i] = GeneralMultiPick(lbl, choices, ids.copy());
          default:
        }
      case SetMonarchSinglePick(i, ids):
        if (i < 0 || i >= ws.length)
          return;
        switch ws[i] {
          case MonarchSinglePick(lbl, choices, _):
            ws[i] = MonarchSinglePick(lbl, choices, ids.copy());
          default:
        }
      case SetTileSinglePick(i, idxs):
        if (i < 0 || i >= ws.length)
          return;
        switch ws[i] {
          case TileSinglePick(lbl, choices, _):
            ws[i] = TileSinglePick(lbl, choices, idxs.copy());
          default:
        }
    }
  }

  static function ackAllPopups(match:IGameMatch, monarchId:MonarchId):Void {
    var xs = match.pendingPopups(monarchId);
    if (xs == null || xs.length == 0)
      return;
    for (p in xs)
      match.ackPopup(monarchId, p.id());
  }
}

private class AiPlayer implements IPlayer {
  final mid:MonarchId;
  final name:String;
  public function new(mid:MonarchId, name:String) {
    this.mid = mid;
    this.name = name;
  }
  public function monarchId():MonarchId return mid;
  public function displayName():String return name;
  public function isAi():Bool return true;
}

