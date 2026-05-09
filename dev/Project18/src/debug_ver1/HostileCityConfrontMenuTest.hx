package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.MenuFormWidget;
import game.MenuNodeQuery;
import game.PlayerMenuKind.LandingContinue;
import game.PlayerMenuKind.Move;
import game.PlayerMenuKind.HostileCityAttackerPick;
import game.PlayerMenuKind.HostileCityDefenderAck;
import game.PlayerMenuKind.HostileCityDefenderPickSubmit;
import game.PlayerMenuKind.HostileCitySettlementAck;
import game.ITile;
import game.TileKind;
import game.LevelKeys;

/**
 * 踩中非友方且有駐軍城池：攻方五選項（過路費／談判／消耗戰／攻城戰／單挑）→ 守方（單挑則選將，否則確認結束）→ 攻方結算文案確認。
 */
class HostileCityConfrontMenuTest {
  static inline var RING_LEN = 10;
  static inline var START_PAWN = 2;
  static inline var CITY_IDX = 5;

  static function setupOccupiedEnemyCity(game:IGame):{match:IGameMatch, atk:IPlayer, def:IPlayer, atkId:MonarchId, defId:MonarchId} {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(3);

    var tiles:Array<ITile> = [];
    for (i in 0...RING_LEN)
      tiles.push(match.createTile(i, i == CITY_IDX ? City : Plain));
    match.createBoard(tiles);

    var atkId:MonarchId = "m-atk";
    var defId:MonarchId = "m-def";
    match.createMonarch(atkId, 0, START_PAWN, 100, 50);
    match.linkPlayerToMonarch(atkId, match.createPlayer(atkId, false));
    match.createMonarch(defId, 1, 0, 100, 50);
    match.linkPlayerToMonarch(defId, match.createPlayer(defId, false));
    match.createGeneral("g-atk", atkId, 5, 8, 2, 2);
    match.createGeneral("g-def", defId, 4, 7, 3, 3);

    match.forceSetCityOwner(CITY_IDX, defId);
    match.forceAssignCityGarrison(CITY_IDX, "g-def");

    return {
      match: match,
      atk: match.playerForMonarch(atkId),
      def: match.playerForMonarch(defId),
      atkId: atkId,
      defId: defId,
    };
  }

  static function landAttackerOnCity(match:IGameMatch, atk:IPlayer):Void {
    match.applyMenuLeaf(atk, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(atk), Move));
    match.applyMenuLeaf(atk, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(atk), LandingContinue));
    if (match.forceGetPendingHostileCityTile() != CITY_IDX)
      throw "HostileCityConfrontMenuTest: 預期進入敵城對峙 pending";
    if (match.forceGetHostileCityFlowPhase() != "AttackerChoosing")
      throw "HostileCityConfrontMenuTest: 預期攻方選項階段";
    var ruler = match.activeMonarch();
    if (ruler.pawnIndex() != CITY_IDX)
      throw "HostileCityConfrontMenuTest: 預期踩中城池格";
  }

  static function applyHostileAttackerToken(match:IGameMatch, atk:IPlayer, token:String, ?pickGeneralId:String):Void {
    var menu = match.createPlayerMenu(atk);
    var node = MenuNodeQuery.requireNodeWithHostileAttackerPickToken(menu, token);
    if (pickGeneralId != null) {
      var fw = node.formWidgets();
      switch fw[0] {
        case GeneralMultiPick(lbl, choices, _):
          fw[0] = GeneralMultiPick(lbl, choices, [pickGeneralId]);
        default:
          throw "HostileCityConfrontMenuTest: 預期選將選項含 GeneralMultiPick";
      }
    }
    var btn = MenuNodeQuery.buttonEntryOnNode(node, HostileCityAttackerPick);
    if (btn == null || btn.decisionToken() != token)
      throw "HostileCityConfrontMenuTest: 攻方選項按鈕不符";
    node.setActivationEntry(btn);
    match.applyMenuLeaf(atk, node);
    if (match.forceGetHostileCityFlowPhase() != "DefenderResponse")
      throw "HostileCityConfrontMenuTest: 送出後應進入守方階段";
  }

  static function applyDefenderAck(match:IGameMatch, def:IPlayer):Void {
    var n = MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(def), HostileCityDefenderAck);
    var btn = MenuNodeQuery.buttonEntryOnNode(n, HostileCityDefenderAck);
    if (btn == null)
      throw "HostileCityConfrontMenuTest: 缺少守方確認鈕";
    n.setActivationEntry(btn);
    match.applyMenuLeaf(def, n);
    if (match.forceGetHostileCityFlowPhase() != "AttackerSettlement")
      throw "HostileCityConfrontMenuTest: 預期結算階段（攻方）";
  }

  static function applyDefenderDuelPick(match:IGameMatch, def:IPlayer, generalId:String):Void {
    var n = MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(def), HostileCityDefenderPickSubmit);
    var fw = n.formWidgets();
    switch fw[0] {
      case GeneralMultiPick(lbl, choices, _):
        fw[0] = GeneralMultiPick(lbl, choices, [generalId]);
      default:
        throw "HostileCityConfrontMenuTest: 守方單挑預期 GeneralMultiPick";
    }
    var btn = MenuNodeQuery.buttonEntryOnNode(n, HostileCityDefenderPickSubmit);
    if (btn == null)
      throw "HostileCityConfrontMenuTest: 缺少守方應戰鈕";
    n.setActivationEntry(btn);
    match.applyMenuLeaf(def, n);
    if (match.forceGetHostileCityFlowPhase() != "AttackerSettlement")
      throw "HostileCityConfrontMenuTest: 單挑後應進入攻方結算";
  }

  static function assertSettlementPreview(match:IGameMatch, substr:String):Void {
    var prev = match.forceGetHostileCitySettlementSummary();
    if (prev == null || prev.indexOf(substr) < 0)
      throw 'HostileCityConfrontMenuTest: 結算預覽應含「$substr」 got=$prev';
  }

  static function applyAttackerSettlement(match:IGameMatch, atk:IPlayer):Void {
    assertSettlementPreview(match, "結算：");
    var n = MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(atk), HostileCitySettlementAck);
    var btn = MenuNodeQuery.buttonEntryOnNode(n, HostileCitySettlementAck);
    if (btn == null)
      throw "HostileCityConfrontMenuTest: 缺少結算確認鈕";
    n.setActivationEntry(btn);
    match.applyMenuLeaf(atk, n);
    if (match.forceGetPendingHostileCityTile() != null)
      throw "HostileCityConfrontMenuTest: 結算後應清除敵城 pending";
    if (!match.isActivePlayerSliceComplete())
      throw "HostileCityConfrontMenuTest: 結算後切片應可收束";
  }

  public static function testPayTollThenDefenderAckThenSettlement(game:IGame):Void {
    var s = setupOccupiedEnemyCity(game);
    landAttackerOnCity(s.match, s.atk);
    applyHostileAttackerToken(s.match, s.atk, "pay_toll");
    applyDefenderAck(s.match, s.def);
    assertSettlementPreview(s.match, "過路費");
    applyAttackerSettlement(s.match, s.atk);
  }

  public static function testNegotiateWithGeneralPickThenSettlement(game:IGame):Void {
    var s = setupOccupiedEnemyCity(game);
    landAttackerOnCity(s.match, s.atk);
    applyHostileAttackerToken(s.match, s.atk, "negotiate", "g-atk");
    applyDefenderAck(s.match, s.def);
    assertSettlementPreview(s.match, "談判");
    applyAttackerSettlement(s.match, s.atk);
  }

  public static function testDuelBothSidesPickGeneralThenSettlement(game:IGame):Void {
    var s = setupOccupiedEnemyCity(game);
    landAttackerOnCity(s.match, s.atk);
    applyHostileAttackerToken(s.match, s.atk, "duel", "g-atk");
    applyDefenderDuelPick(s.match, s.def, "g-def");
    assertSettlementPreview(s.match, "單挑");
    var summ = s.match.forceGetHostileCitySettlementSummary();
    if (summ == null || summ.indexOf("g-atk") < 0 || summ.indexOf("g-def") < 0)
      throw 'HostileCityConfrontMenuTest: 單挑結算應含雙將 got=$summ';
    applyAttackerSettlement(s.match, s.atk);
  }
}
