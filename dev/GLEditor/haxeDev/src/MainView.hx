package;

import js.html.Image;
import js.lib.Uint8Array;
import webgl.WebglMaterial;
import webgl.WebglGeometry;
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
			final t = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, t);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 255, 0, 255]));
			WebglEngine.inst.addTexture('green', t);

			final t2 = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, t2);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 0, 255]));
			WebglEngine.inst.addTexture('red', t2);

			final t3 = WebglEngine.inst.createTexture();
			if (t3 != null)
				WebglEngine.inst.addTexture('red8', t3);

			// final image = new Image();
			// image.src = 'images/flow.jpg';
			// image.addEventListener('load', () -> {
			// 	gl.bindTexture(gl.TEXTURE_2D, t);
			// 	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
			// 	gl.generateMipmap(gl.TEXTURE_2D);
			// });

			final mat1 = WebglEngine.inst.createMaterial('mat_1', 'Basic3dShader');
			final mat2 = WebglEngine.inst.createMaterial('mat_2', 'Basic3dShader');

			if (mat1 != null)
				mat1.textures.push('green');
			if (mat2 != null)
				mat2.textures.push('red8');

			for (i in 0...4) {
				final geo = WebglEngine.inst.createGeometry('geo_${i}', 'F3dMesh', i % 2 == 0 ? 'mat_1' : 'mat_2');
				if (geo == null)
					continue;

				// 3d version
				final pm = Mat4Tools.ortho(0, gl.canvas.width, gl.canvas.height, 0, 400, -400);

				final aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
				final pm2 = Mat4Tools.perspective(60 / 180 * Math.PI, aspect, 1, 2000);

				final tm = Mat4.fromTranslation(Vec3.fromArray([Math.random() * 300, Math.random() * 300, -500]));
				final rm = Mat4.fromYRotation(Math.random() * 3.14);
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

				geo.uniform.set('u_color', [Math.random(), Math.random(), Math.random(), 1.0]);
				geo.uniform.set('u_matrix', mat.toArray());
			}
			WebglEngine.inst.render();
		}
	}
}
