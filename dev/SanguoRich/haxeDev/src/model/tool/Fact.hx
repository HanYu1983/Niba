package model.tool;

using Lambda;

function fact(v:Float, times:Float):Float {
	return Math.max(1.0 / times, Math.min(times, v));
}

function factAdd(v:Array<Float>):Float {
	return v.fold((c, a:Float) -> c * a, 1.0);
}

function factDivid(v:Float, times:Int):Float {
	return Math.pow(v, 1.0 / times);
}

function factAverage(v:Array<Float>):Float {
	return factDivid(factAdd(v), v.length);
}

// 0~1 -> 1~times
function factFromZeroOne(v:Float, times:Float):Float {
	return v * times;
}

// 1~times -> 0~1
function zeroOneFromFact(v:Float, times:Float):Float {
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
	}, 99999.0);
}

function zeroOneOn(f:Float, g:Float):Float {
	return f >= g ? 1.0 : 0.0;
}

function factVery(f:Float, fact:Float):Float {
	return Math.pow(f, fact);
}

function factFast(f:Float):Float {
	return factVery(f, 2);
}

function factSlow(f:Float):Float {
	return factVery(f, 1 / 2.0);
}
