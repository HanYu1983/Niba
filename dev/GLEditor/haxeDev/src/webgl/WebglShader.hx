package webgl;

import js.webgl2.Program;
import js.html.CanvasElement;
import js.webgl2.CanvasHelpers;
import js.Browser;
import js.Syntax;

class WebglShader {
	public final program:Program;

	final locationMap:Map<String, Int> = [];

	public function new() {
		final gl = WebglEngine.inst.gl;

		final vs = WebglEngine.inst.createShader(gl, gl.VERTEX_SHADER, getVertexShaderSource());
		final fs = WebglEngine.inst.createShader(gl, gl.FRAGMENT_SHADER, getFragmentShaderSource());
		program = WebglEngine.inst.createProgram(gl, vs, fs);

		for (attr in getAttributes()) {
			final p = gl.getAttribLocation(program, attr);
			locationMap.set(attr, p);
		}
	}

	public function getLocationMap() {
		return locationMap;
	}

	function getAttributes() {
		return ['position', 'color'];
	}
	
	function getVertexShaderSource():String {
		return '#version 300 es
        in vec4 position;
		in vec4 color;
		out vec4 o_color;
        void main(){
            gl_Position = position;
			o_color = color;
        }
        ';
	};

	function getFragmentShaderSource():String {
		return '#version 300 es
        precision highp float;
		in vec4 o_color;
        out vec4 outColor;
        void main(){
            outColor = vec4(o_color.xyz, 1);
        }
        ';
	}
}
