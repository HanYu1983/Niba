package model;

import model.PeopleGenerator.People;
import libnoise.QualityMode;
import haxe.ui.components.Rule;
import libnoise.generator.Perlin;

typedef Grid = {
	id:Int,
	name:String,
	landType:Int,
	buildtype:GROWTYPE,
	height:Float,
	attachs:Array<BUILDING>,
	belongPlayerId:Int,
	value:Int,
	money:Float,
	moneyGrow:Float,
	food:Float,
	foodGrow:Float,
	army:Float,
	armyGrow:Float,
	people:Array<People>,
	favor:Array<Int>,
}

enum GROWTYPE {
	EMPTY;
	MARKET;
	FARM;
	VILLAGE;
	CITY;
}

enum BUILDING {
	MARKET(level:Int);
	FARM(level:Int);
	BARRACKS(level:Int);
	WALL(level:Int);
	EXPLORE(level:Int);
}

class GridGenerator {
	public function new() {}

	private static var inst = new GridGenerator();

	public static function getInst():GridGenerator {
		return inst;
	}

	public function getGrid():Grid {
		return {
			id: 0,
			name: '',
			landType: 0,
			buildtype: GROWTYPE.EMPTY,
			height: 0,
			attachs: [],
			belongPlayerId: null,
			value: 0,
			money: 100,
			moneyGrow: 0.01,
			food: 100,
			foodGrow: 0.01,
			army: 100,
			armyGrow: 0.01,
			people: [],
			favor:[0,0,0,0]
		};
	}

	var gridNames = ['滴島','通河','貸鄉','樹莊','商區','富州','翅坊','東鎮','蹄堡','雷省','扔山','握港','通鄉','佩府','乏坡','社觀','誕壩','鐮莊','綱莊','悠路','緒港','客湖','喚坊','啄山','組省','震村','山山','嫁河','寸壩','暢縣','鴉峰','乏州','壓村','灑島','忍崖','睬觀','斥城','波峰','溫郡','驟鎮','療省','喝省','生道','緞坊','半鄉','蒼崖','棵島','序巷','岔島','遙鎮','醬觀','拌鎮','殼湖','致谷','扇崖','信坊','竿島','徒鎮','務港','廳鄉'];

	public function getGrids(count:Int):Array<Grid> {

		function getRandomRange(range:Float, offset:Float) {
			return Math.random() * range + offset;
		}

		var grids = [];
		for (i in 0...count) {
			var height = getHeight(i);
			var g = getGrid();
			g.id = i;
			g.name = gridNames[i];
			g.landType = [0, 0, 1, 1, 1, 1, 2, 2, 3, 3][Math.floor(height * 10)];
			g.buildtype = [
			    GROWTYPE.EMPTY,
			    GROWTYPE.EMPTY,
			    GROWTYPE.EMPTY,
				GROWTYPE.FARM,
				GROWTYPE.MARKET,
				GROWTYPE.VILLAGE,
				GROWTYPE.FARM,
				GROWTYPE.MARKET,
				GROWTYPE.VILLAGE,
			    GROWTYPE.CITY
			][Math.floor(Math.random() * 10)];

			final basicArmy = getRandomRange(100, 40);

			g.moneyGrow = Math.random() * .01;
			g.foodGrow = Math.random() * .01;
			g.armyGrow = Math.random() * .01;
			g.army = basicArmy;

			switch (g.buildtype){
				case EMPTY:
					g.money = 0;
					g.army = 0;
					g.food = 0;
					g.moneyGrow = 0;
					g.foodGrow = 0;
					g.armyGrow = 0;
					g.people.push(PeopleGenerator.getInst().generate());
				case MARKET:
					g.money = getRandomRange(120, 80);
					g.food = getRandomRange(60, 50);
					g.moneyGrow += .02;
					g.people.push(PeopleGenerator.getInst().generate());
				case FARM:
					g.money = getRandomRange(60, 50);
					g.food = getRandomRange(120, 80);
					g.foodGrow += .02;
					g.people.push(PeopleGenerator.getInst().generate());
				case VILLAGE:
					g.money = getRandomRange(60, 50);
					g.food = getRandomRange(60, 50);
					g.army *= 1.5;
					g.armyGrow += .02;
					g.people.push(PeopleGenerator.getInst().generate());
				case CITY:
					g.money = getRandomRange(180, 80);
					g.army *= 2;
					g.food = getRandomRange(180, 80);
					g.moneyGrow += .01;
					g.foodGrow += .01;
					g.armyGrow += .01;
					g.people.push(PeopleGenerator.getInst().generate());
				case _:
					
			}

			g.moneyGrow += g.army / 300 * .01;
			g.foodGrow += g.army / 300 * .01;
			g.armyGrow += g.army / 300 * .01;

			g.height = height;
			grids.push(g);
		}
		return grids;
	}

	private function getHeight(x:Int = 0, y:Int = 0, z:Int = 0) {
		var noise = new Perlin(.1, 2, .5, 16, 0, QualityMode.HIGH);
		return (noise.getValue(x, y, z) + 1) / 2;
	}
}
