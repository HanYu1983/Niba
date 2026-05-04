package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.ITile;
import game.MenuFormWidget;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.TileKind;
import impl_ver1.Game;
import impl_ver1.Monarch;

/**
 * 空城進駐：單一 menuNode 內 {@link MenuFormWidget.GeneralMultiPick}+兩 {@link MenuFormWidget.Slider}；
 * 送出前就地改寫 {@link IPlayerMenuNode#formWidgets}，並 {@link IPlayerMenuNode#setActivationEntry} 指確認鈕。
 */
class EmptyCityVacantFormMenuTest {
  static inline var RING_LEN = 10;
  static inline var START_PAWN = 2;
  static inline var CITY_IDX = 5;

  public static function run():Void {
    testVacantCitySingleFormOccupy();
    testOccupiedCitySkipsForm();
    trace("[EmptyCityVacantFormMenuTest] OK — 空城複選＋資源同表單／有駐將跳過");
  }

  static function testVacantCitySingleFormOccupy():Void {
    var game:IGame = new Game();
    var match:IGameMatch = game.createGameMatch(Game.LEVEL_KEY_EMPTY);

    var tiles:Array<ITile> = [];
    for (i in 0...RING_LEN)
      tiles.push(match.createTile(i, i == CITY_IDX ? City : Plain));
    match.createBoard(tiles);

    match.createMonarch("m-city", 0, START_PAWN, 80, 40);
    match.createGeneral("g-a", "m-city", 1, 1, 1, 1);
    match.createGeneral("g-b", "m-city", 1, 1, 1, 1);

    var ruler = cast(match.monarchs()[0], Monarch);
    var player:IPlayer = match.createPlayer(ruler.id(), "city-player");

    if (!match.cityVacantNoGarrison(CITY_IDX))
      throw "EmptyCityVacantFormMenuTest: 預期初始為空城";

    match.applyMenuLeaf(player, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(player), Move));

    if (match.forceGetPendingEmptyCityOccupyTile() != CITY_IDX)
      throw "EmptyCityVacantFormMenuTest: 應 pending 空城進駐";

    var menu = match.createPlayerMenu(player);
    assertCombinedOccupyForm(menu);

    var n = findRootOccupyNode(menu);
    var fw = n.formWidgets();
    switch fw[0] {
      case GeneralMultiPick(lbl, choices, _sel):
        fw[0] = GeneralMultiPick(lbl, choices, ["g-a", "g-b"]);
      default:
        throw "EmptyCityVacantFormMenuTest: [0] 應為 GeneralMultiPick";
    }
    fw[1] = Slider("進駐兵力（君主池扣除）", 0, 80, 1, 30);
    fw[2] = Slider("進駐糧食（君主池扣除）", 0, 40, 1, 10);
    var confirm = MenuNodeQuery.buttonEntryOnNode(n, EmptyCityOccupySubmit);
    if (confirm == null)
      throw "EmptyCityVacantFormMenuTest: 缺少確認進駐鈕";
    n.setActivationEntry(confirm);
    match.applyMenuLeaf(player, n);

    if (match.forceGetPendingEmptyCityOccupyTile() != null)
      throw "EmptyCityVacantFormMenuTest: 結算後應清除 pending";
    if (ruler.troops() != 50 || ruler.grain() != 30)
      throw 'EmptyCityVacantFormMenuTest: 君主資源不符 got troops=${ruler.troops()} grain=${ruler.grain()}';
    if (match.forceGetCityStoredTroops(CITY_IDX) != 30 || match.forceGetCityStoredGrain(CITY_IDX) != 10)
      throw "EmptyCityVacantFormMenuTest: 城池累儲不符";

    var gid = match.forceGetCityGarrisonGeneralIds(CITY_IDX);
    if (gid.length != 2 || !arrayContains(gid, "g-a") || !arrayContains(gid, "g-b"))
      throw 'EmptyCityVacantFormMenuTest: 駐將列表不符 got ${gid.join(",")}';

    MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(player), ConfirmDone);
  }

  static function arrayContains(a:Array<GeneralId>, id:GeneralId):Bool {
    for (x in a)
      if (x == id)
        return true;
    return false;
  }

  static function testOccupiedCitySkipsForm():Void {
    var game:IGame = new Game();
    var match:IGameMatch = game.createGameMatch(Game.LEVEL_KEY_EMPTY);

    var tiles:Array<ITile> = [];
    for (i in 0...RING_LEN)
      tiles.push(match.createTile(i, i == CITY_IDX ? City : Plain));
    match.createBoard(tiles);

    match.createMonarch("m-occ", 0, START_PAWN, 50, 20);
    match.createGeneral("g-guard", "m-occ", 1, 1, 1, 1);
    match.forceAssignCityGarrison(CITY_IDX, "g-guard");

    var ruler = cast(match.monarchs()[0], Monarch);
    var player:IPlayer = match.createPlayer(ruler.id(), "occ-player");

    if (match.cityVacantNoGarrison(CITY_IDX))
      throw "EmptyCityVacantFormMenuTest: 有駐將後不應為空城";

    match.applyMenuLeaf(player, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(player), Move));

    if (match.forceGetPendingEmptyCityOccupyTile() != null)
      throw "EmptyCityVacantFormMenuTest: 有駐城不應進空城表單";
    MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(player), ConfirmDone);
  }

  static function assertCombinedOccupyForm(menu:IPlayerMenu):Void {
    var n = findRootOccupyNode(menu);
    var fw = n.formWidgets();
    if (fw.length != 5)
      throw "EmptyCityVacantFormMenuTest: 預期 MultiPick + 2 Slider + 2 Button，got " + fw.length;

    switch fw[0] {
      case GeneralMultiPick(_, choices, defSel):
        if (choices.length != 2 || choices[0].generalId != "g-a" || choices[1].generalId != "g-b")
          throw "EmptyCityVacantFormMenuTest: 複選候選應為 g-a、g-b";
        if (defSel.length != 0)
          throw "EmptyCityVacantFormMenuTest: 空城預設選中應為空（無城中駐將）";
      default:
        throw "EmptyCityVacantFormMenuTest: [0] 應為 GeneralMultiPick";
    }
    switch fw[1] {
      case Slider(_, min, max, step, def):
        if (min != 0 || max != 80 || step != 1 || def != 0)
          throw "EmptyCityVacantFormMenuTest: 兵力滑桿參數不符";
      default:
        throw "EmptyCityVacantFormMenuTest: [1] 應為兵力 Slider";
    }
    switch fw[2] {
      case Slider(_, min, max, step, def):
        if (min != 0 || max != 40 || step != 1 || def != 0)
          throw "EmptyCityVacantFormMenuTest: 糧食滑桿參數不符";
      default:
        throw "EmptyCityVacantFormMenuTest: [2] 應為糧食 Slider";
    }
    switch fw[3] {
      case Button(e):
        if (e.kind() != EmptyCityOccupySubmit)
          throw "EmptyCityVacantFormMenuTest: [3] 應為確認進駐";
      default:
        throw "EmptyCityVacantFormMenuTest: [3] 應為 Button";
    }
    switch fw[4] {
      case Button(e):
        if (e.kind() != EmptyCityOccupyAbort)
          throw "EmptyCityVacantFormMenuTest: [4] 應為離開／取消";
      default:
        throw "EmptyCityVacantFormMenuTest: [4] 應為 Button";
    }
  }

  static function findRootOccupyNode(menu:IPlayerMenu):IPlayerMenuNode {
    for (r in menu.rootNodes())
      if (r.formWidgets().length > 0 && r.caption().indexOf("空城進駐") >= 0)
        return r;
    throw "EmptyCityVacantFormMenuTest: 找不到空城進駐表單節點";
  }
}
