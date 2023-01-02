package viewModel;

typedef CardModel = {
	id:String,
	name:String,
	content:String,
	owner:String,
	// 卡片的url
	url:String,
	// 是否公開
	faceup:Bool,
	// 是否正在觀察
	watching:Bool,
}

typedef PlayerModel = {
	id:String,
	name:String,
	hand:Array<CardModel>,
	deck:Array<CardModel>,
	// 卡背的url
	url:String
}

typedef GameModel = {
	players:Array<PlayerModel>
}

final DEFAULT_GAME_MODEL:GameModel = {
	players: []
}

typedef PreviewPlayCardModel = {
	success:Bool,
	msg:String,
	content:Dynamic
}

final DEFAULT_PREVIEW_PLAY_CARD_MODEL:PreviewPlayCardModel = {
	success: false,
	msg: "",
	content: {},
}

interface IViewModel {
	function getGame():GameModel;
	function previewPlayCard(id:String):PreviewPlayCardModel;
}

class DefaultViewModel implements IViewModel {
	public function getGame():GameModel {
		return DEFAULT_GAME_MODEL;
	}

	public function previewPlayCard(id:String):PreviewPlayCardModel {
		return DEFAULT_PREVIEW_PLAY_CARD_MODEL;
	}
}
