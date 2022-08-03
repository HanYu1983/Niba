package webgl.shaders.navierStokes2d;

import webgl.WebglShader;

class Combine extends WebglShader {
	public function new() {
		super();
	}

	override function getAttributes() {
		return ['position' => 'vec2', 'texcoord' => 'vec2', 'color' => 'vec3'];
	}

	override function getUniforms() {
		return [
			'u_color' => 'vec4',
			'u_matrix' => 'mat3',
			'u_modelMatrix' => 'mat3',
			'u_velocity' => 'sampler2D',
			'u_pressure' => 'sampler2D',
			'u_divergence' => 'sampler2D',
			'u_time' => 'float'
		];
	}

	override function getVertexShaderSource():String {
		return '#version 300 es

        in vec2 position;
		in vec2 texcoord;
		in vec3 color;

		uniform mat3 u_matrix;
		uniform mat3 u_modelMatrix;

		out vec2 v_texcoord;

        void main(){
			
			// 投影矩陣把y做了反向，所以這裏的y要乘上-1
            gl_Position = vec4((u_matrix * u_modelMatrix * vec3(position, 1.0)).xy  * vec2(1,-1), 0, 1);
			v_texcoord = texcoord;
        }
        ';

	};

	override function getFragmentShaderSource():String {
		return '#version 300 es
        precision highp float;

		in vec2 v_texcoord;

        uniform sampler2D u_velocity;
		uniform sampler2D u_pressure;
		uniform sampler2D u_divergence;
        uniform float u_time;

        out vec4 outColor;

		vec4 showDivergence(vec2 uv){
			return abs(texture(u_divergence, uv));
		}

		vec4 showVelocity(vec2 uv){
			vec4 color = texture(u_velocity, uv);
			if(color.z > 0.0){
				return vec4(0.5);
			}else{
				return abs(color) * 0.008;
			}
		}

		vec4 showPressure(vec2 uv){
			return abs(texture(u_pressure, uv)) * 0.05;
		}

        void main(){

			outColor = showVelocity(v_texcoord);
			// outColor = showDivergence(v_texcoord);
			// outColor = showPressure(v_texcoord);
			outColor.a = 1.0;
        }
        ';

	}
}
