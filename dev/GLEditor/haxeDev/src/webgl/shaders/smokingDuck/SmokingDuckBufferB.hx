package webgl.shaders.smokingDuck;

import webgl.WebglShader;

class SmokingDuckBufferB extends WebglShader {
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

        void main(){
            // 計算一個pixel的uv距離
			vec2 iResolution = vec2(1024.0, 768.0);
            vec2 fragCoord = v_texcoord * iResolution;
            float iTime = u_time * 0.001;
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

            ivec2 icoord = ivec2(fragCoord);
            float vel_x_left	= texelFetch(u_bufferA, icoord + ivec2(-1,  0) , 0).x;
            float vel_x_right	= texelFetch(u_bufferA, icoord + ivec2( 1,  0) , 0).x;
            float vel_y_bottom	= texelFetch(u_bufferA, icoord + ivec2( 0, -1) , 0).y;
            float vel_y_top		= texelFetch(u_bufferA, icoord + ivec2( 0,  1) , 0).y;
            float divergence	= (vel_x_right - vel_x_left + vel_y_top - vel_y_bottom) * 0.5;
            outColor = vec4(divergence,vec3(1)); 
            
            // outColor = vec4(1.0, 0.0, 0, 1.0);
        }
        ';

	}
}
