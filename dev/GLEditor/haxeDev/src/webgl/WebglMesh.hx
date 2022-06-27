package webgl;

import js.Syntax;

class WebglMesh {
	final bufferMap:Map<String, Dynamic> = [];

	public final uniformMap:Map<String, Dynamic> = [];

	public final vao = null;

	var _shader = null;

	public var shader(get, set):WebglShader;

	function set_shader(shader:WebglShader) {
		final gl = WebglEngine.inst.gl;
		gl.bindVertexArray(vao);

		for (attribute in shader.getAttributeMap().keys()) {
			final location = shader.getAttributeMap()[attribute];
			final type = shader.getAttributeType(attribute);
			final buffer = bufferMap[attribute];
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.enableVertexAttribArray(location);
			switch (type) {
				case 'vec2':
					gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
				case 'vec3':
					gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
			}
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

	public final function getCount():Int {
		return Math.floor(getPosition().length / (is2d() ? 2 : 3));
	}

	function is2d() {
		return true;
	}

	function getPosition() {
		return [0, 0, 0, 50, 70, 0];
	}

	function getColor() {
		final c = [];
		for (i in 0...getCount()) {
			c.push(0);
			c.push(0);
			c.push(0);
		}
		return c;
	}
}
