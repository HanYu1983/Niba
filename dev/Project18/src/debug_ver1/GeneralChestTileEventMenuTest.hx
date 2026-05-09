package debug_ver1;

import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.IPlayerMenu;
import game.MenuFormWidget;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.PlayerMenuKind.ConfirmDone;
import game.PlayerMenuKind.LandingContinue;
import game.PlayerMenuKind.TileEventPick;
import game.ITile;
import game.TileKind;
import game.LevelKeys;

/**
 * {@link GeneralChestTileEvent}：落地→表單複選武將＋確認→結算兵力。
 */
class GeneralChestTileEventMenuTest {
  static inline var RING_LEN = 10;
  static inline var LANDING_IDX = 3;

  public static function testGeneralChestTileEventMenuFlow(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(3);

    var tiles:Array<ITile> = [];
    for (i in 0...RING_LEN)
      tiles.push(match.createTile(i, i == LANDING_IDX ? Event : Plain));
    match.createBoard(tiles);

    match.createMonarch("m-chest", 0, 0, 100, 0);
    match.createPlayer("m-chest", "m-chest", false);
    match.createGeneral("g-chest", "m-chest", 5, 5, 5, 5);

    var evt = new GeneralChestTileEvent(match);
    match.forceBindTileEvent(LANDING_IDX, evt);

    var ruler = match.monarchs()[0];
    var player:IPlayer = match.playerForMonarch(ruler.id());

    match.applyMenuLeaf(player, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(player), Move));
    // 移動後需先按落地，才會進入事件 pending
    match.applyMenuLeaf(player, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(player), LandingContinue));

    if (ruler.pawnIndex() != LANDING_IDX)
      throw 'GeneralChestTileEventMenuTest: 預期落在索引 $LANDING_IDX，實際 ${ruler.pawnIndex()}';
    if (match.forceGetPendingTileEvent() != evt)
      throw "GeneralChestTileEventMenuTest: 應為 GeneralChest pending";

    var menuEvt = match.createPlayerMenu(player);
    var claimNode = MenuNodeQuery.requireNodeWithTilePickToken(menuEvt, "claim_reward");
    var fw = claimNode.formWidgets();
    switch fw[0] {
      case GeneralMultiPick(lbl, choices, _):
        fw[0] = GeneralMultiPick(lbl, choices, ["g-chest"]);
      default:
        throw "GeneralChestTileEventMenuTest: 預期 MultiPick";
    }
    var claimBtn = MenuNodeQuery.buttonEntryOnNode(claimNode, TileEventPick);
    if (claimBtn == null)
      throw "GeneralChestTileEventMenuTest: 缺少 claim_reward 按鈕";
    claimNode.setActivationEntry(claimBtn);
    match.applyMenuLeaf(player, claimNode);

    if (match.forceGetPendingTileEvent() != null)
      throw "GeneralChestTileEventMenuTest: 結算後應清除 pending";
    if (ruler.troops() != 108)
      throw "GeneralChestTileEventMenuTest: 預期兵力 100+8=108，got " + ruler.troops();
    if (evt.lastResolvedChoice != "claim_reward:g-chest")
      throw "GeneralChestTileEventMenuTest: lastResolvedChoice 不符，got " + evt.lastResolvedChoice;

    MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(player), ConfirmDone);

    trace("[GeneralChestTileEventMenuTest] OK — 事件表單選將→領賞兵力");
  }
}
