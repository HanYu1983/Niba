package model;
import haxe.ui.components.Rule;
import libnoise.generator.Perlin;

typedef Grid = {
    id:Int,
    landType:Int,
    buildtype:Int,
    height:Float,
    attachs:Array<Int>
}

class GridGenerator{

    public function new() {}

    private static var inst = new GridGenerator();
    public static function getInst():GridGenerator{
        return inst;
    }

    public function getGrids(count:Int):Array<Grid> {
        var grids = [];
        for(i in 0...count){
            var height = getHeight(i);
            var g = {
                id:i,
                landType:[0,0,1,1,1,1,2,2,3,3][Math.floor(height * 10)],
                buildtype:[0,0,0,0,0,0,2,2,3,3][Math.floor(Math.random() * 10)],
                height:height,
                attachs:[]
            };
            grids.push(g);
        }
        return grids;
    }

    private function getHeight(x:Int = 0, y:Int = 0, z:Int = 0) {
        var noise = new Perlin(.1);
        return (noise.getValue(x, y, z) + 1) / 2;
    }

}