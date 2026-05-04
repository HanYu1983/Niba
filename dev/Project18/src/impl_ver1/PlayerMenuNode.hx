package impl_ver1;

import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.MenuFormWidget;

class PlayerMenuNode implements IPlayerMenuNode {
  var _caption:String;
  var _leaf:Null<IPlayerMenuEntry>;
  var _children:Array<IPlayerMenuNode>;
  var _formWidgets:Array<MenuFormWidget>;

  public function new(caption:String, leaf:Null<IPlayerMenuEntry>, children:Array<IPlayerMenuNode>, ?formWidgets:Array<MenuFormWidget>) {
    _caption = caption;
    _leaf = leaf;
    _children = children;
    _formWidgets = formWidgets != null ? formWidgets.copy() : [];
  }

  public function caption():String
    return _caption;

  public function leaf():Null<IPlayerMenuEntry>
    return _leaf;

  public function children():Array<IPlayerMenuNode>
    return _children;

  public function formWidgets():Array<MenuFormWidget>
    return _formWidgets.copy();
}
