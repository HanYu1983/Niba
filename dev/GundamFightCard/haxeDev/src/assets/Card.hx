package assets;

import haxe.ui.containers.Absolute;
import haxe.ui.containers.Box;
import haxe.ui.events.MouseEvent;
import viewModel.IViewModel;

@:build(haxe.ui.ComponentBuilder.build('src/assets/Card.xml'))
class Card extends Box {
	public var model(default, set):CardModel;
	public var playerModel(default, set):PlayerModel;

	public function new() {
		super();

		box_desc.hide();
	}

	public function set_playerModel(player:PlayerModel) {
		img_cardback.resource = player.url;
		return player;
	}

	public function set_model(model:CardModel):CardModel {
		final cardInfo = Main.model.getCardInfoByProtoId(model.protoId);

		lbl_id.text = cardInfo.id;
		lbl_name.text = cardInfo.name;
		lbl_content.text = cardInfo.content;
		img_card.resource = cardInfo.url;

		box_watching.hide();
		img_cardback.hide();
		switch ([model.faceup, model.watchingByPlayer.length > 0]) {
			// 沒打開，在觀察
			case [false, true]:
				box_watching.show();
			// 沒打開，沒觀察
			case [false, false]:
				img_cardback.show();
			// 打開，沒觀察
			case [true, false]:
			// 打開，在觀察
			case [true, true]:
		}

		this.model = model;
		return model;
	}
}
