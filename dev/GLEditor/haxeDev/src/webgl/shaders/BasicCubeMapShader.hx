package webgl.shaders;

class BasicCubeMapShader extends WebglShader {
	public function new() {
		super();
	}

	override function getVertexShaderSource():String {
		return '#version 300 es

        in vec4 position;
        in vec2 texcoord;
        in vec3 normal;
        in vec4 color;
        
        uniform mat4 u_modelMatrix;
        uniform mat4 u_projectMatrix;
        uniform mat4 u_viewMatrix;

        out vec3 v_normal;

        void main() {

          // 把矩陣組起來算位置坐標
          mat4 mvp = u_projectMatrix * inverse(u_viewMatrix) * u_modelMatrix;
          gl_Position = mvp * position;

          v_normal = position.xyz;
        }
        ';

	}

	override function getFragmentShaderSource():String {
		return '#version 300 es

        precision highp float;

        in vec3 v_normal;
        
        uniform samplerCube u_texture;
        
        // we need to declare an output for the fragment shader
        out vec4 outColor;
        
        void main() {

            vec3 normal = normalize(v_normal);

            vec3 color = texture(u_texture, normal).rgb;
            outColor = vec4(color, 1.0);
        }
        ';

	}

	override function getUniforms():haxe.ds.Map<String, String> {
		return return [
			'u_projectMatrix' => 'mat4',
			'u_viewMatrix' => 'mat4',
			'u_modelMatrix' => 'mat4',
			'u_texture' => 'samplerCube',
		];
	}

	override function getAttributes():haxe.ds.Map<String, String> {
		return ['position' => 'vec4', 'texcoord' => 'vec2'];
	}

	override function isInstance():Bool {
		return false;
	}
}
