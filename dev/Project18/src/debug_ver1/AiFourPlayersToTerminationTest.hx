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
import debug_ver1.AssassinationAvoidableTileEvent;
import debug_ver1.DefectionAvoidableTileEvent;
import debug_ver1.EpidemicAvoidableTileEvent;
import debug_ver1.GranaryFireAvoidableTileEvent;
import view.AiUiFlow;

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
          return;
      }

      var mid = match.activeMonarch().id();
      var actor:IPlayer = new AiPlayer(mid, "ai-" + mid);
      var d:Null<AiDecision> = match.aiSuggest(actor);
      if (d == null)
        throw "AiFourPlayersToTerminationTest: aiSuggest returned null at step " + step;

      var ok = AiUiFlow.applyAiDecision(match, actor, d, function(node, entry) {
        match.applyMenuLeaf(actor, node);
      });
      if (!ok)
        throw "AiFourPlayersToTerminationTest: failed to apply AiDecision at step " + step;

      // 模擬 UI：任何 apply 後若產生 outbox（含 popup/animation），必須能被 ack 掉，不然 UI 會被卡住
      AiUiFlow.ackAllOutbox(match, mid);
      AiUiFlow.ackAllPopups(match, mid);      // 相容：舊 outbox
      AiUiFlow.ackAllAnimations(match, mid);  // 相容：舊 outbox
      var remain = match.pendingOutbox(mid);
      if (remain != null && remain.length > 0)
        throw "AiFourPlayersToTerminationTest: outbox not cleared after ack at step " + step;
    }

    throw "AiFourPlayersToTerminationTest: reached loop cap=100 without termination (round=" + match.roundNumber() + ")";
  }

  static function initLikeTestPage4Ai(match:IGameMatch):Void {
    var kinds:Array<TileKind> = [
      Start,   // 0
      Event,   // 1
      City,    // 2
      Plain,   // 3
      Village, // 4
      Plain,   // 5
      Resource,// 6
      Event,   // 7
      Event,   // 8
      Plain,   // 9
      City,    // 10
      Event,   // 11
    ];
    var tiles:Array<game.ITile> = [];
    for (i in 0...kinds.length)
      tiles.push(match.createTile(i, kinds[i]));
    match.createBoard(tiles);

    match.createMonarch("m-a", 0, 0, 800, 400);
    match.createMonarch("m-b", 1, 3, 800, 400);
    match.createMonarch("m-c", 2, 6, 800, 400);
    match.createMonarch("m-d", 3, 9, 800, 400);
    match.linkPlayerToMonarch("m-a", match.createPlayer("m-a", true));
    match.linkPlayerToMonarch("m-b", match.createPlayer("m-b", true));
    match.linkPlayerToMonarch("m-c", match.createPlayer("m-c", true));
    match.linkPlayerToMonarch("m-d", match.createPlayer("m-d", true));

    // 給測試一些計策（讓 AI 也會遇到策略分支/暫存）
    match.createJiCe("jice_dissension", "m-a"); // 指定玩家（PreMove）
    match.createJiCe("jice_rumor", "m-a");      // 指定玩家（PreMove）
    match.createJiCe("jice_fire", "m-a");       // 指定格子（Pre+Post）
    match.createJiCe("jice_farm", "m-a");       // 指定格子（Pre+Post）
    match.createJiCe("jice_inspire", "m-a");    // 指定武將（PreMove）

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

    // 綁定多個可規避事件，確保 AI 會跑進事件分支且仍能收束到終局
    match.forceBindTileEvent(1, new EpidemicAvoidableTileEvent(match));
    match.forceBindTileEvent(7, new AssassinationAvoidableTileEvent(match));
    match.forceBindTileEvent(8, new GranaryFireAvoidableTileEvent(match, 120));
    match.forceBindTileEvent(11, new DefectionAvoidableTileEvent(match));

    // 避免維持費把兵耗光導致提早終局/平局，補足糧
    var ids:Array<MonarchId> = ["m-a", "m-b", "m-c", "m-d"];
    for (id in ids)
      match.forceGrantMonarchGrain(id, 5000);
  }

  // UI/測試共用邏輯已抽到 view.AiUiFlow
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

