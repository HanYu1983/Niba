package webgl.shaders.smokingDuck;

import webgl.WebglShader;

class SmokingDuckBufferC extends WebglShader {
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
			'u_bufferB' => 'sampler2D',
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

        uniform sampler2D u_bufferB;
        uniform sampler2D u_bufferD;

        uniform float u_time;

        out vec4 outColor;

        float div(int x,int y)
        {
            return texelFetch(u_bufferB, ivec2(gl_FragCoord.xy) + ivec2(x,  y) , 0).x;
        }

        float getDiv( void )
        {
            float p = 0.;
            p += 1.*div(-9, 0);
            p += 9.*div(-8, -1);
            p += 4.*div(-8, 0);
            p += 9.*div(-8, 1);
            p += 36.*div(-7, -2);
            p += 32.*div(-7, -1);
            p += 97.*div(-7, 0);
            p += 32.*div(-7, 1);
            p += 36.*div(-7, 2);
            p += 84.*div(-6, -3);
            p += 112.*div(-6, -2);
            p += 436.*div(-6, -1);
            p += 320.*div(-6, 0);
            p += 436.*div(-6, 1);
            p += 112.*div(-6, 2);
            p += 84.*div(-6, 3);
            p += 126.*div(-5, -4);
            p += 224.*div(-5, -3);
            p += 1092.*div(-5, -2);
            p += 1280.*div(-5, -1);
            p += 2336.*div(-5, 0);
            p += 1280.*div(-5, 1);
            p += 1092.*div(-5, 2);
            p += 224.*div(-5, 3);
            p += 126.*div(-5, 4);
            p += 126.*div(-4, -5);
            p += 280.*div(-4, -4);
            p += 1694.*div(-4, -3);
            p += 2752.*div(-4, -2);
            p += 6656.*div(-4, -1);
            p += 6464.*div(-4, 0);
            p += 6656.*div(-4, 1);
            p += 2752.*div(-4, 2);
            p += 1694.*div(-4, 3);
            p += 280.*div(-4, 4);
            p += 126.*div(-4, 5);
            p += 84.*div(-3, -6);
            p += 224.*div(-3, -5);
            p += 1694.*div(-3, -4);
            p += 3520.*div(-3, -3);
            p += 11016.*div(-3, -2);
            p += 16128.*div(-3, -1);
            p += 24608.*div(-3, 0);
            p += 16128.*div(-3, 1);
            p += 11016.*div(-3, 2);
            p += 3520.*div(-3, 3);
            p += 1694.*div(-3, 4);
            p += 224.*div(-3, 5);
            p += 84.*div(-3, 6);
            p += 36.*div(-2, -7);
            p += 112.*div(-2, -6);
            p += 1092.*div(-2, -5);
            p += 2752.*div(-2, -4);
            p += 11016.*div(-2, -3);
            p += 21664.*div(-2, -2);
            p += 47432.*div(-2, -1);
            p += 59712.*div(-2, 0);
            p += 47432.*div(-2, 1);
            p += 21664.*div(-2, 2);
            p += 11016.*div(-2, 3);
            p += 2752.*div(-2, 4);
            p += 1092.*div(-2, 5);
            p += 112.*div(-2, 6);
            p += 36.*div(-2, 7);
            p += 9.*div(-1, -8);
            p += 32.*div(-1, -7);
            p += 436.*div(-1, -6);
            p += 1280.*div(-1, -5);
            p += 6656.*div(-1, -4);
            p += 16128.*div(-1, -3);
            p += 47432.*div(-1, -2);
            p += 92224.*div(-1, -1);
            p += 163476.*div(-1, 0);
            p += 92224.*div(-1, 1);
            p += 47432.*div(-1, 2);
            p += 16128.*div(-1, 3);
            p += 6656.*div(-1, 4);
            p += 1280.*div(-1, 5);
            p += 436.*div(-1, 6);
            p += 32.*div(-1, 7);
            p += 9.*div(-1, 8);
            p += 1.*div(0, -9);
            p += 4.*div(0, -8);
            p += 97.*div(0, -7);
            p += 320.*div(0, -6);
            p += 2336.*div(0, -5);
            p += 6464.*div(0, -4);
            p += 24608.*div(0, -3);
            p += 59712.*div(0, -2);
            p += 163476.*div(0, -1);
            p += 409744.*div(0, 0);
            p += 163476.*div(0, 1);
            p += 59712.*div(0, 2);
            p += 24608.*div(0, 3);
            p += 6464.*div(0, 4);
            p += 2336.*div(0, 5);
            p += 320.*div(0, 6);
            p += 97.*div(0, 7);
            p += 4.*div(0, 8);
            p += 1.*div(0, 9);
            p += 9.*div(1, -8);
            p += 32.*div(1, -7);
            p += 436.*div(1, -6);
            p += 1280.*div(1, -5);
            p += 6656.*div(1, -4);
            p += 16128.*div(1, -3);
            p += 47432.*div(1, -2);
            p += 92224.*div(1, -1);
            p += 163476.*div(1, 0);
            p += 92224.*div(1, 1);
            p += 47432.*div(1, 2);
            p += 16128.*div(1, 3);
            p += 6656.*div(1, 4);
            p += 1280.*div(1, 5);
            p += 436.*div(1, 6);
            p += 32.*div(1, 7);
            p += 9.*div(1, 8);
            p += 36.*div(2, -7);
            p += 112.*div(2, -6);
            p += 1092.*div(2, -5);
            p += 2752.*div(2, -4);
            p += 11016.*div(2, -3);
            p += 21664.*div(2, -2);
            p += 47432.*div(2, -1);
            p += 59712.*div(2, 0);
            p += 47432.*div(2, 1);
            p += 21664.*div(2, 2);
            p += 11016.*div(2, 3);
            p += 2752.*div(2, 4);
            p += 1092.*div(2, 5);
            p += 112.*div(2, 6);
            p += 36.*div(2, 7);
            p += 84.*div(3, -6);
            p += 224.*div(3, -5);
            p += 1694.*div(3, -4);
            p += 3520.*div(3, -3);
            p += 11016.*div(3, -2);
            p += 16128.*div(3, -1);
            p += 24608.*div(3, 0);
            p += 16128.*div(3, 1);
            p += 11016.*div(3, 2);
            p += 3520.*div(3, 3);
            p += 1694.*div(3, 4);
            p += 224.*div(3, 5);
            p += 84.*div(3, 6);
            p += 126.*div(4, -5);
            p += 280.*div(4, -4);
            p += 1694.*div(4, -3);
            p += 2752.*div(4, -2);
            p += 6656.*div(4, -1);
            p += 6464.*div(4, 0);
            p += 6656.*div(4, 1);
            p += 2752.*div(4, 2);
            p += 1694.*div(4, 3);
            p += 280.*div(4, 4);
            p += 126.*div(4, 5);
            p += 126.*div(5, -4);
            p += 224.*div(5, -3);
            p += 1092.*div(5, -2);
            p += 1280.*div(5, -1);
            p += 2336.*div(5, 0);
            p += 1280.*div(5, 1);
            p += 1092.*div(5, 2);
            p += 224.*div(5, 3);
            p += 126.*div(5, 4);
            p += 84.*div(6, -3);
            p += 112.*div(6, -2);
            p += 436.*div(6, -1);
            p += 320.*div(6, 0);
            p += 436.*div(6, 1);
            p += 112.*div(6, 2);
            p += 84.*div(6, 3);
            p += 36.*div(7, -2);
            p += 32.*div(7, -1);
            p += 97.*div(7, 0);
            p += 32.*div(7, 1);
            p += 36.*div(7, 2);
            p += 9.*div(8, -1);
            p += 4.*div(8, 0);
            p += 9.*div(8, 1);
            p += 1.*div(9, 0);
            return  p / 1048576.;
        }

        float pre(int x,int y)
        {
            return texelFetch(u_bufferD, ivec2(gl_FragCoord.xy) + ivec2(x,  y) , 0).w;
        }

        float getPre( void )
        {
            float p = 0.;
            p += 1.*pre(-10, 0);
            p += 10.*pre(-9, -1);
            p += 10.*pre(-9, 1);
            p += 45.*pre(-8, -2);
            p += 100.*pre(-8, 0);
            p += 45.*pre(-8, 2);
            p += 120.*pre(-7, -3);
            p += 450.*pre(-7, -1);
            p += 450.*pre(-7, 1);
            p += 120.*pre(-7, 3);
            p += 210.*pre(-6, -4);
            p += 1200.*pre(-6, -2);
            p += 2025.*pre(-6, 0);
            p += 1200.*pre(-6, 2);
            p += 210.*pre(-6, 4);
            p += 252.*pre(-5, -5);
            p += 2100.*pre(-5, -3);
            p += 5400.*pre(-5, -1);
            p += 5400.*pre(-5, 1);
            p += 2100.*pre(-5, 3);
            p += 252.*pre(-5, 5);
            p += 210.*pre(-4, -6);
            p += 2520.*pre(-4, -4);
            p += 9450.*pre(-4, -2);
            p += 14400.*pre(-4, 0);
            p += 9450.*pre(-4, 2);
            p += 2520.*pre(-4, 4);
            p += 210.*pre(-4, 6);
            p += 120.*pre(-3, -7);
            p += 2100.*pre(-3, -5);
            p += 11340.*pre(-3, -3);
            p += 25200.*pre(-3, -1);
            p += 25200.*pre(-3, 1);
            p += 11340.*pre(-3, 3);
            p += 2100.*pre(-3, 5);
            p += 120.*pre(-3, 7);
            p += 45.*pre(-2, -8);
            p += 1200.*pre(-2, -6);
            p += 9450.*pre(-2, -4);
            p += 30240.*pre(-2, -2);
            p += 44100.*pre(-2, 0);
            p += 30240.*pre(-2, 2);
            p += 9450.*pre(-2, 4);
            p += 1200.*pre(-2, 6);
            p += 45.*pre(-2, 8);
            p += 10.*pre(-1, -9);
            p += 450.*pre(-1, -7);
            p += 5400.*pre(-1, -5);
            p += 25200.*pre(-1, -3);
            p += 52920.*pre(-1, -1);
            p += 52920.*pre(-1, 1);
            p += 25200.*pre(-1, 3);
            p += 5400.*pre(-1, 5);
            p += 450.*pre(-1, 7);
            p += 10.*pre(-1, 9);
            p += 1.*pre(0, -10);
            p += 100.*pre(0, -8);
            p += 2025.*pre(0, -6);
            p += 14400.*pre(0, -4);
            p += 44100.*pre(0, -2);
            p += 63504.*pre(0, 0);
            p += 44100.*pre(0, 2);
            p += 14400.*pre(0, 4);
            p += 2025.*pre(0, 6);
            p += 100.*pre(0, 8);
            p += 1.*pre(0, 10);
            p += 10.*pre(1, -9);
            p += 450.*pre(1, -7);
            p += 5400.*pre(1, -5);
            p += 25200.*pre(1, -3);
            p += 52920.*pre(1, -1);
            p += 52920.*pre(1, 1);
            p += 25200.*pre(1, 3);
            p += 5400.*pre(1, 5);
            p += 450.*pre(1, 7);
            p += 10.*pre(1, 9);
            p += 45.*pre(2, -8);
            p += 1200.*pre(2, -6);
            p += 9450.*pre(2, -4);
            p += 30240.*pre(2, -2);
            p += 44100.*pre(2, 0);
            p += 30240.*pre(2, 2);
            p += 9450.*pre(2, 4);
            p += 1200.*pre(2, 6);
            p += 45.*pre(2, 8);
            p += 120.*pre(3, -7);
            p += 2100.*pre(3, -5);
            p += 11340.*pre(3, -3);
            p += 25200.*pre(3, -1);
            p += 25200.*pre(3, 1);
            p += 11340.*pre(3, 3);
            p += 2100.*pre(3, 5);
            p += 120.*pre(3, 7);
            p += 210.*pre(4, -6);
            p += 2520.*pre(4, -4);
            p += 9450.*pre(4, -2);
            p += 14400.*pre(4, 0);
            p += 9450.*pre(4, 2);
            p += 2520.*pre(4, 4);
            p += 210.*pre(4, 6);
            p += 252.*pre(5, -5);
            p += 2100.*pre(5, -3);
            p += 5400.*pre(5, -1);
            p += 5400.*pre(5, 1);
            p += 2100.*pre(5, 3);
            p += 252.*pre(5, 5);
            p += 210.*pre(6, -4);
            p += 1200.*pre(6, -2);
            p += 2025.*pre(6, 0);
            p += 1200.*pre(6, 2);
            p += 210.*pre(6, 4);
            p += 120.*pre(7, -3);
            p += 450.*pre(7, -1);
            p += 450.*pre(7, 1);
            p += 120.*pre(7, 3);
            p += 45.*pre(8, -2);
            p += 100.*pre(8, 0);
            p += 45.*pre(8, 2);
            p += 10.*pre(9, -1);
            p += 10.*pre(9, 1);
            p += 1.*pre(10, 0);
            return  p / 1048576.;
        }

        void main(){
            // 計算一個pixel的uv距離
			vec2 iResolution = vec2(1024.0, 768.0);
            vec2 fragCoord = v_texcoord * iResolution;
            float iTime = u_time * 0.001;
            float iFrame = u_time * .1;

            float div = getDiv();
            float p = getPre() - div;
            outColor = vec4(p, div, vec3(1));
        }
        ';

	}
}
