package viewModel;

typedef CardModel = {
	id:String,
	protoId:String,
	owner:String,
	// 是否公開
	faceup:Bool,
	// 是否正在觀察
	// watching:Bool,
	watchingByPlayer:Array<String>,
}

typedef CardInfoModel = {
	id:String,
	name:String,
	content:String,
	// 卡片的url
	url:String,
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

final DEFAULT_CARD_INFO_MODEL:CardInfoModel = {
	id:'0',
	name:'gundam',
	content: "content",
	// 卡片的url
	url: 'https://storage.googleapis.com/particle-resources/cardPackage/gundamWarN/179030_11E_U_BL208S_2_blue.jpg',
}

interface IViewModel {
	function getGame():GameModel;
	function previewPlayCard(id:String):PreviewPlayCardModel;
	function getCardInfoByProtoId(protoId:String):CardInfoModel;
}

class DefaultViewModel implements IViewModel {
	public function getGame():GameModel {
		return DEFAULT_GAME_MODEL;
	}

	public function previewPlayCard(id:String):PreviewPlayCardModel {
		return DEFAULT_PREVIEW_PLAY_CARD_MODEL;
	}

	public function getCardInfoByProtoId(protoId:String):CardInfoModel {
		return DEFAULT_CARD_INFO_MODEL;
	}
}
