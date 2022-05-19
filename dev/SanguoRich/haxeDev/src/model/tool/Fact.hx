package model.tool;

using Lambda;

function factNormalizeFromZeroOne(f:Float, good:Float, bad:Float):Float {
	if (f >= good) {
		return 1 + (f - good) / (1.0 - good);
	} else {
		if (f >= bad) {
			return (f - bad) / (good - bad);
		}
		return 0.0;
	}
}

function factOn(f:Float, g:Float):Float {
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

function factNot(f:Float):Float {
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
