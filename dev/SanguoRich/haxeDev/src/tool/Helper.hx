package tool;

using StringTools;

function format(value:String, values:Array<Any>) {
	for (i in 0...values.length) {
		value = value.replace('{$i}', values[i]);
	}
	return value;
}
