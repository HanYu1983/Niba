package webgl.shaders.navierStokes2d;

import webgl.WebglShader;

class DivergenceCalculator extends WebglShader {
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
        uniform float u_time;

        out vec4 outColor;

        void main(){
            if(texture(u_velocity, v_texcoord).z > 0.0){
                outColor = vec4(0.0);
                return;
            }

            vec2 inverseResolution = vec2(1.0 / vec2(1024.0, 768.0));
			vec2 uv = v_texcoord;
			
			float x0 = texture(u_velocity, uv - vec2(inverseResolution.x, 0)).x;
			float x1 = texture(u_velocity, uv + vec2(inverseResolution.x, 0)).x;
			float y0 = texture(u_velocity, uv - vec2(0, inverseResolution.y)).y;
			float y1 = texture(u_velocity, uv + vec2(0, inverseResolution.y)).y;
			float divergence = ((x1-x0) + (y1-y0)) * 0.5;
			outColor = vec4(divergence);
        }
        ';

	}
}
