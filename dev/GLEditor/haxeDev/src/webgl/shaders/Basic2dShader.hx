package webgl.shaders;

@:nullSafety
class Basic2dShader extends WebglShader {
	public function new() {
		super();
	}
 
	override function getAttributes() {
		return ['position' => 'vec2', 'color' => 'vec3'];
	}

	override function getUniforms() {
		return ['u_resolution' => 'vec2', 'u_color' => 'vec4', 'u_matrix' => 'mat3'];
	}

	override function getVertexShaderSource():String {
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

	override function getFragmentShaderSource():String {
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
