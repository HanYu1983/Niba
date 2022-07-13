import mme.math.glmatrix.Vec3;
import mme.math.glmatrix.Quat;
import webgl.WebglEngine;
import ecs.Entity;
import ecs.components.MeshRenderer;
import ecs.components.Camera;

class Tool {
	public static function getEulerFromQuat(quat:Quat) {
		final t0 = 2.0 * (quat.w * quat.x + quat.y * quat.z);
		final t1 = 1.0 - 2.0 * (quat.x * quat.x + quat.y * quat.y);
		final roll = Math.atan2(t0, t1);

		var t2 = 2.0 * (quat.w * quat.y - quat.z * quat.x);
		t2 = Math.min(1, t2);
		t2 = Math.max(-1, t2);
		final pitch = Math.asin(t2);

		final t3 = 2.0 * (quat.w * quat.z + quat.x * quat.y);
		final t4 = 1.0 - 2.0 * (quat.y * quat.y + quat.z * quat.z);
		final yaw = Math.atan2(t3, t4);

		return Vec3.fromValues(roll, pitch, yaw);
	}

	public static function createCameraEntity(name:String) {
		final entity = new Entity(name);
		entity.addComponent(new Camera('${name}_camera'));
		return entity;
	}

	public static function createMeshEntity(name:String, meshId, materialId) {
		final componentName = '${name}_meshRenderer';
		final entity = new Entity(name);
		final meshComponent = new MeshRenderer(componentName, meshId, materialId);
		entity.addComponent(meshComponent);
		return entity;
	}

	public static function getMeshRendererComponent(entity:Entity) {
		// entity.getComponent
	}

	public static function renderMeshEntity(entity:Entity, camera:Entity) {}
}
