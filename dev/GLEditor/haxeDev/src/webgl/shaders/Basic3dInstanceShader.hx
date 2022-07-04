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
        in vec4 position;
        in vec2 texcoord;
        in vec4 m1;
        in vec4 m2;
        in vec4 m3;
        in vec4 m4;

        out vec2 v_texcoord;
        
        // all shaders have a main function
        void main() {
          // Multiply the position by the matrix.
          gl_Position = mat4(m1, m2, m3, m4) * position;

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
          // outColor = texture(u_texture, v_texcoord);
         outColor = vec4(v_texcoord, 0.0, 1.0);
        }
        ';

	}

	override function getAttributes():haxe.ds.Map<String, String> {
		return ['position' => 'vec4', 'texcoord' => 'vec2'];
	}

	override function getUniforms():haxe.ds.Map<String, String> {
		return ['u_matrix' => 'mat4', 'u_color' => 'vec4', 'u_texture' => 'sampler2D'];
	}
}
