package han.alg;

import common.IConfig;
import han.model.IDefine;

function initContext(ctx:Context) {
	ctx.grids = getRandomMap(MAP_W, MAP_H);
	final robot = createRobot('${ctx.idSeq++}');
	ctx.robots.set(robot.id, robot);

	final pilot = createPilot('${ctx.idSeq++}');
	ctx.pilots.set(pilot.id, pilot);
	ctx.pilotToRobot.set(pilot.id, robot.id);

	final weapon = createWeapon('${ctx.idSeq++}');
	ctx.weapons.set(weapon.id, weapon);
	ctx.weaponToRobot.set(weapon.id, robot.id);
}