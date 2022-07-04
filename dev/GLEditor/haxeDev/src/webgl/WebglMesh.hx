package webgl;

import js.lib.Float32Array;
import js.Syntax;

@:nullSafety
class WebglMesh {
	final bufferMap:Map<String, Dynamic> = [];
	final bufferDataMap:Map<String, Dynamic> = [];

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

			final colorBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, Syntax.code('new Float32Array')(getColor()), gl.STATIC_DRAW);

			final texcoordBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, Syntax.code('new Float32Array')(getTexcoord()), gl.STATIC_DRAW);

			final numInstances = 20000;
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

			final m1 = gl.createBuffer();
			final m1data = new Float32Array(numInstances * 4);
			gl.bindBuffer(gl.ARRAY_BUFFER, m1);
			gl.bufferData(gl.ARRAY_BUFFER, m1data, gl.DYNAMIC_DRAW);
			gl.enableVertexAttribArray(2);
			gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 0, 0);
			gl.vertexAttribDivisor(2, 1);
			bufferMap.set('m1', m1);
			bufferDataMap.set('m1data', m1data);

			final m2 = gl.createBuffer();
			final m2data = new Float32Array(numInstances * 4);
			gl.bindBuffer(gl.ARRAY_BUFFER, m2);
			gl.bufferData(gl.ARRAY_BUFFER, m2data, gl.DYNAMIC_DRAW);
			gl.enableVertexAttribArray(3);
			gl.vertexAttribPointer(3, 4, gl.FLOAT, false, 0, 0);
			gl.vertexAttribDivisor(3, 1);
			bufferMap.set('m2', m2);
			bufferDataMap.set('m2data', m2data);

			final m3 = gl.createBuffer();
			final m3data = new Float32Array(numInstances * 4);
			gl.bindBuffer(gl.ARRAY_BUFFER, m3);
			gl.bufferData(gl.ARRAY_BUFFER, m3data, gl.DYNAMIC_DRAW);
			gl.enableVertexAttribArray(4);
			gl.vertexAttribPointer(4, 4, gl.FLOAT, false, 0, 0);
			gl.vertexAttribDivisor(4, 1);
			bufferMap.set('m3', m3);
			bufferDataMap.set('m3data', m3data);

			final m4 = gl.createBuffer();
			final m4data = new Float32Array(numInstances * 4);
			gl.bindBuffer(gl.ARRAY_BUFFER, m4);
			gl.bufferData(gl.ARRAY_BUFFER, m4data, gl.DYNAMIC_DRAW);
			gl.enableVertexAttribArray(5);
			gl.vertexAttribPointer(5, 4, gl.FLOAT, false, 0, 0);
			gl.vertexAttribDivisor(5, 1);
			bufferMap.set('m4', m4);
			bufferDataMap.set('m4data', m4data);
		}
	}

	public function setInstanceMatrixBuffer(index, mvpAry) {
		// for (i in 0...16) {
		// 	instanceMatrix[index][i] = mvpAry[i];
		// }
		for (i in 0...4) {
			final m1data = bufferDataMap.get('m1data');
			if (m1data != null)
				m1data[index * 4 + i] = mvpAry[i];

			final m2data = bufferDataMap.get('m2data');
			if (m2data != null)
				m2data[index * 4 + i] = mvpAry[i + 4];

			final m3data = bufferDataMap.get('m3data');
			if (m3data != null)
				m3data[index * 4 + i] = mvpAry[i + 8];

			final m4data = bufferDataMap.get('m4data');
			if (m4data != null)
				m4data[index * 4 + i] = mvpAry[i + 12];
		}
	}

	public function setInstanceBuffer() {
		final gl = WebglEngine.inst.gl;
		if (gl != null) {
			if (matrixBuffer == null)
				return;
			if (matrixData == null)
				return;

			// gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
			// gl.bufferSubData(gl.ARRAY_BUFFER, 0, matrixData);

			final m1data = bufferDataMap.get('m1data');
			if (m1data == null)
				return;

			final m2data = bufferDataMap.get('m2data');
			if (m2data == null)
				return;

			final m3data = bufferDataMap.get('m3data');
			if (m3data == null)
				return;

			final m4data = bufferDataMap.get('m4data');
			if (m4data == null)
				return;

			final m1 = bufferMap.get('m1');
			if (m1 == null)
				return;

			final m2 = bufferMap.get('m2');
			if (m2 == null)
				return;

			final m3 = bufferMap.get('m3');
			if (m3 == null)
				return;

			final m4 = bufferMap.get('m4');
			if (m4 == null)
				return;


			gl.bindBuffer(gl.ARRAY_BUFFER, m1);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, m1data);
			// gl.bufferData(gl.ARRAY_BUFFER, m4data, gl.DYNAMIC_DRAW);

			gl.bindBuffer(gl.ARRAY_BUFFER, m2);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, m2data);
			// gl.bufferData(gl.ARRAY_BUFFER, m4data, gl.DYNAMIC_DRAW);

			gl.bindBuffer(gl.ARRAY_BUFFER, m3);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, m3data);
			// gl.bufferData(gl.ARRAY_BUFFER, m4data, gl.DYNAMIC_DRAW);

			gl.bindBuffer(gl.ARRAY_BUFFER, m4);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, m4data);
			// gl.bufferData(gl.ARRAY_BUFFER, m4data, gl.DYNAMIC_DRAW);
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
