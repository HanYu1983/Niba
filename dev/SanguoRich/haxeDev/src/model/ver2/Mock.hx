package model.ver2;

private var _randomMock:Array<Float> = [];

function setRandomMock(ary:Array<Float>) {
	_randomMock = ary;
}

function random():Float {
	if (_randomMock.length > 0) {
		final mockValue = _randomMock.shift();
		trace("Mock", "random", mockValue);
		return mockValue;
	}
	return Math.random();
}
