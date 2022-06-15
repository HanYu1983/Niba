package tool;

import haxe.Serializer;
import haxe.Unserializer;

function deepCopy<T>(v:T):T {
	final serializer = new Serializer();
	serializer.serialize(v);
	final memonto = serializer.toString();
	final unserializer = new Unserializer(memonto);
	return unserializer.unserialize();
}

function asyncSerial(fns:Array<(() -> Void)->Void>):Void {
	switch fns {
		case []:
		case _:
			final top = fns[0];
			top(()->{
				asyncSerial(fns.slice(1));
			});
	}
}
