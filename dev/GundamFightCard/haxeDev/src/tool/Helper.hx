package tool;

import haxe.Serializer;
import haxe.Unserializer;

function getMemonto(obj:Any):String {
	Serializer.USE_CACHE = true;
	return Serializer.run(obj);
}

function ofMemonto(memonto:String):Any {
	return Unserializer.run(memonto);
}

function copy(obj:Any):Any {
	return ofMemonto(getMemonto(obj));
}