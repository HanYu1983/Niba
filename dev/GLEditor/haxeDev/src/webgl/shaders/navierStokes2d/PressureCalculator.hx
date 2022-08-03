package webgl.shaders.navierStokes2d;

import webgl.WebglShader;

class PressureCalculator extends WebglShader {
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
			'u_divergence' => 'sampler2D',
			'u_pressure' => 'sampler2D',
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
        uniform sampler2D u_divergence;
		uniform sampler2D u_pressure;
		
        uniform float u_time;

        out vec4 outColor;

		float samplePressure(vec2 pos)
		{
			// Obstacle?
			if(texture(u_velocity, pos).z > 0.0)
			{
				return 0.0;
			}

			vec2 border = vec2(1.0 / vec2(1024.0, 768.0)) * 5.0;
			if(pos.x > (1.0 - border.x) || pos.y > (1.0 - border.y) || pos.x < border.x || pos.y < border.y)
			{
				return 0.0;
			}
			else
			{
				return texture(u_pressure, pos).x;
			}
		}

        void main(){

			vec2 inverseResolution = vec2(1.0 / vec2(1024.0, 768.0));
			vec2 uv = v_texcoord;

			float div = texture(u_divergence, uv).x;
			float x0 = samplePressure(uv - vec2(inverseResolution.x, 0));
			float x1 = samplePressure(uv + vec2(inverseResolution.x, 0));
			float y0 = samplePressure(uv - vec2(0, inverseResolution.y));
			float y1 = samplePressure(uv + vec2(0, inverseResolution.y));
			
			float result = (x0 + x1 + y0 + y1 - div) * 0.25;
			outColor = vec4(result);
        }
        ';

	}
}
