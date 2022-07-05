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
        in vec4 color;

        // 組成modelMatrix的四個vec4
        in vec4 m1;
        in vec4 m2;
        in vec4 m3;
        in vec4 m4;

        uniform mat4 u_projectMatrix;
        uniform mat4 u_viewMatrix;

        out vec2 v_texcoord;
        out vec4 v_color;
        
        // all shaders have a main function
        // 所有的著色器都有main方法

        void main() {

          // 把矩陣組起來算位置坐標
          mat4 mvp = u_projectMatrix * inverse(u_viewMatrix) * mat4(m1, m2, m3, m4);
          gl_Position = mvp * position;

          v_texcoord = texcoord;
          v_color = color;
        }
        ';

	}

	override function getFragmentShaderSource():String {
		return '#version 300 es

        precision highp float;

        in vec2 v_texcoord;
        in vec4 v_color;
        
        uniform sampler2D u_texture;
        uniform vec4 u_color;
        
        // we need to declare an output for the fragment shader
        out vec4 outColor;
        
        void main() {
          outColor = texture(u_texture, v_texcoord);
        //  outColor = vec4(v_color.xyz, 1.0);
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
			'u_texture' => 'sampler2D'
		];
	}
}
