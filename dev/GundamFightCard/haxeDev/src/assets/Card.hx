package assets;

import model.Model.CardModel;
import haxe.ui.containers.Absolute;
import haxe.ui.containers.Box;
import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build('src/assets/Card.xml'))
class Card extends Box implements IInfo {
	public function new() {
		super();
	}

	public function setInfo(info:Dynamic):Void {
		var cardModel:CardModel = info;
        lbl_id.text = cardModel.id;
        lbl_name.text = cardModel.name;
        lbl_content.text = cardModel.content;
	}
}
