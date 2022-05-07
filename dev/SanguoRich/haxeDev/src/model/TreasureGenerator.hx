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
        cost: 10,
    },
    {
        id:1,
        name:'方天畫戟',
        command: 5,
        force: 10,
        intelligence: 0,
        political: 0 ,
        charm: 0,
        abilities:[0],
        cost: 10,
    },
    {
        id:2,
        name:'青龍偃月刀',
        command: 0,
        force: 15,
        intelligence: 0,
        political: 0 ,
        charm: 10,
        abilities:[2],
        cost: 10,
    }
];

class TreasureGenerator {

    private static var inst:TreasureGenerator = new TreasureGenerator();

    public static function getInst(){ return inst; }

    private function new() {}

    var id = 0;

    public function generator():TreasureInfo{
        var catelog = treasureList[Math.floor(Math.random() * treasureList.length)];
        return {
            id:id++,
            belongToPeople: null,
            catelog:catelog
        };
    }
}
