package ecs.components;

import mme.math.glmatrix.Mat4Tools;
import mme.math.glmatrix.Mat4;
import mme.math.glmatrix.Vec3Tools;
import mme.math.glmatrix.Vec3;

@:nullSafety
class Transform extends Component {
	public final position = new Vec3();
	public final rotation = new Vec3();
	public final scale = Vec3.fromArray([1, 1, 1]);

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
}
