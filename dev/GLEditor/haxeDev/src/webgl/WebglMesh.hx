package webgl;

import js.lib.Float32Array;
import js.Syntax;

@:nullSafety
class WebglMesh {
	final bufferMap:Map<String, Dynamic> = [];

	public final vao:Null<Dynamic>;

	// var _shader:Null<WebglShader> = null;
	// public var shader(get, set):Null<WebglShader>;
	// function set_shader(shader:Null<WebglShader>) {
	// 	final gl = WebglEngine.inst.gl;
	// 	if (gl == null)
	// 		return shader;
	// 	if (vao == null)
	// 		return shader;
	// 	if (shader == null)
	// 		return shader;
	// 	gl.bindVertexArray(vao);
	// 	for (attribute in shader.getAttributeMap().keys()) {
	// 		final location = shader.getAttributeMap()[attribute];
	// 		final type = shader.getAttributeType(attribute);
	// 		final buffer = bufferMap[attribute];
	// 		if (location == null)
	// 			continue;
	// 		if (type == null)
	// 			continue;
	// 		if (buffer == null)
	// 			continue;
	// 		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	// 		gl.enableVertexAttribArray(location);
	// 		switch (type) {
	// 			case 'vec2':
	// 				gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
	// 			case 'vec3' | 'vec4':
	// 				gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
	// 		}
	// 	}
	// 	_shader = shader;
	// 	return shader;
	// }
	// function get_shader():Null<WebglShader> {
	// 	return _shader;
	// }
	final matrixBuffer:Null<Dynamic>;
	final matrixData:Null<Dynamic>;
	final instanceMatrix:Array<Float32Array> = [];

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

			final texcoordBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, Syntax.code('new Float32Array')(getTexcoord()), gl.STATIC_DRAW);
			bufferMap.set('texcoord', texcoordBuffer);

			final numInstances = 10000;
			matrixData = new Float32Array(numInstances * 16);
			// final matrices = [];
			for (i in 0...numInstances) {
				final byteOffsetToMatrix = i * 16 * 4;
				final numFloatsForView = 16;
				instanceMatrix.push(new Float32Array(matrixData.buffer, byteOffsetToMatrix, numFloatsForView));
			}

			matrixBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, matrixData, gl.DYNAMIC_DRAW);
			// gl.bufferData(gl.ARRAY_BUFFER, matrixData.byteLength, gl.DYNAMIC_DRAW);
			// Syntax.code('gl.bufferData')(gl.ARRAY_BUFFER, matrixData.byteLength, gl.DYNAMIC_DRAW);

			vao = gl.createVertexArray();
			gl.bindVertexArray(vao);

			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
			gl.enableVertexAttribArray(0);
			gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
			gl.enableVertexAttribArray(1);
			gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
			gl.enableVertexAttribArray(2);
			gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 4 * 16, 0);
			gl.vertexAttribDivisor(2, 1);

			gl.enableVertexAttribArray(3);
			gl.vertexAttribPointer(3, 4, gl.FLOAT, false, 4 * 16, 16);
			gl.vertexAttribDivisor(3, 1);

			gl.enableVertexAttribArray(4);
			gl.vertexAttribPointer(4, 4, gl.FLOAT, false, 4 * 16, 32);
			gl.vertexAttribDivisor(4, 1);

			gl.enableVertexAttribArray(5);
			gl.vertexAttribPointer(5, 4, gl.FLOAT, false, 4 * 16, 48);
			gl.vertexAttribDivisor(5, 1);
		}
	}

	public function setInstanceMatrixBuffer(index, mvpAry) {
		for (i in 0...16) {
			instanceMatrix[index][i] = mvpAry[i];
		}
	}

	public function setInstanceBuffer() {
		final gl = WebglEngine.inst.gl;
		if (gl != null) {
			if (matrixBuffer == null)
				return;
			if (matrixData == null)
				return;

			gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, matrixData);
		}
	}

	public final function getCount():Int {
		return Math.floor(getPosition().length / (is2d() ? 2 : 3));
	}

	function is2d() {
		return true;
	}

	function getPosition():Array<Float> {
		return [0., 0., 0., 100., 100., 0.];
	}

	function getColor():Array<Int> {
		final c = [];
		for (i in 0...getCount()) {
			c.push(0);
			c.push(0);
			c.push(0);
		}
		return c;
	}

	function getTexcoord():Array<Float> {
		final c = [];
		for (i in 0...getCount()) {
			c.push(0.0);
			c.push(0.0);
		}
		return c;
	}
}
