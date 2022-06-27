package webgl.shaders.threeD;

class Basic3dShader extends WebglShader {
	public function new() {
		super();
	}

	override function getVertexShaderSource():String {
		return '#version 300 es

        // an attribute is an input (in) to a vertex shader.
        // It will receive data from a buffer
        in vec4 position;
        
        // A matrix to transform the positions by
        uniform mat4 u_matrix;
        
        // all shaders have a main function
        void main() {
          // Multiply the position by the matrix.
          gl_Position = u_matrix * position;
        }
        ';

	}

	override function getFragmentShaderSource():String {
		return '#version 300 es

        precision highp float;
        
        uniform vec4 u_color;
        
        // we need to declare an output for the fragment shader
        out vec4 outColor;
        
        void main() {
          outColor = u_color;
        }
        ';

	}

	override function getAttributes():haxe.ds.Map<String, String> {
		return ['position' => 'vec4'];
	}

	override function getUniforms():haxe.ds.Map<String, String> {
		return ['u_matrix' => 'mat4', 'u_color' => 'vec4'];
	}
}
