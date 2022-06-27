package webgl.shaders;

class Basic2dShader extends WebglShader {
	public function new() {
		super();
	}

	override function getVertexShaderSource():String {
		return '#version 300 es

        uniform vec2 u_resolution;

        in vec4 position;
		in vec4 color;
		out vec4 o_color;
        void main(){
            vec2 zeroToOne = position.xy / u_resolution;
            vec2 zeroToTwo = zeroToOne * 2.0;
            vec2 clipSpace = zeroToTwo - 1.0;
            gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
			o_color = color;
        }
        ';
	}

	override function getFragmentShaderSource():String {
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
