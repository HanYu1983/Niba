package tool;

typedef Flag = {
	var ints:Map<String, Int>;
	var strings:Map<String, String>;
	var bools:Map<String, Bool>;
}

function createFlag():Flag{
    return {
        ints: [],
        strings: [],
        bools: [],
    }
}