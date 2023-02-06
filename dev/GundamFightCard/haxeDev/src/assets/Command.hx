package assets;

import viewModel.IViewModel.CommandModel;
import haxe.ui.containers.HBox;

@:build(haxe.ui.ComponentBuilder.build('assets/command.xml'))
class Command extends HBox {
	public var model(default, set):CommandModel;
	public var selectable(default, set):Bool;
	public var focus(default, set):Bool;

	public function new() {
		super();
	}

	function set_model(m:CommandModel):CommandModel {
		lbl_id.text = m.id;
		lbl_action.text = m.name;
		return m;
	}

	function set_selectable(s:Bool):Bool {
		s ? box_selectable.show() : box_selectable.hide();
		return s;
	}

	function set_focus(f:Bool):Bool {
		f ? box_focus.show() : box_focus.hide();
		return f;
	}
}
