package webgl.shaders.smokingDuck;

import webgl.WebglShader;

class SmokingDuckBufferA extends WebglShader {
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

        float noise(vec3 p)
        {
            vec3 ip=floor(p);
            p-=ip; 
            vec3 s=vec3(7,157,113);
            vec4 h=vec4(0.,s.yz,s.y+s.z)+dot(ip,s);
            p=p*p*(3.-2.*p); 
            h=mix(fract(sin(h)*43758.5),fract(sin(h+s.x)*43758.5),p.x);
            h.xy=mix(h.xz,h.yw,p.y);
            return mix(h.x,h.y,p.z); 
        }

        vec2 fbm(vec3 p, int octaveNum)
        {
            vec2 acc = vec2(0);	
            float freq = 1.0;
            float amp = 0.5;
            vec3 shift = vec3(100);
            for (int i = 0; i < octaveNum; i++)
            {
                acc += vec2(noise(p), noise(p + vec3(0,0,10))) * amp;
                p = p * 2.0 + shift;
                amp *= 0.5;
            }
            return acc;
        }


        vec3 sampleMinusGradient(vec2 coord)
        {
            // return vec3(coord, 1.0);

            // 計算一個pixel的uv距離
			vec2 iResolution = vec2(1024.0, 768.0);
            vec3	veld	= texture(u_bufferA, coord / iResolution.xy).xyz;
            float	left	= texture(u_bufferD,(coord + vec2(-1, 0)) / iResolution.xy).w;
            float	right	= texture(u_bufferD,(coord + vec2( 1, 0)) / iResolution.xy).w;
            float	bottom	= texture(u_bufferD,(coord + vec2( 0,-1)) / iResolution.xy).w;
            float	top 	= texture(u_bufferD,(coord + vec2( 0, 1)) / iResolution.xy).w;
            vec2	grad 	= vec2(right - left,top - bottom) * 0.5;
            return	vec3(veld.xy - grad, veld.z);
        }

        float vignette(vec2 q, float v)
        {
            return pow(16.0 * q.x * q.y * (1.0 - q.x) * (1.0 - q.y), v);
        }

        vec2 duckPosition(float fframe, float aspectRatio)
        {
            float s = 0.02;
            return vec2(cos(fframe * s * 0.5) * aspectRatio, sin(fframe * s)) * 0.7;
        }

        void main(){
            // 計算一個pixel的uv距離
			vec2 iResolution = vec2(1024.0, 768.0);
            vec2 fragCoord = v_texcoord * iResolution;
            float iTime = u_time * 0.0001;
            float iFrame = u_time * .1;

            const float dissipation 	= 0.95;
            const float ballRadius		= 0.09;
            const float fogHeigth		= ballRadius * 3.;
            const int	nbSlice			= 24;
            const float fogSlice		= fogHeigth / float(nbSlice);
            const int	nbSphere 		= 1;
            const float shadowDensity 	= 15.;
            const float fogDensity 		= 5.;
            const float lightHeight     = 2.0;
            const float waterHeight     = 0.2;
            const float waterScale      = 0.025;
            const float duckScale       = 0.25;
            const vec3  lightPos        = vec3(0.5, lightHeight, 0.5);
            const float tau =  radians(360.);

            float vig = vignette(fragCoord / iResolution.xy, 0.6);
            // Euler advection
            vec2	velocity = sampleMinusGradient(fragCoord).xy;
            vec3	veld = sampleMinusGradient(fragCoord - dissipation * velocity).xyz;
            float	density = veld.z;
            velocity = veld.xy;

            vec2	uv = (2. * fragCoord - iResolution.xy) / iResolution.y;
            // Small perturbation
            vec2 detailNoise = fbm(vec3(uv*10.0, iTime + 30.), 7) - 0.5;
            
            // Injection
            vec2 injectionNoise = fbm(vec3(uv *1.5, iTime * 0.1 + 30.), 7) - 0.5;
            //velocity += injectionNoise * 0.1;
            density += (length(injectionNoise) * 0.002) * mix(1., vig, 1.0);
            velocity += injectionNoise * 0.01;

            // Inject emiter
            float influenceRadius = ballRadius * 2.;
            vec2 p = duckPosition(iFrame, iResolution.x / iResolution.y);
            float dist = distance(uv, p);
            if(dist < influenceRadius)
            {
                vec2 op = duckPosition(iFrame + 3., iResolution.x / iResolution.y);
                vec2 ballVelocity = p - op;
                float infuence = (influenceRadius - dist) / influenceRadius;
                density += infuence * length(ballVelocity) * 2.;
                density = max(0., density);
                velocity += infuence * (ballVelocity * 40. + detailNoise * 4.);   
            }

            density = min(1., density);
            density *= 0.99;     // damp
            veld = vec3(velocity, density);
            veld *=  mix(1., vig, 0.02);
            outColor = vec4(veld, texture(u_bufferD,fragCoord / iResolution.xy).w);
            // outColor = vec4( velocity,0, 1.0);
            // outColor = vec4(vec3(density), 1);
        }
        ';

	}
}
