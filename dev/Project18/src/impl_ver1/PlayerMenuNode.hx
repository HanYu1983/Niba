package impl_ver1;

import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;

class PlayerMenuNode implements IPlayerMenuNode {
  var _caption:String;
  var _leaf:Null<IPlayerMenuEntry>;
  var _children:Array<IPlayerMenuNode>;

  public function new(caption:String, leaf:Null<IPlayerMenuEntry>, children:Array<IPlayerMenuNode>) {
    _caption = caption;
    _leaf = leaf;
    _children = children;
  }

  public function caption():String
    return _caption;

  public function leaf():Null<IPlayerMenuEntry>
    return _leaf;

  public function children():Array<IPlayerMenuNode>
    return _children;
}
