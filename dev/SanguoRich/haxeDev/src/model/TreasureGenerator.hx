package model;

import model.PeopleGenerator.People;

typedef TreasureCatelog = {
	id:Int,
	name:String,
	command:Int,
	force:Int,
	intelligence:Int,
	political:Int,
	charm:Int,
	cost:Int,
	abilities:Array<Int>,
}

typedef TreasureInfo = {
	id:Int,
	belongToPeople:People,
	catelog:TreasureCatelog,
}

// 名稱可以從這個網址找
// https://docs.google.com/document/d/1hHM_D2n08EBJGj0jUMyYLrQLS0VdJz3PR3n8nkDCjhY/edit#
final treasureList:Array<TreasureCatelog> = [
    {
        id:0,
        name:'七星寶刀',
        command: 10,
        force: 5,
        intelligence: 0,
        political: 0 ,
        charm: 10,
        abilities:[],
        cost: 25,
    },
    {
        id:1,
        name:'方天畫戟',
        command: 0,
        force: 10,
        intelligence: 0,
        political: 0 ,
        charm: 5,
        abilities:[0],
        cost: 25,
    },
    {
        id:2,
        name:'青龍偃月刀',
        command: 0,
        force: 10,
        intelligence: 0,
        political: 0 ,
        charm: 5,
        abilities:[2],
        cost: 25,
    },
    {
        id:3,
        name:'倚天之劍',
        command: 0,
        force: 10,
        intelligence: 0,
        political: 0 ,
        charm: 10,
        abilities:[],
        cost: 20,
    },
    {
        id:4,
        name:'青釭之劍',
        command: 10,
        force: 0,
        intelligence: 0,
        political: 0 ,
        charm: 10,
        abilities:[],
        cost: 20,
    },
    {
        id:5,
        name:'鐵脊蛇矛',
        command: 0,
        force: 10,
        intelligence: 0,
        political: 0 ,
        charm: 5,
        abilities:[],
        cost: 15,
    },
    {
        id:6,
        name:'古錠刀',
        command: 5,
        force: 5,
        intelligence: 0,
        political: 0 ,
        charm: 5,
        abilities:[],
        cost: 15,
    },
    {
        id:7,
        name:'鐵蒺藜骨朵',
        command: 0,
        force: 5,
        intelligence: 0,
        political: 0 ,
        charm: 5,
        abilities:[],
        cost: 10,
    },
    {
        id:8,
        name:'眉尖刀',
        command: 5,
        force: 0,
        intelligence: 0,
        political: 0 ,
        charm: 5,
        abilities:[],
        cost: 10,
    },
    {
        id:9,
        name:'飛刀',
        command: 0,
        force: 5,
        intelligence: 0,
        political: 0 ,
        charm: 0,
        abilities:[],
        cost: 5,
    },
    {
        id:10,
        name:'袖箭',
        command: 5,
        force: 0,
        intelligence: 0,
        political: 0 ,
        charm: 0,
        abilities:[],
        cost: 5,
    }
	{
		id: 0,
		name: '七星寶刀',
		command: 10,
		force: 5,
		intelligence: 0,
		political: 0,
		charm: 10,
		abilities: [],
		cost: 10,
	},
	{
		id: 1,
		name: '方天畫戟',
		command: 5,
		force: 10,
		intelligence: 0,
		political: 0,
		charm: 0,
		abilities: [0],
		cost: 10,
	},
	{
		id: 2,
		name: '青龍偃月刀',
		command: 0,
		force: 15,
		intelligence: 0,
		political: 0,
		charm: 10,
		abilities: [2],
		cost: 10,
	}
];

class TreasureGenerator {
	private static var inst:TreasureGenerator = new TreasureGenerator();

	public static function getInst() {
		return inst;
	}

	private function new() {}

	public function generator():TreasureInfo {
		var id = Math.floor(Date.now().getTime() + Math.random() * 9999);
		var catelog = treasureList[Math.floor(Math.random() * treasureList.length)];
		return {
			id: id,
			belongToPeople: null,
			catelog: catelog
		};
	}
}
