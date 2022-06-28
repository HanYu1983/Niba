package;

import mme.math.glmatrix.Mat4;
import mme.math.glmatrix.Vec3;
import mme.math.glmatrix.Mat4Tools;
import webgl.meshs.F3dMesh;
import webgl.meshs.Rectangle2dMesh;
import mme.math.glmatrix.Vec2;
import mme.math.glmatrix.Mat3;
import mme.math.glmatrix.Mat3Tools;
import webgl.WebglEngine;
import haxe.ui.containers.VBox;

@:nullSafety
@:build(haxe.ui.ComponentBuilder.build("assets/main-view.xml"))
class MainView extends VBox {
	public function new() {
		super();

		WebglEngine.inst.init('canvas_gl');

		final gl = WebglEngine.inst.gl;
		if (gl != null) {
			final mesh = new F3dMesh();
			mesh.shader = WebglEngine.inst.shaders[0];
			WebglEngine.inst.addMesh(mesh);

			for (i in 0...10) {
				
				// 3d version
				final pm = Mat4Tools.ortho(0, gl.canvas.width, gl.canvas.height, 0, 400, -400);

				final aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
				final pm2 = Mat4Tools.perspective(60 / 180 * Math.PI, aspect, 1, 2000);

				final tm = Mat4.fromTranslation(Vec3.fromArray([100, 100, -500]));
				final rm = Mat4.fromZRotation(Math.random() * 3.14);
				final sm = Mat4.fromScaling(Vec3.fromArray([1.0, 1.0, 1.0]));
				final om = Mat4.fromTranslation(Vec3.fromArray([-50, -75, -50]));
				var mat = Mat4Tools.multiply(pm2, tm);
				mat = Mat4Tools.multiply(mat, rm);
				mat = Mat4Tools.multiply(mat, sm);
				mat = Mat4Tools.multiply(mat, om);

				// 2d version
				// final pm = Mat3Tools.projection(gl.canvas.width, gl.canvas.height);
				// final tm = Mat3.fromTranslation(Vec2.fromArray([500, 500]));
				// final rm = Mat3.fromRotation(Math.random() * 6.28);
				// final sm = Mat3.fromScaling(Vec2.fromArray([1.0, 1.0]));
				// final om = Mat3.fromTranslation(Vec2.fromArray([-50, -75]));
				// var mat = Mat3Tools.multiply(pm, tm);
				// mat = Mat3Tools.multiply(mat, rm);
				// mat = Mat3Tools.multiply(mat, sm);
				// mat = Mat3Tools.multiply(mat, om);

				final uniform = [
					'u_color' => [Math.random(), Math.random(), Math.random(), 1.0],
					'u_matrix' => mat.toArray()
				];

				mesh.uniformMap.push(uniform);
			}
			WebglEngine.inst.render();
		}
	}
}
