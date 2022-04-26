package model;

import model.PeopleGenerator.People;
import libnoise.QualityMode;
import haxe.ui.components.Rule;
import libnoise.generator.Perlin;

typedef Grid = {
	id:Int,
	landType:Int,
	buildtype:BUILDING,
	height:Float,
	attachs:Array<Int>,
	belongPlayerId:Int,
	value:Int,
	money:Float,
	moneyGrow:Float,
	food:Float,
	foodGrow:Float,
	army:Float,
	armyGrow:Float,
	people:Array<People>
}

enum BUILDING {
	EMPTY;
	MARKET;
	FARM;
	VILLAGE;
	FORGE;
	POLICE;
	WALL;
	EXPLORE;
	BARRACKS;
	CITY;
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
			landType: 0,
			buildtype: BUILDING.EMPTY,
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
			people: []
		};
	}

	public function getGrids(count:Int):Array<Grid> {

		function getRandomRange(range:Float, offset:Float) {
			return Math.random() * range + offset;
		}

		var grids = [];
		for (i in 0...count) {
			var height = getHeight(i);
			var g = getGrid();
			g.id = i;
			g.landType = [0, 0, 1, 1, 1, 1, 2, 2, 3, 3][Math.floor(height * 10)];
			g.buildtype = [
			    BUILDING.EMPTY,
			    BUILDING.EMPTY,
			    BUILDING.EMPTY,
				BUILDING.FARM,
				BUILDING.MARKET,
				BUILDING.VILLAGE,
				BUILDING.FARM,
				BUILDING.MARKET,
				BUILDING.VILLAGE,
			    BUILDING.CITY
			][Math.floor(Math.random() * 10)];

			final basicArmy = getRandomRange(150, 50);

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

			g.moneyGrow *= g.army * .01;
			g.foodGrow *= g.army * .01;
			g.armyGrow *= g.army * .01;

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
