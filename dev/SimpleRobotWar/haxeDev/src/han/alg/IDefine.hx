package han.alg;

import common.IConfig;
import han.model.IDefine;

function initContext(ctx:Context) {
	ctx.grids = getRandomMap(MAP_W, MAP_H);

	final player0 = createPlayer(0);
	ctx.players.push(player0);
	final player1 = createPlayer(1);
	ctx.players.push(player1);
	ctx.currentPlayerId = player0.id;
	{
		final robot = createRobot('${ctx.idSeq++}');
		ctx.robots.set(robot.id, robot);
		ctx.positionToRobot.set(POS(0, 0), robot.id);
		ctx.robotToPlayer.set(robot.id, player0.id);

		final pilot = createPilot('${ctx.idSeq++}');
		ctx.pilots.set(pilot.id, pilot);
		ctx.pilotToRobot.set(pilot.id, robot.id);

		final weapon = createWeapon('${ctx.idSeq++}');
		ctx.weapons.set(weapon.id, weapon);
		ctx.weaponToRobot.set(weapon.id, robot.id);
	}

	{
		final robot = createRobot('${ctx.idSeq++}');
		ctx.robots.set(robot.id, robot);
		ctx.positionToRobot.set(POS(3, 3), robot.id);
		ctx.robotToPlayer.set(robot.id, player1.id);

		final pilot = createPilot('${ctx.idSeq++}');
		ctx.pilots.set(pilot.id, pilot);
		ctx.pilotToRobot.set(pilot.id, robot.id);
	}

	{
		final robot = createRobot('${ctx.idSeq++}');
		ctx.robots.set(robot.id, robot);
		ctx.positionToRobot.set(POS(5, 5), robot.id);

		final pilot = createPilot('${ctx.idSeq++}');
		ctx.pilots.set(pilot.id, pilot);
		ctx.pilotToRobot.set(pilot.id, robot.id);
	}
}