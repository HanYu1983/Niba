package debug;

import game.IJiCe;
import game.IPlayer;
import game.IPlayerMenuEntry;
import game.PlayerMenuKind;
import game.GeneralStat;
import game.PlayerMenuKind;

/**
 * 計策兩段式：暫存＋選單→選將→清 pendingJiCe。
 */
class JiCeStagingFlowTest {
  public static function run():Void {
    var g = new SimpleGame();
    var match = g.createGameMatch(MatchLevels.KEY_JICE_STAGING_THREE_GENERALS);
    var atk = cast(match.monarchs()[0], SimpleMonarch);
    var def = cast(match.monarchs()[1], SimpleMonarch);
    var gb = cast(atk.roster()[1], SimpleGeneral);

    var luoshi:IJiCe = new LuoshiJiCe(match);
    var player:IPlayer = match.createPlayer(atk.id(), "操縱者");
    var jiLeaf:IPlayerMenuEntry = match.createPlayerMenuEntry(JiCe, "打出：落石", true);

    match.applyMenuLeaf(player, jiLeaf, luoshi, def.id());

    if (match.pendingJiCe() != luoshi)
      throw "JiCeStagingFlowTest: 應為暫存中之同一張計策實例";

    var rows = match.jiCeStagingPreviewRows();
    if (rows.length != 3)
      throw "JiCeStagingFlowTest: 預期三武將預覽列";

    if (def.troops() != 80)
      throw "JiCeStagingFlowTest: 暫存後守方兵力不得變";

    var menuAfter = match.createPlayerMenu(player);
    var pickB = JiCeLuoshiTest.findJiCePickLeaf(menuAfter, "wb");
    if (pickB.caption().indexOf("預計對守方折兵") < 0)
      throw "JiCeStagingFlowTest: 選單 caption 應含預計算描述";

    var gotDesc = false;
    for (r in rows)
      if (r.generalId() == "wb" && r.outcomeDescription().indexOf("預計") >= 0)
        gotDesc = true;
    if (!gotDesc)
      throw "JiCeStagingFlowTest: IJiCeStagingPreviewRow 應帶描述";

    var expectLossB = JiCeLuoshiTest.stagedLuoshiTroopLossPreview(80, gb.stat(Might));
    if (pickB.kind() != JiCePick)
      throw "JiCeStagingFlowTest: 選將葉種類錯誤";

    match.applyMenuLeaf(player, pickB);

    if (match.pendingJiCe() != null)
      throw "JiCeStagingFlowTest: 結算後須清除 pendingJiCe";

    if (def.troops() != 80 - expectLossB)
      throw "JiCeStagingFlowTest: 套用預計算折損不符";

    trace("[JiCeStagingFlowTest] OK — JiCe→暫存→選單描述→選將→套用並清 pending");
  }
}
