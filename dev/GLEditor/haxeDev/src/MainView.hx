package;

import webgl.WebglEngine;
import js.Syntax;
import js.webgl2.Program;
import js.webgl2.Shader;
import js.webgl2.constants.ShaderTypeEnum;
import js.webgl2.RenderingContext2;
import js.Browser;
import js.html.CanvasElement;
import js.webgl2.CanvasHelpers;
import haxe.ui.containers.VBox;

@:build(haxe.ui.ComponentBuilder.build("assets/main-view.xml"))
class MainView extends VBox {
	public function new() {
		super();

		WebglEngine.inst.init('canvas_gl');

		WebglEngine.inst.render();

		// final dom_gl = Browser.document.getElementById('canvas_gl');
		// final gl = CanvasHelpers.getWebGL2(cast(dom_gl, CanvasElement));

		// gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		// gl.clearColor(0.9, .2, .2, 1.0);
		// gl.clear(gl.COLOR_BUFFER_BIT);

		// // shader start

		// final vss = '#version 300 es
		// in vec4 a_position;
		// in vec4 a_color;
		// out vec4 o_color;
		// void main(){
		//     gl_Position = a_position;
		//     o_color = a_color;
		// }
		// ';

		// final fss = '#version 300 es
		// precision highp float;
		// in vec4 o_color;
		// out vec4 outColor;
		// void main(){
		//     outColor = vec4(o_color.xyz, 1);
		// }
		// ';

		// final vs = createShader(gl, gl.VERTEX_SHADER, vss);
		// final fs = createShader(gl, gl.FRAGMENT_SHADER, fss);
		// final program = createProgram(gl, vs, fs);
		// final posAttriLoc = gl.getAttribLocation(program, 'a_position');
		// final colorAttriLoc = gl.getAttribLocation(program, 'a_color');

		// // shader end

		// // mesh start
		// gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());

		// final pos = [0, 0, 0, 0.5, 0.7, 0];
		// gl.bufferData(gl.ARRAY_BUFFER, Syntax.code('new Float32Array')(pos), gl.STATIC_DRAW);

		// final vao = gl.createVertexArray();
		// gl.bindVertexArray(vao);
		// gl.enableVertexAttribArray(posAttriLoc);
		// gl.vertexAttribPointer(posAttriLoc, 2, gl.FLOAT, false, 0, 0);

		// gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		// final c = [1.0, 0, 0, 0, 1.0, 0, 0, 0, 1.0];
		// gl.bufferData(gl.ARRAY_BUFFER, Syntax.code('new Float32Array')(c), gl.STATIC_DRAW);
		// gl.enableVertexAttribArray(colorAttriLoc);
		// gl.vertexAttribPointer(colorAttriLoc, 3, gl.FLOAT, false, 0, 0);

		// trace('posAttriLoc', posAttriLoc);
		// trace('colorAttriLoc', colorAttriLoc);

		// // mesh end

		// gl.useProgram(program);
		// gl.bindVertexArray(vao);
		// gl.drawArrays(gl.TRIANGLES, 0, 3);
	}

	function createShader(gl:RenderingContext2, type:ShaderTypeEnum, source:String):Shader {
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

	function createProgram(gl:RenderingContext2, vs:Shader, fs:Shader):Program {
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
