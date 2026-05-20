package view;

import domain.Geometry.Vec2;
import domain.Machine;
import domain.World;
import domain.Weapon.WeaponOnMachine;
import view.Camera.Camera2D;
import view.Camera.createDefaultCamera;
import view.Camera.createProjectionMatrix;
import view.Camera.createViewMatrix;
import view.Camera.createViewProjectionMatrix;
import view.RenderWorld.RenderWeaponOnMachine;
import view.RenderWorld.RenderWorld;

/**
 * 將 domain.World 轉成繪圖用 RenderWorld。
 *
 * 第一版採全量轉換; 若之後物件數變多, 可把此 module 改為 stateful builder
 * 以重用 Render* 物件與矩陣快取。
 */
function createRenderWorld(world:World, ?camera:Camera2D):RenderWorld {
	var resolvedCamera = camera == null ? createCameraFromWorld(world) : camera;

	return {
		machines: world.machines.copy(),
		weaponsOnMachine: createRenderWeaponsOnMachine(world),
		weaponsOnField: world.weaponsOnField.copy(),
		projectiles: world.projectiles.copy(),
		hitboxes: world.hitboxes.copy(),
		markers: world.markers.copy(),
		camera: resolvedCamera,
		viewMatrix: createViewMatrix(resolvedCamera),
		projectionMatrix: createProjectionMatrix(resolvedCamera),
		viewProjectionMatrix: createViewProjectionMatrix(resolvedCamera)
	};
}

private function createCameraFromWorld(world:World):Camera2D {
	var camera = createDefaultCamera();
	camera.position = {x: world.cameraPos.x, y: world.cameraPos.y};
	camera.zoom = Math.max(0.1, 1.0 + world.cameraPos.z * 0.01);
	return camera;
}

private function createRenderWeaponsOnMachine(world:World):Array<RenderWeaponOnMachine> {
	var weapons:Array<RenderWeaponOnMachine> = [];

	for (weapon in world.weaponsOnMachine) {
		var owner = findMachine(world, weapon.ownerMachineId);
		if (owner == null)
			continue;

		weapons.push(createRenderWeaponOnMachine(weapon, owner));
	}

	return weapons;
}

private function createRenderWeaponOnMachine(weapon:WeaponOnMachine, owner:Machine):RenderWeaponOnMachine {
	var worldPosition = toWorldPosition(owner.position, owner.facing, weapon.localPosition);

	return {
		id: weapon.id,
		name: weapon.name,
		ownerMachineId: weapon.ownerMachineId,
		localPosition: weapon.localPosition,
		localFacing: weapon.localFacing,
		definition: weapon.definition,
		worldPosition: worldPosition,
		worldFacing: owner.facing + weapon.localFacing
	};
}

private function findMachine(world:World, id:String):Null<Machine> {
	for (machine in world.machines)
		if (machine.id == id)
			return machine;

	return null;
}

private function toWorldPosition(origin:Vec2, facing:Float, local:Vec2):Vec2 {
	var c = Math.cos(facing);
	var s = Math.sin(facing);

	return {
		x: origin.x + local.x * c - local.y * s,
		y: origin.y + local.x * s + local.y * c
	};
}
