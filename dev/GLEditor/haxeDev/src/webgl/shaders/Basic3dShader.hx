package webgl.shaders;

@:nullSafety
class Basic3dShader extends WebglShader {
	public function new() {
		super();
	}

	override function getVertexShaderSource():String {
		return '#version 300 es

        in vec4 position;
        in vec2 texcoord;
        in vec4 normal;
        in vec4 color;
        
        uniform mat4 u_modelMatrix;
        uniform mat4 u_projectMatrix;
        uniform mat4 u_viewMatrix;

        out vec2 v_texcoord;
        out vec3 v_normal;
        out mat4 v_modelMatrix;

        void main() {

          v_modelMatrix = u_modelMatrix;

          // 把矩陣組起來算位置坐標
          mat4 mvp = u_projectMatrix * inverse(u_viewMatrix) * v_modelMatrix;
          gl_Position = mvp * position;

          v_texcoord = texcoord;
          v_normal = normal.xyz;
        }
        ';

	}

	override function getFragmentShaderSource():String {
		return '#version 300 es

        precision highp float;

        in vec2 v_texcoord;
        in vec3 v_normal;
        in mat4 v_modelMatrix;
        
        uniform sampler2D u_texture;
        uniform vec4 u_color;
        uniform vec3 u_reverseLightDirection;
        
        // we need to declare an output for the fragment shader
        out vec4 outColor;
        
        void main() {
          vec4 c = texture(u_texture, v_texcoord);

          vec3 normal = normalize(v_normal.xyz);

          vec3 worldNormal = (transpose(inverse(v_modelMatrix)) * vec4(normal, 0)).xyz;

          float light = dot(worldNormal, u_reverseLightDirection);

          outColor = vec4(u_color.rgb, 1.0);
          outColor.rgb *= light;
        }
        ';

	}

	override function getAttributes():haxe.ds.Map<String, String> {
		return ['position' => 'vec4', 'texcoord' => 'vec2'];
	}

	override function getUniforms():haxe.ds.Map<String, String> {
		return return [
			'u_projectMatrix' => 'mat4',
			'u_viewMatrix' => 'mat4',
			'u_modelMatrix' => 'mat4',
			'u_color' => 'vec4',
			'u_texture' => 'sampler2D',
			'u_reverseLightDirection' => 'vec3',
		];
	}

	override function isInstance():Bool {
		return false;
	}
}
