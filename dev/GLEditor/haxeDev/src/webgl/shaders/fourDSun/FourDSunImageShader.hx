package webgl.shaders.fourDSun;

import webgl.WebglShader;

class FourDSunImageShader extends WebglShader {
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
        uniform float u_time;

        out vec4 outColor;

		const mat3 ACESInputMat = mat3(
			0.59719, 0.35458, 0.04823,
			0.07600, 0.90834, 0.01566,
			0.02840, 0.13383, 0.83777
		);
		
		const mat3 ACESOutputMat = mat3(
			 1.60475, -0.53108, -0.07367,
			-0.10208,  1.10813, -0.00605,
			-0.00327, -0.07276,  1.07602
		);
		
		vec3 RRTAndODTFit( in vec3 v ) {
			vec3 a = v * (v + 0.0245786) - 0.000090537;
			vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
			return a / b;
		}
		
		vec3 ACESFitted( in vec3 color ) {
			color = color * ACESInputMat;
			color = RRTAndODTFit(color);
			color = color * ACESOutputMat;
			color = clamp(color, 0.0, 1.0);
			return color;
		}
		
		vec3 hash33(vec3 p3) {
			p3 = fract(p3 * vec3(.1031, .1030, .0973));
			p3 += dot(p3, p3.yxz+33.33);
			return fract((p3.xxy + p3.yxx)*p3.zyx);
		}

        void main(){
            // 計算一個pixel的uv距離
			vec2 iResolution = vec2(1024.0, 768.0);
            vec2 fragCoord = v_texcoord * iResolution;
            float iTime = u_time * 0.0001;
            float iFrame = u_time * .1;

            outColor = vec4( 1, 1,0,1);

			int SAMPLES = 5;
			float BLOOM_RADIUS = 30.0;
			float PI = 3.14159265359;
			float PHI = 1.61803398875;

			vec3 bloom = vec3(0);
			float totfac = 0.0;
			
			vec3 rnd = hash33(vec3(fragCoord, iFrame));
			float offset = rnd.x*2.0*PI;
			
			// bloom
			for (int i = 0 ; i < SAMPLES ; i++) {
				float theta = 2.0*PI*PHI*float(i) + offset;
				float radius = sqrt(float(i)) / sqrt(float(SAMPLES));
				radius *= BLOOM_RADIUS;
				vec2 offset = vec2(cos(theta), sin(theta))*radius;
				vec2 delta = vec2( 1.0+exp(-abs(offset.y)*0.1) , 0.5);
				offset *= delta;
				vec4 here = textureGrad(u_bufferA,(fragCoord+offset)/iResolution.xy, 
										vec2(0.001, 0)*BLOOM_RADIUS, vec2(0, 0.001)*BLOOM_RADIUS);
				float fact = smoothstep(BLOOM_RADIUS, 0.0, radius);
				bloom += here.rgb*0.05*fact;
				totfac += fact;
			}
			
			bloom /= totfac;
			
			vec2 uv = fragCoord/iResolution.xy;
			vec2 mo = uv*2.0-1.0;
			mo *= 0.01;
			outColor.r = textureLod(u_bufferA, uv-mo*0.1, 0.0).r;
			outColor.g = textureLod(u_bufferA, uv-mo*0.6, 0.0).g;
			outColor.b = textureLod(u_bufferA, uv-mo*1.0, 0.0).b;
			
			outColor.rgb += bloom*bloom*100.0;
			vec2 vi = fragCoord / iResolution.xy * 2.0 - 1.0;
			outColor.rgb *= (1.0-sqrt(dot(vi,vi)*0.45));
			outColor.rgb = ACESFitted(outColor.rgb);
			outColor.rgb = pow( outColor.rgb, vec3(1.0/2.2) );
			outColor.rgb += (rnd-0.5)*0.1;	

			// outColor = vec4( texture( u_bufferA, uv ));
        }
        ';

	}
}
