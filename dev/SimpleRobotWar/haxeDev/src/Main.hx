package;

import hx.injection.ServiceCollection;
import common.TestController;
import common.Define;
import han.Model;
import haxe.Serializer;
import haxe.Unserializer;

class Main {
	public static function main() {
		trace("Start");
		final collection = new ServiceCollection();
		collection.addSingleton(TestController, TestController);
		collection.addSingleton(IModel, Model);

		final provider = collection.createProvider();
		final ctr = provider.getService(TestController);
		ctr.doIt();
		trace(ctr);

		Serializer.USE_CACHE = true;
		final s = Serializer.run(ctr);
		trace(s);
		final ctr2 = Unserializer.run(s);
		ctr2.doIt();
		ctr2.doIt();
		trace(ctr2);
	}
}
