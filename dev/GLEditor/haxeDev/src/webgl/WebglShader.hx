package webgl;

import js.webgl2.UniformLocation;
import js.webgl2.Program;
import js.html.CanvasElement;
import js.webgl2.CanvasHelpers;
import js.Browser;
import js.Syntax;

class WebglShader {
	public final program:Program;

	final attributeMap:Map<String, Int> = [];
	final uniformMap:Map<String, UniformLocation> = [];

	public function new() {
		final gl = WebglEngine.inst.gl;

		final vs = WebglEngine.inst.createShader(gl, gl.VERTEX_SHADER, getVertexShaderSource());
		final fs = WebglEngine.inst.createShader(gl, gl.FRAGMENT_SHADER, getFragmentShaderSource());
		program = WebglEngine.inst.createProgram(gl, vs, fs);

		for (attr in getAttributes().keys()) {
			attributeMap.set(attr, gl.getAttribLocation(program, attr));
		}

		for (attri in getUniforms().keys()) {
			uniformMap.set(attri, gl.getUniformLocation(program, attri));
		}
	}

	public final function getAttributeMap() {
		return attributeMap;
	}

	public final function getUniformMap() {
		return uniformMap;
	}

	public final function getAttributeType(key) {
		return getAttributes().get(key);
	}

	public final function getUniformType(key) {
		return getUniforms().get(key);
	}

	function getAttributes() {
		return ['position' => 'vec2', 'color' => 'vec3'];
	}

	function getUniforms() {
		return ['u_resolution' => 'vec2', 'u_color' => 'vec4', 'u_matrix' => 'mat3'];
	}

	function getVertexShaderSource():String {
		return '#version 300 es

        uniform vec2 u_resolution;
		uniform mat3 u_matrix;

        in vec2 position;
		in vec3 color;
		out vec3 o_color;
        void main(){
            gl_Position = vec4((u_matrix * vec3(position, 1.0)).xy, 0, 1);
			o_color = color;
        }
        ';

	};

	function getFragmentShaderSource():String {
		return '#version 300 es
        precision highp float;

		uniform vec4 u_color;

		in vec3 o_color;
        out vec4 outColor;
        void main(){
            outColor = vec4(u_color.xyz, 1);
        }
        ';

	}
}
