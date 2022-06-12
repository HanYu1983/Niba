package common;

import haxe.Exception;
import common.IDefine;

private final GOOD = 1;
private final NORMAL = 2;
private final BAD = 4;
private final VERY_BAD = 8;

final TERRIANS:Array<TerrianData> = [
	{
		title: "海",
		moveFactor: [GOOD, VERY_BAD, VERY_BAD, BAD],
		evade: 2,
		def: 1
	},
	{
		title: "平原",
		moveFactor: [NORMAL, GOOD, NORMAL, BAD],
		evade: 1,
		def: 1
	},
	{
		title: "森林",
		moveFactor: [BAD, NORMAL, GOOD, NORMAL],
		evade: 1.5,
		def: 1.5
	},
	{
		title: "山",
		moveFactor: [VERY_BAD, BAD, NORMAL, GOOD],
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
