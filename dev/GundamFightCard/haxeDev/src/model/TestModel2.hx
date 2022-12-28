package model;

import viewModel.IViewModel;

typedef BattlePoint = {}

enum RelativePlayer {
	Me;
	You;
}

typedef CardTextRequire = {
	id:String,
	relativePlayer:RelativePlayer,
}

typedef CardText = {
	id:String,
	requires:Array<CardTextRequire>
}

class CardProto1 {
	public function getId():String {
		return "gundam";
	}

	public function getText():Array<CardText> {
		return [
			{
				id: "戰鬥階段(1)，指定一隻機體，回合結束前速攻",
				requires: [
					{
						id: "國力一張",
						relativePlayer: Me,
					},
					{
						id: "指定一隻機體",
						relativePlayer: Me
					}
				]
			}
		];
	}

	public function getRequire(id:String) {
		switch(id){
			case "國力一張":
				
		}
	}
}

typedef Game = {}

@:nullSafety
class TestModel2 extends DefaultViewModel {
	public function new() {}

	public override function getGame():GameModel {
		return {
			players: []
		};
	}

	public override function previewPlayCard(id:String):PreviewPlayCardModel {
		return {
			success: false,
			msg: 'should have xxxx',
			content: {}
		}
	}
}
