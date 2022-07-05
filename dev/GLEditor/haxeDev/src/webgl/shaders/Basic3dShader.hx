package webgl.shaders;

@:nullSafety
class Basic3dShader extends WebglShader {
	public function new() {
		super();
	}

	override function getVertexShaderSource():String {
		return '#version 300 es

        // an attribute is an input (in) to a vertex shader.
        // It will receive data from a buffer
        in vec4 position;
        in vec2 texcoord;
        in vec4 color;
        
        // A matrix to transform the positions by
        uniform mat4 u_modelMatrix;
        uniform mat4 u_projectMatrix;
        uniform mat4 u_viewMatrix;

        out vec2 v_texcoord;
        
        // all shaders have a main function
        void main() {
          // Multiply the position by the matrix.
          mat4 mvp = u_projectMatrix * inverse(u_viewMatrix) * u_modelMatrix;
          gl_Position = mvp * position;

          v_texcoord = texcoord;
        }
        ';

	}

	override function getFragmentShaderSource():String {
		return '#version 300 es

        precision highp float;

        in vec2 v_texcoord;
        
        uniform sampler2D u_texture;
        uniform vec4 u_color;
        
        // we need to declare an output for the fragment shader
        out vec4 outColor;
        
        void main() {
          outColor = texture(u_texture, v_texcoord);
         // outColor = vec4(v_texcoord, 0.0, 1.0);
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
			'u_texture' => 'sampler2D'
		];
	}

	override function isInstance():Bool {
		return false;
	}
}
