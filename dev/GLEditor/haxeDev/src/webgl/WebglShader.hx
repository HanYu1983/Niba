package webgl;

import js.webgl2.Program;
import js.html.CanvasElement;
import js.webgl2.CanvasHelpers;
import js.Browser;
import js.Syntax;

class WebglShader {
	public final program:Program;

	final pointers = [];

	public function new() {
		final gl = WebglEngine.inst.gl;

		final vs = WebglEngine.inst.createShader(gl, gl.VERTEX_SHADER, getVertexShaderSource());
		final fs = WebglEngine.inst.createShader(gl, gl.FRAGMENT_SHADER, getFragmentShaderSource());
		program = WebglEngine.inst.createProgram(gl, vs, fs);

		for (attr in getAttributes()) {
            final p = gl.getAttribLocation(program, attr);
			pointers.push(p);
		}
	}

	function getAttributes() {
		return ['a_position', 'a_color'];
	}

	function getPointers() {
		return pointers;
	}

	function getVertexShaderSource():String {
		return '#version 300 es
        in vec4 a_color;
        in vec4 a_position;

        out vec4 o_color;
        void main(){
            gl_Position = a_position;
            o_color = a_color;
        }
        ';
	};

	function getFragmentShaderSource():String {
		return '#version 300 es
        precision highp float;
        out vec4 outColor;
        void main(){
            outColor = vec4(1,0,0.5, 1);
        }
        ';
	}
}
