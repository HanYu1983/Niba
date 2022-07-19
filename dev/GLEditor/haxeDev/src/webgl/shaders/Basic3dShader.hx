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
        in vec3 normal;
        in vec4 color;
        
        uniform mat4 u_modelMatrix;
        uniform mat4 u_projectMatrix;
        uniform mat4 u_viewMatrix;

        out vec2 v_texcoord;
        out vec3 v_worldNormal;
        out vec4 v_worldPos;

        void main() {

          // 把矩陣組起來算位置坐標
          mat4 mvp = u_projectMatrix * inverse(u_viewMatrix) * u_modelMatrix;
          gl_Position = mvp * position;

          v_texcoord = texcoord;
          v_worldNormal = mat3(u_modelMatrix) * normal;
          v_worldPos = u_modelMatrix * position;
        }
        ';

	}

	override function getFragmentShaderSource():String {
		return '#version 300 es

        precision highp float;

        in vec2 v_texcoord;
        in vec3 v_worldNormal;
        in vec4 v_worldPos;
        
        uniform sampler2D u_texture;

        uniform mat4 u_viewMatrix;
        uniform vec3 u_worldSpaceLightPos;
        uniform vec3 u_lightColor;
        uniform vec3 u_diffuseColor;
        uniform vec3 u_specularColor;
        uniform float u_gloss;
        
        // we need to declare an output for the fragment shader
        out vec4 outColor;
        
        void main() {
          vec3 worldCameraPos = vec3(u_viewMatrix[3][0], u_viewMatrix[3][1], u_viewMatrix[3][2]);
          vec3 viewDir = normalize(worldCameraPos - v_worldPos.xyz);
          vec3 ambient = vec3(.1, .1, .1);

          vec3 worldNormal = normalize(v_worldNormal);
          vec3 worldLightDir = normalize(u_worldSpaceLightPos - v_worldPos.xyz);
          float halfLambert = dot(worldNormal, worldLightDir) * .5 + .5;
          vec3 diffuse = u_lightColor * u_diffuseColor * halfLambert;

          vec3 halfDir = normalize(worldLightDir + viewDir);
          vec3 specular = u_lightColor * u_specularColor * pow(max(0., dot(worldNormal, halfDir)), u_gloss);
          
          vec3 color = ambient + diffuse + specular;
          outColor = vec4(color, 1.0);
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
			'u_worldSpaceLightPos' => 'vec3',
      'u_lightColor' => 'vec3',
      'u_diffuseColor' => 'vec3',
      'u_specularColor' => 'vec3',
      'u_gloss' => 'float',
		];
	}

	override function isInstance():Bool {
		return false;
	}
}
