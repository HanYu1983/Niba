package webgl.meshs.scripted;

import mme.math.glmatrix.Vec3Tools;
import mme.math.glmatrix.Mat3Tools;
import mme.math.glmatrix.Vec3;

class Sphere3dMesh extends ScriptedMesh {
	final rowCount:Int;
	final coloumnCount:Int;
	final radius:Float;

	public function new(numInstances = 0, rowCount:Int = 12, coloumnCount:Int = 8, radius:Float = 100) {
		this.rowCount = rowCount;
		this.coloumnCount = coloumnCount;
		this.radius = radius;
		super(numInstances);
	}

	override function generateMesh() {
		super.generateMesh();

		final rowGap:Float = (Math.PI * 2) / rowCount;
		final columnGap:Float = Math.PI / coloumnCount;
		final lastVid = rowCount * (coloumnCount - 1) + 1;

		position.push(Vec3.fromValues(0, radius, 0));
		for (j in 1...coloumnCount) {
			final theta2 = j * columnGap;
			final z = Math.cos(theta2);
			final sxy = Math.sin(theta2);

			for (i in 0...rowCount) {
				final vid = position.length;
				final lastColumn = i == (rowCount - 1);

				// 第一行
				if (j == 1) {
					indices.push(0);
					if (lastColumn) {
						indices.push(1);
					} else {
						indices.push(vid + 1);
					}
					indices.push(vid);
				}

				// 最後一行
				if (j == coloumnCount - 1) {
					indices.push(vid);
					if (lastColumn) {
						indices.push(lastVid - rowCount);
					} else {
						indices.push(vid + 1);
					}
					indices.push(lastVid);
				} else {
					// 中間的行
					indices.push(vid);
					if (lastColumn) {
						indices.push(vid - (rowCount - 1));
					} else {
						indices.push(vid + 1);
					}
					indices.push(vid + rowCount);

					indices.push(vid + rowCount);
					if (lastColumn) {
						indices.push(vid - (rowCount - 1));
						indices.push(vid + 1);
					} else {
						indices.push(vid + 1);
						indices.push(vid + rowCount + 1);
					}
				}

				final theta = i * rowGap;

				final x = Math.cos(theta) * sxy;
				final y = Math.sin(theta) * sxy;

				final dir = Vec3.fromValues(x, z, y);

				// 基本上經過上面的計算，這個向量應該要是單位向量。如果不是就是算錯了
				// Vec3Tools.normalize(dir, dir);

				final vert = Vec3Tools.scale(dir, radius);
				position.push(vert);
			}
		}
		position.push(Vec3.fromValues(0, -radius, 0));
	}

	override function getNormal():Array<Float> {
		final pos = [];
		for (id in indices) {
			final vert = position[id];
			final normal = Vec3Tools.normalize(vert);
			pos.push(normal.x);
			pos.push(normal.y);
			pos.push(normal.z);
		}
		return pos;
	}

	override function is2d():Bool {
		return false;
	}
}
