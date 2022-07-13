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
            float t = u_time * .0001;
            if(t <= 0.05){
                c.r = c.g = c.b = 1.0 - smoothstep(t, t + .01, length(v_texcoord - vec2(.5, .5)));
            }else{
                c.rgb = texture(u_texture, v_texcoord).rgb;
            }

            outColor = vec4(c, 1);
        }
        ';

	}
}
