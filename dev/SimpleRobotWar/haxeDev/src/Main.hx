package;

import common.Define;
import tool.AStar;
import han.Model;
import haxe.Serializer;
import haxe.Unserializer;

class Main {
	public static function main() {
		tool.AStar.test();

		// final model:IModel = new Model();
		// {
		// 	final robot1 = model.createRobot();
		// 	model.push(robot1);
		// 	final robot2 = model.createRobot();
		// 	model.push(robot2);
		// 	final pilot1 = model.createPilot();
		// 	model.push(pilot1);
		// 	model.setPilotRobot(pilot1, robot1);
		// }
		// Serializer.USE_CACHE = true;
		// final s = Serializer.run(model);
		// trace(s);
		// final model2 = Unserializer.run(s);
		// trace(model2);
		// {
		// 	final robot1 = model.getRobots()[0];
		// 	final robot2 = model.getRobots()[1];
		// 	final pilot1 = model.getPilots()[0];
		// 	trace(robot1.getPilot() == robot2.getPilot());
		// 	trace(robot1.getPilot() == pilot1);
		// }
	}
}
