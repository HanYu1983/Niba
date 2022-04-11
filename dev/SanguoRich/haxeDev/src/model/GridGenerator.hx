package model;
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
    value:Int
}

enum BUILDING{
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

class GridGenerator{

    public function new() {}

    private static var inst = new GridGenerator();
    public static function getInst():GridGenerator{
        return inst;
    }

    public function getGrid():Grid{
        return {
            id:0,
            landType:0,
            buildtype:BUILDING.EMPTY,
            height:0,
            attachs:[],
            belongPlayerId: null,
            value:0
        };
    }

    public function getGrids(count:Int):Array<Grid> {
        var grids = [];
        for(i in 0...count){
            var height = getHeight(i);
            var g = getGrid();
            g.id = i;
            g.landType = [0,0,1,1,1,1,2,2,3,3][Math.floor(height * 10)];
            g.buildtype = [
                BUILDING.EMPTY,
                BUILDING.EMPTY,
                BUILDING.EMPTY,
                BUILDING.MARKET,
                BUILDING.MARKET,
                BUILDING.FARM,
                BUILDING.FARM,
                BUILDING.VILLAGE,
                BUILDING.VILLAGE,
                BUILDING.CITY
            ][Math.floor(Math.random() * 10)];
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