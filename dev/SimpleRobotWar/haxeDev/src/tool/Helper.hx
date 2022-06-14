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
