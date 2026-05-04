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
 * 踩中 {@link IGameMatch#cityOwnedByActiveMonarch 我方城池}：應持續出現「調度」表單（3 嵌件）與「結束拜訪」，
 * 直至套用 {@link PlayerMenuKind.FriendlyCityVisitEnd}。
 */
class FriendlyOwnedCityDispatchMenuTest {
  static inline var RING_LEN = 10;
  static inline var START_PAWN = 2;
  static inline var CITY_IDX = 5;

  public static function run():Void {
    testFriendlyCityPersistentMenuUntilVisitEnd();
    trace("[FriendlyOwnedCityDispatchMenuTest] OK — 我方城調度表單／結束拜訪");
  }

  static function testFriendlyCityPersistentMenuUntilVisitEnd():Void {
    var game:IGame = new Game();
    var match:IGameMatch = game.createGameMatch(Game.LEVEL_KEY_EMPTY);

    var tiles:Array<ITile> = [];
    for (i in 0...RING_LEN)
      tiles.push(match.createTile(i, i == CITY_IDX ? City : Plain));
    match.createBoard(tiles);

    match.createMonarch("m-own", 0, START_PAWN, 80, 40);
    match.forceSetCityOwner(CITY_IDX, "m-own");
    match.forcePutCityStores(CITY_IDX, 25, 15);

    if (!match.cityOwnedByActiveMonarch(CITY_IDX))
      throw "FriendlyOwnedCityDispatchMenuTest: 預期為我方城地";

    var ruler = cast(match.monarchs()[0], Monarch);
    var player:IPlayer = match.createPlayer(ruler.id(), "own-city");

    match.applyMenuLeaf(player, requireLeafKind(match.createPlayerMenu(player), Move));

    if (ruler.pawnIndex() != CITY_IDX)
      throw 'FriendlyOwnedCityDispatchMenuTest: 預期落在 $CITY_IDX';
    if (match.forceGetPendingFriendlyCityVisitTile() != CITY_IDX)
      throw "FriendlyOwnedCityDispatchMenuTest: 應 pending 我方城池拜訪";
    if (match.forceGetPendingEmptyCityOccupyTile() != null)
      throw "FriendlyOwnedCityDispatchMenuTest: 不應進空城進駐流程";

    var menu1 = match.createPlayerMenu(player);
    assertVisitMenuShape(menu1, 80, 40, 25, 15);

    var fm1 = new Map<String, Int>();
    fm1.set(GameMatchCore.DISPATCH_FIELD_TROOPS, 50);
    fm1.set(GameMatchCore.DISPATCH_FIELD_GRAIN, 15);
    match.applyMenuLeaf(player, requireLeafKind(menu1, FriendlyCityDispatchApply), null, null, fm1);

    if (match.forceGetPendingFriendlyCityVisitTile() != CITY_IDX)
      throw "FriendlyOwnedCityDispatchMenuTest: 確認調度後仍應停留拜訪（選單持續）";
    if (ruler.troops() != 55)
      throw "FriendlyOwnedCityDispatchMenuTest: 兵力應為 80-(50-25)=55，got " + ruler.troops();
    if (match.forceGetCityStoredTroops(CITY_IDX) != 50 || match.forceGetCityStoredGrain(CITY_IDX) != 15)
      throw "FriendlyOwnedCityDispatchMenuTest: 城池儲備更新不符";

    var menu2 = match.createPlayerMenu(player);
    assertVisitMenuShape(menu2, 55, 40, 50, 15);

    match.applyMenuLeaf(player, requireLeafKind(menu2, FriendlyCityVisitEnd));

    if (match.forceGetPendingFriendlyCityVisitTile() != null)
      throw "FriendlyOwnedCityDispatchMenuTest: 結束拜訪後應清除 pending";
    requireLeafKind(match.createPlayerMenu(player), ConfirmDone);
  }

  static function assertVisitMenuShape(menu:IPlayerMenu, expMaxTroop:Int, expMaxGrain:Int, expDefTroop:Int, expDefGrain:Int):Void {
    var roots = menu.rootNodes();
    if (roots.length < 2)
      throw "FriendlyOwnedCityDispatchMenuTest: 預期至少調度 + 結束拜訪根節點";
    var dispatchNode = roots[0];
    if (dispatchNode.caption() != "調度")
      throw 'FriendlyOwnedCityDispatchMenuTest: 第一項應為「調度」，got ${dispatchNode.caption()}';
    var fw = dispatchNode.formWidgets();
    if (fw.length != 3)
      throw "FriendlyOwnedCityDispatchMenuTest: 調度表單應為 3 元件（2 Slider + 1 Button），got " + fw.length;

    switch fw[0] {
      case Slider(fid, _, min, max, step, def):
        if (fid != GameMatchCore.DISPATCH_FIELD_TROOPS || min != 0 || max != expMaxTroop || step != 1 || def != expDefTroop)
          throw "FriendlyOwnedCityDispatchMenuTest: 調度兵力 Slider 不符（max/預設應反映君主池與城池兵力）";
      default:
        throw "FriendlyOwnedCityDispatchMenuTest: [0] 應為調度兵力 Slider";
    }
    switch fw[1] {
      case Slider(fid, _, min, max, step, def):
        if (fid != GameMatchCore.DISPATCH_FIELD_GRAIN || min != 0 || max != expMaxGrain || step != 1 || def != expDefGrain)
          throw "FriendlyOwnedCityDispatchMenuTest: 調度糧食 Slider 不符（max/預設應反映君主池與城池糧食）";
      default:
        throw "FriendlyOwnedCityDispatchMenuTest: [1] 應為調度糧食 Slider";
    }
    switch fw[2] {
      case Button(e):
        if (e.kind() != FriendlyCityDispatchApply)
          throw "FriendlyOwnedCityDispatchMenuTest: 第三元件應為確認調度";
      default:
        throw "FriendlyOwnedCityDispatchMenuTest: [2] 應為 Button（確認調度）";
    }

    var endNode = roots[1];
    var endLeaf = endNode.leaf();
    if (endLeaf == null || endLeaf.kind() != FriendlyCityVisitEnd)
      throw "FriendlyOwnedCityDispatchMenuTest: 第二項應為結束拜訪葉";
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
      throw 'FriendlyOwnedCityDispatchMenuTest: 缺少 PlayerMenuKind $kind';
    return L;
  }
}
