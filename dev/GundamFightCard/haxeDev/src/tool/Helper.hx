package tool;

import haxe.Serializer;
import haxe.Unserializer;

function getMemonto(obj:Any):String {
	// final s = new hxbit.Serializer();
	// final bytes = s.serialize(obj);
	// return bytes.toHex();

	Serializer.USE_CACHE = true;
	return Serializer.run(obj);
}

function ofMemonto<T>(memonto:String, clz:Any):T {
	// final u = new hxbit.Serializer();
	// return cast u.unserialize(haxe.io.Bytes.ofHex(memonto), clz);

	return cast Unserializer.run(memonto);
}