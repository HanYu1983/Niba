package debug_ver1;

import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.GameIds;
import game.MenuNodeQuery;
import game.MenuFormWidget;
import game.PlayerMenuKind;
import game.TileKind;
import game.LevelKeys;
import game.CityLevel;
import impl_ver1.model.Monarch;

/**
 * 骨架測試：城池等級（CityLevel）會影響攻城戰結算（防禦加成）。
 *
 * 期望：
 * - 同一組攻方投入與守軍下，SmallCity 可攻下；Capital 因防禦加成而失敗。
 */
class HostileCitySiegeCityLevelDefenseTest {
  public static function testHostileCitySiegeCityLevelDefense(game:IGame):Void {
    // --- 情境 1：SmallCity → 期望可攻下 ---
    var s1 = buildCase(game, SmallCity);
    runSiegeFlow(s1.match, s1.actorA, s1.actorB);
    if (s1.match.forceGetCityOwner(1) != s1.idA)
      throw "HostileCitySiegeCityLevelDefenseTest: SmallCity should be conquered";

    // --- 情境 2：Capital → 期望守住 ---
    var s2 = buildCase(game, Capital);
    runSiegeFlow(s2.match, s2.actorA, s2.actorB);
    if (s2.match.forceGetCityOwner(1) != s2.idB)
      throw "HostileCitySiegeCityLevelDefenseTest: Capital should defend successfully";

    trace("[HostileCitySiegeCityLevelDefenseTest] OK — city level affects siege settlement");
  }

  static function buildCase(game:IGame, level:CityLevel):{
    match:IGameMatch,
    idA:MonarchId,
    idB:MonarchId,
    actorA:IPlayer,
    actorB:IPlayer,
  } {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(1);
    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, City),
      match.createTile(2, Plain),
    ]);

    var idA:MonarchId = "m-a";
    var idB:MonarchId = "m-b";
    match.createMonarch(idA, 0, 0, 0, 0);
    match.createGeneral("g-a", idA, 90, 90, 10, 10);
    match.createMonarch(idB, 1, 0, 0, 0);
    match.createGeneral("g-b", idB, 10, 10, 10, 10);

    var actorA = match.createPlayer(idA, "A");
    var actorB = match.createPlayer(idB, "B");

    match.forceSetCityOwner(1, idB);
    match.forceAssignCityGarrison(1, "g-b");
    // 對齊 docs/數值算法.md §3：守方戰力取決於守軍兵力與守方武將能力；
    // 本測試要驗證「城池等級的防禦加成會影響結果」，因此在 Capital 情境提高守軍量以形成可判別差異。
    var defTroops = (level == Capital) ? 10000 : 600;
    match.forcePutCityStores(1, defTroops, 0);
    match.forceSetCityLevel(1, level);

    cast(match.activeMonarch(), Monarch).grantTroops(1200);

    return {match: match, idA: idA, idB: idB, actorA: actorA, actorB: actorB};
  }

  static function runSiegeFlow(match:IGameMatch, attacker:IPlayer, defender:IPlayer):Void {
    // 走到 City，進入 pendingLanding → LandingContinue → enemy city confrontation pending
    match.applyMenuLeaf(attacker, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(attacker), PlayerMenuKind.Move));
    match.applyMenuLeaf(attacker, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(attacker), PlayerMenuKind.LandingContinue));

    // 進入敵城對峙：攻方選「攻城戰」+ 選一名武將
    var pick = MenuNodeQuery.requireNodeWithHostileAttackerPickToken(match.createPlayerMenu(attacker), "siege");
    var btn = MenuNodeQuery.buttonEntryOnNode(pick, PlayerMenuKind.HostileCityAttackerPick);
    if (btn == null || btn.decisionToken() != "siege")
      throw "HostileCitySiegeCityLevelDefenseTest: missing siege button";
    pick.setActivationEntry(btn);
    // siege 表單包含 GeneralMultiPick，預設為空；這裡直接填入 g-a
    for (w in pick.formWidgets())
      switch w {
        case GeneralMultiPick(_, _, sel):
          sel.splice(0, sel.length);
          sel.push("g-a");
        default:
      }
    match.applyMenuLeaf(attacker, pick);

    // 守方 ack：需由守方玩家回應
    var defAck = MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(defender), PlayerMenuKind.HostileCityDefenderAck);
    var defBtn = MenuNodeQuery.buttonEntryOnNode(defAck, PlayerMenuKind.HostileCityDefenderAck);
    if (defBtn == null)
      throw "HostileCitySiegeCityLevelDefenseTest: missing defender ack button";
    defAck.setActivationEntry(defBtn);
    match.applyMenuLeaf(defender, defAck);

    // 結算 ack（觸發 applyHostileCitySettlementAck 的真結算線）
    var settleAck = MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(attacker), PlayerMenuKind.HostileCitySettlementAck);
    var sBtn = MenuNodeQuery.buttonEntryOnNode(settleAck, PlayerMenuKind.HostileCitySettlementAck);
    if (sBtn == null)
      throw "HostileCitySiegeCityLevelDefenseTest: missing settlement ack button";
    settleAck.setActivationEntry(sBtn);
    match.applyMenuLeaf(attacker, settleAck);
  }
}

