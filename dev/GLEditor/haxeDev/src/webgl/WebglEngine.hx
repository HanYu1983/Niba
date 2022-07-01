package webgl;

import hex.log.LogManager;
import webgl.shaders.Basic3dInstanceShader;
import hex.log.HexLog.*;
import libnoise.generator.Perlin;
import js.lib.Uint8Array;
import js.webgl2.Texture;
import webgl.meshs.F3dMesh;
import webgl.meshs.Cube3dMesh;
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

enum DEFAULT_MESH {
	F3D;
	CUBE3D;
}

@:nullSafety
class WebglEngine {
	public static final inst = new WebglEngine();

	public var gl:Null<RenderingContext2> = null;

	public final shaders:Map<String, WebglShader> = [];
	public final meshs:Map<DEFAULT_MESH, WebglMesh> = [];
	public final materials:Map<String, WebglMaterial> = [];
	public final geometrys:Map<String, WebglGeometry> = [];
	public final textures:Map<String, Texture> = [];

	private function new() {}

	public function init(canvasName) {
		final dom_gl = Browser.document.getElementById(canvasName);
		gl = CanvasHelpers.getWebGL2(cast(dom_gl, CanvasElement));

		// shaders.push(new Basic2dShader());
		meshs.set(DEFAULT_MESH.F3D, new F3dMesh());
		meshs.set(DEFAULT_MESH.CUBE3D, new Cube3dMesh());
		shaders.set('Basic3dShader', new Basic3dShader());
		shaders.set('Basic3dInstanceShader', new Basic3dInstanceShader());

		final noiseTexture = createTexture();
		if (noiseTexture != null)
			addTexture('noise', noiseTexture);

		final noiseMaterial = WebglEngine.inst.createMaterial('noiseMaterial', 'Basic3dShader');
		if (noiseMaterial != null) {
			noiseMaterial.textures.push('noise');
		}

		final instanceMaterial = WebglEngine.inst.createMaterial('instanceMaterial', 'Basic3dInstanceShader');
	}

	public function addMesh(name:DEFAULT_MESH, mesh:WebglMesh) {
		if (meshs.exists(name))
			return;
		meshs.set(name, mesh);
	}

	public function createTexture():Null<Texture> {
		if (gl == null)
			return null;
		final texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		// final level = 0;
		// final internalFormat = gl.R8;
		// final width = 3;
		// final height = 2;
		// final border = 0;
		// final format = gl.RED;
		// final type = gl.UNSIGNED_BYTE;
		// final data = new Uint8Array([128, 64, 128, 0, 192, 0]);

		final level = 0;
		final internalFormat = gl.RGB;
		final width = 64;
		final height = 64;
		final border = 0;
		final format = gl.RGB;
		final type = gl.UNSIGNED_BYTE;

		final p = new Perlin(1, 1, 1, 1, 0, libnoise.QualityMode.MEDIUM);

		var dataAry = [];
		for (x in 0...width) {
			for (y in 0...height) {
				var v = p.getValue(x / width, y / height, 0);
				v = Math.floor((v + 1) * .5 * 255);
				dataAry.push(v);
				dataAry.push(v);
				dataAry.push(v);
			}
		}

		final data = new Uint8Array(dataAry);

		gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, format, type, data);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		return texture;
	}

	public function addTexture(name:String, texture:Texture) {
		if (textures.exists(name))
			return;

		textures.set(name, texture);
	}

	// public function getTexture(name:String):Null<Texture> {
	// 	return textures.get(name);
	// }
	// public function getMaterial(name:) {
	// }

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

	// public function addTextureToMaterial(textureId:String, materialId:String) {
	// 	final m = materials.get(materialId);
	// 	if (m == null)
	// 		return;
	// 	m.textures.push(textureId);
	// }

	public function createGeometry(name:String, meshId:DEFAULT_MESH, materialName:String):Null<WebglGeometry> {
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

	public function changeMaterial(geometryId:String, materialId:String) {
		LogManager.getLogger('hex').debug('修改材質:${geometryId} ${materialId}');

		final geometry = geometrys.get(geometryId);
		if (geometry == null)
			return;

		if (geometry.materialId == materialId)
			return;

		final material = materials.get(materialId);
		if (material == null)
			return;

		material.geometrys.push(geometryId);

		final oldMaterialId = geometry.materialId;
		geometry.materialId = materialId;

		LogManager.getLogger('hex').debug('目前材質${materialId}繪製物件數目:${material.geometrys.length}');

		if (oldMaterialId == null)
			return;

		final material = materials.get(oldMaterialId);
		if (material == null)
			return;

		material.geometrys.remove(geometryId);
	}

	public function render() {
		if (gl == null)
			return;

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.clearColor(0.7, 0.7, 0.7, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);

		var lastVao:Null<Dynamic> = null;
		for (shaderId => shader in shaders) {
			if (shader == null)
				continue;
			if (shader.program == null)
				continue;
			LogManager.getLogger("hex").debug('使用shader:${shaderId}');

			final program = shader.program;
			gl.useProgram(program);

			for (materialId in shader.instances) {
				final material = materials.get(materialId);
				if (material == null)
					continue;

				for (index => textureId in material.textures) {
					final t = textures.get(textureId);
					if (t == null)
						continue;

					final param = Reflect.field(gl, 'TEXTURE${index}');
					gl.activeTexture(param);
					gl.bindTexture(gl.TEXTURE_2D, t);
					LogManager.getLogger("hex").debug('使用紋理通道:${index}');
				}
				LogManager.getLogger("hex").debug('使用材質:${materialId}');

				if (shader.isInstance()) {
					LogManager.getLogger("hex").debug('實例化材質流程:${materialId}');
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

						if (lastVao == null || lastVao != mesh.vao) {
							gl.bindVertexArray(mesh.vao);
							debug('綁定vao:${geometry.meshId}');
						}
						lastVao = mesh.vao;

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

							LogManager.getLogger("hex").debug('設定uniform:${attri}');

							switch (type) {
								case 'sampler2D':
									gl.uniform1i(pointer, params);
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
					}

					final geometry = geometrys.get(material.geometrys[0]);
					if (geometry == null)
						continue;
					if (geometry.meshId == null)
						return;

					final mesh2 = meshs.get(geometry.meshId);
					if (mesh2 == null)
						continue;

					gl.drawArraysInstanced(gl.TRIANGLES, 0, mesh2.getCount(), material.geometrys.length);
				} else {
					LogManager.getLogger("hex").debug('普通流程:${materialId}');
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

						if (lastVao == null || lastVao != mesh.vao) {
							gl.bindVertexArray(mesh.vao);
							debug('綁定vao:${geometry.meshId}');
						}
						lastVao = mesh.vao;

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

							LogManager.getLogger("hex").debug('設定uniform:${attri}');

							switch (type) {
								case 'sampler2D':
									gl.uniform1i(pointer, params);
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
		debug(gl.getShaderInfoLog(shader));
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
		debug(gl.getProgramInfoLog(p));
		gl.deleteProgram(p);
		return null;
	}
}
