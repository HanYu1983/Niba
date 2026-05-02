package debug;

import game.GameIds;
import game.IBoard;
import game.IGame;
import game.IGameMatch;
import game.IGeneral;
import game.IMonarch;
import game.IPlayer;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.ITile;
import game.PlayerMenuKind;
import game.TileKind;

/**
 * 偵錯／煙霧用 IGame：僅 {@link createGameMatch(level_key)}；零件實作供 MatchLevels／SimpleGameMatch 委派。
 */
class SimpleGame implements IGame {
  public function new() {}

  public function createGameMatch(level_key:LevelKey):IGameMatch
    return new SimpleGameMatch(this, level_key);

  public function createTile(index:TileIndex, kind:TileKind):ITile
    return new SimpleTile(index, kind);

  public function createBoard(tiles:Array<ITile>):IBoard
    return new SimpleBoard(tiles);

  public function createGeneral(id:GeneralId, owner:MonarchId, command:Int, might:Int, wit:Int, stewardship:Int):IGeneral
    return new SimpleGeneral(id, owner, command, might, wit, stewardship);

  public function createMonarch(id:MonarchId, seat:Int, pawnIndex:TileIndex, ?troops:Int, ?grain:Int):IMonarch {
    var tr = troops != null ? troops : 0;
    var gr = grain != null ? grain : 0;
    return new SimpleMonarch(id, seat, pawnIndex, tr, gr);
  }

  public function createPlayer(monarchId:MonarchId, displayName:String):IPlayer
    return new SimplePlayer(monarchId, displayName);

  public function createPlayerMenuEntry(kind:PlayerMenuKind, caption:String, enabled:Bool, ?decisionToken:String):IPlayerMenuEntry
    return new SimplePlayerMenuEntry(kind, caption, enabled, decisionToken);

  public function createPlayerMenuNode(caption:String, leaf:Null<IPlayerMenuEntry>, children:Array<IPlayerMenuNode>):IPlayerMenuNode
    return new SimplePlayerMenuNode(caption, leaf, children);
}
