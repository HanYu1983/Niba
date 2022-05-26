package model;

import model.tool.Debug.warn;
import model.PeopleGenerator.People;
import libnoise.QualityMode;
import libnoise.generator.Perlin;
import model.TreasureGenerator;

typedef Grid = {
	id:Int,
	name:String,
	landType:LANDTYPE,
	landAttachment:Array<LANDATTACHMENT>,
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
	strategys:Array<Array<Int>>,
	treasures:Array<TreasureInfo>,
	maxMoney:Float,
	maxFood:Float,
	maxArmy:Float,
}

enum LANDTYPE {
	SHALLOW;
	PLAIN;
	HILL;
	MOUNTAIN;
}

enum LANDATTACHMENT {
	TREE;
	GOLDEN;
	WHEAT;
	ANIMAL;
	FISH;
}

enum GROWTYPE {
	EMPTY;
	CHANCE;
	DESTINY;
	MARKET;
	FARM;
	VILLAGE;
	CITY;
}

enum BUILDING {
	MARKET(level:Int);
	BANK(level:Int);

	FARM(level:Int);
	BARN(level:Int);
	BARRACKS(level:Int);
	HOME(level:Int);
	WALL(level:Int);
	EXPLORE(level:Int);
	SIEGEFACTORY(level:Int);
	ACADEMY(level:Int);

	FISHING(level:Int);
	HUNTING(level:Int);
	MINE(level:Int);
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
			landType: LANDTYPE.HILL,
			landAttachment: [],
			buildtype: GROWTYPE.EMPTY,
			height: 0,
			attachs: [],
			belongPlayerId: null,
			value: 0,
			money: 0,
			moneyGrow: 0.0,
			food: 0,
			foodGrow: 0.0,
			army: 0,
			armyGrow: 0.0,
			people: [],
			favor: [0, 0, 0, 0],
			strategys: [[], [], [], []],
			treasures: [],
			maxMoney: 0,
			maxFood: 0,
			maxArmy: 0,
		};
	}

	var gridNames = [
		'滴島', '通河', '貸鄉', '樹莊', '商區', '富州', '翅坊', '東鎮', '蹄堡', '雷省', '扔山', '握港', '通鄉', '佩府', '乏坡', '社觀', '誕壩', '鐮莊', '綱莊', '悠路', '緒港', '客湖', '喚坊', '啄山', '組省',
		'震村', '山山', '嫁河', '寸壩', '暢縣', '鴉峰', '乏州', '壓村', '灑島', '忍崖', '睬觀', '斥城', '波峰', '溫郡', '驟鎮', '療省', '喝省', '生道', '緞坊', '半鄉', '蒼崖', '棵島', '序巷', '岔島', '遙鎮',
		'醬觀', '拌鎮', '殼湖', '致谷', '扇崖', '信坊', '竿島', '徒鎮', '務港', '廳鄉'
	];

	public function getGrids(count:Int, isLimitBuilding:Bool, type:Int):Array<Grid> {
		function getRandomFloat(range:Float, offset:Float = 0.0) {
			return Math.random() * range + offset;
		}

		function getRandomInt(range:Float, offset:Float = 0.0) {
			return Math.floor(getRandomFloat(range, offset));
		}

		var growTotal = [];
		growTotal = growTotal.concat([for (i in 0...3) GROWTYPE.EMPTY]);
		growTotal = growTotal.concat([for (i in 0...1) GROWTYPE.DESTINY]);
		growTotal = growTotal.concat([for (i in 0...1) GROWTYPE.CHANCE]);
		growTotal = growTotal.concat([for (i in 0...2) GROWTYPE.MARKET]);
		growTotal = growTotal.concat([for (i in 0...2) GROWTYPE.FARM]);
		growTotal = growTotal.concat([for (i in 0...2) GROWTYPE.VILLAGE]);
		growTotal = growTotal.concat([for (i in 0...2) GROWTYPE.FARM]);
		growTotal = growTotal.concat([for (i in 0...1) GROWTYPE.CITY]);
		
		var landTotal = [];
		landTotal = landTotal.concat([for (i in 0...getRandomInt(10, 10)) LANDTYPE.SHALLOW]);
		landTotal = landTotal.concat([for (i in 0...getRandomInt(10, 5)) LANDTYPE.PLAIN]);
		landTotal = landTotal.concat([for (i in 0...getRandomInt(10, 5)) LANDTYPE.HILL]);
		landTotal = landTotal.concat([for (i in 0...getRandomInt(10, 10)) LANDTYPE.MOUNTAIN]);

		final randomStart = Math.round(Math.random() * 9999999);
		final grids = [];
		for (i in 0...count) {
			final height = getHeight((randomStart + i) / 100.0);

			var g = getGrid();
			g.id = i;
			g.height = height;
			g.name = g.id + gridNames[(i + randomStart) % gridNames.length];
			g.landType = landTotal[Math.floor(height * (landTotal.length - 1))];
			g.buildtype = growTotal[getRandomInt(growTotal.length)];
			warn("GridGenerator", 'should not be null, g.landType: ${g.landType}, g.buildtype:${g.buildtype}');
		
			g.moneyGrow = Math.random() * 0.01;
			g.foodGrow = Math.random() * 0.01;
			g.armyGrow = Math.random() * 0.01;
			
			g.maxArmy = 500;
			g.maxFood = 500;
			g.maxMoney = 500;

			switch ([g.landType, g.buildtype]) {
				case [SHALLOW, MARKET]:
					g.attachs = [
						BUILDING.MARKET(0),
						BUILDING.BANK(1),
						BUILDING.FISHING(0),
						BUILDING.WALL(0),
					];
					g.army = getRandomFloat(180, 80);
					g.money = getRandomFloat(180, 80);
					g.food = getRandomFloat(180, 80);
					g.money *= 1.5;
					g.people.push(PeopleGenerator.getInst().generate(type));
				case [PLAIN, MARKET]:
					g.attachs = [
						BUILDING.MARKET(0),
						BUILDING.BANK(1),
						BUILDING.WALL(0),
						BUILDING.EXPLORE(0),
					];
					g.army = getRandomFloat(180, 80);
					g.money = getRandomFloat(180, 80);
					g.food = getRandomFloat(180, 80);
					g.money *= 1.5;
					g.people.push(PeopleGenerator.getInst().generate(type));
				case [HILL, MARKET]:
					g.attachs = [
						BUILDING.MARKET(0),
						BUILDING.BANK(1),
						BUILDING.MINE(0),
						BUILDING.WALL(0),
					];
					g.army = getRandomFloat(180, 80);
					g.money = getRandomFloat(180, 80);
					g.food = getRandomFloat(180, 80);
					g.money *= 1.5;
					g.people.push(PeopleGenerator.getInst().generate(type));
				case [MOUNTAIN, MARKET]:
					g.attachs = [
						BUILDING.MARKET(0),
						BUILDING.BANK(1),
						BUILDING.HUNTING(0),
						BUILDING.WALL(0),
					];
					g.army = getRandomFloat(180, 80);
					g.money = getRandomFloat(180, 80);
					g.food = getRandomFloat(180, 80);
					g.money *= 1.5;
					g.people.push(PeopleGenerator.getInst().generate(type));
				case [SHALLOW, FARM]:
					g.attachs = [
						BUILDING.FARM(0),
						BUILDING.BARN(1),
						BUILDING.FISHING(0),
						BUILDING.WALL(0),
					];
					g.army = getRandomFloat(180, 80);
					g.money = getRandomFloat(180, 80);
					g.food = getRandomFloat(180, 80);
					g.food *= 1.5;
					g.people.push(PeopleGenerator.getInst().generate(type));
				case [PLAIN, FARM]:
					g.attachs = [
						BUILDING.FARM(0),
						BUILDING.BARN(1),
						BUILDING.WALL(0),
						BUILDING.EXPLORE(0),
					];
					g.army = getRandomFloat(180, 80);
					g.money = getRandomFloat(180, 80);
					g.food = getRandomFloat(180, 80);
					g.food *= 1.5;
					g.people.push(PeopleGenerator.getInst().generate(type));
				case [HILL, FARM]:
					g.attachs = [
						BUILDING.FARM(0),
						BUILDING.BARN(1),
						BUILDING.MINE(0),
						BUILDING.WALL(0),
					];
					g.army = getRandomFloat(180, 80);
					g.money = getRandomFloat(180, 80);
					g.food = getRandomFloat(180, 80);
					g.food *= 1.5;
					g.people.push(PeopleGenerator.getInst().generate(type));
				case [MOUNTAIN, FARM]:
					g.attachs = [
						BUILDING.FARM(0),
						BUILDING.BARN(1),
						BUILDING.HUNTING(0),
						BUILDING.WALL(0),
					];
					g.army = getRandomFloat(180, 80);
					g.money = getRandomFloat(180, 80);
					g.food = getRandomFloat(180, 80);
					g.food *= 1.5;
					g.people.push(PeopleGenerator.getInst().generate(type));
				case [SHALLOW, VILLAGE]:
					g.attachs = [
						BUILDING.BARRACKS(0),
						BUILDING.HOME(1),
						BUILDING.FISHING(0),
						BUILDING.WALL(0),
					];
					g.army = getRandomFloat(180, 80);
					g.money = getRandomFloat(180, 80);
					g.food = getRandomFloat(180, 80);
					g.army *= 1.5;
					g.people.push(PeopleGenerator.getInst().generate(type));
				case [PLAIN, VILLAGE]:
					g.attachs = [
						BUILDING.BARRACKS(0),
						BUILDING.HOME(1),
						BUILDING.ACADEMY(0),
						BUILDING.SIEGEFACTORY(0),
						BUILDING.WALL(0),
					];
					g.army = getRandomFloat(180, 80);
					g.money = getRandomFloat(180, 80);
					g.food = getRandomFloat(180, 80);
					g.army *= 1.5;
					g.people.push(PeopleGenerator.getInst().generate(type));
				case [HILL, VILLAGE]:
					g.attachs = [
						BUILDING.BARRACKS(0),
						BUILDING.HOME(1),
						BUILDING.MINE(0),
						BUILDING.WALL(0),
					];
					g.army = getRandomFloat(180, 80);
					g.money = getRandomFloat(180, 80);
					g.food = getRandomFloat(180, 80);
					g.army *= 1.5;
					g.people.push(PeopleGenerator.getInst().generate(type));
				case [MOUNTAIN, VILLAGE]:
					g.attachs = [
						BUILDING.BARRACKS(0),
						BUILDING.HOME(1),
						BUILDING.HUNTING(0),
						BUILDING.WALL(0),
					];
					g.army = getRandomFloat(180, 80);
					g.money = getRandomFloat(180, 80);
					g.food = getRandomFloat(180, 80);
					g.army *= 1.5;
					g.people.push(PeopleGenerator.getInst().generate(type));
				case [PLAIN, CITY]:
					g.attachs = [
						BUILDING.MARKET(0),
						BUILDING.BANK(1),
						BUILDING.FARM(0),
						BUILDING.BARN(1),
						BUILDING.BARRACKS(0),
						BUILDING.HOME(1),
						BUILDING.EXPLORE(0),
						BUILDING.SIEGEFACTORY(0),
						BUILDING.ACADEMY(0),
						BUILDING.WALL(0),
					];
					g.army = getRandomFloat(180, 80);
					g.money = getRandomFloat(180, 80);
					g.food = getRandomFloat(180, 80);
					g.money *= 1.5;
					g.food *= 1.5;
					g.army *= 1.5;
					g.people.push(PeopleGenerator.getInst().generate(type));
				case [MOUNTAIN, CITY]:
					g.attachs = [
						BUILDING.MARKET(0),
						BUILDING.BANK(1),
						BUILDING.FARM(0),
						BUILDING.BARN(1),
						BUILDING.BARRACKS(0),
						BUILDING.HOME(1),
						BUILDING.EXPLORE(0),
						BUILDING.SIEGEFACTORY(0),
						BUILDING.ACADEMY(0),
						BUILDING.HUNTING(0),
						BUILDING.WALL(0),
					];
					g.army = getRandomFloat(180, 80);
					g.money = getRandomFloat(180, 80);
					g.food = getRandomFloat(180, 80);
					g.money *= 1.5;
					g.food *= 1.5;
					g.army *= 1.5;
					g.people.push(PeopleGenerator.getInst().generate(type));
				case [_, EMPTY]:
					g.maxArmy = 0;
					g.maxFood = 0;
					g.maxMoney = 0;
					g.moneyGrow = 0;
					g.foodGrow = 0;
					g.armyGrow = 0;

					g.people.push(PeopleGenerator.getInst().generate(type));
					for (i in 0...5)
						if (Math.random() < .3)
							g.treasures.push(TreasureGenerator.getInst().generator());
				case _:
					g.maxArmy = 0;
					g.maxFood = 0;
					g.maxMoney = 0;
					g.moneyGrow = 0;
					g.foodGrow = 0;
					g.armyGrow = 0;
			}

			grids.push(g);
		}
		return grids;
	}

	final noise = new Perlin(10.0, 2, .5, 16, 0, QualityMode.HIGH);

	private function getHeight(x:Float = 0, y:Float = 0, z:Float = 0) {
		final value = (noise.getValue(x, y, z) + 1.0) / 2.0;
		if(value < 0) return 0.0;
		if(value > 1) return 1.0;
		return value;
	}
}
