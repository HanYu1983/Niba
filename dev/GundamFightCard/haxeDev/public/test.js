(function ($global) { "use strict";
var $hxClasses = {},$estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = "HxOverrides";
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) {
		return undefined;
	}
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(len == null) {
		len = s.length;
	} else if(len < 0) {
		if(pos == 0) {
			len = s.length + len;
		} else {
			return "";
		}
	}
	return s.substr(pos,len);
};
HxOverrides.remove = function(a,obj) {
	var i = a.indexOf(obj);
	if(i == -1) {
		return false;
	}
	a.splice(i,1);
	return true;
};
HxOverrides.now = function() {
	return Date.now();
};
var Lambda = function() { };
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = "Lambda";
Lambda.fold = function(it,f,first) {
	var x = $getIterator(it);
	while(x.hasNext()) {
		var x1 = x.next();
		first = f(x1,first);
	}
	return first;
};
Math.__name__ = "Math";
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = "Reflect";
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( _g ) {
		return null;
	}
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) {
			a.push(f);
		}
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	if(typeof(f) == "function") {
		return !(f.__name__ || f.__ename__);
	} else {
		return false;
	}
};
Reflect.compare = function(a,b) {
	if(a == b) {
		return 0;
	} else if(a > b) {
		return 1;
	} else {
		return -1;
	}
};
Reflect.isEnumValue = function(v) {
	if(v != null) {
		return v.__enum__ != null;
	} else {
		return false;
	}
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = "Std";
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
var Test = function() { };
$hxClasses["Test"] = Test;
Test.__name__ = "Test";
Test.main = function() {
	console.log("src/Test.hx:5:","==== Test Start ====");
	model_ver1_test_Test_test();
	console.log("src/Test.hx:7:","==== Test Pass ====");
};
var ValueType = $hxEnums["ValueType"] = { __ename__:true,__constructs__:null
	,TNull: {_hx_name:"TNull",_hx_index:0,__enum__:"ValueType",toString:$estr}
	,TInt: {_hx_name:"TInt",_hx_index:1,__enum__:"ValueType",toString:$estr}
	,TFloat: {_hx_name:"TFloat",_hx_index:2,__enum__:"ValueType",toString:$estr}
	,TBool: {_hx_name:"TBool",_hx_index:3,__enum__:"ValueType",toString:$estr}
	,TObject: {_hx_name:"TObject",_hx_index:4,__enum__:"ValueType",toString:$estr}
	,TFunction: {_hx_name:"TFunction",_hx_index:5,__enum__:"ValueType",toString:$estr}
	,TClass: ($_=function(c) { return {_hx_index:6,c:c,__enum__:"ValueType",toString:$estr}; },$_._hx_name="TClass",$_.__params__ = ["c"],$_)
	,TEnum: ($_=function(e) { return {_hx_index:7,e:e,__enum__:"ValueType",toString:$estr}; },$_._hx_name="TEnum",$_.__params__ = ["e"],$_)
	,TUnknown: {_hx_name:"TUnknown",_hx_index:8,__enum__:"ValueType",toString:$estr}
};
ValueType.__constructs__ = [ValueType.TNull,ValueType.TInt,ValueType.TFloat,ValueType.TBool,ValueType.TObject,ValueType.TFunction,ValueType.TClass,ValueType.TEnum,ValueType.TUnknown];
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = "Type";
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) {
		throw haxe_Exception.thrown("No such constructor " + constr);
	}
	if(Reflect.isFunction(f)) {
		if(params == null) {
			throw haxe_Exception.thrown("Constructor " + constr + " need parameters");
		}
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) {
		throw haxe_Exception.thrown("Constructor " + constr + " does not need parameters");
	}
	return f;
};
Type.typeof = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "function":
		if(v.__name__ || v.__ename__) {
			return ValueType.TObject;
		}
		return ValueType.TFunction;
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) {
			return ValueType.TInt;
		}
		return ValueType.TFloat;
	case "object":
		if(v == null) {
			return ValueType.TNull;
		}
		var e = v.__enum__;
		if(e != null) {
			return ValueType.TEnum($hxEnums[e]);
		}
		var c = js_Boot.getClass(v);
		if(c != null) {
			return ValueType.TClass(c);
		}
		return ValueType.TObject;
	case "string":
		return ValueType.TClass(String);
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
Type.enumEq = function(a,b) {
	if(a == b) {
		return true;
	}
	try {
		var e = a.__enum__;
		if(e == null || e != b.__enum__) {
			return false;
		}
		if(a._hx_index != b._hx_index) {
			return false;
		}
		var enm = $hxEnums[e];
		var params = enm.__constructs__[a._hx_index].__params__;
		var _g = 0;
		while(_g < params.length) {
			var f = params[_g];
			++_g;
			if(!Type.enumEq(a[f],b[f])) {
				return false;
			}
		}
	} catch( _g ) {
		return false;
	}
	return true;
};
Type.enumParameters = function(e) {
	var enm = $hxEnums[e.__enum__];
	var params = enm.__constructs__[e._hx_index].__params__;
	if(params != null) {
		var _g = [];
		var _g1 = 0;
		while(_g1 < params.length) {
			var p = params[_g1];
			++_g1;
			_g.push(e[p]);
		}
		return _g;
	} else {
		return [];
	}
};
var haxe_IMap = function() { };
$hxClasses["haxe.IMap"] = haxe_IMap;
haxe_IMap.__name__ = "haxe.IMap";
haxe_IMap.__isInterface__ = true;
haxe_IMap.prototype = {
	__class__: haxe_IMap
};
var haxe_Exception = function(message,previous,native) {
	Error.call(this,message);
	this.message = message;
	this.__previousException = previous;
	this.__nativeException = native != null ? native : this;
};
$hxClasses["haxe.Exception"] = haxe_Exception;
haxe_Exception.__name__ = "haxe.Exception";
haxe_Exception.caught = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value;
	} else if(((value) instanceof Error)) {
		return new haxe_Exception(value.message,null,value);
	} else {
		return new haxe_ValueException(value,null,value);
	}
};
haxe_Exception.thrown = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value.get_native();
	} else if(((value) instanceof Error)) {
		return value;
	} else {
		var e = new haxe_ValueException(value);
		return e;
	}
};
haxe_Exception.__super__ = Error;
haxe_Exception.prototype = $extend(Error.prototype,{
	toString: function() {
		return this.get_message();
	}
	,get_message: function() {
		return this.message;
	}
	,get_native: function() {
		return this.__nativeException;
	}
	,__class__: haxe_Exception
});
var haxe__$Int64__$_$_$Int64 = function(high,low) {
	this.high = high;
	this.low = low;
};
$hxClasses["haxe._Int64.___Int64"] = haxe__$Int64__$_$_$Int64;
haxe__$Int64__$_$_$Int64.__name__ = "haxe._Int64.___Int64";
haxe__$Int64__$_$_$Int64.prototype = {
	__class__: haxe__$Int64__$_$_$Int64
};
var haxe_ValueException = function(value,previous,native) {
	haxe_Exception.call(this,String(value),previous,native);
	this.value = value;
};
$hxClasses["haxe.ValueException"] = haxe_ValueException;
haxe_ValueException.__name__ = "haxe.ValueException";
haxe_ValueException.__super__ = haxe_Exception;
haxe_ValueException.prototype = $extend(haxe_Exception.prototype,{
	__class__: haxe_ValueException
});
var haxe_crypto_Crc32 = function() { };
$hxClasses["haxe.crypto.Crc32"] = haxe_crypto_Crc32;
haxe_crypto_Crc32.__name__ = "haxe.crypto.Crc32";
haxe_crypto_Crc32.make = function(data) {
	var c_crc = -1;
	var b = data.b.bufferValue;
	var _g = 0;
	var _g1 = data.length;
	while(_g < _g1) {
		var i = _g++;
		var tmp = (c_crc ^ b.bytes[i]) & 255;
		tmp = tmp >>> 1 ^ -(tmp & 1) & -306674912;
		tmp = tmp >>> 1 ^ -(tmp & 1) & -306674912;
		tmp = tmp >>> 1 ^ -(tmp & 1) & -306674912;
		tmp = tmp >>> 1 ^ -(tmp & 1) & -306674912;
		tmp = tmp >>> 1 ^ -(tmp & 1) & -306674912;
		tmp = tmp >>> 1 ^ -(tmp & 1) & -306674912;
		tmp = tmp >>> 1 ^ -(tmp & 1) & -306674912;
		tmp = tmp >>> 1 ^ -(tmp & 1) & -306674912;
		c_crc = c_crc >>> 8 ^ tmp;
	}
	return c_crc ^ -1;
};
var haxe_crypto_Md5 = function() {
};
$hxClasses["haxe.crypto.Md5"] = haxe_crypto_Md5;
haxe_crypto_Md5.__name__ = "haxe.crypto.Md5";
haxe_crypto_Md5.make = function(b) {
	var h = new haxe_crypto_Md5().doEncode(haxe_crypto_Md5.bytes2blks(b));
	var out = new haxe_io_Bytes(new ArrayBuffer(16));
	var p = 0;
	out.b[p++] = h[0] & 255;
	out.b[p++] = h[0] >> 8 & 255;
	out.b[p++] = h[0] >> 16 & 255;
	out.b[p++] = h[0] >>> 24;
	out.b[p++] = h[1] & 255;
	out.b[p++] = h[1] >> 8 & 255;
	out.b[p++] = h[1] >> 16 & 255;
	out.b[p++] = h[1] >>> 24;
	out.b[p++] = h[2] & 255;
	out.b[p++] = h[2] >> 8 & 255;
	out.b[p++] = h[2] >> 16 & 255;
	out.b[p++] = h[2] >>> 24;
	out.b[p++] = h[3] & 255;
	out.b[p++] = h[3] >> 8 & 255;
	out.b[p++] = h[3] >> 16 & 255;
	out.b[p++] = h[3] >>> 24;
	return out;
};
haxe_crypto_Md5.bytes2blks = function(b) {
	var nblk = (b.length + 8 >> 6) + 1;
	var blks = [];
	var blksSize = nblk * 16;
	var _g = 0;
	var _g1 = blksSize;
	while(_g < _g1) {
		var i = _g++;
		blks[i] = 0;
	}
	var i = 0;
	while(i < b.length) {
		blks[i >> 2] |= b.b[i] << (((b.length << 3) + i & 3) << 3);
		++i;
	}
	blks[i >> 2] |= 128 << (b.length * 8 + i) % 4 * 8;
	var l = b.length * 8;
	var k = nblk * 16 - 2;
	blks[k] = l & 255;
	blks[k] |= (l >>> 8 & 255) << 8;
	blks[k] |= (l >>> 16 & 255) << 16;
	blks[k] |= (l >>> 24 & 255) << 24;
	return blks;
};
haxe_crypto_Md5.prototype = {
	bitOR: function(a,b) {
		var lsb = a & 1 | b & 1;
		var msb31 = a >>> 1 | b >>> 1;
		return msb31 << 1 | lsb;
	}
	,bitXOR: function(a,b) {
		var lsb = a & 1 ^ b & 1;
		var msb31 = a >>> 1 ^ b >>> 1;
		return msb31 << 1 | lsb;
	}
	,bitAND: function(a,b) {
		var lsb = a & 1 & (b & 1);
		var msb31 = a >>> 1 & b >>> 1;
		return msb31 << 1 | lsb;
	}
	,addme: function(x,y) {
		var lsw = (x & 65535) + (y & 65535);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return msw << 16 | lsw & 65535;
	}
	,rol: function(num,cnt) {
		return num << cnt | num >>> 32 - cnt;
	}
	,cmn: function(q,a,b,x,s,t) {
		return this.addme(this.rol(this.addme(this.addme(a,q),this.addme(x,t)),s),b);
	}
	,ff: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitOR(this.bitAND(b,c),this.bitAND(~b,d)),a,b,x,s,t);
	}
	,gg: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitOR(this.bitAND(b,d),this.bitAND(c,~d)),a,b,x,s,t);
	}
	,hh: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitXOR(this.bitXOR(b,c),d),a,b,x,s,t);
	}
	,ii: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitXOR(c,this.bitOR(b,~d)),a,b,x,s,t);
	}
	,doEncode: function(x) {
		var a = 1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d = 271733878;
		var step;
		var i = 0;
		while(i < x.length) {
			var olda = a;
			var oldb = b;
			var oldc = c;
			var oldd = d;
			step = 0;
			a = this.ff(a,b,c,d,x[i],7,-680876936);
			d = this.ff(d,a,b,c,x[i + 1],12,-389564586);
			c = this.ff(c,d,a,b,x[i + 2],17,606105819);
			b = this.ff(b,c,d,a,x[i + 3],22,-1044525330);
			a = this.ff(a,b,c,d,x[i + 4],7,-176418897);
			d = this.ff(d,a,b,c,x[i + 5],12,1200080426);
			c = this.ff(c,d,a,b,x[i + 6],17,-1473231341);
			b = this.ff(b,c,d,a,x[i + 7],22,-45705983);
			a = this.ff(a,b,c,d,x[i + 8],7,1770035416);
			d = this.ff(d,a,b,c,x[i + 9],12,-1958414417);
			c = this.ff(c,d,a,b,x[i + 10],17,-42063);
			b = this.ff(b,c,d,a,x[i + 11],22,-1990404162);
			a = this.ff(a,b,c,d,x[i + 12],7,1804603682);
			d = this.ff(d,a,b,c,x[i + 13],12,-40341101);
			c = this.ff(c,d,a,b,x[i + 14],17,-1502002290);
			b = this.ff(b,c,d,a,x[i + 15],22,1236535329);
			a = this.gg(a,b,c,d,x[i + 1],5,-165796510);
			d = this.gg(d,a,b,c,x[i + 6],9,-1069501632);
			c = this.gg(c,d,a,b,x[i + 11],14,643717713);
			b = this.gg(b,c,d,a,x[i],20,-373897302);
			a = this.gg(a,b,c,d,x[i + 5],5,-701558691);
			d = this.gg(d,a,b,c,x[i + 10],9,38016083);
			c = this.gg(c,d,a,b,x[i + 15],14,-660478335);
			b = this.gg(b,c,d,a,x[i + 4],20,-405537848);
			a = this.gg(a,b,c,d,x[i + 9],5,568446438);
			d = this.gg(d,a,b,c,x[i + 14],9,-1019803690);
			c = this.gg(c,d,a,b,x[i + 3],14,-187363961);
			b = this.gg(b,c,d,a,x[i + 8],20,1163531501);
			a = this.gg(a,b,c,d,x[i + 13],5,-1444681467);
			d = this.gg(d,a,b,c,x[i + 2],9,-51403784);
			c = this.gg(c,d,a,b,x[i + 7],14,1735328473);
			b = this.gg(b,c,d,a,x[i + 12],20,-1926607734);
			a = this.hh(a,b,c,d,x[i + 5],4,-378558);
			d = this.hh(d,a,b,c,x[i + 8],11,-2022574463);
			c = this.hh(c,d,a,b,x[i + 11],16,1839030562);
			b = this.hh(b,c,d,a,x[i + 14],23,-35309556);
			a = this.hh(a,b,c,d,x[i + 1],4,-1530992060);
			d = this.hh(d,a,b,c,x[i + 4],11,1272893353);
			c = this.hh(c,d,a,b,x[i + 7],16,-155497632);
			b = this.hh(b,c,d,a,x[i + 10],23,-1094730640);
			a = this.hh(a,b,c,d,x[i + 13],4,681279174);
			d = this.hh(d,a,b,c,x[i],11,-358537222);
			c = this.hh(c,d,a,b,x[i + 3],16,-722521979);
			b = this.hh(b,c,d,a,x[i + 6],23,76029189);
			a = this.hh(a,b,c,d,x[i + 9],4,-640364487);
			d = this.hh(d,a,b,c,x[i + 12],11,-421815835);
			c = this.hh(c,d,a,b,x[i + 15],16,530742520);
			b = this.hh(b,c,d,a,x[i + 2],23,-995338651);
			a = this.ii(a,b,c,d,x[i],6,-198630844);
			d = this.ii(d,a,b,c,x[i + 7],10,1126891415);
			c = this.ii(c,d,a,b,x[i + 14],15,-1416354905);
			b = this.ii(b,c,d,a,x[i + 5],21,-57434055);
			a = this.ii(a,b,c,d,x[i + 12],6,1700485571);
			d = this.ii(d,a,b,c,x[i + 3],10,-1894986606);
			c = this.ii(c,d,a,b,x[i + 10],15,-1051523);
			b = this.ii(b,c,d,a,x[i + 1],21,-2054922799);
			a = this.ii(a,b,c,d,x[i + 8],6,1873313359);
			d = this.ii(d,a,b,c,x[i + 15],10,-30611744);
			c = this.ii(c,d,a,b,x[i + 6],15,-1560198380);
			b = this.ii(b,c,d,a,x[i + 13],21,1309151649);
			a = this.ii(a,b,c,d,x[i + 4],6,-145523070);
			d = this.ii(d,a,b,c,x[i + 11],10,-1120210379);
			c = this.ii(c,d,a,b,x[i + 2],15,718787259);
			b = this.ii(b,c,d,a,x[i + 9],21,-343485551);
			a = this.addme(a,olda);
			b = this.addme(b,oldb);
			c = this.addme(c,oldc);
			d = this.addme(d,oldd);
			i += 16;
		}
		return [a,b,c,d];
	}
	,__class__: haxe_crypto_Md5
};
var haxe_ds_BalancedTree = function() {
};
$hxClasses["haxe.ds.BalancedTree"] = haxe_ds_BalancedTree;
haxe_ds_BalancedTree.__name__ = "haxe.ds.BalancedTree";
haxe_ds_BalancedTree.__interfaces__ = [haxe_IMap];
haxe_ds_BalancedTree.prototype = {
	set: function(key,value) {
		this.root = this.setLoop(key,value,this.root);
	}
	,get: function(key) {
		var node = this.root;
		while(node != null) {
			var c = this.compare(key,node.key);
			if(c == 0) {
				return node.value;
			}
			if(c < 0) {
				node = node.left;
			} else {
				node = node.right;
			}
		}
		return null;
	}
	,keys: function() {
		var ret = [];
		this.keysLoop(this.root,ret);
		return new haxe_iterators_ArrayIterator(ret);
	}
	,setLoop: function(k,v,node) {
		if(node == null) {
			return new haxe_ds_TreeNode(null,k,v,null);
		}
		var c = this.compare(k,node.key);
		if(c == 0) {
			return new haxe_ds_TreeNode(node.left,k,v,node.right,node == null ? 0 : node._height);
		} else if(c < 0) {
			var nl = this.setLoop(k,v,node.left);
			return this.balance(nl,node.key,node.value,node.right);
		} else {
			var nr = this.setLoop(k,v,node.right);
			return this.balance(node.left,node.key,node.value,nr);
		}
	}
	,keysLoop: function(node,acc) {
		if(node != null) {
			this.keysLoop(node.left,acc);
			acc.push(node.key);
			this.keysLoop(node.right,acc);
		}
	}
	,balance: function(l,k,v,r) {
		var hl = l == null ? 0 : l._height;
		var hr = r == null ? 0 : r._height;
		if(hl > hr + 2) {
			var _this = l.left;
			var _this1 = l.right;
			if((_this == null ? 0 : _this._height) >= (_this1 == null ? 0 : _this1._height)) {
				return new haxe_ds_TreeNode(l.left,l.key,l.value,new haxe_ds_TreeNode(l.right,k,v,r));
			} else {
				return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l.left,l.key,l.value,l.right.left),l.right.key,l.right.value,new haxe_ds_TreeNode(l.right.right,k,v,r));
			}
		} else if(hr > hl + 2) {
			var _this = r.right;
			var _this1 = r.left;
			if((_this == null ? 0 : _this._height) > (_this1 == null ? 0 : _this1._height)) {
				return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l,k,v,r.left),r.key,r.value,r.right);
			} else {
				return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l,k,v,r.left.left),r.left.key,r.left.value,new haxe_ds_TreeNode(r.left.right,r.key,r.value,r.right));
			}
		} else {
			return new haxe_ds_TreeNode(l,k,v,r,(hl > hr ? hl : hr) + 1);
		}
	}
	,compare: function(k1,k2) {
		return Reflect.compare(k1,k2);
	}
	,__class__: haxe_ds_BalancedTree
};
var haxe_ds_TreeNode = function(l,k,v,r,h) {
	if(h == null) {
		h = -1;
	}
	this.left = l;
	this.key = k;
	this.value = v;
	this.right = r;
	if(h == -1) {
		var tmp;
		var _this = this.left;
		var _this1 = this.right;
		if((_this == null ? 0 : _this._height) > (_this1 == null ? 0 : _this1._height)) {
			var _this = this.left;
			tmp = _this == null ? 0 : _this._height;
		} else {
			var _this = this.right;
			tmp = _this == null ? 0 : _this._height;
		}
		this._height = tmp + 1;
	} else {
		this._height = h;
	}
};
$hxClasses["haxe.ds.TreeNode"] = haxe_ds_TreeNode;
haxe_ds_TreeNode.__name__ = "haxe.ds.TreeNode";
haxe_ds_TreeNode.prototype = {
	__class__: haxe_ds_TreeNode
};
var haxe_ds_EnumValueMap = function() {
	haxe_ds_BalancedTree.call(this);
};
$hxClasses["haxe.ds.EnumValueMap"] = haxe_ds_EnumValueMap;
haxe_ds_EnumValueMap.__name__ = "haxe.ds.EnumValueMap";
haxe_ds_EnumValueMap.__interfaces__ = [haxe_IMap];
haxe_ds_EnumValueMap.__super__ = haxe_ds_BalancedTree;
haxe_ds_EnumValueMap.prototype = $extend(haxe_ds_BalancedTree.prototype,{
	compare: function(k1,k2) {
		var d = k1._hx_index - k2._hx_index;
		if(d != 0) {
			return d;
		}
		var p1 = Type.enumParameters(k1);
		var p2 = Type.enumParameters(k2);
		if(p1.length == 0 && p2.length == 0) {
			return 0;
		}
		return this.compareArgs(p1,p2);
	}
	,compareArgs: function(a1,a2) {
		var ld = a1.length - a2.length;
		if(ld != 0) {
			return ld;
		}
		var _g = 0;
		var _g1 = a1.length;
		while(_g < _g1) {
			var i = _g++;
			var d = this.compareArg(a1[i],a2[i]);
			if(d != 0) {
				return d;
			}
		}
		return 0;
	}
	,compareArg: function(v1,v2) {
		if(Reflect.isEnumValue(v1) && Reflect.isEnumValue(v2)) {
			return this.compare(v1,v2);
		} else if(((v1) instanceof Array) && ((v2) instanceof Array)) {
			return this.compareArgs(v1,v2);
		} else {
			return Reflect.compare(v1,v2);
		}
	}
	,__class__: haxe_ds_EnumValueMap
});
var haxe_ds_IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe_ds_IntMap;
haxe_ds_IntMap.__name__ = "haxe.ds.IntMap";
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
haxe_ds_IntMap.prototype = {
	get: function(key) {
		return this.h[key];
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) {
			return false;
		}
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) if(this.h.hasOwnProperty(key)) a.push(+key);
		return new haxe_iterators_ArrayIterator(a);
	}
	,__class__: haxe_ds_IntMap
};
var haxe_ds_ObjectMap = function() {
	this.h = { __keys__ : { }};
};
$hxClasses["haxe.ds.ObjectMap"] = haxe_ds_ObjectMap;
haxe_ds_ObjectMap.__name__ = "haxe.ds.ObjectMap";
haxe_ds_ObjectMap.__interfaces__ = [haxe_IMap];
haxe_ds_ObjectMap.prototype = {
	set: function(key,value) {
		var id = key.__id__;
		if(id == null) {
			id = (key.__id__ = $global.$haxeUID++);
		}
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,get: function(key) {
		return this.h[key.__id__];
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) {
			a.push(this.h.__keys__[key]);
		}
		}
		return new haxe_iterators_ArrayIterator(a);
	}
	,__class__: haxe_ds_ObjectMap
};
var haxe_ds_Option = $hxEnums["haxe.ds.Option"] = { __ename__:true,__constructs__:null
	,Some: ($_=function(v) { return {_hx_index:0,v:v,__enum__:"haxe.ds.Option",toString:$estr}; },$_._hx_name="Some",$_.__params__ = ["v"],$_)
	,None: {_hx_name:"None",_hx_index:1,__enum__:"haxe.ds.Option",toString:$estr}
};
haxe_ds_Option.__constructs__ = [haxe_ds_Option.Some,haxe_ds_Option.None];
var haxe_ds_StringMap = function() {
	this.h = Object.create(null);
};
$hxClasses["haxe.ds.StringMap"] = haxe_ds_StringMap;
haxe_ds_StringMap.__name__ = "haxe.ds.StringMap";
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	get: function(key) {
		return this.h[key];
	}
	,keys: function() {
		return new haxe_ds__$StringMap_StringMapKeyIterator(this.h);
	}
	,__class__: haxe_ds_StringMap
};
var haxe_ds__$StringMap_StringMapKeyIterator = function(h) {
	this.h = h;
	this.keys = Object.keys(h);
	this.length = this.keys.length;
	this.current = 0;
};
$hxClasses["haxe.ds._StringMap.StringMapKeyIterator"] = haxe_ds__$StringMap_StringMapKeyIterator;
haxe_ds__$StringMap_StringMapKeyIterator.__name__ = "haxe.ds._StringMap.StringMapKeyIterator";
haxe_ds__$StringMap_StringMapKeyIterator.prototype = {
	hasNext: function() {
		return this.current < this.length;
	}
	,next: function() {
		return this.keys[this.current++];
	}
	,__class__: haxe_ds__$StringMap_StringMapKeyIterator
};
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
$hxClasses["haxe.io.Bytes"] = haxe_io_Bytes;
haxe_io_Bytes.__name__ = "haxe.io.Bytes";
haxe_io_Bytes.ofString = function(s,encoding) {
	if(encoding == haxe_io_Encoding.RawNative) {
		var buf = new Uint8Array(s.length << 1);
		var _g = 0;
		var _g1 = s.length;
		while(_g < _g1) {
			var i = _g++;
			var c = s.charCodeAt(i);
			buf[i << 1] = c & 255;
			buf[i << 1 | 1] = c >> 8;
		}
		return new haxe_io_Bytes(buf.buffer);
	}
	var a = [];
	var i = 0;
	while(i < s.length) {
		var c = s.charCodeAt(i++);
		if(55296 <= c && c <= 56319) {
			c = c - 55232 << 10 | s.charCodeAt(i++) & 1023;
		}
		if(c <= 127) {
			a.push(c);
		} else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe_io_Bytes(new Uint8Array(a).buffer);
};
haxe_io_Bytes.ofHex = function(s) {
	if((s.length & 1) != 0) {
		throw haxe_Exception.thrown("Not a hex string (odd number of digits)");
	}
	var a = [];
	var i = 0;
	var len = s.length >> 1;
	while(i < len) {
		var high = s.charCodeAt(i * 2);
		var low = s.charCodeAt(i * 2 + 1);
		high = (high & 15) + ((high & 64) >> 6) * 9;
		low = (low & 15) + ((low & 64) >> 6) * 9;
		a.push((high << 4 | low) & 255);
		++i;
	}
	return new haxe_io_Bytes(new Uint8Array(a).buffer);
};
haxe_io_Bytes.prototype = {
	sub: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) {
			throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
		}
		return new haxe_io_Bytes(this.b.buffer.slice(pos + this.b.byteOffset,pos + this.b.byteOffset + len));
	}
	,getDouble: function(pos) {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
		return this.data.getFloat64(pos,true);
	}
	,getFloat: function(pos) {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
		return this.data.getFloat32(pos,true);
	}
	,getInt32: function(pos) {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
		return this.data.getInt32(pos,true);
	}
	,getInt64: function(pos) {
		var this1 = new haxe__$Int64__$_$_$Int64(this.getInt32(pos + 4),this.getInt32(pos));
		return this1;
	}
	,getString: function(pos,len,encoding) {
		if(pos < 0 || len < 0 || pos + len > this.length) {
			throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
		}
		if(encoding == null) {
			encoding = haxe_io_Encoding.UTF8;
		}
		var s = "";
		var b = this.b;
		var i = pos;
		var max = pos + len;
		switch(encoding._hx_index) {
		case 0:
			var debug = pos > 0;
			while(i < max) {
				var c = b[i++];
				if(c < 128) {
					if(c == 0) {
						break;
					}
					s += String.fromCodePoint(c);
				} else if(c < 224) {
					var code = (c & 63) << 6 | b[i++] & 127;
					s += String.fromCodePoint(code);
				} else if(c < 240) {
					var c2 = b[i++];
					var code1 = (c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127;
					s += String.fromCodePoint(code1);
				} else {
					var c21 = b[i++];
					var c3 = b[i++];
					var u = (c & 15) << 18 | (c21 & 127) << 12 | (c3 & 127) << 6 | b[i++] & 127;
					s += String.fromCodePoint(u);
				}
			}
			break;
		case 1:
			while(i < max) {
				var c = b[i++] | b[i++] << 8;
				s += String.fromCodePoint(c);
			}
			break;
		}
		return s;
	}
	,toHex: function() {
		var s_b = "";
		var chars = [];
		var str = "0123456789abcdef";
		var _g = 0;
		var _g1 = str.length;
		while(_g < _g1) {
			var i = _g++;
			chars.push(HxOverrides.cca(str,i));
		}
		var _g = 0;
		var _g1 = this.length;
		while(_g < _g1) {
			var i = _g++;
			var c = this.b[i];
			s_b += String.fromCodePoint(chars[c >> 4]);
			s_b += String.fromCodePoint(chars[c & 15]);
		}
		return s_b;
	}
	,__class__: haxe_io_Bytes
};
var haxe_io_BytesBuffer = function() {
	this.pos = 0;
	this.size = 0;
};
$hxClasses["haxe.io.BytesBuffer"] = haxe_io_BytesBuffer;
haxe_io_BytesBuffer.__name__ = "haxe.io.BytesBuffer";
haxe_io_BytesBuffer.prototype = {
	addByte: function(byte) {
		if(this.pos == this.size) {
			this.grow(1);
		}
		this.view.setUint8(this.pos++,byte);
	}
	,add: function(src) {
		if(this.pos + src.length > this.size) {
			this.grow(src.length);
		}
		if(this.size == 0) {
			return;
		}
		var sub = new Uint8Array(src.b.buffer,src.b.byteOffset,src.length);
		this.u8.set(sub,this.pos);
		this.pos += src.length;
	}
	,addInt32: function(v) {
		if(this.pos + 4 > this.size) {
			this.grow(4);
		}
		this.view.setInt32(this.pos,v,true);
		this.pos += 4;
	}
	,addInt64: function(v) {
		if(this.pos + 8 > this.size) {
			this.grow(8);
		}
		this.view.setInt32(this.pos,v.low,true);
		this.view.setInt32(this.pos + 4,v.high,true);
		this.pos += 8;
	}
	,addFloat: function(v) {
		if(this.pos + 4 > this.size) {
			this.grow(4);
		}
		this.view.setFloat32(this.pos,v,true);
		this.pos += 4;
	}
	,addDouble: function(v) {
		if(this.pos + 8 > this.size) {
			this.grow(8);
		}
		this.view.setFloat64(this.pos,v,true);
		this.pos += 8;
	}
	,addBytes: function(src,pos,len) {
		if(pos < 0 || len < 0 || pos + len > src.length) {
			throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
		}
		if(this.pos + len > this.size) {
			this.grow(len);
		}
		if(this.size == 0) {
			return;
		}
		var sub = new Uint8Array(src.b.buffer,src.b.byteOffset + pos,len);
		this.u8.set(sub,this.pos);
		this.pos += len;
	}
	,grow: function(delta) {
		var req = this.pos + delta;
		var nsize = this.size == 0 ? 16 : this.size;
		while(nsize < req) nsize = nsize * 3 >> 1;
		var nbuf = new ArrayBuffer(nsize);
		var nu8 = new Uint8Array(nbuf);
		if(this.size > 0) {
			nu8.set(this.u8);
		}
		this.size = nsize;
		this.buffer = nbuf;
		this.u8 = nu8;
		this.view = new DataView(this.buffer);
	}
	,getBytes: function() {
		if(this.size == 0) {
			return new haxe_io_Bytes(new ArrayBuffer(0));
		}
		var b = new haxe_io_Bytes(this.buffer);
		b.length = this.pos;
		return b;
	}
	,__class__: haxe_io_BytesBuffer
};
var haxe_io_Encoding = $hxEnums["haxe.io.Encoding"] = { __ename__:true,__constructs__:null
	,UTF8: {_hx_name:"UTF8",_hx_index:0,__enum__:"haxe.io.Encoding",toString:$estr}
	,RawNative: {_hx_name:"RawNative",_hx_index:1,__enum__:"haxe.io.Encoding",toString:$estr}
};
haxe_io_Encoding.__constructs__ = [haxe_io_Encoding.UTF8,haxe_io_Encoding.RawNative];
var haxe_io_Error = $hxEnums["haxe.io.Error"] = { __ename__:true,__constructs__:null
	,Blocked: {_hx_name:"Blocked",_hx_index:0,__enum__:"haxe.io.Error",toString:$estr}
	,Overflow: {_hx_name:"Overflow",_hx_index:1,__enum__:"haxe.io.Error",toString:$estr}
	,OutsideBounds: {_hx_name:"OutsideBounds",_hx_index:2,__enum__:"haxe.io.Error",toString:$estr}
	,Custom: ($_=function(e) { return {_hx_index:3,e:e,__enum__:"haxe.io.Error",toString:$estr}; },$_._hx_name="Custom",$_.__params__ = ["e"],$_)
};
haxe_io_Error.__constructs__ = [haxe_io_Error.Blocked,haxe_io_Error.Overflow,haxe_io_Error.OutsideBounds,haxe_io_Error.Custom];
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
$hxClasses["haxe.iterators.ArrayIterator"] = haxe_iterators_ArrayIterator;
haxe_iterators_ArrayIterator.__name__ = "haxe.iterators.ArrayIterator";
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
	,__class__: haxe_iterators_ArrayIterator
};
var haxe_rtti_Meta = function() { };
$hxClasses["haxe.rtti.Meta"] = haxe_rtti_Meta;
haxe_rtti_Meta.__name__ = "haxe.rtti.Meta";
haxe_rtti_Meta.getType = function(t) {
	var meta = haxe_rtti_Meta.getMeta(t);
	if(meta == null || meta.obj == null) {
		return { };
	} else {
		return meta.obj;
	}
};
haxe_rtti_Meta.getMeta = function(t) {
	return t.__meta__;
};
var hxbit_ConvertField = function(path,from,to) {
	this.path = path;
	this.from = from;
	this.to = to;
};
$hxClasses["hxbit.ConvertField"] = hxbit_ConvertField;
hxbit_ConvertField.__name__ = "hxbit.ConvertField";
hxbit_ConvertField.prototype = {
	__class__: hxbit_ConvertField
};
var hxbit_Convert = function(classPath,ourSchema,schema) {
	var ourMap_h = Object.create(null);
	var _g = 0;
	var _g1 = ourSchema.fieldsNames.length;
	while(_g < _g1) {
		var i = _g++;
		ourMap_h[ourSchema.fieldsNames[i]] = ourSchema.fieldsTypes[i];
	}
	this.read = [];
	this.hadCID = !schema.isFinal;
	this.hasCID = !ourSchema.isFinal;
	var map_h = Object.create(null);
	var _g = 0;
	var _g1 = schema.fieldsNames.length;
	while(_g < _g1) {
		var i = _g++;
		var oldT = schema.fieldsTypes[i];
		var newT = ourMap_h[schema.fieldsNames[i]];
		var c = new hxbit_ConvertField(classPath + "." + schema.fieldsNames[i],oldT,newT);
		if(newT != null) {
			if(hxbit_Convert.sameType(oldT,newT)) {
				c.same = true;
			} else {
				c.conv = hxbit_Convert.convFuns.h[c.path];
				c.defaultValue = hxbit_Convert.getDefault(newT);
			}
		}
		c.index = this.read.length;
		this.read.push(c);
		map_h[schema.fieldsNames[i]] = c;
	}
	this.write = [];
	var _g = 0;
	var _g1 = ourSchema.fieldsNames.length;
	while(_g < _g1) {
		var i = _g++;
		var newT = ourSchema.fieldsTypes[i];
		var c = map_h[ourSchema.fieldsNames[i]];
		if(c == null) {
			c = new hxbit_ConvertField(null,null,newT);
			c.defaultValue = hxbit_Convert.getDefault(newT);
		}
		this.write.push(c);
	}
};
$hxClasses["hxbit.Convert"] = hxbit_Convert;
hxbit_Convert.__name__ = "hxbit.Convert";
hxbit_Convert.sameType = function(a,b) {
	switch(a._hx_index) {
	case 0:
		switch(b._hx_index) {
		case 10:
			var b1 = b.k;
			return hxbit_Convert.sameType(a,b1);
		case 16:
			var _g = b.t;
			return true;
		default:
			return Type.enumEq(a,b);
		}
		break;
	case 7:
		var _g = a.k;
		var _g1 = a.v;
		switch(b._hx_index) {
		case 7:
			var bk = b.k;
			var bv = b.v;
			var av = _g1;
			var ak = _g;
			if(hxbit_Convert.sameType(ak,bk)) {
				return hxbit_Convert.sameType(av,bv);
			} else {
				return false;
			}
			break;
		case 10:
			var b1 = b.k;
			return hxbit_Convert.sameType(a,b1);
		default:
			return Type.enumEq(a,b);
		}
		break;
	case 8:
		var _g = a.k;
		switch(b._hx_index) {
		case 8:
			var b1 = b.k;
			var a1 = _g;
			return hxbit_Convert.sameType(a1,b1);
		case 10:
			var b1 = b.k;
			return hxbit_Convert.sameType(a,b1);
		default:
			return Type.enumEq(a,b);
		}
		break;
	case 9:
		var _g = a.fields;
		switch(b._hx_index) {
		case 9:
			var fb = b.fields;
			var fa = _g;
			if(fa.length != fb.length) {
				return false;
			}
			var _g = 0;
			var _g1 = fa.length;
			while(_g < _g1) {
				var i = _g++;
				var a1 = fa[i];
				var b1 = fb[i];
				if(a1.name != b1.name || a1.opt != b1.opt || !hxbit_Convert.sameType(a1.type,b1.type)) {
					return false;
				}
			}
			return true;
		case 10:
			var b1 = b.k;
			return hxbit_Convert.sameType(a,b1);
		default:
			return Type.enumEq(a,b);
		}
		break;
	case 10:
		var _g = a.k;
		if(b._hx_index == 10) {
			var b1 = b.k;
			var a1 = _g;
			return hxbit_Convert.sameType(a1,b1);
		} else {
			var a1 = _g;
			return hxbit_Convert.sameType(a1,b);
		}
		break;
	case 11:
		var _g = a.k;
		switch(b._hx_index) {
		case 10:
			var b1 = b.k;
			return hxbit_Convert.sameType(a,b1);
		case 11:
			var b1 = b.k;
			var a1 = _g;
			return hxbit_Convert.sameType(a1,b1);
		default:
			return Type.enumEq(a,b);
		}
		break;
	case 12:
		var _g = a.t;
		switch(b._hx_index) {
		case 10:
			var b1 = b.k;
			return hxbit_Convert.sameType(a,b1);
		case 12:
			var b1 = b.t;
			var a1 = _g;
			return hxbit_Convert.sameType(a1,b1);
		default:
			return Type.enumEq(a,b);
		}
		break;
	case 16:
		var _g = a.t;
		switch(b._hx_index) {
		case 0:
			return true;
		case 10:
			var b1 = b.k;
			return hxbit_Convert.sameType(a,b1);
		default:
			return Type.enumEq(a,b);
		}
		break;
	default:
		if(b._hx_index == 10) {
			var b1 = b.k;
			return hxbit_Convert.sameType(a,b1);
		} else {
			return Type.enumEq(a,b);
		}
	}
};
hxbit_Convert.getDefault = function(t) {
	switch(t._hx_index) {
	case 0:
		return 0;
	case 1:
		return 0.;
	case 2:
		return false;
	case 5:
		var _g = t.name;
		return null;
	case 6:
		var _g = t.name;
		return null;
	case 7:
		var _g = t.v;
		var k = t.k;
		switch(k._hx_index) {
		case 0:
			return new haxe_ds_IntMap();
		case 3:
			return new haxe_ds_StringMap();
		default:
			return new haxe_ds_ObjectMap();
		}
		break;
	case 8:
		var _g = t.k;
		return [];
	case 9:
		var _g = t.fields;
		return null;
	case 10:
		var t1 = t.k;
		return hxbit_Convert.getDefault(t1);
	case 11:
		var _g = t.k;
		var this1 = new Array(0);
		return this1;
	case 12:
		var _g = t.t;
		return null;
	case 3:case 4:case 13:case 14:case 17:
		return null;
	case 15:
		var this1 = new haxe__$Int64__$_$_$Int64(0,0);
		return this1;
	case 16:
		var _g = t.t;
		return 0;
	}
};
hxbit_Convert.registerConverter = function(path,f) {
	hxbit_Convert.convFuns.h[path] = f;
};
hxbit_Convert.prototype = {
	toString: function() {
		var _g = [];
		var _g1 = 0;
		var _g2 = this.write.length;
		while(_g1 < _g2) {
			var i = _g1++;
			var w = this.write[i];
			if(w.from == null) {
				_g.push("insert:" + Std.string(w.defaultValue));
			} else if(w.same) {
				_g.push(i == w.index ? "s" : "@" + w.index);
			} else {
				_g.push("@" + w.index + ":" + Std.string(w.to));
			}
		}
		return _g.toString();
	}
	,__class__: hxbit_Convert
};
var hxbit_RpcMode = $hxEnums["hxbit.RpcMode"] = { __ename__:true,__constructs__:null
	,All: {_hx_name:"All",_hx_index:0,__enum__:"hxbit.RpcMode",toString:$estr}
	,Clients: {_hx_name:"Clients",_hx_index:1,__enum__:"hxbit.RpcMode",toString:$estr}
	,Server: {_hx_name:"Server",_hx_index:2,__enum__:"hxbit.RpcMode",toString:$estr}
	,Owner: {_hx_name:"Owner",_hx_index:3,__enum__:"hxbit.RpcMode",toString:$estr}
	,Immediate: {_hx_name:"Immediate",_hx_index:4,__enum__:"hxbit.RpcMode",toString:$estr}
};
hxbit_RpcMode.__constructs__ = [hxbit_RpcMode.All,hxbit_RpcMode.Clients,hxbit_RpcMode.Server,hxbit_RpcMode.Owner,hxbit_RpcMode.Immediate];
var hxbit_PropTypeDesc = $hxEnums["hxbit.PropTypeDesc"] = { __ename__:true,__constructs__:null
	,PInt: {_hx_name:"PInt",_hx_index:0,__enum__:"hxbit.PropTypeDesc",toString:$estr}
	,PFloat: {_hx_name:"PFloat",_hx_index:1,__enum__:"hxbit.PropTypeDesc",toString:$estr}
	,PBool: {_hx_name:"PBool",_hx_index:2,__enum__:"hxbit.PropTypeDesc",toString:$estr}
	,PString: {_hx_name:"PString",_hx_index:3,__enum__:"hxbit.PropTypeDesc",toString:$estr}
	,PBytes: {_hx_name:"PBytes",_hx_index:4,__enum__:"hxbit.PropTypeDesc",toString:$estr}
	,PSerializable: ($_=function(name) { return {_hx_index:5,name:name,__enum__:"hxbit.PropTypeDesc",toString:$estr}; },$_._hx_name="PSerializable",$_.__params__ = ["name"],$_)
	,PEnum: ($_=function(name) { return {_hx_index:6,name:name,__enum__:"hxbit.PropTypeDesc",toString:$estr}; },$_._hx_name="PEnum",$_.__params__ = ["name"],$_)
	,PMap: ($_=function(k,v) { return {_hx_index:7,k:k,v:v,__enum__:"hxbit.PropTypeDesc",toString:$estr}; },$_._hx_name="PMap",$_.__params__ = ["k","v"],$_)
	,PArray: ($_=function(k) { return {_hx_index:8,k:k,__enum__:"hxbit.PropTypeDesc",toString:$estr}; },$_._hx_name="PArray",$_.__params__ = ["k"],$_)
	,PObj: ($_=function(fields) { return {_hx_index:9,fields:fields,__enum__:"hxbit.PropTypeDesc",toString:$estr}; },$_._hx_name="PObj",$_.__params__ = ["fields"],$_)
	,PAlias: ($_=function(k) { return {_hx_index:10,k:k,__enum__:"hxbit.PropTypeDesc",toString:$estr}; },$_._hx_name="PAlias",$_.__params__ = ["k"],$_)
	,PVector: ($_=function(k) { return {_hx_index:11,k:k,__enum__:"hxbit.PropTypeDesc",toString:$estr}; },$_._hx_name="PVector",$_.__params__ = ["k"],$_)
	,PNull: ($_=function(t) { return {_hx_index:12,t:t,__enum__:"hxbit.PropTypeDesc",toString:$estr}; },$_._hx_name="PNull",$_.__params__ = ["t"],$_)
	,PUnknown: {_hx_name:"PUnknown",_hx_index:13,__enum__:"hxbit.PropTypeDesc",toString:$estr}
	,PDynamic: {_hx_name:"PDynamic",_hx_index:14,__enum__:"hxbit.PropTypeDesc",toString:$estr}
	,PInt64: {_hx_name:"PInt64",_hx_index:15,__enum__:"hxbit.PropTypeDesc",toString:$estr}
	,PFlags: ($_=function(t) { return {_hx_index:16,t:t,__enum__:"hxbit.PropTypeDesc",toString:$estr}; },$_._hx_name="PFlags",$_.__params__ = ["t"],$_)
	,PStruct: {_hx_name:"PStruct",_hx_index:17,__enum__:"hxbit.PropTypeDesc",toString:$estr}
};
hxbit_PropTypeDesc.__constructs__ = [hxbit_PropTypeDesc.PInt,hxbit_PropTypeDesc.PFloat,hxbit_PropTypeDesc.PBool,hxbit_PropTypeDesc.PString,hxbit_PropTypeDesc.PBytes,hxbit_PropTypeDesc.PSerializable,hxbit_PropTypeDesc.PEnum,hxbit_PropTypeDesc.PMap,hxbit_PropTypeDesc.PArray,hxbit_PropTypeDesc.PObj,hxbit_PropTypeDesc.PAlias,hxbit_PropTypeDesc.PVector,hxbit_PropTypeDesc.PNull,hxbit_PropTypeDesc.PUnknown,hxbit_PropTypeDesc.PDynamic,hxbit_PropTypeDesc.PInt64,hxbit_PropTypeDesc.PFlags,hxbit_PropTypeDesc.PStruct];
var hxbit_Macros = function() { };
$hxClasses["hxbit.Macros"] = hxbit_Macros;
hxbit_Macros.__name__ = "hxbit.Macros";
var hxbit_Serializable = function() { };
$hxClasses["hxbit.Serializable"] = hxbit_Serializable;
hxbit_Serializable.__name__ = "hxbit.Serializable";
hxbit_Serializable.__isInterface__ = true;
hxbit_Serializable.prototype = {
	__class__: hxbit_Serializable
};
var hxbit_Serializer = function() {
	this.usedClasses = [];
	if(hxbit_Serializer.CLIDS == null) {
		hxbit_Serializer.initClassIDS();
	}
};
$hxClasses["hxbit.Serializer"] = hxbit_Serializer;
hxbit_Serializer.__name__ = "hxbit.Serializer";
hxbit_Serializer.resetCounters = function() {
	hxbit_Serializer.UID = 0;
	hxbit_Serializer.SEQ = 0;
};
hxbit_Serializer.allocUID = function() {
	return hxbit_Serializer.SEQ << 24 | ++hxbit_Serializer.UID;
};
hxbit_Serializer.registerClass = function(c) {
	if(hxbit_Serializer.CLIDS != null) {
		throw haxe_Exception.thrown("Too late to register class");
	}
	var idx = hxbit_Serializer.CLASSES.length;
	hxbit_Serializer.CLASSES.push(c);
	return idx;
};
hxbit_Serializer.hash = function(name) {
	var v = 1;
	var _g = 0;
	var _g1 = name.length;
	while(_g < _g1) {
		var i = _g++;
		v = v * 223 + name.charCodeAt(i) | 0;
	}
	v = 1 + (v & 1073741823) % 65423;
	return v;
};
hxbit_Serializer.initClassIDS = function() {
	var cl = hxbit_Serializer.CLASSES;
	var _g = [];
	var _g1 = 0;
	while(_g1 < cl.length) {
		var c = cl[_g1];
		++_g1;
		_g.push([]);
	}
	var subClasses = _g;
	var isSub = [];
	var _g = 0;
	var _g1 = cl.length;
	while(_g < _g1) {
		var i = _g++;
		var c = cl[i];
		while(true) {
			c = c.__super__;
			if(c == null) {
				break;
			}
			var idx = cl.indexOf(c);
			if(idx < 0) {
				break;
			}
			subClasses[idx].push(i);
			isSub[i] = true;
		}
	}
	var _g = [];
	var _g1 = 0;
	var _g2 = hxbit_Serializer.CLASSES.length;
	while(_g1 < _g2) {
		var i = _g1++;
		if(subClasses[i].length == 0 && !isSub[i]) {
			_g.push(0);
		} else {
			var name = cl[i].__name__;
			var v = 1;
			var _g3 = 0;
			var _g4 = name.length;
			while(_g3 < _g4) {
				var i1 = _g3++;
				v = v * 223 + name.charCodeAt(i1) | 0;
			}
			v = 1 + (v & 1073741823) % 65423;
			_g.push(v);
		}
	}
	hxbit_Serializer.CLIDS = _g;
	hxbit_Serializer.CL_BYID = [];
	var _g = 0;
	var _g1 = hxbit_Serializer.CLIDS.length;
	while(_g < _g1) {
		var i = _g++;
		var cid = hxbit_Serializer.CLIDS[i];
		if(cid == 0) {
			continue;
		}
		if(hxbit_Serializer.CL_BYID[cid] != null) {
			var c = hxbit_Serializer.CL_BYID[cid];
			throw haxe_Exception.thrown("Conflicting CLID between " + c.__name__ + " and " + cl[i].__name__);
		}
		hxbit_Serializer.CL_BYID[cid] = cl[i];
	}
};
hxbit_Serializer.getSignature = function() {
	if(hxbit_Serializer.__SIGN != null) {
		return hxbit_Serializer.__SIGN;
	}
	var s = new hxbit_Serializer();
	s.begin();
	var v = hxbit_Serializer.CLASSES.length;
	if(v >= 0 && v < 128) {
		s.out.addByte(v);
	} else {
		s.out.addByte(128);
		s.out.addInt32(v);
	}
	var _g = 0;
	var _g1 = hxbit_Serializer.CLASSES.length;
	while(_g < _g1) {
		var i = _g++;
		var v = hxbit_Serializer.CLIDS[i];
		if(v >= 0 && v < 128) {
			s.out.addByte(v);
		} else {
			s.out.addByte(128);
			s.out.addInt32(v);
		}
		var v1 = Object.create(hxbit_Serializer.CLASSES[i].prototype).getSerializeSchema().get_checkSum();
		s.out.addInt32(v1);
	}
	return hxbit_Serializer.__SIGN = haxe_crypto_Md5.make(s.end());
};
hxbit_Serializer.isClassFinal = function(index) {
	return hxbit_Serializer.CLIDS[index] == 0;
};
hxbit_Serializer.save = function(value) {
	var s = new hxbit_Serializer();
	s.beginSave();
	s.addKnownRef(value);
	return s.endSave();
};
hxbit_Serializer.load = function(bytes,cl) {
	var s = new hxbit_Serializer();
	s.beginLoad(bytes);
	var value = s.getRef(cl,cl.__clid);
	s.endLoad();
	return value;
};
hxbit_Serializer.prototype = {
	set_remapIds: function(b) {
		this.remapObjs = b ? new haxe_ds_ObjectMap() : null;
		return b;
	}
	,get_remapIds: function() {
		return this.remapObjs != null;
	}
	,remap: function(s) {
		if(this.remapObjs.h.__keys__[s.__id__] != null) {
			return;
		}
		this.remapObjs.set(s,s.__uid);
		s.__uid = hxbit_Serializer.SEQ << 24 | ++hxbit_Serializer.UID;
	}
	,begin: function() {
		this.out = new haxe_io_BytesBuffer();
		this.refs = new haxe_ds_IntMap();
		this.knownStructs = [];
	}
	,end: function() {
		var bytes = this.out.getBytes();
		this.out = null;
		this.refs = null;
		this.knownStructs = null;
		return bytes;
	}
	,setInput: function(data,pos) {
		this.input = data;
		this.inPos = pos;
		if(this.refs == null) {
			this.refs = new haxe_ds_IntMap();
		}
		if(this.knownStructs == null) {
			this.knownStructs = [];
		}
	}
	,serialize: function(s) {
		this.begin();
		this.addKnownRef(s);
		return this.out.getBytes();
	}
	,unserialize: function(data,c,startPos) {
		if(startPos == null) {
			startPos = 0;
		}
		this.refs = new haxe_ds_IntMap();
		this.knownStructs = [];
		this.setInput(data,startPos);
		return this.getRef(c,c.__clid);
	}
	,getByte: function() {
		return this.input.b[this.inPos++];
	}
	,addByte: function(v) {
		this.out.addByte(v);
	}
	,addInt: function(v) {
		if(v >= 0 && v < 128) {
			this.out.addByte(v);
		} else {
			this.out.addByte(128);
			this.out.addInt32(v);
		}
	}
	,addInt32: function(v) {
		this.out.addInt32(v);
	}
	,addInt64: function(v) {
		this.out.addInt64(v);
	}
	,addFloat: function(v) {
		this.out.addFloat(v);
	}
	,addDouble: function(v) {
		this.out.addDouble(v);
	}
	,addBool: function(v) {
		this.out.addByte(v ? 1 : 0);
	}
	,addArray: function(a,f) {
		if(a == null) {
			this.out.addByte(0);
			return;
		}
		var v = a.length + 1;
		if(v >= 0 && v < 128) {
			this.out.addByte(v);
		} else {
			this.out.addByte(128);
			this.out.addInt32(v);
		}
		var _g = 0;
		while(_g < a.length) {
			var v = a[_g];
			++_g;
			f(v);
		}
	}
	,addVector: function(a,f) {
		if(a == null) {
			this.out.addByte(0);
			return;
		}
		var v = a.length + 1;
		if(v >= 0 && v < 128) {
			this.out.addByte(v);
		} else {
			this.out.addByte(128);
			this.out.addInt32(v);
		}
		var _g = 0;
		while(_g < a.length) {
			var v = a[_g];
			++_g;
			f(v);
		}
	}
	,getArray: function(f) {
		var v = this.input.b[this.inPos++];
		if(v == 128) {
			v = this.input.getInt32(this.inPos);
			this.inPos += 4;
		}
		var len = v;
		if(len == 0) {
			return null;
		}
		--len;
		var a = [];
		var _g = 0;
		var _g1 = len;
		while(_g < _g1) {
			var i = _g++;
			a[i] = f();
		}
		return a;
	}
	,getVector: function(f) {
		var v = this.input.b[this.inPos++];
		if(v == 128) {
			v = this.input.getInt32(this.inPos);
			this.inPos += 4;
		}
		var len = v;
		if(len == 0) {
			return null;
		}
		--len;
		var this1 = new Array(len);
		var a = this1;
		var _g = 0;
		var _g1 = len;
		while(_g < _g1) {
			var i = _g++;
			a[i] = f();
		}
		return a;
	}
	,addMap: function(a,fk,ft) {
		if(a == null) {
			this.out.addByte(0);
			return;
		}
		var _g = [];
		var k = a.keys();
		while(k.hasNext()) {
			var k1 = k.next();
			_g.push(k1);
		}
		var keys = _g;
		var v = keys.length + 1;
		if(v >= 0 && v < 128) {
			this.out.addByte(v);
		} else {
			this.out.addByte(128);
			this.out.addInt32(v);
		}
		var _g = 0;
		while(_g < keys.length) {
			var k = keys[_g];
			++_g;
			fk(k);
			ft(a.get(k));
		}
	}
	,getBool: function() {
		return this.input.b[this.inPos++] != 0;
	}
	,getInt: function() {
		var v = this.input.b[this.inPos++];
		if(v == 128) {
			v = this.input.getInt32(this.inPos);
			this.inPos += 4;
		}
		return v;
	}
	,skip: function(size) {
		this.inPos += size;
	}
	,getInt32: function() {
		var v = this.input.getInt32(this.inPos);
		this.inPos += 4;
		return v;
	}
	,getInt64: function() {
		var v = this.input.getInt64(this.inPos);
		this.inPos += 8;
		return v;
	}
	,getDouble: function() {
		var v = this.input.getDouble(this.inPos);
		this.inPos += 8;
		return v;
	}
	,getFloat: function() {
		var v = this.input.getFloat(this.inPos);
		this.inPos += 4;
		return v;
	}
	,addString: function(s) {
		if(s == null) {
			this.out.addByte(0);
		} else {
			var b = haxe_io_Bytes.ofString(s);
			var v = b.length + 1;
			if(v >= 0 && v < 128) {
				this.out.addByte(v);
			} else {
				this.out.addByte(128);
				this.out.addInt32(v);
			}
			this.out.add(b);
		}
	}
	,addBytes: function(b) {
		if(b == null) {
			this.out.addByte(0);
		} else {
			var v = b.length + 1;
			if(v >= 0 && v < 128) {
				this.out.addByte(v);
			} else {
				this.out.addByte(128);
				this.out.addInt32(v);
			}
			this.out.add(b);
		}
	}
	,addBytesSub: function(b,pos,len) {
		if(b == null) {
			this.out.addByte(0);
		} else {
			var v = len + 1;
			if(v >= 0 && v < 128) {
				this.out.addByte(v);
			} else {
				this.out.addByte(128);
				this.out.addInt32(v);
			}
			this.out.addBytes(b,pos,len);
		}
	}
	,getString: function() {
		var v = this.input.b[this.inPos++];
		if(v == 128) {
			v = this.input.getInt32(this.inPos);
			this.inPos += 4;
		}
		var len = v;
		if(len == 0) {
			return null;
		}
		--len;
		var s = this.input.getString(this.inPos,len);
		this.inPos += len;
		return s;
	}
	,getBytes: function() {
		var v = this.input.b[this.inPos++];
		if(v == 128) {
			v = this.input.getInt32(this.inPos);
			this.inPos += 4;
		}
		var len = v;
		if(len == 0) {
			return null;
		}
		--len;
		var s = this.input.sub(this.inPos,len);
		this.inPos += len;
		return s;
	}
	,getDynamic: function() {
		var _g = this.input.b[this.inPos++];
		switch(_g) {
		case 0:
			return null;
		case 1:
			return false;
		case 2:
			return true;
		case 3:
			var v = this.input.b[this.inPos++];
			if(v == 128) {
				v = this.input.getInt32(this.inPos);
				this.inPos += 4;
			}
			return v;
		case 4:
			var v = this.input.getFloat(this.inPos);
			this.inPos += 4;
			return v;
		case 5:
			var o = { };
			var _g1 = 0;
			var v = this.input.b[this.inPos++];
			if(v == 128) {
				v = this.input.getInt32(this.inPos);
				this.inPos += 4;
			}
			var _g2 = v;
			while(_g1 < _g2) {
				var i = _g1++;
				var v = this.input.b[this.inPos++];
				if(v == 128) {
					v = this.input.getInt32(this.inPos);
					this.inPos += 4;
				}
				var len = v;
				var field;
				if(len == 0) {
					field = null;
				} else {
					--len;
					var s = this.input.getString(this.inPos,len);
					this.inPos += len;
					field = s;
				}
				o[field] = this.getDynamic();
			}
			return o;
		case 6:
			var v = this.input.b[this.inPos++];
			if(v == 128) {
				v = this.input.getInt32(this.inPos);
				this.inPos += 4;
			}
			var len = v;
			if(len == 0) {
				return null;
			} else {
				--len;
				var s = this.input.getString(this.inPos,len);
				this.inPos += len;
				return s;
			}
			break;
		case 7:
			var _g1 = [];
			var _g2 = 0;
			var v = this.input.b[this.inPos++];
			if(v == 128) {
				v = this.input.getInt32(this.inPos);
				this.inPos += 4;
			}
			var _g3 = v;
			while(_g2 < _g3) {
				var i = _g2++;
				_g1.push(this.getDynamic());
			}
			return _g1;
		case 8:
			var v = this.input.b[this.inPos++];
			if(v == 128) {
				v = this.input.getInt32(this.inPos);
				this.inPos += 4;
			}
			var len = v;
			if(len == 0) {
				return null;
			} else {
				--len;
				var s = this.input.sub(this.inPos,len);
				this.inPos += len;
				return s;
			}
			break;
		default:
			var x = _g;
			throw haxe_Exception.thrown("Invalid dynamic prefix " + x);
		}
	}
	,addDynamic: function(v) {
		if(v == null) {
			this.out.addByte(0);
			return;
		}
		var _g = Type.typeof(v);
		switch(_g._hx_index) {
		case 1:
			this.out.addByte(3);
			var v1 = v;
			if(v1 >= 0 && v1 < 128) {
				this.out.addByte(v1);
			} else {
				this.out.addByte(128);
				this.out.addInt32(v1);
			}
			break;
		case 2:
			this.out.addByte(4);
			this.out.addFloat(v);
			break;
		case 3:
			this.out.addByte(v ? 2 : 1);
			break;
		case 4:
			var fields = Reflect.fields(v);
			this.out.addByte(5);
			var v1 = fields.length;
			if(v1 >= 0 && v1 < 128) {
				this.out.addByte(v1);
			} else {
				this.out.addByte(128);
				this.out.addInt32(v1);
			}
			var _g1 = 0;
			while(_g1 < fields.length) {
				var f = fields[_g1];
				++_g1;
				if(f == null) {
					this.out.addByte(0);
				} else {
					var b = haxe_io_Bytes.ofString(f);
					var v1 = b.length + 1;
					if(v1 >= 0 && v1 < 128) {
						this.out.addByte(v1);
					} else {
						this.out.addByte(128);
						this.out.addInt32(v1);
					}
					this.out.add(b);
				}
				this.addDynamic(Reflect.field(v,f));
			}
			break;
		case 6:
			var c = _g.c;
			switch(c) {
			case Array:
				this.out.addByte(7);
				var a = v;
				var v1 = a.length;
				if(v1 >= 0 && v1 < 128) {
					this.out.addByte(v1);
				} else {
					this.out.addByte(128);
					this.out.addInt32(v1);
				}
				var _g1 = 0;
				while(_g1 < a.length) {
					var v1 = a[_g1];
					++_g1;
					this.addDynamic(v1);
				}
				break;
			case String:
				this.out.addByte(6);
				var s = v;
				if(s == null) {
					this.out.addByte(0);
				} else {
					var b = haxe_io_Bytes.ofString(s);
					var v1 = b.length + 1;
					if(v1 >= 0 && v1 < 128) {
						this.out.addByte(v1);
					} else {
						this.out.addByte(128);
						this.out.addInt32(v1);
					}
					this.out.add(b);
				}
				break;
			case haxe_io_Bytes:
				this.out.addByte(8);
				var b = v;
				if(b == null) {
					this.out.addByte(0);
				} else {
					var v = b.length + 1;
					if(v >= 0 && v < 128) {
						this.out.addByte(v);
					} else {
						this.out.addByte(128);
						this.out.addInt32(v);
					}
					this.out.add(b);
				}
				break;
			default:
				throw haxe_Exception.thrown("Unsupported dynamic " + Std.string(c));
			}
			break;
		default:
			var t = _g;
			throw haxe_Exception.thrown("Unsupported dynamic " + Std.string(t));
		}
	}
	,addCLID: function(clid) {
		this.out.addByte(clid >> 8);
		this.out.addByte(clid & 255);
	}
	,getCLID: function() {
		return this.input.b[this.inPos++] << 8 | this.input.b[this.inPos++];
	}
	,addStruct: function(s) {
		if(s == null) {
			this.out.addByte(0);
			return;
		}
		var c = js_Boot.__implements(s,hxbit_Serializable) ? s : null;
		if(c != null) {
			this.out.addByte(1);
			this.addAnyRef(c);
			return;
		}
		var index = this.knownStructs.indexOf(s);
		if(index >= 0) {
			this.out.addByte(2);
			if(index >= 0 && index < 128) {
				this.out.addByte(index);
			} else {
				this.out.addByte(128);
				this.out.addInt32(index);
			}
			return;
		}
		this.knownStructs.push(s);
		this.out.addByte(3);
		var c = js_Boot.getClass(s);
		if(c == null) {
			throw haxe_Exception.thrown(Std.string(s) + " does not have a class ?");
		}
		var s1 = c.__name__;
		if(s1 == null) {
			this.out.addByte(0);
		} else {
			var b = haxe_io_Bytes.ofString(s1);
			var v = b.length + 1;
			if(v >= 0 && v < 128) {
				this.out.addByte(v);
			} else {
				this.out.addByte(128);
				this.out.addInt32(v);
			}
			this.out.add(b);
		}
		s.customSerialize(this);
		this.out.addByte(255);
	}
	,getStruct: function() {
		switch(this.input.b[this.inPos++]) {
		case 0:
			return null;
		case 1:
			return this.getAnyRef();
		case 2:
			var tmp = this.knownStructs;
			var v = this.input.b[this.inPos++];
			if(v == 128) {
				v = this.input.getInt32(this.inPos);
				this.inPos += 4;
			}
			return tmp[v];
		case 3:
			var v = this.input.b[this.inPos++];
			if(v == 128) {
				v = this.input.getInt32(this.inPos);
				this.inPos += 4;
			}
			var len = v;
			var cname;
			if(len == 0) {
				cname = null;
			} else {
				--len;
				var s = this.input.getString(this.inPos,len);
				this.inPos += len;
				cname = s;
			}
			var cl = $hxClasses[cname];
			if(cl == null) {
				throw haxe_Exception.thrown("Missing struct class " + cname);
			}
			var s = Object.create(cl.prototype);
			this.knownStructs.push(s);
			s.customUnserialize(this);
			if(this.input.b[this.inPos++] != 255) {
				throw haxe_Exception.thrown("Invalid customUnserialize for " + Std.string(s));
			}
			return s;
		default:
			throw haxe_Exception.thrown("assert");
		}
	}
	,addObjRef: function(s) {
		var v = s.__uid;
		if(v >= 0 && v < 128) {
			this.out.addByte(v);
		} else {
			this.out.addByte(128);
			this.out.addInt32(v);
		}
	}
	,getObjRef: function() {
		var v = this.input.b[this.inPos++];
		if(v == 128) {
			v = this.input.getInt32(this.inPos);
			this.inPos += 4;
		}
		return v;
	}
	,addAnyRef: function(s) {
		if(s == null) {
			this.out.addByte(0);
			return;
		}
		if(this.remapObjs != null) {
			this.remap(s);
		}
		this.addObjRef(s);
		if(this.refs.h[s.__uid] != null) {
			return;
		}
		this.refs.h[s.__uid] = s;
		var index = s.getCLID();
		this.usedClasses[index] = true;
		this.out.addByte(index >> 8);
		this.out.addByte(index & 255);
		s.serialize(this);
	}
	,addKnownRef: function(s) {
		if(s == null) {
			this.out.addByte(0);
			return;
		}
		if(this.remapObjs != null) {
			this.remap(s);
		}
		this.addObjRef(s);
		if(this.refs.h[s.__uid] != null) {
			return;
		}
		this.refs.h[s.__uid] = s;
		var index = s.getCLID();
		this.usedClasses[index] = true;
		var clid = hxbit_Serializer.CLIDS[index];
		if(clid != 0) {
			this.out.addByte(clid >> 8);
			this.out.addByte(clid & 255);
		}
		s.serialize(this);
	}
	,getAnyRef: function() {
		var id = this.getObjRef();
		if(id == 0) {
			return null;
		}
		if(this.refs.h[id] != null) {
			return this.refs.h[id];
		}
		var rid = id & 16777215;
		if(hxbit_Serializer.UID < rid) {
			hxbit_Serializer.UID = rid;
		}
		var clidx = this.input.b[this.inPos++] << 8 | this.input.b[this.inPos++];
		if(this.mapIndexes != null) {
			clidx = this.mapIndexes[clidx];
		}
		var i = Object.create(hxbit_Serializer.CLASSES[clidx].prototype);
		if(this.newObjects != null) {
			this.newObjects.push(i);
		}
		i.__uid = id;
		i.unserializeInit();
		this.refs.h[id] = i;
		if(this.convert != null && this.convert[clidx] != null) {
			this.convertRef(i,this.convert[clidx]);
		} else {
			i.unserialize(this);
		}
		return i;
	}
	,getRef: function(c,clidx) {
		var id = this.getObjRef();
		if(id == 0) {
			return null;
		}
		if(this.refs.h[id] != null) {
			return this.refs.h[id];
		}
		var rid = id & 16777215;
		if(hxbit_Serializer.UID < rid) {
			hxbit_Serializer.UID = rid;
		}
		if(this.convert != null && this.convert[clidx] != null) {
			var conv = this.convert[clidx];
			if(conv.hadCID) {
				var realIdx = this.input.b[this.inPos++] << 8 | this.input.b[this.inPos++];
				if(conv.hasCID) {
					c = hxbit_Serializer.CL_BYID[realIdx];
					clidx = c.__clid;
				}
			}
		} else if(hxbit_Serializer.CLIDS[clidx] != 0) {
			var realIdx = this.input.b[this.inPos++] << 8 | this.input.b[this.inPos++];
			c = hxbit_Serializer.CL_BYID[realIdx];
			if(this.convert != null) {
				clidx = c.__clid;
			}
		}
		var i = Object.create(c.prototype);
		if(this.newObjects != null) {
			this.newObjects.push(i);
		}
		i.__uid = id;
		i.unserializeInit();
		this.refs.h[id] = i;
		if(this.convert != null && this.convert[clidx] != null) {
			this.convertRef(i,this.convert[clidx]);
		} else {
			i.unserialize(this);
		}
		return i;
	}
	,getKnownRef: function(c) {
		return this.getRef(c,c.__clid);
	}
	,beginSave: function() {
		this.begin();
		this.usedClasses = [];
	}
	,endSave: function(savePosition) {
		if(savePosition == null) {
			savePosition = 0;
		}
		var content = this.end();
		this.begin();
		var classes = [];
		var schemas = [];
		var sidx = hxbit_Serializer.CLASSES.indexOf(hxbit_Schema);
		var _g = 0;
		var _g1 = this.usedClasses.length;
		while(_g < _g1) {
			var i = _g++;
			if(!this.usedClasses[i] || i == sidx) {
				continue;
			}
			var c = hxbit_Serializer.CLASSES[i];
			var schema = Object.create(c.prototype).getSerializeSchema();
			schemas.push(schema);
			classes.push(i);
			this.addKnownRef(schema);
			this.refs.remove(schema.__uid);
		}
		var schemaData = this.end();
		this.begin();
		this.out.addBytes(content,0,savePosition);
		var b = haxe_io_Bytes.ofString("HXS");
		var v = b.length + 1;
		if(v >= 0 && v < 128) {
			this.out.addByte(v);
		} else {
			this.out.addByte(128);
			this.out.addInt32(v);
		}
		this.out.add(b);
		this.out.addByte(1);
		var _g = 0;
		var _g1 = classes.length;
		while(_g < _g1) {
			var i = _g++;
			var index = classes[i];
			var c = hxbit_Serializer.CLASSES[index];
			var s = c.__name__;
			if(s == null) {
				this.out.addByte(0);
			} else {
				var b = haxe_io_Bytes.ofString(s);
				var v = b.length + 1;
				if(v >= 0 && v < 128) {
					this.out.addByte(v);
				} else {
					this.out.addByte(128);
					this.out.addInt32(v);
				}
				this.out.add(b);
			}
			this.out.addByte(index >> 8);
			this.out.addByte(index & 255);
			var v1 = schemas[i].get_checkSum();
			this.out.addInt32(v1);
		}
		var s = null;
		if(s == null) {
			this.out.addByte(0);
		} else {
			var b = haxe_io_Bytes.ofString(s);
			var v = b.length + 1;
			if(v >= 0 && v < 128) {
				this.out.addByte(v);
			} else {
				this.out.addByte(128);
				this.out.addInt32(v);
			}
			this.out.add(b);
		}
		var v = schemaData.length;
		if(v >= 0 && v < 128) {
			this.out.addByte(v);
		} else {
			this.out.addByte(128);
			this.out.addInt32(v);
		}
		this.out.add(schemaData);
		this.out.addBytes(content,savePosition,content.length - savePosition);
		return this.end();
	}
	,beginLoad: function(bytes,position) {
		if(position == null) {
			position = 0;
		}
		this.setInput(bytes,position);
		var classByName_h = Object.create(null);
		var schemas = [];
		var mapIndexes = [];
		var indexes = [];
		var needConvert = false;
		var needReindex = false;
		var _g = 0;
		var _g1 = hxbit_Serializer.CLASSES.length;
		while(_g < _g1) {
			var i = _g++;
			var c = hxbit_Serializer.CLASSES[i];
			classByName_h[c.__name__] = i;
			mapIndexes[i] = i;
		}
		var v = this.input.b[this.inPos++];
		if(v == 128) {
			v = this.input.getInt32(this.inPos);
			this.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			--len;
			var s = this.input.getString(this.inPos,len);
			this.inPos += len;
			tmp = s;
		}
		if(tmp != "HXS") {
			throw haxe_Exception.thrown("Invalid HXS data");
		}
		var version = this.input.b[this.inPos++];
		if(version != 1) {
			throw haxe_Exception.thrown("Unsupported HXS version " + version);
		}
		while(true) {
			var v = this.input.b[this.inPos++];
			if(v == 128) {
				v = this.input.getInt32(this.inPos);
				this.inPos += 4;
			}
			var len = v;
			var clname;
			if(len == 0) {
				clname = null;
			} else {
				--len;
				var s = this.input.getString(this.inPos,len);
				this.inPos += len;
				clname = s;
			}
			if(clname == null) {
				break;
			}
			var index = this.input.b[this.inPos++] << 8 | this.input.b[this.inPos++];
			var v1 = this.input.getInt32(this.inPos);
			this.inPos += 4;
			var crc = v1;
			var ourClassIndex = classByName_h[clname];
			if(ourClassIndex == null) {
				throw haxe_Exception.thrown("Missing class " + clname + " found in HXS data");
			}
			var ourSchema = Object.create(hxbit_Serializer.CLASSES[ourClassIndex].prototype).getSerializeSchema();
			if(ourSchema.get_checkSum() != crc) {
				needConvert = true;
				schemas[index] = ourSchema;
			}
			if(index != ourClassIndex) {
				needReindex = true;
				mapIndexes[index] = ourClassIndex;
			}
			indexes.push(index);
		}
		var v = this.input.b[this.inPos++];
		if(v == 128) {
			v = this.input.getInt32(this.inPos);
			this.inPos += 4;
		}
		var schemaDataSize = v;
		if(needConvert) {
			this.convert = [];
			var _g = 0;
			while(_g < indexes.length) {
				var index = indexes[_g];
				++_g;
				var ourSchema = schemas[index];
				var c = hxbit_Schema;
				var schema = this.getRef(c,c.__clid);
				this.refs.remove(schema.__uid);
				if(ourSchema != null) {
					var c1 = hxbit_Serializer.CLASSES[mapIndexes[index]];
					this.convert[mapIndexes[index]] = new hxbit_Convert(c1.__name__,ourSchema,schema);
				}
			}
		} else {
			this.inPos += schemaDataSize;
		}
		if(needReindex) {
			this.mapIndexes = mapIndexes;
		}
	}
	,endLoad: function() {
		this.convert = null;
		this.mapIndexes = null;
		this.setInput(null,0);
	}
	,convertRef: function(i,c) {
		var this1 = new Array(c.read.length);
		var values = this1;
		var writePos = 0;
		var _g = 0;
		var _g1 = c.read;
		while(_g < _g1.length) {
			var r = _g1[_g];
			++_g;
			values[r.index] = this.readValue(r.from);
		}
		var oldOut = this.out;
		this.out = new haxe_io_BytesBuffer();
		var _g = 0;
		var _g1 = c.write;
		while(_g < _g1.length) {
			var w = _g1[_g];
			++_g;
			var v;
			if(w.from == null) {
				v = w.defaultValue;
			} else {
				v = values[w.index];
				if(!w.same) {
					if(v == null) {
						v = w.defaultValue;
					} else if(w.conv != null) {
						v = w.conv(v);
					} else {
						v = this.convertValue(w.path,v,w.from,w.to);
					}
				}
			}
			this.writeValue(v,w.to);
		}
		var bytes = this.out.getBytes();
		this.out = oldOut;
		var oldIn = this.input;
		var oldPos = this.inPos;
		this.setInput(bytes,0);
		i.unserialize(this);
		this.setInput(oldIn,oldPos);
	}
	,isNullable: function(t) {
		switch(t._hx_index) {
		case 0:case 1:case 2:
			return false;
		default:
			return true;
		}
	}
	,convertValue: function(path,v,from,to) {
		if(v == null) {
			return hxbit_Convert.getDefault(to);
		}
		if(hxbit_Convert.sameType(from,to)) {
			return v;
		}
		var conv = hxbit_Convert.convFuns.h[path];
		if(conv != null) {
			return conv(v);
		}
		switch(from._hx_index) {
		case 0:
			switch(to._hx_index) {
			case 1:
				return v * 1.0;
			case 10:
				var to1 = to.k;
				return this.convertValue(path,v,from,to1);
			case 12:
				var to1 = to.t;
				return this.convertValue(path,v,from,to1);
			default:
			}
			break;
		case 1:
			switch(to._hx_index) {
			case 0:
				return v | 0;
			case 10:
				var to1 = to.k;
				return this.convertValue(path,v,from,to1);
			case 12:
				var to1 = to.t;
				return this.convertValue(path,v,from,to1);
			default:
			}
			break;
		case 2:
			switch(to._hx_index) {
			case 0:
				if(v) {
					return 1;
				} else {
					return 0;
				}
				break;
			case 1:
				if(v) {
					return 1.;
				} else {
					return 0.;
				}
				break;
			case 10:
				var to1 = to.k;
				return this.convertValue(path,v,from,to1);
			case 12:
				var to1 = to.t;
				return this.convertValue(path,v,from,to1);
			default:
			}
			break;
		case 5:
			var _g = from.name;
			switch(to._hx_index) {
			case 5:
				var to1 = to.name;
				var value = v;
				var v2 = js_Boot.__downcastCheck(value,$hxClasses[to1]) ? value : null;
				if(v2 != null) {
					return v2;
				}
				break;
			case 10:
				var to1 = to.k;
				return this.convertValue(path,v,from,to1);
			case 12:
				var to1 = to.t;
				return this.convertValue(path,v,from,to1);
			default:
			}
			break;
		case 8:
			var _g = from.k;
			switch(to._hx_index) {
			case 8:
				var to1 = to.k;
				var from1 = _g;
				var arr = v;
				var _g = [];
				var _g1 = 0;
				while(_g1 < arr.length) {
					var v1 = arr[_g1];
					++_g1;
					_g.push(this.convertValue(path + "[]",v1,from1,to1));
				}
				return _g;
			case 10:
				var to1 = to.k;
				return this.convertValue(path,v,from,to1);
			case 12:
				var to1 = to.t;
				return this.convertValue(path,v,from,to1);
			default:
			}
			break;
		case 9:
			var _g = from.fields;
			switch(to._hx_index) {
			case 9:
				var obj2 = to.fields;
				var obj1 = _g;
				var v2 = { };
				var _g = 0;
				while(_g < obj2.length) {
					var f = obj2[_g];
					++_g;
					var found = false;
					var field = null;
					var _g1 = 0;
					while(_g1 < obj1.length) {
						var f2 = obj1[_g1];
						++_g1;
						if(f2.name == f.name) {
							found = true;
							field = this.convertValue(path + "." + f2.name,Reflect.field(v,f2.name),f2.type,f.type);
							break;
						}
					}
					if(!found) {
						if(f.opt) {
							continue;
						}
						field = hxbit_Convert.getDefault(f.type);
					} else if(field == null && f.opt) {
						continue;
					}
					v2[f.name] = field;
				}
				return v2;
			case 10:
				var to1 = to.k;
				return this.convertValue(path,v,from,to1);
			case 12:
				var to1 = to.t;
				return this.convertValue(path,v,from,to1);
			default:
			}
			break;
		case 10:
			var _g = from.k;
			switch(to._hx_index) {
			case 10:
				var _g1 = to.k;
				var from1 = _g;
				return this.convertValue(path,v,from1,to);
			case 12:
				var to1 = to.t;
				return this.convertValue(path,v,from,to1);
			default:
				var from1 = _g;
				return this.convertValue(path,v,from1,to);
			}
			break;
		case 12:
			var from1 = from.t;
			return this.convertValue(path,v,from1,to);
		default:
			switch(to._hx_index) {
			case 10:
				var to1 = to.k;
				return this.convertValue(path,v,from,to1);
			case 12:
				var to1 = to.t;
				return this.convertValue(path,v,from,to1);
			default:
			}
		}
		throw haxe_Exception.thrown("Cannot convert " + path + "(" + Std.string(v) + ") from " + Std.string(from) + " to " + Std.string(to));
	}
	,getEnumClass: function(name) {
		var cl = hxbit_Serializer.ENUM_CLASSES.h[name];
		if(cl != null) {
			return cl;
		}
		var path = name.split(".").join("_");
		path = path.charAt(0).toUpperCase() + HxOverrides.substr(path,1,null);
		cl = $hxClasses["hxbit.enumSer." + path];
		if(cl != null) {
			hxbit_Serializer.ENUM_CLASSES.h[name] = cl;
		}
		return cl;
	}
	,readValue: function(t) {
		var _gthis = this;
		switch(t._hx_index) {
		case 0:
			var v = this.input.b[this.inPos++];
			if(v == 128) {
				v = this.input.getInt32(this.inPos);
				this.inPos += 4;
			}
			return v;
		case 1:
			var v = this.input.getFloat(this.inPos);
			this.inPos += 4;
			return v;
		case 2:
			return this.input.b[this.inPos++] != 0;
		case 3:
			var v = this.input.b[this.inPos++];
			if(v == 128) {
				v = this.input.getInt32(this.inPos);
				this.inPos += 4;
			}
			var len = v;
			if(len == 0) {
				return null;
			} else {
				--len;
				var s = this.input.getString(this.inPos,len);
				this.inPos += len;
				return s;
			}
			break;
		case 4:
			var v = this.input.b[this.inPos++];
			if(v == 128) {
				v = this.input.getInt32(this.inPos);
				this.inPos += 4;
			}
			var len = v;
			if(len == 0) {
				return null;
			} else {
				--len;
				var s = this.input.sub(this.inPos,len);
				this.inPos += len;
				return s;
			}
			break;
		case 5:
			var name = t.name;
			var c = $hxClasses[name];
			return this.getRef(c,c.__clid);
		case 6:
			var name = t.name;
			var ser = this.getEnumClass(name);
			if(ser == null) {
				var e = $hxEnums[name];
				var tmp;
				if(e != null) {
					var o = haxe_rtti_Meta.getType(e);
					tmp = Object.prototype.hasOwnProperty.call(o,"skipSerialize");
				} else {
					tmp = false;
				}
				if(tmp) {
					var v = this.input.b[this.inPos++];
					if(v == 128) {
						v = this.input.getInt32(this.inPos);
						this.inPos += 4;
					}
					return null;
				}
				throw haxe_Exception.thrown("No enum unserializer found for " + name);
			}
			return ser.doUnserialize(this);
		case 7:
			var k = t.k;
			var v = t.v;
			switch(k._hx_index) {
			case 0:
				var v1 = this.input.b[this.inPos++];
				if(v1 == 128) {
					v1 = this.input.getInt32(this.inPos);
					this.inPos += 4;
				}
				var len = v1;
				var tmp;
				if(len == 0) {
					tmp = null;
				} else {
					var m = new haxe_ds_IntMap();
					while(--len > 0) {
						var k1 = _gthis.readValue(k);
						var v1 = _gthis.readValue(v);
						m.h[k1] = v1;
					}
					tmp = m;
				}
				return tmp;
			case 3:
				var v1 = this.input.b[this.inPos++];
				if(v1 == 128) {
					v1 = this.input.getInt32(this.inPos);
					this.inPos += 4;
				}
				var len = v1;
				var tmp;
				if(len == 0) {
					tmp = null;
				} else {
					var m = new haxe_ds_StringMap();
					while(--len > 0) {
						var k1 = _gthis.readValue(k);
						var v1 = _gthis.readValue(v);
						m.h[k1] = v1;
					}
					tmp = m;
				}
				return tmp;
			case 6:
				var _g = k.name;
				var v1 = this.input.b[this.inPos++];
				if(v1 == 128) {
					v1 = this.input.getInt32(this.inPos);
					this.inPos += 4;
				}
				var len = v1;
				if(len == 0) {
					return null;
				}
				var m = new haxe_ds_EnumValueMap();
				while(--len > 0) {
					var k1 = this.readValue(k);
					var v1 = this.readValue(v);
					m.set(k1,v1);
				}
				return m;
			default:
				var v1 = this.input.b[this.inPos++];
				if(v1 == 128) {
					v1 = this.input.getInt32(this.inPos);
					this.inPos += 4;
				}
				var len = v1;
				var tmp;
				if(len == 0) {
					tmp = null;
				} else {
					var m = new haxe_ds_ObjectMap();
					while(--len > 0) {
						var k1 = _gthis.readValue(k);
						var v1 = _gthis.readValue(v);
						m.set(k1,v1);
					}
					tmp = m;
				}
				return tmp;
			}
			break;
		case 8:
			var t1 = t.k;
			var v = this.input.b[this.inPos++];
			if(v == 128) {
				v = this.input.getInt32(this.inPos);
				this.inPos += 4;
			}
			var len = v;
			if(len == 0) {
				return null;
			} else {
				--len;
				var a = [];
				var _g = 0;
				var _g1 = len;
				while(_g < _g1) {
					var i = _g++;
					a[i] = _gthis.readValue(t1);
				}
				return a;
			}
			break;
		case 9:
			var fields = t.fields;
			var v = this.input.b[this.inPos++];
			if(v == 128) {
				v = this.input.getInt32(this.inPos);
				this.inPos += 4;
			}
			var bits = v;
			if(bits == 0) {
				return null;
			}
			var o = { };
			--bits;
			var _g = [];
			var _g1 = 0;
			while(_g1 < fields.length) {
				var f = fields[_g1];
				++_g1;
				if(this.isNullable(f.type)) {
					_g.push(f);
				}
			}
			var nullables = _g;
			var _g = 0;
			while(_g < fields.length) {
				var f = fields[_g];
				++_g;
				var nidx = nullables.indexOf(f);
				if(nidx >= 0 && (bits & 1 << nidx) == 0) {
					continue;
				}
				o[f.name] = this.readValue(f.type);
			}
			return o;
		case 10:
			var t1 = t.k;
			return this.readValue(t1);
		case 11:
			var t1 = t.k;
			var v = this.input.b[this.inPos++];
			if(v == 128) {
				v = this.input.getInt32(this.inPos);
				this.inPos += 4;
			}
			var len = v;
			if(len == 0) {
				return null;
			} else {
				--len;
				var this1 = new Array(len);
				var a = this1;
				var _g = 0;
				var _g1 = len;
				while(_g < _g1) {
					var i = _g++;
					a[i] = _gthis.readValue(t1);
				}
				return a;
			}
			break;
		case 12:
			var t1 = t.t;
			if(this.input.b[this.inPos++] == 0) {
				return null;
			} else {
				return this.readValue(t1);
			}
			break;
		case 13:
			throw haxe_Exception.thrown("assert");
		case 14:
			return this.getDynamic();
		case 15:
			var v = this.input.getInt64(this.inPos);
			this.inPos += 8;
			return v;
		case 16:
			var _g = t.t;
			var v = this.input.b[this.inPos++];
			if(v == 128) {
				v = this.input.getInt32(this.inPos);
				this.inPos += 4;
			}
			return v;
		case 17:
			return this.getStruct();
		}
	}
	,writeValue: function(v,t) {
		var _gthis = this;
		switch(t._hx_index) {
		case 0:
			var v1 = v;
			if(v1 >= 0 && v1 < 128) {
				this.out.addByte(v1);
			} else {
				this.out.addByte(128);
				this.out.addInt32(v1);
			}
			break;
		case 1:
			this.out.addFloat(v);
			break;
		case 2:
			this.out.addByte(v ? 1 : 0);
			break;
		case 3:
			var s = v;
			if(s == null) {
				this.out.addByte(0);
			} else {
				var b = haxe_io_Bytes.ofString(s);
				var v1 = b.length + 1;
				if(v1 >= 0 && v1 < 128) {
					this.out.addByte(v1);
				} else {
					this.out.addByte(128);
					this.out.addInt32(v1);
				}
				this.out.add(b);
			}
			break;
		case 4:
			var b = v;
			if(b == null) {
				this.out.addByte(0);
			} else {
				var v1 = b.length + 1;
				if(v1 >= 0 && v1 < 128) {
					this.out.addByte(v1);
				} else {
					this.out.addByte(128);
					this.out.addInt32(v1);
				}
				this.out.add(b);
			}
			break;
		case 5:
			var _g = t.name;
			this.addKnownRef(v);
			break;
		case 6:
			var name = t.name;
			var ser = this.getEnumClass(name);
			if(ser == null) {
				throw haxe_Exception.thrown("No enum unserializer found for " + name);
			}
			ser.doSerialize(this,v);
			break;
		case 7:
			var k = t.k;
			var t1 = t.v;
			switch(k._hx_index) {
			case 0:
				var v1 = v;
				if(v1 == null) {
					this.out.addByte(0);
				} else {
					var _g = [];
					var k1 = v1.keys();
					while(k1.hasNext()) {
						var k2 = k1.next();
						_g.push(k2);
					}
					var keys = _g;
					var v2 = keys.length + 1;
					if(v2 >= 0 && v2 < 128) {
						this.out.addByte(v2);
					} else {
						this.out.addByte(128);
						this.out.addInt32(v2);
					}
					var _g = 0;
					while(_g < keys.length) {
						var k1 = keys[_g];
						++_g;
						_gthis.writeValue(k1,k);
						_gthis.writeValue(v1.h[k1],t1);
					}
				}
				break;
			case 3:
				var v1 = v;
				if(v1 == null) {
					this.out.addByte(0);
				} else {
					var _g = [];
					var h = v1.h;
					var k_h = h;
					var k_keys = Object.keys(h);
					var k_length = k_keys.length;
					var k_current = 0;
					while(k_current < k_length) {
						var k1 = k_keys[k_current++];
						_g.push(k1);
					}
					var keys = _g;
					var v2 = keys.length + 1;
					if(v2 >= 0 && v2 < 128) {
						this.out.addByte(v2);
					} else {
						this.out.addByte(128);
						this.out.addInt32(v2);
					}
					var _g = 0;
					while(_g < keys.length) {
						var k1 = keys[_g];
						++_g;
						_gthis.writeValue(k1,k);
						_gthis.writeValue(v1.h[k1],t1);
					}
				}
				break;
			case 6:
				var _g = k.name;
				var v1 = v;
				if(v1 == null) {
					this.out.addByte(0);
					return;
				}
				var _g = [];
				var k1 = v1.keys();
				while(k1.hasNext()) {
					var k2 = k1.next();
					_g.push(k2);
				}
				var keys = _g;
				var v2 = keys.length + 1;
				if(v2 >= 0 && v2 < 128) {
					this.out.addByte(v2);
				} else {
					this.out.addByte(128);
					this.out.addInt32(v2);
				}
				var _g = 0;
				while(_g < keys.length) {
					var vk = keys[_g];
					++_g;
					this.writeValue(vk,k);
					this.writeValue(v1.get(vk),t1);
				}
				break;
			default:
				var v1 = v;
				if(v1 == null) {
					this.out.addByte(0);
				} else {
					var _g = [];
					var k1 = v1.keys();
					while(k1.hasNext()) {
						var k2 = k1.next();
						_g.push(k2);
					}
					var keys = _g;
					var v2 = keys.length + 1;
					if(v2 >= 0 && v2 < 128) {
						this.out.addByte(v2);
					} else {
						this.out.addByte(128);
						this.out.addInt32(v2);
					}
					var _g = 0;
					while(_g < keys.length) {
						var k1 = keys[_g];
						++_g;
						_gthis.writeValue(k1,k);
						_gthis.writeValue(v1.h[k1.__id__],t1);
					}
				}
			}
			break;
		case 8:
			var t1 = t.k;
			var a = v;
			if(a == null) {
				this.out.addByte(0);
			} else {
				var v1 = a.length + 1;
				if(v1 >= 0 && v1 < 128) {
					this.out.addByte(v1);
				} else {
					this.out.addByte(128);
					this.out.addInt32(v1);
				}
				var _g = 0;
				while(_g < a.length) {
					var v1 = a[_g];
					++_g;
					_gthis.writeValue(v1,t1);
				}
			}
			break;
		case 9:
			var fields = t.fields;
			if(v == null) {
				this.out.addByte(0);
			} else {
				var fbits = 0;
				var _g = [];
				var _g1 = 0;
				while(_g1 < fields.length) {
					var f = fields[_g1];
					++_g1;
					if(this.isNullable(f.type)) {
						_g.push(f);
					}
				}
				var nullables = _g;
				var _g = 0;
				var _g1 = nullables.length;
				while(_g < _g1) {
					var i = _g++;
					if(Reflect.field(v,nullables[i].name) != null) {
						fbits |= 1 << i;
					}
				}
				var v1 = fbits + 1;
				if(v1 >= 0 && v1 < 128) {
					this.out.addByte(v1);
				} else {
					this.out.addByte(128);
					this.out.addInt32(v1);
				}
				var _g = 0;
				while(_g < fields.length) {
					var f = fields[_g];
					++_g;
					var nidx = nullables.indexOf(f);
					if(nidx >= 0 && (fbits & 1 << nidx) == 0) {
						continue;
					}
					this.writeValue(Reflect.field(v,f.name),f.type);
				}
			}
			break;
		case 10:
			var t1 = t.k;
			this.writeValue(v,t1);
			break;
		case 11:
			var t1 = t.k;
			var a = v;
			if(a == null) {
				this.out.addByte(0);
			} else {
				var v1 = a.length + 1;
				if(v1 >= 0 && v1 < 128) {
					this.out.addByte(v1);
				} else {
					this.out.addByte(128);
					this.out.addInt32(v1);
				}
				var _g = 0;
				while(_g < a.length) {
					var v1 = a[_g];
					++_g;
					_gthis.writeValue(v1,t1);
				}
			}
			break;
		case 12:
			var t1 = t.t;
			if(v == null) {
				this.out.addByte(0);
			} else {
				this.out.addByte(1);
				this.writeValue(v,t1);
			}
			break;
		case 13:
			throw haxe_Exception.thrown("assert");
		case 14:
			this.addDynamic(v);
			break;
		case 15:
			this.out.addInt64(v);
			break;
		case 16:
			var _g = t.t;
			var v1 = v;
			if(v1 >= 0 && v1 < 128) {
				this.out.addByte(v1);
			} else {
				this.out.addByte(128);
				this.out.addInt32(v1);
			}
			break;
		case 17:
			this.addStruct(v);
			break;
		}
	}
	,__class__: hxbit_Serializer
};
var hxbit_Schema = function() {
	this.__uid = hxbit_Serializer.SEQ << 24 | ++hxbit_Serializer.UID;
	this.fieldsNames = [];
	this.fieldsTypes = [];
};
$hxClasses["hxbit.Schema"] = hxbit_Schema;
hxbit_Schema.__name__ = "hxbit.Schema";
hxbit_Schema.__interfaces__ = [hxbit_Serializable];
hxbit_Schema.prototype = {
	get_checkSum: function() {
		var s = new hxbit_Serializer();
		s.begin();
		var old = this.__uid;
		this.__uid = 0;
		s.addKnownRef(this);
		this.__uid = old;
		var bytes = s.end();
		return haxe_crypto_Crc32.make(bytes);
	}
	,getCLID: function() {
		return hxbit_Schema.__clid;
	}
	,serialize: function(__ctx) {
		__ctx.out.addByte(this.isFinal ? 1 : 0);
		var a = this.fieldsNames;
		if(a == null) {
			__ctx.out.addByte(0);
		} else {
			var v = a.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			var _g = 0;
			while(_g < a.length) {
				var v = a[_g];
				++_g;
				if(v == null) {
					__ctx.out.addByte(0);
				} else {
					var b = haxe_io_Bytes.ofString(v);
					var v1 = b.length + 1;
					if(v1 >= 0 && v1 < 128) {
						__ctx.out.addByte(v1);
					} else {
						__ctx.out.addByte(128);
						__ctx.out.addInt32(v1);
					}
					__ctx.out.add(b);
				}
			}
		}
		var a = this.fieldsTypes;
		if(a == null) {
			__ctx.out.addByte(0);
		} else {
			var v = a.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			var _g = 0;
			while(_g < a.length) {
				var v = a[_g];
				++_g;
				hxbit_enumSer_Hxbit_$PropTypeDesc.doSerialize(__ctx,v);
			}
		}
	}
	,getSerializeSchema: function() {
		var schema = new hxbit_Schema();
		schema.fieldsNames.push("isFinal");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PBool);
		schema.fieldsNames.push("fieldsNames");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PArray(hxbit_PropTypeDesc.PString));
		schema.fieldsNames.push("fieldsTypes");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PArray(hxbit_PropTypeDesc.PEnum("hxbit.PropTypeDesc")));
		schema.isFinal = hxbit_Serializer.isClassFinal(hxbit_Schema.__clid);
		return schema;
	}
	,unserializeInit: function() {
	}
	,unserialize: function(__ctx) {
		this.isFinal = __ctx.input.b[__ctx.inPos++] != 0;
		var e0;
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			--len;
			var a = [];
			var _g = 0;
			var _g1 = len;
			while(_g < _g1) {
				var i = _g++;
				var v = __ctx.input.b[__ctx.inPos++];
				if(v == 128) {
					v = __ctx.input.getInt32(__ctx.inPos);
					__ctx.inPos += 4;
				}
				var len = v;
				if(len == 0) {
					e0 = null;
				} else {
					--len;
					var s = __ctx.input.getString(__ctx.inPos,len);
					__ctx.inPos += len;
					e0 = s;
				}
				a[i] = e0;
			}
			tmp = a;
		}
		this.fieldsNames = tmp;
		var e0;
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			--len;
			var a = [];
			var _g = 0;
			var _g1 = len;
			while(_g < _g1) {
				var i = _g++;
				var __e = hxbit_enumSer_Hxbit_$PropTypeDesc.doUnserialize(__ctx);
				e0 = __e;
				a[i] = e0;
			}
			tmp = a;
		}
		this.fieldsTypes = tmp;
	}
	,__class__: hxbit_Schema
};
var hxbit_SerializableEnum = function() { };
$hxClasses["hxbit.SerializableEnum"] = hxbit_SerializableEnum;
hxbit_SerializableEnum.__name__ = "hxbit.SerializableEnum";
var hxbit_StructSerializable = function() { };
$hxClasses["hxbit.StructSerializable"] = hxbit_StructSerializable;
hxbit_StructSerializable.__name__ = "hxbit.StructSerializable";
hxbit_StructSerializable.__isInterface__ = true;
hxbit_StructSerializable.prototype = {
	__class__: hxbit_StructSerializable
};
var hxbit_enumSer_Haxe_$ds_$Option = function() { };
$hxClasses["hxbit.enumSer.Haxe_ds_Option"] = hxbit_enumSer_Haxe_$ds_$Option;
hxbit_enumSer_Haxe_$ds_$Option.__name__ = "hxbit.enumSer.Haxe_ds_Option";
hxbit_enumSer_Haxe_$ds_$Option.doSerialize = function(ctx,v) {
	if(v == null) {
		ctx.out.addByte(0);
	} else {
		switch(v._hx_index) {
		case 0:
			var v1 = v.v;
			ctx.out.addByte(1);
			hxbit_enumSer_Model_$ver1_$game_$define_$StepKeyword.doSerialize(ctx,v1);
			break;
		case 1:
			ctx.out.addByte(2);
			break;
		}
	}
};
hxbit_enumSer_Haxe_$ds_$Option.doUnserialize = function(ctx) {
	var b = ctx.input.b[ctx.inPos++];
	if(b == 0) {
		return null;
	}
	switch(b) {
	case 1:
		var _v;
		var __e = hxbit_enumSer_Model_$ver1_$game_$define_$StepKeyword.doUnserialize(ctx);
		_v = __e;
		return haxe_ds_Option.Some(_v);
	case 2:
		return haxe_ds_Option.None;
	default:
		throw haxe_Exception.thrown("Invalid enum index " + b);
	}
};
hxbit_enumSer_Haxe_$ds_$Option.getSchema = function() {
	var s = new hxbit_Schema();
	var s1 = s.fieldsTypes;
	var _g = [];
	var v;
	var t = hxbit_PropTypeDesc.PEnum("model.ver1.game.define.StepKeyword");
	_g.push({ name : "", type : t, opt : false});
	s1.push(hxbit_PropTypeDesc.PObj(_g));
	s.fieldsNames.push("Some");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("None");
	return s;
};
var hxbit_enumSer_Hxbit_$PropTypeDesc = function() { };
$hxClasses["hxbit.enumSer.Hxbit_PropTypeDesc"] = hxbit_enumSer_Hxbit_$PropTypeDesc;
hxbit_enumSer_Hxbit_$PropTypeDesc.__name__ = "hxbit.enumSer.Hxbit_PropTypeDesc";
hxbit_enumSer_Hxbit_$PropTypeDesc.doSerialize = function(ctx,v) {
	if(v == null) {
		ctx.out.addByte(0);
	} else {
		switch(v._hx_index) {
		case 0:
			ctx.out.addByte(1);
			break;
		case 1:
			ctx.out.addByte(2);
			break;
		case 2:
			ctx.out.addByte(3);
			break;
		case 3:
			ctx.out.addByte(4);
			break;
		case 4:
			ctx.out.addByte(5);
			break;
		case 5:
			var name = v.name;
			ctx.out.addByte(6);
			if(name == null) {
				ctx.out.addByte(0);
			} else {
				var b = haxe_io_Bytes.ofString(name);
				var v1 = b.length + 1;
				if(v1 >= 0 && v1 < 128) {
					ctx.out.addByte(v1);
				} else {
					ctx.out.addByte(128);
					ctx.out.addInt32(v1);
				}
				ctx.out.add(b);
			}
			break;
		case 6:
			var name = v.name;
			ctx.out.addByte(7);
			if(name == null) {
				ctx.out.addByte(0);
			} else {
				var b = haxe_io_Bytes.ofString(name);
				var v1 = b.length + 1;
				if(v1 >= 0 && v1 < 128) {
					ctx.out.addByte(v1);
				} else {
					ctx.out.addByte(128);
					ctx.out.addInt32(v1);
				}
				ctx.out.add(b);
			}
			break;
		case 7:
			var k = v.k;
			var v1 = v.v;
			ctx.out.addByte(8);
			hxbit_enumSer_Hxbit_$PropTypeDesc.doSerialize(ctx,k);
			hxbit_enumSer_Hxbit_$PropTypeDesc.doSerialize(ctx,v1);
			break;
		case 8:
			var k = v.k;
			ctx.out.addByte(9);
			hxbit_enumSer_Hxbit_$PropTypeDesc.doSerialize(ctx,k);
			break;
		case 9:
			var fields = v.fields;
			ctx.out.addByte(10);
			if(fields == null) {
				ctx.out.addByte(0);
			} else {
				var v1 = fields.length + 1;
				if(v1 >= 0 && v1 < 128) {
					ctx.out.addByte(v1);
				} else {
					ctx.out.addByte(128);
					ctx.out.addInt32(v1);
				}
				var _g = 0;
				while(_g < fields.length) {
					var v1 = fields[_g];
					++_g;
					var v2 = v1;
					if(v2 == null) {
						ctx.out.addByte(0);
					} else {
						var fbits = 0;
						if(v2.name != null) {
							fbits |= 1;
						}
						if(v2.type != null) {
							fbits |= 2;
						}
						var v3 = fbits + 1;
						if(v3 >= 0 && v3 < 128) {
							ctx.out.addByte(v3);
						} else {
							ctx.out.addByte(128);
							ctx.out.addInt32(v3);
						}
						if((fbits & 1) != 0) {
							var s = v2.name;
							if(s == null) {
								ctx.out.addByte(0);
							} else {
								var b = haxe_io_Bytes.ofString(s);
								var v4 = b.length + 1;
								if(v4 >= 0 && v4 < 128) {
									ctx.out.addByte(v4);
								} else {
									ctx.out.addByte(128);
									ctx.out.addInt32(v4);
								}
								ctx.out.add(b);
							}
						}
						ctx.out.addByte(v2.opt ? 1 : 0);
						if((fbits & 2) != 0) {
							hxbit_enumSer_Hxbit_$PropTypeDesc.doSerialize(ctx,v2.type);
						}
					}
				}
			}
			break;
		case 10:
			var k = v.k;
			ctx.out.addByte(11);
			hxbit_enumSer_Hxbit_$PropTypeDesc.doSerialize(ctx,k);
			break;
		case 11:
			var k = v.k;
			ctx.out.addByte(12);
			hxbit_enumSer_Hxbit_$PropTypeDesc.doSerialize(ctx,k);
			break;
		case 12:
			var t = v.t;
			ctx.out.addByte(13);
			hxbit_enumSer_Hxbit_$PropTypeDesc.doSerialize(ctx,t);
			break;
		case 13:
			ctx.out.addByte(14);
			break;
		case 14:
			ctx.out.addByte(15);
			break;
		case 15:
			ctx.out.addByte(16);
			break;
		case 16:
			var t = v.t;
			ctx.out.addByte(17);
			hxbit_enumSer_Hxbit_$PropTypeDesc.doSerialize(ctx,t);
			break;
		case 17:
			ctx.out.addByte(18);
			break;
		}
	}
};
hxbit_enumSer_Hxbit_$PropTypeDesc.doUnserialize = function(ctx) {
	var b = ctx.input.b[ctx.inPos++];
	if(b == 0) {
		return null;
	}
	switch(b) {
	case 1:
		return hxbit_PropTypeDesc.PInt;
	case 2:
		return hxbit_PropTypeDesc.PFloat;
	case 3:
		return hxbit_PropTypeDesc.PBool;
	case 4:
		return hxbit_PropTypeDesc.PString;
	case 5:
		return hxbit_PropTypeDesc.PBytes;
	case 6:
		var _name;
		var v = ctx.input.b[ctx.inPos++];
		if(v == 128) {
			v = ctx.input.getInt32(ctx.inPos);
			ctx.inPos += 4;
		}
		var len = v;
		if(len == 0) {
			_name = null;
		} else {
			--len;
			var s = ctx.input.getString(ctx.inPos,len);
			ctx.inPos += len;
			_name = s;
		}
		return hxbit_PropTypeDesc.PSerializable(_name);
	case 7:
		var _name;
		var v = ctx.input.b[ctx.inPos++];
		if(v == 128) {
			v = ctx.input.getInt32(ctx.inPos);
			ctx.inPos += 4;
		}
		var len = v;
		if(len == 0) {
			_name = null;
		} else {
			--len;
			var s = ctx.input.getString(ctx.inPos,len);
			ctx.inPos += len;
			_name = s;
		}
		return hxbit_PropTypeDesc.PEnum(_name);
	case 8:
		var _k;
		var __e = hxbit_enumSer_Hxbit_$PropTypeDesc.doUnserialize(ctx);
		_k = __e;
		var _v;
		var __e = hxbit_enumSer_Hxbit_$PropTypeDesc.doUnserialize(ctx);
		_v = __e;
		return hxbit_PropTypeDesc.PMap(_k,_v);
	case 9:
		var _k;
		var __e = hxbit_enumSer_Hxbit_$PropTypeDesc.doUnserialize(ctx);
		_k = __e;
		return hxbit_PropTypeDesc.PArray(_k);
	case 10:
		var _fields;
		var e0;
		var v = ctx.input.b[ctx.inPos++];
		if(v == 128) {
			v = ctx.input.getInt32(ctx.inPos);
			ctx.inPos += 4;
		}
		var len = v;
		if(len == 0) {
			_fields = null;
		} else {
			--len;
			var a = [];
			var _g = 0;
			var _g1 = len;
			while(_g < _g1) {
				var i = _g++;
				var v = ctx.input.b[ctx.inPos++];
				if(v == 128) {
					v = ctx.input.getInt32(ctx.inPos);
					ctx.inPos += 4;
				}
				var fbits = v;
				if(fbits == 0) {
					e0 = null;
				} else {
					--fbits;
					var type = null;
					var name = null;
					if((fbits & 1) != 0) {
						var v1 = ctx.input.b[ctx.inPos++];
						if(v1 == 128) {
							v1 = ctx.input.getInt32(ctx.inPos);
							ctx.inPos += 4;
						}
						var len = v1;
						if(len == 0) {
							name = null;
						} else {
							--len;
							var s = ctx.input.getString(ctx.inPos,len);
							ctx.inPos += len;
							name = s;
						}
					}
					var opt = ctx.input.b[ctx.inPos++] != 0;
					if((fbits & 2) != 0) {
						var __e = hxbit_enumSer_Hxbit_$PropTypeDesc.doUnserialize(ctx);
						type = __e;
					}
					e0 = { name : name, opt : opt, type : type};
				}
				a[i] = e0;
			}
			_fields = a;
		}
		return hxbit_PropTypeDesc.PObj(_fields);
	case 11:
		var _k;
		var __e = hxbit_enumSer_Hxbit_$PropTypeDesc.doUnserialize(ctx);
		_k = __e;
		return hxbit_PropTypeDesc.PAlias(_k);
	case 12:
		var _k;
		var __e = hxbit_enumSer_Hxbit_$PropTypeDesc.doUnserialize(ctx);
		_k = __e;
		return hxbit_PropTypeDesc.PVector(_k);
	case 13:
		var _t;
		var __e = hxbit_enumSer_Hxbit_$PropTypeDesc.doUnserialize(ctx);
		_t = __e;
		return hxbit_PropTypeDesc.PNull(_t);
	case 14:
		return hxbit_PropTypeDesc.PUnknown;
	case 15:
		return hxbit_PropTypeDesc.PDynamic;
	case 16:
		return hxbit_PropTypeDesc.PInt64;
	case 17:
		var _t;
		var __e = hxbit_enumSer_Hxbit_$PropTypeDesc.doUnserialize(ctx);
		_t = __e;
		return hxbit_PropTypeDesc.PFlags(_t);
	case 18:
		return hxbit_PropTypeDesc.PStruct;
	default:
		throw haxe_Exception.thrown("Invalid enum index " + b);
	}
};
hxbit_enumSer_Hxbit_$PropTypeDesc.getSchema = function() {
	var s = new hxbit_Schema();
	s.fieldsTypes.push(null);
	s.fieldsNames.push("PInt");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("PFloat");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("PBool");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("PString");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("PBytes");
	var s1 = s.fieldsTypes;
	var _g = [];
	var v;
	var t = hxbit_PropTypeDesc.PString;
	_g.push({ name : "", type : t, opt : false});
	s1.push(hxbit_PropTypeDesc.PObj(_g));
	s.fieldsNames.push("PSerializable");
	var s1 = s.fieldsTypes;
	var _g = [];
	var v;
	var t = hxbit_PropTypeDesc.PString;
	_g.push({ name : "", type : t, opt : false});
	s1.push(hxbit_PropTypeDesc.PObj(_g));
	s.fieldsNames.push("PEnum");
	var s1 = s.fieldsTypes;
	var _g = [];
	var v;
	var v;
	var t = hxbit_PropTypeDesc.PEnum("hxbit.PropTypeDesc");
	_g.push({ name : "", type : t, opt : false});
	s1.push(hxbit_PropTypeDesc.PObj(_g));
	s.fieldsNames.push("PMap");
	var s1 = s.fieldsTypes;
	var _g = [];
	var v;
	var t = hxbit_PropTypeDesc.PEnum("hxbit.PropTypeDesc");
	_g.push({ name : "", type : t, opt : false});
	s1.push(hxbit_PropTypeDesc.PObj(_g));
	s.fieldsNames.push("PArray");
	var s1 = s.fieldsTypes;
	var _g = [];
	var v;
	var t = hxbit_PropTypeDesc.PArray(hxbit_PropTypeDesc.PObj([{ name : "name", opt : false, type : hxbit_PropTypeDesc.PString},{ name : "opt", opt : false, type : hxbit_PropTypeDesc.PBool},{ name : "type", opt : false, type : hxbit_PropTypeDesc.PEnum("hxbit.PropTypeDesc")}]));
	_g.push({ name : "", type : t, opt : false});
	s1.push(hxbit_PropTypeDesc.PObj(_g));
	s.fieldsNames.push("PObj");
	var s1 = s.fieldsTypes;
	var _g = [];
	var v;
	var t = hxbit_PropTypeDesc.PEnum("hxbit.PropTypeDesc");
	_g.push({ name : "", type : t, opt : false});
	s1.push(hxbit_PropTypeDesc.PObj(_g));
	s.fieldsNames.push("PAlias");
	var s1 = s.fieldsTypes;
	var _g = [];
	var v;
	var t = hxbit_PropTypeDesc.PEnum("hxbit.PropTypeDesc");
	_g.push({ name : "", type : t, opt : false});
	s1.push(hxbit_PropTypeDesc.PObj(_g));
	s.fieldsNames.push("PVector");
	var s1 = s.fieldsTypes;
	var _g = [];
	var v;
	var t = hxbit_PropTypeDesc.PEnum("hxbit.PropTypeDesc");
	_g.push({ name : "", type : t, opt : false});
	s1.push(hxbit_PropTypeDesc.PObj(_g));
	s.fieldsNames.push("PNull");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("PUnknown");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("PDynamic");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("PInt64");
	var s1 = s.fieldsTypes;
	var _g = [];
	var v;
	var t = hxbit_PropTypeDesc.PEnum("hxbit.PropTypeDesc");
	_g.push({ name : "", type : t, opt : false});
	s1.push(hxbit_PropTypeDesc.PObj(_g));
	s.fieldsNames.push("PFlags");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("PStruct");
	return s;
};
var hxbit_enumSer_Model_$ver1_$game_$define_$BattlePoint = function() { };
$hxClasses["hxbit.enumSer.Model_ver1_game_define_BattlePoint"] = hxbit_enumSer_Model_$ver1_$game_$define_$BattlePoint;
hxbit_enumSer_Model_$ver1_$game_$define_$BattlePoint.__name__ = "hxbit.enumSer.Model_ver1_game_define_BattlePoint";
hxbit_enumSer_Model_$ver1_$game_$define_$BattlePoint.doSerialize = function(ctx,v) {
	if(v == null) {
		ctx.out.addByte(0);
	} else {
		var melee = v.melee;
		var range = v.range;
		var hp = v.hp;
		ctx.out.addByte(1);
		if(melee >= 0 && melee < 128) {
			ctx.out.addByte(melee);
		} else {
			ctx.out.addByte(128);
			ctx.out.addInt32(melee);
		}
		if(range >= 0 && range < 128) {
			ctx.out.addByte(range);
		} else {
			ctx.out.addByte(128);
			ctx.out.addInt32(range);
		}
		if(hp >= 0 && hp < 128) {
			ctx.out.addByte(hp);
		} else {
			ctx.out.addByte(128);
			ctx.out.addInt32(hp);
		}
	}
};
hxbit_enumSer_Model_$ver1_$game_$define_$BattlePoint.doUnserialize = function(ctx) {
	var b = ctx.input.b[ctx.inPos++];
	if(b == 0) {
		return null;
	}
	if(b == 1) {
		var v = ctx.input.b[ctx.inPos++];
		if(v == 128) {
			v = ctx.input.getInt32(ctx.inPos);
			ctx.inPos += 4;
		}
		var _melee = v;
		var v = ctx.input.b[ctx.inPos++];
		if(v == 128) {
			v = ctx.input.getInt32(ctx.inPos);
			ctx.inPos += 4;
		}
		var _range = v;
		var v = ctx.input.b[ctx.inPos++];
		if(v == 128) {
			v = ctx.input.getInt32(ctx.inPos);
			ctx.inPos += 4;
		}
		var _hp = v;
		return model_ver1_game_define_BattlePoint.Default(_melee,_range,_hp);
	} else {
		throw haxe_Exception.thrown("Invalid enum index " + b);
	}
};
hxbit_enumSer_Model_$ver1_$game_$define_$BattlePoint.getSchema = function() {
	var s = new hxbit_Schema();
	var s1 = s.fieldsTypes;
	var _g = [];
	var v;
	var v;
	var v;
	var t = hxbit_PropTypeDesc.PInt;
	_g.push({ name : "", type : t, opt : false});
	s1.push(hxbit_PropTypeDesc.PObj(_g));
	s.fieldsNames.push("Default");
	return s;
};
var hxbit_enumSer_Model_$ver1_$game_$define_$BlockCause = function() { };
$hxClasses["hxbit.enumSer.Model_ver1_game_define_BlockCause"] = hxbit_enumSer_Model_$ver1_$game_$define_$BlockCause;
hxbit_enumSer_Model_$ver1_$game_$define_$BlockCause.__name__ = "hxbit.enumSer.Model_ver1_game_define_BlockCause";
hxbit_enumSer_Model_$ver1_$game_$define_$BlockCause.doSerialize = function(ctx,v) {
	if(v == null) {
		ctx.out.addByte(0);
	} else {
		switch(v._hx_index) {
		case 0:
			ctx.out.addByte(1);
			break;
		case 1:
			var respnosePlayerId = v.respnosePlayerId;
			ctx.out.addByte(2);
			if(respnosePlayerId == null) {
				ctx.out.addByte(0);
			} else {
				var b = haxe_io_Bytes.ofString(respnosePlayerId);
				var v1 = b.length + 1;
				if(v1 >= 0 && v1 < 128) {
					ctx.out.addByte(v1);
				} else {
					ctx.out.addByte(128);
					ctx.out.addInt32(v1);
				}
				ctx.out.add(b);
			}
			break;
		case 2:
			var playerId = v.playerId;
			var cardId = v.cardId;
			ctx.out.addByte(3);
			if(playerId == null) {
				ctx.out.addByte(0);
			} else {
				var b = haxe_io_Bytes.ofString(playerId);
				var v1 = b.length + 1;
				if(v1 >= 0 && v1 < 128) {
					ctx.out.addByte(v1);
				} else {
					ctx.out.addByte(128);
					ctx.out.addInt32(v1);
				}
				ctx.out.add(b);
			}
			if(cardId == null) {
				ctx.out.addByte(0);
			} else {
				var b = haxe_io_Bytes.ofString(cardId);
				var v1 = b.length + 1;
				if(v1 >= 0 && v1 < 128) {
					ctx.out.addByte(v1);
				} else {
					ctx.out.addByte(128);
					ctx.out.addInt32(v1);
				}
				ctx.out.add(b);
			}
			break;
		case 3:
			var cardId = v.cardId;
			var textId = v.textId;
			ctx.out.addByte(4);
			if(cardId == null) {
				ctx.out.addByte(0);
			} else {
				var b = haxe_io_Bytes.ofString(cardId);
				var v1 = b.length + 1;
				if(v1 >= 0 && v1 < 128) {
					ctx.out.addByte(v1);
				} else {
					ctx.out.addByte(128);
					ctx.out.addInt32(v1);
				}
				ctx.out.add(b);
			}
			if(textId == null) {
				ctx.out.addByte(0);
			} else {
				var b = haxe_io_Bytes.ofString(textId);
				var v1 = b.length + 1;
				if(v1 >= 0 && v1 < 128) {
					ctx.out.addByte(v1);
				} else {
					ctx.out.addByte(128);
					ctx.out.addInt32(v1);
				}
				ctx.out.add(b);
			}
			break;
		case 4:
			var cardId = v.cardId;
			var textId = v.textId;
			ctx.out.addByte(5);
			if(cardId == null) {
				ctx.out.addByte(0);
			} else {
				var b = haxe_io_Bytes.ofString(cardId);
				var v = b.length + 1;
				if(v >= 0 && v < 128) {
					ctx.out.addByte(v);
				} else {
					ctx.out.addByte(128);
					ctx.out.addInt32(v);
				}
				ctx.out.add(b);
			}
			if(textId == null) {
				ctx.out.addByte(0);
			} else {
				var b = haxe_io_Bytes.ofString(textId);
				var v = b.length + 1;
				if(v >= 0 && v < 128) {
					ctx.out.addByte(v);
				} else {
					ctx.out.addByte(128);
					ctx.out.addInt32(v);
				}
				ctx.out.add(b);
			}
			break;
		}
	}
};
hxbit_enumSer_Model_$ver1_$game_$define_$BlockCause.doUnserialize = function(ctx) {
	var b = ctx.input.b[ctx.inPos++];
	if(b == 0) {
		return null;
	}
	switch(b) {
	case 1:
		return model_ver1_game_define_BlockCause.Pending;
	case 2:
		var _respnosePlayerId;
		var v = ctx.input.b[ctx.inPos++];
		if(v == 128) {
			v = ctx.input.getInt32(ctx.inPos);
			ctx.inPos += 4;
		}
		var len = v;
		if(len == 0) {
			_respnosePlayerId = null;
		} else {
			--len;
			var s = ctx.input.getString(ctx.inPos,len);
			ctx.inPos += len;
			_respnosePlayerId = s;
		}
		return model_ver1_game_define_BlockCause.System(_respnosePlayerId);
	case 3:
		var _playerId;
		var v = ctx.input.b[ctx.inPos++];
		if(v == 128) {
			v = ctx.input.getInt32(ctx.inPos);
			ctx.inPos += 4;
		}
		var len = v;
		if(len == 0) {
			_playerId = null;
		} else {
			--len;
			var s = ctx.input.getString(ctx.inPos,len);
			ctx.inPos += len;
			_playerId = s;
		}
		var _cardId;
		var v = ctx.input.b[ctx.inPos++];
		if(v == 128) {
			v = ctx.input.getInt32(ctx.inPos);
			ctx.inPos += 4;
		}
		var len = v;
		if(len == 0) {
			_cardId = null;
		} else {
			--len;
			var s = ctx.input.getString(ctx.inPos,len);
			ctx.inPos += len;
			_cardId = s;
		}
		return model_ver1_game_define_BlockCause.PlayCard(_playerId,_cardId);
	case 4:
		var _cardId;
		var v = ctx.input.b[ctx.inPos++];
		if(v == 128) {
			v = ctx.input.getInt32(ctx.inPos);
			ctx.inPos += 4;
		}
		var len = v;
		if(len == 0) {
			_cardId = null;
		} else {
			--len;
			var s = ctx.input.getString(ctx.inPos,len);
			ctx.inPos += len;
			_cardId = s;
		}
		var _textId;
		var v = ctx.input.b[ctx.inPos++];
		if(v == 128) {
			v = ctx.input.getInt32(ctx.inPos);
			ctx.inPos += 4;
		}
		var len = v;
		if(len == 0) {
			_textId = null;
		} else {
			--len;
			var s = ctx.input.getString(ctx.inPos,len);
			ctx.inPos += len;
			_textId = s;
		}
		return model_ver1_game_define_BlockCause.PlayText(_cardId,_textId);
	case 5:
		var _cardId;
		var v = ctx.input.b[ctx.inPos++];
		if(v == 128) {
			v = ctx.input.getInt32(ctx.inPos);
			ctx.inPos += 4;
		}
		var len = v;
		if(len == 0) {
			_cardId = null;
		} else {
			--len;
			var s = ctx.input.getString(ctx.inPos,len);
			ctx.inPos += len;
			_cardId = s;
		}
		var _textId;
		var v = ctx.input.b[ctx.inPos++];
		if(v == 128) {
			v = ctx.input.getInt32(ctx.inPos);
			ctx.inPos += 4;
		}
		var len = v;
		if(len == 0) {
			_textId = null;
		} else {
			--len;
			var s = ctx.input.getString(ctx.inPos,len);
			ctx.inPos += len;
			_textId = s;
		}
		return model_ver1_game_define_BlockCause.TextEffect(_cardId,_textId);
	default:
		throw haxe_Exception.thrown("Invalid enum index " + b);
	}
};
hxbit_enumSer_Model_$ver1_$game_$define_$BlockCause.getSchema = function() {
	var s = new hxbit_Schema();
	s.fieldsTypes.push(null);
	s.fieldsNames.push("Pending");
	var s1 = s.fieldsTypes;
	var _g = [];
	var v;
	var t = hxbit_PropTypeDesc.PString;
	_g.push({ name : "", type : t, opt : false});
	s1.push(hxbit_PropTypeDesc.PObj(_g));
	s.fieldsNames.push("System");
	var s1 = s.fieldsTypes;
	var _g = [];
	var v;
	var v;
	var t = hxbit_PropTypeDesc.PString;
	_g.push({ name : "", type : t, opt : false});
	s1.push(hxbit_PropTypeDesc.PObj(_g));
	s.fieldsNames.push("PlayCard");
	var s1 = s.fieldsTypes;
	var _g = [];
	var v;
	var v;
	var t = hxbit_PropTypeDesc.PString;
	_g.push({ name : "", type : t, opt : false});
	s1.push(hxbit_PropTypeDesc.PObj(_g));
	s.fieldsNames.push("PlayText");
	var s1 = s.fieldsTypes;
	var _g = [];
	var v;
	var v;
	var t = hxbit_PropTypeDesc.PString;
	_g.push({ name : "", type : t, opt : false});
	s1.push(hxbit_PropTypeDesc.PObj(_g));
	s.fieldsNames.push("TextEffect");
	return s;
};
var hxbit_enumSer_Model_$ver1_$game_$define_$FlowMemoryState = function() { };
$hxClasses["hxbit.enumSer.Model_ver1_game_define_FlowMemoryState"] = hxbit_enumSer_Model_$ver1_$game_$define_$FlowMemoryState;
hxbit_enumSer_Model_$ver1_$game_$define_$FlowMemoryState.__name__ = "hxbit.enumSer.Model_ver1_game_define_FlowMemoryState";
hxbit_enumSer_Model_$ver1_$game_$define_$FlowMemoryState.doSerialize = function(ctx,v) {
	if(v == null) {
		ctx.out.addByte(0);
	} else {
		switch(v._hx_index) {
		case 0:
			ctx.out.addByte(1);
			break;
		case 1:
			ctx.out.addByte(2);
			break;
		case 2:
			ctx.out.addByte(3);
			break;
		case 3:
			ctx.out.addByte(4);
			break;
		}
	}
};
hxbit_enumSer_Model_$ver1_$game_$define_$FlowMemoryState.doUnserialize = function(ctx) {
	var b = ctx.input.b[ctx.inPos++];
	if(b == 0) {
		return null;
	}
	switch(b) {
	case 1:
		return model_ver1_game_define_FlowMemoryState.PrepareDeck;
	case 2:
		return model_ver1_game_define_FlowMemoryState.WhoFirst;
	case 3:
		return model_ver1_game_define_FlowMemoryState.Draw6AndConfirm;
	case 4:
		return model_ver1_game_define_FlowMemoryState.Playing;
	default:
		throw haxe_Exception.thrown("Invalid enum index " + b);
	}
};
hxbit_enumSer_Model_$ver1_$game_$define_$FlowMemoryState.getSchema = function() {
	var s = new hxbit_Schema();
	s.fieldsTypes.push(null);
	s.fieldsNames.push("PrepareDeck");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("WhoFirst");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("Draw6AndConfirm");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("Playing");
	return s;
};
var hxbit_enumSer_Model_$ver1_$game_$define_$PhaseKeyword = function() { };
$hxClasses["hxbit.enumSer.Model_ver1_game_define_PhaseKeyword"] = hxbit_enumSer_Model_$ver1_$game_$define_$PhaseKeyword;
hxbit_enumSer_Model_$ver1_$game_$define_$PhaseKeyword.__name__ = "hxbit.enumSer.Model_ver1_game_define_PhaseKeyword";
hxbit_enumSer_Model_$ver1_$game_$define_$PhaseKeyword.doSerialize = function(ctx,v) {
	if(v == null) {
		ctx.out.addByte(0);
	} else {
		switch(v._hx_index) {
		case 0:
			ctx.out.addByte(1);
			break;
		case 1:
			ctx.out.addByte(2);
			break;
		case 2:
			ctx.out.addByte(3);
			break;
		case 3:
			ctx.out.addByte(4);
			break;
		}
	}
};
hxbit_enumSer_Model_$ver1_$game_$define_$PhaseKeyword.doUnserialize = function(ctx) {
	var b = ctx.input.b[ctx.inPos++];
	if(b == 0) {
		return null;
	}
	switch(b) {
	case 1:
		return model_ver1_game_define_PhaseKeyword.Reroll;
	case 2:
		return model_ver1_game_define_PhaseKeyword.Draw;
	case 3:
		return model_ver1_game_define_PhaseKeyword.Maintenance;
	case 4:
		return model_ver1_game_define_PhaseKeyword.Battle;
	default:
		throw haxe_Exception.thrown("Invalid enum index " + b);
	}
};
hxbit_enumSer_Model_$ver1_$game_$define_$PhaseKeyword.getSchema = function() {
	var s = new hxbit_Schema();
	s.fieldsTypes.push(null);
	s.fieldsNames.push("Reroll");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("Draw");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("Maintenance");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("Battle");
	return s;
};
var hxbit_enumSer_Model_$ver1_$game_$define_$StepKeyword = function() { };
$hxClasses["hxbit.enumSer.Model_ver1_game_define_StepKeyword"] = hxbit_enumSer_Model_$ver1_$game_$define_$StepKeyword;
hxbit_enumSer_Model_$ver1_$game_$define_$StepKeyword.__name__ = "hxbit.enumSer.Model_ver1_game_define_StepKeyword";
hxbit_enumSer_Model_$ver1_$game_$define_$StepKeyword.doSerialize = function(ctx,v) {
	if(v == null) {
		ctx.out.addByte(0);
	} else {
		switch(v._hx_index) {
		case 0:
			ctx.out.addByte(1);
			break;
		case 1:
			ctx.out.addByte(2);
			break;
		case 2:
			ctx.out.addByte(3);
			break;
		case 3:
			ctx.out.addByte(4);
			break;
		case 4:
			ctx.out.addByte(5);
			break;
		}
	}
};
hxbit_enumSer_Model_$ver1_$game_$define_$StepKeyword.doUnserialize = function(ctx) {
	var b = ctx.input.b[ctx.inPos++];
	if(b == 0) {
		return null;
	}
	switch(b) {
	case 1:
		return model_ver1_game_define_StepKeyword.Attack;
	case 2:
		return model_ver1_game_define_StepKeyword.Defense;
	case 3:
		return model_ver1_game_define_StepKeyword.DamageChecking;
	case 4:
		return model_ver1_game_define_StepKeyword.Return;
	case 5:
		return model_ver1_game_define_StepKeyword.End;
	default:
		throw haxe_Exception.thrown("Invalid enum index " + b);
	}
};
hxbit_enumSer_Model_$ver1_$game_$define_$StepKeyword.getSchema = function() {
	var s = new hxbit_Schema();
	s.fieldsTypes.push(null);
	s.fieldsNames.push("Attack");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("Defense");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("DamageChecking");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("Return");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("End");
	return s;
};
var hxbit_enumSer_Model_$ver1_$game_$define_$TextType = function() { };
$hxClasses["hxbit.enumSer.Model_ver1_game_define_TextType"] = hxbit_enumSer_Model_$ver1_$game_$define_$TextType;
hxbit_enumSer_Model_$ver1_$game_$define_$TextType.__name__ = "hxbit.enumSer.Model_ver1_game_define_TextType";
hxbit_enumSer_Model_$ver1_$game_$define_$TextType.doSerialize = function(ctx,v) {
	if(v == null) {
		ctx.out.addByte(0);
	} else {
		switch(v._hx_index) {
		case 0:
			var type = v.type;
			ctx.out.addByte(1);
			hxbit_enumSer_Model_$ver1_$game_$define_$TextTypeAutomaticType.doSerialize(ctx,type);
			break;
		case 1:
			ctx.out.addByte(2);
			break;
		case 2:
			ctx.out.addByte(3);
			break;
		}
	}
};
hxbit_enumSer_Model_$ver1_$game_$define_$TextType.doUnserialize = function(ctx) {
	var b = ctx.input.b[ctx.inPos++];
	if(b == 0) {
		return null;
	}
	switch(b) {
	case 1:
		var _type;
		var __e = hxbit_enumSer_Model_$ver1_$game_$define_$TextTypeAutomaticType.doUnserialize(ctx);
		_type = __e;
		return model_ver1_game_define_TextType.Automatic(_type);
	case 2:
		return model_ver1_game_define_TextType.Use;
	case 3:
		return model_ver1_game_define_TextType.Special;
	default:
		throw haxe_Exception.thrown("Invalid enum index " + b);
	}
};
hxbit_enumSer_Model_$ver1_$game_$define_$TextType.getSchema = function() {
	var s = new hxbit_Schema();
	var s1 = s.fieldsTypes;
	var _g = [];
	var v;
	var t = hxbit_PropTypeDesc.PEnum("model.ver1.game.define.TextTypeAutomaticType");
	_g.push({ name : "", type : t, opt : false});
	s1.push(hxbit_PropTypeDesc.PObj(_g));
	s.fieldsNames.push("Automatic");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("Use");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("Special");
	return s;
};
var hxbit_enumSer_Model_$ver1_$game_$define_$TextTypeAutomaticType = function() { };
$hxClasses["hxbit.enumSer.Model_ver1_game_define_TextTypeAutomaticType"] = hxbit_enumSer_Model_$ver1_$game_$define_$TextTypeAutomaticType;
hxbit_enumSer_Model_$ver1_$game_$define_$TextTypeAutomaticType.__name__ = "hxbit.enumSer.Model_ver1_game_define_TextTypeAutomaticType";
hxbit_enumSer_Model_$ver1_$game_$define_$TextTypeAutomaticType.doSerialize = function(ctx,v) {
	if(v == null) {
		ctx.out.addByte(0);
	} else {
		switch(v._hx_index) {
		case 0:
			ctx.out.addByte(1);
			break;
		case 1:
			ctx.out.addByte(2);
			break;
		case 2:
			ctx.out.addByte(3);
			break;
		}
	}
};
hxbit_enumSer_Model_$ver1_$game_$define_$TextTypeAutomaticType.doUnserialize = function(ctx) {
	var b = ctx.input.b[ctx.inPos++];
	if(b == 0) {
		return null;
	}
	switch(b) {
	case 1:
		return model_ver1_game_define_TextTypeAutomaticType.Resident;
	case 2:
		return model_ver1_game_define_TextTypeAutomaticType.Trigger;
	case 3:
		return model_ver1_game_define_TextTypeAutomaticType.Constant;
	default:
		throw haxe_Exception.thrown("Invalid enum index " + b);
	}
};
hxbit_enumSer_Model_$ver1_$game_$define_$TextTypeAutomaticType.getSchema = function() {
	var s = new hxbit_Schema();
	s.fieldsTypes.push(null);
	s.fieldsNames.push("Resident");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("Trigger");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("Constant");
	return s;
};
var hxbit_enumSer_Model_$ver1_$game_$define_$Timing = function() { };
$hxClasses["hxbit.enumSer.Model_ver1_game_define_Timing"] = hxbit_enumSer_Model_$ver1_$game_$define_$Timing;
hxbit_enumSer_Model_$ver1_$game_$define_$Timing.__name__ = "hxbit.enumSer.Model_ver1_game_define_Timing";
hxbit_enumSer_Model_$ver1_$game_$define_$Timing.doSerialize = function(ctx,v) {
	if(v == null) {
		ctx.out.addByte(0);
	} else {
		var phase = v.phase;
		var step = v.step;
		var timing = v.timing;
		ctx.out.addByte(1);
		hxbit_enumSer_Model_$ver1_$game_$define_$PhaseKeyword.doSerialize(ctx,phase);
		hxbit_enumSer_Haxe_$ds_$Option.doSerialize(ctx,step);
		hxbit_enumSer_Model_$ver1_$game_$define_$TimingKeyword.doSerialize(ctx,timing);
	}
};
hxbit_enumSer_Model_$ver1_$game_$define_$Timing.doUnserialize = function(ctx) {
	var b = ctx.input.b[ctx.inPos++];
	if(b == 0) {
		return null;
	}
	if(b == 1) {
		var _phase;
		var __e = hxbit_enumSer_Model_$ver1_$game_$define_$PhaseKeyword.doUnserialize(ctx);
		_phase = __e;
		var _step;
		var __e = hxbit_enumSer_Haxe_$ds_$Option.doUnserialize(ctx);
		_step = __e;
		var _timing;
		var __e = hxbit_enumSer_Model_$ver1_$game_$define_$TimingKeyword.doUnserialize(ctx);
		_timing = __e;
		return model_ver1_game_define_Timing.Default(_phase,_step,_timing);
	} else {
		throw haxe_Exception.thrown("Invalid enum index " + b);
	}
};
hxbit_enumSer_Model_$ver1_$game_$define_$Timing.getSchema = function() {
	var s = new hxbit_Schema();
	var s1 = s.fieldsTypes;
	var _g = [];
	var v;
	var v;
	var v;
	var t = hxbit_PropTypeDesc.PEnum("model.ver1.game.define.TimingKeyword");
	_g.push({ name : "", type : t, opt : false});
	s1.push(hxbit_PropTypeDesc.PObj(_g));
	s.fieldsNames.push("Default");
	return s;
};
var hxbit_enumSer_Model_$ver1_$game_$define_$TimingKeyword = function() { };
$hxClasses["hxbit.enumSer.Model_ver1_game_define_TimingKeyword"] = hxbit_enumSer_Model_$ver1_$game_$define_$TimingKeyword;
hxbit_enumSer_Model_$ver1_$game_$define_$TimingKeyword.__name__ = "hxbit.enumSer.Model_ver1_game_define_TimingKeyword";
hxbit_enumSer_Model_$ver1_$game_$define_$TimingKeyword.doSerialize = function(ctx,v) {
	if(v == null) {
		ctx.out.addByte(0);
	} else {
		switch(v._hx_index) {
		case 0:
			ctx.out.addByte(1);
			break;
		case 1:
			ctx.out.addByte(2);
			break;
		case 2:
			ctx.out.addByte(3);
			break;
		case 3:
			ctx.out.addByte(4);
			break;
		case 4:
			ctx.out.addByte(5);
			break;
		case 5:
			ctx.out.addByte(6);
			break;
		case 6:
			ctx.out.addByte(7);
			break;
		case 7:
			ctx.out.addByte(8);
			break;
		case 8:
			ctx.out.addByte(9);
			break;
		}
	}
};
hxbit_enumSer_Model_$ver1_$game_$define_$TimingKeyword.doUnserialize = function(ctx) {
	var b = ctx.input.b[ctx.inPos++];
	if(b == 0) {
		return null;
	}
	switch(b) {
	case 1:
		return model_ver1_game_define_TimingKeyword.Start;
	case 2:
		return model_ver1_game_define_TimingKeyword.Free1;
	case 3:
		return model_ver1_game_define_TimingKeyword.Rule;
	case 4:
		return model_ver1_game_define_TimingKeyword.Free2;
	case 5:
		return model_ver1_game_define_TimingKeyword.End;
	case 6:
		return model_ver1_game_define_TimingKeyword.DamageReset;
	case 7:
		return model_ver1_game_define_TimingKeyword.ResolveEffect;
	case 8:
		return model_ver1_game_define_TimingKeyword.AdjustHand;
	case 9:
		return model_ver1_game_define_TimingKeyword.TurnEnd;
	default:
		throw haxe_Exception.thrown("Invalid enum index " + b);
	}
};
hxbit_enumSer_Model_$ver1_$game_$define_$TimingKeyword.getSchema = function() {
	var s = new hxbit_Schema();
	s.fieldsTypes.push(null);
	s.fieldsNames.push("Start");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("Free1");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("Rule");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("Free2");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("End");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("DamageReset");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("ResolveEffect");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("AdjustHand");
	s.fieldsTypes.push(null);
	s.fieldsNames.push("TurnEnd");
	return s;
};
var js_Boot = function() { };
$hxClasses["js.Boot"] = js_Boot;
js_Boot.__name__ = "js.Boot";
js_Boot.getClass = function(o) {
	if(o == null) {
		return null;
	} else if(((o) instanceof Array)) {
		return Array;
	} else {
		var cl = o.__class__;
		if(cl != null) {
			return cl;
		}
		var name = js_Boot.__nativeClassName(o);
		if(name != null) {
			return js_Boot.__resolveNativeClass(name);
		}
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(o.__enum__) {
			var e = $hxEnums[o.__enum__];
			var con = e.__constructs__[o._hx_index];
			var n = con._hx_name;
			if(con.__params__) {
				s = s + "\t";
				return n + "(" + ((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						var _g2 = con.__params__;
						while(true) {
							if(!(_g1 < _g2.length)) {
								break;
							}
							var p = _g2[_g1];
							_g1 = _g1 + 1;
							_g.push(js_Boot.__string_rec(o[p],s));
						}
					}
					$r = _g;
					return $r;
				}(this))).join(",") + ")";
			} else {
				return n;
			}
		}
		if(((o) instanceof Array)) {
			var str = "[";
			s += "\t";
			var _g = 0;
			var _g1 = o.length;
			while(_g < _g1) {
				var i = _g++;
				str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( _g ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		var k = null;
		for( k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) {
			str += ", \n";
		}
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) {
		return false;
	}
	if(cc == cl) {
		return true;
	}
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g = 0;
		var _g1 = intf.length;
		while(_g < _g1) {
			var i = _g++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) {
				return true;
			}
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__downcastCheck = function(o,cl) {
	if(!((o) instanceof cl)) {
		if(cl.__isInterface__) {
			return js_Boot.__interfLoop(js_Boot.getClass(o),cl);
		} else {
			return false;
		}
	} else {
		return true;
	}
};
js_Boot.__implements = function(o,iface) {
	return js_Boot.__interfLoop(js_Boot.getClass(o),iface);
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") {
		return null;
	}
	return name;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var js_lib__$ArrayBuffer_ArrayBufferCompat = function() { };
$hxClasses["js.lib._ArrayBuffer.ArrayBufferCompat"] = js_lib__$ArrayBuffer_ArrayBufferCompat;
js_lib__$ArrayBuffer_ArrayBufferCompat.__name__ = "js.lib._ArrayBuffer.ArrayBufferCompat";
js_lib__$ArrayBuffer_ArrayBufferCompat.sliceImpl = function(begin,end) {
	var u = new Uint8Array(this,begin,end == null ? null : end - begin);
	var resultArray = new Uint8Array(u.byteLength);
	resultArray.set(u);
	return resultArray.buffer;
};
var model_ver1_game_define_CardProto = function() {
	this.__uid = hxbit_Serializer.SEQ << 24 | ++hxbit_Serializer.UID;
	this.category = model_ver1_game_define_CardCategory.Unit;
};
$hxClasses["model.ver1.game.define.CardProto"] = model_ver1_game_define_CardProto;
model_ver1_game_define_CardProto.__name__ = "model.ver1.game.define.CardProto";
model_ver1_game_define_CardProto.__interfaces__ = [hxbit_Serializable];
model_ver1_game_define_CardProto.prototype = {
	getTexts: function(ctx,runtime) {
		return [];
	}
	,getCLID: function() {
		return model_ver1_game_define_CardProto.__clid;
	}
	,serialize: function(__ctx) {
	}
	,getSerializeSchema: function() {
		var schema = new hxbit_Schema();
		schema.isFinal = hxbit_Serializer.isClassFinal(model_ver1_game_define_CardProto.__clid);
		return schema;
	}
	,unserializeInit: function() {
		this.category = model_ver1_game_define_CardCategory.Unit;
	}
	,unserialize: function(__ctx) {
	}
	,__class__: model_ver1_game_define_CardProto
};
var model_ver1_data_CardProto_$179001_$01A_$CH_$WT007R_$white = function() {
	model_ver1_game_define_CardProto.call(this);
};
$hxClasses["model.ver1.data.CardProto_179001_01A_CH_WT007R_white"] = model_ver1_data_CardProto_$179001_$01A_$CH_$WT007R_$white;
model_ver1_data_CardProto_$179001_$01A_$CH_$WT007R_$white.__name__ = "model.ver1.data.CardProto_179001_01A_CH_WT007R_white";
model_ver1_data_CardProto_$179001_$01A_$CH_$WT007R_$white.__super__ = model_ver1_game_define_CardProto;
model_ver1_data_CardProto_$179001_$01A_$CH_$WT007R_$white.prototype = $extend(model_ver1_game_define_CardProto.prototype,{
	getTexts: function(ctx,runtime) {
		return [new model_ver1_data_PlayerPlayCard("" + runtime.getCardId() + "_PlayerPlayCard"),new model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Text1("" + runtime.getCardId() + "_Text1")];
	}
	,getCLID: function() {
		return model_ver1_data_CardProto_$179001_$01A_$CH_$WT007R_$white.__clid;
	}
	,__class__: model_ver1_data_CardProto_$179001_$01A_$CH_$WT007R_$white
});
var model_ver1_game_define_CardText = function(id,description) {
	this.__uid = hxbit_Serializer.SEQ << 24 | ++hxbit_Serializer.UID;
	this.isSurroundedByArrows = false;
	this.type = model_ver1_game_define_TextType.Use;
	this.id = id;
	this.description = description;
};
$hxClasses["model.ver1.game.define.CardText"] = model_ver1_game_define_CardText;
model_ver1_game_define_CardText.__name__ = "model.ver1.game.define.CardText";
model_ver1_game_define_CardText.__interfaces__ = [hxbit_Serializable];
model_ver1_game_define_CardText.prototype = {
	getSubKey: function(v) {
		return "" + this.id + "_" + v;
	}
	,getEffect: function(ctx,runtime) {
		return [];
	}
	,getRequires: function(ctx,runtime) {
		return [];
	}
	,getRequires2: function(ctx,runtime) {
		return [];
	}
	,action: function(ctx,runtime) {
	}
	,onEvent: function(ctx,event,runtime) {
	}
	,getCLID: function() {
		return model_ver1_game_define_CardText.__clid;
	}
	,serialize: function(__ctx) {
		var s = this.id;
		if(s == null) {
			__ctx.out.addByte(0);
		} else {
			var b = haxe_io_Bytes.ofString(s);
			var v = b.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			__ctx.out.add(b);
		}
		var s = this.description;
		if(s == null) {
			__ctx.out.addByte(0);
		} else {
			var b = haxe_io_Bytes.ofString(s);
			var v = b.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			__ctx.out.add(b);
		}
		hxbit_enumSer_Model_$ver1_$game_$define_$TextType.doSerialize(__ctx,this.type);
		__ctx.out.addByte(this.isSurroundedByArrows ? 1 : 0);
	}
	,getSerializeSchema: function() {
		var schema = new hxbit_Schema();
		schema.fieldsNames.push("id");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PString);
		schema.fieldsNames.push("description");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PString);
		schema.fieldsNames.push("type");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PEnum("model.ver1.game.define.TextType"));
		schema.fieldsNames.push("isSurroundedByArrows");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PBool);
		schema.isFinal = hxbit_Serializer.isClassFinal(model_ver1_game_define_CardText.__clid);
		return schema;
	}
	,unserializeInit: function() {
		this.type = model_ver1_game_define_TextType.Use;
		this.isSurroundedByArrows = false;
	}
	,unserialize: function(__ctx) {
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			--len;
			var s = __ctx.input.getString(__ctx.inPos,len);
			__ctx.inPos += len;
			tmp = s;
		}
		this.id = tmp;
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			--len;
			var s = __ctx.input.getString(__ctx.inPos,len);
			__ctx.inPos += len;
			tmp = s;
		}
		this.description = tmp;
		var __e = hxbit_enumSer_Model_$ver1_$game_$define_$TextType.doUnserialize(__ctx);
		this.type = __e;
		this.isSurroundedByArrows = __ctx.input.b[__ctx.inPos++] != 0;
	}
	,__class__: model_ver1_game_define_CardText
};
var model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Text1 = function(id) {
	model_ver1_game_define_CardText.call(this,id,"（戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。");
	this.type = model_ver1_game_define_TextType.Use;
};
$hxClasses["model.ver1.data._CardProto_179001_01A_CH_WT007R_white.Text1"] = model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Text1;
model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Text1.__name__ = "model.ver1.data._CardProto_179001_01A_CH_WT007R_white.Text1";
model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Text1.__super__ = model_ver1_game_define_CardText;
model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Text1.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	getRequires: function(ctx,runtime) {
		var unit;
		var _g = model_ver1_game_alg_Context_getUnitOfSetGroup(ctx,runtime.getCardId());
		if(_g._hx_index == 0) {
			var cardId = _g.v;
			unit = cardId;
		} else {
			unit = "unknown";
		}
		return [new model_ver1_data_RequirePhase("" + this.id + "_req1",model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.None,model_ver1_game_define_TimingKeyword.Free1)),new model_ver1_data_RequireGTap("" + this.id + "_req2",[model_ver1_game_define_GColor.Red,model_ver1_game_define_GColor.Red],ctx,runtime),new model_ver1_data_ForceTargetCard("" + this.id + "_req3","このセットグループのユニット","このセットグループのユニット",unit)];
	}
	,action: function(ctx,runtime) {
		var selectUnits = model_ver1_game_alg_Context_getPlayerSelectionCardId(ctx,"このセットグループのユニット");
		var _g = 0;
		while(_g < selectUnits.length) {
			var unit = selectUnits[_g];
			++_g;
			var mark = new model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Mark1("" + this.id + "_Mark1",unit);
			ctx.marks.h[mark.id] = mark;
		}
	}
	,getCLID: function() {
		return model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Text1.__clid;
	}
	,__class__: model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Text1
});
var model_ver1_game_define_Mark = function(id) {
	this.__uid = hxbit_Serializer.SEQ << 24 | ++hxbit_Serializer.UID;
	this.id = id;
};
$hxClasses["model.ver1.game.define.Mark"] = model_ver1_game_define_Mark;
model_ver1_game_define_Mark.__name__ = "model.ver1.game.define.Mark";
model_ver1_game_define_Mark.__interfaces__ = [hxbit_Serializable];
model_ver1_game_define_Mark.prototype = {
	getEffect: function(ctx) {
		return [];
	}
	,onEvent: function(ctx,event) {
		if(this.age != null) {
			if(event._hx_index == 0) {
				var _g = ctx.timing;
				var _g1 = _g.step;
				if(_g.phase._hx_index == 3) {
					if(_g1._hx_index == 0) {
						if(_g1.v._hx_index == 4) {
							if(_g.timing._hx_index == 4) {
								this.age -= 1;
								if(this.age <= 0) {
									var key = this.id;
									var _this = ctx.marks;
									if(Object.prototype.hasOwnProperty.call(_this.h,key)) {
										delete(_this.h[key]);
									}
								}
							}
						}
					}
				}
			}
		}
	}
	,getCLID: function() {
		return model_ver1_game_define_Mark.__clid;
	}
	,serialize: function(__ctx) {
		var s = this.id;
		if(s == null) {
			__ctx.out.addByte(0);
		} else {
			var b = haxe_io_Bytes.ofString(s);
			var v = b.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			__ctx.out.add(b);
		}
		if(this.age == null) {
			__ctx.out.addByte(0);
		} else {
			__ctx.out.addByte(1);
			var v = this.age;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
		}
	}
	,getSerializeSchema: function() {
		var schema = new hxbit_Schema();
		schema.fieldsNames.push("id");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PString);
		schema.fieldsNames.push("age");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PNull(hxbit_PropTypeDesc.PInt));
		schema.isFinal = hxbit_Serializer.isClassFinal(model_ver1_game_define_Mark.__clid);
		return schema;
	}
	,unserializeInit: function() {
	}
	,unserialize: function(__ctx) {
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			--len;
			var s = __ctx.input.getString(__ctx.inPos,len);
			__ctx.inPos += len;
			tmp = s;
		}
		this.id = tmp;
		if(__ctx.input.b[__ctx.inPos++] == 0) {
			this.age = null;
		} else {
			var v = __ctx.input.b[__ctx.inPos++];
			if(v == 128) {
				v = __ctx.input.getInt32(__ctx.inPos);
				__ctx.inPos += 4;
			}
			this.age = v;
		}
	}
	,__class__: model_ver1_game_define_Mark
};
var model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Mark1 = function(id,attachCardId) {
	model_ver1_game_define_Mark.call(this,id);
	this.attachCardId = attachCardId;
};
$hxClasses["model.ver1.data._CardProto_179001_01A_CH_WT007R_white.Mark1"] = model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Mark1;
model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Mark1.__name__ = "model.ver1.data._CardProto_179001_01A_CH_WT007R_white.Mark1";
model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Mark1.__super__ = model_ver1_game_define_Mark;
model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Mark1.prototype = $extend(model_ver1_game_define_Mark.prototype,{
	getEffect: function(ctx) {
		return [model_ver1_game_define_MarkEffect.AttackSpeed(this.attachCardId,1)];
	}
	,onEvent: function(ctx,event) {
		if(event._hx_index == 0) {
			var _g = ctx.timing;
			var _g1 = _g.step;
			if(_g.phase._hx_index == 3) {
				if(_g1._hx_index == 0) {
					if(_g1.v._hx_index == 4) {
						if(_g.timing._hx_index == 4) {
							var key = this.id;
							var _this = ctx.marks;
							if(Object.prototype.hasOwnProperty.call(_this.h,key)) {
								delete(_this.h[key]);
							}
						}
					}
				}
			}
		}
	}
	,getCLID: function() {
		return model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Mark1.__clid;
	}
	,serialize: function(__ctx) {
		model_ver1_game_define_Mark.prototype.serialize.call(this,__ctx);
		var s = this.attachCardId;
		if(s == null) {
			__ctx.out.addByte(0);
		} else {
			var b = haxe_io_Bytes.ofString(s);
			var v = b.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			__ctx.out.add(b);
		}
	}
	,getSerializeSchema: function() {
		var schema = model_ver1_game_define_Mark.prototype.getSerializeSchema.call(this);
		schema.fieldsNames.push("attachCardId");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PString);
		schema.isFinal = hxbit_Serializer.isClassFinal(model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Mark1.__clid);
		return schema;
	}
	,unserialize: function(__ctx) {
		model_ver1_game_define_Mark.prototype.unserialize.call(this,__ctx);
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			--len;
			var s = __ctx.input.getString(__ctx.inPos,len);
			__ctx.inPos += len;
			tmp = s;
		}
		this.attachCardId = tmp;
	}
	,__class__: model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Mark1
});
function model_ver1_data_CardProto_$179001_$01A_$CH_$WT007R_$white_test() {
	var ctx = new model_ver1_game_define_Context();
	var card1 = new tool_Card("0");
	card1.protoId = "179001_01A_CH_WT007R_white";
	ctx.table.cards.h[card1.id] = card1;
	ctx.timing = model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.Attack),model_ver1_game_define_TimingKeyword.Start);
	var _this = model_ver1_game_alg_Runtime_getRuntimeText(ctx);
	var result = new Array(_this.length);
	var _g = 0;
	var _g1 = _this.length;
	while(_g < _g1) {
		var i = _g++;
		var info = _this[i];
		result[i] = { cardId : info.runtime.getCardId(), text : info.text, reqs : info.text.getRequires(ctx,info.runtime)};
	}
	var infos = result;
	console.log("src/model/ver1/data/CardProto_179001_01A_CH_WT007R_white.hx:102:",infos);
	if(infos.length == 0) {
		throw new haxe_Exception("infos.length == 0");
	}
	var selectTextId = infos[0].text.id;
	var _g = [];
	var _g1 = 0;
	var _g2 = model_ver1_game_alg_Runtime_getRuntimeText(ctx);
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		if(v.text.id == selectTextId) {
			_g.push(v);
		}
	}
	var findText = _g;
	if(findText.length == 0) {
		throw new haxe_Exception("findText not found");
	}
	var text = findText[0].text;
	var runtime = findText[0].runtime;
	var _g = 0;
	var _g1 = text.getRequires(ctx,runtime);
	while(_g < _g1.length) {
		var req = _g1[_g];
		++_g;
		req.action(ctx,runtime);
	}
	text.action(ctx,runtime);
}
var model_ver1_data_CardProto_$179003_$01A_$U_$BK008U_$black = function() {
	model_ver1_game_define_CardProto.call(this);
};
$hxClasses["model.ver1.data.CardProto_179003_01A_U_BK008U_black"] = model_ver1_data_CardProto_$179003_$01A_$U_$BK008U_$black;
model_ver1_data_CardProto_$179003_$01A_$U_$BK008U_$black.__name__ = "model.ver1.data.CardProto_179003_01A_U_BK008U_black";
model_ver1_data_CardProto_$179003_$01A_$U_$BK008U_$black.__super__ = model_ver1_game_define_CardProto;
model_ver1_data_CardProto_$179003_$01A_$U_$BK008U_$black.prototype = $extend(model_ver1_game_define_CardProto.prototype,{
	getTexts: function(ctx,runtime) {
		return [new model_ver1_data_PlayerPlayCard("" + runtime.getCardId() + "_PlayerPlayCard"),new model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text1("" + runtime.getCardId() + "_Text1")];
	}
	,getCLID: function() {
		return model_ver1_data_CardProto_$179003_$01A_$U_$BK008U_$black.__clid;
	}
	,__class__: model_ver1_data_CardProto_$179003_$01A_$U_$BK008U_$black
});
var model_ver1_game_define_Require = function(id,description) {
	this.id = id;
	this.description = description;
};
$hxClasses["model.ver1.game.define.Require"] = model_ver1_game_define_Require;
model_ver1_game_define_Require.__name__ = "model.ver1.game.define.Require";
model_ver1_game_define_Require.prototype = {
	action: function(ctx,runtime) {
	}
	,__class__: model_ver1_game_define_Require
};
var model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_RequireThisCardDestroyByBattleDamage = function(id) {
	model_ver1_game_define_Require.call(this,id,"このカードが戦闘ダメージで破壊されている場合");
};
$hxClasses["model.ver1.data._CardProto_179003_01A_U_BK008U_black.RequireThisCardDestroyByBattleDamage"] = model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_RequireThisCardDestroyByBattleDamage;
model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_RequireThisCardDestroyByBattleDamage.__name__ = "model.ver1.data._CardProto_179003_01A_U_BK008U_black.RequireThisCardDestroyByBattleDamage";
model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_RequireThisCardDestroyByBattleDamage.__super__ = model_ver1_game_define_Require;
model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_RequireThisCardDestroyByBattleDamage.prototype = $extend(model_ver1_game_define_Require.prototype,{
	action: function(ctx,runtime) {
		if(model_ver1_game_alg_Destroy_isDestroyNow(ctx,runtime.getCardId(),{ isByBattleDamage : true}) == false) {
			throw new haxe_Exception("這張卡必須是破壞中的狀態");
		}
	}
	,__class__: model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_RequireThisCardDestroyByBattleDamage
});
var model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text1 = function(id) {
	model_ver1_game_define_CardText.call(this,id,"（ダメージ判定ステップ）〔２〕：このカードが戦闘ダメージで破壊されている場合、このカードを、破壊を無効にした上で自軍Gにする。");
	this.type = model_ver1_game_define_TextType.Use;
};
$hxClasses["model.ver1.data._CardProto_179003_01A_U_BK008U_black.Text1"] = model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text1;
model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text1.__name__ = "model.ver1.data._CardProto_179003_01A_U_BK008U_black.Text1";
model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text1.__super__ = model_ver1_game_define_CardText;
model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text1.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	getRequires: function(ctx,runtime) {
		return [new model_ver1_data_RequirePhase("" + this.id + "_Text1_Req1",model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.DamageChecking),model_ver1_game_define_TimingKeyword.Free1)),new model_ver1_data_RequireGTap("" + this.id + "_Text1_Req2",[model_ver1_game_define_GColor.Black,model_ver1_game_define_GColor.Black],ctx,runtime),new model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_RequireThisCardDestroyByBattleDamage("" + this.id + "_Text1_Req3")];
	}
	,action: function(ctx,runtime) {
		var cardId = runtime.getCardId();
		var block = new model_ver1_game_define_Block("" + this.id + "_" + Std.string(new Date()),model_ver1_game_define_BlockCause.PlayText(cardId,this.id),new model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text2("" + this.id + "_Text2"));
		model_ver1_game_alg_Cut_cutIn(ctx,block);
	}
	,getCLID: function() {
		return model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text1.__clid;
	}
	,__class__: model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text1
});
var model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text2 = function(id) {
	model_ver1_game_define_CardText.call(this,id,"このカードを、破壊を無効にした上で自軍Gにする。");
};
$hxClasses["model.ver1.data._CardProto_179003_01A_U_BK008U_black.Text2"] = model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text2;
model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text2.__name__ = "model.ver1.data._CardProto_179003_01A_U_BK008U_black.Text2";
model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text2.__super__ = model_ver1_game_define_CardText;
model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text2.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	action: function(ctx,runtime) {
		var cardId = runtime.getCardId();
		model_ver1_game_alg_Destroy_removeDestroyEffect(ctx,cardId);
		model_ver1_game_alg_Context_becomeG(ctx,cardId);
	}
	,getCLID: function() {
		return model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text2.__clid;
	}
	,__class__: model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text2
});
function model_ver1_data_CardProto_$179003_$01A_$U_$BK008U_$black_test() {
	var ctx = new model_ver1_game_define_Context();
	var card1 = new tool_Card("0");
	card1.protoId = "179003_01A_U_BK008U_black";
	ctx.table.cards.h[card1.id] = card1;
	ctx.timing = model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.DamageChecking),model_ver1_game_define_TimingKeyword.Start);
	var _this = model_ver1_game_alg_Runtime_getRuntimeText(ctx);
	var result = new Array(_this.length);
	var _g = 0;
	var _g1 = _this.length;
	while(_g < _g1) {
		var i = _g++;
		var info = _this[i];
		result[i] = { cardId : info.runtime.getCardId(), text : info.text, reqs : info.text.getRequires(ctx,info.runtime)};
	}
	var infos = result;
	console.log("src/model/ver1/data/CardProto_179003_01A_U_BK008U_black.hx:94:",infos);
	if(infos.length == 0) {
		throw new haxe_Exception("infos.length == 0");
	}
	var selectTextId = infos[0].text.id;
	var _g = [];
	var _g1 = 0;
	var _g2 = model_ver1_game_alg_Runtime_getRuntimeText(ctx);
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		if(v.text.id == selectTextId) {
			_g.push(v);
		}
	}
	var findText = _g;
	if(findText.length == 0) {
		throw new haxe_Exception("findText not found");
	}
	var text = findText[0].text;
	var runtime = findText[0].runtime;
	var _g = 0;
	var _g1 = text.getRequires(ctx,runtime);
	while(_g < _g1.length) {
		var req = _g1[_g];
		++_g;
		req.action(ctx,runtime);
	}
	text.action(ctx,runtime);
}
var model_ver1_data_CardProto_$179004_$01A_$CH_$WT009R_$white = function() {
	model_ver1_game_define_CardProto.call(this);
};
$hxClasses["model.ver1.data.CardProto_179004_01A_CH_WT009R_white"] = model_ver1_data_CardProto_$179004_$01A_$CH_$WT009R_$white;
model_ver1_data_CardProto_$179004_$01A_$CH_$WT009R_$white.__name__ = "model.ver1.data.CardProto_179004_01A_CH_WT009R_white";
model_ver1_data_CardProto_$179004_$01A_$CH_$WT009R_$white.__super__ = model_ver1_game_define_CardProto;
model_ver1_data_CardProto_$179004_$01A_$CH_$WT009R_$white.prototype = $extend(model_ver1_game_define_CardProto.prototype,{
	getTexts: function(ctx,runtime) {
		return [new model_ver1_data_PlayerPlayCard("" + runtime.getCardId() + "_PlayerPlayCard"),new model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1("" + runtime.getCardId() + "_Text1")];
	}
	,getCLID: function() {
		return model_ver1_data_CardProto_$179004_$01A_$CH_$WT009R_$white.__clid;
	}
	,__class__: model_ver1_data_CardProto_$179004_$01A_$CH_$WT009R_$white
});
var model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1 = function(id) {
	model_ver1_game_define_CardText.call(this,id,"『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。");
	this.type = model_ver1_game_define_TextType.Automatic(model_ver1_game_define_TextTypeAutomaticType.Trigger);
};
$hxClasses["model.ver1.data._CardProto_179004_01A_CH_WT009R_white.Text1"] = model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1;
model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1.__name__ = "model.ver1.data._CardProto_179004_01A_CH_WT009R_white.Text1";
model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1.__super__ = model_ver1_game_define_CardText;
model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	onEvent: function(ctx,event,runtime) {
		var thisCardId = runtime.getCardId();
		if(event._hx_index == 1) {
			var gainCardId = event.cardId;
			var gainValue = event.value;
			if(model_ver1_game_alg_Context_isMyCard(ctx,thisCardId,gainCardId)) {
				var block = new model_ver1_game_define_Block("" + this.id + "_" + Std.string(new Date()),model_ver1_game_define_BlockCause.TextEffect(thisCardId,this.id),new model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1_$1("" + this.id + "_Text1_1",gainCardId,gainValue));
				block.isImmediate = true;
				model_ver1_game_alg_Cut_cutIn(ctx,block);
			}
		}
	}
	,getCLID: function() {
		return model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1.__clid;
	}
	,__class__: model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1
});
var model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1_$1 = function(id,gainCardId,gainValue) {
	model_ver1_game_define_CardText.call(this,id,"そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。");
	this.gainCardId = gainCardId;
	this.gainValue = gainValue;
};
$hxClasses["model.ver1.data._CardProto_179004_01A_CH_WT009R_white.Text1_1"] = model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1_$1;
model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1_$1.__name__ = "model.ver1.data._CardProto_179004_01A_CH_WT009R_white.Text1_1";
model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1_$1.__super__ = model_ver1_game_define_CardText;
model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1_$1.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	getRequires: function(ctx,runtime) {
		var thisCardId = runtime.getCardId();
		var gainCardSetGroupsIds = model_ver1_game_alg_Context_getCardSetGroupCardIds(ctx,this.gainCardId);
		var _g = [];
		var h = ctx.table.cards.h;
		var card_h = h;
		var card_keys = Object.keys(h);
		var card_length = card_keys.length;
		var card_current = 0;
		while(card_current < card_length) {
			var card = card_h[card_keys[card_current++]];
			_g.push(card);
		}
		var _g1 = [];
		var _g2 = 0;
		var _g3 = _g;
		while(_g2 < _g3.length) {
			var v = _g3[_g2];
			++_g2;
			if(gainCardSetGroupsIds.indexOf(v.id) != -1 == false && model_ver1_game_alg_Context_isMyCard(ctx,thisCardId,v.id)) {
				_g1.push(v);
			}
		}
		var _this = _g1;
		var result = new Array(_this.length);
		var _g = 0;
		var _g1 = _this.length;
		while(_g < _g1) {
			var i = _g++;
			result[i] = _this[i].id;
		}
		var tips = result;
		var req = new model_ver1_data_RequireUserSelectCard(this.getSubKey(0),"そのカードのセットグループ以外の自軍ユニット１枚は");
		req.tips = tips;
		return [req];
	}
	,action: function(ctx,runtime) {
		var selectUnits = model_ver1_game_alg_Context_getPlayerSelectionCardId(ctx,this.getSubKey(0));
		var _g = 0;
		while(_g < selectUnits.length) {
			var unit = selectUnits[_g];
			++_g;
			var mark = new model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Mark1("" + this.id + "_Mark1",this.gainCardId,model_ver1_game_define_BattlePoint.Default(this.gainValue,this.gainValue,this.gainValue));
			ctx.marks.h[mark.id] = mark;
		}
	}
	,getCLID: function() {
		return model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1_$1.__clid;
	}
	,serialize: function(__ctx) {
		model_ver1_game_define_CardText.prototype.serialize.call(this,__ctx);
		var s = this.gainCardId;
		if(s == null) {
			__ctx.out.addByte(0);
		} else {
			var b = haxe_io_Bytes.ofString(s);
			var v = b.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			__ctx.out.add(b);
		}
		var v = this.gainValue;
		if(v >= 0 && v < 128) {
			__ctx.out.addByte(v);
		} else {
			__ctx.out.addByte(128);
			__ctx.out.addInt32(v);
		}
	}
	,getSerializeSchema: function() {
		var schema = model_ver1_game_define_CardText.prototype.getSerializeSchema.call(this);
		schema.fieldsNames.push("gainCardId");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PString);
		schema.fieldsNames.push("gainValue");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PInt);
		schema.isFinal = hxbit_Serializer.isClassFinal(model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1_$1.__clid);
		return schema;
	}
	,unserialize: function(__ctx) {
		model_ver1_game_define_CardText.prototype.unserialize.call(this,__ctx);
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			--len;
			var s = __ctx.input.getString(__ctx.inPos,len);
			__ctx.inPos += len;
			tmp = s;
		}
		this.gainCardId = tmp;
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		this.gainValue = v;
	}
	,__class__: model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1_$1
});
var model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Mark1 = function(id,attachCardId,battlePoint) {
	model_ver1_game_define_Mark.call(this,id);
	this.attachCardId = attachCardId;
	this.battlePoint = battlePoint;
};
$hxClasses["model.ver1.data._CardProto_179004_01A_CH_WT009R_white.Mark1"] = model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Mark1;
model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Mark1.__name__ = "model.ver1.data._CardProto_179004_01A_CH_WT009R_white.Mark1";
model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Mark1.__super__ = model_ver1_game_define_Mark;
model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Mark1.prototype = $extend(model_ver1_game_define_Mark.prototype,{
	getEffect: function(ctx) {
		return [model_ver1_game_define_MarkEffect.AddBattlePoint(this.attachCardId,this.battlePoint)];
	}
	,onEvent: function(ctx,event) {
		if(event._hx_index == 0) {
			var _g = ctx.timing;
			var _g1 = _g.step;
			if(_g.phase._hx_index == 3) {
				if(_g1._hx_index == 0) {
					if(_g1.v._hx_index == 4) {
						if(_g.timing._hx_index == 4) {
							var key = this.id;
							var _this = ctx.marks;
							if(Object.prototype.hasOwnProperty.call(_this.h,key)) {
								delete(_this.h[key]);
							}
						}
					}
				}
			}
		}
	}
	,getCLID: function() {
		return model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Mark1.__clid;
	}
	,serialize: function(__ctx) {
		model_ver1_game_define_Mark.prototype.serialize.call(this,__ctx);
		var s = this.attachCardId;
		if(s == null) {
			__ctx.out.addByte(0);
		} else {
			var b = haxe_io_Bytes.ofString(s);
			var v = b.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			__ctx.out.add(b);
		}
		hxbit_enumSer_Model_$ver1_$game_$define_$BattlePoint.doSerialize(__ctx,this.battlePoint);
	}
	,getSerializeSchema: function() {
		var schema = model_ver1_game_define_Mark.prototype.getSerializeSchema.call(this);
		schema.fieldsNames.push("attachCardId");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PString);
		schema.fieldsNames.push("battlePoint");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PEnum("model.ver1.game.define.BattlePoint"));
		schema.isFinal = hxbit_Serializer.isClassFinal(model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Mark1.__clid);
		return schema;
	}
	,unserialize: function(__ctx) {
		model_ver1_game_define_Mark.prototype.unserialize.call(this,__ctx);
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			--len;
			var s = __ctx.input.getString(__ctx.inPos,len);
			__ctx.inPos += len;
			tmp = s;
		}
		this.attachCardId = tmp;
		var __e = hxbit_enumSer_Model_$ver1_$game_$define_$BattlePoint.doUnserialize(__ctx);
		this.battlePoint = __e;
	}
	,__class__: model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Mark1
});
var model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown = function() {
	model_ver1_game_define_CardProto.call(this);
	this.category = model_ver1_game_define_CardCategory.Character;
};
$hxClasses["model.ver1.data.CardProto_179030_11E_CH_BN091N_brown"] = model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown;
model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown.__name__ = "model.ver1.data.CardProto_179030_11E_CH_BN091N_brown";
model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown.__super__ = model_ver1_game_define_CardProto;
model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown.prototype = $extend(model_ver1_game_define_CardProto.prototype,{
	getTexts: function(ctx,runtime) {
		return [new model_ver1_data_PlayerPlayCard("" + runtime.getCardId() + "_PlayerPlayCard"),new model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Text1("" + runtime.getCardId() + "_Text1")];
	}
	,getCLID: function() {
		return model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown.__clid;
	}
	,__class__: model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown
});
var model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Text1 = function(id) {
	model_ver1_game_define_CardText.call(this,id,"『起動』：このカードがロールした場合、敵軍G１枚をロールする。その場合、このセットグループは、このターンと次のターン、リロールできない。");
	this.type = model_ver1_game_define_TextType.Automatic(model_ver1_game_define_TextTypeAutomaticType.Trigger);
};
$hxClasses["model.ver1.data._CardProto_179030_11E_CH_BN091N_brown.Text1"] = model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Text1;
model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Text1.__name__ = "model.ver1.data._CardProto_179030_11E_CH_BN091N_brown.Text1";
model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Text1.__super__ = model_ver1_game_define_CardText;
model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Text1.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	onEvent: function(ctx,event,runtime) {
		var thisCardId = runtime.getCardId();
		var responsePlayerId = runtime.getResponsePlayerId();
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(responsePlayerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + responsePlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = responsePlayerId;
		var opponentPlayerId = this1 == model_ver1_game_define_PlayerId.A ? model_ver1_game_define_PlayerId.B : model_ver1_game_define_PlayerId.A;
		if(event._hx_index == 3) {
			var rollCardId = event.cardId;
			if(rollCardId == thisCardId) {
				if(model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown_getOpponentG(ctx,runtime).length >= 1) {
					var block = new model_ver1_game_define_Block(this.getSubKey(0),model_ver1_game_define_BlockCause.TextEffect(thisCardId,this.id),new model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Process1("" + this.id + "_Process1"));
					block.isImmediate = true;
					model_ver1_game_alg_Cut_cutIn(ctx,block);
				}
			}
		}
	}
	,getCLID: function() {
		return model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Text1.__clid;
	}
	,__class__: model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Text1
});
var model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Process1 = function(id) {
	model_ver1_game_define_CardText.call(this,id,"敵軍G１枚をロールする。その場合、このセットグループは、このターンと次のターン、リロールできない。");
};
$hxClasses["model.ver1.data._CardProto_179030_11E_CH_BN091N_brown.Process1"] = model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Process1;
model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Process1.__name__ = "model.ver1.data._CardProto_179030_11E_CH_BN091N_brown.Process1";
model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Process1.__super__ = model_ver1_game_define_CardText;
model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Process1.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	getRequires2: function(ctx,runtime) {
		var _gthis = this;
		var _this = model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown_getOpponentG(ctx,runtime);
		var result = new Array(_this.length);
		var _g = 0;
		var _g1 = _this.length;
		while(_g < _g1) {
			var i = _g++;
			result[i] = { value : _this[i], weight : 0.0};
		}
		var tips = result;
		return [{ id : this.getSubKey(0), description : "敵軍G１枚をロールする。", type : model_ver1_game_define_RequireType.SelectCard(tips,[1]), action : function() {
			var selectUnits = model_ver1_game_alg_Context_getPlayerSelectionCardId(ctx,_gthis.getSubKey(0));
			var _g = 0;
			while(_g < selectUnits.length) {
				var unit = selectUnits[_g];
				++_g;
				model_ver1_game_alg_Context_tapCard(ctx,unit);
			}
		}}];
	}
	,action: function(ctx,runtime) {
		var thisCardId = runtime.getCardId();
		var _g = 0;
		var _g1 = model_ver1_game_alg_Context_getThisCardSetGroupCardIds(ctx,thisCardId);
		while(_g < _g1.length) {
			var cardId = _g1[_g];
			++_g;
			var markId = "" + this.id + "_" + cardId;
			var mark = new model_ver1_game_define_CanNotRerollMark(markId,cardId);
			mark.age = 2;
			ctx.marks.h[mark.id] = mark;
		}
	}
	,getCLID: function() {
		return model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Process1.__clid;
	}
	,__class__: model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Process1
});
function model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown_getOpponentG(ctx,runtime) {
	var responsePlayerId = runtime.getResponsePlayerId();
	if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(responsePlayerId) != -1 == false) {
		throw haxe_Exception.thrown("playerId (" + responsePlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
	}
	var this1 = responsePlayerId;
	var opponentPlayerId = this1 == model_ver1_game_define_PlayerId.A ? model_ver1_game_define_PlayerId.B : model_ver1_game_define_PlayerId.A;
	var _g = [];
	var h = ctx.table.cards.h;
	var card_h = h;
	var card_keys = Object.keys(h);
	var card_length = card_keys.length;
	var card_current = 0;
	while(card_current < card_length) {
		var card = card_h[card_keys[card_current++]];
		_g.push(card);
	}
	var _this = _g;
	var result = new Array(_this.length);
	var _g = 0;
	var _g1 = _this.length;
	while(_g < _g1) {
		var i = _g++;
		result[i] = _this[i].id;
	}
	var _g = [];
	var _g1 = 0;
	var _g2 = result;
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		var s = model_ver1_game_alg_Context_getCardOwner(ctx,v);
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(s) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + s + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = s;
		if(this1 == opponentPlayerId) {
			_g.push(v);
		}
	}
	var _g1 = [];
	var _g2 = 0;
	var _g3 = _g;
	while(_g2 < _g3.length) {
		var v = _g3[_g2];
		++_g2;
		var _g = model_ver1_game_alg_Context_getCardEntityCategory(ctx,v);
		if(_g._hx_index == 0 && _g.v._hx_index == 3) {
			_g1.push(v);
		}
	}
	return _g1;
}
function model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown_test() {
	var player1 = model_ver1_game_define_PlayerId.A;
	var player2 = model_ver1_game_define_PlayerId.B;
	var ctx = new model_ver1_game_define_Context();
	var baSyou = model_ver1_game_define_BaSyou.Default(player2,model_ver1_game_define_BaSyouKeyword.TeHuTa);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	var player2Hand = new tool_CardStack(this1);
	ctx.table.cardStacks.h[player2Hand.id] = player2Hand;
	console.log("src/model/ver1/data/CardProto_179030_11E_CH_BN091N_brown.hx:122:","卡牌1在場");
	var card = new tool_Card("1");
	card.owner = player1;
	card.protoId = "179030_11E_CH_BN091N_brown";
	var baSyou = model_ver1_game_define_BaSyou.Default(player1,model_ver1_game_define_BaSyouKeyword.MaintenanceArea);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	tool_Table_addCard(ctx.table,this1,card);
	console.log("src/model/ver1/data/CardProto_179030_11E_CH_BN091N_brown.hx:127:","敵軍G在場");
	var card2 = new tool_Card("2");
	card2.owner = player2;
	card2.protoId = "179030_11E_CH_BN091N_brown";
	card2.isTap = false;
	var baSyou = model_ver1_game_define_BaSyou.Default(player2,model_ver1_game_define_BaSyouKeyword.GZone);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	tool_Table_addCard(ctx.table,this1,card2);
	if(model_ver1_game_alg_Cut_getTopCut(ctx).length != 0) {
		throw haxe_Exception.thrown("一開始堆疊中沒有效果");
	}
	console.log("src/model/ver1/data/CardProto_179030_11E_CH_BN091N_brown.hx:137:","卡牌横置");
	model_ver1_game_alg_Context_sendEvent(ctx,model_ver1_game_define_Event.CardRoll(card.id));
	if(model_ver1_game_alg_Cut_getTopCut(ctx).length != 1) {
		throw haxe_Exception.thrown("堆疊中必須有一個效果");
	}
	var block = model_ver1_game_alg_Cut_getTopCut(ctx)[0];
	var runtime = new model_ver1_game_define_DefaultExecuteRuntime(card.id,player1);
	var requires = block.text.getRequires2(ctx,runtime);
	if(requires.length != 1) {
		throw haxe_Exception.thrown("requires.length != 1");
	}
	var $require = requires[0];
	var tips;
	var _g = $require.type;
	if(_g._hx_index == 1) {
		var tips1 = _g.tips;
		var lengthInclude = _g.lengthInclude;
		tips = tips1;
	} else {
		throw haxe_Exception.thrown("must be SelectCard");
	}
	if(tips.length != 1) {
		throw haxe_Exception.thrown("必須有一個可選G");
	}
	console.log("src/model/ver1/data/CardProto_179030_11E_CH_BN091N_brown.hx:158:","選擇");
	model_ver1_game_alg_Context_setPlayerSelectionCardId(ctx,$require.id,[tips[0].value]);
	console.log("src/model/ver1/data/CardProto_179030_11E_CH_BN091N_brown.hx:160:","驗証支付");
	$require.action();
	if(card2.isTap != true) {
		throw haxe_Exception.thrown("牌必須被横置");
	}
	console.log("src/model/ver1/data/CardProto_179030_11E_CH_BN091N_brown.hx:165:","解決效果");
	block.text.action(ctx,runtime);
	var _g = [];
	var h = ctx.marks.h;
	var mark_h = h;
	var mark_keys = Object.keys(h);
	var mark_length = mark_keys.length;
	var mark_current = 0;
	while(mark_current < mark_length) {
		var mark = mark_h[mark_keys[mark_current++]];
		_g.push(mark);
	}
	if(_g.length != 1) {
		throw haxe_Exception.thrown("必須有不能重置效果");
	}
	console.log("src/model/ver1/data/CardProto_179030_11E_CH_BN091N_brown.hx:170:","結束一個turn");
	ctx.timing = model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.End),model_ver1_game_define_TimingKeyword.End);
	model_ver1_game_alg_Context_sendEvent(ctx,model_ver1_game_define_Event.ChangePhase);
	var _g = [];
	var h = ctx.marks.h;
	var mark_h = h;
	var mark_keys = Object.keys(h);
	var mark_length = mark_keys.length;
	var mark_current = 0;
	while(mark_current < mark_length) {
		var mark = mark_h[mark_keys[mark_current++]];
		_g.push(mark);
	}
	if(_g.length != 1) {
		throw haxe_Exception.thrown("必須有不能重置效果");
	}
	console.log("src/model/ver1/data/CardProto_179030_11E_CH_BN091N_brown.hx:176:","再結束一個turn");
	model_ver1_game_alg_Context_sendEvent(ctx,model_ver1_game_define_Event.ChangePhase);
	var _g = [];
	var h = ctx.marks.h;
	var mark_h = h;
	var mark_keys = Object.keys(h);
	var mark_length = mark_keys.length;
	var mark_current = 0;
	while(mark_current < mark_length) {
		var mark = mark_h[mark_keys[mark_current++]];
		_g.push(mark);
	}
	if(_g.length != 0) {
		throw haxe_Exception.thrown("不能重置效果必須被移除");
	}
}
var model_ver1_data_CardProto_$179030_$11E_$U_$VT186R_$purple = function() {
	model_ver1_game_define_CardProto.call(this);
	this.category = model_ver1_game_define_CardCategory.Unit;
};
$hxClasses["model.ver1.data.CardProto_179030_11E_U_VT186R_purple"] = model_ver1_data_CardProto_$179030_$11E_$U_$VT186R_$purple;
model_ver1_data_CardProto_$179030_$11E_$U_$VT186R_$purple.__name__ = "model.ver1.data.CardProto_179030_11E_U_VT186R_purple";
model_ver1_data_CardProto_$179030_$11E_$U_$VT186R_$purple.__super__ = model_ver1_game_define_CardProto;
model_ver1_data_CardProto_$179030_$11E_$U_$VT186R_$purple.prototype = $extend(model_ver1_game_define_CardProto.prototype,{
	getTexts: function(ctx,runtime) {
		return [new model_ver1_data_PlayerPlayCard("CardProto_179030_11E_U_VT186R_purple_1"),new model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Text1("CardProto_179030_11E_U_VT186R_purple_2")];
	}
	,getCLID: function() {
		return model_ver1_data_CardProto_$179030_$11E_$U_$VT186R_$purple.__clid;
	}
	,__class__: model_ver1_data_CardProto_$179030_$11E_$U_$VT186R_$purple
});
var model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Text1 = function(id) {
	model_ver1_game_define_CardText.call(this,id,"『起動』：このカードが場に出た場合、このターン中に場に出た敵軍ユニット１枚を、持ち主の手札に移す。");
	this.type = model_ver1_game_define_TextType.Automatic(model_ver1_game_define_TextTypeAutomaticType.Trigger);
};
$hxClasses["model.ver1.data._CardProto_179030_11E_U_VT186R_purple.Text1"] = model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Text1;
model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Text1.__name__ = "model.ver1.data._CardProto_179030_11E_U_VT186R_purple.Text1";
model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Text1.__super__ = model_ver1_game_define_CardText;
model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Text1.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	onEvent: function(ctx,event,runtime) {
		var thisCardId = runtime.getCardId();
		if(event._hx_index == 2) {
			var enterFieldCardId = event.cardId;
			if(enterFieldCardId == thisCardId) {
				var block = new model_ver1_game_define_Block(this.getSubKey(0),model_ver1_game_define_BlockCause.TextEffect(thisCardId,this.id),new model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Process1("" + this.id + "_Process1"));
				block.isImmediate = true;
				model_ver1_game_alg_Cut_cutIn(ctx,block);
			}
		}
	}
	,getCLID: function() {
		return model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Text1.__clid;
	}
	,__class__: model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Text1
});
var model_ver1_data_RequireUserSelect = function(id,description) {
	this.responsePlayerId = model_ver1_game_define_RelativePlayer.You;
	this.lengthInclude = [1];
	this.tips = [];
	model_ver1_game_define_Require.call(this,id,description);
};
$hxClasses["model.ver1.data.RequireUserSelect"] = model_ver1_data_RequireUserSelect;
model_ver1_data_RequireUserSelect.__name__ = "model.ver1.data.RequireUserSelect";
model_ver1_data_RequireUserSelect.__super__ = model_ver1_game_define_Require;
model_ver1_data_RequireUserSelect.prototype = $extend(model_ver1_game_define_Require.prototype,{
	__class__: model_ver1_data_RequireUserSelect
});
var model_ver1_data_RequireUserSelectCard = function(id,description) {
	model_ver1_data_RequireUserSelect.call(this,id,description);
};
$hxClasses["model.ver1.data.RequireUserSelectCard"] = model_ver1_data_RequireUserSelectCard;
model_ver1_data_RequireUserSelectCard.__name__ = "model.ver1.data.RequireUserSelectCard";
model_ver1_data_RequireUserSelectCard.__super__ = model_ver1_data_RequireUserSelect;
model_ver1_data_RequireUserSelectCard.prototype = $extend(model_ver1_data_RequireUserSelect.prototype,{
	action: function(ctx,runtime) {
		var selection = model_ver1_game_alg_Context_getPlayerSelectionCardId(ctx,this.id);
		if(this.lengthInclude.indexOf(selection.length) != -1 == false) {
			throw haxe_Exception.thrown("select card length not right");
		}
	}
	,__class__: model_ver1_data_RequireUserSelectCard
});
var model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_RequireOpponentUnitsEnterFieldThisTurn = function(id,ctx,runtime) {
	model_ver1_data_RequireUserSelectCard.call(this,id,"このターン中に場に出た敵軍ユニット１枚を");
	var thisCardId = runtime.getCardId();
	var _g = [];
	var _g1 = 0;
	var _g2 = model_ver1_game_alg_Context_getEnterFieldThisTurnCardIds(ctx);
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		var _g3 = model_ver1_game_alg_Context_getCardEntityCategory(ctx,v);
		if(_g3._hx_index == 0 && _g3.v._hx_index == 0) {
			_g.push(v);
		}
	}
	var _g1 = [];
	var _g2 = 0;
	var _g3 = _g;
	while(_g2 < _g3.length) {
		var v = _g3[_g2];
		++_g2;
		if(model_ver1_game_alg_Context_isOpponentsCard(ctx,thisCardId,v)) {
			_g1.push(v);
		}
	}
	var unitsEnterFieldThisTurn = _g1;
	this.tips = unitsEnterFieldThisTurn;
};
$hxClasses["model.ver1.data._CardProto_179030_11E_U_VT186R_purple.RequireOpponentUnitsEnterFieldThisTurn"] = model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_RequireOpponentUnitsEnterFieldThisTurn;
model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_RequireOpponentUnitsEnterFieldThisTurn.__name__ = "model.ver1.data._CardProto_179030_11E_U_VT186R_purple.RequireOpponentUnitsEnterFieldThisTurn";
model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_RequireOpponentUnitsEnterFieldThisTurn.__super__ = model_ver1_data_RequireUserSelectCard;
model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_RequireOpponentUnitsEnterFieldThisTurn.prototype = $extend(model_ver1_data_RequireUserSelectCard.prototype,{
	__class__: model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_RequireOpponentUnitsEnterFieldThisTurn
});
var model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Process1 = function(id) {
	model_ver1_game_define_CardText.call(this,id,"このターン中に場に出た敵軍ユニット１枚を、持ち主の手札に移す。");
};
$hxClasses["model.ver1.data._CardProto_179030_11E_U_VT186R_purple.Process1"] = model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Process1;
model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Process1.__name__ = "model.ver1.data._CardProto_179030_11E_U_VT186R_purple.Process1";
model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Process1.__super__ = model_ver1_game_define_CardText;
model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Process1.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	getRequires: function(ctx,runtime) {
		return [new model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_RequireOpponentUnitsEnterFieldThisTurn(this.getSubKey(0),ctx,runtime)];
	}
	,getRequires2: function(ctx,runtime) {
		return [model_ver1_data_RequireImpl_getRequireOpponentUnitsEnterFieldThisTurn(ctx,runtime,this.getSubKey(0))];
	}
	,action: function(ctx,runtime) {
		var cardId = runtime.getCardId();
		var selectCardIds = model_ver1_game_alg_Context_getPlayerSelectionCardId(ctx,this.getSubKey(0));
		var _g = 0;
		while(_g < selectCardIds.length) {
			var cardId = selectCardIds[_g];
			++_g;
			model_ver1_game_alg_Context_returnToOwnerHand(ctx,cardId);
		}
	}
	,getCLID: function() {
		return model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Process1.__clid;
	}
	,__class__: model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Process1
});
function model_ver1_data_CardProto_$179030_$11E_$U_$VT186R_$purple_test() {
	var player1 = model_ver1_game_define_PlayerId.A;
	var player2 = model_ver1_game_define_PlayerId.B;
	var ctx = new model_ver1_game_define_Context();
	var baSyou = model_ver1_game_define_BaSyou.Default(player2,model_ver1_game_define_BaSyouKeyword.TeHuTa);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	var player2Hand = new tool_CardStack(this1);
	ctx.table.cardStacks.h[player2Hand.id] = player2Hand;
	console.log("src/model/ver1/data/CardProto_179030_11E_U_VT186R_purple.hx:106:","機體1在場");
	var card = new tool_Card("1");
	card.owner = player1;
	card.protoId = "179030_11E_U_VT186R_purple";
	var baSyou = model_ver1_game_define_BaSyou.Default(player1,model_ver1_game_define_BaSyouKeyword.MaintenanceArea);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	tool_Table_addCard(ctx.table,this1,card);
	console.log("src/model/ver1/data/CardProto_179030_11E_U_VT186R_purple.hx:111:","機體2這回合剛出場");
	var card2 = new tool_Card("2");
	card2.owner = player2;
	card2.protoId = "179030_11E_U_VT186R_purple";
	var baSyou = model_ver1_game_define_BaSyou.Default(player2,model_ver1_game_define_BaSyouKeyword.MaintenanceArea);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	tool_Table_addCard(ctx.table,this1,card2);
	console.log("src/model/ver1/data/CardProto_179030_11E_U_VT186R_purple.hx:116:","設置剛出場標記");
	var enterFieldMark = new model_ver1_game_define_EnterFieldThisTurnMark("EnterFieldThisTurnMark",card2.id);
	ctx.marks.h[enterFieldMark.id] = enterFieldMark;
	if(model_ver1_game_alg_Cut_getTopCut(ctx).length != 0) {
		throw haxe_Exception.thrown("一開始堆疊中沒有效果");
	}
	console.log("src/model/ver1/data/CardProto_179030_11E_U_VT186R_purple.hx:123:","機體1出場事件");
	model_ver1_game_alg_Context_sendEvent(ctx,model_ver1_game_define_Event.CardEnterField(card.id));
	if(model_ver1_game_alg_Cut_getTopCut(ctx).length != 1) {
		throw haxe_Exception.thrown("堆疊中必須有一個效果");
	}
	var block = model_ver1_game_alg_Cut_getTopCut(ctx)[0];
	var runtime = new model_ver1_game_define_DefaultExecuteRuntime(card.id,player1);
	var requires = block.text.getRequires2(ctx,runtime);
	if(requires.length != 1) {
		throw haxe_Exception.thrown("requires.length != 1");
	}
	var $require = requires[0];
	var tips;
	var _g = $require.type;
	if(_g._hx_index == 1) {
		var tips1 = _g.tips;
		var lengthInclude = _g.lengthInclude;
		tips = tips1;
	} else {
		throw haxe_Exception.thrown("must be SelectCard");
	}
	if(tips.length != 1) {
		throw haxe_Exception.thrown("必須有一個可選機體");
	}
	console.log("src/model/ver1/data/CardProto_179030_11E_U_VT186R_purple.hx:144:","選擇要回手的一個敵機");
	model_ver1_game_alg_Context_setPlayerSelectionCardId(ctx,$require.id,[tips[0].value]);
	console.log("src/model/ver1/data/CardProto_179030_11E_U_VT186R_purple.hx:146:","驗証支付");
	$require.action();
	console.log("src/model/ver1/data/CardProto_179030_11E_U_VT186R_purple.hx:148:","解決效果");
	block.text.action(ctx,runtime);
	if(player2Hand.cardIds.length != 1) {
		throw haxe_Exception.thrown("牌被移到手上");
	}
}
var model_ver1_data_PlayerPlayCard = function(id) {
	model_ver1_game_define_CardText.call(this,id,"カードのプレイ");
	this.type = model_ver1_game_define_TextType.Automatic(model_ver1_game_define_TextTypeAutomaticType.Constant);
};
$hxClasses["model.ver1.data.PlayerPlayCard"] = model_ver1_data_PlayerPlayCard;
model_ver1_data_PlayerPlayCard.__name__ = "model.ver1.data.PlayerPlayCard";
model_ver1_data_PlayerPlayCard.__super__ = model_ver1_game_define_CardText;
model_ver1_data_PlayerPlayCard.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	getRequires: function(ctx,runtime) {
		var cardId = runtime.getCardId();
		switch(model_ver1_game_alg_Context_getCardType(ctx,cardId)._hx_index) {
		case 2:
			break;
		case 1:case 4:
			break;
		default:
		}
		return [new model_ver1_data_RequirePhase("" + this.id + "_RequirePhase",model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Maintenance,haxe_ds_Option.None,model_ver1_game_define_TimingKeyword.Free1)),new model_ver1_data_RequireGCount("" + this.id + "_RequireGCount",3),new model_ver1_data_RequireGTap("" + this.id + "_RequireGTap",[model_ver1_game_define_GColor.Black,model_ver1_game_define_GColor.Black],ctx,runtime)];
	}
	,action: function(ctx,runtime) {
		var cardId = runtime.getCardId();
		var responsePlayerId = runtime.getResponsePlayerId();
		var from = model_ver1_game_alg_Context_getCardBaSyouAndAssertExist(ctx,cardId);
		switch(model_ver1_game_alg_Context_getCardType(ctx,cardId)._hx_index) {
		case 0:case 1:case 3:case 4:
			var to = model_ver1_game_define_BaSyou.Default(responsePlayerId,model_ver1_game_define_BaSyouKeyword.PlayedCard);
			model_ver1_game_alg_Context_moveCard(ctx,cardId,from,to);
			ctx.table.cards.h[cardId].isFaceUp = true;
			break;
		default:
		}
		switch(model_ver1_game_alg_Context_getCardType(ctx,cardId)._hx_index) {
		case 2:
			break;
		case 0:case 1:case 3:case 4:
			var block = new model_ver1_game_define_Block("" + this.id + "_" + Std.string(new Date()),model_ver1_game_define_BlockCause.PlayCard(responsePlayerId,cardId),new model_ver1_data__$PlayerPlayCard_EnterFieldEffect("" + this.id + "_PlayerPlayCardEffect"));
			model_ver1_game_alg_Cut_cutIn(ctx,block);
			break;
		case 5:
			var to = model_ver1_game_define_BaSyou.Default(responsePlayerId,model_ver1_game_define_BaSyouKeyword.GZone);
			model_ver1_game_alg_Context_moveCard(ctx,cardId,from,to);
			break;
		default:
			throw new haxe_Exception("unsupport type");
		}
	}
	,getCLID: function() {
		return model_ver1_data_PlayerPlayCard.__clid;
	}
	,__class__: model_ver1_data_PlayerPlayCard
});
var model_ver1_data__$PlayerPlayCard_EnterFieldEffect = function(id) {
	model_ver1_game_define_CardText.call(this,id,"場に出る効果");
};
$hxClasses["model.ver1.data._PlayerPlayCard.EnterFieldEffect"] = model_ver1_data__$PlayerPlayCard_EnterFieldEffect;
model_ver1_data__$PlayerPlayCard_EnterFieldEffect.__name__ = "model.ver1.data._PlayerPlayCard.EnterFieldEffect";
model_ver1_data__$PlayerPlayCard_EnterFieldEffect.__super__ = model_ver1_game_define_CardText;
model_ver1_data__$PlayerPlayCard_EnterFieldEffect.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	action: function(ctx,runtime) {
		var cardId = runtime.getCardId();
		var responsePlayerId = runtime.getResponsePlayerId();
		var from = model_ver1_game_alg_Context_getCardBaSyouAndAssertExist(ctx,cardId);
		switch(model_ver1_game_alg_Context_getCardType(ctx,cardId)._hx_index) {
		case 0:
			var to = model_ver1_game_define_BaSyou.Default(responsePlayerId,model_ver1_game_define_BaSyouKeyword.MaintenanceArea);
			model_ver1_game_alg_Context_moveCard(ctx,cardId,from,to);
			ctx.table.cards.h[cardId].isTap = true;
			var enterFieldMark = new model_ver1_game_define_EnterFieldThisTurnMark("" + this.id + "_EnterFieldMark",cardId);
			ctx.marks.h[enterFieldMark.id] = enterFieldMark;
			model_ver1_game_alg_Context_sendEvent(ctx,model_ver1_game_define_Event.CardEnterField(cardId));
			break;
		case 1:
			break;
		case 2:
			break;
		case 3:
			var to = model_ver1_game_define_BaSyou.Default(responsePlayerId,model_ver1_game_define_BaSyouKeyword.MaintenanceArea);
			model_ver1_game_alg_Context_moveCard(ctx,cardId,from,to);
			ctx.table.cards.h[cardId].isTap = false;
			model_ver1_game_alg_Context_sendEvent(ctx,model_ver1_game_define_Event.CardEnterField(cardId));
			break;
		case 4:
			break;
		default:
			throw new haxe_Exception("unsupport type");
		}
	}
	,getCLID: function() {
		return model_ver1_data__$PlayerPlayCard_EnterFieldEffect.__clid;
	}
	,__class__: model_ver1_data__$PlayerPlayCard_EnterFieldEffect
});
var model_ver1_data_PlayerPlayG = function(id) {
	model_ver1_game_define_CardText.call(this,id,"Gのプレイ");
};
$hxClasses["model.ver1.data.PlayerPlayG"] = model_ver1_data_PlayerPlayG;
model_ver1_data_PlayerPlayG.__name__ = "model.ver1.data.PlayerPlayG";
model_ver1_data_PlayerPlayG.__super__ = model_ver1_game_define_CardText;
model_ver1_data_PlayerPlayG.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	getRequires: function(ctx,runtime) {
		return [];
	}
	,action: function(ctx,runtime) {
		var cardId = runtime.getCardId();
		var responsePlayerId = runtime.getResponsePlayerId();
		var from = model_ver1_game_alg_Context_getCardBaSyouAndAssertExist(ctx,cardId);
		var to = model_ver1_game_define_BaSyou.Default(responsePlayerId,model_ver1_game_define_BaSyouKeyword.GZone);
		ctx.table.cards.h[cardId].isReverse = true;
		model_ver1_game_alg_Context_moveCard(ctx,cardId,from,to);
	}
	,getCLID: function() {
		return model_ver1_data_PlayerPlayG.__clid;
	}
	,__class__: model_ver1_data_PlayerPlayG
});
var model_ver1_data_RequirePhase = function(id,timing) {
	model_ver1_game_define_Require.call(this,id,"RequirePhase");
	this.timing = timing;
};
$hxClasses["model.ver1.data.RequirePhase"] = model_ver1_data_RequirePhase;
model_ver1_data_RequirePhase.__name__ = "model.ver1.data.RequirePhase";
model_ver1_data_RequirePhase.__super__ = model_ver1_game_define_Require;
model_ver1_data_RequirePhase.prototype = $extend(model_ver1_game_define_Require.prototype,{
	action: function(ctx,runtime) {
		if(Type.enumEq(ctx.timing,this.timing) == false) {
			throw new haxe_Exception("ctx.phase != this.phase: " + Std.string(ctx.timing) + " != " + Std.string(this.timing));
		}
	}
	,__class__: model_ver1_data_RequirePhase
});
var model_ver1_data_RequireGTap = function(id,colors,ctx,runtime) {
	model_ver1_data_RequireUserSelectCard.call(this,id,"RequireGTap");
	var responsePlayerId = runtime.getResponsePlayerId();
	var gCardIds = model_ver1_game_alg_Context_getPlayerGCardIds(ctx,responsePlayerId);
	var _g = [];
	var _g1 = 0;
	var _g2 = gCardIds;
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		var _g3 = model_ver1_game_alg_Context_getCardGSign(ctx,v);
		var _g4 = _g3.property;
		var color = _g3.color;
		var cardColor = color;
		if(colors.indexOf(cardColor) != -1) {
			_g.push(v);
		}
	}
	var tips = _g;
	this.tips = tips;
	this.lengthInclude = [2];
};
$hxClasses["model.ver1.data.RequireGTap"] = model_ver1_data_RequireGTap;
model_ver1_data_RequireGTap.__name__ = "model.ver1.data.RequireGTap";
model_ver1_data_RequireGTap.__super__ = model_ver1_data_RequireUserSelectCard;
model_ver1_data_RequireGTap.prototype = $extend(model_ver1_data_RequireUserSelectCard.prototype,{
	action: function(ctx,runtime) {
		var selectIds = ctx.memory.playerSelection.cardIds.h[this.id];
		if(selectIds == null) {
			throw new haxe_Exception("selectIds not found");
		}
		var _g = 0;
		while(_g < selectIds.length) {
			var cardId = selectIds[_g];
			++_g;
			model_ver1_game_alg_Context_tapCard(ctx,cardId);
		}
	}
	,__class__: model_ver1_data_RequireGTap
});
var model_ver1_data_ForceTargetCard = function(id,description,selectKey,cardId) {
	model_ver1_game_define_Require.call(this,id,description);
	this.selectKey = selectKey;
	this.cardId = cardId;
};
$hxClasses["model.ver1.data.ForceTargetCard"] = model_ver1_data_ForceTargetCard;
model_ver1_data_ForceTargetCard.__name__ = "model.ver1.data.ForceTargetCard";
model_ver1_data_ForceTargetCard.__super__ = model_ver1_game_define_Require;
model_ver1_data_ForceTargetCard.prototype = $extend(model_ver1_game_define_Require.prototype,{
	action: function(ctx,runtime) {
		var selectCard = ctx.table.cards.h[this.cardId];
		if(selectCard == null) {
			throw new haxe_Exception("指定的卡不存在: " + this.cardId);
		}
		var v = [this.cardId];
		ctx.memory.playerSelection.cardIds.h[this.selectKey] = v;
	}
	,__class__: model_ver1_data_ForceTargetCard
});
var model_ver1_data_RequireGCount = function(id,count) {
	model_ver1_game_define_Require.call(this,id,"RequireGCount");
	this.count = count;
};
$hxClasses["model.ver1.data.RequireGCount"] = model_ver1_data_RequireGCount;
model_ver1_data_RequireGCount.__name__ = "model.ver1.data.RequireGCount";
model_ver1_data_RequireGCount.__super__ = model_ver1_game_define_Require;
model_ver1_data_RequireGCount.prototype = $extend(model_ver1_game_define_Require.prototype,{
	action: function(ctx,runtime) {
		var responsePlayerId = runtime.getResponsePlayerId();
		var gCount = model_ver1_game_alg_Context_getPlayerGCountForPlay(ctx,responsePlayerId);
		if(gCount < this.count) {
			throw new haxe_Exception("g count not enougth: " + gCount + " < " + this.count);
		}
	}
	,__class__: model_ver1_data_RequireGCount
});
var model_ver1_data_RequireUserSelectBattlePoint = function(id,description) {
	model_ver1_data_RequireUserSelect.call(this,id,description);
};
$hxClasses["model.ver1.data.RequireUserSelectBattlePoint"] = model_ver1_data_RequireUserSelectBattlePoint;
model_ver1_data_RequireUserSelectBattlePoint.__name__ = "model.ver1.data.RequireUserSelectBattlePoint";
model_ver1_data_RequireUserSelectBattlePoint.__super__ = model_ver1_data_RequireUserSelect;
model_ver1_data_RequireUserSelectBattlePoint.prototype = $extend(model_ver1_data_RequireUserSelect.prototype,{
	__class__: model_ver1_data_RequireUserSelectBattlePoint
});
function model_ver1_data_RequireImpl_getRequirePhase(ctx,runtime,timing,id) {
	return { id : id, description : "RequirePhase", type : model_ver1_game_define_RequireType.Pending, action : function() {
		if(Type.enumEq(ctx.timing,timing) == false) {
			throw new haxe_Exception("ctx.phase != this.phase: " + Std.string(ctx.timing) + " != " + Std.string(timing));
		}
	}};
}
function model_ver1_data_RequireImpl_getRequireGTap(ctx,runtime,colors,id) {
	var responsePlayerId = runtime.getResponsePlayerId();
	var gCardIds = model_ver1_game_alg_Context_getPlayerGCardIds(ctx,responsePlayerId);
	var _g = [];
	var _g1 = 0;
	var _g2 = gCardIds;
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		var _g3 = model_ver1_game_alg_Context_getCardGSign(ctx,v);
		var _g4 = _g3.property;
		var color = _g3.color;
		var cardColor = color;
		if(colors.indexOf(cardColor) != -1) {
			_g.push(v);
		}
	}
	var _this = _g;
	var result = new Array(_this.length);
	var _g = 0;
	var _g1 = _this.length;
	while(_g < _g1) {
		var i = _g++;
		result[i] = { value : _this[i], weight : 0.0};
	}
	var tips = result;
	return { id : id, description : "RequireGTap", type : model_ver1_game_define_RequireType.SelectCard(tips,[2]), action : function() {
		var selectIds = ctx.memory.playerSelection.cardIds.h[id];
		if(selectIds == null) {
			throw new haxe_Exception("selectIds not found");
		}
		var _g = 0;
		while(_g < selectIds.length) {
			var cardId = selectIds[_g];
			++_g;
			model_ver1_game_alg_Context_tapCard(ctx,cardId);
		}
	}};
}
function model_ver1_data_RequireImpl_getRequireOpponentUnitsEnterFieldThisTurn(ctx,runtime,id) {
	var thisCardId = runtime.getCardId();
	var _g = [];
	var _g1 = 0;
	var _g2 = model_ver1_game_alg_Context_getEnterFieldThisTurnCardIds(ctx);
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		if(model_ver1_game_alg_Context_isOpponentsCard(ctx,thisCardId,v)) {
			_g.push(v);
		}
	}
	var _g1 = [];
	var _g2 = 0;
	var _g3 = _g;
	while(_g2 < _g3.length) {
		var v = _g3[_g2];
		++_g2;
		var _g = model_ver1_game_alg_Context_getCardEntityCategory(ctx,v);
		if(_g._hx_index == 0 && _g.v._hx_index == 0) {
			_g1.push(v);
		}
	}
	var unitsEnterFieldThisTurn = _g1;
	var result = new Array(unitsEnterFieldThisTurn.length);
	var _g = 0;
	var _g1 = unitsEnterFieldThisTurn.length;
	while(_g < _g1) {
		var i = _g++;
		result[i] = { value : unitsEnterFieldThisTurn[i], weight : 0.0};
	}
	var tips = result;
	return { id : id, description : "このターン中に場に出た敵軍ユニット１枚を", type : model_ver1_game_define_RequireType.SelectCard(tips,[1]), action : function() {
	}};
}
var model_ver1_game_Game = function() {
	this.__uid = hxbit_Serializer.SEQ << 24 | ++hxbit_Serializer.UID;
	this.ctx = new model_ver1_game_define_Context();
};
$hxClasses["model.ver1.game.Game"] = model_ver1_game_Game;
model_ver1_game_Game.__name__ = "model.ver1.game.Game";
model_ver1_game_Game.__interfaces__ = [hxbit_Serializable];
model_ver1_game_Game.ofMemonto = function(memonto) {
	return tool_Helper_ofMemonto(memonto,model_ver1_game_Game);
};
model_ver1_game_Game.prototype = {
	getMemonto: function() {
		return tool_Helper_getMemonto(this);
	}
	,getCLID: function() {
		return model_ver1_game_Game.__clid;
	}
	,serialize: function(__ctx) {
		__ctx.addKnownRef(this.ctx);
	}
	,getSerializeSchema: function() {
		var schema = new hxbit_Schema();
		schema.fieldsNames.push("ctx");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PSerializable("model.ver1.game.define.Context"));
		schema.isFinal = hxbit_Serializer.isClassFinal(model_ver1_game_Game.__clid);
		return schema;
	}
	,unserializeInit: function() {
		this.ctx = new model_ver1_game_define_Context();
	}
	,unserialize: function(__ctx) {
		this.ctx = __ctx.getRef(model_ver1_game_define_Context,model_ver1_game_define_Context.__clid);
	}
	,__class__: model_ver1_game_Game
};
function model_ver1_game_Game_test() {
	var game = new model_ver1_game_Game();
	var card1 = new tool_Card("0");
	card1.protoId = "179003_01A_U_BK008U_black";
	var card2 = new tool_Card("1");
	card2.protoId = "179003_01A_U_BK008U_black";
	game.ctx.table.cards.h[card1.id] = card1;
	game.ctx.table.cards.h[card2.id] = card2;
	var loadGame = model_ver1_game_Game.ofMemonto(game.getMemonto());
	if(loadGame.ctx.table.cards.h[card1.id].id != card1.id) {
		throw new haxe_Exception("loadGame.ctx.table.cards[card1.id].id != card1.id");
	}
	if(loadGame.ctx.table.cards.h[card2.id].id != card2.id) {
		throw new haxe_Exception("loadGame.ctx.table.cards[card2.id].id != card2.id");
	}
}
function model_ver1_game_alg_Block_getBlocks(ctx) {
	return Lambda.fold(ctx.cuts,function(c,a) {
		return a.concat(c);
	},[]);
}
function model_ver1_game_alg_Block_getBlock(ctx,blockId) {
	var blocks = model_ver1_game_alg_Block_getBlocks(ctx);
	var _g = [];
	var _g1 = 0;
	var _g2 = blocks;
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		if(v.id == blockId) {
			_g.push(v);
		}
	}
	var findBlock = _g;
	if(findBlock.length == 0) {
		throw new haxe_Exception("block not found");
	}
	return findBlock[0];
}
function model_ver1_game_alg_Block_getBlockRuntime(ctx,blockId) {
	var block = model_ver1_game_alg_Block_getBlock(ctx,blockId);
	var _g = block.cause;
	switch(_g._hx_index) {
	case 1:
		var respnosePlayerId = _g.respnosePlayerId;
		return new model_ver1_game_define_SystemExecuteRuntime(respnosePlayerId);
	case 2:
		var playCardPlayerId = _g.playerId;
		var cardId = _g.cardId;
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(playCardPlayerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + playCardPlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = playCardPlayerId;
		return new model_ver1_game_define_DefaultExecuteRuntime(cardId,this1);
	case 3:
		var cardId = _g.cardId;
		var textId = _g.textId;
		var responsePlayerId = model_ver1_game_alg_Context_getCardControllerAndAssertExist(ctx,cardId);
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(responsePlayerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + responsePlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = responsePlayerId;
		return new model_ver1_game_define_DefaultExecuteRuntime(cardId,this1);
	case 4:
		var cardId = _g.cardId;
		var textId = _g.textId;
		var responsePlayerId = model_ver1_game_alg_Context_getCardControllerAndAssertExist(ctx,cardId);
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(responsePlayerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + responsePlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = responsePlayerId;
		return new model_ver1_game_define_DefaultExecuteRuntime(cardId,this1);
	default:
		return new model_ver1_game_define_AbstractExecuteRuntime();
	}
}
function model_ver1_game_alg_Block_removeBlock(ctx,blockId) {
	var block = model_ver1_game_alg_Block_getBlock(ctx,blockId);
	var _g = 0;
	var _g1 = ctx.cuts;
	while(_g < _g1.length) {
		var cut = _g1[_g];
		++_g;
		HxOverrides.remove(cut,block);
	}
}
function model_ver1_game_alg_CardProto_registerCardProto(ctx,key,proto) {
	ctx.cardProtoPool.h[key] = proto;
}
function model_ver1_game_alg_CardProto_getCurrentCardProto(ctx,key) {
	var obj = ctx.cardProtoPool.h[key];
	if(obj == null) {
		return model_ver1_game_data_DataBinding_getCardProto(key);
	}
	return obj;
}
function model_ver1_game_alg_Context_returnToOwnerHand(ctx,cardId) {
	var from = model_ver1_game_alg_Context_getCardBaSyouAndAssertExist(ctx,cardId);
	var to = model_ver1_game_define_BaSyou.Default(model_ver1_game_alg_Context_getCardOwner(ctx,cardId),model_ver1_game_define_BaSyouKeyword.TeHuTa);
	model_ver1_game_alg_Context_moveCard(ctx,cardId,from,to);
}
function model_ver1_game_alg_Context_getCardOwner(ctx,cardId) {
	var owner = tool_Table_getCard(ctx.table,cardId).owner;
	if(owner == null) {
		throw haxe_Exception.thrown("owner not set yet");
	}
	return owner;
}
function model_ver1_game_alg_Context_becomeG(ctx,cardId) {
	console.log("src/model/ver1/game/alg/Context.hx:35:","將自己變成G");
}
function model_ver1_game_alg_Context_getUnitOfSetGroup(ctx,cardId) {
	return haxe_ds_Option.None;
}
function model_ver1_game_alg_Context_tapCard(ctx,cardId) {
	var card = tool_Table_getCard(ctx.table,cardId);
	if(card.isTap) {
		throw new haxe_Exception("already tap");
	}
	card.isTap = true;
	model_ver1_game_alg_Context_sendEvent(ctx,model_ver1_game_define_Event.CardRoll(card.id));
}
function model_ver1_game_alg_Context_moveCard(ctx,cardId,from,to) {
	var playerId = from.playerId;
	var baSyouKeyword = from.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	var playerId = to.playerId;
	var baSyouKeyword = to.baSyouKeyword;
	var this2 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	tool_Table_moveCard(ctx.table,cardId,this1,this2);
}
function model_ver1_game_alg_Context_sendEvent(ctx,evt) {
	var _g = 0;
	var _g1 = model_ver1_game_alg_Runtime_getRuntimeText(ctx);
	while(_g < _g1.length) {
		var info = _g1[_g];
		++_g;
		var runtime = info.runtime;
		var text = info.text;
		text.onEvent(ctx,evt,runtime);
	}
	var h = ctx.marks.h;
	var mark_h = h;
	var mark_keys = Object.keys(h);
	var mark_length = mark_keys.length;
	var mark_current = 0;
	while(mark_current < mark_length) {
		var mark = mark_h[mark_keys[mark_current++]];
		mark.onEvent(ctx,evt);
	}
}
function model_ver1_game_alg_Context_getCardType(ctx,cardId) {
	var proto = model_ver1_game_alg_CardProto_getCurrentCardProto(ctx,tool_Table_getCard(ctx.table,cardId).protoId);
	return proto.category;
}
function model_ver1_game_alg_Context_getCardEntityCategory(ctx,cardId) {
	var _g = model_ver1_game_alg_Context_getCardBaSyouAndAssertExist(ctx,cardId);
	var _g1 = _g.playerId;
	var _g1 = _g.baSyouKeyword;
	if(_g1._hx_index == 5) {
		return haxe_ds_Option.Some(model_ver1_game_define_CardEntityCategory.G);
	} else {
		var kw = _g1;
		if(model_ver1_game_define_BaSyou_isBa(kw)) {
			switch(model_ver1_game_alg_Context_getCardType(ctx,cardId)._hx_index) {
			case 0:
				return haxe_ds_Option.Some(model_ver1_game_define_CardEntityCategory.Unit);
			case 1:
				return haxe_ds_Option.Some(model_ver1_game_define_CardEntityCategory.Character);
			case 3:case 4:
				return haxe_ds_Option.Some(model_ver1_game_define_CardEntityCategory.Operation);
			default:
				throw haxe_Exception.thrown("不知到為什麼在這裡:" + Std.string(kw) + ":" + cardId);
			}
		} else {
			return haxe_ds_Option.None;
		}
	}
}
function model_ver1_game_alg_Context_getThisCardSetGroupCardIds(ctx,cardId) {
	return [cardId];
}
function model_ver1_game_alg_Context_getPlayerSelectionCardId(ctx,key) {
	var selection = ctx.memory.playerSelection.cardIds.h[key];
	if(selection == null) {
		throw new haxe_Exception("selection not found");
	}
	return selection;
}
function model_ver1_game_alg_Context_setPlayerSelectionCardId(ctx,key,values) {
	ctx.memory.playerSelection.cardIds.h[key] = values;
}
function model_ver1_game_alg_Context_getCardController(ctx,cardId) {
	var _g = model_ver1_game_alg_Context_getCardBaSyouAndAssertExist(ctx,cardId);
	if(_g._hx_index == 0) {
		var playerId = _g.playerId;
		var baSyouKeyword = _g.baSyouKeyword;
		if(model_ver1_game_define_BaSyou_isBa(baSyouKeyword)) {
			return haxe_ds_Option.Some(playerId);
		} else {
			return haxe_ds_Option.None;
		}
	} else {
		return haxe_ds_Option.None;
	}
}
function model_ver1_game_alg_Context_getCardControllerAndAssertExist(ctx,cardId) {
	var _g = model_ver1_game_alg_Context_getCardController(ctx,cardId);
	if(_g._hx_index == 0) {
		var playerId = _g.v;
		return playerId;
	} else {
		throw new haxe_Exception("卡片被除外，沒有控制者");
	}
}
function model_ver1_game_alg_Context_getBaSyouController(ctx,baSyou) {
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	return haxe_ds_Option.Some(playerId);
}
function model_ver1_game_alg_Context_getBaSyouControllerAndAssertExist(ctx,baSyou) {
	var _g = model_ver1_game_alg_Context_getBaSyouController(ctx,baSyou);
	if(_g._hx_index == 0) {
		var playerId = _g.v;
		return playerId;
	} else {
		throw new haxe_Exception("沒有控制者");
	}
}
function model_ver1_game_alg_Context_getCardBaSyouAndAssertExist(ctx,cardId) {
	var _g = tool_Table_getCardCardStack(ctx.table,cardId);
	if(_g._hx_index == 0) {
		var cardStack = _g.v;
		var this1 = cardStack.id;
		var ret = this1;
		model_ver1_game_define_BaSyouId.toBaSyou(ret);
		return model_ver1_game_define_BaSyouId.toBaSyou(ret);
	} else {
		console.log("src/model/ver1/game/alg/Context.hx:162:",ctx);
		throw new haxe_Exception("card baSyou not found: " + cardId);
	}
}
function model_ver1_game_alg_Context_getCardGSign(ctx,cardId) {
	return model_ver1_game_define_GSign.Default(model_ver1_game_define_GColor.Red,model_ver1_game_define_GProperty.Uc);
}
function model_ver1_game_alg_Context_getPlayerGCountForPlay(ctx,playerId) {
	return 0;
}
function model_ver1_game_alg_Context_getPlayerGCardIds(ctx,playerId) {
	return [];
}
function model_ver1_game_alg_Context_getCardSetGroupCardIds(ctx,cardId) {
	return [];
}
function model_ver1_game_alg_Context_isMyCard(ctx,masterCardId,slaveCardId) {
	var _g = model_ver1_game_alg_Context_getCardController(ctx,masterCardId);
	var _g1 = model_ver1_game_alg_Context_getCardController(ctx,slaveCardId);
	if(_g._hx_index == 0) {
		if(_g1._hx_index == 0) {
			var c2 = _g1.v;
			var c1 = _g.v;
			if(c1 == c2) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
}
function model_ver1_game_alg_Context_isOpponentsCard(ctx,masterCardId,slaveCardId) {
	var _g = model_ver1_game_alg_Context_getCardController(ctx,masterCardId);
	var _g1 = model_ver1_game_alg_Context_getCardController(ctx,slaveCardId);
	if(_g._hx_index == 0) {
		if(_g1._hx_index == 0) {
			var c2 = _g1.v;
			var c1 = _g.v;
			if(c1 != c2) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
}
function model_ver1_game_alg_Context_getEnterFieldThisTurnCardIds(ctx) {
	var _g = [];
	var _g1 = 0;
	var _g2 = model_ver1_game_alg_Runtime_getMarkEffects(ctx);
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		var tmp;
		if(v._hx_index == 3) {
			var _g3 = v.cardId;
			tmp = true;
		} else {
			tmp = false;
		}
		if(tmp) {
			_g.push(v);
		}
	}
	var _this = _g;
	var result = new Array(_this.length);
	var _g = 0;
	var _g1 = _this.length;
	while(_g < _g1) {
		var i = _g++;
		var e = _this[i];
		var tmp;
		if(e._hx_index == 3) {
			var cardId = e.cardId;
			tmp = cardId;
		} else {
			throw haxe_Exception.thrown("should not go here");
		}
		result[i] = tmp;
	}
	return result;
}
function model_ver1_game_alg_Context_getAddBattlePoint(ctx) {
	var _g = [];
	var _g1 = 0;
	var _g2 = model_ver1_game_alg_Runtime_getRuntimeText(ctx);
	while(_g1 < _g2.length) {
		var info = _g2[_g1];
		++_g1;
		var runtime = info.runtime;
		var text = info.text;
		var effects = text.getEffect(ctx,runtime);
		var _g3 = 0;
		while(_g3 < effects.length) {
			var effect = effects[_g3];
			++_g3;
			var tmp;
			if(effect._hx_index == 0) {
				var cardId = effect.cardId;
				var battlePoint = effect.battlePoint;
				tmp = { cardId : cardId, battlePoint : battlePoint};
			} else {
				tmp = null;
			}
			_g.push(tmp);
		}
	}
	var infos = _g;
}
function model_ver1_game_alg_Context_getAttackSpeed(ctx) {
	var _g = [];
	var _g1 = 0;
	var _g2 = model_ver1_game_alg_Runtime_getRuntimeText(ctx);
	while(_g1 < _g2.length) {
		var info = _g2[_g1];
		++_g1;
		var runtime = info.runtime;
		var text = info.text;
		var effects = text.getEffect(ctx,runtime);
		var _g3 = 0;
		while(_g3 < effects.length) {
			var effect = effects[_g3];
			++_g3;
			var tmp;
			if(effect._hx_index == 1) {
				var cardId = effect.cardId;
				var speed = effect.speed;
				tmp = { cardId : cardId, speed : speed};
			} else {
				tmp = null;
			}
			_g.push(tmp);
		}
	}
	var infos = _g;
}
function model_ver1_game_alg_Cut_getTopCut(ctx) {
	if(ctx.cuts.length == 0) {
		ctx.cuts.push([]);
	}
	var topCut = ctx.cuts[ctx.cuts.length - 1];
	return topCut;
}
function model_ver1_game_alg_Cut_cutIn(ctx,block) {
	model_ver1_game_alg_Cut_getTopCut(ctx).push(block);
}
function model_ver1_game_alg_Cut_newCut(ctx,block) {
	ctx.cuts.push([block]);
}
function model_ver1_game_alg_Destroy_isDestroyNow(ctx,cardId,condition) {
	var condition1 = condition.isByBattleDamage;
	return false;
}
function model_ver1_game_alg_Destroy_removeDestroyEffect(ctx,cardId) {
	console.log("src/model/ver1/game/alg/Destroy.hx:14:","移除堆疊中的破壞效果");
}
function model_ver1_game_alg_Runtime_isContantType(text) {
	var _g = text.type;
	if(_g._hx_index == 0) {
		if(_g.type._hx_index == 2) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}
function model_ver1_game_alg_Runtime_getRuntimeText(ctx) {
	var _g = [];
	var h = ctx.table.cardStacks.h;
	var cs_h = h;
	var cs_keys = Object.keys(h);
	var cs_length = cs_keys.length;
	var cs_current = 0;
	while(cs_current < cs_length) {
		var cs = cs_h[cs_keys[cs_current++]];
		_g.push(cs);
	}
	var _g1 = [];
	var _g2 = 0;
	var _g3 = _g;
	while(_g2 < _g3.length) {
		var v = _g3[_g2];
		++_g2;
		var _this;
		var this1 = v.id;
		var ret = this1;
		model_ver1_game_define_BaSyouId.toBaSyou(ret);
		var _g = model_ver1_game_define_BaSyouId.toBaSyou(ret);
		var _g4 = _g.playerId;
		switch(_g.baSyouKeyword._hx_index) {
		case 7:case 8:
			_this = true;
			break;
		default:
			_this = false;
		}
		if(_this) {
			_g1.push(v);
		}
	}
	var _this = _g1;
	var result = new Array(_this.length);
	var _g = 0;
	var _g1 = _this.length;
	while(_g < _g1) {
		var i = _g++;
		result[i] = _this[i].cardIds;
	}
	var _this = Lambda.fold(result,function(c,a) {
		return a.concat(c);
	},[]);
	var result = new Array(_this.length);
	var _g = 0;
	var _g1 = _this.length;
	while(_g < _g1) {
		var i = _g++;
		result[i] = ctx.table.cards.h[_this[i]];
	}
	var cardsInHandAndHanger = result;
	var _g = [];
	var _g1 = 0;
	while(_g1 < cardsInHandAndHanger.length) {
		var card = cardsInHandAndHanger[_g1];
		++_g1;
		var responsePlayerId = model_ver1_game_alg_Context_getBaSyouControllerAndAssertExist(ctx,model_ver1_game_alg_Context_getCardBaSyouAndAssertExist(ctx,card.id));
		var card1 = card.id;
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(responsePlayerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + responsePlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = responsePlayerId;
		var runtime = new model_ver1_game_define_DefaultExecuteRuntime(card1,this1);
		var _g2 = 0;
		var f = model_ver1_game_alg_Runtime_isContantType;
		var _g3 = [];
		var _g4 = 0;
		var _g5 = model_ver1_game_alg_CardProto_getCurrentCardProto(ctx,card.protoId).getTexts(ctx,runtime);
		while(_g4 < _g5.length) {
			var v = _g5[_g4];
			++_g4;
			if(f(v)) {
				_g3.push(v);
			}
		}
		var _g6 = _g3;
		while(_g2 < _g6.length) {
			var text = _g6[_g2];
			++_g2;
			_g.push({ runtime : runtime, text : text});
		}
	}
	var playReturn = _g;
	var _g = [];
	var h = ctx.table.cardStacks.h;
	var cs_h = h;
	var cs_keys = Object.keys(h);
	var cs_length = cs_keys.length;
	var cs_current = 0;
	while(cs_current < cs_length) {
		var cs = cs_h[cs_keys[cs_current++]];
		_g.push(cs);
	}
	var _g1 = [];
	var _g2 = 0;
	var _g3 = _g;
	while(_g2 < _g3.length) {
		var v = _g3[_g2];
		++_g2;
		var this1 = v.id;
		var ret = this1;
		model_ver1_game_define_BaSyouId.toBaSyou(ret);
		var _g = model_ver1_game_define_BaSyouId.toBaSyou(ret);
		var _g4 = _g.playerId;
		if(_g.baSyouKeyword._hx_index == 5) {
			_g1.push(v);
		}
	}
	var _this = _g1;
	var result = new Array(_this.length);
	var _g = 0;
	var _g1 = _this.length;
	while(_g < _g1) {
		var i = _g++;
		result[i] = _this[i].cardIds;
	}
	var _this = Lambda.fold(result,function(c,a) {
		return a.concat(c);
	},[]);
	var result = new Array(_this.length);
	var _g = 0;
	var _g1 = _this.length;
	while(_g < _g1) {
		var i = _g++;
		result[i] = ctx.table.cards.h[_this[i]];
	}
	var cardsInGZone = result;
	var _g = [];
	var _g1 = 0;
	while(_g1 < cardsInGZone.length) {
		var card = cardsInGZone[_g1];
		++_g1;
		var responsePlayerId = model_ver1_game_alg_Context_getBaSyouControllerAndAssertExist(ctx,model_ver1_game_alg_Context_getCardBaSyouAndAssertExist(ctx,card.id));
		var card1 = card.id;
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(responsePlayerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + responsePlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = responsePlayerId;
		var runtime = new model_ver1_game_define_DefaultExecuteRuntime(card1,this1);
		var _g2 = 0;
		var _g3 = [];
		var _g4 = 0;
		var _g5 = model_ver1_game_alg_CardProto_getCurrentCardProto(ctx,card.protoId).getTexts(ctx,runtime);
		while(_g4 < _g5.length) {
			var v = _g5[_g4];
			++_g4;
			if(v.isSurroundedByArrows) {
				_g3.push(v);
			}
		}
		var _g6 = _g3;
		while(_g2 < _g6.length) {
			var text = _g6[_g2];
			++_g2;
			_g.push({ runtime : runtime, text : text});
		}
	}
	var specialReturn = _g;
	var _g = [];
	var h = ctx.table.cardStacks.h;
	var cs_h = h;
	var cs_keys = Object.keys(h);
	var cs_length = cs_keys.length;
	var cs_current = 0;
	while(cs_current < cs_length) {
		var cs = cs_h[cs_keys[cs_current++]];
		_g.push(cs);
	}
	var _g1 = [];
	var _g2 = 0;
	var _g3 = _g;
	while(_g2 < _g3.length) {
		var v = _g3[_g2];
		++_g2;
		var this1 = v.id;
		var ret = this1;
		model_ver1_game_define_BaSyouId.toBaSyou(ret);
		var _g = model_ver1_game_define_BaSyouId.toBaSyou(ret);
		var _g4 = _g.playerId;
		if(_g.baSyouKeyword._hx_index == 6) {
			_g1.push(v);
		}
	}
	var _this = _g1;
	var result = new Array(_this.length);
	var _g = 0;
	var _g1 = _this.length;
	while(_g < _g1) {
		var i = _g++;
		result[i] = _this[i].cardIds;
	}
	var _this = Lambda.fold(result,function(c,a) {
		return a.concat(c);
	},[]);
	var result = new Array(_this.length);
	var _g = 0;
	var _g1 = _this.length;
	while(_g < _g1) {
		var i = _g++;
		result[i] = ctx.table.cards.h[_this[i]];
	}
	var cardsInJunkYard = result;
	var _g = [];
	var _g1 = 0;
	while(_g1 < cardsInJunkYard.length) {
		var card = cardsInJunkYard[_g1];
		++_g1;
		var responsePlayerId = model_ver1_game_alg_Context_getBaSyouControllerAndAssertExist(ctx,model_ver1_game_alg_Context_getCardBaSyouAndAssertExist(ctx,card.id));
		var card1 = card.id;
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(responsePlayerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + responsePlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = responsePlayerId;
		var runtime = new model_ver1_game_define_DefaultExecuteRuntime(card1,this1);
		var _g2 = 0;
		var f = model_ver1_game_alg_Runtime_isContantType;
		var _g3 = [];
		var _g4 = 0;
		var _g5 = model_ver1_game_alg_CardProto_getCurrentCardProto(ctx,card.protoId).getTexts(ctx,runtime);
		while(_g4 < _g5.length) {
			var v = _g5[_g4];
			++_g4;
			if(f(v)) {
				_g3.push(v);
			}
		}
		var _g6 = _g3;
		while(_g2 < _g6.length) {
			var text = _g6[_g2];
			++_g2;
			_g.push({ runtime : runtime, text : text});
		}
	}
	var specialReturn2 = _g;
	var _g = [];
	var h = ctx.table.cardStacks.h;
	var cs_h = h;
	var cs_keys = Object.keys(h);
	var cs_length = cs_keys.length;
	var cs_current = 0;
	while(cs_current < cs_length) {
		var cs = cs_h[cs_keys[cs_current++]];
		_g.push(cs);
	}
	var _g1 = [];
	var _g2 = 0;
	var _g3 = _g;
	while(_g2 < _g3.length) {
		var v = _g3[_g2];
		++_g2;
		var this1 = v.id;
		var ret = this1;
		model_ver1_game_define_BaSyouId.toBaSyou(ret);
		var _g = model_ver1_game_define_BaSyouId.toBaSyou(ret);
		var _g4 = _g.playerId;
		var kw = _g.baSyouKeyword;
		if(model_ver1_game_define_BaSyou_isBa(kw)) {
			_g1.push(v);
		}
	}
	var _this = _g1;
	var result = new Array(_this.length);
	var _g = 0;
	var _g1 = _this.length;
	while(_g < _g1) {
		var i = _g++;
		result[i] = _this[i].cardIds;
	}
	var _this = Lambda.fold(result,function(c,a) {
		return a.concat(c);
	},[]);
	var result = new Array(_this.length);
	var _g = 0;
	var _g1 = _this.length;
	while(_g < _g1) {
		var i = _g++;
		result[i] = ctx.table.cards.h[_this[i]];
	}
	var cardsHasController = result;
	var _g = [];
	var _g1 = 0;
	while(_g1 < cardsHasController.length) {
		var card = cardsHasController[_g1];
		++_g1;
		var responsePlayerId = model_ver1_game_alg_Context_getCardControllerAndAssertExist(ctx,card.id);
		var card1 = card.id;
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(responsePlayerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + responsePlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = responsePlayerId;
		var runtime = new model_ver1_game_define_DefaultExecuteRuntime(card1,this1);
		var _g2 = 0;
		var _g3 = model_ver1_game_alg_CardProto_getCurrentCardProto(ctx,card.protoId).getTexts(ctx,runtime);
		while(_g2 < _g3.length) {
			var text = _g3[_g2];
			++_g2;
			_g.push({ runtime : runtime, text : text});
		}
	}
	var originReturn = _g;
	var _g = [];
	var _g1 = 0;
	while(_g1 < cardsHasController.length) {
		var card = cardsHasController[_g1];
		++_g1;
		var responsePlayerId = model_ver1_game_alg_Context_getCardControllerAndAssertExist(ctx,card.id);
		var card1 = card.id;
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(responsePlayerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + responsePlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = responsePlayerId;
		var runtime = new model_ver1_game_define_DefaultExecuteRuntime(card1,this1);
		var _g2 = 0;
		var _g3 = model_ver1_game_alg_CardProto_getCurrentCardProto(ctx,card.protoId).getTexts(ctx,runtime);
		while(_g2 < _g3.length) {
			var text = _g3[_g2];
			++_g2;
			var _g4 = 0;
			var _g5 = text.getEffect(ctx,runtime);
			while(_g4 < _g5.length) {
				var effect = _g5[_g4];
				++_g4;
				_g.push(effect);
			}
		}
	}
	var originMarkEffects = _g;
	var _g = [];
	var _g1 = 0;
	var _g2 = originMarkEffects;
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		var tmp;
		if(v._hx_index == 2) {
			var _g3 = v.cardId;
			var _g4 = v.text;
			tmp = true;
		} else {
			tmp = false;
		}
		if(tmp) {
			_g.push(v);
		}
	}
	var attachTextEffect = _g;
	var result = new Array(attachTextEffect.length);
	var _g = 0;
	var _g1 = attachTextEffect.length;
	while(_g < _g1) {
		var i = _g++;
		var effect = attachTextEffect[i];
		var info;
		if(effect._hx_index == 2) {
			var cardId = effect.cardId;
			var text = effect.text;
			info = { cardId : cardId, text : text};
		} else {
			throw new haxe_Exception("addedReturn xxx");
		}
		var responsePlayerId = model_ver1_game_alg_Context_getCardControllerAndAssertExist(ctx,info.cardId);
		var info1 = info.cardId;
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(responsePlayerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + responsePlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = responsePlayerId;
		var runtime = new model_ver1_game_define_DefaultExecuteRuntime(info1,this1);
		result[i] = { runtime : runtime, text : info.text};
	}
	var addedReturn = result;
	var _g = [];
	var h = ctx.marks.h;
	var mark_h = h;
	var mark_keys = Object.keys(h);
	var mark_length = mark_keys.length;
	var mark_current = 0;
	while(mark_current < mark_length) {
		var mark = mark_h[mark_keys[mark_current++]];
		var _g1 = 0;
		var _g2 = mark.getEffect(ctx);
		while(_g1 < _g2.length) {
			var effect = _g2[_g1];
			++_g1;
			_g.push(effect);
		}
	}
	var globalMarkEffects = _g;
	var _g = [];
	var _g1 = 0;
	var _g2 = globalMarkEffects;
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		var tmp;
		if(v._hx_index == 2) {
			var _g3 = v.cardId;
			var _g4 = v.text;
			tmp = true;
		} else {
			tmp = false;
		}
		if(tmp) {
			_g.push(v);
		}
	}
	var globalAttachTextEffect = _g;
	var result = new Array(globalAttachTextEffect.length);
	var _g = 0;
	var _g1 = globalAttachTextEffect.length;
	while(_g < _g1) {
		var i = _g++;
		var effect = globalAttachTextEffect[i];
		var info;
		if(effect._hx_index == 2) {
			var cardId = effect.cardId;
			var text = effect.text;
			info = { cardId : cardId, text : text};
		} else {
			throw new haxe_Exception("globalAddedReturn xxx");
		}
		var responsePlayerId = model_ver1_game_alg_Context_getCardControllerAndAssertExist(ctx,info.cardId);
		var info1 = info.cardId;
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(responsePlayerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + responsePlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = responsePlayerId;
		var runtime = new model_ver1_game_define_DefaultExecuteRuntime(info1,this1);
		result[i] = { runtime : runtime, text : info.text};
	}
	var globalAddedReturn = result;
	return playReturn.concat(specialReturn).concat(specialReturn2).concat(originReturn).concat(addedReturn).concat(globalAddedReturn);
}
function model_ver1_game_alg_Runtime_getMarkEffects(ctx) {
	var _g = [];
	var _g1 = 0;
	var _g2 = model_ver1_game_alg_Runtime_getRuntimeText(ctx);
	while(_g1 < _g2.length) {
		var info = _g2[_g1];
		++_g1;
		var runtime = info.runtime;
		var text = info.text;
		var effects = text.getEffect(ctx,runtime);
		var _g3 = 0;
		while(_g3 < effects.length) {
			var effect = effects[_g3];
			++_g3;
			_g.push(effect);
		}
	}
	var textEffects = _g;
	var _g = [];
	var h = ctx.marks.h;
	var mark_h = h;
	var mark_keys = Object.keys(h);
	var mark_length = mark_keys.length;
	var mark_current = 0;
	while(mark_current < mark_length) {
		var mark = mark_h[mark_keys[mark_current++]];
		var effects = mark.getEffect(ctx);
		var _g1 = 0;
		while(_g1 < effects.length) {
			var effect = effects[_g1];
			++_g1;
			_g.push(effect);
		}
	}
	var _g1 = [];
	var _g2 = 0;
	var _g3 = _g;
	while(_g2 < _g3.length) {
		var v = _g3[_g2];
		++_g2;
		var tmp;
		if(v._hx_index == 2) {
			var _g = v.cardId;
			var _g4 = v.text;
			tmp = false;
		} else {
			tmp = true;
		}
		if(tmp) {
			_g1.push(v);
		}
	}
	var markEffects = _g1;
	return textEffects.concat(markEffects);
}
var model_ver1_game_define_CardCategory = $hxEnums["model.ver1.game.define.CardCategory"] = { __ename__:true,__constructs__:null
	,Unit: {_hx_name:"Unit",_hx_index:0,__enum__:"model.ver1.game.define.CardCategory",toString:$estr}
	,Character: {_hx_name:"Character",_hx_index:1,__enum__:"model.ver1.game.define.CardCategory",toString:$estr}
	,Command: {_hx_name:"Command",_hx_index:2,__enum__:"model.ver1.game.define.CardCategory",toString:$estr}
	,Operation: {_hx_name:"Operation",_hx_index:3,__enum__:"model.ver1.game.define.CardCategory",toString:$estr}
	,OperationUnit: {_hx_name:"OperationUnit",_hx_index:4,__enum__:"model.ver1.game.define.CardCategory",toString:$estr}
	,Graphic: {_hx_name:"Graphic",_hx_index:5,__enum__:"model.ver1.game.define.CardCategory",toString:$estr}
	,Ace: {_hx_name:"Ace",_hx_index:6,__enum__:"model.ver1.game.define.CardCategory",toString:$estr}
};
model_ver1_game_define_CardCategory.__constructs__ = [model_ver1_game_define_CardCategory.Unit,model_ver1_game_define_CardCategory.Character,model_ver1_game_define_CardCategory.Command,model_ver1_game_define_CardCategory.Operation,model_ver1_game_define_CardCategory.OperationUnit,model_ver1_game_define_CardCategory.Graphic,model_ver1_game_define_CardCategory.Ace];
function model_ver1_game_data_DataBinding_getCardProto(key) {
	var obj = model_ver1_game_data_DataBinding__cardProtoPool.h[key];
	if(obj == null) {
		throw new haxe_Exception("" + key + " not found");
	}
	return obj;
}
var model_ver1_game_define_BaSyouKeyword = $hxEnums["model.ver1.game.define.BaSyouKeyword"] = { __ename__:true,__constructs__:null
	,HonGoku: {_hx_name:"HonGoku",_hx_index:0,__enum__:"model.ver1.game.define.BaSyouKeyword",toString:$estr}
	,SuteYama: {_hx_name:"SuteYama",_hx_index:1,__enum__:"model.ver1.game.define.BaSyouKeyword",toString:$estr}
	,SpaceArea: {_hx_name:"SpaceArea",_hx_index:2,__enum__:"model.ver1.game.define.BaSyouKeyword",toString:$estr}
	,EarchArea: {_hx_name:"EarchArea",_hx_index:3,__enum__:"model.ver1.game.define.BaSyouKeyword",toString:$estr}
	,MaintenanceArea: {_hx_name:"MaintenanceArea",_hx_index:4,__enum__:"model.ver1.game.define.BaSyouKeyword",toString:$estr}
	,GZone: {_hx_name:"GZone",_hx_index:5,__enum__:"model.ver1.game.define.BaSyouKeyword",toString:$estr}
	,JunkYard: {_hx_name:"JunkYard",_hx_index:6,__enum__:"model.ver1.game.define.BaSyouKeyword",toString:$estr}
	,TeHuTa: {_hx_name:"TeHuTa",_hx_index:7,__enum__:"model.ver1.game.define.BaSyouKeyword",toString:$estr}
	,Hanger: {_hx_name:"Hanger",_hx_index:8,__enum__:"model.ver1.game.define.BaSyouKeyword",toString:$estr}
	,PlayedCard: {_hx_name:"PlayedCard",_hx_index:9,__enum__:"model.ver1.game.define.BaSyouKeyword",toString:$estr}
	,RemovedCard: {_hx_name:"RemovedCard",_hx_index:10,__enum__:"model.ver1.game.define.BaSyouKeyword",toString:$estr}
};
model_ver1_game_define_BaSyouKeyword.__constructs__ = [model_ver1_game_define_BaSyouKeyword.HonGoku,model_ver1_game_define_BaSyouKeyword.SuteYama,model_ver1_game_define_BaSyouKeyword.SpaceArea,model_ver1_game_define_BaSyouKeyword.EarchArea,model_ver1_game_define_BaSyouKeyword.MaintenanceArea,model_ver1_game_define_BaSyouKeyword.GZone,model_ver1_game_define_BaSyouKeyword.JunkYard,model_ver1_game_define_BaSyouKeyword.TeHuTa,model_ver1_game_define_BaSyouKeyword.Hanger,model_ver1_game_define_BaSyouKeyword.PlayedCard,model_ver1_game_define_BaSyouKeyword.RemovedCard];
var model_ver1_game_define_BaSyou = $hxEnums["model.ver1.game.define.BaSyou"] = { __ename__:true,__constructs__:null
	,Default: ($_=function(playerId,baSyouKeyword) { return {_hx_index:0,playerId:playerId,baSyouKeyword:baSyouKeyword,__enum__:"model.ver1.game.define.BaSyou",toString:$estr}; },$_._hx_name="Default",$_.__params__ = ["playerId","baSyouKeyword"],$_)
};
model_ver1_game_define_BaSyou.__constructs__ = [model_ver1_game_define_BaSyou.Default];
var model_ver1_game_define_BaSyouId = {};
model_ver1_game_define_BaSyouId._new = function(i) {
	var this1 = i;
	return this1;
};
model_ver1_game_define_BaSyouId.toBaSyou = function(this1) {
	try {
		var pair = this1.split(model_ver1_game_define_BaSyouId._split);
		var s = pair[0];
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(s) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + s + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this2 = s;
		var playerId = this2;
		var kw = Type.createEnum(model_ver1_game_define_BaSyouKeyword,pair[1],null);
		return model_ver1_game_define_BaSyou.Default(playerId,kw);
	} catch( _g ) {
		var e = haxe_Exception.caught(_g);
		console.log("src/model/ver1/game/define/BaSyou.hx:79:",e);
		throw haxe_Exception.thrown("can not parse BaSyou (" + this1 + "), because " + Std.string(e));
	}
};
model_ver1_game_define_BaSyouId.fromString = function(v) {
	var this1 = v;
	var ret = this1;
	model_ver1_game_define_BaSyouId.toBaSyou(ret);
	return ret;
};
model_ver1_game_define_BaSyouId.fromBaSyou = function(baSyou) {
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	return this1;
};
function model_ver1_game_define_BaSyou_isBattleArea(k) {
	switch(k._hx_index) {
	case 2:case 3:
		return true;
	default:
		return false;
	}
}
function model_ver1_game_define_BaSyou_isMaintenanceArea(k) {
	switch(k._hx_index) {
	case 4:case 5:
		return true;
	default:
		return false;
	}
}
function model_ver1_game_define_BaSyou_isBa(k) {
	if(model_ver1_game_define_BaSyou_isBattleArea(k)) {
		return true;
	}
	if(model_ver1_game_define_BaSyou_isMaintenanceArea(k)) {
		return true;
	}
	return false;
}
function model_ver1_game_define_BaSyou_test() {
	var b1 = model_ver1_game_define_BaSyou.Default(model_ver1_game_define_PlayerId.A,model_ver1_game_define_BaSyouKeyword.HonGoku);
	var playerId = b1.playerId;
	var baSyouKeyword = b1.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	var csId = this1;
	var b2 = model_ver1_game_define_BaSyouId.toBaSyou(csId);
	if(Type.enumEq(b1,b2) == false) {
		throw new haxe_Exception("b1 must equals b2");
	}
	var b3 = model_ver1_game_define_BaSyou.Default(model_ver1_game_define_PlayerId.A,model_ver1_game_define_BaSyouKeyword.HonGoku);
	var playerId = b3.playerId;
	var baSyouKeyword = b3.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	var csId3 = this1;
	if(csId != csId3) {
		throw haxe_Exception.thrown("csId != csId3");
	}
	var this1 = "A@@@Hanger";
	var ret = this1;
	model_ver1_game_define_BaSyouId.toBaSyou(ret);
	var b4 = ret;
	var baSyou = model_ver1_game_define_BaSyou.Default(model_ver1_game_define_PlayerId.A,model_ver1_game_define_BaSyouKeyword.Hanger);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	var b5 = this1;
}
var model_ver1_game_define_BlockCause = $hxEnums["model.ver1.game.define.BlockCause"] = { __ename__:true,__constructs__:null
	,Pending: {_hx_name:"Pending",_hx_index:0,__enum__:"model.ver1.game.define.BlockCause",toString:$estr}
	,System: ($_=function(respnosePlayerId) { return {_hx_index:1,respnosePlayerId:respnosePlayerId,__enum__:"model.ver1.game.define.BlockCause",toString:$estr}; },$_._hx_name="System",$_.__params__ = ["respnosePlayerId"],$_)
	,PlayCard: ($_=function(playerId,cardId) { return {_hx_index:2,playerId:playerId,cardId:cardId,__enum__:"model.ver1.game.define.BlockCause",toString:$estr}; },$_._hx_name="PlayCard",$_.__params__ = ["playerId","cardId"],$_)
	,PlayText: ($_=function(cardId,textId) { return {_hx_index:3,cardId:cardId,textId:textId,__enum__:"model.ver1.game.define.BlockCause",toString:$estr}; },$_._hx_name="PlayText",$_.__params__ = ["cardId","textId"],$_)
	,TextEffect: ($_=function(cardId,textId) { return {_hx_index:4,cardId:cardId,textId:textId,__enum__:"model.ver1.game.define.BlockCause",toString:$estr}; },$_._hx_name="TextEffect",$_.__params__ = ["cardId","textId"],$_)
};
model_ver1_game_define_BlockCause.__constructs__ = [model_ver1_game_define_BlockCause.Pending,model_ver1_game_define_BlockCause.System,model_ver1_game_define_BlockCause.PlayCard,model_ver1_game_define_BlockCause.PlayText,model_ver1_game_define_BlockCause.TextEffect];
var model_ver1_game_define_Block = function(id,cause,text) {
	this.__uid = hxbit_Serializer.SEQ << 24 | ++hxbit_Serializer.UID;
	this.isOption = false;
	this.isImmediate = false;
	this.id = id;
	this.cause = cause;
	this.text = text;
};
$hxClasses["model.ver1.game.define.Block"] = model_ver1_game_define_Block;
model_ver1_game_define_Block.__name__ = "model.ver1.game.define.Block";
model_ver1_game_define_Block.__interfaces__ = [hxbit_Serializable];
model_ver1_game_define_Block.prototype = {
	getCLID: function() {
		return model_ver1_game_define_Block.__clid;
	}
	,serialize: function(__ctx) {
		var s = this.id;
		if(s == null) {
			__ctx.out.addByte(0);
		} else {
			var b = haxe_io_Bytes.ofString(s);
			var v = b.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			__ctx.out.add(b);
		}
		hxbit_enumSer_Model_$ver1_$game_$define_$BlockCause.doSerialize(__ctx,this.cause);
		__ctx.addKnownRef(this.text);
		__ctx.out.addByte(this.isImmediate ? 1 : 0);
		__ctx.out.addByte(this.isOption ? 1 : 0);
	}
	,getSerializeSchema: function() {
		var schema = new hxbit_Schema();
		schema.fieldsNames.push("id");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PString);
		schema.fieldsNames.push("cause");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PEnum("model.ver1.game.define.BlockCause"));
		schema.fieldsNames.push("text");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PSerializable("model.ver1.game.define.CardText"));
		schema.fieldsNames.push("isImmediate");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PBool);
		schema.fieldsNames.push("isOption");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PBool);
		schema.isFinal = hxbit_Serializer.isClassFinal(model_ver1_game_define_Block.__clid);
		return schema;
	}
	,unserializeInit: function() {
		this.isImmediate = false;
		this.isOption = false;
	}
	,unserialize: function(__ctx) {
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			--len;
			var s = __ctx.input.getString(__ctx.inPos,len);
			__ctx.inPos += len;
			tmp = s;
		}
		this.id = tmp;
		var __e = hxbit_enumSer_Model_$ver1_$game_$define_$BlockCause.doUnserialize(__ctx);
		this.cause = __e;
		this.text = __ctx.getRef(model_ver1_game_define_CardText,model_ver1_game_define_CardText.__clid);
		this.isImmediate = __ctx.input.b[__ctx.inPos++] != 0;
		this.isOption = __ctx.input.b[__ctx.inPos++] != 0;
	}
	,__class__: model_ver1_game_define_Block
};
var model_ver1_game_define_Context = function() {
	this.__uid = hxbit_Serializer.SEQ << 24 | ++hxbit_Serializer.UID;
	this.flowMemory = { state : model_ver1_game_define_FlowMemoryState.PrepareDeck, hasTriggerEvent : false, hasPlayerPassPhase : new haxe_ds_StringMap(), hasPlayerPassCut : new haxe_ds_StringMap(), hasPlayerPassPayCost : new haxe_ds_StringMap(), shouldTriggerStackEffectFinishedEvent : false, msgs : []};
	this.cuts = [];
	this.memory = { playerSelection : { cardIds : new haxe_ds_StringMap()}};
	this.cardProtoPool = new haxe_ds_StringMap();
	this.timing = model_ver1_game_define_Timing_TIMINGS[0];
	this.marks = new haxe_ds_StringMap();
	this.table = new tool_Table();
	this.playersOrder = [];
};
$hxClasses["model.ver1.game.define.Context"] = model_ver1_game_define_Context;
model_ver1_game_define_Context.__name__ = "model.ver1.game.define.Context";
model_ver1_game_define_Context.__interfaces__ = [hxbit_Serializable];
model_ver1_game_define_Context.prototype = {
	getCLID: function() {
		return model_ver1_game_define_Context.__clid;
	}
	,serialize: function(__ctx) {
		var a = this.playersOrder;
		if(a == null) {
			__ctx.out.addByte(0);
		} else {
			var v = a.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			var _g = 0;
			while(_g < a.length) {
				var v = a[_g];
				++_g;
				if(v == null) {
					__ctx.out.addByte(0);
				} else {
					var b = haxe_io_Bytes.ofString(v);
					var v1 = b.length + 1;
					if(v1 >= 0 && v1 < 128) {
						__ctx.out.addByte(v1);
					} else {
						__ctx.out.addByte(128);
						__ctx.out.addInt32(v1);
					}
					__ctx.out.add(b);
				}
			}
		}
		__ctx.addKnownRef(this.table);
		var a = this.marks;
		if(a == null) {
			__ctx.out.addByte(0);
		} else {
			var _g = [];
			var h = a.h;
			var k_h = h;
			var k_keys = Object.keys(h);
			var k_length = k_keys.length;
			var k_current = 0;
			while(k_current < k_length) {
				var k = k_keys[k_current++];
				_g.push(k);
			}
			var keys = _g;
			var v = keys.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			var _g = 0;
			while(_g < keys.length) {
				var k = keys[_g];
				++_g;
				if(k == null) {
					__ctx.out.addByte(0);
				} else {
					var b = haxe_io_Bytes.ofString(k);
					var v = b.length + 1;
					if(v >= 0 && v < 128) {
						__ctx.out.addByte(v);
					} else {
						__ctx.out.addByte(128);
						__ctx.out.addInt32(v);
					}
					__ctx.out.add(b);
				}
				__ctx.addKnownRef(a.h[k]);
			}
		}
		hxbit_enumSer_Model_$ver1_$game_$define_$Timing.doSerialize(__ctx,this.timing);
		var a = this.cardProtoPool;
		if(a == null) {
			__ctx.out.addByte(0);
		} else {
			var _g = [];
			var h = a.h;
			var k_h = h;
			var k_keys = Object.keys(h);
			var k_length = k_keys.length;
			var k_current = 0;
			while(k_current < k_length) {
				var k = k_keys[k_current++];
				_g.push(k);
			}
			var keys = _g;
			var v = keys.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			var _g = 0;
			while(_g < keys.length) {
				var k = keys[_g];
				++_g;
				if(k == null) {
					__ctx.out.addByte(0);
				} else {
					var b = haxe_io_Bytes.ofString(k);
					var v = b.length + 1;
					if(v >= 0 && v < 128) {
						__ctx.out.addByte(v);
					} else {
						__ctx.out.addByte(128);
						__ctx.out.addInt32(v);
					}
					__ctx.out.add(b);
				}
				__ctx.addKnownRef(a.h[k]);
			}
		}
		var v = this.memory;
		if(v == null) {
			__ctx.out.addByte(0);
		} else {
			var fbits = 0;
			if(v.playerSelection != null) {
				fbits |= 1;
			}
			var v1 = fbits + 1;
			if(v1 >= 0 && v1 < 128) {
				__ctx.out.addByte(v1);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v1);
			}
			if((fbits & 1) != 0) {
				var v1 = v.playerSelection;
				if(v1 == null) {
					__ctx.out.addByte(0);
				} else {
					var fbits = 0;
					if(v1.cardIds != null) {
						fbits |= 1;
					}
					var v = fbits + 1;
					if(v >= 0 && v < 128) {
						__ctx.out.addByte(v);
					} else {
						__ctx.out.addByte(128);
						__ctx.out.addInt32(v);
					}
					if((fbits & 1) != 0) {
						var a = v1.cardIds;
						if(a == null) {
							__ctx.out.addByte(0);
						} else {
							var _g = [];
							var h = a.h;
							var k_h = h;
							var k_keys = Object.keys(h);
							var k_length = k_keys.length;
							var k_current = 0;
							while(k_current < k_length) {
								var k = k_keys[k_current++];
								_g.push(k);
							}
							var keys = _g;
							var v = keys.length + 1;
							if(v >= 0 && v < 128) {
								__ctx.out.addByte(v);
							} else {
								__ctx.out.addByte(128);
								__ctx.out.addInt32(v);
							}
							var _g = 0;
							while(_g < keys.length) {
								var k = keys[_g];
								++_g;
								if(k == null) {
									__ctx.out.addByte(0);
								} else {
									var b = haxe_io_Bytes.ofString(k);
									var v = b.length + 1;
									if(v >= 0 && v < 128) {
										__ctx.out.addByte(v);
									} else {
										__ctx.out.addByte(128);
										__ctx.out.addInt32(v);
									}
									__ctx.out.add(b);
								}
								var v1 = a.h[k];
								if(v1 == null) {
									__ctx.out.addByte(0);
								} else {
									var v2 = v1.length + 1;
									if(v2 >= 0 && v2 < 128) {
										__ctx.out.addByte(v2);
									} else {
										__ctx.out.addByte(128);
										__ctx.out.addInt32(v2);
									}
									var _g1 = 0;
									while(_g1 < v1.length) {
										var v3 = v1[_g1];
										++_g1;
										if(v3 == null) {
											__ctx.out.addByte(0);
										} else {
											var b1 = haxe_io_Bytes.ofString(v3);
											var v4 = b1.length + 1;
											if(v4 >= 0 && v4 < 128) {
												__ctx.out.addByte(v4);
											} else {
												__ctx.out.addByte(128);
												__ctx.out.addInt32(v4);
											}
											__ctx.out.add(b1);
										}
									}
								}
							}
						}
					}
				}
			}
		}
		var a = this.cuts;
		if(a == null) {
			__ctx.out.addByte(0);
		} else {
			var v = a.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			var _g = 0;
			while(_g < a.length) {
				var v = a[_g];
				++_g;
				if(v == null) {
					__ctx.out.addByte(0);
				} else {
					var v1 = v.length + 1;
					if(v1 >= 0 && v1 < 128) {
						__ctx.out.addByte(v1);
					} else {
						__ctx.out.addByte(128);
						__ctx.out.addInt32(v1);
					}
					var _g1 = 0;
					while(_g1 < v.length) {
						var v2 = v[_g1];
						++_g1;
						__ctx.addKnownRef(v2);
					}
				}
			}
		}
		var v = this.flowMemory;
		if(v == null) {
			__ctx.out.addByte(0);
		} else {
			var fbits = 0;
			if(v.hasPlayerPassCut != null) {
				fbits |= 1;
			}
			if(v.hasPlayerPassPayCost != null) {
				fbits |= 2;
			}
			if(v.hasPlayerPassPhase != null) {
				fbits |= 4;
			}
			if(v.msgs != null) {
				fbits |= 8;
			}
			if(v.state != null) {
				fbits |= 16;
			}
			var v1 = fbits + 1;
			if(v1 >= 0 && v1 < 128) {
				__ctx.out.addByte(v1);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v1);
			}
			if((fbits & 1) != 0) {
				var a = v.hasPlayerPassCut;
				if(a == null) {
					__ctx.out.addByte(0);
				} else {
					var _g = [];
					var h = a.h;
					var k_h = h;
					var k_keys = Object.keys(h);
					var k_length = k_keys.length;
					var k_current = 0;
					while(k_current < k_length) {
						var k = k_keys[k_current++];
						_g.push(k);
					}
					var keys = _g;
					var v1 = keys.length + 1;
					if(v1 >= 0 && v1 < 128) {
						__ctx.out.addByte(v1);
					} else {
						__ctx.out.addByte(128);
						__ctx.out.addInt32(v1);
					}
					var _g = 0;
					while(_g < keys.length) {
						var k = keys[_g];
						++_g;
						if(k == null) {
							__ctx.out.addByte(0);
						} else {
							var b = haxe_io_Bytes.ofString(k);
							var v1 = b.length + 1;
							if(v1 >= 0 && v1 < 128) {
								__ctx.out.addByte(v1);
							} else {
								__ctx.out.addByte(128);
								__ctx.out.addInt32(v1);
							}
							__ctx.out.add(b);
						}
						__ctx.out.addByte(a.h[k] ? 1 : 0);
					}
				}
			}
			if((fbits & 2) != 0) {
				var a = v.hasPlayerPassPayCost;
				if(a == null) {
					__ctx.out.addByte(0);
				} else {
					var _g = [];
					var h = a.h;
					var k_h = h;
					var k_keys = Object.keys(h);
					var k_length = k_keys.length;
					var k_current = 0;
					while(k_current < k_length) {
						var k = k_keys[k_current++];
						_g.push(k);
					}
					var keys = _g;
					var v1 = keys.length + 1;
					if(v1 >= 0 && v1 < 128) {
						__ctx.out.addByte(v1);
					} else {
						__ctx.out.addByte(128);
						__ctx.out.addInt32(v1);
					}
					var _g = 0;
					while(_g < keys.length) {
						var k = keys[_g];
						++_g;
						if(k == null) {
							__ctx.out.addByte(0);
						} else {
							var b = haxe_io_Bytes.ofString(k);
							var v1 = b.length + 1;
							if(v1 >= 0 && v1 < 128) {
								__ctx.out.addByte(v1);
							} else {
								__ctx.out.addByte(128);
								__ctx.out.addInt32(v1);
							}
							__ctx.out.add(b);
						}
						__ctx.out.addByte(a.h[k] ? 1 : 0);
					}
				}
			}
			if((fbits & 4) != 0) {
				var a = v.hasPlayerPassPhase;
				if(a == null) {
					__ctx.out.addByte(0);
				} else {
					var _g = [];
					var h = a.h;
					var k_h = h;
					var k_keys = Object.keys(h);
					var k_length = k_keys.length;
					var k_current = 0;
					while(k_current < k_length) {
						var k = k_keys[k_current++];
						_g.push(k);
					}
					var keys = _g;
					var v1 = keys.length + 1;
					if(v1 >= 0 && v1 < 128) {
						__ctx.out.addByte(v1);
					} else {
						__ctx.out.addByte(128);
						__ctx.out.addInt32(v1);
					}
					var _g = 0;
					while(_g < keys.length) {
						var k = keys[_g];
						++_g;
						if(k == null) {
							__ctx.out.addByte(0);
						} else {
							var b = haxe_io_Bytes.ofString(k);
							var v1 = b.length + 1;
							if(v1 >= 0 && v1 < 128) {
								__ctx.out.addByte(v1);
							} else {
								__ctx.out.addByte(128);
								__ctx.out.addInt32(v1);
							}
							__ctx.out.add(b);
						}
						__ctx.out.addByte(a.h[k] ? 1 : 0);
					}
				}
			}
			__ctx.out.addByte(v.hasTriggerEvent ? 1 : 0);
			if((fbits & 8) != 0) {
				var a = v.msgs;
				if(a == null) {
					__ctx.out.addByte(0);
				} else {
					var v1 = a.length + 1;
					if(v1 >= 0 && v1 < 128) {
						__ctx.out.addByte(v1);
					} else {
						__ctx.out.addByte(128);
						__ctx.out.addInt32(v1);
					}
					var _g = 0;
					while(_g < a.length) {
						var v1 = a[_g];
						++_g;
						__ctx.addDynamic(v1);
					}
				}
			}
			__ctx.out.addByte(v.shouldTriggerStackEffectFinishedEvent ? 1 : 0);
			if((fbits & 16) != 0) {
				hxbit_enumSer_Model_$ver1_$game_$define_$FlowMemoryState.doSerialize(__ctx,v.state);
			}
		}
		var s = this.activePlayerId;
		if(s == null) {
			__ctx.out.addByte(0);
		} else {
			var b = haxe_io_Bytes.ofString(s);
			var v = b.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			__ctx.out.add(b);
		}
	}
	,getSerializeSchema: function() {
		var schema = new hxbit_Schema();
		schema.fieldsNames.push("playersOrder");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PArray(hxbit_PropTypeDesc.PString));
		schema.fieldsNames.push("table");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PSerializable("tool.Table"));
		schema.fieldsNames.push("marks");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PMap(hxbit_PropTypeDesc.PString,hxbit_PropTypeDesc.PSerializable("model.ver1.game.define.Mark")));
		schema.fieldsNames.push("timing");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PEnum("model.ver1.game.define.Timing"));
		schema.fieldsNames.push("cardProtoPool");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PMap(hxbit_PropTypeDesc.PString,hxbit_PropTypeDesc.PSerializable("model.ver1.game.define.CardProto")));
		schema.fieldsNames.push("memory");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PObj([{ name : "playerSelection", opt : false, type : hxbit_PropTypeDesc.PObj([{ name : "cardIds", opt : false, type : hxbit_PropTypeDesc.PMap(hxbit_PropTypeDesc.PString,hxbit_PropTypeDesc.PArray(hxbit_PropTypeDesc.PString))}])}]));
		schema.fieldsNames.push("cuts");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PArray(hxbit_PropTypeDesc.PArray(hxbit_PropTypeDesc.PSerializable("model.ver1.game.define.Block"))));
		schema.fieldsNames.push("flowMemory");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PObj([{ name : "hasPlayerPassCut", opt : false, type : hxbit_PropTypeDesc.PMap(hxbit_PropTypeDesc.PString,hxbit_PropTypeDesc.PBool)},{ name : "hasPlayerPassPayCost", opt : false, type : hxbit_PropTypeDesc.PMap(hxbit_PropTypeDesc.PString,hxbit_PropTypeDesc.PBool)},{ name : "hasPlayerPassPhase", opt : false, type : hxbit_PropTypeDesc.PMap(hxbit_PropTypeDesc.PString,hxbit_PropTypeDesc.PBool)},{ name : "hasTriggerEvent", opt : false, type : hxbit_PropTypeDesc.PBool},{ name : "msgs", opt : false, type : hxbit_PropTypeDesc.PArray(hxbit_PropTypeDesc.PDynamic)},{ name : "shouldTriggerStackEffectFinishedEvent", opt : false, type : hxbit_PropTypeDesc.PBool},{ name : "state", opt : false, type : hxbit_PropTypeDesc.PEnum("model.ver1.game.define.FlowMemoryState")}]));
		schema.fieldsNames.push("activePlayerId");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PString);
		schema.isFinal = hxbit_Serializer.isClassFinal(model_ver1_game_define_Context.__clid);
		return schema;
	}
	,unserializeInit: function() {
		this.playersOrder = [];
		this.table = new tool_Table();
		this.marks = new haxe_ds_StringMap();
		this.timing = model_ver1_game_define_Timing_TIMINGS[0];
		this.cardProtoPool = new haxe_ds_StringMap();
		this.memory = { playerSelection : { cardIds : new haxe_ds_StringMap()}};
		this.cuts = [];
		this.flowMemory = { state : model_ver1_game_define_FlowMemoryState.PrepareDeck, hasTriggerEvent : false, hasPlayerPassPhase : new haxe_ds_StringMap(), hasPlayerPassCut : new haxe_ds_StringMap(), hasPlayerPassPayCost : new haxe_ds_StringMap(), shouldTriggerStackEffectFinishedEvent : false, msgs : []};
	}
	,unserialize: function(__ctx) {
		var e0;
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			--len;
			var a = [];
			var _g = 0;
			var _g1 = len;
			while(_g < _g1) {
				var i = _g++;
				var v = __ctx.input.b[__ctx.inPos++];
				if(v == 128) {
					v = __ctx.input.getInt32(__ctx.inPos);
					__ctx.inPos += 4;
				}
				var len = v;
				if(len == 0) {
					e0 = null;
				} else {
					--len;
					var s = __ctx.input.getString(__ctx.inPos,len);
					__ctx.inPos += len;
					e0 = s;
				}
				a[i] = e0;
			}
			tmp = a;
		}
		this.playersOrder = tmp;
		this.table = __ctx.getRef(tool_Table,tool_Table.__clid);
		var k0;
		var v0;
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			var m = new haxe_ds_StringMap();
			while(--len > 0) {
				var v = __ctx.input.b[__ctx.inPos++];
				if(v == 128) {
					v = __ctx.input.getInt32(__ctx.inPos);
					__ctx.inPos += 4;
				}
				var len1 = v;
				if(len1 == 0) {
					k0 = null;
				} else {
					--len1;
					var s = __ctx.input.getString(__ctx.inPos,len1);
					__ctx.inPos += len1;
					k0 = s;
				}
				var k = k0;
				v0 = __ctx.getRef(model_ver1_game_define_Mark,model_ver1_game_define_Mark.__clid);
				var v1 = v0;
				m.h[k] = v1;
			}
			tmp = m;
		}
		this.marks = tmp;
		var __e = hxbit_enumSer_Model_$ver1_$game_$define_$Timing.doUnserialize(__ctx);
		this.timing = __e;
		var k0;
		var v0;
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			var m = new haxe_ds_StringMap();
			while(--len > 0) {
				var v = __ctx.input.b[__ctx.inPos++];
				if(v == 128) {
					v = __ctx.input.getInt32(__ctx.inPos);
					__ctx.inPos += 4;
				}
				var len1 = v;
				if(len1 == 0) {
					k0 = null;
				} else {
					--len1;
					var s = __ctx.input.getString(__ctx.inPos,len1);
					__ctx.inPos += len1;
					k0 = s;
				}
				var k = k0;
				v0 = __ctx.getRef(model_ver1_game_define_CardProto,model_ver1_game_define_CardProto.__clid);
				var v1 = v0;
				m.h[k] = v1;
			}
			tmp = m;
		}
		this.cardProtoPool = tmp;
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var fbits = v;
		if(fbits == 0) {
			this.memory = null;
		} else {
			--fbits;
			var playerSelection = null;
			if((fbits & 1) != 0) {
				var v = __ctx.input.b[__ctx.inPos++];
				if(v == 128) {
					v = __ctx.input.getInt32(__ctx.inPos);
					__ctx.inPos += 4;
				}
				var fbits = v;
				if(fbits == 0) {
					playerSelection = null;
				} else {
					--fbits;
					var cardIds = null;
					if((fbits & 1) != 0) {
						var k2;
						var v2;
						var v = __ctx.input.b[__ctx.inPos++];
						if(v == 128) {
							v = __ctx.input.getInt32(__ctx.inPos);
							__ctx.inPos += 4;
						}
						var len = v;
						if(len == 0) {
							cardIds = null;
						} else {
							var m = new haxe_ds_StringMap();
							while(--len > 0) {
								var v = __ctx.input.b[__ctx.inPos++];
								if(v == 128) {
									v = __ctx.input.getInt32(__ctx.inPos);
									__ctx.inPos += 4;
								}
								var len1 = v;
								if(len1 == 0) {
									k2 = null;
								} else {
									--len1;
									var s = __ctx.input.getString(__ctx.inPos,len1);
									__ctx.inPos += len1;
									k2 = s;
								}
								var k = k2;
								var e3;
								var v1 = __ctx.input.b[__ctx.inPos++];
								if(v1 == 128) {
									v1 = __ctx.input.getInt32(__ctx.inPos);
									__ctx.inPos += 4;
								}
								var len2 = v1;
								if(len2 == 0) {
									v2 = null;
								} else {
									--len2;
									var a = [];
									var _g = 0;
									var _g1 = len2;
									while(_g < _g1) {
										var i = _g++;
										var v3 = __ctx.input.b[__ctx.inPos++];
										if(v3 == 128) {
											v3 = __ctx.input.getInt32(__ctx.inPos);
											__ctx.inPos += 4;
										}
										var len3 = v3;
										if(len3 == 0) {
											e3 = null;
										} else {
											--len3;
											var s1 = __ctx.input.getString(__ctx.inPos,len3);
											__ctx.inPos += len3;
											e3 = s1;
										}
										a[i] = e3;
									}
									v2 = a;
								}
								var v4 = v2;
								m.h[k] = v4;
							}
							cardIds = m;
						}
					}
					playerSelection = { cardIds : cardIds};
				}
			}
			this.memory = { playerSelection : playerSelection};
		}
		var e0;
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			--len;
			var a = [];
			var _g = 0;
			var _g1 = len;
			while(_g < _g1) {
				var i = _g++;
				var e1;
				var v = __ctx.input.b[__ctx.inPos++];
				if(v == 128) {
					v = __ctx.input.getInt32(__ctx.inPos);
					__ctx.inPos += 4;
				}
				var len = v;
				if(len == 0) {
					e0 = null;
				} else {
					--len;
					var a1 = [];
					var _g2 = 0;
					var _g3 = len;
					while(_g2 < _g3) {
						var i1 = _g2++;
						e1 = __ctx.getRef(model_ver1_game_define_Block,model_ver1_game_define_Block.__clid);
						a1[i1] = e1;
					}
					e0 = a1;
				}
				a[i] = e0;
			}
			tmp = a;
		}
		this.cuts = tmp;
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var fbits = v;
		if(fbits == 0) {
			this.flowMemory = null;
		} else {
			--fbits;
			var state = null;
			var msgs = null;
			var hasPlayerPassPhase = null;
			var hasPlayerPassPayCost = null;
			var hasPlayerPassCut = null;
			if((fbits & 1) != 0) {
				var k1;
				var v1;
				var v = __ctx.input.b[__ctx.inPos++];
				if(v == 128) {
					v = __ctx.input.getInt32(__ctx.inPos);
					__ctx.inPos += 4;
				}
				var len = v;
				if(len == 0) {
					hasPlayerPassCut = null;
				} else {
					var m = new haxe_ds_StringMap();
					while(--len > 0) {
						var v = __ctx.input.b[__ctx.inPos++];
						if(v == 128) {
							v = __ctx.input.getInt32(__ctx.inPos);
							__ctx.inPos += 4;
						}
						var len1 = v;
						if(len1 == 0) {
							k1 = null;
						} else {
							--len1;
							var s = __ctx.input.getString(__ctx.inPos,len1);
							__ctx.inPos += len1;
							k1 = s;
						}
						var k = k1;
						v1 = __ctx.input.b[__ctx.inPos++] != 0;
						var v2 = v1;
						m.h[k] = v2;
					}
					hasPlayerPassCut = m;
				}
			}
			if((fbits & 2) != 0) {
				var k1;
				var v1;
				var v = __ctx.input.b[__ctx.inPos++];
				if(v == 128) {
					v = __ctx.input.getInt32(__ctx.inPos);
					__ctx.inPos += 4;
				}
				var len = v;
				if(len == 0) {
					hasPlayerPassPayCost = null;
				} else {
					var m = new haxe_ds_StringMap();
					while(--len > 0) {
						var v = __ctx.input.b[__ctx.inPos++];
						if(v == 128) {
							v = __ctx.input.getInt32(__ctx.inPos);
							__ctx.inPos += 4;
						}
						var len1 = v;
						if(len1 == 0) {
							k1 = null;
						} else {
							--len1;
							var s = __ctx.input.getString(__ctx.inPos,len1);
							__ctx.inPos += len1;
							k1 = s;
						}
						var k = k1;
						v1 = __ctx.input.b[__ctx.inPos++] != 0;
						var v2 = v1;
						m.h[k] = v2;
					}
					hasPlayerPassPayCost = m;
				}
			}
			if((fbits & 4) != 0) {
				var k1;
				var v1;
				var v = __ctx.input.b[__ctx.inPos++];
				if(v == 128) {
					v = __ctx.input.getInt32(__ctx.inPos);
					__ctx.inPos += 4;
				}
				var len = v;
				if(len == 0) {
					hasPlayerPassPhase = null;
				} else {
					var m = new haxe_ds_StringMap();
					while(--len > 0) {
						var v = __ctx.input.b[__ctx.inPos++];
						if(v == 128) {
							v = __ctx.input.getInt32(__ctx.inPos);
							__ctx.inPos += 4;
						}
						var len1 = v;
						if(len1 == 0) {
							k1 = null;
						} else {
							--len1;
							var s = __ctx.input.getString(__ctx.inPos,len1);
							__ctx.inPos += len1;
							k1 = s;
						}
						var k = k1;
						v1 = __ctx.input.b[__ctx.inPos++] != 0;
						var v2 = v1;
						m.h[k] = v2;
					}
					hasPlayerPassPhase = m;
				}
			}
			var hasTriggerEvent = __ctx.input.b[__ctx.inPos++] != 0;
			if((fbits & 8) != 0) {
				var e1;
				var v = __ctx.input.b[__ctx.inPos++];
				if(v == 128) {
					v = __ctx.input.getInt32(__ctx.inPos);
					__ctx.inPos += 4;
				}
				var len = v;
				if(len == 0) {
					msgs = null;
				} else {
					--len;
					var a = [];
					var _g = 0;
					var _g1 = len;
					while(_g < _g1) {
						var i = _g++;
						var v2 = __ctx.getDynamic();
						e1 = v2;
						a[i] = e1;
					}
					msgs = a;
				}
			}
			var shouldTriggerStackEffectFinishedEvent = __ctx.input.b[__ctx.inPos++] != 0;
			if((fbits & 16) != 0) {
				var __e = hxbit_enumSer_Model_$ver1_$game_$define_$FlowMemoryState.doUnserialize(__ctx);
				state = __e;
			}
			this.flowMemory = { hasPlayerPassCut : hasPlayerPassCut, hasPlayerPassPayCost : hasPlayerPassPayCost, hasPlayerPassPhase : hasPlayerPassPhase, hasTriggerEvent : hasTriggerEvent, msgs : msgs, shouldTriggerStackEffectFinishedEvent : shouldTriggerStackEffectFinishedEvent, state : state};
		}
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			--len;
			var s = __ctx.input.getString(__ctx.inPos,len);
			__ctx.inPos += len;
			tmp = s;
		}
		this.activePlayerId = tmp;
	}
	,__class__: model_ver1_game_define_Context
};
var model_ver1_game_define_TextTypeAutomaticType = $hxEnums["model.ver1.game.define.TextTypeAutomaticType"] = { __ename__:true,__constructs__:null
	,Resident: {_hx_name:"Resident",_hx_index:0,__enum__:"model.ver1.game.define.TextTypeAutomaticType",toString:$estr}
	,Trigger: {_hx_name:"Trigger",_hx_index:1,__enum__:"model.ver1.game.define.TextTypeAutomaticType",toString:$estr}
	,Constant: {_hx_name:"Constant",_hx_index:2,__enum__:"model.ver1.game.define.TextTypeAutomaticType",toString:$estr}
};
model_ver1_game_define_TextTypeAutomaticType.__constructs__ = [model_ver1_game_define_TextTypeAutomaticType.Resident,model_ver1_game_define_TextTypeAutomaticType.Trigger,model_ver1_game_define_TextTypeAutomaticType.Constant];
var model_ver1_game_define_TextType = $hxEnums["model.ver1.game.define.TextType"] = { __ename__:true,__constructs__:null
	,Automatic: ($_=function(type) { return {_hx_index:0,type:type,__enum__:"model.ver1.game.define.TextType",toString:$estr}; },$_._hx_name="Automatic",$_.__params__ = ["type"],$_)
	,Use: {_hx_name:"Use",_hx_index:1,__enum__:"model.ver1.game.define.TextType",toString:$estr}
	,Special: {_hx_name:"Special",_hx_index:2,__enum__:"model.ver1.game.define.TextType",toString:$estr}
};
model_ver1_game_define_TextType.__constructs__ = [model_ver1_game_define_TextType.Automatic,model_ver1_game_define_TextType.Use,model_ver1_game_define_TextType.Special];
var model_ver1_game_define_CardEntityCategory = $hxEnums["model.ver1.game.define.CardEntityCategory"] = { __ename__:true,__constructs__:null
	,Unit: {_hx_name:"Unit",_hx_index:0,__enum__:"model.ver1.game.define.CardEntityCategory",toString:$estr}
	,Character: {_hx_name:"Character",_hx_index:1,__enum__:"model.ver1.game.define.CardEntityCategory",toString:$estr}
	,Operation: {_hx_name:"Operation",_hx_index:2,__enum__:"model.ver1.game.define.CardEntityCategory",toString:$estr}
	,G: {_hx_name:"G",_hx_index:3,__enum__:"model.ver1.game.define.CardEntityCategory",toString:$estr}
};
model_ver1_game_define_CardEntityCategory.__constructs__ = [model_ver1_game_define_CardEntityCategory.Unit,model_ver1_game_define_CardEntityCategory.Character,model_ver1_game_define_CardEntityCategory.Operation,model_ver1_game_define_CardEntityCategory.G];
var model_ver1_game_define_GColor = $hxEnums["model.ver1.game.define.GColor"] = { __ename__:true,__constructs__:null
	,Red: {_hx_name:"Red",_hx_index:0,__enum__:"model.ver1.game.define.GColor",toString:$estr}
	,Black: {_hx_name:"Black",_hx_index:1,__enum__:"model.ver1.game.define.GColor",toString:$estr}
	,Purple: {_hx_name:"Purple",_hx_index:2,__enum__:"model.ver1.game.define.GColor",toString:$estr}
};
model_ver1_game_define_GColor.__constructs__ = [model_ver1_game_define_GColor.Red,model_ver1_game_define_GColor.Black,model_ver1_game_define_GColor.Purple];
var model_ver1_game_define_GProperty = $hxEnums["model.ver1.game.define.GProperty"] = { __ename__:true,__constructs__:null
	,Uc: {_hx_name:"Uc",_hx_index:0,__enum__:"model.ver1.game.define.GProperty",toString:$estr}
	,Zero8: {_hx_name:"Zero8",_hx_index:1,__enum__:"model.ver1.game.define.GProperty",toString:$estr}
};
model_ver1_game_define_GProperty.__constructs__ = [model_ver1_game_define_GProperty.Uc,model_ver1_game_define_GProperty.Zero8];
var model_ver1_game_define_GSign = $hxEnums["model.ver1.game.define.GSign"] = { __ename__:true,__constructs__:null
	,Default: ($_=function(color,property) { return {_hx_index:0,color:color,property:property,__enum__:"model.ver1.game.define.GSign",toString:$estr}; },$_._hx_name="Default",$_.__params__ = ["color","property"],$_)
};
model_ver1_game_define_GSign.__constructs__ = [model_ver1_game_define_GSign.Default];
var model_ver1_game_define_BattlePoint = $hxEnums["model.ver1.game.define.BattlePoint"] = { __ename__:true,__constructs__:null
	,Default: ($_=function(melee,range,hp) { return {_hx_index:0,melee:melee,range:range,hp:hp,__enum__:"model.ver1.game.define.BattlePoint",toString:$estr}; },$_._hx_name="Default",$_.__params__ = ["melee","range","hp"],$_)
};
model_ver1_game_define_BattlePoint.__constructs__ = [model_ver1_game_define_BattlePoint.Default];
var model_ver1_game_define_RelativePlayer = $hxEnums["model.ver1.game.define.RelativePlayer"] = { __ename__:true,__constructs__:null
	,You: {_hx_name:"You",_hx_index:0,__enum__:"model.ver1.game.define.RelativePlayer",toString:$estr}
	,Opponent: {_hx_name:"Opponent",_hx_index:1,__enum__:"model.ver1.game.define.RelativePlayer",toString:$estr}
};
model_ver1_game_define_RelativePlayer.__constructs__ = [model_ver1_game_define_RelativePlayer.You,model_ver1_game_define_RelativePlayer.Opponent];
var model_ver1_game_define_Event = $hxEnums["model.ver1.game.define.Event"] = { __ename__:true,__constructs__:null
	,ChangePhase: {_hx_name:"ChangePhase",_hx_index:0,__enum__:"model.ver1.game.define.Event",toString:$estr}
	,Gain: ($_=function(cardId,value) { return {_hx_index:1,cardId:cardId,value:value,__enum__:"model.ver1.game.define.Event",toString:$estr}; },$_._hx_name="Gain",$_.__params__ = ["cardId","value"],$_)
	,CardEnterField: ($_=function(cardId) { return {_hx_index:2,cardId:cardId,__enum__:"model.ver1.game.define.Event",toString:$estr}; },$_._hx_name="CardEnterField",$_.__params__ = ["cardId"],$_)
	,CardRoll: ($_=function(cardId) { return {_hx_index:3,cardId:cardId,__enum__:"model.ver1.game.define.Event",toString:$estr}; },$_._hx_name="CardRoll",$_.__params__ = ["cardId"],$_)
};
model_ver1_game_define_Event.__constructs__ = [model_ver1_game_define_Event.ChangePhase,model_ver1_game_define_Event.Gain,model_ver1_game_define_Event.CardEnterField,model_ver1_game_define_Event.CardRoll];
var model_ver1_game_define_ExecuteRuntime = function() { };
$hxClasses["model.ver1.game.define.ExecuteRuntime"] = model_ver1_game_define_ExecuteRuntime;
model_ver1_game_define_ExecuteRuntime.__name__ = "model.ver1.game.define.ExecuteRuntime";
model_ver1_game_define_ExecuteRuntime.__isInterface__ = true;
model_ver1_game_define_ExecuteRuntime.prototype = {
	__class__: model_ver1_game_define_ExecuteRuntime
};
var model_ver1_game_define_AbstractExecuteRuntime = function() {
};
$hxClasses["model.ver1.game.define.AbstractExecuteRuntime"] = model_ver1_game_define_AbstractExecuteRuntime;
model_ver1_game_define_AbstractExecuteRuntime.__name__ = "model.ver1.game.define.AbstractExecuteRuntime";
model_ver1_game_define_AbstractExecuteRuntime.__interfaces__ = [model_ver1_game_define_ExecuteRuntime];
model_ver1_game_define_AbstractExecuteRuntime.prototype = {
	getCardId: function() {
		throw new haxe_Exception("not support");
	}
	,getResponsePlayerId: function() {
		throw new haxe_Exception("not support");
	}
	,__class__: model_ver1_game_define_AbstractExecuteRuntime
};
var model_ver1_game_define_SystemExecuteRuntime = function(responsePlayerId) {
	model_ver1_game_define_AbstractExecuteRuntime.call(this);
	this.responsePlayerId = responsePlayerId;
};
$hxClasses["model.ver1.game.define.SystemExecuteRuntime"] = model_ver1_game_define_SystemExecuteRuntime;
model_ver1_game_define_SystemExecuteRuntime.__name__ = "model.ver1.game.define.SystemExecuteRuntime";
model_ver1_game_define_SystemExecuteRuntime.__super__ = model_ver1_game_define_AbstractExecuteRuntime;
model_ver1_game_define_SystemExecuteRuntime.prototype = $extend(model_ver1_game_define_AbstractExecuteRuntime.prototype,{
	getResponsePlayerId: function() {
		var s = this.responsePlayerId;
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(s) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + s + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = s;
		return this1;
	}
	,__class__: model_ver1_game_define_SystemExecuteRuntime
});
var model_ver1_game_define_DefaultExecuteRuntime = function(cardId,responsePlayerId) {
	model_ver1_game_define_AbstractExecuteRuntime.call(this);
	this.cardId = cardId;
	this.responsePlayerId = responsePlayerId;
};
$hxClasses["model.ver1.game.define.DefaultExecuteRuntime"] = model_ver1_game_define_DefaultExecuteRuntime;
model_ver1_game_define_DefaultExecuteRuntime.__name__ = "model.ver1.game.define.DefaultExecuteRuntime";
model_ver1_game_define_DefaultExecuteRuntime.__super__ = model_ver1_game_define_AbstractExecuteRuntime;
model_ver1_game_define_DefaultExecuteRuntime.prototype = $extend(model_ver1_game_define_AbstractExecuteRuntime.prototype,{
	getCardId: function() {
		return this.cardId;
	}
	,getResponsePlayerId: function() {
		return this.responsePlayerId;
	}
	,__class__: model_ver1_game_define_DefaultExecuteRuntime
});
var model_ver1_game_define_FlowMemoryState = $hxEnums["model.ver1.game.define.FlowMemoryState"] = { __ename__:true,__constructs__:null
	,PrepareDeck: {_hx_name:"PrepareDeck",_hx_index:0,__enum__:"model.ver1.game.define.FlowMemoryState",toString:$estr}
	,WhoFirst: {_hx_name:"WhoFirst",_hx_index:1,__enum__:"model.ver1.game.define.FlowMemoryState",toString:$estr}
	,Draw6AndConfirm: {_hx_name:"Draw6AndConfirm",_hx_index:2,__enum__:"model.ver1.game.define.FlowMemoryState",toString:$estr}
	,Playing: {_hx_name:"Playing",_hx_index:3,__enum__:"model.ver1.game.define.FlowMemoryState",toString:$estr}
};
model_ver1_game_define_FlowMemoryState.__constructs__ = [model_ver1_game_define_FlowMemoryState.PrepareDeck,model_ver1_game_define_FlowMemoryState.WhoFirst,model_ver1_game_define_FlowMemoryState.Draw6AndConfirm,model_ver1_game_define_FlowMemoryState.Playing];
var model_ver1_game_define_FlowType = $hxEnums["model.ver1.game.define.FlowType"] = { __ename__:true,__constructs__:null
	,FlowWaitPlayer: {_hx_name:"FlowWaitPlayer",_hx_index:0,__enum__:"model.ver1.game.define.FlowType",toString:$estr}
	,FlowObserveEffect: {_hx_name:"FlowObserveEffect",_hx_index:1,__enum__:"model.ver1.game.define.FlowType",toString:$estr}
	,FlowDoEffect: ($_=function(blockId) { return {_hx_index:2,blockId:blockId,__enum__:"model.ver1.game.define.FlowType",toString:$estr}; },$_._hx_name="FlowDoEffect",$_.__params__ = ["blockId"],$_)
	,FlowPassPayCost: ($_=function(blockId) { return {_hx_index:3,blockId:blockId,__enum__:"model.ver1.game.define.FlowType",toString:$estr}; },$_._hx_name="FlowPassPayCost",$_.__params__ = ["blockId"],$_)
	,FlowCancelActiveEffect: {_hx_name:"FlowCancelActiveEffect",_hx_index:4,__enum__:"model.ver1.game.define.FlowType",toString:$estr}
	,FlowSetActiveEffectId: ($_=function(blockId,tips) { return {_hx_index:5,blockId:blockId,tips:tips,__enum__:"model.ver1.game.define.FlowType",toString:$estr}; },$_._hx_name="FlowSetActiveEffectId",$_.__params__ = ["blockId","tips"],$_)
	,FlowDeleteImmediateEffect: ($_=function(blockId,tips) { return {_hx_index:6,blockId:blockId,tips:tips,__enum__:"model.ver1.game.define.FlowType",toString:$estr}; },$_._hx_name="FlowDeleteImmediateEffect",$_.__params__ = ["blockId","tips"],$_)
	,FlowHandleStackEffectFinished: {_hx_name:"FlowHandleStackEffectFinished",_hx_index:7,__enum__:"model.ver1.game.define.FlowType",toString:$estr}
	,FlowCancelPassCut: {_hx_name:"FlowCancelPassCut",_hx_index:8,__enum__:"model.ver1.game.define.FlowType",toString:$estr}
	,FlowPassCut: {_hx_name:"FlowPassCut",_hx_index:9,__enum__:"model.ver1.game.define.FlowType",toString:$estr}
	,FlowPassPhase: {_hx_name:"FlowPassPhase",_hx_index:10,__enum__:"model.ver1.game.define.FlowType",toString:$estr}
	,FlowCancelPassPhase: {_hx_name:"FlowCancelPassPhase",_hx_index:11,__enum__:"model.ver1.game.define.FlowType",toString:$estr}
	,FlowNextTiming: {_hx_name:"FlowNextTiming",_hx_index:12,__enum__:"model.ver1.game.define.FlowType",toString:$estr}
	,FlowTriggerTextEvent: ($_=function(event) { return {_hx_index:13,event:event,__enum__:"model.ver1.game.define.FlowType",toString:$estr}; },$_._hx_name="FlowTriggerTextEvent",$_.__params__ = ["event"],$_)
};
model_ver1_game_define_FlowType.__constructs__ = [model_ver1_game_define_FlowType.FlowWaitPlayer,model_ver1_game_define_FlowType.FlowObserveEffect,model_ver1_game_define_FlowType.FlowDoEffect,model_ver1_game_define_FlowType.FlowPassPayCost,model_ver1_game_define_FlowType.FlowCancelActiveEffect,model_ver1_game_define_FlowType.FlowSetActiveEffectId,model_ver1_game_define_FlowType.FlowDeleteImmediateEffect,model_ver1_game_define_FlowType.FlowHandleStackEffectFinished,model_ver1_game_define_FlowType.FlowCancelPassCut,model_ver1_game_define_FlowType.FlowPassCut,model_ver1_game_define_FlowType.FlowPassPhase,model_ver1_game_define_FlowType.FlowCancelPassPhase,model_ver1_game_define_FlowType.FlowNextTiming,model_ver1_game_define_FlowType.FlowTriggerTextEvent];
var model_ver1_game_define_Flow = $hxEnums["model.ver1.game.define.Flow"] = { __ename__:true,__constructs__:null
	,Default: ($_=function(type,description) { return {_hx_index:0,type:type,description:description,__enum__:"model.ver1.game.define.Flow",toString:$estr}; },$_._hx_name="Default",$_.__params__ = ["type","description"],$_)
};
model_ver1_game_define_Flow.__constructs__ = [model_ver1_game_define_Flow.Default];
function model_ver1_game_define_Flow_passPhase(memory,playerId) {
	memory.hasPlayerPassPhase.h[playerId] = true;
}
function model_ver1_game_define_Flow_cancelPassPhase(memory,playerId) {
	var _this = memory.hasPlayerPassPhase;
	if(Object.prototype.hasOwnProperty.call(_this.h,playerId)) {
		delete(_this.h[playerId]);
	}
}
function model_ver1_game_define_Flow_resetPassPhase(memory) {
	var h = memory.hasPlayerPassPhase.h;
	var k_h = h;
	var k_keys = Object.keys(h);
	var k_length = k_keys.length;
	var k_current = 0;
	while(k_current < k_length) {
		var k = k_keys[k_current++];
		var _this = memory.hasPlayerPassPhase;
		if(Object.prototype.hasOwnProperty.call(_this.h,k)) {
			delete(_this.h[k]);
		}
	}
}
function model_ver1_game_define_Flow_passCut(memory,playerId) {
	memory.hasPlayerPassPayCost.h[playerId] = true;
}
function model_ver1_game_define_Flow_cancelPassCut(memory,playerId) {
	var _this = memory.hasPlayerPassPayCost;
	if(Object.prototype.hasOwnProperty.call(_this.h,playerId)) {
		delete(_this.h[playerId]);
	}
}
function model_ver1_game_define_Flow_resetPassCut(memory) {
	var h = memory.hasPlayerPassCut.h;
	var k_h = h;
	var k_keys = Object.keys(h);
	var k_length = k_keys.length;
	var k_current = 0;
	while(k_current < k_length) {
		var k = k_keys[k_current++];
		var _this = memory.hasPlayerPassCut;
		if(Object.prototype.hasOwnProperty.call(_this.h,k)) {
			delete(_this.h[k]);
		}
	}
}
function model_ver1_game_define_Flow_resetPassCost(memory) {
	var h = memory.hasPlayerPassPayCost.h;
	var k_h = h;
	var k_keys = Object.keys(h);
	var k_length = k_keys.length;
	var k_current = 0;
	while(k_current < k_length) {
		var k = k_keys[k_current++];
		var _this = memory.hasPlayerPassPayCost;
		if(Object.prototype.hasOwnProperty.call(_this.h,k)) {
			delete(_this.h[k]);
		}
	}
}
function model_ver1_game_define_Flow_hasTriggerEvent(memory) {
	return memory.hasTriggerEvent;
}
function model_ver1_game_define_Flow_triggerEvent(memory) {
	memory.hasTriggerEvent = true;
}
function model_ver1_game_define_Flow_cancelTriggerEvent(memory) {
	memory.hasTriggerEvent = false;
}
function model_ver1_game_define_Flow_markTriggerStackEffectFinishedEventDone(memory) {
	memory.shouldTriggerStackEffectFinishedEvent = true;
}
function model_ver1_game_define_Flow_applyFlow(ctx,playerID,flow) {
	var _g = flow.type;
	var _g1 = flow.description;
	var tmp = _g._hx_index == 5;
}
function model_ver1_game_define_Flow_queryFlow(ctx,playerId) {
	var _g = model_ver1_game_define_Flow_hasSomeoneLiveIsZero(ctx);
	if(_g._hx_index == 0) {
		var playerId1 = _g.v;
		return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowWaitPlayer,"遊戲結束")];
	}
	var _g = model_ver1_game_define_Flow_getActiveBlockId(ctx);
	switch(_g._hx_index) {
	case 0:
		var activeBlockId = _g.v;
		var runtime = model_ver1_game_alg_Block_getBlockRuntime(ctx,activeBlockId);
		var controller = runtime.getResponsePlayerId();
		var isPass = ctx.flowMemory.hasPlayerPassPayCost.h[playerId];
		var this1 = ctx.flowMemory.hasPlayerPassPayCost;
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(playerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + playerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this2 = playerId;
		var isOpponentPass = this1.h[this2 == model_ver1_game_define_PlayerId.A ? model_ver1_game_define_PlayerId.B : model_ver1_game_define_PlayerId.A];
		if(isPass && isOpponentPass) {
			if(controller != playerId) {
				return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowObserveEffect,"")];
			}
			return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowDoEffect(activeBlockId),"")];
		} else if(isPass || isOpponentPass) {
			if(controller == playerId) {
				if(isPass) {
					return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowObserveEffect,"")];
				}
			} else {
				if(isOpponentPass == false) {
					return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowObserveEffect,"")];
				}
				return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowPassPayCost(activeBlockId),"")];
			}
		}
		if(controller != playerId) {
			return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowWaitPlayer,"等待對方支付ActiveEffectID")];
		}
		return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowCancelActiveEffect,"取消支付效果，讓其它玩家可以支付"),model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowPassPayCost(activeBlockId),"")];
	case 1:
		break;
	}
	var immediateEffects = model_ver1_game_define_Flow_getImmediateEffects(ctx);
	if(immediateEffects.length > 0) {
		var s = ctx.activePlayerId;
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(s) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + s + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = s;
		var isActivePlayer = this1 == playerId;
		var myEffect = [];
		var opponentEffect = [];
		var _g = 0;
		while(_g < immediateEffects.length) {
			var effect = immediateEffects[_g];
			++_g;
			var controller = model_ver1_game_alg_Block_getBlockRuntime(ctx,effect.id).getResponsePlayerId();
			if(controller == playerId) {
				myEffect.push(effect);
			} else {
				opponentEffect.push(effect);
			}
		}
		if(isActivePlayer == false) {
			if(opponentEffect.length > 0) {
				return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowWaitPlayer,"等待主動玩家處理起動效果")];
			}
		}
		if(myEffect.length == 0) {
			return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowWaitPlayer,"等待被動玩家處理起動效果")];
		}
		var _g = [];
		var _g1 = 0;
		var _g2 = myEffect;
		while(_g1 < _g2.length) {
			var v = _g2[_g1];
			++_g1;
			if(v.isOption == true) {
				_g.push(v);
			}
		}
		var optionEffect = _g;
		var r1 = myEffect.length == 0 ? [] : [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowSetActiveEffectId(myEffect[0].id,myEffect),"選擇一個起動效果")];
		var r2 = optionEffect.length == 0 ? [] : [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowDeleteImmediateEffect(optionEffect[0].id,optionEffect),"你可以放棄這些效果")];
		return r1.concat(r2);
	}
	if(ctx.flowMemory.shouldTriggerStackEffectFinishedEvent) {
		var s = ctx.activePlayerId;
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(s) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + s + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = s;
		var isActivePlayer = this1 == playerId;
		if(isActivePlayer == false) {
			return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowWaitPlayer,"等待主動玩家處理")];
		}
		return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowHandleStackEffectFinished,"處理堆疊結束")];
	}
	var myCommandList = model_ver1_game_define_Flow_getClientCommand(ctx,playerId);
	var blocks = model_ver1_game_alg_Block_getBlocks(ctx);
	if(blocks.length > 0) {
		var effect = blocks[0];
		var controller = model_ver1_game_alg_Block_getBlockRuntime(ctx,effect.id).getResponsePlayerId();
		var isAllPassCut = ctx.flowMemory.hasPlayerPassCut.h[model_ver1_game_define_PlayerId.A] && ctx.flowMemory.hasPlayerPassCut.h[model_ver1_game_define_PlayerId.B];
		if(isAllPassCut == false) {
			var isPassCut = ctx.flowMemory.hasPlayerPassCut.h[playerId];
			if(isPassCut) {
				return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowCancelPassCut,"")];
			}
			if(controller == playerId) {
				if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(playerId) != -1 == false) {
					throw haxe_Exception.thrown("playerId (" + playerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
				}
				var this1 = playerId;
				var opponentPlayerID = this1 == model_ver1_game_define_PlayerId.A ? model_ver1_game_define_PlayerId.B : model_ver1_game_define_PlayerId.A;
				var isOpponentPassCut = ctx.flowMemory.hasPlayerPassCut.h[opponentPlayerID];
				if(isOpponentPassCut == false) {
					return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowWaitPlayer,"現在的切入優先權在對方")];
				}
			}
			var r1 = myCommandList.length == 0 ? [] : [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowSetActiveEffectId(myCommandList[0].id,myCommandList),"你可以切入")];
			var r2 = [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowPassCut,"")];
			return r1.concat(r2);
		}
		if(controller != playerId) {
			return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowWaitPlayer,"等待效果控制者處理")];
		}
		return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowSetActiveEffectId(effect.id,[effect]),"支付最上方的堆疊效果")];
	}
	var myCommandList = model_ver1_game_define_Flow_getClientCommand(ctx,playerId);
	var _g = ctx.timing;
	var _g1 = _g.phase;
	var _g1 = _g.step;
	switch(_g.timing._hx_index) {
	case 1:case 3:
		var isAllPassPhase = ctx.flowMemory.hasPlayerPassPhase.h[model_ver1_game_define_PlayerId.A] && ctx.flowMemory.hasPlayerPassPhase.h[model_ver1_game_define_PlayerId.B];
		if(isAllPassPhase == false) {
			if(ctx.flowMemory.hasPlayerPassPhase.h[playerId]) {
				return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowCancelPassPhase,"等待對方結束或是取消[" + Std.string(ctx.timing) + "]結束")];
			}
			var r1 = myCommandList.length == 0 ? [] : [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowSetActiveEffectId(myCommandList[0].id,myCommandList),"選擇一個指令")];
			var r2 = [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowPassPhase,"宣告[" + Std.string(ctx.timing) + "]結束")];
			return r1.concat(r2);
		}
		if(playerId != ctx.activePlayerId) {
			return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowWaitPlayer,"等待伺服器處理")];
		}
		return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowNextTiming,"")];
	default:
	}
	if(playerId != ctx.activePlayerId) {
		return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowWaitPlayer,"等待伺服器處理")];
	}
	var _g = ctx.timing;
	var _g1 = _g.step;
	var _g2 = _g.timing;
	switch(_g.phase._hx_index) {
	case 0:
		if(_g1._hx_index == 1) {
			switch(_g2._hx_index) {
			case 2:
				if(ctx.flowMemory.hasTriggerEvent) {
					return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowNextTiming,"")];
				}
				break;
			case 0:case 4:
				if(ctx.flowMemory.hasTriggerEvent) {
					return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowNextTiming,"")];
				}
				return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowTriggerTextEvent(model_ver1_game_define_Event.ChangePhase),"")];
			default:
			}
		} else {
			switch(_g2._hx_index) {
			case 0:case 4:
				if(ctx.flowMemory.hasTriggerEvent) {
					return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowNextTiming,"")];
				}
				return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowTriggerTextEvent(model_ver1_game_define_Event.ChangePhase),"")];
			default:
			}
		}
		break;
	case 1:
		if(_g1._hx_index == 1) {
			switch(_g2._hx_index) {
			case 2:
				if(ctx.flowMemory.hasTriggerEvent) {
					return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowNextTiming,"")];
				}
				break;
			case 0:case 4:
				if(ctx.flowMemory.hasTriggerEvent) {
					return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowNextTiming,"")];
				}
				return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowTriggerTextEvent(model_ver1_game_define_Event.ChangePhase),"")];
			default:
			}
		} else {
			switch(_g2._hx_index) {
			case 0:case 4:
				if(ctx.flowMemory.hasTriggerEvent) {
					return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowNextTiming,"")];
				}
				return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowTriggerTextEvent(model_ver1_game_define_Event.ChangePhase),"")];
			default:
			}
		}
		break;
	case 3:
		if(_g1._hx_index == 0) {
			switch(_g1.v._hx_index) {
			case 0:
				switch(_g2._hx_index) {
				case 2:
					if(ctx.flowMemory.hasTriggerEvent) {
						return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowNextTiming,"")];
					}
					break;
				case 0:case 4:
					if(ctx.flowMemory.hasTriggerEvent) {
						return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowNextTiming,"")];
					}
					return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowTriggerTextEvent(model_ver1_game_define_Event.ChangePhase),"")];
				default:
				}
				break;
			case 1:
				switch(_g2._hx_index) {
				case 2:
					if(ctx.flowMemory.hasTriggerEvent) {
						return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowNextTiming,"")];
					}
					break;
				case 0:case 4:
					if(ctx.flowMemory.hasTriggerEvent) {
						return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowNextTiming,"")];
					}
					return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowTriggerTextEvent(model_ver1_game_define_Event.ChangePhase),"")];
				default:
				}
				break;
			case 2:
				switch(_g2._hx_index) {
				case 2:
					if(ctx.flowMemory.hasTriggerEvent) {
						return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowNextTiming,"")];
					}
					break;
				case 0:case 4:
					if(ctx.flowMemory.hasTriggerEvent) {
						return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowNextTiming,"")];
					}
					return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowTriggerTextEvent(model_ver1_game_define_Event.ChangePhase),"")];
				default:
				}
				break;
			case 3:
				switch(_g2._hx_index) {
				case 2:
					if(ctx.flowMemory.hasTriggerEvent) {
						return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowNextTiming,"")];
					}
					break;
				case 0:case 4:
					if(ctx.flowMemory.hasTriggerEvent) {
						return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowNextTiming,"")];
					}
					return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowTriggerTextEvent(model_ver1_game_define_Event.ChangePhase),"")];
				default:
				}
				break;
			case 4:
				switch(_g2._hx_index) {
				case 0:case 4:
					if(ctx.flowMemory.hasTriggerEvent) {
						return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowNextTiming,"")];
					}
					return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowTriggerTextEvent(model_ver1_game_define_Event.ChangePhase),"")];
				case 5:
					break;
				case 6:
					break;
				case 7:
					break;
				case 8:
					if(ctx.flowMemory.hasTriggerEvent) {
						return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowNextTiming,"")];
					}
					return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowTriggerTextEvent(model_ver1_game_define_Event.ChangePhase),"")];
				default:
				}
				break;
			}
		} else {
			switch(_g2._hx_index) {
			case 0:case 4:
				if(ctx.flowMemory.hasTriggerEvent) {
					return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowNextTiming,"")];
				}
				return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowTriggerTextEvent(model_ver1_game_define_Event.ChangePhase),"")];
			default:
			}
		}
		break;
	default:
		switch(_g2._hx_index) {
		case 0:case 4:
			if(ctx.flowMemory.hasTriggerEvent) {
				return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowNextTiming,"")];
			}
			return [model_ver1_game_define_Flow.Default(model_ver1_game_define_FlowType.FlowTriggerTextEvent(model_ver1_game_define_Event.ChangePhase),"")];
		default:
		}
	}
	return [];
}
function model_ver1_game_define_Flow_hasSomeoneLiveIsZero(ctx) {
	return haxe_ds_Option.None;
}
function model_ver1_game_define_Flow_getActiveBlockId(ctx) {
	return haxe_ds_Option.None;
}
function model_ver1_game_define_Flow_getImmediateEffects(ctx) {
	return [];
}
function model_ver1_game_define_Flow_getClientCommand(ctx,playerId) {
	return [];
}
function model_ver1_game_define_Flow_addDrawRuleEffect(ctx) {
}
function model_ver1_game_define_Flow_addRerollRuleEffect(ctx) {
}
function model_ver1_game_define_Flow_test() {
}
var model_ver1_game_define_MarkEffect = $hxEnums["model.ver1.game.define.MarkEffect"] = { __ename__:true,__constructs__:null
	,AddBattlePoint: ($_=function(cardId,battlePoint) { return {_hx_index:0,cardId:cardId,battlePoint:battlePoint,__enum__:"model.ver1.game.define.MarkEffect",toString:$estr}; },$_._hx_name="AddBattlePoint",$_.__params__ = ["cardId","battlePoint"],$_)
	,AttackSpeed: ($_=function(cardId,speed) { return {_hx_index:1,cardId:cardId,speed:speed,__enum__:"model.ver1.game.define.MarkEffect",toString:$estr}; },$_._hx_name="AttackSpeed",$_.__params__ = ["cardId","speed"],$_)
	,AddText: ($_=function(cardId,text) { return {_hx_index:2,cardId:cardId,text:text,__enum__:"model.ver1.game.define.MarkEffect",toString:$estr}; },$_._hx_name="AddText",$_.__params__ = ["cardId","text"],$_)
	,EnterFieldThisTurn: ($_=function(cardId) { return {_hx_index:3,cardId:cardId,__enum__:"model.ver1.game.define.MarkEffect",toString:$estr}; },$_._hx_name="EnterFieldThisTurn",$_.__params__ = ["cardId"],$_)
	,CanNotReroll: ($_=function(cardId) { return {_hx_index:4,cardId:cardId,__enum__:"model.ver1.game.define.MarkEffect",toString:$estr}; },$_._hx_name="CanNotReroll",$_.__params__ = ["cardId"],$_)
};
model_ver1_game_define_MarkEffect.__constructs__ = [model_ver1_game_define_MarkEffect.AddBattlePoint,model_ver1_game_define_MarkEffect.AttackSpeed,model_ver1_game_define_MarkEffect.AddText,model_ver1_game_define_MarkEffect.EnterFieldThisTurn,model_ver1_game_define_MarkEffect.CanNotReroll];
var model_ver1_game_define_EnterFieldThisTurnMark = function(id,cardId) {
	model_ver1_game_define_Mark.call(this,id);
	this.cardId = cardId;
	this.age = 1;
};
$hxClasses["model.ver1.game.define.EnterFieldThisTurnMark"] = model_ver1_game_define_EnterFieldThisTurnMark;
model_ver1_game_define_EnterFieldThisTurnMark.__name__ = "model.ver1.game.define.EnterFieldThisTurnMark";
model_ver1_game_define_EnterFieldThisTurnMark.__super__ = model_ver1_game_define_Mark;
model_ver1_game_define_EnterFieldThisTurnMark.prototype = $extend(model_ver1_game_define_Mark.prototype,{
	getEffect: function(ctx) {
		return [model_ver1_game_define_MarkEffect.EnterFieldThisTurn(this.cardId)];
	}
	,getCLID: function() {
		return model_ver1_game_define_EnterFieldThisTurnMark.__clid;
	}
	,serialize: function(__ctx) {
		model_ver1_game_define_Mark.prototype.serialize.call(this,__ctx);
		var s = this.cardId;
		if(s == null) {
			__ctx.out.addByte(0);
		} else {
			var b = haxe_io_Bytes.ofString(s);
			var v = b.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			__ctx.out.add(b);
		}
	}
	,getSerializeSchema: function() {
		var schema = model_ver1_game_define_Mark.prototype.getSerializeSchema.call(this);
		schema.fieldsNames.push("cardId");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PString);
		schema.isFinal = hxbit_Serializer.isClassFinal(model_ver1_game_define_EnterFieldThisTurnMark.__clid);
		return schema;
	}
	,unserialize: function(__ctx) {
		model_ver1_game_define_Mark.prototype.unserialize.call(this,__ctx);
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			--len;
			var s = __ctx.input.getString(__ctx.inPos,len);
			__ctx.inPos += len;
			tmp = s;
		}
		this.cardId = tmp;
	}
	,__class__: model_ver1_game_define_EnterFieldThisTurnMark
});
var model_ver1_game_define_CanNotRerollMark = function(id,cardId) {
	model_ver1_game_define_Mark.call(this,id);
	this.cardId = cardId;
};
$hxClasses["model.ver1.game.define.CanNotRerollMark"] = model_ver1_game_define_CanNotRerollMark;
model_ver1_game_define_CanNotRerollMark.__name__ = "model.ver1.game.define.CanNotRerollMark";
model_ver1_game_define_CanNotRerollMark.__super__ = model_ver1_game_define_Mark;
model_ver1_game_define_CanNotRerollMark.prototype = $extend(model_ver1_game_define_Mark.prototype,{
	getEffect: function(ctx) {
		return [model_ver1_game_define_MarkEffect.CanNotReroll(this.cardId)];
	}
	,getCLID: function() {
		return model_ver1_game_define_CanNotRerollMark.__clid;
	}
	,serialize: function(__ctx) {
		model_ver1_game_define_Mark.prototype.serialize.call(this,__ctx);
		var s = this.cardId;
		if(s == null) {
			__ctx.out.addByte(0);
		} else {
			var b = haxe_io_Bytes.ofString(s);
			var v = b.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			__ctx.out.add(b);
		}
	}
	,getSerializeSchema: function() {
		var schema = model_ver1_game_define_Mark.prototype.getSerializeSchema.call(this);
		schema.fieldsNames.push("cardId");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PString);
		schema.isFinal = hxbit_Serializer.isClassFinal(model_ver1_game_define_CanNotRerollMark.__clid);
		return schema;
	}
	,unserialize: function(__ctx) {
		model_ver1_game_define_Mark.prototype.unserialize.call(this,__ctx);
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			--len;
			var s = __ctx.input.getString(__ctx.inPos,len);
			__ctx.inPos += len;
			tmp = s;
		}
		this.cardId = tmp;
	}
	,__class__: model_ver1_game_define_CanNotRerollMark
});
var model_ver1_game_define_PlayerId = {};
model_ver1_game_define_PlayerId._new = function(i) {
	var this1 = i;
	return this1;
};
model_ver1_game_define_PlayerId.fromString = function(s) {
	if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(s) != -1 == false) {
		throw haxe_Exception.thrown("playerId (" + s + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
	}
	var this1 = s;
	return this1;
};
model_ver1_game_define_PlayerId.getOpponentPlayerId = function(this1) {
	if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(this1) != -1 == false) {
		throw haxe_Exception.thrown("playerId (" + this1 + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
	}
	var this2 = this1;
	if(this2 == model_ver1_game_define_PlayerId.A) {
		return model_ver1_game_define_PlayerId.B;
	} else {
		return model_ver1_game_define_PlayerId.A;
	}
};
var model_ver1_game_define_RequireType = $hxEnums["model.ver1.game.define.RequireType"] = { __ename__:true,__constructs__:null
	,Pending: {_hx_name:"Pending",_hx_index:0,__enum__:"model.ver1.game.define.RequireType",toString:$estr}
	,SelectCard: ($_=function(tips,lengthInclude) { return {_hx_index:1,tips:tips,lengthInclude:lengthInclude,__enum__:"model.ver1.game.define.RequireType",toString:$estr}; },$_._hx_name="SelectCard",$_.__params__ = ["tips","lengthInclude"],$_)
	,SelectBattlePoint: ($_=function(tips) { return {_hx_index:2,tips:tips,__enum__:"model.ver1.game.define.RequireType",toString:$estr}; },$_._hx_name="SelectBattlePoint",$_.__params__ = ["tips"],$_)
};
model_ver1_game_define_RequireType.__constructs__ = [model_ver1_game_define_RequireType.Pending,model_ver1_game_define_RequireType.SelectCard,model_ver1_game_define_RequireType.SelectBattlePoint];
var model_ver1_game_define_TurnKeyword = $hxEnums["model.ver1.game.define.TurnKeyword"] = { __ename__:true,__constructs__:null
	,You: {_hx_name:"You",_hx_index:0,__enum__:"model.ver1.game.define.TurnKeyword",toString:$estr}
	,Opponent: {_hx_name:"Opponent",_hx_index:1,__enum__:"model.ver1.game.define.TurnKeyword",toString:$estr}
};
model_ver1_game_define_TurnKeyword.__constructs__ = [model_ver1_game_define_TurnKeyword.You,model_ver1_game_define_TurnKeyword.Opponent];
var model_ver1_game_define_PhaseKeyword = $hxEnums["model.ver1.game.define.PhaseKeyword"] = { __ename__:true,__constructs__:null
	,Reroll: {_hx_name:"Reroll",_hx_index:0,__enum__:"model.ver1.game.define.PhaseKeyword",toString:$estr}
	,Draw: {_hx_name:"Draw",_hx_index:1,__enum__:"model.ver1.game.define.PhaseKeyword",toString:$estr}
	,Maintenance: {_hx_name:"Maintenance",_hx_index:2,__enum__:"model.ver1.game.define.PhaseKeyword",toString:$estr}
	,Battle: {_hx_name:"Battle",_hx_index:3,__enum__:"model.ver1.game.define.PhaseKeyword",toString:$estr}
};
model_ver1_game_define_PhaseKeyword.__constructs__ = [model_ver1_game_define_PhaseKeyword.Reroll,model_ver1_game_define_PhaseKeyword.Draw,model_ver1_game_define_PhaseKeyword.Maintenance,model_ver1_game_define_PhaseKeyword.Battle];
var model_ver1_game_define_StepKeyword = $hxEnums["model.ver1.game.define.StepKeyword"] = { __ename__:true,__constructs__:null
	,Attack: {_hx_name:"Attack",_hx_index:0,__enum__:"model.ver1.game.define.StepKeyword",toString:$estr}
	,Defense: {_hx_name:"Defense",_hx_index:1,__enum__:"model.ver1.game.define.StepKeyword",toString:$estr}
	,DamageChecking: {_hx_name:"DamageChecking",_hx_index:2,__enum__:"model.ver1.game.define.StepKeyword",toString:$estr}
	,Return: {_hx_name:"Return",_hx_index:3,__enum__:"model.ver1.game.define.StepKeyword",toString:$estr}
	,End: {_hx_name:"End",_hx_index:4,__enum__:"model.ver1.game.define.StepKeyword",toString:$estr}
};
model_ver1_game_define_StepKeyword.__constructs__ = [model_ver1_game_define_StepKeyword.Attack,model_ver1_game_define_StepKeyword.Defense,model_ver1_game_define_StepKeyword.DamageChecking,model_ver1_game_define_StepKeyword.Return,model_ver1_game_define_StepKeyword.End];
var model_ver1_game_define_TimingKeyword = $hxEnums["model.ver1.game.define.TimingKeyword"] = { __ename__:true,__constructs__:null
	,Start: {_hx_name:"Start",_hx_index:0,__enum__:"model.ver1.game.define.TimingKeyword",toString:$estr}
	,Free1: {_hx_name:"Free1",_hx_index:1,__enum__:"model.ver1.game.define.TimingKeyword",toString:$estr}
	,Rule: {_hx_name:"Rule",_hx_index:2,__enum__:"model.ver1.game.define.TimingKeyword",toString:$estr}
	,Free2: {_hx_name:"Free2",_hx_index:3,__enum__:"model.ver1.game.define.TimingKeyword",toString:$estr}
	,End: {_hx_name:"End",_hx_index:4,__enum__:"model.ver1.game.define.TimingKeyword",toString:$estr}
	,DamageReset: {_hx_name:"DamageReset",_hx_index:5,__enum__:"model.ver1.game.define.TimingKeyword",toString:$estr}
	,ResolveEffect: {_hx_name:"ResolveEffect",_hx_index:6,__enum__:"model.ver1.game.define.TimingKeyword",toString:$estr}
	,AdjustHand: {_hx_name:"AdjustHand",_hx_index:7,__enum__:"model.ver1.game.define.TimingKeyword",toString:$estr}
	,TurnEnd: {_hx_name:"TurnEnd",_hx_index:8,__enum__:"model.ver1.game.define.TimingKeyword",toString:$estr}
};
model_ver1_game_define_TimingKeyword.__constructs__ = [model_ver1_game_define_TimingKeyword.Start,model_ver1_game_define_TimingKeyword.Free1,model_ver1_game_define_TimingKeyword.Rule,model_ver1_game_define_TimingKeyword.Free2,model_ver1_game_define_TimingKeyword.End,model_ver1_game_define_TimingKeyword.DamageReset,model_ver1_game_define_TimingKeyword.ResolveEffect,model_ver1_game_define_TimingKeyword.AdjustHand,model_ver1_game_define_TimingKeyword.TurnEnd];
var model_ver1_game_define_Timing = $hxEnums["model.ver1.game.define.Timing"] = { __ename__:true,__constructs__:null
	,Default: ($_=function(phase,step,timing) { return {_hx_index:0,phase:phase,step:step,timing:timing,__enum__:"model.ver1.game.define.Timing",toString:$estr}; },$_._hx_name="Default",$_.__params__ = ["phase","step","timing"],$_)
};
model_ver1_game_define_Timing.__constructs__ = [model_ver1_game_define_Timing.Default];
function model_ver1_test_Test_test() {
	model_ver1_game_Game_test();
	model_ver1_game_define_BaSyou_test();
	model_ver1_game_define_Flow_test();
	model_ver1_test_Test_$getRuntimeText_test();
	model_ver1_test_Test_test_getMarkEffects();
	model_ver1_test_Test_test_constantText();
	model_ver1_data_CardProto_$179030_$11E_$U_$VT186R_$purple_test();
	model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown_test();
}
function model_ver1_test_Test_test_constantText() {
	var playerId = model_ver1_game_define_PlayerId.A;
	var ctx = new model_ver1_game_define_Context();
	model_ver1_game_alg_CardProto_registerCardProto(ctx,"AddTextCardProto",new model_ver1_test_common_AddTextCardProto());
	model_ver1_game_alg_CardProto_registerCardProto(ctx,"OnlyConstentTextCardProto",new model_ver1_test_common_OnlyConstentTextCardProto());
	var card = new tool_Card("0");
	card.protoId = "AddTextCardProto";
	var runtime = new model_ver1_game_define_DefaultExecuteRuntime(card.id,playerId);
	var texts = model_ver1_game_alg_CardProto_getCurrentCardProto(ctx,card.protoId).getTexts(ctx,runtime);
	if(texts.length != 1) {
		throw haxe_Exception.thrown("確定卡的內文有1個");
	}
	var _g = texts[0].type;
	if(_g._hx_index == 0) {
		if(_g.type._hx_index == 2) {
			throw haxe_Exception.thrown("並且不是恆常能力");
		}
	}
	var baSyou = model_ver1_game_define_BaSyou.Default(model_ver1_game_define_PlayerId.A,model_ver1_game_define_BaSyouKeyword.TeHuTa);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	tool_Table_addCard(ctx.table,this1,card);
	if(model_ver1_game_alg_Runtime_getRuntimeText(ctx).length != 0) {
		throw new haxe_Exception("但找不到那個內文，因為在手牌中只有恆常能力可發動");
	}
	card.protoId = "OnlyConstentTextCardProto";
	texts = model_ver1_game_alg_CardProto_getCurrentCardProto(ctx,card.protoId).getTexts(ctx,runtime);
	if(texts.length != 1) {
		throw haxe_Exception.thrown("確定卡的內文有1個");
	}
	var _g = texts[0].type;
	if(_g._hx_index == 0) {
		if(_g.type._hx_index != 2) {
			throw haxe_Exception.thrown("並且是恆常能力");
		}
	} else {
		throw haxe_Exception.thrown("並且是恆常能力");
	}
	if(model_ver1_game_alg_Runtime_getRuntimeText(ctx).length != 1) {
		throw new haxe_Exception("必須找到1個恆常能力");
	}
}
function model_ver1_test_Test_test_getMarkEffects() {
	var ctx = new model_ver1_game_define_Context();
	model_ver1_game_alg_CardProto_registerCardProto(ctx,"AddTextCardProto",new model_ver1_test_common_AddTextCardProto());
	var card = new tool_Card("0");
	card.protoId = "AddTextCardProto";
	var baSyou = model_ver1_game_define_BaSyou.Default(model_ver1_game_define_PlayerId.A,model_ver1_game_define_BaSyouKeyword.MaintenanceArea);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	tool_Table_addCard(ctx.table,this1,card);
	if(model_ver1_game_alg_Runtime_getRuntimeText(ctx).length != 2) {
		throw new haxe_Exception("必須找到2個內文");
	}
	if(model_ver1_game_alg_Runtime_getMarkEffects(ctx).length != 1) {
		throw new haxe_Exception("必須找到1個效果");
	}
	var enterFieldMark = new model_ver1_game_define_EnterFieldThisTurnMark("EnterFieldThisTurnMark",card.id);
	ctx.marks.h[enterFieldMark.id] = enterFieldMark;
	if(model_ver1_game_alg_Runtime_getRuntimeText(ctx).length != 2) {
		throw new haxe_Exception("還是找到2個內文");
	}
	if(model_ver1_game_alg_Runtime_getMarkEffects(ctx).length != 2) {
		throw new haxe_Exception("找到2個效果");
	}
}
function model_ver1_test_Test_$getRuntimeText_test_getRuntimeText1() {
	var ctx = new model_ver1_game_define_Context();
	model_ver1_game_alg_CardProto_registerCardProto(ctx,"OnlyEmptyTextCardProto",new model_ver1_test_common_OnlyEmptyTextCardProto());
	if(model_ver1_game_alg_Runtime_getRuntimeText(ctx).length != 0) {
		throw new haxe_Exception("沒有任何牌時必須找不到內文");
	}
	var card = new tool_Card("0");
	card.protoId = "OnlyEmptyTextCardProto";
	var baSyou = model_ver1_game_define_BaSyou.Default(model_ver1_game_define_PlayerId.A,model_ver1_game_define_BaSyouKeyword.MaintenanceArea);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	tool_Table_addCard(ctx.table,this1,card);
	if(model_ver1_game_alg_Runtime_getRuntimeText(ctx).length != 1) {
		throw new haxe_Exception("必須找到1個內文");
	}
}
function model_ver1_test_Test_$getRuntimeText_test_getRuntimeText2() {
	var ctx = new model_ver1_game_define_Context();
	model_ver1_game_alg_CardProto_registerCardProto(ctx,"AddTextCardProto",new model_ver1_test_common_AddTextCardProto());
	var card = new tool_Card("0");
	card.protoId = "AddTextCardProto";
	var baSyou = model_ver1_game_define_BaSyou.Default(model_ver1_game_define_PlayerId.A,model_ver1_game_define_BaSyouKeyword.MaintenanceArea);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	tool_Table_addCard(ctx.table,this1,card);
	if(model_ver1_game_alg_Runtime_getRuntimeText(ctx).length != 2) {
		throw new haxe_Exception("必須找到2個內文");
	}
}
function model_ver1_test_Test_$getRuntimeText_test() {
	model_ver1_test_Test_$getRuntimeText_test_getRuntimeText1();
	model_ver1_test_Test_$getRuntimeText_test_getRuntimeText2();
}
var model_ver1_test_common_OnlyEmptyTextCardProto = function() {
	model_ver1_game_define_CardProto.call(this);
};
$hxClasses["model.ver1.test.common.OnlyEmptyTextCardProto"] = model_ver1_test_common_OnlyEmptyTextCardProto;
model_ver1_test_common_OnlyEmptyTextCardProto.__name__ = "model.ver1.test.common.OnlyEmptyTextCardProto";
model_ver1_test_common_OnlyEmptyTextCardProto.__super__ = model_ver1_game_define_CardProto;
model_ver1_test_common_OnlyEmptyTextCardProto.prototype = $extend(model_ver1_game_define_CardProto.prototype,{
	getTexts: function(ctx,runtime) {
		var thisCardId = runtime.getCardId();
		return [new model_ver1_game_define_CardText("" + thisCardId + "_CardText","")];
	}
	,getCLID: function() {
		return model_ver1_test_common_OnlyEmptyTextCardProto.__clid;
	}
	,__class__: model_ver1_test_common_OnlyEmptyTextCardProto
});
var model_ver1_test_common_AddOneTextText = function(id) {
	model_ver1_game_define_CardText.call(this,id,"AddOneTextText");
};
$hxClasses["model.ver1.test.common.AddOneTextText"] = model_ver1_test_common_AddOneTextText;
model_ver1_test_common_AddOneTextText.__name__ = "model.ver1.test.common.AddOneTextText";
model_ver1_test_common_AddOneTextText.__super__ = model_ver1_game_define_CardText;
model_ver1_test_common_AddOneTextText.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	getEffect: function(ctx,runtime) {
		var thisCardId = runtime.getCardId();
		return [model_ver1_game_define_MarkEffect.AddText(thisCardId,new model_ver1_game_define_CardText("" + thisCardId + "_EmptyText",""))];
	}
	,getCLID: function() {
		return model_ver1_test_common_AddOneTextText.__clid;
	}
	,__class__: model_ver1_test_common_AddOneTextText
});
var model_ver1_test_common_AddTextCardProto = function() {
	model_ver1_game_define_CardProto.call(this);
};
$hxClasses["model.ver1.test.common.AddTextCardProto"] = model_ver1_test_common_AddTextCardProto;
model_ver1_test_common_AddTextCardProto.__name__ = "model.ver1.test.common.AddTextCardProto";
model_ver1_test_common_AddTextCardProto.__super__ = model_ver1_game_define_CardProto;
model_ver1_test_common_AddTextCardProto.prototype = $extend(model_ver1_game_define_CardProto.prototype,{
	getTexts: function(ctx,runtime) {
		var thisCardId = runtime.getCardId();
		return [new model_ver1_test_common_AddOneTextText("" + thisCardId + "_TestText2")];
	}
	,getCLID: function() {
		return model_ver1_test_common_AddTextCardProto.__clid;
	}
	,__class__: model_ver1_test_common_AddTextCardProto
});
var model_ver1_test_common_OnlyConstentTextCardProto = function() {
	model_ver1_game_define_CardProto.call(this);
};
$hxClasses["model.ver1.test.common.OnlyConstentTextCardProto"] = model_ver1_test_common_OnlyConstentTextCardProto;
model_ver1_test_common_OnlyConstentTextCardProto.__name__ = "model.ver1.test.common.OnlyConstentTextCardProto";
model_ver1_test_common_OnlyConstentTextCardProto.__super__ = model_ver1_game_define_CardProto;
model_ver1_test_common_OnlyConstentTextCardProto.prototype = $extend(model_ver1_game_define_CardProto.prototype,{
	getTexts: function(ctx,runtime) {
		var thisCardId = runtime.getCardId();
		var text = new model_ver1_game_define_CardText("" + thisCardId + "_TestText","");
		text.type = model_ver1_game_define_TextType.Automatic(model_ver1_game_define_TextTypeAutomaticType.Constant);
		return [text];
	}
	,getCLID: function() {
		return model_ver1_test_common_OnlyConstentTextCardProto.__clid;
	}
	,__class__: model_ver1_test_common_OnlyConstentTextCardProto
});
function tool_Helper_getMemonto(obj) {
	var s = new hxbit_Serializer();
	var bytes = s.serialize(obj);
	return bytes.toHex();
}
function tool_Helper_ofMemonto(memonto,clz) {
	var u = new hxbit_Serializer();
	return u.unserialize(haxe_io_Bytes.ofHex(memonto),clz);
}
var tool_Card = function(id) {
	this.__uid = hxbit_Serializer.SEQ << 24 | ++hxbit_Serializer.UID;
	this.isReverse = false;
	this.isTap = false;
	this.isFaceUp = false;
	this.id = id;
};
$hxClasses["tool.Card"] = tool_Card;
tool_Card.__name__ = "tool.Card";
tool_Card.__interfaces__ = [hxbit_Serializable];
tool_Card.prototype = {
	getCLID: function() {
		return tool_Card.__clid;
	}
	,serialize: function(__ctx) {
		var s = this.id;
		if(s == null) {
			__ctx.out.addByte(0);
		} else {
			var b = haxe_io_Bytes.ofString(s);
			var v = b.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			__ctx.out.add(b);
		}
		__ctx.out.addByte(this.isFaceUp ? 1 : 0);
		__ctx.out.addByte(this.isTap ? 1 : 0);
		__ctx.out.addByte(this.isReverse ? 1 : 0);
		var s = this.protoId;
		if(s == null) {
			__ctx.out.addByte(0);
		} else {
			var b = haxe_io_Bytes.ofString(s);
			var v = b.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			__ctx.out.add(b);
		}
		var s = this.owner;
		if(s == null) {
			__ctx.out.addByte(0);
		} else {
			var b = haxe_io_Bytes.ofString(s);
			var v = b.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			__ctx.out.add(b);
		}
	}
	,getSerializeSchema: function() {
		var schema = new hxbit_Schema();
		schema.fieldsNames.push("id");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PString);
		schema.fieldsNames.push("isFaceUp");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PBool);
		schema.fieldsNames.push("isTap");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PBool);
		schema.fieldsNames.push("isReverse");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PBool);
		schema.fieldsNames.push("protoId");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PString);
		schema.fieldsNames.push("owner");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PString);
		schema.isFinal = hxbit_Serializer.isClassFinal(tool_Card.__clid);
		return schema;
	}
	,unserializeInit: function() {
		this.isFaceUp = false;
		this.isTap = false;
		this.isReverse = false;
	}
	,unserialize: function(__ctx) {
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			--len;
			var s = __ctx.input.getString(__ctx.inPos,len);
			__ctx.inPos += len;
			tmp = s;
		}
		this.id = tmp;
		this.isFaceUp = __ctx.input.b[__ctx.inPos++] != 0;
		this.isTap = __ctx.input.b[__ctx.inPos++] != 0;
		this.isReverse = __ctx.input.b[__ctx.inPos++] != 0;
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			--len;
			var s = __ctx.input.getString(__ctx.inPos,len);
			__ctx.inPos += len;
			tmp = s;
		}
		this.protoId = tmp;
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			--len;
			var s = __ctx.input.getString(__ctx.inPos,len);
			__ctx.inPos += len;
			tmp = s;
		}
		this.owner = tmp;
	}
	,__class__: tool_Card
};
var tool_CardStack = function(id) {
	this.__uid = hxbit_Serializer.SEQ << 24 | ++hxbit_Serializer.UID;
	this.cardIds = [];
	this.id = id;
};
$hxClasses["tool.CardStack"] = tool_CardStack;
tool_CardStack.__name__ = "tool.CardStack";
tool_CardStack.__interfaces__ = [hxbit_Serializable];
tool_CardStack.prototype = {
	getCLID: function() {
		return tool_CardStack.__clid;
	}
	,serialize: function(__ctx) {
		var s = this.id;
		if(s == null) {
			__ctx.out.addByte(0);
		} else {
			var b = haxe_io_Bytes.ofString(s);
			var v = b.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			__ctx.out.add(b);
		}
		var a = this.cardIds;
		if(a == null) {
			__ctx.out.addByte(0);
		} else {
			var v = a.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			var _g = 0;
			while(_g < a.length) {
				var v = a[_g];
				++_g;
				if(v == null) {
					__ctx.out.addByte(0);
				} else {
					var b = haxe_io_Bytes.ofString(v);
					var v1 = b.length + 1;
					if(v1 >= 0 && v1 < 128) {
						__ctx.out.addByte(v1);
					} else {
						__ctx.out.addByte(128);
						__ctx.out.addInt32(v1);
					}
					__ctx.out.add(b);
				}
			}
		}
	}
	,getSerializeSchema: function() {
		var schema = new hxbit_Schema();
		schema.fieldsNames.push("id");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PString);
		schema.fieldsNames.push("cardIds");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PArray(hxbit_PropTypeDesc.PString));
		schema.isFinal = hxbit_Serializer.isClassFinal(tool_CardStack.__clid);
		return schema;
	}
	,unserializeInit: function() {
		this.cardIds = [];
	}
	,unserialize: function(__ctx) {
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			--len;
			var s = __ctx.input.getString(__ctx.inPos,len);
			__ctx.inPos += len;
			tmp = s;
		}
		this.id = tmp;
		var e0;
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			--len;
			var a = [];
			var _g = 0;
			var _g1 = len;
			while(_g < _g1) {
				var i = _g++;
				var v = __ctx.input.b[__ctx.inPos++];
				if(v == 128) {
					v = __ctx.input.getInt32(__ctx.inPos);
					__ctx.inPos += 4;
				}
				var len = v;
				if(len == 0) {
					e0 = null;
				} else {
					--len;
					var s = __ctx.input.getString(__ctx.inPos,len);
					__ctx.inPos += len;
					e0 = s;
				}
				a[i] = e0;
			}
			tmp = a;
		}
		this.cardIds = tmp;
	}
	,__class__: tool_CardStack
};
var tool_Table = function() {
	this.__uid = hxbit_Serializer.SEQ << 24 | ++hxbit_Serializer.UID;
	this.cardStacks = new haxe_ds_StringMap();
	this.cards = new haxe_ds_StringMap();
};
$hxClasses["tool.Table"] = tool_Table;
tool_Table.__name__ = "tool.Table";
tool_Table.__interfaces__ = [hxbit_Serializable];
tool_Table.prototype = {
	getCLID: function() {
		return tool_Table.__clid;
	}
	,serialize: function(__ctx) {
		var a = this.cards;
		if(a == null) {
			__ctx.out.addByte(0);
		} else {
			var _g = [];
			var h = a.h;
			var k_h = h;
			var k_keys = Object.keys(h);
			var k_length = k_keys.length;
			var k_current = 0;
			while(k_current < k_length) {
				var k = k_keys[k_current++];
				_g.push(k);
			}
			var keys = _g;
			var v = keys.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			var _g = 0;
			while(_g < keys.length) {
				var k = keys[_g];
				++_g;
				if(k == null) {
					__ctx.out.addByte(0);
				} else {
					var b = haxe_io_Bytes.ofString(k);
					var v = b.length + 1;
					if(v >= 0 && v < 128) {
						__ctx.out.addByte(v);
					} else {
						__ctx.out.addByte(128);
						__ctx.out.addInt32(v);
					}
					__ctx.out.add(b);
				}
				__ctx.addKnownRef(a.h[k]);
			}
		}
		var a = this.cardStacks;
		if(a == null) {
			__ctx.out.addByte(0);
		} else {
			var _g = [];
			var h = a.h;
			var k_h = h;
			var k_keys = Object.keys(h);
			var k_length = k_keys.length;
			var k_current = 0;
			while(k_current < k_length) {
				var k = k_keys[k_current++];
				_g.push(k);
			}
			var keys = _g;
			var v = keys.length + 1;
			if(v >= 0 && v < 128) {
				__ctx.out.addByte(v);
			} else {
				__ctx.out.addByte(128);
				__ctx.out.addInt32(v);
			}
			var _g = 0;
			while(_g < keys.length) {
				var k = keys[_g];
				++_g;
				if(k == null) {
					__ctx.out.addByte(0);
				} else {
					var b = haxe_io_Bytes.ofString(k);
					var v = b.length + 1;
					if(v >= 0 && v < 128) {
						__ctx.out.addByte(v);
					} else {
						__ctx.out.addByte(128);
						__ctx.out.addInt32(v);
					}
					__ctx.out.add(b);
				}
				__ctx.addKnownRef(a.h[k]);
			}
		}
	}
	,getSerializeSchema: function() {
		var schema = new hxbit_Schema();
		schema.fieldsNames.push("cards");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PMap(hxbit_PropTypeDesc.PString,hxbit_PropTypeDesc.PSerializable("tool.Card")));
		schema.fieldsNames.push("cardStacks");
		schema.fieldsTypes.push(hxbit_PropTypeDesc.PMap(hxbit_PropTypeDesc.PString,hxbit_PropTypeDesc.PSerializable("tool.CardStack")));
		schema.isFinal = hxbit_Serializer.isClassFinal(tool_Table.__clid);
		return schema;
	}
	,unserializeInit: function() {
		this.cards = new haxe_ds_StringMap();
		this.cardStacks = new haxe_ds_StringMap();
	}
	,unserialize: function(__ctx) {
		var k0;
		var v0;
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			var m = new haxe_ds_StringMap();
			while(--len > 0) {
				var v = __ctx.input.b[__ctx.inPos++];
				if(v == 128) {
					v = __ctx.input.getInt32(__ctx.inPos);
					__ctx.inPos += 4;
				}
				var len1 = v;
				if(len1 == 0) {
					k0 = null;
				} else {
					--len1;
					var s = __ctx.input.getString(__ctx.inPos,len1);
					__ctx.inPos += len1;
					k0 = s;
				}
				var k = k0;
				v0 = __ctx.getRef(tool_Card,tool_Card.__clid);
				var v1 = v0;
				m.h[k] = v1;
			}
			tmp = m;
		}
		this.cards = tmp;
		var k0;
		var v0;
		var v = __ctx.input.b[__ctx.inPos++];
		if(v == 128) {
			v = __ctx.input.getInt32(__ctx.inPos);
			__ctx.inPos += 4;
		}
		var len = v;
		var tmp;
		if(len == 0) {
			tmp = null;
		} else {
			var m = new haxe_ds_StringMap();
			while(--len > 0) {
				var v = __ctx.input.b[__ctx.inPos++];
				if(v == 128) {
					v = __ctx.input.getInt32(__ctx.inPos);
					__ctx.inPos += 4;
				}
				var len1 = v;
				if(len1 == 0) {
					k0 = null;
				} else {
					--len1;
					var s = __ctx.input.getString(__ctx.inPos,len1);
					__ctx.inPos += len1;
					k0 = s;
				}
				var k = k0;
				v0 = __ctx.getRef(tool_CardStack,tool_CardStack.__clid);
				var v1 = v0;
				m.h[k] = v1;
			}
			tmp = m;
		}
		this.cardStacks = tmp;
	}
	,__class__: tool_Table
};
function tool_Table_addCard(table,cardStackId,card) {
	if(table.cards.h[card.id] != null) {
		throw new haxe_Exception("card key already exist. " + card.id);
	}
	if(table.cardStacks.h[cardStackId] == null) {
		var this1 = table.cardStacks;
		var v = new tool_CardStack(cardStackId);
		this1.h[cardStackId] = v;
	}
	table.cards.h[card.id] = card;
	table.cardStacks.h[cardStackId].cardIds.push(card.id);
}
function tool_Table_getCard(table,cardId) {
	var card = table.cards.h[cardId];
	if(card == null) {
		throw new haxe_Exception("card not found: " + cardId);
	}
	return card;
}
function tool_Table_getCardStack(table,cardStackId) {
	var ret = table.cardStacks.h[cardStackId];
	if(ret == null) {
		throw new haxe_Exception("cardStack not found: " + cardStackId);
	}
	return ret;
}
function tool_Table_getCardCardStack(table,cardId) {
	var _g = [];
	var h = table.cardStacks.h;
	var cs_h = h;
	var cs_keys = Object.keys(h);
	var cs_length = cs_keys.length;
	var cs_current = 0;
	while(cs_current < cs_length) {
		var cs = cs_h[cs_keys[cs_current++]];
		_g.push(cs);
	}
	var _g1 = [];
	var _g2 = 0;
	var _g3 = _g;
	while(_g2 < _g3.length) {
		var v = _g3[_g2];
		++_g2;
		if(v.cardIds.indexOf(cardId) != -1) {
			_g1.push(v);
		}
	}
	var findCs = _g1;
	if(findCs.length == 0) {
		return haxe_ds_Option.None;
	}
	return haxe_ds_Option.Some(findCs[0]);
}
function tool_Table_moveCard(table,cardId,fromId,toId) {
	if(tool_Table_getCardStack(table,fromId).cardIds.indexOf(cardId) != -1 == false) {
		throw new haxe_Exception("card not found: " + fromId + " > " + cardId);
	}
	HxOverrides.remove(tool_Table_getCardStack(table,fromId).cardIds,cardId);
	tool_Table_getCardStack(table,toId).cardIds.push(cardId);
}
function $getIterator(o) { if( o instanceof Array ) return new haxe_iterators_ArrayIterator(o); else return o.iterator(); }
$global.$haxeUID |= 0;
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
$hxClasses["Math"] = Math;
if( String.fromCodePoint == null ) String.fromCodePoint = function(c) { return c < 0x10000 ? String.fromCharCode(c) : String.fromCharCode((c>>10)+0xD7C0)+String.fromCharCode((c&0x3FF)+0xDC00); }
String.prototype.__class__ = $hxClasses["String"] = String;
String.__name__ = "String";
$hxClasses["Array"] = Array;
Array.__name__ = "Array";
Date.prototype.__class__ = $hxClasses["Date"] = Date;
Date.__name__ = "Date";
haxe_ds_ObjectMap.count = 0;
js_Boot.__toStr = ({ }).toString;
if(ArrayBuffer.prototype.slice == null) {
	ArrayBuffer.prototype.slice = js_lib__$ArrayBuffer_ArrayBufferCompat.sliceImpl;
}
hxbit_Convert.convFuns = new haxe_ds_StringMap();
hxbit_Macros.IN_ENUM_SER = false;
hxbit_Serializer.UID = 0;
hxbit_Serializer.SEQ = 0;
hxbit_Serializer.SEQ_BITS = 8;
hxbit_Serializer.SEQ_MASK = 16777215;
hxbit_Serializer.CLASSES = [];
hxbit_Serializer.ENUM_CLASSES = new haxe_ds_StringMap();
hxbit_Schema.__clid = hxbit_Serializer.registerClass(hxbit_Schema);
model_ver1_game_define_CardProto.__clid = hxbit_Serializer.registerClass(model_ver1_game_define_CardProto);
model_ver1_data_CardProto_$179001_$01A_$CH_$WT007R_$white.__clid = hxbit_Serializer.registerClass(model_ver1_data_CardProto_$179001_$01A_$CH_$WT007R_$white);
model_ver1_game_define_CardText.__clid = hxbit_Serializer.registerClass(model_ver1_game_define_CardText);
model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Text1.__clid = hxbit_Serializer.registerClass(model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Text1);
model_ver1_game_define_Mark.__clid = hxbit_Serializer.registerClass(model_ver1_game_define_Mark);
model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Mark1.__clid = hxbit_Serializer.registerClass(model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Mark1);
model_ver1_data_CardProto_$179003_$01A_$U_$BK008U_$black.__clid = hxbit_Serializer.registerClass(model_ver1_data_CardProto_$179003_$01A_$U_$BK008U_$black);
model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text1.__clid = hxbit_Serializer.registerClass(model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text1);
model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text2.__clid = hxbit_Serializer.registerClass(model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text2);
model_ver1_data_CardProto_$179004_$01A_$CH_$WT009R_$white.__clid = hxbit_Serializer.registerClass(model_ver1_data_CardProto_$179004_$01A_$CH_$WT009R_$white);
model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1.__clid = hxbit_Serializer.registerClass(model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1);
model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1_$1.__clid = hxbit_Serializer.registerClass(model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1_$1);
model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Mark1.__clid = hxbit_Serializer.registerClass(model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Mark1);
model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown.__clid = hxbit_Serializer.registerClass(model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown);
model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Text1.__clid = hxbit_Serializer.registerClass(model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Text1);
model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Process1.__clid = hxbit_Serializer.registerClass(model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Process1);
model_ver1_data_CardProto_$179030_$11E_$U_$VT186R_$purple.__clid = hxbit_Serializer.registerClass(model_ver1_data_CardProto_$179030_$11E_$U_$VT186R_$purple);
model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Text1.__clid = hxbit_Serializer.registerClass(model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Text1);
model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Process1.__clid = hxbit_Serializer.registerClass(model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Process1);
model_ver1_data_PlayerPlayCard.__clid = hxbit_Serializer.registerClass(model_ver1_data_PlayerPlayCard);
model_ver1_data__$PlayerPlayCard_EnterFieldEffect.__clid = hxbit_Serializer.registerClass(model_ver1_data__$PlayerPlayCard_EnterFieldEffect);
model_ver1_data_PlayerPlayG.__clid = hxbit_Serializer.registerClass(model_ver1_data_PlayerPlayG);
model_ver1_game_Game.__clid = hxbit_Serializer.registerClass(model_ver1_game_Game);
var model_ver1_game_data_DataBinding__cardProtoPool = (function($this) {
	var $r;
	var _g = new haxe_ds_StringMap();
	{
		var value = new model_ver1_data_CardProto_$179001_$01A_$CH_$WT007R_$white();
		_g.h["179001_01A_CH_WT007R_white"] = value;
	}
	{
		var value = new model_ver1_data_CardProto_$179003_$01A_$U_$BK008U_$black();
		_g.h["179003_01A_U_BK008U_black"] = value;
	}
	{
		var value = new model_ver1_data_CardProto_$179004_$01A_$CH_$WT009R_$white();
		_g.h["179004_01A_CH_WT009R_white"] = value;
	}
	{
		var value = new model_ver1_data_CardProto_$179030_$11E_$U_$VT186R_$purple();
		_g.h["179030_11E_U_VT186R_purple"] = value;
	}
	{
		var value = new model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown();
		_g.h["179030_11E_CH_BN091N_brown"] = value;
	}
	$r = _g;
	return $r;
}(this));
model_ver1_game_define_BaSyouId._split = "@@@";
model_ver1_game_define_Block.__clid = hxbit_Serializer.registerClass(model_ver1_game_define_Block);
model_ver1_game_define_Context.__clid = hxbit_Serializer.registerClass(model_ver1_game_define_Context);
model_ver1_game_define_EnterFieldThisTurnMark.__clid = hxbit_Serializer.registerClass(model_ver1_game_define_EnterFieldThisTurnMark);
model_ver1_game_define_CanNotRerollMark.__clid = hxbit_Serializer.registerClass(model_ver1_game_define_CanNotRerollMark);
model_ver1_game_define_PlayerId.A = (function($this) {
	var $r;
	var this1 = "A";
	$r = this1;
	return $r;
}(this));
model_ver1_game_define_PlayerId.B = (function($this) {
	var $r;
	var this1 = "B";
	$r = this1;
	return $r;
}(this));
var model_ver1_game_define_Timing_TIMINGS = [model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Reroll,haxe_ds_Option.None,model_ver1_game_define_TimingKeyword.Start),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Reroll,haxe_ds_Option.None,model_ver1_game_define_TimingKeyword.Rule),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Reroll,haxe_ds_Option.None,model_ver1_game_define_TimingKeyword.Free2),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Reroll,haxe_ds_Option.None,model_ver1_game_define_TimingKeyword.End),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Draw,haxe_ds_Option.None,model_ver1_game_define_TimingKeyword.Start),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Draw,haxe_ds_Option.None,model_ver1_game_define_TimingKeyword.Free1),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Draw,haxe_ds_Option.None,model_ver1_game_define_TimingKeyword.Rule),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Draw,haxe_ds_Option.None,model_ver1_game_define_TimingKeyword.Free2),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Draw,haxe_ds_Option.None,model_ver1_game_define_TimingKeyword.End),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Maintenance,haxe_ds_Option.None,model_ver1_game_define_TimingKeyword.Start),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Maintenance,haxe_ds_Option.None,model_ver1_game_define_TimingKeyword.Free1),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Maintenance,haxe_ds_Option.None,model_ver1_game_define_TimingKeyword.End),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.Attack),model_ver1_game_define_TimingKeyword.Start),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.Attack),model_ver1_game_define_TimingKeyword.Free1),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.Attack),model_ver1_game_define_TimingKeyword.Rule),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.Attack),model_ver1_game_define_TimingKeyword.Free2),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.Attack),model_ver1_game_define_TimingKeyword.End),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.Defense),model_ver1_game_define_TimingKeyword.Start),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.Defense),model_ver1_game_define_TimingKeyword.Free1),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.Defense),model_ver1_game_define_TimingKeyword.Rule),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.Defense),model_ver1_game_define_TimingKeyword.Free2),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.Defense),model_ver1_game_define_TimingKeyword.End),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.DamageChecking),model_ver1_game_define_TimingKeyword.Start),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.DamageChecking),model_ver1_game_define_TimingKeyword.Free1),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.DamageChecking),model_ver1_game_define_TimingKeyword.Rule),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.DamageChecking),model_ver1_game_define_TimingKeyword.Free2),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.DamageChecking),model_ver1_game_define_TimingKeyword.End),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.Return),model_ver1_game_define_TimingKeyword.Start),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.Return),model_ver1_game_define_TimingKeyword.Free1),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.Return),model_ver1_game_define_TimingKeyword.Rule),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.Return),model_ver1_game_define_TimingKeyword.Free2),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.End),model_ver1_game_define_TimingKeyword.DamageReset),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.End),model_ver1_game_define_TimingKeyword.ResolveEffect),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.End),model_ver1_game_define_TimingKeyword.AdjustHand),model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.End),model_ver1_game_define_TimingKeyword.TurnEnd)];
model_ver1_test_common_OnlyEmptyTextCardProto.__clid = hxbit_Serializer.registerClass(model_ver1_test_common_OnlyEmptyTextCardProto);
model_ver1_test_common_AddOneTextText.__clid = hxbit_Serializer.registerClass(model_ver1_test_common_AddOneTextText);
model_ver1_test_common_AddTextCardProto.__clid = hxbit_Serializer.registerClass(model_ver1_test_common_AddTextCardProto);
model_ver1_test_common_OnlyConstentTextCardProto.__clid = hxbit_Serializer.registerClass(model_ver1_test_common_OnlyConstentTextCardProto);
tool_Card.__clid = hxbit_Serializer.registerClass(tool_Card);
tool_CardStack.__clid = hxbit_Serializer.registerClass(tool_CardStack);
tool_Table.__clid = hxbit_Serializer.registerClass(tool_Table);
Test.main();
})(typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
