package webgl.shaders;

class BasicEnviromentShader extends WebglShader {
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
        uniform mat4 u_viewMatrix;
        uniform mat4 u_projectMatrix;

        out vec3 v_worldPosition;
        out vec3 v_worldNormal;

        void main() {

          // 把矩陣組起來算位置坐標
          mat4 mvp = u_projectMatrix * inverse(u_viewMatrix) * u_modelMatrix;
          gl_Position = mvp * position;

          v_worldPosition = (u_modelMatrix * position).xyz;
          v_worldNormal = mat3(u_modelMatrix) * normal;
        }
        ';

	}

	override function getFragmentShaderSource():String {
		return '#version 300 es

        precision highp float;

        in vec3 v_worldPosition;
        in vec3 v_worldNormal;
        
        uniform mat4 u_modelMatrix;
        uniform mat4 u_viewMatrix;
        uniform samplerCube u_texture;
        
        // we need to declare an output for the fragment shader
        out vec4 outColor;
        
        void main() {
            vec3 worldNormal = normalize(v_worldNormal);
            vec3 worldCameraPosition = vec3(u_viewMatrix[3][0], u_viewMatrix[3][1], u_viewMatrix[3][2]);
            vec3 eyeToSurfaceDir = normalize(v_worldPosition - worldCameraPosition);
            vec3 direction = reflect(eyeToSurfaceDir, worldNormal);

            vec3 color = texture(u_texture, direction).rgb;
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
