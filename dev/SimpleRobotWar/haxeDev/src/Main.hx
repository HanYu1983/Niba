package;

import common.Define;
import han.Model;
import haxe.Serializer;
import haxe.Unserializer;

class Main {
	static function checkType(a) {
		trace(switch (Type.typeof(a)) {
			case TInt: "Int";
			case TBool: "Bool";
			case TClass(cls): cls + "";
			case other: throw "unhandled type " + other;
		});
	}

	public static function main() {
		final model = new Model();
		{
			final robot1 = model.addRobot();
			final robot2 = model.addRobot();
			final pilot1 = model.addPilot();
			model.setPilot(robot1, pilot1);
			model.setPilot(robot2, pilot1);
		}
		Serializer.USE_CACHE = true;
		final s = Serializer.run(model);
		trace(s);
		final model2 = Unserializer.run(s);
		trace(model2);
		{
			final robot1 = model.getRobots()[0];
			final robot2 = model.getRobots()[1];
			final pilot1 = model.getPilots()[0];
			trace(robot1.getPilot() == robot2.getPilot());
			trace(robot1.getPilot() == pilot1);
		}
		{
			final robot1 = model2.addRobot();
			final robot2 = model2.addRobot();
			final pilot1 = model2.addPilot();
			model2.setPilot(robot1, pilot1);
			model2.setPilot(robot2, pilot1);
		}
		trace(model2);
	}
}
