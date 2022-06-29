package webgl;

import webgl.meshs.F3dMesh;
import haxe.ui.geom.Rectangle;
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
	public final shaders:Map<String, WebglShader> = [];
	public final meshs:Map<String, WebglMesh> = [];
	public final materials:Map<String, WebglMaterial> = [];
	public final geometrys:Map<String, WebglGeometry> = [];
	public final meshMaterialMap:Map<WebglGeometry, WebglMaterial> = [];

	private function new() {}

	public function init(canvasName) {
		final dom_gl = Browser.document.getElementById(canvasName);
		gl = CanvasHelpers.getWebGL2(cast(dom_gl, CanvasElement));

		// shaders.push(new Basic2dShader());
		meshs.set('F3dMesh', new F3dMesh());
		shaders.set('Basic3dShader', new Basic3dShader());
	}

	public function addMesh(name:String, mesh:WebglMesh) {
		if (meshs.exists(name))
			return;
		meshs.set(name, mesh);
	}

	public function createMaterial(name:String, shaderName:String):Null<WebglMaterial> {
		if (materials.exists(name))
			return materials.get(name);

		final shader = shaders.get(shaderName);
		if (shader == null)
			return null;

		final mat = new WebglMaterial(shaderName);
		materials.set(name, mat);

		shader.instances.push(name);

		return mat;
	}

	public function createGeometry(name:String, meshId:String, materialName:String):Null<WebglGeometry> {
		if (geometrys.exists(name))
			return geometrys.get(name);

		final mesh = meshs.get(meshId);
		if (mesh == null)
			return null;

		final material = materials.get(materialName);
		if (material == null)
			return null;

		final geometry = new WebglGeometry(meshId);
		geometry.materialId = materialName;

		geometrys.set(name, geometry);

		material.geometrys.push(name);

		return geometry;
	}

	public function render() {
		if (gl == null)
			return;

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.clearColor(0.7, 0.7, 0.7, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		for (shaderId => shader in shaders) {
			if (shader == null)
				continue;
			if (shader.program == null)
				continue;
			trace('使用shader: ${shaderId}');

			final program = shader.program;
			gl.useProgram(program);

			for (materialId in shader.instances) {
				// 塞不同的uniform參數給同一個shader
				final material = materials.get(materialId);
				if (material == null)
					continue;

				trace('使用材質:${materialId}');

				for (geometryId in material.geometrys) {
					final geometry = geometrys.get(geometryId);
					if (geometry == null)
						continue;
					if (geometry.meshId == null)
						continue;

					final mesh = meshs.get(geometry.meshId);
					if (mesh == null)
						continue;
					if (mesh.vao == null)
						continue;

					trace('綁定vao:${geometry.meshId}');
					gl.bindVertexArray(mesh.vao);

					for (attri in shader.getUniformMap().keys()) {
						final pointer = shader.getUniformMap()[attri];
						final type = shader.getUniformType(attri);
						final params = geometry.uniform.get(attri);
						if (pointer == null)
							continue;
						if (type == null)
							continue;
						if (params == null)
							continue;

						trace('設定geometry uniform');

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
					trace('繪製');
					gl.drawArrays(gl.TRIANGLES, 0, mesh.getCount());
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
