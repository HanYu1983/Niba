package ecs.components;

import mme.math.glmatrix.Quat2;
import mme.math.glmatrix.Quat;
import mme.math.glmatrix.Vec4Tools;
import mme.math.glmatrix.Quat2Tools;
import mme.math.glmatrix.QuatTools;
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
		var mat = Mat4Tools.identity();
		mat = Mat4Tools.translate(mat, position);
		mat = Mat4Tools.rotateX(mat, rotation.x);
		mat = Mat4Tools.rotateY(mat, rotation.y);
		mat = Mat4Tools.rotateZ(mat, rotation.z);
		mat = Mat4Tools.scale(mat, scale);
		return mat;
	}

	public function lookAt(lookAt:Vec3, up:Vec3) {
		// final pos = Mat4Tools.getTranslation(getGlobalMatrix());
		// final mat = Mat4Tools.lookAt(pos, lookAt, up);
		// final rot = Tool.getEulerFromQuat(Mat4Tools.getRotation(mat));

		// rotation.x = -rot.x;
		// rotation.y = -rot.y;
		// rotation.z = -rot.z;

		// 轉換成local
		final invertMat = Mat4Tools.invert(getGlobalMatrix());
		var localLookAt = Mat4Tools.multiplyVec3(invertMat, lookAt);
		localLookAt = Vec3Tools.normalize(localLookAt);

		final mat = Mat4Tools.lookAt(new Vec3(), localLookAt, up);
		final rot = Tool.getEulerFromQuat(Mat4Tools.getRotation(mat));

		// 因爲用local計算的關係，所以這裏只能用+=
		rotation.x += -rot.x;
		rotation.y += -rot.y;
		rotation.z += -rot.z;
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
