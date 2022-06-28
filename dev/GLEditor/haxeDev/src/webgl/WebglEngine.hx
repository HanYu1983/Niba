package webgl;

import webgl.shaders.Basic3dShader;
import webgl.shaders.Basic2dShader;
import js.html.SharedWorker;
import js.html.CanvasElement;
import js.webgl2.CanvasHelpers;
import js.Browser;
import js.webgl2.Program;
import js.webgl2.Shader;
import js.webgl2.constants.ShaderTypeEnum;
import js.webgl2.RenderingContext2;

using Lambda;

@:nullSafety
class WebglEngine {
	public static final inst = new WebglEngine();

	public var gl:Null<RenderingContext2> = null;
	public final shaders:Array<WebglShader> = [];
	public final meshs:Array<WebglMesh> = [];

	private function new() {}

	public function init(canvasName) {
		final dom_gl = Browser.document.getElementById(canvasName);
		gl = CanvasHelpers.getWebGL2(cast(dom_gl, CanvasElement));

		// shaders.push(new Basic2dShader());
		shaders.push(new Basic3dShader());
	}

	public function addMesh(mesh:WebglMesh) {
		if (!meshs.has(mesh))
			meshs.push(mesh);
	}

	public function render() {
		if (gl == null)
			return;

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.clearColor(0.7, 0.7, 0.7, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		final shaderMap:Map<Null<WebglShader>, Array<WebglMesh>> = [];
		for (mesh in meshs) {
			if (shaderMap.exists(mesh.shader)) {
				final ary = shaderMap.get(mesh.shader);
				if (ary != null)
					ary.push(mesh);
			} else {
				shaderMap.set(mesh.shader, [mesh]);
			}
		}

		for (shader in shaderMap.keys()) {
			if (shader == null)
				continue;
			if (shader.program == null)
				continue;

			final program = shader.program;
			gl.useProgram(program);

			final meshsToRender = shaderMap[shader];
			if (meshsToRender != null) {
				for (mesh in meshsToRender) {
					if (mesh.vao == null)
						continue;

					gl.bindVertexArray(mesh.vao);

					for (uniform in mesh.uniformMap) {
						for (attri in shader.getUniformMap().keys()) {
							final pointer = shader.getUniformMap()[attri];
							final type = shader.getUniformType(attri);
							final params = uniform.get(attri);
							if (pointer == null)
								continue;
							if (type == null)
								continue;
							if (params == null)
								continue;

							switch (type) {
								case 'vec2':
									gl.uniform2fv(pointer, params);
								case 'vec3':
									gl.uniform3fv(pointer, params);
								case 'vec4':
									gl.uniform4fv(pointer, params);
								case 'float':
									gl.uniform1fv(pointer, params);
								case 'mat3':
									gl.uniformMatrix3fv(pointer, false, params);
								case 'mat4':
									gl.uniformMatrix4fv(pointer, false, params);
							}
						}
						gl.drawArrays(gl.TRIANGLES, 0, mesh.getCount());
					}

					// for (attri in shader.getUniformMap().keys()) {
					// 	final pointer = shader.getUniformMap()[attri];
					// 	final type = shader.getUniformType(attri);
					// 	final params = mesh.uniformMap.get(attri);
					// 	if (pointer == null)
					// 		continue;
					// 	if (type == null)
					// 		continue;
					// 	if (params == null)
					// 		continue;

					// 	switch (type) {
					// 		case 'vec2':
					// 			gl.uniform2fv(pointer, params);
					// 		case 'vec3':
					// 			gl.uniform3fv(pointer, params);
					// 		case 'vec4':
					// 			gl.uniform4fv(pointer, params);
					// 		case 'float':
					// 			gl.uniform1fv(pointer, params);
					// 		case 'mat3':
					// 			gl.uniformMatrix3fv(pointer, false, params);
					// 		case 'mat4':
					// 			gl.uniformMatrix4fv(pointer, false, params);
					// 	}
					// }
					// gl.drawArrays(gl.TRIANGLES, 0, mesh.getCount());
				}
			}
		}
	}

	public function createShader(gl:RenderingContext2, type:ShaderTypeEnum, source:String):Null<Shader> {
		final shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		final success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if (success) {
			return shader;
		}
		trace(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}

	public function createProgram(gl:RenderingContext2, vs:Shader, fs:Shader):Null<Program> {
		final p = gl.createProgram();
		gl.attachShader(p, vs);
		gl.attachShader(p, fs);
		gl.linkProgram(p);
		final success = gl.getProgramParameter(p, gl.LINK_STATUS);
		if (success) {
			return p;
		}
		trace(gl.getProgramInfoLog(p));
		gl.deleteProgram(p);
		return null;
	}
}
