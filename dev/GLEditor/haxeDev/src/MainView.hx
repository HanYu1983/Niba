package;

import webgl.meshs.F2dMesh;
import mme.math.glmatrix.Vec2;
import mme.math.glmatrix.Mat3;
import mme.math.glmatrix.Mat3Tools;
import mme.math.glmatrix.Mat4;
import webgl.WebglMesh;
import webgl.WebglEngine;
import haxe.ui.containers.VBox;

@:build(haxe.ui.ComponentBuilder.build("assets/main-view.xml"))
class MainView extends VBox {
	public function new() {
		super();

		WebglEngine.inst.init('canvas_gl');

		final gl = WebglEngine.inst.gl;

		for (i in 0...10) {
			final mesh = new F2dMesh();
			mesh.shader = WebglEngine.inst.shaders[0];

			final pm = Mat3Tools.projection(gl.canvas.width, gl.canvas.height);
			final tm = Mat3.fromTranslation(Vec2.fromArray([500, 500]));
			final rm = Mat3.fromRotation(Math.random() * 6.28);
			final sm = Mat3.fromScaling(Vec2.fromArray([1.0, 1.0]));
			final om = Mat3.fromTranslation(Vec2.fromArray([-50, -75]));
			var mat = Mat3Tools.multiply(pm, tm);
			mat = Mat3Tools.multiply(mat, rm);
			mat = Mat3Tools.multiply(mat, sm);
			mat = Mat3Tools.multiply(mat, om);

			mesh.uniformMap.set('u_resolution', [WebglEngine.inst.gl.canvas.width, WebglEngine.inst.gl.canvas.height]);
			mesh.uniformMap.set('u_color', [Math.random(), Math.random(), Math.random(), 1.0]);
			mesh.uniformMap.set('u_matrix', mat.toArray());
			WebglEngine.inst.addMesh(mesh);
		}
		WebglEngine.inst.render();
	}
}
