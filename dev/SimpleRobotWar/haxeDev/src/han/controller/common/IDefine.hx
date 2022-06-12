package han.controller.common;

import haxe.Exception;
import haxe.Constraints;
import common.IDefine;
import common.WeaponData;
import common.TerrianData;
import han.model.IDefine;

function getRobotView(ctx:Context, robotId:String):RobotView {
	final robot = getRobot(ctx, robotId);
	final pilot = getRobotPilot(ctx, robotId);
	final weapons = getRobotWeapons(ctx, robotId);
	return {
		id: robot.id,
		title: robot.title,
		pilotId: pilot != null ? pilot.id : null,
		weaponIds: weapons.map(w -> w.id),
		hp: robot.hp,
		energy: robot.energy,
		action: robot.action,
		maxHp: robot.maxHp,
		maxEnergy: robot.maxEnergy,
		maxAction: robot.maxAction,
	}
}

function getPilotView(ctx:Context, id:String):PilotView {
	final pilot = getPilot(ctx, id);
	final robotId = ctx.pilotToRobot.get(id);
	return {
		id: pilot.id,
		title: pilot.title,
		robotId: robotId,
		melee: pilot.melee,
		range: pilot.range,
		attack: pilot.attack,
		guard: pilot.guard,
		lucky: pilot.lucky,
	}
}

function getWeaponView(ctx:Context, id:String):WeaponView {
	final weapon = getWeapon(ctx, id);
	final weaponData = getWeaponData(weapon.dataId);
	final robotId = ctx.weaponToRobot.get(id);
	return {
		id: weapon.id,
		title: weaponData.title,
		robotId: robotId,
		level: weapon.level,
		bullet: weapon.bullet,
	}
}