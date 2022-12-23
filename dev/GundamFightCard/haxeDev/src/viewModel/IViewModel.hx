package viewModel;

typedef CardModel = {
	id:String,
	name:String,
	content:String,
	owner:String,
}

typedef PlayerModel = {
	id:String,
	name:String,
	hand:Array<CardModel>,
	deck:Array<CardModel>
}

typedef GameModel = {
	players:Array<PlayerModel>
}

typedef PreviewPlayCardModel = {
	success:Bool,
	msg:String,
	content:Dynamic
}

interface IViewModel{
    function getGame():GameModel;
    function previewPlayCard(id:String):PreviewPlayCardModel;
}
