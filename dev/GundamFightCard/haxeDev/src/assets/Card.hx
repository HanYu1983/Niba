package assets;

import haxe.ui.containers.Absolute;
import haxe.ui.containers.Box;
import haxe.ui.events.MouseEvent;
import viewModel.IViewModel;

@:build(haxe.ui.ComponentBuilder.build('src/assets/Card.xml'))
class Card extends Box {

	public var model(default, set):CardModel;

	public function new() {
		super();
	}

	public function set_model(model:CardModel):CardModel {
        lbl_id.text = model.id;
        lbl_name.text = model.name;
        lbl_content.text = model.content;
		this.model = model;
		return model;
	}
}
