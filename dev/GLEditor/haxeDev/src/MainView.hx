package;

import webgl.shaders.smokingDuck.SmokingDuckBufferD;
import webgl.shaders.smokingDuck.SmokingDuckBufferC;
import webgl.shaders.smokingDuck.SmokingDuckBufferB;
import webgl.shaders.smokingDuck.SmokingDuckImage;
import webgl.shaders.navierStokes2d.Combine;
import webgl.shaders.navierStokes2d.VelocityAfterCalculator;
import webgl.shaders.navierStokes2d.VelocityCalculator;
import webgl.shaders.navierStokes2d.PressureCalculator;
import webgl.shaders.navierStokes2d.DivergenceCalculator;
import webgl.shaders.smokingDuck.SmokingDuckBufferA;
import webgl.shaders.BasicEnviromentShader;
import webgl.shaders.BasicCubeMapShader;
import js.html.URL;
import js.Syntax;
import js.webgl2.CanvasHelpers;
import webgl.shaders.ShaderToyStorm;
import mme.math.glmatrix.Vec2Tools;
import js.html.MouseEvent;
import webgl.shaders.ShaderToy;
import webgl.shaders.NoiseShader;
import js.html.KeyboardEvent;
import webgl.shaders.ReactionDiffusionShader;
import mme.math.glmatrix.Vec3Tools;
import js.lib.Float32Array;
import js.html.DirectoryElement;
import js.Browser;
import ecs.entities.Camera;
import ecs.components.MeshRenderer;
import ecs.Entity;
import js.html.Image;
import js.lib.Uint8Array;
import webgl.WebglMaterial;
import webgl.WebglGeometry;
import mme.math.glmatrix.Mat4;
import mme.math.glmatrix.Vec3;
import mme.math.glmatrix.Mat4Tools;
import webgl.meshs.F3dMesh;
import webgl.meshs.Rectangle2dMesh;
import mme.math.glmatrix.Vec2;
import mme.math.glmatrix.Mat3;
import mme.math.glmatrix.Mat3Tools;
import webgl.WebglEngine;
import haxe.ui.containers.VBox;

@:nullSafety
@:build(haxe.ui.ComponentBuilder.build("assets/main-view.xml"))
class MainView extends VBox {
	public function new() {
		super();

		var stats = new Perf();

		// createCubeMap();
		// methodA();
		// methodC();
		// testInstance();
		// testReactionDiffusion();
		// testDoubleBuffer();
		// testRenderTarget();
		// testNoiseShader();

		// https://www.shadertoy.com/view/ldd3WS
		// test2DNavierStokes();

		// https://www.shadertoy.com/view/mtfXD4
		testSmokingDuck();

		// testMultiTexture();
		// testShaderToy();
		// testCubeMap();
		// testEnviromentMap();
	}

	function createCubeMap() {
		function generateFace(ctx, faceColor, textColor, text) {
			final width = ctx.canvas.width;
			final height = ctx.canvas.height;
			ctx.fillStyle = faceColor;
			ctx.fillRect(0, 0, width, height);
			ctx.font = '${width * 0.7}px sans-serif';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = textColor;
			ctx.fillText(text, width / 2, height / 2);
		}

		// gl = CanvasHelpers.getWebGL2(cast(dom_gl, CanvasElement));
		final canvas:Dynamic = Browser.document.createElement("canvas");
		final ctx:Dynamic = canvas.getContext('2d');

		ctx.canvas.width = 128;
		ctx.canvas.height = 128;

		final faceInfos = [
			{faceColor: '#F00', textColor: '#0FF', text: '+X'},
			{faceColor: '#FF0', textColor: '#00F', text: '-X'},
			{faceColor: '#0F0', textColor: '#F0F', text: '+Y'},
			{faceColor: '#0FF', textColor: '#F00', text: '-Y'},
			{faceColor: '#00F', textColor: '#FF0', text: '+Z'},
			{faceColor: '#F0F', textColor: '#0F0', text: '-Z'},
		];
		for (faceInfo in faceInfos) {
			generateFace(ctx, faceInfo.faceColor, faceInfo.textColor, faceInfo.text);

			// show the result
			ctx.canvas.toBlob((blob) -> {
				final img = new Image();
				img.src = URL.createObjectURL(blob);
				Browser.document.body.appendChild(img);
			});
		}
	}

	function testMultiTexture() {
		WebglEngine.inst.init('canvas_gl');
		final gl = WebglEngine.inst.gl;
		if (gl != null) {
			WebglEngine.inst.addShader('DivergenceCalculator', new DivergenceCalculator());
			WebglEngine.inst.addShader('PressureCalculator', new PressureCalculator());
			WebglEngine.inst.addShader('VelocityCalculator', new VelocityCalculator());
			WebglEngine.inst.addShader('VelocityAfterCalculator', new VelocityAfterCalculator());
			WebglEngine.inst.addShader('Combine', new Combine());

			WebglEngine.inst.createRenderTarget('DivergenceCalculator', 256, 256);
			WebglEngine.inst.createRenderTarget('PressureCalculatorA', 256, 256);
			WebglEngine.inst.createRenderTarget('PressureCalculatorB', 256, 256);
			WebglEngine.inst.createRenderTarget('VelocityCalculatorA', 256, 256);
			WebglEngine.inst.createRenderTarget('VelocityCalculatorB', 256, 256);

			// bufferA
			final velocityMaterial = WebglEngine.inst.createMaterial('velocityMaterial', 'VelocityCalculator');
			if (velocityMaterial != null) {
				velocityMaterial.uniform.set('VelocityTexture', 0);
				velocityMaterial.textures.push('VelocityCalculatorB');
			}

			// bufferB
			final divergenceMaterial = WebglEngine.inst.createMaterial('divergenceMaterial', 'DivergenceCalculator');
			if (divergenceMaterial != null) {
				divergenceMaterial.uniform.set('VelocityTexture', 0);
				divergenceMaterial.textures.push('VelocityCalculatorA');
			}

			// bufferC
			final pressureMaterial = WebglEngine.inst.createMaterial('pressureMaterial', 'PressureCalculator');
			if (pressureMaterial != null) {
				pressureMaterial.uniform.set('VelocityTexture', 0);
				pressureMaterial.uniform.set('DivergenceTexture', 1);
				pressureMaterial.uniform.set('PressureTexture', 2);
				pressureMaterial.textures.push('VelocityCalculatorA');
				pressureMaterial.textures.push('DivergenceCalculator');
			}

			// bufferD
			final velocityBMaterial = WebglEngine.inst.createMaterial('velocityBMaterial', 'VelocityAfterCalculator');
			if (velocityBMaterial != null) {
				velocityBMaterial.uniform.set('PressureTexture', 0);
				velocityBMaterial.uniform.set('VelocityTexture', 1);
				velocityBMaterial.textures.push('PressureCalculatorA');
				velocityBMaterial.textures.push('VelocityCalculatorA');
			}

			// combine
			final combineMaterial = WebglEngine.inst.createMaterial('combineMaterial', 'Combine');
			if (combineMaterial != null) {
				combineMaterial.uniform.set('u_velocity', 0);
				combineMaterial.uniform.set('u_pressure', 1);
				combineMaterial.uniform.set('u_divergence', 2);
				combineMaterial.textures.push('VelocityCalculatorB');
				combineMaterial.textures.push('PressureCalculatorA');
				combineMaterial.textures.push('DivergenceCalculator');
			}

			// WebglEngine.inst.addShader('Combine', new Combine());
			WebglEngine.inst.createNoiseTexture('ta');
			WebglEngine.inst.createTexture('tb');

			WebglEngine.inst.createRenderTarget('rt', 256, 256);

			// final combineMaterial = WebglEngine.inst.createMaterial('combineMaterial', 'Combine');
			// if (combineMaterial != null) {
			// 	combineMaterial.uniform.set('u_velocity', 0);
			// 	combineMaterial.uniform.set('u_pressure', 1);
			// 	combineMaterial.uniform.set('u_divergence', 2);
			// 	combineMaterial.textures.push('ta');
			// 	combineMaterial.textures.push('tb');
			// }
			final rect = Tool.createMeshEntity('rect', DEFAULT_MESH.RECTANGLE2D, 'combineMaterial');

			var lastRender = 0.0;
			function render(timestamp:Float) {
				final progress = timestamp - lastRender;
				lastRender = timestamp;

				final mr = rect.getComponent(MeshRenderer);
				if (mr != null && mr.geometry != null) {
					final pm = Mat3Tools.projection(gl.canvas.width, gl.canvas.height);
					final modelMatrix = Mat3.fromScaling(null, Vec2.fromValues(1024.0 / 100.0, 768.0 / 100.0));
					mr.geometry.uniform.set('u_time', [timestamp]);
					mr.geometry.uniform.set('u_matrix', pm.toArray());
					mr.geometry.uniform.set('u_modelMatrix', modelMatrix.toArray());
				}

				WebglEngine.inst.defaultFrameBuffer();

				WebglEngine.inst.render();

				WebglEngine.inst.bindFrameBuffer('rt');

				WebglEngine.inst.render();

				// Browser.window.requestAnimationFrame(render);
			}
			Browser.window.requestAnimationFrame(render);
		}
	}

	function testEnviromentMap() {
		WebglEngine.inst.init('canvas_gl');
		final gl = WebglEngine.inst.gl;
		if (gl != null) {
			WebglEngine.inst.createCubeMap('cubemapTexture');

			WebglEngine.inst.addShader('BasicEnviromentShader', new BasicEnviromentShader());

			final cubeMaterial = WebglEngine.inst.createMaterial('cubeMaterial', 'BasicEnviromentShader');
			if (cubeMaterial != null) {
				cubeMaterial.textures.push('cubemapTexture');
			}
			final cube = Tool.createMeshEntity('cube', CUBE3D, 'cubeMaterial');

			final camera = Tool.createCameraEntity('camera');
			camera.transform.position.z = 1000;

			final cameraComponent = camera.getComponent(ecs.components.Camera);

			final mr = cube.getComponent(MeshRenderer);

			var lastRender = 0.0;
			function render(timestamp:Float) {
				final progress = timestamp - lastRender;
				lastRender = timestamp;

				cube.transform.rotation.x += 0.01;
				cube.transform.rotation.y += 0.01;

				if (mr != null && mr.geometry != null && cameraComponent != null) {
					mr.geometry.uniform.set('u_projectMatrix', cameraComponent.getProjectMatrix().toArray());
					mr.geometry.uniform.set('u_viewMatrix', camera.transform.getGlobalMatrix().toArray());
					mr.geometry.uniform.set('u_modelMatrix', cube.transform.getGlobalMatrix().toArray());
				}

				WebglEngine.inst.render();
				Browser.window.requestAnimationFrame(render);
			}
			Browser.window.requestAnimationFrame(render);
		}
	}

	function testCubeMap() {
		WebglEngine.inst.init('canvas_gl');
		final gl = WebglEngine.inst.gl;
		if (gl != null) {
			WebglEngine.inst.createCubeMap('cubemapTexture');

			WebglEngine.inst.addShader('BasicCubeMapShader', new BasicCubeMapShader());

			final cubeMaterial = WebglEngine.inst.createMaterial('cubeMaterial', 'BasicCubeMapShader');
			if (cubeMaterial != null) {
				cubeMaterial.textures.push('cubemapTexture');
			}
			final cube = Tool.createMeshEntity('cube', CUBE3D, 'cubeMaterial');

			final camera = Tool.createCameraEntity('camera');
			camera.transform.position.z = 1000;

			final cameraComponent = camera.getComponent(ecs.components.Camera);

			final mr = cube.getComponent(MeshRenderer);

			var lastRender = 0.0;
			function render(timestamp:Float) {
				final progress = timestamp - lastRender;
				lastRender = timestamp;

				cube.transform.rotation.x += 0.01;
				cube.transform.rotation.y += 0.01;

				if (mr != null && mr.geometry != null && cameraComponent != null) {
					mr.geometry.uniform.set('u_projectMatrix', cameraComponent.getProjectMatrix().toArray());
					mr.geometry.uniform.set('u_viewMatrix', camera.transform.getGlobalMatrix().toArray());
					mr.geometry.uniform.set('u_modelMatrix', cube.transform.getGlobalMatrix().toArray());
				}

				WebglEngine.inst.render();
				Browser.window.requestAnimationFrame(render);
			}
			Browser.window.requestAnimationFrame(render);
		}
	}

	function testShaderToy() {
		WebglEngine.inst.init('canvas_gl');
		final gl = WebglEngine.inst.gl;
		if (gl != null) {
			final mousePos = Vec2.fromValues(0, 0);
			Browser.window.addEventListener('mousemove', (e:MouseEvent) -> {
				mousePos.x = e.pageX;
				mousePos.y = e.pageY;
			});

			WebglEngine.inst.addShader('ShaderToy', new ShaderToyStorm());
			WebglEngine.inst.createMaterial('rectMaterial', 'ShaderToy');
			final rect = Tool.createMeshEntity('rect', RECTANGLE2D, 'rectMaterial');

			final mr = rect.getComponent(MeshRenderer);
			var lastRender = 0.0;
			function render(timestamp:Float) {
				final progress = timestamp - lastRender;
				lastRender = timestamp;

				if (mr != null && mr.geometry != null) {
					final pm = Mat3Tools.projection(gl.canvas.width, gl.canvas.height);
					final modelMatrix = Mat3.fromScaling(null, Vec2.fromValues(1024.0 / 100.0, 768.0 / 100.0));
					mr.geometry.uniform.set('iTime', [timestamp * 0.001]);
					mr.geometry.uniform.set('iMouse', [mousePos.x, -mousePos.y]);
					mr.geometry.uniform.set('iResolution', [gl.canvas.width, gl.canvas.height]);
					mr.geometry.uniform.set('u_matrix', pm.toArray());
					mr.geometry.uniform.set('u_modelMatrix', modelMatrix.toArray());
				}

				WebglEngine.inst.render();

				Browser.window.requestAnimationFrame(render);
			}
			Browser.window.requestAnimationFrame(render);
		}
	}

	function testNoiseShader() {
		WebglEngine.inst.init('canvas_gl');
		final gl = WebglEngine.inst.gl;
		if (gl != null) {
			WebglEngine.inst.addShader('NoiseShader', new NoiseShader());
			WebglEngine.inst.createMaterial('rectMaterial', 'NoiseShader');
			final rect = Tool.createMeshEntity('rect', RECTANGLE2D, 'rectMaterial');

			final mr = rect.getComponent(MeshRenderer);

			var lastRender = 0.0;
			function render(timestamp:Float) {
				final progress = timestamp - lastRender;
				lastRender = timestamp;

				if (mr != null && mr.geometry != null) {
					final pm = Mat3Tools.projection(gl.canvas.width, gl.canvas.height);
					final modelMatrix = Mat3.fromScaling(null, Vec2.fromValues(1024.0 / 100.0, 768.0 / 100.0));
					mr.geometry.uniform.set('u_time', [timestamp]);
					mr.geometry.uniform.set('u_matrix', pm.toArray());
					mr.geometry.uniform.set('u_modelMatrix', modelMatrix.toArray());
				}

				WebglEngine.inst.render();

				Browser.window.requestAnimationFrame(render);
			}
			Browser.window.requestAnimationFrame(render);
		}
	}

	function testSmokingDuck() {
		WebglEngine.inst.init('canvas_gl');
		final gl = WebglEngine.inst.gl;
		if (gl != null) {
			// 這邊告訴gl說要允許framebuffer輸入浮點值
			WebglEngine.inst.enabledWriteFloatInFramebuffer();
			final tw = 1024;
			final th = 768;

			WebglEngine.inst.addShader('SmokingDuckBufferA', new SmokingDuckBufferA());
			WebglEngine.inst.addShader('SmokingDuckBufferB', new SmokingDuckBufferB());
			WebglEngine.inst.addShader('SmokingDuckBufferC', new SmokingDuckBufferC());
			WebglEngine.inst.addShader('SmokingDuckBufferD', new SmokingDuckBufferD());
			WebglEngine.inst.addShader('SmokingDuckImage', new SmokingDuckImage());

			WebglEngine.inst.createRenderTarget('SmokingDuckBufferA1', tw, th);
			WebglEngine.inst.createRenderTarget('SmokingDuckBufferA2', tw, th);
			WebglEngine.inst.createRenderTarget('SmokingDuckBufferB', tw, th);
			WebglEngine.inst.createRenderTarget('SmokingDuckBufferC', tw, th);
			WebglEngine.inst.createRenderTarget('SmokingDuckBufferD', tw, th);

			final bufferAMaterial = WebglEngine.inst.createMaterial('bufferAMaterial', 'SmokingDuckBufferA');
			if (bufferAMaterial != null) {
				bufferAMaterial.uniform.set('u_bufferD', 0);
				bufferAMaterial.uniform.set('u_bufferA', 1);
				bufferAMaterial.textures.push('SmokingDuckBufferD');
				bufferAMaterial.textures.push('SmokingDuckBufferA1');
			}

			final bufferBMaterial = WebglEngine.inst.createMaterial('bufferBMaterial', 'SmokingDuckBufferB');
			if (bufferBMaterial != null) {
				bufferBMaterial.uniform.set('u_bufferA', 0);
				bufferBMaterial.textures.push('SmokingDuckBufferA1');
			}

			final bufferCMaterial = WebglEngine.inst.createMaterial('bufferCMaterial', 'SmokingDuckBufferC');
			if (bufferCMaterial != null) {
				bufferCMaterial.uniform.set('u_bufferB', 0);
				bufferCMaterial.uniform.set('u_bufferD', 1);
				bufferCMaterial.textures.push('SmokingDuckBufferB');
				bufferCMaterial.textures.push('SmokingDuckBufferD');
			}

			final bufferDMaterial = WebglEngine.inst.createMaterial('bufferDMaterial', 'SmokingDuckBufferD');
			if (bufferDMaterial != null) {
				bufferDMaterial.uniform.set('u_bufferA', 0);
				bufferDMaterial.uniform.set('u_bufferC', 1);
				bufferDMaterial.textures.push('SmokingDuckBufferA1');
				bufferDMaterial.textures.push('SmokingDuckBufferC');
			}

			final imageMaterial = WebglEngine.inst.createMaterial('imageMaterial', 'SmokingDuckImage');
			if (imageMaterial != null) {
				imageMaterial.uniform.set('u_bufferA', 0);
				imageMaterial.textures.push('SmokingDuckBufferD');
			}

			final rect = Tool.createMeshEntity('rect', RECTANGLE2D, 'imageMaterial');

			var lastRender = 0.0;
			var tickCount = 0.0;
			function render(timestamp:Float) {
				final progress = timestamp - lastRender;
				lastRender = timestamp;

				final mr = rect.getComponent(MeshRenderer);
				if (mr != null && mr.geometry != null) {
					final pm = Mat3Tools.projection(gl.canvas.width, gl.canvas.height);
					final modelMatrix = Mat3.fromScaling(null, Vec2.fromValues(1024.0 / 100.0, 768.0 / 100.0));
					mr.geometry.uniform.set('u_time', [timestamp]);
					mr.geometry.uniform.set('u_matrix', pm.toArray());
					mr.geometry.uniform.set('u_modelMatrix', modelMatrix.toArray());
				}

				// bufferA
				{
					final mr = rect.getComponent(MeshRenderer);
					if (mr != null && mr.geometry != null) {
						WebglEngine.inst.changeMaterial(mr.name, 'bufferAMaterial');
					}

					if (bufferAMaterial != null && bufferAMaterial.textures.length > 1) {
						bufferAMaterial.textures.pop();
						bufferAMaterial.textures.push(tickCount % 2 == 0 ? 'SmokingDuckBufferA1' : 'SmokingDuckBufferA2');
					}
					// 指定新的不顯示的畫布
					WebglEngine.inst.bindFrameBuffer(tickCount % 2 == 0 ? 'SmokingDuckBufferA2' : 'SmokingDuckBufferA1');

					// 畫在指定的不顯示的畫布上
					WebglEngine.inst.render(tw, th, Vec3.fromValues(0.0, 0.0, 1));
				}

				// bufferB
				{
					final mr = rect.getComponent(MeshRenderer);
					if (mr != null && mr.geometry != null) {
						WebglEngine.inst.changeMaterial(mr.name, 'bufferBMaterial');
					}

					// 指定新的不顯示的畫布
					WebglEngine.inst.bindFrameBuffer('SmokingDuckBufferB');

					// 畫在指定的不顯示的畫布上
					WebglEngine.inst.render(tw, th, Vec3.fromValues(0.0, 0.0, 1));
				}

				// bufferC
				{
					final mr = rect.getComponent(MeshRenderer);
					if (mr != null && mr.geometry != null) {
						WebglEngine.inst.changeMaterial(mr.name, 'bufferCMaterial');
					}

					// 指定新的不顯示的畫布
					WebglEngine.inst.bindFrameBuffer('SmokingDuckBufferC');

					// 畫在指定的不顯示的畫布上
					WebglEngine.inst.render(tw, th, Vec3.fromValues(0.0, 0.0, 1));
				}

				// bufferD
				{
					final mr = rect.getComponent(MeshRenderer);
					if (mr != null && mr.geometry != null) {
						WebglEngine.inst.changeMaterial(mr.name, 'bufferDMaterial');
					}

					// 指定新的不顯示的畫布
					WebglEngine.inst.bindFrameBuffer('SmokingDuckBufferD');

					// 畫在指定的不顯示的畫布上
					WebglEngine.inst.render(tw, th, Vec3.fromValues(0.0, 0.0, 1));
				}

				// combine
				{
					final mr = rect.getComponent(MeshRenderer);
					if (mr != null && mr.geometry != null) {
						WebglEngine.inst.changeMaterial(mr.name, 'imageMaterial');
					}

					WebglEngine.inst.defaultFrameBuffer();

					// 畫在當前的顯示畫布
					WebglEngine.inst.render(gl.canvas.width, gl.canvas.height, Vec3.fromValues(0.7, 0.7, 0.7));
				}

				Browser.window.requestAnimationFrame(render);
				tickCount += 1;
			}
			Browser.window.requestAnimationFrame(render);
		}
	}

	function test2DNavierStokes() {
		WebglEngine.inst.init('canvas_gl');
		final gl = WebglEngine.inst.gl;
		if (gl != null) {
			// 這邊告訴gl說要允許framebuffer輸入浮點值
			WebglEngine.inst.enabledWriteFloatInFramebuffer();
			final tw = 1024;
			final th = 768;

			WebglEngine.inst.addShader('DivergenceCalculator', new DivergenceCalculator());
			WebglEngine.inst.addShader('PressureCalculator', new PressureCalculator());
			WebglEngine.inst.addShader('VelocityCalculator', new VelocityCalculator());
			WebglEngine.inst.addShader('VelocityAfterCalculator', new VelocityAfterCalculator());
			WebglEngine.inst.addShader('Combine', new Combine());

			WebglEngine.inst.createRenderTarget('DivergenceCalculatorA', tw, th);
			WebglEngine.inst.createRenderTarget('PressureCalculatorA', tw, th);
			WebglEngine.inst.createRenderTarget('PressureCalculatorB', tw, th);
			WebglEngine.inst.createRenderTarget('VelocityCalculatorA', tw, th);
			WebglEngine.inst.createRenderTarget('VelocityCalculatorB', tw, th);

			// bufferA
			final velocityMaterial = WebglEngine.inst.createMaterial('velocityMaterial', 'VelocityCalculator');
			if (velocityMaterial != null) {
				velocityMaterial.uniform.set('u_velocityAfter', 0);
				velocityMaterial.textures.push('VelocityCalculatorB');
			}

			// bufferB
			final divergenceMaterial = WebglEngine.inst.createMaterial('divergenceMaterial', 'DivergenceCalculator');
			if (divergenceMaterial != null) {
				divergenceMaterial.uniform.set('u_velocity', 0);
				divergenceMaterial.textures.push('VelocityCalculatorA');
			}

			// bufferC
			final pressureMaterial = WebglEngine.inst.createMaterial('pressureMaterial', 'PressureCalculator');
			if (pressureMaterial != null) {
				pressureMaterial.uniform.set('u_velocity', 0);
				pressureMaterial.uniform.set('u_divergence', 1);
				pressureMaterial.uniform.set('u_pressure', 2);
				pressureMaterial.textures.push('VelocityCalculatorA');
				pressureMaterial.textures.push('DivergenceCalculatorA');
				pressureMaterial.textures.push('PressureCalculatorB');
			}

			// bufferD
			final velocityBMaterial = WebglEngine.inst.createMaterial('velocityBMaterial', 'VelocityAfterCalculator');
			if (velocityBMaterial != null) {
				velocityBMaterial.uniform.set('u_pressure', 0);
				velocityBMaterial.uniform.set('u_velocity', 1);
				velocityBMaterial.textures.push('PressureCalculatorA');
				velocityBMaterial.textures.push('VelocityCalculatorA');
			}

			// combine
			final combineMaterial = WebglEngine.inst.createMaterial('combineMaterial', 'Combine');
			if (combineMaterial != null) {
				combineMaterial.uniform.set('u_velocity', 0);
				combineMaterial.uniform.set('u_pressure', 1);
				combineMaterial.uniform.set('u_divergence', 2);
				combineMaterial.textures.push('VelocityCalculatorA');
				combineMaterial.textures.push('PressureCalculatorA');
				combineMaterial.textures.push('DivergenceCalculatorA');
			}

			final rect = Tool.createMeshEntity('rect', RECTANGLE2D, 'combineMaterial');

			var lastRender = 0.0;
			var tickCount = 0.0;
			function render(timestamp:Float) {
				final progress = timestamp - lastRender;
				lastRender = timestamp;

				final mr = rect.getComponent(MeshRenderer);
				if (mr != null && mr.geometry != null) {
					final pm = Mat3Tools.projection(gl.canvas.width, gl.canvas.height);
					final modelMatrix = Mat3.fromScaling(null, Vec2.fromValues(1024.0 / 100.0, 768.0 / 100.0));
					mr.geometry.uniform.set('u_time', [progress]);
					mr.geometry.uniform.set('u_matrix', pm.toArray());
					mr.geometry.uniform.set('u_modelMatrix', modelMatrix.toArray());
				}

				// bufferA
				{
					final mr = rect.getComponent(MeshRenderer);
					if (mr != null && mr.geometry != null) {
						WebglEngine.inst.changeMaterial(mr.name, 'velocityMaterial');
					}
					// 指定新的不顯示的畫布
					WebglEngine.inst.bindFrameBuffer('VelocityCalculatorA');

					// 畫在指定的不顯示的畫布上
					WebglEngine.inst.render(tw, th, Vec3.fromValues(0.0, 0.0, 0.0));
				}

				// bufferB
				{
					final mr = rect.getComponent(MeshRenderer);
					if (mr != null && mr.geometry != null) {
						WebglEngine.inst.changeMaterial(mr.name, 'divergenceMaterial');
					}

					// 指定新的不顯示的畫布
					WebglEngine.inst.bindFrameBuffer('DivergenceCalculatorA');

					// 畫在指定的不顯示的畫布上
					WebglEngine.inst.render(tw, th, Vec3.fromValues(0.0, 0.0, 1));
				}

				// bufferC
				{
					final mr = rect.getComponent(MeshRenderer);
					if (mr != null && mr.geometry != null) {
						WebglEngine.inst.changeMaterial(mr.name, 'pressureMaterial');
					}

					if (pressureMaterial != null && pressureMaterial.textures.length > 2) {
						pressureMaterial.textures.pop();
						pressureMaterial.textures.push(tickCount % 2 == 0 ? 'PressureCalculatorA' : 'PressureCalculatorB');
					}
					// 指定新的不顯示的畫布
					WebglEngine.inst.bindFrameBuffer(tickCount % 2 == 0 ? 'PressureCalculatorB' : 'PressureCalculatorA');

					// 畫在指定的不顯示的畫布上
					WebglEngine.inst.render(tw, th, Vec3.fromValues(0.0, 0.0, 1));
				}

				// bufferD
				{
					final mr = rect.getComponent(MeshRenderer);
					if (mr != null && mr.geometry != null) {
						WebglEngine.inst.changeMaterial(mr.name, 'velocityBMaterial');
					}
					// 指定新的不顯示的畫布
					WebglEngine.inst.bindFrameBuffer('VelocityCalculatorB');

					// 畫在指定的不顯示的畫布上
					WebglEngine.inst.render(tw, th, Vec3.fromValues(0.0, 0.0, 1));
				}

				// combine
				{
					final mr = rect.getComponent(MeshRenderer);
					if (mr != null && mr.geometry != null) {
						WebglEngine.inst.changeMaterial(mr.name, 'combineMaterial');
						// WebglEngine.inst.changeMaterial(mr.name, 'pressureMaterial');
					}

					WebglEngine.inst.defaultFrameBuffer();

					// 畫在當前的顯示畫布
					WebglEngine.inst.render(gl.canvas.width, gl.canvas.height, Vec3.fromValues(0.7, 0.7, 0.7));
				}

				Browser.window.requestAnimationFrame(render);
				tickCount += 1;
			}
			Browser.window.requestAnimationFrame(render);

			Browser.document.addEventListener('keydown', (e) -> {
				Browser.window.requestAnimationFrame(render);
			});
		}
	}

	function testDoubleBuffer() {
		WebglEngine.inst.init('canvas_gl');
		final gl = WebglEngine.inst.gl;
		if (gl != null) {
			WebglEngine.inst.addShader('ReactionDiffusionShader', new ReactionDiffusionShader());
			WebglEngine.inst.createRenderTarget('rtA', 256, 256);
			WebglEngine.inst.createRenderTarget('rtB', 256, 256);

			final rectMaterial = WebglEngine.inst.createMaterial('rectMaterial', 'ReactionDiffusionShader');
			final rect = Tool.createMeshEntity('rect', RECTANGLE2D, 'rectMaterial');

			var lastRender = 0.0;
			var tickCount = 0.0;
			function render(timestamp:Float) {
				final progress = timestamp - lastRender;
				lastRender = timestamp;

				if (rectMaterial != null) {
					rectMaterial.textures.pop();
					rectMaterial.textures.push(tickCount % 2 == 0 ? 'rtA' : 'rtB');
				}

				final mr = rect.getComponent(MeshRenderer);
				if (mr != null && mr.geometry != null) {
					final pm = Mat3Tools.projection(gl.canvas.width, gl.canvas.height);
					final modelMatrix = Mat3.fromScaling(null, Vec2.fromValues(1024.0 / 100.0, 768.0 / 100.0));
					mr.geometry.uniform.set('u_time', [timestamp]);
					mr.geometry.uniform.set('u_matrix', pm.toArray());
					mr.geometry.uniform.set('u_modelMatrix', modelMatrix.toArray());
				}

				gl.enable(gl.DEPTH_TEST);
				gl.enable(gl.CULL_FACE);

				WebglEngine.inst.defaultFrameBuffer();

				WebglEngine.inst.render(gl.canvas.width, gl.canvas.height, Vec3.fromValues(0.7, 0.7, 0.7));

				WebglEngine.inst.bindFrameBuffer(tickCount % 2 == 0 ? 'rtB' : 'rtA');

				WebglEngine.inst.render(256, 256, Vec3.fromValues(0.0, 0.0, 1));

				Browser.window.requestAnimationFrame(render);
				tickCount++;
			}
			Browser.window.requestAnimationFrame(render);

			Browser.document.addEventListener('keydown', (e) -> {
				tickCount += 1;
				Browser.window.requestAnimationFrame(render);
			});
		}
	}

	// 反應擴散
	// https://ciphrd.com/2019/08/24/reaction-diffusion-on-shader/
	// https://www.shadertoy.com/view/llK3WG
	function testReactionDiffusion() {
		WebglEngine.inst.init('canvas_gl');
		final gl = WebglEngine.inst.gl;
		if (gl != null) {
			final textureSize = 512;

			WebglEngine.inst.addShader('ReactionDiffusionShader', new ReactionDiffusionShader());
			WebglEngine.inst.createRenderTarget('rtA', textureSize, textureSize);
			WebglEngine.inst.createRenderTarget('rtB', textureSize, textureSize);

			final rectMaterial = WebglEngine.inst.createMaterial('rectMaterial', 'ReactionDiffusionShader');
			final rect = Tool.createMeshEntity('rect', RECTANGLE2D, 'rectMaterial');

			var lastRender = 0.0;
			var tickCount = 0.0;
			function render(timestamp:Float) {
				final progress = timestamp - lastRender;
				lastRender = timestamp;

				// render target的double buffer
				// 輸入A render target的貼圖時，把結果畫在B render target上
				// 這時先把A render target當作貼圖輸入給shader
				if (rectMaterial != null) {
					rectMaterial.textures.pop();
					rectMaterial.textures.push(tickCount % 2 == 0 ? 'rtA' : 'rtB');
				}

				final mr = rect.getComponent(MeshRenderer);
				if (mr != null && mr.geometry != null) {
					final pm = Mat3Tools.projection(gl.canvas.width, gl.canvas.height);
					final modelMatrix = Mat3.fromScaling(null, Vec2.fromValues(1024.0 / 100.0, 768.0 / 100.0));
					mr.geometry.uniform.set('u_time', [timestamp]);
					mr.geometry.uniform.set('u_matrix', pm.toArray());
					mr.geometry.uniform.set('u_modelMatrix', modelMatrix.toArray());
				}

				gl.enable(gl.DEPTH_TEST);
				gl.enable(gl.CULL_FACE);

				WebglEngine.inst.defaultFrameBuffer();

				WebglEngine.inst.render(gl.canvas.width, gl.canvas.height, Vec3.fromValues(0.7, 0.7, 0.7));

				// render target的double buffer
				// 輸入A render target的貼圖時，把結果畫在B render target上
				// 這時再把結果畫在B render target上
				WebglEngine.inst.bindFrameBuffer(tickCount % 2 == 0 ? 'rtB' : 'rtA');

				WebglEngine.inst.render(textureSize, textureSize, Vec3.fromValues(0.7, 0.7, 0.7));

				Browser.window.requestAnimationFrame(render);
				tickCount++;
			}
			Browser.window.requestAnimationFrame(render);

			Browser.document.addEventListener('keydown', (e) -> {
				tickCount += 1;
				Browser.window.requestAnimationFrame(render);
			});
		}
	}

	function testRenderTarget() {
		WebglEngine.inst.init('canvas_gl');
		final gl = WebglEngine.inst.gl;
		if (gl != null) {
			WebglEngine.inst.addShader('ReactionDiffusionShader', new ReactionDiffusionShader());

			WebglEngine.inst.createMaterial('rectMaterial', 'ReactionDiffusionShader');
			WebglEngine.inst.createRenderTarget('rtA', 256, 256);

			final rect = Tool.createMeshEntity('rect', RECTANGLE2D, 'rectMaterial');

			final mr = rect.getComponent(MeshRenderer);
			if (mr != null && mr.geometry != null) {
				final pm = Mat3Tools.projection(gl.canvas.width, gl.canvas.height);

				final modelMatrix = Mat3.fromScaling(null, Vec2.fromValues(1024.0 / 100.0, 768.0 / 100.0));

				mr.geometry.uniform.set('u_matrix', pm.toArray());
				mr.geometry.uniform.set('u_modelMatrix', modelMatrix.toArray());
			}

			final rectMaterial2 = WebglEngine.inst.createMaterial('rectMaterial2', 'Basic2dShader');
			if (rectMaterial2 != null) {
				rectMaterial2.textures.push('rtA');
			}
			final rect2 = Tool.createMeshEntity('rect', RECTANGLE2D, 'rectMaterial2');

			final mr = rect2.getComponent(MeshRenderer);
			if (mr != null && mr.geometry != null) {
				final pm = Mat3Tools.projection(gl.canvas.width, gl.canvas.height);

				final modelMatrix = Mat3.fromScaling(null, Vec2.fromValues(500.0 / 100.0, 500.0 / 100.0));

				mr.geometry.uniform.set('u_matrix', pm.toArray());
				mr.geometry.uniform.set('u_modelMatrix', modelMatrix.toArray());
			}

			WebglEngine.inst.bindFrameBuffer('rtA');
			WebglEngine.inst.render();
			WebglEngine.inst.defaultFrameBuffer();
			WebglEngine.inst.render();
		}
	}

	function testInstance() {
		WebglEngine.inst.init('canvas_gl');
		final gl = WebglEngine.inst.gl;

		if (gl != null) {
			WebglEngine.inst.createNoiseTexture('noise');
			WebglEngine.inst.createTexture('red');

			final noiseMaterial = WebglEngine.inst.createMaterial('noiseMaterial', 'Basic3dShader');
			if (noiseMaterial != null) {
				noiseMaterial.textures.push('noise');
			}

			final instanceMaterial = WebglEngine.inst.createMaterial('instanceMaterial', 'Basic3dInstanceShader');
			if (instanceMaterial != null)
				instanceMaterial.textures.push('noise');

			final world = new Entity('world');

			final renderEntitys:Map<Entity, Null<MeshRenderer>> = [];
			final camera = Tool.createCameraEntity('camera');
			// camera.transform.position.x = 400;
			// camera.transform.position.y = 100;
			camera.transform.position.z = 1000;
			// camera.transform.lookAt(new Vec3(), Vec3.Y_AXIS);
			// camera.transform.lookAt(new Vec3(), Vec3.Y_AXIS);

			final light = Tool.createCameraEntity('light');
			light.transform.position.x = 600;
			// light.transform.position.y = 600;

			final body = Tool.createMeshEntity('body', DEFAULT_MESH.SPHERE3D, 'noiseMaterial');
			// body.transform.position.x = 160;
			// body.transform.position.y = 80;
			// body.transform.position.z = -500;
			var mr = body.getComponent(MeshRenderer);
			if (mr != null && mr.geometry != null) {
				mr.geometry.uniform.set('u_color', [Math.random(), Math.random(), Math.random(), 1.0]);
			}

			final leftArm = Tool.createMeshEntity('leftArm', DEFAULT_MESH.CUBE3D, 'noiseMaterial');
			leftArm.transform.scale.x = leftArm.transform.scale.y = leftArm.transform.scale.z = .3;
			leftArm.transform.position.x = -200;

			final leftArmChild = Tool.createMeshEntity('leftArmChild', DEFAULT_MESH.CUBE3D, 'noiseMaterial');
			leftArmChild.transform.scale.x = leftArmChild.transform.scale.y = leftArmChild.transform.scale.z = .5;
			leftArmChild.transform.position.x = -150;

			final rightArm = Tool.createMeshEntity('rightArm', DEFAULT_MESH.CUBE3D, 'noiseMaterial');
			rightArm.transform.scale.x = rightArm.transform.scale.y = rightArm.transform.scale.z = .3;
			rightArm.transform.position.x = 200;
			// rightArm.transform.rotation.y = 3.14;

			for (i in 0...10) {
				final ball = Tool.createMeshEntity('ball_${i}', DEFAULT_MESH.PLANE3D, 'instanceMaterial');
				ball.transform.position.x = Math.random() * 1000 - 500;
				ball.transform.position.y = Math.random() * 1000 - 500;
				ball.transform.position.z = Math.random() * 1000 - 500;
				ball.transform.scale.x = ball.transform.scale.y = ball.transform.scale.z = .5;
				var mr = ball.getComponent(MeshRenderer);
				if (mr != null && mr.geometry != null) {
					mr.geometry.uniform.set('u_color', [Math.random(), Math.random(), Math.random(), 1.0]);
				}
				renderEntitys.set(ball, ball.getComponent(MeshRenderer));

				final f = Tool.createMeshEntity('f_${i}', DEFAULT_MESH.CUBE3D, 'instanceMaterial');
				f.transform.position.x = Math.random() * 1000 - 500;
				f.transform.position.y = Math.random() * 1000 - 500;
				f.transform.position.z = Math.random() * 1000 - 500;
				f.transform.scale.x = f.transform.scale.y = f.transform.scale.z = .3;
				var mr = f.getComponent(MeshRenderer);
				if (mr != null && mr.geometry != null) {
					mr.geometry.uniform.set('u_color', [Math.random(), Math.random(), Math.random(), 1.0]);
				}
				renderEntitys.set(f, f.getComponent(MeshRenderer));
			}

			// for (i in 0...3) {
			// 	final ball = Tool.createMeshEntity('ball2_${i}', DEFAULT_MESH.CUBE3D, 'instanceMaterial2');
			// 	ball.transform.position.x = Math.random() * 1000 - 500;
			// 	ball.transform.position.y = Math.random() * 1000 - 500;
			// 	ball.transform.position.z = Math.random() * 1000 - 500;
			// 	ball.transform.scale.x = ball.transform.scale.y = ball.transform.scale.z = .5;
			// 	renderEntitys.set(ball, ball.getComponent(MeshRenderer));

			// 	final f = Tool.createMeshEntity('f2_${i}', DEFAULT_MESH.F3D, 'instanceMaterial2');
			// 	f.transform.position.x = Math.random() * 1000 - 500;
			// 	f.transform.position.y = Math.random() * 1000 - 500;
			// 	f.transform.position.z = Math.random() * 1000 - 500;
			// 	f.transform.scale.x = f.transform.scale.y = f.transform.scale.z = .5;
			// 	renderEntitys.set(f, f.getComponent(MeshRenderer));
			// }

			renderEntitys.set(body, body.getComponent(MeshRenderer));
			renderEntitys.set(leftArm, leftArm.getComponent(MeshRenderer));
			renderEntitys.set(rightArm, rightArm.getComponent(MeshRenderer));
			renderEntitys.set(leftArmChild, leftArmChild.getComponent(MeshRenderer));

			world.transform.addChild(camera.transform);
			world.transform.addChild(body.transform);
			body.transform.addChild(leftArm.transform);
			body.transform.addChild(rightArm.transform);
			leftArm.transform.addChild(leftArmChild.transform);

			var lastRender = 0.0;
			function render(timestamp:Float) {
				final progress = timestamp - lastRender;
				lastRender = timestamp;

				final cameraComponent = camera.getComponent(ecs.components.Camera);
				if (cameraComponent != null) {
					// body.transform.rotation.y += .05;

					// leftArm.transform.position.y = Math.sin(timestamp * 0.001) * 20 - 10;
					// rightArm.transform.position.y = Math.cos(timestamp * 0.001) * 20 - 10;

					// final bodyGlobal = body.transform.getGlobalMatrix();
					// camera.transform.position.x = Math.cos(timestamp * .001) * 1000;
					// camera.transform.position.z = Math.sin(timestamp * .001) * 1000;
					// camera.transform.lookAt(Mat4Tools.getTranslation(bodyGlobal), Vec3.Y_AXIS);

					final bodyGlobal = body.transform.getGlobalMatrix();
					light.transform.position.x = Math.cos(timestamp * .001) * 200;
					light.transform.position.z = Math.sin(timestamp * .001) * 200;

					final p = cameraComponent.getProjectMatrix();
					final v = camera.transform.getGlobalMatrix();
					final l = light.transform.getGlobalMatrix();
					final lightPos = Mat4Tools.getTranslation(l);
					for (entity => meshRenderer in renderEntitys) {
						if (meshRenderer == null)
							continue;

						if (meshRenderer.geometry == null)
							continue;

						entity.transform.rotation.x += .01;
						entity.transform.rotation.y += .005;
						// entity.transform.rotation.z += .015;
						final m = entity.transform.getGlobalMatrix();

						meshRenderer.geometry.uniform.set('u_modelMatrix', m.toArray());
						meshRenderer.geometry.uniform.set('u_viewMatrix', v.toArray());
						meshRenderer.geometry.uniform.set('u_projectMatrix', p.toArray());
						meshRenderer.geometry.uniform.set('u_worldSpaceLightPos', lightPos.toArray());
						meshRenderer.geometry.uniform.set('u_lightColor', [1., 1., 1.]);
						meshRenderer.geometry.uniform.set('u_diffuseColor', [.5, 0., 0.]);
						meshRenderer.geometry.uniform.set('u_specularColor', [1., 1., 1.]);
						meshRenderer.geometry.uniform.set('u_gloss', [3.]);

						// meshRenderer.geometry.uniform.set('u_color', [.8, .3, .6, 1.0]);
					}

					// world.update(progress);
					WebglEngine.inst.render();
				}

				Browser.window.requestAnimationFrame(render);
			}
			Browser.window.requestAnimationFrame(render);
		}
	}

	function methodC() {
		WebglEngine.inst.init('canvas_gl');
		final gl = WebglEngine.inst.gl;

		if (gl != null) {
			final world = new Entity('world');

			final renderEntitys:Map<Entity, Null<MeshRenderer>> = [];
			final camera = Tool.createCameraEntity('camera');
			camera.transform.position.z = 1000;

			final body = Tool.createMeshEntity('body', DEFAULT_MESH.CUBE3D, 'noiseMaterial');

			final leftArm = Tool.createMeshEntity('leftArm', DEFAULT_MESH.F3D, 'noiseMaterial');
			leftArm.transform.position.x = -150;

			final rightArm = Tool.createMeshEntity('rightArm', DEFAULT_MESH.F3D, 'noiseMaterial');
			rightArm.transform.position.x = 150;
			rightArm.transform.rotation.y = 3.14;

			for (i in 0...10000) {
				final ball = Tool.createMeshEntity('ball_${i}', DEFAULT_MESH.CUBE3D, 'noiseMaterial');
				ball.transform.position.x = Math.random() * 1000 - 500;
				ball.transform.position.y = Math.random() * 1000 - 500;
				ball.transform.position.z = Math.random() * 1000 - 500;
				ball.transform.scale.x = ball.transform.scale.y = ball.transform.scale.z = .05;
				renderEntitys.set(ball, ball.getComponent(MeshRenderer));
			}

			renderEntitys.set(body, body.getComponent(MeshRenderer));
			renderEntitys.set(leftArm, leftArm.getComponent(MeshRenderer));
			renderEntitys.set(rightArm, rightArm.getComponent(MeshRenderer));

			world.transform.addChild(camera.transform);
			world.transform.addChild(body.transform);
			body.transform.addChild(leftArm.transform);
			body.transform.addChild(rightArm.transform);

			var lastRender = 0.0;
			function render(timestamp:Float) {
				final progress = timestamp - lastRender;
				lastRender = timestamp;

				final cameraComponent = camera.getComponent(ecs.components.Camera);
				if (cameraComponent != null) {
					body.transform.rotation.y += .05;

					leftArm.transform.position.y = Math.sin(timestamp * 0.001) * 20 - 10;
					rightArm.transform.position.y = Math.cos(timestamp * 0.001) * 20 - 10;

					final p = cameraComponent.getProjectMatrix();
					final v = Mat4Tools.invert(camera.transform.getGlobalMatrix());
					for (entity => meshRenderer in renderEntitys) {
						if (meshRenderer == null)
							continue;

						if (meshRenderer.geometry == null)
							continue;

						final m = entity.transform.getGlobalMatrix();

						var mvp = Mat4Tools.identity();
						mvp = Mat4Tools.multiply(mvp, p);
						mvp = Mat4Tools.multiply(mvp, v);
						mvp = Mat4Tools.multiply(mvp, m);

						meshRenderer.geometry.uniform.set('u_matrix', mvp.toArray());
					}

					// world.update(progress);
					WebglEngine.inst.render();
				}

				Browser.window.requestAnimationFrame(render);
			}
			Browser.window.requestAnimationFrame(render);
		}
	}

	// function methodB() {
	// 	WebglEngine.inst.init('canvas_gl');
	// 	final gl = WebglEngine.inst.gl;
	// 	if (gl != null) {
	// 		final t3 = WebglEngine.inst.createTexture();
	// 		if (t3 != null)
	// 			WebglEngine.inst.addTexture('red8', t3);
	// 		final mat1 = WebglEngine.inst.createMaterial('mat_1', 'Basic3dShader');
	// 		if (mat1 != null) {
	// 			mat1.textures.push('red8');
	// 		}
	// 		final worldEntity = new Entity('worldEntity');
	// 		final body = new Entity('entity0');
	// 		body.transform.position.z = -500;
	// 		worldEntity.addComponent(body);
	// 		final meshRenderer = new MeshRenderer('meshRenderer0', 'Cube3dMesh', 'mat_1');
	// 		body.addComponent(meshRenderer);
	// 		final geo = WebglEngine.inst.geometrys.get(meshRenderer.geometryId);
	// 		if (geo != null) {
	// 			geo.uniform.set('u_texture', 0);
	// 		}
	// 		final leftArm = new Entity('leftArm');
	// 		leftArm.transform.position.x = 100;
	// 		body.transform.addChild(leftArm.transform);
	// 		final meshRenderer1 = new MeshRenderer('meshRenderer1', 'F3dMesh', 'mat_1');
	// 		leftArm.addComponent(meshRenderer);
	// 		final geo1 = WebglEngine.inst.geometrys.get(meshRenderer1.geometryId);
	// 		if (geo1 != null) {
	// 			geo1.uniform.set('u_texture', 0);
	// 		}
	// 		final camera = new Camera('camera');
	// 		camera.transform.position.z = 500;
	// 		camera.transform.position.x = 200;
	// 		var lastRender = 0.0;
	// 		function render(timestamp:Float) {
	// 			final progress = timestamp - lastRender;
	// 			lastRender = timestamp;
	// 			body.transform.rotation.z += .01;
	// 			final entityMat = body.transform.getGlobalMatrix();
	// 			final projectMat = camera.getProjectMatrix();
	// 			final cameraInvertMat = Mat4Tools.invert(camera.transform.getMatrix());
	// 			// model -> view -> project
	// 			var mat = Mat4Tools.identity();
	// 			mat = Mat4Tools.multiply(mat, projectMat);
	// 			mat = Mat4Tools.multiply(mat, cameraInvertMat);
	// 			mat = Mat4Tools.multiply(mat, entityMat);
	// 			final geo = WebglEngine.inst.geometrys.get(meshRenderer.geometryId);
	// 			if (geo != null) {
	// 				geo.uniform.set('u_matrix', mat.toArray());
	// 			}
	// 			final leftArmMat = leftArm.transform.getGlobalMatrix();
	// 			// model -> view -> project
	// 			mat = Mat4Tools.identity();
	// 			mat = Mat4Tools.multiply(mat, projectMat);
	// 			mat = Mat4Tools.multiply(mat, cameraInvertMat);
	// 			mat = Mat4Tools.multiply(mat, leftArmMat);
	// 			final geo1 = WebglEngine.inst.geometrys.get(meshRenderer1.geometryId);
	// 			if (geo1 != null) {
	// 				geo1.uniform.set('u_matrix', mat.toArray());
	// 			}
	// 			leftArm.update(progress);
	// 			worldEntity.update(progress);
	// 			WebglEngine.inst.render();
	// 			Browser.window.requestAnimationFrame(render);
	// 		}
	// 		Browser.window.requestAnimationFrame(render);
	// 	}
	// }

	function methodA() {
		WebglEngine.inst.init('canvas_gl');
		final gl = WebglEngine.inst.gl;

		if (gl != null) {
			final t = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, t);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 255, 0, 255]));
			WebglEngine.inst.addTexture('green', gl.TEXTURE_2D, t);

			final t2 = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, t2);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 0, 255]));
			WebglEngine.inst.addTexture('red', gl.TEXTURE_2D, t2);

			WebglEngine.inst.createTexture('red8');

			// final image = new Image();
			// image.src = 'images/flow.jpg';
			// image.addEventListener('load', () -> {
			// 	gl.bindTexture(gl.TEXTURE_2D, t);
			// 	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
			// 	gl.generateMipmap(gl.TEXTURE_2D);
			// });

			final mat1 = WebglEngine.inst.createMaterial('mat_1', 'Basic3dShader');
			final mat2 = WebglEngine.inst.createMaterial('mat_2', 'Basic3dShader');

			if (mat1 != null) {
				mat1.textures.push('red8');
				mat1.textures.push('green');
			}

			if (mat2 != null) {
				mat2.textures.push('red8');
				mat2.textures.push('red');
			}

			for (i in 0...4) {
				final mesh = i % 2 == 0 ? DEFAULT_MESH.CUBE3D : DEFAULT_MESH.F3D;
				final mat = i % 2 == 0 ? 'mat_1' : 'mat_2';
				final geo = WebglEngine.inst.createGeometry('geo_${i}', mesh, mat);
				if (geo == null)
					continue;

				// 3d version
				final pm = Mat4Tools.ortho(0, gl.canvas.width, gl.canvas.height, 0, 400, -400);

				final aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
				final pm2 = Mat4Tools.perspective(60 / 180 * Math.PI, aspect, 1, 2000);

				final tm = Mat4.fromTranslation(Vec3.fromArray([Math.random() * 300 - 150, Math.random() * 300 - 150, -500]));
				final rm = Mat4.fromXRotation(Math.random() * 3.14);
				final sm = Mat4.fromScaling(Vec3.fromArray([1.0, 1.0, 1.0]));
				final om = Mat4.fromTranslation(Vec3.fromArray([-50, -75, -50]));
				var mat = Mat4Tools.multiply(pm2, tm);
				mat = Mat4Tools.multiply(mat, rm);
				mat = Mat4Tools.multiply(mat, sm);
				mat = Mat4Tools.multiply(mat, om);

				// 2d version
				// final pm = Mat3Tools.projection(gl.canvas.width, gl.canvas.height);
				// final tm = Mat3.fromTranslation(Vec2.fromArray([500, 500]));
				// final rm = Mat3.fromRotation(Math.random() * 6.28);
				// final sm = Mat3.fromScaling(Vec2.fromArray([1.0, 1.0]));
				// final om = Mat3.fromTranslation(Vec2.fromArray([-50, -75]));
				// var mat = Mat3Tools.multiply(pm, tm);
				// mat = Mat3Tools.multiply(mat, rm);
				// mat = Mat3Tools.multiply(mat, sm);
				// mat = Mat3Tools.multiply(mat, om);

				geo.uniform.set('u_color', [Math.random(), Math.random(), Math.random(), 1.0]);
				geo.uniform.set('u_matrix', mat.toArray());
				geo.uniform.set('u_texture', i % 2);
			}
			WebglEngine.inst.render();
		}
	}
}
