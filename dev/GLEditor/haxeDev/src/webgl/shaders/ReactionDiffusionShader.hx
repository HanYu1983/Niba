package webgl.shaders;

@:nullSafety
class ReactionDiffusionShader extends WebglShader {
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
			'u_texture' => 'sampler2D',
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

        uniform sampler2D u_texture;
        uniform float u_time;

        out vec4 outColor;

        void main(){

            vec3 c = vec3(1,0,0);
            vec2 scale = vec2(1024.0,768.0);
            float A = 0.;
            float B = 0.;

            if(u_time <= 1000.0){
                A = 1.0;
                B = 1.0 - smoothstep(0.05, 0.051, length(v_texcoord - vec2(.5, .5)));
            }else{
                
                vec3 sample0 = texture(u_texture, v_texcoord - vec2(-1. , -1.) / scale.xx).xyz;
                vec3 sample1 = texture(u_texture, v_texcoord - vec2( 0. , -1.) / scale.xx).xyz;
                vec3 sample2 = texture(u_texture, v_texcoord - vec2( 1. , -1.) / scale.xx).xyz;
                
                vec3 sample3 = texture(u_texture, v_texcoord - vec2(-1. , 0.) / scale.xx).xyz;
                vec3 sample4 = texture(u_texture, v_texcoord - vec2( 0. , 0.) / scale.xx).xyz;
                vec3 sample5 = texture(u_texture, v_texcoord - vec2( 1. , 0.) / scale.xx).xyz;
                
                vec3 sample6 = texture(u_texture, v_texcoord - vec2(-1. , 1.) / scale.xx).xyz;
                vec3 sample7 = texture(u_texture, v_texcoord - vec2( 0. , 1.) / scale.xx).xyz;
                vec3 sample8 = texture(u_texture, v_texcoord - vec2( 1. , 1.) / scale.xx).xyz;

                float a = sample4.x;
                float b = sample4.y;

                vec2 corners = (sample0 + sample2 + sample6 + sample8).xy;
                vec2 edges   = (sample1 + sample3 + sample5 + sample7).xy;

                vec2 L2 = 0.05 * corners + 0.2 * edges - sample4.xy;

                float D_A = 0.99; // Diffusion of A
                float D_B = 0.5; // Diffusion of B
                float f = 0.055; // feed rate
                float k = 0.062; // kill rate
                
                if(mod(u_time, 16.) < 8.0) {
                    f = 0.04;
                    k = 0.06;
                }

                A = a + (D_A * L2.x - a*b*b + f * (1.0 - a));
                B = b + (D_B * L2.y + a*b*b - (k + f) * b);
            }

            outColor = vec4(A, B, 0., 1.0);
        }
        ';

	}
}
