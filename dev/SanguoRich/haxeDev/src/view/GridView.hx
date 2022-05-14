package view;

import tweenx909.TweenX;
import model.GridGenerator.GROWTYPE;
import model.GridGenerator.Grid;
import model.GridGenerator.BUILDING;
import haxe.ui.containers.Box;
import model.Config;

using Lambda;

@:build(haxe.ui.ComponentBuilder.build("assets/grid-view.xml"))
class GridView extends Box {
	public var name(default, set):String;

	function set_name(name:String) {
		lbl_name.text = name;
		return name;
	}

	public var type(default, set):Int;

	function set_type(type:Int) {
		// lbl_type.text = switch(type){
		//     case 0: "低地";
		//     case 1: "平地";
		//     case 2: "山丘";
		//     case 3: "高地";
		//     case _: "未定義";
		// };
		return type;
	}

	public var building(default, set):GROWTYPE;

	function set_building(type:GROWTYPE) {
		lbl_building.text = switch (type) {
			case MARKET: "市";
			case FARM: "田";
			case VILLAGE: "村";
			case CITY: "城";
			case _: "";
		}
		switch (type) {
			case EMPTY:
				box_build.hide();
			case _:
				box_build.show();
		}
		return type;
	}

	public var playerId(default, set):Int = -1;

	function set_playerId(id:Int) {
		if (id == -1) {
			box_playerCover.hide();
		} else {
			box_playerCover.show();
			box_playerCover.backgroundColor = switch (id) {
				case 0: '#FF0000';
				case 1: '#00FF00';
				case 2: '#0000FF';
				case 3: '#FFFF00';
				case _: '#000000';
			};
		}
		playerId = id;
		return id;
	}

	public function new() {
		super();

		box_showAnimation.hide();
	}

	public function showAnimation(text:String, duration:Float = 1.0, cb:()->Void){
		box_showAnimation.show();
		lbl_action.value = text;

		final tweens = [];
		tweens.push(TweenX.wait(duration));
		tweens.push(TweenX.func(()->{
			box_showAnimation.hide();
			cb();
		}));
		TweenX.serial(tweens);
	}

	public function setInfo(grid:Grid) {
		name = grid.name;
		type = grid.landType;
		building = grid.buildtype;
		playerId = grid.belongPlayerId == null ? -1 : grid.belongPlayerId;

		// 不知道為什麼haxeui的box縮放設為0的話，不會有反應，這裏最小先設為0.1
		box_money.percentHeight = Math.max(Main.clamp(grid.money / GRID_RESOURCE_MAX) * 100, .1);
		box_food.percentHeight = Math.max(Main.clamp(grid.food / GRID_RESOURCE_MAX) * 100, .1);
		box_army.percentHeight = Math.max(Main.clamp(grid.army / GRID_RESOURCE_MAX) * 100, .1);

		final strategyViews = [box_s0, box_s1, box_s2, box_s3];
		for (index => ary in grid.strategys) {
			ary.length > 0 ? strategyViews[index].show() : strategyViews[index].hide();
		}

		if (grid.buildtype != GROWTYPE.EMPTY && grid.belongPlayerId == null) {
			final gameInfo = Main.model.gameInfo();
			var favor = grid.favor[gameInfo.currentPlayer.id];
			lbl_favor.text = Main.getFavorString(favor);

			lbl_favor.show();
		} else {
			lbl_favor.hide();
		}
	}

	public static function showGridsAnimation(grids:Array<GridView>, gridIds:Array<Int>, msg, duration, cb:()->Void) {
		var count = gridIds.length;
		for(gridId in gridIds){
			grids[gridId].showAnimation(msg, duration, ()->{
				if(--count == 0 ){
					cb();
				}
			});
		}
	}
}
