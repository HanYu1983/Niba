package impl_ver1;

import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;

class PlayerMenu implements IPlayerMenu {
  var _player:IPlayer;
  var _contextId:String;
  var _roots:Array<IPlayerMenuNode>;

  public function new(player:IPlayer, contextId:String, roots:Array<IPlayerMenuNode>) {
    _player = player;
    _contextId = contextId;
    _roots = roots;
  }

  public function forPlayer():IPlayer
    return _player;

  public function matchContextId():String
    return _contextId;

  public function rootNodes():Array<IPlayerMenuNode>
    return _roots;

  public function entries():Array<IPlayerMenuEntry> {
    var acc = new Array<IPlayerMenuEntry>();
    collectLeaves(_roots, acc);
    return acc;
  }

  static function collectLeaves(nodes:Array<IPlayerMenuNode>, acc:Array<IPlayerMenuEntry>):Void {
    for (n in nodes) {
      var leaf = n.leaf();
      if (leaf != null)
        acc.push(leaf);
      else
        collectLeaves(n.children(), acc);
    }
  }
}
