package webgl;

import js.Syntax;

@:nullSafety
class WebglMesh {
	final bufferMap:Map<String, Dynamic> = [];

	public final vao:Null<Dynamic>;

	var _shader:Null<WebglShader> = null;

	public var shader(get, set):Null<WebglShader>;

	function set_shader(shader:Null<WebglShader>) {
		final gl = WebglEngine.inst.gl;
		if (gl == null)
			return shader;
		if (vao == null)
			return shader;
		if (shader == null)
			return shader;
		gl.bindVertexArray(vao);

		for (attribute in shader.getAttributeMap().keys()) {
			final location = shader.getAttributeMap()[attribute];
			final type = shader.getAttributeType(attribute);
			final buffer = bufferMap[attribute];
			if (location == null)
				continue;
			if (type == null)
				continue;
			if (buffer == null)
				continue;
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.enableVertexAttribArray(location);
			switch (type) {
				case 'vec2':
					gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
				case 'vec3' | 'vec4':
					gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
			}
		}
		_shader = shader;
		return shader;
	}

	function get_shader():Null<WebglShader> {
		return _shader;
	}

	public function new() {
		final gl = WebglEngine.inst.gl;
		if (gl != null) {
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
	}

	public final function getCount():Int {
		return Math.floor(getPosition().length / (is2d() ? 2 : 3));
	}

	function is2d() {
		return true;
	}

	function getPosition() {
		return [0, 0, 0, 100, 100, 0];
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
