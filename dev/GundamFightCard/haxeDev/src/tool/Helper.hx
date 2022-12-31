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

private class Wrapper implements hxbit.Serializable {
	public function new() {}

	@:s public var hold:Dynamic;
}

function getMemontoWithWrapper(obj:Dynamic):String {
	final wrapper = new Wrapper();
	wrapper.hold = obj;
	return getMemonto(wrapper);
}

function ofMemontoWithWrapper<T>(memonto:String):T {
	final wrapper = ofMemonto(memonto, Wrapper);
	return cast wrapper.hold;
}
