(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (Object.prototype.hasOwnProperty.call(value, key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	var unwrapped = _Json_unwrap(value);
	if (!(key === 'toJSON' && typeof unwrapped === 'function'))
	{
		object[key] = unwrapped;
	}
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'outerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (
		(typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		||
		(Array.isArray(_Json_unwrap(value)) && _VirtualDom_RE_js_html.test(String(_Json_unwrap(value))))
	)
		? _Json_wrap(
			/**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Basics$GT = {$: 'GT'};
var $author$project$Main$RunTests = {$: 'RunTests'};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Board$Player = {$: 'Player'};
var $author$project$Game$castleHpDefault = 20;
var $author$project$Board$aiCastlePos = {col: 9, row: 9};
var $author$project$Board$playerCastlePos = {col: 0, row: 0};
var $author$project$Board$initialBoardState = {
	aiCastlePos: $author$project$Board$aiCastlePos,
	aiPieces: _List_fromArray(
		[$author$project$Board$aiCastlePos]),
	playerCastlePos: $author$project$Board$playerCastlePos,
	playerPieces: _List_fromArray(
		[$author$project$Board$playerCastlePos])
};
var $author$project$Game$initialScore = 10;
var $author$project$Game$init = {aiBombUse: 0, aiCaptures: 0, aiCastleHp: $author$project$Game$castleHpDefault, aiLaserUse: 0, aiScore: $author$project$Game$initialScore, aiShieldUse: 0, board: $author$project$Board$initialBoardState, currentSide: $author$project$Board$Player, playerBombUse: 0, playerCaptures: 0, playerCastleHp: $author$project$Game$castleHpDefault, playerLaserUse: 0, playerScore: $author$project$Game$initialScore, playerShieldUse: 0, protectedCells: _List_Nil, shieldedCells: _List_Nil, turn: 1};
var $author$project$Main$initialModel = {aiActionLog: _List_Nil, aiItemPendingApply: $elm$core$Maybe$Nothing, errorMessage: $elm$core$Maybe$Nothing, gameState: $author$project$Game$init, itemMode: $elm$core$Maybe$Nothing, itemPendingApply: $elm$core$Maybe$Nothing, laserPending: $elm$core$Maybe$Nothing, legalMoves: _List_Nil, previewCells: _List_Nil, selectedPiece: $elm$core$Maybe$Nothing, testErrors: _List_Nil};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Board$AI = {$: 'AI'};
var $author$project$Main$maxLogLines = 80;
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Main$addLog = F2(
	function (line, model) {
		return _Utils_update(
			model,
			{
				aiActionLog: A2(
					$elm$core$List$take,
					$author$project$Main$maxLogLines,
					A2($elm$core$List$cons, line, model.aiActionLog))
			});
	});
var $author$project$Items$Bomb = {$: 'Bomb'};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$Basics$not = _Basics_not;
var $author$project$Board$positionEquals = F2(
	function (a, b) {
		return _Utils_eq(a.row, b.row) && _Utils_eq(a.col, b.col);
	});
var $author$project$Game$protectedPositions = function (state) {
	return A2(
		$elm$core$List$map,
		function ($) {
			return $.position;
		},
		A2(
			$elm$core$List$filter,
			function (c) {
				return c.remainingTurns > 0;
			},
			state.protectedCells));
};
var $author$project$Game$shieldedPositions = function (state) {
	return state.shieldedCells;
};
var $author$project$Items$applyBombToCells = F3(
	function (state, center, cells) {
		var sh = $author$project$Game$shieldedPositions(state);
		var prot = $author$project$Game$protectedPositions(state);
		var isProtected = function (p) {
			return A2(
				$elm$core$List$any,
				$author$project$Board$positionEquals(p),
				prot);
		};
		var hasShield = function (p) {
			return A2(
				$elm$core$List$any,
				$author$project$Board$positionEquals(p),
				sh);
		};
		var step = F2(
			function (pos, acc) {
				if (isProtected(pos)) {
					return acc;
				} else {
					if (hasShield(pos)) {
						return _Utils_update(
							acc,
							{
								shielded: A2(
									$elm$core$List$filter,
									A2(
										$elm$core$Basics$composeR,
										$author$project$Board$positionEquals(pos),
										$elm$core$Basics$not),
									acc.shielded)
							});
					} else {
						if (A2($author$project$Board$positionEquals, pos, $author$project$Board$playerCastlePos)) {
							return _Utils_update(
								acc,
								{playerHp: acc.playerHp - 3});
						} else {
							if (A2($author$project$Board$positionEquals, pos, $author$project$Board$aiCastlePos)) {
								return _Utils_update(
									acc,
									{aiHp: acc.aiHp - 3});
							} else {
								var b = acc.board;
								var nb = _Utils_update(
									b,
									{
										aiPieces: A2(
											$elm$core$List$filter,
											A2(
												$elm$core$Basics$composeR,
												$author$project$Board$positionEquals(pos),
												$elm$core$Basics$not),
											b.aiPieces),
										playerPieces: A2(
											$elm$core$List$filter,
											A2(
												$elm$core$Basics$composeR,
												$author$project$Board$positionEquals(pos),
												$elm$core$Basics$not),
											b.playerPieces)
									});
								return _Utils_update(
									acc,
									{board: nb});
							}
						}
					}
				}
			});
		return A3(
			$elm$core$List$foldl,
			step,
			{aiHp: state.aiCastleHp, board: state.board, playerHp: state.playerCastleHp, shielded: state.shieldedCells},
			cells);
	});
var $author$project$Board$boardSize = 10;
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$Board$inBounds = function (pos) {
	return (pos.row >= 0) && ((_Utils_cmp(pos.row, $author$project$Board$boardSize) < 0) && ((pos.col >= 0) && (_Utils_cmp(pos.col, $author$project$Board$boardSize) < 0)));
};
var $author$project$Items$bombAffectedCells = function (center) {
	return A2(
		$elm$core$List$filter,
		$author$project$Board$inBounds,
		_List_fromArray(
			[
				center,
				{col: center.col, row: center.row - 1},
				{col: center.col, row: center.row + 1},
				{col: center.col - 1, row: center.row},
				{col: center.col + 1, row: center.row}
			]));
};
var $author$project$Board$Castle = function (a) {
	return {$: 'Castle', a: a};
};
var $author$project$Board$Piece = function (a) {
	return {$: 'Piece', a: a};
};
var $author$project$Board$Empty = {$: 'Empty'};
var $author$project$Board$cellAt = F2(
	function (state, pos) {
		return (!$author$project$Board$inBounds(pos)) ? $author$project$Board$Empty : (A2(
			$elm$core$List$any,
			$author$project$Board$positionEquals(pos),
			state.playerPieces) ? $author$project$Board$Piece($author$project$Board$Player) : (A2(
			$elm$core$List$any,
			$author$project$Board$positionEquals(pos),
			state.aiPieces) ? $author$project$Board$Piece($author$project$Board$AI) : (A2($author$project$Board$positionEquals, pos, state.playerCastlePos) ? $author$project$Board$Castle($author$project$Board$Player) : (A2($author$project$Board$positionEquals, pos, state.aiCastlePos) ? $author$project$Board$Castle($author$project$Board$AI) : $author$project$Board$Empty))));
	});
var $author$project$Items$cost = function (item) {
	switch (item.$) {
		case 'Bomb':
			return 3;
		case 'Laser':
			return 4;
		default:
			return 2;
	}
};
var $author$project$Items$canUseBomb = F3(
	function (state, side, center) {
		var scoreOk = function () {
			if (side.$ === 'Player') {
				return _Utils_cmp(
					state.playerScore,
					$author$project$Items$cost($author$project$Items$Bomb)) > -1;
			} else {
				return _Utils_cmp(
					state.aiScore,
					$author$project$Items$cost($author$project$Items$Bomb)) > -1;
			}
		}();
		var cell = A2($author$project$Board$cellAt, state.board, center);
		var isEnemyPieceOrCastle = function () {
			if (side.$ === 'Player') {
				return _Utils_eq(
					cell,
					$author$project$Board$Piece($author$project$Board$AI)) || _Utils_eq(
					cell,
					$author$project$Board$Castle($author$project$Board$AI));
			} else {
				return _Utils_eq(
					cell,
					$author$project$Board$Piece($author$project$Board$Player)) || _Utils_eq(
					cell,
					$author$project$Board$Castle($author$project$Board$Player));
			}
		}();
		return scoreOk && isEnemyPieceOrCastle;
	});
var $author$project$Items$applyBomb = F3(
	function (state, side, center) {
		if (!A3($author$project$Items$canUseBomb, state, side, center)) {
			return $elm$core$Result$Err('炸彈目標不合法');
		} else {
			var affected = $author$project$Items$bombAffectedCells(center);
			var res = A3($author$project$Items$applyBombToCells, state, center, affected);
			var _v0 = function () {
				if (side.$ === 'Player') {
					return _Utils_Tuple2(
						state.playerScore - $author$project$Items$cost($author$project$Items$Bomb),
						state.aiScore);
				} else {
					return _Utils_Tuple2(
						state.playerScore,
						state.aiScore - $author$project$Items$cost($author$project$Items$Bomb));
				}
			}();
			var newPlayerScore = _v0.a;
			var newAiScore = _v0.b;
			return $elm$core$Result$Ok(
				_Utils_update(
					state,
					{aiCastleHp: res.aiHp, aiScore: newAiScore, board: res.board, playerCastleHp: res.playerHp, playerScore: newPlayerScore, shieldedCells: res.shielded}));
		}
	});
var $author$project$Items$Laser = {$: 'Laser'};
var $author$project$Items$applyLaserToLine = F4(
	function (state, line, newPlayerScore, newAiScore) {
		var sh = $author$project$Game$shieldedPositions(state);
		var prot = $author$project$Game$protectedPositions(state);
		var isProtected = function (p) {
			return A2(
				$elm$core$List$any,
				$author$project$Board$positionEquals(p),
				prot);
		};
		var initial = {aiHp: state.aiCastleHp, board: state.board, playerHp: state.playerCastleHp, shielded: state.shieldedCells};
		var hasShield = function (p) {
			return A2(
				$elm$core$List$any,
				$author$project$Board$positionEquals(p),
				sh);
		};
		var step = F2(
			function (pos, acc) {
				if (isProtected(pos)) {
					return acc;
				} else {
					if (hasShield(pos)) {
						return _Utils_update(
							acc,
							{
								shielded: A2(
									$elm$core$List$filter,
									A2(
										$elm$core$Basics$composeR,
										$author$project$Board$positionEquals(pos),
										$elm$core$Basics$not),
									acc.shielded)
							});
					} else {
						if (A2($author$project$Board$positionEquals, pos, $author$project$Board$playerCastlePos)) {
							return _Utils_update(
								acc,
								{playerHp: acc.playerHp - 3});
						} else {
							if (A2($author$project$Board$positionEquals, pos, $author$project$Board$aiCastlePos)) {
								return _Utils_update(
									acc,
									{aiHp: acc.aiHp - 3});
							} else {
								var b = acc.board;
								var nb = _Utils_update(
									b,
									{
										aiPieces: A2(
											$elm$core$List$filter,
											A2(
												$elm$core$Basics$composeR,
												$author$project$Board$positionEquals(pos),
												$elm$core$Basics$not),
											b.aiPieces),
										playerPieces: A2(
											$elm$core$List$filter,
											A2(
												$elm$core$Basics$composeR,
												$author$project$Board$positionEquals(pos),
												$elm$core$Basics$not),
											b.playerPieces)
									});
								return _Utils_update(
									acc,
									{board: nb});
							}
						}
					}
				}
			});
		var res = A3($elm$core$List$foldl, step, initial, line);
		return _Utils_update(
			state,
			{aiCastleHp: res.aiHp, aiScore: newAiScore, board: res.board, playerCastleHp: res.playerHp, playerScore: newPlayerScore, shieldedCells: res.shielded});
	});
var $author$project$Items$laserLine = F2(
	function (isRow, index) {
		return isRow ? A2(
			$elm$core$List$map,
			function (c) {
				return {col: c, row: index};
			},
			A2($elm$core$List$range, 0, $author$project$Board$boardSize - 1)) : A2(
			$elm$core$List$map,
			function (r) {
				return {col: index, row: r};
			},
			A2($elm$core$List$range, 0, $author$project$Board$boardSize - 1));
	});
var $author$project$Items$applyLaser = F4(
	function (state, side, isRow, index) {
		var line = A2($author$project$Items$laserLine, isRow, index);
		if (side.$ === 'Player') {
			return (_Utils_cmp(
				state.playerScore,
				$author$project$Items$cost($author$project$Items$Laser)) < 0) ? $elm$core$Result$Err('分數不足') : $elm$core$Result$Ok(
				A4(
					$author$project$Items$applyLaserToLine,
					state,
					line,
					state.playerScore - $author$project$Items$cost($author$project$Items$Laser),
					state.aiScore));
		} else {
			return (_Utils_cmp(
				state.aiScore,
				$author$project$Items$cost($author$project$Items$Laser)) < 0) ? $elm$core$Result$Err('分數不足') : $elm$core$Result$Ok(
				A4(
					$author$project$Items$applyLaserToLine,
					state,
					line,
					state.playerScore,
					state.aiScore - $author$project$Items$cost($author$project$Items$Laser)));
		}
	});
var $author$project$Items$Shield = {$: 'Shield'};
var $author$project$Items$canUseShield = F3(
	function (state, side, pos) {
		var scoreOk = function () {
			if (side.$ === 'Player') {
				return _Utils_cmp(
					state.playerScore,
					$author$project$Items$cost($author$project$Items$Shield)) > -1;
			} else {
				return _Utils_cmp(
					state.aiScore,
					$author$project$Items$cost($author$project$Items$Shield)) > -1;
			}
		}();
		var cell = A2($author$project$Board$cellAt, state.board, pos);
		var isOwnPieceOrCastle = function () {
			if (side.$ === 'Player') {
				return _Utils_eq(
					cell,
					$author$project$Board$Piece($author$project$Board$Player)) || _Utils_eq(
					cell,
					$author$project$Board$Castle($author$project$Board$Player));
			} else {
				return _Utils_eq(
					cell,
					$author$project$Board$Piece($author$project$Board$AI)) || _Utils_eq(
					cell,
					$author$project$Board$Castle($author$project$Board$AI));
			}
		}();
		var alreadyShielded = A2(
			$elm$core$List$any,
			$author$project$Board$positionEquals(pos),
			state.shieldedCells);
		return scoreOk && (isOwnPieceOrCastle && (!alreadyShielded));
	});
var $author$project$Items$applyShield = F3(
	function (state, side, pos) {
		if (!A3($author$project$Items$canUseShield, state, side, pos)) {
			return $elm$core$Result$Err('護盾目標不合法');
		} else {
			var newShielded = _Utils_ap(
				state.shieldedCells,
				_List_fromArray(
					[pos]));
			var _v0 = function () {
				if (side.$ === 'Player') {
					return _Utils_Tuple2(
						state.playerScore - $author$project$Items$cost($author$project$Items$Shield),
						state.aiScore);
				} else {
					return _Utils_Tuple2(
						state.playerScore,
						state.aiScore - $author$project$Items$cost($author$project$Items$Shield));
				}
			}();
			var newPlayerScore = _v0.a;
			var newAiScore = _v0.b;
			return $elm$core$Result$Ok(
				_Utils_update(
					state,
					{aiScore: newAiScore, playerScore: newPlayerScore, shieldedCells: newShielded}));
		}
	});
var $author$project$Game$AIWins = {$: 'AIWins'};
var $author$project$Game$Draw = {$: 'Draw'};
var $author$project$Game$Ongoing = {$: 'Ongoing'};
var $author$project$Game$PlayerWins = {$: 'PlayerWins'};
var $author$project$Game$maxTurns = 100;
var $author$project$Game$checkVictory = function (state) {
	return (state.aiCastleHp <= 0) ? $author$project$Game$PlayerWins : ((state.playerCastleHp <= 0) ? $author$project$Game$AIWins : ((_Utils_cmp(state.turn, $author$project$Game$maxTurns) > 0) ? ((_Utils_cmp(state.playerScore, state.aiScore) > 0) ? $author$project$Game$PlayerWins : ((_Utils_cmp(state.aiScore, state.playerScore) > 0) ? $author$project$Game$AIWins : $author$project$Game$Draw)) : $author$project$Game$Ongoing));
};
var $author$project$Game$decrementProtectionList = function (list) {
	return A2(
		$elm$core$List$filter,
		function (c) {
			return c.remainingTurns > 0;
		},
		A2(
			$elm$core$List$map,
			function (c) {
				return _Utils_update(
					c,
					{remainingTurns: c.remainingTurns - 1});
			},
			list));
};
var $author$project$Game$decrementProtection = function (state) {
	return _Utils_update(
		state,
		{
			protectedCells: $author$project$Game$decrementProtectionList(state.protectedCells)
		});
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$posStr = function (p) {
	return '(' + ($elm$core$String$fromInt(p.row) + (',' + ($elm$core$String$fromInt(p.col) + ')')));
};
var $author$project$Main$recordPlayerBomb = function (s) {
	return _Utils_update(
		s,
		{playerBombUse: s.playerBombUse + 1});
};
var $author$project$Main$recordPlayerLaser = function (s) {
	return _Utils_update(
		s,
		{playerLaserUse: s.playerLaserUse + 1});
};
var $author$project$Main$recordPlayerShield = function (s) {
	return _Utils_update(
		s,
		{playerShieldUse: s.playerShieldUse + 1});
};
var $author$project$Main$ApplyAIPendingItem = {$: 'ApplyAIPendingItem'};
var $author$project$Main$BombAt = function (a) {
	return {$: 'BombAt', a: a};
};
var $author$project$Main$LaserAt = F3(
	function (a, b, c) {
		return {$: 'LaserAt', a: a, b: b, c: c};
	});
var $author$project$Main$ShieldAt = function (a) {
	return {$: 'ShieldAt', a: a};
};
var $author$project$Game$oppositeSide = function (side) {
	if (side.$ === 'Player') {
		return $author$project$Board$AI;
	} else {
		return $author$project$Board$Player;
	}
};
var $author$project$Game$attackBlockedByProtection = function (state) {
	return _Utils_update(
		state,
		{
			currentSide: $author$project$Game$oppositeSide(state.currentSide)
		});
};
var $author$project$Game$removeShieldAt = F2(
	function (pos, list) {
		return A2(
			$elm$core$List$filter,
			A2(
				$elm$core$Basics$composeR,
				$author$project$Board$positionEquals(pos),
				$elm$core$Basics$not),
			list);
	});
var $author$project$Game$attackBlockedByShield = F2(
	function (state, pos) {
		return _Utils_update(
			state,
			{
				currentSide: $author$project$Game$oppositeSide(state.currentSide),
				shieldedCells: A2($author$project$Game$removeShieldAt, pos, state.shieldedCells)
			});
	});
var $author$project$Game$attackCastleByAI = F2(
	function (state, to) {
		var b = state.board;
		var newBoard = _Utils_update(
			b,
			{
				aiPieces: _Utils_ap(
					b.aiPieces,
					_List_fromArray(
						[to]))
			});
		var afterMove = _Utils_update(
			state,
			{
				aiScore: state.aiScore + 1,
				board: newBoard,
				currentSide: $author$project$Board$Player,
				playerCastleHp: state.playerCastleHp - 3,
				protectedCells: $author$project$Game$decrementProtectionList(state.protectedCells),
				turn: state.turn + 1
			});
		return afterMove;
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $author$project$Rules$cannonDirections = _List_fromArray(
	[
		_Utils_Tuple2(-1, 0),
		_Utils_Tuple2(1, 0),
		_Utils_Tuple2(0, -1),
		_Utils_Tuple2(0, 1)
	]);
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Rules$maxCannonDistance = 10;
var $author$project$Rules$findFirstPieceInDirection = F5(
	function (state, from, dr, dc, startDist) {
		findFirstPieceInDirection:
		while (true) {
			if (_Utils_cmp(startDist, $author$project$Rules$maxCannonDistance) > 0) {
				return $elm$core$Maybe$Nothing;
			} else {
				var pos = {col: from.col + (dc * startDist), row: from.row + (dr * startDist)};
				if (!$author$project$Board$inBounds(pos)) {
					return $elm$core$Maybe$Nothing;
				} else {
					var _v0 = A2($author$project$Board$cellAt, state, pos);
					if (_v0.$ === 'Empty') {
						var $temp$state = state,
							$temp$from = from,
							$temp$dr = dr,
							$temp$dc = dc,
							$temp$startDist = startDist + 1;
						state = $temp$state;
						from = $temp$from;
						dr = $temp$dr;
						dc = $temp$dc;
						startDist = $temp$startDist;
						continue findFirstPieceInDirection;
					} else {
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(startDist, pos));
					}
				}
			}
		}
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Rules$scanCannonCapture = F6(
	function (state, from, dr, dc, protectedPositions, shieldedPositions) {
		return A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				$elm$core$List$singleton,
				A2(
					$elm$core$Maybe$andThen,
					function (_v0) {
						var screenDist = _v0.a;
						var toDist = screenDist + 1;
						var to = {col: from.col + (dc * toDist), row: from.row + (dr * toDist)};
						if ((_Utils_cmp(toDist, $author$project$Rules$maxCannonDistance) > 0) || (!$author$project$Board$inBounds(to))) {
							return $elm$core$Maybe$Nothing;
						} else {
							var _v1 = A2($author$project$Board$cellAt, state, to);
							_v1$2:
							while (true) {
								switch (_v1.$) {
									case 'Piece':
										if (_v1.a.$ === 'Player') {
											var _v2 = _v1.a;
											return $elm$core$Maybe$Just(to);
										} else {
											break _v1$2;
										}
									case 'Castle':
										if (_v1.a.$ === 'Player') {
											var _v3 = _v1.a;
											return $elm$core$Maybe$Just(to);
										} else {
											break _v1$2;
										}
									default:
										break _v1$2;
								}
							}
							return $elm$core$Maybe$Nothing;
						}
					},
					A5($author$project$Rules$findFirstPieceInDirection, state, from, dr, dc, 1))));
	});
var $author$project$Rules$scanLine = F6(
	function (state, from, dr, dc, dist, count) {
		if (_Utils_cmp(dist, $author$project$Rules$maxCannonDistance) > -1) {
			return _List_Nil;
		} else {
			var d = dist + 1;
			var to = {col: from.col + (dc * d), row: from.row + (dr * d)};
			if (!$author$project$Board$inBounds(to)) {
				return _List_Nil;
			} else {
				var _v0 = A2($author$project$Board$cellAt, state, to);
				if (_v0.$ === 'Empty') {
					return A2(
						$elm$core$List$cons,
						to,
						A6($author$project$Rules$scanLine, state, from, dr, dc, d, count + 1));
				} else {
					return _List_Nil;
				}
			}
		}
	});
var $author$project$Rules$cannonLegalMoves = F4(
	function (state, from, protectedPositions, shieldedPositions) {
		return A2(
			$elm$core$List$filter,
			function (to) {
				return !A2($author$project$Board$positionEquals, to, from);
			},
			A2(
				$elm$core$List$concatMap,
				function (_v0) {
					var dr = _v0.a;
					var dc = _v0.b;
					var emptyInDirection = A6($author$project$Rules$scanLine, state, from, dr, dc, 0, 0);
					var captureInDirection = A6($author$project$Rules$scanCannonCapture, state, from, dr, dc, protectedPositions, shieldedPositions);
					return _Utils_ap(emptyInDirection, captureInDirection);
				},
				$author$project$Rules$cannonDirections));
	});
var $author$project$Game$captureByAI = F2(
	function (state, to) {
		var newProtected = _Utils_ap(
			$author$project$Game$decrementProtectionList(state.protectedCells),
			_List_fromArray(
				[
					{position: to, remainingTurns: 1}
				]));
		var b = state.board;
		var newPlayerPieces = A2(
			$elm$core$List$filter,
			A2(
				$elm$core$Basics$composeR,
				$author$project$Board$positionEquals(to),
				$elm$core$Basics$not),
			b.playerPieces);
		var newBoard = _Utils_update(
			b,
			{
				aiPieces: _Utils_ap(
					b.aiPieces,
					_List_fromArray(
						[to])),
				playerPieces: newPlayerPieces
			});
		return _Utils_update(
			state,
			{aiCaptures: state.aiCaptures + 1, aiScore: state.aiScore + 1, board: newBoard, currentSide: $author$project$Board$Player, protectedCells: newProtected, turn: state.turn + 1});
	});
var $author$project$Game$isPositionProtected = F2(
	function (state, pos) {
		return A2(
			$elm$core$List$any,
			$author$project$Board$positionEquals(pos),
			$author$project$Game$protectedPositions(state));
	});
var $author$project$Game$isPositionShielded = F2(
	function (state, pos) {
		return A2(
			$elm$core$List$any,
			$author$project$Board$positionEquals(pos),
			state.shieldedCells);
	});
var $author$project$Game$placeAIPiece = F2(
	function (state, to) {
		var b = state.board;
		var newBoard = _Utils_update(
			b,
			{
				aiPieces: _Utils_ap(
					b.aiPieces,
					_List_fromArray(
						[to]))
			});
		return _Utils_update(
			state,
			{
				board: newBoard,
				currentSide: $author$project$Board$Player,
				protectedCells: $author$project$Game$decrementProtectionList(state.protectedCells),
				turn: state.turn + 1
			});
	});
var $author$project$Game$applyAIMove = F3(
	function (state, from, to) {
		var sh = $author$project$Game$shieldedPositions(state);
		var prot = $author$project$Game$protectedPositions(state);
		var legal = A4($author$project$Rules$cannonLegalMoves, state.board, from, prot, sh);
		if (!A2(
			$elm$core$List$any,
			$author$project$Board$positionEquals(to),
			legal)) {
			return $elm$core$Result$Err('非法落點');
		} else {
			var _v0 = A2($author$project$Board$cellAt, state.board, to);
			_v0$3:
			while (true) {
				switch (_v0.$) {
					case 'Empty':
						return $elm$core$Result$Ok(
							A2($author$project$Game$placeAIPiece, state, to));
					case 'Piece':
						if (_v0.a.$ === 'Player') {
							var _v1 = _v0.a;
							if (A2($author$project$Game$isPositionProtected, state, to)) {
								var s = $author$project$Game$attackBlockedByProtection(state);
								return $elm$core$Result$Ok(
									$author$project$Game$decrementProtection(
										_Utils_update(
											s,
											{turn: state.turn + 1})));
							} else {
								if (A2($author$project$Game$isPositionShielded, state, to)) {
									var s = A2($author$project$Game$attackBlockedByShield, state, to);
									return $elm$core$Result$Ok(
										$author$project$Game$decrementProtection(
											_Utils_update(
												s,
												{turn: state.turn + 1})));
								} else {
									return $elm$core$Result$Ok(
										A2($author$project$Game$captureByAI, state, to));
								}
							}
						} else {
							break _v0$3;
						}
					default:
						if (_v0.a.$ === 'Player') {
							var _v2 = _v0.a;
							if (A2($author$project$Game$isPositionProtected, state, to)) {
								var s = $author$project$Game$attackBlockedByProtection(state);
								return $elm$core$Result$Ok(
									$author$project$Game$decrementProtection(
										_Utils_update(
											s,
											{turn: state.turn + 1})));
							} else {
								if (A2($author$project$Game$isPositionShielded, state, to)) {
									var s = A2($author$project$Game$attackBlockedByShield, state, to);
									return $elm$core$Result$Ok(
										$author$project$Game$decrementProtection(
											_Utils_update(
												s,
												{turn: state.turn + 1})));
								} else {
									return $elm$core$Result$Ok(
										A2($author$project$Game$attackCastleByAI, state, to));
								}
							}
						} else {
							break _v0$3;
						}
				}
			}
			return $elm$core$Result$Err('非法落點');
		}
	});
var $author$project$AI$PlacePiece = F2(
	function (a, b) {
		return {$: 'PlacePiece', a: a, b: b};
	});
var $author$project$AI$UseBomb = function (a) {
	return {$: 'UseBomb', a: a};
};
var $author$project$AI$UseLaser = F2(
	function (a, b) {
		return {$: 'UseLaser', a: a, b: b};
	});
var $author$project$AI$UseShield = function (a) {
	return {$: 'UseShield', a: a};
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $author$project$AI$manhattan = F2(
	function (a, b) {
		return $elm$core$Basics$abs(a.row - b.row) + $elm$core$Basics$abs(a.col - b.col);
	});
var $author$project$AI$bombScore = F2(
	function (state, center) {
		if (!A3($author$project$Items$canUseBomb, state, $author$project$Board$AI, center)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var containsCastle = function (p) {
				return A2($author$project$Board$positionEquals, p, $author$project$Board$playerCastlePos) || A2($author$project$Board$positionEquals, p, $author$project$Board$aiCastlePos);
			};
			var affected = $author$project$Items$bombAffectedCells(center);
			if (A2($elm$core$List$any, containsCastle, affected)) {
				return $elm$core$Maybe$Nothing;
			} else {
				var playerKilled = $elm$core$List$length(
					A2(
						$elm$core$List$filter,
						function (p) {
							return A2(
								$elm$core$List$any,
								$author$project$Board$positionEquals(p),
								state.board.playerPieces);
						},
						affected));
				var nearAiCastle = function (p) {
					return A2($author$project$AI$manhattan, p, $author$project$Board$aiCastlePos) <= 2;
				};
				var defenseBonus = A2(
					$elm$core$List$any,
					function (p) {
						return A2(
							$elm$core$List$any,
							$author$project$Board$positionEquals(p),
							state.board.playerPieces) && nearAiCastle(p);
					},
					affected) ? 3 : 0;
				var aiKilled = $elm$core$List$length(
					A2(
						$elm$core$List$filter,
						function (p) {
							return A2(
								$elm$core$List$any,
								$author$project$Board$positionEquals(p),
								state.board.aiPieces);
						},
						affected));
				return $elm$core$Maybe$Just(((playerKilled * 2) - (aiKilled * 3)) + defenseBonus);
			}
		}
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$AI$bestBomb = function (state) {
	var allPositions = A2(
		$elm$core$List$concatMap,
		function (r) {
			return A2(
				$elm$core$List$map,
				function (c) {
					return {col: c, row: r};
				},
				A2($elm$core$List$range, 0, $author$project$Board$boardSize - 1));
		},
		A2($elm$core$List$range, 0, $author$project$Board$boardSize - 1));
	var scored = A2(
		$elm$core$List$filterMap,
		function (p) {
			return A2(
				$elm$core$Maybe$map,
				function (s) {
					return _Utils_Tuple2(p, s);
				},
				A2($author$project$AI$bombScore, state, p));
		},
		allPositions);
	return $elm$core$List$head(
		A2(
			$elm$core$List$sortBy,
			function (_v0) {
				var s = _v0.b;
				return -s;
			},
			scored));
};
var $author$project$AI$allCannonMoves = function (state) {
	var sh = $author$project$Game$shieldedPositions(state);
	var prot = $author$project$Game$protectedPositions(state);
	return A2(
		$elm$core$List$concatMap,
		function (from) {
			return A2(
				$elm$core$List$map,
				function (to) {
					return _Utils_Tuple2(from, to);
				},
				A4($author$project$Rules$cannonLegalMoves, state.board, from, prot, sh));
		},
		state.board.aiPieces);
};
var $author$project$AI$captureMoves = function (state) {
	return A2(
		$elm$core$List$filter,
		function (_v0) {
			var to = _v0.b;
			var _v1 = A2($author$project$Board$cellAt, state.board, to);
			_v1$2:
			while (true) {
				switch (_v1.$) {
					case 'Piece':
						if (_v1.a.$ === 'Player') {
							var _v2 = _v1.a;
							return true;
						} else {
							break _v1$2;
						}
					case 'Castle':
						if (_v1.a.$ === 'Player') {
							var _v3 = _v1.a;
							return true;
						} else {
							break _v1$2;
						}
					default:
						break _v1$2;
				}
			}
			return false;
		},
		$author$project$AI$allCannonMoves(state));
};
var $elm$core$Basics$compare = _Utils_compare;
var $author$project$AI$closerToPlayerCastle = F2(
	function (_v0, _v1) {
		var to1 = _v0.b;
		var to2 = _v1.b;
		var d2 = A2($author$project$AI$manhattan, to2, $author$project$Board$playerCastlePos);
		var d1 = A2($author$project$AI$manhattan, to1, $author$project$Board$playerCastlePos);
		return A2($elm$core$Basics$compare, d1, d2);
	});
var $elm$core$List$sortWith = _List_sortWith;
var $author$project$AI$bestCapture = function (state) {
	return $elm$core$List$head(
		A2(
			$elm$core$List$sortWith,
			$author$project$AI$closerToPlayerCastle,
			$author$project$AI$captureMoves(state)));
};
var $author$project$Items$canUseLaser = F4(
	function (state, side, isRow, index) {
		var scoreOk = function () {
			if (side.$ === 'Player') {
				return _Utils_cmp(
					state.playerScore,
					$author$project$Items$cost($author$project$Items$Laser)) > -1;
			} else {
				return _Utils_cmp(
					state.aiScore,
					$author$project$Items$cost($author$project$Items$Laser)) > -1;
			}
		}();
		return scoreOk;
	});
var $author$project$AI$laserScore = F3(
	function (state, isRow, index) {
		var line = A2($author$project$Items$laserLine, isRow, index);
		var containsCastle = function (p) {
			return A2($author$project$Board$positionEquals, p, $author$project$Board$playerCastlePos) || A2($author$project$Board$positionEquals, p, $author$project$Board$aiCastlePos);
		};
		if (A2($elm$core$List$any, containsCastle, line)) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!A4($author$project$Items$canUseLaser, state, $author$project$Board$AI, isRow, index)) {
				return $elm$core$Maybe$Nothing;
			} else {
				var playerKilled = $elm$core$List$length(
					A2(
						$elm$core$List$filter,
						function (p) {
							return A2(
								$elm$core$List$any,
								$author$project$Board$positionEquals(p),
								state.board.playerPieces);
						},
						line));
				var clearsPathToPlayerCastle = function () {
					var row9 = A2(
						$elm$core$List$any,
						function (p) {
							return p.row === 9;
						},
						line);
					var col9 = A2(
						$elm$core$List$any,
						function (p) {
							return p.col === 9;
						},
						line);
					return isRow ? (!index) : (!index);
				}();
				var offenseBonus = clearsPathToPlayerCastle ? 2 : 0;
				var aiKilled = $elm$core$List$length(
					A2(
						$elm$core$List$filter,
						function (p) {
							return A2(
								$elm$core$List$any,
								$author$project$Board$positionEquals(p),
								state.board.aiPieces);
						},
						line));
				return $elm$core$Maybe$Just(((playerKilled * 2) - (aiKilled * 3)) + offenseBonus);
			}
		}
	});
var $author$project$AI$bestLaser = function (state) {
	var rows = A2(
		$elm$core$List$map,
		function (i) {
			return _Utils_Tuple2(true, i);
		},
		A2($elm$core$List$range, 0, $author$project$Board$boardSize - 1));
	var cols = A2(
		$elm$core$List$map,
		function (i) {
			return _Utils_Tuple2(false, i);
		},
		A2($elm$core$List$range, 0, $author$project$Board$boardSize - 1));
	var options = _Utils_ap(rows, cols);
	var scored = A2(
		$elm$core$List$filterMap,
		function (_v2) {
			var isRow = _v2.a;
			var i = _v2.b;
			return A2(
				$elm$core$Maybe$map,
				function (s) {
					return _Utils_Tuple3(isRow, i, s);
				},
				A3($author$project$AI$laserScore, state, isRow, i));
		},
		options);
	return A2(
		$elm$core$Maybe$map,
		function (_v1) {
			var isRow = _v1.a;
			var i = _v1.b;
			var s = _v1.c;
			return _Utils_Tuple3(isRow, i, s);
		},
		$elm$core$List$head(
			A2(
				$elm$core$List$sortBy,
				function (_v0) {
					var s = _v0.c;
					return -s;
				},
				scored)));
};
var $author$project$Rules$horseOffsets = _List_fromArray(
	[
		_Utils_Tuple2(
		_Utils_Tuple2(-2, -1),
		_Utils_Tuple2(-1, 0)),
		_Utils_Tuple2(
		_Utils_Tuple2(-2, 1),
		_Utils_Tuple2(-1, 0)),
		_Utils_Tuple2(
		_Utils_Tuple2(-1, -2),
		_Utils_Tuple2(0, -1)),
		_Utils_Tuple2(
		_Utils_Tuple2(-1, 2),
		_Utils_Tuple2(0, 1)),
		_Utils_Tuple2(
		_Utils_Tuple2(1, -2),
		_Utils_Tuple2(0, -1)),
		_Utils_Tuple2(
		_Utils_Tuple2(1, 2),
		_Utils_Tuple2(0, 1)),
		_Utils_Tuple2(
		_Utils_Tuple2(2, -1),
		_Utils_Tuple2(1, 0)),
		_Utils_Tuple2(
		_Utils_Tuple2(2, 1),
		_Utils_Tuple2(1, 0))
	]);
var $author$project$Rules$horseLegalMoves = F4(
	function (state, from, protectedPositions, shieldedPositions) {
		return A2(
			$elm$core$List$filter,
			function (to) {
				return !A2($author$project$Board$positionEquals, to, from);
			},
			A2(
				$elm$core$List$filterMap,
				function (_v0) {
					var _v1 = _v0.a;
					var dr = _v1.a;
					var dc = _v1.b;
					var _v2 = _v0.b;
					var footR = _v2.a;
					var footC = _v2.b;
					var to = {col: from.col + dc, row: from.row + dr};
					var foot = {col: from.col + footC, row: from.row + footR};
					if (!$author$project$Board$inBounds(to)) {
						return $elm$core$Maybe$Nothing;
					} else {
						if (!$author$project$Board$inBounds(foot)) {
							return $elm$core$Maybe$Nothing;
						} else {
							var _v3 = A2($author$project$Board$cellAt, state, foot);
							if (_v3.$ === 'Empty') {
								var _v4 = A2($author$project$Board$cellAt, state, to);
								switch (_v4.$) {
									case 'Piece':
										if (_v4.a.$ === 'Player') {
											var _v5 = _v4.a;
											return $elm$core$Maybe$Nothing;
										} else {
											var _v7 = _v4.a;
											return $elm$core$Maybe$Just(to);
										}
									case 'Castle':
										if (_v4.a.$ === 'Player') {
											var _v6 = _v4.a;
											return $elm$core$Maybe$Nothing;
										} else {
											var _v8 = _v4.a;
											return $elm$core$Maybe$Just(to);
										}
									default:
										return $elm$core$Maybe$Just(to);
								}
							} else {
								return $elm$core$Maybe$Nothing;
							}
						}
					}
				},
				$author$project$Rules$horseOffsets));
	});
var $author$project$AI$playerCanEatNext = F2(
	function (state, pos) {
		var sh = $author$project$Game$shieldedPositions(state);
		var prot = $author$project$Game$protectedPositions(state);
		return A2(
			$elm$core$List$any,
			function (from) {
				return A2(
					$elm$core$List$any,
					$author$project$Board$positionEquals(pos),
					A4($author$project$Rules$horseLegalMoves, state.board, from, prot, sh));
			},
			state.board.playerPieces);
	});
var $author$project$AI$shieldImportance = function (pos) {
	return A2($author$project$Board$positionEquals, pos, $author$project$Board$aiCastlePos) ? 5 : ((A2($author$project$AI$manhattan, pos, $author$project$Board$aiCastlePos) === 1) ? 3 : 1);
};
var $author$project$AI$shieldScore = F2(
	function (state, pos) {
		if (!A3($author$project$Items$canUseShield, state, $author$project$Board$AI, pos)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var risk = A2($author$project$AI$playerCanEatNext, state, pos) ? 3 : 0;
			var imp = $author$project$AI$shieldImportance(pos);
			return $elm$core$Maybe$Just(imp + risk);
		}
	});
var $author$project$AI$bestShield = function (state) {
	return $elm$core$List$head(
		A2(
			$elm$core$List$sortBy,
			function (_v0) {
				var s = _v0.b;
				return -s;
			},
			A2(
				$elm$core$List$filterMap,
				function (p) {
					return A2(
						$elm$core$Maybe$map,
						function (s) {
							return _Utils_Tuple2(p, s);
						},
						A2($author$project$AI$shieldScore, state, p));
				},
				state.board.aiPieces)));
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$AI$defensiveOrOffensivePlace = function (state) {
	var moves = $author$project$AI$allCannonMoves(state);
	var _v0 = $elm$core$List$head(
		A2(
			$elm$core$List$sortBy,
			A2(
				$elm$core$Basics$composeL,
				$author$project$AI$manhattan($author$project$Board$playerCastlePos),
				$elm$core$Tuple$second),
			moves));
	if (_v0.$ === 'Just') {
		var _v1 = _v0.a;
		var from = _v1.a;
		var to = _v1.b;
		return A2($author$project$AI$PlacePiece, from, to);
	} else {
		return A2($author$project$AI$PlacePiece, $author$project$Board$aiCastlePos, $author$project$Board$aiCastlePos);
	}
};
var $author$project$AI$itemThreshold = 2;
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$AI$tryShield = function (shield) {
	if (shield.$ === 'Just') {
		var _v1 = shield.a;
		var pos = _v1.a;
		var s = _v1.b;
		return (_Utils_cmp(s, $author$project$AI$itemThreshold) > -1) ? $author$project$AI$UseShield(pos) : A2(
			$author$project$AI$PlacePiece,
			{col: 9, row: 9},
			{col: 9, row: 9});
	} else {
		return A2(
			$author$project$AI$PlacePiece,
			{col: 9, row: 9},
			{col: 9, row: 9});
	}
};
var $author$project$AI$tryLaserOrShield = F2(
	function (laser, shield) {
		var _v0 = _Utils_Tuple2(laser, shield);
		if (_v0.a.$ === 'Just') {
			var _v1 = _v0.a.a;
			var isRow = _v1.a;
			var i = _v1.b;
			var s = _v1.c;
			return (_Utils_cmp(s, $author$project$AI$itemThreshold) > -1) ? A2($author$project$AI$UseLaser, isRow, i) : $author$project$AI$tryShield(shield);
		} else {
			if (_v0.b.$ === 'Just') {
				var _v2 = _v0.a;
				var _v3 = _v0.b.a;
				var pos = _v3.a;
				var ss = _v3.b;
				return (_Utils_cmp(ss, $author$project$AI$itemThreshold) > -1) ? $author$project$AI$UseShield(pos) : A2(
					$author$project$AI$PlacePiece,
					{col: 9, row: 9},
					{col: 9, row: 9});
			} else {
				return A2(
					$author$project$AI$PlacePiece,
					{col: 9, row: 9},
					{col: 9, row: 9});
			}
		}
	});
var $author$project$AI$decide = function (state) {
	var _v0 = $author$project$AI$bestCapture(state);
	if (_v0.$ === 'Just') {
		var _v1 = _v0.a;
		var from = _v1.a;
		var to = _v1.b;
		return A2($author$project$AI$PlacePiece, from, to);
	} else {
		var shield = $author$project$AI$bestShield(state);
		var laser = $author$project$AI$bestLaser(state);
		var bomb = $author$project$AI$bestBomb(state);
		var bestItemScore = $elm$core$List$maximum(
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						function (_v10) {
							var s = _v10.b;
							return s;
						},
						bomb),
						A2(
						$elm$core$Maybe$map,
						function (_v11) {
							var s = _v11.c;
							return s;
						},
						laser),
						A2(
						$elm$core$Maybe$map,
						function (_v12) {
							var s = _v12.b;
							return s;
						},
						shield)
					])));
		if (bestItemScore.$ === 'Just') {
			var s = bestItemScore.a;
			if (_Utils_cmp(s, $author$project$AI$itemThreshold) > -1) {
				var _v3 = _Utils_Tuple3(bomb, laser, shield);
				if (_v3.a.$ === 'Just') {
					var _v4 = _v3.a.a;
					var pos = _v4.a;
					var sb = _v4.b;
					return (_Utils_cmp(sb, $author$project$AI$itemThreshold) > -1) ? $author$project$AI$UseBomb(pos) : A2($author$project$AI$tryLaserOrShield, laser, shield);
				} else {
					if (_v3.b.$ === 'Just') {
						var _v5 = _v3.a;
						var _v6 = _v3.b.a;
						var isRow = _v6.a;
						var i = _v6.b;
						var sl = _v6.c;
						return (_Utils_cmp(sl, $author$project$AI$itemThreshold) > -1) ? A2($author$project$AI$UseLaser, isRow, i) : $author$project$AI$tryShield(shield);
					} else {
						if (_v3.c.$ === 'Just') {
							var _v7 = _v3.a;
							var _v8 = _v3.b;
							var _v9 = _v3.c.a;
							var pos = _v9.a;
							var ss = _v9.b;
							return (_Utils_cmp(ss, $author$project$AI$itemThreshold) > -1) ? $author$project$AI$UseShield(pos) : $author$project$AI$defensiveOrOffensivePlace(state);
						} else {
							return $author$project$AI$defensiveOrOffensivePlace(state);
						}
					}
				}
			} else {
				return $author$project$AI$defensiveOrOffensivePlace(state);
			}
		} else {
			return $author$project$AI$defensiveOrOffensivePlace(state);
		}
	}
};
var $author$project$Main$sideLabel = function (side) {
	if (side.$ === 'Player') {
		return 'Player';
	} else {
		return 'AI';
	}
};
var $elm$core$Process$sleep = _Process_sleep;
var $author$project$Main$runAIStep = function (model) {
	var _v0 = $author$project$Game$checkVictory(model.gameState);
	if (_v0.$ === 'Ongoing') {
		var _v1 = $author$project$AI$decide(model.gameState);
		switch (_v1.$) {
			case 'PlacePiece':
				var from = _v1.a;
				var to = _v1.b;
				var turnN = model.gameState.turn;
				var actionLine = '[回合 ' + ($elm$core$String$fromInt(turnN) + ('] AI 放置 炮 ' + ($author$project$Main$posStr(from) + ('→' + $author$project$Main$posStr(to)))));
				var _v2 = A3($author$project$Game$applyAIMove, model.gameState, from, to);
				if (_v2.$ === 'Ok') {
					var newState = _v2.a;
					var m = A2(
						$author$project$Main$addLog,
						actionLine + (' → Ok | currentSide=' + $author$project$Main$sideLabel(newState.currentSide)),
						model);
					return _Utils_Tuple2(
						_Utils_update(
							m,
							{gameState: newState}),
						$elm$core$Platform$Cmd$none);
				} else {
					var e = _v2.a;
					return _Utils_Tuple2(
						A2($author$project$Main$addLog, actionLine + (' → Err: ' + e), model),
						$elm$core$Platform$Cmd$none);
				}
			case 'UseBomb':
				var center = _v1.a;
				var _v3 = A3($author$project$Items$applyBomb, model.gameState, $author$project$Board$AI, center);
				if (_v3.$ === 'Ok') {
					return _Utils_Tuple2(
						A2(
							$author$project$Main$addLog,
							'[回合 ' + ($elm$core$String$fromInt(model.gameState.turn) + ('] AI 使用 炸彈 於 ' + ($author$project$Main$posStr(center) + '（顯示後套用）'))),
							_Utils_update(
								model,
								{
									aiItemPendingApply: $elm$core$Maybe$Just(
										$author$project$Main$BombAt(center))
								})),
						A2(
							$elm$core$Task$perform,
							function (_v4) {
								return $author$project$Main$ApplyAIPendingItem;
							},
							$elm$core$Process$sleep(350)));
				} else {
					var e = _v3.a;
					return _Utils_Tuple2(
						A2(
							$author$project$Main$addLog,
							'[回合 ' + ($elm$core$String$fromInt(model.gameState.turn) + ('] AI 使用 炸彈 → Err: ' + e)),
							model),
						$elm$core$Platform$Cmd$none);
				}
			case 'UseLaser':
				var isRow = _v1.a;
				var index = _v1.b;
				var displayPos = isRow ? {col: 0, row: index} : {col: index, row: 0};
				var _v5 = A4($author$project$Items$applyLaser, model.gameState, $author$project$Board$AI, isRow, index);
				if (_v5.$ === 'Ok') {
					return _Utils_Tuple2(
						A2(
							$author$project$Main$addLog,
							'[回合 ' + ($elm$core$String$fromInt(model.gameState.turn) + '] AI 使用 雷射（顯示後套用）'),
							_Utils_update(
								model,
								{
									aiItemPendingApply: $elm$core$Maybe$Just(
										A3($author$project$Main$LaserAt, isRow, index, displayPos))
								})),
						A2(
							$elm$core$Task$perform,
							function (_v6) {
								return $author$project$Main$ApplyAIPendingItem;
							},
							$elm$core$Process$sleep(350)));
				} else {
					var e = _v5.a;
					return _Utils_Tuple2(
						A2(
							$author$project$Main$addLog,
							'[回合 ' + ($elm$core$String$fromInt(model.gameState.turn) + ('] AI 使用 雷射 → Err: ' + e)),
							model),
						$elm$core$Platform$Cmd$none);
				}
			default:
				var pos = _v1.a;
				var _v7 = A3($author$project$Items$applyShield, model.gameState, $author$project$Board$AI, pos);
				if (_v7.$ === 'Ok') {
					return _Utils_Tuple2(
						A2(
							$author$project$Main$addLog,
							'[回合 ' + ($elm$core$String$fromInt(model.gameState.turn) + ('] AI 使用 護盾 於 ' + ($author$project$Main$posStr(pos) + '（顯示後套用）'))),
							_Utils_update(
								model,
								{
									aiItemPendingApply: $elm$core$Maybe$Just(
										$author$project$Main$ShieldAt(pos))
								})),
						A2(
							$elm$core$Task$perform,
							function (_v8) {
								return $author$project$Main$ApplyAIPendingItem;
							},
							$elm$core$Process$sleep(350)));
				} else {
					var e = _v7.a;
					return _Utils_Tuple2(
						A2(
							$author$project$Main$addLog,
							'[回合 ' + ($elm$core$String$fromInt(model.gameState.turn) + ('] AI 使用 護盾 → Err: ' + e)),
							model),
						$elm$core$Platform$Cmd$none);
				}
		}
	} else {
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	}
};
var $author$project$Game$attackCastleByPlayer = F2(
	function (state, to) {
		var b = state.board;
		var newBoard = _Utils_update(
			b,
			{
				playerPieces: _Utils_ap(
					b.playerPieces,
					_List_fromArray(
						[to]))
			});
		return _Utils_update(
			state,
			{aiCastleHp: state.aiCastleHp - 3, board: newBoard, currentSide: $author$project$Board$AI, playerScore: state.playerScore + 1});
	});
var $author$project$Game$captureByPlayer = F2(
	function (state, to) {
		var newProtected = _Utils_ap(
			state.protectedCells,
			_List_fromArray(
				[
					{position: to, remainingTurns: 1}
				]));
		var b = state.board;
		var newAiPieces = A2(
			$elm$core$List$filter,
			A2(
				$elm$core$Basics$composeR,
				$author$project$Board$positionEquals(to),
				$elm$core$Basics$not),
			b.aiPieces);
		var newBoard = _Utils_update(
			b,
			{
				aiPieces: newAiPieces,
				playerPieces: _Utils_ap(
					b.playerPieces,
					_List_fromArray(
						[to]))
			});
		return _Utils_update(
			state,
			{board: newBoard, currentSide: $author$project$Board$AI, playerCaptures: state.playerCaptures + 1, playerScore: state.playerScore + 1, protectedCells: newProtected});
	});
var $author$project$Game$placePlayerPiece = F3(
	function (state, to, newProtection) {
		var b = state.board;
		var newBoard = _Utils_update(
			b,
			{
				playerPieces: _Utils_ap(
					b.playerPieces,
					_List_fromArray(
						[to]))
			});
		return _Utils_update(
			state,
			{
				board: newBoard,
				currentSide: $author$project$Board$AI,
				protectedCells: _Utils_ap(state.protectedCells, newProtection)
			});
	});
var $author$project$Game$applyPlayerMove = F3(
	function (state, from, to) {
		var sh = $author$project$Game$shieldedPositions(state);
		var prot = $author$project$Game$protectedPositions(state);
		var legal = A4($author$project$Rules$horseLegalMoves, state.board, from, prot, sh);
		if (!A2(
			$elm$core$List$any,
			$author$project$Board$positionEquals(to),
			legal)) {
			return $elm$core$Result$Err('非法落點');
		} else {
			var _v0 = A2($author$project$Board$cellAt, state.board, to);
			_v0$3:
			while (true) {
				switch (_v0.$) {
					case 'Empty':
						return $elm$core$Result$Ok(
							A3($author$project$Game$placePlayerPiece, state, to, _List_Nil));
					case 'Piece':
						if (_v0.a.$ === 'AI') {
							var _v1 = _v0.a;
							return A2($author$project$Game$isPositionProtected, state, to) ? $elm$core$Result$Ok(
								$author$project$Game$attackBlockedByProtection(state)) : (A2($author$project$Game$isPositionShielded, state, to) ? $elm$core$Result$Ok(
								A2($author$project$Game$attackBlockedByShield, state, to)) : $elm$core$Result$Ok(
								A2($author$project$Game$captureByPlayer, state, to)));
						} else {
							break _v0$3;
						}
					default:
						if (_v0.a.$ === 'AI') {
							var _v2 = _v0.a;
							return A2($author$project$Game$isPositionProtected, state, to) ? $elm$core$Result$Ok(
								$author$project$Game$attackBlockedByProtection(state)) : (A2($author$project$Game$isPositionShielded, state, to) ? $elm$core$Result$Ok(
								A2($author$project$Game$attackBlockedByShield, state, to)) : $elm$core$Result$Ok(
								A2($author$project$Game$attackCastleByPlayer, state, to)));
						} else {
							break _v0$3;
						}
				}
			}
			return $elm$core$Result$Err('非法落點');
		}
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Debug$GameTests$horseMoveStateTests = function () {
	var to21 = {col: 1, row: 2};
	var to12 = {col: 2, row: 1};
	var state0 = $author$project$Game$init;
	var sh = $author$project$Game$shieldedPositions(state0);
	var prot = $author$project$Game$protectedPositions(state0);
	var from00 = {col: 0, row: 0};
	var legal = A4($author$project$Rules$horseLegalMoves, state0.board, from00, prot, sh);
	var has12 = A2(
		$elm$core$List$any,
		$author$project$Board$positionEquals(to12),
		legal);
	var has21 = A2(
		$elm$core$List$any,
		$author$project$Board$positionEquals(to21),
		legal);
	var moveResult = A3($author$project$Game$applyPlayerMove, state0, from00, to21);
	return _Utils_ap(
		_List_Nil,
		_Utils_ap(
			(!has21) ? _List_fromArray(
				['測試失敗: 馬從 (0,0) 合法格應包含 (2,1)']) : _List_Nil,
			_Utils_ap(
				(!has12) ? _List_fromArray(
					['測試失敗: 馬從 (0,0) 合法格應包含 (1,2)']) : _List_Nil,
				function () {
					if (moveResult.$ === 'Err') {
						var e = moveResult.a;
						return _List_fromArray(
							['測試失敗: 點擊目的地 (2,1) 後 applyPlayerMove 應成功，錯誤: ' + e]);
					} else {
						var state1 = moveResult.a;
						return _Utils_ap(
							_List_Nil,
							_Utils_ap(
								(!A2(
									$elm$core$List$any,
									$author$project$Board$positionEquals(to21),
									state1.board.playerPieces)) ? _List_fromArray(
									['測試失敗: 放置後 playerPieces 應包含 (2,1)']) : _List_Nil,
								_Utils_ap(
									(!A2(
										$elm$core$List$any,
										$author$project$Board$positionEquals(from00),
										state1.board.playerPieces)) ? _List_fromArray(
										['測試失敗: 放置後 playerPieces 應仍包含起點 (0,0)']) : _List_Nil,
									_Utils_ap(
										(!_Utils_eq(state1.currentSide, $author$project$Board$AI)) ? _List_fromArray(
											['測試失敗: 放置後 currentSide 應為 AI']) : _List_Nil,
										(!_Utils_eq(
											A2($author$project$Board$cellAt, state1.board, to21),
											$author$project$Board$Piece($author$project$Board$Player))) ? _List_fromArray(
											['測試失敗: 放置後 cellAt (2,1) 應為 Piece Player，畫面才會顯示馬']) : _List_Nil))));
					}
				}())));
}();
var $author$project$Debug$GameTests$runTests = $author$project$Debug$GameTests$horseMoveStateTests;
var $author$project$Main$ApplyPendingItem = {$: 'ApplyPendingItem'};
var $author$project$Main$RunAITurn = {$: 'RunAITurn'};
var $author$project$Main$getProtected = function (model) {
	return $author$project$Game$protectedPositions(model.gameState);
};
var $author$project$Main$getShielded = function (model) {
	return $author$project$Game$shieldedPositions(model.gameState);
};
var $elm$core$Debug$log = _Debug_log;
var $author$project$Main$updateOngoing = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'RunTests':
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'RunAITurn':
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'ApplyPendingItem':
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'ApplyAIPendingItem':
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'Restart':
				return _Utils_Tuple2(
					_Utils_update(
						$author$project$Main$initialModel,
						{gameState: $author$project$Game$init}),
					$elm$core$Platform$Cmd$none);
			case 'MainMenu':
				return _Utils_Tuple2($author$project$Main$initialModel, $elm$core$Platform$Cmd$none);
			case 'CancelItem':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{errorMessage: $elm$core$Maybe$Nothing, itemMode: $elm$core$Maybe$Nothing, laserPending: $elm$core$Maybe$Nothing, previewCells: _List_Nil}),
					$elm$core$Platform$Cmd$none);
			case 'UseItem':
				var item = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							errorMessage: $elm$core$Maybe$Nothing,
							itemMode: $elm$core$Maybe$Just(item),
							laserPending: $elm$core$Maybe$Nothing,
							previewCells: _List_Nil
						}),
					$elm$core$Platform$Cmd$none);
			case 'LaserRow':
				var _v1 = model.laserPending;
				if (_v1.$ === 'Just') {
					var pos = _v1.a;
					var _v2 = A4($author$project$Items$applyLaser, model.gameState, $author$project$Board$Player, true, pos.row);
					if (_v2.$ === 'Ok') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									errorMessage: $elm$core$Maybe$Nothing,
									itemPendingApply: $elm$core$Maybe$Just(
										A3($author$project$Main$LaserAt, true, pos.row, pos)),
									laserPending: $elm$core$Maybe$Nothing,
									previewCells: _List_Nil
								}),
							A2(
								$elm$core$Task$perform,
								function (_v3) {
									return $author$project$Main$ApplyPendingItem;
								},
								$elm$core$Process$sleep(350)));
					} else {
						var e = _v2.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									errorMessage: $elm$core$Maybe$Just(e)
								}),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'LaserCol':
				var _v4 = model.laserPending;
				if (_v4.$ === 'Just') {
					var pos = _v4.a;
					var _v5 = A4($author$project$Items$applyLaser, model.gameState, $author$project$Board$Player, false, pos.col);
					if (_v5.$ === 'Ok') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									errorMessage: $elm$core$Maybe$Nothing,
									itemPendingApply: $elm$core$Maybe$Just(
										A3($author$project$Main$LaserAt, false, pos.col, pos)),
									laserPending: $elm$core$Maybe$Nothing,
									previewCells: _List_Nil
								}),
							A2(
								$elm$core$Task$perform,
								function (_v6) {
									return $author$project$Main$ApplyPendingItem;
								},
								$elm$core$Process$sleep(350)));
					} else {
						var e = _v5.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									errorMessage: $elm$core$Maybe$Just(e)
								}),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			default:
				var pos = msg.a;
				if ((!_Utils_eq(model.itemPendingApply, $elm$core$Maybe$Nothing)) || (!_Utils_eq(model.aiItemPendingApply, $elm$core$Maybe$Nothing))) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var _v7 = A2(
						$elm$core$Debug$log,
						'[CellClicked] pos',
						_Utils_Tuple2(pos.row, pos.col));
					var _v8 = A2($elm$core$Debug$log, '[CellClicked] currentSide', model.gameState.currentSide);
					var _v9 = A2($elm$core$Debug$log, '[CellClicked] selectedPiece', model.selectedPiece);
					var _v10 = A2(
						$elm$core$Debug$log,
						'[CellClicked] legalMoves count',
						$elm$core$List$length(model.legalMoves));
					var _v11 = model.itemMode;
					if (_v11.$ === 'Just') {
						switch (_v11.a.$) {
							case 'Bomb':
								var _v12 = _v11.a;
								var _v13 = A3($author$project$Items$applyBomb, model.gameState, $author$project$Board$Player, pos);
								if (_v13.$ === 'Ok') {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{
												errorMessage: $elm$core$Maybe$Nothing,
												itemPendingApply: $elm$core$Maybe$Just(
													$author$project$Main$BombAt(pos)),
												previewCells: _List_Nil
											}),
										A2(
											$elm$core$Task$perform,
											function (_v14) {
												return $author$project$Main$ApplyPendingItem;
											},
											$elm$core$Process$sleep(350)));
								} else {
									var e = _v13.a;
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{
												errorMessage: $elm$core$Maybe$Just(e)
											}),
										$elm$core$Platform$Cmd$none);
								}
							case 'Shield':
								var _v15 = _v11.a;
								var _v16 = A3($author$project$Items$applyShield, model.gameState, $author$project$Board$Player, pos);
								if (_v16.$ === 'Ok') {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{
												errorMessage: $elm$core$Maybe$Nothing,
												itemPendingApply: $elm$core$Maybe$Just(
													$author$project$Main$ShieldAt(pos)),
												previewCells: _List_Nil
											}),
										A2(
											$elm$core$Task$perform,
											function (_v17) {
												return $author$project$Main$ApplyPendingItem;
											},
											$elm$core$Process$sleep(350)));
								} else {
									var e = _v16.a;
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{
												errorMessage: $elm$core$Maybe$Just(e)
											}),
										$elm$core$Platform$Cmd$none);
								}
							default:
								var _v18 = _v11.a;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											errorMessage: $elm$core$Maybe$Nothing,
											laserPending: $elm$core$Maybe$Just(pos),
											previewCells: _List_Nil
										}),
									$elm$core$Platform$Cmd$none);
						}
					} else {
						if (_Utils_eq(model.gameState.currentSide, $author$project$Board$AI)) {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						} else {
							var sh = $author$project$Main$getShielded(model);
							var prot = $author$project$Main$getProtected(model);
							var inLegalMoves = A2(
								$elm$core$List$any,
								$author$project$Board$positionEquals(pos),
								model.legalMoves);
							var content = A2($author$project$Board$cellAt, model.gameState.board, pos);
							if ((!_Utils_eq(model.selectedPiece, $elm$core$Maybe$Nothing)) && inLegalMoves) {
								var _v19 = model.selectedPiece;
								if (_v19.$ === 'Just') {
									var from = _v19.a;
									var _v20 = A2(
										$elm$core$Debug$log,
										'[apply] from',
										_Utils_Tuple2(from.row, from.col));
									var _v21 = A2(
										$elm$core$Debug$log,
										'[apply] to',
										_Utils_Tuple2(pos.row, pos.col));
									var _v22 = A2($elm$core$Debug$log, '[apply] inLegalMoves', inLegalMoves);
									var _v23 = A3($author$project$Game$applyPlayerMove, model.gameState, from, pos);
									if (_v23.$ === 'Ok') {
										var newState = _v23.a;
										var modelAfterPlayer = _Utils_update(
											model,
											{errorMessage: $elm$core$Maybe$Nothing, gameState: newState, legalMoves: _List_Nil, selectedPiece: $elm$core$Maybe$Nothing});
										var _v24 = A2(
											$elm$core$Debug$log,
											'[apply] Ok newState.playerPieces',
											A2(
												$elm$core$List$map,
												function (p) {
													return _Utils_Tuple2(p.row, p.col);
												},
												newState.board.playerPieces));
										var _v25 = A2($elm$core$Debug$log, '[apply] Ok newState.currentSide', newState.currentSide);
										return _Utils_Tuple2(
											modelAfterPlayer,
											A2(
												$elm$core$Task$perform,
												function (_v26) {
													return $author$project$Main$RunAITurn;
												},
												$elm$core$Process$sleep(300)));
									} else {
										var e = _v23.a;
										var _v27 = A2($elm$core$Debug$log, '[apply] Err', e);
										return _Utils_Tuple2(
											_Utils_update(
												model,
												{
													errorMessage: $elm$core$Maybe$Just(e)
												}),
											$elm$core$Platform$Cmd$none);
									}
								} else {
									return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
								}
							} else {
								_v28$2:
								while (true) {
									switch (content.$) {
										case 'Piece':
											if (content.a.$ === 'Player') {
												var _v29 = content.a;
												return _Utils_Tuple2(
													_Utils_update(
														model,
														{
															errorMessage: $elm$core$Maybe$Nothing,
															legalMoves: A4($author$project$Rules$horseLegalMoves, model.gameState.board, pos, prot, sh),
															selectedPiece: $elm$core$Maybe$Just(pos)
														}),
													$elm$core$Platform$Cmd$none);
											} else {
												break _v28$2;
											}
										case 'Castle':
											if (content.a.$ === 'Player') {
												var _v30 = content.a;
												return _Utils_Tuple2(
													_Utils_update(
														model,
														{
															errorMessage: $elm$core$Maybe$Nothing,
															legalMoves: A4($author$project$Rules$horseLegalMoves, model.gameState.board, pos, prot, sh),
															selectedPiece: $elm$core$Maybe$Just(pos)
														}),
													$elm$core$Platform$Cmd$none);
											} else {
												break _v28$2;
											}
										default:
											break _v28$2;
									}
								}
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{errorMessage: $elm$core$Maybe$Nothing, legalMoves: _List_Nil, selectedPiece: $elm$core$Maybe$Nothing}),
									$elm$core$Platform$Cmd$none);
							}
						}
					}
				}
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'RunTests':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{testErrors: $author$project$Debug$GameTests$runTests}),
					$elm$core$Platform$Cmd$none);
			case 'RunAITurn':
				if (_Utils_eq(model.gameState.currentSide, $author$project$Board$AI) && _Utils_eq(model.aiItemPendingApply, $elm$core$Maybe$Nothing)) {
					var m1 = A2($author$project$Main$addLog, '[RunAITurn] currentSide=AI → 開始執行', model);
					var _v1 = $author$project$Main$runAIStep(m1);
					var newModel = _v1.a;
					var cmd = _v1.b;
					return _Utils_Tuple2(newModel, cmd);
				} else {
					return _Utils_Tuple2(
						A2(
							$author$project$Main$addLog,
							'[RunAITurn] 收到時 currentSide=' + ($author$project$Main$sideLabel(model.gameState.currentSide) + ' → 跳過不執行'),
							model),
						$elm$core$Platform$Cmd$none);
				}
			case 'ApplyPendingItem':
				var _v2 = model.itemPendingApply;
				if (_v2.$ === 'Just') {
					switch (_v2.a.$) {
						case 'BombAt':
							var pos = _v2.a.a;
							var _v3 = A3($author$project$Items$applyBomb, model.gameState, $author$project$Board$Player, pos);
							if (_v3.$ === 'Ok') {
								var s = _v3.a;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											errorMessage: $elm$core$Maybe$Nothing,
											gameState: $author$project$Main$recordPlayerBomb(s),
											itemMode: $elm$core$Maybe$Nothing,
											itemPendingApply: $elm$core$Maybe$Nothing,
											previewCells: _List_Nil
										}),
									$elm$core$Platform$Cmd$none);
							} else {
								var e = _v3.a;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											errorMessage: $elm$core$Maybe$Just(e),
											itemPendingApply: $elm$core$Maybe$Nothing
										}),
									$elm$core$Platform$Cmd$none);
							}
						case 'ShieldAt':
							var pos = _v2.a.a;
							var _v4 = A3($author$project$Items$applyShield, model.gameState, $author$project$Board$Player, pos);
							if (_v4.$ === 'Ok') {
								var s = _v4.a;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											errorMessage: $elm$core$Maybe$Nothing,
											gameState: $author$project$Main$recordPlayerShield(s),
											itemMode: $elm$core$Maybe$Nothing,
											itemPendingApply: $elm$core$Maybe$Nothing,
											previewCells: _List_Nil
										}),
									$elm$core$Platform$Cmd$none);
							} else {
								var e = _v4.a;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											errorMessage: $elm$core$Maybe$Just(e),
											itemPendingApply: $elm$core$Maybe$Nothing
										}),
									$elm$core$Platform$Cmd$none);
							}
						default:
							var _v5 = _v2.a;
							var isRow = _v5.a;
							var index = _v5.b;
							var pos = _v5.c;
							var _v6 = A4($author$project$Items$applyLaser, model.gameState, $author$project$Board$Player, isRow, index);
							if (_v6.$ === 'Ok') {
								var s = _v6.a;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											errorMessage: $elm$core$Maybe$Nothing,
											gameState: $author$project$Main$recordPlayerLaser(s),
											itemMode: $elm$core$Maybe$Nothing,
											itemPendingApply: $elm$core$Maybe$Nothing,
											laserPending: $elm$core$Maybe$Nothing,
											previewCells: _List_Nil
										}),
									$elm$core$Platform$Cmd$none);
							} else {
								var e = _v6.a;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											errorMessage: $elm$core$Maybe$Just(e),
											itemPendingApply: $elm$core$Maybe$Nothing,
											laserPending: $elm$core$Maybe$Nothing
										}),
									$elm$core$Platform$Cmd$none);
							}
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'ApplyAIPendingItem':
				var _v7 = model.aiItemPendingApply;
				if (_v7.$ === 'Just') {
					switch (_v7.a.$) {
						case 'BombAt':
							var pos = _v7.a.a;
							var _v8 = A3($author$project$Items$applyBomb, model.gameState, $author$project$Board$AI, pos);
							if (_v8.$ === 'Ok') {
								var s = _v8.a;
								var next = $author$project$Game$decrementProtection(
									_Utils_update(
										s,
										{aiBombUse: s.aiBombUse + 1, currentSide: $author$project$Board$Player, turn: s.turn + 1}));
								var m = A2(
									$author$project$Main$addLog,
									'[回合 ' + ($elm$core$String$fromInt(model.gameState.turn) + ('] AI 使用 炸彈 於 ' + ($author$project$Main$posStr(pos) + ' → Ok'))),
									model);
								return _Utils_Tuple2(
									_Utils_update(
										m,
										{aiItemPendingApply: $elm$core$Maybe$Nothing, gameState: next}),
									$elm$core$Platform$Cmd$none);
							} else {
								var e = _v8.a;
								return _Utils_Tuple2(
									A2(
										$author$project$Main$addLog,
										'[回合 ' + ($elm$core$String$fromInt(model.gameState.turn) + ('] AI 使用 炸彈 → Err: ' + e)),
										_Utils_update(
											model,
											{aiItemPendingApply: $elm$core$Maybe$Nothing})),
									$elm$core$Platform$Cmd$none);
							}
						case 'ShieldAt':
							var pos = _v7.a.a;
							var _v9 = A3($author$project$Items$applyShield, model.gameState, $author$project$Board$AI, pos);
							if (_v9.$ === 'Ok') {
								var s = _v9.a;
								var next = $author$project$Game$decrementProtection(
									_Utils_update(
										s,
										{aiShieldUse: s.aiShieldUse + 1, currentSide: $author$project$Board$Player, turn: s.turn + 1}));
								var m = A2(
									$author$project$Main$addLog,
									'[回合 ' + ($elm$core$String$fromInt(model.gameState.turn) + ('] AI 使用 護盾 於 ' + ($author$project$Main$posStr(pos) + ' → Ok'))),
									model);
								return _Utils_Tuple2(
									_Utils_update(
										m,
										{aiItemPendingApply: $elm$core$Maybe$Nothing, gameState: next}),
									$elm$core$Platform$Cmd$none);
							} else {
								var e = _v9.a;
								return _Utils_Tuple2(
									A2(
										$author$project$Main$addLog,
										'[回合 ' + ($elm$core$String$fromInt(model.gameState.turn) + ('] AI 使用 護盾 → Err: ' + e)),
										_Utils_update(
											model,
											{aiItemPendingApply: $elm$core$Maybe$Nothing})),
									$elm$core$Platform$Cmd$none);
							}
						default:
							var _v10 = _v7.a;
							var isRow = _v10.a;
							var index = _v10.b;
							var displayPos = _v10.c;
							var _v11 = A4($author$project$Items$applyLaser, model.gameState, $author$project$Board$AI, isRow, index);
							if (_v11.$ === 'Ok') {
								var s = _v11.a;
								var next = $author$project$Game$decrementProtection(
									_Utils_update(
										s,
										{aiLaserUse: s.aiLaserUse + 1, currentSide: $author$project$Board$Player, turn: s.turn + 1}));
								var axis = isRow ? '行' : '列';
								var m = A2(
									$author$project$Main$addLog,
									'[回合 ' + ($elm$core$String$fromInt(model.gameState.turn) + ('] AI 使用 雷射 ' + (axis + (' ' + ($elm$core$String$fromInt(index) + ' → Ok'))))),
									model);
								return _Utils_Tuple2(
									_Utils_update(
										m,
										{aiItemPendingApply: $elm$core$Maybe$Nothing, gameState: next}),
									$elm$core$Platform$Cmd$none);
							} else {
								var e = _v11.a;
								return _Utils_Tuple2(
									A2(
										$author$project$Main$addLog,
										'[回合 ' + ($elm$core$String$fromInt(model.gameState.turn) + ('] AI 使用 雷射 → Err: ' + e)),
										_Utils_update(
											model,
											{aiItemPendingApply: $elm$core$Maybe$Nothing})),
									$elm$core$Platform$Cmd$none);
							}
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			default:
				var _v12 = $author$project$Game$checkVictory(model.gameState);
				if (_v12.$ === 'Ongoing') {
					return A2($author$project$Main$updateOngoing, msg, model);
				} else {
					var result = _v12;
					switch (msg.$) {
						case 'Restart':
							return _Utils_Tuple2(
								_Utils_update(
									$author$project$Main$initialModel,
									{gameState: $author$project$Game$init}),
								$elm$core$Platform$Cmd$none);
						case 'MainMenu':
							return _Utils_Tuple2($author$project$Main$initialModel, $elm$core$Platform$Cmd$none);
						default:
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				}
		}
	});
var $author$project$Main$CancelItem = {$: 'CancelItem'};
var $author$project$Main$LaserCol = {$: 'LaserCol'};
var $author$project$Main$LaserRow = {$: 'LaserRow'};
var $author$project$Main$MainMenu = {$: 'MainMenu'};
var $author$project$Main$Restart = {$: 'Restart'};
var $author$project$Main$UseItem = function (a) {
	return {$: 'UseItem', a: a};
};
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Main$aiLogPanel = function (lines) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'margin', '8px'),
				A2($elm$html$Html$Attributes$style, 'padding', '8px'),
				A2($elm$html$Html$Attributes$style, 'background', '#1e1e1e'),
				A2($elm$html$Html$Attributes$style, 'color', '#d4d4d4'),
				A2($elm$html$Html$Attributes$style, 'font-family', 'Consolas, monospace'),
				A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
				A2($elm$html$Html$Attributes$style, 'max-height', '180px'),
				A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto'),
				A2($elm$html$Html$Attributes$style, 'border', '1px solid #444'),
				A2($elm$html$Html$Attributes$style, 'white-space', 'pre-wrap'),
				A2($elm$html$Html$Attributes$style, 'word-break', 'break-all')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-bottom', '4px')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('AI 動作日誌（可複製貼上）：')
					])),
				$elm$core$List$isEmpty(lines) ? $elm$html$Html$text('（尚無紀錄）') : A2(
				$elm$html$Html$div,
				_List_Nil,
				A2(
					$elm$core$List$map,
					function (s) {
						return A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(s)
								]));
					},
					lines))
			]));
};
var $author$project$Main$CellClicked = function (a) {
	return {$: 'CellClicked', a: a};
};
var $author$project$Main$boardKey = function (model) {
	var b = model.gameState.board;
	return 'board-' + ($elm$core$String$fromInt(
		$elm$core$List$length(b.playerPieces)) + ('-' + ($elm$core$String$fromInt(
		$elm$core$List$length(b.aiPieces)) + ('-' + ($elm$core$String$fromInt(model.gameState.turn) + function () {
		var _v0 = model.selectedPiece;
		if (_v0.$ === 'Nothing') {
			return '-';
		} else {
			var p = _v0.a;
			return '-' + ($elm$core$String$fromInt(p.row) + (',' + $elm$core$String$fromInt(p.col)));
		}
	}())))));
};
var $author$project$Main$itemPreviewLabel = function (model) {
	var _v0 = model.itemMode;
	if (_v0.$ === 'Just') {
		switch (_v0.a.$) {
			case 'Bomb':
				var _v1 = _v0.a;
				return $elm$core$Maybe$Just('炸');
			case 'Laser':
				var _v2 = _v0.a;
				return $elm$core$Maybe$Just('雷');
			default:
				var _v3 = _v0.a;
				return $elm$core$Maybe$Just('盾');
		}
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNode;
var $author$project$Main$pendingCellFrom = function (pending) {
	switch (pending.$) {
		case 'BombAt':
			var p = pending.a;
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(p, '炸'));
		case 'ShieldAt':
			var p = pending.a;
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(p, '盾'));
		default:
			var p = pending.c;
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(p, '雷'));
	}
};
var $author$project$Main$pendingApplyCell = function (model) {
	var _v0 = model.itemPendingApply;
	if (_v0.$ === 'Just') {
		var x = _v0.a;
		return $author$project$Main$pendingCellFrom(x);
	} else {
		var _v1 = model.aiItemPendingApply;
		if (_v1.$ === 'Just') {
			var x = _v1.a;
			return $author$project$Main$pendingCellFrom(x);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	}
};
var $author$project$Main$previewForItem = function (model) {
	var _v0 = model.itemMode;
	_v0$2:
	while (true) {
		if (_v0.$ === 'Just') {
			switch (_v0.a.$) {
				case 'Bomb':
					var _v1 = _v0.a;
					return model.previewCells;
				case 'Laser':
					var _v2 = _v0.a;
					return model.previewCells;
				default:
					break _v0$2;
			}
		} else {
			break _v0$2;
		}
	}
	return _List_Nil;
};
var $author$project$Main$protectedWithTurns = function (model) {
	return A2(
		$elm$core$List$map,
		function (c) {
			return _Utils_Tuple2(c.position, c.remainingTurns);
		},
		A2(
			$elm$core$List$filter,
			function (c) {
				return c.remainingTurns > 0;
			},
			model.gameState.protectedCells));
};
var $author$project$Ui$BoardView$cellLabel = function (content) {
	switch (content.$) {
		case 'Empty':
			return '';
		case 'Piece':
			if (content.a.$ === 'Player') {
				var _v1 = content.a;
				return '馬';
			} else {
				var _v2 = content.a;
				return '炮';
			}
		default:
			if (content.a.$ === 'Player') {
				var _v3 = content.a;
				return '堡';
			} else {
				var _v4 = content.a;
				return '堡';
			}
	}
};
var $author$project$Ui$BoardView$cellSize = 36;
var $author$project$Ui$BoardView$cellStyle = F5(
	function (content, isSelected, isLegal, isPreview, isItemMode) {
		var baseTxt = '#333';
		var baseBg = '#e8dcc4';
		return isPreview ? (isItemMode ? _Utils_Tuple2('#ffcc80', '#5d4037') : _Utils_Tuple2('#b8a888', baseTxt)) : (isLegal ? _Utils_Tuple2('#7cb342', '#fff') : (isSelected ? _Utils_Tuple2('#ffb74d', '#fff') : _Utils_Tuple2(baseBg, baseTxt)));
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Ui$BoardView$remainingAt = F2(
	function (pos, list) {
		return A2(
			$elm$core$Maybe$map,
			function (_v1) {
				var n = _v1.b;
				return n;
			},
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (_v0) {
						var p = _v0.a;
						return A2($author$project$Board$positionEquals, p, pos);
					},
					list)));
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$Ui$BoardView$view = function (board) {
	return function (selected) {
		return function (legalMoves) {
			return function (previewCells) {
				return function (protectedWithTurns) {
					return function (shieldedCells) {
						return function (itemPreviewLabel) {
							return function (pendingApplyCell) {
								return function (isItemMode) {
									return function (toMsg) {
										return A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('board'),
													A2($elm$html$Html$Attributes$style, 'display', 'inline-block')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'display', 'grid'),
															A2(
															$elm$html$Html$Attributes$style,
															'grid-template-columns',
															A2($elm$core$String$repeat, $author$project$Board$boardSize, '1fr ')),
															A2($elm$html$Html$Attributes$style, 'gap', '1px'),
															A2($elm$html$Html$Attributes$style, 'background', '#333')
														]),
													A2(
														$elm$core$List$concatMap,
														function (r) {
															return A2(
																$elm$core$List$map,
																function (c) {
																	var pos = {col: c, row: r};
																	var protectionTurns = A2($author$project$Ui$BoardView$remainingAt, pos, protectedWithTurns);
																	var pendingLabel = A2(
																		$elm$core$Maybe$andThen,
																		function (_v5) {
																			var p = _v5.a;
																			var l = _v5.b;
																			return A2($author$project$Board$positionEquals, pos, p) ? $elm$core$Maybe$Just(l) : $elm$core$Maybe$Nothing;
																		},
																		pendingApplyCell);
																	var isShielded = A2(
																		$elm$core$List$any,
																		$author$project$Board$positionEquals(pos),
																		shieldedCells);
																	var isSelected = A2(
																		$elm$core$Maybe$withDefault,
																		false,
																		A2(
																			$elm$core$Maybe$map,
																			$author$project$Board$positionEquals(pos),
																			selected));
																	var isPreview = A2(
																		$elm$core$List$any,
																		$author$project$Board$positionEquals(pos),
																		previewCells);
																	var isPendingApply = A2(
																		$elm$core$Maybe$withDefault,
																		false,
																		A2(
																			$elm$core$Maybe$map,
																			function (_v4) {
																				var p = _v4.a;
																				return A2($author$project$Board$positionEquals, pos, p);
																			},
																			pendingApplyCell));
																	var isLegal = A2(
																		$elm$core$List$any,
																		$author$project$Board$positionEquals(pos),
																		legalMoves);
																	var content = A2($author$project$Board$cellAt, board, pos);
																	var _v0 = A5($author$project$Ui$BoardView$cellStyle, content, isSelected, isLegal, isPreview, isItemMode);
																	var bg = _v0.a;
																	var txt = _v0.b;
																	return A2(
																		$elm$html$Html$div,
																		_List_fromArray(
																			[
																				A2(
																				$elm$html$Html$Attributes$style,
																				'width',
																				$elm$core$String$fromInt($author$project$Ui$BoardView$cellSize) + 'px'),
																				A2(
																				$elm$html$Html$Attributes$style,
																				'height',
																				$elm$core$String$fromInt($author$project$Ui$BoardView$cellSize) + 'px'),
																				A2($elm$html$Html$Attributes$style, 'background', bg),
																				A2($elm$html$Html$Attributes$style, 'color', txt),
																				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
																				A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
																				A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
																				A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
																				A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
																				A2($elm$html$Html$Attributes$style, 'font-size', '20px'),
																				A2($elm$html$Html$Attributes$style, 'position', 'relative'),
																				$elm$html$Html$Events$onClick(
																				toMsg(pos))
																			]),
																		_List_fromArray(
																			[
																				A2(
																				$elm$html$Html$span,
																				_List_Nil,
																				_List_fromArray(
																					[
																						$elm$html$Html$text(
																						$author$project$Ui$BoardView$cellLabel(content))
																					])),
																				function () {
																				if (protectionTurns.$ === 'Just') {
																					var n = protectionTurns.a;
																					return A2(
																						$elm$html$Html$span,
																						_List_fromArray(
																							[
																								A2($elm$html$Html$Attributes$style, 'font-size', '9px'),
																								A2($elm$html$Html$Attributes$style, 'opacity', '0.9'),
																								A2($elm$html$Html$Attributes$style, 'margin-top', '0px')
																							]),
																						_List_fromArray(
																							[
																								$elm$html$Html$text(
																								'護' + $elm$core$String$fromInt(n))
																							]));
																				} else {
																					return A2($elm$html$Html$span, _List_Nil, _List_Nil);
																				}
																			}(),
																				isShielded ? A2(
																				$elm$html$Html$span,
																				_List_fromArray(
																					[
																						A2($elm$html$Html$Attributes$style, 'font-size', '9px'),
																						A2($elm$html$Html$Attributes$style, 'opacity', '0.95'),
																						A2($elm$html$Html$Attributes$style, 'margin-top', '0px'),
																						A2($elm$html$Html$Attributes$style, 'color', '#2e7d32')
																					]),
																				_List_fromArray(
																					[
																						$elm$html$Html$text('盾')
																					])) : A2($elm$html$Html$span, _List_Nil, _List_Nil),
																				function () {
																				if (isPreview) {
																					if (itemPreviewLabel.$ === 'Just') {
																						var label = itemPreviewLabel.a;
																						return A2(
																							$elm$html$Html$span,
																							_List_fromArray(
																								[
																									A2($elm$html$Html$Attributes$style, 'font-size', '10px'),
																									A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
																									A2($elm$html$Html$Attributes$style, 'margin-top', '1px'),
																									A2($elm$html$Html$Attributes$style, 'color', '#5d4037')
																								]),
																							_List_fromArray(
																								[
																									$elm$html$Html$text(label)
																								]));
																					} else {
																						return A2($elm$html$Html$span, _List_Nil, _List_Nil);
																					}
																				} else {
																					return A2($elm$html$Html$span, _List_Nil, _List_Nil);
																				}
																			}(),
																				function () {
																				if (isPendingApply) {
																					if (pendingLabel.$ === 'Just') {
																						var label = pendingLabel.a;
																						return A2(
																							$elm$html$Html$span,
																							_List_fromArray(
																								[
																									A2($elm$html$Html$Attributes$style, 'font-size', '14px'),
																									A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
																									A2($elm$html$Html$Attributes$style, 'margin-top', '2px'),
																									A2($elm$html$Html$Attributes$style, 'color', '#bf360c')
																								]),
																							_List_fromArray(
																								[
																									$elm$html$Html$text(label)
																								]));
																					} else {
																						return A2($elm$html$Html$span, _List_Nil, _List_Nil);
																					}
																				} else {
																					return A2($elm$html$Html$span, _List_Nil, _List_Nil);
																				}
																			}()
																			]));
																},
																A2($elm$core$List$range, 0, $author$project$Board$boardSize - 1));
														},
														A2($elm$core$List$range, 0, $author$project$Board$boardSize - 1)))
												]));
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Main$boardWithKey = function (model) {
	return A3(
		$elm$html$Html$Keyed$node,
		'div',
		_List_Nil,
		_List_fromArray(
			[
				_Utils_Tuple2(
				$author$project$Main$boardKey(model),
				$author$project$Ui$BoardView$view(model.gameState.board)(model.selectedPiece)(model.legalMoves)(
					$author$project$Main$previewForItem(model))(
					$author$project$Main$protectedWithTurns(model))(
					$author$project$Main$getShielded(model))(
					$author$project$Main$itemPreviewLabel(model))(
					$author$project$Main$pendingApplyCell(model))(
					!_Utils_eq(model.itemMode, $elm$core$Maybe$Nothing))($author$project$Main$CellClicked))
			]));
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $author$project$Main$itemModeHint = function (maybeItem) {
	if (maybeItem.$ === 'Nothing') {
		return $elm$html$Html$text('');
	} else {
		switch (maybeItem.a.$) {
			case 'Bomb':
				var _v1 = maybeItem.a;
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'margin', '4px 8px'),
							A2($elm$html$Html$Attributes$style, 'padding', '6px 10px'),
							A2($elm$html$Html$Attributes$style, 'background', '#fff3e0'),
							A2($elm$html$Html$Attributes$style, 'border', '1px solid #ff9800'),
							A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
							A2($elm$html$Html$Attributes$style, 'color', '#e65100')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('【使用中】炸彈 — 點選敵方棋子或主堡作為中心')
						]));
			case 'Laser':
				var _v2 = maybeItem.a;
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'margin', '4px 8px'),
							A2($elm$html$Html$Attributes$style, 'padding', '6px 10px'),
							A2($elm$html$Html$Attributes$style, 'background', '#e3f2fd'),
							A2($elm$html$Html$Attributes$style, 'border', '1px solid #2196f3'),
							A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
							A2($elm$html$Html$Attributes$style, 'color', '#1565c0')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('【使用中】雷射 — 點選一格後選擇「破壞此行」或「破壞此列」')
						]));
			default:
				var _v3 = maybeItem.a;
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'margin', '4px 8px'),
							A2($elm$html$Html$Attributes$style, 'padding', '6px 10px'),
							A2($elm$html$Html$Attributes$style, 'background', '#e8f5e9'),
							A2($elm$html$Html$Attributes$style, 'border', '1px solid #4caf50'),
							A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
							A2($elm$html$Html$Attributes$style, 'color', '#2e7d32')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('【使用中】護盾 — 點選己方棋子或主堡加上保護')
						]));
		}
	}
};
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $author$project$Ui$Result$view = function (result) {
	return function (reason) {
		return function (playerScore) {
			return function (aiScore) {
				return function (turn) {
					return function (playerCaptures) {
						return function (aiCaptures) {
							return function (playerBomb) {
								return function (playerLaser) {
									return function (playerShield) {
										return function (aiBomb) {
											return function (aiLaser) {
												return function (aiShield) {
													return function (onRestart) {
														return function (onMainMenu) {
															var title = function () {
																switch (result.$) {
																	case 'PlayerWins':
																		return '玩家勝利';
																	case 'AIWins':
																		return 'AI 勝利';
																	case 'Draw':
																		return '平局';
																	default:
																		return '';
																}
															}();
															return A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		A2($elm$html$Html$Attributes$style, 'padding', '24px'),
																		A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
																		A2($elm$html$Html$Attributes$style, 'max-width', '400px'),
																		A2($elm$html$Html$Attributes$style, 'margin', '0 auto')
																	]),
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$h2,
																		_List_Nil,
																		_List_fromArray(
																			[
																				$elm$html$Html$text(title)
																			])),
																		A2(
																		$elm$html$Html$div,
																		_List_fromArray(
																			[
																				A2($elm$html$Html$Attributes$style, 'margin', '8px 0')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text('終局原因: ' + reason)
																			])),
																		A2(
																		$elm$html$Html$div,
																		_List_fromArray(
																			[
																				A2($elm$html$Html$Attributes$style, 'margin', '8px 0')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text(
																				'玩家分數: ' + $elm$core$String$fromInt(playerScore))
																			])),
																		A2(
																		$elm$html$Html$div,
																		_List_fromArray(
																			[
																				A2($elm$html$Html$Attributes$style, 'margin', '8px 0')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text(
																				'AI 分數: ' + $elm$core$String$fromInt(aiScore))
																			])),
																		A2(
																		$elm$html$Html$div,
																		_List_fromArray(
																			[
																				A2($elm$html$Html$Attributes$style, 'margin', '8px 0')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text(
																				'總回合數: ' + $elm$core$String$fromInt(turn))
																			])),
																		A2(
																		$elm$html$Html$div,
																		_List_fromArray(
																			[
																				A2($elm$html$Html$Attributes$style, 'margin', '8px 0')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text(
																				'玩家吃子: ' + ($elm$core$String$fromInt(playerCaptures) + (' / AI 吃子: ' + $elm$core$String$fromInt(aiCaptures))))
																			])),
																		A2(
																		$elm$html$Html$div,
																		_List_fromArray(
																			[
																				A2($elm$html$Html$Attributes$style, 'margin', '8px 0')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text(
																				'玩家道具 炸/雷/盾: ' + ($elm$core$String$fromInt(playerBomb) + (' / ' + ($elm$core$String$fromInt(playerLaser) + (' / ' + $elm$core$String$fromInt(playerShield))))))
																			])),
																		A2(
																		$elm$html$Html$div,
																		_List_fromArray(
																			[
																				A2($elm$html$Html$Attributes$style, 'margin', '8px 0')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text(
																				'AI 道具 炸/雷/盾: ' + ($elm$core$String$fromInt(aiBomb) + (' / ' + ($elm$core$String$fromInt(aiLaser) + (' / ' + $elm$core$String$fromInt(aiShield))))))
																			])),
																		A2(
																		$elm$html$Html$div,
																		_List_fromArray(
																			[
																				A2($elm$html$Html$Attributes$style, 'margin-top', '16px'),
																				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
																				A2($elm$html$Html$Attributes$style, 'gap', '8px'),
																				A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
																			]),
																		_List_fromArray(
																			[
																				A2(
																				$elm$html$Html$button,
																				_List_fromArray(
																					[
																						$elm$html$Html$Events$onClick(onRestart),
																						A2($elm$html$Html$Attributes$style, 'padding', '8px 16px')
																					]),
																				_List_fromArray(
																					[
																						$elm$html$Html$text('重新開始')
																					])),
																				A2(
																				$elm$html$Html$button,
																				_List_fromArray(
																					[
																						$elm$html$Html$Events$onClick(onMainMenu),
																						A2($elm$html$Html$Attributes$style, 'padding', '8px 16px')
																					]),
																				_List_fromArray(
																					[
																						$elm$html$Html$text('回主選單')
																					]))
																			]))
																	]));
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $author$project$Ui$Toolbar$itemButton = F3(
	function (label, enabled, msg) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(msg),
					$elm$html$Html$Attributes$disabled(!enabled),
					A2($elm$html$Html$Attributes$style, 'padding', '4px 12px')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				]));
	});
var $author$project$Ui$Toolbar$view = F7(
	function (playerScore, aiScore, turn, isPlayerTurn, currentItem, onItemClick, onCancelItem) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'margin', '12px 0'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
					A2($elm$html$Html$Attributes$style, 'gap', '8px'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'margin-right', '16px')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'玩家分數: ' + $elm$core$String$fromInt(playerScore))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'margin-right', '16px')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'AI 分數: ' + $elm$core$String$fromInt(aiScore))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'margin-right', '16px')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'回合: ' + $elm$core$String$fromInt(turn))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'margin-right', '8px')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							isPlayerTurn ? '玩家回合' : 'AI 回合')
						])),
					function () {
					if (isPlayerTurn) {
						if (currentItem.$ === 'Nothing') {
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'flex'),
										A2($elm$html$Html$Attributes$style, 'gap', '8px')
									]),
								_List_fromArray(
									[
										A3(
										$author$project$Ui$Toolbar$itemButton,
										'炸彈(3)',
										_Utils_cmp(
											playerScore,
											$author$project$Items$cost($author$project$Items$Bomb)) > -1,
										onItemClick($author$project$Items$Bomb)),
										A3(
										$author$project$Ui$Toolbar$itemButton,
										'雷射(4)',
										_Utils_cmp(
											playerScore,
											$author$project$Items$cost($author$project$Items$Laser)) > -1,
										onItemClick($author$project$Items$Laser)),
										A3(
										$author$project$Ui$Toolbar$itemButton,
										'護盾(2)',
										_Utils_cmp(
											playerScore,
											$author$project$Items$cost($author$project$Items$Shield)) > -1,
										onItemClick($author$project$Items$Shield))
									]));
						} else {
							return A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick(onCancelItem),
										A2($elm$html$Html$Attributes$style, 'padding', '4px 12px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('取消道具')
									]));
						}
					} else {
						return $elm$html$Html$text('');
					}
				}()
				]));
	});
var $author$project$Main$view = function (model) {
	var result = $author$project$Game$checkVictory(model.gameState);
	var _v0 = A2(
		$elm$core$Debug$log,
		'[view] board.playerPieces',
		A2(
			$elm$core$List$map,
			function (p) {
				return _Utils_Tuple2(p.row, p.col);
			},
			model.gameState.board.playerPieces));
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				$elm$core$List$isEmpty(model.testErrors) ? $elm$html$Html$text('') : A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'padding', '12px'),
						A2($elm$html$Html$Attributes$style, 'margin', '8px'),
						A2($elm$html$Html$Attributes$style, 'background', '#ffebee'),
						A2($elm$html$Html$Attributes$style, 'color', '#c62828'),
						A2($elm$html$Html$Attributes$style, 'border', '1px solid #c62828')
					]),
				_Utils_ap(
					_List_fromArray(
						[
							$elm$html$Html$text('測試有誤：')
						]),
					A2(
						$elm$core$List$map,
						function (e) {
							return A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(e)
									]));
						},
						model.testErrors))),
				A7(
				$author$project$Ui$Toolbar$view,
				model.gameState.playerScore,
				model.gameState.aiScore,
				model.gameState.turn,
				_Utils_eq(model.gameState.currentSide, $author$project$Board$Player),
				model.itemMode,
				$author$project$Main$UseItem,
				$author$project$Main$CancelItem),
				$author$project$Main$itemModeHint(model.itemMode),
				$author$project$Main$aiLogPanel(model.aiActionLog),
				function () {
				var _v1 = model.errorMessage;
				if (_v1.$ === 'Just') {
					var e = _v1.a;
					return A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(e)
							]));
				} else {
					return $elm$html$Html$text('');
				}
			}(),
				function () {
				var _v2 = model.laserPending;
				if (_v2.$ === 'Just') {
					return A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								$author$project$Main$boardWithKey(model),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('選擇: ')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Main$LaserRow)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('破壞此行')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Main$LaserCol)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('破壞此列')
									]))
							]));
				} else {
					return $author$project$Main$boardWithKey(model);
				}
			}(),
				function () {
				if (result.$ === 'Ongoing') {
					return $elm$html$Html$text('');
				} else {
					return $author$project$Ui$Result$view(result)(
						(_Utils_cmp(model.gameState.turn, $author$project$Game$maxTurns) > 0) ? '回合上限' : '主堡被佔領')(model.gameState.playerScore)(model.gameState.aiScore)(model.gameState.turn)(model.gameState.playerCaptures)(model.gameState.aiCaptures)(model.gameState.playerBombUse)(model.gameState.playerLaserUse)(model.gameState.playerShieldUse)(model.gameState.aiBombUse)(model.gameState.aiLaserUse)(model.gameState.aiShieldUse)($author$project$Main$Restart)($author$project$Main$MainMenu);
				}
			}()
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{
		init: function (_v0) {
			return _Utils_Tuple2(
				$author$project$Main$initialModel,
				A2(
					$elm$core$Task$perform,
					function (_v1) {
						return $author$project$Main$RunTests;
					},
					$elm$core$Task$succeed(_Utils_Tuple0)));
		},
		subscriptions: function (_v2) {
			return $elm$core$Platform$Sub$none;
		},
		update: $author$project$Main$update,
		view: $author$project$Main$view
	});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));