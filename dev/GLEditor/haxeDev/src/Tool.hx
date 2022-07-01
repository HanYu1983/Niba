import webgl.WebglEngine;
import ecs.Entity;
import ecs.components.MeshRenderer;
import ecs.components.Camera;

class Tool {
	public static function createCameraEntity(name:String) {
		final entity = new Entity(name);
		entity.addComponent(new Camera('${name}_camera'));
		return entity;
	}

	public static function createMeshEntity(name:String, meshId, materialId) {
		final componentName = '${name}_meshRenderer';
		final entity = new Entity(name);
		final meshComponent = new MeshRenderer(componentName);
		meshComponent.meshId = meshId;
		meshComponent.materialId = materialId;
		entity.addComponent(meshComponent);
		return entity;
	}

	public static function getMeshRendererComponent(entity:Entity) {
		// entity.getComponent
	}

	public static function renderMeshEntity(entity:Entity, camera:Entity) {}
}
