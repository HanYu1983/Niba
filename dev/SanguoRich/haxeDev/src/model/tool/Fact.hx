package model.tool;

using Lambda;

function fact(v:Float, times:Float):Float {
	return Math.max(1.0 / times, Math.min(times, v));
}

function factNot(f:Float):Float {
	if (f == 0) {
		throw new haxe.Exception("f == 0");
	}
	return 1 / f;
}

function factAnd(fs:Array<Float>):Float {
	return fs.fold((c, a) -> {
		return Math.min(c, a);
	}, 99999.0);
}

function factOr(fs:Array<Float>):Float {
	return fs.fold((c, a) -> {
		return Math.max(c, a);
	}, 99999.0);
}

function factVery(f:Float, e:Float):Float {
	return Math.pow(f, e);
}

private function factAverage(pairs:Array<Array<Float>>):Float {
	final total = pairs.fold((c, a:Float) -> {
		return switch c {
			case [_, f]:
				a + f;
			case _:
				throw new haxe.Exception("factAverage: not match");
		}
	}, 0.0);
	if (total == 0) {
		throw new haxe.Exception("factAverage: total == 0");
	}
	final v = pairs.fold((c, a:Float) -> {
		return switch c {
			case [v, f]:
				if (f == 1) {
					a * v;
				} else {
					a * Math.pow(v, f);
				}
			case _:
				throw new haxe.Exception("factAverage: not match");
		}
	}, 1.0);
	return Math.pow(v, 1.0 / total);
}

// 0~1 -> 1~times
private function factFromZeroOne(v:Float, times:Float):Float {
	return v * times;
}

// 1~times -> 0~1
private function zeroOneFromFact(v:Float, times:Float):Float {
	return v / times;
}

function zeroOne(v:Float):Float {
	return Math.max(0, Math.min(1, v));
}

function zeroOneSymbol(v:Float, g:Array<Float>):Float {
	if (g.length == 0) {
		throw new haxe.Exception("zeroOneSymbol: g.length == 0");
	}
	if (v >= 1) {
		return 1;
	}
	if (v <= 0) {
		return 0;
	}
	final offset = 1.0 / (g.length + 1);
	for (i in 0...(g.length + 1)) {
		final start = i == 0 ? 0.0 : g[i - 1];
		final end = i == g.length ? 1.0 : g[i];
		if (v < end) {
			final p = (v - start) / (end - start);
			return p * offset + i * offset;
		}
	}
	return 1;
}

function zeroOneNot(f:Float):Float {
	return 1 - f;
}

function zeroOneAnd(fs:Array<Float>):Float {
	return fs.fold((c, a) -> {
		return Math.min(c, a);
	}, 99999.0);
}

function zeroOneOr(fs:Array<Float>):Float {
	return fs.fold((c, a) -> {
		return Math.max(c, a);
	}, 0);
}

function zeroOneOn(f:Float, g:Float):Float {
	return f >= g ? 1.0 : 0.0;
}
