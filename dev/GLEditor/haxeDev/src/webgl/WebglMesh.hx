package webgl;

import js.Syntax;

class WebglMesh {
	final bufferMap:Map<String, Dynamic> = [];

	public final vao = null;

	var _shader = null;

	public var shader(get, set):WebglShader;

	function set_shader(shader:WebglShader) {
		final gl = WebglEngine.inst.gl;
		gl.bindVertexArray(vao);

		for (attribute in shader.getLocationMap().keys()) {
			final location = shader.getLocationMap()[attribute];
			final buffer = bufferMap[attribute];
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.enableVertexAttribArray(location);
			gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
		}
		_shader = shader;
		return shader;
	}

	function get_shader() {
		return _shader;
	}

	public function new() {
		final gl = WebglEngine.inst.gl;

		final vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, Syntax.code('new Float32Array')(getPosition()), gl.STATIC_DRAW);
		bufferMap.set('position', vertexBuffer);

		final colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, Syntax.code('new Float32Array')(getColor()), gl.STATIC_DRAW);
		bufferMap.set('color', colorBuffer);

		vao = gl.createVertexArray();
	}

	function getPosition() {
		return [0, 0, 0, 0, 0.5, 0, 0.7, 0, 0];
	}

	function getColor() {
		return [1.0, 0, 0, 0, 1.0, 0, 0, 0, 1.0];
	}
}
