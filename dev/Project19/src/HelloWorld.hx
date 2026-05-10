import debug.PathfinderTest;
import sample.DashSlash;
import sample.GoalDemo;

class HelloWorld {
	static public function main():Void {
		var blade = DashSlash.plasmaBlade;
		var skill = DashSlash.dashSlash;

		trace("Hello, World from Haxe!");
		trace('Weapon : ${blade.name} -> ${blade.definition.name} (${blade.definition.category})');
		trace('Mounted: owner=${blade.ownerMachineId} local=(${blade.localPosition.x}, ${blade.localPosition.y})');
		trace('Skill  : ${skill.name} (${skill.steps.length} steps)');

		for (i in 0...skill.steps.length) {
			var s = skill.steps[i];
			var movement = s.movement == null ? "no-move" : Std.string(s.movement.type);
			var weapon = s.weaponUse == null ? "no-weapon" : s.weaponUse.weaponId;
			trace('  step ${i + 1}: dur=${s.duration}s | movement=$movement | weapon=$weapon');
		}

		GoalDemo.run();
		PathfinderTest.run();
	}
}
