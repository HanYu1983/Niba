package webgl;

import js.html.SharedWorker;
import js.html.CanvasElement;
import js.webgl2.CanvasHelpers;
import js.Browser;
import js.webgl2.Program;
import js.webgl2.Shader;
import js.webgl2.constants.ShaderTypeEnum;
import js.webgl2.RenderingContext2;

class WebglEngine {
	public static final inst = new WebglEngine();

	public var gl:RenderingContext2 = null;
	public final shaders:Array<WebglShader> = [];
	public final meshs:Array<WebglMesh> = [];

	private function new() {}

	public function init(canvasName) {
		final dom_gl = Browser.document.getElementById(canvasName);
		gl = CanvasHelpers.getWebGL2(cast(dom_gl, CanvasElement));

		shaders.push(new WebglShader());
		meshs.push(new WebglMesh());

		meshs[0].shader = shaders[0];
	}

	public function render() {
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.clearColor(0.7, 0.7, 0.7, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		final shaderMap:Map<WebglShader, Array<WebglMesh>> = [];
		for (mesh in meshs) {
			if (mesh.shader != null) {
				if (shaderMap.exists(mesh.shader)) {
					shaderMap.get(mesh.shader).push(mesh);
				} else {
					shaderMap.set(mesh.shader, [mesh]);
				}
			}
		}

		for (shader in shaderMap.keys()) {
			final program = shader.program;
			gl.useProgram(program);

			final meshsToRender = shaderMap[shader];
			for (mesh in meshsToRender) {
				gl.bindVertexArray(mesh.vao);
				gl.drawArrays(gl.TRIANGLES, 0, mesh.getCount());
			}
		}
	}

	public function createShader(gl:RenderingContext2, type:ShaderTypeEnum, source:String):Shader {
		final shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		final success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if (success) {
			return shader;
		}
		gl.getShaderInfoLog(shader);
		gl.deleteShader(shader);
		return null;
	}

	public function createProgram(gl:RenderingContext2, vs:Shader, fs:Shader):Program {
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
