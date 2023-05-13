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
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d["setTime"](0);
		d["setUTCHours"](k[0]);
		d["setUTCMinutes"](k[1]);
		d["setUTCSeconds"](k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw haxe_Exception.thrown("Invalid date format : " + s);
	}
};
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
Lambda.exists = function(it,f) {
	var x = $getIterator(it);
	while(x.hasNext()) {
		var x1 = x.next();
		if(f(x1)) {
			return true;
		}
	}
	return false;
};
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
Reflect.deleteField = function(o,field) {
	if(!Object.prototype.hasOwnProperty.call(o,field)) {
		return false;
	}
	delete(o[field]);
	return true;
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = "Std";
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = "StringBuf";
StringBuf.prototype = {
	__class__: StringBuf
};
var Test = function() { };
$hxClasses["Test"] = Test;
Test.__name__ = "Test";
Test.main = function() {
	console.log("src/Test.hx:5:","==== Test Start ====");
	model_ver1_test_Test_test();
	console.log("src/Test.hx:7:","==== Test Pass ====");
};
var ValueType = $hxEnums["ValueType"] = { __ename__:"ValueType",__constructs__:null
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
var haxe_Serializer = function() {
	this.buf = new StringBuf();
	this.cache = [];
	this.useCache = haxe_Serializer.USE_CACHE;
	this.useEnumIndex = haxe_Serializer.USE_ENUM_INDEX;
	this.shash = new haxe_ds_StringMap();
	this.scount = 0;
};
$hxClasses["haxe.Serializer"] = haxe_Serializer;
haxe_Serializer.__name__ = "haxe.Serializer";
haxe_Serializer.run = function(v) {
	var s = new haxe_Serializer();
	s.serialize(v);
	return s.toString();
};
haxe_Serializer.prototype = {
	toString: function() {
		return this.buf.b;
	}
	,serializeString: function(s) {
		var x = this.shash.h[s];
		if(x != null) {
			this.buf.b += "R";
			this.buf.b += x == null ? "null" : "" + x;
			return;
		}
		this.shash.h[s] = this.scount++;
		this.buf.b += "y";
		s = encodeURIComponent(s);
		this.buf.b += Std.string(s.length);
		this.buf.b += ":";
		this.buf.b += s == null ? "null" : "" + s;
	}
	,serializeRef: function(v) {
		var vt = typeof(v);
		var _g = 0;
		var _g1 = this.cache.length;
		while(_g < _g1) {
			var i = _g++;
			var ci = this.cache[i];
			if(typeof(ci) == vt && ci == v) {
				this.buf.b += "r";
				this.buf.b += i == null ? "null" : "" + i;
				return true;
			}
		}
		this.cache.push(v);
		return false;
	}
	,serializeFields: function(v) {
		var _g = 0;
		var _g1 = Reflect.fields(v);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			this.serializeString(f);
			this.serialize(Reflect.field(v,f));
		}
		this.buf.b += "g";
	}
	,serialize: function(v) {
		var _g = Type.typeof(v);
		switch(_g._hx_index) {
		case 0:
			this.buf.b += "n";
			break;
		case 1:
			var v1 = v;
			if(v1 == 0) {
				this.buf.b += "z";
				return;
			}
			this.buf.b += "i";
			this.buf.b += v1 == null ? "null" : "" + v1;
			break;
		case 2:
			var v1 = v;
			if(isNaN(v1)) {
				this.buf.b += "k";
			} else if(!isFinite(v1)) {
				this.buf.b += v1 < 0 ? "m" : "p";
			} else {
				this.buf.b += "d";
				this.buf.b += v1 == null ? "null" : "" + v1;
			}
			break;
		case 3:
			this.buf.b += v ? "t" : "f";
			break;
		case 4:
			if(js_Boot.__instanceof(v,Class)) {
				var className = v.__name__;
				this.buf.b += "A";
				this.serializeString(className);
			} else if(js_Boot.__instanceof(v,Enum)) {
				this.buf.b += "B";
				this.serializeString(v.__ename__);
			} else {
				if(this.useCache && this.serializeRef(v)) {
					return;
				}
				this.buf.b += "o";
				this.serializeFields(v);
			}
			break;
		case 5:
			throw haxe_Exception.thrown("Cannot serialize function");
		case 6:
			var c = _g.c;
			if(c == String) {
				this.serializeString(v);
				return;
			}
			if(this.useCache && this.serializeRef(v)) {
				return;
			}
			switch(c) {
			case Array:
				var ucount = 0;
				this.buf.b += "a";
				var l = v["length"];
				var _g1 = 0;
				var _g2 = l;
				while(_g1 < _g2) {
					var i = _g1++;
					if(v[i] == null) {
						++ucount;
					} else {
						if(ucount > 0) {
							if(ucount == 1) {
								this.buf.b += "n";
							} else {
								this.buf.b += "u";
								this.buf.b += ucount == null ? "null" : "" + ucount;
							}
							ucount = 0;
						}
						this.serialize(v[i]);
					}
				}
				if(ucount > 0) {
					if(ucount == 1) {
						this.buf.b += "n";
					} else {
						this.buf.b += "u";
						this.buf.b += ucount == null ? "null" : "" + ucount;
					}
				}
				this.buf.b += "h";
				break;
			case Date:
				var d = v;
				this.buf.b += "v";
				this.buf.b += Std.string(d.getTime());
				break;
			case haxe_ds_IntMap:
				this.buf.b += "q";
				var v1 = v;
				var k = v1.keys();
				while(k.hasNext()) {
					var k1 = k.next();
					this.buf.b += ":";
					this.buf.b += k1 == null ? "null" : "" + k1;
					this.serialize(v1.h[k1]);
				}
				this.buf.b += "h";
				break;
			case haxe_ds_List:
				this.buf.b += "l";
				var v1 = v;
				var _g_head = v1.h;
				while(_g_head != null) {
					var val = _g_head.item;
					_g_head = _g_head.next;
					var i = val;
					this.serialize(i);
				}
				this.buf.b += "h";
				break;
			case haxe_ds_ObjectMap:
				this.buf.b += "M";
				var v1 = v;
				var k = v1.keys();
				while(k.hasNext()) {
					var k1 = k.next();
					var id = Reflect.field(k1,"__id__");
					Reflect.deleteField(k1,"__id__");
					this.serialize(k1);
					k1["__id__"] = id;
					this.serialize(v1.h[k1.__id__]);
				}
				this.buf.b += "h";
				break;
			case haxe_ds_StringMap:
				this.buf.b += "b";
				var v1 = v;
				var h = v1.h;
				var _g_h = h;
				var _g_keys = Object.keys(h);
				var _g_length = _g_keys.length;
				var _g_current = 0;
				while(_g_current < _g_length) {
					var k = _g_keys[_g_current++];
					this.serializeString(k);
					this.serialize(v1.h[k]);
				}
				this.buf.b += "h";
				break;
			case haxe_io_Bytes:
				var v1 = v;
				this.buf.b += "s";
				this.buf.b += Std.string(Math.ceil(v1.length * 8 / 6));
				this.buf.b += ":";
				var i = 0;
				var max = v1.length - 2;
				var b64 = haxe_Serializer.BASE64_CODES;
				if(b64 == null) {
					var this1 = new Array(haxe_Serializer.BASE64.length);
					b64 = this1;
					var _g1 = 0;
					var _g2 = haxe_Serializer.BASE64.length;
					while(_g1 < _g2) {
						var i1 = _g1++;
						b64[i1] = HxOverrides.cca(haxe_Serializer.BASE64,i1);
					}
					haxe_Serializer.BASE64_CODES = b64;
				}
				while(i < max) {
					var b1 = v1.b[i++];
					var b2 = v1.b[i++];
					var b3 = v1.b[i++];
					this.buf.b += String.fromCodePoint(b64[b1 >> 2]);
					this.buf.b += String.fromCodePoint(b64[(b1 << 4 | b2 >> 4) & 63]);
					this.buf.b += String.fromCodePoint(b64[(b2 << 2 | b3 >> 6) & 63]);
					this.buf.b += String.fromCodePoint(b64[b3 & 63]);
				}
				if(i == max) {
					var b1 = v1.b[i++];
					var b2 = v1.b[i++];
					this.buf.b += String.fromCodePoint(b64[b1 >> 2]);
					this.buf.b += String.fromCodePoint(b64[(b1 << 4 | b2 >> 4) & 63]);
					this.buf.b += String.fromCodePoint(b64[b2 << 2 & 63]);
				} else if(i == max + 1) {
					var b1 = v1.b[i++];
					this.buf.b += String.fromCodePoint(b64[b1 >> 2]);
					this.buf.b += String.fromCodePoint(b64[b1 << 4 & 63]);
				}
				break;
			default:
				if(this.useCache) {
					this.cache.pop();
				}
				if(v.hxSerialize != null) {
					this.buf.b += "C";
					this.serializeString(c.__name__);
					if(this.useCache) {
						this.cache.push(v);
					}
					v.hxSerialize(this);
					this.buf.b += "g";
				} else {
					this.buf.b += "c";
					this.serializeString(c.__name__);
					if(this.useCache) {
						this.cache.push(v);
					}
					this.serializeFields(v);
				}
			}
			break;
		case 7:
			var e = _g.e;
			if(this.useCache) {
				if(this.serializeRef(v)) {
					return;
				}
				this.cache.pop();
			}
			this.buf.b += Std.string(this.useEnumIndex ? "j" : "w");
			this.serializeString(e.__ename__);
			if(this.useEnumIndex) {
				this.buf.b += ":";
				this.buf.b += Std.string(v._hx_index);
			} else {
				var e = v;
				this.serializeString($hxEnums[e.__enum__].__constructs__[e._hx_index]._hx_name);
			}
			this.buf.b += ":";
			var params = Type.enumParameters(v);
			this.buf.b += Std.string(params.length);
			var _g = 0;
			while(_g < params.length) {
				var p = params[_g];
				++_g;
				this.serialize(p);
			}
			if(this.useCache) {
				this.cache.push(v);
			}
			break;
		default:
			throw haxe_Exception.thrown("Cannot serialize " + Std.string(v));
		}
	}
	,__class__: haxe_Serializer
};
var haxe__$Unserializer_DefaultResolver = function() {
};
$hxClasses["haxe._Unserializer.DefaultResolver"] = haxe__$Unserializer_DefaultResolver;
haxe__$Unserializer_DefaultResolver.__name__ = "haxe._Unserializer.DefaultResolver";
haxe__$Unserializer_DefaultResolver.prototype = {
	resolveClass: function(name) {
		return $hxClasses[name];
	}
	,resolveEnum: function(name) {
		return $hxEnums[name];
	}
	,__class__: haxe__$Unserializer_DefaultResolver
};
var haxe_Unserializer = function(buf) {
	this.buf = buf;
	this.length = this.buf.length;
	this.pos = 0;
	this.scache = [];
	this.cache = [];
	var r = haxe_Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = new haxe__$Unserializer_DefaultResolver();
		haxe_Unserializer.DEFAULT_RESOLVER = r;
	}
	this.resolver = r;
};
$hxClasses["haxe.Unserializer"] = haxe_Unserializer;
haxe_Unserializer.__name__ = "haxe.Unserializer";
haxe_Unserializer.initCodes = function() {
	var codes = [];
	var _g = 0;
	var _g1 = haxe_Unserializer.BASE64.length;
	while(_g < _g1) {
		var i = _g++;
		codes[haxe_Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
};
haxe_Unserializer.run = function(v) {
	return new haxe_Unserializer(v).unserialize();
};
haxe_Unserializer.prototype = {
	readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) {
				break;
			}
			if(c == 45) {
				if(this.pos != fpos) {
					break;
				}
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) {
				break;
			}
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) {
			k *= -1;
		}
		return k;
	}
	,readFloat: function() {
		var p1 = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) {
				break;
			}
			if(c >= 43 && c < 58 || c == 101 || c == 69) {
				this.pos++;
			} else {
				break;
			}
		}
		return parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) {
				throw haxe_Exception.thrown("Invalid object");
			}
			if(this.buf.charCodeAt(this.pos) == 103) {
				break;
			}
			var k = this.unserialize();
			if(typeof(k) != "string") {
				throw haxe_Exception.thrown("Invalid object key");
			}
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.buf.charCodeAt(this.pos++) != 58) {
			throw haxe_Exception.thrown("Invalid enum format");
		}
		var nargs = this.readDigits();
		if(nargs == 0) {
			return Type.createEnum(edecl,tag);
		}
		var args = [];
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserialize: function() {
		switch(this.buf.charCodeAt(this.pos++)) {
		case 65:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) {
				throw haxe_Exception.thrown("Class not found " + name);
			}
			return cl;
		case 66:
			var name = this.unserialize();
			var e = this.resolver.resolveEnum(name);
			if(e == null) {
				throw haxe_Exception.thrown("Enum not found " + name);
			}
			return e;
		case 67:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) {
				throw haxe_Exception.thrown("Class not found " + name);
			}
			var o = Object.create(cl.prototype);
			this.cache.push(o);
			o.hxUnserialize(this);
			if(this.buf.charCodeAt(this.pos++) != 103) {
				throw haxe_Exception.thrown("Invalid custom data");
			}
			return o;
		case 77:
			var h = new haxe_ds_ObjectMap();
			this.cache.push(h);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s = this.unserialize();
				h.set(s,this.unserialize());
			}
			this.pos++;
			return h;
		case 82:
			var n = this.readDigits();
			if(n < 0 || n >= this.scache.length) {
				throw haxe_Exception.thrown("Invalid string reference");
			}
			return this.scache[n];
		case 97:
			var buf = this.buf;
			var a = [];
			this.cache.push(a);
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c == 104) {
					this.pos++;
					break;
				}
				if(c == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else {
					a.push(this.unserialize());
				}
			}
			return a;
		case 98:
			var h = new haxe_ds_StringMap();
			this.cache.push(h);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s = this.unserialize();
				var value = this.unserialize();
				h.h[s] = value;
			}
			this.pos++;
			return h;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) {
				throw haxe_Exception.thrown("Class not found " + name);
			}
			var o = Object.create(cl.prototype);
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 100:
			return this.readFloat();
		case 102:
			return false;
		case 105:
			return this.readDigits();
		case 106:
			var name = this.unserialize();
			var edecl = this.resolver.resolveEnum(name);
			if(edecl == null) {
				throw haxe_Exception.thrown("Enum not found " + name);
			}
			this.pos++;
			var index = this.readDigits();
			var _this = edecl.__constructs__;
			var result = new Array(_this.length);
			var _g = 0;
			var _g1 = _this.length;
			while(_g < _g1) {
				var i = _g++;
				result[i] = _this[i]._hx_name;
			}
			var tag = result[index];
			if(tag == null) {
				throw haxe_Exception.thrown("Unknown enum index " + name + "@" + index);
			}
			var e = this.unserializeEnum(edecl,tag);
			this.cache.push(e);
			return e;
		case 107:
			return NaN;
		case 108:
			var l = new haxe_ds_List();
			this.cache.push(l);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 109:
			return -Infinity;
		case 110:
			return null;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 112:
			return Infinity;
		case 113:
			var h = new haxe_ds_IntMap();
			this.cache.push(h);
			var buf = this.buf;
			var c = this.buf.charCodeAt(this.pos++);
			while(c == 58) {
				var i = this.readDigits();
				var value = this.unserialize();
				h.h[i] = value;
				c = this.buf.charCodeAt(this.pos++);
			}
			if(c != 104) {
				throw haxe_Exception.thrown("Invalid IntMap format");
			}
			return h;
		case 114:
			var n = this.readDigits();
			if(n < 0 || n >= this.cache.length) {
				throw haxe_Exception.thrown("Invalid reference");
			}
			return this.cache[n];
		case 115:
			var len = this.readDigits();
			var buf = this.buf;
			if(this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) {
				throw haxe_Exception.thrown("Invalid bytes length");
			}
			var codes = haxe_Unserializer.CODES;
			if(codes == null) {
				codes = haxe_Unserializer.initCodes();
				haxe_Unserializer.CODES = codes;
			}
			var i = this.pos;
			var rest = len & 3;
			var size = (len >> 2) * 3 + (rest >= 2 ? rest - 1 : 0);
			var max = i + (len - rest);
			var bytes = new haxe_io_Bytes(new ArrayBuffer(size));
			var bpos = 0;
			while(i < max) {
				var c1 = codes[buf.charCodeAt(i++)];
				var c2 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = c1 << 2 | c2 >> 4;
				var c3 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = c2 << 4 | c3 >> 2;
				var c4 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = c3 << 6 | c4;
			}
			if(rest >= 2) {
				var c1 = codes[buf.charCodeAt(i++)];
				var c2 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = c1 << 2 | c2 >> 4;
				if(rest == 3) {
					var c3 = codes[buf.charCodeAt(i++)];
					bytes.b[bpos++] = c2 << 4 | c3 >> 2;
				}
			}
			this.pos += len;
			this.cache.push(bytes);
			return bytes;
		case 116:
			return true;
		case 118:
			var d;
			if(this.buf.charCodeAt(this.pos) >= 48 && this.buf.charCodeAt(this.pos) <= 57 && this.buf.charCodeAt(this.pos + 1) >= 48 && this.buf.charCodeAt(this.pos + 1) <= 57 && this.buf.charCodeAt(this.pos + 2) >= 48 && this.buf.charCodeAt(this.pos + 2) <= 57 && this.buf.charCodeAt(this.pos + 3) >= 48 && this.buf.charCodeAt(this.pos + 3) <= 57 && this.buf.charCodeAt(this.pos + 4) == 45) {
				d = HxOverrides.strDate(HxOverrides.substr(this.buf,this.pos,19));
				this.pos += 19;
			} else {
				d = new Date(this.readFloat());
			}
			this.cache.push(d);
			return d;
		case 119:
			var name = this.unserialize();
			var edecl = this.resolver.resolveEnum(name);
			if(edecl == null) {
				throw haxe_Exception.thrown("Enum not found " + name);
			}
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 120:
			throw haxe_Exception.thrown(this.unserialize());
		case 121:
			var len = this.readDigits();
			if(this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) {
				throw haxe_Exception.thrown("Invalid string length");
			}
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = decodeURIComponent(s.split("+").join(" "));
			this.scache.push(s);
			return s;
		case 122:
			return 0;
		default:
		}
		this.pos--;
		throw haxe_Exception.thrown("Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos);
	}
	,__class__: haxe_Unserializer
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
var haxe_ds_IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe_ds_IntMap;
haxe_ds_IntMap.__name__ = "haxe.ds.IntMap";
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
haxe_ds_IntMap.prototype = {
	keys: function() {
		var a = [];
		for( var key in this.h ) if(this.h.hasOwnProperty(key)) a.push(+key);
		return new haxe_iterators_ArrayIterator(a);
	}
	,__class__: haxe_ds_IntMap
};
var haxe_ds_List = function() {
	this.length = 0;
};
$hxClasses["haxe.ds.List"] = haxe_ds_List;
haxe_ds_List.__name__ = "haxe.ds.List";
haxe_ds_List.prototype = {
	add: function(item) {
		var x = new haxe_ds__$List_ListNode(item,null);
		if(this.h == null) {
			this.h = x;
		} else {
			this.q.next = x;
		}
		this.q = x;
		this.length++;
	}
	,__class__: haxe_ds_List
};
var haxe_ds__$List_ListNode = function(item,next) {
	this.item = item;
	this.next = next;
};
$hxClasses["haxe.ds._List.ListNode"] = haxe_ds__$List_ListNode;
haxe_ds__$List_ListNode.__name__ = "haxe.ds._List.ListNode";
haxe_ds__$List_ListNode.prototype = {
	__class__: haxe_ds__$List_ListNode
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
var haxe_ds_Option = $hxEnums["haxe.ds.Option"] = { __ename__:"haxe.ds.Option",__constructs__:null
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
	__class__: haxe_ds_StringMap
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
haxe_io_Bytes.prototype = {
	__class__: haxe_io_Bytes
};
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
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) {
		return false;
	}
	switch(cl) {
	case Array:
		return ((o) instanceof Array);
	case Bool:
		return typeof(o) == "boolean";
	case Dynamic:
		return o != null;
	case Float:
		return typeof(o) == "number";
	case Int:
		if(typeof(o) == "number") {
			return ((o | 0) === o);
		} else {
			return false;
		}
		break;
	case String:
		return typeof(o) == "string";
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(js_Boot.__downcastCheck(o,cl)) {
					return true;
				}
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(((o) instanceof cl)) {
					return true;
				}
			}
		} else {
			return false;
		}
		if(cl == Class ? o.__name__ != null : false) {
			return true;
		}
		if(cl == Enum ? o.__ename__ != null : false) {
			return true;
		}
		return o.__enum__ != null ? $hxEnums[o.__enum__] == cl : false;
	}
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
js_Boot.__cast = function(o,t) {
	if(o == null || js_Boot.__instanceof(o,t)) {
		return o;
	} else {
		throw haxe_Exception.thrown("Cannot cast " + Std.string(o) + " to " + Std.string(t));
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") {
		return null;
	}
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var model_ver1_game_define_CardProto = function() {
	this.category = model_ver1_game_define_CardCategory.Unit;
};
$hxClasses["model.ver1.game.define.CardProto"] = model_ver1_game_define_CardProto;
model_ver1_game_define_CardProto.__name__ = "model.ver1.game.define.CardProto";
model_ver1_game_define_CardProto.prototype = {
	getTexts: function(_ctx,runtime) {
		return [];
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
	getTexts: function(_ctx,runtime) {
		return [new model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Text1("" + runtime.getCardId() + "_Text1")];
	}
	,__class__: model_ver1_data_CardProto_$179001_$01A_$CH_$WT007R_$white
});
var model_ver1_game_define_CardText = function(id,description,type) {
	this.isSurroundedByArrows = false;
	this.id = id;
	this.description = description;
	this.type = type;
};
$hxClasses["model.ver1.game.define.CardText"] = model_ver1_game_define_CardText;
model_ver1_game_define_CardText.__name__ = "model.ver1.game.define.CardText";
model_ver1_game_define_CardText.prototype = {
	getSubKey: function(v) {
		return "" + this.id + "_" + v;
	}
	,getEffect: function(_ctx,runtime) {
		return [];
	}
	,getRequires: function(_ctx,runtime) {
		return [];
	}
	,getRequires2: function(_ctx,runtime) {
		return [];
	}
	,action: function(_ctx,runtime) {
	}
	,onEvent: function(_ctx,event,runtime) {
	}
	,__class__: model_ver1_game_define_CardText
};
var model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Text1 = function(id) {
	model_ver1_game_define_CardText.call(this,id,"（戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。",model_ver1_game_define_TextType.Use(model_ver1_game_define_UseTiming.Absolute(model_ver1_game_define_AbsoluteUseTiming.Battle)));
};
$hxClasses["model.ver1.data._CardProto_179001_01A_CH_WT007R_white.Text1"] = model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Text1;
model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Text1.__name__ = "model.ver1.data._CardProto_179001_01A_CH_WT007R_white.Text1";
model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Text1.__super__ = model_ver1_game_define_CardText;
model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Text1.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	getRequires: function(_ctx,runtime) {
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		var unit;
		var _g = model_ver1_game_gameComponent_Alg_getUnitOfSetGroup(ctx,runtime.getCardId());
		if(_g._hx_index == 0) {
			var cardId = _g.v;
			unit = cardId;
		} else {
			unit = "unknown";
		}
		return [new model_ver1_data_RequirePhase("" + this.id + "_req1",model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.None,model_ver1_game_define_TimingKeyword.Free1)),new model_ver1_data_RequireGTap("" + this.id + "_req2",[model_ver1_game_define_GColor.Red,model_ver1_game_define_GColor.Red],ctx,runtime),new model_ver1_data_ForceTargetCard("" + this.id + "_req3","このセットグループのユニット","このセットグループのユニット",unit)];
	}
	,action: function(_ctx,runtime) {
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		var selectUnits = model_ver1_game_component_SelectionComponent_getPlayerSelectionCardId(ctx,"このセットグループのユニット");
		var _g = 0;
		while(_g < selectUnits.length) {
			var unit = selectUnits[_g];
			++_g;
			var mark = new model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Mark1("" + this.id + "_Mark1",unit);
			model_ver1_game_component_MarkComponent_addMark(ctx,mark);
		}
	}
	,__class__: model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Text1
});
var model_ver1_game_define_Mark = function(id) {
	this.id = id;
};
$hxClasses["model.ver1.game.define.Mark"] = model_ver1_game_define_Mark;
model_ver1_game_define_Mark.__name__ = "model.ver1.game.define.Mark";
model_ver1_game_define_Mark.prototype = {
	getEffect: function(_ctx) {
		return [];
	}
	,onEvent: function(_ctx,event) {
	}
	,__class__: model_ver1_game_define_Mark
};
var model_ver1_game_gameComponent_GameMark = function(id) {
	model_ver1_game_define_Mark.call(this,id);
};
$hxClasses["model.ver1.game.gameComponent.GameMark"] = model_ver1_game_gameComponent_GameMark;
model_ver1_game_gameComponent_GameMark.__name__ = "model.ver1.game.gameComponent.GameMark";
model_ver1_game_gameComponent_GameMark.__super__ = model_ver1_game_define_Mark;
model_ver1_game_gameComponent_GameMark.prototype = $extend(model_ver1_game_define_Mark.prototype,{
	getEffect: function(_ctx) {
		var ctx = _ctx;
		return this._getEffect(ctx);
	}
	,_getEffect: function(ctx) {
		return [];
	}
	,onEvent: function(_ctx,event) {
		var ctx = _ctx;
		this._onEvent(ctx,event);
	}
	,_onEvent: function(ctx,event) {
		if(this.age != null) {
			if(event._hx_index == 0) {
				var _g = model_ver1_game_component_TimingComponent_getTiming(ctx);
				var _g1 = _g.step;
				if(_g.phase._hx_index == 3) {
					if(_g1._hx_index == 0) {
						if(_g1.v._hx_index == 4) {
							if(_g.timing._hx_index == 4) {
								this.age -= 1;
								if(this.age <= 0) {
									model_ver1_game_component_MarkComponent_removeMark(ctx,this.id);
								}
							}
						}
					}
				}
			}
		}
	}
	,__class__: model_ver1_game_gameComponent_GameMark
});
var model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Mark1 = function(id,attachCardId) {
	model_ver1_game_gameComponent_GameMark.call(this,id);
	this.attachCardId = attachCardId;
};
$hxClasses["model.ver1.data._CardProto_179001_01A_CH_WT007R_white.Mark1"] = model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Mark1;
model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Mark1.__name__ = "model.ver1.data._CardProto_179001_01A_CH_WT007R_white.Mark1";
model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Mark1.__super__ = model_ver1_game_gameComponent_GameMark;
model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Mark1.prototype = $extend(model_ver1_game_gameComponent_GameMark.prototype,{
	_getEffect: function(_ctx) {
		return [model_ver1_game_gameComponent_MarkEffect.AttackSpeed(this.attachCardId,1)];
	}
	,_onEvent: function(ctx,event) {
		if(event._hx_index == 0) {
			var _g = model_ver1_game_component_TimingComponent_getTiming(ctx);
			var _g1 = _g.step;
			if(_g.phase._hx_index == 3) {
				if(_g1._hx_index == 0) {
					if(_g1.v._hx_index == 4) {
						if(_g.timing._hx_index == 4) {
							model_ver1_game_component_MarkComponent_removeMark(ctx,this.id);
						}
					}
				}
			}
		}
	}
	,__class__: model_ver1_data__$CardProto_$179001_$01A_$CH_$WT007R_$white_Mark1
});
function model_ver1_data_CardProto_$179001_$01A_$CH_$WT007R_$white_test() {
	var ctx = new model_ver1_game_entity_Context();
	var card1 = new tool_Card("0");
	card1.protoId = "179001_01A_CH_WT007R_white";
	ctx.table.cards.h[card1.id] = card1;
	model_ver1_game_component_TimingComponent_setTiming(ctx,model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.Attack),model_ver1_game_define_TimingKeyword.Start));
	var _this = model_ver1_game_gameComponent_Runtime_getRuntimeText(ctx);
	var result = new Array(_this.length);
	var _g = 0;
	var _g1 = _this.length;
	while(_g < _g1) {
		var i = _g++;
		var info = _this[i];
		result[i] = { cardId : info.runtime.getCardId(), text : info.text, reqs : info.text.getRequires(ctx,info.runtime)};
	}
	var infos = result;
	console.log("src/model/ver1/data/CardProto_179001_01A_CH_WT007R_white.hx:113:",infos);
	if(infos.length == 0) {
		throw new haxe_Exception("infos.length == 0");
	}
	var selectTextId = infos[0].text.id;
	var _g = [];
	var _g1 = 0;
	var _g2 = model_ver1_game_gameComponent_Runtime_getRuntimeText(ctx);
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
	getTexts: function(_ctx,runtime) {
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		return [new model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text1("" + runtime.getCardId() + "_Text1")];
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
	action: function(_ctx,runtime) {
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
	action: function(_ctx,runtime) {
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		if(model_ver1_game_gameComponent_Alg_isDestroyNow(ctx,runtime.getCardId(),{ isByBattleDamage : true}) == false) {
			throw new haxe_Exception("這張卡必須是破壞中的狀態");
		}
	}
	,__class__: model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_RequireThisCardDestroyByBattleDamage
});
var model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text1 = function(id) {
	model_ver1_game_define_CardText.call(this,id,"（ダメージ判定ステップ）〔２〕：このカードが戦闘ダメージで破壊されている場合、このカードを、破壊を無効にした上で自軍Gにする。",model_ver1_game_define_TextType.Use(model_ver1_game_define_UseTiming.Absolute(model_ver1_game_define_AbsoluteUseTiming.DamageChecking)));
};
$hxClasses["model.ver1.data._CardProto_179003_01A_U_BK008U_black.Text1"] = model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text1;
model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text1.__name__ = "model.ver1.data._CardProto_179003_01A_U_BK008U_black.Text1";
model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text1.__super__ = model_ver1_game_define_CardText;
model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text1.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	getRequires: function(_ctx,runtime) {
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		return [new model_ver1_data_RequirePhase("" + this.id + "_Text1_Req1",model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.DamageChecking),model_ver1_game_define_TimingKeyword.Free1)),new model_ver1_data_RequireGTap("" + this.id + "_Text1_Req2",[model_ver1_game_define_GColor.Black,model_ver1_game_define_GColor.Black],ctx,runtime),new model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_RequireThisCardDestroyByBattleDamage("" + this.id + "_Text1_Req3")];
	}
	,action: function(_ctx,runtime) {
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		var cardId = runtime.getCardId();
		var block = new model_ver1_game_define_Effect("" + this.id + "_" + Std.string(new Date()),model_ver1_game_define_EffectCause.PlayText(cardId,this.id),new model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text2("" + this.id + "_Text2"));
		model_ver1_game_component_CutComponent_cutIn(ctx,block);
	}
	,__class__: model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text1
});
var model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text2 = function(id) {
	model_ver1_game_define_CardText.call(this,id,"このカードを、破壊を無効にした上で自軍Gにする。",model_ver1_game_define_TextType.System);
};
$hxClasses["model.ver1.data._CardProto_179003_01A_U_BK008U_black.Text2"] = model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text2;
model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text2.__name__ = "model.ver1.data._CardProto_179003_01A_U_BK008U_black.Text2";
model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text2.__super__ = model_ver1_game_define_CardText;
model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text2.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	action: function(_ctx,runtime) {
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		var cardId = runtime.getCardId();
		model_ver1_game_gameComponent_Alg_removeDestroyEffect(ctx,cardId);
		model_ver1_game_gameComponent_Alg_becomeG(ctx,cardId);
	}
	,__class__: model_ver1_data__$CardProto_$179003_$01A_$U_$BK008U_$black_Text2
});
function model_ver1_data_CardProto_$179003_$01A_$U_$BK008U_$black_test() {
	var ctx = new model_ver1_game_entity_Context();
	var card1 = new tool_Card("0");
	card1.protoId = "179003_01A_U_BK008U_black";
	ctx.table.cards.h[card1.id] = card1;
	model_ver1_game_component_TimingComponent_setTiming(ctx,model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.DamageChecking),model_ver1_game_define_TimingKeyword.Start));
	var _this = model_ver1_game_gameComponent_Runtime_getRuntimeText(ctx);
	var result = new Array(_this.length);
	var _g = 0;
	var _g1 = _this.length;
	while(_g < _g1) {
		var i = _g++;
		var info = _this[i];
		result[i] = { cardId : info.runtime.getCardId(), text : info.text, reqs : info.text.getRequires(ctx,info.runtime)};
	}
	var infos = result;
	console.log("src/model/ver1/data/CardProto_179003_01A_U_BK008U_black.hx:103:",infos);
	if(infos.length == 0) {
		throw new haxe_Exception("infos.length == 0");
	}
	var selectTextId = infos[0].text.id;
	var _g = [];
	var _g1 = 0;
	var _g2 = model_ver1_game_gameComponent_Runtime_getRuntimeText(ctx);
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
	this.category = model_ver1_game_define_CardCategory.Character;
};
$hxClasses["model.ver1.data.CardProto_179004_01A_CH_WT009R_white"] = model_ver1_data_CardProto_$179004_$01A_$CH_$WT009R_$white;
model_ver1_data_CardProto_$179004_$01A_$CH_$WT009R_$white.__name__ = "model.ver1.data.CardProto_179004_01A_CH_WT009R_white";
model_ver1_data_CardProto_$179004_$01A_$CH_$WT009R_$white.__super__ = model_ver1_game_define_CardProto;
model_ver1_data_CardProto_$179004_$01A_$CH_$WT009R_$white.prototype = $extend(model_ver1_game_define_CardProto.prototype,{
	getTexts: function(_ctx,runtime) {
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		var thisCardId = runtime.getCardId();
		return [new model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1("" + thisCardId + "_Text1")];
	}
	,__class__: model_ver1_data_CardProto_$179004_$01A_$CH_$WT009R_$white
});
var model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1 = function(id) {
	model_ver1_game_define_CardText.call(this,id,"『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。",model_ver1_game_define_TextType.Automatic(model_ver1_game_define_TextTypeAutomaticType.Trigger));
};
$hxClasses["model.ver1.data._CardProto_179004_01A_CH_WT009R_white.Text1"] = model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1;
model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1.__name__ = "model.ver1.data._CardProto_179004_01A_CH_WT009R_white.Text1";
model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1.__super__ = model_ver1_game_define_CardText;
model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	onEvent: function(_ctx,event,runtime) {
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		var thisCardId = runtime.getCardId();
		var _g = event;
		if(_g._hx_index == 1) {
			var gainCardId = _g.cardId;
			var gainValue = _g.value;
			if(model_ver1_game_component_TableComponent_isMyCard(ctx,thisCardId,gainCardId)) {
				var block = new model_ver1_game_define_Effect("" + this.id + "_" + Std.string(new Date()),model_ver1_game_define_EffectCause.TextEffect(thisCardId,this.id),new model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1_$1("" + this.id + "_Text1_1",gainCardId,gainValue));
				block.isImmediate = true;
				model_ver1_game_component_CutComponent_cutIn(ctx,block);
			}
		}
	}
	,__class__: model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1
});
var model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1_$1 = function(id,gainCardId,gainValue) {
	model_ver1_game_define_CardText.call(this,id,"そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。",model_ver1_game_define_TextType.System);
	this.gainCardId = gainCardId;
	this.gainValue = gainValue;
};
$hxClasses["model.ver1.data._CardProto_179004_01A_CH_WT009R_white.Text1_1"] = model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1_$1;
model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1_$1.__name__ = "model.ver1.data._CardProto_179004_01A_CH_WT009R_white.Text1_1";
model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1_$1.__super__ = model_ver1_game_define_CardText;
model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1_$1.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	getRequires: function(_ctx,runtime) {
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		var thisCardId = runtime.getCardId();
		var gainCardSetGroupsIds = model_ver1_game_gameComponent_Alg_getCardSetGroupCardIds(ctx,this.gainCardId);
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
			if(gainCardSetGroupsIds.indexOf(v.id) != -1 == false && model_ver1_game_component_TableComponent_isMyCard(ctx,thisCardId,v.id)) {
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
	,getRequires2: function(_ctx,runtime) {
		var _gthis = this;
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		var thisCardId = runtime.getCardId();
		var gainCardSetGroupsIds = model_ver1_game_gameComponent_Alg_getCardSetGroupCardIds(ctx,this.gainCardId);
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
			if(model_ver1_game_component_TableComponent_isMyCard(ctx,thisCardId,v.id)) {
				_g1.push(v);
			}
		}
		var _g = [];
		var _g2 = 0;
		var _g3 = _g1;
		while(_g2 < _g3.length) {
			var v = _g3[_g2];
			++_g2;
			if(gainCardSetGroupsIds.indexOf(v.id) != -1 == false) {
				_g.push(v);
			}
		}
		var _g1 = [];
		var _g2 = 0;
		var _g3 = _g;
		while(_g2 < _g3.length) {
			var v = _g3[_g2];
			++_g2;
			var _g = model_ver1_game_gameComponent_Alg_getCardEntityCategory(ctx,v.id);
			if(_g._hx_index == 0 && _g.v._hx_index == 0) {
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
		var _this = result;
		var result = new Array(_this.length);
		var _g = 0;
		var _g1 = _this.length;
		while(_g < _g1) {
			var i = _g++;
			result[i] = { value : _this[i], weight : 0.0};
		}
		var tips = result;
		var tipsLengths = [1];
		return [{ id : this.getSubKey(0), description : "そのカードのセットグループ以外の自軍ユニット１枚は", type : model_ver1_game_define_RequireType.SelectCard(tips,tipsLengths), player : model_ver1_game_define_RelativePlayer.You, action : function() {
			var selection = model_ver1_game_component_SelectionComponent_getPlayerSelectionCardId(ctx,_gthis.getSubKey(0));
			if(tipsLengths.indexOf(selection.length) != -1 == false) {
				throw haxe_Exception.thrown("length not right");
			}
		}}];
	}
	,action: function(_ctx,runtime) {
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		var selectUnits = model_ver1_game_component_SelectionComponent_getPlayerSelectionCardId(ctx,this.getSubKey(0));
		var _g = 0;
		while(_g < selectUnits.length) {
			var unit = selectUnits[_g];
			++_g;
			var mark = new model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Mark1("" + this.id + "_Mark1",this.gainCardId,this.gainValue);
			mark.age = 1;
			model_ver1_game_component_MarkComponent_addMark(ctx,mark);
		}
	}
	,__class__: model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Text1_$1
});
var model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Mark1 = function(id,attachCardId,battlePoint) {
	model_ver1_game_gameComponent_GameMark.call(this,id);
	this.attachCardId = attachCardId;
	this.battlePoint = battlePoint;
};
$hxClasses["model.ver1.data._CardProto_179004_01A_CH_WT009R_white.Mark1"] = model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Mark1;
model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Mark1.__name__ = "model.ver1.data._CardProto_179004_01A_CH_WT009R_white.Mark1";
model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Mark1.__super__ = model_ver1_game_gameComponent_GameMark;
model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Mark1.prototype = $extend(model_ver1_game_gameComponent_GameMark.prototype,{
	_getEffect: function(ctx) {
		return [model_ver1_game_gameComponent_MarkEffect.AddBattlePoint(this.attachCardId,this.battlePoint)];
	}
	,__class__: model_ver1_data__$CardProto_$179004_$01A_$CH_$WT009R_$white_Mark1
});
function model_ver1_data_CardProto_$179004_$01A_$CH_$WT009R_$white_test() {
	var player1 = model_ver1_game_define_PlayerId.A;
	var player2 = model_ver1_game_define_PlayerId.B;
	var ctx = new model_ver1_game_entity_Context();
	model_ver1_game_component_CardProtoPoolComponent_registerCardProto(ctx,"testUnit",new model_ver1_game_define_CardProto());
	console.log("src/model/ver1/data/CardProto_179004_01A_CH_WT009R_white.hx:164:","角色在場");
	var card = new tool_Card("1");
	card.owner = player1;
	card.protoId = "179004_01A_CH_WT009R_white";
	var baSyou = model_ver1_game_define_BaSyou.Default(player1,model_ver1_game_define_BaSyouKeyword.MaintenanceArea);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	tool_Table_addCard(ctx.table,this1,card);
	console.log("src/model/ver1/data/CardProto_179004_01A_CH_WT009R_white.hx:169:","機體1出場");
	var card2 = new tool_Card("2");
	card2.owner = player1;
	card2.protoId = "testUnit";
	var baSyou = model_ver1_game_define_BaSyou.Default(player1,model_ver1_game_define_BaSyouKeyword.MaintenanceArea);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	tool_Table_addCard(ctx.table,this1,card2);
	console.log("src/model/ver1/data/CardProto_179004_01A_CH_WT009R_white.hx:174:","機體2出場");
	var card3 = new tool_Card("3");
	card3.owner = player1;
	card3.protoId = "testUnit";
	var baSyou = model_ver1_game_define_BaSyou.Default(player1,model_ver1_game_define_BaSyouKeyword.MaintenanceArea);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	tool_Table_addCard(ctx.table,this1,card3);
	console.log("src/model/ver1/data/CardProto_179004_01A_CH_WT009R_white.hx:179:","敵機體出場");
	var card4 = new tool_Card("4");
	card4.owner = player2;
	card4.protoId = "testUnit";
	var baSyou = model_ver1_game_define_BaSyou.Default(player2,model_ver1_game_define_BaSyouKeyword.MaintenanceArea);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	tool_Table_addCard(ctx.table,this1,card4);
	if(model_ver1_game_component_CutComponent_getTopCut(ctx).length != 0) {
		throw haxe_Exception.thrown("一開始堆疊中沒有效果");
	}
	console.log("src/model/ver1/data/CardProto_179004_01A_CH_WT009R_white.hx:188:","獲得gain");
	model_ver1_game_gameComponent_Alg_sendEvent(ctx,model_ver1_game_gameComponent_Event.Gain(card2.id,model_ver1_game_define_BattlePoint.Default(1,0,0)));
	if(model_ver1_game_component_CutComponent_getTopCut(ctx).length != 1) {
		throw haxe_Exception.thrown("堆疊中必須有一個效果");
	}
	var block = model_ver1_game_component_CutComponent_getTopCut(ctx)[0];
	var runtime = new model_ver1_game_define_DefaultRuntime(card.id,player1);
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
		throw haxe_Exception.thrown("必須有一個可選機");
	}
	if(tips[0].value != card3.id) {
		throw haxe_Exception.thrown("必須可以選card3");
	}
	console.log("src/model/ver1/data/CardProto_179004_01A_CH_WT009R_white.hx:212:","選擇");
	model_ver1_game_component_SelectionComponent_setPlayerSelectionCardId(ctx,$require.id,[tips[0].value]);
	console.log("src/model/ver1/data/CardProto_179004_01A_CH_WT009R_white.hx:214:","驗証支付");
	$require.action();
	console.log("src/model/ver1/data/CardProto_179004_01A_CH_WT009R_white.hx:216:","解決效果");
	block.text.action(ctx,runtime);
	if(model_ver1_game_component_MarkComponent_getMarks(ctx).length != 1) {
		throw haxe_Exception.thrown("必須有效果");
	}
	console.log("src/model/ver1/data/CardProto_179004_01A_CH_WT009R_white.hx:221:","結束一個turn");
	model_ver1_game_component_TimingComponent_setTiming(ctx,model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.End),model_ver1_game_define_TimingKeyword.End));
	model_ver1_game_gameComponent_Alg_sendEvent(ctx,model_ver1_game_gameComponent_Event.ChangePhase);
	if(model_ver1_game_component_MarkComponent_getMarks(ctx).length != 0) {
		throw haxe_Exception.thrown("效果必須被移除");
	}
}
var model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown = function() {
	model_ver1_game_define_CardProto.call(this);
	this.category = model_ver1_game_define_CardCategory.Character;
};
$hxClasses["model.ver1.data.CardProto_179030_11E_CH_BN091N_brown"] = model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown;
model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown.__name__ = "model.ver1.data.CardProto_179030_11E_CH_BN091N_brown";
model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown.__super__ = model_ver1_game_define_CardProto;
model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown.prototype = $extend(model_ver1_game_define_CardProto.prototype,{
	getTexts: function(_ctx,runtime) {
		return [new model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Text1("" + runtime.getCardId() + "_Text1")];
	}
	,__class__: model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown
});
var model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Text1 = function(id) {
	model_ver1_game_define_CardText.call(this,id,"『起動』：このカードがロールした場合、敵軍G１枚をロールする。その場合、このセットグループは、このターンと次のターン、リロールできない。",model_ver1_game_define_TextType.Automatic(model_ver1_game_define_TextTypeAutomaticType.Trigger));
};
$hxClasses["model.ver1.data._CardProto_179030_11E_CH_BN091N_brown.Text1"] = model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Text1;
model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Text1.__name__ = "model.ver1.data._CardProto_179030_11E_CH_BN091N_brown.Text1";
model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Text1.__super__ = model_ver1_game_define_CardText;
model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Text1.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	onEvent: function(_ctx,event,runtime) {
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		var thisCardId = runtime.getCardId();
		var responsePlayerId = runtime.getResponsePlayerId();
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(responsePlayerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + responsePlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = responsePlayerId;
		var opponentPlayerId = this1 == model_ver1_game_define_PlayerId.A ? model_ver1_game_define_PlayerId.B : model_ver1_game_define_PlayerId.A;
		var _g = event;
		if(_g._hx_index == 4) {
			var rollCardId = _g.cardId;
			if(rollCardId == thisCardId) {
				if(model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown_getOpponentG(ctx,runtime).length >= 1) {
					var block = new model_ver1_game_define_Effect(this.getSubKey(0),model_ver1_game_define_EffectCause.TextEffect(thisCardId,this.id),new model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Process1("" + this.id + "_Process1"));
					block.isImmediate = true;
					model_ver1_game_component_CutComponent_cutIn(ctx,block);
				}
			}
		}
	}
	,__class__: model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Text1
});
var model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Process1 = function(id) {
	model_ver1_game_define_CardText.call(this,id,"敵軍G１枚をロールする。その場合、このセットグループは、このターンと次のターン、リロールできない。",model_ver1_game_define_TextType.System);
};
$hxClasses["model.ver1.data._CardProto_179030_11E_CH_BN091N_brown.Process1"] = model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Process1;
model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Process1.__name__ = "model.ver1.data._CardProto_179030_11E_CH_BN091N_brown.Process1";
model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Process1.__super__ = model_ver1_game_define_CardText;
model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Process1.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	getRequires2: function(_ctx,runtime) {
		var _gthis = this;
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		var _this = model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown_getOpponentG(ctx,runtime);
		var result = new Array(_this.length);
		var _g = 0;
		var _g1 = _this.length;
		while(_g < _g1) {
			var i = _g++;
			result[i] = { value : _this[i], weight : 0.0};
		}
		var tips = result;
		return [{ id : this.getSubKey(0), description : "敵軍G１枚をロールする。", type : model_ver1_game_define_RequireType.SelectCard(tips,[1]), player : model_ver1_game_define_RelativePlayer.You, action : function() {
			var selectUnits = model_ver1_game_component_SelectionComponent_getPlayerSelectionCardId(ctx,_gthis.getSubKey(0));
			var _g = 0;
			while(_g < selectUnits.length) {
				var unit = selectUnits[_g];
				++_g;
				model_ver1_game_gameComponent_Alg_rollCard(ctx,unit,{ sendEvent : true});
			}
		}}];
	}
	,action: function(_ctx,runtime) {
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		var thisCardId = runtime.getCardId();
		var _g = 0;
		var _g1 = model_ver1_game_gameComponent_Alg_getThisCardSetGroupCardIds(ctx,thisCardId);
		while(_g < _g1.length) {
			var cardId = _g1[_g];
			++_g;
			var markId = "" + this.id + "_" + cardId;
			var mark = new model_ver1_game_gameComponent_CanNotRerollMark(markId,cardId);
			mark.age = 2;
			model_ver1_game_component_MarkComponent_addMark(ctx,mark);
		}
	}
	,__class__: model_ver1_data__$CardProto_$179030_$11E_$CH_$BN091N_$brown_Process1
});
function model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown_getOpponentG(_ctx,runtime) {
	var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
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
		var s = model_ver1_game_component_TableComponent_getCardOwner(ctx,v);
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
		var _g = model_ver1_game_gameComponent_Alg_getCardEntityCategory(ctx,v);
		if(_g._hx_index == 0 && _g.v._hx_index == 3) {
			_g1.push(v);
		}
	}
	return _g1;
}
function model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown_test() {
	var player1 = model_ver1_game_define_PlayerId.A;
	var player2 = model_ver1_game_define_PlayerId.B;
	var ctx = new model_ver1_game_entity_Context();
	var baSyou = model_ver1_game_define_BaSyou.Default(player2,model_ver1_game_define_BaSyouKeyword.TeHuTa);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	var player2Hand = new tool_CardStack(this1);
	ctx.table.cardStacks.h[player2Hand.id] = player2Hand;
	console.log("src/model/ver1/data/CardProto_179030_11E_CH_BN091N_brown.hx:136:","卡牌1在場");
	var card = new tool_Card("1");
	card.owner = player1;
	card.protoId = "179030_11E_CH_BN091N_brown";
	var baSyou = model_ver1_game_define_BaSyou.Default(player1,model_ver1_game_define_BaSyouKeyword.MaintenanceArea);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	tool_Table_addCard(ctx.table,this1,card);
	console.log("src/model/ver1/data/CardProto_179030_11E_CH_BN091N_brown.hx:141:","敵軍G在場");
	var card2 = new tool_Card("2");
	card2.owner = player2;
	card2.protoId = "179030_11E_CH_BN091N_brown";
	card2.isTap = false;
	var baSyou = model_ver1_game_define_BaSyou.Default(player2,model_ver1_game_define_BaSyouKeyword.GZone);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	tool_Table_addCard(ctx.table,this1,card2);
	if(model_ver1_game_component_CutComponent_getTopCut(ctx).length != 0) {
		throw haxe_Exception.thrown("一開始堆疊中沒有效果");
	}
	console.log("src/model/ver1/data/CardProto_179030_11E_CH_BN091N_brown.hx:151:","卡牌横置");
	model_ver1_game_gameComponent_Alg_sendEvent(ctx,model_ver1_game_gameComponent_Event.CardRoll(card.id));
	if(model_ver1_game_component_CutComponent_getTopCut(ctx).length != 1) {
		throw haxe_Exception.thrown("堆疊中必須有一個效果");
	}
	var block = model_ver1_game_component_CutComponent_getTopCut(ctx)[0];
	var runtime = new model_ver1_game_define_DefaultRuntime(card.id,player1);
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
	console.log("src/model/ver1/data/CardProto_179030_11E_CH_BN091N_brown.hx:172:","選擇");
	model_ver1_game_component_SelectionComponent_setPlayerSelectionCardId(ctx,$require.id,[tips[0].value]);
	console.log("src/model/ver1/data/CardProto_179030_11E_CH_BN091N_brown.hx:174:","驗証支付");
	$require.action();
	if(card2.isTap != true) {
		throw haxe_Exception.thrown("牌必須被横置");
	}
	console.log("src/model/ver1/data/CardProto_179030_11E_CH_BN091N_brown.hx:179:","解決效果");
	block.text.action(ctx,runtime);
	if(model_ver1_game_component_MarkComponent_getMarks(ctx).length != 1) {
		throw haxe_Exception.thrown("必須有不能重置效果");
	}
	console.log("src/model/ver1/data/CardProto_179030_11E_CH_BN091N_brown.hx:184:","結束一個turn");
	model_ver1_game_component_TimingComponent_setTiming(ctx,model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Battle,haxe_ds_Option.Some(model_ver1_game_define_StepKeyword.End),model_ver1_game_define_TimingKeyword.End));
	model_ver1_game_gameComponent_Alg_sendEvent(ctx,model_ver1_game_gameComponent_Event.ChangePhase);
	if(model_ver1_game_component_MarkComponent_getMarks(ctx).length != 1) {
		throw haxe_Exception.thrown("必須有不能重置效果");
	}
	console.log("src/model/ver1/data/CardProto_179030_11E_CH_BN091N_brown.hx:190:","再結束一個turn");
	model_ver1_game_gameComponent_Alg_sendEvent(ctx,model_ver1_game_gameComponent_Event.ChangePhase);
	if(model_ver1_game_component_MarkComponent_getMarks(ctx).length != 0) {
		throw haxe_Exception.thrown("不能重置效果必須被移除");
	}
}
var model_ver1_game_gameComponent_GameCardProto = function() {
	model_ver1_game_define_CardProto.call(this);
};
$hxClasses["model.ver1.game.gameComponent.GameCardProto"] = model_ver1_game_gameComponent_GameCardProto;
model_ver1_game_gameComponent_GameCardProto.__name__ = "model.ver1.game.gameComponent.GameCardProto";
model_ver1_game_gameComponent_GameCardProto.__super__ = model_ver1_game_define_CardProto;
model_ver1_game_gameComponent_GameCardProto.prototype = $extend(model_ver1_game_define_CardProto.prototype,{
	getTexts: function(_ctx,runtime) {
		var ctx = _ctx;
		return this._getTexts(ctx,runtime);
	}
	,_getTexts: function(ctx,runtime) {
		return [];
	}
	,__class__: model_ver1_game_gameComponent_GameCardProto
});
var model_ver1_data_CardProto_$179030_$11E_$U_$VT186R_$purple = function() {
	model_ver1_game_gameComponent_GameCardProto.call(this);
	this.category = model_ver1_game_define_CardCategory.Unit;
};
$hxClasses["model.ver1.data.CardProto_179030_11E_U_VT186R_purple"] = model_ver1_data_CardProto_$179030_$11E_$U_$VT186R_$purple;
model_ver1_data_CardProto_$179030_$11E_$U_$VT186R_$purple.__name__ = "model.ver1.data.CardProto_179030_11E_U_VT186R_purple";
model_ver1_data_CardProto_$179030_$11E_$U_$VT186R_$purple.__super__ = model_ver1_game_gameComponent_GameCardProto;
model_ver1_data_CardProto_$179030_$11E_$U_$VT186R_$purple.prototype = $extend(model_ver1_game_gameComponent_GameCardProto.prototype,{
	_getTexts: function(ctx,runtime) {
		return [new model_ver1_game_gameComponent_PlayGRule("CardProto_179030_11E_U_VT186R_purple_1"),new model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Text1("CardProto_179030_11E_U_VT186R_purple_2")];
	}
	,__class__: model_ver1_data_CardProto_$179030_$11E_$U_$VT186R_$purple
});
var model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Text1 = function(id) {
	model_ver1_game_define_CardText.call(this,id,"『起動』：このカードが場に出た場合、このターン中に場に出た敵軍ユニット１枚を、持ち主の手札に移す。",model_ver1_game_define_TextType.Automatic(model_ver1_game_define_TextTypeAutomaticType.Trigger));
};
$hxClasses["model.ver1.data._CardProto_179030_11E_U_VT186R_purple.Text1"] = model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Text1;
model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Text1.__name__ = "model.ver1.data._CardProto_179030_11E_U_VT186R_purple.Text1";
model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Text1.__super__ = model_ver1_game_define_CardText;
model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Text1.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	onEvent: function(_ctx,event,runtime) {
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		var thisCardId = runtime.getCardId();
		var _g = event;
		if(_g._hx_index == 2) {
			var enterFieldCardId = _g.cardId;
			if(enterFieldCardId == thisCardId) {
				var block = new model_ver1_game_define_Effect(this.getSubKey(0),model_ver1_game_define_EffectCause.TextEffect(thisCardId,this.id),new model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Process1("" + this.id + "_Process1"));
				block.isImmediate = true;
				model_ver1_game_component_CutComponent_cutIn(ctx,block);
			}
		}
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
	action: function(_ctx,runtime) {
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		var selection = model_ver1_game_component_SelectionComponent_getPlayerSelectionCardId(ctx,this.id);
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
	var _g2 = model_ver1_game_gameComponent_Alg_getEnterFieldThisTurnCardIds(ctx);
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		var _g3 = model_ver1_game_gameComponent_Alg_getCardEntityCategory(ctx,v);
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
		if(model_ver1_game_component_TableComponent_isOpponentsCard(ctx,thisCardId,v)) {
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
	model_ver1_game_define_CardText.call(this,id,"このターン中に場に出た敵軍ユニット１枚を、持ち主の手札に移す。",model_ver1_game_define_TextType.System);
};
$hxClasses["model.ver1.data._CardProto_179030_11E_U_VT186R_purple.Process1"] = model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Process1;
model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Process1.__name__ = "model.ver1.data._CardProto_179030_11E_U_VT186R_purple.Process1";
model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Process1.__super__ = model_ver1_game_define_CardText;
model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Process1.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	getRequires: function(_ctx,runtime) {
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		return [new model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_RequireOpponentUnitsEnterFieldThisTurn(this.getSubKey(0),ctx,runtime)];
	}
	,getRequires2: function(_ctx,runtime) {
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		return [model_ver1_data_RequireImpl_getRequireOpponentUnitsEnterFieldThisTurn(ctx,runtime,this.getSubKey(0))];
	}
	,action: function(_ctx,runtime) {
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		var cardId = runtime.getCardId();
		var selectCardIds = model_ver1_game_component_SelectionComponent_getPlayerSelectionCardId(ctx,this.getSubKey(0));
		var _g = 0;
		while(_g < selectCardIds.length) {
			var cardId = selectCardIds[_g];
			++_g;
			model_ver1_game_component_TableComponent_returnToOwnerHand(ctx,cardId);
		}
	}
	,__class__: model_ver1_data__$CardProto_$179030_$11E_$U_$VT186R_$purple_Process1
});
function model_ver1_data_CardProto_$179030_$11E_$U_$VT186R_$purple_test() {
	var player1 = model_ver1_game_define_PlayerId.A;
	var player2 = model_ver1_game_define_PlayerId.B;
	var ctx = new model_ver1_game_entity_Context();
	var baSyou = model_ver1_game_define_BaSyou.Default(player2,model_ver1_game_define_BaSyouKeyword.TeHuTa);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	var player2Hand = new tool_CardStack(this1);
	ctx.table.cardStacks.h[player2Hand.id] = player2Hand;
	console.log("src/model/ver1/data/CardProto_179030_11E_U_VT186R_purple.hx:121:","機體1在場");
	var card = new tool_Card("1");
	card.owner = player1;
	card.protoId = "179030_11E_U_VT186R_purple";
	var baSyou = model_ver1_game_define_BaSyou.Default(player1,model_ver1_game_define_BaSyouKeyword.MaintenanceArea);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	tool_Table_addCard(ctx.table,this1,card);
	console.log("src/model/ver1/data/CardProto_179030_11E_U_VT186R_purple.hx:126:","機體2這回合剛出場");
	var card2 = new tool_Card("2");
	card2.owner = player2;
	card2.protoId = "179030_11E_U_VT186R_purple";
	var baSyou = model_ver1_game_define_BaSyou.Default(player2,model_ver1_game_define_BaSyouKeyword.MaintenanceArea);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	tool_Table_addCard(ctx.table,this1,card2);
	console.log("src/model/ver1/data/CardProto_179030_11E_U_VT186R_purple.hx:131:","設置剛出場標記");
	var enterFieldMark = new model_ver1_game_gameComponent_EnterFieldThisTurnMark("EnterFieldThisTurnMark",card2.id);
	model_ver1_game_component_MarkComponent_addMark(ctx,enterFieldMark);
	if(model_ver1_game_component_CutComponent_getTopCut(ctx).length != 0) {
		throw haxe_Exception.thrown("一開始堆疊中沒有效果");
	}
	console.log("src/model/ver1/data/CardProto_179030_11E_U_VT186R_purple.hx:138:","機體1出場事件");
	model_ver1_game_gameComponent_Alg_sendEvent(ctx,model_ver1_game_gameComponent_Event.CardEnterField(card.id));
	if(model_ver1_game_component_CutComponent_getTopCut(ctx).length != 1) {
		throw haxe_Exception.thrown("堆疊中必須有一個效果");
	}
	var block = model_ver1_game_component_CutComponent_getTopCut(ctx)[0];
	var runtime = new model_ver1_game_define_DefaultRuntime(card.id,player1);
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
	console.log("src/model/ver1/data/CardProto_179030_11E_U_VT186R_purple.hx:159:","選擇要回手的一個敵機");
	model_ver1_game_component_SelectionComponent_setPlayerSelectionCardId(ctx,$require.id,[tips[0].value]);
	console.log("src/model/ver1/data/CardProto_179030_11E_U_VT186R_purple.hx:161:","驗証支付");
	$require.action();
	console.log("src/model/ver1/data/CardProto_179030_11E_U_VT186R_purple.hx:163:","解決效果");
	block.text.action(ctx,runtime);
	if(player2Hand.cardIds.length != 1) {
		throw haxe_Exception.thrown("牌被移到手上");
	}
}
var model_ver1_data_RequirePhase = function(id,timing) {
	model_ver1_game_define_Require.call(this,id,"RequirePhase");
	this.timing = timing;
};
$hxClasses["model.ver1.data.RequirePhase"] = model_ver1_data_RequirePhase;
model_ver1_data_RequirePhase.__name__ = "model.ver1.data.RequirePhase";
model_ver1_data_RequirePhase.__super__ = model_ver1_game_define_Require;
model_ver1_data_RequirePhase.prototype = $extend(model_ver1_game_define_Require.prototype,{
	action: function(_ctx,runtime) {
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		if(model_ver1_game_component_TimingComponent_isTiming(ctx,this.timing) == false) {
			throw new haxe_Exception("ctx.phase != this.phase: " + Std.string(ctx.timing) + " != " + Std.string(this.timing));
		}
	}
	,__class__: model_ver1_data_RequirePhase
});
var model_ver1_data_RequireGTap = function(id,colors,ctx,runtime) {
	model_ver1_data_RequireUserSelectCard.call(this,id,"RequireGTap");
	var responsePlayerId = runtime.getResponsePlayerId();
	var gCardIds = model_ver1_game_gameComponent_Alg_getPlayerGCardIds(ctx,responsePlayerId);
	var _g = [];
	var _g1 = 0;
	var _g2 = gCardIds;
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		var _g3 = model_ver1_game_gameComponent_Alg_getCardGSign(ctx,v);
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
	action: function(_ctx,runtime) {
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		var selectIds = ctx.playerSelection.cardIds.h[this.id];
		if(selectIds == null) {
			throw new haxe_Exception("selectIds not found");
		}
		var _g = 0;
		while(_g < selectIds.length) {
			var cardId = selectIds[_g];
			++_g;
			model_ver1_game_gameComponent_Alg_rollCard(ctx,cardId,{ sendEvent : true});
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
	action: function(_ctx,runtime) {
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		var selectCard = ctx.table.cards.h[this.cardId];
		if(selectCard == null) {
			throw new haxe_Exception("指定的卡不存在: " + this.cardId);
		}
		var v = [this.cardId];
		ctx.playerSelection.cardIds.h[this.selectKey] = v;
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
	action: function(_ctx,runtime) {
		var ctx = js_Boot.__cast(_ctx , model_ver1_game_entity_Context);
		var responsePlayerId = runtime.getResponsePlayerId();
		var gCount = model_ver1_game_gameComponent_Alg_getPlayerGCountForPlay(ctx,responsePlayerId);
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
	return { id : id, description : "RequirePhase", type : model_ver1_game_define_RequireType.Pending, player : model_ver1_game_define_RelativePlayer.You, action : function() {
		if(model_ver1_game_component_TimingComponent_isTiming(ctx,timing) == false) {
			throw new haxe_Exception("ctx.phase != this.phase: " + Std.string(ctx.timing) + " != " + Std.string(timing));
		}
	}};
}
function model_ver1_data_RequireImpl_getRequireGTap(ctx,runtime,colors,id) {
	var responsePlayerId = runtime.getResponsePlayerId();
	var gCardIds = model_ver1_game_gameComponent_Alg_getPlayerGCardIds(ctx,responsePlayerId);
	var _g = [];
	var _g1 = 0;
	var _g2 = gCardIds;
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		var _g3 = model_ver1_game_gameComponent_Alg_getCardGSign(ctx,v);
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
	return { id : id, description : "RequireGTap", type : model_ver1_game_define_RequireType.SelectCard(tips,[2]), player : model_ver1_game_define_RelativePlayer.You, action : function() {
		var selectIds = ctx.playerSelection.cardIds.h[id];
		if(selectIds == null) {
			throw new haxe_Exception("selectIds not found");
		}
		var _g = 0;
		while(_g < selectIds.length) {
			var cardId = selectIds[_g];
			++_g;
			model_ver1_game_gameComponent_Alg_rollCard(ctx,cardId,{ sendEvent : true});
		}
	}};
}
function model_ver1_data_RequireImpl_getRequireOpponentUnitsEnterFieldThisTurn(ctx,runtime,id) {
	var thisCardId = runtime.getCardId();
	var _g = [];
	var _g1 = 0;
	var _g2 = model_ver1_game_gameComponent_Alg_getEnterFieldThisTurnCardIds(ctx);
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		if(model_ver1_game_component_TableComponent_isOpponentsCard(ctx,thisCardId,v)) {
			_g.push(v);
		}
	}
	var _g1 = [];
	var _g2 = 0;
	var _g3 = _g;
	while(_g2 < _g3.length) {
		var v = _g3[_g2];
		++_g2;
		var _g = model_ver1_game_gameComponent_Alg_getCardEntityCategory(ctx,v);
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
	return { id : id, description : "このターン中に場に出た敵軍ユニット１枚を", type : model_ver1_game_define_RequireType.SelectCard(tips,[1]), player : model_ver1_game_define_RelativePlayer.You, action : function() {
	}};
}
var model_ver1_game_Game = function() {
	this.ctx = new model_ver1_game_entity_Context();
};
$hxClasses["model.ver1.game.Game"] = model_ver1_game_Game;
model_ver1_game_Game.__name__ = "model.ver1.game.Game";
model_ver1_game_Game.ofMemonto = function(memonto) {
	return tool_Helper_ofMemonto(memonto);
};
model_ver1_game_Game.prototype = {
	getMemonto: function() {
		return tool_Helper_getMemonto(this);
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
	model_ver1_game_component_TimingComponent_setTiming(game.ctx,model_ver1_game_define_Timing_TIMINGS[2]);
	var loadGame = model_ver1_game_Game.ofMemonto(game.getMemonto());
	var _g = model_ver1_game_component_TimingComponent_getTiming(game.ctx);
	if(_g.phase._hx_index == 0) {
		if(_g.step._hx_index == 1) {
			if(_g.timing._hx_index != 3) {
				throw new haxe_Exception("timing not right");
			}
		} else {
			throw new haxe_Exception("timing not right");
		}
	} else {
		throw new haxe_Exception("timing not right");
	}
	if(loadGame.ctx.table.cards.h[card1.id].id != card1.id) {
		throw new haxe_Exception("loadGame.ctx.table.cards[card1.id].id != card1.id");
	}
	if(loadGame.ctx.table.cards.h[card2.id].id != card2.id) {
		throw new haxe_Exception("loadGame.ctx.table.cards[card2.id].id != card2.id");
	}
}
var model_ver1_game_component_IActiveEffectComponent = function() { };
$hxClasses["model.ver1.game.component.IActiveEffectComponent"] = model_ver1_game_component_IActiveEffectComponent;
model_ver1_game_component_IActiveEffectComponent.__name__ = "model.ver1.game.component.IActiveEffectComponent";
model_ver1_game_component_IActiveEffectComponent.__isInterface__ = true;
model_ver1_game_component_IActiveEffectComponent.prototype = {
	__class__: model_ver1_game_component_IActiveEffectComponent
};
function model_ver1_game_component_ActiveEffectComponent_setActiveEffect(ctx,effect) {
	ctx.activeEffect = effect;
}
function model_ver1_game_component_ActiveEffectComponent_getActiveEffect(ctx) {
	return ctx.activeEffect;
}
var model_ver1_game_component_IActivePlayerComponent = function() { };
$hxClasses["model.ver1.game.component.IActivePlayerComponent"] = model_ver1_game_component_IActivePlayerComponent;
model_ver1_game_component_IActivePlayerComponent.__name__ = "model.ver1.game.component.IActivePlayerComponent";
model_ver1_game_component_IActivePlayerComponent.__isInterface__ = true;
model_ver1_game_component_IActivePlayerComponent.prototype = {
	__class__: model_ver1_game_component_IActivePlayerComponent
};
function model_ver1_game_component_ActivePlayerComponent_setActivePlayerId(ctx,playerId) {
	ctx.activePlayerId = playerId;
}
function model_ver1_game_component_ActivePlayerComponent_getActivePlayerIdAndAssert(ctx) {
	var _g = ctx.activePlayerId;
	if(_g._hx_index == 0) {
		var playerId = _g.v;
		return playerId;
	} else {
		throw new haxe_Exception("activePlayerId not found");
	}
}
function model_ver1_game_component_ActivePlayerComponent_isPlayerTiming(ctx,useTiming,responsePlayerId,timing,playerId) {
	if(useTiming._hx_index == 1) {
		var _g = useTiming.timing;
		switch(useTiming.relativePlayer._hx_index) {
		case 0:
			if(responsePlayerId != playerId) {
				return false;
			}
			break;
		case 1:
			if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(playerId) != -1 == false) {
				throw haxe_Exception.thrown("playerId (" + playerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
			}
			var this1 = playerId;
			if(responsePlayerId != (this1 == model_ver1_game_define_PlayerId.A ? model_ver1_game_define_PlayerId.B : model_ver1_game_define_PlayerId.A)) {
				return false;
			}
			break;
		default:
		}
	}
	switch(useTiming._hx_index) {
	case 0:
		switch(useTiming.timing._hx_index) {
		case 0:
			var _g = timing.phase;
			var _g = timing.step;
			switch(timing.timing._hx_index) {
			case 1:case 3:
				return true;
			default:
			}
			break;
		case 1:
			var _g = timing.step;
			if(timing.phase._hx_index == 1) {
				switch(timing.timing._hx_index) {
				case 1:case 3:
					return true;
				default:
				}
			}
			break;
		case 3:
			var _g = timing.step;
			if(timing.phase._hx_index == 2) {
				switch(timing.timing._hx_index) {
				case 1:case 3:
					return true;
				default:
				}
			}
			break;
		case 4:
			var _g = timing.step;
			if(timing.phase._hx_index == 3) {
				switch(timing.timing._hx_index) {
				case 1:case 3:
					return true;
				default:
				}
			}
			break;
		case 5:
			var _g = timing.step;
			if(timing.phase._hx_index == 3) {
				if(_g._hx_index == 0) {
					if(_g.v._hx_index == 0) {
						switch(timing.timing._hx_index) {
						case 1:case 3:
							return true;
						default:
						}
					}
				}
			}
			break;
		case 6:
			var _g = timing.step;
			if(timing.phase._hx_index == 3) {
				if(_g._hx_index == 0) {
					if(_g.v._hx_index == 1) {
						switch(timing.timing._hx_index) {
						case 1:case 3:
							return true;
						default:
						}
					}
				}
			}
			break;
		case 7:
			var _g = timing.step;
			if(timing.phase._hx_index == 3) {
				if(_g._hx_index == 0) {
					if(_g.v._hx_index == 2) {
						switch(timing.timing._hx_index) {
						case 1:case 3:
							return true;
						default:
						}
					}
				}
			}
			break;
		case 8:
			var _g = timing.step;
			if(timing.phase._hx_index == 3) {
				if(_g._hx_index == 0) {
					if(_g.v._hx_index == 3) {
						switch(timing.timing._hx_index) {
						case 1:case 3:
							return true;
						default:
						}
					}
				}
			}
			break;
		default:
		}
		break;
	case 1:
		var _g = useTiming.relativePlayer;
		switch(useTiming.timing._hx_index) {
		case 0:
			var _g = timing.phase;
			var _g = timing.step;
			switch(timing.timing._hx_index) {
			case 1:case 3:
				return true;
			default:
			}
			break;
		case 1:
			var _g = timing.step;
			if(timing.phase._hx_index == 1) {
				switch(timing.timing._hx_index) {
				case 1:case 3:
					return true;
				default:
				}
			}
			break;
		case 3:
			var _g = timing.step;
			if(timing.phase._hx_index == 2) {
				switch(timing.timing._hx_index) {
				case 1:case 3:
					return true;
				default:
				}
			}
			break;
		case 4:
			var _g = timing.step;
			if(timing.phase._hx_index == 3) {
				switch(timing.timing._hx_index) {
				case 1:case 3:
					return true;
				default:
				}
			}
			break;
		case 5:
			var _g = timing.step;
			if(timing.phase._hx_index == 3) {
				if(_g._hx_index == 0) {
					if(_g.v._hx_index == 0) {
						switch(timing.timing._hx_index) {
						case 1:case 3:
							return true;
						default:
						}
					}
				}
			}
			break;
		case 6:
			var _g = timing.step;
			if(timing.phase._hx_index == 3) {
				if(_g._hx_index == 0) {
					if(_g.v._hx_index == 1) {
						switch(timing.timing._hx_index) {
						case 1:case 3:
							return true;
						default:
						}
					}
				}
			}
			break;
		case 7:
			var _g = timing.step;
			if(timing.phase._hx_index == 3) {
				if(_g._hx_index == 0) {
					if(_g.v._hx_index == 2) {
						switch(timing.timing._hx_index) {
						case 1:case 3:
							return true;
						default:
						}
					}
				}
			}
			break;
		case 8:
			var _g = timing.step;
			if(timing.phase._hx_index == 3) {
				if(_g._hx_index == 0) {
					if(_g.v._hx_index == 3) {
						switch(timing.timing._hx_index) {
						case 1:case 3:
							return true;
						default:
						}
					}
				}
			}
			break;
		default:
		}
		break;
	}
	return false;
}
var model_ver1_game_component_ICardProtoPoolComponent = function() { };
$hxClasses["model.ver1.game.component.ICardProtoPoolComponent"] = model_ver1_game_component_ICardProtoPoolComponent;
model_ver1_game_component_ICardProtoPoolComponent.__name__ = "model.ver1.game.component.ICardProtoPoolComponent";
model_ver1_game_component_ICardProtoPoolComponent.__isInterface__ = true;
model_ver1_game_component_ICardProtoPoolComponent.prototype = {
	__class__: model_ver1_game_component_ICardProtoPoolComponent
};
function model_ver1_game_component_CardProtoPoolComponent_registerCardProto(ctx,key,proto) {
	ctx.cardProtoPool.h[key] = proto;
}
function model_ver1_game_component_CardProtoPoolComponent_getCurrentCardProto(ctx,key) {
	var obj = ctx.cardProtoPool.h[key];
	if(obj == null) {
		return model_ver1_game_data_DataBinding_getCardProto(key);
	}
	return obj;
}
var model_ver1_game_component_ICardStateComponent = function() { };
$hxClasses["model.ver1.game.component.ICardStateComponent"] = model_ver1_game_component_ICardStateComponent;
model_ver1_game_component_ICardStateComponent.__name__ = "model.ver1.game.component.ICardStateComponent";
model_ver1_game_component_ICardStateComponent.__isInterface__ = true;
model_ver1_game_component_ICardStateComponent.prototype = {
	__class__: model_ver1_game_component_ICardStateComponent
};
function model_ver1_game_component_CardStateComponent_getCardState(ctx,cardId) {
	var cardState = ctx.cardStates.h[cardId];
	if(cardState == null) {
		return { ints : new haxe_ds_StringMap(), strings : new haxe_ds_StringMap(), bools : new haxe_ds_StringMap()};
	}
	return cardState;
}
function model_ver1_game_component_CardStateComponent_setCardState(ctx,cardId,cardState) {
	ctx.cardStates.h[cardId] = cardState;
}
var model_ver1_game_component_IEffectComponent = function() { };
$hxClasses["model.ver1.game.component.IEffectComponent"] = model_ver1_game_component_IEffectComponent;
model_ver1_game_component_IEffectComponent.__name__ = "model.ver1.game.component.IEffectComponent";
model_ver1_game_component_IEffectComponent.__isInterface__ = true;
model_ver1_game_component_IEffectComponent.prototype = {
	__class__: model_ver1_game_component_IEffectComponent
};
var model_ver1_game_component_ICutComponent = function() { };
$hxClasses["model.ver1.game.component.ICutComponent"] = model_ver1_game_component_ICutComponent;
model_ver1_game_component_ICutComponent.__name__ = "model.ver1.game.component.ICutComponent";
model_ver1_game_component_ICutComponent.__isInterface__ = true;
model_ver1_game_component_ICutComponent.__interfaces__ = [model_ver1_game_component_IEffectComponent];
model_ver1_game_component_ICutComponent.prototype = {
	__class__: model_ver1_game_component_ICutComponent
};
function model_ver1_game_component_CutComponent_getTopCut(ctx) {
	if(ctx.cuts.length == 0) {
		return [];
	}
	var topCut = ctx.cuts[ctx.cuts.length - 1];
	if(topCut.length == 0) {
		ctx.cuts.pop();
		if(ctx.cuts.length == 0) {
			return [];
		}
	}
	var result = new Array(topCut.length);
	var _g = 0;
	var _g1 = topCut.length;
	while(_g < _g1) {
		var i = _g++;
		result[i] = ctx.effects.h[topCut[i]];
	}
	return result;
}
function model_ver1_game_component_CutComponent_cutIn(ctx,block) {
	if(ctx.cuts.length == 0) {
		ctx.cuts.push([]);
	}
	var topCut = ctx.cuts[ctx.cuts.length - 1];
	topCut.push(block.id);
	model_ver1_game_component_EffectComponent_addEffect(ctx,block);
}
function model_ver1_game_component_CutComponent_newCut(ctx,block) {
	ctx.cuts.push([block.id]);
	model_ver1_game_component_EffectComponent_addEffect(ctx,block);
}
function model_ver1_game_component_CutComponent_removeEffect(ctx,blockId) {
	var _g = 0;
	var _g1 = ctx.cuts;
	while(_g < _g1.length) {
		var sub = _g1[_g];
		++_g;
		HxOverrides.remove(sub,blockId);
	}
	model_ver1_game_component_EffectComponent_removeEffect(ctx,blockId);
}
function model_ver1_game_component_CutComponent_getImmediateEffects(ctx) {
	var _g = [];
	var _g1 = 0;
	var _g2 = model_ver1_game_component_CutComponent_getTopCut(ctx);
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		if(v.isImmediate) {
			_g.push(v);
		}
	}
	return _g;
}
function model_ver1_game_component_EffectComponent_getEffects(ctx) {
	var _g = [];
	var h = ctx.effects.h;
	var block_h = h;
	var block_keys = Object.keys(h);
	var block_length = block_keys.length;
	var block_current = 0;
	while(block_current < block_length) {
		var block = block_h[block_keys[block_current++]];
		_g.push(block);
	}
	return _g;
}
function model_ver1_game_component_EffectComponent_getEffect(ctx,blockId) {
	if(ctx.effects.h[blockId] == null) {
		throw new haxe_Exception("block not found");
	}
	return ctx.effects.h[blockId];
}
function model_ver1_game_component_EffectComponent_removeEffect(ctx,blockId) {
	var _this = ctx.effects;
	if(Object.prototype.hasOwnProperty.call(_this.h,blockId)) {
		delete(_this.h[blockId]);
	}
}
function model_ver1_game_component_EffectComponent_addEffect(ctx,block) {
	if(ctx.effects.h[block.id] != null) {
		throw new haxe_Exception("block exists");
	}
	ctx.effects.h[block.id] = block;
}
var model_ver1_game_component_IMarkComponent = function() { };
$hxClasses["model.ver1.game.component.IMarkComponent"] = model_ver1_game_component_IMarkComponent;
model_ver1_game_component_IMarkComponent.__name__ = "model.ver1.game.component.IMarkComponent";
model_ver1_game_component_IMarkComponent.__isInterface__ = true;
model_ver1_game_component_IMarkComponent.prototype = {
	__class__: model_ver1_game_component_IMarkComponent
};
function model_ver1_game_component_MarkComponent_addMark(ctx,mark) {
	if(Object.prototype.hasOwnProperty.call(ctx.marks.h,mark.id)) {
		throw new haxe_Exception("mark exists: " + mark.id);
	}
	ctx.marks.h[mark.id] = mark;
}
function model_ver1_game_component_MarkComponent_removeMark(ctx,id) {
	var _this = ctx.marks;
	if(Object.prototype.hasOwnProperty.call(_this.h,id)) {
		delete(_this.h[id]);
	}
}
function model_ver1_game_component_MarkComponent_getMarks(ctx) {
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
	return _g;
}
var model_ver1_game_component_IPlayerStateComponent = function() { };
$hxClasses["model.ver1.game.component.IPlayerStateComponent"] = model_ver1_game_component_IPlayerStateComponent;
model_ver1_game_component_IPlayerStateComponent.__name__ = "model.ver1.game.component.IPlayerStateComponent";
model_ver1_game_component_IPlayerStateComponent.__isInterface__ = true;
model_ver1_game_component_IPlayerStateComponent.prototype = {
	__class__: model_ver1_game_component_IPlayerStateComponent
};
function model_ver1_game_component_PlayerStateComponent_getPlayerState(ctx,playerId) {
	var playerState = ctx.playerStates.h[playerId];
	if(playerState == null) {
		return { hasPlayG : false};
	}
	return playerState;
}
function model_ver1_game_component_PlayerStateComponent_setCardState(ctx,playerId,playerState) {
	ctx.playerStates.h[playerId] = playerState;
}
var model_ver1_game_component_ISelectionComponent = function() { };
$hxClasses["model.ver1.game.component.ISelectionComponent"] = model_ver1_game_component_ISelectionComponent;
model_ver1_game_component_ISelectionComponent.__name__ = "model.ver1.game.component.ISelectionComponent";
model_ver1_game_component_ISelectionComponent.__isInterface__ = true;
model_ver1_game_component_ISelectionComponent.prototype = {
	__class__: model_ver1_game_component_ISelectionComponent
};
function model_ver1_game_component_SelectionComponent_getPlayerSelectionCardId(ctx,key) {
	var selection = ctx.playerSelection.cardIds.h[key];
	if(selection == null) {
		throw new haxe_Exception("selection not found");
	}
	return selection;
}
function model_ver1_game_component_SelectionComponent_setPlayerSelectionCardId(ctx,key,values) {
	ctx.playerSelection.cardIds.h[key] = values;
}
var model_ver1_game_component_ITableComponent = function() { };
$hxClasses["model.ver1.game.component.ITableComponent"] = model_ver1_game_component_ITableComponent;
model_ver1_game_component_ITableComponent.__name__ = "model.ver1.game.component.ITableComponent";
model_ver1_game_component_ITableComponent.__isInterface__ = true;
model_ver1_game_component_ITableComponent.prototype = {
	__class__: model_ver1_game_component_ITableComponent
};
function model_ver1_game_component_TableComponent_getCard(ctx,cardId) {
	return tool_Table_getCard(ctx.table,cardId);
}
function model_ver1_game_component_TableComponent_getCards(ctx) {
	return tool_Table_getCards(ctx.table);
}
function model_ver1_game_component_TableComponent_moveCard(ctx,cardId,from,to) {
	var playerId = from.playerId;
	var baSyouKeyword = from.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	var playerId = to.playerId;
	var baSyouKeyword = to.baSyouKeyword;
	var this2 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	tool_Table_moveCard(ctx.table,cardId,this1,this2);
}
function model_ver1_game_component_TableComponent_rollCard(ctx,cardId) {
	var card = model_ver1_game_component_TableComponent_getCard(ctx,cardId);
	if(card.isTap) {
		throw new haxe_Exception("already tap");
	}
	card.isTap = true;
}
function model_ver1_game_component_TableComponent_rerollCard(ctx,cardId) {
	var card = model_ver1_game_component_TableComponent_getCard(ctx,cardId);
	if(card.isTap == false) {
		throw new haxe_Exception("already reroll");
	}
	card.isTap = false;
}
function model_ver1_game_component_TableComponent_getCardOwner(ctx,cardId) {
	var owner = model_ver1_game_component_TableComponent_getCard(ctx,cardId).owner;
	if(owner == null) {
		throw haxe_Exception.thrown("owner not set yet");
	}
	return owner;
}
function model_ver1_game_component_TableComponent_getCardsByOwner(ctx,owner) {
	var _g = [];
	var _g1 = 0;
	var _g2 = tool_Table_getCards(ctx.table);
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		if(v.owner == owner) {
			_g.push(v);
		}
	}
	return _g;
}
function model_ver1_game_component_TableComponent_getCardBaSyouAndAssertExist(ctx,cardId) {
	var _g = tool_Table_getCardCardStack(ctx.table,cardId);
	if(_g._hx_index == 0) {
		var cardStack = _g.v;
		var this1 = cardStack.id;
		var ret = this1;
		model_ver1_game_define_BaSyouId.toBaSyou(ret);
		return model_ver1_game_define_BaSyouId.toBaSyou(ret);
	} else {
		console.log("src/model/ver1/game/component/TableComponent.hx:56:",ctx);
		throw new haxe_Exception("card baSyou not found: " + cardId);
	}
}
function model_ver1_game_component_TableComponent_returnToOwnerHand(ctx,cardId) {
	var from = model_ver1_game_component_TableComponent_getCardBaSyouAndAssertExist(ctx,cardId);
	var to = model_ver1_game_define_BaSyou.Default(model_ver1_game_component_TableComponent_getCardOwner(ctx,cardId),model_ver1_game_define_BaSyouKeyword.TeHuTa);
	model_ver1_game_component_TableComponent_moveCard(ctx,cardId,from,to);
}
function model_ver1_game_component_TableComponent_getCardIdsByBaSyou(ctx,baSyou) {
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	return tool_Table_getCardStack(ctx.table,this1).cardIds;
}
function model_ver1_game_component_TableComponent_getCardController(ctx,cardId) {
	var _g = model_ver1_game_component_TableComponent_getCardBaSyouAndAssertExist(ctx,cardId);
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
function model_ver1_game_component_TableComponent_getCardControllerAndAssertExist(ctx,cardId) {
	var _g = model_ver1_game_component_TableComponent_getCardController(ctx,cardId);
	if(_g._hx_index == 0) {
		var playerId = _g.v;
		return playerId;
	} else {
		throw new haxe_Exception("卡片被除外，沒有控制者");
	}
}
function model_ver1_game_component_TableComponent_isMyCard(ctx,masterCardId,slaveCardId) {
	var _g = model_ver1_game_component_TableComponent_getCardController(ctx,masterCardId);
	var _g1 = model_ver1_game_component_TableComponent_getCardController(ctx,slaveCardId);
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
function model_ver1_game_component_TableComponent_isOpponentsCard(ctx,masterCardId,slaveCardId) {
	var _g = model_ver1_game_component_TableComponent_getCardController(ctx,masterCardId);
	var _g1 = model_ver1_game_component_TableComponent_getCardController(ctx,slaveCardId);
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
function model_ver1_game_component_TableComponent_isCardBySyouIn(ctx,baSyous) {
	return function(card) {
		return false;
	};
}
var model_ver1_game_component_ITimingComponent = function() { };
$hxClasses["model.ver1.game.component.ITimingComponent"] = model_ver1_game_component_ITimingComponent;
model_ver1_game_component_ITimingComponent.__name__ = "model.ver1.game.component.ITimingComponent";
model_ver1_game_component_ITimingComponent.__isInterface__ = true;
model_ver1_game_component_ITimingComponent.prototype = {
	__class__: model_ver1_game_component_ITimingComponent
};
function model_ver1_game_component_TimingComponent_setTiming(ctx,timing) {
	ctx.timing = timing;
}
function model_ver1_game_component_TimingComponent_getTiming(ctx) {
	return ctx.timing;
}
function model_ver1_game_component_TimingComponent_isTiming(ctx,timing) {
	return Type.enumEq(ctx.timing,timing);
}
var model_ver1_game_define_CardCategory = $hxEnums["model.ver1.game.define.CardCategory"] = { __ename__:"model.ver1.game.define.CardCategory",__constructs__:null
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
var model_ver1_game_define_BaSyouKeyword = $hxEnums["model.ver1.game.define.BaSyouKeyword"] = { __ename__:"model.ver1.game.define.BaSyouKeyword",__constructs__:null
	,HonGoku: {_hx_name:"HonGoku",_hx_index:0,__enum__:"model.ver1.game.define.BaSyouKeyword",toString:$estr}
	,SuteYama: {_hx_name:"SuteYama",_hx_index:1,__enum__:"model.ver1.game.define.BaSyouKeyword",toString:$estr}
	,SpaceArea: {_hx_name:"SpaceArea",_hx_index:2,__enum__:"model.ver1.game.define.BaSyouKeyword",toString:$estr}
	,EarthArea: {_hx_name:"EarthArea",_hx_index:3,__enum__:"model.ver1.game.define.BaSyouKeyword",toString:$estr}
	,MaintenanceArea: {_hx_name:"MaintenanceArea",_hx_index:4,__enum__:"model.ver1.game.define.BaSyouKeyword",toString:$estr}
	,GZone: {_hx_name:"GZone",_hx_index:5,__enum__:"model.ver1.game.define.BaSyouKeyword",toString:$estr}
	,JunkYard: {_hx_name:"JunkYard",_hx_index:6,__enum__:"model.ver1.game.define.BaSyouKeyword",toString:$estr}
	,TeHuTa: {_hx_name:"TeHuTa",_hx_index:7,__enum__:"model.ver1.game.define.BaSyouKeyword",toString:$estr}
	,Hanger: {_hx_name:"Hanger",_hx_index:8,__enum__:"model.ver1.game.define.BaSyouKeyword",toString:$estr}
	,PlayedCard: {_hx_name:"PlayedCard",_hx_index:9,__enum__:"model.ver1.game.define.BaSyouKeyword",toString:$estr}
	,RemovedCard: {_hx_name:"RemovedCard",_hx_index:10,__enum__:"model.ver1.game.define.BaSyouKeyword",toString:$estr}
};
model_ver1_game_define_BaSyouKeyword.__constructs__ = [model_ver1_game_define_BaSyouKeyword.HonGoku,model_ver1_game_define_BaSyouKeyword.SuteYama,model_ver1_game_define_BaSyouKeyword.SpaceArea,model_ver1_game_define_BaSyouKeyword.EarthArea,model_ver1_game_define_BaSyouKeyword.MaintenanceArea,model_ver1_game_define_BaSyouKeyword.GZone,model_ver1_game_define_BaSyouKeyword.JunkYard,model_ver1_game_define_BaSyouKeyword.TeHuTa,model_ver1_game_define_BaSyouKeyword.Hanger,model_ver1_game_define_BaSyouKeyword.PlayedCard,model_ver1_game_define_BaSyouKeyword.RemovedCard];
var model_ver1_game_define_BaSyou = $hxEnums["model.ver1.game.define.BaSyou"] = { __ename__:"model.ver1.game.define.BaSyou",__constructs__:null
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
var model_ver1_game_define_RelativePlayer = $hxEnums["model.ver1.game.define.RelativePlayer"] = { __ename__:"model.ver1.game.define.RelativePlayer",__constructs__:null
	,You: {_hx_name:"You",_hx_index:0,__enum__:"model.ver1.game.define.RelativePlayer",toString:$estr}
	,Opponent: {_hx_name:"Opponent",_hx_index:1,__enum__:"model.ver1.game.define.RelativePlayer",toString:$estr}
};
model_ver1_game_define_RelativePlayer.__constructs__ = [model_ver1_game_define_RelativePlayer.You,model_ver1_game_define_RelativePlayer.Opponent];
var model_ver1_game_define_AbsoluteUseTiming = $hxEnums["model.ver1.game.define.AbsoluteUseTiming"] = { __ename__:"model.ver1.game.define.AbsoluteUseTiming",__constructs__:null
	,Any: {_hx_name:"Any",_hx_index:0,__enum__:"model.ver1.game.define.AbsoluteUseTiming",toString:$estr}
	,Draw: {_hx_name:"Draw",_hx_index:1,__enum__:"model.ver1.game.define.AbsoluteUseTiming",toString:$estr}
	,Reroll: {_hx_name:"Reroll",_hx_index:2,__enum__:"model.ver1.game.define.AbsoluteUseTiming",toString:$estr}
	,Maintenance: {_hx_name:"Maintenance",_hx_index:3,__enum__:"model.ver1.game.define.AbsoluteUseTiming",toString:$estr}
	,Battle: {_hx_name:"Battle",_hx_index:4,__enum__:"model.ver1.game.define.AbsoluteUseTiming",toString:$estr}
	,Attack: {_hx_name:"Attack",_hx_index:5,__enum__:"model.ver1.game.define.AbsoluteUseTiming",toString:$estr}
	,Defense: {_hx_name:"Defense",_hx_index:6,__enum__:"model.ver1.game.define.AbsoluteUseTiming",toString:$estr}
	,DamageChecking: {_hx_name:"DamageChecking",_hx_index:7,__enum__:"model.ver1.game.define.AbsoluteUseTiming",toString:$estr}
	,Return: {_hx_name:"Return",_hx_index:8,__enum__:"model.ver1.game.define.AbsoluteUseTiming",toString:$estr}
};
model_ver1_game_define_AbsoluteUseTiming.__constructs__ = [model_ver1_game_define_AbsoluteUseTiming.Any,model_ver1_game_define_AbsoluteUseTiming.Draw,model_ver1_game_define_AbsoluteUseTiming.Reroll,model_ver1_game_define_AbsoluteUseTiming.Maintenance,model_ver1_game_define_AbsoluteUseTiming.Battle,model_ver1_game_define_AbsoluteUseTiming.Attack,model_ver1_game_define_AbsoluteUseTiming.Defense,model_ver1_game_define_AbsoluteUseTiming.DamageChecking,model_ver1_game_define_AbsoluteUseTiming.Return];
var model_ver1_game_define_RelativeUseTiming = $hxEnums["model.ver1.game.define.RelativeUseTiming"] = { __ename__:"model.ver1.game.define.RelativeUseTiming",__constructs__:null
	,Turn: {_hx_name:"Turn",_hx_index:0,__enum__:"model.ver1.game.define.RelativeUseTiming",toString:$estr}
	,Draw: {_hx_name:"Draw",_hx_index:1,__enum__:"model.ver1.game.define.RelativeUseTiming",toString:$estr}
	,Reroll: {_hx_name:"Reroll",_hx_index:2,__enum__:"model.ver1.game.define.RelativeUseTiming",toString:$estr}
	,Maintenance: {_hx_name:"Maintenance",_hx_index:3,__enum__:"model.ver1.game.define.RelativeUseTiming",toString:$estr}
	,Battle: {_hx_name:"Battle",_hx_index:4,__enum__:"model.ver1.game.define.RelativeUseTiming",toString:$estr}
	,Attack: {_hx_name:"Attack",_hx_index:5,__enum__:"model.ver1.game.define.RelativeUseTiming",toString:$estr}
	,Defense: {_hx_name:"Defense",_hx_index:6,__enum__:"model.ver1.game.define.RelativeUseTiming",toString:$estr}
	,DamageChecking: {_hx_name:"DamageChecking",_hx_index:7,__enum__:"model.ver1.game.define.RelativeUseTiming",toString:$estr}
	,Return: {_hx_name:"Return",_hx_index:8,__enum__:"model.ver1.game.define.RelativeUseTiming",toString:$estr}
};
model_ver1_game_define_RelativeUseTiming.__constructs__ = [model_ver1_game_define_RelativeUseTiming.Turn,model_ver1_game_define_RelativeUseTiming.Draw,model_ver1_game_define_RelativeUseTiming.Reroll,model_ver1_game_define_RelativeUseTiming.Maintenance,model_ver1_game_define_RelativeUseTiming.Battle,model_ver1_game_define_RelativeUseTiming.Attack,model_ver1_game_define_RelativeUseTiming.Defense,model_ver1_game_define_RelativeUseTiming.DamageChecking,model_ver1_game_define_RelativeUseTiming.Return];
var model_ver1_game_define_UseTiming = $hxEnums["model.ver1.game.define.UseTiming"] = { __ename__:"model.ver1.game.define.UseTiming",__constructs__:null
	,Absolute: ($_=function(timing) { return {_hx_index:0,timing:timing,__enum__:"model.ver1.game.define.UseTiming",toString:$estr}; },$_._hx_name="Absolute",$_.__params__ = ["timing"],$_)
	,Relative: ($_=function(relativePlayer,timing) { return {_hx_index:1,relativePlayer:relativePlayer,timing:timing,__enum__:"model.ver1.game.define.UseTiming",toString:$estr}; },$_._hx_name="Relative",$_.__params__ = ["relativePlayer","timing"],$_)
};
model_ver1_game_define_UseTiming.__constructs__ = [model_ver1_game_define_UseTiming.Absolute,model_ver1_game_define_UseTiming.Relative];
var model_ver1_game_define_TextTypeAutomaticType = $hxEnums["model.ver1.game.define.TextTypeAutomaticType"] = { __ename__:"model.ver1.game.define.TextTypeAutomaticType",__constructs__:null
	,Resident: {_hx_name:"Resident",_hx_index:0,__enum__:"model.ver1.game.define.TextTypeAutomaticType",toString:$estr}
	,Trigger: {_hx_name:"Trigger",_hx_index:1,__enum__:"model.ver1.game.define.TextTypeAutomaticType",toString:$estr}
	,Constant: {_hx_name:"Constant",_hx_index:2,__enum__:"model.ver1.game.define.TextTypeAutomaticType",toString:$estr}
};
model_ver1_game_define_TextTypeAutomaticType.__constructs__ = [model_ver1_game_define_TextTypeAutomaticType.Resident,model_ver1_game_define_TextTypeAutomaticType.Trigger,model_ver1_game_define_TextTypeAutomaticType.Constant];
var model_ver1_game_define_TextTypeSpecialType = $hxEnums["model.ver1.game.define.TextTypeSpecialType"] = { __ename__:"model.ver1.game.define.TextTypeSpecialType",__constructs__:null
	,HighMobility: {_hx_name:"HighMobility",_hx_index:0,__enum__:"model.ver1.game.define.TextTypeSpecialType",toString:$estr}
	,Haste: {_hx_name:"Haste",_hx_index:1,__enum__:"model.ver1.game.define.TextTypeSpecialType",toString:$estr}
	,Psycommu: ($_=function(power) { return {_hx_index:2,power:power,__enum__:"model.ver1.game.define.TextTypeSpecialType",toString:$estr}; },$_._hx_name="Psycommu",$_.__params__ = ["power"],$_)
	,Assault: {_hx_name:"Assault",_hx_index:3,__enum__:"model.ver1.game.define.TextTypeSpecialType",toString:$estr}
	,RangeWeapons: ($_=function(power) { return {_hx_index:4,power:power,__enum__:"model.ver1.game.define.TextTypeSpecialType",toString:$estr}; },$_._hx_name="RangeWeapons",$_.__params__ = ["power"],$_)
	,Gain: {_hx_name:"Gain",_hx_index:5,__enum__:"model.ver1.game.define.TextTypeSpecialType",toString:$estr}
	,Refit: ($_=function(name) { return {_hx_index:6,name:name,__enum__:"model.ver1.game.define.TextTypeSpecialType",toString:$estr}; },$_._hx_name="Refit",$_.__params__ = ["name"],$_)
	,Share: ($_=function(name) { return {_hx_index:7,name:name,__enum__:"model.ver1.game.define.TextTypeSpecialType",toString:$estr}; },$_._hx_name="Share",$_.__params__ = ["name"],$_)
	,Supply: {_hx_name:"Supply",_hx_index:8,__enum__:"model.ver1.game.define.TextTypeSpecialType",toString:$estr}
	,CrossWeapon: ($_=function(name) { return {_hx_index:9,name:name,__enum__:"model.ver1.game.define.TextTypeSpecialType",toString:$estr}; },$_._hx_name="CrossWeapon",$_.__params__ = ["name"],$_)
	,PSArmor: {_hx_name:"PSArmor",_hx_index:10,__enum__:"model.ver1.game.define.TextTypeSpecialType",toString:$estr}
	,Quick: {_hx_name:"Quick",_hx_index:11,__enum__:"model.ver1.game.define.TextTypeSpecialType",toString:$estr}
	,CombatDeployment: {_hx_name:"CombatDeployment",_hx_index:12,__enum__:"model.ver1.game.define.TextTypeSpecialType",toString:$estr}
	,Stay: {_hx_name:"Stay",_hx_index:13,__enum__:"model.ver1.game.define.TextTypeSpecialType",toString:$estr}
	,Limit1: {_hx_name:"Limit1",_hx_index:14,__enum__:"model.ver1.game.define.TextTypeSpecialType",toString:$estr}
};
model_ver1_game_define_TextTypeSpecialType.__constructs__ = [model_ver1_game_define_TextTypeSpecialType.HighMobility,model_ver1_game_define_TextTypeSpecialType.Haste,model_ver1_game_define_TextTypeSpecialType.Psycommu,model_ver1_game_define_TextTypeSpecialType.Assault,model_ver1_game_define_TextTypeSpecialType.RangeWeapons,model_ver1_game_define_TextTypeSpecialType.Gain,model_ver1_game_define_TextTypeSpecialType.Refit,model_ver1_game_define_TextTypeSpecialType.Share,model_ver1_game_define_TextTypeSpecialType.Supply,model_ver1_game_define_TextTypeSpecialType.CrossWeapon,model_ver1_game_define_TextTypeSpecialType.PSArmor,model_ver1_game_define_TextTypeSpecialType.Quick,model_ver1_game_define_TextTypeSpecialType.CombatDeployment,model_ver1_game_define_TextTypeSpecialType.Stay,model_ver1_game_define_TextTypeSpecialType.Limit1];
var model_ver1_game_define_TextType = $hxEnums["model.ver1.game.define.TextType"] = { __ename__:"model.ver1.game.define.TextType",__constructs__:null
	,Automatic: ($_=function(type) { return {_hx_index:0,type:type,__enum__:"model.ver1.game.define.TextType",toString:$estr}; },$_._hx_name="Automatic",$_.__params__ = ["type"],$_)
	,Use: ($_=function(timing) { return {_hx_index:1,timing:timing,__enum__:"model.ver1.game.define.TextType",toString:$estr}; },$_._hx_name="Use",$_.__params__ = ["timing"],$_)
	,Special: ($_=function(type) { return {_hx_index:2,type:type,__enum__:"model.ver1.game.define.TextType",toString:$estr}; },$_._hx_name="Special",$_.__params__ = ["type"],$_)
	,PlayCard: ($_=function(timing) { return {_hx_index:3,timing:timing,__enum__:"model.ver1.game.define.TextType",toString:$estr}; },$_._hx_name="PlayCard",$_.__params__ = ["timing"],$_)
	,System: {_hx_name:"System",_hx_index:4,__enum__:"model.ver1.game.define.TextType",toString:$estr}
};
model_ver1_game_define_TextType.__constructs__ = [model_ver1_game_define_TextType.Automatic,model_ver1_game_define_TextType.Use,model_ver1_game_define_TextType.Special,model_ver1_game_define_TextType.PlayCard,model_ver1_game_define_TextType.System];
var model_ver1_game_define_CardEntityCategory = $hxEnums["model.ver1.game.define.CardEntityCategory"] = { __ename__:"model.ver1.game.define.CardEntityCategory",__constructs__:null
	,Unit: {_hx_name:"Unit",_hx_index:0,__enum__:"model.ver1.game.define.CardEntityCategory",toString:$estr}
	,Character: {_hx_name:"Character",_hx_index:1,__enum__:"model.ver1.game.define.CardEntityCategory",toString:$estr}
	,Operation: {_hx_name:"Operation",_hx_index:2,__enum__:"model.ver1.game.define.CardEntityCategory",toString:$estr}
	,G: {_hx_name:"G",_hx_index:3,__enum__:"model.ver1.game.define.CardEntityCategory",toString:$estr}
};
model_ver1_game_define_CardEntityCategory.__constructs__ = [model_ver1_game_define_CardEntityCategory.Unit,model_ver1_game_define_CardEntityCategory.Character,model_ver1_game_define_CardEntityCategory.Operation,model_ver1_game_define_CardEntityCategory.G];
var model_ver1_game_define_GColor = $hxEnums["model.ver1.game.define.GColor"] = { __ename__:"model.ver1.game.define.GColor",__constructs__:null
	,Red: {_hx_name:"Red",_hx_index:0,__enum__:"model.ver1.game.define.GColor",toString:$estr}
	,Black: {_hx_name:"Black",_hx_index:1,__enum__:"model.ver1.game.define.GColor",toString:$estr}
	,Purple: {_hx_name:"Purple",_hx_index:2,__enum__:"model.ver1.game.define.GColor",toString:$estr}
};
model_ver1_game_define_GColor.__constructs__ = [model_ver1_game_define_GColor.Red,model_ver1_game_define_GColor.Black,model_ver1_game_define_GColor.Purple];
var model_ver1_game_define_GProperty = $hxEnums["model.ver1.game.define.GProperty"] = { __ename__:"model.ver1.game.define.GProperty",__constructs__:null
	,Uc: {_hx_name:"Uc",_hx_index:0,__enum__:"model.ver1.game.define.GProperty",toString:$estr}
	,Zero8: {_hx_name:"Zero8",_hx_index:1,__enum__:"model.ver1.game.define.GProperty",toString:$estr}
};
model_ver1_game_define_GProperty.__constructs__ = [model_ver1_game_define_GProperty.Uc,model_ver1_game_define_GProperty.Zero8];
var model_ver1_game_define_GSign = $hxEnums["model.ver1.game.define.GSign"] = { __ename__:"model.ver1.game.define.GSign",__constructs__:null
	,Default: ($_=function(color,property) { return {_hx_index:0,color:color,property:property,__enum__:"model.ver1.game.define.GSign",toString:$estr}; },$_._hx_name="Default",$_.__params__ = ["color","property"],$_)
};
model_ver1_game_define_GSign.__constructs__ = [model_ver1_game_define_GSign.Default];
var model_ver1_game_define_BattlePoint = $hxEnums["model.ver1.game.define.BattlePoint"] = { __ename__:"model.ver1.game.define.BattlePoint",__constructs__:null
	,Default: ($_=function(melee,range,hp) { return {_hx_index:0,melee:melee,range:range,hp:hp,__enum__:"model.ver1.game.define.BattlePoint",toString:$estr}; },$_._hx_name="Default",$_.__params__ = ["melee","range","hp"],$_)
};
model_ver1_game_define_BattlePoint.__constructs__ = [model_ver1_game_define_BattlePoint.Default];
var model_ver1_game_define_RollCost = $hxEnums["model.ver1.game.define.RollCost"] = { __ename__:"model.ver1.game.define.RollCost",__constructs__:null
};
model_ver1_game_define_RollCost.__constructs__ = [];
var model_ver1_game_define_EffectCause = $hxEnums["model.ver1.game.define.EffectCause"] = { __ename__:"model.ver1.game.define.EffectCause",__constructs__:null
	,Pending: {_hx_name:"Pending",_hx_index:0,__enum__:"model.ver1.game.define.EffectCause",toString:$estr}
	,System: ($_=function(respnosePlayerId) { return {_hx_index:1,respnosePlayerId:respnosePlayerId,__enum__:"model.ver1.game.define.EffectCause",toString:$estr}; },$_._hx_name="System",$_.__params__ = ["respnosePlayerId"],$_)
	,PlayCard: ($_=function(playerId,cardId) { return {_hx_index:2,playerId:playerId,cardId:cardId,__enum__:"model.ver1.game.define.EffectCause",toString:$estr}; },$_._hx_name="PlayCard",$_.__params__ = ["playerId","cardId"],$_)
	,PlayText: ($_=function(cardId,textId) { return {_hx_index:3,cardId:cardId,textId:textId,__enum__:"model.ver1.game.define.EffectCause",toString:$estr}; },$_._hx_name="PlayText",$_.__params__ = ["cardId","textId"],$_)
	,TextEffect: ($_=function(cardId,textId) { return {_hx_index:4,cardId:cardId,textId:textId,__enum__:"model.ver1.game.define.EffectCause",toString:$estr}; },$_._hx_name="TextEffect",$_.__params__ = ["cardId","textId"],$_)
};
model_ver1_game_define_EffectCause.__constructs__ = [model_ver1_game_define_EffectCause.Pending,model_ver1_game_define_EffectCause.System,model_ver1_game_define_EffectCause.PlayCard,model_ver1_game_define_EffectCause.PlayText,model_ver1_game_define_EffectCause.TextEffect];
var model_ver1_game_define_Effect = function(id,cause,text) {
	this.isOption = false;
	this.isImmediate = false;
	this.id = id;
	this.cause = cause;
	this.text = text;
};
$hxClasses["model.ver1.game.define.Effect"] = model_ver1_game_define_Effect;
model_ver1_game_define_Effect.__name__ = "model.ver1.game.define.Effect";
model_ver1_game_define_Effect.prototype = {
	__class__: model_ver1_game_define_Effect
};
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
var model_ver1_game_define_RequireType = $hxEnums["model.ver1.game.define.RequireType"] = { __ename__:"model.ver1.game.define.RequireType",__constructs__:null
	,Pending: {_hx_name:"Pending",_hx_index:0,__enum__:"model.ver1.game.define.RequireType",toString:$estr}
	,SelectCard: ($_=function(tips,lengthInclude) { return {_hx_index:1,tips:tips,lengthInclude:lengthInclude,__enum__:"model.ver1.game.define.RequireType",toString:$estr}; },$_._hx_name="SelectCard",$_.__params__ = ["tips","lengthInclude"],$_)
	,SelectBattlePoint: ($_=function(tips) { return {_hx_index:2,tips:tips,__enum__:"model.ver1.game.define.RequireType",toString:$estr}; },$_._hx_name="SelectBattlePoint",$_.__params__ = ["tips"],$_)
};
model_ver1_game_define_RequireType.__constructs__ = [model_ver1_game_define_RequireType.Pending,model_ver1_game_define_RequireType.SelectCard,model_ver1_game_define_RequireType.SelectBattlePoint];
var model_ver1_game_define_Runtime = function() { };
$hxClasses["model.ver1.game.define.Runtime"] = model_ver1_game_define_Runtime;
model_ver1_game_define_Runtime.__name__ = "model.ver1.game.define.Runtime";
model_ver1_game_define_Runtime.__isInterface__ = true;
model_ver1_game_define_Runtime.prototype = {
	__class__: model_ver1_game_define_Runtime
};
var model_ver1_game_define_AbstractRuntime = function() {
};
$hxClasses["model.ver1.game.define.AbstractRuntime"] = model_ver1_game_define_AbstractRuntime;
model_ver1_game_define_AbstractRuntime.__name__ = "model.ver1.game.define.AbstractRuntime";
model_ver1_game_define_AbstractRuntime.__interfaces__ = [model_ver1_game_define_Runtime];
model_ver1_game_define_AbstractRuntime.prototype = {
	getCardId: function() {
		throw new haxe_Exception("not support");
	}
	,getResponsePlayerId: function() {
		throw new haxe_Exception("not support");
	}
	,__class__: model_ver1_game_define_AbstractRuntime
};
var model_ver1_game_define_SystemRuntime = function(responsePlayerId) {
	model_ver1_game_define_AbstractRuntime.call(this);
	this.responsePlayerId = responsePlayerId;
};
$hxClasses["model.ver1.game.define.SystemRuntime"] = model_ver1_game_define_SystemRuntime;
model_ver1_game_define_SystemRuntime.__name__ = "model.ver1.game.define.SystemRuntime";
model_ver1_game_define_SystemRuntime.__super__ = model_ver1_game_define_AbstractRuntime;
model_ver1_game_define_SystemRuntime.prototype = $extend(model_ver1_game_define_AbstractRuntime.prototype,{
	getResponsePlayerId: function() {
		var s = this.responsePlayerId;
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(s) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + s + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = s;
		return this1;
	}
	,__class__: model_ver1_game_define_SystemRuntime
});
var model_ver1_game_define_DefaultRuntime = function(cardId,responsePlayerId) {
	model_ver1_game_define_AbstractRuntime.call(this);
	this.cardId = cardId;
	this.responsePlayerId = responsePlayerId;
};
$hxClasses["model.ver1.game.define.DefaultRuntime"] = model_ver1_game_define_DefaultRuntime;
model_ver1_game_define_DefaultRuntime.__name__ = "model.ver1.game.define.DefaultRuntime";
model_ver1_game_define_DefaultRuntime.__super__ = model_ver1_game_define_AbstractRuntime;
model_ver1_game_define_DefaultRuntime.prototype = $extend(model_ver1_game_define_AbstractRuntime.prototype,{
	getCardId: function() {
		return this.cardId;
	}
	,getResponsePlayerId: function() {
		return this.responsePlayerId;
	}
	,__class__: model_ver1_game_define_DefaultRuntime
});
var model_ver1_game_define_TurnKeyword = $hxEnums["model.ver1.game.define.TurnKeyword"] = { __ename__:"model.ver1.game.define.TurnKeyword",__constructs__:null
	,You: {_hx_name:"You",_hx_index:0,__enum__:"model.ver1.game.define.TurnKeyword",toString:$estr}
	,Opponent: {_hx_name:"Opponent",_hx_index:1,__enum__:"model.ver1.game.define.TurnKeyword",toString:$estr}
};
model_ver1_game_define_TurnKeyword.__constructs__ = [model_ver1_game_define_TurnKeyword.You,model_ver1_game_define_TurnKeyword.Opponent];
var model_ver1_game_define_PhaseKeyword = $hxEnums["model.ver1.game.define.PhaseKeyword"] = { __ename__:"model.ver1.game.define.PhaseKeyword",__constructs__:null
	,Reroll: {_hx_name:"Reroll",_hx_index:0,__enum__:"model.ver1.game.define.PhaseKeyword",toString:$estr}
	,Draw: {_hx_name:"Draw",_hx_index:1,__enum__:"model.ver1.game.define.PhaseKeyword",toString:$estr}
	,Maintenance: {_hx_name:"Maintenance",_hx_index:2,__enum__:"model.ver1.game.define.PhaseKeyword",toString:$estr}
	,Battle: {_hx_name:"Battle",_hx_index:3,__enum__:"model.ver1.game.define.PhaseKeyword",toString:$estr}
};
model_ver1_game_define_PhaseKeyword.__constructs__ = [model_ver1_game_define_PhaseKeyword.Reroll,model_ver1_game_define_PhaseKeyword.Draw,model_ver1_game_define_PhaseKeyword.Maintenance,model_ver1_game_define_PhaseKeyword.Battle];
var model_ver1_game_define_StepKeyword = $hxEnums["model.ver1.game.define.StepKeyword"] = { __ename__:"model.ver1.game.define.StepKeyword",__constructs__:null
	,Attack: {_hx_name:"Attack",_hx_index:0,__enum__:"model.ver1.game.define.StepKeyword",toString:$estr}
	,Defense: {_hx_name:"Defense",_hx_index:1,__enum__:"model.ver1.game.define.StepKeyword",toString:$estr}
	,DamageChecking: {_hx_name:"DamageChecking",_hx_index:2,__enum__:"model.ver1.game.define.StepKeyword",toString:$estr}
	,Return: {_hx_name:"Return",_hx_index:3,__enum__:"model.ver1.game.define.StepKeyword",toString:$estr}
	,End: {_hx_name:"End",_hx_index:4,__enum__:"model.ver1.game.define.StepKeyword",toString:$estr}
};
model_ver1_game_define_StepKeyword.__constructs__ = [model_ver1_game_define_StepKeyword.Attack,model_ver1_game_define_StepKeyword.Defense,model_ver1_game_define_StepKeyword.DamageChecking,model_ver1_game_define_StepKeyword.Return,model_ver1_game_define_StepKeyword.End];
var model_ver1_game_define_TimingKeyword = $hxEnums["model.ver1.game.define.TimingKeyword"] = { __ename__:"model.ver1.game.define.TimingKeyword",__constructs__:null
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
var model_ver1_game_define_Timing = $hxEnums["model.ver1.game.define.Timing"] = { __ename__:"model.ver1.game.define.Timing",__constructs__:null
	,Default: ($_=function(phase,step,timing) { return {_hx_index:0,phase:phase,step:step,timing:timing,__enum__:"model.ver1.game.define.Timing",toString:$estr}; },$_._hx_name="Default",$_.__params__ = ["phase","step","timing"],$_)
};
model_ver1_game_define_Timing.__constructs__ = [model_ver1_game_define_Timing.Default];
var model_ver1_game_gameComponent_IGameComponent = function() { };
$hxClasses["model.ver1.game.gameComponent.IGameComponent"] = model_ver1_game_gameComponent_IGameComponent;
model_ver1_game_gameComponent_IGameComponent.__name__ = "model.ver1.game.gameComponent.IGameComponent";
model_ver1_game_gameComponent_IGameComponent.__isInterface__ = true;
model_ver1_game_gameComponent_IGameComponent.__interfaces__ = [model_ver1_game_component_IPlayerStateComponent,model_ver1_game_component_ICardStateComponent,model_ver1_game_component_ITableComponent,model_ver1_game_component_IActivePlayerComponent,model_ver1_game_component_IActiveEffectComponent,model_ver1_game_component_ITimingComponent,model_ver1_game_component_IMarkComponent,model_ver1_game_component_ISelectionComponent,model_ver1_game_component_ICardProtoPoolComponent,model_ver1_game_component_ICutComponent];
var model_ver1_game_flowComponent_IFlowComponent = function() { };
$hxClasses["model.ver1.game.flowComponent.IFlowComponent"] = model_ver1_game_flowComponent_IFlowComponent;
model_ver1_game_flowComponent_IFlowComponent.__name__ = "model.ver1.game.flowComponent.IFlowComponent";
model_ver1_game_flowComponent_IFlowComponent.__isInterface__ = true;
model_ver1_game_flowComponent_IFlowComponent.__interfaces__ = [model_ver1_game_gameComponent_IGameComponent];
model_ver1_game_flowComponent_IFlowComponent.prototype = {
	__class__: model_ver1_game_flowComponent_IFlowComponent
};
var model_ver1_game_entity_Context = function() {
	this.flowMemory = { state : model_ver1_game_flowComponent_FlowMemoryState.PrepareDeck, hasTriggerEvent : false, hasPlayerPassPhase : new haxe_ds_StringMap(), hasPlayerPassCut : new haxe_ds_StringMap(), hasPlayerPassPayCost : new haxe_ds_StringMap(), shouldTriggerStackEffectFinishedEvent : false, msgs : []};
	this.playerStates = new haxe_ds_StringMap();
	this.cardStates = new haxe_ds_StringMap();
	this.activeEffect = haxe_ds_Option.None;
	this.activePlayerId = haxe_ds_Option.None;
	this.effects = new haxe_ds_StringMap();
	this.cuts = [];
	this.playerSelection = { cardIds : new haxe_ds_StringMap()};
	this.cardProtoPool = new haxe_ds_StringMap();
	this.timing = model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Reroll,haxe_ds_Option.None,model_ver1_game_define_TimingKeyword.Start);
	this.marks = new haxe_ds_StringMap();
	this.table = new tool_Table();
	this.playersOrder = [];
};
$hxClasses["model.ver1.game.entity.Context"] = model_ver1_game_entity_Context;
model_ver1_game_entity_Context.__name__ = "model.ver1.game.entity.Context";
model_ver1_game_entity_Context.__interfaces__ = [model_ver1_game_flowComponent_IFlowComponent];
model_ver1_game_entity_Context.prototype = {
	__class__: model_ver1_game_entity_Context
};
var model_ver1_game_flowComponent_SystemHandle = $hxEnums["model.ver1.game.flowComponent.SystemHandle"] = { __ename__:"model.ver1.game.flowComponent.SystemHandle",__constructs__:null
	,PrepareDeck: {_hx_name:"PrepareDeck",_hx_index:0,__enum__:"model.ver1.game.flowComponent.SystemHandle",toString:$estr}
	,WhoFirst: {_hx_name:"WhoFirst",_hx_index:1,__enum__:"model.ver1.game.flowComponent.SystemHandle",toString:$estr}
	,Draw6AndConfirm: {_hx_name:"Draw6AndConfirm",_hx_index:2,__enum__:"model.ver1.game.flowComponent.SystemHandle",toString:$estr}
	,Playing: {_hx_name:"Playing",_hx_index:3,__enum__:"model.ver1.game.flowComponent.SystemHandle",toString:$estr}
	,DrawRule: {_hx_name:"DrawRule",_hx_index:4,__enum__:"model.ver1.game.flowComponent.SystemHandle",toString:$estr}
	,RerollRule: {_hx_name:"RerollRule",_hx_index:5,__enum__:"model.ver1.game.flowComponent.SystemHandle",toString:$estr}
	,AttackRule: {_hx_name:"AttackRule",_hx_index:6,__enum__:"model.ver1.game.flowComponent.SystemHandle",toString:$estr}
	,DefenceRule: {_hx_name:"DefenceRule",_hx_index:7,__enum__:"model.ver1.game.flowComponent.SystemHandle",toString:$estr}
	,DamageRule: {_hx_name:"DamageRule",_hx_index:8,__enum__:"model.ver1.game.flowComponent.SystemHandle",toString:$estr}
	,ReturnRule: {_hx_name:"ReturnRule",_hx_index:9,__enum__:"model.ver1.game.flowComponent.SystemHandle",toString:$estr}
	,TriggerEvent: ($_=function(event) { return {_hx_index:10,event:event,__enum__:"model.ver1.game.flowComponent.SystemHandle",toString:$estr}; },$_._hx_name="TriggerEvent",$_.__params__ = ["event"],$_)
	,StackEffectFinished: {_hx_name:"StackEffectFinished",_hx_index:11,__enum__:"model.ver1.game.flowComponent.SystemHandle",toString:$estr}
};
model_ver1_game_flowComponent_SystemHandle.__constructs__ = [model_ver1_game_flowComponent_SystemHandle.PrepareDeck,model_ver1_game_flowComponent_SystemHandle.WhoFirst,model_ver1_game_flowComponent_SystemHandle.Draw6AndConfirm,model_ver1_game_flowComponent_SystemHandle.Playing,model_ver1_game_flowComponent_SystemHandle.DrawRule,model_ver1_game_flowComponent_SystemHandle.RerollRule,model_ver1_game_flowComponent_SystemHandle.AttackRule,model_ver1_game_flowComponent_SystemHandle.DefenceRule,model_ver1_game_flowComponent_SystemHandle.DamageRule,model_ver1_game_flowComponent_SystemHandle.ReturnRule,model_ver1_game_flowComponent_SystemHandle.TriggerEvent,model_ver1_game_flowComponent_SystemHandle.StackEffectFinished];
var model_ver1_game_flowComponent_FlowType = $hxEnums["model.ver1.game.flowComponent.FlowType"] = { __ename__:"model.ver1.game.flowComponent.FlowType",__constructs__:null
	,WaitPlayer: {_hx_name:"WaitPlayer",_hx_index:0,__enum__:"model.ver1.game.flowComponent.FlowType",toString:$estr}
	,ObserveEffect: {_hx_name:"ObserveEffect",_hx_index:1,__enum__:"model.ver1.game.flowComponent.FlowType",toString:$estr}
	,DoEffect: ($_=function(blockId) { return {_hx_index:2,blockId:blockId,__enum__:"model.ver1.game.flowComponent.FlowType",toString:$estr}; },$_._hx_name="DoEffect",$_.__params__ = ["blockId"],$_)
	,PassPayCost: ($_=function(blockId) { return {_hx_index:3,blockId:blockId,__enum__:"model.ver1.game.flowComponent.FlowType",toString:$estr}; },$_._hx_name="PassPayCost",$_.__params__ = ["blockId"],$_)
	,CancelActiveEffect: {_hx_name:"CancelActiveEffect",_hx_index:4,__enum__:"model.ver1.game.flowComponent.FlowType",toString:$estr}
	,SetActiveEffectId: ($_=function(blockId,tips) { return {_hx_index:5,blockId:blockId,tips:tips,__enum__:"model.ver1.game.flowComponent.FlowType",toString:$estr}; },$_._hx_name="SetActiveEffectId",$_.__params__ = ["blockId","tips"],$_)
	,DeleteImmediateEffect: ($_=function(blockId,tips) { return {_hx_index:6,blockId:blockId,tips:tips,__enum__:"model.ver1.game.flowComponent.FlowType",toString:$estr}; },$_._hx_name="DeleteImmediateEffect",$_.__params__ = ["blockId","tips"],$_)
	,CancelPassCut: {_hx_name:"CancelPassCut",_hx_index:7,__enum__:"model.ver1.game.flowComponent.FlowType",toString:$estr}
	,PassCut: {_hx_name:"PassCut",_hx_index:8,__enum__:"model.ver1.game.flowComponent.FlowType",toString:$estr}
	,PassPhase: {_hx_name:"PassPhase",_hx_index:9,__enum__:"model.ver1.game.flowComponent.FlowType",toString:$estr}
	,CancelPassPhase: {_hx_name:"CancelPassPhase",_hx_index:10,__enum__:"model.ver1.game.flowComponent.FlowType",toString:$estr}
	,NextTiming: {_hx_name:"NextTiming",_hx_index:11,__enum__:"model.ver1.game.flowComponent.FlowType",toString:$estr}
	,SystemHandle: ($_=function(handle) { return {_hx_index:12,handle:handle,__enum__:"model.ver1.game.flowComponent.FlowType",toString:$estr}; },$_._hx_name="SystemHandle",$_.__params__ = ["handle"],$_)
};
model_ver1_game_flowComponent_FlowType.__constructs__ = [model_ver1_game_flowComponent_FlowType.WaitPlayer,model_ver1_game_flowComponent_FlowType.ObserveEffect,model_ver1_game_flowComponent_FlowType.DoEffect,model_ver1_game_flowComponent_FlowType.PassPayCost,model_ver1_game_flowComponent_FlowType.CancelActiveEffect,model_ver1_game_flowComponent_FlowType.SetActiveEffectId,model_ver1_game_flowComponent_FlowType.DeleteImmediateEffect,model_ver1_game_flowComponent_FlowType.CancelPassCut,model_ver1_game_flowComponent_FlowType.PassCut,model_ver1_game_flowComponent_FlowType.PassPhase,model_ver1_game_flowComponent_FlowType.CancelPassPhase,model_ver1_game_flowComponent_FlowType.NextTiming,model_ver1_game_flowComponent_FlowType.SystemHandle];
var model_ver1_game_flowComponent_Flow = $hxEnums["model.ver1.game.flowComponent.Flow"] = { __ename__:"model.ver1.game.flowComponent.Flow",__constructs__:null
	,Default: ($_=function(type,description) { return {_hx_index:0,type:type,description:description,__enum__:"model.ver1.game.flowComponent.Flow",toString:$estr}; },$_._hx_name="Default",$_.__params__ = ["type","description"],$_)
};
model_ver1_game_flowComponent_Flow.__constructs__ = [model_ver1_game_flowComponent_Flow.Default];
function model_ver1_game_flowComponent_FlowComponent_applyFlowType(ctx,playerID,flowType) {
	switch(flowType._hx_index) {
	case 5:
		var blockId = flowType.blockId;
		var tips = flowType.tips;
		break;
	case 12:
		switch(flowType.handle._hx_index) {
		case 0:
			ctx.flowMemory.state = model_ver1_game_flowComponent_FlowMemoryState.WhoFirst;
			ctx.flowMemory.hasTriggerEvent = true;
			break;
		case 1:
			ctx.flowMemory.state = model_ver1_game_flowComponent_FlowMemoryState.Draw6AndConfirm;
			ctx.flowMemory.hasTriggerEvent = true;
			break;
		case 2:
			ctx.flowMemory.state = model_ver1_game_flowComponent_FlowMemoryState.Playing;
			ctx.flowMemory.hasTriggerEvent = true;
			break;
		case 4:
			model_ver1_game_gameComponent_DrawRule_addDrawRule(ctx,model_ver1_game_component_ActivePlayerComponent_getActivePlayerIdAndAssert(ctx));
			ctx.flowMemory.hasTriggerEvent = true;
			break;
		case 5:
			model_ver1_game_gameComponent_RerollRule_addRerollRule(ctx,model_ver1_game_component_ActivePlayerComponent_getActivePlayerIdAndAssert(ctx));
			ctx.flowMemory.hasTriggerEvent = true;
			break;
		case 6:
			model_ver1_game_gameComponent_AttackRule_addAttackRule(ctx,model_ver1_game_component_ActivePlayerComponent_getActivePlayerIdAndAssert(ctx));
			ctx.flowMemory.hasTriggerEvent = true;
			break;
		case 7:
			model_ver1_game_gameComponent_DefenceRule_addDefenceRule(ctx,model_ver1_game_component_ActivePlayerComponent_getActivePlayerIdAndAssert(ctx));
			ctx.flowMemory.hasTriggerEvent = true;
			break;
		case 8:
			model_ver1_game_gameComponent_DamageRule_addDamageRule(ctx,model_ver1_game_component_ActivePlayerComponent_getActivePlayerIdAndAssert(ctx));
			ctx.flowMemory.hasTriggerEvent = true;
			break;
		case 9:
			model_ver1_game_gameComponent_ReturnRule_addReturnRule(ctx,model_ver1_game_component_ActivePlayerComponent_getActivePlayerIdAndAssert(ctx));
			ctx.flowMemory.hasTriggerEvent = true;
			break;
		default:
		}
		break;
	default:
	}
}
function model_ver1_game_flowComponent_FlowComponent_queryFlow(ctx,playerId) {
	var _g = model_ver1_game_gameComponent_Alg_hasSomeoneLiveIsZero(ctx);
	if(_g._hx_index == 0) {
		var playerId1 = _g.v;
		return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.WaitPlayer,"遊戲結束")];
	}
	var _g = model_ver1_game_component_ActiveEffectComponent_getActiveEffect(ctx);
	switch(_g._hx_index) {
	case 0:
		var activeBlock = _g.v;
		var activeBlockId = activeBlock.id;
		var runtime = model_ver1_game_gameComponent_Alg_getEffectRuntime(ctx,activeBlockId);
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
				return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.ObserveEffect,"")];
			}
			return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.DoEffect(activeBlockId),"")];
		} else if(isPass || isOpponentPass) {
			if(controller == playerId) {
				if(isPass) {
					return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.ObserveEffect,"")];
				}
			} else {
				if(isOpponentPass == false) {
					return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.ObserveEffect,"")];
				}
				return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.PassPayCost(activeBlockId),"")];
			}
		}
		if(controller != playerId) {
			return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.WaitPlayer,"等待對方支付ActiveEffectID")];
		}
		return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.CancelActiveEffect,"取消支付效果，讓其它玩家可以支付"),model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.PassPayCost(activeBlockId),"")];
	case 1:
		break;
	}
	var immediateEffects = model_ver1_game_component_CutComponent_getImmediateEffects(ctx);
	if(immediateEffects.length > 0) {
		var isActivePlayer = model_ver1_game_component_ActivePlayerComponent_getActivePlayerIdAndAssert(ctx) == playerId;
		var myEffect = [];
		var opponentEffect = [];
		var _g = 0;
		while(_g < immediateEffects.length) {
			var effect = immediateEffects[_g];
			++_g;
			var controller = model_ver1_game_gameComponent_Alg_getEffectRuntime(ctx,effect.id).getResponsePlayerId();
			if(controller == playerId) {
				myEffect.push(effect);
			} else {
				opponentEffect.push(effect);
			}
		}
		if(isActivePlayer == false) {
			if(opponentEffect.length > 0) {
				return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.WaitPlayer,"等待主動玩家處理起動效果")];
			}
		}
		if(myEffect.length == 0) {
			return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.WaitPlayer,"等待被動玩家處理起動效果")];
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
		var r1 = myEffect.length == 0 ? [] : [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SetActiveEffectId(myEffect[0].id,myEffect),"選擇一個起動效果")];
		var r2 = optionEffect.length == 0 ? [] : [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.DeleteImmediateEffect(optionEffect[0].id,optionEffect),"你可以放棄這些效果")];
		return r1.concat(r2);
	}
	if(ctx.flowMemory.shouldTriggerStackEffectFinishedEvent) {
		var isActivePlayer = model_ver1_game_component_ActivePlayerComponent_getActivePlayerIdAndAssert(ctx) == playerId;
		if(isActivePlayer == false) {
			return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.WaitPlayer,"等待主動玩家處理")];
		}
		return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SystemHandle(model_ver1_game_flowComponent_SystemHandle.StackEffectFinished),"處理堆疊結束")];
	}
	var myCommandList = model_ver1_game_flowComponent_FlowComponent_getClientCommand(ctx,playerId);
	var blocks = model_ver1_game_component_CutComponent_getTopCut(ctx);
	if(blocks.length > 0) {
		var effect = blocks[0];
		var controller = model_ver1_game_gameComponent_Alg_getEffectRuntime(ctx,effect.id).getResponsePlayerId();
		var isAllPassCut = ctx.flowMemory.hasPlayerPassCut.h[model_ver1_game_define_PlayerId.A] && ctx.flowMemory.hasPlayerPassCut.h[model_ver1_game_define_PlayerId.B];
		if(isAllPassCut == false) {
			var isPassCut = ctx.flowMemory.hasPlayerPassCut.h[playerId];
			if(isPassCut) {
				return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.CancelPassCut,"")];
			}
			if(controller == playerId) {
				if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(playerId) != -1 == false) {
					throw haxe_Exception.thrown("playerId (" + playerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
				}
				var this1 = playerId;
				var opponentPlayerID = this1 == model_ver1_game_define_PlayerId.A ? model_ver1_game_define_PlayerId.B : model_ver1_game_define_PlayerId.A;
				var isOpponentPassCut = ctx.flowMemory.hasPlayerPassCut.h[opponentPlayerID];
				if(isOpponentPassCut == false) {
					return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.WaitPlayer,"現在的切入優先權在對方")];
				}
			}
			var r1 = myCommandList.length == 0 ? [] : [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SetActiveEffectId(myCommandList[0].id,myCommandList),"你可以切入")];
			var r2 = [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.PassCut,"")];
			return r1.concat(r2);
		}
		if(controller != playerId) {
			return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.WaitPlayer,"等待效果控制者處理")];
		}
		return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SetActiveEffectId(effect.id,[effect]),"支付最上方的堆疊效果")];
	}
	var myCommandList = model_ver1_game_flowComponent_FlowComponent_getClientCommand(ctx,playerId);
	var _g = model_ver1_game_component_TimingComponent_getTiming(ctx);
	var _g1 = _g.phase;
	var _g1 = _g.step;
	switch(_g.timing._hx_index) {
	case 1:case 3:
		var isAllPassPhase = ctx.flowMemory.hasPlayerPassPhase.h[model_ver1_game_define_PlayerId.A] && ctx.flowMemory.hasPlayerPassPhase.h[model_ver1_game_define_PlayerId.B];
		if(isAllPassPhase == false) {
			if(ctx.flowMemory.hasPlayerPassPhase.h[playerId]) {
				return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.CancelPassPhase,"等待對方結束或是取消[" + Std.string(ctx.timing) + "]結束")];
			}
			var r1 = myCommandList.length == 0 ? [] : [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SetActiveEffectId(myCommandList[0].id,myCommandList),"選擇一個指令")];
			var r2 = [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.PassPhase,"宣告[" + Std.string(ctx.timing) + "]結束")];
			return r1.concat(r2);
		}
		if(playerId != model_ver1_game_component_ActivePlayerComponent_getActivePlayerIdAndAssert(ctx)) {
			return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.WaitPlayer,"等待伺服器處理")];
		}
		return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.NextTiming,"")];
	default:
	}
	if(playerId != model_ver1_game_component_ActivePlayerComponent_getActivePlayerIdAndAssert(ctx)) {
		return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.WaitPlayer,"等待伺服器處理")];
	}
	switch(ctx.flowMemory.state._hx_index) {
	case 0:
		if(ctx.flowMemory.hasTriggerEvent) {
			return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.NextTiming,"")];
		}
		return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SystemHandle(model_ver1_game_flowComponent_SystemHandle.PrepareDeck),"")];
	case 1:
		if(ctx.flowMemory.hasTriggerEvent) {
			return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.NextTiming,"")];
		}
		return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SystemHandle(model_ver1_game_flowComponent_SystemHandle.WhoFirst),"")];
	case 2:
		if(ctx.flowMemory.hasTriggerEvent) {
			return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.NextTiming,"")];
		}
		return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SystemHandle(model_ver1_game_flowComponent_SystemHandle.Draw6AndConfirm),"")];
	case 3:
		break;
	}
	var _g = model_ver1_game_component_TimingComponent_getTiming(ctx);
	var _g1 = _g.step;
	var _g2 = _g.timing;
	switch(_g.phase._hx_index) {
	case 0:
		if(_g1._hx_index == 1) {
			switch(_g2._hx_index) {
			case 2:
				if(ctx.flowMemory.hasTriggerEvent) {
					return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.NextTiming,"")];
				}
				return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SystemHandle(model_ver1_game_flowComponent_SystemHandle.RerollRule),"")];
			case 0:case 4:
				if(ctx.flowMemory.hasTriggerEvent) {
					return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.NextTiming,"")];
				}
				return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SystemHandle(model_ver1_game_flowComponent_SystemHandle.TriggerEvent(model_ver1_game_gameComponent_Event.ChangePhase)),"")];
			default:
			}
		} else {
			switch(_g2._hx_index) {
			case 0:case 4:
				if(ctx.flowMemory.hasTriggerEvent) {
					return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.NextTiming,"")];
				}
				return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SystemHandle(model_ver1_game_flowComponent_SystemHandle.TriggerEvent(model_ver1_game_gameComponent_Event.ChangePhase)),"")];
			default:
			}
		}
		break;
	case 1:
		if(_g1._hx_index == 1) {
			switch(_g2._hx_index) {
			case 2:
				if(ctx.flowMemory.hasTriggerEvent) {
					return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.NextTiming,"")];
				}
				return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SystemHandle(model_ver1_game_flowComponent_SystemHandle.DrawRule),"")];
			case 0:case 4:
				if(ctx.flowMemory.hasTriggerEvent) {
					return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.NextTiming,"")];
				}
				return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SystemHandle(model_ver1_game_flowComponent_SystemHandle.TriggerEvent(model_ver1_game_gameComponent_Event.ChangePhase)),"")];
			default:
			}
		} else {
			switch(_g2._hx_index) {
			case 0:case 4:
				if(ctx.flowMemory.hasTriggerEvent) {
					return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.NextTiming,"")];
				}
				return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SystemHandle(model_ver1_game_flowComponent_SystemHandle.TriggerEvent(model_ver1_game_gameComponent_Event.ChangePhase)),"")];
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
						return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.NextTiming,"")];
					}
					return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SystemHandle(model_ver1_game_flowComponent_SystemHandle.AttackRule),"")];
				case 0:case 4:
					if(ctx.flowMemory.hasTriggerEvent) {
						return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.NextTiming,"")];
					}
					return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SystemHandle(model_ver1_game_flowComponent_SystemHandle.TriggerEvent(model_ver1_game_gameComponent_Event.ChangePhase)),"")];
				default:
				}
				break;
			case 1:
				switch(_g2._hx_index) {
				case 2:
					if(ctx.flowMemory.hasTriggerEvent) {
						return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.NextTiming,"")];
					}
					return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SystemHandle(model_ver1_game_flowComponent_SystemHandle.DefenceRule),"")];
				case 0:case 4:
					if(ctx.flowMemory.hasTriggerEvent) {
						return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.NextTiming,"")];
					}
					return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SystemHandle(model_ver1_game_flowComponent_SystemHandle.TriggerEvent(model_ver1_game_gameComponent_Event.ChangePhase)),"")];
				default:
				}
				break;
			case 2:
				switch(_g2._hx_index) {
				case 2:
					if(ctx.flowMemory.hasTriggerEvent) {
						return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.NextTiming,"")];
					}
					return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SystemHandle(model_ver1_game_flowComponent_SystemHandle.DamageRule),"")];
				case 0:case 4:
					if(ctx.flowMemory.hasTriggerEvent) {
						return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.NextTiming,"")];
					}
					return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SystemHandle(model_ver1_game_flowComponent_SystemHandle.TriggerEvent(model_ver1_game_gameComponent_Event.ChangePhase)),"")];
				default:
				}
				break;
			case 3:
				switch(_g2._hx_index) {
				case 2:
					if(ctx.flowMemory.hasTriggerEvent) {
						return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.NextTiming,"")];
					}
					return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SystemHandle(model_ver1_game_flowComponent_SystemHandle.ReturnRule),"")];
				case 0:case 4:
					if(ctx.flowMemory.hasTriggerEvent) {
						return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.NextTiming,"")];
					}
					return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SystemHandle(model_ver1_game_flowComponent_SystemHandle.TriggerEvent(model_ver1_game_gameComponent_Event.ChangePhase)),"")];
				default:
				}
				break;
			case 4:
				switch(_g2._hx_index) {
				case 0:case 4:
					if(ctx.flowMemory.hasTriggerEvent) {
						return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.NextTiming,"")];
					}
					return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SystemHandle(model_ver1_game_flowComponent_SystemHandle.TriggerEvent(model_ver1_game_gameComponent_Event.ChangePhase)),"")];
				case 5:
					break;
				case 6:
					break;
				case 7:
					break;
				case 8:
					if(ctx.flowMemory.hasTriggerEvent) {
						return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.NextTiming,"")];
					}
					return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SystemHandle(model_ver1_game_flowComponent_SystemHandle.TriggerEvent(model_ver1_game_gameComponent_Event.ChangePhase)),"")];
				default:
				}
				break;
			}
		} else {
			switch(_g2._hx_index) {
			case 0:case 4:
				if(ctx.flowMemory.hasTriggerEvent) {
					return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.NextTiming,"")];
				}
				return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SystemHandle(model_ver1_game_flowComponent_SystemHandle.TriggerEvent(model_ver1_game_gameComponent_Event.ChangePhase)),"")];
			default:
			}
		}
		break;
	default:
		switch(_g2._hx_index) {
		case 0:case 4:
			if(ctx.flowMemory.hasTriggerEvent) {
				return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.NextTiming,"")];
			}
			return [model_ver1_game_flowComponent_Flow.Default(model_ver1_game_flowComponent_FlowType.SystemHandle(model_ver1_game_flowComponent_SystemHandle.TriggerEvent(model_ver1_game_gameComponent_Event.ChangePhase)),"")];
		default:
		}
	}
	return [];
}
function model_ver1_game_flowComponent_FlowComponent_getClientCommand(ctx,playerId) {
	var _g = [];
	var _g1 = 0;
	var _g2 = model_ver1_game_gameComponent_Runtime_getRuntimeText(ctx);
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		_g.push(v);
	}
	var infos = _g;
	return [];
}
function model_ver1_game_flowComponent_FlowComponent_addDrawRuleEffect(ctx) {
}
function model_ver1_game_flowComponent_FlowComponent_addRerollRuleEffect(ctx) {
}
function model_ver1_game_flowComponent_FlowComponent_test() {
}
var model_ver1_game_flowComponent_FlowMemoryState = $hxEnums["model.ver1.game.flowComponent.FlowMemoryState"] = { __ename__:"model.ver1.game.flowComponent.FlowMemoryState",__constructs__:null
	,PrepareDeck: {_hx_name:"PrepareDeck",_hx_index:0,__enum__:"model.ver1.game.flowComponent.FlowMemoryState",toString:$estr}
	,WhoFirst: {_hx_name:"WhoFirst",_hx_index:1,__enum__:"model.ver1.game.flowComponent.FlowMemoryState",toString:$estr}
	,Draw6AndConfirm: {_hx_name:"Draw6AndConfirm",_hx_index:2,__enum__:"model.ver1.game.flowComponent.FlowMemoryState",toString:$estr}
	,Playing: {_hx_name:"Playing",_hx_index:3,__enum__:"model.ver1.game.flowComponent.FlowMemoryState",toString:$estr}
};
model_ver1_game_flowComponent_FlowMemoryState.__constructs__ = [model_ver1_game_flowComponent_FlowMemoryState.PrepareDeck,model_ver1_game_flowComponent_FlowMemoryState.WhoFirst,model_ver1_game_flowComponent_FlowMemoryState.Draw6AndConfirm,model_ver1_game_flowComponent_FlowMemoryState.Playing];
function model_ver1_game_flowComponent_FlowMemory_passPhase(memory,playerId) {
	memory.hasPlayerPassPhase.h[playerId] = true;
}
function model_ver1_game_flowComponent_FlowMemory_cancelPassPhase(memory,playerId) {
	var _this = memory.hasPlayerPassPhase;
	if(Object.prototype.hasOwnProperty.call(_this.h,playerId)) {
		delete(_this.h[playerId]);
	}
}
function model_ver1_game_flowComponent_FlowMemory_resetPassPhase(memory) {
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
function model_ver1_game_flowComponent_FlowMemory_passCut(memory,playerId) {
	memory.hasPlayerPassPayCost.h[playerId] = true;
}
function model_ver1_game_flowComponent_FlowMemory_cancelPassCut(memory,playerId) {
	var _this = memory.hasPlayerPassPayCost;
	if(Object.prototype.hasOwnProperty.call(_this.h,playerId)) {
		delete(_this.h[playerId]);
	}
}
function model_ver1_game_flowComponent_FlowMemory_resetPassCut(memory) {
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
function model_ver1_game_flowComponent_FlowMemory_resetPassCost(memory) {
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
function model_ver1_game_flowComponent_FlowMemory_hasTriggerEvent(memory) {
	return memory.hasTriggerEvent;
}
function model_ver1_game_flowComponent_FlowMemory_triggerEvent(memory) {
	memory.hasTriggerEvent = true;
}
function model_ver1_game_flowComponent_FlowMemory_cancelTriggerEvent(memory) {
	memory.hasTriggerEvent = false;
}
function model_ver1_game_flowComponent_FlowMemory_markTriggerStackEffectFinishedEventDone(memory) {
	memory.shouldTriggerStackEffectFinishedEvent = true;
}
function model_ver1_game_gameComponent_Alg_createRequireRollCost(rollcost,options) {
	return { id : "createRequireRollCost", description : "roll cost", type : model_ver1_game_define_RequireType.SelectCard([],[1]), player : model_ver1_game_define_RelativePlayer.You, action : function() {
	}};
}
function model_ver1_game_gameComponent_Alg_becomeG(ctx,cardId) {
	console.log("src/model/ver1/game/gameComponent/Alg.hx:39:","將自己變成G");
}
function model_ver1_game_gameComponent_Alg_getUnitOfSetGroup(ctx,cardId) {
	return haxe_ds_Option.None;
}
function model_ver1_game_gameComponent_Alg_rollCard(ctx,cardId,options) {
	model_ver1_game_component_TableComponent_rollCard(ctx,cardId);
	if(options.sendEvent) {
		model_ver1_game_gameComponent_Alg_sendEvent(ctx,model_ver1_game_gameComponent_Event.CardRoll(cardId));
	}
}
function model_ver1_game_gameComponent_Alg_rerollCard(ctx,cardId,options) {
	model_ver1_game_component_TableComponent_rerollCard(ctx,cardId);
	if(options.sendEvent) {
		model_ver1_game_gameComponent_Alg_sendEvent(ctx,model_ver1_game_gameComponent_Event.CardReroll(cardId));
	}
}
function model_ver1_game_gameComponent_Alg_sendEvent(ctx,evt) {
	var _g = 0;
	var _g1 = model_ver1_game_gameComponent_Runtime_getRuntimeText(ctx);
	while(_g < _g1.length) {
		var info = _g1[_g];
		++_g;
		var runtime = info.runtime;
		var text = info.text;
		text.onEvent(ctx,evt,runtime);
	}
	var _g = 0;
	var _g1 = model_ver1_game_component_MarkComponent_getMarks(ctx);
	while(_g < _g1.length) {
		var mark = _g1[_g];
		++_g;
		mark.onEvent(ctx,evt);
	}
}
function model_ver1_game_gameComponent_Alg_getCardType(ctx,cardId) {
	var proto = model_ver1_game_component_CardProtoPoolComponent_getCurrentCardProto(ctx,model_ver1_game_component_TableComponent_getCard(ctx,cardId).protoId);
	return proto.category;
}
function model_ver1_game_gameComponent_Alg_getCardEntityCategory(ctx,cardId) {
	var _g = model_ver1_game_component_TableComponent_getCardBaSyouAndAssertExist(ctx,cardId);
	var _g1 = _g.playerId;
	var _g1 = _g.baSyouKeyword;
	if(_g1._hx_index == 5) {
		return haxe_ds_Option.Some(model_ver1_game_define_CardEntityCategory.G);
	} else {
		var kw = _g1;
		if(model_ver1_game_define_BaSyou_isBa(kw)) {
			switch(model_ver1_game_gameComponent_Alg_getCardType(ctx,cardId)._hx_index) {
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
function model_ver1_game_gameComponent_Alg_getThisCardSetGroupCardIds(ctx,cardId) {
	return [cardId];
}
function model_ver1_game_gameComponent_Alg_getBaSyouController(ctx,baSyou) {
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	return haxe_ds_Option.Some(playerId);
}
function model_ver1_game_gameComponent_Alg_getBaSyouControllerAndAssertExist(ctx,baSyou) {
	var _g = model_ver1_game_gameComponent_Alg_getBaSyouController(ctx,baSyou);
	if(_g._hx_index == 0) {
		var playerId = _g.v;
		return playerId;
	} else {
		throw new haxe_Exception("沒有控制者");
	}
}
function model_ver1_game_gameComponent_Alg_getCardGSign(ctx,cardId) {
	return model_ver1_game_define_GSign.Default(model_ver1_game_define_GColor.Red,model_ver1_game_define_GProperty.Uc);
}
function model_ver1_game_gameComponent_Alg_getPlayerGCountForPlay(ctx,playerId) {
	return 0;
}
function model_ver1_game_gameComponent_Alg_getPlayerGCardIds(ctx,playerId) {
	return [];
}
function model_ver1_game_gameComponent_Alg_getCardSetGroupCardIds(ctx,cardId) {
	return [cardId];
}
function model_ver1_game_gameComponent_Alg_getEnterFieldThisTurnCardIds(ctx) {
	var _g = [];
	var _g1 = 0;
	var _g2 = model_ver1_game_gameComponent_Runtime_getMarkEffects(ctx);
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
function model_ver1_game_gameComponent_Alg_getAddBattlePoint(ctx) {
	var _g = [];
	var _g1 = 0;
	var _g2 = model_ver1_game_gameComponent_Runtime_getRuntimeText(ctx);
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
			var _g4 = effect;
			var tmp;
			if(_g4._hx_index == 0) {
				var cardId = _g4.cardId;
				var battlePoint = _g4.battlePoint;
				tmp = { cardId : cardId, battlePoint : battlePoint};
			} else {
				tmp = null;
			}
			_g.push(tmp);
		}
	}
	var infos = _g;
}
function model_ver1_game_gameComponent_Alg_getAttackSpeed(ctx) {
	var _g = [];
	var _g1 = 0;
	var _g2 = model_ver1_game_gameComponent_Runtime_getRuntimeText(ctx);
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
			var _g4 = effect;
			var tmp;
			if(_g4._hx_index == 1) {
				var cardId = _g4.cardId;
				var speed = _g4.speed;
				tmp = { cardId : cardId, speed : speed};
			} else {
				tmp = null;
			}
			_g.push(tmp);
		}
	}
	var infos = _g;
}
function model_ver1_game_gameComponent_Alg_isDestroyNow(ctx,cardId,condition) {
	var condition1 = condition.isByBattleDamage;
	return false;
}
function model_ver1_game_gameComponent_Alg_removeDestroyEffect(ctx,cardId) {
	console.log("src/model/ver1/game/gameComponent/Alg.hx:213:","移除堆疊中的破壞效果");
}
function model_ver1_game_gameComponent_Alg_getEffectRuntime(ctx,blockId) {
	var block = model_ver1_game_component_EffectComponent_getEffect(ctx,blockId);
	var _g = block.cause;
	switch(_g._hx_index) {
	case 1:
		var respnosePlayerId = _g.respnosePlayerId;
		return new model_ver1_game_define_SystemRuntime(respnosePlayerId);
	case 2:
		var playCardPlayerId = _g.playerId;
		var cardId = _g.cardId;
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(playCardPlayerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + playCardPlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = playCardPlayerId;
		return new model_ver1_game_define_DefaultRuntime(cardId,this1);
	case 3:
		var cardId = _g.cardId;
		var textId = _g.textId;
		var responsePlayerId = model_ver1_game_component_TableComponent_getCardControllerAndAssertExist(ctx,cardId);
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(responsePlayerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + responsePlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = responsePlayerId;
		return new model_ver1_game_define_DefaultRuntime(cardId,this1);
	case 4:
		var cardId = _g.cardId;
		var textId = _g.textId;
		var responsePlayerId = model_ver1_game_component_TableComponent_getCardControllerAndAssertExist(ctx,cardId);
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(responsePlayerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + responsePlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = responsePlayerId;
		return new model_ver1_game_define_DefaultRuntime(cardId,this1);
	default:
		return new model_ver1_game_define_AbstractRuntime();
	}
}
function model_ver1_game_gameComponent_Alg_hasSomeoneLiveIsZero(ctx) {
	return haxe_ds_Option.None;
}
var model_ver1_game_gameComponent_GameCardText = function(id,description,type) {
	model_ver1_game_define_CardText.call(this,id,description,type);
};
$hxClasses["model.ver1.game.gameComponent.GameCardText"] = model_ver1_game_gameComponent_GameCardText;
model_ver1_game_gameComponent_GameCardText.__name__ = "model.ver1.game.gameComponent.GameCardText";
model_ver1_game_gameComponent_GameCardText.__super__ = model_ver1_game_define_CardText;
model_ver1_game_gameComponent_GameCardText.prototype = $extend(model_ver1_game_define_CardText.prototype,{
	getEffect: function(_ctx,runtime) {
		var ctx = _ctx;
		return this._getEffect(ctx,runtime);
	}
	,getRequires: function(_ctx,runtime) {
		var ctx = _ctx;
		return this._getRequires(ctx,runtime);
	}
	,getRequires2: function(_ctx,runtime) {
		var ctx = _ctx;
		return this._getRequires2(ctx,runtime);
	}
	,action: function(_ctx,runtime) {
		var ctx = _ctx;
		this._action(ctx,runtime);
	}
	,onEvent: function(_ctx,_event,runtime) {
		var ctx = _ctx;
		var event = _event;
		this._onEvent(ctx,event,runtime);
	}
	,_getEffect: function(ctx,runtime) {
		return [];
	}
	,_getRequires: function(ctx,runtime) {
		return [];
	}
	,_getRequires2: function(ctx,runtime) {
		return [];
	}
	,_action: function(ctx,runtime) {
	}
	,_onEvent: function(ctx,event,runtime) {
	}
	,__class__: model_ver1_game_gameComponent_GameCardText
});
var model_ver1_game_gameComponent_AttackRule = function() {
	model_ver1_game_gameComponent_GameCardText.call(this,"AttackRule","AttackRule",model_ver1_game_define_TextType.System);
};
$hxClasses["model.ver1.game.gameComponent.AttackRule"] = model_ver1_game_gameComponent_AttackRule;
model_ver1_game_gameComponent_AttackRule.__name__ = "model.ver1.game.gameComponent.AttackRule";
model_ver1_game_gameComponent_AttackRule.__super__ = model_ver1_game_gameComponent_GameCardText;
model_ver1_game_gameComponent_AttackRule.prototype = $extend(model_ver1_game_gameComponent_GameCardText.prototype,{
	_getRequires2: function(ctx,runtime) {
		return [{ id : "area1", description : "String", type : model_ver1_game_define_RequireType.SelectCard([],[]), player : model_ver1_game_define_RelativePlayer.You, action : function() {
			var selectUnits = model_ver1_game_component_SelectionComponent_getPlayerSelectionCardId(ctx,"earth");
		}},{ id : "area2", description : "String", type : model_ver1_game_define_RequireType.SelectCard([],[]), player : model_ver1_game_define_RelativePlayer.You, action : function() {
			var selectUnits = model_ver1_game_component_SelectionComponent_getPlayerSelectionCardId(ctx,"space");
		}}];
	}
	,_action: function(ctx,runtime) {
		var cardIdsGoEarth = model_ver1_game_component_SelectionComponent_getPlayerSelectionCardId(ctx,"area1");
		var _g = 0;
		while(_g < cardIdsGoEarth.length) {
			var cardId = cardIdsGoEarth[_g];
			++_g;
			var from = model_ver1_game_component_TableComponent_getCardBaSyouAndAssertExist(ctx,cardId);
			var to = model_ver1_game_define_BaSyou.Default(runtime.getResponsePlayerId(),model_ver1_game_define_BaSyouKeyword.EarthArea);
			model_ver1_game_component_TableComponent_moveCard(ctx,runtime.getCardId(),from,to);
		}
		var cardIdsGoSpace = model_ver1_game_component_SelectionComponent_getPlayerSelectionCardId(ctx,"area2");
		var _g = 0;
		while(_g < cardIdsGoSpace.length) {
			var cardId = cardIdsGoSpace[_g];
			++_g;
			var from = model_ver1_game_component_TableComponent_getCardBaSyouAndAssertExist(ctx,cardId);
			var to = model_ver1_game_define_BaSyou.Default(runtime.getResponsePlayerId(),model_ver1_game_define_BaSyouKeyword.SpaceArea);
			model_ver1_game_component_TableComponent_moveCard(ctx,runtime.getCardId(),from,to);
		}
	}
	,__class__: model_ver1_game_gameComponent_AttackRule
});
function model_ver1_game_gameComponent_AttackRule_addAttackRule(ctx,playerId) {
	var block = new model_ver1_game_define_Effect("AttackRule",model_ver1_game_define_EffectCause.System(playerId),new model_ver1_game_gameComponent_AttackRule());
	model_ver1_game_component_CutComponent_cutIn(ctx,block);
}
var model_ver1_game_gameComponent_DamageRule = function() {
	model_ver1_game_gameComponent_GameCardText.call(this,"DamageRule","DamageRule",model_ver1_game_define_TextType.System);
};
$hxClasses["model.ver1.game.gameComponent.DamageRule"] = model_ver1_game_gameComponent_DamageRule;
model_ver1_game_gameComponent_DamageRule.__name__ = "model.ver1.game.gameComponent.DamageRule";
model_ver1_game_gameComponent_DamageRule.__super__ = model_ver1_game_gameComponent_GameCardText;
model_ver1_game_gameComponent_DamageRule.prototype = $extend(model_ver1_game_gameComponent_GameCardText.prototype,{
	_action: function(ctx,runtime) {
	}
	,__class__: model_ver1_game_gameComponent_DamageRule
});
function model_ver1_game_gameComponent_DamageRule_addDamageRule(ctx,playerId) {
	var block = new model_ver1_game_define_Effect("DamageRule",model_ver1_game_define_EffectCause.System(playerId),new model_ver1_game_gameComponent_DamageRule());
	model_ver1_game_component_CutComponent_cutIn(ctx,block);
}
function model_ver1_game_gameComponent_DefenceRule_addDefenceRule(ctx,playerId) {
	var block = new model_ver1_game_define_Effect("DefenceRule",model_ver1_game_define_EffectCause.System(playerId),new model_ver1_game_gameComponent_AttackRule());
	model_ver1_game_component_CutComponent_cutIn(ctx,block);
}
var model_ver1_game_gameComponent_DrawRule = function() {
	model_ver1_game_gameComponent_GameCardText.call(this,"DrawRule","DrawRule",model_ver1_game_define_TextType.System);
};
$hxClasses["model.ver1.game.gameComponent.DrawRule"] = model_ver1_game_gameComponent_DrawRule;
model_ver1_game_gameComponent_DrawRule.__name__ = "model.ver1.game.gameComponent.DrawRule";
model_ver1_game_gameComponent_DrawRule.__super__ = model_ver1_game_gameComponent_GameCardText;
model_ver1_game_gameComponent_DrawRule.prototype = $extend(model_ver1_game_gameComponent_GameCardText.prototype,{
	_action: function(ctx,runtime) {
		var from = model_ver1_game_define_BaSyou.Default(runtime.getResponsePlayerId(),model_ver1_game_define_BaSyouKeyword.HonGoku);
		var to = model_ver1_game_define_BaSyou.Default(runtime.getResponsePlayerId(),model_ver1_game_define_BaSyouKeyword.TeHuTa);
		model_ver1_game_component_TableComponent_moveCard(ctx,runtime.getCardId(),from,to);
	}
	,__class__: model_ver1_game_gameComponent_DrawRule
});
function model_ver1_game_gameComponent_DrawRule_addDrawRule(ctx,playerId) {
	var block = new model_ver1_game_define_Effect("DrawRule",model_ver1_game_define_EffectCause.System(playerId),new model_ver1_game_gameComponent_DrawRule());
	model_ver1_game_component_CutComponent_cutIn(ctx,block);
}
var model_ver1_game_gameComponent_CardEnterReason = $hxEnums["model.ver1.game.gameComponent.CardEnterReason"] = { __ename__:"model.ver1.game.gameComponent.CardEnterReason",__constructs__:null
	,Whatever: {_hx_name:"Whatever",_hx_index:0,__enum__:"model.ver1.game.gameComponent.CardEnterReason",toString:$estr}
	,Play: {_hx_name:"Play",_hx_index:1,__enum__:"model.ver1.game.gameComponent.CardEnterReason",toString:$estr}
};
model_ver1_game_gameComponent_CardEnterReason.__constructs__ = [model_ver1_game_gameComponent_CardEnterReason.Whatever,model_ver1_game_gameComponent_CardEnterReason.Play];
var model_ver1_game_gameComponent_Event = $hxEnums["model.ver1.game.gameComponent.Event"] = { __ename__:"model.ver1.game.gameComponent.Event",__constructs__:null
	,ChangePhase: {_hx_name:"ChangePhase",_hx_index:0,__enum__:"model.ver1.game.gameComponent.Event",toString:$estr}
	,Gain: ($_=function(cardId,value) { return {_hx_index:1,cardId:cardId,value:value,__enum__:"model.ver1.game.gameComponent.Event",toString:$estr}; },$_._hx_name="Gain",$_.__params__ = ["cardId","value"],$_)
	,CardEnterField: ($_=function(cardId) { return {_hx_index:2,cardId:cardId,__enum__:"model.ver1.game.gameComponent.Event",toString:$estr}; },$_._hx_name="CardEnterField",$_.__params__ = ["cardId"],$_)
	,CardEnter: ($_=function(cardId,baSyouKeyword,reason) { return {_hx_index:3,cardId:cardId,baSyouKeyword:baSyouKeyword,reason:reason,__enum__:"model.ver1.game.gameComponent.Event",toString:$estr}; },$_._hx_name="CardEnter",$_.__params__ = ["cardId","baSyouKeyword","reason"],$_)
	,CardRoll: ($_=function(cardId) { return {_hx_index:4,cardId:cardId,__enum__:"model.ver1.game.gameComponent.Event",toString:$estr}; },$_._hx_name="CardRoll",$_.__params__ = ["cardId"],$_)
	,CardReroll: ($_=function(cardId) { return {_hx_index:5,cardId:cardId,__enum__:"model.ver1.game.gameComponent.Event",toString:$estr}; },$_._hx_name="CardReroll",$_.__params__ = ["cardId"],$_)
	,NewBattleGroup: ($_=function(cardIds) { return {_hx_index:6,cardIds:cardIds,__enum__:"model.ver1.game.gameComponent.Event",toString:$estr}; },$_._hx_name="NewBattleGroup",$_.__params__ = ["cardIds"],$_)
	,PlayerEnterTurn: ($_=function(playerId) { return {_hx_index:7,playerId:playerId,__enum__:"model.ver1.game.gameComponent.Event",toString:$estr}; },$_._hx_name="PlayerEnterTurn",$_.__params__ = ["playerId"],$_)
};
model_ver1_game_gameComponent_Event.__constructs__ = [model_ver1_game_gameComponent_Event.ChangePhase,model_ver1_game_gameComponent_Event.Gain,model_ver1_game_gameComponent_Event.CardEnterField,model_ver1_game_gameComponent_Event.CardEnter,model_ver1_game_gameComponent_Event.CardRoll,model_ver1_game_gameComponent_Event.CardReroll,model_ver1_game_gameComponent_Event.NewBattleGroup,model_ver1_game_gameComponent_Event.PlayerEnterTurn];
var model_ver1_game_gameComponent_EnterFieldThisTurnMark = function(id,cardId) {
	model_ver1_game_gameComponent_GameMark.call(this,id);
	this.cardId = cardId;
	this.age = 1;
};
$hxClasses["model.ver1.game.gameComponent.EnterFieldThisTurnMark"] = model_ver1_game_gameComponent_EnterFieldThisTurnMark;
model_ver1_game_gameComponent_EnterFieldThisTurnMark.__name__ = "model.ver1.game.gameComponent.EnterFieldThisTurnMark";
model_ver1_game_gameComponent_EnterFieldThisTurnMark.__super__ = model_ver1_game_gameComponent_GameMark;
model_ver1_game_gameComponent_EnterFieldThisTurnMark.prototype = $extend(model_ver1_game_gameComponent_GameMark.prototype,{
	_getEffect: function(ctx) {
		return [model_ver1_game_gameComponent_MarkEffect.EnterFieldThisTurn(this.cardId)];
	}
	,__class__: model_ver1_game_gameComponent_EnterFieldThisTurnMark
});
var model_ver1_game_gameComponent_CanNotRerollMark = function(id,cardId) {
	model_ver1_game_gameComponent_GameMark.call(this,id);
	this.cardId = cardId;
};
$hxClasses["model.ver1.game.gameComponent.CanNotRerollMark"] = model_ver1_game_gameComponent_CanNotRerollMark;
model_ver1_game_gameComponent_CanNotRerollMark.__name__ = "model.ver1.game.gameComponent.CanNotRerollMark";
model_ver1_game_gameComponent_CanNotRerollMark.__super__ = model_ver1_game_gameComponent_GameMark;
model_ver1_game_gameComponent_CanNotRerollMark.prototype = $extend(model_ver1_game_gameComponent_GameMark.prototype,{
	_getEffect: function(_ctx) {
		return [model_ver1_game_gameComponent_MarkEffect.CanNotReroll(this.cardId)];
	}
	,__class__: model_ver1_game_gameComponent_CanNotRerollMark
});
var model_ver1_game_gameComponent_MarkEffect = $hxEnums["model.ver1.game.gameComponent.MarkEffect"] = { __ename__:"model.ver1.game.gameComponent.MarkEffect",__constructs__:null
	,AddBattlePoint: ($_=function(cardId,battlePoint) { return {_hx_index:0,cardId:cardId,battlePoint:battlePoint,__enum__:"model.ver1.game.gameComponent.MarkEffect",toString:$estr}; },$_._hx_name="AddBattlePoint",$_.__params__ = ["cardId","battlePoint"],$_)
	,AttackSpeed: ($_=function(cardId,speed) { return {_hx_index:1,cardId:cardId,speed:speed,__enum__:"model.ver1.game.gameComponent.MarkEffect",toString:$estr}; },$_._hx_name="AttackSpeed",$_.__params__ = ["cardId","speed"],$_)
	,AddText: ($_=function(cardId,text) { return {_hx_index:2,cardId:cardId,text:text,__enum__:"model.ver1.game.gameComponent.MarkEffect",toString:$estr}; },$_._hx_name="AddText",$_.__params__ = ["cardId","text"],$_)
	,EnterFieldThisTurn: ($_=function(cardId) { return {_hx_index:3,cardId:cardId,__enum__:"model.ver1.game.gameComponent.MarkEffect",toString:$estr}; },$_._hx_name="EnterFieldThisTurn",$_.__params__ = ["cardId"],$_)
	,CanNotReroll: ($_=function(cardId) { return {_hx_index:4,cardId:cardId,__enum__:"model.ver1.game.gameComponent.MarkEffect",toString:$estr}; },$_._hx_name="CanNotReroll",$_.__params__ = ["cardId"],$_)
};
model_ver1_game_gameComponent_MarkEffect.__constructs__ = [model_ver1_game_gameComponent_MarkEffect.AddBattlePoint,model_ver1_game_gameComponent_MarkEffect.AttackSpeed,model_ver1_game_gameComponent_MarkEffect.AddText,model_ver1_game_gameComponent_MarkEffect.EnterFieldThisTurn,model_ver1_game_gameComponent_MarkEffect.CanNotReroll];
var model_ver1_game_gameComponent_PlayUnitEffect = function(id,description,type) {
	this.baSyouOption = haxe_ds_Option.None;
	model_ver1_game_gameComponent_GameCardText.call(this,id,description,type);
};
$hxClasses["model.ver1.game.gameComponent.PlayUnitEffect"] = model_ver1_game_gameComponent_PlayUnitEffect;
model_ver1_game_gameComponent_PlayUnitEffect.__name__ = "model.ver1.game.gameComponent.PlayUnitEffect";
model_ver1_game_gameComponent_PlayUnitEffect.__super__ = model_ver1_game_gameComponent_GameCardText;
model_ver1_game_gameComponent_PlayUnitEffect.prototype = $extend(model_ver1_game_gameComponent_GameCardText.prototype,{
	_action: function(ctx,runtime) {
		var baSyou;
		var _g = this.baSyouOption;
		if(_g._hx_index == 0) {
			var baSyou1 = _g.v;
			baSyou = baSyou1;
		} else {
			throw new haxe_Exception("baSyou not found");
		}
		var from = model_ver1_game_component_TableComponent_getCardBaSyouAndAssertExist(ctx,runtime.getCardId());
		model_ver1_game_component_TableComponent_moveCard(ctx,runtime.getCardId(),from,baSyou);
	}
	,__class__: model_ver1_game_gameComponent_PlayUnitEffect
});
var model_ver1_game_gameComponent_PlayPilotEffect = function(id,description,type) {
	this.unitCardIdOption = haxe_ds_Option.None;
	this.baSyouOption = haxe_ds_Option.None;
	model_ver1_game_gameComponent_GameCardText.call(this,id,description,type);
};
$hxClasses["model.ver1.game.gameComponent.PlayPilotEffect"] = model_ver1_game_gameComponent_PlayPilotEffect;
model_ver1_game_gameComponent_PlayPilotEffect.__name__ = "model.ver1.game.gameComponent.PlayPilotEffect";
model_ver1_game_gameComponent_PlayPilotEffect.__super__ = model_ver1_game_gameComponent_GameCardText;
model_ver1_game_gameComponent_PlayPilotEffect.prototype = $extend(model_ver1_game_gameComponent_GameCardText.prototype,{
	_action: function(ctx,runtime) {
		var _g = this.baSyouOption;
		if(_g._hx_index == 0) {
			var baSyou = _g.v;
			var from = model_ver1_game_component_TableComponent_getCardBaSyouAndAssertExist(ctx,runtime.getCardId());
			model_ver1_game_component_TableComponent_moveCard(ctx,runtime.getCardId(),from,baSyou);
		}
		var _g = this.unitCardIdOption;
		if(_g._hx_index == 0) {
			var unitCardId = _g.v;
			var to = model_ver1_game_component_TableComponent_getCardBaSyouAndAssertExist(ctx,unitCardId);
			var from = model_ver1_game_component_TableComponent_getCardBaSyouAndAssertExist(ctx,runtime.getCardId());
			model_ver1_game_component_TableComponent_moveCard(ctx,runtime.getCardId(),from,to);
		}
		throw new haxe_Exception("baSyou and unitCardId not found");
	}
	,__class__: model_ver1_game_gameComponent_PlayPilotEffect
});
var model_ver1_game_gameComponent_PlayUnitRule = function(id) {
	model_ver1_game_gameComponent_GameCardText.call(this,id,"PlayUnitRule",model_ver1_game_define_TextType.PlayCard(model_ver1_game_define_UseTiming.Relative(model_ver1_game_define_RelativePlayer.You,model_ver1_game_define_RelativeUseTiming.Maintenance)));
};
$hxClasses["model.ver1.game.gameComponent.PlayUnitRule"] = model_ver1_game_gameComponent_PlayUnitRule;
model_ver1_game_gameComponent_PlayUnitRule.__name__ = "model.ver1.game.gameComponent.PlayUnitRule";
model_ver1_game_gameComponent_PlayUnitRule.__super__ = model_ver1_game_gameComponent_GameCardText;
model_ver1_game_gameComponent_PlayUnitRule.prototype = $extend(model_ver1_game_gameComponent_GameCardText.prototype,{
	_getRequires2: function(ctx,runtime) {
		return [model_ver1_game_gameComponent_Alg_createRequireRollCost(this.rollCost,{ })];
	}
	,_action: function(ctx,runtime) {
		var to = model_ver1_game_define_BaSyou.Default(runtime.getResponsePlayerId(),model_ver1_game_define_BaSyouKeyword.PlayedCard);
		var from = model_ver1_game_component_TableComponent_getCardBaSyouAndAssertExist(ctx,runtime.getCardId());
		model_ver1_game_component_TableComponent_moveCard(ctx,runtime.getCardId(),from,to);
		var playUnitEffect = new model_ver1_game_gameComponent_PlayUnitEffect("","",model_ver1_game_define_TextType.System);
		playUnitEffect.baSyouOption = haxe_ds_Option.Some(model_ver1_game_define_BaSyou.Default(runtime.getResponsePlayerId(),model_ver1_game_define_BaSyouKeyword.MaintenanceArea));
		var block = new model_ver1_game_define_Effect(this.getSubKey(0),model_ver1_game_define_EffectCause.PlayCard(runtime.getResponsePlayerId(),runtime.getCardId()),playUnitEffect);
		model_ver1_game_component_CutComponent_cutIn(ctx,block);
	}
	,__class__: model_ver1_game_gameComponent_PlayUnitRule
});
var model_ver1_game_gameComponent_PlayGRule = function(id) {
	model_ver1_game_gameComponent_GameCardText.call(this,id,"PlayGRule",model_ver1_game_define_TextType.PlayCard(model_ver1_game_define_UseTiming.Relative(model_ver1_game_define_RelativePlayer.You,model_ver1_game_define_RelativeUseTiming.Maintenance)));
};
$hxClasses["model.ver1.game.gameComponent.PlayGRule"] = model_ver1_game_gameComponent_PlayGRule;
model_ver1_game_gameComponent_PlayGRule.__name__ = "model.ver1.game.gameComponent.PlayGRule";
model_ver1_game_gameComponent_PlayGRule.__super__ = model_ver1_game_gameComponent_GameCardText;
model_ver1_game_gameComponent_PlayGRule.prototype = $extend(model_ver1_game_gameComponent_GameCardText.prototype,{
	_getRequires2: function(ctx,runtime) {
		return [{ id : this.id, description : "還沒下G", type : model_ver1_game_define_RequireType.Pending, player : model_ver1_game_define_RelativePlayer.You, action : function() {
			if(model_ver1_game_component_PlayerStateComponent_getPlayerState(ctx,runtime.getResponsePlayerId()).hasPlayG) {
				throw new haxe_Exception("has Play G");
			}
		}}];
	}
	,_action: function(ctx,runtime) {
		model_ver1_game_component_PlayerStateComponent_getPlayerState(ctx,runtime.getResponsePlayerId()).hasPlayG = true;
		var from = model_ver1_game_component_TableComponent_getCardBaSyouAndAssertExist(ctx,runtime.getCardId());
		var to = model_ver1_game_define_BaSyou.Default(runtime.getResponsePlayerId(),model_ver1_game_define_BaSyouKeyword.GZone);
		model_ver1_game_component_TableComponent_moveCard(ctx,runtime.getCardId(),from,to);
	}
	,__class__: model_ver1_game_gameComponent_PlayGRule
});
var model_ver1_game_gameComponent_PlayCommandEffect = function(id,description,type) {
	model_ver1_game_gameComponent_GameCardText.call(this,id,description,type);
};
$hxClasses["model.ver1.game.gameComponent.PlayCommandEffect"] = model_ver1_game_gameComponent_PlayCommandEffect;
model_ver1_game_gameComponent_PlayCommandEffect.__name__ = "model.ver1.game.gameComponent.PlayCommandEffect";
model_ver1_game_gameComponent_PlayCommandEffect.__super__ = model_ver1_game_gameComponent_GameCardText;
model_ver1_game_gameComponent_PlayCommandEffect.prototype = $extend(model_ver1_game_gameComponent_GameCardText.prototype,{
	_action: function(ctx,runtime) {
		this._commandEffectImpl(ctx,runtime);
		var to = model_ver1_game_define_BaSyou.Default(runtime.getResponsePlayerId(),model_ver1_game_define_BaSyouKeyword.JunkYard);
		var from = model_ver1_game_component_TableComponent_getCardBaSyouAndAssertExist(ctx,runtime.getCardId());
		model_ver1_game_component_TableComponent_moveCard(ctx,runtime.getCardId(),from,to);
	}
	,_commandEffectImpl: function(ctx,runtime) {
	}
	,__class__: model_ver1_game_gameComponent_PlayCommandEffect
});
var model_ver1_game_gameComponent_PlayCommandRule = function(id) {
	model_ver1_game_gameComponent_GameCardText.call(this,id,"PlayCommandRule",model_ver1_game_define_TextType.PlayCard(model_ver1_game_define_UseTiming.Relative(model_ver1_game_define_RelativePlayer.You,model_ver1_game_define_RelativeUseTiming.Maintenance)));
};
$hxClasses["model.ver1.game.gameComponent.PlayCommandRule"] = model_ver1_game_gameComponent_PlayCommandRule;
model_ver1_game_gameComponent_PlayCommandRule.__name__ = "model.ver1.game.gameComponent.PlayCommandRule";
model_ver1_game_gameComponent_PlayCommandRule.__super__ = model_ver1_game_gameComponent_GameCardText;
model_ver1_game_gameComponent_PlayCommandRule.prototype = $extend(model_ver1_game_gameComponent_GameCardText.prototype,{
	_getRequires2: function(ctx,runtime) {
		return [model_ver1_game_gameComponent_Alg_createRequireRollCost(this.rollCost,{ })];
	}
	,_action: function(ctx,runtime) {
		var block = new model_ver1_game_define_Effect(this.getSubKey(0),model_ver1_game_define_EffectCause.PlayCard(runtime.getResponsePlayerId(),runtime.getCardId()),this.commandEffect);
		model_ver1_game_component_CutComponent_cutIn(ctx,block);
	}
	,__class__: model_ver1_game_gameComponent_PlayCommandRule
});
function model_ver1_game_gameComponent_PlayRule_createPlayCardText(cardProto,options) {
	return new model_ver1_game_gameComponent_PlayUnitRule("");
}
var model_ver1_game_gameComponent_RerollRule = function() {
	model_ver1_game_gameComponent_GameCardText.call(this,"RerollRule","RerollRule",model_ver1_game_define_TextType.System);
};
$hxClasses["model.ver1.game.gameComponent.RerollRule"] = model_ver1_game_gameComponent_RerollRule;
model_ver1_game_gameComponent_RerollRule.__name__ = "model.ver1.game.gameComponent.RerollRule";
model_ver1_game_gameComponent_RerollRule.__super__ = model_ver1_game_gameComponent_GameCardText;
model_ver1_game_gameComponent_RerollRule.prototype = $extend(model_ver1_game_gameComponent_GameCardText.prototype,{
	_action: function(ctx,runtime) {
		var _this = [model_ver1_game_define_BaSyouKeyword.GZone,model_ver1_game_define_BaSyouKeyword.MaintenanceArea];
		var result = new Array(_this.length);
		var _g = 0;
		var _g1 = _this.length;
		while(_g < _g1) {
			var i = _g++;
			result[i] = model_ver1_game_define_BaSyou.Default(runtime.getResponsePlayerId(),_this[i]);
		}
		var _g = [];
		var x = $getIterator(result);
		while(x.hasNext()) {
			var x1 = x.next();
			_g.push(model_ver1_game_component_TableComponent_getCardIdsByBaSyou(ctx,x1));
		}
		var _g1 = [];
		var e = $getIterator(_g);
		while(e.hasNext()) {
			var e1 = e.next();
			var x = $getIterator(e1);
			while(x.hasNext()) {
				var x1 = x.next();
				_g1.push(x1);
			}
		}
		var cardIds = _g1;
		var _g = 0;
		while(_g < cardIds.length) {
			var cardId = cardIds[_g];
			++_g;
			model_ver1_game_gameComponent_Alg_rerollCard(ctx,cardId,{ sendEvent : true});
		}
	}
	,__class__: model_ver1_game_gameComponent_RerollRule
});
function model_ver1_game_gameComponent_RerollRule_addRerollRule(ctx,playerId) {
	var block = new model_ver1_game_define_Effect("RerollRule",model_ver1_game_define_EffectCause.System(playerId),new model_ver1_game_gameComponent_RerollRule());
	model_ver1_game_component_CutComponent_cutIn(ctx,block);
}
var model_ver1_game_gameComponent_ReturnRule = function() {
	model_ver1_game_gameComponent_GameCardText.call(this,"ReturnRule","ReturnRule",model_ver1_game_define_TextType.System);
};
$hxClasses["model.ver1.game.gameComponent.ReturnRule"] = model_ver1_game_gameComponent_ReturnRule;
model_ver1_game_gameComponent_ReturnRule.__name__ = "model.ver1.game.gameComponent.ReturnRule";
model_ver1_game_gameComponent_ReturnRule.__super__ = model_ver1_game_gameComponent_GameCardText;
model_ver1_game_gameComponent_ReturnRule.prototype = $extend(model_ver1_game_gameComponent_GameCardText.prototype,{
	_action: function(ctx,runtime) {
		var _g = [];
		var playerId = model_ver1_game_define_PlayerId.A;
		var baSyouKw = model_ver1_game_define_BaSyouKeyword.EarthArea;
		_g.push(model_ver1_game_define_BaSyou.Default(playerId,baSyouKw));
		var baSyouKw = model_ver1_game_define_BaSyouKeyword.SpaceArea;
		_g.push(model_ver1_game_define_BaSyou.Default(playerId,baSyouKw));
		var playerId = model_ver1_game_define_PlayerId.B;
		var baSyouKw = model_ver1_game_define_BaSyouKeyword.EarthArea;
		_g.push(model_ver1_game_define_BaSyou.Default(playerId,baSyouKw));
		var baSyouKw = model_ver1_game_define_BaSyouKeyword.SpaceArea;
		_g.push(model_ver1_game_define_BaSyou.Default(playerId,baSyouKw));
		var _g1 = [];
		var x = $getIterator(_g);
		while(x.hasNext()) {
			var x1 = x.next();
			_g1.push(model_ver1_game_component_TableComponent_getCardIdsByBaSyou(ctx,x1));
		}
		var _g = [];
		var e = $getIterator(_g1);
		while(e.hasNext()) {
			var e1 = e.next();
			var x = $getIterator(e1);
			while(x.hasNext()) {
				var x1 = x.next();
				_g.push(x1);
			}
		}
		var cardIds = _g;
		var _g = 0;
		while(_g < cardIds.length) {
			var cardId = cardIds[_g];
			++_g;
			var from = model_ver1_game_component_TableComponent_getCardBaSyouAndAssertExist(ctx,runtime.getCardId());
			var to = model_ver1_game_define_BaSyou.Default(runtime.getResponsePlayerId(),model_ver1_game_define_BaSyouKeyword.MaintenanceArea);
			model_ver1_game_component_TableComponent_moveCard(ctx,runtime.getCardId(),from,to);
			model_ver1_game_gameComponent_Alg_rollCard(ctx,runtime.getCardId(),{ sendEvent : true});
		}
	}
	,__class__: model_ver1_game_gameComponent_ReturnRule
});
function model_ver1_game_gameComponent_ReturnRule_addReturnRule(ctx,playerId) {
	var block = new model_ver1_game_define_Effect("ReturnRule",model_ver1_game_define_EffectCause.System(playerId),new model_ver1_game_gameComponent_ReturnRule());
	model_ver1_game_component_CutComponent_cutIn(ctx,block);
}
function model_ver1_game_gameComponent_Runtime_isContantType(text) {
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
function model_ver1_game_gameComponent_Runtime_getRuntimeText(ctx) {
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
		var responsePlayerId = model_ver1_game_gameComponent_Alg_getBaSyouControllerAndAssertExist(ctx,model_ver1_game_component_TableComponent_getCardBaSyouAndAssertExist(ctx,card.id));
		var card1 = card.id;
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(responsePlayerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + responsePlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = responsePlayerId;
		var runtime = new model_ver1_game_define_DefaultRuntime(card1,this1);
		var cardProto = model_ver1_game_component_CardProtoPoolComponent_getCurrentCardProto(ctx,card.protoId);
		var _g2 = 0;
		var _g3 = [];
		var x = $getIterator(cardProto.getTexts(ctx,runtime));
		while(x.hasNext()) {
			var x1 = x.next();
			_g3.push(model_ver1_game_gameComponent_SpecialCardText_flatSpecial(ctx,card.id,x1));
		}
		var _g4 = [];
		var e = $getIterator(_g3);
		while(e.hasNext()) {
			var e1 = e.next();
			var x2 = $getIterator(e1);
			while(x2.hasNext()) {
				var x3 = x2.next();
				_g4.push(x3);
			}
		}
		var _g5 = [];
		var _g6 = 0;
		var _g7 = _g4;
		while(_g6 < _g7.length) {
			var v = _g7[_g6];
			++_g6;
			var tmp;
			var _g8 = v.type;
			switch(_g8._hx_index) {
			case 0:
				tmp = _g8.type._hx_index == 2;
				break;
			case 3:
				var _g9 = _g8.timing;
				tmp = true;
				break;
			default:
				tmp = false;
			}
			if(tmp) {
				_g5.push(v);
			}
		}
		var _g10 = _g5;
		while(_g2 < _g10.length) {
			var text = _g10[_g2];
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
		var responsePlayerId = model_ver1_game_gameComponent_Alg_getBaSyouControllerAndAssertExist(ctx,model_ver1_game_component_TableComponent_getCardBaSyouAndAssertExist(ctx,card.id));
		var card1 = card.id;
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(responsePlayerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + responsePlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = responsePlayerId;
		var runtime = new model_ver1_game_define_DefaultRuntime(card1,this1);
		var cardProto = model_ver1_game_component_CardProtoPoolComponent_getCurrentCardProto(ctx,card.protoId);
		var _g2 = 0;
		var _g3 = [];
		var x = $getIterator(cardProto.getTexts(ctx,runtime));
		while(x.hasNext()) {
			var x1 = x.next();
			_g3.push(model_ver1_game_gameComponent_SpecialCardText_flatSpecial(ctx,card.id,x1));
		}
		var _g4 = [];
		var e = $getIterator(_g3);
		while(e.hasNext()) {
			var e1 = e.next();
			var x2 = $getIterator(e1);
			while(x2.hasNext()) {
				var x3 = x2.next();
				_g4.push(x3);
			}
		}
		var _g5 = [];
		var _g6 = 0;
		var _g7 = _g4;
		while(_g6 < _g7.length) {
			var v = _g7[_g6];
			++_g6;
			if(v.isSurroundedByArrows) {
				_g5.push(v);
			}
		}
		var _g8 = _g5;
		while(_g2 < _g8.length) {
			var text = _g8[_g2];
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
		var responsePlayerId = model_ver1_game_gameComponent_Alg_getBaSyouControllerAndAssertExist(ctx,model_ver1_game_component_TableComponent_getCardBaSyouAndAssertExist(ctx,card.id));
		var card1 = card.id;
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(responsePlayerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + responsePlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = responsePlayerId;
		var runtime = new model_ver1_game_define_DefaultRuntime(card1,this1);
		var cardProto = model_ver1_game_component_CardProtoPoolComponent_getCurrentCardProto(ctx,card.protoId);
		var _g2 = 0;
		var _g3 = [];
		var x = $getIterator(cardProto.getTexts(ctx,runtime));
		while(x.hasNext()) {
			var x1 = x.next();
			_g3.push(model_ver1_game_gameComponent_SpecialCardText_flatSpecial(ctx,card.id,x1));
		}
		var _g4 = [];
		var e = $getIterator(_g3);
		while(e.hasNext()) {
			var e1 = e.next();
			var x2 = $getIterator(e1);
			while(x2.hasNext()) {
				var x3 = x2.next();
				_g4.push(x3);
			}
		}
		var f = model_ver1_game_gameComponent_Runtime_isContantType;
		var _g5 = [];
		var _g6 = 0;
		var _g7 = _g4;
		while(_g6 < _g7.length) {
			var v = _g7[_g6];
			++_g6;
			if(f(v)) {
				_g5.push(v);
			}
		}
		var _g8 = _g5;
		while(_g2 < _g8.length) {
			var text = _g8[_g2];
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
		var responsePlayerId = model_ver1_game_component_TableComponent_getCardControllerAndAssertExist(ctx,card.id);
		var card1 = card.id;
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(responsePlayerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + responsePlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = responsePlayerId;
		var runtime = new model_ver1_game_define_DefaultRuntime(card1,this1);
		var cardProto = model_ver1_game_component_CardProtoPoolComponent_getCurrentCardProto(ctx,card.protoId);
		var _g2 = 0;
		var _g3 = [];
		var x = $getIterator(cardProto.getTexts(ctx,runtime));
		while(x.hasNext()) {
			var x1 = x.next();
			_g3.push(model_ver1_game_gameComponent_SpecialCardText_flatSpecial(ctx,card.id,x1));
		}
		var _g4 = [];
		var e = $getIterator(_g3);
		while(e.hasNext()) {
			var e1 = e.next();
			var x2 = $getIterator(e1);
			while(x2.hasNext()) {
				var x3 = x2.next();
				_g4.push(x3);
			}
		}
		var _g5 = _g4;
		while(_g2 < _g5.length) {
			var text = _g5[_g2];
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
		var responsePlayerId = model_ver1_game_component_TableComponent_getCardControllerAndAssertExist(ctx,card.id);
		var card1 = card.id;
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(responsePlayerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + responsePlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = responsePlayerId;
		var runtime = new model_ver1_game_define_DefaultRuntime(card1,this1);
		var cardProto = model_ver1_game_component_CardProtoPoolComponent_getCurrentCardProto(ctx,card.protoId);
		var _g2 = 0;
		var _g3 = [];
		var x = $getIterator(cardProto.getTexts(ctx,runtime));
		while(x.hasNext()) {
			var x1 = x.next();
			_g3.push(model_ver1_game_gameComponent_SpecialCardText_flatSpecial(ctx,card.id,x1));
		}
		var _g4 = [];
		var e = $getIterator(_g3);
		while(e.hasNext()) {
			var e1 = e.next();
			var x2 = $getIterator(e1);
			while(x2.hasNext()) {
				var x3 = x2.next();
				_g4.push(x3);
			}
		}
		var _g5 = _g4;
		while(_g2 < _g5.length) {
			var text = _g5[_g2];
			++_g2;
			var _g6 = 0;
			var _g7 = text.getEffect(ctx,runtime);
			while(_g6 < _g7.length) {
				var effect = _g7[_g6];
				++_g6;
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
		var responsePlayerId = model_ver1_game_component_TableComponent_getCardControllerAndAssertExist(ctx,info.cardId);
		var info1 = info.cardId;
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(responsePlayerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + responsePlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = responsePlayerId;
		var runtime = new model_ver1_game_define_DefaultRuntime(info1,this1);
		result[i] = { runtime : runtime, text : info.text};
	}
	var _g = [];
	var x = $getIterator(result);
	while(x.hasNext()) {
		var x1 = x.next();
		var _g1 = x1.text.type;
		var tmp;
		if(_g1._hx_index == 2) {
			var _g2 = _g1.type;
			var _this = model_ver1_game_gameComponent_SpecialCardText_flatSpecial(ctx,x1.runtime.getCardId(),x1.text);
			var result = new Array(_this.length);
			var _g3 = 0;
			var _g4 = _this.length;
			while(_g3 < _g4) {
				var i = _g3++;
				result[i] = { runtime : x1.runtime, text : _this[i]};
			}
			tmp = result;
		} else {
			tmp = [x1];
		}
		_g.push(tmp);
	}
	var _g1 = [];
	var e = $getIterator(_g);
	while(e.hasNext()) {
		var e1 = e.next();
		var x = $getIterator(e1);
		while(x.hasNext()) {
			var x1 = x.next();
			_g1.push(x1);
		}
	}
	var addedReturn = _g1;
	var _g = [];
	var _g1 = 0;
	var _g2 = model_ver1_game_component_MarkComponent_getMarks(ctx);
	while(_g1 < _g2.length) {
		var mark = _g2[_g1];
		++_g1;
		var _g3 = 0;
		var _g4 = mark.getEffect(ctx);
		while(_g3 < _g4.length) {
			var effect = _g4[_g3];
			++_g3;
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
		var responsePlayerId = model_ver1_game_component_TableComponent_getCardControllerAndAssertExist(ctx,info.cardId);
		var info1 = info.cardId;
		if([model_ver1_game_define_PlayerId.A,model_ver1_game_define_PlayerId.B].indexOf(responsePlayerId) != -1 == false) {
			throw haxe_Exception.thrown("playerId (" + responsePlayerId + ") must be " + model_ver1_game_define_PlayerId.A + " or " + model_ver1_game_define_PlayerId.B);
		}
		var this1 = responsePlayerId;
		var runtime = new model_ver1_game_define_DefaultRuntime(info1,this1);
		result[i] = { runtime : runtime, text : info.text};
	}
	var _g = [];
	var x = $getIterator(result);
	while(x.hasNext()) {
		var x1 = x.next();
		var _g1 = x1.text.type;
		var tmp;
		if(_g1._hx_index == 2) {
			var _g2 = _g1.type;
			var _this = model_ver1_game_gameComponent_SpecialCardText_flatSpecial(ctx,x1.runtime.getCardId(),x1.text);
			var result = new Array(_this.length);
			var _g3 = 0;
			var _g4 = _this.length;
			while(_g3 < _g4) {
				var i = _g3++;
				result[i] = { runtime : x1.runtime, text : _this[i]};
			}
			tmp = result;
		} else {
			tmp = [x1];
		}
		_g.push(tmp);
	}
	var _g1 = [];
	var e = $getIterator(_g);
	while(e.hasNext()) {
		var e1 = e.next();
		var x = $getIterator(e1);
		while(x.hasNext()) {
			var x1 = x.next();
			_g1.push(x1);
		}
	}
	var globalAddedReturn = _g1;
	return playReturn.concat(specialReturn).concat(specialReturn2).concat(originReturn).concat(addedReturn).concat(globalAddedReturn);
}
function model_ver1_game_gameComponent_Runtime_getMarkEffects(ctx) {
	var _g = [];
	var _g1 = 0;
	var _g2 = model_ver1_game_gameComponent_Runtime_getRuntimeText(ctx);
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
	var _g1 = 0;
	var _g2 = model_ver1_game_component_MarkComponent_getMarks(ctx);
	while(_g1 < _g2.length) {
		var mark = _g2[_g1];
		++_g1;
		var effects = mark.getEffect(ctx);
		var _g3 = 0;
		while(_g3 < effects.length) {
			var effect = effects[_g3];
			++_g3;
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
function model_ver1_game_gameComponent_Runtime_isRequiresCanMet(ctx,playerId,rt) {
	return true;
}
function model_ver1_game_gameComponent_Runtime_getPlayerRuntimeText(ctx,playerId) {
	var _g = [];
	var _g1 = 0;
	var _g2 = model_ver1_game_gameComponent_Runtime_getRuntimeText(ctx);
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		var tmp;
		var _g3 = v.text.type;
		switch(_g3._hx_index) {
		case 1:
			var useTiming = _g3.timing;
			tmp = model_ver1_game_component_ActivePlayerComponent_isPlayerTiming(ctx,useTiming,v.runtime.getResponsePlayerId(),model_ver1_game_component_TimingComponent_getTiming(ctx),playerId) && model_ver1_game_gameComponent_Runtime_isRequiresCanMet(ctx,playerId,v);
			break;
		case 3:
			var useTiming1 = _g3.timing;
			tmp = model_ver1_game_component_ActivePlayerComponent_isPlayerTiming(ctx,useTiming1,v.runtime.getResponsePlayerId(),model_ver1_game_component_TimingComponent_getTiming(ctx),playerId) && model_ver1_game_gameComponent_Runtime_isRequiresCanMet(ctx,playerId,v);
			break;
		default:
			tmp = model_ver1_game_gameComponent_Runtime_isRequiresCanMet(ctx,playerId,v);
		}
		if(tmp) {
			_g.push(v);
		}
	}
	return _g;
}
var model_ver1_game_gameComponent_PSArmorText1 = function(id) {
	model_ver1_game_gameComponent_GameCardText.call(this,id,"出場時直立",model_ver1_game_define_TextType.Automatic(model_ver1_game_define_TextTypeAutomaticType.Trigger));
};
$hxClasses["model.ver1.game.gameComponent.PSArmorText1"] = model_ver1_game_gameComponent_PSArmorText1;
model_ver1_game_gameComponent_PSArmorText1.__name__ = "model.ver1.game.gameComponent.PSArmorText1";
model_ver1_game_gameComponent_PSArmorText1.__super__ = model_ver1_game_gameComponent_GameCardText;
model_ver1_game_gameComponent_PSArmorText1.prototype = $extend(model_ver1_game_gameComponent_GameCardText.prototype,{
	_onEvent: function(ctx,event,runtime) {
		if(event._hx_index == 3) {
			if(event.reason._hx_index == 1) {
				var baSyouKw = event.baSyouKeyword;
				var cardId = event.cardId;
				if(model_ver1_game_define_BaSyou_isBa(baSyouKw) && cardId == runtime.getCardId()) {
					model_ver1_game_gameComponent_Alg_rerollCard(ctx,cardId,{ sendEvent : true});
				}
			}
		}
	}
	,__class__: model_ver1_game_gameComponent_PSArmorText1
});
var model_ver1_game_gameComponent_PSArmorText2 = function(id) {
	model_ver1_game_gameComponent_GameCardText.call(this,id," 進入戰場時, 下回合開始時回到手上, 當中如果和補給或供給能力的組到隊的話, 就不必回到手上",model_ver1_game_define_TextType.Automatic(model_ver1_game_define_TextTypeAutomaticType.Trigger));
};
$hxClasses["model.ver1.game.gameComponent.PSArmorText2"] = model_ver1_game_gameComponent_PSArmorText2;
model_ver1_game_gameComponent_PSArmorText2.__name__ = "model.ver1.game.gameComponent.PSArmorText2";
model_ver1_game_gameComponent_PSArmorText2.__super__ = model_ver1_game_gameComponent_GameCardText;
model_ver1_game_gameComponent_PSArmorText2.prototype = $extend(model_ver1_game_gameComponent_GameCardText.prototype,{
	_onEvent: function(ctx,event,runtime) {
		switch(event._hx_index) {
		case 3:
			var _g = event.reason;
			var cardId = event.cardId;
			var baSyouKw = event.baSyouKeyword;
			if(model_ver1_game_define_BaSyou_isBattleArea(baSyouKw) && cardId == runtime.getCardId()) {
				model_ver1_game_component_CardStateComponent_getCardState(ctx,cardId).bools.h["回合開始時回到手上"] = true;
			}
			break;
		case 6:
			var setGroupCardIds = event.cardIds;
			if(setGroupCardIds.indexOf(runtime.getCardId()) != -1) {
				var _g = [];
				var _g1 = 0;
				var _g2 = model_ver1_game_gameComponent_Runtime_getRuntimeText(ctx);
				while(_g1 < _g2.length) {
					var v = _g2[_g1];
					++_g1;
					if(setGroupCardIds.indexOf(v.runtime.getCardId()) != -1) {
						_g.push(v);
					}
				}
				var hasSupply = Lambda.exists(_g,function(rt) {
					var _g = rt.text.type;
					if(_g._hx_index == 2) {
						if(_g.type._hx_index == 8) {
							return true;
						} else {
							return false;
						}
					} else {
						return false;
					}
				});
				if(hasSupply) {
					model_ver1_game_component_CardStateComponent_getCardState(ctx,runtime.getCardId()).bools.h["回合開始時回到手上"] = false;
				}
			}
			break;
		case 7:
			var playerId = event.playerId;
			if(playerId == runtime.getResponsePlayerId()) {
				if(model_ver1_game_component_CardStateComponent_getCardState(ctx,runtime.getCardId()).bools.h["回合開始時回到手上"]) {
					model_ver1_game_component_TableComponent_returnToOwnerHand(ctx,runtime.getCardId());
				}
			}
			break;
		default:
		}
	}
	,__class__: model_ver1_game_gameComponent_PSArmorText2
});
function model_ver1_game_gameComponent_SpecialCardText_createPlayCardText(cardProto,options) {
	return new model_ver1_game_gameComponent_GameCardText("","",model_ver1_game_define_TextType.System);
}
function model_ver1_game_gameComponent_SpecialCardText_flatSpecial(ctx,cardId,text) {
	var _g = text.type;
	if(_g._hx_index == 2) {
		switch(_g.type._hx_index) {
		case 0:
			return [];
		case 10:
			return [new model_ver1_game_gameComponent_PSArmorText1(text.id),new model_ver1_game_gameComponent_PSArmorText2(text.id + "2")];
		case 11:
			var card = model_ver1_game_component_TableComponent_getCard(ctx,cardId);
			var cardProto = model_ver1_game_component_CardProtoPoolComponent_getCurrentCardProto(ctx,card.protoId);
			return [model_ver1_game_gameComponent_SpecialCardText_createPlayCardText(cardProto,{ })];
		default:
			return [text];
		}
	} else {
		return [text];
	}
}
function model_ver1_test_Test_test() {
	model_ver1_game_Game_test();
	model_ver1_game_define_BaSyou_test();
	model_ver1_game_flowComponent_FlowComponent_test();
	model_ver1_test_Test_$getRuntimeText_test();
	model_ver1_test_Test_test_getMarkEffects();
	model_ver1_test_Test_test_constantText();
	model_ver1_data_CardProto_$179030_$11E_$U_$VT186R_$purple_test();
	model_ver1_data_CardProto_$179030_$11E_$CH_$BN091N_$brown_test();
	model_ver1_data_CardProto_$179004_$01A_$CH_$WT009R_$white_test();
}
function model_ver1_test_Test_test_constantText() {
	var playerId = model_ver1_game_define_PlayerId.A;
	var ctx = new model_ver1_game_entity_Context();
	model_ver1_game_component_CardProtoPoolComponent_registerCardProto(ctx,"AddTextCardProto",new model_ver1_test_common_AddTextCardProto());
	model_ver1_game_component_CardProtoPoolComponent_registerCardProto(ctx,"OnlyConstentTextCardProto",new model_ver1_test_common_OnlyConstentTextCardProto());
	var card = new tool_Card("0");
	card.protoId = "AddTextCardProto";
	var runtime = new model_ver1_game_define_DefaultRuntime(card.id,playerId);
	var texts = model_ver1_game_component_CardProtoPoolComponent_getCurrentCardProto(ctx,card.protoId).getTexts(ctx,runtime);
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
	if(model_ver1_game_gameComponent_Runtime_getRuntimeText(ctx).length != 0) {
		throw new haxe_Exception("但找不到那個內文，因為在手牌中只有恆常能力可發動");
	}
	card.protoId = "OnlyConstentTextCardProto";
	texts = model_ver1_game_component_CardProtoPoolComponent_getCurrentCardProto(ctx,card.protoId).getTexts(ctx,runtime);
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
	if(model_ver1_game_gameComponent_Runtime_getRuntimeText(ctx).length != 1) {
		throw new haxe_Exception("必須找到1個恆常能力");
	}
}
function model_ver1_test_Test_test_getMarkEffects() {
	var ctx = new model_ver1_game_entity_Context();
	model_ver1_game_component_CardProtoPoolComponent_registerCardProto(ctx,"AddTextCardProto",new model_ver1_test_common_AddTextCardProto());
	var card = new tool_Card("0");
	card.protoId = "AddTextCardProto";
	var baSyou = model_ver1_game_define_BaSyou.Default(model_ver1_game_define_PlayerId.A,model_ver1_game_define_BaSyouKeyword.MaintenanceArea);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	tool_Table_addCard(ctx.table,this1,card);
	if(model_ver1_game_gameComponent_Runtime_getRuntimeText(ctx).length != 2) {
		throw new haxe_Exception("必須找到2個內文");
	}
	if(model_ver1_game_gameComponent_Runtime_getMarkEffects(ctx).length != 1) {
		throw new haxe_Exception("必須找到1個效果");
	}
	var enterFieldMark = new model_ver1_game_gameComponent_EnterFieldThisTurnMark("EnterFieldThisTurnMark",card.id);
	model_ver1_game_component_MarkComponent_addMark(ctx,enterFieldMark);
	if(model_ver1_game_gameComponent_Runtime_getRuntimeText(ctx).length != 2) {
		throw new haxe_Exception("還是找到2個內文");
	}
	if(model_ver1_game_gameComponent_Runtime_getMarkEffects(ctx).length != 2) {
		throw new haxe_Exception("找到2個效果");
	}
}
function model_ver1_test_Test_$getRuntimeText_test_getRuntimeText1() {
	var ctx = new model_ver1_game_entity_Context();
	model_ver1_game_component_CardProtoPoolComponent_registerCardProto(ctx,"OnlyEmptyTextCardProto",new model_ver1_test_common_OnlyEmptyTextCardProto());
	if(model_ver1_game_gameComponent_Runtime_getRuntimeText(ctx).length != 0) {
		throw new haxe_Exception("沒有任何牌時必須找不到內文");
	}
	var card = new tool_Card("0");
	card.protoId = "OnlyEmptyTextCardProto";
	var baSyou = model_ver1_game_define_BaSyou.Default(model_ver1_game_define_PlayerId.A,model_ver1_game_define_BaSyouKeyword.MaintenanceArea);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	tool_Table_addCard(ctx.table,this1,card);
	if(model_ver1_game_gameComponent_Runtime_getRuntimeText(ctx).length != 1) {
		throw new haxe_Exception("必須找到1個內文");
	}
}
function model_ver1_test_Test_$getRuntimeText_test_getRuntimeText2() {
	var ctx = new model_ver1_game_entity_Context();
	model_ver1_game_component_CardProtoPoolComponent_registerCardProto(ctx,"AddTextCardProto",new model_ver1_test_common_AddTextCardProto());
	var card = new tool_Card("0");
	card.protoId = "AddTextCardProto";
	var baSyou = model_ver1_game_define_BaSyou.Default(model_ver1_game_define_PlayerId.A,model_ver1_game_define_BaSyouKeyword.MaintenanceArea);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	tool_Table_addCard(ctx.table,this1,card);
	if(model_ver1_game_gameComponent_Runtime_getRuntimeText(ctx).length != 2) {
		throw new haxe_Exception("必須找到2個內文");
	}
}
function model_ver1_test_Test_$getRuntimeText_test_playGRule() {
	var ctx = new model_ver1_game_entity_Context();
	model_ver1_game_component_CardProtoPoolComponent_registerCardProto(ctx,"OnlyPlayGRuleCardProto",new model_ver1_test_common_OnlyPlayGRuleCardProto());
	var card = new tool_Card("0");
	card.protoId = "OnlyPlayGRuleCardProto";
	var baSyou = model_ver1_game_define_BaSyou.Default(model_ver1_game_define_PlayerId.A,model_ver1_game_define_BaSyouKeyword.TeHuTa);
	var playerId = baSyou.playerId;
	var baSyouKeyword = baSyou.baSyouKeyword;
	var this1 = "" + playerId + model_ver1_game_define_BaSyouId._split + $hxEnums[baSyouKeyword.__enum__].__constructs__[baSyouKeyword._hx_index]._hx_name;
	tool_Table_addCard(ctx.table,this1,card);
	model_ver1_game_component_TimingComponent_setTiming(ctx,model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Maintenance,haxe_ds_Option.None,model_ver1_game_define_TimingKeyword.Free1));
	var cmds = model_ver1_game_gameComponent_Runtime_getPlayerRuntimeText(ctx,model_ver1_game_define_PlayerId.A);
	if(cmds.length != 1) {
		throw new haxe_Exception("must has 1");
	}
	var cmds = model_ver1_game_gameComponent_Runtime_getPlayerRuntimeText(ctx,model_ver1_game_define_PlayerId.B);
	if(cmds.length != 0) {
		throw new haxe_Exception("must has 0");
	}
	model_ver1_game_component_TimingComponent_setTiming(ctx,model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Maintenance,haxe_ds_Option.None,model_ver1_game_define_TimingKeyword.Rule));
	var cmds = model_ver1_game_gameComponent_Runtime_getPlayerRuntimeText(ctx,model_ver1_game_define_PlayerId.A);
	if(cmds.length != 0) {
		throw new haxe_Exception("must has 0");
	}
	model_ver1_game_component_TimingComponent_setTiming(ctx,model_ver1_game_define_Timing.Default(model_ver1_game_define_PhaseKeyword.Draw,haxe_ds_Option.None,model_ver1_game_define_TimingKeyword.Free1));
	var cmds = model_ver1_game_gameComponent_Runtime_getPlayerRuntimeText(ctx,model_ver1_game_define_PlayerId.A);
	if(cmds.length != 0) {
		throw new haxe_Exception("must has 0");
	}
}
function model_ver1_test_Test_$getRuntimeText_test() {
	model_ver1_test_Test_$getRuntimeText_test_getRuntimeText1();
	model_ver1_test_Test_$getRuntimeText_test_getRuntimeText2();
	model_ver1_test_Test_$getRuntimeText_test_playGRule();
}
var model_ver1_test_common_OnlyEmptyTextCardProto = function() {
	model_ver1_game_gameComponent_GameCardProto.call(this);
};
$hxClasses["model.ver1.test.common.OnlyEmptyTextCardProto"] = model_ver1_test_common_OnlyEmptyTextCardProto;
model_ver1_test_common_OnlyEmptyTextCardProto.__name__ = "model.ver1.test.common.OnlyEmptyTextCardProto";
model_ver1_test_common_OnlyEmptyTextCardProto.__super__ = model_ver1_game_gameComponent_GameCardProto;
model_ver1_test_common_OnlyEmptyTextCardProto.prototype = $extend(model_ver1_game_gameComponent_GameCardProto.prototype,{
	_getTexts: function(ctx,runtime) {
		var thisCardId = runtime.getCardId();
		return [new model_ver1_game_define_CardText("" + thisCardId + "_CardText","",model_ver1_game_define_TextType.System)];
	}
	,__class__: model_ver1_test_common_OnlyEmptyTextCardProto
});
var model_ver1_test_common_AddOneTextText = function(id) {
	model_ver1_game_gameComponent_GameCardText.call(this,id,"AddOneTextText",model_ver1_game_define_TextType.System);
};
$hxClasses["model.ver1.test.common.AddOneTextText"] = model_ver1_test_common_AddOneTextText;
model_ver1_test_common_AddOneTextText.__name__ = "model.ver1.test.common.AddOneTextText";
model_ver1_test_common_AddOneTextText.__super__ = model_ver1_game_gameComponent_GameCardText;
model_ver1_test_common_AddOneTextText.prototype = $extend(model_ver1_game_gameComponent_GameCardText.prototype,{
	_getEffect: function(ctx,runtime) {
		var thisCardId = runtime.getCardId();
		return [model_ver1_game_gameComponent_MarkEffect.AddText(thisCardId,new model_ver1_game_define_CardText("" + thisCardId + "_EmptyText","",model_ver1_game_define_TextType.System))];
	}
	,__class__: model_ver1_test_common_AddOneTextText
});
var model_ver1_test_common_AddTextCardProto = function() {
	model_ver1_game_gameComponent_GameCardProto.call(this);
};
$hxClasses["model.ver1.test.common.AddTextCardProto"] = model_ver1_test_common_AddTextCardProto;
model_ver1_test_common_AddTextCardProto.__name__ = "model.ver1.test.common.AddTextCardProto";
model_ver1_test_common_AddTextCardProto.__super__ = model_ver1_game_gameComponent_GameCardProto;
model_ver1_test_common_AddTextCardProto.prototype = $extend(model_ver1_game_gameComponent_GameCardProto.prototype,{
	_getTexts: function(ctx,runtime) {
		var thisCardId = runtime.getCardId();
		return [new model_ver1_test_common_AddOneTextText("" + thisCardId + "_TestText2")];
	}
	,__class__: model_ver1_test_common_AddTextCardProto
});
var model_ver1_test_common_OnlyConstentTextCardProto = function() {
	model_ver1_game_gameComponent_GameCardProto.call(this);
};
$hxClasses["model.ver1.test.common.OnlyConstentTextCardProto"] = model_ver1_test_common_OnlyConstentTextCardProto;
model_ver1_test_common_OnlyConstentTextCardProto.__name__ = "model.ver1.test.common.OnlyConstentTextCardProto";
model_ver1_test_common_OnlyConstentTextCardProto.__super__ = model_ver1_game_gameComponent_GameCardProto;
model_ver1_test_common_OnlyConstentTextCardProto.prototype = $extend(model_ver1_game_gameComponent_GameCardProto.prototype,{
	_getTexts: function(ctx,runtime) {
		var thisCardId = runtime.getCardId();
		var text = new model_ver1_game_define_CardText("" + thisCardId + "_TestText","",model_ver1_game_define_TextType.Automatic(model_ver1_game_define_TextTypeAutomaticType.Constant));
		return [text];
	}
	,__class__: model_ver1_test_common_OnlyConstentTextCardProto
});
var model_ver1_test_common_OnlyPlayGRuleCardProto = function() {
	model_ver1_game_gameComponent_GameCardProto.call(this);
};
$hxClasses["model.ver1.test.common.OnlyPlayGRuleCardProto"] = model_ver1_test_common_OnlyPlayGRuleCardProto;
model_ver1_test_common_OnlyPlayGRuleCardProto.__name__ = "model.ver1.test.common.OnlyPlayGRuleCardProto";
model_ver1_test_common_OnlyPlayGRuleCardProto.__super__ = model_ver1_game_gameComponent_GameCardProto;
model_ver1_test_common_OnlyPlayGRuleCardProto.prototype = $extend(model_ver1_game_gameComponent_GameCardProto.prototype,{
	_getTexts: function(ctx,runtime) {
		var thisCardId = runtime.getCardId();
		return [new model_ver1_game_gameComponent_PlayGRule("playG")];
	}
	,__class__: model_ver1_test_common_OnlyPlayGRuleCardProto
});
function tool_Helper_getMemonto(obj) {
	haxe_Serializer.USE_CACHE = true;
	return haxe_Serializer.run(obj);
}
function tool_Helper_ofMemonto(memonto) {
	return haxe_Unserializer.run(memonto);
}
var tool_Card = function(id) {
	this.isReverse = false;
	this.isTap = false;
	this.isFaceUp = false;
	this.id = id;
};
$hxClasses["tool.Card"] = tool_Card;
tool_Card.__name__ = "tool.Card";
tool_Card.prototype = {
	__class__: tool_Card
};
var tool_CardStack = function(id) {
	this.cardIds = [];
	this.id = id;
};
$hxClasses["tool.CardStack"] = tool_CardStack;
tool_CardStack.__name__ = "tool.CardStack";
tool_CardStack.prototype = {
	__class__: tool_CardStack
};
var tool_Table = function() {
	this.cardStacks = new haxe_ds_StringMap();
	this.cards = new haxe_ds_StringMap();
};
$hxClasses["tool.Table"] = tool_Table;
tool_Table.__name__ = "tool.Table";
tool_Table.prototype = {
	__class__: tool_Table
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
function tool_Table_getCards(table) {
	var _g = [];
	var h = table.cards.h;
	var card_h = h;
	var card_keys = Object.keys(h);
	var card_length = card_keys.length;
	var card_current = 0;
	while(card_current < card_length) {
		var card = card_h[card_keys[card_current++]];
		_g.push(card);
	}
	return _g;
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
var Int = { };
var Dynamic = { };
var Float = Number;
var Bool = Boolean;
var Class = { };
var Enum = { };
haxe_ds_ObjectMap.count = 0;
js_Boot.__toStr = ({ }).toString;
haxe_Serializer.USE_CACHE = false;
haxe_Serializer.USE_ENUM_INDEX = false;
haxe_Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe_Unserializer.DEFAULT_RESOLVER = new haxe__$Unserializer_DefaultResolver();
haxe_Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
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
Test.main();
})(typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
