package common;

import haxe.Exception;
import haxe.ds.StringMap;
import common.IDefine;

private final WEAPON_DATAS:StringMap<WeaponData> = [
	"實體刀" => {
		title: "實體刀",
		cost: 0,
		bullet: 0,
		attack: [
			{
				title: "斬擊",
				cost: [ACTION(2)],
				attackShape: DOT(1, 1),
				times: 2,
				hitRate: 0.9,
				damage: [PHYSICS(100)],
				attackFlag: [MELEE],
				isMelee: true,
			}
		],
		guard: [
			{
				title: "斬落飛彈",
				cost: [ACTION(2)],
				successRate: 0.7,
				attackFlag: [MELEE, MISSILE],
				guardResult: REDUCE(100),
				isMelee: true,
			}
		],
		shield: [],
	},
	"實體光束刀" => {
		title: "實體光束刀",
		cost: 0,
		bullet: 0,
		attack: [
			{
				title: "斬擊",
				cost: [ACTION(2), ENERGY(10)],
				attackShape: DOT(1, 1),
				times: 2,
				hitRate: 0.9,
				damage: [PHYSICS(50), BEAM(50)],
				attackFlag: [MELEE],
				isMelee: true,
			}
		],
		guard: [],
		shield: [],
	},
	"火神砲" => {
		title: "火神砲",
		cost: 0,
		bullet: 2000,
		attack: [
			{
				title: "",
				cost: [BULLET(100)],
				attackShape: DOT(1, 1),
				times: 10,
				hitRate: 0.9,
				damage: [PHYSICS(2)],
				attackFlag: [],
				isMelee: true,
			}
		],
		guard: [
			{
				title: "擊落飛彈",
				cost: [ACTION(2), BULLET(100)],
				successRate: 0.2,
				attackFlag: [MELEE, MISSILE],
				guardResult: REDUCE(100),
				isMelee: true,
			}
		],
		shield: [],
	},
	"飛彈發射器" => {
		title: "飛彈發射器",
		cost: 0,
		bullet: 16,
		attack: [
			{
				title: "發射飛彈",
				cost: [ACTION(2), BULLET(4)],
				attackShape: SELECT(1, 6, 3),
				times: 4,
				hitRate: 0.3,
				damage: [EXPLODE(100)],
				attackFlag: [MISSILE],
				isMelee: false,
			}
		],
		guard: [],
		shield: [],
	},
	"實體盾牌" => {
		title: "實體盾牌",
		cost: 0,
		bullet: 0,
		attack: [
			{
				title: "撞擊",
				cost: [ACTION(2)],
				attackShape: DOT(1, 1),
				times: 2,
				hitRate: 0.9,
				damage: [PHYSICS(50)],
				attackFlag: [MELEE],
				isMelee: true,
			}
		],
		guard: [
			{
				title: "盾牌防禦",
				cost: [ACTION(2)],
				successRate: 0.7,
				attackFlag: [MELEE, MISSILE],
				guardResult: REDUCE(100),
				isMelee: true,
			}
		],
		shield: [],
	},
	"重裝甲" => {
		title: "重裝甲",
		cost: 0,
		bullet: 0,
		attack: [],
		guard: [],
		shield: [
			{
				title: "重裝保護",
				cost: [ACTION(1)],
				damage: [PHYSICS(100), BEAM(10), EXPLODE(10)],
			}
		],
	},
	"光束防護罩" => {
		title: "光束防護罩",
		cost: 0,
		bullet: 0,
		attack: [],
		guard: [
			{
				title: "光束吸收",
				cost: [ENERGY(10)],
				successRate: 1.0,
				attackFlag: [BEAM],
				guardResult: REDUCE(100),
				isMelee: true,
			}
		],
		shield: [],
	}
];

function getWeaponData(id:String):WeaponData {
	final data = WEAPON_DATAS.get(id);
	if (data == null) {
		throw new Exception('weaponData not found:${id}');
	}
	return data;
}
