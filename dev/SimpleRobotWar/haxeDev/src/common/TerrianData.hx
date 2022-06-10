package common;

import haxe.Exception;
import common.IDefine;

final TERRIANS:Array<TerrianData> = [
	{
		title: "海",
		moveFactor: [1, 1.25, 1.5, 2],
		evade: 2,
		def: 1
	},
	{
		title: "平原",
		moveFactor: [2, 1, 1.25, 1.5],
		evade: 1,
		def: 1
	},
	{
		title: "森林",
		moveFactor: [1.5, 1.25, 1, 1.25],
		evade: 1.5,
		def: 1.5
	},
	{
		title: "山",
		moveFactor: [2, 1.5, 1.25, 1],
		evade: 1.5,
		def: 2
	}
];

function getTerrianData(id:Int):TerrianData {
	if (TERRIANS.length <= id) {
		throw new Exception('TerrianData not found:${id}');
	}
	final data = TERRIANS[id];
	return data;
}
