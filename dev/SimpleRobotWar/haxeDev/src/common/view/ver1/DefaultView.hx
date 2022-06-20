package common.view.ver1;

import haxe.Timer;
import haxe.Exception;
import common.IDefine;
import common.IViewModel;
import tool.Debug;
import tool.Helper;

using Lambda;

private interface _IDefaultView extends IView {}

@:nullSafety
abstract class DefaultView implements _IDefaultView {
	public function new() {}
}
