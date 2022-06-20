package han.alg;

import han.model.IDefine;

function getBattleResult(ctx:Context, robotId:String, attackId:String, targetRobotIds:Array<String>) {
	final robot = getRobot(ctx, robotId);
	final attack = getRobotAttack(ctx, robotId, attackId);
	final weapon = getWeapon(ctx, attack.weaponId);
	final weaponData = getWeaponData(weapon.dataId);
	final pilot = getRobotPilot(ctx, robotId);
	for (targetRobotId in targetRobotIds) {
		final targetRobot = getRobot(ctx, targetRobotId);
		final targetPilot = getRobotPilot(ctx, targetRobotId);

		final isMelee = attack.isMelee;
		// cost
		for (c in attack.cost) {}
		// hitRate
		final hitRate = attack.hitRate;

		// damage
		for (time in 0...attack.times) {
			for (damage in attack.damage) {
				switch damage {
					case PHYSICS(v):
					case BEAM(v):
					case EXPLODE(v):
					case FIRE(v):
				}
			}
		}
	}
}
