package webgl;

import js.lib.Float32Array;
import js.Syntax;

@:nullSafety
class WebglMesh {
	final bufferMap:Map<String, Dynamic> = [];
	final bufferDataMap:Map<String, Dynamic> = [];

	public final vao:Null<Dynamic>;

	// 把matrix拿來drawInstance的參考
	// final matrixBuffer:Null<Dynamic>;
	// final matrixData:Null<Dynamic>;
	// final instanceMatrix:Array<Float32Array> = [];

	public function new(numInstances = 0) {
		final gl = WebglEngine.inst.gl;
		if (gl != null) {
			// 把matrix拿來drawInstance的參考
			// 這裏是用matrix的方法來drawInstance。因爲這個方法比較不好記憶，所以下面改用4個vec4來做，這樣如果也想要別的參數也實例化，就可以直接參考
			// 如果想寫成矩陣形式可以參考:https://webgl2fundamentals.org/webgl/lessons/zh_cn/webgl-instanced-drawing.html
			// matrixData = new Float32Array(numInstances * 16);
			// for (i in 0...numInstances) {
			// 	final byteOffsetToMatrix = i * 16 * 4;
			// 	final numFloatsForView = 16;
			// 	instanceMatrix.push(new Float32Array(matrixData.buffer, byteOffsetToMatrix, numFloatsForView));
			// }
			// matrixBuffer = gl.createBuffer();
			// gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
			// gl.bufferData(gl.ARRAY_BUFFER, matrixData, gl.DYNAMIC_DRAW);

			var locationPointer = 0;

			vao = gl.createVertexArray();
			gl.bindVertexArray(vao);

			// 綁定頂點坐標
			final vertexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

			// 因爲資料不需要變更，所以參數給gl.STATIC_DRAW
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getPosition()), gl.STATIC_DRAW);

			// 指定參數位置為0（vertex shader中的第一個in的參數的位置）
			gl.enableVertexAttribArray(locationPointer);

			// 定義參數使用方法，這裏告知gl說，buffer中每三個值為一組來使用
			gl.vertexAttribPointer(locationPointer, 3, gl.FLOAT, false, 0, 0);

			locationPointer++;

			// 綁定紋理坐標
			final texcoordBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getTexcoord()), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(locationPointer);

			// 定義參數使用方法，這裏告知gl說，buffer中每兩個值為一組來使用
			gl.vertexAttribPointer(locationPointer, 2, gl.FLOAT, false, 0, 0);

			locationPointer++;

			// 綁定頂點顔色
			final colorBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getColor()), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(locationPointer);
			gl.vertexAttribPointer(locationPointer, 4, gl.FLOAT, false, 0, 0);

			locationPointer++;

			if (numInstances > 0) {
				// 綁定矩陣第一行，并且因爲是用drawInstance的方法，所以這裏只是先告知gl需要的buffer大小，并沒有實際的值
				final m1 = gl.createBuffer();

				// 定義bufferData的大小(每一個float有 4 bytes)
				final m1data = new Float32Array(numInstances * 4);
				gl.bindBuffer(gl.ARRAY_BUFFER, m1);

				// 只放入空bufferData（這樣gl才知道要借多少空間出來）
				gl.bufferData(gl.ARRAY_BUFFER, m1data, gl.DYNAMIC_DRAW);
				gl.enableVertexAttribArray(locationPointer);

				// 定義參數使用方法，這裏告知gl說，buffer中每四個值為一組來使用
				gl.vertexAttribPointer(locationPointer, 4, gl.FLOAT, false, 0, 0);

				// 定義drawInstance每畫一個物件的時候，這裏的值要換到下一組
				gl.vertexAttribDivisor(locationPointer, 1);
				bufferMap.set('m1', m1);
				bufferDataMap.set('m1data', m1data);

				locationPointer++;

				final m2 = gl.createBuffer();
				final m2data = new Float32Array(numInstances * 4);
				gl.bindBuffer(gl.ARRAY_BUFFER, m2);
				gl.bufferData(gl.ARRAY_BUFFER, m2data, gl.DYNAMIC_DRAW);
				gl.enableVertexAttribArray(locationPointer);
				gl.vertexAttribPointer(locationPointer, 4, gl.FLOAT, false, 0, 0);
				gl.vertexAttribDivisor(locationPointer, 1);
				bufferMap.set('m2', m2);
				bufferDataMap.set('m2data', m2data);

				locationPointer++;

				final m3 = gl.createBuffer();
				final m3data = new Float32Array(numInstances * 4);
				gl.bindBuffer(gl.ARRAY_BUFFER, m3);
				gl.bufferData(gl.ARRAY_BUFFER, m3data, gl.DYNAMIC_DRAW);
				gl.enableVertexAttribArray(locationPointer);
				gl.vertexAttribPointer(locationPointer, 4, gl.FLOAT, false, 0, 0);
				gl.vertexAttribDivisor(locationPointer, 1);
				bufferMap.set('m3', m3);
				bufferDataMap.set('m3data', m3data);

				locationPointer++;

				final m4 = gl.createBuffer();
				final m4data = new Float32Array(numInstances * 4);
				gl.bindBuffer(gl.ARRAY_BUFFER, m4);
				gl.bufferData(gl.ARRAY_BUFFER, m4data, gl.DYNAMIC_DRAW);
				gl.enableVertexAttribArray(locationPointer);
				gl.vertexAttribPointer(locationPointer, 4, gl.FLOAT, false, 0, 0);
				gl.vertexAttribDivisor(locationPointer, 1);
				bufferMap.set('m4', m4);
				bufferDataMap.set('m4data', m4data);

				locationPointer++;

				final color2 = gl.createBuffer();
				final color2Data = new Float32Array(numInstances * 4);
				gl.bindBuffer(gl.ARRAY_BUFFER, color2);
				gl.bufferData(gl.ARRAY_BUFFER, color2Data, gl.DYNAMIC_DRAW);
				gl.enableVertexAttribArray(locationPointer);
				gl.vertexAttribPointer(locationPointer, 4, gl.FLOAT, false, 0, 0);
				gl.vertexAttribDivisor(locationPointer, 1);
				bufferMap.set('color2', color2);
				bufferDataMap.set('color2Data', color2Data);
			}
		}
	}

	public function setInstanceBufferData(index:Int, uniforms:Dynamic) {
		final modelMatrix = uniforms.get('u_modelMatrix');
		final color2 = uniforms.get('u_color');

		for (i in 0...4) {
			final m1data = bufferDataMap.get('m1data');
			if (m1data != null)
				m1data[index * 4 + i] = modelMatrix[i];

			final m2data = bufferDataMap.get('m2data');
			if (m2data != null)
				m2data[index * 4 + i] = modelMatrix[i + 4];

			final m3data = bufferDataMap.get('m3data');
			if (m3data != null)
				m3data[index * 4 + i] = modelMatrix[i + 8];

			final m4data = bufferDataMap.get('m4data');
			if (m4data != null)
				m4data[index * 4 + i] = modelMatrix[i + 12];

			final color2Data = bufferDataMap.get('color2Data');
			if (color2Data != null)
				color2Data[index * 4 + i] = color2[i];
		}
	}

	public function bindInstanceBufferData() {
		final gl = WebglEngine.inst.gl;
		if (gl != null) {
			// 把matrix拿來drawInstance的參考
			// if (matrixBuffer == null)
			// 	return;
			// if (matrixData == null)
			// 	return;
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

			final color2Data = bufferDataMap.get('color2Data');
			if (color2Data == null)
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

			final color2 = bufferMap.get('color2');
			if (color2 == null)
				return;

			gl.bindBuffer(gl.ARRAY_BUFFER, m1);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, m1data);

			gl.bindBuffer(gl.ARRAY_BUFFER, m2);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, m2data);

			gl.bindBuffer(gl.ARRAY_BUFFER, m3);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, m3data);

			gl.bindBuffer(gl.ARRAY_BUFFER, m4);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, m4data);

			gl.bindBuffer(gl.ARRAY_BUFFER, color2);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, color2Data);
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

	function getColor():Array<Float> {
		final c = [];
		for (i in 0...getCount()) {
			c.push(Math.random());
			c.push(Math.random());
			c.push(Math.random());
			c.push(1.0);
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
