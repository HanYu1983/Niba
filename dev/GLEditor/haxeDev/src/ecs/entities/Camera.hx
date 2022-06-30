package ecs.entities;

import webgl.WebglEngine;
import mme.math.glmatrix.Mat4Tools;
import mme.math.glmatrix.Mat4;

class Camera extends Entity {
	public function getProjectMatrix() {
		final gl = WebglEngine.inst.gl;
		if (gl == null)
			return Mat4Tools.identity();

		final aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		final projectMat = Mat4Tools.perspective(60 / 180 * Math.PI, aspect, 1, 2000);

		return projectMat;
	}
}
