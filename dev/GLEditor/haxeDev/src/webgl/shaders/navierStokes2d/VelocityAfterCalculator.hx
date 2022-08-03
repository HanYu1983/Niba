package webgl.shaders.navierStokes2d;

import webgl.WebglShader;

class VelocityAfterCalculator extends WebglShader {
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

		uniform sampler2D u_pressure;
		uniform sampler2D u_velocity;
        uniform float u_time;

        out vec4 outColor;

        void main(){

			// 計算一個pixel的uv距離
			vec2 inverseResolution = vec2(1.0 / vec2(1024.0, 768.0));
			vec2 uv = v_texcoord;

			// 速度由壓力的梯度決定(由高壓往低壓流動)
			float x0 = texture(u_pressure, uv - vec2(inverseResolution.x, 0.0)).x;
			float x1 = texture(u_pressure, uv + vec2(inverseResolution.x, 0.0)).x;
			float y0 = texture(u_pressure, uv - vec2(0.0, inverseResolution.y)).x;
			float y1 = texture(u_pressure, uv + vec2(0.0, inverseResolution.y)).x;

			// 不知道爲什麽要乘上0.5，可能是取平均的關係。
			vec2 pressureGradient = (vec2(x1, y1) - vec2(x0, y0)) * 0.5;

			// 取得本來的速度
			vec2 oldV = texture(u_velocity, v_texcoord).xy;
			// 新的速度
            outColor = vec4(oldV - pressureGradient, 0.0, 0.0);
        }
        ';

	}
}
