package debug_ver1;

import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.ITile;
import game.MenuFormWidget;
import game.PlayerMenuKind;
import game.TileKind;
import impl_ver1.Game;
import impl_ver1.GameMatchCore;
import impl_ver1.Monarch;

/**
 * 踩中空城（無武將駐守之 {@link TileKind.City}）時，選單應帶表單嵌件：
 * 兵力／糧食 {@link MenuFormWidget.Slider} 與程式定義之 {@link MenuFormWidget.Button} 葉結算。
 */
class EmptyCityVacantFormMenuTest {
  static inline var RING_LEN = 10;
  static inline var START_PAWN = 2;
  static inline var CITY_IDX = 5;

  public static function run():Void {
    testVacantCityFormSubmit();
    testOccupiedCitySkipsForm();
    trace("[EmptyCityVacantFormMenuTest] OK — 空城表單／有駐將跳過");
  }

  static function testVacantCityFormSubmit():Void {
    var game:IGame = new Game();
    var match:IGameMatch = game.createGameMatch(Game.LEVEL_KEY_EMPTY);

    var tiles:Array<ITile> = [];
    for (i in 0...RING_LEN)
      tiles.push(match.createTile(i, i == CITY_IDX ? City : Plain));
    match.createBoard(tiles);

    match.createMonarch("m-city", 0, START_PAWN, 80, 40);
    var ruler = cast(match.monarchs()[0], Monarch);
    var player:IPlayer = match.createPlayer(ruler.id(), "city-player");

    if (!match.cityVacantNoGarrison(CITY_IDX))
      throw "EmptyCityVacantFormMenuTest: 預期初始為空城";

    match.applyMenuLeaf(player, requireLeafKind(match.createPlayerMenu(player), Move));

    if (ruler.pawnIndex() != CITY_IDX)
      throw 'EmptyCityVacantFormMenuTest: 預期落在 $CITY_IDX，實際 ${ruler.pawnIndex()}';
    if (match.forceGetPendingEmptyCityOccupyTile() != CITY_IDX)
      throw "EmptyCityVacantFormMenuTest: 應 pending 空城進駐";

    var menu = match.createPlayerMenu(player);
    var formNode = findFormNode(menu);
    assertFormWidgets(formNode);

    var submit = requireLeafKind(menu, EmptyCityOccupySubmit);
    var fm = new Map<String, Int>();
    fm.set(GameMatchCore.OCCUPY_FIELD_TROOPS, 30);
    fm.set(GameMatchCore.OCCUPY_FIELD_GRAIN, 10);
    match.applyMenuLeaf(player, submit, null, null, fm);

    if (match.forceGetPendingEmptyCityOccupyTile() != null)
      throw "EmptyCityVacantFormMenuTest: 結算後應清除 pending";
    if (ruler.troops() != 50 || ruler.grain() != 30)
      throw 'EmptyCityVacantFormMenuTest: 君主資源不符 got troops=${ruler.troops()} grain=${ruler.grain()}';
    if (match.forceGetCityStoredTroops(CITY_IDX) != 30 || match.forceGetCityStoredGrain(CITY_IDX) != 10)
      throw "EmptyCityVacantFormMenuTest: 城池累儲不符";

    requireLeafKind(match.createPlayerMenu(player), ConfirmDone);
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

    match.applyMenuLeaf(player, requireLeafKind(match.createPlayerMenu(player), Move));

    if (match.forceGetPendingEmptyCityOccupyTile() != null)
      throw "EmptyCityVacantFormMenuTest: 有駐城不應進空城表單";
    requireLeafKind(match.createPlayerMenu(player), ConfirmDone);
  }

  static function findFormNode(menu:IPlayerMenu):IPlayerMenuNode {
    for (n in menu.rootNodes())
      if (n.formWidgets().length > 0)
        return n;
    throw "EmptyCityVacantFormMenuTest: 找不到含 formWidgets 的節點";
  }

  static function assertFormWidgets(n:IPlayerMenuNode):Void {
    var fw = n.formWidgets();
    if (fw.length != 4)
      throw "EmptyCityVacantFormMenuTest: 預期 2 Slider + 2 Button，got " + fw.length;
    switch fw[0] {
      case Slider(fid, _, min, max, step):
        if (fid != GameMatchCore.OCCUPY_FIELD_TROOPS || min != 0 || max != 80 || step != 1)
          throw "EmptyCityVacantFormMenuTest: 兵力滑桿參數不符";
      default:
        throw "EmptyCityVacantFormMenuTest: [0] 應為兵力 Slider";
    }
    switch fw[1] {
      case Slider(fid, _, min, max, step):
        if (fid != GameMatchCore.OCCUPY_FIELD_GRAIN || min != 0 || max != 40 || step != 1)
          throw "EmptyCityVacantFormMenuTest: 糧食滑桿參數不符";
      default:
        throw "EmptyCityVacantFormMenuTest: [1] 應為糧食 Slider";
    }
    switch fw[2] {
      case Button(e):
        if (e.kind() != EmptyCityOccupySubmit)
          throw "EmptyCityVacantFormMenuTest: [2] 應為確認進駐按鈕";
      default:
        throw "EmptyCityVacantFormMenuTest: [2] 應為 Button";
    }
    switch fw[3] {
      case Button(e):
        if (e.kind() != EmptyCityOccupyAbort)
          throw "EmptyCityVacantFormMenuTest: [3] 應為離開按鈕";
      default:
        throw "EmptyCityVacantFormMenuTest: [3] 應為 Button";
    }
  }

  static function findLeafKind(menu:IPlayerMenu, kind:PlayerMenuKind):Null<IPlayerMenuEntry> {
    return findLeafInNodes(menu.rootNodes(), kind);
  }

  static function findLeafInNodes(nodes:Array<IPlayerMenuNode>, kind:PlayerMenuKind):Null<IPlayerMenuEntry> {
    for (n in nodes) {
      var L = n.leaf();
      if (L != null && L.kind() == kind)
        return L;
      for (w in n.formWidgets())
        switch w {
          case Button(e):
            if (e.kind() == kind)
              return e;
          case Slider(_, _, _, _, _):
        }
      var inner = findLeafInNodes(n.children(), kind);
      if (inner != null)
        return inner;
    }
    return null;
  }

  static function requireLeafKind(menu:IPlayerMenu, kind:PlayerMenuKind):IPlayerMenuEntry {
    var L = findLeafKind(menu, kind);
    if (L == null)
      throw 'EmptyCityVacantFormMenuTest: 缺少 PlayerMenuKind $kind';
    return L;
  }
}
