package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.MenuActivation;
import game.MenuNodeQuery;
import game.MenuFormWidget;
import game.PlayerMenuKind;
import game.PlayerMenuKind.GeneralRecruitSubmit;
import game.PlayerMenuKind.GeneralEndTurn;
import game.PlayerMenuKind.LandingContinue;
import game.PlayerMenuKind.Move;
import game.TileKind;
import game.LevelKeys;
import impl_ver1.model.Monarch;

/**
 * 武將格（骨架）：落地後應出現 pendingGeneral，點「招募」或「離開」皆可結束落地切片。
 */
class GeneralTileMenuFlowTest {
  public static function testGeneralTileMenuFlow(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(1);
    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, General),
    ]);
    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 500, 80);
    match.linkPlayerToMonarch(idA, match.createPlayer(idA, false));
    var actor:IPlayer = match.playerForMonarch(idA);
    // 招募需要金錢
    cast(match.activeMonarch(), Monarch).grantGold(100000);

    // Move：0 -> 1（General）
    var m0 = match.createPlayerMenu(actor);
    match.applyMenuLeaf(actor, requireEnabledNode(m0, Move));
    var m1 = match.createPlayerMenu(actor);
    match.applyMenuLeaf(actor, requireEnabledNode(m1, LandingContinue));

    if (match.forceGetPendingGeneralTile() != 1)
      throw "GeneralTileMenuFlowTest: 預期 pendingGeneral=1";

    // 招募：不應結束 pending（可連續招募），需按回合結束才離開
    var m2 = match.createPlayerMenu(actor);
    // 預設不會勾選任何候選，需先人工指定 activation node 的 widgets selection。
    // 這裡直接用「第一個 offer」作為單一勾選。
    var n = MenuNodeQuery.requireNodeWithKind(m2, GeneralRecruitSubmit);
    // 找到同一 root 裡的 GeneralMultiPick widget，勾選第一個 choice id
    // （MenuNodeQuery 目前沒有直接取 choices 的 API，因此先以 widgets[0] 的 selected ids 直接寫入）
    var ws = n.formWidgets();
    if (ws == null || ws.length == 0)
      throw "GeneralTileMenuFlowTest: expected widgets on general tile node";
    switch ws[0] {
      case GeneralMultiPick(lbl, choices, _):
        if (choices == null || choices.length == 0)
          throw "GeneralTileMenuFlowTest: expected at least 1 offer choice";
        ws[0] = GeneralMultiPick(lbl, choices, [choices[0].generalId]);
      default:
        throw "GeneralTileMenuFlowTest: expected GeneralMultiPick as first widget";
    }
    var submit = MenuNodeQuery.buttonEntryOnNode(n, GeneralRecruitSubmit);
    if (submit == null)
      throw "GeneralTileMenuFlowTest: expected submit button on node";
    n.setActivationEntry(submit);
    match.applyMenuLeaf(actor, n);
    if (match.forceGetPendingGeneralTile() == null)
      throw "GeneralTileMenuFlowTest: 招募後仍應維持 pendingGeneral";

    var m3 = match.createPlayerMenu(actor);
    match.applyMenuLeaf(actor, requireEnabledNode(m3, GeneralEndTurn));
    if (match.forceGetPendingGeneralTile() != null)
      throw "GeneralTileMenuFlowTest: 離開後應清 pendingGeneral";
    if (!match.isActivePlayerSliceComplete())
      throw "GeneralTileMenuFlowTest: 離開後 slice 應可收束";
    trace("[GeneralTileMenuFlowTest] OK — 武將格可招募並可離開收束");
  }

  static function requireEnabledNode(menu:IPlayerMenu, kind:PlayerMenuKind):IPlayerMenuNode {
    var n = MenuNodeQuery.requireNodeWithKind(menu, kind);
    // 若該 kind 是表單內 Button，需先設 activationEntry
    var btn = MenuNodeQuery.buttonEntryOnNode(n, kind);
    if (btn != null)
      n.setActivationEntry(btn);
    if (!MenuActivation.activatingEntry(n).isEnabled())
      throw "GeneralTileMenuFlowTest: 節點 " + Std.string(kind) + " 應為可用";
    return n;
  }
}

