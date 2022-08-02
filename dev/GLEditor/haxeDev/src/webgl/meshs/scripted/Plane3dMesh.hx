package webgl.meshs.scripted;

import mme.math.glmatrix.Vec3Tools;
import mme.math.glmatrix.Vec3;

@:nullSafety
class Plane3dMesh extends ScriptedMesh {
	override function generateMesh() {
		super.generateMesh();

		final count = Math.floor(Math.max(4, 2));
		final size = 100;
		final gap = size / count;
		for (z in 0...count) {
			final isBottom = (z == count - 1);
			for (x in 0...count) {
				final isRight = (x == count - 1);
				if (!isBottom && !isRight) {
					final vid = z * count + x;
					indices.push(vid);
					indices.push(vid + count);
					indices.push(vid + 1);
					indices.push(vid + count);
					indices.push(vid + count + 1);
					indices.push(vid + 1);
				}

				final vert = Vec3.fromValues(x - count * 0.5, 0, z - count * 0.5);
				Vec3Tools.scale(vert, gap, vert);
				position.push(vert);
			}
		}
	}

	override function getNormal():Array<Float> {
		final pos = [];
		for (id in indices) {
			final vert = position[id];
			final normal = Vec3Tools.normalize(vert);
			pos.push(0.);
			pos.push(1.);
			pos.push(0.);
		}
		return pos;
	}
}
