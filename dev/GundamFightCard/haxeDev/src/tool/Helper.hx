package tool;

function getMemonto(obj:hxbit.Serializable):String {
	final s = new hxbit.Serializer();
	final bytes = s.serialize(obj);
	return bytes.toHex();
}

function ofMemonto<T>(memonto:String, clz:Class<hxbit.Serializable>):T {
	final u = new hxbit.Serializer();
	return cast u.unserialize(haxe.io.Bytes.ofHex(memonto), clz);
}