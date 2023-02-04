package webgl.shaders.smokingDuck;

import webgl.WebglShader;

class SmokingDuckImage extends WebglShader {
	public function new() {
		super();
	}

	override function getAttributes() {
		return ['position' => 'vec2', 'texcoord' => 'vec2', 'color' => 'vec3'];
	}

	override function getUniforms() {
		return [
			'u_matrix' => 'mat3',
			'u_modelMatrix' => 'mat3',
			'u_bufferA' => 'sampler2D',
			'u_bufferD' => 'sampler2D',
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

        uniform sampler2D u_bufferA;
		uniform sampler2D u_bufferD;
        uniform float u_time;

        out vec4 outColor;
		int bloomSize = 10;

		vec3 Bloom( in ivec2 uv)
		{
			vec3 bloom = vec3(0);
			float sum = 0.0;
		
			for (int x = -bloomSize; x <= bloomSize; x++)
			{
				for (int y = -bloomSize; y <= bloomSize; y++)
				{
					ivec2 off = ivec2(x, y);
					vec2  v = vec2(off) / sqrt(float(bloomSize * bloomSize + bloomSize * bloomSize));
					float w = exp(-4.0  * (dot(v, v)));
					sum += w;
					float c = dot(texelFetch(u_bufferD, uv + off, 0).rgb, vec3(1.0 / 3.0));
					bloom += pow(c, 3.0) * w;
		
				}
			}
			
			return bloom / sum;
		}

        void main(){

			vec2 iResolution = vec2(1024.0, 768.0);
			vec2 fragCoord = v_texcoord * iResolution;

			vec3 c = texelFetch(u_bufferD, ivec2(fragCoord), 0).rgb;
			c += Bloom(ivec2(fragCoord));
			outColor = vec4(sqrt(c), 1.0);
        }
        ';

	}
}
