package webgl.shaders.navierStokes2d;

import webgl.WebglShader;

class VelocityCalculator extends WebglShader {
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
			'u_velocityAfter' => 'sampler2D',
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

        uniform sampler2D u_velocityAfter;
        uniform float u_time;

        out vec4 outColor;

        void main(){

			vec2 inverseResolution = vec2(1.0 / vec2(1024.0, 768.0));
			vec2 uv = v_texcoord;
			float time = u_time * .001;

			vec2 oldVelocity = texture(u_velocityAfter, uv).xy;
			vec2 samplePos = uv - oldVelocity * time * inverseResolution;
			vec2 outputVelocity = texture(u_velocityAfter, samplePos).xy;

			vec2 forceAreaMin = vec2(0.4, 0.4);
			vec2 forceAreaMax = vec2(0.6, 0.6);
			vec2 force = vec2(100, 0.0);
			if(uv.x > forceAreaMin.x && uv.x < forceAreaMax.x && uv.y > forceAreaMin.y && uv.y < forceAreaMax.y){
				outputVelocity += force * time;
			}

			if(uv.x > (1.0 - inverseResolution.x) && uv.x < (inverseResolution.x) && (uv.y > 1.0 - inverseResolution.y) && (uv.y < inverseResolution.y)){
				outputVelocity = vec2(0.0, 0.0);
			}

			outColor = vec4(outputVelocity, .0, 0.0);
        }
        ';

	}
}
