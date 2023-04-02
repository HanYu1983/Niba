package;

class TestVer2 {
	public static function main() {
		trace("==== Test Start ====");
		final game = new model.ver2.design.Default.DefaultGame();
		model.ver2.design.Default.test(game);
		trace("==== Test Pass ====");
	}
}
