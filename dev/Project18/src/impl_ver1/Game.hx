package impl_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.ITile;
import game.TileKind;

/**
 * Ver1：依 level_key 建立 {@link GameMatchCore} 並組立關卡局面。
 */
class Game implements IGame {
  /** 空白賽局：僅 {@link GameMatchCore} 初始化，供測試自行組局。 */
  public static inline var LEVEL_KEY_EMPTY = "ver1/empty";

  public function new() {}

  public function createGameMatch(level_key:LevelKey):IGameMatch {
    var match = new GameMatchCore();
    configureFromLevel(match, level_key);
    return match;
  }

  function configureFromLevel(match:GameMatchCore, key:LevelKey):Void {
    switch key {
      case LEVEL_KEY_EMPTY:
        return;
      case "ver1/smoke":
        match.createMonarch("m-atk", 0, 0, 500, 80);
        match.createMonarch("m-def", 1, 0, 100, 200);
        match.createGeneral("g-might-high", "m-atk", 1, 50, 1, 1);
        match.createGeneral("g-might-low", "m-atk", 1, 20, 1, 1);
        var tiles:Array<ITile> = [match.createTile(0, Plain)];
        match.createBoard(tiles);
      default:
        throw 'Game: unknown level_key "$key"';
    }
  }
}
