package webgl.shaders;

@:nullSafety
class Basic3dInstanceShader extends WebglShader {
	public function new() {
		super();
	}

	override function isInstance():Bool {
		return true;
	}

	override function getVertexShaderSource():String {
		return '#version 300 es

        // an attribute is an input (in) to a vertex shader.
        // It will receive data from a buffer
        // 從buffer帶入頂點著色器的參數

        in vec4 position;
        in vec2 texcoord;
        in vec4 normal;
        in vec4 color;

        // 組成modelMatrix的四個vec4
        in vec4 m1;
        in vec4 m2;
        in vec4 m3;
        in vec4 m4;
        in vec4 color2;

        uniform mat4 u_projectMatrix;
        uniform mat4 u_viewMatrix;

        out vec2 v_texcoord;
        out vec4 v_color;
        out vec4 v_color2;
        out vec4 v_normal;
        out mat4 v_modelMatrix;
        
        // all shaders have a main function
        // 所有的著色器都有main方法

        void main() {

          v_modelMatrix = mat4(m1, m2, m3, m4);

          // 把矩陣組起來算位置坐標
          mat4 mvp = u_projectMatrix * inverse(u_viewMatrix) * v_modelMatrix;
          gl_Position = mvp * position;

          v_texcoord = texcoord;
          v_color = color;
          v_color2 = color2;
          // v_normal = v_modelMatrix * vec4(normal.xyz, 0);
          v_normal = normal;
        }
        ';

	}

	override function getFragmentShaderSource():String {
		return '#version 300 es

        precision highp float;

        in vec2 v_texcoord;
        in vec4 v_color;
        in vec4 v_color2;
        in vec4 v_normal;
        in mat4 v_modelMatrix;
        
        uniform sampler2D u_texture;
        uniform vec3 u_reverseLightDirection;
        
        // we need to declare an output for the fragment shader
        out vec4 outColor;
        
        void main() {
          vec4 c = texture(u_texture, v_texcoord);

          vec3 normal = normalize(v_normal.xyz);

          vec3 worldNormal = (transpose(inverse(v_modelMatrix)) * vec4(normal, 0)).xyz;

          float light = dot(worldNormal, u_reverseLightDirection);

          outColor = v_color2;
          outColor.rgb *= light;
        }
        ';

	}

	override function getAttributes():haxe.ds.Map<String, String> {
		return ['position' => 'vec4', 'texcoord' => 'vec2'];
	}

	override function getUniforms():haxe.ds.Map<String, String> {
		return [
			'u_projectMatrix' => 'mat4',
			'u_viewMatrix' => 'mat4',
			'u_color' => 'vec4',
			'u_texture' => 'sampler2D',
			'u_reverseLightDirection' => 'vec3',
		];
	}
}
