package model.ver1.game.component;

typedef PlayerSelection = {
	cardIds:Map<String, Array<String>>
}

interface ISelectionComponent {
	var playerSelection:PlayerSelection;
}

function getPlayerSelectionCardId(ctx:ISelectionComponent, key:String):Array<String> {
	final selection = ctx.playerSelection.cardIds[key];
	if (selection == null) {
		throw new haxe.Exception("selection not found");
	}
	return selection;
}

function setPlayerSelectionCardId(ctx:ISelectionComponent, key:String, values:Array<String>):Void {
	ctx.playerSelection.cardIds[key] = values;
}
