package ecs.components;

import mme.math.glmatrix.Mat4Tools;
import mme.math.glmatrix.Mat4;
import mme.math.glmatrix.Vec3Tools;
import mme.math.glmatrix.Vec3;

using Lambda;

@:nullSafety
class Transform extends Component {
	public final position = new Vec3();
	public final rotation = new Vec3();
	public final scale = Vec3.fromArray([1, 1, 1]);

	var parent:Null<Transform> = null;
	final childs:Array<Transform> = [];

	public function getMatrix():Mat4 {
		final tm = Mat4.fromTranslation(position);

		var rm = Mat4Tools.identity();
		rm = Mat4Tools.rotateX(rm, rotation.x);
		rm = Mat4Tools.rotateY(rm, rotation.y);
		rm = Mat4Tools.rotateZ(rm, rotation.z);

		final sm = Mat4.fromScaling(scale);

		var mat = Mat4Tools.identity();
		mat = Mat4Tools.multiply(mat, tm);
		mat = Mat4Tools.multiply(mat, rm);
		mat = Mat4Tools.multiply(mat, sm);

		return mat;
	}

	public function getGlobalMatrix() {
		if (parent != null) {
			var globalMat = parent.getGlobalMatrix();
			return Mat4Tools.multiply(globalMat, getMatrix());
		}
		return getMatrix();
	}

	public function addChild(child:Transform) {
		if (childs.has(child))
			return;
		child.parent = this;
		childs.push(child);
	}

	public function removeChild(child:Transform) {
		if (!childs.has(child))
			return;
		child.parent = null;
		childs.remove(child);
	}

	override function update(deltaTime:Float) {
		super.update(deltaTime);

		for (child in childs) {
			child.update(deltaTime);
		}
	}
}
