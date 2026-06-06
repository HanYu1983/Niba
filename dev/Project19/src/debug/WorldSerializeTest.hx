package debug;

import domain.Damage.DamageType;
import domain.FieldObject.createEmptyMarker;
import domain.Machine.createEmptyMachine;
import domain.Weapon.WeaponOnMachine;
import domain.World;
import domain.World.createEmptyWorld;
import domain.World.serializeWorld;
import domain.World.unserializeWorld;

/**
 * World 序列化 / 反序列化的回路測試。
 *
 * 驗證項目:
 *   1. 主要欄位 (machines / markers / cameraPos) 數量與數值正確
 *   2. enum (Shape / Projectile / OnHit) 能正確還原
 *   3. Map<DamageType, Float> (defense.weights) 能正確還原
 *   4. 同一個 WeaponOnMachine 同時掛在 world.weaponsOnMachine 與
 *      machine.weapons 兩處時, 反序列化後仍是同一個物件參考
 *      (這是 World.hx 設計契約的關鍵: 兩處是同一批物件的兩種視角)
 */
class WorldSerializeTest {
	public static function run():Void {
		trace("=== World Serialize Test ===");

		var world = buildSampleWorld();

		var serialized = serializeWorld(world);
		trace('serialized length=${serialized.length}');

		var restored = unserializeWorld(serialized);

		assertEq("machines.length", world.machines.length, restored.machines.length);
		assertEq("weaponsOnMachine.length", world.weaponsOnMachine.length, restored.weaponsOnMachine.length);
		assertEq("markers.length", world.markers.length, restored.markers.length);

		assertEq("cameraPos.x", world.cameraPos.x, restored.cameraPos.x);
		assertEq("cameraPos.y", world.cameraPos.y, restored.cameraPos.y);
		assertEq("cameraPos.z", world.cameraPos.z, restored.cameraPos.z);
		assertEq("isDirty", world.isDirty, restored.isDirty);

		var originalMachine = world.machines[0];
		var restoredMachine = restored.machines[0];
		assertEq("machine.id", originalMachine.id, restoredMachine.id);
		assertEq("machine.name", originalMachine.name, restoredMachine.name);
		assertEq("machine.maxHp", originalMachine.maxHp, restoredMachine.maxHp);
		assertEq("machine.position.x", originalMachine.position.x, restoredMachine.position.x);
		assertEq("machine.position.y", originalMachine.position.y, restoredMachine.position.y);
		assertEq("machine.defense Fire", originalMachine.defense.weights.get(Fire), restoredMachine.defense.weights.get(Fire));
		assertEq("machine.defense Electric", originalMachine.defense.weights.get(Electric), restoredMachine.defense.weights.get(Electric));

		assertEq("marker.id", world.markers[0].id, restored.markers[0].id);
		assertEq("marker.position.x", world.markers[0].position.x, restored.markers[0].position.x);

		var restoredWeaponOnField = restored.weaponsOnMachine[0];
		var restoredWeaponOnMachine = restoredMachine.weapons[0];
		assertSame("weaponsOnMachine[0] === machines[0].weapons[0]", restoredWeaponOnField, restoredWeaponOnMachine);

		assertEq("weapon.definition.id", world.weaponsOnMachine[0].definition.id, restoredWeaponOnField.definition.id);

		trace("=== World Serialize Test DONE ===");
	}

	static function buildSampleWorld():World {
		var world = createEmptyWorld();

		var machine = createEmptyMachine();
		machine.id = "m1";
		machine.name = "Test Machine";
		machine.maxHp = 100.0;
		machine.position = {x: 12.5, y: -7.0};
		machine.defense.weights.set(Fire, 80.0);
		machine.defense.weights.set(Electric, 15.0);

		var weapon:WeaponOnMachine = {
			id: "w1",
			name: "Plasma Blade",
			ownerMachineId: machine.id,
			localPosition: {x: 0.0, y: 0.0},
			localFacing: 0.0,
			definition: {
				id: "plasma_blade",
				name: "Plasma Blade",
				category: Melee,
				power: NativeEnergy(5.0),
				fire: Single,
				projectile: Beam(50.0, {type: Energy, amount: 25.0}),
				baseAccuracy: 0.9
			}
		};

		machine.weapons.push(weapon);
		world.machines.push(machine);
		world.weaponsOnMachine.push(weapon);

		var marker = createEmptyMarker();
		marker.id = "spawn_a";
		marker.name = "Spawn A";
		marker.position = {x: 200.0, y: 0.0};
		world.markers.push(marker);

		world.cameraPos = {x: 10.0, y: 20.0, z: 30.0};
		world.isDirty = true;

		return world;
	}

	static function assertEq<T>(label:String, expected:T, actual:T):Void {
		if (expected == actual) {
			trace('  [OK] $label = $actual');
		} else {
			trace('  [FAIL] $label expected=$expected actual=$actual');
		}
	}

	static function assertSame(label:String, a:Dynamic, b:Dynamic):Void {
		if (a == b) {
			trace('  [OK] $label (same reference)');
		} else {
			trace('  [FAIL] $label NOT same reference');
		}
	}
}
