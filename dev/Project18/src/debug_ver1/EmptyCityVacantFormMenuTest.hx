package debug_ver1;

import game.GameIds;
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
 * 空城進駐：第一段 {@link MenuFormWidget.GeneralMultiPick}，第二段兵力／糧食 Slider；
 * {@link MenuFormWidget.Button} 結算經 {@link IGameMatch#applyMenuLeaf}。
 */
class EmptyCityVacantFormMenuTest {
  static inline var RING_LEN = 10;
  static inline var START_PAWN = 2;
  static inline var CITY_IDX = 5;

  public static function run():Void {
    testVacantCityTwoPhaseOccupy();
    testOccupiedCitySkipsForm();
    trace("[EmptyCityVacantFormMenuTest] OK — 空城複選駐將→調配資源／有駐將跳過");
  }

  static function testVacantCityTwoPhaseOccupy():Void {
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

    match.applyMenuLeaf(player, requireLeafKind(match.createPlayerMenu(player), Move));

    if (match.forceGetPendingEmptyCityOccupyTile() != CITY_IDX)
      throw "EmptyCityVacantFormMenuTest: 應 pending 空城進駐";

    var menuPick = match.createPlayerMenu(player);
    assertPhasePickGenerals(menuPick);

    var pickLists = new Map<String, Array<String>>();
    pickLists.set(GameMatchCore.EMPTY_CITY_GARRISON_FIELD, ["g-a", "g-b"]);
    match.applyMenuLeaf(player, requireLeafKind(menuPick, EmptyCityGarrisonPickConfirm), null, null, null, pickLists);

    if (match.forceGetPendingEmptyCityOccupyTile() != CITY_IDX)
      throw "EmptyCityVacantFormMenuTest: 第二段仍應為同一 pending 格";

    var menuAlloc = match.createPlayerMenu(player);
    assertPhaseAllocate(menuAlloc);

    var fm = new Map<String, Int>();
    fm.set(GameMatchCore.OCCUPY_FIELD_TROOPS, 30);
    fm.set(GameMatchCore.OCCUPY_FIELD_GRAIN, 10);
    match.applyMenuLeaf(player, requireLeafKind(menuAlloc, EmptyCityOccupySubmit), null, null, fm);

    if (match.forceGetPendingEmptyCityOccupyTile() != null)
      throw "EmptyCityVacantFormMenuTest: 結算後應清除 pending";
    if (ruler.troops() != 50 || ruler.grain() != 30)
      throw 'EmptyCityVacantFormMenuTest: 君主資源不符 got troops=${ruler.troops()} grain=${ruler.grain()}';
    if (match.forceGetCityStoredTroops(CITY_IDX) != 30 || match.forceGetCityStoredGrain(CITY_IDX) != 10)
      throw "EmptyCityVacantFormMenuTest: 城池累儲不符";

    var gid = match.forceGetCityGarrisonGeneralIds(CITY_IDX);
    if (gid.length != 2 || !arrayContains(gid, "g-a") || !arrayContains(gid, "g-b"))
      throw 'EmptyCityVacantFormMenuTest: 駐將列表不符 got ${gid.join(",")}';

    requireLeafKind(match.createPlayerMenu(player), ConfirmDone);
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

    match.applyMenuLeaf(player, requireLeafKind(match.createPlayerMenu(player), Move));

    if (match.forceGetPendingEmptyCityOccupyTile() != null)
      throw "EmptyCityVacantFormMenuTest: 有駐城不應進空城表單";
    requireLeafKind(match.createPlayerMenu(player), ConfirmDone);
  }

  static function assertPhasePickGenerals(menu:IPlayerMenu):Void {
    var n = findRootFormNode(menu, "複選駐將");
    var fw = n.formWidgets();
    if (fw.length != 3)
      throw "EmptyCityVacantFormMenuTest: 第一段預期 MultiPick + 2 Button，got " + fw.length;
    switch fw[0] {
      case GeneralMultiPick(fid, _, choices):
        if (fid != GameMatchCore.EMPTY_CITY_GARRISON_FIELD)
          throw "EmptyCityVacantFormMenuTest: GeneralMultiPick fieldId 不符";
        if (choices.length != 2 || choices[0].generalId != "g-a" || choices[1].generalId != "g-b")
          throw "EmptyCityVacantFormMenuTest: 複選候選應為 g-a、g-b";
      default:
        throw "EmptyCityVacantFormMenuTest: [0] 應為 GeneralMultiPick";
    }
    switch fw[1] {
      case Button(e):
        if (e.kind() != EmptyCityGarrisonPickConfirm)
          throw "EmptyCityVacantFormMenuTest: [1] 應為確認駐將";
      default:
        throw "EmptyCityVacantFormMenuTest: [1] 應為 Button";
    }
    switch fw[2] {
      case Button(e):
        if (e.kind() != EmptyCityOccupyAbort)
          throw "EmptyCityVacantFormMenuTest: [2] 應為取消進駐";
      default:
        throw "EmptyCityVacantFormMenuTest: [2] 應為 Button";
    }
  }

  static function assertPhaseAllocate(menu:IPlayerMenu):Void {
    var n = findRootFormNode(menu, "調配資源");
    var fw = n.formWidgets();
    if (fw.length != 4)
      throw "EmptyCityVacantFormMenuTest: 第二段預期 2 Slider + 2 Button，got " + fw.length;
    switch fw[0] {
      case Slider(fid, _, min, max, step, def):
        if (fid != GameMatchCore.OCCUPY_FIELD_TROOPS || min != 0 || max != 80 || step != 1 || def != 0)
          throw "EmptyCityVacantFormMenuTest: 兵力滑桿參數不符";
      default:
        throw "EmptyCityVacantFormMenuTest: [0] 應為兵力 Slider";
    }
    switch fw[1] {
      case Slider(fid, _, min, max, step, def):
        if (fid != GameMatchCore.OCCUPY_FIELD_GRAIN || min != 0 || max != 40 || step != 1 || def != 0)
          throw "EmptyCityVacantFormMenuTest: 糧食滑桿參數不符";
      default:
        throw "EmptyCityVacantFormMenuTest: [1] 應為糧食 Slider";
    }
    switch fw[2] {
      case Button(e):
        if (e.kind() != EmptyCityOccupySubmit)
          throw "EmptyCityVacantFormMenuTest: [2] 應為確認進駐";
      default:
        throw "EmptyCityVacantFormMenuTest: [2] 應為 Button";
    }
    switch fw[3] {
      case Button(e):
        if (e.kind() != EmptyCityOccupyAbort)
          throw "EmptyCityVacantFormMenuTest: [3] 應為離開";
      default:
        throw "EmptyCityVacantFormMenuTest: [3] 應為 Button";
    }
  }

  static function findRootFormNode(menu:IPlayerMenu, captionSub:String):IPlayerMenuNode {
    for (r in menu.rootNodes())
      if (r.formWidgets().length > 0 && r.caption().indexOf(captionSub) >= 0)
        return r;
    throw 'EmptyCityVacantFormMenuTest: 找不到表單根節點（$captionSub）';
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
          case Slider(_, _, _, _, _, _):
          case GeneralMultiPick(_, _, _):
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
