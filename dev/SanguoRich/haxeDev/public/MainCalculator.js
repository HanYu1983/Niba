(function ($global) { "use strict";
var $hxClasses = {},$estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	this.r = new RegExp(r,opt.split("u").join(""));
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = "EReg";
EReg.prototype = {
	r: null
	,match: function(s) {
		if(this.r.global) {
			this.r.lastIndex = 0;
		}
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) {
			return this.r.m[n];
		} else {
			throw haxe_Exception.thrown("EReg::matched");
		}
	}
	,matchedPos: function() {
		if(this.r.m == null) {
			throw haxe_Exception.thrown("No string matched");
		}
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchSub: function(s,pos,len) {
		if(len == null) {
			len = -1;
		}
		if(this.r.global) {
			this.r.lastIndex = pos;
			this.r.m = this.r.exec(len < 0 ? s : HxOverrides.substr(s,0,pos + len));
			var b = this.r.m != null;
			if(b) {
				this.r.s = s;
			}
			return b;
		} else {
			var b = this.match(len < 0 ? HxOverrides.substr(s,pos,null) : HxOverrides.substr(s,pos,len));
			if(b) {
				this.r.s = s;
				this.r.m.index += pos;
			}
			return b;
		}
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,map: function(s,f) {
		var offset = 0;
		var buf_b = "";
		while(true) {
			if(offset >= s.length) {
				break;
			} else if(!this.matchSub(s,offset)) {
				buf_b += Std.string(HxOverrides.substr(s,offset,null));
				break;
			}
			var p = this.matchedPos();
			buf_b += Std.string(HxOverrides.substr(s,offset,p.pos - offset));
			buf_b += Std.string(f(this));
			if(p.len == 0) {
				buf_b += Std.string(HxOverrides.substr(s,p.pos,1));
				offset = p.pos + 1;
			} else {
				offset = p.pos + p.len;
			}
			if(!this.r.global) {
				break;
			}
		}
		if(!this.r.global && offset > 0 && offset < s.length) {
			buf_b += Std.string(HxOverrides.substr(s,offset,null));
		}
		return buf_b;
	}
	,__class__: EReg
};
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
Lambda.has = function(it,elt) {
	var x = $getIterator(it);
	while(x.hasNext()) {
		var x1 = x.next();
		if(x1 == elt) {
			return true;
		}
	}
	return false;
};
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
var MainCalculator = function() { };
$hxClasses["MainCalculator"] = MainCalculator;
MainCalculator.__name__ = "MainCalculator";
MainCalculator.main = function() {
	var app = new haxe_ui_HaxeUIApp();
	app.ready(function() {
		MainCalculator.view = new view_MainCalculatorView();
		app.addComponent(MainCalculator.view);
	});
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
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) {
		return null;
	} else {
		var tmp1;
		if(o.__properties__) {
			tmp = o.__properties__["get_" + field];
			tmp1 = tmp;
		} else {
			tmp1 = false;
		}
		if(tmp1) {
			return o[tmp]();
		} else {
			return o[field];
		}
	}
};
Reflect.setProperty = function(o,field,value) {
	var tmp;
	var tmp1;
	if(o.__properties__) {
		tmp = o.__properties__["set_" + field];
		tmp1 = tmp;
	} else {
		tmp1 = false;
	}
	if(tmp1) {
		o[tmp](value);
	} else {
		o[field] = value;
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
var Set = function() {
	this.vals = new haxe_ds_GenericStack();
	this.length = 0;
};
$hxClasses["Set"] = Set;
Set.__name__ = "Set";
Set.prototype = {
	length: null
	,vals: null
	,add: function(item,cmp) {
		if(!this.has(item,cmp)) {
			var _this = this.vals;
			_this.head = new haxe_ds_GenericCell(item,_this.head);
			this.length++;
			return true;
		}
		return false;
	}
	,remove: function(pred) {
		var count = 0;
		var ii = this.vals.iterator();
		while(ii.hasNext()) {
			var ii1 = ii.next();
			if(pred(ii1)) {
				count += this.vals.remove(ii1) ? 1 : 0;
			}
		}
		this.length -= count;
		return count;
	}
	,has: function(item,cmp) {
		if(cmp == null) {
			return Lambda.has(this.vals,item);
		} else {
			return Lambda.exists(this.vals,function(a) {
				return cmp(a,item);
			});
		}
	}
	,isEmpty: function() {
		return this.vals.head == null;
	}
	,union: function(otherItems,cmp) {
		var count = 0;
		var ii = $getIterator(otherItems);
		while(ii.hasNext()) {
			var ii1 = ii.next();
			count += this.add(ii1,cmp) ? 1 : 0;
		}
		return count;
	}
	,intersection: function(otherItems,cmp) {
		var count = 0;
		var ii = this.vals.iterator();
		while(ii.hasNext()) {
			var ii1 = [ii.next()];
			if(!(cmp == null && Lambda.has(otherItems,ii1[0]) || cmp != null && Lambda.exists(otherItems,(function(ii) {
				return function(a) {
					return cmp(a,ii[0]);
				};
			})(ii1)))) {
				count += this.vals.remove(ii1[0]) ? 1 : 0;
			}
		}
		this.length -= count;
		return count;
	}
	,minus: function(otherItems,cmp) {
		var count = 0;
		var ii = this.vals.iterator();
		while(ii.hasNext()) {
			var ii1 = [ii.next()];
			if(cmp == null && Lambda.has(otherItems,ii1[0]) || cmp != null && Lambda.exists(otherItems,(function(ii) {
				return function(a) {
					return cmp(a,ii[0]);
				};
			})(ii1))) {
				count += this.vals.remove(ii1[0]) ? 1 : 0;
			}
		}
		this.length -= count;
		return count;
	}
	,equals: function(otherSet,cmp) {
		if(cmp == null) {
			cmp = function(a,b) {
				return a == b;
			};
		}
		var ii = this.vals.iterator();
		while(ii.hasNext()) {
			var ii1 = ii.next();
			var found = false;
			var jj = otherSet.iterator();
			while(jj.hasNext()) {
				var jj1 = jj.next();
				if(cmp(ii1,jj1)) {
					found = true;
					continue;
				}
			}
			if(!found) {
				return false;
			}
		}
		return this.length == otherSet.length;
	}
	,clear: function() {
		this.vals = new haxe_ds_GenericStack();
		this.length = 0;
	}
	,iterator: function() {
		return this.vals.iterator();
	}
	,__class__: Set
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = "Std";
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	if(x != null) {
		var _g = 0;
		var _g1 = x.length;
		while(_g < _g1) {
			var i = _g++;
			var c = x.charCodeAt(i);
			if(c <= 8 || c >= 14 && c != 32 && c != 45) {
				var nc = x.charCodeAt(i + 1);
				var v = parseInt(x,nc == 120 || nc == 88 ? 16 : 10);
				if(isNaN(v)) {
					return null;
				} else {
					return v;
				}
			}
		}
	}
	return null;
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = "StringTools";
StringTools.startsWith = function(s,start) {
	if(s.length >= start.length) {
		return s.lastIndexOf(start,0) == 0;
	} else {
		return false;
	}
};
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	if(slen >= elen) {
		return s.indexOf(end,slen - elen) == slen - elen;
	} else {
		return false;
	}
};
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	if(!(c > 8 && c < 14)) {
		return c == 32;
	} else {
		return true;
	}
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,r,l - r);
	} else {
		return s;
	}
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,0,l - r);
	} else {
		return s;
	}
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	while(true) {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
		if(!(n > 0)) {
			break;
		}
	}
	if(digits != null) {
		while(s.length < digits) s = "0" + s;
	}
	return s;
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
Type.createInstance = function(cl,args) {
	var ctor = Function.prototype.bind.apply(cl,[null].concat(args));
	return new (ctor);
};
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
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
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
	__skipStack: null
	,__nativeException: null
	,__previousException: null
	,get_native: function() {
		return this.__nativeException;
	}
	,__class__: haxe_Exception
	,__properties__: {get_native:"get_native"}
});
var haxe_Log = function() { };
$hxClasses["haxe.Log"] = haxe_Log;
haxe_Log.__name__ = "haxe.Log";
haxe_Log.formatOutput = function(v,infos) {
	var str = Std.string(v);
	if(infos == null) {
		return str;
	}
	var pstr = infos.fileName + ":" + infos.lineNumber;
	if(infos.customParams != null) {
		var _g = 0;
		var _g1 = infos.customParams;
		while(_g < _g1.length) {
			var v = _g1[_g];
			++_g;
			str += ", " + Std.string(v);
		}
	}
	return pstr + ": " + str;
};
haxe_Log.trace = function(v,infos) {
	var str = haxe_Log.formatOutput(v,infos);
	if(typeof(console) != "undefined" && console.log != null) {
		console.log(str);
	}
};
var haxe_Resource = function() { };
$hxClasses["haxe.Resource"] = haxe_Resource;
haxe_Resource.__name__ = "haxe.Resource";
haxe_Resource.listNames = function() {
	var _g = [];
	var _g1 = 0;
	var _g2 = haxe_Resource.content;
	while(_g1 < _g2.length) {
		var x = _g2[_g1];
		++_g1;
		_g.push(x.name);
	}
	return _g;
};
haxe_Resource.getString = function(name) {
	var _g = 0;
	var _g1 = haxe_Resource.content;
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		if(x.name == name) {
			if(x.str != null) {
				return x.str;
			}
			var b = haxe_crypto_Base64.decode(x.data);
			return b.toString();
		}
	}
	return null;
};
haxe_Resource.getBytes = function(name) {
	var _g = 0;
	var _g1 = haxe_Resource.content;
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		if(x.name == name) {
			if(x.str != null) {
				return haxe_io_Bytes.ofString(x.str);
			}
			return haxe_crypto_Base64.decode(x.data);
		}
	}
	return null;
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe_Timer;
haxe_Timer.__name__ = "haxe.Timer";
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.prototype = {
	id: null
	,stop: function() {
		if(this.id == null) {
			return;
		}
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe_Timer
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
haxe_Unserializer.prototype = {
	buf: null
	,pos: null
	,length: null
	,cache: null
	,scache: null
	,resolver: null
	,readDigits: function() {
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
	value: null
	,__class__: haxe_ValueException
});
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
haxe_io_Bytes.ofData = function(b) {
	var hb = b.hxBytes;
	if(hb != null) {
		return hb;
	}
	return new haxe_io_Bytes(b);
};
haxe_io_Bytes.prototype = {
	length: null
	,b: null
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
	,toString: function() {
		return this.getString(0,this.length);
	}
	,__class__: haxe_io_Bytes
};
var haxe_io_Encoding = $hxEnums["haxe.io.Encoding"] = { __ename__:true,__constructs__:null
	,UTF8: {_hx_name:"UTF8",_hx_index:0,__enum__:"haxe.io.Encoding",toString:$estr}
	,RawNative: {_hx_name:"RawNative",_hx_index:1,__enum__:"haxe.io.Encoding",toString:$estr}
};
haxe_io_Encoding.__constructs__ = [haxe_io_Encoding.UTF8,haxe_io_Encoding.RawNative];
var haxe_crypto_Base64 = function() { };
$hxClasses["haxe.crypto.Base64"] = haxe_crypto_Base64;
haxe_crypto_Base64.__name__ = "haxe.crypto.Base64";
haxe_crypto_Base64.decode = function(str,complement) {
	if(complement == null) {
		complement = true;
	}
	if(complement) {
		while(HxOverrides.cca(str,str.length - 1) == 61) str = HxOverrides.substr(str,0,-1);
	}
	return new haxe_crypto_BaseCode(haxe_crypto_Base64.BYTES).decodeBytes(haxe_io_Bytes.ofString(str));
};
var haxe_crypto_BaseCode = function(base) {
	var len = base.length;
	var nbits = 1;
	while(len > 1 << nbits) ++nbits;
	if(nbits > 8 || len != 1 << nbits) {
		throw haxe_Exception.thrown("BaseCode : base length must be a power of two.");
	}
	this.base = base;
	this.nbits = nbits;
};
$hxClasses["haxe.crypto.BaseCode"] = haxe_crypto_BaseCode;
haxe_crypto_BaseCode.__name__ = "haxe.crypto.BaseCode";
haxe_crypto_BaseCode.prototype = {
	base: null
	,nbits: null
	,tbl: null
	,initTable: function() {
		var tbl = [];
		var _g = 0;
		while(_g < 256) {
			var i = _g++;
			tbl[i] = -1;
		}
		var _g = 0;
		var _g1 = this.base.length;
		while(_g < _g1) {
			var i = _g++;
			tbl[this.base.b[i]] = i;
		}
		this.tbl = tbl;
	}
	,decodeBytes: function(b) {
		var nbits = this.nbits;
		var base = this.base;
		if(this.tbl == null) {
			this.initTable();
		}
		var tbl = this.tbl;
		var size = b.length * nbits >> 3;
		var out = new haxe_io_Bytes(new ArrayBuffer(size));
		var buf = 0;
		var curbits = 0;
		var pin = 0;
		var pout = 0;
		while(pout < size) {
			while(curbits < 8) {
				curbits += nbits;
				buf <<= nbits;
				var i = tbl[b.b[pin++]];
				if(i == -1) {
					throw haxe_Exception.thrown("BaseCode : invalid encoded char");
				}
				buf |= i;
			}
			curbits -= 8;
			out.b[pout++] = buf >> curbits & 255;
		}
		return out;
	}
	,__class__: haxe_crypto_BaseCode
};
var haxe_ds_ArraySort = function() { };
$hxClasses["haxe.ds.ArraySort"] = haxe_ds_ArraySort;
haxe_ds_ArraySort.__name__ = "haxe.ds.ArraySort";
haxe_ds_ArraySort.sort = function(a,cmp) {
	haxe_ds_ArraySort.rec(a,cmp,0,a.length);
};
haxe_ds_ArraySort.rec = function(a,cmp,from,to) {
	var middle = from + to >> 1;
	if(to - from < 12) {
		if(to <= from) {
			return;
		}
		var _g = from + 1;
		var _g1 = to;
		while(_g < _g1) {
			var i = _g++;
			var j = i;
			while(j > from) {
				if(cmp(a[j],a[j - 1]) < 0) {
					haxe_ds_ArraySort.swap(a,j - 1,j);
				} else {
					break;
				}
				--j;
			}
		}
		return;
	}
	haxe_ds_ArraySort.rec(a,cmp,from,middle);
	haxe_ds_ArraySort.rec(a,cmp,middle,to);
	haxe_ds_ArraySort.doMerge(a,cmp,from,middle,to,middle - from,to - middle);
};
haxe_ds_ArraySort.doMerge = function(a,cmp,from,pivot,to,len1,len2) {
	var first_cut;
	var second_cut;
	var len11;
	var len22;
	if(len1 == 0 || len2 == 0) {
		return;
	}
	if(len1 + len2 == 2) {
		if(cmp(a[pivot],a[from]) < 0) {
			haxe_ds_ArraySort.swap(a,pivot,from);
		}
		return;
	}
	if(len1 > len2) {
		len11 = len1 >> 1;
		first_cut = from + len11;
		second_cut = haxe_ds_ArraySort.lower(a,cmp,pivot,to,first_cut);
		len22 = second_cut - pivot;
	} else {
		len22 = len2 >> 1;
		second_cut = pivot + len22;
		first_cut = haxe_ds_ArraySort.upper(a,cmp,from,pivot,second_cut);
		len11 = first_cut - from;
	}
	haxe_ds_ArraySort.rotate(a,cmp,first_cut,pivot,second_cut);
	var new_mid = first_cut + len22;
	haxe_ds_ArraySort.doMerge(a,cmp,from,first_cut,new_mid,len11,len22);
	haxe_ds_ArraySort.doMerge(a,cmp,new_mid,second_cut,to,len1 - len11,len2 - len22);
};
haxe_ds_ArraySort.rotate = function(a,cmp,from,mid,to) {
	if(from == mid || mid == to) {
		return;
	}
	var n = haxe_ds_ArraySort.gcd(to - from,mid - from);
	while(n-- != 0) {
		var val = a[from + n];
		var shift = mid - from;
		var p1 = from + n;
		var p2 = from + n + shift;
		while(p2 != from + n) {
			a[p1] = a[p2];
			p1 = p2;
			if(to - p2 > shift) {
				p2 += shift;
			} else {
				p2 = from + (shift - (to - p2));
			}
		}
		a[p1] = val;
	}
};
haxe_ds_ArraySort.gcd = function(m,n) {
	while(n != 0) {
		var t = m % n;
		m = n;
		n = t;
	}
	return m;
};
haxe_ds_ArraySort.upper = function(a,cmp,from,to,val) {
	var len = to - from;
	var half;
	var mid;
	while(len > 0) {
		half = len >> 1;
		mid = from + half;
		if(cmp(a[val],a[mid]) < 0) {
			len = half;
		} else {
			from = mid + 1;
			len = len - half - 1;
		}
	}
	return from;
};
haxe_ds_ArraySort.lower = function(a,cmp,from,to,val) {
	var len = to - from;
	var half;
	var mid;
	while(len > 0) {
		half = len >> 1;
		mid = from + half;
		if(cmp(a[mid],a[val]) < 0) {
			from = mid + 1;
			len = len - half - 1;
		} else {
			len = half;
		}
	}
	return from;
};
haxe_ds_ArraySort.swap = function(a,i,j) {
	var tmp = a[i];
	a[i] = a[j];
	a[j] = tmp;
};
var haxe_ds_GenericCell = function(elt,next) {
	this.elt = elt;
	this.next = next;
};
$hxClasses["haxe.ds.GenericCell"] = haxe_ds_GenericCell;
haxe_ds_GenericCell.__name__ = "haxe.ds.GenericCell";
haxe_ds_GenericCell.prototype = {
	elt: null
	,next: null
	,__class__: haxe_ds_GenericCell
};
var haxe_ds_GenericStack = function() {
};
$hxClasses["haxe.ds.GenericStack"] = haxe_ds_GenericStack;
haxe_ds_GenericStack.__name__ = "haxe.ds.GenericStack";
haxe_ds_GenericStack.prototype = {
	head: null
	,remove: function(v) {
		var prev = null;
		var l = this.head;
		while(l != null) {
			if(l.elt == v) {
				if(prev == null) {
					this.head = l.next;
				} else {
					prev.next = l.next;
				}
				break;
			}
			prev = l;
			l = l.next;
		}
		return l != null;
	}
	,iterator: function() {
		var l = this.head;
		return { hasNext : function() {
			return l != null;
		}, next : function() {
			var k = l;
			l = k.next;
			return k.elt;
		}};
	}
	,__class__: haxe_ds_GenericStack
};
var haxe_ds_IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe_ds_IntMap;
haxe_ds_IntMap.__name__ = "haxe.ds.IntMap";
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
haxe_ds_IntMap.prototype = {
	h: null
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) {
			return false;
		}
		delete(this.h[key]);
		return true;
	}
	,__class__: haxe_ds_IntMap
};
var haxe_ds_List = function() {
	this.length = 0;
};
$hxClasses["haxe.ds.List"] = haxe_ds_List;
haxe_ds_List.__name__ = "haxe.ds.List";
haxe_ds_List.prototype = {
	h: null
	,q: null
	,length: null
	,add: function(item) {
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
	item: null
	,next: null
	,__class__: haxe_ds__$List_ListNode
};
var haxe_ds_ObjectMap = function() {
	this.h = { __keys__ : { }};
};
$hxClasses["haxe.ds.ObjectMap"] = haxe_ds_ObjectMap;
haxe_ds_ObjectMap.__name__ = "haxe.ds.ObjectMap";
haxe_ds_ObjectMap.__interfaces__ = [haxe_IMap];
haxe_ds_ObjectMap.prototype = {
	h: null
	,set: function(key,value) {
		var id = key.__id__;
		if(id == null) {
			id = (key.__id__ = $global.$haxeUID++);
		}
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,remove: function(key) {
		var id = key.__id__;
		if(this.h.__keys__[id] == null) {
			return false;
		}
		delete(this.h[id]);
		delete(this.h.__keys__[id]);
		return true;
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
var haxe_ds_StringMap = function() {
	this.h = Object.create(null);
};
$hxClasses["haxe.ds.StringMap"] = haxe_ds_StringMap;
haxe_ds_StringMap.__name__ = "haxe.ds.StringMap";
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	h: null
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
	h: null
	,keys: null
	,length: null
	,current: null
	,hasNext: function() {
		return this.current < this.length;
	}
	,next: function() {
		return this.keys[this.current++];
	}
	,__class__: haxe_ds__$StringMap_StringMapKeyIterator
};
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
	array: null
	,current: null
	,hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
	,__class__: haxe_iterators_ArrayIterator
};
var haxe_ui_backend_BackendImpl = function() { };
$hxClasses["haxe.ui.backend.BackendImpl"] = haxe_ui_backend_BackendImpl;
haxe_ui_backend_BackendImpl.__name__ = "haxe.ui.backend.BackendImpl";
var haxe_ui_Backend = function() { };
$hxClasses["haxe.ui.Backend"] = haxe_ui_Backend;
haxe_ui_Backend.__name__ = "haxe.ui.Backend";
haxe_ui_Backend.__properties__ = {get_id:"get_id"};
haxe_ui_Backend.get_id = function() {
	return haxe_ui_backend_BackendImpl.id;
};
haxe_ui_Backend.__super__ = haxe_ui_backend_BackendImpl;
haxe_ui_Backend.prototype = $extend(haxe_ui_backend_BackendImpl.prototype,{
	__class__: haxe_ui_Backend
});
var haxe_ui_backend_CallLaterImpl = function(fn) {
	window.requestAnimationFrame(function(timestamp) {
		fn();
	});
};
$hxClasses["haxe.ui.backend.CallLaterImpl"] = haxe_ui_backend_CallLaterImpl;
haxe_ui_backend_CallLaterImpl.__name__ = "haxe.ui.backend.CallLaterImpl";
haxe_ui_backend_CallLaterImpl.prototype = {
	__class__: haxe_ui_backend_CallLaterImpl
};
var haxe_ui_CallLater = function(fn) {
	haxe_ui_backend_CallLaterImpl.call(this,fn);
};
$hxClasses["haxe.ui.CallLater"] = haxe_ui_CallLater;
haxe_ui_CallLater.__name__ = "haxe.ui.CallLater";
haxe_ui_CallLater.__super__ = haxe_ui_backend_CallLaterImpl;
haxe_ui_CallLater.prototype = $extend(haxe_ui_backend_CallLaterImpl.prototype,{
	__class__: haxe_ui_CallLater
});
var haxe_ui_backend_AppBase = function() {
	this.__events = null;
};
$hxClasses["haxe.ui.backend.AppBase"] = haxe_ui_backend_AppBase;
haxe_ui_backend_AppBase.__name__ = "haxe.ui.backend.AppBase";
haxe_ui_backend_AppBase.prototype = {
	__events: null
	,registerEvent: function(type,listener,priority) {
		if(priority == null) {
			priority = 0;
		}
		if(this.__events == null) {
			this.__events = new haxe_ui_util_EventMap();
		}
		this.__events.add(type,listener,priority);
	}
	,hasEvent: function(type,listener) {
		if(this.__events == null) {
			return false;
		}
		return this.__events.contains(type,listener);
	}
	,unregisterEvent: function(type,listener) {
		if(this.__events != null) {
			this.__events.remove(type,listener);
		}
	}
	,dispatch: function(event) {
		if(this.__events != null) {
			this.__events.invoke(event.type,event,null);
		}
	}
	,build: function() {
	}
	,init: function(onReady,onEnd) {
		onReady();
	}
	,getToolkitInit: function() {
		return { };
	}
	,start: function() {
	}
	,exit: function() {
	}
	,buildPreloadList: function() {
		return [];
	}
	,__class__: haxe_ui_backend_AppBase
};
var haxe_ui_backend_AppImpl = function() {
	haxe_ui_backend_AppBase.call(this);
};
$hxClasses["haxe.ui.backend.AppImpl"] = haxe_ui_backend_AppImpl;
haxe_ui_backend_AppImpl.__name__ = "haxe.ui.backend.AppImpl";
haxe_ui_backend_AppImpl.__super__ = haxe_ui_backend_AppBase;
haxe_ui_backend_AppImpl.prototype = $extend(haxe_ui_backend_AppBase.prototype,{
	init: function(onReady,onEnd) {
		var title = haxe_ui_Toolkit.get_backendProperties().getProp("haxe.ui.html5.title");
		if(title != null) {
			haxe_ui_core_Screen.get_instance().set_title(title);
		}
		if(window.document.readyState == "complete") {
			onReady();
		} else {
			window.document.body.onload = function(e) {
				onReady();
			};
		}
	}
	,getToolkitInit: function() {
		return { container : this.findContainer(haxe_ui_Toolkit.get_backendProperties().getProp("haxe.ui.html5.container","body"))};
	}
	,findContainer: function(id) {
		var el = null;
		if(id == "body") {
			el = window.document.body;
		} else if(id != null) {
			el = window.document.getElementById(id);
		}
		if(el == null) {
			el = window.document.body;
		}
		el.style.overflow = "hidden";
		return el;
	}
	,__class__: haxe_ui_backend_AppImpl
});
var haxe_ui_HaxeUIApp = function(options) {
	haxe_ui_backend_AppImpl.call(this);
	haxe_ui_HaxeUIApp.instance = this;
	this._options = options;
	haxe_ui_Toolkit.build();
	this.build();
};
$hxClasses["haxe.ui.HaxeUIApp"] = haxe_ui_HaxeUIApp;
haxe_ui_HaxeUIApp.__name__ = "haxe.ui.HaxeUIApp";
haxe_ui_HaxeUIApp.__super__ = haxe_ui_backend_AppImpl;
haxe_ui_HaxeUIApp.prototype = $extend(haxe_ui_backend_AppImpl.prototype,{
	_options: null
	,ready: function(onReady,onEnd) {
		this.init(onReady,onEnd);
	}
	,init: function(onReady,onEnd) {
		if(haxe_ui_Toolkit.get_backendProperties().getProp("haxe.ui.theme") != null && haxe_ui_Toolkit.get_theme() == "default") {
			haxe_ui_Toolkit.set_theme(haxe_ui_Toolkit.get_backendProperties().getProp("haxe.ui.theme"));
		}
		if(this._options == null) {
			haxe_ui_Toolkit.init(this.getToolkitInit());
		} else {
			haxe_ui_Toolkit.init(this._options);
		}
		var preloadList = null;
		var preloader = null;
		preloadList = this.buildPreloadList();
		if(preloadList != null && preloadList.length > 0) {
			preloader = new haxe_ui_Preloader();
			preloader.progress(0,preloadList.length);
			this.addComponent(preloader);
			preloader.validateComponent();
		}
		this.handlePreload(preloadList,onReady,onEnd,preloader);
	}
	,handlePreload: function(list,onReady,onEnd,preloader) {
		var _gthis = this;
		if(list == null || list.length == 0) {
			if(preloader != null) {
				preloader.complete();
			}
			haxe_Log.trace("init",{ fileName : "haxe/ui/HaxeUIApp.hx", lineNumber : 60, className : "haxe.ui.HaxeUIApp", methodName : "handlePreload"});
			haxe_ui_backend_AppImpl.prototype.init.call(this,onReady,onEnd);
			return;
		}
		var item = list.shift();
		haxe_Log.trace("item",{ fileName : "haxe/ui/HaxeUIApp.hx", lineNumber : 66, className : "haxe.ui.HaxeUIApp", methodName : "handlePreload", customParams : [item]});
		switch(item.type) {
		case "font":
			haxe_ui_ToolkitAssets.get_instance().getFont(item.resourceId,function(f) {
				if(preloader != null) {
					preloader.increment();
				}
				_gthis.handlePreload(list,onReady,onEnd,preloader);
			});
			break;
		case "image":
			haxe_ui_ToolkitAssets.get_instance().getImage(item.resourceId,function(i) {
				if(preloader != null) {
					preloader.increment();
				}
				_gthis.handlePreload(list,onReady,onEnd,preloader);
			});
			break;
		default:
			haxe_Log.trace("WARNING: unknown type to preload \"" + item.type + "\", continuing",{ fileName : "haxe/ui/HaxeUIApp.hx", lineNumber : 83, className : "haxe.ui.HaxeUIApp", methodName : "handlePreload"});
			if(preloader != null) {
				preloader.increment();
			}
			this.handlePreload(list,onReady,onEnd,preloader);
		}
	}
	,addComponent: function(component) {
		return haxe_ui_core_Screen.get_instance().addComponent(component);
	}
	,removeComponent: function(component,dispose) {
		if(dispose == null) {
			dispose = true;
		}
		return haxe_ui_core_Screen.get_instance().removeComponent(component,dispose);
	}
	,setComponentIndex: function(child,index) {
		return haxe_ui_core_Screen.get_instance().setComponentIndex(child,index);
	}
	,buildPreloadList: function() {
		var list = haxe_ui_backend_AppImpl.prototype.buildPreloadList.call(this);
		if(list == null) {
			list = [];
		}
		list = list.concat(haxe_ui_ToolkitAssets.get_instance().preloadList);
		return list;
	}
	,__class__: haxe_ui_HaxeUIApp
});
var haxe_ui_backend_ComponentSurface = function() {
};
$hxClasses["haxe.ui.backend.ComponentSurface"] = haxe_ui_backend_ComponentSurface;
haxe_ui_backend_ComponentSurface.__name__ = "haxe.ui.backend.ComponentSurface";
haxe_ui_backend_ComponentSurface.prototype = {
	__class__: haxe_ui_backend_ComponentSurface
};
var haxe_ui_core_ComponentCommon = function() {
	haxe_ui_backend_ComponentSurface.call(this);
};
$hxClasses["haxe.ui.core.ComponentCommon"] = haxe_ui_core_ComponentCommon;
haxe_ui_core_ComponentCommon.__name__ = "haxe.ui.core.ComponentCommon";
haxe_ui_core_ComponentCommon.__super__ = haxe_ui_backend_ComponentSurface;
haxe_ui_core_ComponentCommon.prototype = $extend(haxe_ui_backend_ComponentSurface.prototype,{
	getTextDisplay: function() {
		return null;
	}
	,hasTextDisplay: function() {
		return false;
	}
	,getTextInput: function() {
		return null;
	}
	,hasTextInput: function() {
		return false;
	}
	,getImageDisplay: function() {
		return null;
	}
	,hasImageDisplay: function() {
		return false;
	}
	,__class__: haxe_ui_core_ComponentCommon
});
var haxe_ui_core_IClonable = function() { };
$hxClasses["haxe.ui.core.IClonable"] = haxe_ui_core_IClonable;
haxe_ui_core_IClonable.__name__ = "haxe.ui.core.IClonable";
haxe_ui_core_IClonable.__isInterface__ = true;
haxe_ui_core_IClonable.prototype = {
	cloneComponent: null
	,self: null
	,__class__: haxe_ui_core_IClonable
};
var haxe_ui_core_ComponentContainer = function() {
	this._id = null;
	this._layoutLocked = false;
	this._layout = null;
	this._ready = false;
	this.parentComponent = null;
	haxe_ui_core_ComponentCommon.call(this);
	this.behaviours = new haxe_ui_behaviours_Behaviours(js_Boot.__cast(this , haxe_ui_core_Component));
};
$hxClasses["haxe.ui.core.ComponentContainer"] = haxe_ui_core_ComponentContainer;
haxe_ui_core_ComponentContainer.__name__ = "haxe.ui.core.ComponentContainer";
haxe_ui_core_ComponentContainer.__interfaces__ = [haxe_ui_core_IClonable];
haxe_ui_core_ComponentContainer.__super__ = haxe_ui_core_ComponentCommon;
haxe_ui_core_ComponentContainer.prototype = $extend(haxe_ui_core_ComponentCommon.prototype,{
	behaviours: null
	,parentComponent: null
	,dispatch: function(event) {
	}
	,_ready: null
	,isReady: null
	,get_isReady: function() {
		return this._ready;
	}
	,_children: null
	,childComponents: null
	,get_childComponents: function() {
		if(this._children == null) {
			return [];
		}
		return this._children;
	}
	,registerBehaviours: function() {
		this.behaviours.register("disabled",haxe_ui_core_ComponentDisabledBehaviour);
		this.behaviours.register("tooltip",haxe_ui_core_ComponentToolTipBehaviour,null);
		this.behaviours.register("tooltipRenderer",haxe_ui_core_ComponentToolTipRendererBehaviour,null);
		this.behaviours.register("text",haxe_ui_core_ComponentTextBehaviour);
		this.behaviours.register("value",haxe_ui_core_ComponentValueBehaviour);
	}
	,addComponent: function(child) {
		return null;
	}
	,addComponentAt: function(child,index) {
		return null;
	}
	,removeComponent: function(child,dispose,invalidate) {
		if(invalidate == null) {
			invalidate = true;
		}
		if(dispose == null) {
			dispose = true;
		}
		return null;
	}
	,removeComponentAt: function(index,dispose,invalidate) {
		if(invalidate == null) {
			invalidate = true;
		}
		if(dispose == null) {
			dispose = true;
		}
		return null;
	}
	,moveComponentToBack: function() {
		if(this.parentComponent == null || this.parentComponent.get_numComponents() <= 1) {
			return;
		}
		this.parentComponent.setComponentIndex(this,0);
	}
	,moveComponentBackward: function() {
		if(this.parentComponent == null || this.parentComponent.get_numComponents() <= 1) {
			return;
		}
		var index = this.parentComponent.getComponentIndex(this);
		if(index == 0) {
			return;
		}
		this.parentComponent.setComponentIndex(this,index - 1);
	}
	,moveComponentToFront: function() {
		if(this.parentComponent == null || this.parentComponent.get_numComponents() <= 1) {
			return;
		}
		this.parentComponent.setComponentIndex(this,this.parentComponent.get_numComponents() - 1);
	}
	,moveComponentFrontward: function() {
		if(this.parentComponent == null || this.parentComponent.get_numComponents() <= 1) {
			return;
		}
		var index = this.parentComponent.getComponentIndex(this);
		if(index == this.parentComponent.get_numComponents() - 1) {
			return;
		}
		this.parentComponent.setComponentIndex(this,index + 1);
	}
	,bottomComponent: null
	,get_bottomComponent: function() {
		if(this._children == null || this._children.length == 0) {
			return null;
		}
		return this._children[0];
	}
	,topComponent: null
	,get_topComponent: function() {
		if(this._children == null || this._children.length == 0) {
			return null;
		}
		return this._children[this._children.length - 1];
	}
	,_layout: null
	,_layoutLocked: null
	,_style: null
	,_id: null
	,get_id: function() {
		return this._id;
	}
	,set_id: function(value) {
		if(this._id != value) {
			this._id = value;
		}
		return this._id;
	}
	,get_disabled: function() {
		return haxe_ui_util_Variant.toBool(this.behaviours.get("disabled"));
	}
	,set_disabled: function(value) {
		this.behaviours.set("disabled",haxe_ui_util_Variant.fromBool(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"disabled"));
		return value;
	}
	,get_tooltip: function() {
		return this.behaviours.getDynamic("tooltip");
	}
	,set_tooltip: function(value) {
		this.behaviours.setDynamic("tooltip",value);
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"tooltip"));
		return value;
	}
	,get_tooltipRenderer: function() {
		return haxe_ui_util_Variant.toComponent(this.behaviours.get("tooltipRenderer"));
	}
	,set_tooltipRenderer: function(value) {
		this.behaviours.set("tooltipRenderer",haxe_ui_util_Variant.fromComponent(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"tooltipRenderer"));
		return value;
	}
	,get_text: function() {
		return haxe_ui_util_Variant.toString(this.behaviours.get("text"));
	}
	,set_text: function(value) {
		var _g = Type.typeof(value);
		if(_g._hx_index == 6) {
			if(_g.c == String) {
				if(value != null && value.indexOf("{{") != -1 && value.indexOf("}}") != -1) {
					haxe_ui_locale_LocaleManager.get_instance().registerComponent(this,"text",null,value);
					return value;
				}
			}
		}
		this.behaviours.set("text",haxe_ui_util_Variant.fromString(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"text"));
		return value;
	}
	,get_value: function() {
		return this.behaviours.getDynamic("value");
	}
	,set_value: function(value) {
		this.behaviours.setDynamic("value",value);
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"value"));
		return value;
	}
	,cloneComponent: function() {
		var c = this.self();
		if(this.get_id() != null) {
			c.set_id(this.get_id());
		}
		c.set_disabled(this.get_disabled());
		if(this.get_tooltip() != null) {
			c.set_tooltip(this.get_tooltip());
		}
		if(this.get_tooltipRenderer() != null) {
			c.set_tooltipRenderer(this.get_tooltipRenderer());
		}
		if(this.get_text() != null) {
			c.set_text(this.get_text());
		}
		if(this.get_value() != null) {
			c.set_value(this.get_value());
		}
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_core_ComponentContainer();
	}
	,__class__: haxe_ui_core_ComponentContainer
	,__properties__: {set_value:"set_value",get_value:"get_value",set_text:"set_text",get_text:"get_text",set_tooltipRenderer:"set_tooltipRenderer",get_tooltipRenderer:"get_tooltipRenderer",set_tooltip:"set_tooltip",get_tooltip:"get_tooltip",set_disabled:"set_disabled",get_disabled:"get_disabled",set_id:"set_id",get_id:"get_id",get_topComponent:"get_topComponent",get_bottomComponent:"get_bottomComponent",get_childComponents:"get_childComponents",get_isReady:"get_isReady"}
});
var haxe_ui_core_ComponentEvents = function() {
	this._pausedEvents = null;
	this._interactivityDisabledCounter = 0;
	this._interactivityDisabled = false;
	this._internalEventsClass = null;
	this._internalEvents = null;
	haxe_ui_core_ComponentContainer.call(this);
};
$hxClasses["haxe.ui.core.ComponentEvents"] = haxe_ui_core_ComponentEvents;
haxe_ui_core_ComponentEvents.__name__ = "haxe.ui.core.ComponentEvents";
haxe_ui_core_ComponentEvents.__super__ = haxe_ui_core_ComponentContainer;
haxe_ui_core_ComponentEvents.prototype = $extend(haxe_ui_core_ComponentContainer.prototype,{
	_internalEvents: null
	,_internalEventsClass: null
	,registerInternalEvents: function(eventsClass,reregister) {
		if(reregister == null) {
			reregister = false;
		}
		if(this._internalEvents == null && eventsClass != null) {
			this._internalEvents = Type.createInstance(eventsClass,[this]);
			this._internalEvents.register();
		}
		if(reregister == true && this._internalEvents != null) {
			this._internalEvents.register();
		}
	}
	,unregisterInternalEvents: function() {
		if(this._internalEvents == null) {
			return;
		}
		this._internalEvents.unregister();
		this._internalEvents = null;
	}
	,__events: null
	,registerEvent: function(type,listener,priority) {
		if(priority == null) {
			priority = 0;
		}
		if((js_Boot.__cast(this , haxe_ui_core_Component)).classes.indexOf(":mobile") != -1 && (type == "mouseover" || type == "mouseout")) {
			return;
		}
		if(this.get_disabled() == true && this.isInteractiveEvent(type) == true) {
			if(this._disabledEvents == null) {
				this._disabledEvents = new haxe_ui_util_EventMap();
			}
			this._disabledEvents.add(type,listener,priority);
			return;
		}
		if(this.__events == null) {
			this.__events = new haxe_ui_util_EventMap();
		}
		if(this.__events.add(type,listener,priority) == true) {
			this.mapEvent(type,$bind(this,this._onMappedEvent));
		}
	}
	,hasEvent: function(type,listener) {
		if(this.__events == null) {
			return false;
		}
		return this.__events.contains(type,listener);
	}
	,unregisterEvent: function(type,listener) {
		if(this._disabledEvents != null && !this._interactivityDisabled) {
			this._disabledEvents.remove(type,listener);
		}
		if(this.__events != null) {
			if(this.__events.remove(type,listener) == true) {
				this.unmapEvent(type,$bind(this,this._onMappedEvent));
			}
		}
	}
	,dispatch: function(event) {
		if(event != null) {
			if(this.__events != null) {
				this.__events.invoke(event.type,event,js_Boot.__cast(this , haxe_ui_core_Component));
			}
			if(event.bubble == true && event.canceled == false && this.parentComponent != null) {
				this.parentComponent.dispatch(event);
			}
		}
	}
	,dispatchRecursively: function(event) {
		this.dispatch(event);
		var _g = 0;
		var _g1 = this._children == null ? [] : this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			child.dispatchRecursively(event);
		}
	}
	,dispatchRecursivelyWhen: function(event,condition) {
		if(condition(this) == true) {
			this.dispatch(event);
		}
		var _g = 0;
		var _g1 = this._children == null ? [] : this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(condition(child) == true) {
				child.dispatchRecursivelyWhen(event,condition);
			}
		}
	}
	,_onMappedEvent: function(event) {
		this.dispatch(event);
	}
	,_disabledEvents: null
	,isInteractiveEvent: function(type) {
		return haxe_ui_core_ComponentEvents.INTERACTIVE_EVENTS.indexOf(type) != -1;
	}
	,_interactivityDisabled: null
	,_interactivityDisabledCounter: null
	,disableInteractivity: function(disable,recursive,updateStyle,force) {
		if(force == null) {
			force = false;
		}
		if(updateStyle == null) {
			updateStyle = false;
		}
		if(recursive == null) {
			recursive = true;
		}
		if(force == true) {
			this._interactivityDisabledCounter = 0;
		}
		if(disable == true) {
			this._interactivityDisabledCounter++;
		} else {
			this._interactivityDisabledCounter--;
		}
		if(this._interactivityDisabledCounter > 0 && this._interactivityDisabled == false) {
			this._interactivityDisabled = true;
			if(updateStyle == true) {
				(js_Boot.__cast(this , haxe_ui_core_Component)).swapClass(":disabled",":hover");
			}
			if(this.__events != null) {
				var eventType = this.__events.keys();
				while(eventType.hasNext()) {
					var eventType1 = eventType.next();
					if(!this.isInteractiveEvent(eventType1)) {
						continue;
					}
					var listeners = this.__events.listeners(eventType1);
					if(listeners != null) {
						var listener = listeners.copy().iterator();
						while(listener.hasNext()) {
							var listener1 = listener.next();
							if(this._disabledEvents == null) {
								this._disabledEvents = new haxe_ui_util_EventMap();
							}
							this._disabledEvents.add(eventType1,haxe_ui_util_Listener.toFunc(listener1));
							this.unregisterEvent(eventType1,haxe_ui_util_Listener.toFunc(listener1));
						}
					}
				}
			}
			this.dispatch(new haxe_ui_events_UIEvent("disabled"));
		} else if(this._interactivityDisabledCounter < 1 && this._interactivityDisabled == true) {
			this._interactivityDisabled = false;
			if(updateStyle == true) {
				(js_Boot.__cast(this , haxe_ui_core_Component)).removeClass(":disabled");
			}
			if(this._disabledEvents != null) {
				var eventType = this._disabledEvents.keys();
				while(eventType.hasNext()) {
					var eventType1 = eventType.next();
					var listeners = this._disabledEvents.listeners(eventType1);
					if(listeners != null) {
						var listener = listeners.copy().iterator();
						while(listener.hasNext()) {
							var listener1 = listener.next();
							this.registerEvent(eventType1,haxe_ui_util_Listener.toFunc(listener1));
						}
					}
				}
				this._disabledEvents = null;
			}
			this.dispatch(new haxe_ui_events_UIEvent("enabled"));
		}
		if(recursive == true) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				child.disableInteractivity(disable,recursive,updateStyle);
			}
		}
	}
	,unregisterEvents: function() {
		if(this.__events != null) {
			var copy = [];
			var eventType = this.__events.keys();
			while(eventType.hasNext()) {
				var eventType1 = eventType.next();
				copy.push(eventType1);
			}
			var _g = 0;
			while(_g < copy.length) {
				var eventType = copy[_g];
				++_g;
				var listeners = this.__events.listeners(eventType);
				if(listeners != null) {
					var listener = listeners.iterator();
					while(listener.hasNext()) {
						var listener1 = listener.next();
						if(listener1 != null) {
							if(this.__events.remove(eventType,haxe_ui_util_Listener.toFunc(listener1)) == true) {
								this.unmapEvent(eventType,$bind(this,this._onMappedEvent));
							}
						}
					}
				}
			}
		}
	}
	,_pausedEvents: null
	,pauseEvent: function(type,recursive) {
		if(recursive == null) {
			recursive = false;
		}
		if(this.__events == null || this.__events.contains(type) == false) {
			return;
		}
		if(this._pausedEvents == null) {
			this._pausedEvents = new haxe_ds_StringMap();
		}
		var pausedList = this._pausedEvents.h[type];
		if(pausedList == null) {
			pausedList = [];
			this._pausedEvents.h[type] = pausedList;
		}
		var listeners = this.__events.listeners(type).copy();
		var l = listeners.iterator();
		while(l.hasNext()) {
			var l1 = l.next();
			pausedList.push(haxe_ui_util_Listener.toFunc(l1));
			this.unregisterEvent(type,haxe_ui_util_Listener.toFunc(l1));
		}
		if(recursive == true) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var c = _g1[_g];
				++_g;
				c.pauseEvent(type,recursive);
			}
		}
	}
	,resumeEvent: function(type,recursive) {
		if(recursive == null) {
			recursive = false;
		}
		var _gthis = this;
		if(this.__events == null) {
			return;
		}
		if(this._pausedEvents == null) {
			return;
		}
		if(Object.prototype.hasOwnProperty.call(this._pausedEvents.h,type) == false) {
			return;
		}
		haxe_ui_Toolkit.callLater(function() {
			var pausedList = _gthis._pausedEvents.h[type];
			var _g = 0;
			while(_g < pausedList.length) {
				var l = pausedList[_g];
				++_g;
				_gthis.registerEvent(type,l);
			}
			var _this = _gthis._pausedEvents;
			if(Object.prototype.hasOwnProperty.call(_this.h,type)) {
				delete(_this.h[type]);
			}
		});
		if(recursive == true) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var c = _g1[_g];
				++_g;
				c.resumeEvent(type,recursive);
			}
		}
	}
	,mapEvent: function(type,listener) {
	}
	,unmapEvent: function(type,listener) {
	}
	,registerBehaviours: function() {
		haxe_ui_core_ComponentContainer.prototype.registerBehaviours.call(this);
	}
	,cloneComponent: function() {
		var c = haxe_ui_core_ComponentContainer.prototype.cloneComponent.call(this);
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_core_ComponentEvents();
	}
	,__class__: haxe_ui_core_ComponentEvents
});
var haxe_ui_core_ComponentValidation = function() {
	this._depth = -1;
	this._invalidateCount = 0;
	this._isDisposed = false;
	this._isInitialized = false;
	this._isValidating = false;
	this._isAllInvalid = false;
	this._delayedInvalidationFlags = new haxe_ds_StringMap();
	this._invalidationFlags = new haxe_ds_StringMap();
	haxe_ui_core_ComponentEvents.call(this);
};
$hxClasses["haxe.ui.core.ComponentValidation"] = haxe_ui_core_ComponentValidation;
haxe_ui_core_ComponentValidation.__name__ = "haxe.ui.core.ComponentValidation";
haxe_ui_core_ComponentValidation.__super__ = haxe_ui_core_ComponentEvents;
haxe_ui_core_ComponentValidation.prototype = $extend(haxe_ui_core_ComponentEvents.prototype,{
	_invalidationFlags: null
	,_delayedInvalidationFlags: null
	,_isAllInvalid: null
	,_isValidating: null
	,_isInitialized: null
	,_isDisposed: null
	,_invalidateCount: null
	,_depth: null
	,get_depth: function() {
		return this._depth;
	}
	,set_depth: function(value) {
		if(this._depth == value) {
			return value;
		}
		this._depth = value;
		return value;
	}
	,isComponentInvalid: function(flag) {
		if(flag == null) {
			flag = "all";
		}
		if(this._isAllInvalid == true) {
			return true;
		}
		if(flag == "all") {
			var h = this._invalidationFlags.h;
			var value_h = h;
			var value_keys = Object.keys(h);
			var value_length = value_keys.length;
			var value_current = 0;
			while(value_current < value_length) {
				var value = value_h[value_keys[value_current++]];
				return true;
			}
			return false;
		}
		return Object.prototype.hasOwnProperty.call(this._invalidationFlags.h,flag);
	}
	,invalidateComponent: function(flag,recursive) {
		if(recursive == null) {
			recursive = false;
		}
		if(flag == null) {
			flag = "all";
		}
		if(this._ready == false) {
			return;
		}
		var isAlreadyInvalid = this.isComponentInvalid(flag);
		var isAlreadyDelayedInvalid = false;
		if(this._isValidating == true) {
			var h = this._delayedInvalidationFlags.h;
			var value_h = h;
			var value_keys = Object.keys(h);
			var value_length = value_keys.length;
			var value_current = 0;
			while(value_current < value_length) {
				var value = value_h[value_keys[value_current++]];
				isAlreadyDelayedInvalid = true;
				break;
			}
		}
		if(flag == "all") {
			if(this._isValidating == true) {
				this._delayedInvalidationFlags.h["all"] = true;
			} else {
				this._isAllInvalid = true;
			}
		} else if(this._isValidating == true) {
			this._delayedInvalidationFlags.h[flag] = true;
		} else if(flag != "all" && !Object.prototype.hasOwnProperty.call(this._invalidationFlags.h,flag)) {
			this._invalidationFlags.h[flag] = true;
		}
		if(this._isValidating == true) {
			if(isAlreadyDelayedInvalid == true) {
				return;
			}
			this._invalidateCount++;
			if(this._invalidateCount >= 10) {
				throw haxe_Exception.thrown("The validation queue returned too many times during validation. This may be an infinite loop. Try to avoid doing anything that calls invalidate() during validation.");
			}
			haxe_ui_validation_ValidationManager.get_instance().add(js_Boot.__cast(this , haxe_ui_core_Component));
			return;
		} else if(isAlreadyInvalid == true) {
			return;
		}
		this._invalidateCount = 0;
		haxe_ui_validation_ValidationManager.get_instance().add(js_Boot.__cast(this , haxe_ui_core_Component));
		if(recursive == true) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				child.invalidateComponent(flag,recursive);
			}
		}
	}
	,invalidateComponentData: function(recursive) {
		if(recursive == null) {
			recursive = false;
		}
		this.invalidateComponent("data",recursive);
	}
	,invalidateComponentLayout: function(recursive) {
		if(recursive == null) {
			recursive = false;
		}
		if(this._layout == null || this._layoutLocked == true) {
			return;
		}
		this.invalidateComponent("layout",recursive);
	}
	,invalidateComponentPosition: function(recursive) {
		if(recursive == null) {
			recursive = false;
		}
		this.invalidateComponent("position",recursive);
	}
	,invalidateComponentDisplay: function(recursive) {
		if(recursive == null) {
			recursive = false;
		}
		this.invalidateComponent("display",recursive);
	}
	,invalidateComponentStyle: function(force,recursive) {
		if(recursive == null) {
			recursive = false;
		}
		if(force == null) {
			force = false;
		}
		this.invalidateComponent("style",recursive);
		if(force == true) {
			this._style = null;
		}
	}
	,validateComponent: function(nextFrame) {
		if(nextFrame == null) {
			nextFrame = true;
		}
		if(this._ready == false || this._isDisposed == true || this._isValidating == true || this.isComponentInvalid() == false) {
			return;
		}
		var isInitialized = this._isInitialized;
		if(isInitialized == false) {
			this.initializeComponent();
		}
		this._isValidating = true;
		this.validateComponentInternal(nextFrame);
		this.validateInitialSize(isInitialized);
		this._invalidationFlags.h = Object.create(null);
		this._isAllInvalid = false;
		var h = this._delayedInvalidationFlags.h;
		var flag_h = h;
		var flag_keys = Object.keys(h);
		var flag_length = flag_keys.length;
		var flag_current = 0;
		while(flag_current < flag_length) {
			var flag = flag_keys[flag_current++];
			if(flag == "all") {
				this._isAllInvalid = true;
			} else {
				this._invalidationFlags.h[flag] = true;
			}
		}
		this._delayedInvalidationFlags.h = Object.create(null);
		this._isValidating = false;
	}
	,validateNow: function() {
		var _g = 0;
		var _g1 = this._children == null ? [] : this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			child.validateNow();
		}
		this.invalidateComponent();
		this.syncComponentValidation(false);
	}
	,syncComponentValidation: function(nextFrame) {
		if(nextFrame == null) {
			nextFrame = true;
		}
		var count = 0;
		while(this.isComponentInvalid()) {
			this.validateComponent(nextFrame);
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				child.syncComponentValidation(nextFrame);
			}
			if(++count >= 10) {
				if(this._isDisposed) {
					var c = js_Boot.getClass(this);
					haxe_Log.trace("There was a problem validating this component as it has already been destroyed (" + c.__name__ + "#" + this.get_id() + ")",{ fileName : "haxe/ui/core/ComponentValidation.hx", lineNumber : 232, className : "haxe.ui.core.ComponentValidation", methodName : "syncComponentValidation"});
					var c1 = js_Boot.getClass(this);
					throw haxe_Exception.thrown("There was a problem validating this component as it has already been destroyed (" + c1.__name__ + "#" + this.get_id() + ")");
				} else {
					var c2 = js_Boot.getClass(this);
					haxe_Log.trace("The syncValidation returned too many times during validation. This may be an infinite loop. Try to avoid doing anything that calls invalidate() during validation (" + c2.__name__ + "#" + this.get_id() + ").",{ fileName : "haxe/ui/core/ComponentValidation.hx", lineNumber : 237, className : "haxe.ui.core.ComponentValidation", methodName : "syncComponentValidation"});
					var c3 = js_Boot.getClass(this);
					throw haxe_Exception.thrown("The syncValidation returned too many times during validation. This may be an infinite loop. Try to avoid doing anything that calls invalidate() during validation (" + c3.__name__ + "#" + this.get_id() + ").");
				}
			}
		}
	}
	,validateComponentInternal: function(nextFrame) {
		if(nextFrame == null) {
			nextFrame = true;
		}
		var dataInvalid = this.isComponentInvalid("data");
		var styleInvalid = this.isComponentInvalid("style");
		var textDisplayInvalid = this.isComponentInvalid("textDisplay") && this.hasTextDisplay();
		var textInputInvalid = this.isComponentInvalid("textInput") && this.hasTextInput();
		var imageDisplayInvalid = this.isComponentInvalid("imageDisplay") && this.hasImageDisplay();
		var positionInvalid = this.isComponentInvalid("position");
		var displayInvalid = this.isComponentInvalid("display");
		var layoutInvalid = this.isComponentInvalid("layout") && this._layoutLocked == false;
		if(dataInvalid) {
			this.validateComponentData();
		}
		if(styleInvalid) {
			this.validateComponentStyle();
		}
		if(textDisplayInvalid) {
			this.getTextDisplay().validateComponent();
		}
		if(textInputInvalid) {
			this.getTextInput().validateComponent();
		}
		if(imageDisplayInvalid) {
			this.getImageDisplay().validateComponent();
		}
		if(positionInvalid) {
			this.validateComponentPosition();
		}
		if(layoutInvalid) {
			if(this.validateComponentLayout()) {
				displayInvalid = true;
			}
		}
		if(displayInvalid || styleInvalid) {
			haxe_ui_validation_ValidationManager.get_instance().addDisplay(js_Boot.__cast(this , haxe_ui_core_Component),nextFrame);
		}
	}
	,initializeComponent: function() {
	}
	,validateInitialSize: function(isInitialized) {
	}
	,validateComponentData: function() {
		this.behaviours.validateData();
	}
	,validateComponentLayout: function() {
		return false;
	}
	,validateComponentStyle: function() {
	}
	,validateComponentPosition: function() {
	}
	,registerBehaviours: function() {
		haxe_ui_core_ComponentEvents.prototype.registerBehaviours.call(this);
	}
	,cloneComponent: function() {
		var c = haxe_ui_core_ComponentEvents.prototype.cloneComponent.call(this);
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_core_ComponentValidation();
	}
	,__class__: haxe_ui_core_ComponentValidation
	,__properties__: $extend(haxe_ui_core_ComponentEvents.prototype.__properties__,{set_depth:"set_depth",get_depth:"get_depth"})
});
var haxe_ui_core_ComponentLayout = function() {
	haxe_ui_core_ComponentValidation.call(this);
};
$hxClasses["haxe.ui.core.ComponentLayout"] = haxe_ui_core_ComponentLayout;
haxe_ui_core_ComponentLayout.__name__ = "haxe.ui.core.ComponentLayout";
haxe_ui_core_ComponentLayout.__super__ = haxe_ui_core_ComponentValidation;
haxe_ui_core_ComponentLayout.prototype = $extend(haxe_ui_core_ComponentValidation.prototype,{
	get_style: function() {
		return this._style;
	}
	,set_style: function(value) {
		this._style = value;
		return value;
	}
	,registerBehaviours: function() {
		haxe_ui_core_ComponentValidation.prototype.registerBehaviours.call(this);
	}
	,cloneComponent: function() {
		var c = haxe_ui_core_ComponentValidation.prototype.cloneComponent.call(this);
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_core_ComponentLayout();
	}
	,__class__: haxe_ui_core_ComponentLayout
	,__properties__: $extend(haxe_ui_core_ComponentValidation.prototype.__properties__,{set_style:"set_style",get_style:"get_style"})
});
var haxe_ui_core_ComponentBounds = function() {
	this._componentClipRect = null;
	this._top = 0;
	this._left = 0;
	this._hasScreen = null;
	this._cachedPercentHeight = null;
	this._cachedPercentWidth = null;
	haxe_ui_core_ComponentLayout.call(this);
};
$hxClasses["haxe.ui.core.ComponentBounds"] = haxe_ui_core_ComponentBounds;
haxe_ui_core_ComponentBounds.__name__ = "haxe.ui.core.ComponentBounds";
haxe_ui_core_ComponentBounds.__super__ = haxe_ui_core_ComponentLayout;
haxe_ui_core_ComponentBounds.prototype = $extend(haxe_ui_core_ComponentLayout.prototype,{
	autoWidth: null
	,get_autoWidth: function() {
		if(this._percentWidth != null || this._width != null || this.get_style() == null) {
			return false;
		}
		if(this.get_style().autoWidth == null) {
			return false;
		}
		return this.get_style().autoWidth;
	}
	,autoHeight: null
	,get_autoHeight: function() {
		if(this._percentHeight != null || this._height != null || this.get_style() == null) {
			return false;
		}
		if(this.get_style().autoHeight == null) {
			return false;
		}
		return this.get_style().autoHeight;
	}
	,resizeComponent: function(w,h) {
		var invalidate = false;
		if(w != null && this._componentWidth != w) {
			this._componentWidth = w;
			invalidate = true;
		}
		if(h != null && this._componentHeight != h) {
			this._componentHeight = h;
			invalidate = true;
		}
		if(invalidate == true && this.isComponentInvalid("layout") == false) {
			if(!(this._layout == null || this._layoutLocked == true)) {
				this.invalidateComponent("layout",false);
			}
		}
	}
	,actualComponentWidth: null
	,get_actualComponentWidth: function() {
		return this.get_componentWidth() * haxe_ui_Toolkit.get_scaleX();
	}
	,actualComponentHeight: null
	,get_actualComponentHeight: function() {
		return this.get_componentHeight() * haxe_ui_Toolkit.get_scaleY();
	}
	,_componentWidth: null
	,get_componentWidth: function() {
		if(this._componentWidth == null) {
			return 0;
		}
		return this._componentWidth;
	}
	,set_componentWidth: function(value) {
		this.resizeComponent(value,null);
		return value;
	}
	,_componentHeight: null
	,get_componentHeight: function() {
		if(this._componentHeight == null) {
			return 0;
		}
		return this._componentHeight;
	}
	,set_componentHeight: function(value) {
		this.resizeComponent(null,value);
		return value;
	}
	,_percentWidth: null
	,get_percentWidth: function() {
		return this._percentWidth;
	}
	,set_percentWidth: function(value) {
		if(this._percentWidth == value) {
			return value;
		}
		this._percentWidth = value;
		if(this.parentComponent != null) {
			var _this = this.parentComponent;
			if(!(_this._layout == null || _this._layoutLocked == true)) {
				_this.invalidateComponent("layout",false);
			}
		} else {
			haxe_ui_core_Screen.get_instance().resizeRootComponents();
		}
		return value;
	}
	,_percentHeight: null
	,get_percentHeight: function() {
		return this._percentHeight;
	}
	,set_percentHeight: function(value) {
		if(this._percentHeight == value) {
			return value;
		}
		this._percentHeight = value;
		if(this.parentComponent != null) {
			var _this = this.parentComponent;
			if(!(_this._layout == null || _this._layoutLocked == true)) {
				_this.invalidateComponent("layout",false);
			}
		} else {
			haxe_ui_core_Screen.get_instance().resizeRootComponents();
		}
		return value;
	}
	,_cachedPercentWidth: null
	,_cachedPercentHeight: null
	,cachePercentSizes: function(clearExisting) {
		if(clearExisting == null) {
			clearExisting = true;
		}
		if(this._percentWidth != null) {
			this._cachedPercentWidth = this._percentWidth;
			if(clearExisting == true) {
				this._percentWidth = null;
			}
		}
		if(this._percentHeight != null) {
			this._cachedPercentHeight = this._percentHeight;
			if(clearExisting == true) {
				this._percentHeight = null;
			}
		}
	}
	,restorePercentSizes: function() {
		if(this._cachedPercentWidth != null) {
			this.set_percentWidth(this._cachedPercentWidth);
		}
		if(this._cachedPercentHeight != null) {
			this.set_percentHeight(this._cachedPercentHeight);
		}
	}
	,_width: null
	,set_width: function(value) {
		if(this._width == value) {
			return value;
		}
		this._width = value;
		this.set_componentWidth(value);
		return value;
	}
	,get_width: function() {
		var f = this.get_componentWidth();
		return f;
	}
	,_height: null
	,set_height: function(value) {
		if(this._height == value) {
			return value;
		}
		this._height = value;
		this.set_componentHeight(value);
		return value;
	}
	,get_height: function() {
		var f = this.get_componentHeight();
		return f;
	}
	,_actualWidth: null
	,_actualHeight: null
	,_hasScreen: null
	,hasScreen: null
	,get_hasScreen: function() {
		var p = this;
		while(p != null) {
			if(p._hasScreen == false) {
				return false;
			}
			p = p.parentComponent;
		}
		return true;
	}
	,hitTest: function(left,top,allowZeroSized) {
		if(allowZeroSized == null) {
			allowZeroSized = false;
		}
		if(this.get_hasScreen() == false) {
			return false;
		}
		left *= haxe_ui_Toolkit.get_scale();
		top *= haxe_ui_Toolkit.get_scale();
		var b = false;
		var sx = this.get_screenLeft();
		var sy = this.get_screenTop();
		var cx = 0;
		if(this.get_componentWidth() != null) {
			cx = this.get_actualComponentWidth();
		}
		var cy = 0;
		if(this.get_componentHeight() != null) {
			cy = this.get_actualComponentHeight();
		}
		if(allowZeroSized == true) {
			if(this.get_width() <= 0 || this.get_height() <= 0) {
				return true;
			}
		}
		if(left >= sx && left < sx + cx && top >= sy && top < sy + cy) {
			b = true;
		}
		return b;
	}
	,autoSize: function() {
		if(this._ready == false || this._layout == null) {
			return false;
		}
		return this._layout.autoSize();
	}
	,moveComponent: function(left,top) {
		var invalidate = false;
		if(left != null && this._left != left) {
			this._left = left;
			invalidate = true;
		}
		if(top != null && this._top != top) {
			this._top = top;
			invalidate = true;
		}
		if(invalidate == true && this.isComponentInvalid("position") == false) {
			this.invalidateComponent("position",false);
		}
	}
	,_left: null
	,get_left: function() {
		return this._left;
	}
	,set_left: function(value) {
		this.moveComponent(value,null);
		return value;
	}
	,_top: null
	,get_top: function() {
		return this._top;
	}
	,set_top: function(value) {
		this.moveComponent(null,value);
		return value;
	}
	,screenLeft: null
	,get_screenLeft: function() {
		var c = this;
		var xpos = 0;
		while(c != null) {
			var l = c.get_left();
			if(c.parentComponent != null) {
				l *= haxe_ui_Toolkit.get_scale();
			}
			xpos += l;
			if(c.get_componentClipRect() != null) {
				xpos -= c.get_componentClipRect().left * haxe_ui_Toolkit.get_scaleX();
			}
			c = c.parentComponent;
		}
		return xpos;
	}
	,screenTop: null
	,get_screenTop: function() {
		var c = this;
		var ypos = 0;
		while(c != null) {
			var t = c.get_top();
			if(c.parentComponent != null) {
				t *= haxe_ui_Toolkit.get_scale();
			}
			ypos += t;
			if(c.get_componentClipRect() != null) {
				ypos -= c.get_componentClipRect().top * haxe_ui_Toolkit.get_scaleY();
			}
			c = c.parentComponent;
		}
		return ypos;
	}
	,_componentClipRect: null
	,get_componentClipRect: function() {
		if(this.get_style() != null && this.get_style().clip != null && this.get_style().clip == true) {
			return new haxe_ui_geom_Rectangle(0,0,this.get_componentWidth(),this.get_componentHeight());
		}
		return this._componentClipRect;
	}
	,set_componentClipRect: function(value) {
		this._componentClipRect = value;
		this.invalidateComponent("display",false);
		return value;
	}
	,isComponentClipped: null
	,get_isComponentClipped: function() {
		return this.get_componentClipRect() != null;
	}
	,isComponentOffscreen: null
	,get_isComponentOffscreen: function() {
		if(this.get_width() == 0 && this.get_height() == 0) {
			return false;
		}
		var x = this.get_screenLeft();
		var y = this.get_screenTop();
		var w = this.get_width();
		var h = this.get_height();
		var thisRect = new haxe_ui_geom_Rectangle(x,y,w,h);
		var screenRect = new haxe_ui_geom_Rectangle(0,0,haxe_ui_core_Screen.get_instance().get_width(),haxe_ui_core_Screen.get_instance().get_height());
		return !screenRect.intersects(thisRect);
	}
	,registerBehaviours: function() {
		haxe_ui_core_ComponentLayout.prototype.registerBehaviours.call(this);
	}
	,cloneComponent: function() {
		var c = haxe_ui_core_ComponentLayout.prototype.cloneComponent.call(this);
		if(this.get_componentWidth() != null) {
			c.set_componentWidth(this.get_componentWidth());
		}
		if(this.get_componentHeight() != null) {
			c.set_componentHeight(this.get_componentHeight());
		}
		if(this.get_percentWidth() != null) {
			c.set_percentWidth(this.get_percentWidth());
		}
		if(this.get_percentHeight() != null) {
			c.set_percentHeight(this.get_percentHeight());
		}
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_core_ComponentBounds();
	}
	,__class__: haxe_ui_core_ComponentBounds
	,__properties__: $extend(haxe_ui_core_ComponentLayout.prototype.__properties__,{get_isComponentOffscreen:"get_isComponentOffscreen",get_isComponentClipped:"get_isComponentClipped",set_componentClipRect:"set_componentClipRect",get_componentClipRect:"get_componentClipRect",get_screenTop:"get_screenTop",get_screenLeft:"get_screenLeft",set_top:"set_top",get_top:"get_top",set_left:"set_left",get_left:"get_left",get_hasScreen:"get_hasScreen",set_height:"set_height",get_height:"get_height",set_width:"set_width",get_width:"get_width",set_percentHeight:"set_percentHeight",get_percentHeight:"get_percentHeight",set_percentWidth:"set_percentWidth",get_percentWidth:"get_percentWidth",set_componentHeight:"set_componentHeight",get_componentHeight:"get_componentHeight",set_componentWidth:"set_componentWidth",get_componentWidth:"get_componentWidth",get_actualComponentHeight:"get_actualComponentHeight",get_actualComponentWidth:"get_actualComponentWidth",get_autoHeight:"get_autoHeight",get_autoWidth:"get_autoWidth"})
});
var haxe_ui_backend_ComponentBase = function() {
	this._nativeClassName = null;
	this._className = null;
	haxe_ui_core_ComponentBounds.call(this);
};
$hxClasses["haxe.ui.backend.ComponentBase"] = haxe_ui_backend_ComponentBase;
haxe_ui_backend_ComponentBase.__name__ = "haxe.ui.backend.ComponentBase";
haxe_ui_backend_ComponentBase.__super__ = haxe_ui_core_ComponentBounds;
haxe_ui_backend_ComponentBase.prototype = $extend(haxe_ui_core_ComponentBounds.prototype,{
	handleCreate: function(native) {
	}
	,handlePosition: function(left,top,style) {
	}
	,handleSize: function(width,height,style) {
	}
	,handleReady: function() {
	}
	,handleClipRect: function(value) {
	}
	,handleVisibility: function(show) {
	}
	,getComponentOffset: function() {
		return new haxe_ui_geom_Point(0,0);
	}
	,isNativeScroller: null
	,get_isNativeScroller: function() {
		return false;
	}
	,isScroller: null
	,get_isScroller: function() {
		return false;
	}
	,handleFrameworkProperty: function(id,value) {
	}
	,handleSetComponentIndex: function(child,index) {
	}
	,handleAddComponent: function(child) {
		return child;
	}
	,handleAddComponentAt: function(child,index) {
		return child;
	}
	,handleRemoveComponent: function(child,dispose) {
		if(dispose == null) {
			dispose = true;
		}
		return child;
	}
	,handleRemoveComponentAt: function(index,dispose) {
		if(dispose == null) {
			dispose = true;
		}
		return null;
	}
	,applyStyle: function(style) {
	}
	,mapEvent: function(type,listener) {
	}
	,unmapEvent: function(type,listener) {
	}
	,_textDisplay: null
	,createTextDisplay: function(text) {
		if(this._textDisplay == null) {
			this._textDisplay = new haxe_ui_core_TextDisplay();
			this._textDisplay.parentComponent = js_Boot.__cast(this , haxe_ui_core_Component);
		}
		if(text != null) {
			this._textDisplay.set_text(text);
		}
		return this._textDisplay;
	}
	,getTextDisplay: function() {
		return this.createTextDisplay();
	}
	,hasTextDisplay: function() {
		return this._textDisplay != null;
	}
	,_textInput: null
	,createTextInput: function(text) {
		if(this._textInput == null) {
			this._textInput = new haxe_ui_core_TextInput();
			this._textInput.parentComponent = js_Boot.__cast(this , haxe_ui_core_Component);
		}
		if(text != null) {
			this._textInput.set_text(text);
		}
		return this._textInput;
	}
	,getTextInput: function() {
		return this.createTextInput();
	}
	,hasTextInput: function() {
		return this._textInput != null;
	}
	,_imageDisplay: null
	,createImageDisplay: function() {
		if(this._imageDisplay == null) {
			this._imageDisplay = new haxe_ui_core_ImageDisplay();
			this._imageDisplay.parentComponent = js_Boot.__cast(this , haxe_ui_core_Component);
		}
		return this._imageDisplay;
	}
	,getImageDisplay: function() {
		return this.createImageDisplay();
	}
	,hasImageDisplay: function() {
		return this._imageDisplay != null;
	}
	,removeImageDisplay: function() {
		if(this._imageDisplay != null) {
			this._imageDisplay.dispose();
			this._imageDisplay = null;
		}
	}
	,handlePreReposition: function() {
	}
	,handlePostReposition: function() {
	}
	,getClassProperty: function(name) {
		var v = null;
		if(this._classProperties != null) {
			v = this._classProperties.h[name];
		}
		if(v == null) {
			var c = js_Boot.getClass(this);
			var c1 = c.__name__.toLowerCase() + "." + name;
			v = haxe_ui_Toolkit.properties.h[c1];
		}
		return v;
	}
	,_classProperties: null
	,setClassProperty: function(name,value) {
		if(this._classProperties == null) {
			this._classProperties = new haxe_ds_StringMap();
		}
		this._classProperties.h[name] = value;
	}
	,_hasNativeEntry: null
	,hasNativeEntry: null
	,get_hasNativeEntry: function() {
		if(this._hasNativeEntry == null) {
			this._hasNativeEntry = this.getNativeConfigProperty(".@id") != null;
		}
		return this._hasNativeEntry;
	}
	,getNativeConfigProperty: function(query,defaultValue) {
		query = "component[id=" + this.get_nativeClassName() + "]" + query;
		return haxe_ui_Toolkit.nativeConfig.query(query,defaultValue,this);
	}
	,getNativeConfigPropertyBool: function(query,defaultValue) {
		if(defaultValue == null) {
			defaultValue = false;
		}
		query = "component[id=" + this.get_nativeClassName() + "]" + query;
		return haxe_ui_Toolkit.nativeConfig.queryBool(query,defaultValue,this);
	}
	,getNativeConfigProperties: function(query) {
		if(query == null) {
			query = "";
		}
		query = "component[id=" + this.get_nativeClassName() + "]" + query;
		return haxe_ui_Toolkit.nativeConfig.queryValues(query,this);
	}
	,_className: null
	,className: null
	,get_className: function() {
		if(this._className != null) {
			return this._className;
		}
		var c = js_Boot.getClass(this);
		this._className = c.__name__;
		return this._className;
	}
	,_nativeClassName: null
	,nativeClassName: null
	,get_nativeClassName: function() {
		if(this._nativeClassName != null) {
			return this._nativeClassName;
		}
		var r = js_Boot.getClass(this);
		while(r != null) {
			var c = r.__name__;
			var t = haxe_ui_Toolkit.nativeConfig.query("component[id=" + c + "].@class",null,this);
			if(t != null) {
				this._nativeClassName = c;
				break;
			}
			r = r.__super__;
			if(r == haxe_ui_core_Component) {
				break;
			}
		}
		if(this._nativeClassName == null) {
			this._nativeClassName = this.get_className();
		}
		return this._nativeClassName;
	}
	,registerBehaviours: function() {
		haxe_ui_core_ComponentBounds.prototype.registerBehaviours.call(this);
	}
	,cloneComponent: function() {
		var c = haxe_ui_core_ComponentBounds.prototype.cloneComponent.call(this);
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_backend_ComponentBase();
	}
	,__class__: haxe_ui_backend_ComponentBase
	,__properties__: $extend(haxe_ui_core_ComponentBounds.prototype.__properties__,{get_nativeClassName:"get_nativeClassName",get_className:"get_className",get_hasNativeEntry:"get_hasNativeEntry",get_isScroller:"get_isScroller",get_isNativeScroller:"get_isNativeScroller"})
});
var haxe_ui_backend_ComponentImpl = function() {
	this._over = false;
	this._canvas = null;
	haxe_ui_backend_ComponentBase.call(this);
	this._eventMap = new haxe_ds_StringMap();
	if(haxe_ui_backend_ComponentImpl._mutationObserver == null) {
		haxe_ui_backend_ComponentImpl._mutationObserver = new MutationObserver(haxe_ui_backend_ComponentImpl.onMutationEvent);
		haxe_ui_backend_ComponentImpl._mutationObserver.observe(haxe_ui_core_Screen.get_instance().get_container(),{ childList : true});
	}
	if(window.document.styleSheets.length == 0) {
		var style = window.document.createElement("style");
		style.appendChild(window.document.createTextNode(""));
		window.document.head.appendChild(style);
	}
	if(haxe_ui_backend_ComponentImpl._stylesAdded == false) {
		haxe_ui_backend_ComponentImpl._stylesAdded = true;
		var sheet = haxe_ui_backend_html5_util_StyleSheetHelper.getValidStyleSheet();
		sheet.insertRule("#haxeui-container .haxeui-component, .haxeui-component:focus {\r\n                position: absolute;\r\n                box-sizing: border-box;\r\n                -webkit-touch-callout: none;\r\n                -webkit-user-select: none;\r\n                -khtml-user-select: none;\r\n                -moz-user-select: none;\r\n                -ms-user-select: none;\r\n                user-select: none;\r\n                -webkit-tap-highlight-color: transparent;\r\n                webkit-user-select;\r\n                outline: none !important;\r\n            }",sheet.cssRules.length);
		haxe_ui_core_Screen.get_instance().get_container().classList.add("haxeui-theme-" + haxe_ui_Toolkit.get_theme());
	}
};
$hxClasses["haxe.ui.backend.ComponentImpl"] = haxe_ui_backend_ComponentImpl;
haxe_ui_backend_ComponentImpl.__name__ = "haxe.ui.backend.ComponentImpl";
haxe_ui_backend_ComponentImpl.onMutationEvent = function(records,o) {
	var done = false;
	var _g = 0;
	while(_g < records.length) {
		var record = records[_g];
		++_g;
		var _g1 = 0;
		var _g2 = record.addedNodes.length;
		while(_g1 < _g2) {
			var i = _g1++;
			var node = record.addedNodes.item(i);
			var c = haxe_ui_backend_ComponentImpl.elementToComponent.h[node.__id__];
			if(c != null) {
				c.recursiveReady();
			}
		}
		if(done == true) {
			break;
		}
	}
};
haxe_ui_backend_ComponentImpl.__super__ = haxe_ui_backend_ComponentBase;
haxe_ui_backend_ComponentImpl.prototype = $extend(haxe_ui_backend_ComponentBase.prototype,{
	element: null
	,_eventMap: null
	,get_isNativeScroller: function() {
		return false;
	}
	,recursiveReady: function() {
		haxe_ui_backend_ComponentImpl.elementToComponent.remove(this.element);
		var component = js_Boot.__cast(this , haxe_ui_core_Component);
		if(!(component._layout == null || component._layoutLocked == true)) {
			component.invalidateComponent("layout",false);
		}
		component.ready();
		var _g = 0;
		var _g1 = component._children == null ? [] : component._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			child.recursiveReady();
		}
	}
	,handleCreate: function(native) {
		if(this.get_isScroller()) {
			if(this.element == null) {
				this.element = window.document.createElement("div");
			}
			this.element.scrollTop = 0;
			this.element.scrollLeft = 0;
			this.element.classList.add("haxeui-component");
			haxe_ui_backend_ComponentImpl.elementToComponent.set(this.element,js_Boot.__cast(this , haxe_ui_core_Component));
			return;
		}
		var newElement = window.document.createElement("div");
		newElement.classList.add("haxeui-component");
		if(((this) instanceof haxe_ui_components_Image)) {
			newElement.style.boxSizing = "initial";
		}
		if(this.element != null) {
			var p = this.element.parentElement;
			if(p != null) {
				haxe_ui_backend_ComponentImpl.elementToComponent.remove(this.element);
				p.replaceChild(newElement,this.element);
			}
		}
		this.element = newElement;
		haxe_ui_backend_ComponentImpl.elementToComponent.set(this.element,js_Boot.__cast(this , haxe_ui_core_Component));
		this.remapEvents();
	}
	,remapEvents: function() {
		if(this._eventMap == null) {
			return;
		}
		var copy_h = Object.create(null);
		var h = this._eventMap.h;
		var k_h = h;
		var k_keys = Object.keys(h);
		var k_length = k_keys.length;
		var k_current = 0;
		while(k_current < k_length) {
			var k = k_keys[k_current++];
			var fn = this._eventMap.h[k];
			copy_h[k] = fn;
			this.unmapEvent(k,fn);
		}
		this._eventMap = new haxe_ds_StringMap();
		var h = copy_h;
		var k_h = h;
		var k_keys = Object.keys(h);
		var k_length = k_keys.length;
		var k_current = 0;
		while(k_current < k_length) {
			var k = k_keys[k_current++];
			this.mapEvent(k,copy_h[k]);
		}
	}
	,handlePosition: function(left,top,style) {
		if(this.element == null) {
			return;
		}
		if(left != null) {
			this.element.style.left = "" + left + "px";
		}
		if(top != null) {
			this.element.style.top = "" + top + "px";
		}
	}
	,handleSize: function(width,height,style) {
		if(width == null || height == null || width <= 0 || height <= 0) {
			return;
		}
		if(this.element == null) {
			return;
		}
		var c = js_Boot.__cast(this , haxe_ui_core_Component);
		var css = this.element.style;
		haxe_ui_backend_html5_StyleHelper.apply(this,width,height,style);
		var parent = c.parentComponent;
		if(parent != null && parent.element.style.borderWidth != null) {
			css.marginTop = "-" + parent.element.style.borderWidth;
			css.marginLeft = "-" + parent.element.style.borderWidth;
		} else if(parent != null) {
			css.marginTop = "";
			css.marginLeft = "";
		}
		var _g = 0;
		var _this = js_Boot.__cast(this , haxe_ui_core_Component);
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(style.borderLeftSize != null && style.borderLeftSize > 0) {
				child.element.style.marginLeft = "-" + style.borderLeftSize + "px";
			} else {
				child.element.style.marginLeft = "";
			}
			if(style.borderTopSize != null && style.borderTopSize > 0) {
				child.element.style.marginTop = "-" + style.borderTopSize + "px";
			} else {
				child.element.style.marginTop = "";
			}
		}
	}
	,handleReady: function() {
		if((js_Boot.__cast(this , haxe_ui_core_Component)).get_id() != null) {
			this.element.id = (js_Boot.__cast(this , haxe_ui_core_Component)).get_id();
		}
	}
	,handleFrameworkProperty: function(id,value) {
		if(id == "allowMouseInteraction") {
			if(value == true && this.element.style.getPropertyValue("pointer-events") != null) {
				this.element.style.removeProperty("pointer-events");
			} else if(this.element.style.getPropertyValue("pointer-events") != "none") {
				this.element.style.setProperty("pointer-events","none");
				this.setCursor(null);
			}
		}
	}
	,handleClipRect: function(value) {
		var c = js_Boot.__cast(this , haxe_ui_core_Component);
		var parent = c.parentComponent;
		value.toInts();
		if(value != null && parent != null) {
			var tmp = "rect(" + ("" + value.top + "px") + "," + ("" + (value.get_right() - 1) + "px") + "," + ("" + value.get_bottom() + "px") + ",";
			this.element.style.clip = tmp + ("" + value.left + "px") + ")";
			var tmp = "" + (c.get_left() - value.left | 0) + "px";
			this.element.style.left = "" + tmp;
			var tmp = "" + (c.get_top() - value.top | 0) + "px";
			this.element.style.top = "" + tmp;
		} else {
			this.element.style.removeProperty("clip");
		}
	}
	,handleVisibility: function(show) {
		this.element.style.display = show == true ? "" : "none";
	}
	,createTextDisplay: function(text) {
		if(this._textDisplay == null) {
			haxe_ui_backend_ComponentBase.prototype.createTextDisplay.call(this,text);
			this.element.appendChild(this._textDisplay.element);
		}
		return this._textDisplay;
	}
	,createTextInput: function(text) {
		if(this._textInput == null) {
			haxe_ui_backend_ComponentBase.prototype.createTextInput.call(this,text);
			this.element.appendChild(this._textInput.element);
		}
		return this._textInput;
	}
	,createImageDisplay: function() {
		if(this._imageDisplay == null) {
			haxe_ui_backend_ComponentBase.prototype.createImageDisplay.call(this);
			this.element.appendChild(this._imageDisplay.element);
		}
		return this._imageDisplay;
	}
	,handleSetComponentIndex: function(child,index) {
		if(index == (this._children == null ? [] : this._children).length - 1) {
			this.element.appendChild(child.element);
		} else if(index == (this._children == null ? [] : this._children).indexOf(child) - 1) {
			var before = (this._children == null ? [] : this._children)[index];
			haxe_ui_backend_html5_HtmlUtils.insertBefore(before.element,child.element);
		} else {
			var before = (this._children == null ? [] : this._children)[index + 1];
			haxe_ui_backend_html5_HtmlUtils.insertBefore(before.element,child.element);
		}
	}
	,handleAddComponent: function(child) {
		this.element.appendChild(child.element);
		return child;
	}
	,handleAddComponentAt: function(child,index) {
		this.handleAddComponent(child);
		this.handleSetComponentIndex(child,index);
		return child;
	}
	,handleRemoveComponent: function(child,dispose) {
		if(dispose == null) {
			dispose = true;
		}
		haxe_ui_backend_html5_HtmlUtils.removeElement(child.element);
		return child;
	}
	,handleRemoveComponentAt: function(index,dispose) {
		if(dispose == null) {
			dispose = true;
		}
		var child = (js_Boot.__cast(this , haxe_ui_core_Component))._children[index];
		haxe_ui_backend_html5_HtmlUtils.removeElement(child.element);
		return child;
	}
	,applyStyle: function(style) {
		if(this.element == null) {
			return;
		}
		this.setCursor(style.cursor);
		if(style.filter != null) {
			if(((style.filter[0]) instanceof haxe_ui_filters_DropShadow)) {
				var dropShadow = style.filter[0];
				if(dropShadow.inner == false) {
					var tmp = "" + dropShadow.distance + "px " + (dropShadow.distance + 2) + "px " + (dropShadow.blurX - 1) + "px " + (dropShadow.blurY - 1) + "px ";
					var tmp1 = haxe_ui_backend_html5_HtmlUtils.rgba(dropShadow.color,dropShadow.alpha);
					this.element.style.boxShadow = tmp + tmp1;
				} else {
					var tmp = "inset " + dropShadow.distance + "px " + dropShadow.distance + "px " + dropShadow.blurX + "px 0px ";
					var tmp1 = haxe_ui_backend_html5_HtmlUtils.rgba(dropShadow.color,dropShadow.alpha);
					this.element.style.boxShadow = tmp + tmp1;
				}
			} else if(((style.filter[0]) instanceof haxe_ui_filters_Blur)) {
				var blur = style.filter[0];
				this.element.style.setProperty("-webkit-filter","blur(" + blur.amount + "px)");
				this.element.style.setProperty("-moz-filter","blur(" + blur.amount + "px)");
				this.element.style.setProperty("-o-filter","blur(" + blur.amount + "px)");
				this.element.style.setProperty("filter","blur(" + blur.amount + "px)");
			} else if(((style.filter[0]) instanceof haxe_ui_filters_Grayscale)) {
				var grayscale = style.filter[0];
				this.element.style.setProperty("-webkit-filter","grayscale(" + grayscale.amount + "%)");
				this.element.style.setProperty("-moz-filter","grayscale(" + grayscale.amount + "%)");
				this.element.style.setProperty("-o-filter","grayscale(" + grayscale.amount + "%)");
				this.element.style.setProperty("filter","grayscale(" + grayscale.amount + "%)");
			}
		} else {
			this.element.style.filter = null;
			this.element.style.boxShadow = null;
			this.element.style.removeProperty("box-shadow");
			this.element.style.removeProperty("-webkit-filter");
			this.element.style.removeProperty("-moz-filter");
			this.element.style.removeProperty("-o-filter");
			this.element.style.removeProperty("filter");
		}
		if(style.backdropFilter != null) {
			if(((style.backdropFilter[0]) instanceof haxe_ui_filters_Blur)) {
				var blur = style.backdropFilter[0];
				this.element.style.setProperty("backdrop-filter","blur(" + blur.amount + "px)");
			}
		} else {
			this.element.style.removeProperty("backdrop-filter");
		}
		if(style.opacity != null) {
			this.element.style.opacity = "" + style.opacity;
		}
		if(style.fontName != null) {
			this.element.style.fontFamily = style.fontName;
		}
		if(style.fontSize != null) {
			this.element.style.fontSize = "" + style.fontSize + "px";
		}
		if(style.color != null) {
			this.element.style.color = haxe_ui_backend_html5_HtmlUtils.color(style.color);
		}
		if(this.hasImageDisplay()) {
			this._imageDisplay.applyStyle();
		}
	}
	,setCursor: function(cursor) {
		var tmp = cursor == null;
		if(cursor == null) {
			this.element.style.removeProperty("cursor");
			if(this.hasImageDisplay()) {
				this.getImageDisplay().element.style.removeProperty("cursor");
			}
		} else {
			this.element.style.cursor = cursor;
			if(this.hasImageDisplay()) {
				this.getImageDisplay().element.style.cursor = cursor;
			}
			if(this.hasTextDisplay()) {
				this.getTextDisplay().element.style.cursor = cursor;
			}
		}
		var _g = 0;
		var _this = js_Boot.__cast(this , haxe_ui_core_Component);
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(c.element.style.cursor == null) {
				c.setCursor("inherit");
			}
		}
	}
	,_canvas: null
	,getCanvas: function(width,height) {
		if(this._canvas == null) {
			this._canvas = window.document.createElement("canvas");
			this._canvas.style.setProperty("-webkit-backface-visibility","hidden");
			this._canvas.style.setProperty("-moz-backface-visibility","hidden");
			this._canvas.style.setProperty("-ms-backface-visibility","hidden");
			this._canvas.style.position = "absolute";
			this._canvas.style.setProperty("pointer-events","none");
			this._canvas.width = width;
			this._canvas.height = height;
			this.element.insertBefore(this._canvas,this.element.firstChild);
		}
		if(width != this._canvas.width) {
			this._canvas.width = width;
		}
		if(height != this._canvas.height) {
			this._canvas.height = height;
		}
		return this._canvas;
	}
	,hasCanvas: function() {
		return this._canvas != null;
	}
	,removeCanvas: function() {
		if(this._canvas != null && this.element.contains(this._canvas)) {
			this.element.removeChild(this._canvas);
			this._canvas = null;
		}
	}
	,mapEvent: function(type,listener) {
		switch(type) {
		case "change":
			if(Object.prototype.hasOwnProperty.call(this._eventMap.h,type) == false) {
				if(this.hasTextInput() == true) {
					this._eventMap.h[type] = listener;
					var tmp = haxe_ui_backend_html5_EventMapper.HAXEUI_TO_DOM.h["keyup"];
					this.getTextInput().element.addEventListener(tmp,$bind(this,this.__onTextFieldChangeEvent));
				}
			}
			break;
		case "click":case "doubleclick":case "mousedown":case "mousemove":case "mouseout":case "mouseover":case "mouseup":
			if(Object.prototype.hasOwnProperty.call(this._eventMap.h,type) == false) {
				if(haxe_ui_backend_html5_EventMapper.MOUSE_TO_TOUCH.h[type] != null) {
					this.element.addEventListener(haxe_ui_backend_html5_EventMapper.MOUSE_TO_TOUCH.h[type],$bind(this,this.__onMouseEvent),{ passive : true});
				}
				this._eventMap.h[type] = listener;
				this.element.addEventListener(haxe_ui_backend_html5_EventMapper.HAXEUI_TO_DOM.h[type],$bind(this,this.__onMouseEvent));
			}
			break;
		case "keydown":case "keyup":
			if(Object.prototype.hasOwnProperty.call(this._eventMap.h,type) == false) {
				this._eventMap.h[type] = listener;
				this.element.addEventListener(haxe_ui_backend_html5_EventMapper.HAXEUI_TO_DOM.h[type],$bind(this,this.__onKeyboardEvent));
			}
			break;
		case "mousewheel":
			this._eventMap.h[type] = listener;
			if(haxe_ui_backend_html5_UserAgent.get_instance().get_firefox() == true) {
				this.element.addEventListener("DOMMouseScroll",$bind(this,this.__onMouseWheelEvent));
			} else {
				this.element.addEventListener("mousewheel",$bind(this,this.__onMouseWheelEvent));
			}
			break;
		case "rightclick":
			if(Object.prototype.hasOwnProperty.call(this._eventMap.h,type) == false) {
				this._eventMap.h[type] = listener;
				this.element.addEventListener("contextmenu",$bind(this,this.__onContextMenu));
			}
			break;
		case "scrollchange":
			this._eventMap.h[type] = listener;
			this.element.addEventListener("scroll",$bind(this,this.__onScrollEvent));
			break;
		}
	}
	,unmapEvent: function(type,listener) {
		switch(type) {
		case "change":
			if(this.hasTextInput()) {
				var _this = this._eventMap;
				if(Object.prototype.hasOwnProperty.call(_this.h,type)) {
					delete(_this.h[type]);
				}
				var tmp = haxe_ui_backend_html5_EventMapper.HAXEUI_TO_DOM.h["keyup"];
				this.getTextInput().element.removeEventListener(tmp,$bind(this,this.__onTextFieldChangeEvent));
			}
			break;
		case "click":case "doubleclick":case "mousedown":case "mousemove":case "mouseout":case "mouseover":case "mouseup":
			var _this = this._eventMap;
			if(Object.prototype.hasOwnProperty.call(_this.h,type)) {
				delete(_this.h[type]);
			}
			this.element.removeEventListener(haxe_ui_backend_html5_EventMapper.HAXEUI_TO_DOM.h[type],$bind(this,this.__onMouseEvent));
			if(haxe_ui_backend_html5_EventMapper.MOUSE_TO_TOUCH.h[type] != null) {
				this.element.removeEventListener(haxe_ui_backend_html5_EventMapper.MOUSE_TO_TOUCH.h[type],$bind(this,this.__onMouseEvent));
			}
			break;
		case "keydown":case "keyup":
			var _this = this._eventMap;
			if(Object.prototype.hasOwnProperty.call(_this.h,type)) {
				delete(_this.h[type]);
			}
			this.element.removeEventListener(haxe_ui_backend_html5_EventMapper.HAXEUI_TO_DOM.h[type],$bind(this,this.__onKeyboardEvent));
			break;
		case "mousewheel":
			var _this = this._eventMap;
			if(Object.prototype.hasOwnProperty.call(_this.h,type)) {
				delete(_this.h[type]);
			}
			if(haxe_ui_backend_html5_UserAgent.get_instance().get_firefox() == true) {
				this.element.removeEventListener("DOMMouseScroll",$bind(this,this.__onMouseWheelEvent));
			} else {
				this.element.removeEventListener("mousewheel",$bind(this,this.__onMouseWheelEvent));
			}
			break;
		case "rightclick":
			var _this = this._eventMap;
			if(Object.prototype.hasOwnProperty.call(_this.h,type)) {
				delete(_this.h[type]);
			}
			this.element.removeEventListener("contextmenu",$bind(this,this.__onContextMenu));
			break;
		}
	}
	,__onContextMenu: function(event) {
		event.preventDefault();
		var type = "rightclick";
		if(type != null) {
			var fn = this._eventMap.h[type];
			if(fn != null) {
				var uiEvent = new haxe_ui_events_MouseEvent(type);
				uiEvent.screenX = event.pageX;
				uiEvent.screenY = event.pageY;
				fn(uiEvent);
			}
		}
		return false;
	}
	,__onChangeEvent: function(event) {
		var type = haxe_ui_backend_html5_EventMapper.DOM_TO_HAXEUI.h[event.type];
		if(type != null) {
			var fn = this._eventMap.h[type];
			if(fn != null) {
				var uiEvent = new haxe_ui_events_UIEvent(type);
				fn(uiEvent);
			}
		}
	}
	,__onTextFieldChangeEvent: function(event) {
		var fn = this._eventMap.h["change"];
		if(fn != null) {
			var uiEvent = new haxe_ui_events_UIEvent("change");
			fn(uiEvent);
		}
	}
	,_over: null
	,__onMouseEvent: function(event) {
		var type = haxe_ui_backend_html5_EventMapper.DOM_TO_HAXEUI.h[event.type];
		if(type != null) {
			try {
				var tmp = type == "mousedown";
			} catch( _g ) {
			}
			var fn = this._eventMap.h[type];
			if(fn != null) {
				var mouseEvent = new haxe_ui_events_MouseEvent(type);
				mouseEvent._originalEvent = event;
				var touchEvent = false;
				try {
					touchEvent = ((event) instanceof TouchEvent);
				} catch( _g ) {
				}
				if(touchEvent == true) {
					var te = js_Boot.__cast(event , TouchEvent);
					mouseEvent.screenX = (te.changedTouches[0].pageX - haxe_ui_core_Screen.get_instance().get_container().offsetLeft) / haxe_ui_Toolkit.get_scaleX();
					mouseEvent.screenY = (te.changedTouches[0].pageY - haxe_ui_core_Screen.get_instance().get_container().offsetTop) / haxe_ui_Toolkit.get_scaleY();
					mouseEvent.touchEvent = true;
				} else if(((event) instanceof MouseEvent)) {
					var me = js_Boot.__cast(event , MouseEvent);
					mouseEvent.buttonDown = me.buttons != 0;
					mouseEvent.screenX = (me.pageX - haxe_ui_core_Screen.get_instance().get_container().offsetLeft) / haxe_ui_Toolkit.get_scaleX();
					mouseEvent.screenY = (me.pageY - haxe_ui_core_Screen.get_instance().get_container().offsetTop) / haxe_ui_Toolkit.get_scaleY();
					mouseEvent.ctrlKey = me.ctrlKey;
					mouseEvent.shiftKey = me.shiftKey;
				}
				if(type == "mouseover") {
					this._over = true;
				} else if(type == "mouseout") {
					this._over = false;
				}
				fn(mouseEvent);
			}
		}
	}
	,getComponentOffset: function() {
		return new haxe_ui_geom_Point(0,0);
	}
	,__onMouseWheelEvent: function(event) {
		var fn = this._eventMap.h["mousewheel"];
		if(fn == null) {
			return;
		}
		var delta = 0;
		if(Reflect.field(event,"wheelDelta") != null) {
			delta = Reflect.field(event,"wheelDelta");
		} else if(((event) instanceof WheelEvent)) {
			delta = (js_Boot.__cast(event , WheelEvent)).deltaY;
		} else {
			delta = -event.detail;
		}
		delta = Math.max(-1,Math.min(1,delta));
		var mouseEvent = new haxe_ui_events_MouseEvent("mousewheel");
		mouseEvent._originalEvent = event;
		mouseEvent.screenX = (event.pageX - haxe_ui_core_Screen.get_instance().get_container().offsetLeft) / haxe_ui_Toolkit.get_scaleX();
		mouseEvent.screenY = (event.pageY - haxe_ui_core_Screen.get_instance().get_container().offsetTop) / haxe_ui_Toolkit.get_scaleY();
		mouseEvent.ctrlKey = event.ctrlKey;
		mouseEvent.shiftKey = event.shiftKey;
		mouseEvent.delta = delta;
		fn(mouseEvent);
	}
	,__onKeyboardEvent: function(event) {
		var type = haxe_ui_backend_html5_EventMapper.DOM_TO_HAXEUI.h[event.type];
		if(type != null) {
			var fn = this._eventMap.h[type];
			if(fn != null) {
				var keyboardEvent = new haxe_ui_events_KeyboardEvent(type);
				keyboardEvent._originalEvent = event;
				if(((event) instanceof KeyboardEvent)) {
					var me = js_Boot.__cast(event , KeyboardEvent);
					keyboardEvent.keyCode = me.keyCode;
					keyboardEvent.altKey = me.altKey;
					keyboardEvent.ctrlKey = me.ctrlKey;
					keyboardEvent.shiftKey = me.shiftKey;
				}
				fn(keyboardEvent);
			}
		}
	}
	,__onScrollEvent: function(event) {
		var type = haxe_ui_backend_html5_EventMapper.DOM_TO_HAXEUI.h[event.type];
		var fn = this._eventMap.h[type];
		if(fn != null) {
			var scrollEvent = new haxe_ui_events_ScrollEvent("scrollchange");
			fn(scrollEvent);
		}
	}
	,registerBehaviours: function() {
		haxe_ui_backend_ComponentBase.prototype.registerBehaviours.call(this);
	}
	,cloneComponent: function() {
		var c = haxe_ui_backend_ComponentBase.prototype.cloneComponent.call(this);
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_backend_ComponentImpl();
	}
	,__class__: haxe_ui_backend_ComponentImpl
});
var haxe_ui_validation_IValidating = function() { };
$hxClasses["haxe.ui.validation.IValidating"] = haxe_ui_validation_IValidating;
haxe_ui_validation_IValidating.__name__ = "haxe.ui.validation.IValidating";
haxe_ui_validation_IValidating.__isInterface__ = true;
haxe_ui_validation_IValidating.prototype = {
	get_depth: null
	,set_depth: null
	,get_id: null
	,set_id: null
	,get_isComponentOffscreen: null
	,validateComponent: null
	,updateComponentDisplay: null
	,isComponentOffscreen: null
	,__class__: haxe_ui_validation_IValidating
	,__properties__: {get_isComponentOffscreen:"get_isComponentOffscreen",set_id:"set_id",get_id:"get_id",set_depth:"set_depth",get_depth:"get_depth"}
};
var haxe_ui_core_Component = function() {
	this._initialSizeApplied = false;
	this._scriptAccess = true;
	this._includeInLayout = true;
	this._styleSheet = null;
	this._cachedStyleSheetRef = null;
	this._useCachedStyleSheetRef = false;
	this.classes = [];
	this._customStyle = null;
	this._hidden = false;
	this.bindingRoot = false;
	this._dragOptions = null;
	this._dragInitiator = null;
	this.userData = null;
	this._animatable = true;
	this._native = null;
	this._defaultLayoutClass = null;
	this.componentTabIndex = 0;
	haxe_ui_backend_ComponentImpl.call(this);
	this.addClass(haxe_ui_Backend.get_id(),false);
	var c = js_Boot.getClass(this);
	while(c != null) {
		var css = c.__name__;
		var className = css.split(".").pop();
		this.addClass(className.toLowerCase(),false);
		this.addClass(haxe_ui_util_StringUtil.toDashes(className),false);
		if(className.toLowerCase() == "component") {
			break;
		}
		c = c.__super__;
	}
	var s = haxe_ui_Toolkit.styleSheet.buildStyleFor(this);
	if(s.native != null && this.get_hasNativeEntry() == true) {
		this.set_native(s.native);
	} else {
		this.create();
	}
	if(haxe_ui_Toolkit.get_initialized() == false) {
		haxe_Log.trace("WARNING: You are trying to create a component before the toolkit has been initialized. This could have undefined results.",{ fileName : "haxe/ui/core/Component.hx", lineNumber : 76, className : "haxe.ui.core.Component", methodName : "new"});
	}
};
$hxClasses["haxe.ui.core.Component"] = haxe_ui_core_Component;
haxe_ui_core_Component.__name__ = "haxe.ui.core.Component";
haxe_ui_core_Component.__interfaces__ = [haxe_ui_validation_IValidating];
haxe_ui_core_Component.addNamedComponentsFrom = function(parent,list) {
	if(parent == null) {
		return;
	}
	if(parent.get_id() != null) {
		list.push(parent);
	}
	var _g = 0;
	var _g1 = parent._children == null ? [] : parent._children;
	while(_g < _g1.length) {
		var child = _g1[_g];
		++_g;
		haxe_ui_core_Component.addNamedComponentsFrom(child,list);
	}
};
haxe_ui_core_Component.__super__ = haxe_ui_backend_ComponentImpl;
haxe_ui_core_Component.prototype = $extend(haxe_ui_backend_ComponentImpl.prototype,{
	componentTabIndex: null
	,_defaultLayoutClass: null
	,create: function() {
		if(this.get_native() == false || this.get_native() == null) {
			this.registerComposite();
		}
		this.createDefaults();
		this.handleCreate(this.get_native());
		this.destroyChildren();
		this.registerBehaviours();
		this.behaviours.replaceNative();
		if(this.get_native() == false || this.get_native() == null) {
			if(this._compositeBuilderClass != null) {
				if(this._compositeBuilder == null) {
					this._compositeBuilder = Type.createInstance(this._compositeBuilderClass,[this]);
				}
				this._compositeBuilder.create();
			}
			this.createChildren();
			if(this._internalEventsClass != null && this._internalEvents == null) {
				this.registerInternalEvents(this._internalEventsClass);
			}
		} else {
			var builderClass = this.getNativeConfigProperty(".builder.@class");
			if(builderClass != null) {
				if(this._compositeBuilder == null) {
					this._compositeBuilder = Type.createInstance($hxClasses[builderClass],[this]);
				}
				this._compositeBuilder.create();
			}
		}
		this.behaviours.applyDefaults();
	}
	,_compositeBuilderClass: null
	,_compositeBuilder: null
	,registerComposite: function() {
	}
	,createDefaults: function() {
	}
	,createChildren: function() {
	}
	,destroyChildren: function() {
		this.unregisterInternalEvents();
	}
	,createLayout: function() {
		var l = null;
		if(this.get_native() == true) {
			var sizeProps = this.getNativeConfigProperties(".size");
			if(sizeProps != null && Object.prototype.hasOwnProperty.call(sizeProps.h,"class")) {
				var name = sizeProps.h["class"];
				var size = Type.createInstance($hxClasses[name],[]);
				size.config = sizeProps;
				l = new haxe_ui_layouts_DelegateLayout(size);
			} else {
				var layoutProps = this.getNativeConfigProperties(".layout");
				if(layoutProps != null && Object.prototype.hasOwnProperty.call(layoutProps.h,"class")) {
					var name = layoutProps.h["class"];
					l = Type.createInstance($hxClasses[name],[]);
				}
			}
		}
		if(l == null) {
			if(this._defaultLayoutClass != null) {
				l = Type.createInstance(this._defaultLayoutClass,[]);
			} else {
				l = new haxe_ui_layouts_DefaultLayout();
			}
		}
		return l;
	}
	,_native: null
	,get_native: function() {
		if(this._native == null) {
			return false;
		}
		if(this.get_hasNativeEntry() == false) {
			return false;
		}
		return this._native;
	}
	,set_native: function(value) {
		if(this.get_hasNativeEntry() == false) {
			return value;
		}
		if(this._native == value) {
			return value;
		}
		this._native = value;
		this.get_customStyle().native = value;
		if(this._native == true && this.get_hasNativeEntry()) {
			this.addClass(":native");
		} else {
			this.removeClass(":native");
		}
		this.behaviours.cache();
		this.behaviours.detatch();
		this.create();
		if(this.get_layout() != null) {
			this.set_layout(this.createLayout());
		}
		this.behaviours.restore();
		return value;
	}
	,_animatable: null
	,get_animatable: function() {
		return false;
	}
	,set_animatable: function(value) {
		if(this._animatable != value) {
			if(value == false && this._componentAnimation != null) {
				this._componentAnimation.stop();
				this._componentAnimation = null;
			}
			this._animatable = value;
		}
		this._animatable = value;
		return value;
	}
	,_componentAnimation: null
	,get_componentAnimation: function() {
		return this._componentAnimation;
	}
	,set_componentAnimation: function(value) {
		if(this._componentAnimation != value && this._animatable == true) {
			if(this._componentAnimation != null) {
				this._componentAnimation.stop();
			}
			this._componentAnimation = value;
		}
		return value;
	}
	,userData: null
	,screen: null
	,get_screen: function() {
		return haxe_ui_Toolkit.get_screen();
	}
	,get_draggable: function() {
		return haxe_ui_dragdrop_DragManager.get_instance().isRegisteredDraggable(this);
	}
	,set_draggable: function(value) {
		if(value == true) {
			haxe_ui_dragdrop_DragManager.get_instance().registerDraggable(this,this.get_dragOptions());
		} else {
			haxe_ui_dragdrop_DragManager.get_instance().unregisterDraggable(this);
		}
		return value;
	}
	,_dragInitiator: null
	,get_dragInitiator: function() {
		return this._dragInitiator;
	}
	,set_dragInitiator: function(value) {
		this._dragInitiator = value;
		if(this._dragOptions != null) {
			this._dragOptions.mouseTarget = value;
		}
		this.set_draggable(true);
		return value;
	}
	,_dragOptions: null
	,get_dragOptions: function() {
		if(this._dragOptions == null) {
			this._dragOptions = { mouseTarget : this._dragInitiator};
		}
		return this._dragOptions;
	}
	,set_dragOptions: function(value) {
		this._dragOptions = value;
		this.set_draggable(true);
		return value;
	}
	,bindingRoot: null
	,get_rootComponent: function() {
		var r = this;
		while(r.parentComponent != null) r = r.parentComponent;
		return r;
	}
	,get_numComponents: function() {
		var n = 0;
		if(this._compositeBuilder != null) {
			var builderCount = this._compositeBuilder.get_numComponents();
			if(builderCount != null) {
				n = builderCount;
			} else if(this._children != null) {
				n = this._children.length;
			}
		} else if(this._children != null) {
			n = this._children.length;
		}
		return n;
	}
	,addComponent: function(child) {
		if(this._compositeBuilder != null) {
			var v = this._compositeBuilder.addComponent(child);
			if(v != null) {
				v.set_scriptAccess(this.get_scriptAccess());
				return v;
			}
		}
		if(this.get_native() == true) {
			var allowChildren = this.getNativeConfigPropertyBool(".@allowChildren",true);
			if(allowChildren == false) {
				return child;
			}
		}
		child.parentComponent = this;
		child._isDisposed = false;
		if(this._children == null) {
			this._children = [];
		}
		this._children.push(child);
		this.handleAddComponent(child);
		if(this._ready) {
			child.ready();
		}
		this.assignPositionClasses();
		if(!(this._layout == null || this._layoutLocked == true)) {
			this.invalidateComponent("layout",false);
		}
		if(this.get_disabled()) {
			child.set_disabled(true);
		}
		if(this._compositeBuilder != null) {
			this._compositeBuilder.onComponentAdded(child);
		}
		this.onComponentAdded(child);
		this.dispatch(new haxe_ui_events_UIEvent("componentAdded"));
		child.set_scriptAccess(this.get_scriptAccess());
		return child;
	}
	,addComponentAt: function(child,index) {
		if(this._compositeBuilder != null) {
			var v = this._compositeBuilder.addComponentAt(child,index);
			if(v != null) {
				v.set_scriptAccess(this.get_scriptAccess());
				return v;
			}
		}
		if(this.get_native() == true) {
			var allowChildren = this.getNativeConfigPropertyBool(".@allowChildren",true);
			if(allowChildren == false) {
				return child;
			}
		}
		child.parentComponent = this;
		child._isDisposed = false;
		if(this._children == null) {
			this._children = [];
		}
		this._children.splice(index,0,child);
		this.handleAddComponentAt(child,index);
		if(this._ready) {
			child.ready();
		}
		this.assignPositionClasses();
		if(!(this._layout == null || this._layoutLocked == true)) {
			this.invalidateComponent("layout",false);
		}
		if(this.get_disabled()) {
			child.set_disabled(true);
		}
		if(this._compositeBuilder != null) {
			this._compositeBuilder.onComponentAdded(child);
		}
		this.onComponentAdded(child);
		this.dispatch(new haxe_ui_events_UIEvent("componentAdded"));
		child.set_scriptAccess(this.get_scriptAccess());
		return child;
	}
	,onComponentAdded: function(child) {
	}
	,removeComponent: function(child,dispose,invalidate) {
		if(invalidate == null) {
			invalidate = true;
		}
		if(dispose == null) {
			dispose = true;
		}
		if(child == null) {
			return null;
		}
		if(this._compositeBuilder != null) {
			var v = this._compositeBuilder.removeComponent(child,dispose,invalidate);
			if(v != null) {
				return v;
			}
		}
		if(this._children != null) {
			if(HxOverrides.remove(this._children,child)) {
				child.parentComponent = null;
				child.set_depth(-1);
			}
			if(dispose == true) {
				child.disposeComponent();
			}
		}
		this.handleRemoveComponent(child,dispose);
		this.assignPositionClasses(invalidate);
		if(this._children != null && invalidate == true) {
			if(!(this._layout == null || this._layoutLocked == true)) {
				this.invalidateComponent("layout",false);
			}
		}
		if(this._compositeBuilder != null) {
			this._compositeBuilder.onComponentRemoved(child);
		}
		this.onComponentRemoved(child);
		this.dispatch(new haxe_ui_events_UIEvent("componentRemoved"));
		return child;
	}
	,disposeComponent: function() {
		this._isDisposed = true;
		this.removeAllComponents(true);
		this.destroyComponent();
		this.unregisterEvents();
		if(this.hasTextDisplay()) {
			this.getTextDisplay().dispose();
		}
		if(this.hasTextInput()) {
			this.getTextInput().dispose();
		}
		if(this.hasImageDisplay()) {
			this.getImageDisplay().dispose();
		}
		if(this.behaviours != null) {
			this.behaviours.dispose();
			this.behaviours = null;
		}
		if(this._layout != null) {
			this._layout.set_component(null);
			this._layout = null;
		}
		if(this._internalEvents != null) {
			this._internalEvents._target = null;
			this._internalEvents = null;
		}
		this.parentComponent = null;
	}
	,removeComponentAt: function(index,dispose,invalidate) {
		if(invalidate == null) {
			invalidate = true;
		}
		if(dispose == null) {
			dispose = true;
		}
		if(this._children == null) {
			return null;
		}
		var childCount = this._children.length;
		if(this._compositeBuilder != null) {
			var compositeChildCount = this._compositeBuilder.get_numComponents();
			if(compositeChildCount != null) {
				childCount = compositeChildCount;
			}
		}
		if(index < 0 || index > childCount - 1) {
			return null;
		}
		if(this._compositeBuilder != null) {
			var v = this._compositeBuilder.removeComponentAt(index,dispose,invalidate);
			if(v != null) {
				return v;
			}
		}
		var child = this._children[index];
		if(child == null) {
			return null;
		}
		if(dispose == true) {
			child._isDisposed = true;
			child.removeAllComponents(true);
		}
		this.handleRemoveComponentAt(index,dispose);
		if(HxOverrides.remove(this._children,child)) {
			child.parentComponent = null;
			child.set_depth(-1);
		}
		if(dispose == true) {
			child.destroyComponent();
			child.unregisterEvents();
		}
		this.assignPositionClasses(invalidate);
		if(invalidate == true) {
			if(!(this._layout == null || this._layoutLocked == true)) {
				this.invalidateComponent("layout",false);
			}
		}
		if(this._compositeBuilder != null) {
			this._compositeBuilder.onComponentRemoved(child);
		}
		this.onComponentRemoved(child);
		this.dispatch(new haxe_ui_events_UIEvent("componentRemoved"));
		return child;
	}
	,onComponentRemoved: function(child) {
	}
	,assignPositionClasses: function(invalidate) {
		if(invalidate == null) {
			invalidate = true;
		}
		if((this._children == null ? [] : this._children).length == 1) {
			(this._children == null ? [] : this._children)[0].addClasses(["first","last"],invalidate);
			return;
		}
		var _g = 0;
		var _g1 = (this._children == null ? [] : this._children).length;
		while(_g < _g1) {
			var i = _g++;
			var c = (this._children == null ? [] : this._children)[i];
			if(i == 0) {
				c.swapClass("first","last",invalidate);
			} else if((this._children == null ? [] : this._children).length > 1 && i == (this._children == null ? [] : this._children).length - 1) {
				c.swapClass("last","first",invalidate);
			} else {
				c.removeClasses(["first","last"],invalidate);
			}
		}
	}
	,destroyComponent: function() {
		if(this._compositeBuilder != null) {
			this._compositeBuilder.destroy();
		}
		haxe_ui_locale_LocaleManager.get_instance().unregisterComponent(this);
		this.onDestroy();
	}
	,onDestroy: function() {
		var _g = 0;
		var _g1 = this._children == null ? [] : this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			child.onDestroy();
		}
		this.dispatch(new haxe_ui_events_UIEvent("destroy"));
	}
	,walkComponents: function(callback) {
		if(callback(this) == false) {
			return;
		}
		var _g = 0;
		var _g1 = this._children == null ? [] : this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(callback(child) == false) {
				return;
			}
		}
		var _g = 0;
		var _g1 = this._children == null ? [] : this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			var cont = [true];
			child.walkComponents((function(cont) {
				return function(c) {
					cont[0] = callback(c);
					return cont[0];
				};
			})(cont));
			if(cont[0] == false) {
				break;
			}
		}
	}
	,removeAllComponents: function(dispose) {
		if(dispose == null) {
			dispose = true;
		}
		if(this._children != null) {
			while(this._children.length > 0) {
				this._children[0].removeAllComponents(dispose);
				this.removeComponent(this._children[0],dispose,false);
			}
			if(!(this._layout == null || this._layoutLocked == true)) {
				this.invalidateComponent("layout",false);
			}
		}
	}
	,matchesSearch: function(criteria,type,searchType) {
		if(searchType == null) {
			searchType = "id";
		}
		if(criteria != null) {
			if(searchType == "id" && this.get_id() == criteria || searchType == "css" && this.classes.indexOf(criteria) != -1 == true) {
				if(type != null) {
					return js_Boot.__instanceof(this,type);
				}
				return true;
			}
		} else if(type != null) {
			return js_Boot.__instanceof(this,type);
		}
		return false;
	}
	,findComponent: function(criteria,type,recursive,searchType) {
		if(searchType == null) {
			searchType = "id";
		}
		if(recursive == null && criteria != null && searchType == "id") {
			recursive = true;
		}
		var match = null;
		var _g = 0;
		var _g1 = this._children == null ? [] : this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.matchesSearch(criteria,type,searchType)) {
				match = child;
				break;
			}
		}
		if(match == null && recursive == true) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				var temp = child.findComponent(criteria,type,recursive,searchType);
				if(temp != null) {
					match = temp;
					break;
				}
			}
			if(match == null && this._compositeBuilder != null) {
				match = this._compositeBuilder.findComponent(criteria,type,recursive,searchType);
			}
		}
		return match;
	}
	,findComponents: function(styleName,type,maxDepth) {
		if(maxDepth == null) {
			maxDepth = 5;
		}
		if(maxDepth == -1) {
			maxDepth = 100;
		}
		if(maxDepth <= 0) {
			return [];
		}
		--maxDepth;
		var r = [];
		if(this._compositeBuilder != null) {
			var childArray = this._compositeBuilder.findComponents(styleName,type,maxDepth);
			if(childArray != null) {
				var _g = 0;
				while(_g < childArray.length) {
					var c = childArray[_g];
					++_g;
					r.push(c);
				}
			}
		}
		var _g = 0;
		var _g1 = this._children == null ? [] : this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			var match = true;
			if(styleName != null && child.classes.indexOf(styleName) != -1 == false) {
				match = false;
			}
			if(type != null && js_Boot.__instanceof(child,type) == false) {
				match = false;
			}
			if(match == true) {
				r.push(child);
			} else {
				var childArray = child.findComponents(styleName,type,maxDepth);
				var _g2 = 0;
				while(_g2 < childArray.length) {
					var c = childArray[_g2];
					++_g2;
					r.push(c);
				}
			}
		}
		return r;
	}
	,findAncestor: function(criteria,type,searchType) {
		if(searchType == null) {
			searchType = "id";
		}
		var match = null;
		var p = this.parentComponent;
		while(p != null) if(p.matchesSearch(criteria,type,searchType)) {
			match = p;
			break;
		} else {
			p = p.parentComponent;
		}
		return match;
	}
	,findComponentsUnderPoint: function(screenX,screenY,type) {
		var c = [];
		if(this.hitTest(screenX,screenY,true)) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				if(child.hitTest(screenX,screenY,true)) {
					var match = true;
					if(type != null && js_Boot.__instanceof(child,type) == false) {
						match = false;
					}
					if(match == true) {
						c.push(child);
					}
					c = c.concat(child.findComponentsUnderPoint(screenX,screenY,type));
				}
			}
		}
		return c;
	}
	,hasComponentUnderPoint: function(screenX,screenY,type) {
		var b = false;
		if(this.hitTest(screenX,screenY,true)) {
			if(type == null) {
				return true;
			}
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				if(child.hitTest(screenX,screenY,true)) {
					var match = true;
					if(type != null && js_Boot.__instanceof(child,type) == false) {
						match = false;
					}
					if(match == false) {
						match = child.hasComponentUnderPoint(screenX,screenY,type);
					}
					if(match == true) {
						b = match;
						break;
					}
				}
			}
		}
		return b;
	}
	,getComponentIndex: function(child) {
		if(this._compositeBuilder != null) {
			var index = this._compositeBuilder.getComponentIndex(child);
			if(index != -2147483648) {
				return index;
			}
		}
		var index = -1;
		if(this._children != null && child != null) {
			index = this._children.indexOf(child);
		}
		return index;
	}
	,setComponentIndex: function(child,index) {
		if(this._compositeBuilder != null) {
			var v = this._compositeBuilder.setComponentIndex(child,index);
			if(v != null) {
				return v;
			}
		}
		if(index >= 0 && index <= this._children.length && child.parentComponent == this) {
			this.handleSetComponentIndex(child,index);
			HxOverrides.remove(this._children,child);
			this._children.splice(index,0,child);
			if(!(this._layout == null || this._layoutLocked == true)) {
				this.invalidateComponent("layout",false);
			}
		}
		return child;
	}
	,getComponentAt: function(index) {
		if(this._compositeBuilder != null) {
			var v = this._compositeBuilder.getComponentAt(index);
			if(v != null) {
				return v;
			}
		}
		if(this._children == null) {
			return null;
		}
		return this._children[index];
	}
	,hide: function() {
		if(this._compositeBuilder != null) {
			var v = this._compositeBuilder.hide();
			if(v == true) {
				return;
			}
		}
		if(this._hidden == false) {
			this._hidden = true;
			this.handleVisibility(false);
			if(this.parentComponent != null) {
				var _this = this.parentComponent;
				if(!(_this._layout == null || _this._layoutLocked == true)) {
					_this.invalidateComponent("layout",false);
				}
			}
			this.dispatchRecursively(new haxe_ui_events_UIEvent("hidden"));
		}
	}
	,hideInternal: function(dispatchChildren) {
		if(dispatchChildren == null) {
			dispatchChildren = false;
		}
		if(this._compositeBuilder != null) {
			var v = this._compositeBuilder.hide();
			if(v == true) {
				return;
			}
		}
		if(this._hidden == false) {
			this._hidden = true;
			this.handleVisibility(false);
			if(this.parentComponent != null) {
				var _this = this.parentComponent;
				if(!(_this._layout == null || _this._layoutLocked == true)) {
					_this.invalidateComponent("layout",false);
				}
			}
			if(dispatchChildren == true) {
				this.dispatchRecursively(new haxe_ui_events_UIEvent("hidden"));
			} else {
				this.dispatch(new haxe_ui_events_UIEvent("hidden"));
			}
		}
	}
	,show: function() {
		if(this._compositeBuilder != null) {
			var v = this._compositeBuilder.show();
			if(v == true) {
				return;
			}
		}
		if(this._hidden == true) {
			this._hidden = false;
			this.handleVisibility(true);
			if(!(this._layout == null || this._layoutLocked == true)) {
				this.invalidateComponent("layout",false);
			}
			if(this.parentComponent != null) {
				var _this = this.parentComponent;
				if(!(_this._layout == null || _this._layoutLocked == true)) {
					_this.invalidateComponent("layout",false);
				}
			}
			this.dispatchRecursively(new haxe_ui_events_UIEvent("shown"));
		}
	}
	,showInternal: function(dispatchChildren) {
		if(dispatchChildren == null) {
			dispatchChildren = false;
		}
		if(this._compositeBuilder != null) {
			var v = this._compositeBuilder.show();
			if(v == true) {
				return;
			}
		}
		if(this._hidden == true) {
			this._hidden = false;
			this.handleVisibility(true);
			if(!(this._layout == null || this._layoutLocked == true)) {
				this.invalidateComponent("layout",false);
			}
			if(this.parentComponent != null) {
				var _this = this.parentComponent;
				if(!(_this._layout == null || _this._layoutLocked == true)) {
					_this.invalidateComponent("layout",false);
				}
			}
			if(dispatchChildren == true) {
				this.dispatchRecursively(new haxe_ui_events_UIEvent("shown"));
			} else {
				this.dispatch(new haxe_ui_events_UIEvent("shown"));
			}
		}
	}
	,fadeIn: function(onEnd,show) {
		if(show == null) {
			show = true;
		}
		var _gthis = this;
		if(onEnd != null || show == true) {
			var prevStart = this.onAnimationStart;
			var prevEnd = this.onAnimationEnd;
			if(show == true) {
				prevStart = this.onAnimationStart;
				this.set_onAnimationStart(function(e) {
					_gthis.show();
					_gthis.set_onAnimationStart(prevStart);
				});
			}
			this.set_onAnimationEnd(function(e) {
				if(onEnd != null) {
					onEnd();
				}
				_gthis.removeClass("fade-in");
				_gthis.set_onAnimationEnd(prevEnd);
			});
		}
		this.swapClass("fade-in","fade-out");
	}
	,fadeOut: function(onEnd,hide) {
		if(hide == null) {
			hide = true;
		}
		var _gthis = this;
		if(onEnd != null || hide == true) {
			var prevEnd = this.onAnimationEnd;
			this.set_onAnimationEnd(function(e) {
				if(hide == true) {
					_gthis.hide();
				}
				if(onEnd != null) {
					onEnd();
				}
				_gthis.set_onAnimationEnd(prevEnd);
				_gthis.removeClass("fade-out");
			});
		}
		this.swapClass("fade-out","fade-in");
	}
	,_hidden: null
	,get_hidden: function() {
		if(this._hidden == true) {
			return true;
		}
		if(this.parentComponent != null) {
			return this.parentComponent.get_hidden();
		}
		return false;
	}
	,set_hidden: function(value) {
		if(value == this._hidden) {
			return value;
		}
		if(value == true) {
			this.hide();
		} else {
			this.show();
		}
		return value;
	}
	,_customStyle: null
	,get_customStyle: function() {
		if(this._customStyle == null) {
			this._customStyle = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		return this._customStyle;
	}
	,set_customStyle: function(value) {
		if(value != this._customStyle) {
			this.invalidateComponent("style",false);
		}
		this._customStyle = value;
		return value;
	}
	,classes: null
	,addClass: function(name,invalidate,recursive) {
		if(recursive == null) {
			recursive = false;
		}
		if(invalidate == null) {
			invalidate = true;
		}
		if(this.classes.indexOf(name) == -1) {
			this.classes.push(name);
			if(invalidate == true) {
				this.invalidateComponent("style",false);
			}
		}
		if(recursive == true) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				child.addClass(name,invalidate,recursive);
			}
		}
	}
	,addClasses: function(names,invalidate,recursive) {
		if(recursive == null) {
			recursive = false;
		}
		if(invalidate == null) {
			invalidate = true;
		}
		var needsInvalidate = false;
		var _g = 0;
		while(_g < names.length) {
			var name = names[_g];
			++_g;
			if(this.classes.indexOf(name) == -1) {
				this.classes.push(name);
				if(invalidate == true) {
					needsInvalidate = true;
				}
			}
		}
		if(needsInvalidate == true) {
			this.invalidateComponent("style",false);
		}
		if(recursive == true) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				child.addClasses(names,invalidate,recursive);
			}
		}
	}
	,removeClass: function(name,invalidate,recursive) {
		if(recursive == null) {
			recursive = false;
		}
		if(invalidate == null) {
			invalidate = true;
		}
		if(this.classes.indexOf(name) != -1) {
			HxOverrides.remove(this.classes,name);
			if(invalidate == true) {
				this.invalidateComponent("style",false);
			}
		}
		if(recursive == true) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				child.removeClass(name,invalidate,recursive);
			}
		}
	}
	,removeClasses: function(names,invalidate,recursive) {
		if(recursive == null) {
			recursive = false;
		}
		if(invalidate == null) {
			invalidate = true;
		}
		var needsInvalidate = false;
		var _g = 0;
		while(_g < names.length) {
			var name = names[_g];
			++_g;
			if(this.classes.indexOf(name) != -1) {
				HxOverrides.remove(this.classes,name);
				if(invalidate == true) {
					needsInvalidate = true;
				}
			}
		}
		if(needsInvalidate == true) {
			this.invalidateComponent("style",false);
		}
		if(recursive == true) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				child.removeClasses(names,invalidate,recursive);
			}
		}
	}
	,hasClass: function(name) {
		return this.classes.indexOf(name) != -1;
	}
	,swapClass: function(classToAdd,classToRemove,invalidate,recursive) {
		if(recursive == null) {
			recursive = false;
		}
		if(invalidate == null) {
			invalidate = true;
		}
		var needsInvalidate = false;
		if(classToAdd != null && this.classes.indexOf(classToAdd) == -1) {
			this.classes.push(classToAdd);
			needsInvalidate = true;
		}
		if(classToRemove != null && this.classes.indexOf(classToRemove) != -1) {
			HxOverrides.remove(this.classes,classToRemove);
			needsInvalidate = true;
		}
		if(invalidate == true && needsInvalidate == true) {
			this.invalidateComponent("style",false);
		}
		if(recursive == true) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				child.swapClass(classToAdd,classToRemove,invalidate,recursive);
			}
		}
	}
	,get_styleNames: function() {
		return this.classes.join(" ");
	}
	,set_styleNames: function(value) {
		if(value == null) {
			return value;
		}
		var _g = 0;
		var _g1 = value.split(" ");
		while(_g < _g1.length) {
			var x = _g1[_g];
			++_g;
			this.addClass(x);
		}
		return value;
	}
	,_styleString: null
	,get_styleString: function() {
		return this._styleString;
	}
	,set_styleString: function(value) {
		if(value == null || value == this._styleString) {
			return value;
		}
		var cssString = StringTools.trim(value);
		if(cssString.length == 0) {
			return value;
		}
		if(StringTools.endsWith(cssString,";") == false) {
			cssString += ";";
		}
		cssString = "_ { " + cssString + "}";
		var s = new haxe_ui_styles_Parser().parse(cssString);
		this.get_customStyle().mergeDirectives(s.get_rules()[0].directives);
		this._styleString = value;
		this.invalidateComponent("style",false);
		return value;
	}
	,_useCachedStyleSheetRef: null
	,_cachedStyleSheetRef: null
	,_styleSheet: null
	,get_styleSheet: function() {
		if(this._useCachedStyleSheetRef == true) {
			return this._cachedStyleSheetRef;
		}
		var s = null;
		var ref = this;
		while(ref != null) {
			if(ref._styleSheet != null) {
				s = ref._styleSheet;
				break;
			}
			ref = ref.parentComponent;
		}
		this._useCachedStyleSheetRef = true;
		this._cachedStyleSheetRef = s;
		return s;
	}
	,set_styleSheet: function(value) {
		this._styleSheet = value;
		this.resetCachedStyleSheetRef();
		return value;
	}
	,resetCachedStyleSheetRef: function() {
		this._cachedStyleSheetRef = null;
		this._useCachedStyleSheetRef = false;
		var _g = 0;
		var _g1 = this._children == null ? [] : this._children;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			c.resetCachedStyleSheetRef();
		}
	}
	,_includeInLayout: null
	,get_includeInLayout: function() {
		if(this._hidden == true) {
			return false;
		}
		return this._includeInLayout;
	}
	,set_includeInLayout: function(value) {
		this._includeInLayout = value;
		return value;
	}
	,get_layout: function() {
		return this._layout;
	}
	,set_layout: function(value) {
		if(value == null) {
			return value;
		}
		var tmp;
		if(this._layout != null) {
			var c = js_Boot.getClass(value);
			var tmp1 = c.__name__;
			var c = js_Boot.getClass(this._layout);
			tmp = tmp1 == c.__name__;
		} else {
			tmp = false;
		}
		if(tmp) {
			return value;
		}
		this._layout = value;
		this._layout.set_component(this);
		return value;
	}
	,lockLayout: function(recursive) {
		if(recursive == null) {
			recursive = false;
		}
		if(this._layoutLocked == true) {
			return;
		}
		this._layoutLocked = true;
		if(recursive == true) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				child.lockLayout(recursive);
			}
		}
	}
	,unlockLayout: function(recursive) {
		if(recursive == null) {
			recursive = false;
		}
		if(this._layoutLocked == false) {
			return;
		}
		if(recursive == true) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				child.unlockLayout(recursive);
			}
		}
		this._layoutLocked = false;
		if(!(this._layout == null || this._layoutLocked == true)) {
			this.invalidateComponent("layout",false);
		}
	}
	,ready: function() {
		var _gthis = this;
		this.set_depth(haxe_ui_util_ComponentUtil.getDepth(this));
		if(this.isComponentInvalid()) {
			this._invalidateCount = 0;
			haxe_ui_validation_ValidationManager.get_instance().add(this);
		}
		if(this._ready == false) {
			this._ready = true;
			this.handleReady();
			if((this._children == null ? [] : this._children) != null) {
				var _g = 0;
				var _g1 = this._children == null ? [] : this._children;
				while(_g < _g1.length) {
					var child = _g1[_g];
					++_g;
					child.ready();
				}
			}
			this.invalidateComponent();
			this.behaviours.ready();
			this.behaviours.update();
			haxe_ui_Toolkit.callLater(function() {
				_gthis.invalidateComponent("data",false);
				_gthis.invalidateComponent("style",false);
				if(_gthis._compositeBuilder != null) {
					_gthis._compositeBuilder.onReady();
				}
				_gthis.onReady();
				_gthis.dispatch(new haxe_ui_events_UIEvent("ready"));
				if(_gthis._hidden == false) {
					_gthis.dispatch(new haxe_ui_events_UIEvent("shown"));
				}
			});
		}
	}
	,onReady: function() {
	}
	,onInitialize: function() {
	}
	,onResized: function() {
	}
	,onMoved: function() {
	}
	,_scriptAccess: null
	,get_scriptAccess: function() {
		return this._scriptAccess;
	}
	,set_scriptAccess: function(value) {
		if(value == this._scriptAccess) {
			return value;
		}
		this._scriptAccess = value;
		var _g = 0;
		var _g1 = this._children == null ? [] : this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			child.set_scriptAccess(value);
		}
		return value;
	}
	,namedComponents: null
	,get_namedComponents: function() {
		var list = [];
		haxe_ui_core_Component.addNamedComponentsFrom(this,list);
		return list;
	}
	,onThemeChanged: function() {
		this._initialSizeApplied = false;
		if(this._style != null) {
			if(this._style.initialWidth != null) {
				this.set_width(0);
			}
			if(this._style.initialPercentWidth != null) {
				this.set_percentWidth(null);
			}
			if(this._style.initialHeight != null) {
				this.set_height(0);
			}
			if(this._style.initialPercentHeight != null) {
				this.set_percentHeight(null);
			}
		}
	}
	,initializeComponent: function() {
		if(this._isInitialized == true) {
			return;
		}
		if(this._compositeBuilder != null) {
			this._compositeBuilder.onInitialize();
		}
		this.onInitialize();
		if(this._layout == null) {
			this.set_layout(this.createLayout());
		}
		this._isInitialized = true;
		if(this.hasEvent("initialize")) {
			this.dispatch(new haxe_ui_events_UIEvent("initialize"));
		}
	}
	,_initialSizeApplied: null
	,validateInitialSize: function(isInitialized) {
		if(isInitialized == false && this._style != null && this._initialSizeApplied == false) {
			if((this._style.initialWidth != null || this._style.initialPercentWidth != null) && (this.get_width() <= 0 && this.get_percentWidth() == null)) {
				if(this._style.initialWidth != null) {
					this.set_width(this._style.initialWidth);
					this._initialSizeApplied = true;
				} else if(this._style.initialPercentWidth != null) {
					this.set_percentWidth(this._style.initialPercentWidth);
					this._initialSizeApplied = true;
				}
			}
			if((this._style.initialHeight != null || this._style.initialPercentHeight != null) && (this.get_height() <= 0 && this.get_percentHeight() == null)) {
				if(this._style.initialHeight != null) {
					this.set_height(this._style.initialHeight);
					this._initialSizeApplied = true;
				} else if(this._style.initialPercentHeight != null) {
					this.set_percentHeight(this._style.initialPercentHeight);
					this._initialSizeApplied = true;
				}
			}
		}
	}
	,validateComponentLayout: function() {
		this.get_layout().refresh();
		while(this.validateComponentAutoSize()) this.get_layout().refresh();
		var sizeChanged = false;
		if(this._componentWidth != this._actualWidth || this._componentHeight != this._actualHeight) {
			this._actualWidth = this._componentWidth;
			this._actualHeight = this._componentHeight;
			this.enforceSizeConstraints();
			if(this.parentComponent != null) {
				var _this = this.parentComponent;
				if(!(_this._layout == null || _this._layoutLocked == true)) {
					_this.invalidateComponent("layout",false);
				}
			}
			this.onResized();
			this.dispatch(new haxe_ui_events_UIEvent("resize"));
			sizeChanged = true;
		}
		if(this._compositeBuilder != null) {
			if(this._compositeBuilder.validateComponentLayout()) {
				sizeChanged = true;
			}
		}
		return sizeChanged;
	}
	,enforceSizeConstraints: function() {
		if(this.get_style() != null) {
			if(this.get_style().minWidth != null && this._componentWidth < this.get_style().minWidth) {
				this._componentWidth = this._actualWidth = this._width = this.get_style().minWidth;
			}
			if(this.get_style().maxWidth != null && this.get_style().maxPercentWidth == null && this._componentWidth > this.get_style().maxWidth) {
				this._componentWidth = this._actualWidth = this._width = this.get_style().maxWidth;
			} else if(this.get_style().maxWidth == null && this.get_style().maxPercentWidth != null) {
				var p = this;
				var max = 0;
				while(p != null) {
					if(p.get_style() != null && p.get_style().maxPercentWidth == null) {
						max += p.get_width();
						break;
					}
					if(p.get_style() != null && p != this) {
						max -= p.get_style().paddingLeft + p.get_style().paddingRight;
					}
					p = p.parentComponent;
				}
				max = max * this.get_style().maxPercentWidth / 100;
				if(max > 0 && this._componentWidth > max) {
					this._componentWidth = this._actualWidth = this._width = max;
				}
			}
			if(this.get_style().minHeight != null && this._componentHeight < this.get_style().minHeight) {
				this._componentHeight = this._actualHeight = this._height = this.get_style().minHeight;
			}
			if(this.get_style().maxHeight != null && this.get_style().maxPercentHeight == null && this._componentHeight > this.get_style().maxHeight) {
				this._componentHeight = this._actualHeight = this._height = this.get_style().maxHeight;
			} else if(this.get_style().maxHeight == null && this.get_style().maxPercentHeight != null) {
				var p = this;
				var max = 0;
				while(p != null) {
					if(p.get_style() != null && p.get_style().maxPercentHeight == null) {
						max += p.get_height();
						break;
					}
					if(p.get_style() != null && p != this) {
						max -= p.get_style().paddingTop + p.get_style().paddingBottom;
					}
					p = p.parentComponent;
				}
				max = max * this.get_style().maxPercentHeight / 100;
				if(max > 0 && this._componentHeight > max) {
					this._componentHeight = this._actualHeight = this._height = max;
				}
			}
		}
	}
	,validateComponentStyle: function() {
		var s = haxe_ui_Toolkit.styleSheet.buildStyleFor(this);
		if(this.get_styleSheet() != null) {
			var localStyle = this.get_styleSheet().buildStyleFor(this);
			s.apply(localStyle);
		}
		s.apply(this.get_customStyle());
		if(this._style == null || this._style.equalTo(s) == false) {
			var marginsChanged = false;
			if(this.parentComponent != null && this._style != null) {
				marginsChanged = this._style.marginLeft != s.marginLeft || this._style.marginRight != s.marginRight || this._style.marginTop != s.marginTop || this._style.marginBottom != s.marginBottom;
			}
			var bordersChanged = false;
			if(this._style != null && this._style.get_fullBorderSize() != s.get_fullBorderSize()) {
				bordersChanged = true;
			}
			this._style = s;
			this.applyStyle(s);
			if(bordersChanged == true) {
				if(!(this._layout == null || this._layoutLocked == true)) {
					this.invalidateComponent("layout",false);
				}
			}
			if(marginsChanged == true) {
				var _this = this.parentComponent;
				if(!(_this._layout == null || _this._layoutLocked == true)) {
					_this.invalidateComponent("layout",false);
				}
			}
		}
	}
	,validateComponentPosition: function() {
		this.handlePosition(this._left,this._top,this._style);
		this.onMoved();
		this.dispatch(new haxe_ui_events_UIEvent("move"));
	}
	,updateComponentDisplay: function() {
		if(this.get_componentWidth() == null || this.get_componentHeight() == null) {
			return;
		}
		this.handleSize(this.get_componentWidth(),this.get_componentHeight(),this._style);
		if(this._componentClipRect != null || this.get_style() != null && this.get_style().clip != null && this.get_style().clip == true) {
			this.handleClipRect(this._componentClipRect != null ? this._componentClipRect : new haxe_ui_geom_Rectangle(0,0,this.get_componentWidth(),this.get_componentHeight()));
		}
	}
	,validateComponentAutoSize: function() {
		var invalidate = false;
		if(this.get_autoWidth() == true || this.get_autoHeight() == true) {
			var s = this.get_layout().calcAutoSize();
			if(this.get_autoWidth() == true) {
				if(s.width != this._componentWidth) {
					this._componentWidth = s.width;
					invalidate = true;
				}
			}
			if(this.get_autoHeight() == true) {
				if(s.height != this._componentHeight) {
					this._componentHeight = s.height;
					invalidate = true;
				}
			}
		}
		return invalidate;
	}
	,applyStyle: function(style) {
		haxe_ui_backend_ComponentImpl.prototype.applyStyle.call(this,style);
		if(style != null && this._initialSizeApplied == false) {
			if((style.initialWidth != null || style.initialPercentWidth != null) && (this.get_width() <= 0 && this.get_percentWidth() == null)) {
				if(style.initialWidth != null) {
					this.set_width(style.initialWidth);
					this._initialSizeApplied = true;
				} else if(style.initialPercentWidth != null) {
					this.set_percentWidth(style.initialPercentWidth);
					this._initialSizeApplied = true;
				}
			}
			if(style.autoHeight != true && (style.initialHeight != null || style.initialPercentHeight != null) && (this.get_height() <= 0 && this.get_percentHeight() == null)) {
				if(style.initialHeight != null) {
					this.set_height(style.initialHeight);
					this._initialSizeApplied = true;
				} else if(style.initialPercentHeight != null) {
					this.set_percentHeight(style.initialPercentHeight);
					this._initialSizeApplied = true;
				}
			}
		}
		if(style.left != null) {
			this.set_left(style.left);
		}
		if(style.top != null) {
			this.set_top(style.top);
		}
		if(style.percentWidth != null) {
			this.set_componentWidth(null);
			this.set_percentWidth(style.percentWidth);
		}
		if(style.percentHeight != null) {
			this.set_componentHeight(null);
			this.set_percentHeight(style.percentHeight);
		}
		if(style.width != null) {
			this.set_percentWidth(null);
			this.set_width(style.width);
		}
		if(style.height != null) {
			this.set_percentHeight(null);
			this.set_height(style.height);
		}
		if(style.native != null) {
			this.set_native(style.native);
		}
		if(style.hidden != null) {
			this.set_hidden(style.hidden);
		}
		if(style.animationName != null) {
			var animationKeyFrames = haxe_ui_Toolkit.styleSheet.get_animations().h[style.animationName];
			this.applyAnimationKeyFrame(animationKeyFrames,style.animationOptions);
		} else if(this.get_componentAnimation() != null) {
			this.set_componentAnimation(null);
		}
		if(style.pointerEvents != null && style.pointerEvents != "none") {
			if(this.hasEvent("mouseover",$bind(this,this.onPointerEventsMouseOver)) == false) {
				if(style.cursor == null) {
					this.get_customStyle().cursor = "pointer";
				}
				this.registerEvent("mouseover",$bind(this,this.onPointerEventsMouseOver));
			}
			if(this.hasEvent("mouseout",$bind(this,this.onPointerEventsMouseOut)) == false) {
				this.registerEvent("mouseout",$bind(this,this.onPointerEventsMouseOut));
			}
			if(this.hasEvent("mousedown",$bind(this,this.onPointerEventsMouseDown)) == false) {
				this.registerEvent("mousedown",$bind(this,this.onPointerEventsMouseDown));
			}
			if(this.hasEvent("mouseup",$bind(this,this.onPointerEventsMouseUp)) == false) {
				this.registerEvent("mouseup",$bind(this,this.onPointerEventsMouseUp));
			}
			this.handleFrameworkProperty("allowMouseInteraction",true);
		} else if(style.pointerEvents != null) {
			if(this.hasEvent("mouseover",$bind(this,this.onPointerEventsMouseOver)) == true) {
				this.get_customStyle().cursor = null;
				this.unregisterEvent("mouseover",$bind(this,this.onPointerEventsMouseOver));
			}
			if(this.hasEvent("mouseout",$bind(this,this.onPointerEventsMouseOut)) == true) {
				this.unregisterEvent("mouseout",$bind(this,this.onPointerEventsMouseOut));
			}
			if(this.hasEvent("mousedown",$bind(this,this.onPointerEventsMouseDown)) == true) {
				this.unregisterEvent("mousedown",$bind(this,this.onPointerEventsMouseDown));
			}
			if(this.hasEvent("mouseup",$bind(this,this.onPointerEventsMouseUp)) == true) {
				this.unregisterEvent("mouseup",$bind(this,this.onPointerEventsMouseUp));
			}
			this.handleFrameworkProperty("allowMouseInteraction",false);
		}
		if(this.classes.indexOf("listview") != -1 || this.classes.indexOf("tableview") != -1 || this.classes.indexOf("treeview") != -1) {
			if(style.get_borderType() == haxe_ui_styles_StyleBorderType.None) {
				this.addClass("borderless");
			} else {
				this.removeClass("borderless");
			}
		}
		if(this._compositeBuilder != null) {
			this._compositeBuilder.applyStyle(style);
		}
	}
	,onPointerEventsMouseOver: function(e) {
		this.addClass(":hover",true,true);
	}
	,onPointerEventsMouseOut: function(e) {
		this.removeClass(":hover",true,true);
	}
	,onPointerEventsMouseDown: function(e) {
		this.addClass(":down",true,true);
	}
	,onPointerEventsMouseUp: function(e) {
		this.removeClass(":down",true,true);
	}
	,applyAnimationKeyFrame: function(animationKeyFrames,options) {
		var _gthis = this;
		if(this._animatable == false || options == null || options.duration == 0 || this._componentAnimation != null && this._componentAnimation.name == animationKeyFrames.id && options.compareToAnimation(this._componentAnimation) == true) {
			return;
		}
		if(this.hasEvent("animationstart")) {
			this.dispatch(new haxe_ui_events_AnimationEvent("animationstart"));
		}
		this.set_componentAnimation(haxe_ui_styles_animation_Animation.createWithKeyFrames(animationKeyFrames,this,options));
		this.get_componentAnimation().run(function() {
			if(_gthis.hasEvent("animationend")) {
				_gthis.dispatch(new haxe_ui_events_AnimationEvent("animationend"));
			}
		});
	}
	,cloneComponent: function() {
		var c = haxe_ui_backend_ComponentImpl.prototype.cloneComponent.call(this);
		c.set_hidden(this.get_hidden());
		if(this.get_styleNames() != null) {
			c.set_styleNames(this.get_styleNames());
		}
		if(this.get_styleString() != null) {
			c.set_styleString(this.get_styleString());
		}
		var tmp = this._ready == false;
		if(this.get_autoWidth() == false && this.get_width() > 0) {
			c.set_width(this.get_width());
		}
		if(this.get_autoHeight() == false && this.get_height() > 0) {
			c.set_height(this.get_height());
		}
		if(this.get_customStyle() != null) {
			if(c.get_customStyle() == null) {
				c.set_customStyle(new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null));
			}
			c.get_customStyle().apply(this.get_customStyle());
		}
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,get_isComponentClipped: function() {
		if(this._compositeBuilder != null) {
			return this._compositeBuilder.get_isComponentClipped();
		}
		return this.get_componentClipRect() != null;
	}
	,cssName: null
	,get_cssName: function() {
		var cssName = null;
		if(this._compositeBuilder != null) {
			cssName = this._compositeBuilder.get_cssName();
		}
		if(cssName == null) {
			var c = js_Boot.getClass(this);
			cssName = c.__name__.split(".").pop().toLowerCase();
		}
		return cssName;
	}
	,registerBehaviours: function() {
		haxe_ui_backend_ComponentImpl.prototype.registerBehaviours.call(this);
	}
	,get_color: function() {
		if(this.get_customStyle().color != null) {
			return this.get_customStyle().color;
		}
		if(this.get_style() == null || this.get_style().color == null) {
			return null;
		}
		return this.get_style().color;
	}
	,set_color: function(value) {
		if(this.get_customStyle().color == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().color = null;
		} else {
			this.get_customStyle().color = haxe_ui_util_Color.toInt(value);
		}
		this.invalidateComponent("style",false);
		return value;
	}
	,get_backgroundColor: function() {
		if(this.get_customStyle().backgroundColor != null) {
			return this.get_customStyle().backgroundColor;
		}
		if(this.get_style() == null || this.get_style().backgroundColor == null) {
			return null;
		}
		return this.get_style().backgroundColor;
	}
	,set_backgroundColor: function(value) {
		if(this.get_customStyle().backgroundColor == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().backgroundColor = null;
		} else {
			this.get_customStyle().backgroundColor = haxe_ui_util_Color.toInt(value);
		}
		this.invalidateComponent("style",false);
		return value;
	}
	,get_backgroundImage: function() {
		if(this.get_customStyle().backgroundImage != null) {
			return this.get_customStyle().backgroundImage;
		}
		if(this.get_style() == null || this.get_style().backgroundImage == null) {
			return null;
		}
		return this.get_style().backgroundImage;
	}
	,set_backgroundImage: function(value) {
		if(this.get_customStyle().backgroundImage == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().backgroundImage = null;
		} else {
			this.get_customStyle().backgroundImage = value;
		}
		this.invalidateComponent("style",false);
		return value;
	}
	,get_borderColor: function() {
		if(this.get_customStyle().borderColor != null) {
			return this.get_customStyle().borderColor;
		}
		if(this.get_style() == null || this.get_style().borderColor == null) {
			return null;
		}
		return this.get_style().borderColor;
	}
	,set_borderColor: function(value) {
		if(this.get_customStyle().borderColor == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().borderColor = null;
		} else {
			this.get_customStyle().borderColor = haxe_ui_util_Color.toInt(value);
		}
		this.get_customStyle().borderTopColor = haxe_ui_util_Color.toInt(value);
		this.get_customStyle().borderLeftColor = haxe_ui_util_Color.toInt(value);
		this.get_customStyle().borderBottomColor = haxe_ui_util_Color.toInt(value);
		this.get_customStyle().borderRightColor = haxe_ui_util_Color.toInt(value);
		this.invalidateComponent("style",false);
		return value;
	}
	,get_borderSize: function() {
		if(this.get_customStyle().borderSize != null) {
			return this.get_customStyle().borderSize;
		}
		if(this.get_style() == null || this.get_style().borderSize == null) {
			return null;
		}
		return this.get_style().borderSize;
	}
	,set_borderSize: function(value) {
		if(this.get_customStyle().borderSize == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().borderSize = null;
		} else {
			this.get_customStyle().borderSize = value;
		}
		this.get_customStyle().borderTopSize = value;
		this.get_customStyle().borderLeftSize = value;
		this.get_customStyle().borderBottomSize = value;
		this.get_customStyle().borderRightSize = value;
		this.invalidateComponent("style",false);
		return value;
	}
	,get_borderRadius: function() {
		if(this.get_customStyle().borderRadius != null) {
			return this.get_customStyle().borderRadius;
		}
		if(this.get_style() == null || this.get_style().borderRadius == null) {
			return null;
		}
		return this.get_style().borderRadius;
	}
	,set_borderRadius: function(value) {
		if(this.get_customStyle().borderRadius == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().borderRadius = null;
		} else {
			this.get_customStyle().borderRadius = value;
		}
		this.invalidateComponent("style",false);
		return value;
	}
	,get_padding: function() {
		if(this.get_customStyle().padding != null) {
			return this.get_customStyle().padding;
		}
		if(this.get_style() == null || this.get_style().padding == null) {
			return null;
		}
		return this.get_style().padding;
	}
	,set_padding: function(value) {
		if(this.get_customStyle().padding == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().set_padding(null);
		} else {
			this.get_customStyle().set_padding(value);
		}
		this.invalidateComponent("style",false);
		return value;
	}
	,get_paddingLeft: function() {
		if(this.get_customStyle().paddingLeft != null) {
			return this.get_customStyle().paddingLeft;
		}
		if(this.get_style() == null || this.get_style().paddingLeft == null) {
			return null;
		}
		return this.get_style().paddingLeft;
	}
	,set_paddingLeft: function(value) {
		if(this.get_customStyle().paddingLeft == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().paddingLeft = null;
		} else {
			this.get_customStyle().paddingLeft = value;
		}
		this.invalidateComponent("style",false);
		return value;
	}
	,get_paddingRight: function() {
		if(this.get_customStyle().paddingRight != null) {
			return this.get_customStyle().paddingRight;
		}
		if(this.get_style() == null || this.get_style().paddingRight == null) {
			return null;
		}
		return this.get_style().paddingRight;
	}
	,set_paddingRight: function(value) {
		if(this.get_customStyle().paddingRight == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().paddingRight = null;
		} else {
			this.get_customStyle().paddingRight = value;
		}
		this.invalidateComponent("style",false);
		return value;
	}
	,get_paddingTop: function() {
		if(this.get_customStyle().paddingTop != null) {
			return this.get_customStyle().paddingTop;
		}
		if(this.get_style() == null || this.get_style().paddingTop == null) {
			return null;
		}
		return this.get_style().paddingTop;
	}
	,set_paddingTop: function(value) {
		if(this.get_customStyle().paddingTop == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().paddingTop = null;
		} else {
			this.get_customStyle().paddingTop = value;
		}
		this.invalidateComponent("style",false);
		return value;
	}
	,get_paddingBottom: function() {
		if(this.get_customStyle().paddingBottom != null) {
			return this.get_customStyle().paddingBottom;
		}
		if(this.get_style() == null || this.get_style().paddingBottom == null) {
			return null;
		}
		return this.get_style().paddingBottom;
	}
	,set_paddingBottom: function(value) {
		if(this.get_customStyle().paddingBottom == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().paddingBottom = null;
		} else {
			this.get_customStyle().paddingBottom = value;
		}
		this.invalidateComponent("style",false);
		return value;
	}
	,get_marginLeft: function() {
		if(this.get_customStyle().marginLeft != null) {
			return this.get_customStyle().marginLeft;
		}
		if(this.get_style() == null || this.get_style().marginLeft == null) {
			return null;
		}
		return this.get_style().marginLeft;
	}
	,set_marginLeft: function(value) {
		if(this.get_customStyle().marginLeft == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().marginLeft = null;
		} else {
			this.get_customStyle().marginLeft = value;
		}
		this.invalidateComponent("style",false);
		return value;
	}
	,get_marginRight: function() {
		if(this.get_customStyle().marginRight != null) {
			return this.get_customStyle().marginRight;
		}
		if(this.get_style() == null || this.get_style().marginRight == null) {
			return null;
		}
		return this.get_style().marginRight;
	}
	,set_marginRight: function(value) {
		if(this.get_customStyle().marginRight == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().marginRight = null;
		} else {
			this.get_customStyle().marginRight = value;
		}
		this.invalidateComponent("style",false);
		return value;
	}
	,get_marginTop: function() {
		if(this.get_customStyle().marginTop != null) {
			return this.get_customStyle().marginTop;
		}
		if(this.get_style() == null || this.get_style().marginTop == null) {
			return null;
		}
		return this.get_style().marginTop;
	}
	,set_marginTop: function(value) {
		if(this.get_customStyle().marginTop == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().marginTop = null;
		} else {
			this.get_customStyle().marginTop = value;
		}
		this.invalidateComponent("style",false);
		return value;
	}
	,get_marginBottom: function() {
		if(this.get_customStyle().marginBottom != null) {
			return this.get_customStyle().marginBottom;
		}
		if(this.get_style() == null || this.get_style().marginBottom == null) {
			return null;
		}
		return this.get_style().marginBottom;
	}
	,set_marginBottom: function(value) {
		if(this.get_customStyle().marginBottom == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().marginBottom = null;
		} else {
			this.get_customStyle().marginBottom = value;
		}
		this.invalidateComponent("style",false);
		return value;
	}
	,get_clip: function() {
		if(this.get_customStyle().clip != null) {
			return this.get_customStyle().clip;
		}
		if(this.get_style() == null || this.get_style().clip == null) {
			return null;
		}
		return this.get_style().clip;
	}
	,set_clip: function(value) {
		if(this.get_customStyle().clip == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().clip = null;
		} else {
			this.get_customStyle().clip = value;
		}
		this.invalidateComponent("style",false);
		return value;
	}
	,get_opacity: function() {
		if(this.get_customStyle().opacity != null) {
			return this.get_customStyle().opacity;
		}
		if(this.get_style() == null || this.get_style().opacity == null) {
			return null;
		}
		return this.get_style().opacity;
	}
	,set_opacity: function(value) {
		if(this.get_customStyle().opacity == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().opacity = null;
		} else {
			this.get_customStyle().opacity = value;
		}
		this.invalidateComponent("style",false);
		return value;
	}
	,get_horizontalAlign: function() {
		if(this.get_customStyle().horizontalAlign != null) {
			return this.get_customStyle().horizontalAlign;
		}
		if(this.get_style() == null || this.get_style().horizontalAlign == null) {
			return null;
		}
		return this.get_style().horizontalAlign;
	}
	,set_horizontalAlign: function(value) {
		if(this.get_customStyle().horizontalAlign == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().horizontalAlign = null;
		} else {
			this.get_customStyle().horizontalAlign = value;
		}
		this.invalidateComponent("style",false);
		if(this.parentComponent != null) {
			var _this = this.parentComponent;
			if(!(_this._layout == null || _this._layoutLocked == true)) {
				_this.invalidateComponent("layout",false);
			}
		}
		return value;
	}
	,get_verticalAlign: function() {
		if(this.get_customStyle().verticalAlign != null) {
			return this.get_customStyle().verticalAlign;
		}
		if(this.get_style() == null || this.get_style().verticalAlign == null) {
			return null;
		}
		return this.get_style().verticalAlign;
	}
	,set_verticalAlign: function(value) {
		if(this.get_customStyle().verticalAlign == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().verticalAlign = null;
		} else {
			this.get_customStyle().verticalAlign = value;
		}
		this.invalidateComponent("style",false);
		if(this.parentComponent != null) {
			var _this = this.parentComponent;
			if(!(_this._layout == null || _this._layoutLocked == true)) {
				_this.invalidateComponent("layout",false);
			}
		}
		return value;
	}
	,self: function() {
		return new haxe_ui_core_Component();
	}
	,_internal__onDragStart: null
	,onDragStart: null
	,set_onDragStart: function(value) {
		if(this._internal__onDragStart != null) {
			this.unregisterEvent("dragStart",this._internal__onDragStart);
			this._internal__onDragStart = null;
		}
		if(value != null) {
			this._internal__onDragStart = value;
			this.registerEvent("dragStart",value);
		}
		return value;
	}
	,_internal__onDrag: null
	,onDrag: null
	,set_onDrag: function(value) {
		if(this._internal__onDrag != null) {
			this.unregisterEvent("drag",this._internal__onDrag);
			this._internal__onDrag = null;
		}
		if(value != null) {
			this._internal__onDrag = value;
			this.registerEvent("drag",value);
		}
		return value;
	}
	,_internal__onDragEnd: null
	,onDragEnd: null
	,set_onDragEnd: function(value) {
		if(this._internal__onDragEnd != null) {
			this.unregisterEvent("dragEnd",this._internal__onDragEnd);
			this._internal__onDragEnd = null;
		}
		if(value != null) {
			this._internal__onDragEnd = value;
			this.registerEvent("dragEnd",value);
		}
		return value;
	}
	,_internal__onAnimationStart: null
	,onAnimationStart: null
	,set_onAnimationStart: function(value) {
		if(this._internal__onAnimationStart != null) {
			this.unregisterEvent("animationstart",this._internal__onAnimationStart);
			this._internal__onAnimationStart = null;
		}
		if(value != null) {
			this._internal__onAnimationStart = value;
			this.registerEvent("animationstart",value);
		}
		return value;
	}
	,_internal__onAnimationEnd: null
	,onAnimationEnd: null
	,set_onAnimationEnd: function(value) {
		if(this._internal__onAnimationEnd != null) {
			this.unregisterEvent("animationend",this._internal__onAnimationEnd);
			this._internal__onAnimationEnd = null;
		}
		if(value != null) {
			this._internal__onAnimationEnd = value;
			this.registerEvent("animationend",value);
		}
		return value;
	}
	,_internal__onClick: null
	,onClick: null
	,set_onClick: function(value) {
		if(this._internal__onClick != null) {
			this.unregisterEvent("click",this._internal__onClick);
			this._internal__onClick = null;
		}
		if(value != null) {
			this._internal__onClick = value;
			this.registerEvent("click",value);
		}
		return value;
	}
	,_internal__onMouseOver: null
	,onMouseOver: null
	,set_onMouseOver: function(value) {
		if(this._internal__onMouseOver != null) {
			this.unregisterEvent("mouseover",this._internal__onMouseOver);
			this._internal__onMouseOver = null;
		}
		if(value != null) {
			this._internal__onMouseOver = value;
			this.registerEvent("mouseover",value);
		}
		return value;
	}
	,_internal__onMouseOut: null
	,onMouseOut: null
	,set_onMouseOut: function(value) {
		if(this._internal__onMouseOut != null) {
			this.unregisterEvent("mouseout",this._internal__onMouseOut);
			this._internal__onMouseOut = null;
		}
		if(value != null) {
			this._internal__onMouseOut = value;
			this.registerEvent("mouseout",value);
		}
		return value;
	}
	,_internal__onDblClick: null
	,onDblClick: null
	,set_onDblClick: function(value) {
		if(this._internal__onDblClick != null) {
			this.unregisterEvent("doubleclick",this._internal__onDblClick);
			this._internal__onDblClick = null;
		}
		if(value != null) {
			this._internal__onDblClick = value;
			this.registerEvent("doubleclick",value);
		}
		return value;
	}
	,_internal__onRightClick: null
	,onRightClick: null
	,set_onRightClick: function(value) {
		if(this._internal__onRightClick != null) {
			this.unregisterEvent("rightclick",this._internal__onRightClick);
			this._internal__onRightClick = null;
		}
		if(value != null) {
			this._internal__onRightClick = value;
			this.registerEvent("rightclick",value);
		}
		return value;
	}
	,_internal__onChange: null
	,onChange: null
	,set_onChange: function(value) {
		if(this._internal__onChange != null) {
			this.unregisterEvent("change",this._internal__onChange);
			this._internal__onChange = null;
		}
		if(value != null) {
			this._internal__onChange = value;
			this.registerEvent("change",value);
		}
		return value;
	}
	,__class__: haxe_ui_core_Component
	,__properties__: $extend(haxe_ui_backend_ComponentImpl.prototype.__properties__,{set_onChange:"set_onChange",set_onRightClick:"set_onRightClick",set_onDblClick:"set_onDblClick",set_onMouseOut:"set_onMouseOut",set_onMouseOver:"set_onMouseOver",set_onClick:"set_onClick",set_onAnimationEnd:"set_onAnimationEnd",set_onAnimationStart:"set_onAnimationStart",set_onDragEnd:"set_onDragEnd",set_onDrag:"set_onDrag",set_onDragStart:"set_onDragStart",set_verticalAlign:"set_verticalAlign",get_verticalAlign:"get_verticalAlign",set_horizontalAlign:"set_horizontalAlign",get_horizontalAlign:"get_horizontalAlign",set_opacity:"set_opacity",get_opacity:"get_opacity",set_clip:"set_clip",get_clip:"get_clip",set_marginBottom:"set_marginBottom",get_marginBottom:"get_marginBottom",set_marginTop:"set_marginTop",get_marginTop:"get_marginTop",set_marginRight:"set_marginRight",get_marginRight:"get_marginRight",set_marginLeft:"set_marginLeft",get_marginLeft:"get_marginLeft",set_paddingBottom:"set_paddingBottom",get_paddingBottom:"get_paddingBottom",set_paddingTop:"set_paddingTop",get_paddingTop:"get_paddingTop",set_paddingRight:"set_paddingRight",get_paddingRight:"get_paddingRight",set_paddingLeft:"set_paddingLeft",get_paddingLeft:"get_paddingLeft",set_padding:"set_padding",get_padding:"get_padding",set_borderRadius:"set_borderRadius",get_borderRadius:"get_borderRadius",set_borderSize:"set_borderSize",get_borderSize:"get_borderSize",set_borderColor:"set_borderColor",get_borderColor:"get_borderColor",set_backgroundImage:"set_backgroundImage",get_backgroundImage:"get_backgroundImage",set_backgroundColor:"set_backgroundColor",get_backgroundColor:"get_backgroundColor",set_color:"set_color",get_color:"get_color",get_cssName:"get_cssName",get_namedComponents:"get_namedComponents",set_scriptAccess:"set_scriptAccess",get_scriptAccess:"get_scriptAccess",set_layout:"set_layout",get_layout:"get_layout",set_includeInLayout:"set_includeInLayout",get_includeInLayout:"get_includeInLayout",set_styleSheet:"set_styleSheet",get_styleSheet:"get_styleSheet",set_styleString:"set_styleString",get_styleString:"get_styleString",set_styleNames:"set_styleNames",get_styleNames:"get_styleNames",set_customStyle:"set_customStyle",get_customStyle:"get_customStyle",set_hidden:"set_hidden",get_hidden:"get_hidden",get_numComponents:"get_numComponents",get_rootComponent:"get_rootComponent",set_dragOptions:"set_dragOptions",get_dragOptions:"get_dragOptions",set_dragInitiator:"set_dragInitiator",get_dragInitiator:"get_dragInitiator",set_draggable:"set_draggable",get_draggable:"get_draggable",get_screen:"get_screen",set_componentAnimation:"set_componentAnimation",get_componentAnimation:"get_componentAnimation",set_animatable:"set_animatable",get_animatable:"get_animatable",set_native:"set_native",get_native:"get_native"})
});
var haxe_ui_containers_Box = function() {
	this._direction = null;
	haxe_ui_core_Component.call(this);
};
$hxClasses["haxe.ui.containers.Box"] = haxe_ui_containers_Box;
haxe_ui_containers_Box.__name__ = "haxe.ui.containers.Box";
haxe_ui_containers_Box.__super__ = haxe_ui_core_Component;
haxe_ui_containers_Box.prototype = $extend(haxe_ui_core_Component.prototype,{
	_layoutName: null
	,get_layoutName: function() {
		return this._layoutName;
	}
	,set_layoutName: function(value) {
		if(this._layoutName == value) {
			return value;
		}
		this._layoutName = value;
		this.set_layout(haxe_ui_layouts_LayoutFactory.createFromName(this.get_layoutName()));
		return value;
	}
	,createDefaults: function() {
		haxe_ui_core_Component.prototype.createDefaults.call(this);
		if(this._defaultLayoutClass == null) {
			this._defaultLayoutClass = haxe_ui_layouts_DefaultLayout;
		}
	}
	,_direction: null
	,applyStyle: function(style) {
		haxe_ui_core_Component.prototype.applyStyle.call(this,style);
		if(style.direction != null && style.direction != this._direction) {
			this._direction = style.direction;
			this.set_layout(haxe_ui_layouts_LayoutFactory.createFromName(this._direction));
		}
	}
	,registerComposite: function() {
		haxe_ui_core_Component.prototype.registerComposite.call(this);
		this._defaultLayoutClass = haxe_ui_layouts_DefaultLayout;
	}
	,registerBehaviours: function() {
		haxe_ui_core_Component.prototype.registerBehaviours.call(this);
		this.behaviours.register("icon",haxe_ui_behaviours_DefaultBehaviour);
	}
	,get_icon: function() {
		return haxe_ui_util_Variant.toString(this.behaviours.get("icon"));
	}
	,set_icon: function(value) {
		var _g = Type.typeof(value);
		if(_g._hx_index == 6) {
			if(_g.c == String) {
				if(value != null && value.indexOf("{{") != -1 && value.indexOf("}}") != -1) {
					haxe_ui_locale_LocaleManager.get_instance().registerComponent(this,"icon",null,value);
					return value;
				}
			}
		}
		this.behaviours.set("icon",haxe_ui_util_Variant.fromString(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"icon"));
		return value;
	}
	,cloneComponent: function() {
		var c = haxe_ui_core_Component.prototype.cloneComponent.call(this);
		if(this.get_layoutName() != null) {
			c.set_layoutName(this.get_layoutName());
		}
		if(this.get_icon() != null) {
			c.set_icon(this.get_icon());
		}
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_containers_Box();
	}
	,__class__: haxe_ui_containers_Box
	,__properties__: $extend(haxe_ui_core_Component.prototype.__properties__,{set_icon:"set_icon",get_icon:"get_icon",set_layoutName:"set_layoutName",get_layoutName:"get_layoutName"})
});
var haxe_ui_Preloader = function() {
	haxe_ui_containers_Box.call(this);
	this.set_id("preloader");
	this.set_styleString("width:100%;height:100%;");
	this.set_styleNames("default-background");
};
$hxClasses["haxe.ui.Preloader"] = haxe_ui_Preloader;
haxe_ui_Preloader.__name__ = "haxe.ui.Preloader";
haxe_ui_Preloader.__super__ = haxe_ui_containers_Box;
haxe_ui_Preloader.prototype = $extend(haxe_ui_containers_Box.prototype,{
	createChildren: function() {
		var label = new haxe_ui_components_Label();
		label.set_text("Loading");
		label.set_verticalAlign("center");
		label.set_horizontalAlign("center");
		this.addComponent(label);
	}
	,validateComponentLayout: function() {
		var b = haxe_ui_containers_Box.prototype.validateComponentLayout.call(this);
		var tmp = this.get_actualComponentWidth() > 0 && this.get_actualComponentHeight() > 0;
		return b;
	}
	,_current: null
	,_max: null
	,progress: function(current,max) {
		this._current = current;
		this._max = max;
		if(current > 0) {
			var label = this.findComponent(null,haxe_ui_components_Label);
			var text = label.get_text();
			if(StringTools.endsWith(text,"....")) {
				text = "Loading";
			}
			label.set_text(text);
		}
	}
	,increment: function() {
		this.progress(this._current + 1,this._max);
	}
	,complete: function() {
		haxe_ui_core_Screen.get_instance().removeComponent(this);
	}
	,registerBehaviours: function() {
		haxe_ui_containers_Box.prototype.registerBehaviours.call(this);
	}
	,cloneComponent: function() {
		var c = haxe_ui_containers_Box.prototype.cloneComponent.call(this);
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_Preloader();
	}
	,__class__: haxe_ui_Preloader
});
var haxe_ui_util_Properties = function() {
	this._props = new haxe_ds_StringMap();
};
$hxClasses["haxe.ui.util.Properties"] = haxe_ui_util_Properties;
haxe_ui_util_Properties.__name__ = "haxe.ui.util.Properties";
haxe_ui_util_Properties.prototype = {
	_props: null
	,exists: function(name) {
		return Object.prototype.hasOwnProperty.call(this._props.h,name);
	}
	,getProp: function(name,defaultValue) {
		var v = defaultValue;
		if(Object.prototype.hasOwnProperty.call(this._props.h,name)) {
			v = this._props.h[name];
		}
		return v;
	}
	,getPropInt: function(name,defaultValue) {
		if(defaultValue == null) {
			defaultValue = 0;
		}
		var v = defaultValue;
		var stringValue = this.getProp(name);
		if(stringValue != null) {
			v = Std.parseInt(stringValue);
		}
		return v;
	}
	,getPropBool: function(name,defaultValue) {
		if(defaultValue == null) {
			defaultValue = false;
		}
		var v = defaultValue;
		var stringValue = this.getProp(name);
		if(stringValue != null) {
			v = stringValue == "true";
		}
		return v;
	}
	,getPropCol: function(name,defaultValue) {
		if(defaultValue == null) {
			defaultValue = 0;
		}
		var v = defaultValue;
		var stringValue = this.getProp(name);
		if(stringValue != null) {
			var s = stringValue;
			if(StringTools.startsWith(s,"#")) {
				s = s.substring(1,s.length);
			} else if(StringTools.startsWith(s,"0x")) {
				s = s.substring(2,s.length);
			}
			v = Std.parseInt("0x" + s);
		}
		return v;
	}
	,setProp: function(name,value) {
		this._props.h[name] = value;
	}
	,names: function() {
		return new haxe_ds__$StringMap_StringMapKeyIterator(this._props.h);
	}
	,addAll: function(p) {
		var name = p.names();
		while(name.hasNext()) {
			var name1 = name.next();
			var this1 = this._props;
			var value = p.getProp(name1);
			this1.h[name1] = value;
		}
	}
	,__class__: haxe_ui_util_Properties
};
var haxe_ui_util_GenericConfig = function() {
	this.values = new haxe_ds_StringMap();
	this.sections = new haxe_ds_StringMap();
};
$hxClasses["haxe.ui.util.GenericConfig"] = haxe_ui_util_GenericConfig;
haxe_ui_util_GenericConfig.__name__ = "haxe.ui.util.GenericConfig";
haxe_ui_util_GenericConfig.prototype = {
	values: null
	,sections: null
	,addSection: function(name) {
		var config = new haxe_ui_util_GenericConfig();
		var array = this.sections.h[name];
		if(array == null) {
			array = [];
			this.sections.h[name] = array;
		}
		array.push(config);
		return config;
	}
	,findBy: function(section,field,value) {
		var array = this.sections.h[section];
		if(array == null) {
			return null;
		}
		if(field == null && value == null) {
			return array[0];
		}
		var r = null;
		var _g = 0;
		while(_g < array.length) {
			var item = array[_g];
			++_g;
			var h = item.values.h;
			var key_h = h;
			var key_keys = Object.keys(h);
			var key_length = key_keys.length;
			var key_current = 0;
			while(key_current < key_length) {
				var key = key_keys[key_current++];
				if(key == field && item.values.h[key] == value) {
					r = item;
					break;
				}
			}
			if(r != null) {
				break;
			}
		}
		return r;
	}
	,queryBool: function(q,defaultValue,conditionRef) {
		if(defaultValue == null) {
			defaultValue = false;
		}
		var r = this.query(q,null,conditionRef);
		if(r == null) {
			return defaultValue;
		}
		return r == "true";
	}
	,query: function(q,defaultValue,conditionRef) {
		if(Object.prototype.hasOwnProperty.call(haxe_ui_util_GenericConfig.cache.h,q)) {
			if(defaultValue != null && haxe_ui_util_GenericConfig.cache.h[q] == null) {
				return defaultValue;
			}
			return haxe_ui_util_GenericConfig.cache.h[q];
		}
		var regexp = new EReg("\\.(?![^\\[]*\\])","g");
		var finalArray = regexp.split(q);
		var ref = this;
		var value = null;
		var _g = 0;
		while(_g < finalArray.length) {
			var f = finalArray[_g];
			++_g;
			if(f.indexOf("[") == -1 && f.indexOf("@") == -1) {
				ref = ref.findBy(f);
			} else if(f.indexOf("[") != -1) {
				var p = f.split("[");
				var p1 = p[0];
				var p2 = p[1].split("=")[0];
				var p3 = p[1].split("=")[1];
				p3 = HxOverrides.substr(p3,0,p3.length - 1);
				ref = ref.findBy(p1,p2,p3);
			} else if(f.indexOf("@") != -1) {
				var v = HxOverrides.substr(f,1,f.length);
				value = ref.values.h[v];
				break;
			}
			if(ref == null) {
				haxe_ui_util_GenericConfig.cache.h[q] = defaultValue;
				return defaultValue;
			}
		}
		if(value == null) {
			value = defaultValue;
		}
		if(value != null) {
			haxe_ui_util_GenericConfig.cache.h[q] = value;
		}
		return value;
	}
	,queryValues: function(q,conditionRef) {
		var regexp = new EReg("\\.(?![^\\[]*\\])","g");
		var finalArray = regexp.split(q);
		var ref = this;
		var _g = 0;
		while(_g < finalArray.length) {
			var f = finalArray[_g];
			++_g;
			if(f.indexOf("[") == -1 && f.indexOf("@") == -1) {
				ref = ref.findBy(f);
			} else if(f.indexOf("[") != -1) {
				var p = f.split("[");
				var p1 = p[0];
				var p2 = p[1].split("=")[0];
				var p3 = p[1].split("=")[1];
				p3 = HxOverrides.substr(p3,0,p3.length - 1);
				ref = ref.findBy(p1,p2,p3);
			}
			if(ref == null) {
				return null;
			}
		}
		return ref.values;
	}
	,__class__: haxe_ui_util_GenericConfig
};
var haxe_ui_styles_CompositeStyleSheet = function() {
	this._animations = null;
	this._styleSheets = [];
};
$hxClasses["haxe.ui.styles.CompositeStyleSheet"] = haxe_ui_styles_CompositeStyleSheet;
haxe_ui_styles_CompositeStyleSheet.__name__ = "haxe.ui.styles.CompositeStyleSheet";
haxe_ui_styles_CompositeStyleSheet.prototype = {
	_styleSheets: null
	,_animations: null
	,get_animations: function() {
		if(this._animations != null) {
			return this._animations;
		}
		this._animations = new haxe_ds_StringMap();
		var _g = 0;
		var _g1 = this._styleSheets;
		while(_g < _g1.length) {
			var s = _g1[_g];
			++_g;
			var h = s.get_animations().h;
			var key_h = h;
			var key_keys = Object.keys(h);
			var key_length = key_keys.length;
			var key_current = 0;
			while(key_current < key_length) {
				var key = key_keys[key_current++];
				var a = s.get_animations().h[key];
				this._animations.h[key] = a;
			}
		}
		return this._animations;
	}
	,findAnimation: function(id) {
		var h = this.get_animations().h;
		var a_h = h;
		var a_keys = Object.keys(h);
		var a_length = a_keys.length;
		var a_current = 0;
		while(a_current < a_length) {
			var a = a_h[a_keys[a_current++]];
			if(a.id == id) {
				return a;
			}
		}
		return null;
	}
	,hasMediaQueries: null
	,get_hasMediaQueries: function() {
		var _g = 0;
		var _g1 = this._styleSheets;
		while(_g < _g1.length) {
			var styleSheet = _g1[_g];
			++_g;
			if(styleSheet.get_hasMediaQueries() == true) {
				return true;
			}
		}
		return false;
	}
	,getAnimation: function(id,create) {
		if(create == null) {
			create = true;
		}
		var a = this.findAnimation(id);
		if(a == null) {
			a = new haxe_ui_styles_elements_AnimationKeyFrames(id,[]);
			this.addAnimation(a);
		}
		return a;
	}
	,addAnimation: function(animation) {
		this._styleSheets[0].addAnimation(animation);
	}
	,addStyleSheet: function(styleSheet) {
		this._styleSheets.push(styleSheet);
	}
	,removeStyleSheet: function(styleSheet) {
		HxOverrides.remove(this._styleSheets,styleSheet);
	}
	,parse: function(css,styleSheetName,invalidateAll) {
		if(invalidateAll == null) {
			invalidateAll = false;
		}
		if(styleSheetName == null) {
			styleSheetName = "default";
		}
		var s = this.findStyleSheet(styleSheetName);
		if(s == null) {
			s = new haxe_ui_styles_StyleSheet();
			s.name = styleSheetName;
			this._styleSheets.push(s);
		}
		s.parse(css);
		this._animations = null;
		if(invalidateAll == true) {
			haxe_ui_core_Screen.get_instance().invalidateAll();
		}
	}
	,findStyleSheet: function(styleSheetName) {
		var _g = 0;
		var _g1 = this._styleSheets;
		while(_g < _g1.length) {
			var s = _g1[_g];
			++_g;
			if(s.name == styleSheetName) {
				return s;
			}
		}
		return null;
	}
	,findRule: function(selector) {
		var _g = 0;
		var _g1 = this._styleSheets;
		while(_g < _g1.length) {
			var s = _g1[_g];
			++_g;
			var el = s.findRule(selector);
			if(el != null) {
				return el;
			}
		}
		return null;
	}
	,findMatchingRules: function(selector) {
		var m = [];
		var _g = 0;
		var _g1 = this._styleSheets;
		while(_g < _g1.length) {
			var s = _g1[_g];
			++_g;
			m = m.concat(s.findMatchingRules(selector));
		}
		return m;
	}
	,getAllRules: function() {
		var r = [];
		var _g = 0;
		var _g1 = this._styleSheets;
		while(_g < _g1.length) {
			var s = _g1[_g];
			++_g;
			r = r.concat(s.get_rules());
		}
		return r;
	}
	,buildStyleFor: function(c) {
		var style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		var _g = 0;
		var _g1 = this._styleSheets;
		while(_g < _g1.length) {
			var s = _g1[_g];
			++_g;
			style = s.buildStyleFor(c,style);
		}
		return style;
	}
	,clear: function(styleSheetName) {
		var s = this.findStyleSheet(styleSheetName);
		if(s != null) {
			s.clear();
			this._animations = null;
		}
	}
	,__class__: haxe_ui_styles_CompositeStyleSheet
	,__properties__: {get_hasMediaQueries:"get_hasMediaQueries",get_animations:"get_animations"}
};
var haxe_ui_Toolkit = function() { };
$hxClasses["haxe.ui.Toolkit"] = haxe_ui_Toolkit;
haxe_ui_Toolkit.__name__ = "haxe.ui.Toolkit";
haxe_ui_Toolkit.__properties__ = {set_scale:"set_scale",get_scale:"get_scale",set_scaleY:"set_scaleY",get_scaleY:"get_scaleY",set_scaleX:"set_scaleX",get_scaleX:"get_scaleX",get_autoScaleDPIThreshold:"get_autoScaleDPIThreshold",set_pixelsPerRem:"set_pixelsPerRem",get_screen:"get_screen",get_assets:"get_assets",get_initialized:"get_initialized",get_backendProperties:"get_backendProperties",set_theme:"set_theme",get_theme:"get_theme"};
haxe_ui_Toolkit.get_theme = function() {
	return haxe_ui_Toolkit._theme;
};
haxe_ui_Toolkit.set_theme = function(value) {
	if(haxe_ui_Toolkit._theme == value) {
		return value;
	}
	haxe_ui_Toolkit._theme = value;
	if(haxe_ui_Toolkit._initialized == true) {
		haxe_ui_themes_ThemeManager.get_instance().applyTheme(haxe_ui_Toolkit._theme);
		haxe_ui_core_Screen.get_instance().onThemeChanged();
		haxe_ui_core_Screen.get_instance().invalidateAll();
	}
	return value;
};
haxe_ui_Toolkit.get_backendProperties = function() {
	haxe_ui_Toolkit.buildBackend();
	return haxe_ui_Toolkit._backendProperties;
};
haxe_ui_Toolkit.build = function() {
	if(haxe_ui_Toolkit._built == true) {
		return;
	}
	haxe_ui_themes_ThemeManager.get_instance().getTheme("native").parent = "default";
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("native","haxeui-core/styles/native/main.css",-3.);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("global","haxeui-core/styles/global.css",-4.);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/main.css",-3.);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/buttons.css",-2.99);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/dialogs.css",-2.9800000000000004);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/textinputs.css",-2.9700000000000006);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/scrollbars.css",-2.9600000000000009);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/scrollview.css",-2.9500000000000011);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/checkboxes.css",-2.9400000000000013);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/optionboxes.css",-2.9300000000000015);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/ranges.css",-2.9200000000000017);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/progressbars.css",-2.9100000000000019);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/sliders.css",-2.9000000000000021);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/steppers.css",-2.8900000000000023);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/tabs.css",-2.8800000000000026);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/listview.css",-2.8700000000000028);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/dropdowns.css",-2.860000000000003);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/tableview.css",-2.8500000000000032);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/switches.css",-2.8400000000000034);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/calendars.css",-2.8300000000000036);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/menus.css",-2.8200000000000038);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/accordion.css",-2.8100000000000041);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/propertygrids.css",-2.8000000000000043);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/frames.css",-2.7900000000000045);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/splitters.css",-2.7800000000000047);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/tooltips.css",-2.7700000000000049);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/rules.css",-2.7600000000000051);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/sidebars.css",-2.7500000000000053);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/cards.css",-2.7400000000000055);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/treeviews.css",-2.7300000000000058);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","haxeui-core/styles/default/last.css",-2.720000000000006);
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","warning-large","haxeui-core/styles/shared/warning-large.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","tooltip-background-color","#fffff8");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","tertiary-background-color","#ffffff");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","sort-desc","haxeui-core/styles/shared/sortable-desc-blue.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","sort-asc","haxeui-core/styles/shared/sortable-asc-blue.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","solid-background-color-hover","#fcfcfc");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","solid-background-color-down","#f0f0f0");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","solid-background-color-disabled","#fefefe");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","solid-background-color-alt","#fafafa");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","solid-background-color","#f6f6f6");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","selection-text-color","#ffffff");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","selection-background-color-hover","#d9e5f2");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","selection-background-color","#b4cbe4");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","secondary-background-color","#ffffff");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","search","haxeui-core/styles/shared/search.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","scrollbar-button-color","#d6d6d6");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","scrollbar-background-color","#f0f0f0");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","question-large","haxeui-core/styles/shared/help-large.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","option-selected","haxeui-core/styles/shared/option-blue.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","normal-text-color","#666666");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","normal-inner-shadow","drop-shadow(1, 45, #888888, 0.1, 1, 1, 1, 3, true)");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","normal-border-size","1px");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","normal-border-radius","2px");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","normal-border-color","#d2d2d2");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","normal-background-color-start","#fdfdfd");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","normal-background-color-end","#f6f6f6");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","modal-background-color","#ffffff");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","menu-shadow","drop-shadow(2, 45, #888888, 0.1, 4, 1, 30, 35, false)");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","lighter-text-color","#a0a0a0");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","info-large","haxeui-core/styles/shared/info-large.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","hover-text-color","#444444");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","hover-border-color","#c0c0c0");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","hover-background-color-start","#f2f2f2");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","hover-background-color-end","#e1e1e1");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","gripper-vertical","haxeui-core/styles/shared/gripper-vertical.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","gripper-horizontal","haxeui-core/shared/default/gripper-horizontal.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","expanded","haxeui-core/styles/shared/collapsed-blue.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","error-text-color","#ff0000");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","error-large","haxeui-core/styles/shared/error-large.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","error-background-color","#ffdddd");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","down-text-color","#444444");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","down-border-color","#b3b3b3");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","down-background-color-start","#e6e6e6");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","down-background-color-end","#cccccc");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","disabled-text-color","#cccccc");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","disabled-border-color","#e4e4e4");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","disabled-background-color-start","#fdfdfd");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","disabled-background-color-end","#f6f6f6");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","dialog-title-color","#aaaaaa");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","dialog-shadow","drop-shadow(1, 45, #888888, 0.2, 30, 2, 1, 3, false)");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","default-background-color","#ffffff");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","collapsed","haxeui-core/styles/shared/expanded-blue.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","close-hover","haxeui-core/styles/shared/close-button-white.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","close","haxeui-core/styles/shared/close-button-blue.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","check-selected","haxeui-core/styles/shared/check-blue.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","blank","haxeui-core/styles/shared/blank.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","arrow-up-down","haxeui-core/styles/shared/sortable-arrows-blue.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","arrow-up","haxeui-core/styles/shared/up-arrow-blue.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","arrow-right-square","haxeui-core/styles/shared/right-arrow-square-blue.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","arrow-right","haxeui-core/styles/shared/right-arrow-blue.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","arrow-left","haxeui-core/styles/shared/left-arrow-blue.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","arrow-down-square","haxeui-core/styles/shared/down-arrow-square-blue.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","arrow-down","haxeui-core/styles/shared/down-arrow-blue.png");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","accent-gradient-start","#98c4e6");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","accent-gradient-end","#549bde");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","accent-color-lighter","#ecf2f9");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","accent-color-darker","#407dbf");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("default","accent-color","#83aad4");
	haxe_ui_themes_ThemeManager.get_instance().getTheme("dark").parent = "default";
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","tooltip-background-color","#2c2f30");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","tertiary-background-color","#313435");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","solid-background-color-hover","#393b3c");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","solid-background-color-down","#313335");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","solid-background-color-disabled","#2f3132");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","solid-background-color-alt","#2d2e2f");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","solid-background-color","#3d3f41");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","selection-text-color","#d4d4d4");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","selection-background-color-hover","#323e52");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","selection-background-color","#415982");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","secondary-background-color","#3d3f41");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","scrollbar-button-color","#3e4142");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","scrollbar-background-color","#2c2f30");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","normal-text-color","#aaaaaa");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","normal-inner-shadow","drop-shadow(1, 45, #000000, 0.2, 2, 2, 1, 3, true)");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","normal-border-size","1px");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","normal-border-radius","2px");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","normal-border-color","#222426");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","normal-background-color-start","#3e4142");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","normal-background-color-end","#36383a");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","modal-background-color","#181a1b");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","menu-shadow","drop-shadow(2, 45, #000000, 0.15, 6, 1, 30, 35, false)");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","lighter-text-color","#737373");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","hover-text-color","#bbbbbb");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","hover-border-color","#222426");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","hover-background-color-start","#434647");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","hover-background-color-end","#393b3c");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","error-text-color","#ff0000");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","error-background-color","#ffdddd");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","down-text-color","#aaaaaa");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","down-border-color","#222426");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","down-background-color-start","#2f3132");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","down-background-color-end","#27292a");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","disabled-text-color","#595959");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","disabled-border-color","#26292b");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","disabled-background-color-start","#36393a");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","disabled-background-color-end","#313335");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","dialog-title-color","#aaaaaa");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","dialog-shadow","drop-shadow(1, 45, #000000, 0.2, 30, 2, 1, 3, false)");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","default-background-color","#2c2f30");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","accent-gradient-start","#334666");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","accent-gradient-end","#2f3746");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","accent-color-lighter","#323e52");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","accent-color-darker","#407dbf");
	haxe_ui_themes_ThemeManager.get_instance().setThemeVar("dark","accent-color","#415982");
	haxe_ui_locale_LocaleManager.get_instance().parseResource("en","haxeui-core/locale/en/dialog.properties");
	haxe_ui_locale_LocaleManager.get_instance().parseResource("es","haxeui-core/locale/es/dialog.properties");
	haxe_ui_locale_LocaleManager.get_instance().parseResource("de","haxeui-core/locale/de/dialog.properties");
	haxe_ui_locale_LocaleManager.get_instance().parseResource("fr","haxeui-core/locale/fr/dialog.properties");
	haxe_ui_locale_LocaleManager.get_instance().parseResource("it","haxeui-core/locale/it/dialog.properties");
	haxe_ui_actions_ActionManager.get_instance().registerInputSource(new haxe_ui_actions_KeyboardActionInputSource());
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("native","styles/native/main.css",-1);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("global","styles/main.css",-2);
	haxe_ui_themes_ThemeManager.get_instance().addStyleResource("default","styles/default/main.css",-1);
	haxe_ui_core_ComponentClassMap.register("vbox","haxe.ui.containers.VBox");
	haxe_ui_core_ComponentClassMap.register("tableview","haxe.ui.containers.TableView");
	haxe_ui_core_ComponentClassMap.register("tabbar","haxe.ui.components.TabBar");
	haxe_ui_core_ComponentClassMap.register("sectionheader","haxe.ui.components.SectionHeader");
	haxe_ui_core_ComponentClassMap.register("maincalculatorview","view.MainCalculatorView");
	haxe_ui_core_ComponentClassMap.register("label","haxe.ui.components.Label");
	haxe_ui_core_ComponentClassMap.register("header","haxe.ui.containers.Header");
	haxe_ui_core_ComponentClassMap.register("hbox","haxe.ui.containers.HBox");
	haxe_ui_core_ComponentClassMap.register("column","haxe.ui.components.Column");
	haxe_ui_core_ComponentClassMap.register("button","haxe.ui.components.Button");
	haxe_ui_core_ComponentClassMap.register("box","haxe.ui.containers.Box");
	haxe_ui_Toolkit.buildBackend();
	haxe_ui_Toolkit._built = true;
};
haxe_ui_Toolkit.buildBackend = function() {
	if(haxe_ui_Toolkit._backendBuilt == true) {
		return;
	}
	haxe_ui_util_Defines.set("windows","1");
	haxe_ui_util_Defines.set("utf16","1");
	haxe_ui_util_Defines.set("true","1");
	haxe_ui_util_Defines.set("target.utf16","true");
	haxe_ui_util_Defines.set("target.unicode","true");
	haxe_ui_util_Defines.set("target.name","js");
	haxe_ui_util_Defines.set("source_header","Generated by Haxe 4.2.4");
	haxe_ui_util_Defines.set("libnoise","1.0.0");
	haxe_ui_util_Defines.set("js_es5","1");
	haxe_ui_util_Defines.set("js_es","5");
	haxe_ui_util_Defines.set("js-es5","1");
	haxe_ui_util_Defines.set("js","1");
	haxe_ui_util_Defines.set("hxSet","1.5.0");
	haxe_ui_util_Defines.set("html5","1.4.0");
	haxe_ui_util_Defines.set("haxeui_html5","1.4.0");
	haxe_ui_util_Defines.set("haxeui_core","1.4.0");
	haxe_ui_util_Defines.set("haxeui-html5","1.4.0");
	haxe_ui_util_Defines.set("haxeui-core","1.4.0");
	haxe_ui_util_Defines.set("haxe_ver","4.204");
	haxe_ui_util_Defines.set("haxe4","1");
	haxe_ui_util_Defines.set("haxe3","1");
	haxe_ui_util_Defines.set("haxe","4.2.4");
	haxe_ui_util_Defines.set("debug","1");
	haxe_ui_util_Defines.set("dce","std");
	haxe_ui_util_Defines.set("core","1.4.0");
	haxe_ui_util_Defines.set("backend","html5");
	haxe_ui_Toolkit._backendBuilt = true;
};
haxe_ui_Toolkit.get_initialized = function() {
	return haxe_ui_Toolkit._initialized;
};
haxe_ui_Toolkit.init = function(options) {
	haxe_ui_Toolkit.build();
	haxe_ui_themes_ThemeManager.get_instance().applyTheme(haxe_ui_Toolkit._theme);
	if(options != null) {
		haxe_ui_Toolkit.get_screen().set_options(options);
		haxe_ui_ToolkitAssets.get_instance().options = options;
	}
	haxe_ui_Toolkit.get_screen().registerEvent("keydown",haxe_ui_Toolkit.onKeyDown);
	haxe_ui_Toolkit._initialized = true;
};
haxe_ui_Toolkit.onKeyDown = function(event) {
	if(event.keyCode == haxe_ui_core_Platform.get_instance().getKeyCode("tab")) {
		if(event.shiftKey == false) {
			haxe_ui_focus_FocusManager.get_instance().focusNext();
		} else {
			haxe_ui_focus_FocusManager.get_instance().focusPrev();
		}
	}
};
haxe_ui_Toolkit.get_assets = function() {
	return haxe_ui_ToolkitAssets.get_instance();
};
haxe_ui_Toolkit.get_screen = function() {
	return haxe_ui_core_Screen.get_instance();
};
haxe_ui_Toolkit.set_pixelsPerRem = function(value) {
	if(haxe_ui_Toolkit.pixelsPerRem == value) {
		return value;
	}
	haxe_ui_Toolkit.pixelsPerRem = value;
	haxe_ui_core_Screen.get_instance().refreshStyleRootComponents();
	return value;
};
haxe_ui_Toolkit.get_autoScaleDPIThreshold = function() {
	if(haxe_ui_core_Screen.get_instance().get_isRetina() == true) {
		return 192;
	}
	return 120;
};
haxe_ui_Toolkit.get_scaleX = function() {
	if(haxe_ui_Toolkit._scaleX == 0) {
		if(haxe_ui_Toolkit.autoScale == true) {
			var dpi = haxe_ui_core_Screen.get_instance().get_dpi();
			if(dpi > haxe_ui_Toolkit.get_autoScaleDPIThreshold()) {
				if(haxe_ui_Toolkit.roundScale == true) {
					haxe_ui_Toolkit._scaleX = Math.round(dpi / haxe_ui_Toolkit.get_autoScaleDPIThreshold());
				} else {
					haxe_ui_Toolkit._scaleX = dpi / haxe_ui_Toolkit.get_autoScaleDPIThreshold();
				}
			} else {
				haxe_ui_Toolkit._scaleX = 1;
			}
		} else {
			haxe_ui_Toolkit._scaleX = 1;
		}
	}
	return haxe_ui_Toolkit._scaleX;
};
haxe_ui_Toolkit.set_scaleX = function(value) {
	if(haxe_ui_Toolkit._scaleX == value) {
		return value;
	}
	haxe_ui_Toolkit._scaleX = value;
	haxe_ui_Toolkit.autoScale = false;
	return value;
};
haxe_ui_Toolkit.get_scaleY = function() {
	if(haxe_ui_Toolkit._scaleY == 0) {
		if(haxe_ui_Toolkit.autoScale == true) {
			var dpi = haxe_ui_core_Screen.get_instance().get_dpi();
			if(dpi > haxe_ui_Toolkit.get_autoScaleDPIThreshold()) {
				if(haxe_ui_Toolkit.roundScale == true) {
					haxe_ui_Toolkit._scaleY = Math.round(dpi / haxe_ui_Toolkit.get_autoScaleDPIThreshold());
				} else {
					haxe_ui_Toolkit._scaleY = dpi / haxe_ui_Toolkit.get_autoScaleDPIThreshold();
				}
			} else {
				haxe_ui_Toolkit._scaleY = 1;
			}
		} else {
			haxe_ui_Toolkit._scaleY = 1;
		}
	}
	return haxe_ui_Toolkit._scaleY;
};
haxe_ui_Toolkit.set_scaleY = function(value) {
	if(haxe_ui_Toolkit._scaleY == value) {
		return value;
	}
	haxe_ui_Toolkit._scaleY = value;
	haxe_ui_Toolkit.autoScale = false;
	return value;
};
haxe_ui_Toolkit.get_scale = function() {
	return Math.max(haxe_ui_Toolkit.get_scaleX(),haxe_ui_Toolkit.get_scaleY());
};
haxe_ui_Toolkit.set_scale = function(value) {
	haxe_ui_Toolkit.set_scaleX(value);
	haxe_ui_Toolkit.set_scaleY(value);
	return value;
};
haxe_ui_Toolkit.callLater = function(fn) {
	new haxe_ui_CallLater(fn);
};
var haxe_ui_backend_AssetsBase = function() {
};
$hxClasses["haxe.ui.backend.AssetsBase"] = haxe_ui_backend_AssetsBase;
haxe_ui_backend_AssetsBase.__name__ = "haxe.ui.backend.AssetsBase";
haxe_ui_backend_AssetsBase.isAbsolutePath = function(path) {
	if(StringTools.startsWith(path,"/")) {
		return true;
	}
	if(path.charAt(1) == ":") {
		return true;
	}
	if(StringTools.startsWith(path,"\\\\")) {
		return true;
	}
	return false;
};
haxe_ui_backend_AssetsBase.prototype = {
	getTextDelegate: function(resourceId) {
		return null;
	}
	,getImageInternal: function(resourceId,callback) {
		callback(null);
	}
	,getImageFromHaxeResource: function(resourceId,callback) {
		callback(resourceId,null);
	}
	,imageFromBytes: function(bytes,callback) {
		callback(null);
	}
	,imageFromFile: function(filename,callback) {
		haxe_Log.trace("WARNING: cant load from file system on non-sys targets [" + filename + "]",{ fileName : "haxe/ui/backend/AssetsBase.hx", lineNumber : 50, className : "haxe.ui.backend.AssetsBase", methodName : "imageFromFile"});
		callback(null);
	}
	,getFontInternal: function(resourceId,callback) {
		callback(null);
	}
	,getFontFromHaxeResource: function(resourceId,callback) {
		callback(resourceId,null);
	}
	,imageInfoFromImageData: function(imageData) {
		return { data : imageData, width : 0, height : 0};
	}
	,__class__: haxe_ui_backend_AssetsBase
};
var haxe_ui_backend_AssetsImpl = function() {
	haxe_ui_backend_AssetsBase.call(this);
};
$hxClasses["haxe.ui.backend.AssetsImpl"] = haxe_ui_backend_AssetsImpl;
haxe_ui_backend_AssetsImpl.__name__ = "haxe.ui.backend.AssetsImpl";
haxe_ui_backend_AssetsImpl.__super__ = haxe_ui_backend_AssetsBase;
haxe_ui_backend_AssetsImpl.prototype = $extend(haxe_ui_backend_AssetsBase.prototype,{
	getImageInternal: function(resourceId,callback) {
		var bytes = haxe_Resource.getBytes(resourceId);
		if(bytes != null) {
			callback(null);
			return;
		}
		var image = window.document.createElement("img");
		image.onload = function(e) {
			var imageInfo = { width : image.width, height : image.height, data : image};
			callback(imageInfo);
		};
		image.onerror = function(e) {
			callback(null);
		};
		image.src = resourceId;
	}
	,getImageFromHaxeResource: function(resourceId,callback) {
		var bytes = haxe_Resource.getBytes(resourceId);
		this.imageFromBytes(bytes,function(imageInfo) {
			callback(resourceId,imageInfo);
		});
	}
	,imageFromBytes: function(bytes,callback) {
		if(bytes == null) {
			callback(null);
			return;
		}
		var image = window.document.createElement("img");
		image.onload = function(e) {
			var imageInfo = { width : image.width, height : image.height, data : image};
			callback(imageInfo);
		};
		image.onerror = function(e) {
			window.console.log(e);
			callback(null);
		};
		var blob = new Blob([bytes.b.bufferValue]);
		var blobUrl = URL.createObjectURL(blob);
		image.src = blobUrl;
	}
	,getFontInternal: function(resourceId,callback) {
		var bytes = haxe_Resource.getBytes(resourceId);
		if(bytes == null) {
			haxe_ui_backend_html5_util_FontDetect.onFontLoaded(resourceId,function(f) {
				var fontInfo = { data : f};
				callback(fontInfo);
			},function(f) {
				callback(null);
			});
			return;
		}
		this.getFontFromHaxeResource(resourceId,function(r,f) {
			callback(f);
		});
	}
	,getFontFromHaxeResource: function(resourceId,callback) {
		var bytes = haxe_Resource.getBytes(resourceId);
		if(bytes == null) {
			callback(resourceId,null);
			return;
		}
		var fontFamilyParts = resourceId.split("/");
		var fontFamily = fontFamilyParts[fontFamilyParts.length - 1];
		if(fontFamily.indexOf(".") != -1) {
			fontFamily = HxOverrides.substr(fontFamily,0,fontFamily.indexOf("."));
		}
		var fontFace = new FontFace(fontFamily,bytes.b.bufferValue);
		fontFace.load().then(function(loadedFace) {
			window.document.fonts.add(loadedFace);
			haxe_ui_backend_html5_util_FontDetect.onFontLoaded(fontFamily,function(f) {
				var fontInfo = { data : fontFamily};
				callback(resourceId,fontInfo);
			},function(f) {
				callback(resourceId,null);
			});
		}).catch(function(error) {
			haxe_Log.trace("WARNING: problem loading font '" + resourceId + "' (" + error + ")",{ fileName : "haxe/ui/backend/AssetsImpl.hx", lineNumber : 117, className : "haxe.ui.backend.AssetsImpl", methodName : "getFontFromHaxeResource"});
			callback(resourceId,null);
		});
	}
	,__class__: haxe_ui_backend_AssetsImpl
});
var haxe_ui_ToolkitAssets = function() {
	this.options = null;
	this.preloadList = [];
	haxe_ui_backend_AssetsImpl.call(this);
};
$hxClasses["haxe.ui.ToolkitAssets"] = haxe_ui_ToolkitAssets;
haxe_ui_ToolkitAssets.__name__ = "haxe.ui.ToolkitAssets";
haxe_ui_ToolkitAssets.__properties__ = {get_instance:"get_instance"};
haxe_ui_ToolkitAssets.get_instance = function() {
	if(haxe_ui_ToolkitAssets._instance == null) {
		haxe_ui_ToolkitAssets._instance = new haxe_ui_ToolkitAssets();
	}
	return haxe_ui_ToolkitAssets._instance;
};
haxe_ui_ToolkitAssets.__super__ = haxe_ui_backend_AssetsImpl;
haxe_ui_ToolkitAssets.prototype = $extend(haxe_ui_backend_AssetsImpl.prototype,{
	preloadList: null
	,options: null
	,_fontCache: null
	,_fontCallbacks: null
	,_imageCache: null
	,_imageCallbacks: null
	,getFont: function(resourceId,callback,useCache) {
		if(useCache == null) {
			useCache = true;
		}
		var _gthis = this;
		if(this._fontCache != null && this._fontCache.h[resourceId] != null && useCache == true) {
			callback(this._fontCache.h[resourceId]);
		} else {
			if(this._fontCallbacks == null) {
				this._fontCallbacks = new haxe_ui_util_CallbackMap();
			}
			this._fontCallbacks.add(resourceId,callback);
			if(this._fontCallbacks.count(resourceId) == 1) {
				this.getFontInternal(resourceId,function(font) {
					if(font != null) {
						_gthis._onFontLoaded(resourceId,font);
					} else if(haxe_Resource.listNames().indexOf(resourceId) != -1) {
						_gthis.getFontFromHaxeResource(resourceId,$bind(_gthis,_gthis._onFontLoaded));
					} else {
						_gthis._fontCallbacks.remove(resourceId,callback);
						callback(null);
					}
				});
			}
		}
	}
	,_onFontLoaded: function(resourceId,font) {
		if(this._fontCache == null) {
			this._fontCache = new haxe_ds_StringMap();
		}
		this._fontCache.h[resourceId] = font;
		this._fontCallbacks.invokeAndRemove(resourceId,font);
	}
	,getImage: function(resourceId,callback,useCache) {
		if(useCache == null) {
			useCache = true;
		}
		var _gthis = this;
		var orginalResourceId = resourceId;
		resourceId = this.runPlugins(resourceId);
		if(this._imageCache != null && this._imageCache.h[resourceId] != null && useCache == true) {
			callback(this._imageCache.h[resourceId]);
		} else {
			if(this._imageCallbacks == null) {
				this._imageCallbacks = new haxe_ui_util_CallbackMap();
			}
			this._imageCallbacks.add(resourceId,callback);
			if(this._imageCallbacks.count(resourceId) == 1) {
				this.getImageInternal(resourceId,function(imageInfo) {
					if(imageInfo != null) {
						_gthis._onImageLoaded(resourceId,imageInfo);
					} else if(haxe_Resource.listNames().indexOf(orginalResourceId) != -1) {
						_gthis._imageCallbacks.remove(resourceId,callback);
						_gthis._imageCallbacks.add(orginalResourceId,callback);
						_gthis.getImageFromHaxeResource(orginalResourceId,$bind(_gthis,_gthis._onImageLoaded));
					} else if(haxe_Resource.listNames().indexOf(resourceId) != -1) {
						_gthis.getImageFromHaxeResource(resourceId,$bind(_gthis,_gthis._onImageLoaded));
					} else {
						_gthis._imageCallbacks.remove(resourceId,callback);
						callback(null);
					}
				});
			}
		}
	}
	,_onImageLoaded: function(resourceId,imageInfo) {
		if(imageInfo != null && (imageInfo.width == -1 || imageInfo.width == -1)) {
			haxe_Log.trace("WARNING: imageData.originalWidth == -1 || imageData.originalHeight == -1",{ fileName : "haxe/ui/ToolkitAssets.hx", lineNumber : 106, className : "haxe.ui.ToolkitAssets", methodName : "_onImageLoaded"});
		}
		if(this._imageCache == null) {
			this._imageCache = new haxe_ds_StringMap();
		}
		this._imageCache.h[resourceId] = imageInfo;
		this._imageCallbacks.invokeAndRemove(resourceId,imageInfo);
	}
	,getText: function(resourceId) {
		var s = this.getTextDelegate(resourceId);
		if(s == null) {
			s = haxe_Resource.getString(resourceId);
		}
		return s;
	}
	,getBytes: function(resourceId) {
		return null;
	}
	,_plugins: null
	,addPlugin: function(plugin) {
		if(this._plugins == null) {
			this._plugins = [];
		}
		this._plugins.push(plugin);
	}
	,runPlugins: function(asset) {
		if(this._plugins == null) {
			return asset;
		}
		var _g = 0;
		var _g1 = this._plugins;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			asset = p.invoke(asset);
		}
		return asset;
	}
	,__class__: haxe_ui_ToolkitAssets
});
var haxe_ui_actions_ActionManager = function() {
	this._repeatActions = new haxe_ds_StringMap();
	this._inputSources = [];
	this._events = null;
};
$hxClasses["haxe.ui.actions.ActionManager"] = haxe_ui_actions_ActionManager;
haxe_ui_actions_ActionManager.__name__ = "haxe.ui.actions.ActionManager";
haxe_ui_actions_ActionManager.__properties__ = {get_instance:"get_instance"};
haxe_ui_actions_ActionManager.get_instance = function() {
	if(haxe_ui_actions_ActionManager._instance == null) {
		haxe_ui_actions_ActionManager._instance = new haxe_ui_actions_ActionManager();
	}
	return haxe_ui_actions_ActionManager._instance;
};
haxe_ui_actions_ActionManager.prototype = {
	_events: null
	,_inputSources: null
	,_repeatActions: null
	,registerEvent: function(type,listener,priority) {
		if(priority == null) {
			priority = 0;
		}
		if(this._events == null) {
			this._events = new haxe_ui_util_EventMap();
		}
		this._events.add(type,listener,priority);
	}
	,unregisterEvent: function(type,listener) {
		if(this._events == null) {
			return;
		}
		this._events.remove(type,listener);
	}
	,dispatch: function(event) {
		if(this._events == null) {
			return;
		}
		this._events.invoke(event.type,event);
	}
	,registerInputSource: function(source) {
		source.start();
		this._inputSources.push(source);
	}
	,actionStart: function(action) {
		var _gthis = this;
		var currentFocus = haxe_ui_focus_FocusManager.get_instance().get_focus();
		if(currentFocus == null) {
			haxe_Log.trace("no focus for action: " + action,{ fileName : "haxe/ui/actions/ActionManager.hx", lineNumber : 65, className : "haxe.ui.actions.ActionManager", methodName : "actionStart"});
			return;
		}
		if(!((currentFocus) instanceof haxe_ui_core_InteractiveComponent)) {
			haxe_Log.trace("current focus not interactive: " + action,{ fileName : "haxe/ui/actions/ActionManager.hx", lineNumber : 72, className : "haxe.ui.actions.ActionManager", methodName : "actionStart"});
			return;
		}
		var c = js_Boot.__cast(currentFocus , haxe_ui_core_InteractiveComponent);
		var repeat = c.actionStart(action);
		if(repeat == true && Object.prototype.hasOwnProperty.call(this._repeatActions.h,action) == false) {
			var this1 = this._repeatActions;
			var value = { type : action, timer : new haxe_ui_util_Timer(100,function() {
				_gthis.actionStart(action);
			})};
			this1.h[action] = value;
		}
	}
	,actionEnd: function(action) {
		var currentFocus = haxe_ui_focus_FocusManager.get_instance().get_focus();
		if(currentFocus == null) {
			return;
		}
		if(!((currentFocus) instanceof haxe_ui_core_InteractiveComponent)) {
			haxe_Log.trace("current focus not interactive: " + action,{ fileName : "haxe/ui/actions/ActionManager.hx", lineNumber : 96, className : "haxe.ui.actions.ActionManager", methodName : "actionEnd"});
			return;
		}
		var c = js_Boot.__cast(currentFocus , haxe_ui_core_InteractiveComponent);
		c.actionEnd(action);
		if(Object.prototype.hasOwnProperty.call(this._repeatActions.h,action)) {
			var info = this._repeatActions.h[action];
			info.timer.stop();
			var _this = this._repeatActions;
			var key = action;
			if(Object.prototype.hasOwnProperty.call(_this.h,key)) {
				delete(_this.h[key]);
			}
		}
	}
	,__class__: haxe_ui_actions_ActionManager
};
var haxe_ui_actions_IActionInputSource = function() { };
$hxClasses["haxe.ui.actions.IActionInputSource"] = haxe_ui_actions_IActionInputSource;
haxe_ui_actions_IActionInputSource.__name__ = "haxe.ui.actions.IActionInputSource";
haxe_ui_actions_IActionInputSource.__isInterface__ = true;
haxe_ui_actions_IActionInputSource.prototype = {
	start: null
	,__class__: haxe_ui_actions_IActionInputSource
};
var haxe_ui_actions_KeyboardActionInputSource = function() {
	this._downKeys = new haxe_ds_IntMap();
	this._started = false;
};
$hxClasses["haxe.ui.actions.KeyboardActionInputSource"] = haxe_ui_actions_KeyboardActionInputSource;
haxe_ui_actions_KeyboardActionInputSource.__name__ = "haxe.ui.actions.KeyboardActionInputSource";
haxe_ui_actions_KeyboardActionInputSource.__interfaces__ = [haxe_ui_actions_IActionInputSource];
haxe_ui_actions_KeyboardActionInputSource.prototype = {
	_started: null
	,start: function() {
		if(this._started == true) {
			return;
		}
		this._started = true;
		haxe_ui_core_Screen.get_instance().registerEvent("keydown",$bind(this,this.onKeyDown));
		haxe_ui_core_Screen.get_instance().registerEvent("keyup",$bind(this,this.onKeyUp));
	}
	,_downKeys: null
	,onKeyDown: function(e) {
		var keyCode = e.keyCode;
		if(this._downKeys.h.hasOwnProperty(keyCode)) {
			return;
		}
		this._downKeys.h[keyCode] = true;
		if(keyCode == haxe_ui_core_Platform.get_instance().getKeyCode("space")) {
			haxe_ui_actions_ActionManager.get_instance().actionStart("actionPress");
			haxe_ui_actions_ActionManager.get_instance().dispatch(new haxe_ui_events_ActionEvent("actionStart","actionPress",false,"KeyboardActionInputSource"));
		} else if(keyCode == haxe_ui_core_Platform.get_instance().getKeyCode("left")) {
			haxe_ui_actions_ActionManager.get_instance().actionStart("actionLeft");
			haxe_ui_actions_ActionManager.get_instance().dispatch(new haxe_ui_events_ActionEvent("actionStart","actionLeft",false,"KeyboardActionInputSource"));
		} else if(keyCode == haxe_ui_core_Platform.get_instance().getKeyCode("right")) {
			haxe_ui_actions_ActionManager.get_instance().actionStart("actionRight");
			haxe_ui_actions_ActionManager.get_instance().dispatch(new haxe_ui_events_ActionEvent("actionStart","actionRight",false,"KeyboardActionInputSource"));
		} else if(keyCode == haxe_ui_core_Platform.get_instance().getKeyCode("up")) {
			haxe_ui_actions_ActionManager.get_instance().actionStart("actionUp");
			haxe_ui_actions_ActionManager.get_instance().dispatch(new haxe_ui_events_ActionEvent("actionStart","actionUp",false,"KeyboardActionInputSource"));
		} else if(keyCode == haxe_ui_core_Platform.get_instance().getKeyCode("down")) {
			haxe_ui_actions_ActionManager.get_instance().actionStart("actionDown");
			haxe_ui_actions_ActionManager.get_instance().dispatch(new haxe_ui_events_ActionEvent("actionStart","actionDown",false,"KeyboardActionInputSource"));
		}
	}
	,onKeyUp: function(e) {
		var keyCode = e.keyCode;
		if(this._downKeys.h.hasOwnProperty(keyCode) == false) {
			return;
		}
		this._downKeys.remove(keyCode);
		if(keyCode == haxe_ui_core_Platform.get_instance().getKeyCode("space")) {
			haxe_ui_actions_ActionManager.get_instance().actionEnd("actionPress");
			haxe_ui_actions_ActionManager.get_instance().dispatch(new haxe_ui_events_ActionEvent("actionEnd","actionPress",false,"KeyboardActionInputSource"));
		} else if(keyCode == haxe_ui_core_Platform.get_instance().getKeyCode("left")) {
			haxe_ui_actions_ActionManager.get_instance().actionEnd("actionLeft");
			haxe_ui_actions_ActionManager.get_instance().dispatch(new haxe_ui_events_ActionEvent("actionEnd","actionLeft",false,"KeyboardActionInputSource"));
		} else if(keyCode == haxe_ui_core_Platform.get_instance().getKeyCode("right")) {
			haxe_ui_actions_ActionManager.get_instance().actionEnd("actionRight");
			haxe_ui_actions_ActionManager.get_instance().dispatch(new haxe_ui_events_ActionEvent("actionEnd","actionRight",false,"KeyboardActionInputSource"));
		} else if(keyCode == haxe_ui_core_Platform.get_instance().getKeyCode("up")) {
			haxe_ui_actions_ActionManager.get_instance().actionEnd("actionUp");
			haxe_ui_actions_ActionManager.get_instance().dispatch(new haxe_ui_events_ActionEvent("actionEnd","actionUp",false,"KeyboardActionInputSource"));
		} else if(keyCode == haxe_ui_core_Platform.get_instance().getKeyCode("down")) {
			haxe_ui_actions_ActionManager.get_instance().actionEnd("actionDown");
			haxe_ui_actions_ActionManager.get_instance().dispatch(new haxe_ui_events_ActionEvent("actionEnd","actionDown",false,"KeyboardActionInputSource"));
		}
	}
	,__class__: haxe_ui_actions_KeyboardActionInputSource
};
var haxe_ui_assets_AssetPlugin = function() {
};
$hxClasses["haxe.ui.assets.AssetPlugin"] = haxe_ui_assets_AssetPlugin;
haxe_ui_assets_AssetPlugin.__name__ = "haxe.ui.assets.AssetPlugin";
haxe_ui_assets_AssetPlugin.prototype = {
	_props: null
	,invoke: function(asset) {
		return asset;
	}
	,setProperty: function(name,value) {
		if(this._props == null) {
			this._props = new haxe_ds_StringMap();
		}
		this._props.h[name] = value;
	}
	,getProperty: function(name,defaultValue) {
		if(this._props == null) {
			return defaultValue;
		}
		var v = this._props.h[name];
		if(v == null) {
			v = defaultValue;
		}
		return v;
	}
	,__class__: haxe_ui_assets_AssetPlugin
};
var haxe_ui_backend_EventBase = function() { };
$hxClasses["haxe.ui.backend.EventBase"] = haxe_ui_backend_EventBase;
haxe_ui_backend_EventBase.__name__ = "haxe.ui.backend.EventBase";
haxe_ui_backend_EventBase.prototype = {
	cancel: function() {
	}
	,postClone: function(event) {
	}
	,__class__: haxe_ui_backend_EventBase
};
var haxe_ui_backend_EventImpl = function() { };
$hxClasses["haxe.ui.backend.EventImpl"] = haxe_ui_backend_EventImpl;
haxe_ui_backend_EventImpl.__name__ = "haxe.ui.backend.EventImpl";
haxe_ui_backend_EventImpl.__super__ = haxe_ui_backend_EventBase;
haxe_ui_backend_EventImpl.prototype = $extend(haxe_ui_backend_EventBase.prototype,{
	_originalEvent: null
	,cancel: function() {
		if(this._originalEvent != null) {
			this._originalEvent.preventDefault();
			this._originalEvent.stopImmediatePropagation();
			this._originalEvent.stopPropagation();
		}
	}
	,postClone: function(event) {
		event._originalEvent = this._originalEvent;
	}
	,__class__: haxe_ui_backend_EventImpl
});
var haxe_ui_backend_ImageSurface = function() {
};
$hxClasses["haxe.ui.backend.ImageSurface"] = haxe_ui_backend_ImageSurface;
haxe_ui_backend_ImageSurface.__name__ = "haxe.ui.backend.ImageSurface";
haxe_ui_backend_ImageSurface.prototype = {
	__class__: haxe_ui_backend_ImageSurface
};
var haxe_ui_backend_ImageBase = function() {
	this._imageHeight = 0;
	this._imageWidth = 0;
	this._top = 0;
	this._left = 0;
	this.aspectRatio = 1;
	haxe_ui_backend_ImageSurface.call(this);
};
$hxClasses["haxe.ui.backend.ImageBase"] = haxe_ui_backend_ImageBase;
haxe_ui_backend_ImageBase.__name__ = "haxe.ui.backend.ImageBase";
haxe_ui_backend_ImageBase.__super__ = haxe_ui_backend_ImageSurface;
haxe_ui_backend_ImageBase.prototype = $extend(haxe_ui_backend_ImageSurface.prototype,{
	parentComponent: null
	,aspectRatio: null
	,_left: null
	,_top: null
	,_imageWidth: null
	,_imageHeight: null
	,_imageInfo: null
	,_imageClipRect: null
	,dispose: function() {
		if(this.parentComponent != null) {
			this.parentComponent = null;
		}
	}
	,validateData: function() {
	}
	,validatePosition: function() {
	}
	,validateDisplay: function() {
	}
	,__class__: haxe_ui_backend_ImageBase
});
var haxe_ui_backend_ImageDisplayImpl = function() {
	haxe_ui_backend_ImageBase.call(this);
	this.element = window.document.createElement("img");
	this.element.style.position = "absolute";
	this.element.style.borderRadius = "inherit";
	this.element.style.setProperty("pointer-events","none");
};
$hxClasses["haxe.ui.backend.ImageDisplayImpl"] = haxe_ui_backend_ImageDisplayImpl;
haxe_ui_backend_ImageDisplayImpl.__name__ = "haxe.ui.backend.ImageDisplayImpl";
haxe_ui_backend_ImageDisplayImpl.__super__ = haxe_ui_backend_ImageBase;
haxe_ui_backend_ImageDisplayImpl.prototype = $extend(haxe_ui_backend_ImageBase.prototype,{
	element: null
	,dispose: function() {
		if(this.element != null) {
			haxe_ui_backend_html5_HtmlUtils.removeElement(this.element);
		}
	}
	,validateData: function() {
		if(this.element.src != this._imageInfo.data.src) {
			this.element.src = this._imageInfo.data.src;
			this.applyStyle();
		}
	}
	,validatePosition: function() {
		var style = this.element.style;
		style.left = "" + this._left + "px";
		style.top = "" + this._top + "px";
	}
	,validateDisplay: function() {
		var style = this.element.style;
		style.width = "" + this._imageWidth + "px";
		style.height = "" + this._imageHeight + "px";
		if(this._imageClipRect != null) {
			var clipValue = "rect(" + ("" + (-this._top + this._imageClipRect.top) + "px") + "," + ("" + (-this._left + this._imageClipRect.left + this._imageClipRect.width) + "px") + "," + ("" + (-this._top + this._imageClipRect.top + this._imageClipRect.height) + "px") + "," + ("" + (-this._left + this._imageClipRect.left) + "px") + ")";
			if(this.element.style.clip != clipValue) {
				this.element.style.clip = clipValue;
			}
		} else if(this.element.style.clip != null) {
			this.element.style.removeProperty("clip");
		}
	}
	,applyStyle: function() {
		if(this.parentComponent != null && this.parentComponent.get_style() != null) {
			if(this.parentComponent.get_style().imageRendering == "pixelated") {
				this.element.style.setProperty("image-rendering","pixelated");
				this.element.style.setProperty("image-rendering","-moz-crisp-edges");
				this.element.style.setProperty("image-rendering","crisp-edges");
			} else if(this.element.style.getPropertyValue("image-rendering") != null) {
				this.element.style.removeProperty("image-rendering");
			}
		}
	}
	,__class__: haxe_ui_backend_ImageDisplayImpl
});
var haxe_ui_backend_PlatformBase = function() {
};
$hxClasses["haxe.ui.backend.PlatformBase"] = haxe_ui_backend_PlatformBase;
haxe_ui_backend_PlatformBase.__name__ = "haxe.ui.backend.PlatformBase";
haxe_ui_backend_PlatformBase.prototype = {
	isWindows: null
	,get_isWindows: function() {
		return window.navigator.userAgent.toLowerCase().indexOf("windows") != -1;
	}
	,isLinux: null
	,get_isLinux: function() {
		return window.navigator.userAgent.toLowerCase().indexOf("linux") != -1;
	}
	,isMac: null
	,get_isMac: function() {
		return window.navigator.userAgent.toLowerCase().indexOf("mac") != -1;
	}
	,getMetric: function(id) {
		return 0;
	}
	,getColor: function(id) {
		return null;
	}
	,getSystemLocale: function() {
		return null;
	}
	,perf: function() {
		return HxOverrides.now() / 1000 * 1000;
	}
	,KeyTab: null
	,get_KeyTab: function() {
		return this.getKeyCode("tab");
	}
	,KeyUp: null
	,get_KeyUp: function() {
		return this.getKeyCode("up");
	}
	,KeyDown: null
	,get_KeyDown: function() {
		return this.getKeyCode("down");
	}
	,KeyLeft: null
	,get_KeyLeft: function() {
		return this.getKeyCode("left");
	}
	,KeyRight: null
	,get_KeyRight: function() {
		return this.getKeyCode("right");
	}
	,KeySpace: null
	,get_KeySpace: function() {
		return this.getKeyCode("space");
	}
	,KeyEnter: null
	,get_KeyEnter: function() {
		return this.getKeyCode("enter");
	}
	,KeyEscape: null
	,get_KeyEscape: function() {
		return this.getKeyCode("escape");
	}
	,getKeyCode: function(keyId) {
		switch(keyId) {
		case "down":
			return 40;
		case "enter":
			return 13;
		case "escape":
			return 27;
		case "left":
			return 37;
		case "right":
			return 39;
		case "space":
			return 32;
		case "tab":
			return 9;
		case "up":
			return 38;
		default:
			return HxOverrides.cca(keyId,0);
		}
	}
	,__class__: haxe_ui_backend_PlatformBase
	,__properties__: {get_KeyEscape:"get_KeyEscape",get_KeyEnter:"get_KeyEnter",get_KeySpace:"get_KeySpace",get_KeyRight:"get_KeyRight",get_KeyLeft:"get_KeyLeft",get_KeyDown:"get_KeyDown",get_KeyUp:"get_KeyUp",get_KeyTab:"get_KeyTab",get_isMac:"get_isMac",get_isLinux:"get_isLinux",get_isWindows:"get_isWindows"}
};
var haxe_ui_backend_PlatformImpl = function() {
	haxe_ui_backend_PlatformBase.call(this);
};
$hxClasses["haxe.ui.backend.PlatformImpl"] = haxe_ui_backend_PlatformImpl;
haxe_ui_backend_PlatformImpl.__name__ = "haxe.ui.backend.PlatformImpl";
haxe_ui_backend_PlatformImpl.calcScrollSize = function() {
	if(haxe_ui_backend_PlatformImpl._vscrollWidth >= 0 && haxe_ui_backend_PlatformImpl._hscrollHeight >= 0) {
		return;
	}
	var div = window.document.createElement("div");
	div.style.position = "absolute";
	div.style.top = "-99999px";
	div.style.left = "-99999px";
	div.style.height = "100px";
	div.style.width = "100px";
	div.style.overflow = "scroll";
	window.document.body.appendChild(div);
	haxe_ui_backend_PlatformImpl._vscrollWidth = div.offsetWidth - div.clientWidth;
	haxe_ui_backend_PlatformImpl._hscrollHeight = div.offsetHeight - div.clientHeight;
	haxe_ui_backend_html5_HtmlUtils.removeElement(div);
};
haxe_ui_backend_PlatformImpl.__super__ = haxe_ui_backend_PlatformBase;
haxe_ui_backend_PlatformImpl.prototype = $extend(haxe_ui_backend_PlatformBase.prototype,{
	getMetric: function(id) {
		switch(id) {
		case "patform.metrics.hscroll.height":
			haxe_ui_backend_PlatformImpl.calcScrollSize();
			return haxe_ui_backend_PlatformImpl._hscrollHeight;
		case "patform.metrics.vscroll.width":
			haxe_ui_backend_PlatformImpl.calcScrollSize();
			return haxe_ui_backend_PlatformImpl._vscrollWidth;
		}
		return haxe_ui_backend_PlatformBase.prototype.getMetric.call(this,id);
	}
	,getSystemLocale: function() {
		return $global.navigator.language;
	}
	,perf: function() {
		return window.performance.now();
	}
	,__class__: haxe_ui_backend_PlatformImpl
});
var haxe_ui_backend_ScreenBase = function() {
	this._focus = null;
};
$hxClasses["haxe.ui.backend.ScreenBase"] = haxe_ui_backend_ScreenBase;
haxe_ui_backend_ScreenBase.__name__ = "haxe.ui.backend.ScreenBase";
haxe_ui_backend_ScreenBase.prototype = {
	rootComponents: null
	,_focus: null
	,get_focus: function() {
		return this._focus;
	}
	,set_focus: function(value) {
		this._focus = value;
		return this._focus;
	}
	,_options: null
	,get_options: function() {
		return this._options;
	}
	,set_options: function(value) {
		this._options = value;
		return value;
	}
	,dpi: null
	,get_dpi: function() {
		return 72;
	}
	,get_title: function() {
		return null;
	}
	,set_title: function(s) {
		return s;
	}
	,width: null
	,get_width: function() {
		return 0;
	}
	,height: null
	,get_height: function() {
		return 0;
	}
	,actualWidth: null
	,get_actualWidth: function() {
		return this.get_width() * haxe_ui_Toolkit.get_scaleX();
	}
	,actualHeight: null
	,get_actualHeight: function() {
		return this.get_height() * haxe_ui_Toolkit.get_scaleY();
	}
	,isRetina: null
	,get_isRetina: function() {
		return false;
	}
	,addComponent: function(component) {
		return component;
	}
	,removeComponent: function(component,dispose) {
		if(dispose == null) {
			dispose = true;
		}
		return component;
	}
	,handleSetComponentIndex: function(child,index) {
	}
	,resizeComponent: function(c) {
		var cx = null;
		var cy = null;
		if(c.get_percentWidth() > 0) {
			cx = this.get_width() * c.get_percentWidth() / 100;
		}
		if(c.get_percentHeight() > 0) {
			cy = this.get_height() * c.get_percentHeight() / 100;
		}
		c.resizeComponent(cx,cy);
	}
	,refreshStyleRootComponents: function() {
		var _g = 0;
		var _g1 = this.rootComponents;
		while(_g < _g1.length) {
			var component = _g1[_g];
			++_g;
			this._refreshStyleComponent(component);
		}
	}
	,resizeRootComponents: function() {
		var _g = 0;
		var _g1 = this.rootComponents;
		while(_g < _g1.length) {
			var component = _g1[_g];
			++_g;
			this.resizeComponent(component);
		}
	}
	,_refreshStyleComponent: function(component) {
		var _g = 0;
		var _g1 = component._children == null ? [] : component._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			child.invalidateComponent("style",false);
			child.invalidateComponent("display",false);
			this._refreshStyleComponent(child);
		}
	}
	,_onRootComponentResize: function(e) {
		this._refreshStyleComponent(e.target);
	}
	,invalidateAll: function(flag) {
		if(flag == null) {
			flag = "all";
		}
		var _g = 0;
		var _g1 = this.rootComponents;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			this.invalidateChildren(c,flag);
		}
	}
	,invalidateChildren: function(c,flag) {
		if(flag == null) {
			flag = "all";
		}
		var _g = 0;
		var _g1 = c._children == null ? [] : c._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			this.invalidateChildren(child,flag);
		}
		c.invalidateComponent(flag);
	}
	,supportsEvent: function(type) {
		return false;
	}
	,mapEvent: function(type,listener) {
	}
	,unmapEvent: function(type,listener) {
	}
	,__class__: haxe_ui_backend_ScreenBase
	,__properties__: {get_isRetina:"get_isRetina",get_actualHeight:"get_actualHeight",get_actualWidth:"get_actualWidth",get_height:"get_height",get_width:"get_width",set_title:"set_title",get_title:"get_title",get_dpi:"get_dpi",set_options:"set_options",get_options:"get_options",set_focus:"set_focus",get_focus:"get_focus"}
};
var haxe_ui_backend_ScreenImpl = function() {
	this._hasListener = false;
	this._pageRoot = null;
	this._container = null;
	this._percentContainerHeightAdded = false;
	this._percentContainerWidthAdded = false;
	this._height = null;
	this._width = null;
	haxe_ui_backend_ScreenBase.call(this);
	this._mapping = new haxe_ds_StringMap();
};
$hxClasses["haxe.ui.backend.ScreenImpl"] = haxe_ui_backend_ScreenImpl;
haxe_ui_backend_ScreenImpl.__name__ = "haxe.ui.backend.ScreenImpl";
haxe_ui_backend_ScreenImpl.__super__ = haxe_ui_backend_ScreenBase;
haxe_ui_backend_ScreenImpl.prototype = $extend(haxe_ui_backend_ScreenBase.prototype,{
	_mapping: null
	,set_options: function(value) {
		haxe_ui_backend_ScreenBase.prototype.set_options.call(this,value);
		var cx = haxe_ui_Toolkit.get_backendProperties().getProp("haxe.ui.html5.container.width",null);
		var cy = haxe_ui_Toolkit.get_backendProperties().getProp("haxe.ui.html5.container.height",null);
		var c = this.get_container();
		if(cx != null) {
			c.style.width = cx;
		}
		if(cy != null) {
			c.style.height = cy;
		}
		return value;
	}
	,get_dpi: function() {
		return haxe_ui_backend_html5_HtmlUtils.get_dpi();
	}
	,get_title: function() {
		return window.document.title;
	}
	,set_title: function(s) {
		window.document.title = s;
		return s;
	}
	,_width: null
	,get_width: function() {
		if(this._width != null) {
			return this._width;
		}
		var cx = this.get_container().offsetWidth;
		if(cx <= 0) {
			var _g = 0;
			var _g1 = this.rootComponents;
			while(_g < _g1.length) {
				var c = _g1[_g];
				++_g;
				if(c.get_width() > cx) {
					cx = c.get_width();
				}
			}
		}
		this._width = cx / haxe_ui_Toolkit.get_scaleX();
		return this._width;
	}
	,_height: null
	,get_height: function() {
		if(this._height != null) {
			return this._height;
		}
		var cy = this.get_container().offsetHeight;
		if(cy <= 0) {
			var _g = 0;
			var _g1 = this.rootComponents;
			while(_g < _g1.length) {
				var c = _g1[_g];
				++_g;
				if(c.get_height() > cy) {
					cy = c.get_height();
				}
			}
		}
		this._height = cy / haxe_ui_Toolkit.get_scaleY();
		return this._height;
	}
	,get_isRetina: function() {
		return haxe_ui_backend_html5_HtmlUtils.isRetinaDisplay();
	}
	,addComponent: function(component) {
		this.get_container().appendChild(component.element);
		component.ready();
		if(haxe_ui_Toolkit.get_scaleX() != 1 || haxe_ui_Toolkit.get_scaleY() != 1) {
			var transformString = "";
			if(haxe_ui_Toolkit.get_scaleX() != 1) {
				transformString += "scaleX(" + haxe_ui_Toolkit.get_scaleX() + ") ";
			}
			if(haxe_ui_Toolkit.get_scaleY() != 1) {
				transformString += "scaleY(" + haxe_ui_Toolkit.get_scaleY() + ") ";
			}
			component.element.style.transform = transformString;
			component.element.style.transformOrigin = "top left";
		}
		if(component.get_percentWidth() != null) {
			this.addPercentContainerWidth();
		}
		if(component.get_percentHeight() != null) {
			this.addPercentContainerHeight();
		}
		this.addResizeListener();
		this.resizeComponent(component);
		return component;
	}
	,_percentContainerWidthAdded: null
	,addPercentContainerWidth: function() {
		if(this._percentContainerWidthAdded == true) {
			return;
		}
		this._percentContainerWidthAdded = true;
		var sheet = haxe_ui_backend_html5_util_StyleSheetHelper.getValidStyleSheet();
		sheet.insertRule("#haxeui-container-parent {\r\n            margin: 0;\r\n            width: 100%;\r\n        }",sheet.cssRules.length);
		sheet.insertRule("#haxeui-container {\r\n            margin: 0;\r\n            width: 100%;\r\n        }",sheet.cssRules.length);
	}
	,_percentContainerHeightAdded: null
	,addPercentContainerHeight: function() {
		if(this._percentContainerHeightAdded == true) {
			return;
		}
		this._percentContainerHeightAdded = true;
		var sheet = haxe_ui_backend_html5_util_StyleSheetHelper.getValidStyleSheet();
		sheet.insertRule("#haxeui-container-parent {\r\n            margin: 0;\r\n            height: 100%;\r\n        }",sheet.cssRules.length);
		sheet.insertRule("#haxeui-container {\r\n            margin: 0;\r\n            height: 100%;\r\n        }",sheet.cssRules.length);
	}
	,removeComponent: function(component,dispose) {
		if(dispose == null) {
			dispose = true;
		}
		HxOverrides.remove(this.rootComponents,component);
		if(this.get_container().contains(component.element) == true) {
			this.get_container().removeChild(component.element);
		}
		return component;
	}
	,handleSetComponentIndex: function(child,index) {
		if(index == (js_Boot.__cast(this , haxe_ui_core_Screen)).rootComponents.length - 1) {
			this.get_container().appendChild(child.element);
		} else {
			haxe_ui_backend_html5_HtmlUtils.insertBefore((js_Boot.__cast(this , haxe_ui_core_Screen)).rootComponents[index + 1].element,child.element);
		}
	}
	,_container: null
	,container: null
	,get_container: function() {
		if(this._container != null) {
			return this._container;
		}
		var c = null;
		if(this.get_options() == null || this.get_options().container == null) {
			c = window.document.body;
		} else {
			c = this.get_options().container;
		}
		if(c.style.overflow == null || c.style.overflow == "") {
			c.style.overflow = "hidden";
		}
		if(c.id != "haxeui-container") {
			c.id = "haxeui-container";
			if(c.parentElement != null && c.parentElement.id != "haxeui-container-parent") {
				c.parentElement.id = "haxeui-container-parent";
			}
		}
		this._container = c;
		return c;
	}
	,_pageRoot: null
	,pageRoot: function(from) {
		if(this._pageRoot != null) {
			return this._pageRoot;
		}
		var r = null;
		var el = from;
		while(el != null) {
			if(el.classList.contains("haxeui-component") == false) {
				r = el;
				this._pageRoot = el;
				break;
			}
			el = el.parentElement;
		}
		return r;
	}
	,_hasListener: null
	,addResizeListener: function() {
		var _gthis = this;
		if(this._hasListener == true) {
			return;
		}
		this._hasListener = true;
		window.addEventListener("resize",function(e) {
			_gthis._width = null;
			_gthis._height = null;
			_gthis.resizeRootComponents();
		});
	}
	,supportsEvent: function(type) {
		return haxe_ui_backend_html5_EventMapper.HAXEUI_TO_DOM.h[type] != null;
	}
	,mapEvent: function(type,listener) {
		var _gthis = this;
		var container = window.document.body;
		switch(type) {
		case "keydown":case "keyup":
			if(Object.prototype.hasOwnProperty.call(this._mapping.h,type) == false) {
				this._mapping.h[type] = listener;
				container.addEventListener(haxe_ui_backend_html5_EventMapper.HAXEUI_TO_DOM.h[type],$bind(this,this.__onKeyEvent));
			}
			break;
		case "click":case "doubleclick":case "mousedown":case "mousemove":case "mouseout":case "mouseover":case "mouseup":case "rightclick":case "rightmousedown":case "rightmouseup":
			if(type == "mousemove" && Object.prototype.hasOwnProperty.call(this._mapping.h,type) == false && haxe_ui_backend_html5_UserAgent.get_instance().get_chrome() == true) {
				var fn = null;
				fn = function(e) {
					container.removeEventListener(haxe_ui_backend_html5_EventMapper.HAXEUI_TO_DOM.h["mousemove"],fn);
					if(haxe_ui_backend_html5_EventMapper.MOUSE_TO_TOUCH.h[type] != null) {
						container.removeEventListener(haxe_ui_backend_html5_EventMapper.MOUSE_TO_TOUCH.h[type],fn);
					}
					if(Object.prototype.hasOwnProperty.call(_gthis._mapping.h,type) == false) {
						if(haxe_ui_backend_html5_EventMapper.MOUSE_TO_TOUCH.h[type] != null) {
							container.addEventListener(haxe_ui_backend_html5_EventMapper.MOUSE_TO_TOUCH.h[type],$bind(_gthis,_gthis.__onMouseEvent));
						}
						_gthis._mapping.h[type] = listener;
						container.addEventListener(haxe_ui_backend_html5_EventMapper.HAXEUI_TO_DOM.h["mousemove"],$bind(_gthis,_gthis.__onMouseEvent));
					}
				};
				container.addEventListener(haxe_ui_backend_html5_EventMapper.HAXEUI_TO_DOM.h["mousemove"],fn);
				if(haxe_ui_backend_html5_EventMapper.MOUSE_TO_TOUCH.h[type] != null) {
					container.addEventListener(haxe_ui_backend_html5_EventMapper.MOUSE_TO_TOUCH.h[type],fn);
				}
				return;
			}
			if(Object.prototype.hasOwnProperty.call(this._mapping.h,type) == false) {
				if(haxe_ui_backend_html5_EventMapper.MOUSE_TO_TOUCH.h[type] != null) {
					container.addEventListener(haxe_ui_backend_html5_EventMapper.MOUSE_TO_TOUCH.h[type],$bind(this,this.__onMouseEvent));
				}
				this._mapping.h[type] = listener;
				container.addEventListener(haxe_ui_backend_html5_EventMapper.HAXEUI_TO_DOM.h[type],$bind(this,this.__onMouseEvent));
			}
			break;
		}
	}
	,unmapEvent: function(type,listener) {
		var container = window.document.body;
		switch(type) {
		case "keydown":case "keyup":
			var _this = this._mapping;
			if(Object.prototype.hasOwnProperty.call(_this.h,type)) {
				delete(_this.h[type]);
			}
			container.removeEventListener(haxe_ui_backend_html5_EventMapper.HAXEUI_TO_DOM.h[type],$bind(this,this.__onKeyEvent));
			break;
		case "click":case "doubleclick":case "mousedown":case "mousemove":case "mouseout":case "mouseover":case "mouseup":case "rightclick":case "rightmousedown":case "rightmouseup":
			var _this = this._mapping;
			if(Object.prototype.hasOwnProperty.call(_this.h,type)) {
				delete(_this.h[type]);
			}
			container.removeEventListener(haxe_ui_backend_html5_EventMapper.HAXEUI_TO_DOM.h[type],$bind(this,this.__onMouseEvent));
			if(haxe_ui_backend_html5_EventMapper.MOUSE_TO_TOUCH.h[type] != null) {
				container.removeEventListener(haxe_ui_backend_html5_EventMapper.MOUSE_TO_TOUCH.h[type],$bind(this,this.__onMouseEvent));
			}
			break;
		}
	}
	,__onMouseEvent: function(event) {
		var button = -1;
		var touchEvent = false;
		try {
			touchEvent = ((event) instanceof TouchEvent);
		} catch( _g ) {
		}
		if(touchEvent == false && ((event) instanceof MouseEvent)) {
			var me = js_Boot.__cast(event , MouseEvent);
			button = me.which;
		}
		var r = true;
		var type = haxe_ui_backend_html5_EventMapper.DOM_TO_HAXEUI.h[event.type];
		if(type == "rightclick") {
			event.stopPropagation();
			event.preventDefault();
			r = false;
		}
		if(type != null) {
			var fn = this._mapping.h[type];
			if(fn != null) {
				var mouseEvent = new haxe_ui_events_MouseEvent(type);
				mouseEvent._originalEvent = event;
				if(touchEvent == true) {
					var te = js_Boot.__cast(event , TouchEvent);
					mouseEvent.screenX = (te.changedTouches[0].pageX - haxe_ui_core_Screen.get_instance().get_container().offsetLeft) / haxe_ui_Toolkit.get_scaleX();
					mouseEvent.screenY = (te.changedTouches[0].pageY - haxe_ui_core_Screen.get_instance().get_container().offsetTop) / haxe_ui_Toolkit.get_scaleY();
					mouseEvent.touchEvent = true;
				} else if(((event) instanceof MouseEvent)) {
					var me = js_Boot.__cast(event , MouseEvent);
					mouseEvent.buttonDown = me.buttons != 0;
					mouseEvent.screenX = (me.pageX - haxe_ui_core_Screen.get_instance().get_container().offsetLeft) / haxe_ui_Toolkit.get_scaleX();
					mouseEvent.screenY = (me.pageY - haxe_ui_core_Screen.get_instance().get_container().offsetTop) / haxe_ui_Toolkit.get_scaleY();
					mouseEvent.ctrlKey = me.ctrlKey;
					mouseEvent.shiftKey = me.shiftKey;
				}
				fn(mouseEvent);
			}
		}
		return r;
	}
	,__onKeyEvent: function(event) {
		var type = haxe_ui_backend_html5_EventMapper.DOM_TO_HAXEUI.h[event.type];
		if(type != null) {
			if(event.keyCode == 9 || event.which == 9) {
				event.preventDefault();
				event.stopImmediatePropagation();
				event.stopPropagation();
			}
			var fn = this._mapping.h[type];
			if(fn != null) {
				var keyboardEvent = new haxe_ui_events_KeyboardEvent(type);
				keyboardEvent._originalEvent = event;
				keyboardEvent.keyCode = event.keyCode;
				keyboardEvent.ctrlKey = event.ctrlKey;
				keyboardEvent.shiftKey = event.shiftKey;
				fn(keyboardEvent);
			}
		}
	}
	,__class__: haxe_ui_backend_ScreenImpl
	,__properties__: $extend(haxe_ui_backend_ScreenBase.prototype.__properties__,{get_container:"get_container"})
});
var haxe_ui_backend_TextBase = function() {
	this._textHeight = 0;
	this._textWidth = 0;
	this._height = 0;
	this._width = 0;
	this._top = 0;
	this._left = 0;
	this._htmlText = null;
	this._inputData = new haxe_ui_core_TextInputData();
	this._displayData = new haxe_ui_core_TextDisplayData();
};
$hxClasses["haxe.ui.backend.TextBase"] = haxe_ui_backend_TextBase;
haxe_ui_backend_TextBase.__name__ = "haxe.ui.backend.TextBase";
haxe_ui_backend_TextBase.prototype = {
	parentComponent: null
	,_displayData: null
	,_inputData: null
	,_text: null
	,_htmlText: null
	,_left: null
	,_top: null
	,_width: null
	,_height: null
	,_textWidth: null
	,_textHeight: null
	,_textStyle: null
	,_fontInfo: null
	,focus: function() {
	}
	,blur: function() {
	}
	,dispose: function() {
		if(this.parentComponent != null) {
			this.parentComponent = null;
		}
	}
	,_dataSource: null
	,get_dataSource: function() {
		return this._dataSource;
	}
	,set_dataSource: function(value) {
		this._dataSource = value;
		return value;
	}
	,supportsHtml: null
	,get_supportsHtml: function() {
		return false;
	}
	,validateData: function() {
	}
	,validateStyle: function() {
		return false;
	}
	,validatePosition: function() {
	}
	,validateDisplay: function() {
	}
	,measureText: function() {
	}
	,measureTextWidth: function() {
		var textDisplay = new haxe_ui_core_TextDisplay();
		textDisplay._textStyle = this._textStyle;
		textDisplay._fontInfo = this._fontInfo;
		textDisplay.validateStyle();
		textDisplay._text = this._text;
		textDisplay.validateData();
		textDisplay.measureText();
		return textDisplay._textWidth;
	}
	,__class__: haxe_ui_backend_TextBase
	,__properties__: {get_supportsHtml:"get_supportsHtml",set_dataSource:"set_dataSource",get_dataSource:"get_dataSource"}
};
var haxe_ui_backend_TextDisplayImpl = function() {
	this._fixedHeight = false;
	this._fixedWidth = false;
	this._isHTML = false;
	haxe_ui_backend_TextBase.call(this);
	this._displayData.multiline = false;
	this.element = this.createElement();
};
$hxClasses["haxe.ui.backend.TextDisplayImpl"] = haxe_ui_backend_TextDisplayImpl;
haxe_ui_backend_TextDisplayImpl.__name__ = "haxe.ui.backend.TextDisplayImpl";
haxe_ui_backend_TextDisplayImpl.__super__ = haxe_ui_backend_TextBase;
haxe_ui_backend_TextDisplayImpl.prototype = $extend(haxe_ui_backend_TextBase.prototype,{
	element: null
	,_html: null
	,_isHTML: null
	,validateData: function() {
		var html = null;
		if(this._text != null) {
			html = this.normalizeText(this._text);
			this._isHTML = false;
		} else if(this._htmlText != null) {
			html = this.normalizeText(this._htmlText,false);
			this._isHTML = true;
		}
		if(html != null && this._html != html) {
			if(this._isHTML == false) {
				this.element.textContent = html;
			} else {
				this.element.innerHTML = html;
			}
			this._html = html;
			if(this.get_autoWidth() == true) {
				this._fixedWidth = false;
			}
			if(this.get_autoHeight() == true) {
				this._fixedHeight = false;
			}
		}
	}
	,_rawFontName: null
	,validateStyle: function() {
		var measureTextRequired = false;
		if(this._displayData.wordWrap == true && this.element.style.whiteSpace != null) {
			this.element.style.whiteSpace = "pre-wrap";
			this.element.style.wordBreak = "break-word";
			measureTextRequired = true;
		} else if(this._displayData.wordWrap == false && this.element.style.whiteSpace != "pre") {
			this.element.style.whiteSpace = "pre";
			measureTextRequired = true;
		}
		if(this._textStyle != null) {
			if(this.element.style.textAlign != this._textStyle.textAlign) {
				this.element.style.textAlign = this._textStyle.textAlign;
			}
			var fontSizeValue = "" + this._textStyle.fontSize + "px";
			if(this.element.style.fontSize != fontSizeValue) {
				this.element.style.fontSize = fontSizeValue;
				measureTextRequired = true;
			}
			if(this._textStyle.fontBold == true && this.element.style.fontWeight != "bold") {
				this.element.style.fontWeight = "bold";
				measureTextRequired = true;
			}
			if(this._textStyle.fontItalic == true && this.element.style.fontStyle != "italic") {
				this.element.style.fontStyle = "italic";
				measureTextRequired = true;
			}
			if(this._textStyle.fontUnderline == true && this.element.style.textDecoration != "underline") {
				this.element.style.textDecoration = "underline";
				measureTextRequired = true;
			}
			var colorValue = haxe_ui_backend_html5_HtmlUtils.color(this._textStyle.color);
			if(this.element.style.color != colorValue) {
				this.element.style.color = colorValue;
			}
			if(this._fontInfo != null && this._fontInfo.data != this._rawFontName) {
				this.element.style.fontFamily = this._fontInfo.data;
				this._rawFontName = this._fontInfo.data;
				measureTextRequired = true;
				var _this = this.parentComponent;
				if(!(_this._layout == null || _this._layoutLocked == true)) {
					_this.invalidateComponent("layout",false);
				}
			}
		}
		if(measureTextRequired == true) {
			if(this.get_autoWidth() == true) {
				this._fixedWidth = false;
			}
			if(this.get_autoHeight() == true) {
				this._fixedHeight = false;
			}
		}
		return measureTextRequired;
	}
	,validatePosition: function() {
		var style = this.element.style;
		style.left = "" + this._left + "px";
		style.top = "" + this._top + "px";
	}
	,_fixedWidth: null
	,_fixedHeight: null
	,validateDisplay: function() {
		var style = this.element.style;
		var allowFixed = true;
		if(this.get_autoWidth() == false && style.width != "" + this._width + "px") {
			allowFixed = false;
		}
		if(this._width > 0 && this.get_autoWidth() == false) {
			this._fixedWidth = true;
			style.width = "" + this._width + "px";
		}
		if(this._height > 0 && this.get_autoWidth() == false) {
			this._fixedHeight = true;
			style.height = "" + this._height + "px";
		}
		if(allowFixed == false) {
			this._fixedHeight = false;
		}
	}
	,measureText: function() {
		if(this._fixedWidth == true && this._fixedHeight == true) {
			return;
		}
		if(haxe_ui_backend_html5_HtmlUtils.DIV_HELPER == null) {
			haxe_ui_backend_html5_HtmlUtils.createDivHelper();
		}
		var div = haxe_ui_backend_html5_HtmlUtils.DIV_HELPER;
		this.setTempDivData(div);
		if(this._fixedWidth == false) {
			this._textWidth = div.clientWidth + 1;
		}
		if(this._fixedHeight == false) {
			this._textHeight = div.clientHeight;
		}
	}
	,createElement: function() {
		var el = window.document.createElement("div");
		el.style.position = "absolute";
		el.style.cursor = "inherit";
		return el;
	}
	,setTempDivData: function(div) {
		var t = null;
		if(this._text != null) {
			t = this.normalizeText(this._text);
		} else if(this._htmlText != null) {
			t = this.normalizeText(this._htmlText,false);
		}
		if(t == null || t.length == 0) {
			t = "|";
		}
		div.style.fontFamily = this.element.style.fontFamily;
		div.style.fontSize = this.element.style.fontSize;
		div.style.whiteSpace = this.element.style.whiteSpace;
		div.style.wordBreak = this.element.style.wordBreak;
		div.style.lineHeight = null;
		if(this.get_autoWidth() == false) {
			div.style.width = this._width > 0 ? "" + ("" + this._width + "px") : "";
		} else {
			div.style.width = "";
		}
		if(this._isHTML == false) {
			div.textContent = t;
		} else {
			div.innerHTML = t;
		}
	}
	,normalizeText: function(text,$escape) {
		if($escape == null) {
			$escape = true;
		}
		return text;
	}
	,autoWidth: null
	,get_autoWidth: function() {
		if(((this.parentComponent) instanceof haxe_ui_components_Label)) {
			return (js_Boot.__cast(this.parentComponent , haxe_ui_components_Label)).get_autoWidth();
		}
		return false;
	}
	,autoHeight: null
	,get_autoHeight: function() {
		if(((this.parentComponent) instanceof haxe_ui_components_Label)) {
			return (js_Boot.__cast(this.parentComponent , haxe_ui_components_Label)).get_autoHeight();
		}
		return false;
	}
	,get_supportsHtml: function() {
		return true;
	}
	,measureTextWidth: function() {
		if(haxe_ui_backend_html5_HtmlUtils.DIV_HELPER == null) {
			haxe_ui_backend_html5_HtmlUtils.createDivHelper();
		}
		var div = haxe_ui_backend_html5_HtmlUtils.DIV_HELPER;
		this.setTempDivData(div);
		div.style.width = "";
		return div.clientWidth;
	}
	,__class__: haxe_ui_backend_TextDisplayImpl
	,__properties__: $extend(haxe_ui_backend_TextBase.prototype.__properties__,{get_autoHeight:"get_autoHeight",get_autoWidth:"get_autoWidth"})
});
var haxe_ui_backend_TextInputImpl = function() {
	haxe_ui_backend_TextDisplayImpl.call(this);
};
$hxClasses["haxe.ui.backend.TextInputImpl"] = haxe_ui_backend_TextInputImpl;
haxe_ui_backend_TextInputImpl.__name__ = "haxe.ui.backend.TextInputImpl";
haxe_ui_backend_TextInputImpl.__super__ = haxe_ui_backend_TextDisplayImpl;
haxe_ui_backend_TextInputImpl.prototype = $extend(haxe_ui_backend_TextDisplayImpl.prototype,{
	focus: function() {
		this.element.focus({preventScroll: true});
	}
	,blur: function() {
		this.element.blur();
	}
	,onChangeEvent: function(e) {
		var newText = null;
		if(((this.element) instanceof HTMLTextAreaElement)) {
			newText = (js_Boot.__cast(this.element , HTMLTextAreaElement)).value;
		} else {
			newText = (js_Boot.__cast(this.element , HTMLInputElement)).value;
		}
		if(newText != this._text) {
			this._text = newText;
			this.measureText();
			if(this._inputData.onChangedCallback != null) {
				this._inputData.onChangedCallback();
			}
		}
	}
	,onScroll: function(e) {
		this._inputData.hscrollPos = this.element.scrollLeft;
		this._inputData.vscrollPos = this.element.scrollTop;
		this._inputData.hscrollMax = this._textWidth - this._width;
		this._inputData.hscrollPageSize = this._width * this._inputData.hscrollMax / this._textWidth;
		this._inputData.vscrollMax = this._textHeight - this._height;
		this._inputData.vscrollPageSize = this._height * this._inputData.vscrollMax / this._textHeight;
		if(this._inputData.onScrollCallback != null) {
			this._inputData.onScrollCallback();
		}
	}
	,validateData: function() {
		if(this._text != null) {
			var html = this.normalizeText(this._text);
			if(((this.element) instanceof HTMLInputElement)) {
				(js_Boot.__cast(this.element , HTMLInputElement)).value = html;
			} else if(((this.element) instanceof HTMLTextAreaElement)) {
				(js_Boot.__cast(this.element , HTMLTextAreaElement)).value = html;
			}
		}
		var hscrollValue = this._inputData.hscrollPos | 0;
		if(this.element.scrollLeft != hscrollValue) {
			this.element.scrollLeft = hscrollValue;
		}
		var vscrollValue = this._inputData.vscrollPos | 0;
		if(this.element.scrollTop != vscrollValue) {
			this.element.scrollTop = vscrollValue;
		}
	}
	,validateStyle: function() {
		var measureTextRequired = false;
		if(this._displayData.multiline == false && ((this.element) instanceof HTMLInputElement) == false || this._displayData.multiline == true && ((this.element) instanceof HTMLTextAreaElement) == false) {
			var newElement = this.createElement();
			this.element.parentElement.appendChild(newElement);
			haxe_ui_backend_html5_HtmlUtils.removeElement(this.element);
			this.element.removeEventListener("input",$bind(this,this.onChangeEvent));
			this.element.removeEventListener("propertychange",$bind(this,this.onChangeEvent));
			this.element.removeEventListener("scroll",$bind(this,this.onScroll));
			this.element = newElement;
			this.validateData();
			measureTextRequired = true;
		}
		if(((this.element) instanceof HTMLInputElement)) {
			var inputElement = this.element;
			if(this._inputData.password == true && inputElement.type != "password") {
				inputElement.type = "password";
			} else if(this._inputData.password == false && inputElement.type != "") {
				inputElement.type = "";
			}
		}
		if(this.parentComponent.get_disabled() || this.parentComponent._interactivityDisabled == true) {
			this.element.style.cursor = "not-allowed";
			if(((this.element) instanceof HTMLInputElement)) {
				(js_Boot.__cast(this.element , HTMLInputElement)).disabled = true;
			} else if(((this.element) instanceof HTMLTextAreaElement)) {
				(js_Boot.__cast(this.element , HTMLTextAreaElement)).disabled = true;
			}
		} else {
			this.element.style.cursor = null;
			if(((this.element) instanceof HTMLInputElement)) {
				(js_Boot.__cast(this.element , HTMLInputElement)).disabled = false;
			} else if(((this.element) instanceof HTMLTextAreaElement)) {
				(js_Boot.__cast(this.element , HTMLTextAreaElement)).disabled = false;
			}
		}
		if(!haxe_ui_backend_TextDisplayImpl.prototype.validateStyle.call(this)) {
			return measureTextRequired;
		} else {
			return true;
		}
	}
	,measureText: function() {
		if(haxe_ui_backend_html5_HtmlUtils.DIV_HELPER == null) {
			haxe_ui_backend_html5_HtmlUtils.createDivHelper();
		}
		var div = haxe_ui_backend_html5_HtmlUtils.DIV_HELPER;
		this.setTempDivData(div);
		this._textWidth = div.clientWidth;
		this._textHeight = div.clientHeight;
		this._inputData.hscrollMax = this._textWidth - this._width;
		this._inputData.hscrollPageSize = this._width * this._inputData.hscrollMax / this._textWidth;
		this._inputData.vscrollMax = this._textHeight - this._height;
		this._inputData.vscrollPageSize = this._height * this._inputData.vscrollMax / this._textHeight;
	}
	,createElement: function() {
		if(this.element != null) {
			this.element.removeEventListener("input",$bind(this,this.onChangeEvent));
			this.element.removeEventListener("propertychange",$bind(this,this.onChangeEvent));
			this.element.removeEventListener("scroll",$bind(this,this.onScroll));
		}
		var el = null;
		if(this._displayData.multiline == false) {
			el = window.document.createElement("input");
			el.style.border = "none";
			el.style.outline = "none";
			el.style.whiteSpace = "pre";
			el.style.overflow = "hidden";
			el.style.cursor = "initial";
			el.style.position = "absolute";
			el.style.backgroundColor = "inherit";
			el.style.padding = "0px";
			el.spellcheck = false;
		} else {
			el = window.document.createElement("textarea");
			el.style.border = "none";
			el.style.resize = "none";
			el.style.outline = "none";
			el.style.lineHeight = "1.4";
			el.style.padding = "0px";
			el.style.margin = "0px";
			el.style.bottom = "0px";
			el.style.right = "0px";
			el.style.overflow = "hidden";
			el.style.cursor = "initial";
			el.style.position = "absolute";
			el.style.backgroundColor = "inherit";
			el.style.whiteSpace = "pre-wrap";
			el.id = "textArea";
			el.spellcheck = false;
			el.onkeydown = function(e) {
				if(e.keyCode == 9 || e.which == 9) {
					e.preventDefault();
					e.stopImmediatePropagation();
					e.stopPropagation();
					var ta = js_Boot.__cast(el , HTMLTextAreaElement);
					var s = ta.selectionStart;
					ta.value = ta.value.substring(0,ta.selectionStart) + "\t" + ta.value.substring(ta.selectionEnd);
					ta.selectionEnd = s + 1;
					return false;
				}
				return true;
			};
		}
		el.addEventListener("input",$bind(this,this.onChangeEvent));
		el.addEventListener("propertychange",$bind(this,this.onChangeEvent));
		el.addEventListener("scroll",$bind(this,this.onScroll));
		return el;
	}
	,validatePosition: function() {
		var x = this._left;
		var y = this._top;
		if(this._displayData.multiline == false && this.parentComponent != null && this.parentComponent.get_style() != null) {
			if(this.parentComponent.get_style().borderLeftSize != null) {
				x -= this.parentComponent.get_style().borderLeftSize;
			}
			if(this.parentComponent.get_style().borderTopSize != null) {
				y -= this.parentComponent.get_style().borderTopSize;
			}
		}
		var style = this.element.style;
		style.left = "" + x + "px";
		style.top = "" + y + "px";
	}
	,setTempDivData: function(div) {
		var t = this._text;
		if(t == null || t.length == 0) {
			t = "|";
		}
		div.style.fontFamily = this.element.style.fontFamily;
		div.style.fontSize = this.element.style.fontSize;
		div.style.whiteSpace = this.element.style.whiteSpace;
		div.style.lineHeight = this.element.style.lineHeight;
		if(this.get_autoWidth() == false) {
			div.style.width = this._width > 0 ? "" + ("" + this._width + "px") : "";
		} else {
			div.style.width = "";
		}
		var normalizedText = haxe_ui_backend_TextDisplayImpl.prototype.normalizeText.call(this,t);
		if(this._displayData.multiline == true) {
			normalizedText += "<br>";
		}
		div.innerHTML = normalizedText;
	}
	,normalizeText: function(text,$escape) {
		if($escape == null) {
			$escape = true;
		}
		return StringTools.replace(text,"\\n","\n");
	}
	,__class__: haxe_ui_backend_TextInputImpl
});
var haxe_ui_backend_TimerImpl = function(delay,callback) {
	this._timer = new haxe_Timer(delay);
	this._timer.run = function() {
		callback();
	};
};
$hxClasses["haxe.ui.backend.TimerImpl"] = haxe_ui_backend_TimerImpl;
haxe_ui_backend_TimerImpl.__name__ = "haxe.ui.backend.TimerImpl";
haxe_ui_backend_TimerImpl.prototype = {
	_timer: null
	,stop: function() {
		this._timer.stop();
	}
	,__class__: haxe_ui_backend_TimerImpl
};
var haxe_ui_backend_html5_EventMapper = function() { };
$hxClasses["haxe.ui.backend.html5.EventMapper"] = haxe_ui_backend_html5_EventMapper;
haxe_ui_backend_html5_EventMapper.__name__ = "haxe.ui.backend.html5.EventMapper";
var haxe_ui_validation_ValidationManager = function() {
	this._displayQueue = [];
	this._queue = [];
	this.isValidating = false;
	this.isPending = false;
};
$hxClasses["haxe.ui.validation.ValidationManager"] = haxe_ui_validation_ValidationManager;
haxe_ui_validation_ValidationManager.__name__ = "haxe.ui.validation.ValidationManager";
haxe_ui_validation_ValidationManager.__properties__ = {get_instance:"get_instance"};
haxe_ui_validation_ValidationManager.get_instance = function() {
	if(haxe_ui_validation_ValidationManager.instance == null) {
		haxe_ui_validation_ValidationManager.instance = new haxe_ui_validation_ValidationManager();
	}
	return haxe_ui_validation_ValidationManager.instance;
};
haxe_ui_validation_ValidationManager.prototype = {
	isValidating: null
	,isPending: null
	,_queue: null
	,_displayQueue: null
	,_events: null
	,registerEvent: function(type,listener) {
		if(this._events == null) {
			this._events = new haxe_ui_util_EventMap();
		}
		this._events.add(type,listener);
	}
	,unregisterEvent: function(type,listener) {
		if(this._events == null) {
			this._events.remove(type,listener);
		}
	}
	,dispatch: function(event) {
		if(this._events != null) {
			this._events.invoke(event.type,event);
		}
	}
	,dispose: function() {
		this.isValidating = false;
		this._queue.splice(0,this._queue.length);
	}
	,add: function(object) {
		if(this._queue.indexOf(object) != -1) {
			return;
		}
		var queueLength = this._queue.length;
		if(this.isValidating == true) {
			var depth = object.get_depth();
			var min = 0;
			var max = queueLength;
			var i = 0;
			var otherDepth = 0;
			while(max > min) {
				i = min + max >>> 1;
				otherDepth = this._queue[i].get_depth();
				if(otherDepth == depth) {
					break;
				} else if(otherDepth < depth) {
					max = i;
				} else {
					min = i + 1;
				}
			}
			if(otherDepth >= depth) {
				++i;
			}
			this._queue.splice(i,0,object);
		} else {
			this._queue[queueLength] = object;
			if(this.isPending == false) {
				this.isPending = true;
				haxe_ui_Toolkit.callLater($bind(this,this.process));
			}
		}
	}
	,addDisplay: function(item,nextFrame) {
		if(nextFrame == null) {
			nextFrame = true;
		}
		if(this._displayQueue.indexOf(item) == -1) {
			this._displayQueue.push(item);
		}
		if(nextFrame == false) {
			this.process();
		}
	}
	,process: function() {
		if(this.isValidating == true || this.isPending == false) {
			return;
		}
		var queueLength = this._queue.length;
		if(queueLength == 0) {
			this.isPending = false;
			return;
		}
		this.isValidating = true;
		if(queueLength > 1) {
			this._queue.sort($bind(this,this.queueSortFunction));
		}
		this.dispatch(new haxe_ui_events_ValidationEvent("ValidationStart"));
		while(this._queue.length > 0) {
			var item = this._queue.shift();
			if(item.get_depth() < 0) {
				continue;
			}
			item.validateComponent();
		}
		var _g = 0;
		var _g1 = this._displayQueue.length;
		while(_g < _g1) {
			var i = _g++;
			var item = this._displayQueue[i];
			item.updateComponentDisplay();
		}
		this._displayQueue.splice(0,this._displayQueue.length);
		this.isValidating = false;
		this.isPending = false;
		this.dispatch(new haxe_ui_events_ValidationEvent("ValidationStop"));
	}
	,queueSortFunction: function(first,second) {
		var difference = second.get_depth() - first.get_depth();
		if(difference > 0) {
			return 1;
		} else if(difference < 0) {
			return -1;
		} else {
			return 0;
		}
	}
	,__class__: haxe_ui_validation_ValidationManager
};
var haxe_ui_backend_html5_HtmlUtils = function() { };
$hxClasses["haxe.ui.backend.html5.HtmlUtils"] = haxe_ui_backend_html5_HtmlUtils;
haxe_ui_backend_html5_HtmlUtils.__name__ = "haxe.ui.backend.html5.HtmlUtils";
haxe_ui_backend_html5_HtmlUtils.__properties__ = {get_dpi:"get_dpi"};
haxe_ui_backend_html5_HtmlUtils.px = function(value) {
	return "" + value + "px";
};
haxe_ui_backend_html5_HtmlUtils.color = function(value) {
	if(value == null) {
		return "rgba(0, 0, 0, 0)";
	}
	return "#" + StringTools.hex(value,6);
};
haxe_ui_backend_html5_HtmlUtils.rgba = function(value,alpha) {
	if(alpha == null) {
		alpha = 1;
	}
	var r = value >> 16 & 255;
	var g = value >> 8 & 255;
	var b = value & 255;
	return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
};
haxe_ui_backend_html5_HtmlUtils.escape = function(s) {
	s = StringTools.replace(s,"\"","&quot;");
	s = StringTools.replace(s,"'","&#39;");
	s = StringTools.replace(s,"<","&lt;");
	s = StringTools.replace(s,">","&gt;");
	return s;
};
haxe_ui_backend_html5_HtmlUtils.namedChild = function(el,child,index) {
	if(index == null) {
		index = 0;
	}
	if(child != null) {
		var list = el.getElementsByTagName(child);
		if(list.length == 0) {
			return null;
		}
		el = list.item(index);
	}
	return el;
};
haxe_ui_backend_html5_HtmlUtils.onValidationStop = function(e) {
	var tmp = haxe_ui_backend_html5_HtmlUtils.DIV_HELPER != null;
};
haxe_ui_backend_html5_HtmlUtils.createDivHelper = function() {
	if(haxe_ui_backend_html5_HtmlUtils.DIV_HELPER == null) {
		haxe_ui_backend_html5_HtmlUtils.DIV_HELPER = window.document.createElement("div");
		haxe_ui_backend_html5_HtmlUtils.DIV_HELPER.style.position = "absolute";
		haxe_ui_backend_html5_HtmlUtils.DIV_HELPER.style.top = "-99999px";
		haxe_ui_backend_html5_HtmlUtils.DIV_HELPER.style.left = "-99999px";
		window.document.body.appendChild(haxe_ui_backend_html5_HtmlUtils.DIV_HELPER);
	}
};
haxe_ui_backend_html5_HtmlUtils.measureText = function(text,addWidth,addHeight,fontSize,fontName) {
	if(fontSize == null) {
		fontSize = -1;
	}
	if(addHeight == null) {
		addHeight = 0;
	}
	if(addWidth == null) {
		addWidth = 0;
	}
	if(haxe_ui_backend_html5_HtmlUtils.DIV_HELPER == null) {
		haxe_ui_backend_html5_HtmlUtils.createDivHelper();
	}
	haxe_ui_backend_html5_HtmlUtils.DIV_HELPER.style.width = "";
	haxe_ui_backend_html5_HtmlUtils.DIV_HELPER.style.height = "";
	if(fontSize > 0) {
		haxe_ui_backend_html5_HtmlUtils.DIV_HELPER.style.fontSize = "" + fontSize + "px";
	} else {
		haxe_ui_backend_html5_HtmlUtils.DIV_HELPER.style.fontSize = "";
	}
	if(fontName != null) {
		haxe_ui_backend_html5_HtmlUtils.DIV_HELPER.style.fontFamily = fontName;
	} else {
		haxe_ui_backend_html5_HtmlUtils.DIV_HELPER.style.fontFamily = "";
	}
	haxe_ui_backend_html5_HtmlUtils.DIV_HELPER.innerHTML = text;
	return new haxe_ui_geom_Size(haxe_ui_backend_html5_HtmlUtils.DIV_HELPER.clientWidth + addWidth,haxe_ui_backend_html5_HtmlUtils.DIV_HELPER.clientHeight + addHeight);
};
haxe_ui_backend_html5_HtmlUtils.get_dpi = function() {
	if(haxe_ui_backend_html5_HtmlUtils._dpi != 0) {
		return haxe_ui_backend_html5_HtmlUtils._dpi;
	}
	var div = window.document.createElement("div");
	div.style.width = "1in";
	div.style.height = "1in";
	div.style.position = "absolute";
	div.style.top = "-99999px";
	div.style.left = "-99999px";
	window.document.body.appendChild(div);
	var devicePixelRatio = window.devicePixelRatio;
	if(devicePixelRatio == null) {
		devicePixelRatio = 1;
	}
	haxe_ui_backend_html5_HtmlUtils._dpi = div.offsetWidth * devicePixelRatio;
	haxe_ui_backend_html5_HtmlUtils.removeElement(div);
	return haxe_ui_backend_html5_HtmlUtils._dpi;
};
haxe_ui_backend_html5_HtmlUtils.swapElements = function(el1,el2) {
	el2.parentElement.insertBefore(el2,el1);
};
haxe_ui_backend_html5_HtmlUtils.insertBefore = function(el,before) {
	before.parentElement.insertBefore(before,el);
};
haxe_ui_backend_html5_HtmlUtils.removeElement = function(el) {
	if(el != null && el.parentElement != null) {
		el.parentElement.removeChild(el);
	}
};
haxe_ui_backend_html5_HtmlUtils.isRetinaDisplay = function() {
	if(haxe_ui_backend_html5_HtmlUtils._isRetina == null) {
		var query = "(-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2), (min-resolution: 192dpi)";
		if(window.matchMedia(query).matches) {
			haxe_ui_backend_html5_HtmlUtils._isRetina = true;
		} else {
			haxe_ui_backend_html5_HtmlUtils._isRetina = false;
		}
	}
	return haxe_ui_backend_html5_HtmlUtils._isRetina;
};
var haxe_ui_backend_html5_StyleHelper = function() { };
$hxClasses["haxe.ui.backend.html5.StyleHelper"] = haxe_ui_backend_html5_StyleHelper;
haxe_ui_backend_html5_StyleHelper.__name__ = "haxe.ui.backend.html5.StyleHelper";
haxe_ui_backend_html5_StyleHelper.apply = function(component,width,height,style) {
	var element = component.element;
	var css = element.style;
	var slice = null;
	if(style.backgroundImageSliceTop != null && style.backgroundImageSliceLeft != null && style.backgroundImageSliceBottom != null && style.backgroundImageSliceRight != null) {
		slice = new haxe_ui_geom_Rectangle(style.backgroundImageSliceLeft,style.backgroundImageSliceTop,style.backgroundImageSliceRight - style.backgroundImageSliceLeft,style.backgroundImageSliceBottom - style.backgroundImageSliceTop);
	}
	if(slice != null) {
		width = Math.round(width);
		height = Math.round(height);
	}
	css.width = "" + width + "px";
	css.height = "" + height + "px";
	var borderStyle = style.borderStyle;
	if(borderStyle == null) {
		borderStyle = "solid";
	}
	if(style.borderLeftSize != null && style.borderLeftSize == style.borderRightSize && style.borderLeftSize == style.borderBottomSize && style.borderLeftSize == style.borderTopSize) {
		if(style.borderLeftSize > 0) {
			css.borderWidth = "" + style.borderLeftSize + "px";
			css.borderStyle = borderStyle;
		} else {
			css.removeProperty("border-width");
			css.removeProperty("border-style");
		}
	} else if(style.borderLeftSize == null && style.borderRightSize == null && style.borderBottomSize == null && style.borderTopSize == null) {
		css.removeProperty("border-width");
		css.removeProperty("border-style");
	} else {
		if(style.borderTopSize != null && style.borderTopSize > 0) {
			css.borderTopWidth = "" + style.borderTopSize + "px";
			css.borderTopStyle = borderStyle;
		} else {
			css.removeProperty("border-top-width");
			css.removeProperty("border-top-style");
		}
		if(style.borderLeftSize != null && style.borderLeftSize > 0) {
			css.borderLeftWidth = "" + style.borderLeftSize + "px";
			css.borderLeftStyle = borderStyle;
		} else {
			css.removeProperty("border-left-width");
			css.removeProperty("border-left-style");
		}
		if(style.borderBottomSize != null && style.borderBottomSize > 0) {
			css.borderBottomWidth = "" + style.borderBottomSize + "px";
			css.borderBottomStyle = borderStyle;
		} else {
			css.removeProperty("border-bottom-width");
			css.removeProperty("border-bottom-style");
		}
		if(style.borderRightSize != null && style.borderRightSize > 0) {
			css.borderRightWidth = "" + style.borderRightSize + "px";
			css.borderRightStyle = borderStyle;
		} else {
			css.removeProperty("border-right-width");
			css.removeProperty("border-right-style");
		}
	}
	if(style.borderLeftColor != null && style.borderLeftColor == style.borderRightColor && style.borderLeftColor == style.borderBottomColor && style.borderLeftColor == style.borderTopColor) {
		if(style.borderOpacity == null) {
			css.borderColor = haxe_ui_backend_html5_HtmlUtils.color(style.borderLeftColor);
		} else {
			css.borderColor = haxe_ui_backend_html5_HtmlUtils.rgba(style.borderLeftColor,style.borderOpacity);
		}
	} else if(style.borderLeftColor == null && style.borderRightColor == null && style.borderBottomColor == null && style.borderTopColor == null) {
		css.removeProperty("border-color");
	} else {
		if(style.borderTopColor != null && style.borderTopSize != null) {
			if(style.borderOpacity == null) {
				css.borderTopColor = haxe_ui_backend_html5_HtmlUtils.color(style.borderTopColor);
			} else {
				css.borderTopColor = haxe_ui_backend_html5_HtmlUtils.rgba(style.borderTopColor,style.borderOpacity);
			}
		} else if(style.borderTopColor == null && style.borderTopSize != null) {
			css.borderTopColor = haxe_ui_backend_html5_HtmlUtils.color(style.borderTopColor);
		} else {
			css.removeProperty("border-top-color");
		}
		if(style.borderLeftColor != null && style.borderLeftSize != null) {
			if(style.borderOpacity == null) {
				css.borderLeftColor = haxe_ui_backend_html5_HtmlUtils.color(style.borderLeftColor);
			} else {
				css.borderLeftColor = haxe_ui_backend_html5_HtmlUtils.rgba(style.borderLeftColor,style.borderOpacity);
			}
		} else if(style.borderLeftColor == null && style.borderLeftSize != null) {
			css.borderLeftColor = haxe_ui_backend_html5_HtmlUtils.color(style.borderLeftColor);
		} else {
			css.removeProperty("border-left-color");
		}
		if(style.borderBottomColor != null && style.borderBottomSize != null) {
			if(style.borderOpacity == null) {
				css.borderBottomColor = haxe_ui_backend_html5_HtmlUtils.color(style.borderBottomColor);
			} else {
				css.borderBottomColor = haxe_ui_backend_html5_HtmlUtils.rgba(style.borderBottomColor,style.borderOpacity);
			}
		} else if(style.borderBottomColor == null && style.borderBottomSize != null) {
			css.borderBottomColor = haxe_ui_backend_html5_HtmlUtils.color(style.borderBottomColor);
		} else {
			css.removeProperty("border-bottom-color");
		}
		if(style.borderRightColor != null && style.borderRightSize != null) {
			if(style.borderOpacity == null) {
				css.borderRightColor = haxe_ui_backend_html5_HtmlUtils.color(style.borderRightColor);
			} else {
				css.borderRightColor = haxe_ui_backend_html5_HtmlUtils.rgba(style.borderRightColor,style.borderOpacity);
			}
		} else if(style.borderRightColor == null && style.borderRightSize != null) {
			css.borderRightColor = haxe_ui_backend_html5_HtmlUtils.color(style.borderRightColor);
		} else {
			css.removeProperty("border-right-color");
		}
	}
	var background = [];
	if(style.backgroundColor != null) {
		if(style.backgroundColorEnd != null && style.backgroundColorEnd != style.backgroundColor) {
			css.removeProperty("background-color");
			var gradientStyle = style.backgroundGradientStyle;
			if(gradientStyle == null) {
				gradientStyle = "vertical";
			}
			if(style.backgroundOpacity != null) {
				if(gradientStyle == "vertical") {
					background.push("linear-gradient(to bottom, " + haxe_ui_backend_html5_HtmlUtils.rgba(style.backgroundColor,style.backgroundOpacity) + ", " + haxe_ui_backend_html5_HtmlUtils.rgba(style.backgroundColorEnd,style.backgroundOpacity) + ")");
				} else if(gradientStyle == "horizontal") {
					background.push("linear-gradient(to right, " + haxe_ui_backend_html5_HtmlUtils.rgba(style.backgroundColor,style.backgroundOpacity) + ", " + haxe_ui_backend_html5_HtmlUtils.rgba(style.backgroundColorEnd,style.backgroundOpacity) + ")");
				}
			} else if(gradientStyle == "vertical") {
				background.push("linear-gradient(to bottom, " + haxe_ui_backend_html5_HtmlUtils.color(style.backgroundColor) + ", " + haxe_ui_backend_html5_HtmlUtils.color(style.backgroundColorEnd) + ")");
			} else if(gradientStyle == "horizontal") {
				background.push("linear-gradient(to right, " + haxe_ui_backend_html5_HtmlUtils.color(style.backgroundColor) + ", " + haxe_ui_backend_html5_HtmlUtils.color(style.backgroundColorEnd) + ")");
			}
		} else {
			css.removeProperty("background");
			if(style.backgroundOpacity != null) {
				css.backgroundColor = haxe_ui_backend_html5_HtmlUtils.rgba(style.backgroundColor,style.backgroundOpacity);
			} else {
				css.backgroundColor = haxe_ui_backend_html5_HtmlUtils.color(style.backgroundColor);
			}
		}
	} else {
		css.removeProperty("background");
		css.removeProperty("background-color");
	}
	if(style.borderRadius != null && style.borderRadius > 0 && (style.borderRadiusTopLeft == null || style.borderRadiusTopLeft == style.borderRadius) && (style.borderRadiusTopRight == null || style.borderRadiusTopRight == style.borderRadius) && (style.borderRadiusBottomLeft == null || style.borderRadiusBottomLeft == style.borderRadius) && (style.borderRadiusBottomRight == null || style.borderRadiusBottomRight == style.borderRadius)) {
		css.borderRadius = "" + style.borderRadius + "px";
	} else if(style.borderRadiusTopLeft != null && style.borderRadiusTopLeft > 0 || style.borderRadiusTopRight != null && style.borderRadiusTopRight > 0 || style.borderRadiusBottomLeft != null && style.borderRadiusBottomLeft > 0 || style.borderRadiusBottomRight != null && style.borderRadiusBottomRight > 0) {
		if(style.borderRadiusTopLeft != null && style.borderRadiusTopLeft > 0) {
			css.borderTopLeftRadius = "" + style.borderRadiusTopLeft + "px";
		} else {
			css.removeProperty("border-top-left-radius");
		}
		if(style.borderRadiusTopRight != null && style.borderRadiusTopRight > 0) {
			css.borderTopRightRadius = "" + style.borderRadiusTopRight + "px";
		} else {
			css.removeProperty("border-top-right-radius");
		}
		if(style.borderRadiusBottomLeft != null && style.borderRadiusBottomLeft > 0) {
			css.borderBottomLeftRadius = "" + style.borderRadiusBottomLeft + "px";
		} else {
			css.removeProperty("border-bottom-left-radius");
		}
		if(style.borderRadiusBottomRight != null && style.borderRadiusBottomRight > 0) {
			css.borderBottomRightRadius = "" + style.borderRadiusBottomRight + "px";
		} else {
			css.removeProperty("border-bottom-right-radius");
		}
	} else {
		css.removeProperty("border-radius");
	}
	if(style.backgroundImage != null) {
		haxe_ui_Toolkit.get_assets().getImage(style.backgroundImage,function(imageInfo) {
			if(imageInfo == null) {
				return;
			}
			var imageRect = new haxe_ui_geom_Rectangle(0,0,imageInfo.width,imageInfo.height);
			if(style.backgroundImageClipTop != null && style.backgroundImageClipLeft != null && style.backgroundImageClipBottom != null && style.backgroundImageClipRight != null) {
				imageRect = new haxe_ui_geom_Rectangle(style.backgroundImageClipLeft,style.backgroundImageClipTop,style.backgroundImageClipRight - style.backgroundImageClipLeft,style.backgroundImageClipBottom - style.backgroundImageClipTop);
			}
			if(slice == null) {
				if(imageRect.width == imageInfo.width && imageRect.height == imageInfo.height) {
					background.push("url(" + imageInfo.data.src + ")");
					if(style.backgroundImageRepeat == null) {
						css.backgroundRepeat = "no-repeat";
						css.removeProperty("background-size");
					} else if(style.backgroundImageRepeat == "repeat") {
						css.backgroundRepeat = "repeat";
						css.removeProperty("background-size");
					} else if(style.backgroundImageRepeat == "stretch") {
						css.backgroundRepeat = "no-repeat";
						css.backgroundSize = "100% 100%";
					}
					background.reverse();
					css.background = background.join(",");
				} else {
					var canvas = component.getCanvas(width,height);
					var ctx = canvas.getContext("2d",null);
					ctx.clearRect(0,0,width,height);
					haxe_ui_backend_html5_StyleHelper.paintBitmap(ctx,imageInfo.data,imageRect,new haxe_ui_geom_Rectangle(0,0,width,height));
				}
			} else {
				var rects = haxe_ui_geom_Slice9.buildRects(width,height,imageRect.width,imageRect.height,slice);
				var srcRects = rects.src;
				var dstRects = rects.dst;
				var canvas = component.getCanvas(width,height);
				var ctx = canvas.getContext("2d",null);
				ctx.clearRect(0,0,width,height);
				ctx.imageSmoothingEnabled = false;
				var _g = 0;
				var _g1 = srcRects.length;
				while(_g < _g1) {
					var i = _g++;
					var srcRect = new haxe_ui_geom_Rectangle(srcRects[i].left + imageRect.left,srcRects[i].top + imageRect.top,srcRects[i].width,srcRects[i].height);
					var dstRect = dstRects[i];
					haxe_ui_backend_html5_StyleHelper.paintBitmap(ctx,imageInfo.data,srcRect,dstRect);
				}
			}
		});
	} else {
		component.removeCanvas();
		css.background = background[0];
	}
};
haxe_ui_backend_html5_StyleHelper.paintBitmap = function(ctx,img,srcRect,dstRect) {
	if(srcRect.width == 0 || srcRect.height == 0) {
		return;
	}
	if(dstRect.width == 0 || dstRect.height == 0) {
		return;
	}
	ctx.drawImage(img,srcRect.left | 0,srcRect.top | 0,srcRect.width | 0,srcRect.height | 0,dstRect.left | 0,dstRect.top | 0,dstRect.width | 0,dstRect.height | 0);
};
var haxe_ui_backend_html5_UserAgent = function() {
	this._unknown = false;
	this._msie = false;
	this._firefox = false;
	this._safari = false;
	this._chrome = false;
	this._opera = false;
	var ua = $global.navigator.userAgent;
	if(ua.indexOf("Opera") != -1 || ua.indexOf("OPR") != -1) {
		this._opera = true;
	} else if(ua.indexOf("Chrome") != -1) {
		this._chrome = true;
	} else if(ua.indexOf("Safari") != -1) {
		this._safari = true;
	} else if(ua.indexOf("Firefox") != -1) {
		this._firefox = true;
	} else if(ua.indexOf("MSIE") != -1) {
		this._msie = true;
	} else {
		this._unknown = true;
	}
};
$hxClasses["haxe.ui.backend.html5.UserAgent"] = haxe_ui_backend_html5_UserAgent;
haxe_ui_backend_html5_UserAgent.__name__ = "haxe.ui.backend.html5.UserAgent";
haxe_ui_backend_html5_UserAgent.__properties__ = {get_instance:"get_instance"};
haxe_ui_backend_html5_UserAgent.get_instance = function() {
	if(haxe_ui_backend_html5_UserAgent._instance == null) {
		haxe_ui_backend_html5_UserAgent._instance = new haxe_ui_backend_html5_UserAgent();
	}
	return haxe_ui_backend_html5_UserAgent._instance;
};
haxe_ui_backend_html5_UserAgent.prototype = {
	_opera: null
	,opera: null
	,get_opera: function() {
		return this._opera;
	}
	,_chrome: null
	,chrome: null
	,get_chrome: function() {
		return this._chrome;
	}
	,_safari: null
	,safari: null
	,get_safari: function() {
		return this._safari;
	}
	,_firefox: null
	,firefox: null
	,get_firefox: function() {
		return this._firefox;
	}
	,_msie: null
	,msie: null
	,get_msie: function() {
		return this._msie;
	}
	,_unknown: null
	,unknown: null
	,get_unknown: function() {
		return this._unknown;
	}
	,__class__: haxe_ui_backend_html5_UserAgent
	,__properties__: {get_unknown:"get_unknown",get_msie:"get_msie",get_firefox:"get_firefox",get_safari:"get_safari",get_chrome:"get_chrome",get_opera:"get_opera"}
};
var haxe_ui_backend_html5_util_FontDetect = function() {
};
$hxClasses["haxe.ui.backend.html5.util.FontDetect"] = haxe_ui_backend_html5_util_FontDetect;
haxe_ui_backend_html5_util_FontDetect.__name__ = "haxe.ui.backend.html5.util.FontDetect";
haxe_ui_backend_html5_util_FontDetect.init = function() {
	if(haxe_ui_backend_html5_util_FontDetect._initialized == true) {
		return;
	}
	haxe_ui_backend_html5_util_FontDetect._initialized = true;
	var body = window.document.body;
	var firstChild = window.document.body.firstChild;
	var div = window.document.createElement("div");
	div.id = "fontdetectHelper";
	haxe_ui_backend_html5_util_FontDetect.span = window.document.createElement("span");
	haxe_ui_backend_html5_util_FontDetect.span.innerText = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	div.appendChild(haxe_ui_backend_html5_util_FontDetect.span);
	body.insertBefore(div,firstChild);
	div.style.position = "absolute";
	div.style.visibility = "hidden";
	div.style.top = "-200px";
	div.style.left = "-100000px";
	div.style.width = "100000px";
	div.style.height = "200px";
	div.style.fontSize = "100px";
};
haxe_ui_backend_html5_util_FontDetect.onFontLoaded = function(cssFontName,onLoad,onFail,options) {
	if(cssFontName == null) {
		return;
	}
	var msInterval = 10;
	if(options != null && options.msInterval != null) {
		msInterval = options.msInterval;
	}
	var msTimeout = 2000;
	if(options != null && options.msTimeout != null) {
		msTimeout = options.msTimeout;
	}
	if(onLoad == null && onFail == null) {
		return;
	}
	if(haxe_ui_backend_html5_util_FontDetect._initialized == false) {
		haxe_ui_backend_html5_util_FontDetect.init();
	}
	if(haxe_ui_backend_html5_util_FontDetect.isFontLoaded(cssFontName)) {
		if(onLoad != null) {
			onLoad(cssFontName);
		}
		return;
	}
	var utStart = new Date().getTime();
	var idInterval = 0;
	idInterval = window.setInterval(function() {
		if(haxe_ui_backend_html5_util_FontDetect.isFontLoaded(cssFontName)) {
			window.clearInterval(idInterval);
			if(onLoad != null) {
				onLoad(cssFontName);
			}
			return;
		} else {
			var utNow = new Date().getTime();
			if(utNow - utStart > msTimeout) {
				window.clearInterval(idInterval);
				if(onFail != null) {
					onFail(cssFontName);
				}
			}
		}
	},msInterval);
};
haxe_ui_backend_html5_util_FontDetect.isFontLoaded = function(cssFontName) {
	var wThisFont = 0;
	var wPrevFont = 0;
	if(haxe_ui_backend_html5_util_FontDetect._initialized == false) {
		haxe_ui_backend_html5_util_FontDetect.init();
	}
	var _g = 0;
	var _g1 = haxe_ui_backend_html5_util_FontDetect._aFallbackFonts.length;
	while(_g < _g1) {
		var ix = _g++;
		haxe_ui_backend_html5_util_FontDetect.span.style.fontFamily = cssFontName + "," + haxe_ui_backend_html5_util_FontDetect._aFallbackFonts[ix];
		wThisFont = haxe_ui_backend_html5_util_FontDetect.span.offsetWidth;
		if(ix > 0 && wThisFont != wPrevFont) {
			return false;
		}
		wPrevFont = wThisFont;
	}
	return true;
};
haxe_ui_backend_html5_util_FontDetect.prototype = {
	__class__: haxe_ui_backend_html5_util_FontDetect
};
var haxe_ui_backend_html5_util_StyleSheetHelper = function() {
};
$hxClasses["haxe.ui.backend.html5.util.StyleSheetHelper"] = haxe_ui_backend_html5_util_StyleSheetHelper;
haxe_ui_backend_html5_util_StyleSheetHelper.__name__ = "haxe.ui.backend.html5.util.StyleSheetHelper";
haxe_ui_backend_html5_util_StyleSheetHelper.getValidStyleSheet = function() {
	if(haxe_ui_backend_html5_util_StyleSheetHelper._sheet != null) {
		return haxe_ui_backend_html5_util_StyleSheetHelper._sheet;
	}
	var sheet = null;
	var _g = 0;
	var _g1 = window.document.styleSheets;
	while(_g < _g1.length) {
		var test = _g1[_g];
		++_g;
		if(test.ownerNode == null || test.disabled == true) {
			continue;
		}
		var css = js_Boot.__cast(test , CSSStyleSheet);
		if(css.ownerNode.nodeName == "STYLE" && css.href == null) {
			try {
				var r = css.cssRules;
				sheet = css;
				break;
			} catch( _g2 ) {
			}
		}
	}
	if(sheet == null) {
		var styleElement = window.document.createElement("style");
		styleElement.appendChild(window.document.createTextNode(""));
		window.document.head.appendChild(styleElement);
		sheet = js_Boot.__cast(styleElement.sheet , CSSStyleSheet);
	}
	haxe_ui_backend_html5_util_StyleSheetHelper._sheet = sheet;
	return sheet;
};
haxe_ui_backend_html5_util_StyleSheetHelper.prototype = {
	__class__: haxe_ui_backend_html5_util_StyleSheetHelper
};
var haxe_ui_behaviours_Behaviour = function(component) {
	this.config = null;
	this._component = component;
};
$hxClasses["haxe.ui.behaviours.Behaviour"] = haxe_ui_behaviours_Behaviour;
haxe_ui_behaviours_Behaviour.__name__ = "haxe.ui.behaviours.Behaviour";
haxe_ui_behaviours_Behaviour.prototype = {
	config: null
	,_component: null
	,id: null
	,set: function(value) {
	}
	,setDynamic: function(value) {
		this.set(haxe_ui_util_Variant.fromDynamic(value));
	}
	,detatch: function() {
	}
	,get: function() {
		return null;
	}
	,getDynamic: function() {
		return haxe_ui_util_Variant.toDynamic(this.get());
	}
	,update: function() {
	}
	,call: function(param) {
		return null;
	}
	,getConfigValue: function(name,defaultValue) {
		if(this.config == null) {
			return defaultValue;
		}
		if(Object.prototype.hasOwnProperty.call(this.config.h,name) == false) {
			return defaultValue;
		}
		return this.config.h[name];
	}
	,getConfigValueBool: function(name,defaultValue) {
		if(defaultValue == null) {
			defaultValue = false;
		}
		var v = defaultValue;
		var s = this.getConfigValue(name);
		if(s != null) {
			v = s == "true";
		}
		return v;
	}
	,__class__: haxe_ui_behaviours_Behaviour
};
var haxe_ui_behaviours_Behaviours = function(component) {
	this._actualUpdateOrder = null;
	this._updateOrder = [];
	this._instances = new haxe_ds_StringMap();
	this._registry = new haxe_ds_StringMap();
	this._component = component;
};
$hxClasses["haxe.ui.behaviours.Behaviours"] = haxe_ui_behaviours_Behaviours;
haxe_ui_behaviours_Behaviours.__name__ = "haxe.ui.behaviours.Behaviours";
haxe_ui_behaviours_Behaviours.prototype = {
	_component: null
	,_registry: null
	,_instances: null
	,register: function(id,cls,defaultValue) {
		var info = { id : id, cls : cls, defaultValue : defaultValue, isSet : false};
		this._registry.h[id] = info;
		HxOverrides.remove(this._updateOrder,id);
		this._updateOrder.push(id);
		this._actualUpdateOrder = null;
	}
	,isRegistered: function(id) {
		return Object.prototype.hasOwnProperty.call(this._registry.h,id);
	}
	,replaceNative: function() {
		if(this._component.get_native() == false || this._component.get_hasNativeEntry() == false) {
			return;
		}
		var ids = [];
		var h = this._registry.h;
		var id_h = h;
		var id_keys = Object.keys(h);
		var id_length = id_keys.length;
		var id_current = 0;
		while(id_current < id_length) {
			var id = id_keys[id_current++];
			ids.push(id);
		}
		var _g = 0;
		while(_g < ids.length) {
			var id = ids[_g];
			++_g;
			var nativeProps = this._component.getNativeConfigProperties(".behaviour[id=" + id + "]");
			if(nativeProps != null && Object.prototype.hasOwnProperty.call(nativeProps.h,"class")) {
				var registered = this._registry.h[id];
				var name = nativeProps.h["class"];
				var info = { id : id, cls : $hxClasses[name], defaultValue : registered.defaultValue, config : nativeProps, isSet : false};
				this._registry.h[id] = info;
			}
		}
	}
	,validateData: function() {
		var _g = 0;
		var _g1 = this.get_actualUpdateOrder();
		while(_g < _g1.length) {
			var key = _g1[_g];
			++_g;
			var b = this._instances.h[key];
			if(js_Boot.__implements(b,haxe_ui_behaviours_IValidatingBehaviour)) {
				(js_Boot.__cast(b , haxe_ui_behaviours_IValidatingBehaviour)).validate();
			}
		}
	}
	,_updateOrder: null
	,get_updateOrder: function() {
		return this._updateOrder;
	}
	,set_updateOrder: function(value) {
		this._updateOrder = value;
		this._actualUpdateOrder = null;
		return value;
	}
	,_actualUpdateOrder: null
	,actualUpdateOrder: null
	,get_actualUpdateOrder: function() {
		if(this._actualUpdateOrder == null) {
			this._actualUpdateOrder = this._updateOrder.slice();
			var h = this._instances.h;
			var key_h = h;
			var key_keys = Object.keys(h);
			var key_length = key_keys.length;
			var key_current = 0;
			while(key_current < key_length) {
				var key = key_keys[key_current++];
				if(this._actualUpdateOrder.indexOf(key) == -1) {
					this._actualUpdateOrder.push(key);
				}
			}
		}
		return this._actualUpdateOrder;
	}
	,update: function() {
		var _g = 0;
		var _g1 = this.get_actualUpdateOrder();
		while(_g < _g1.length) {
			var key = _g1[_g];
			++_g;
			var b = this._instances.h[key];
			if(b != null) {
				b.update();
			}
		}
	}
	,find: function(id,create) {
		if(create == null) {
			create = true;
		}
		var b = this._instances.h[id];
		if(b == null && create == true) {
			var info = this._registry.h[id];
			if(info != null) {
				b = Type.createInstance(info.cls,[this._component]);
				if(b != null) {
					b.config = info.config;
					b.id = id;
					this._instances.h[id] = b;
					this._actualUpdateOrder = null;
				} else {
					var c = js_Boot.getClass(this._component);
					haxe_Log.trace("WARNING: problem creating behaviour class '" + Std.string(info.cls) + "' for '" + c.__name__ + ":" + id + "'",{ fileName : "haxe/ui/behaviours/Behaviours.hx", lineNumber : 140, className : "haxe.ui.behaviours.Behaviours", methodName : "find"});
				}
			}
		}
		if(b == null) {
			throw haxe_Exception.thrown("behaviour " + id + " not found");
		}
		return b;
	}
	,_cache: null
	,cache: function() {
		this._cache = new haxe_ds_StringMap();
		var h = this._registry.h;
		var registeredKey_h = h;
		var registeredKey_keys = Object.keys(h);
		var registeredKey_length = registeredKey_keys.length;
		var registeredKey_current = 0;
		while(registeredKey_current < registeredKey_length) {
			var registeredKey = registeredKey_keys[registeredKey_current++];
			var v = this._registry.h[registeredKey].defaultValue;
			var instance = this._instances.h[registeredKey];
			if(instance != null) {
				v = instance.get();
			}
			if(v != null) {
				this._cache.h[registeredKey] = v;
			}
		}
	}
	,dispose: function() {
		this._component = null;
		this._registry = null;
		var h = this._instances.h;
		var key_h = h;
		var key_keys = Object.keys(h);
		var key_length = key_keys.length;
		var key_current = 0;
		while(key_current < key_length) {
			var key = key_keys[key_current++];
			var inst = this._instances.h[key];
			inst._component = null;
		}
		this._instances = null;
		this._cache = null;
		this._actualUpdateOrder = null;
		this._updateOrder = null;
	}
	,detatch: function() {
		var h = this._instances.h;
		var b_h = h;
		var b_keys = Object.keys(h);
		var b_length = b_keys.length;
		var b_current = 0;
		while(b_current < b_length) {
			var b = b_h[b_keys[b_current++]];
			b.detatch();
		}
		this._instances = new haxe_ds_StringMap();
	}
	,restore: function() {
		if(this._cache == null) {
			return;
		}
		var _g = 0;
		var _g1 = this.get_actualUpdateOrder();
		while(_g < _g1.length) {
			var key = _g1[_g];
			++_g;
			var v = this._cache.h[key];
			if(v != null) {
				this.set(key,v);
			}
		}
		this._cache = null;
	}
	,lock: function() {
	}
	,unlock: function() {
	}
	,setDynamic: function(id,value) {
		this.lock();
		var b = this.find(id);
		var changed = null;
		if(((b) instanceof haxe_ui_behaviours_ValueBehaviour)) {
			var v = haxe_ui_util_Variant.toDynamic((js_Boot.__cast(b , haxe_ui_behaviours_ValueBehaviour))._value);
			changed = v != value;
		}
		b.setDynamic(value);
		var info = this._registry.h[id];
		info.isSet = true;
		this.unlock();
		this.performAutoDispatch(b,changed);
	}
	,set: function(id,value) {
		this.lock();
		var b = this.find(id);
		var changed = null;
		if(((b) instanceof haxe_ui_behaviours_ValueBehaviour)) {
			var v = (js_Boot.__cast(b , haxe_ui_behaviours_ValueBehaviour))._value;
			changed = haxe_ui_util_Variant.neq(v,value);
		}
		b.set(value);
		var info = this._registry.h[id];
		info.isSet = true;
		this.unlock();
		this.performAutoDispatch(b,changed);
	}
	,softSet: function(id,value) {
		var b = this.find(id);
		if(((b) instanceof haxe_ui_behaviours_ValueBehaviour)) {
			(js_Boot.__cast(b , haxe_ui_behaviours_ValueBehaviour))._value = value;
		}
	}
	,ready: function() {
		if(this._autoDispatch == null) {
			return;
		}
		var b = this._autoDispatch.keys();
		while(b.hasNext()) {
			var b1 = b.next();
			var changed = this._autoDispatch.h[b1.__id__];
			this.performAutoDispatch(b1,changed);
		}
		this._autoDispatch = null;
	}
	,_autoDispatch: null
	,performAutoDispatch: function(b,changed) {
		if(this._component.get_isReady() == false) {
			if(this._autoDispatch == null) {
				this._autoDispatch = new haxe_ds_ObjectMap();
			}
			this._autoDispatch.set(b,changed);
			return;
		}
		var autoDispatch = b.getConfigValue("autoDispatch",null);
		if(autoDispatch != null) {
			var arr = autoDispatch.split(".");
			var eventName = arr.pop().toLowerCase();
			var cls = arr.join(".");
			var event = Type.createInstance($hxClasses[cls],[eventName]);
			if(eventName != "change") {
				b._component.dispatch(event);
			} else if(changed == true || changed == null) {
				b._component.dispatch(event);
			}
		}
	}
	,get: function(id) {
		this.lock();
		var b = this.find(id);
		var v = null;
		if(b != null) {
			var info = this._registry.h[id];
			if(info.isSet == false && info.defaultValue != null && js_Boot.getClass(b) == haxe_ui_behaviours_DefaultBehaviour) {
				v = info.defaultValue;
			} else {
				v = b.get();
			}
		}
		this.unlock();
		return v;
	}
	,getDynamic: function(id) {
		this.lock();
		var b = this.find(id);
		var v = null;
		if(b != null) {
			v = b.getDynamic();
		}
		this.unlock();
		return v;
	}
	,call: function(id,param) {
		return this.find(id).call(param);
	}
	,applyDefaults: function() {
		var order = this._updateOrder.slice();
		var h = this._registry.h;
		var key_h = h;
		var key_keys = Object.keys(h);
		var key_length = key_keys.length;
		var key_current = 0;
		while(key_current < key_length) {
			var key = key_keys[key_current++];
			if(order.indexOf(key) == -1) {
				order.push(key);
			}
		}
		var _g = 0;
		while(_g < order.length) {
			var key = order[_g];
			++_g;
			var r = this._registry.h[key];
			if(r.defaultValue != null) {
				this.set(key,r.defaultValue);
			}
		}
	}
	,__class__: haxe_ui_behaviours_Behaviours
	,__properties__: {get_actualUpdateOrder:"get_actualUpdateOrder",set_updateOrder:"set_updateOrder",get_updateOrder:"get_updateOrder"}
};
var haxe_ui_behaviours_ValueBehaviour = function(component) {
	haxe_ui_behaviours_Behaviour.call(this,component);
};
$hxClasses["haxe.ui.behaviours.ValueBehaviour"] = haxe_ui_behaviours_ValueBehaviour;
haxe_ui_behaviours_ValueBehaviour.__name__ = "haxe.ui.behaviours.ValueBehaviour";
haxe_ui_behaviours_ValueBehaviour.__super__ = haxe_ui_behaviours_Behaviour;
haxe_ui_behaviours_ValueBehaviour.prototype = $extend(haxe_ui_behaviours_Behaviour.prototype,{
	_value: null
	,get: function() {
		return this._value;
	}
	,set: function(value) {
		if(haxe_ui_util_Variant.eq(value,this._value)) {
			return;
		}
		this._value = value;
	}
	,__class__: haxe_ui_behaviours_ValueBehaviour
});
var haxe_ui_behaviours_IValidatingBehaviour = function() { };
$hxClasses["haxe.ui.behaviours.IValidatingBehaviour"] = haxe_ui_behaviours_IValidatingBehaviour;
haxe_ui_behaviours_IValidatingBehaviour.__name__ = "haxe.ui.behaviours.IValidatingBehaviour";
haxe_ui_behaviours_IValidatingBehaviour.__isInterface__ = true;
haxe_ui_behaviours_IValidatingBehaviour.prototype = {
	validate: null
	,__class__: haxe_ui_behaviours_IValidatingBehaviour
};
var haxe_ui_behaviours_DataBehaviour = function(component) {
	haxe_ui_behaviours_ValueBehaviour.call(this,component);
};
$hxClasses["haxe.ui.behaviours.DataBehaviour"] = haxe_ui_behaviours_DataBehaviour;
haxe_ui_behaviours_DataBehaviour.__name__ = "haxe.ui.behaviours.DataBehaviour";
haxe_ui_behaviours_DataBehaviour.__interfaces__ = [haxe_ui_behaviours_IValidatingBehaviour];
haxe_ui_behaviours_DataBehaviour.__super__ = haxe_ui_behaviours_ValueBehaviour;
haxe_ui_behaviours_DataBehaviour.prototype = $extend(haxe_ui_behaviours_ValueBehaviour.prototype,{
	_dataInvalid: null
	,set: function(value) {
		if(haxe_ui_util_Variant.eq(value,this.get())) {
			return;
		}
		this._value = value;
		this.invalidateData();
	}
	,validate: function() {
		if(this._dataInvalid) {
			this._dataInvalid = false;
			this.validateData();
		}
	}
	,invalidateData: function() {
		this._dataInvalid = true;
		this._component.invalidateComponent("data",false);
	}
	,validateData: function() {
	}
	,__class__: haxe_ui_behaviours_DataBehaviour
});
var haxe_ui_behaviours_DefaultBehaviour = function(component) {
	this._value = null;
	haxe_ui_behaviours_Behaviour.call(this,component);
};
$hxClasses["haxe.ui.behaviours.DefaultBehaviour"] = haxe_ui_behaviours_DefaultBehaviour;
haxe_ui_behaviours_DefaultBehaviour.__name__ = "haxe.ui.behaviours.DefaultBehaviour";
haxe_ui_behaviours_DefaultBehaviour.__super__ = haxe_ui_behaviours_Behaviour;
haxe_ui_behaviours_DefaultBehaviour.prototype = $extend(haxe_ui_behaviours_Behaviour.prototype,{
	_value: null
	,get: function() {
		return this._value;
	}
	,set: function(value) {
		if(haxe_ui_util_Variant.eq(value,this._value)) {
			return;
		}
		this._value = value;
		haxe_ui_behaviours_Behaviour.prototype.set.call(this,value);
	}
	,__class__: haxe_ui_behaviours_DefaultBehaviour
});
var haxe_ui_behaviours_InvalidatingBehaviour = function(component) {
	haxe_ui_behaviours_ValueBehaviour.call(this,component);
};
$hxClasses["haxe.ui.behaviours.InvalidatingBehaviour"] = haxe_ui_behaviours_InvalidatingBehaviour;
haxe_ui_behaviours_InvalidatingBehaviour.__name__ = "haxe.ui.behaviours.InvalidatingBehaviour";
haxe_ui_behaviours_InvalidatingBehaviour.__super__ = haxe_ui_behaviours_ValueBehaviour;
haxe_ui_behaviours_InvalidatingBehaviour.prototype = $extend(haxe_ui_behaviours_ValueBehaviour.prototype,{
	get: function() {
		return this._value;
	}
	,set: function(value) {
		if(haxe_ui_util_Variant.eq(value,this._value)) {
			return;
		}
		haxe_ui_behaviours_ValueBehaviour.prototype.set.call(this,value);
		var _this = this._component;
		if(!(_this._layout == null || _this._layoutLocked == true)) {
			_this.invalidateComponent("layout",false);
		}
	}
	,__class__: haxe_ui_behaviours_InvalidatingBehaviour
});
var haxe_ui_behaviours_LayoutBehaviour = function(component) {
	haxe_ui_behaviours_ValueBehaviour.call(this,component);
};
$hxClasses["haxe.ui.behaviours.LayoutBehaviour"] = haxe_ui_behaviours_LayoutBehaviour;
haxe_ui_behaviours_LayoutBehaviour.__name__ = "haxe.ui.behaviours.LayoutBehaviour";
haxe_ui_behaviours_LayoutBehaviour.__super__ = haxe_ui_behaviours_ValueBehaviour;
haxe_ui_behaviours_LayoutBehaviour.prototype = $extend(haxe_ui_behaviours_ValueBehaviour.prototype,{
	set: function(value) {
		if(haxe_ui_util_Variant.eq(value,this.get())) {
			return;
		}
		this._value = value;
		var _this = this._component;
		if(!(_this._layout == null || _this._layoutLocked == true)) {
			_this.invalidateComponent("layout",false);
		}
	}
	,__class__: haxe_ui_behaviours_LayoutBehaviour
});
var haxe_ui_focus_IFocusable = function() { };
$hxClasses["haxe.ui.focus.IFocusable"] = haxe_ui_focus_IFocusable;
haxe_ui_focus_IFocusable.__name__ = "haxe.ui.focus.IFocusable";
haxe_ui_focus_IFocusable.__isInterface__ = true;
haxe_ui_focus_IFocusable.prototype = {
	get_focus: null
	,set_focus: null
	,get_allowFocus: null
	,set_allowFocus: null
	,__class__: haxe_ui_focus_IFocusable
	,__properties__: {set_allowFocus:"set_allowFocus",get_allowFocus:"get_allowFocus",set_focus:"set_focus",get_focus:"get_focus"}
};
var haxe_ui_core_InteractiveComponent = function() {
	this._allowFocus = true;
	this._focus = false;
	haxe_ui_core_Component.call(this);
};
$hxClasses["haxe.ui.core.InteractiveComponent"] = haxe_ui_core_InteractiveComponent;
haxe_ui_core_InteractiveComponent.__name__ = "haxe.ui.core.InteractiveComponent";
haxe_ui_core_InteractiveComponent.__interfaces__ = [haxe_ui_focus_IFocusable];
haxe_ui_core_InteractiveComponent.__super__ = haxe_ui_core_Component;
haxe_ui_core_InteractiveComponent.prototype = $extend(haxe_ui_core_Component.prototype,{
	actionStart: function(type) {
		if(this._internalEvents != null) {
			return this._internalEvents.actionStart(type);
		}
		return false;
	}
	,actionEnd: function(type) {
		if(this._internalEvents != null) {
			return this._internalEvents.actionEnd(type);
		}
		return false;
	}
	,_focus: null
	,get_focus: function() {
		return this._focus;
	}
	,set_focus: function(value) {
		if(this._focus == value || this.get_allowFocus() == false) {
			return value;
		}
		this._focus = value;
		var eventType = null;
		if(this._focus == true) {
			this.addClass(":active");
			eventType = "focusin";
			haxe_ui_focus_FocusManager.get_instance().set_focus(js_Boot.__cast(this , haxe_ui_focus_IFocusable));
			var scrollview = this.findScroller();
			if(scrollview != null) {
				scrollview.ensureVisible(this);
			}
		} else {
			this.removeClass(":active");
			eventType = "focusout";
			haxe_ui_focus_FocusManager.get_instance().set_focus(null);
		}
		this.invalidateComponent("data",false);
		this.dispatch(new haxe_ui_events_FocusEvent(eventType));
		return value;
	}
	,_allowFocus: null
	,get_allowFocus: function() {
		return this._allowFocus;
	}
	,set_allowFocus: function(value) {
		if(this._allowFocus == value) {
			return value;
		}
		this._allowFocus = value;
		var _g = 0;
		var _g1 = this._children == null ? [] : this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(js_Boot.__implements(child,haxe_ui_focus_IFocusable)) {
				(js_Boot.__cast(child , haxe_ui_focus_IFocusable)).set_allowFocus(value);
			}
		}
		return value;
	}
	,findScroller: function() {
		var view = null;
		var ref = this;
		while(ref != null) {
			if(js_Boot.__implements(ref,haxe_ui_core_IScrollView)) {
				view = js_Boot.__cast(ref , haxe_ui_core_IScrollView);
				break;
			}
			ref = ref.parentComponent;
		}
		return view;
	}
	,registerBehaviours: function() {
		haxe_ui_core_Component.prototype.registerBehaviours.call(this);
		this.behaviours.register("allowInteraction",haxe_ui_behaviours_DefaultBehaviour,haxe_ui_util_Variant.fromBool(true));
	}
	,get_allowInteraction: function() {
		return haxe_ui_util_Variant.toBool(this.behaviours.get("allowInteraction"));
	}
	,set_allowInteraction: function(value) {
		this.behaviours.set("allowInteraction",haxe_ui_util_Variant.fromBool(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"allowInteraction"));
		return value;
	}
	,cloneComponent: function() {
		var c = haxe_ui_core_Component.prototype.cloneComponent.call(this);
		c.set_allowInteraction(this.get_allowInteraction());
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_core_InteractiveComponent();
	}
	,__class__: haxe_ui_core_InteractiveComponent
	,__properties__: $extend(haxe_ui_core_Component.prototype.__properties__,{set_allowInteraction:"set_allowInteraction",get_allowInteraction:"get_allowInteraction",set_allowFocus:"set_allowFocus",get_allowFocus:"get_allowFocus",set_focus:"set_focus",get_focus:"get_focus"})
});
var haxe_ui_components_Button = function() {
	haxe_ui_core_InteractiveComponent.call(this);
};
$hxClasses["haxe.ui.components.Button"] = haxe_ui_components_Button;
haxe_ui_components_Button.__name__ = "haxe.ui.components.Button";
haxe_ui_components_Button.__super__ = haxe_ui_core_InteractiveComponent;
haxe_ui_components_Button.prototype = $extend(haxe_ui_core_InteractiveComponent.prototype,{
	registerBehaviours: function() {
		haxe_ui_core_InteractiveComponent.prototype.registerBehaviours.call(this);
		this.behaviours.register("repeater",haxe_ui_behaviours_DefaultBehaviour,haxe_ui_util_Variant.fromBool(false));
		this.behaviours.register("repeatInterval",haxe_ui_behaviours_DefaultBehaviour,haxe_ui_util_Variant.fromInt(50));
		this.behaviours.register("easeInRepeater",haxe_ui_behaviours_DefaultBehaviour,haxe_ui_util_Variant.fromBool(false));
		this.behaviours.register("remainPressed",haxe_ui_behaviours_DefaultBehaviour,haxe_ui_util_Variant.fromBool(false));
		this.behaviours.register("toggle",haxe_ui_components__$Button_ToggleBehaviour);
		this.behaviours.register("selected",haxe_ui_components__$Button_SelectedBehaviour);
		this.behaviours.register("text",haxe_ui_components__$Button_TextBehaviour);
		this.behaviours.register("icon",haxe_ui_components__$Button_IconBehaviour);
	}
	,get_repeater: function() {
		return haxe_ui_util_Variant.toBool(this.behaviours.get("repeater"));
	}
	,set_repeater: function(value) {
		this.behaviours.set("repeater",haxe_ui_util_Variant.fromBool(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"repeater"));
		return value;
	}
	,get_repeatInterval: function() {
		return haxe_ui_util_Variant.toInt(this.behaviours.get("repeatInterval"));
	}
	,set_repeatInterval: function(value) {
		this.behaviours.set("repeatInterval",haxe_ui_util_Variant.fromInt(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"repeatInterval"));
		return value;
	}
	,get_easeInRepeater: function() {
		return haxe_ui_util_Variant.toBool(this.behaviours.get("easeInRepeater"));
	}
	,set_easeInRepeater: function(value) {
		this.behaviours.set("easeInRepeater",haxe_ui_util_Variant.fromBool(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"easeInRepeater"));
		return value;
	}
	,get_remainPressed: function() {
		return haxe_ui_util_Variant.toBool(this.behaviours.get("remainPressed"));
	}
	,set_remainPressed: function(value) {
		this.behaviours.set("remainPressed",haxe_ui_util_Variant.fromBool(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"remainPressed"));
		return value;
	}
	,get_toggle: function() {
		return haxe_ui_util_Variant.toBool(this.behaviours.get("toggle"));
	}
	,set_toggle: function(value) {
		this.behaviours.set("toggle",haxe_ui_util_Variant.fromBool(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"toggle"));
		return value;
	}
	,get_selected: function() {
		return haxe_ui_util_Variant.toBool(this.behaviours.get("selected"));
	}
	,set_selected: function(value) {
		this.behaviours.set("selected",haxe_ui_util_Variant.fromBool(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"selected"));
		return value;
	}
	,get_icon: function() {
		return this.behaviours.get("icon");
	}
	,set_icon: function(value) {
		this.behaviours.set("icon",value);
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"icon"));
		return value;
	}
	,get_value: function() {
		return this.get_text();
	}
	,set_value: function(value) {
		this.set_text(value);
		return value;
	}
	,get_iconPosition: function() {
		if(this.get_customStyle().iconPosition != null) {
			return this.get_customStyle().iconPosition;
		}
		if(this.get_style() == null || this.get_style().iconPosition == null) {
			return null;
		}
		return this.get_style().iconPosition;
	}
	,set_iconPosition: function(value) {
		if(this.get_customStyle().iconPosition == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().iconPosition = null;
		} else {
			this.get_customStyle().iconPosition = value;
		}
		this.invalidateComponent("style",false);
		if(!(this._layout == null || this._layoutLocked == true)) {
			this.invalidateComponent("layout",false);
		}
		return value;
	}
	,get_fontSize: function() {
		if(this.get_customStyle().fontSize != null) {
			return this.get_customStyle().fontSize;
		}
		if(this.get_style() == null || this.get_style().fontSize == null) {
			return null;
		}
		return this.get_style().fontSize;
	}
	,set_fontSize: function(value) {
		if(this.get_customStyle().fontSize == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().fontSize = null;
		} else {
			this.get_customStyle().fontSize = value;
		}
		this.invalidateComponent("style",false);
		if(!(this._layout == null || this._layoutLocked == true)) {
			this.invalidateComponent("layout",false);
		}
		return value;
	}
	,get_textAlign: function() {
		if(this.get_customStyle().textAlign != null) {
			return this.get_customStyle().textAlign;
		}
		if(this.get_style() == null || this.get_style().textAlign == null) {
			return null;
		}
		return this.get_style().textAlign;
	}
	,set_textAlign: function(value) {
		if(this.get_customStyle().textAlign == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().textAlign = null;
		} else {
			this.get_customStyle().textAlign = value;
		}
		this.invalidateComponent("style",false);
		if(!(this._layout == null || this._layoutLocked == true)) {
			this.invalidateComponent("layout",false);
		}
		return value;
	}
	,cloneComponent: function() {
		var c = haxe_ui_core_InteractiveComponent.prototype.cloneComponent.call(this);
		c.set_repeater(this.get_repeater());
		c.set_repeatInterval(this.get_repeatInterval());
		c.set_easeInRepeater(this.get_easeInRepeater());
		c.set_remainPressed(this.get_remainPressed());
		c.set_toggle(this.get_toggle());
		c.set_selected(this.get_selected());
		if(this.get_icon() != null) {
			c.set_icon(this.get_icon());
		}
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_components_Button();
	}
	,registerComposite: function() {
		haxe_ui_core_InteractiveComponent.prototype.registerComposite.call(this);
		this._internalEventsClass = haxe_ui_components_ButtonEvents;
		this._compositeBuilderClass = haxe_ui_components_ButtonBuilder;
		this._defaultLayoutClass = haxe_ui_components_ButtonLayout;
	}
	,__class__: haxe_ui_components_Button
	,__properties__: $extend(haxe_ui_core_InteractiveComponent.prototype.__properties__,{set_textAlign:"set_textAlign",get_textAlign:"get_textAlign",set_fontSize:"set_fontSize",get_fontSize:"get_fontSize",set_iconPosition:"set_iconPosition",get_iconPosition:"get_iconPosition",set_icon:"set_icon",get_icon:"get_icon",set_selected:"set_selected",get_selected:"get_selected",set_toggle:"set_toggle",get_toggle:"get_toggle",set_remainPressed:"set_remainPressed",get_remainPressed:"get_remainPressed",set_easeInRepeater:"set_easeInRepeater",get_easeInRepeater:"get_easeInRepeater",set_repeatInterval:"set_repeatInterval",get_repeatInterval:"get_repeatInterval",set_repeater:"set_repeater",get_repeater:"get_repeater"})
});
var haxe_ui_layouts_ILayout = function() { };
$hxClasses["haxe.ui.layouts.ILayout"] = haxe_ui_layouts_ILayout;
haxe_ui_layouts_ILayout.__name__ = "haxe.ui.layouts.ILayout";
haxe_ui_layouts_ILayout.__isInterface__ = true;
var haxe_ui_layouts_Layout = function() {
};
$hxClasses["haxe.ui.layouts.Layout"] = haxe_ui_layouts_Layout;
haxe_ui_layouts_Layout.__name__ = "haxe.ui.layouts.Layout";
haxe_ui_layouts_Layout.__interfaces__ = [haxe_ui_layouts_ILayout];
haxe_ui_layouts_Layout.prototype = {
	_component: null
	,get_component: function() {
		return this._component;
	}
	,set_component: function(value) {
		this._component = value;
		if(this._component != null) {
			var _this = this._component;
			if(!(_this._layout == null || _this._layoutLocked == true)) {
				_this.invalidateComponent("layout",false);
			}
		}
		return value;
	}
	,findComponent: function(criteria,type,recursive,searchType) {
		if(searchType == null) {
			searchType = "id";
		}
		if(this._component == null) {
			return null;
		}
		return this._component.findComponent(criteria,type,recursive,searchType);
	}
	,findComponents: function(styleName,type,maxDepth) {
		if(maxDepth == null) {
			maxDepth = 5;
		}
		if(this._component == null) {
			return null;
		}
		return this._component.findComponents(styleName,type,maxDepth);
	}
	,refresh: function() {
		if(this._component != null && this._component.get_isReady() == true) {
			this.resizeChildren();
			this._component.handlePreReposition();
			this.repositionChildren();
			this._component.handlePostReposition();
		}
	}
	,autoSize: function() {
		if(this.get_component().get_isReady() == false) {
			return false;
		}
		var calculatedWidth = null;
		var calculatedHeight = null;
		if(this.get_component().get_autoWidth() == true || this.get_component().get_autoHeight() == true) {
			var size = this.calcAutoSize();
			if(this.get_component().get_autoWidth() == true) {
				calculatedWidth = size.width;
			}
			if(this.get_component().get_autoHeight() == true) {
				calculatedHeight = size.height;
			}
			this.get_component().resizeComponent(calculatedWidth,calculatedHeight);
		}
		if(calculatedWidth == null) {
			return calculatedHeight != null;
		} else {
			return true;
		}
	}
	,marginTop: function(child) {
		if(child == null || child.get_style() == null || child.get_style().marginTop == null) {
			return 0;
		}
		return child.get_style().marginTop;
	}
	,marginLeft: function(child) {
		if(child == null || child.get_style() == null || child.get_style().marginLeft == null) {
			return 0;
		}
		return child.get_style().marginLeft;
	}
	,marginBottom: function(child) {
		if(child == null || child.get_style() == null || child.get_style().marginBottom == null) {
			return 0;
		}
		return child.get_style().marginBottom;
	}
	,marginRight: function(child) {
		if(child == null || child.get_style() == null || child.get_style().marginRight == null) {
			return 0;
		}
		return child.get_style().marginRight;
	}
	,hidden: function(c) {
		if(c == null) {
			c = this.get_component();
		}
		return c.get_hidden();
	}
	,horizontalAlign: function(child) {
		if(child == null || child.get_style() == null || child.get_style().horizontalAlign == null) {
			return "left";
		}
		return child.get_style().horizontalAlign;
	}
	,verticalAlign: function(child) {
		if(child == null || child.get_style() == null || child.get_style().verticalAlign == null) {
			return "top";
		}
		return child.get_style().verticalAlign;
	}
	,fixedMinWidth: function(child) {
		var fixedMinWidth = false;
		if(child != null && child.get_style() != null && child.get_style().minWidth != null) {
			fixedMinWidth = child.get_componentWidth() <= child.get_style().minWidth;
		}
		return fixedMinWidth;
	}
	,fixedMinHeight: function(child) {
		var fixedMinHeight = false;
		if(child != null && child.get_style() != null && child.get_style().minHeight != null) {
			fixedMinHeight = child.get_componentHeight() <= child.get_style().minHeight;
		}
		return fixedMinHeight;
	}
	,borderSize: null
	,get_borderSize: function() {
		if(this._component.get_style() == null) {
			return 0;
		}
		var n = this._component.get_style().get_fullBorderSize();
		var tmp = n > 0;
		return n;
	}
	,paddingLeft: null
	,get_paddingLeft: function() {
		if(this._component == null || this._component.get_style() == null || this._component.get_style().paddingLeft == null) {
			return 0;
		}
		return this._component.get_style().paddingLeft;
	}
	,paddingTop: null
	,get_paddingTop: function() {
		if(this._component == null || this._component.get_style() == null || this._component.get_style().paddingTop == null) {
			return 0;
		}
		return this._component.get_style().paddingTop;
	}
	,paddingBottom: null
	,get_paddingBottom: function() {
		if(this._component == null || this._component.get_style() == null || this._component.get_style().paddingBottom == null) {
			return 0;
		}
		return this._component.get_style().paddingBottom;
	}
	,paddingRight: null
	,get_paddingRight: function() {
		if(this._component == null || this._component.get_style() == null || this._component.get_style().paddingRight == null) {
			return 0;
		}
		return this._component.get_style().paddingRight;
	}
	,horizontalSpacing: null
	,get_horizontalSpacing: function() {
		if(this._component == null || this._component.get_style() == null || this._component.get_style().horizontalSpacing == null) {
			return 0;
		}
		return this._component.get_style().horizontalSpacing;
	}
	,verticalSpacing: null
	,get_verticalSpacing: function() {
		if(this._component == null || this._component.get_style() == null || this._component.get_style().verticalSpacing == null) {
			return 0;
		}
		return this._component.get_style().verticalSpacing;
	}
	,innerWidth: null
	,innerHeight: null
	,get_innerWidth: function() {
		if(this.get_component() == null) {
			return 0;
		}
		return this.get_component().get_componentWidth() - (this.get_paddingLeft() + this.get_paddingRight());
	}
	,get_innerHeight: function() {
		if(this.get_component() == null) {
			return 0;
		}
		var padding = 0;
		if(this.get_component().get_style() != null && this.get_component().get_style().paddingTop != null) {
			padding = this.get_component().get_style().paddingTop + padding;
		}
		if(this.get_component().get_style() != null && this.get_component().get_style().paddingBottom != null) {
			padding = this.get_component().get_style().paddingBottom + padding;
		}
		var icy = this.get_component().get_componentHeight() - padding;
		return icy;
	}
	,resizeChildren: function() {
	}
	,repositionChildren: function() {
	}
	,usableSize: null
	,get_usableSize: function() {
		var ucx = 0;
		if(this._component.get_componentWidth() != null) {
			ucx = this._component.get_componentWidth();
			ucx -= this.get_paddingLeft() + this.get_paddingRight();
		}
		var ucy = 0;
		if(this._component.get_componentHeight() != null) {
			ucy = this._component.get_componentHeight();
			ucy -= this.get_paddingTop() + this.get_paddingBottom();
		}
		return new haxe_ui_geom_Size(ucx,ucy);
	}
	,usableWidth: null
	,get_usableWidth: function() {
		return this.get_usableSize().width;
	}
	,usableHeight: null
	,get_usableHeight: function() {
		return this.get_usableSize().height;
	}
	,calcAutoWidth: function() {
		return this.calcAutoSize().width;
	}
	,calcAutoHeight: function() {
		return this.calcAutoSize().height;
	}
	,calcAutoSize: function(exclusions) {
		var x1 = 16777215;
		var x2 = 0;
		var y1 = 16777215;
		var y2 = 0;
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false || this.excluded(exclusions,child) == true) {
				continue;
			}
			if(child.get_percentWidth() == null) {
				if(child.get_left() < x1) {
					x1 = child.get_left();
				}
				if(child.get_componentWidth() != null && child.get_left() + child.get_componentWidth() > x2) {
					x2 = child.get_left() + child.get_componentWidth();
				}
			}
			if(child.get_percentHeight() == null) {
				if(child.get_top() < y1) {
					y1 = child.get_top();
				}
				if(child.get_componentHeight() != null && child.get_top() + child.get_componentHeight() > y2) {
					y2 = child.get_top() + child.get_componentHeight();
				}
			}
		}
		if(x1 == 16777215) {
			x1 = 0;
		}
		if(y1 == 16777215) {
			y1 = 0;
		}
		var w = x2 - x1 + (this.get_paddingLeft() + this.get_paddingRight());
		var h = y2 - y1 + (this.get_paddingTop() + this.get_paddingBottom());
		if(((this) instanceof haxe_ui_layouts_AbsoluteLayout)) {
			w += x1;
			h += y1;
		}
		return new haxe_ui_geom_Size(w,h);
	}
	,excluded: function(exclusions,child) {
		if(exclusions == null) {
			return false;
		}
		return exclusions.indexOf(child) != -1;
	}
	,__class__: haxe_ui_layouts_Layout
	,__properties__: {get_usableHeight:"get_usableHeight",get_usableWidth:"get_usableWidth",get_usableSize:"get_usableSize",get_innerHeight:"get_innerHeight",get_innerWidth:"get_innerWidth",get_verticalSpacing:"get_verticalSpacing",get_horizontalSpacing:"get_horizontalSpacing",get_paddingRight:"get_paddingRight",get_paddingBottom:"get_paddingBottom",get_paddingTop:"get_paddingTop",get_paddingLeft:"get_paddingLeft",get_borderSize:"get_borderSize",set_component:"set_component",get_component:"get_component"}
};
var haxe_ui_layouts_DefaultLayout = function() {
	this._calcFullHeights = false;
	this._calcFullWidths = false;
	haxe_ui_layouts_Layout.call(this);
};
$hxClasses["haxe.ui.layouts.DefaultLayout"] = haxe_ui_layouts_DefaultLayout;
haxe_ui_layouts_DefaultLayout.__name__ = "haxe.ui.layouts.DefaultLayout";
haxe_ui_layouts_DefaultLayout.__super__ = haxe_ui_layouts_Layout;
haxe_ui_layouts_DefaultLayout.prototype = $extend(haxe_ui_layouts_Layout.prototype,{
	_calcFullWidths: null
	,_calcFullHeights: null
	,resizeChildren: function() {
		var usableSize = this.get_usableSize();
		var percentWidth = 100;
		var percentHeight = 100;
		var fullWidthValue = 100;
		var fullHeightValue = 100;
		if(this._calcFullWidths == true || this._calcFullHeights == true) {
			var n1 = 0;
			var n2 = 0;
			var _g = 0;
			var _this = this.get_component();
			var _g1 = _this._children == null ? [] : _this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				if(child.get_includeInLayout() == false) {
					continue;
				}
				if(this._calcFullWidths == true && child.get_percentWidth() != null && child.get_percentWidth() == 100) {
					++n1;
				}
				if(this._calcFullHeights == true && child.get_percentHeight() != null && child.get_percentHeight() == 100) {
					++n2;
				}
			}
			if(n1 > 0) {
				fullWidthValue = 100 / n1;
			}
			if(n2 > 0) {
				fullHeightValue = 100 / n2;
			}
		}
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				continue;
			}
			var cx = null;
			var cy = null;
			if(child.get_percentWidth() != null) {
				var childPercentWidth = child.get_percentWidth();
				if(childPercentWidth == 100) {
					childPercentWidth = fullWidthValue;
				}
				cx = usableSize.width * childPercentWidth / percentWidth - this.marginLeft(child) - this.marginRight(child);
			}
			if(child.get_percentHeight() != null) {
				var childPercentHeight = child.get_percentHeight();
				if(childPercentHeight == 100) {
					childPercentHeight = fullHeightValue;
				}
				cy = usableSize.height * childPercentHeight / percentHeight - this.marginTop(child) - this.marginBottom(child);
			}
			if(this.fixedMinWidth(child) && child.get_percentWidth() != null) {
				percentWidth -= child.get_percentWidth();
			}
			if(this.fixedMinHeight(child) && child.get_percentHeight() != null) {
				percentHeight -= child.get_percentHeight();
			}
			child.resizeComponent(cx,cy);
		}
	}
	,repositionChildren: function() {
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				continue;
			}
			var xpos = 0;
			var ypos = 0;
			switch(this.horizontalAlign(child)) {
			case "center":
				xpos = (this.get_component().get_componentWidth() - child.get_componentWidth()) / 2 + this.marginLeft(child) - this.marginRight(child);
				break;
			case "right":
				xpos = this.get_component().get_componentWidth() - (child.get_componentWidth() + this.get_paddingRight() + this.marginRight(child));
				break;
			default:
				xpos = this.get_paddingLeft() + this.marginLeft(child);
			}
			switch(this.verticalAlign(child)) {
			case "bottom":
				ypos = this.get_component().get_componentHeight() - (child.get_componentHeight() + this.get_paddingBottom() + this.marginBottom(child));
				break;
			case "center":
				ypos = (this.get_component().get_componentHeight() - child.get_componentHeight()) / 2 + this.marginTop(child) - this.marginBottom(child);
				break;
			default:
				ypos = this.get_paddingTop() + this.marginTop(child);
			}
			child.moveComponent(xpos,ypos);
		}
	}
	,__class__: haxe_ui_layouts_DefaultLayout
});
var haxe_ui_components_ButtonLayout = function() {
	haxe_ui_layouts_DefaultLayout.call(this);
};
$hxClasses["haxe.ui.components.ButtonLayout"] = haxe_ui_components_ButtonLayout;
haxe_ui_components_ButtonLayout.__name__ = "haxe.ui.components.ButtonLayout";
haxe_ui_components_ButtonLayout.__super__ = haxe_ui_layouts_DefaultLayout;
haxe_ui_components_ButtonLayout.prototype = $extend(haxe_ui_layouts_DefaultLayout.prototype,{
	iconPosition: null
	,get_iconPosition: function() {
		if(this.get_component().get_style() == null || this.get_component().get_style().iconPosition == null) {
			return "left";
		}
		return this.get_component().get_style().iconPosition;
	}
	,resizeChildren: function() {
		haxe_ui_layouts_DefaultLayout.prototype.resizeChildren.call(this);
		var label = this.get_component().findComponent(null,haxe_ui_components_Label,false);
		var icon = this.get_component().findComponent("button-icon",null,false);
		if(this._component.get_autoWidth() == false) {
			var ucx = this.get_usableSize();
			if(label != null) {
				var cx = ucx.width;
				if(icon != null && (this.get_iconPosition() == "far-right" || this.get_iconPosition() == "far-left" || this.get_iconPosition() == "left" || this.get_iconPosition() == "right")) {
					cx -= icon.get_width() + this.get_verticalSpacing();
				}
				label.set_width(cx);
			}
		}
	}
	,repositionChildren: function() {
		haxe_ui_layouts_DefaultLayout.prototype.repositionChildren.call(this);
		var label = this.get_component().findComponent(null,haxe_ui_components_Label,false);
		if(label != null && label.get_hidden() == true) {
			label = null;
		}
		var icon = this.get_component().findComponent("button-icon",null,false);
		if(icon != null && icon.get_hidden() == true) {
			icon = null;
		}
		switch(this.get_iconPosition()) {
		case "far-left":
			if(label != null && icon != null) {
				var x = this.get_paddingLeft();
				if(this.get_iconPosition() == "far-left") {
					icon.set_left(x + this.marginLeft(icon) - this.marginRight(icon));
					x += this.get_horizontalSpacing() + icon.get_componentWidth();
					label.set_left(x + this.marginLeft(label) - this.marginRight(label));
				}
				label.set_top((this.get_component().get_componentHeight() / 2 - label.get_componentHeight() / 2 | 0) + this.marginTop(label) - this.marginBottom(label));
				icon.set_top((this.get_component().get_componentHeight() / 2 - icon.get_componentHeight() / 2 | 0) + this.marginTop(icon) - this.marginBottom(icon));
			} else if(label != null) {
				label.set_left(this.get_paddingLeft());
				label.set_top((this.get_component().get_componentHeight() / 2 - label.get_componentHeight() / 2 | 0) + this.marginTop(label) - this.marginBottom(label));
			} else if(icon != null) {
				icon.set_left(this.get_component().get_componentWidth() / 2 - icon.get_componentWidth() / 2 | 0);
				icon.set_top((this.get_component().get_componentHeight() / 2 - icon.get_componentHeight() / 2 | 0) + this.marginTop(icon) - this.marginBottom(icon));
			}
			break;
		case "far-right":
			if(label != null && icon != null) {
				var cx = label.get_componentWidth() + icon.get_componentWidth() + this.get_horizontalSpacing();
				var x = this.get_component().get_componentWidth() / 2 - cx / 2 | 0;
				if(this.get_iconPosition() == "far-right") {
					if(cx + this.get_paddingLeft() + this.get_paddingRight() < this.get_component().get_componentWidth()) {
						label.set_left(this.get_paddingLeft());
						x += this.get_horizontalSpacing() + label.get_componentWidth();
						icon.set_left(this.get_component().get_componentWidth() - icon.get_componentWidth() - this.get_paddingRight() + this.marginLeft(icon) - this.marginRight(icon));
					} else {
						label.set_left(this.get_paddingLeft());
						x += this.get_horizontalSpacing() + label.get_componentWidth();
						icon.set_left(x + this.marginLeft(icon) - this.marginRight(icon));
					}
				}
				label.set_top((this.get_component().get_componentHeight() / 2 - label.get_componentHeight() / 2 | 0) + this.marginTop(label) - this.marginBottom(label));
				icon.set_top((this.get_component().get_componentHeight() / 2 - icon.get_componentHeight() / 2 | 0) + this.marginTop(icon) - this.marginBottom(icon));
			} else if(label != null) {
				label.set_left(this.get_paddingLeft());
				label.set_top((this.get_component().get_componentHeight() / 2 - label.get_componentHeight() / 2 | 0) + this.marginTop(label) - this.marginBottom(label));
			} else if(icon != null) {
				icon.set_left(this.get_component().get_componentWidth() / 2 - icon.get_componentWidth() / 2 | 0);
				icon.set_top((this.get_component().get_componentHeight() / 2 - icon.get_componentHeight() / 2 | 0) + this.marginTop(icon) - this.marginBottom(icon));
			}
			break;
		case "left":case "right":
			if(label != null && icon != null) {
				var cx = label.get_componentWidth() + icon.get_componentWidth() + this.get_horizontalSpacing();
				var x = this.get_component().get_componentWidth() / 2 - cx / 2 | 0;
				if((js_Boot.__cast(this.get_component() , haxe_ui_components_Button)).get_textAlign() == "left") {
					x = this.get_paddingLeft();
				}
				if(this.get_iconPosition() == "right") {
					label.set_left(x + this.marginLeft(label) - this.marginRight(label));
					x += this.get_horizontalSpacing() + label.get_componentWidth();
					icon.set_left(x + this.marginLeft(icon) - this.marginRight(icon));
				} else {
					icon.set_left(x + this.marginLeft(icon) - this.marginRight(icon));
					x += this.get_horizontalSpacing() + icon.get_componentWidth();
					label.set_left(x + this.marginLeft(label) - this.marginRight(label));
				}
				label.set_top((this.get_component().get_componentHeight() / 2 - label.get_componentHeight() / 2 | 0) + this.marginTop(label) - this.marginBottom(label));
				icon.set_top((this.get_component().get_componentHeight() / 2 - icon.get_componentHeight() / 2 | 0) + this.marginTop(icon) - this.marginBottom(icon));
			} else if(label != null) {
				label.set_left(this.getTextAlignPos(label,this.get_component().get_componentWidth()));
				label.set_top((this.get_component().get_componentHeight() / 2 - label.get_componentHeight() / 2 | 0) + this.marginTop(label) - this.marginBottom(label));
			} else if(icon != null) {
				icon.set_left(this.get_component().get_componentWidth() / 2 - icon.get_componentWidth() / 2 | 0);
				icon.set_top((this.get_component().get_componentHeight() / 2 - icon.get_componentHeight() / 2 | 0) + this.marginTop(icon) - this.marginBottom(icon));
			}
			break;
		case "bottom":case "top":
			if(label != null && icon != null) {
				var cy = label.get_componentHeight() + icon.get_componentHeight() + this.get_verticalSpacing();
				var y = this.get_component().get_componentHeight() / 2 - cy / 2 | 0;
				if(this.get_iconPosition() == "bottom") {
					label.set_top(y + this.marginTop(label) - this.marginBottom(label));
					y += this.get_verticalSpacing() + label.get_componentHeight();
					icon.set_top(y + this.marginTop(icon) - this.marginBottom(icon));
				} else {
					icon.set_top(y + this.marginTop(icon) - this.marginBottom(icon));
					y += this.get_verticalSpacing() + icon.get_componentHeight();
					label.set_top(y + this.marginTop(label) - this.marginBottom(label));
				}
				label.set_left(this.getTextAlignPos(label,this.get_component().get_componentWidth()));
				icon.set_left((this.get_component().get_componentWidth() / 2 - icon.get_componentWidth() / 2 | 0) + this.marginLeft(icon) - this.marginRight(icon));
			} else if(label != null) {
				label.set_left((this.get_component().get_componentWidth() / 2 - label.get_componentWidth() / 2 | 0) + this.marginLeft(label) - this.marginRight(label));
				label.set_top((this.get_component().get_componentHeight() / 2 - label.get_componentHeight() / 2 | 0) + this.marginTop(label) - this.marginBottom(label));
			} else if(icon != null) {
				icon.set_left((this.get_component().get_componentWidth() / 2 - icon.get_componentWidth() / 2 | 0) + this.marginLeft(icon) - this.marginRight(icon));
				icon.set_top((this.get_component().get_componentHeight() / 2 - icon.get_componentHeight() / 2 | 0) + this.marginTop(icon) - this.marginBottom(icon));
			}
			break;
		}
	}
	,getTextAlignPos: function(label,usableWidth) {
		switch((js_Boot.__cast(this.get_component() , haxe_ui_components_Button)).get_textAlign()) {
		case "left":
			return this.marginLeft(label) + this.get_paddingLeft();
		case "right":
			return usableWidth - label.get_componentWidth() - this.marginRight(label) - this.get_paddingRight();
		default:
			return (usableWidth / 2 - label.get_componentWidth() / 2 | 0) + this.marginLeft(label) - this.marginRight(label);
		}
	}
	,__class__: haxe_ui_components_ButtonLayout
	,__properties__: $extend(haxe_ui_layouts_DefaultLayout.prototype.__properties__,{get_iconPosition:"get_iconPosition"})
});
var haxe_ui_components__$Button_TextBehaviour = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.components._Button.TextBehaviour"] = haxe_ui_components__$Button_TextBehaviour;
haxe_ui_components__$Button_TextBehaviour.__name__ = "haxe.ui.components._Button.TextBehaviour";
haxe_ui_components__$Button_TextBehaviour.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_components__$Button_TextBehaviour.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	validateData: function() {
		var label = this._component.findComponent(null,haxe_ui_components_Label,false);
		if(label == null) {
			label = new haxe_ui_components_Label();
			label.set_id("button-label");
			label.set_scriptAccess(false);
			this._component.addComponent(label);
			var _this = this._component;
			var force = true;
			if(force == null) {
				force = false;
			}
			_this.invalidateComponent("style",false);
			if(force == true) {
				_this._style = null;
			}
		}
		label.set_text(haxe_ui_util_Variant.toString(this._value));
	}
	,__class__: haxe_ui_components__$Button_TextBehaviour
});
var haxe_ui_components__$Button_IconBehaviour = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.components._Button.IconBehaviour"] = haxe_ui_components__$Button_IconBehaviour;
haxe_ui_components__$Button_IconBehaviour.__name__ = "haxe.ui.components._Button.IconBehaviour";
haxe_ui_components__$Button_IconBehaviour.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_components__$Button_IconBehaviour.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	validateData: function() {
		var icon = this._component.findComponent("button-icon",null,false);
		if((this._value == null || haxe_ui_util_Variant.get_isNull(this._value)) && icon != null) {
			this._component.get_customStyle().icon = null;
			this._component.removeComponent(icon);
			return;
		}
		if(icon == null) {
			icon = new haxe_ui_components_Image();
			icon.addClass("icon");
			icon.set_id("button-icon");
			icon.set_scriptAccess(false);
			this._component.addComponentAt(icon,0);
			var _this = this._component;
			var force = true;
			if(force == null) {
				force = false;
			}
			_this.invalidateComponent("style",false);
			if(force == true) {
				_this._style = null;
			}
		}
		icon.set_resource(this._value);
	}
	,__class__: haxe_ui_components__$Button_IconBehaviour
});
var haxe_ui_components__$Button_ToggleBehaviour = function(component) {
	haxe_ui_behaviours_Behaviour.call(this,component);
};
$hxClasses["haxe.ui.components._Button.ToggleBehaviour"] = haxe_ui_components__$Button_ToggleBehaviour;
haxe_ui_components__$Button_ToggleBehaviour.__name__ = "haxe.ui.components._Button.ToggleBehaviour";
haxe_ui_components__$Button_ToggleBehaviour.__super__ = haxe_ui_behaviours_Behaviour;
haxe_ui_components__$Button_ToggleBehaviour.prototype = $extend(haxe_ui_behaviours_Behaviour.prototype,{
	_value: null
	,get: function() {
		return this._value;
	}
	,set: function(value) {
		if(haxe_ui_util_Variant.eq(this._value,value)) {
			return;
		}
		this._value = value;
		var button = js_Boot.__cast(this._component , haxe_ui_components_Button);
		if(haxe_ui_util_Variant.eq(value,haxe_ui_util_Variant.fromBool(false))) {
			button.set_selected(false);
		}
		button.registerInternalEvents(button._internalEventsClass,true);
	}
	,__class__: haxe_ui_components__$Button_ToggleBehaviour
});
var haxe_ui_components__$Button_SelectedBehaviour = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.components._Button.SelectedBehaviour"] = haxe_ui_components__$Button_SelectedBehaviour;
haxe_ui_components__$Button_SelectedBehaviour.__name__ = "haxe.ui.components._Button.SelectedBehaviour";
haxe_ui_components__$Button_SelectedBehaviour.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_components__$Button_SelectedBehaviour.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	validateData: function() {
		var button = js_Boot.__cast(this._component , haxe_ui_components_Button);
		if(button.get_toggle() == false) {
			return;
		}
		if(haxe_ui_util_Variant.eq(this._value,haxe_ui_util_Variant.fromBool(false))) {
			button.removeClass(":down",true,true);
		} else {
			button.addClass(":down",true,true);
		}
		var events = js_Boot.__cast(button._internalEvents , haxe_ui_components_ButtonEvents);
		if(events.lastMouseEvent != null && button.hitTest(events.lastMouseEvent.screenX,events.lastMouseEvent.screenY)) {
			button.addClass(":hover",true,true);
			events.lastMouseEvent = null;
		} else {
			button.removeClass(":hover",true,true);
		}
		events.dispatchChanged();
	}
	,__class__: haxe_ui_components__$Button_SelectedBehaviour
});
var haxe_ui_events_Events = function(target) {
	this._target = target;
};
$hxClasses["haxe.ui.events.Events"] = haxe_ui_events_Events;
haxe_ui_events_Events.__name__ = "haxe.ui.events.Events";
haxe_ui_events_Events.prototype = {
	_target: null
	,register: function() {
	}
	,unregister: function() {
	}
	,registerEvent: function(type,listener,priority) {
		if(priority == null) {
			priority = 0;
		}
		if(this.hasEvent(type,listener) == false) {
			this._target.registerEvent(type,listener,priority);
		}
	}
	,hasEvent: function(type,listener) {
		return this._target.hasEvent(type,listener);
	}
	,unregisterEvent: function(type,listener) {
		this._target.unregisterEvent(type,listener);
	}
	,dispatch: function(event) {
		this._target.dispatch(event);
	}
	,actionStart: function(type) {
		return false;
	}
	,actionEnd: function(type) {
		return false;
	}
	,__class__: haxe_ui_events_Events
};
var haxe_ui_components_ButtonEvents = function(button) {
	this._lastScreenEvent = null;
	this.recursiveStyling = true;
	this.lastMouseEvent = null;
	this._repeatInterval = 0;
	this._repeater = false;
	this._down = false;
	haxe_ui_events_Events.call(this,button);
	this._button = button;
};
$hxClasses["haxe.ui.components.ButtonEvents"] = haxe_ui_components_ButtonEvents;
haxe_ui_components_ButtonEvents.__name__ = "haxe.ui.components.ButtonEvents";
haxe_ui_components_ButtonEvents.__super__ = haxe_ui_events_Events;
haxe_ui_components_ButtonEvents.prototype = $extend(haxe_ui_events_Events.prototype,{
	_button: null
	,_down: null
	,_repeatTimer: null
	,_repeater: null
	,_repeatInterval: null
	,lastMouseEvent: null
	,recursiveStyling: null
	,register: function() {
		if(this.hasEvent("mouseover",$bind(this,this.onMouseOver)) == false) {
			this.registerEvent("mouseover",$bind(this,this.onMouseOver));
		}
		if(this.hasEvent("mouseout",$bind(this,this.onMouseOut)) == false) {
			this.registerEvent("mouseout",$bind(this,this.onMouseOut));
		}
		if(this.hasEvent("mousedown",$bind(this,this.onMouseDown)) == false) {
			this.registerEvent("mousedown",$bind(this,this.onMouseDown));
		}
		if(this.hasEvent("move",$bind(this,this.onMove)) == false) {
			this.registerEvent("move",$bind(this,this.onMove));
		}
		if(this._button.get_toggle() == true) {
			this.registerEvent("click",$bind(this,this.onMouseClick),100);
		}
	}
	,unregister: function() {
		this.unregisterEvent("mouseover",$bind(this,this.onMouseOver));
		this.unregisterEvent("mouseout",$bind(this,this.onMouseOut));
		this.unregisterEvent("mousedown",$bind(this,this.onMouseDown));
		this.unregisterEvent("click",$bind(this,this.onMouseClick));
		this.unregisterEvent("move",$bind(this,this.onMove));
	}
	,onMouseOver: function(event) {
		if(this._button.get_toggle() == true && this._button.classes.indexOf(":down") != -1) {
			return;
		}
		if(event.buttonDown == false || this._down == false) {
			this._button.addClass(":hover",true,this.recursiveStyling);
		} else {
			this._button.addClass(":down",true,this.recursiveStyling);
		}
	}
	,onMouseOut: function(event) {
		if(this._button.get_toggle() == true && this._button.get_selected() == true) {
			return;
		}
		if(this._button.get_remainPressed() == false) {
			this._button.removeClass(":down",true,this.recursiveStyling);
		}
		this._button.removeClass(":hover",true,this.recursiveStyling);
	}
	,onMouseDown: function(event) {
		var _gthis = this;
		if(this._button.get_allowFocus() == true && haxe_ui_focus_FocusManager.get_instance().get_focusInfo() != null && haxe_ui_focus_FocusManager.get_instance().get_focusInfo().currentFocus != null) {
			haxe_ui_focus_FocusManager.get_instance().get_focusInfo().currentFocus.set_focus(false);
		}
		if(this._button.get_repeater() == true && this._repeatInterval == 0) {
			this._repeatInterval = this._button.get_easeInRepeater() ? this._button.get_repeatInterval() * 2 : this._button.get_repeatInterval();
		}
		this._down = true;
		this._button.addClass(":down",true,this.recursiveStyling);
		this._button.get_screen().registerEvent("mouseup",$bind(this,this.onMouseUp));
		if(this._repeater == true && this._repeatInterval == this._button.get_repeatInterval()) {
			this._repeatTimer = new haxe_ui_util_Timer(this._repeatInterval,$bind(this,this.onRepeatTimer));
		} else if(this._button.get_repeater() == true) {
			if(this._repeatTimer != null) {
				this._repeatTimer.stop();
				this._repeatTimer = null;
			}
			haxe_ui_util_Timer.delay(function() {
				if(_gthis._repeater == true && _gthis._repeatTimer == null) {
					if(_gthis._button.get_easeInRepeater() == true && _gthis._repeatInterval > _gthis._button.get_repeatInterval()) {
						var tmp = _gthis._repeatInterval - (_gthis._repeatInterval - _gthis._button.get_repeatInterval()) / 2 | 0;
						_gthis._repeatInterval = tmp;
						_gthis.onRepeatTimer();
					}
					_gthis.onMouseDown(event);
				}
			},this._repeatInterval);
		}
		this._repeater = this._button.get_repeater();
	}
	,_lastScreenEvent: null
	,onMouseUp: function(event) {
		this._down = this._repeater = false;
		this._repeatInterval = this._button.get_easeInRepeater() ? this._button.get_repeatInterval() * 2 : this._button.get_repeatInterval();
		this._button.get_screen().unregisterEvent("mouseup",$bind(this,this.onMouseUp));
		if(this._button.get_toggle() == true) {
			return;
		}
		this._lastScreenEvent = event;
		this._button.removeClass(":down",true,this.recursiveStyling);
		var over = this._button.hitTest(event.screenX,event.screenY);
		if(event.touchEvent == false && over == true) {
			this._button.addClass(":hover",true,this.recursiveStyling);
		} else if(over == false) {
			this._button.removeClass(":hover",true,this.recursiveStyling);
		}
		if(this._repeatTimer != null) {
			this._repeatTimer.stop();
			this._repeatTimer = null;
		}
	}
	,onMove: function(event) {
		if(this._lastScreenEvent == null) {
			return;
		}
		var over = this._button.hitTest(this._lastScreenEvent.screenX,this._lastScreenEvent.screenY);
		if(this._lastScreenEvent.touchEvent == false && over == true) {
			this._button.addClass(":hover",true,this.recursiveStyling);
		} else if(over == false) {
			this._button.removeClass(":hover",true,this.recursiveStyling);
		}
		this._lastScreenEvent = null;
	}
	,onRepeatTimer: function() {
		if(this._button.classes.indexOf(":hover") != -1 && this._down == true) {
			var event = new haxe_ui_events_MouseEvent("click");
			this._button.dispatch(event);
		}
	}
	,onMouseClick: function(event) {
		this._button.set_selected(!this._button.get_selected());
		if(this._button.get_selected() == false) {
			this._button.removeClass(":down",true,this.recursiveStyling);
		}
		if(this._button.hitTest(event.screenX,event.screenY)) {
			this._button.addClass(":hover",true,this.recursiveStyling);
		}
	}
	,dispatchChanged: function() {
		this._button.dispatch(new haxe_ui_events_UIEvent("change"));
	}
	,press: function() {
		this._down = true;
		if(this._button.get_toggle() == true) {
			this._button.addClass(":down",true,this.recursiveStyling);
		} else {
			this._button.addClass(":down",true,this.recursiveStyling);
		}
	}
	,release: function() {
		if(this._down == true) {
			this._down = false;
			if(this._button.get_toggle() == true) {
				this._button.set_selected(!this._button.get_selected());
				this._button.dispatch(new haxe_ui_events_MouseEvent("click"));
			} else {
				this._button.removeClass(":down",true,this.recursiveStyling);
				this._button.dispatch(new haxe_ui_events_MouseEvent("click"));
			}
		}
	}
	,actionStart: function(type) {
		if(type == "actionPress") {
			this.press();
			return false;
		} else {
			return false;
		}
	}
	,actionEnd: function(type) {
		if(type == "actionPress") {
			this.release();
			return false;
		} else {
			return false;
		}
	}
	,__class__: haxe_ui_components_ButtonEvents
});
var haxe_ui_core_CompositeBuilder = function(component) {
	this._component = component;
};
$hxClasses["haxe.ui.core.CompositeBuilder"] = haxe_ui_core_CompositeBuilder;
haxe_ui_core_CompositeBuilder.__name__ = "haxe.ui.core.CompositeBuilder";
haxe_ui_core_CompositeBuilder.prototype = {
	_component: null
	,create: function() {
	}
	,destroy: function() {
	}
	,onInitialize: function() {
	}
	,onReady: function() {
	}
	,show: function() {
		return false;
	}
	,hide: function() {
		return false;
	}
	,get_numComponents: function() {
		return null;
	}
	,get_cssName: function() {
		return null;
	}
	,addComponent: function(child) {
		return null;
	}
	,addComponentAt: function(child,index) {
		return null;
	}
	,removeComponent: function(child,dispose,invalidate) {
		if(invalidate == null) {
			invalidate = true;
		}
		if(dispose == null) {
			dispose = true;
		}
		return null;
	}
	,removeComponentAt: function(index,dispose,invalidate) {
		if(invalidate == null) {
			invalidate = true;
		}
		if(dispose == null) {
			dispose = true;
		}
		return null;
	}
	,getComponentIndex: function(child) {
		return -2147483648;
	}
	,setComponentIndex: function(child,index) {
		return null;
	}
	,getComponentAt: function(index) {
		return null;
	}
	,validateComponentLayout: function() {
		return false;
	}
	,applyStyle: function(style) {
	}
	,onComponentAdded: function(child) {
	}
	,onComponentRemoved: function(child) {
	}
	,findComponent: function(criteria,type,recursive,searchType) {
		var _g = 0;
		var _g1 = this.get_numComponents();
		while(_g < _g1) {
			var i = _g++;
			var c = this.getComponentAt(i);
			var match = c.findComponent(criteria,type,recursive,searchType);
			if(match != null) {
				return match;
			}
		}
		return null;
	}
	,findComponents: function(styleName,type,maxDepth) {
		if(maxDepth == null) {
			maxDepth = 5;
		}
		return null;
	}
	,isComponentClipped: null
	,get_isComponentClipped: function() {
		return this._component.get_componentClipRect() != null;
	}
	,__class__: haxe_ui_core_CompositeBuilder
	,__properties__: {get_isComponentClipped:"get_isComponentClipped",get_cssName:"get_cssName",get_numComponents:"get_numComponents"}
};
var haxe_ui_components_ButtonBuilder = function(button) {
	haxe_ui_core_CompositeBuilder.call(this,button);
	this._button = button;
};
$hxClasses["haxe.ui.components.ButtonBuilder"] = haxe_ui_components_ButtonBuilder;
haxe_ui_components_ButtonBuilder.__name__ = "haxe.ui.components.ButtonBuilder";
haxe_ui_components_ButtonBuilder.__super__ = haxe_ui_core_CompositeBuilder;
haxe_ui_components_ButtonBuilder.prototype = $extend(haxe_ui_core_CompositeBuilder.prototype,{
	_button: null
	,applyStyle: function(style) {
		var label = this._button.findComponent(null,haxe_ui_components_Label);
		if(label != null && (label.get_customStyle().color != style.color || label.get_customStyle().fontName != style.fontName || label.get_customStyle().fontSize != style.fontSize || label.get_customStyle().cursor != style.cursor || label.get_customStyle().textAlign != style.textAlign)) {
			label.get_customStyle().color = style.color;
			label.get_customStyle().fontName = style.fontName;
			label.get_customStyle().fontSize = style.fontSize;
			label.get_customStyle().cursor = style.cursor;
			label.get_customStyle().textAlign = style.textAlign;
			label.invalidateComponent("style",false);
		}
		var icon = this._button.findComponent("button-icon",null,false);
		if(icon != null && icon.get_customStyle().cursor != style.cursor) {
			icon.get_customStyle().cursor = style.cursor;
			icon.invalidateComponent("style",false);
		}
		if(style.icon != null) {
			this._button.set_icon(haxe_ui_util_Variant.fromString(style.icon));
		}
	}
	,__class__: haxe_ui_components_ButtonBuilder
});
var haxe_ui_components_Column = function() {
	this._sortDirection = null;
	haxe_ui_components_Button.call(this);
};
$hxClasses["haxe.ui.components.Column"] = haxe_ui_components_Column;
haxe_ui_components_Column.__name__ = "haxe.ui.components.Column";
haxe_ui_components_Column.__super__ = haxe_ui_components_Button;
haxe_ui_components_Column.prototype = $extend(haxe_ui_components_Button.prototype,{
	sortField: null
	,get_sortable: function() {
		return this.classes.indexOf("sortable") != -1;
	}
	,set_sortable: function(value) {
		if(value == true) {
			this.addClass("sortable");
		} else {
			this.removeClass("sortable");
		}
		return value;
	}
	,_sortDirection: null
	,get_sortDirection: function() {
		return this._sortDirection;
	}
	,set_sortDirection: function(value) {
		if(value == this._sortDirection) {
			return value;
		}
		this._sortDirection = value;
		this.set_sortable(true);
		if(this._sortDirection == "asc") {
			this.swapClass("sort-asc","sort-desc");
		} else if(this._sortDirection == "desc") {
			this.swapClass("sort-desc","sort-asc");
		} else if(this.get_sortDirection() == null) {
			this.removeClasses(["sort-asc","sort-desc"]);
		}
		return value;
	}
	,registerComposite: function() {
		haxe_ui_components_Button.prototype.registerComposite.call(this);
		this._internalEventsClass = haxe_ui_components__$Column_Events;
	}
	,registerBehaviours: function() {
		haxe_ui_components_Button.prototype.registerBehaviours.call(this);
	}
	,cloneComponent: function() {
		var c = haxe_ui_components_Button.prototype.cloneComponent.call(this);
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_components_Column();
	}
	,__class__: haxe_ui_components_Column
	,__properties__: $extend(haxe_ui_components_Button.prototype.__properties__,{set_sortDirection:"set_sortDirection",get_sortDirection:"get_sortDirection",set_sortable:"set_sortable",get_sortable:"get_sortable"})
});
var haxe_ui_components__$Column_Events = function(column) {
	haxe_ui_components_ButtonEvents.call(this,column);
	this._column = column;
	this._column.registerEvent("click",$bind(this,this.onColumnClick));
};
$hxClasses["haxe.ui.components._Column.Events"] = haxe_ui_components__$Column_Events;
haxe_ui_components__$Column_Events.__name__ = "haxe.ui.components._Column.Events";
haxe_ui_components__$Column_Events.__super__ = haxe_ui_components_ButtonEvents;
haxe_ui_components__$Column_Events.prototype = $extend(haxe_ui_components_ButtonEvents.prototype,{
	_column: null
	,onMouseDown: function(event) {
		var components = this._column.findComponentsUnderPoint(event.screenX,event.screenY,haxe_ui_core_InteractiveComponent);
		HxOverrides.remove(components,this._column);
		if(components.length == 0) {
			haxe_ui_components_ButtonEvents.prototype.onMouseDown.call(this,event);
		}
	}
	,onColumnClick: function(event) {
		if(this._column.get_sortable() == false) {
			return;
		}
		if(this._column.get_sortDirection() == null) {
			this._column.set_sortDirection("asc");
		} else if(this._column.get_sortDirection() == "asc") {
			this._column.set_sortDirection("desc");
		} else if(this._column.get_sortDirection() == "desc") {
			this._column.set_sortDirection("asc");
		}
		var sortEvent = new haxe_ui_events_SortEvent("sortchanged");
		sortEvent.direction = this._column.get_sortDirection();
		this._column.dispatch(sortEvent);
	}
	,__class__: haxe_ui_components__$Column_Events
});
var haxe_ui_core_IDirectionalComponent = function() { };
$hxClasses["haxe.ui.core.IDirectionalComponent"] = haxe_ui_core_IDirectionalComponent;
haxe_ui_core_IDirectionalComponent.__name__ = "haxe.ui.core.IDirectionalComponent";
haxe_ui_core_IDirectionalComponent.__isInterface__ = true;
var haxe_ui_components_Scroll = function() {
	haxe_ui_core_InteractiveComponent.call(this);
};
$hxClasses["haxe.ui.components.Scroll"] = haxe_ui_components_Scroll;
haxe_ui_components_Scroll.__name__ = "haxe.ui.components.Scroll";
haxe_ui_components_Scroll.__interfaces__ = [haxe_ui_core_IDirectionalComponent];
haxe_ui_components_Scroll.__super__ = haxe_ui_core_InteractiveComponent;
haxe_ui_components_Scroll.prototype = $extend(haxe_ui_core_InteractiveComponent.prototype,{
	posFromCoord: function(coord) {
		return haxe_ui_util_Variant.toFloat(this.behaviours.call("posFromCoord",coord));
	}
	,applyPageFromCoord: function(coord) {
		return haxe_ui_util_Variant.toFloat(this.behaviours.call("applyPageFromCoord",coord));
	}
	,createChildren: function() {
		this.createButton("deinc",true).set_repeater(true);
		this.createButton("inc",true).set_repeater(true);
		this.createButton("thumb").set_remainPressed(true);
		this.registerInternalEvents(haxe_ui_components__$Scroll_Events);
	}
	,createButton: function(type,hidden) {
		if(hidden == null) {
			hidden = false;
		}
		var b = this.findComponent("scroll-" + type + "-button",haxe_ui_components_Button);
		if(b == null) {
			b = new haxe_ui_components_Button();
			b.set_hidden(hidden);
			b.set_scriptAccess(false);
			b.get_customStyle().native = false;
			b.set_id("scroll-" + type + "-button");
			b.addClass(type);
			b.set_allowFocus(false);
			this.addComponent(b);
		}
		return b;
	}
	,registerBehaviours: function() {
		haxe_ui_core_InteractiveComponent.prototype.registerBehaviours.call(this);
		this.behaviours.register("min",haxe_ui_components__$Scroll_ScrollValueBehaviour,haxe_ui_util_Variant.fromInt(0));
		this.behaviours.register("max",haxe_ui_components__$Scroll_ScrollValueBehaviour,haxe_ui_util_Variant.fromInt(100));
		this.behaviours.register("pageSize",haxe_ui_behaviours_LayoutBehaviour,haxe_ui_util_Variant.fromInt(0));
		this.behaviours.register("pos",haxe_ui_components__$Scroll_ScrollValueBehaviour,haxe_ui_util_Variant.fromInt(0));
		this.behaviours.register("increment",haxe_ui_behaviours_DefaultBehaviour,haxe_ui_util_Variant.fromInt(20));
	}
	,get_min: function() {
		return haxe_ui_util_Variant.toFloat(this.behaviours.get("min"));
	}
	,set_min: function(value) {
		this.behaviours.set("min",haxe_ui_util_Variant.fromFloat(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"min"));
		return value;
	}
	,get_max: function() {
		return haxe_ui_util_Variant.toFloat(this.behaviours.get("max"));
	}
	,set_max: function(value) {
		this.behaviours.set("max",haxe_ui_util_Variant.fromFloat(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"max"));
		return value;
	}
	,get_pageSize: function() {
		return haxe_ui_util_Variant.toFloat(this.behaviours.get("pageSize"));
	}
	,set_pageSize: function(value) {
		this.behaviours.set("pageSize",haxe_ui_util_Variant.fromFloat(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"pageSize"));
		return value;
	}
	,get_pos: function() {
		return haxe_ui_util_Variant.toFloat(this.behaviours.get("pos"));
	}
	,set_pos: function(value) {
		this.behaviours.set("pos",haxe_ui_util_Variant.fromFloat(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"pos"));
		return value;
	}
	,get_increment: function() {
		return haxe_ui_util_Variant.toFloat(this.behaviours.get("increment"));
	}
	,set_increment: function(value) {
		this.behaviours.set("increment",haxe_ui_util_Variant.fromFloat(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"increment"));
		return value;
	}
	,cloneComponent: function() {
		var c = haxe_ui_core_InteractiveComponent.prototype.cloneComponent.call(this);
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_components_Scroll();
	}
	,__class__: haxe_ui_components_Scroll
	,__properties__: $extend(haxe_ui_core_InteractiveComponent.prototype.__properties__,{set_increment:"set_increment",get_increment:"get_increment",set_pos:"set_pos",get_pos:"get_pos",set_pageSize:"set_pageSize",get_pageSize:"get_pageSize",set_max:"set_max",get_max:"get_max",set_min:"set_min",get_min:"get_min"})
});
var haxe_ui_components_HorizontalScroll = function() {
	haxe_ui_components_Scroll.call(this);
};
$hxClasses["haxe.ui.components.HorizontalScroll"] = haxe_ui_components_HorizontalScroll;
haxe_ui_components_HorizontalScroll.__name__ = "haxe.ui.components.HorizontalScroll";
haxe_ui_components_HorizontalScroll.__super__ = haxe_ui_components_Scroll;
haxe_ui_components_HorizontalScroll.prototype = $extend(haxe_ui_components_Scroll.prototype,{
	registerBehaviours: function() {
		haxe_ui_components_Scroll.prototype.registerBehaviours.call(this);
		this.behaviours.register("posFromCoord",haxe_ui_components__$HorizontalScroll_PosFromCoord);
		this.behaviours.register("applyPageFromCoord",haxe_ui_components__$HorizontalScroll_ApplyPageFromCoord);
	}
	,createChildren: function() {
		haxe_ui_components_Scroll.prototype.createChildren.call(this);
		if(this.get_componentWidth() <= 0) {
			this.set_componentWidth(150);
		}
	}
	,createDefaults: function() {
		haxe_ui_components_Scroll.prototype.createDefaults.call(this);
		this._defaultLayoutClass = haxe_ui_components__$HorizontalScroll_HorizontalScrollLayout;
	}
	,cloneComponent: function() {
		var c = haxe_ui_components_Scroll.prototype.cloneComponent.call(this);
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_components_HorizontalScroll();
	}
	,__class__: haxe_ui_components_HorizontalScroll
});
var haxe_ui_components__$HorizontalScroll_PosFromCoord = function(component) {
	haxe_ui_behaviours_Behaviour.call(this,component);
};
$hxClasses["haxe.ui.components._HorizontalScroll.PosFromCoord"] = haxe_ui_components__$HorizontalScroll_PosFromCoord;
haxe_ui_components__$HorizontalScroll_PosFromCoord.__name__ = "haxe.ui.components._HorizontalScroll.PosFromCoord";
haxe_ui_components__$HorizontalScroll_PosFromCoord.__super__ = haxe_ui_behaviours_Behaviour;
haxe_ui_components__$HorizontalScroll_PosFromCoord.prototype = $extend(haxe_ui_behaviours_Behaviour.prototype,{
	call: function(pos) {
		var p = js_Boot.__cast(pos , haxe_ui_geom_Point);
		var scroll = js_Boot.__cast(this._component , haxe_ui_components_Scroll);
		var deinc = this._component.findComponent("scroll-deinc-button");
		var thumb = this._component.findComponent("scroll-thumb-button");
		var xpos = p.x;
		var minX = 0;
		if(deinc != null && deinc.get_hidden() == false) {
			minX = deinc.get_width() + scroll.get_layout().get_horizontalSpacing();
		}
		var maxX = scroll.get_layout().get_usableWidth() - thumb.get_width();
		if(deinc != null && deinc.get_hidden() == false) {
			maxX += deinc.get_width() + scroll.get_layout().get_horizontalSpacing();
		}
		if(xpos < minX) {
			xpos = minX;
		} else if(xpos > maxX) {
			xpos = maxX;
		}
		var ucx = scroll.get_layout().get_usableWidth();
		ucx -= thumb.get_width();
		var m = scroll.get_max() - scroll.get_min() | 0;
		var v = xpos - minX;
		var value = scroll.get_min() + v / ucx * m;
		return haxe_ui_util_Variant.fromFloat(value);
	}
	,__class__: haxe_ui_components__$HorizontalScroll_PosFromCoord
});
var haxe_ui_components__$HorizontalScroll_ApplyPageFromCoord = function(component) {
	haxe_ui_behaviours_Behaviour.call(this,component);
};
$hxClasses["haxe.ui.components._HorizontalScroll.ApplyPageFromCoord"] = haxe_ui_components__$HorizontalScroll_ApplyPageFromCoord;
haxe_ui_components__$HorizontalScroll_ApplyPageFromCoord.__name__ = "haxe.ui.components._HorizontalScroll.ApplyPageFromCoord";
haxe_ui_components__$HorizontalScroll_ApplyPageFromCoord.__super__ = haxe_ui_behaviours_Behaviour;
haxe_ui_components__$HorizontalScroll_ApplyPageFromCoord.prototype = $extend(haxe_ui_behaviours_Behaviour.prototype,{
	call: function(pos) {
		var p = js_Boot.__cast(pos , haxe_ui_geom_Point);
		var scroll = js_Boot.__cast(this._component , haxe_ui_components_Scroll);
		var thumb = this._component.findComponent("scroll-thumb-button");
		if(p.x < thumb.get_screenLeft()) {
			scroll.set_pos(scroll.get_pos() - scroll.get_pageSize());
		} else if(p.x > thumb.get_screenLeft() + thumb.get_width()) {
			scroll.set_pos(scroll.get_pos() + scroll.get_pageSize());
		}
		return null;
	}
	,__class__: haxe_ui_components__$HorizontalScroll_ApplyPageFromCoord
});
var haxe_ui_components__$HorizontalScroll_HorizontalScrollLayout = function() {
	haxe_ui_layouts_DefaultLayout.call(this);
};
$hxClasses["haxe.ui.components._HorizontalScroll.HorizontalScrollLayout"] = haxe_ui_components__$HorizontalScroll_HorizontalScrollLayout;
haxe_ui_components__$HorizontalScroll_HorizontalScrollLayout.__name__ = "haxe.ui.components._HorizontalScroll.HorizontalScrollLayout";
haxe_ui_components__$HorizontalScroll_HorizontalScrollLayout.__super__ = haxe_ui_layouts_DefaultLayout;
haxe_ui_components__$HorizontalScroll_HorizontalScrollLayout.prototype = $extend(haxe_ui_layouts_DefaultLayout.prototype,{
	resizeChildren: function() {
		haxe_ui_layouts_DefaultLayout.prototype.resizeChildren.call(this);
		var scroll = js_Boot.__cast(this.get_component() , haxe_ui_components_Scroll);
		var thumb = this.get_component().findComponent("scroll-thumb-button");
		if(thumb != null) {
			var m = scroll.get_max() - scroll.get_min();
			var ucx = this.get_usableWidth();
			var thumbWidth = scroll.get_pageSize() / m * ucx;
			if(thumbWidth < this.get_innerHeight()) {
				thumbWidth = this.get_innerHeight();
			} else if(thumbWidth > ucx) {
				thumbWidth = ucx;
			}
			if(thumbWidth > 0 && isNaN(thumbWidth) == false) {
				thumb.set_width(thumbWidth);
			}
		}
	}
	,repositionChildren: function() {
		haxe_ui_layouts_DefaultLayout.prototype.repositionChildren.call(this);
		var deinc = this.get_component().findComponent("scroll-deinc-button");
		var inc = this.get_component().findComponent("scroll-inc-button");
		if(inc != null && this.hidden(inc) == false) {
			inc.set_left(this.get_component().get_width() - inc.get_width() - this.get_paddingRight());
		}
		var scroll = js_Boot.__cast(this.get_component() , haxe_ui_components_Scroll);
		var thumb = this.get_component().findComponent("scroll-thumb-button");
		if(thumb != null) {
			var m = scroll.get_max() - scroll.get_min();
			var u = this.get_usableWidth();
			u -= thumb.get_componentWidth();
			var x = (scroll.get_pos() - scroll.get_min()) / m * u;
			x += this.get_paddingLeft();
			if(deinc != null && this.hidden(deinc) == false) {
				x += deinc.get_width() + this.get_horizontalSpacing();
			}
			thumb.set_left(x);
			thumb.set_top(Math.round(thumb.get_top()));
		}
	}
	,get_usableWidth: function() {
		var ucx = this.get_innerWidth();
		var deinc = this.get_component().findComponent("scroll-deinc-button");
		var inc = this.get_component().findComponent("scroll-inc-button");
		if(deinc != null && this.hidden(deinc) == false) {
			ucx -= deinc.get_width() + this.get_horizontalSpacing();
		}
		if(inc != null && this.hidden(inc) == false) {
			ucx -= inc.get_width() + this.get_horizontalSpacing();
		}
		return ucx;
	}
	,__class__: haxe_ui_components__$HorizontalScroll_HorizontalScrollLayout
});
var haxe_ui_components_Image = function() {
	haxe_ui_core_Component.call(this);
};
$hxClasses["haxe.ui.components.Image"] = haxe_ui_components_Image;
haxe_ui_components_Image.__name__ = "haxe.ui.components.Image";
haxe_ui_components_Image.__super__ = haxe_ui_core_Component;
haxe_ui_components_Image.prototype = $extend(haxe_ui_core_Component.prototype,{
	registerComposite: function() {
		haxe_ui_core_Component.prototype.registerComposite.call(this);
		this._defaultLayoutClass = haxe_ui_components__$Image_ImageLayout;
		this._compositeBuilderClass = haxe_ui_components__$Image_Builder;
	}
	,registerBehaviours: function() {
		haxe_ui_core_Component.prototype.registerBehaviours.call(this);
		this.behaviours.register("resource",haxe_ui_components__$Image_ResourceBehaviour);
		this.behaviours.register("scaleMode",haxe_ui_behaviours_InvalidatingBehaviour,haxe_ui_util_Variant.fromString("fill"));
		this.behaviours.register("imageHorizontalAlign",haxe_ui_behaviours_InvalidatingBehaviour,haxe_ui_util_Variant.fromString("center"));
		this.behaviours.register("imageVerticalAlign",haxe_ui_behaviours_InvalidatingBehaviour,haxe_ui_util_Variant.fromString("center"));
		this.behaviours.register("originalWidth",haxe_ui_behaviours_DefaultBehaviour);
		this.behaviours.register("originalHeight",haxe_ui_behaviours_DefaultBehaviour);
	}
	,get_resource: function() {
		return this.behaviours.get("resource");
	}
	,set_resource: function(value) {
		this.behaviours.set("resource",value);
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"resource"));
		return value;
	}
	,get_scaleMode: function() {
		return haxe_ui_util_Variant.toString(this.behaviours.get("scaleMode"));
	}
	,set_scaleMode: function(value) {
		this.behaviours.set("scaleMode",haxe_ui_util_Variant.fromString(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"scaleMode"));
		return value;
	}
	,get_imageHorizontalAlign: function() {
		return haxe_ui_util_Variant.toString(this.behaviours.get("imageHorizontalAlign"));
	}
	,set_imageHorizontalAlign: function(value) {
		this.behaviours.set("imageHorizontalAlign",haxe_ui_util_Variant.fromString(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"imageHorizontalAlign"));
		return value;
	}
	,get_imageVerticalAlign: function() {
		return haxe_ui_util_Variant.toString(this.behaviours.get("imageVerticalAlign"));
	}
	,set_imageVerticalAlign: function(value) {
		this.behaviours.set("imageVerticalAlign",haxe_ui_util_Variant.fromString(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"imageVerticalAlign"));
		return value;
	}
	,get_originalWidth: function() {
		return haxe_ui_util_Variant.toFloat(this.behaviours.get("originalWidth"));
	}
	,set_originalWidth: function(value) {
		this.behaviours.set("originalWidth",haxe_ui_util_Variant.fromFloat(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"originalWidth"));
		return value;
	}
	,get_originalHeight: function() {
		return haxe_ui_util_Variant.toFloat(this.behaviours.get("originalHeight"));
	}
	,set_originalHeight: function(value) {
		this.behaviours.set("originalHeight",haxe_ui_util_Variant.fromFloat(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"originalHeight"));
		return value;
	}
	,get_value: function() {
		return haxe_ui_util_Variant.toDynamic(this.get_resource());
	}
	,set_value: function(value) {
		this.set_resource(haxe_ui_util_Variant.fromDynamic(value));
		return value;
	}
	,cloneComponent: function() {
		var c = haxe_ui_core_Component.prototype.cloneComponent.call(this);
		if(this.get_resource() != null) {
			c.set_resource(this.get_resource());
		}
		if(this.get_scaleMode() != null) {
			c.set_scaleMode(this.get_scaleMode());
		}
		if(this.get_imageHorizontalAlign() != null) {
			c.set_imageHorizontalAlign(this.get_imageHorizontalAlign());
		}
		if(this.get_imageVerticalAlign() != null) {
			c.set_imageVerticalAlign(this.get_imageVerticalAlign());
		}
		c.set_originalWidth(this.get_originalWidth());
		c.set_originalHeight(this.get_originalHeight());
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_components_Image();
	}
	,__class__: haxe_ui_components_Image
	,__properties__: $extend(haxe_ui_core_Component.prototype.__properties__,{set_originalHeight:"set_originalHeight",get_originalHeight:"get_originalHeight",set_originalWidth:"set_originalWidth",get_originalWidth:"get_originalWidth",set_imageVerticalAlign:"set_imageVerticalAlign",get_imageVerticalAlign:"get_imageVerticalAlign",set_imageHorizontalAlign:"set_imageHorizontalAlign",get_imageHorizontalAlign:"get_imageHorizontalAlign",set_scaleMode:"set_scaleMode",get_scaleMode:"get_scaleMode",set_resource:"set_resource",get_resource:"get_resource"})
});
var haxe_ui_components__$Image_ImageLayout = function() {
	haxe_ui_layouts_DefaultLayout.call(this);
};
$hxClasses["haxe.ui.components._Image.ImageLayout"] = haxe_ui_components__$Image_ImageLayout;
haxe_ui_components__$Image_ImageLayout.__name__ = "haxe.ui.components._Image.ImageLayout";
haxe_ui_components__$Image_ImageLayout.__super__ = haxe_ui_layouts_DefaultLayout;
haxe_ui_components__$Image_ImageLayout.prototype = $extend(haxe_ui_layouts_DefaultLayout.prototype,{
	get_imageScaleMode: function() {
		return (js_Boot.__cast(this._component , haxe_ui_components_Image)).get_scaleMode();
	}
	,get_imageHorizontalAlign: function() {
		return (js_Boot.__cast(this._component , haxe_ui_components_Image)).get_imageHorizontalAlign();
	}
	,get_imageVerticalAlign: function() {
		return (js_Boot.__cast(this._component , haxe_ui_components_Image)).get_imageVerticalAlign();
	}
	,resizeChildren: function() {
		if(this.get_component().hasImageDisplay()) {
			var image = js_Boot.__cast(this._component , haxe_ui_components_Image);
			var imageDisplay = image.getImageDisplay();
			var maxWidth = this.get_usableSize().width;
			var maxHeight = this.get_usableSize().height;
			if(this.get_component().get_autoWidth() == true) {
				maxWidth = -1;
			}
			if(this._component.get_autoHeight() == true) {
				maxHeight = -1;
			}
			var scaleW = maxWidth != -1 ? maxWidth / image.get_originalWidth() : 1;
			var scaleH = maxHeight != -1 ? maxHeight / image.get_originalHeight() : 1;
			if(this.get_imageScaleMode() != "fill") {
				var scale;
				switch(this.get_imageScaleMode()) {
				case "fitheight":
					scale = scaleH;
					break;
				case "fitinside":
					scale = scaleW < scaleH ? scaleW : scaleH;
					break;
				case "fitoutside":
					scale = scaleW > scaleH ? scaleW : scaleH;
					break;
				case "fitwidth":
					scale = scaleW;
					break;
				default:
					scale = 1;
				}
				imageDisplay.set_imageWidth(image.get_originalWidth() * scale);
				imageDisplay.set_imageHeight(image.get_originalHeight() * scale);
			} else {
				imageDisplay.set_imageWidth(image.get_originalWidth() * scaleW);
				imageDisplay.set_imageHeight(image.get_originalHeight() * scaleH);
			}
		}
	}
	,repositionChildren: function() {
		if(this.get_component().hasImageDisplay()) {
			var image = js_Boot.__cast(this._component , haxe_ui_components_Image);
			var imageDisplay = this._component.getImageDisplay();
			switch(image.get_imageHorizontalAlign()) {
			case "center":
				imageDisplay.set_left((this._component.get_componentWidth() - imageDisplay.get_imageWidth()) / 2);
				break;
			case "left":
				imageDisplay.set_left(this.get_paddingLeft());
				break;
			case "right":
				imageDisplay.set_left(this._component.get_componentWidth() - imageDisplay.get_imageWidth() - this.get_paddingRight());
				break;
			}
			switch(image.get_imageVerticalAlign()) {
			case "bottom":
				imageDisplay.set_top(this._component.get_componentHeight() - imageDisplay.get_imageHeight() - this.get_paddingBottom());
				break;
			case "center":
				imageDisplay.set_top((this._component.get_componentHeight() - imageDisplay.get_imageHeight()) / 2);
				break;
			case "top":
				imageDisplay.set_top(this.get_paddingTop());
				break;
			}
		}
	}
	,calcAutoSize: function(exclusions) {
		var size = haxe_ui_layouts_DefaultLayout.prototype.calcAutoSize.call(this,exclusions);
		if(this.get_component().hasImageDisplay()) {
			size.width += this.get_component().getImageDisplay().get_imageWidth();
			size.height += this.get_component().getImageDisplay().get_imageHeight();
		}
		return size;
	}
	,refresh: function() {
		haxe_ui_layouts_DefaultLayout.prototype.refresh.call(this);
		this.updateClipRect();
	}
	,updateClipRect: function() {
		if(this.get_component().hasImageDisplay()) {
			var usz = this.get_usableSize();
			var imageDisplay = this.get_component().getImageDisplay();
			var rc = imageDisplay.get_imageClipRect();
			if(imageDisplay.get_imageWidth() > usz.width || imageDisplay.get_imageHeight() > usz.height) {
				if(rc == null) {
					rc = new haxe_ui_geom_Rectangle();
				}
				rc.top = this.get_paddingLeft();
				rc.left = this.get_paddingTop();
				rc.width = usz.width;
				rc.height = usz.height;
			} else {
				rc = null;
			}
			imageDisplay.set_imageClipRect(rc);
		}
	}
	,__class__: haxe_ui_components__$Image_ImageLayout
	,__properties__: $extend(haxe_ui_layouts_DefaultLayout.prototype.__properties__,{get_imageVerticalAlign:"get_imageVerticalAlign",get_imageHorizontalAlign:"get_imageHorizontalAlign",get_imageScaleMode:"get_imageScaleMode"})
});
var haxe_ui_components__$Image_ResourceBehaviour = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.components._Image.ResourceBehaviour"] = haxe_ui_components__$Image_ResourceBehaviour;
haxe_ui_components__$Image_ResourceBehaviour.__name__ = "haxe.ui.components._Image.ResourceBehaviour";
haxe_ui_components__$Image_ResourceBehaviour.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_components__$Image_ResourceBehaviour.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	validateData: function() {
		var _gthis = this;
		if(this._value == null || haxe_ui_util_Variant.get_isNull(this._value)) {
			this._component.removeImageDisplay();
			this._component.invalidateComponent();
			return;
		}
		var imageLoader = new haxe_ui_util_ImageLoader(this._value);
		imageLoader.load(function(imageInfo) {
			if(imageInfo != null) {
				if(_gthis._value == null || haxe_ui_util_Variant.get_isNull(_gthis._value)) {
					_gthis._component.removeImageDisplay();
					_gthis._component.invalidateComponent();
					return;
				}
				var image = js_Boot.__cast(_gthis._component , haxe_ui_components_Image);
				if(image == null) {
					return;
				}
				var display = image.getImageDisplay();
				if(display != null) {
					display.set_imageInfo(imageInfo);
					image.set_originalWidth(imageInfo.width);
					image.set_originalHeight(imageInfo.height);
					if(image.autoSize() == true && image.parentComponent != null) {
						var _this = image.parentComponent;
						if(!(_this._layout == null || _this._layoutLocked == true)) {
							_this.invalidateComponent("layout",false);
						}
					}
					image.invalidateComponent();
					display.validateComponent();
				}
			}
		});
	}
	,__class__: haxe_ui_components__$Image_ResourceBehaviour
});
var haxe_ui_components__$Image_Builder = function(image) {
	var _gthis = this;
	haxe_ui_core_CompositeBuilder.call(this,image);
	this._image = image;
	this._image.registerEvent("shown",function(_) {
		if(_gthis._image.parentComponent != null) {
			var _this = _gthis._image.parentComponent;
			if(!(_this._layout == null || _this._layoutLocked == true)) {
				_this.invalidateComponent("layout",false);
			}
		}
	});
};
$hxClasses["haxe.ui.components._Image.Builder"] = haxe_ui_components__$Image_Builder;
haxe_ui_components__$Image_Builder.__name__ = "haxe.ui.components._Image.Builder";
haxe_ui_components__$Image_Builder.__super__ = haxe_ui_core_CompositeBuilder;
haxe_ui_components__$Image_Builder.prototype = $extend(haxe_ui_core_CompositeBuilder.prototype,{
	_image: null
	,applyStyle: function(style) {
		if(style.resource != null) {
			this._image.set_resource(haxe_ui_util_Variant.fromString(style.resource));
		}
	}
	,__class__: haxe_ui_components__$Image_Builder
});
var haxe_ui_components_Label = function() {
	haxe_ui_core_Component.call(this);
};
$hxClasses["haxe.ui.components.Label"] = haxe_ui_components_Label;
haxe_ui_components_Label.__name__ = "haxe.ui.components.Label";
haxe_ui_components_Label.__super__ = haxe_ui_core_Component;
haxe_ui_components_Label.prototype = $extend(haxe_ui_core_Component.prototype,{
	registerComposite: function() {
		haxe_ui_core_Component.prototype.registerComposite.call(this);
		this._compositeBuilderClass = haxe_ui_components__$Label_Builder;
		this._defaultLayoutClass = haxe_ui_components__$Label_LabelLayout;
	}
	,registerBehaviours: function() {
		haxe_ui_core_Component.prototype.registerBehaviours.call(this);
		this.behaviours.register("text",haxe_ui_components__$Label_TextBehaviour);
		this.behaviours.register("htmlText",haxe_ui_components__$Label_HtmlTextBehaviour);
	}
	,get_htmlText: function() {
		return haxe_ui_util_Variant.toString(this.behaviours.get("htmlText"));
	}
	,set_htmlText: function(value) {
		var _g = Type.typeof(value);
		if(_g._hx_index == 6) {
			if(_g.c == String) {
				if(value != null && value.indexOf("{{") != -1 && value.indexOf("}}") != -1) {
					haxe_ui_locale_LocaleManager.get_instance().registerComponent(this,"htmlText",null,value);
					return value;
				}
			}
		}
		this.behaviours.set("htmlText",haxe_ui_util_Variant.fromString(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"htmlText"));
		return value;
	}
	,get_value: function() {
		return this.get_text();
	}
	,set_value: function(value) {
		this.set_text(value);
		return value;
	}
	,get_textAlign: function() {
		if(this.get_customStyle().textAlign != null) {
			return this.get_customStyle().textAlign;
		}
		if(this.get_style() == null || this.get_style().textAlign == null) {
			return null;
		}
		return this.get_style().textAlign;
	}
	,set_textAlign: function(value) {
		if(this.get_customStyle().textAlign == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().textAlign = null;
		} else {
			this.get_customStyle().textAlign = value;
		}
		this.invalidateComponent("style",false);
		if(!(this._layout == null || this._layoutLocked == true)) {
			this.invalidateComponent("layout",false);
		}
		return value;
	}
	,get_wordWrap: function() {
		if(this.get_customStyle().wordWrap != null) {
			return this.get_customStyle().wordWrap;
		}
		if(this.get_style() == null || this.get_style().wordWrap == null) {
			return null;
		}
		return this.get_style().wordWrap;
	}
	,set_wordWrap: function(value) {
		if(this.get_customStyle().wordWrap == value) {
			return value;
		}
		if(this._style == null) {
			this._style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		if(value == null) {
			this.get_customStyle().wordWrap = null;
		} else {
			this.get_customStyle().wordWrap = value;
		}
		this.invalidateComponent("style",false);
		if(!(this._layout == null || this._layoutLocked == true)) {
			this.invalidateComponent("layout",false);
		}
		return value;
	}
	,cloneComponent: function() {
		var c = haxe_ui_core_Component.prototype.cloneComponent.call(this);
		if(this.get_htmlText() != null) {
			c.set_htmlText(this.get_htmlText());
		}
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_components_Label();
	}
	,__class__: haxe_ui_components_Label
	,__properties__: $extend(haxe_ui_core_Component.prototype.__properties__,{set_wordWrap:"set_wordWrap",get_wordWrap:"get_wordWrap",set_textAlign:"set_textAlign",get_textAlign:"get_textAlign",set_htmlText:"set_htmlText",get_htmlText:"get_htmlText"})
});
var haxe_ui_components__$Label_LabelLayout = function() {
	haxe_ui_layouts_DefaultLayout.call(this);
};
$hxClasses["haxe.ui.components._Label.LabelLayout"] = haxe_ui_components__$Label_LabelLayout;
haxe_ui_components__$Label_LabelLayout.__name__ = "haxe.ui.components._Label.LabelLayout";
haxe_ui_components__$Label_LabelLayout.__super__ = haxe_ui_layouts_DefaultLayout;
haxe_ui_components__$Label_LabelLayout.prototype = $extend(haxe_ui_layouts_DefaultLayout.prototype,{
	resizeChildren: function() {
		if(this.get_component().get_autoWidth() == false) {
			this.get_component().getTextDisplay().set_width(this.get_component().get_componentWidth() - this.get_paddingLeft() - this.get_paddingRight());
			var wordWrap = true;
			if(this._component.get_style() != null && this._component.get_style().wordWrap != null) {
				wordWrap = this._component.get_style().wordWrap;
			}
			this.get_component().getTextDisplay().set_wordWrap(wordWrap);
		} else {
			this.get_component().getTextDisplay().set_width(this.get_component().getTextDisplay().get_textWidth());
		}
		if(this.get_component().get_autoHeight() == true) {
			this.get_component().getTextDisplay().set_height(this.get_component().getTextDisplay().get_textHeight());
		} else {
			this.get_component().getTextDisplay().set_height(this.get_component().get_height());
		}
	}
	,repositionChildren: function() {
		if(this.get_component().hasTextDisplay() == true) {
			this.get_component().getTextDisplay().set_left(this.get_paddingLeft());
			this.get_component().getTextDisplay().set_top(this.get_paddingTop());
		}
	}
	,calcAutoSize: function(exclusions) {
		var size = haxe_ui_layouts_DefaultLayout.prototype.calcAutoSize.call(this,exclusions);
		if(this.get_component().hasTextDisplay() == true) {
			size.width += this.get_component().getTextDisplay().get_textWidth();
			size.height += this.get_component().getTextDisplay().get_textHeight();
		}
		return size;
	}
	,textAlign: function(child) {
		if(child == null || child.get_style() == null || child.get_style().textAlign == null) {
			return "left";
		}
		return child.get_style().textAlign;
	}
	,__class__: haxe_ui_components__$Label_LabelLayout
});
var haxe_ui_components__$Label_TextBehaviour = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.components._Label.TextBehaviour"] = haxe_ui_components__$Label_TextBehaviour;
haxe_ui_components__$Label_TextBehaviour.__name__ = "haxe.ui.components._Label.TextBehaviour";
haxe_ui_components__$Label_TextBehaviour.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_components__$Label_TextBehaviour.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	validateData: function() {
		if(this._component.getTextDisplay().get_textStyle() != this._component.get_style()) {
			var _this = this._component;
			var force = true;
			if(force == null) {
				force = false;
			}
			_this.invalidateComponent("style",false);
			if(force == true) {
				_this._style = null;
			}
		}
		this._component.getTextDisplay().set_text("" + (this._value == null ? "null" : haxe_ui_util_Variant.toString(this._value)));
		this._component.dispatch(new haxe_ui_events_UIEvent("change"));
	}
	,__class__: haxe_ui_components__$Label_TextBehaviour
});
var haxe_ui_components__$Label_HtmlTextBehaviour = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.components._Label.HtmlTextBehaviour"] = haxe_ui_components__$Label_HtmlTextBehaviour;
haxe_ui_components__$Label_HtmlTextBehaviour.__name__ = "haxe.ui.components._Label.HtmlTextBehaviour";
haxe_ui_components__$Label_HtmlTextBehaviour.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_components__$Label_HtmlTextBehaviour.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	validateData: function() {
		if(this._component.getTextDisplay().get_textStyle() != this._component.get_style()) {
			var _this = this._component;
			var force = true;
			if(force == null) {
				force = false;
			}
			_this.invalidateComponent("style",false);
			if(force == true) {
				_this._style = null;
			}
		}
		this._component.getTextDisplay().set_htmlText("" + (this._value == null ? "null" : haxe_ui_util_Variant.toString(this._value)));
		this._component.dispatch(new haxe_ui_events_UIEvent("change"));
	}
	,__class__: haxe_ui_components__$Label_HtmlTextBehaviour
});
var haxe_ui_components__$Label_Builder = function(label) {
	haxe_ui_core_CompositeBuilder.call(this,label);
	this._label = label;
};
$hxClasses["haxe.ui.components._Label.Builder"] = haxe_ui_components__$Label_Builder;
haxe_ui_components__$Label_Builder.__name__ = "haxe.ui.components._Label.Builder";
haxe_ui_components__$Label_Builder.isHtml = function(v) {
	if(v == null) {
		return false;
	} else {
		return v.indexOf("<font ") != -1;
	}
};
haxe_ui_components__$Label_Builder.__super__ = haxe_ui_core_CompositeBuilder;
haxe_ui_components__$Label_Builder.prototype = $extend(haxe_ui_core_CompositeBuilder.prototype,{
	_label: null
	,applyStyle: function(style) {
		if(this._label.hasTextDisplay() == true) {
			this._label.getTextDisplay().set_textStyle(style);
			var tmp;
			if((style.contentType == "auto" || style.contentType == "html") && this._label.getTextDisplay().get_supportsHtml()) {
				var v = Std.string(this._component.get_text());
				tmp = v == null ? false : v.indexOf("<font ") != -1;
			} else {
				tmp = false;
			}
			if(tmp) {
				this._label.set_htmlText(this._label.get_text());
			}
		}
	}
	,get_isComponentClipped: function() {
		var componentClipRect = this._component.get_componentClipRect();
		if(componentClipRect == null) {
			return false;
		}
		return this._label.getTextDisplay().measureTextWidth() > componentClipRect.width;
	}
	,__class__: haxe_ui_components__$Label_Builder
});
var haxe_ui_components__$Scroll_Events = function(scroll) {
	haxe_ui_events_Events.call(this,scroll);
	this._scroll = scroll;
	this._deincButton = this._scroll.findComponent("scroll-deinc-button");
	this._incButton = this._scroll.findComponent("scroll-inc-button");
	this._thumb = this._scroll.findComponent("scroll-thumb-button");
};
$hxClasses["haxe.ui.components._Scroll.Events"] = haxe_ui_components__$Scroll_Events;
haxe_ui_components__$Scroll_Events.__name__ = "haxe.ui.components._Scroll.Events";
haxe_ui_components__$Scroll_Events.__super__ = haxe_ui_events_Events;
haxe_ui_components__$Scroll_Events.prototype = $extend(haxe_ui_events_Events.prototype,{
	_scroll: null
	,_deincButton: null
	,_incButton: null
	,_thumb: null
	,register: function() {
		if(this.hasEvent("mousedown",$bind(this,this.onMouseDown)) == false) {
			this.registerEvent("mousedown",$bind(this,this.onMouseDown));
		}
		if(this._deincButton != null && this._deincButton.hasEvent("click",$bind(this,this.onDeinc)) == false) {
			this._deincButton.registerEvent("click",$bind(this,this.onDeinc));
		}
		if(this._incButton != null && this._incButton.hasEvent("click",$bind(this,this.onInc)) == false) {
			this._incButton.registerEvent("click",$bind(this,this.onInc));
		}
		if(this._thumb != null && this._thumb.hasEvent("mousedown",$bind(this,this.onThumbMouseDown)) == false) {
			this._thumb.registerEvent("mousedown",$bind(this,this.onThumbMouseDown));
		}
	}
	,unregister: function() {
		this.unregisterEvent("mousedown",$bind(this,this.onMouseDown));
		if(this._deincButton != null) {
			this._deincButton.unregisterEvent("click",$bind(this,this.onDeinc));
		}
		if(this._incButton != null) {
			this._incButton.unregisterEvent("click",$bind(this,this.onInc));
		}
		if(this._thumb != null) {
			this._thumb.unregisterEvent("mousedown",$bind(this,this.onThumbMouseDown));
		}
	}
	,onMouseDown: function(event) {
		var componentOffset = this._scroll.getComponentOffset();
		if(this._deincButton.hitTest(event.screenX - componentOffset.x,event.screenY - componentOffset.y) == false && this._incButton.hitTest(event.screenX - componentOffset.x,event.screenY - componentOffset.y) == false) {
			this._scroll.applyPageFromCoord(new haxe_ui_geom_Point(event.screenX - componentOffset.x,event.screenY - componentOffset.y));
		}
	}
	,onDeinc: function(event) {
		var fh = this._scroll;
		fh.set_pos(fh.get_pos() - this._scroll.get_increment());
	}
	,onInc: function(event) {
		var fh = this._scroll;
		fh.set_pos(fh.get_pos() + this._scroll.get_increment());
	}
	,_mouseDownOffset: null
	,onThumbMouseDown: function(event) {
		this._mouseDownOffset = new haxe_ui_geom_Point();
		var tmp = event.screenX - this._thumb.get_left();
		var tmp1 = this._scroll.get_layout().get_paddingLeft();
		this._mouseDownOffset.x = tmp + tmp1;
		var tmp = event.screenY - this._thumb.get_top();
		var tmp1 = this._scroll.get_layout().get_paddingTop();
		this._mouseDownOffset.y = tmp + tmp1;
		this._scroll.get_screen().registerEvent("mouseup",$bind(this,this.onScreenMouseUp));
		this._scroll.get_screen().registerEvent("mousemove",$bind(this,this.onScreenMouseMove));
	}
	,onScreenMouseUp: function(event) {
		this._mouseDownOffset = null;
		this._scroll.get_screen().unregisterEvent("mouseup",$bind(this,this.onScreenMouseUp));
		this._scroll.get_screen().unregisterEvent("mousemove",$bind(this,this.onScreenMouseMove));
	}
	,onScreenMouseMove: function(event) {
		if(this._mouseDownOffset == null) {
			return;
		}
		var coord = new haxe_ui_geom_Point(event.screenX - this._mouseDownOffset.x,event.screenY - this._mouseDownOffset.y);
		this._scroll.set_pos(this._scroll.posFromCoord(coord));
	}
	,__class__: haxe_ui_components__$Scroll_Events
});
var haxe_ui_components__$Scroll_ScrollValueBehaviour = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.components._Scroll.ScrollValueBehaviour"] = haxe_ui_components__$Scroll_ScrollValueBehaviour;
haxe_ui_components__$Scroll_ScrollValueBehaviour.__name__ = "haxe.ui.components._Scroll.ScrollValueBehaviour";
haxe_ui_components__$Scroll_ScrollValueBehaviour.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_components__$Scroll_ScrollValueBehaviour.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	set: function(value) {
		if(haxe_ui_util_Variant.eq(value,this.get())) {
			return;
		}
		haxe_ui_behaviours_DataBehaviour.prototype.set.call(this,value);
		var _this = this._component;
		if(!(_this._layout == null || _this._layoutLocked == true)) {
			_this.invalidateComponent("layout",false);
		}
	}
	,validateData: function() {
		var scroll = js_Boot.__cast(this._component , haxe_ui_components_Scroll);
		var pos = scroll.get_pos();
		var min = scroll.get_min();
		var max = scroll.get_max();
		if(pos < min) {
			scroll.set_pos(min);
		} else if(pos > max) {
			scroll.set_pos(max);
		}
		var changeEvent = new haxe_ui_events_UIEvent("change");
		scroll.dispatch(changeEvent);
	}
	,__class__: haxe_ui_components__$Scroll_ScrollValueBehaviour
});
var haxe_ui_containers_VBox = function() {
	haxe_ui_containers_Box.call(this);
	this.set_layout(new haxe_ui_layouts_VerticalLayout());
};
$hxClasses["haxe.ui.containers.VBox"] = haxe_ui_containers_VBox;
haxe_ui_containers_VBox.__name__ = "haxe.ui.containers.VBox";
haxe_ui_containers_VBox.__super__ = haxe_ui_containers_Box;
haxe_ui_containers_VBox.prototype = $extend(haxe_ui_containers_Box.prototype,{
	registerBehaviours: function() {
		haxe_ui_containers_Box.prototype.registerBehaviours.call(this);
	}
	,cloneComponent: function() {
		var c = haxe_ui_containers_Box.prototype.cloneComponent.call(this);
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_containers_VBox();
	}
	,__class__: haxe_ui_containers_VBox
});
var haxe_ui_components_SectionHeader = function() {
	haxe_ui_containers_VBox.call(this);
};
$hxClasses["haxe.ui.components.SectionHeader"] = haxe_ui_components_SectionHeader;
haxe_ui_components_SectionHeader.__name__ = "haxe.ui.components.SectionHeader";
haxe_ui_components_SectionHeader.__super__ = haxe_ui_containers_VBox;
haxe_ui_components_SectionHeader.prototype = $extend(haxe_ui_containers_VBox.prototype,{
	registerComposite: function() {
		haxe_ui_containers_VBox.prototype.registerComposite.call(this);
		this._compositeBuilderClass = haxe_ui_components__$SectionHeader_Builder;
	}
	,registerBehaviours: function() {
		haxe_ui_containers_VBox.prototype.registerBehaviours.call(this);
		this.behaviours.register("text",haxe_ui_components__$SectionHeader_TextBehaviour);
	}
	,cloneComponent: function() {
		var c = haxe_ui_containers_VBox.prototype.cloneComponent.call(this);
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_components_SectionHeader();
	}
	,__class__: haxe_ui_components_SectionHeader
});
var haxe_ui_components__$SectionHeader_TextBehaviour = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.components._SectionHeader.TextBehaviour"] = haxe_ui_components__$SectionHeader_TextBehaviour;
haxe_ui_components__$SectionHeader_TextBehaviour.__name__ = "haxe.ui.components._SectionHeader.TextBehaviour";
haxe_ui_components__$SectionHeader_TextBehaviour.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_components__$SectionHeader_TextBehaviour.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	validateData: function() {
		var label = this._component.findComponent(null,haxe_ui_components_Label,false);
		label.set_text(haxe_ui_util_Variant.toString(this._value));
	}
	,__class__: haxe_ui_components__$SectionHeader_TextBehaviour
});
var haxe_ui_components__$SectionHeader_Builder = function(component) {
	haxe_ui_core_CompositeBuilder.call(this,component);
};
$hxClasses["haxe.ui.components._SectionHeader.Builder"] = haxe_ui_components__$SectionHeader_Builder;
haxe_ui_components__$SectionHeader_Builder.__name__ = "haxe.ui.components._SectionHeader.Builder";
haxe_ui_components__$SectionHeader_Builder.__super__ = haxe_ui_core_CompositeBuilder;
haxe_ui_components__$SectionHeader_Builder.prototype = $extend(haxe_ui_core_CompositeBuilder.prototype,{
	create: function() {
		haxe_ui_core_CompositeBuilder.prototype.create.call(this);
		var label = new haxe_ui_components_Label();
		label.set_text("Section Header");
		label.set_scriptAccess(false);
		this._component.addComponent(label);
		var line = new haxe_ui_core_Component();
		line.addClasses(["section-line","line"]);
		line.set_scriptAccess(false);
		this._component.addComponent(line);
	}
	,__class__: haxe_ui_components__$SectionHeader_Builder
});
var haxe_ui_components_TabBar = function() {
	haxe_ui_core_Component.call(this);
};
$hxClasses["haxe.ui.components.TabBar"] = haxe_ui_components_TabBar;
haxe_ui_components_TabBar.__name__ = "haxe.ui.components.TabBar";
haxe_ui_components_TabBar.__super__ = haxe_ui_core_Component;
haxe_ui_components_TabBar.prototype = $extend(haxe_ui_core_Component.prototype,{
	removeTab: function(index) {
		return this.behaviours.call("removeTab",index);
	}
	,getTab: function(index) {
		return haxe_ui_util_Variant.toComponent(this.behaviours.call("getTab",index));
	}
	,registerComposite: function() {
		haxe_ui_core_Component.prototype.registerComposite.call(this);
		this._compositeBuilderClass = haxe_ui_components__$TabBar_Builder;
		this._internalEventsClass = haxe_ui_components__$TabBar_Events;
		this._defaultLayoutClass = haxe_ui_components_TabBarLayout;
	}
	,registerBehaviours: function() {
		haxe_ui_core_Component.prototype.registerBehaviours.call(this);
		this.behaviours.register("selectedIndex",haxe_ui_components__$TabBar_SelectedIndex,haxe_ui_util_Variant.fromInt(-1));
		this.behaviours.register("selectedTab",haxe_ui_components__$TabBar_SelectedTab);
		this.behaviours.register("tabPosition",haxe_ui_components__$TabBar_TabPosition,haxe_ui_util_Variant.fromString("top"));
		this.behaviours.register("tabCount",haxe_ui_components__$TabBar_TabCount);
		this.behaviours.register("closable",haxe_ui_components__$TabBar_Closable,haxe_ui_util_Variant.fromBool(false));
		this.behaviours.register("removeTab",haxe_ui_components__$TabBar_RemoveTab);
		this.behaviours.register("getTab",haxe_ui_components__$TabBar_GetTab);
	}
	,get_selectedIndex: function() {
		return haxe_ui_util_Variant.toInt(this.behaviours.get("selectedIndex"));
	}
	,set_selectedIndex: function(value) {
		this.behaviours.set("selectedIndex",haxe_ui_util_Variant.fromInt(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"selectedIndex"));
		return value;
	}
	,get_selectedTab: function() {
		return haxe_ui_util_Variant.toComponent(this.behaviours.get("selectedTab"));
	}
	,set_selectedTab: function(value) {
		this.behaviours.set("selectedTab",haxe_ui_util_Variant.fromComponent(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"selectedTab"));
		return value;
	}
	,get_tabPosition: function() {
		return haxe_ui_util_Variant.toString(this.behaviours.get("tabPosition"));
	}
	,set_tabPosition: function(value) {
		var _g = Type.typeof(value);
		if(_g._hx_index == 6) {
			if(_g.c == String) {
				if(value != null && value.indexOf("{{") != -1 && value.indexOf("}}") != -1) {
					haxe_ui_locale_LocaleManager.get_instance().registerComponent(this,"tabPosition",null,value);
					return value;
				}
			}
		}
		this.behaviours.set("tabPosition",haxe_ui_util_Variant.fromString(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"tabPosition"));
		return value;
	}
	,get_tabCount: function() {
		return haxe_ui_util_Variant.toInt(this.behaviours.get("tabCount"));
	}
	,set_tabCount: function(value) {
		this.behaviours.set("tabCount",haxe_ui_util_Variant.fromInt(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"tabCount"));
		return value;
	}
	,get_closable: function() {
		return haxe_ui_util_Variant.toBool(this.behaviours.get("closable"));
	}
	,set_closable: function(value) {
		this.behaviours.set("closable",haxe_ui_util_Variant.fromBool(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"closable"));
		return value;
	}
	,cloneComponent: function() {
		var c = haxe_ui_core_Component.prototype.cloneComponent.call(this);
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_components_TabBar();
	}
	,__class__: haxe_ui_components_TabBar
	,__properties__: $extend(haxe_ui_core_Component.prototype.__properties__,{set_closable:"set_closable",get_closable:"get_closable",set_tabCount:"set_tabCount",get_tabCount:"get_tabCount",set_tabPosition:"set_tabPosition",get_tabPosition:"get_tabPosition",set_selectedTab:"set_selectedTab",get_selectedTab:"get_selectedTab",set_selectedIndex:"set_selectedIndex",get_selectedIndex:"get_selectedIndex"})
});
var haxe_ui_components_TabBarLayout = function() {
	haxe_ui_layouts_DefaultLayout.call(this);
};
$hxClasses["haxe.ui.components.TabBarLayout"] = haxe_ui_components_TabBarLayout;
haxe_ui_components_TabBarLayout.__name__ = "haxe.ui.components.TabBarLayout";
haxe_ui_components_TabBarLayout.__super__ = haxe_ui_layouts_DefaultLayout;
haxe_ui_components_TabBarLayout.prototype = $extend(haxe_ui_layouts_DefaultLayout.prototype,{
	repositionChildren: function() {
		haxe_ui_layouts_DefaultLayout.prototype.repositionChildren.call(this);
		var filler = this._component.findComponent("tabbar-filler",null,false);
		if(filler != null) {
			var container = this._component.findComponent("tabbar-contents",null,false);
			filler.set_width(this._component.get_width() - container.get_width());
			filler.set_height(this._component.get_height());
			filler.set_left(container.get_width());
		}
		var left = this._component.findComponent("tabbar-scroll-left",null,false);
		var right = this._component.findComponent("tabbar-scroll-right",null,false);
		if(left != null && this.hidden(left) == false) {
			var x = this._component.get_width() - left.get_width();
			if(right != null) {
				x -= right.get_width();
			}
			left.set_left(x + 1);
			left.set_top(this._component.get_height() / 2 - left.get_height() / 2);
		}
		if(right != null && this.hidden(right) == false) {
			right.set_left(this._component.get_width() - right.get_width());
			right.set_top(this._component.get_height() / 2 - right.get_height() / 2);
		}
	}
	,__class__: haxe_ui_components_TabBarLayout
});
var haxe_ui_components__$TabBar_Closable = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.components._TabBar.Closable"] = haxe_ui_components__$TabBar_Closable;
haxe_ui_components__$TabBar_Closable.__name__ = "haxe.ui.components._TabBar.Closable";
haxe_ui_components__$TabBar_Closable.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_components__$TabBar_Closable.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	validateData: function() {
		var builder = js_Boot.__cast(this._component._compositeBuilder , haxe_ui_components__$TabBar_Builder);
		if(builder._container == null) {
			return;
		}
		var buttons = builder._container.findComponents(null,haxe_ui_components__$TabBar_TabBarButton,1);
		var _g = 0;
		while(_g < buttons.length) {
			var b = buttons[_g];
			++_g;
			b.set_closable(haxe_ui_util_Variant.toBool(this._value));
		}
	}
	,__class__: haxe_ui_components__$TabBar_Closable
});
var haxe_ui_components__$TabBar_SelectedIndex = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.components._TabBar.SelectedIndex"] = haxe_ui_components__$TabBar_SelectedIndex;
haxe_ui_components__$TabBar_SelectedIndex.__name__ = "haxe.ui.components._TabBar.SelectedIndex";
haxe_ui_components__$TabBar_SelectedIndex.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_components__$TabBar_SelectedIndex.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	validateData: function() {
		var builder = js_Boot.__cast(this._component._compositeBuilder , haxe_ui_components__$TabBar_Builder);
		if(builder._container == null) {
			return;
		}
		if(haxe_ui_util_Variant.lt(this._value,haxe_ui_util_Variant.fromInt(0))) {
			return;
		}
		var _this = builder._container;
		if(haxe_ui_util_Variant.gt(this._value,haxe_ui_util_Variant.fromInt((_this._children == null ? [] : _this._children).length - 1))) {
			var _this = builder._container;
			this._value = haxe_ui_util_Variant.fromInt((_this._children == null ? [] : _this._children).length - 1);
			return;
		}
		var tab = js_Boot.__cast(builder._container.getComponentAt(haxe_ui_util_Variant.toInt(this._value)) , haxe_ui_components_Button);
		if(tab != null) {
			var selectedTab = (js_Boot.__cast(this._component , haxe_ui_components_TabBar)).get_selectedTab();
			if(selectedTab != null) {
				selectedTab.removeClass("tabbar-button-selected");
				var label = selectedTab.findComponent(null,haxe_ui_components_Label);
				if(label != null) {
					label.invalidateComponent();
				}
				var icon = selectedTab.findComponent(null,haxe_ui_components_Image);
				if(icon != null) {
					icon.invalidateComponent();
				}
			}
			tab.addClass("tabbar-button-selected");
			var label = tab.findComponent(null,haxe_ui_components_Label);
			if(label != null) {
				label.invalidateComponent();
			}
			var icon = tab.findComponent(null,haxe_ui_components_Image);
			if(icon != null) {
				icon.invalidateComponent();
			}
			var rangeMin = Math.abs(builder._container.get_left());
			var rangeMax = rangeMin + this._component.get_width();
			var left = this._component.findComponent("tabbar-scroll-left",haxe_ui_components_Button);
			var right = this._component.findComponent("tabbar-scroll-right",haxe_ui_components_Button);
			if(left != null && left.get_hidden() == false) {
				rangeMax -= left.get_width();
				rangeMax -= this._component.get_layout().get_horizontalSpacing();
			}
			if(right != null && right.get_hidden() == false) {
				rangeMax -= right.get_width();
			}
			if(tab.get_left() < rangeMin || tab.get_left() + tab.get_width() > rangeMax) {
				var max = -(builder._container.get_width() - this._component.get_width());
				var x = -tab.get_left() + this._component.get_layout().get_paddingLeft();
				if(left != null && left.get_hidden() == false) {
					max -= left.get_width();
					max -= this._component.get_layout().get_horizontalSpacing();
				}
				if(right != null && right.get_hidden() == false) {
					max -= right.get_width();
				}
				if(x < max) {
					x = max;
				}
				builder._containerPosition = x;
				builder._container.set_left(x);
			}
			var _this = this._component;
			if(!(_this._layout == null || _this._layoutLocked == true)) {
				_this.invalidateComponent("layout",false);
			}
			this._component.dispatch(new haxe_ui_events_UIEvent("change"));
		}
	}
	,__class__: haxe_ui_components__$TabBar_SelectedIndex
});
var haxe_ui_components__$TabBar_SelectedTab = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.components._TabBar.SelectedTab"] = haxe_ui_components__$TabBar_SelectedTab;
haxe_ui_components__$TabBar_SelectedTab.__name__ = "haxe.ui.components._TabBar.SelectedTab";
haxe_ui_components__$TabBar_SelectedTab.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_components__$TabBar_SelectedTab.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	get: function() {
		var builder = js_Boot.__cast(this._component._compositeBuilder , haxe_ui_components__$TabBar_Builder);
		return haxe_ui_util_Variant.fromComponent(builder._container.findComponent("tabbar-button-selected",null,false,"css"));
	}
	,__class__: haxe_ui_components__$TabBar_SelectedTab
});
var haxe_ui_components__$TabBar_TabPosition = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.components._TabBar.TabPosition"] = haxe_ui_components__$TabBar_TabPosition;
haxe_ui_components__$TabBar_TabPosition.__name__ = "haxe.ui.components._TabBar.TabPosition";
haxe_ui_components__$TabBar_TabPosition.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_components__$TabBar_TabPosition.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	validateData: function() {
		var builder = js_Boot.__cast(this._component._compositeBuilder , haxe_ui_components__$TabBar_Builder);
		if(haxe_ui_util_Variant.eq(this._value,haxe_ui_util_Variant.fromString("bottom"))) {
			this._component.addClass(":bottom");
			var _g = 0;
			var _this = builder._container;
			var _g1 = _this._children == null ? [] : _this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				child.addClass(":bottom");
			}
		} else {
			this._component.removeClass(":bottom");
			var _g = 0;
			var _this = builder._container;
			var _g1 = _this._children == null ? [] : _this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				child.removeClass(":bottom");
			}
		}
	}
	,__class__: haxe_ui_components__$TabBar_TabPosition
});
var haxe_ui_components__$TabBar_TabCount = function(component) {
	haxe_ui_behaviours_Behaviour.call(this,component);
};
$hxClasses["haxe.ui.components._TabBar.TabCount"] = haxe_ui_components__$TabBar_TabCount;
haxe_ui_components__$TabBar_TabCount.__name__ = "haxe.ui.components._TabBar.TabCount";
haxe_ui_components__$TabBar_TabCount.__super__ = haxe_ui_behaviours_Behaviour;
haxe_ui_components__$TabBar_TabCount.prototype = $extend(haxe_ui_behaviours_Behaviour.prototype,{
	get: function() {
		var builder = js_Boot.__cast(this._component._compositeBuilder , haxe_ui_components__$TabBar_Builder);
		var _this = builder._container;
		return haxe_ui_util_Variant.fromInt((_this._children == null ? [] : _this._children).length);
	}
	,__class__: haxe_ui_components__$TabBar_TabCount
});
var haxe_ui_components__$TabBar_RemoveTab = function(component) {
	haxe_ui_behaviours_Behaviour.call(this,component);
};
$hxClasses["haxe.ui.components._TabBar.RemoveTab"] = haxe_ui_components__$TabBar_RemoveTab;
haxe_ui_components__$TabBar_RemoveTab.__name__ = "haxe.ui.components._TabBar.RemoveTab";
haxe_ui_components__$TabBar_RemoveTab.__super__ = haxe_ui_behaviours_Behaviour;
haxe_ui_components__$TabBar_RemoveTab.prototype = $extend(haxe_ui_behaviours_Behaviour.prototype,{
	call: function(param) {
		var builder = js_Boot.__cast(this._component._compositeBuilder , haxe_ui_components__$TabBar_Builder);
		var index = param;
		var _this = builder._container;
		if(index < (_this._children == null ? [] : _this._children).length) {
			var selectedIndex = (js_Boot.__cast(this._component , haxe_ui_components_TabBar)).get_selectedIndex();
			var newSelectedIndex = selectedIndex;
			if(index < selectedIndex) {
				--newSelectedIndex;
			} else if(index == selectedIndex) {
				(js_Boot.__cast(this._component , haxe_ui_components_TabBar)).set_selectedIndex(-1);
				newSelectedIndex = selectedIndex;
				var _this = builder._container;
				if(newSelectedIndex > (_this._children == null ? [] : _this._children).length - 2) {
					var _this = builder._container;
					newSelectedIndex = (_this._children == null ? [] : _this._children).length - 2;
				}
			}
			builder._container.removeComponentAt(index);
			this._component.dispatch(new haxe_ui_events_UIEvent("close",null,index));
			(js_Boot.__cast(this._component , haxe_ui_components_TabBar)).set_selectedIndex(newSelectedIndex);
		}
		return null;
	}
	,__class__: haxe_ui_components__$TabBar_RemoveTab
});
var haxe_ui_components__$TabBar_GetTab = function(component) {
	haxe_ui_behaviours_Behaviour.call(this,component);
};
$hxClasses["haxe.ui.components._TabBar.GetTab"] = haxe_ui_components__$TabBar_GetTab;
haxe_ui_components__$TabBar_GetTab.__name__ = "haxe.ui.components._TabBar.GetTab";
haxe_ui_components__$TabBar_GetTab.__super__ = haxe_ui_behaviours_Behaviour;
haxe_ui_components__$TabBar_GetTab.prototype = $extend(haxe_ui_behaviours_Behaviour.prototype,{
	call: function(param) {
		var builder = js_Boot.__cast(this._component._compositeBuilder , haxe_ui_components__$TabBar_Builder);
		var index = param;
		var tab = null;
		var _this = builder._container;
		if(index < (_this._children == null ? [] : _this._children).length) {
			var _this = builder._container;
			tab = (_this._children == null ? [] : _this._children)[index];
		}
		return haxe_ui_util_Variant.fromComponent(tab);
	}
	,__class__: haxe_ui_components__$TabBar_GetTab
});
var haxe_ui_components__$TabBar_Events = function(tabbar) {
	haxe_ui_events_Events.call(this,tabbar);
	this._tabbar = tabbar;
};
$hxClasses["haxe.ui.components._TabBar.Events"] = haxe_ui_components__$TabBar_Events;
haxe_ui_components__$TabBar_Events.__name__ = "haxe.ui.components._TabBar.Events";
haxe_ui_components__$TabBar_Events.__super__ = haxe_ui_events_Events;
haxe_ui_components__$TabBar_Events.prototype = $extend(haxe_ui_events_Events.prototype,{
	_tabbar: null
	,register: function() {
		var builder = js_Boot.__cast(this._tabbar._compositeBuilder , haxe_ui_components__$TabBar_Builder);
		var _g = 0;
		var _this = builder._container;
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			if(t.hasEvent("mousedown",$bind(this,this.onTabMouseDown)) == false) {
				t.registerEvent("mousedown",$bind(this,this.onTabMouseDown));
			}
		}
		this.registerEvent("mousewheel",$bind(this,this.onMouseWheel));
	}
	,unregister: function() {
		this.unregisterEvent("mousewheel",$bind(this,this.onMouseWheel));
	}
	,onMouseWheel: function(event) {
		var builder = js_Boot.__cast(this._tabbar._compositeBuilder , haxe_ui_components__$TabBar_Builder);
		if(event.delta < 0) {
			builder.scrollLeft();
		} else {
			builder.scrollRight();
		}
	}
	,onTabMouseDown: function(event) {
		var builder = js_Boot.__cast(this._tabbar._compositeBuilder , haxe_ui_components__$TabBar_Builder);
		var button = event.target;
		var close = button.findComponent("tab-close-button",haxe_ui_components_Image,false);
		var select = true;
		if(close != null) {
			select = !close.hitTest(event.screenX,event.screenY);
		}
		if(select == true) {
			this._tabbar.set_selectedIndex(builder._container.getComponentIndex(button));
		}
	}
	,__class__: haxe_ui_components__$TabBar_Events
});
var haxe_ui_components__$TabBar_Builder = function(tabbar) {
	haxe_ui_core_CompositeBuilder.call(this,tabbar);
	this._tabbar = tabbar;
	this.createContainer();
};
$hxClasses["haxe.ui.components._TabBar.Builder"] = haxe_ui_components__$TabBar_Builder;
haxe_ui_components__$TabBar_Builder.__name__ = "haxe.ui.components._TabBar.Builder";
haxe_ui_components__$TabBar_Builder.__super__ = haxe_ui_core_CompositeBuilder;
haxe_ui_components__$TabBar_Builder.prototype = $extend(haxe_ui_core_CompositeBuilder.prototype,{
	_tabbar: null
	,_container: null
	,_filler: null
	,create: function() {
		this.createContainer();
	}
	,createContainer: function() {
		if(this._filler == null) {
			this._filler = new haxe_ui_containers_Box();
			this._filler.set_id("tabbar-filler");
			this._filler.addClass("tabbar-filler");
			this._tabbar.addComponent(this._filler);
		}
		if(this._container == null) {
			this._container = new haxe_ui_containers_HBox();
			this._container.set_id("tabbar-contents");
			this._container.addClass("tabbar-contents");
			this._tabbar.addComponent(this._container);
		}
	}
	,addTab: function(child) {
		var button = this.createTabBarButton(child);
		var v = this._container.addComponent(button);
		this._tabbar.registerInternalEvents(haxe_ui_components__$TabBar_Events,true);
		if(this._tabbar.get_selectedIndex() < 0) {
			this._tabbar.set_selectedIndex(0);
		}
		return v;
	}
	,addTabAt: function(child,index) {
		var button = this.createTabBarButton(child);
		var v = this._container.addComponentAt(button,index);
		this._tabbar.registerInternalEvents(haxe_ui_components__$TabBar_Events,true);
		if(this._tabbar.get_selectedIndex() < 0) {
			this._tabbar.set_selectedIndex(0);
		} else if(index <= this._tabbar.get_selectedIndex()) {
			var fh = this._tabbar;
			fh.set_selectedIndex(fh.get_selectedIndex() + 1);
		}
		return v;
	}
	,createTabBarButton: function(child) {
		var button = new haxe_ui_components__$TabBar_TabBarButton();
		button.addClass("tabbar-button");
		if(this._tabbar.get_tabPosition() == "bottom") {
			button.addClass(":bottom");
		}
		button.set_id(child.get_id());
		button.set_text(child.get_text());
		button.set_tooltip(child.get_tooltip());
		if(((child) instanceof haxe_ui_components_Button)) {
			button.set_icon((js_Boot.__cast(child , haxe_ui_components_Button)).get_icon());
		}
		button.set_closable(this._tabbar.get_closable());
		return button;
	}
	,get_numComponents: function() {
		return this._container.get_numComponents();
	}
	,addComponent: function(child) {
		if(child != this._container && child != this._scrollLeft && child != this._scrollRight && child != this._filler) {
			return this.addTab(child);
		}
		return null;
	}
	,addComponentAt: function(child,index) {
		if(child != this._container && child != this._scrollLeft && child != this._scrollRight && child != this._filler) {
			return this.addTabAt(child,index);
		}
		return null;
	}
	,removeComponent: function(child,dispose,invalidate) {
		if(invalidate == null) {
			invalidate = true;
		}
		if(dispose == null) {
			dispose = true;
		}
		if(child != this._container && child != this._scrollLeft && child != this._scrollRight && child != this._filler) {
			var index = this._container.getComponentIndex(child);
			if(index != -1) {
				this._tabbar.removeTab(index);
				return child;
			}
		}
		return null;
	}
	,removeComponentAt: function(index,dispose,invalidate) {
		if(invalidate == null) {
			invalidate = true;
		}
		if(dispose == null) {
			dispose = true;
		}
		var child = this._container.getComponentAt(index);
		if(child != null) {
			this._tabbar.removeTab(index);
		}
		return child;
	}
	,getComponentIndex: function(child) {
		if(child != this._container && child != this._scrollLeft && child != this._scrollRight && child != this._filler) {
			return this._container.getComponentIndex(child);
		}
		return -1;
	}
	,setComponentIndex: function(child,index) {
		if(child != this._container && child != this._scrollLeft && child != this._scrollRight && child != this._filler) {
			return this._container.setComponentIndex(child,index);
		}
		return null;
	}
	,getComponentAt: function(index) {
		return this._container.getComponentAt(index);
	}
	,validateComponentLayout: function() {
		if(this._tabbar.get_native() == true || this._container == null) {
			return false;
		}
		if(this._containerPosition == null) {
			this._containerPosition = this._tabbar.get_layout().get_paddingLeft();
		}
		if(this._container.get_width() > this._tabbar.get_layout().get_usableWidth() && this._tabbar.get_layout().get_usableWidth() > 0) {
			this.showScrollButtons();
			this._container.set_left(this._containerPosition);
		} else {
			this.hideScrollButtons();
			this._containerPosition = null;
		}
		return true;
	}
	,_scrollLeft: null
	,_scrollRight: null
	,showScrollButtons: function() {
		var _gthis = this;
		if(this._scrollLeft == null) {
			this._scrollLeft = new haxe_ui_components_Button();
			this._scrollLeft.set_id("tabbar-scroll-left");
			this._scrollLeft.addClass("tabbar-scroll-left");
			this._scrollLeft.set_includeInLayout(false);
			this._scrollLeft.set_repeater(true);
			this._tabbar.addComponent(this._scrollLeft);
			this._scrollLeft.set_onClick(function(e) {
				_gthis.scrollLeft();
			});
		} else {
			this._scrollLeft.show();
		}
		if(this._scrollRight == null) {
			this._scrollRight = new haxe_ui_components_Button();
			this._scrollRight.set_id("tabbar-scroll-right");
			this._scrollRight.addClass("tabbar-scroll-right");
			this._scrollRight.set_includeInLayout(false);
			this._scrollRight.set_repeater(true);
			this._tabbar.addComponent(this._scrollRight);
			this._scrollRight.set_onClick(function(e) {
				_gthis.scrollRight();
			});
		} else {
			this._scrollRight.show();
		}
	}
	,_containerPosition: null
	,scrollLeft: function() {
		if(this._scrollLeft == null || this._scrollLeft.get_hidden() == true) {
			return;
		}
		var x = this._container.get_left() + 20;
		if(x > this._tabbar.get_layout().get_paddingLeft()) {
			x = this._tabbar.get_layout().get_paddingLeft();
		}
		this._containerPosition = x;
		this._container.set_left(x);
	}
	,scrollRight: function() {
		if(this._scrollLeft == null || this._scrollLeft.get_hidden() == true) {
			return;
		}
		var x = this._container.get_left() - 20;
		var max = -(this._container.get_width() - this._tabbar.get_width());
		var left = this._tabbar.findComponent("tabbar-scroll-left",haxe_ui_components_Button);
		var right = this._tabbar.findComponent("tabbar-scroll-right",haxe_ui_components_Button);
		if(left != null && left.get_hidden() == false) {
			max -= left.get_width();
			max -= this._tabbar.get_layout().get_horizontalSpacing();
		}
		if(right != null && right.get_hidden() == false) {
			max -= right.get_width();
		}
		if(x < max) {
			x = max;
		}
		this._containerPosition = x;
		this._container.set_left(x);
	}
	,hideScrollButtons: function() {
		if(this._scrollLeft != null) {
			this._scrollLeft.hide();
		}
		if(this._scrollRight != null) {
			this._scrollRight.hide();
		}
	}
	,__class__: haxe_ui_components__$TabBar_Builder
});
var haxe_ui_components__$TabBar_TabBarButton = function() {
	this._closable = false;
	haxe_ui_components_Button.call(this);
};
$hxClasses["haxe.ui.components._TabBar.TabBarButton"] = haxe_ui_components__$TabBar_TabBarButton;
haxe_ui_components__$TabBar_TabBarButton.__name__ = "haxe.ui.components._TabBar.TabBarButton";
haxe_ui_components__$TabBar_TabBarButton.__super__ = haxe_ui_components_Button;
haxe_ui_components__$TabBar_TabBarButton.prototype = $extend(haxe_ui_components_Button.prototype,{
	_closable: null
	,get_closable: function() {
		return this._closable;
	}
	,set_closable: function(value) {
		if(this._closable == value) {
			return value;
		}
		this._closable = value;
		var existing = this.findComponent("tab-close-button",haxe_ui_components_Image,false);
		var events = js_Boot.__cast(this._internalEvents , haxe_ui_components_ButtonEvents);
		events.recursiveStyling = false;
		if(this._closable == true && existing == null) {
			this.set_iconPosition("far-left");
			var image = new haxe_ui_components_Image();
			image.set_id("tab-close-button");
			image.addClass("tab-close-button");
			image.set_includeInLayout(false);
			image.set_scriptAccess(false);
			image.set_onClick($bind(this,this.onCloseClicked));
			this.addComponent(image);
		} else if(existing != null) {
			this.removeComponent(existing);
		}
		return value;
	}
	,onCloseClicked: function(e) {
		var tabbar = this.findAncestor(null,haxe_ui_components_TabBar);
		var builder = js_Boot.__cast(tabbar._compositeBuilder , haxe_ui_components__$TabBar_Builder);
		var index = builder._container.getComponentIndex(this);
		var event = new haxe_ui_events_UIEvent("beforeClose",null,index);
		tabbar.dispatch(event);
		if(event.canceled == false) {
			if(index != -1) {
				tabbar.removeTab(index);
			}
		}
	}
	,registerComposite: function() {
		haxe_ui_components_Button.prototype.registerComposite.call(this);
		this._defaultLayoutClass = haxe_ui_components__$TabBar_TabBarButtonLayout;
	}
	,registerBehaviours: function() {
		haxe_ui_components_Button.prototype.registerBehaviours.call(this);
	}
	,cloneComponent: function() {
		var c = haxe_ui_components_Button.prototype.cloneComponent.call(this);
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_components__$TabBar_TabBarButton();
	}
	,__class__: haxe_ui_components__$TabBar_TabBarButton
	,__properties__: $extend(haxe_ui_components_Button.prototype.__properties__,{set_closable:"set_closable",get_closable:"get_closable"})
});
var haxe_ui_components__$TabBar_TabBarButtonLayout = function() {
	haxe_ui_components_ButtonLayout.call(this);
};
$hxClasses["haxe.ui.components._TabBar.TabBarButtonLayout"] = haxe_ui_components__$TabBar_TabBarButtonLayout;
haxe_ui_components__$TabBar_TabBarButtonLayout.__name__ = "haxe.ui.components._TabBar.TabBarButtonLayout";
haxe_ui_components__$TabBar_TabBarButtonLayout.__super__ = haxe_ui_components_ButtonLayout;
haxe_ui_components__$TabBar_TabBarButtonLayout.prototype = $extend(haxe_ui_components_ButtonLayout.prototype,{
	repositionChildren: function() {
		haxe_ui_components_ButtonLayout.prototype.repositionChildren.call(this);
		var image = this._component.findComponent("tab-close-button",haxe_ui_components_Image,false);
		if(image != null && this.get_component().get_componentWidth() > 0) {
			image.set_top((this.get_component().get_componentHeight() / 2 - image.get_componentHeight() / 2 | 0) + this.marginTop(image) - this.marginBottom(image));
			image.set_left(this.get_component().get_componentWidth() - image.get_componentWidth() - this.get_paddingRight() + this.marginLeft(image) - this.marginRight(image));
		}
	}
	,calcAutoSize: function(exclusions) {
		var size = haxe_ui_components_ButtonLayout.prototype.calcAutoSize.call(this,exclusions);
		var image = this._component.findComponent("tab-close-button",haxe_ui_components_Image,false);
		if(image != null) {
			size.width += image.get_width() + this.get_horizontalSpacing();
		}
		return size;
	}
	,__class__: haxe_ui_components__$TabBar_TabBarButtonLayout
});
var haxe_ui_components_TextField = function() {
	haxe_ui_core_InteractiveComponent.call(this);
};
$hxClasses["haxe.ui.components.TextField"] = haxe_ui_components_TextField;
haxe_ui_components_TextField.__name__ = "haxe.ui.components.TextField";
haxe_ui_components_TextField.__super__ = haxe_ui_core_InteractiveComponent;
haxe_ui_components_TextField.prototype = $extend(haxe_ui_core_InteractiveComponent.prototype,{
	registerBehaviours: function() {
		haxe_ui_core_InteractiveComponent.prototype.registerBehaviours.call(this);
		this.behaviours.register("password",haxe_ui_components__$TextField_PasswordBehaviour);
		this.behaviours.register("maxChars",haxe_ui_components__$TextField_MaxCharsBehaviour,haxe_ui_util_Variant.fromInt(-1));
		this.behaviours.register("restrictChars",haxe_ui_components__$TextField_RestrictCharsBehaviour);
		this.behaviours.register("placeholder",haxe_ui_components__$TextField_PlaceholderBehaviour);
		this.behaviours.register("text",haxe_ui_components__$TextField_TextBehaviour);
		this.behaviours.register("htmlText",haxe_ui_components__$TextField_HtmlTextBehaviour);
		this.behaviours.register("icon",haxe_ui_components__$TextField_IconBehaviour);
	}
	,get_password: function() {
		return haxe_ui_util_Variant.toBool(this.behaviours.get("password"));
	}
	,set_password: function(value) {
		this.behaviours.set("password",haxe_ui_util_Variant.fromBool(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"password"));
		return value;
	}
	,get_maxChars: function() {
		return haxe_ui_util_Variant.toInt(this.behaviours.get("maxChars"));
	}
	,set_maxChars: function(value) {
		this.behaviours.set("maxChars",haxe_ui_util_Variant.fromInt(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"maxChars"));
		return value;
	}
	,get_restrictChars: function() {
		return haxe_ui_util_Variant.toString(this.behaviours.get("restrictChars"));
	}
	,set_restrictChars: function(value) {
		var _g = Type.typeof(value);
		if(_g._hx_index == 6) {
			if(_g.c == String) {
				if(value != null && value.indexOf("{{") != -1 && value.indexOf("}}") != -1) {
					haxe_ui_locale_LocaleManager.get_instance().registerComponent(this,"restrictChars",null,value);
					return value;
				}
			}
		}
		this.behaviours.set("restrictChars",haxe_ui_util_Variant.fromString(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"restrictChars"));
		return value;
	}
	,get_placeholder: function() {
		return haxe_ui_util_Variant.toString(this.behaviours.get("placeholder"));
	}
	,set_placeholder: function(value) {
		var _g = Type.typeof(value);
		if(_g._hx_index == 6) {
			if(_g.c == String) {
				if(value != null && value.indexOf("{{") != -1 && value.indexOf("}}") != -1) {
					haxe_ui_locale_LocaleManager.get_instance().registerComponent(this,"placeholder",null,value);
					return value;
				}
			}
		}
		this.behaviours.set("placeholder",haxe_ui_util_Variant.fromString(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"placeholder"));
		return value;
	}
	,get_htmlText: function() {
		return haxe_ui_util_Variant.toString(this.behaviours.get("htmlText"));
	}
	,set_htmlText: function(value) {
		var _g = Type.typeof(value);
		if(_g._hx_index == 6) {
			if(_g.c == String) {
				if(value != null && value.indexOf("{{") != -1 && value.indexOf("}}") != -1) {
					haxe_ui_locale_LocaleManager.get_instance().registerComponent(this,"htmlText",null,value);
					return value;
				}
			}
		}
		this.behaviours.set("htmlText",haxe_ui_util_Variant.fromString(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"htmlText"));
		return value;
	}
	,get_icon: function() {
		return haxe_ui_util_Variant.toString(this.behaviours.get("icon"));
	}
	,set_icon: function(value) {
		var _g = Type.typeof(value);
		if(_g._hx_index == 6) {
			if(_g.c == String) {
				if(value != null && value.indexOf("{{") != -1 && value.indexOf("}}") != -1) {
					haxe_ui_locale_LocaleManager.get_instance().registerComponent(this,"icon",null,value);
					return value;
				}
			}
		}
		this.behaviours.set("icon",haxe_ui_util_Variant.fromString(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"icon"));
		return value;
	}
	,get_value: function() {
		return this.get_text();
	}
	,set_value: function(value) {
		this.set_text(value);
		return value;
	}
	,cloneComponent: function() {
		var c = haxe_ui_core_InteractiveComponent.prototype.cloneComponent.call(this);
		c.set_password(this.get_password());
		c.set_maxChars(this.get_maxChars());
		if(this.get_restrictChars() != null) {
			c.set_restrictChars(this.get_restrictChars());
		}
		if(this.get_placeholder() != null) {
			c.set_placeholder(this.get_placeholder());
		}
		if(this.get_htmlText() != null) {
			c.set_htmlText(this.get_htmlText());
		}
		if(this.get_icon() != null) {
			c.set_icon(this.get_icon());
		}
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_components_TextField();
	}
	,registerComposite: function() {
		haxe_ui_core_InteractiveComponent.prototype.registerComposite.call(this);
		this._internalEventsClass = haxe_ui_components__$TextField_Events;
		this._compositeBuilderClass = haxe_ui_components__$TextField_Builder;
		this._defaultLayoutClass = haxe_ui_components__$TextField_TextFieldLayout;
	}
	,__class__: haxe_ui_components_TextField
	,__properties__: $extend(haxe_ui_core_InteractiveComponent.prototype.__properties__,{set_icon:"set_icon",get_icon:"get_icon",set_htmlText:"set_htmlText",get_htmlText:"get_htmlText",set_placeholder:"set_placeholder",get_placeholder:"get_placeholder",set_restrictChars:"set_restrictChars",get_restrictChars:"get_restrictChars",set_maxChars:"set_maxChars",get_maxChars:"get_maxChars",set_password:"set_password",get_password:"get_password"})
});
var haxe_ui_components__$TextField_TextFieldLayout = function() {
	haxe_ui_layouts_DefaultLayout.call(this);
};
$hxClasses["haxe.ui.components._TextField.TextFieldLayout"] = haxe_ui_components__$TextField_TextFieldLayout;
haxe_ui_components__$TextField_TextFieldLayout.__name__ = "haxe.ui.components._TextField.TextFieldLayout";
haxe_ui_components__$TextField_TextFieldLayout.__super__ = haxe_ui_layouts_DefaultLayout;
haxe_ui_components__$TextField_TextFieldLayout.prototype = $extend(haxe_ui_layouts_DefaultLayout.prototype,{
	iconPosition: null
	,get_iconPosition: function() {
		if(this.get_component().get_style().iconPosition == null) {
			return "left";
		}
		return this.get_component().get_style().iconPosition;
	}
	,repositionChildren: function() {
		var icon = this.get_component().findComponent(null,haxe_ui_components_Image,false);
		var xpos = this.get_paddingLeft();
		if(icon != null) {
			switch(this.get_iconPosition()) {
			case "left":
				icon.set_left(xpos);
				icon.set_top(this.get_component().get_componentHeight() / 2 - icon.get_componentHeight() / 2);
				xpos += icon.get_componentWidth() + this.get_horizontalSpacing();
				break;
			case "right":
				icon.set_left(this.get_component().get_componentWidth() - icon.get_componentWidth() - this.get_paddingRight());
				icon.set_top(this.get_component().get_componentHeight() / 2 - icon.get_componentHeight() / 2);
				break;
			}
		}
		if(this.get_component().hasTextInput() == true) {
			this.get_component().getTextInput().set_left(xpos);
			this.get_component().getTextInput().set_top(this.get_paddingTop() + this.get_component().get_componentHeight() / 2 - (this.get_component().getTextInput().get_height() + this.get_paddingTop() + this.get_paddingBottom()) / 2);
		}
	}
	,resizeChildren: function() {
		haxe_ui_layouts_DefaultLayout.prototype.resizeChildren.call(this);
		if(this.get_component().hasTextInput() == true) {
			var size = this.get_usableSize();
			this.get_component().getTextInput().set_width(size.width);
			this.get_component().getTextInput().set_height(size.height);
		}
	}
	,calcAutoSize: function(exclusions) {
		var size = haxe_ui_layouts_DefaultLayout.prototype.calcAutoSize.call(this,exclusions);
		if(this.get_component().hasTextInput() == true) {
			if(this.get_component().getTextInput().get_textWidth() + this.get_paddingLeft() + this.get_paddingRight() > size.width) {
				size.width = this.get_component().getTextInput().get_textWidth() + this.get_paddingLeft() + this.get_paddingRight();
			}
			if(this.get_component().getTextInput().get_textHeight() + this.get_paddingTop() + this.get_paddingBottom() > size.height) {
				size.height = this.get_component().getTextInput().get_textHeight() + this.get_paddingTop() + this.get_paddingBottom();
			}
		}
		return size;
	}
	,get_usableSize: function() {
		var size = haxe_ui_layouts_DefaultLayout.prototype.get_usableSize.call(this);
		var icon = this.get_component().findComponent(null,haxe_ui_components_Image,false);
		if(icon != null) {
			size.width -= icon.get_componentWidth() + this.get_horizontalSpacing();
		}
		return size;
	}
	,__class__: haxe_ui_components__$TextField_TextFieldLayout
	,__properties__: $extend(haxe_ui_layouts_DefaultLayout.prototype.__properties__,{get_iconPosition:"get_iconPosition"})
});
var haxe_ui_components__$TextField_PasswordBehaviour = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.components._TextField.PasswordBehaviour"] = haxe_ui_components__$TextField_PasswordBehaviour;
haxe_ui_components__$TextField_PasswordBehaviour.__name__ = "haxe.ui.components._TextField.PasswordBehaviour";
haxe_ui_components__$TextField_PasswordBehaviour.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_components__$TextField_PasswordBehaviour.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	originalValue: null
	,validateData: function() {
		if(this.originalValue == null) {
			this.originalValue = this._value;
		}
		var textfield = js_Boot.__cast(this._component , haxe_ui_components_TextField);
		textfield.getTextInput().set_password(haxe_ui_util_Variant.toBool(this._value));
	}
	,__class__: haxe_ui_components__$TextField_PasswordBehaviour
});
var haxe_ui_components__$TextField_MaxCharsBehaviour = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.components._TextField.MaxCharsBehaviour"] = haxe_ui_components__$TextField_MaxCharsBehaviour;
haxe_ui_components__$TextField_MaxCharsBehaviour.__name__ = "haxe.ui.components._TextField.MaxCharsBehaviour";
haxe_ui_components__$TextField_MaxCharsBehaviour.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_components__$TextField_MaxCharsBehaviour.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	validateData: function() {
		var textfield = js_Boot.__cast(this._component , haxe_ui_components_TextField);
		haxe_ui_components__$TextField_TextFieldHelper.validateText(textfield,textfield.get_text());
	}
	,__class__: haxe_ui_components__$TextField_MaxCharsBehaviour
});
var haxe_ui_components__$TextField_RestrictCharsBehaviour = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.components._TextField.RestrictCharsBehaviour"] = haxe_ui_components__$TextField_RestrictCharsBehaviour;
haxe_ui_components__$TextField_RestrictCharsBehaviour.__name__ = "haxe.ui.components._TextField.RestrictCharsBehaviour";
haxe_ui_components__$TextField_RestrictCharsBehaviour.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_components__$TextField_RestrictCharsBehaviour.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	regexp: null
	,validateData: function() {
		var excludeEReg = new EReg("\\^(.-.|.)","gu");
		var excludeChars = "";
		var includeChars = excludeEReg.map(haxe_ui_util_Variant.toString(this._value),function(ereg) {
			excludeChars += ereg.matched(1);
			return "";
		});
		var testRegexpParts = [];
		if(includeChars.length > 0) {
			testRegexpParts.push("[^" + (this._value == null ? "null" : haxe_ui_util_Variant.toString(this._value)) + "]");
		}
		if(excludeChars.length > 0) {
			testRegexpParts.push("[" + excludeChars + "]");
		}
		this.regexp = new EReg("(" + testRegexpParts.join(" | ") + ")","g");
		var textfield = js_Boot.__cast(this._component , haxe_ui_components_TextField);
		haxe_ui_components__$TextField_TextFieldHelper.validateText(textfield,textfield.get_text());
	}
	,__class__: haxe_ui_components__$TextField_RestrictCharsBehaviour
});
var haxe_ui_components__$TextField_PlaceholderBehaviour = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.components._TextField.PlaceholderBehaviour"] = haxe_ui_components__$TextField_PlaceholderBehaviour;
haxe_ui_components__$TextField_PlaceholderBehaviour.__name__ = "haxe.ui.components._TextField.PlaceholderBehaviour";
haxe_ui_components__$TextField_PlaceholderBehaviour.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_components__$TextField_PlaceholderBehaviour.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	validateData: function() {
		var textfield = js_Boot.__cast(this._component , haxe_ui_components_TextField);
		haxe_ui_components__$TextField_TextFieldHelper.validateText(textfield,textfield.get_text());
	}
	,__class__: haxe_ui_components__$TextField_PlaceholderBehaviour
});
var haxe_ui_components__$TextField_TextBehaviour = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.components._TextField.TextBehaviour"] = haxe_ui_components__$TextField_TextBehaviour;
haxe_ui_components__$TextField_TextBehaviour.__name__ = "haxe.ui.components._TextField.TextBehaviour";
haxe_ui_components__$TextField_TextBehaviour.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_components__$TextField_TextBehaviour.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	validateData: function() {
		var textfield = js_Boot.__cast(this._component , haxe_ui_components_TextField);
		haxe_ui_components__$TextField_TextFieldHelper.validateText(textfield,haxe_ui_util_Variant.toString(this._value));
		if(this._value != null && haxe_ui_util_Variant.neq(this._value,haxe_ui_util_Variant.fromString(""))) {
			this._value = haxe_ui_util_Variant.fromString(textfield.getTextInput().get_text());
		}
	}
	,__class__: haxe_ui_components__$TextField_TextBehaviour
});
var haxe_ui_components__$TextField_HtmlTextBehaviour = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.components._TextField.HtmlTextBehaviour"] = haxe_ui_components__$TextField_HtmlTextBehaviour;
haxe_ui_components__$TextField_HtmlTextBehaviour.__name__ = "haxe.ui.components._TextField.HtmlTextBehaviour";
haxe_ui_components__$TextField_HtmlTextBehaviour.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_components__$TextField_HtmlTextBehaviour.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	validateData: function() {
		var textfield = js_Boot.__cast(this._component , haxe_ui_components_TextField);
		haxe_ui_components__$TextField_TextFieldHelper.validateHtmlText(textfield,haxe_ui_util_Variant.toString(this._value));
		if(this._value != null && haxe_ui_util_Variant.neq(this._value,haxe_ui_util_Variant.fromString(""))) {
			this._value = haxe_ui_util_Variant.fromString(textfield.getTextInput().get_htmlText());
		}
	}
	,__class__: haxe_ui_components__$TextField_HtmlTextBehaviour
});
var haxe_ui_components__$TextField_IconBehaviour = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.components._TextField.IconBehaviour"] = haxe_ui_components__$TextField_IconBehaviour;
haxe_ui_components__$TextField_IconBehaviour.__name__ = "haxe.ui.components._TextField.IconBehaviour";
haxe_ui_components__$TextField_IconBehaviour.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_components__$TextField_IconBehaviour.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	validateData: function() {
		var textfield = js_Boot.__cast(this._component , haxe_ui_components_TextField);
		var icon = textfield.findComponent(null,haxe_ui_components_Image,false);
		if((this._value == null || haxe_ui_util_Variant.get_isNull(this._value)) && icon != null) {
			textfield.removeComponent(icon);
		} else {
			if(icon == null) {
				icon = new haxe_ui_components_Image();
				icon.set_id("textfield-icon");
				icon.addClass("icon");
				icon.set_scriptAccess(false);
				textfield.addComponentAt(icon,0);
			}
			icon.set_resource(haxe_ui_util_Variant.fromString(haxe_ui_util_Variant.toString(this._value)));
		}
	}
	,__class__: haxe_ui_components__$TextField_IconBehaviour
});
var haxe_ui_components__$TextField_TextFieldHelper = function() { };
$hxClasses["haxe.ui.components._TextField.TextFieldHelper"] = haxe_ui_components__$TextField_TextFieldHelper;
haxe_ui_components__$TextField_TextFieldHelper.__name__ = "haxe.ui.components._TextField.TextFieldHelper";
haxe_ui_components__$TextField_TextFieldHelper.validateText = function(textfield,text) {
	if(text == null) {
		text = "";
	}
	var placeholderVisible = text.length == 0;
	var password = (js_Boot.__cast(textfield.behaviours.find("password") , haxe_ui_components__$TextField_PasswordBehaviour)).originalValue;
	var regexp = (js_Boot.__cast(textfield.behaviours.find("restrictChars") , haxe_ui_components__$TextField_RestrictCharsBehaviour)).regexp;
	if(textfield.get_maxChars() > 0 && text.length > textfield.get_maxChars() && placeholderVisible == false) {
		text = HxOverrides.substr(text,0,textfield.get_maxChars());
	}
	if(regexp != null) {
		text = text.replace(regexp.r,"");
	}
	if(textfield.get_placeholder() != null) {
		if(textfield.get_focus() == false) {
			if(text.length == 0) {
				text = textfield.get_placeholder();
				textfield.set_password(false);
				textfield.addClass(":empty");
			} else if(text != textfield.get_placeholder()) {
				textfield.set_password(haxe_ui_util_Variant.toBool(password));
				textfield.removeClass(":empty");
			}
		} else {
			textfield.removeClass(":empty");
			if(text == textfield.get_placeholder()) {
				text = "";
			}
			textfield.set_password(haxe_ui_util_Variant.toBool(password));
		}
	} else {
		textfield.set_password(haxe_ui_util_Variant.toBool(password));
		if(placeholderVisible == true) {
			textfield.removeClass(":empty");
		}
	}
	textfield.getTextInput().set_text("" + text);
	if(!(textfield._layout == null || textfield._layoutLocked == true)) {
		textfield.invalidateComponent("layout",false);
	}
};
haxe_ui_components__$TextField_TextFieldHelper.validateHtmlText = function(textfield,htmlText) {
	if(htmlText == null) {
		htmlText = "";
	}
	var placeholderVisible = htmlText.length == 0;
	var password = (js_Boot.__cast(textfield.behaviours.find("password") , haxe_ui_components__$TextField_PasswordBehaviour)).originalValue;
	var regexp = (js_Boot.__cast(textfield.behaviours.find("restrictChars") , haxe_ui_components__$TextField_RestrictCharsBehaviour)).regexp;
	if(textfield.get_maxChars() > 0 && htmlText.length > textfield.get_maxChars() && placeholderVisible == false) {
		htmlText = HxOverrides.substr(htmlText,0,textfield.get_maxChars());
	}
	if(regexp != null) {
		htmlText = htmlText.replace(regexp.r,"");
	}
	if(textfield.get_placeholder() != null) {
		if(textfield.get_focus() == false) {
			if(htmlText.length == 0) {
				htmlText = textfield.get_placeholder();
				textfield.set_password(false);
				textfield.addClass(":empty");
			} else if(htmlText != textfield.get_placeholder()) {
				textfield.set_password(haxe_ui_util_Variant.toBool(password));
				textfield.removeClass(":empty");
			}
		} else {
			textfield.removeClass(":empty");
			if(htmlText == textfield.get_placeholder()) {
				htmlText = "";
			}
			textfield.set_password(haxe_ui_util_Variant.toBool(password));
		}
	} else {
		textfield.set_password(haxe_ui_util_Variant.toBool(password));
		if(placeholderVisible == true) {
			textfield.removeClass(":empty");
		}
	}
	textfield.getTextInput().set_htmlText("" + htmlText);
	if(!(textfield._layout == null || textfield._layoutLocked == true)) {
		textfield.invalidateComponent("layout",false);
	}
};
var haxe_ui_components__$TextField_Events = function(textfield) {
	haxe_ui_events_Events.call(this,textfield);
	this._textfield = textfield;
};
$hxClasses["haxe.ui.components._TextField.Events"] = haxe_ui_components__$TextField_Events;
haxe_ui_components__$TextField_Events.__name__ = "haxe.ui.components._TextField.Events";
haxe_ui_components__$TextField_Events.__super__ = haxe_ui_events_Events;
haxe_ui_components__$TextField_Events.prototype = $extend(haxe_ui_events_Events.prototype,{
	_textfield: null
	,register: function() {
		var _gthis = this;
		if(this._textfield.getTextInput().get_data().onChangedCallback == null) {
			this._textfield.getTextInput().set_multiline(false);
			this._textfield.getTextInput().get_data().onChangedCallback = function() {
				if(_gthis._textfield.classes.indexOf(":empty") != -1 == false) {
					_gthis._textfield.set_text(_gthis._textfield.getTextInput().get_text());
					_gthis._textfield.dispatch(new haxe_ui_events_UIEvent("change"));
				}
			};
		}
		this.registerEvent("mousedown",$bind(this,this.onMouseDown));
		this.registerEvent("focusin",$bind(this,this.onFocusChange));
		this.registerEvent("focusout",$bind(this,this.onFocusChange));
	}
	,unregister: function() {
		this._textfield.getTextInput().get_data().onChangedCallback = null;
		this.unregisterEvent("mousedown",$bind(this,this.onMouseDown));
		this.unregisterEvent("focusin",$bind(this,this.onFocusChange));
		this.unregisterEvent("focusout",$bind(this,this.onFocusChange));
	}
	,onMouseDown: function(event) {
		this._textfield.set_focus(true);
	}
	,onFocusChange: function(event) {
		if(this._textfield.get_focus() == true) {
			this._textfield.getTextInput().focus();
		} else {
			this._textfield.getTextInput().blur();
		}
		haxe_ui_components__$TextField_TextFieldHelper.validateText(this._textfield,this._textfield.get_text());
	}
	,__class__: haxe_ui_components__$TextField_Events
});
var haxe_ui_components__$TextField_Builder = function(textfield) {
	haxe_ui_core_CompositeBuilder.call(this,textfield);
	this._textfield = textfield;
};
$hxClasses["haxe.ui.components._TextField.Builder"] = haxe_ui_components__$TextField_Builder;
haxe_ui_components__$TextField_Builder.__name__ = "haxe.ui.components._TextField.Builder";
haxe_ui_components__$TextField_Builder.isHtml = function(v) {
	if(v == null) {
		return false;
	} else {
		return v.indexOf("<font ") != -1;
	}
};
haxe_ui_components__$TextField_Builder.__super__ = haxe_ui_core_CompositeBuilder;
haxe_ui_components__$TextField_Builder.prototype = $extend(haxe_ui_core_CompositeBuilder.prototype,{
	_textfield: null
	,applyStyle: function(style) {
		if(style.icon != null) {
			this._textfield.set_icon(style.icon);
		}
		if(this._textfield.hasTextInput() == true) {
			this._textfield.getTextInput().set_textStyle(style);
			var tmp;
			if((style.contentType == "auto" || style.contentType == "html") && this._textfield.getTextInput().get_supportsHtml()) {
				var v = Std.string(this._textfield.get_text());
				tmp = v == null ? false : v.indexOf("<font ") != -1;
			} else {
				tmp = false;
			}
			if(tmp) {
				this._textfield.set_htmlText(this._textfield.get_text());
			}
		}
	}
	,__class__: haxe_ui_components__$TextField_Builder
});
var haxe_ui_components_VerticalScroll = function() {
	haxe_ui_components_Scroll.call(this);
};
$hxClasses["haxe.ui.components.VerticalScroll"] = haxe_ui_components_VerticalScroll;
haxe_ui_components_VerticalScroll.__name__ = "haxe.ui.components.VerticalScroll";
haxe_ui_components_VerticalScroll.__super__ = haxe_ui_components_Scroll;
haxe_ui_components_VerticalScroll.prototype = $extend(haxe_ui_components_Scroll.prototype,{
	registerBehaviours: function() {
		haxe_ui_components_Scroll.prototype.registerBehaviours.call(this);
		this.behaviours.register("posFromCoord",haxe_ui_components__$VerticalScroll_PosFromCoord);
		this.behaviours.register("applyPageFromCoord",haxe_ui_components__$VerticalScroll_ApplyPageFromCoord);
	}
	,createChildren: function() {
		haxe_ui_components_Scroll.prototype.createChildren.call(this);
		if(this.get_componentHeight() <= 0) {
			this.set_componentHeight(150);
		}
	}
	,createDefaults: function() {
		haxe_ui_components_Scroll.prototype.createDefaults.call(this);
		this._defaultLayoutClass = haxe_ui_components__$VerticalScroll_VerticalScrollLayout;
	}
	,cloneComponent: function() {
		var c = haxe_ui_components_Scroll.prototype.cloneComponent.call(this);
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_components_VerticalScroll();
	}
	,__class__: haxe_ui_components_VerticalScroll
});
var haxe_ui_components__$VerticalScroll_PosFromCoord = function(component) {
	haxe_ui_behaviours_Behaviour.call(this,component);
};
$hxClasses["haxe.ui.components._VerticalScroll.PosFromCoord"] = haxe_ui_components__$VerticalScroll_PosFromCoord;
haxe_ui_components__$VerticalScroll_PosFromCoord.__name__ = "haxe.ui.components._VerticalScroll.PosFromCoord";
haxe_ui_components__$VerticalScroll_PosFromCoord.__super__ = haxe_ui_behaviours_Behaviour;
haxe_ui_components__$VerticalScroll_PosFromCoord.prototype = $extend(haxe_ui_behaviours_Behaviour.prototype,{
	call: function(pos) {
		var p = js_Boot.__cast(pos , haxe_ui_geom_Point);
		var scroll = js_Boot.__cast(this._component , haxe_ui_components_Scroll);
		var deinc = this._component.findComponent("scroll-deinc-button");
		var thumb = this._component.findComponent("scroll-thumb-button");
		var ypos = p.y;
		var minY = 0;
		if(deinc != null && deinc.get_hidden() == false) {
			minY = deinc.get_height() + scroll.get_layout().get_verticalSpacing();
		}
		var maxY = scroll.get_layout().get_usableHeight() - thumb.get_height();
		if(deinc != null && deinc.get_hidden() == false) {
			maxY += deinc.get_height() + scroll.get_layout().get_verticalSpacing();
		}
		if(ypos < minY) {
			ypos = minY;
		} else if(ypos > maxY) {
			ypos = maxY;
		}
		var ucy = scroll.get_layout().get_usableHeight();
		ucy -= thumb.get_height();
		var m = scroll.get_max() - scroll.get_min() | 0;
		var v = ypos - minY;
		var value = scroll.get_min() + v / ucy * m;
		return haxe_ui_util_Variant.fromFloat(value);
	}
	,__class__: haxe_ui_components__$VerticalScroll_PosFromCoord
});
var haxe_ui_components__$VerticalScroll_ApplyPageFromCoord = function(component) {
	haxe_ui_behaviours_Behaviour.call(this,component);
};
$hxClasses["haxe.ui.components._VerticalScroll.ApplyPageFromCoord"] = haxe_ui_components__$VerticalScroll_ApplyPageFromCoord;
haxe_ui_components__$VerticalScroll_ApplyPageFromCoord.__name__ = "haxe.ui.components._VerticalScroll.ApplyPageFromCoord";
haxe_ui_components__$VerticalScroll_ApplyPageFromCoord.__super__ = haxe_ui_behaviours_Behaviour;
haxe_ui_components__$VerticalScroll_ApplyPageFromCoord.prototype = $extend(haxe_ui_behaviours_Behaviour.prototype,{
	call: function(pos) {
		var p = js_Boot.__cast(pos , haxe_ui_geom_Point);
		var scroll = js_Boot.__cast(this._component , haxe_ui_components_Scroll);
		var thumb = this._component.findComponent("scroll-thumb-button");
		if(p.y < thumb.get_screenTop()) {
			scroll.set_pos(scroll.get_pos() - scroll.get_pageSize());
		} else if(p.y > thumb.get_screenTop() + thumb.get_height()) {
			scroll.set_pos(scroll.get_pos() + scroll.get_pageSize());
		}
		return null;
	}
	,__class__: haxe_ui_components__$VerticalScroll_ApplyPageFromCoord
});
var haxe_ui_components__$VerticalScroll_VerticalScrollLayout = function() {
	haxe_ui_layouts_DefaultLayout.call(this);
};
$hxClasses["haxe.ui.components._VerticalScroll.VerticalScrollLayout"] = haxe_ui_components__$VerticalScroll_VerticalScrollLayout;
haxe_ui_components__$VerticalScroll_VerticalScrollLayout.__name__ = "haxe.ui.components._VerticalScroll.VerticalScrollLayout";
haxe_ui_components__$VerticalScroll_VerticalScrollLayout.__super__ = haxe_ui_layouts_DefaultLayout;
haxe_ui_components__$VerticalScroll_VerticalScrollLayout.prototype = $extend(haxe_ui_layouts_DefaultLayout.prototype,{
	resizeChildren: function() {
		haxe_ui_layouts_DefaultLayout.prototype.resizeChildren.call(this);
		var scroll = js_Boot.__cast(this.get_component() , haxe_ui_components_Scroll);
		var thumb = this.get_component().findComponent("scroll-thumb-button");
		if(thumb != null) {
			var m = scroll.get_max() - scroll.get_min();
			var ucy = this.get_usableHeight();
			var thumbHeight = scroll.get_pageSize() / m * ucy;
			if(thumbHeight < this.get_innerWidth()) {
				thumbHeight = this.get_innerWidth();
			} else if(thumbHeight > ucy) {
				thumbHeight = ucy;
			}
			if(thumbHeight > 0 && isNaN(thumbHeight) == false) {
				thumb.set_height(thumbHeight);
			}
		}
	}
	,repositionChildren: function() {
		haxe_ui_layouts_DefaultLayout.prototype.repositionChildren.call(this);
		var deinc = this.get_component().findComponent("scroll-deinc-button");
		var inc = this.get_component().findComponent("scroll-inc-button");
		if(inc != null && this.hidden(inc) == false) {
			inc.set_top(this.get_component().get_height() - inc.get_height() - this.get_paddingBottom());
		}
		var scroll = js_Boot.__cast(this.get_component() , haxe_ui_components_Scroll);
		var thumb = this.get_component().findComponent("scroll-thumb-button");
		if(thumb != null) {
			var m = scroll.get_max() - scroll.get_min();
			var u = this.get_usableHeight();
			u -= thumb.get_height();
			var y = (scroll.get_pos() - scroll.get_min()) / m * u;
			y += this.get_paddingTop();
			if(deinc != null && this.hidden(deinc) == false) {
				y += deinc.get_height() + this.get_verticalSpacing();
			}
			thumb.set_left(Math.round(thumb.get_left()));
			thumb.set_top(y);
		}
	}
	,get_usableHeight: function() {
		var ucy = this.get_innerHeight();
		var deinc = this.get_component().findComponent("scroll-deinc-button");
		var inc = this.get_component().findComponent("scroll-inc-button");
		if(deinc != null && this.hidden(deinc) == false) {
			ucy -= deinc.get_height() + this.get_verticalSpacing();
		}
		if(inc != null && this.hidden(inc) == false) {
			ucy -= inc.get_height() + this.get_verticalSpacing();
		}
		return ucy;
	}
	,__class__: haxe_ui_components__$VerticalScroll_VerticalScrollLayout
});
var haxe_ui_containers_HBox = function() {
	haxe_ui_containers_Box.call(this);
	this.set_layout(new haxe_ui_layouts_HorizontalLayout());
};
$hxClasses["haxe.ui.containers.HBox"] = haxe_ui_containers_HBox;
haxe_ui_containers_HBox.__name__ = "haxe.ui.containers.HBox";
haxe_ui_containers_HBox.__super__ = haxe_ui_containers_Box;
haxe_ui_containers_HBox.prototype = $extend(haxe_ui_containers_Box.prototype,{
	get_continuous: function() {
		return ((this._layout) instanceof haxe_ui_layouts_HorizontalContinuousLayout);
	}
	,set_continuous: function(value) {
		if(value == true) {
			this.set_layout(new haxe_ui_layouts_HorizontalContinuousLayout());
		} else {
			this.set_layout(new haxe_ui_layouts_HorizontalLayout());
		}
		return value;
	}
	,registerBehaviours: function() {
		haxe_ui_containers_Box.prototype.registerBehaviours.call(this);
	}
	,cloneComponent: function() {
		var c = haxe_ui_containers_Box.prototype.cloneComponent.call(this);
		c.set_continuous(this.get_continuous());
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_containers_HBox();
	}
	,__class__: haxe_ui_containers_HBox
	,__properties__: $extend(haxe_ui_containers_Box.prototype.__properties__,{set_continuous:"set_continuous",get_continuous:"get_continuous"})
});
var haxe_ui_containers_Header = function() {
	haxe_ui_containers_HBox.call(this);
	this.set_layout(new haxe_ui_containers__$Header_Layout());
};
$hxClasses["haxe.ui.containers.Header"] = haxe_ui_containers_Header;
haxe_ui_containers_Header.__name__ = "haxe.ui.containers.Header";
haxe_ui_containers_Header.__super__ = haxe_ui_containers_HBox;
haxe_ui_containers_Header.prototype = $extend(haxe_ui_containers_HBox.prototype,{
	registerComposite: function() {
		haxe_ui_containers_HBox.prototype.registerComposite.call(this);
		this._defaultLayoutClass = haxe_ui_containers__$Header_Layout;
		this._compositeBuilderClass = haxe_ui_containers__$Header_Builder;
	}
	,registerBehaviours: function() {
		haxe_ui_containers_HBox.prototype.registerBehaviours.call(this);
	}
	,cloneComponent: function() {
		var c = haxe_ui_containers_HBox.prototype.cloneComponent.call(this);
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_containers_Header();
	}
	,__class__: haxe_ui_containers_Header
});
var haxe_ui_containers__$Header_Builder = function(header) {
	haxe_ui_core_CompositeBuilder.call(this,header);
	this._header = header;
};
$hxClasses["haxe.ui.containers._Header.Builder"] = haxe_ui_containers__$Header_Builder;
haxe_ui_containers__$Header_Builder.__name__ = "haxe.ui.containers._Header.Builder";
haxe_ui_containers__$Header_Builder.__super__ = haxe_ui_core_CompositeBuilder;
haxe_ui_containers__$Header_Builder.prototype = $extend(haxe_ui_core_CompositeBuilder.prototype,{
	_header: null
	,addComponent: function(child) {
		this.addEventListeners(child);
		return null;
	}
	,addComponentAt: function(child,index) {
		this.addEventListeners(child);
		return null;
	}
	,addEventListeners: function(c) {
		if(!((c) instanceof haxe_ui_components_Column)) {
			return;
		}
		var column = js_Boot.__cast(c , haxe_ui_components_Column);
		column.registerEvent("sortchanged",$bind(this,this.onSortChanged));
	}
	,onSortChanged: function(e) {
		var _g = 0;
		var _this = this._header;
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(e.target == c) {
				this._header.dispatch(e);
			} else {
				(js_Boot.__cast(c , haxe_ui_components_Column)).set_sortDirection(null);
			}
		}
	}
	,__class__: haxe_ui_containers__$Header_Builder
});
var haxe_ui_layouts_HorizontalLayout = function() {
	haxe_ui_layouts_DefaultLayout.call(this);
	this._calcFullWidths = true;
};
$hxClasses["haxe.ui.layouts.HorizontalLayout"] = haxe_ui_layouts_HorizontalLayout;
haxe_ui_layouts_HorizontalLayout.__name__ = "haxe.ui.layouts.HorizontalLayout";
haxe_ui_layouts_HorizontalLayout.__super__ = haxe_ui_layouts_DefaultLayout;
haxe_ui_layouts_HorizontalLayout.prototype = $extend(haxe_ui_layouts_DefaultLayout.prototype,{
	repositionChildren: function() {
		var xpos = this.get_paddingLeft();
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				continue;
			}
			var ypos = 0;
			switch(this.verticalAlign(child)) {
			case "bottom":
				if(child.get_componentHeight() < this.get_component().get_componentHeight()) {
					ypos = this.get_component().get_componentHeight() - (child.get_componentHeight() + this.get_paddingBottom() + this.marginTop(child));
				}
				break;
			case "center":
				ypos = (this.get_component().get_componentHeight() - child.get_componentHeight()) / 2 + this.marginTop(child) - this.marginBottom(child);
				break;
			default:
				ypos = this.get_paddingTop() + this.marginTop(child);
			}
			child.moveComponent(xpos + this.marginLeft(child),ypos);
			xpos += child.get_componentWidth() + this.get_horizontalSpacing();
		}
	}
	,get_usableSize: function() {
		var size = haxe_ui_layouts_DefaultLayout.prototype.get_usableSize.call(this);
		var _this = this.get_component();
		var visibleChildren = (_this._children == null ? [] : _this._children).length;
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				--visibleChildren;
				continue;
			}
			if(child.get_componentWidth() > 0 && (child.get_percentWidth() == null || this.fixedMinWidth(child) == true)) {
				size.width -= child.get_componentWidth() + this.marginLeft(child) + this.marginRight(child);
			}
		}
		if(visibleChildren > 1) {
			size.width -= this.get_horizontalSpacing() * (visibleChildren - 1);
		}
		if(size.width < 0) {
			size.width = 0;
		}
		return size;
	}
	,__class__: haxe_ui_layouts_HorizontalLayout
});
var haxe_ui_containers__$Header_Layout = function() {
	haxe_ui_layouts_HorizontalLayout.call(this);
};
$hxClasses["haxe.ui.containers._Header.Layout"] = haxe_ui_containers__$Header_Layout;
haxe_ui_containers__$Header_Layout.__name__ = "haxe.ui.containers._Header.Layout";
haxe_ui_containers__$Header_Layout.__super__ = haxe_ui_layouts_HorizontalLayout;
haxe_ui_containers__$Header_Layout.prototype = $extend(haxe_ui_layouts_HorizontalLayout.prototype,{
	resizeChildren: function() {
		haxe_ui_layouts_HorizontalLayout.prototype.resizeChildren.call(this);
		var max = 0;
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				continue;
			}
			if(child.get_height() > max) {
				max = child.get_height();
			}
		}
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				continue;
			}
			if(child.get_text() == null || child.get_text().length == 0) {
				child.set_height(max);
			}
		}
	}
	,__class__: haxe_ui_containers__$Header_Layout
});
var haxe_ui_containers_IVirtualContainer = function() { };
$hxClasses["haxe.ui.containers.IVirtualContainer"] = haxe_ui_containers_IVirtualContainer;
haxe_ui_containers_IVirtualContainer.__name__ = "haxe.ui.containers.IVirtualContainer";
haxe_ui_containers_IVirtualContainer.__isInterface__ = true;
haxe_ui_containers_IVirtualContainer.prototype = {
	get_itemWidth: null
	,set_itemWidth: null
	,get_itemHeight: null
	,set_itemHeight: null
	,get_itemCount: null
	,set_itemCount: null
	,get_variableItemSize: null
	,set_variableItemSize: null
	,get_virtual: null
	,set_virtual: null
	,get_hscrollPos: null
	,set_hscrollPos: null
	,get_hscrollMax: null
	,set_hscrollMax: null
	,get_hscrollPageSize: null
	,set_hscrollPageSize: null
	,get_vscrollPos: null
	,set_vscrollPos: null
	,get_vscrollMax: null
	,set_vscrollMax: null
	,get_vscrollPageSize: null
	,set_vscrollPageSize: null
	,get_itemRenderer: null
	,set_itemRenderer: null
	,get_itemRendererClass: null
	,set_itemRendererClass: null
	,__class__: haxe_ui_containers_IVirtualContainer
	,__properties__: {set_itemRendererClass:"set_itemRendererClass",get_itemRendererClass:"get_itemRendererClass",set_itemRenderer:"set_itemRenderer",get_itemRenderer:"get_itemRenderer",set_vscrollPageSize:"set_vscrollPageSize",get_vscrollPageSize:"get_vscrollPageSize",set_vscrollMax:"set_vscrollMax",get_vscrollMax:"get_vscrollMax",set_vscrollPos:"set_vscrollPos",get_vscrollPos:"get_vscrollPos",set_hscrollPageSize:"set_hscrollPageSize",get_hscrollPageSize:"get_hscrollPageSize",set_hscrollMax:"set_hscrollMax",get_hscrollMax:"get_hscrollMax",set_hscrollPos:"set_hscrollPos",get_hscrollPos:"get_hscrollPos",set_virtual:"set_virtual",get_virtual:"get_virtual",set_variableItemSize:"set_variableItemSize",get_variableItemSize:"get_variableItemSize",set_itemCount:"set_itemCount",get_itemCount:"get_itemCount",set_itemHeight:"set_itemHeight",get_itemHeight:"get_itemHeight",set_itemWidth:"set_itemWidth",get_itemWidth:"get_itemWidth"}
};
var haxe_ui_core_IScrollView = function() { };
$hxClasses["haxe.ui.core.IScrollView"] = haxe_ui_core_IScrollView;
haxe_ui_core_IScrollView.__name__ = "haxe.ui.core.IScrollView";
haxe_ui_core_IScrollView.__isInterface__ = true;
haxe_ui_core_IScrollView.prototype = {
	ensureVisible: null
	,__class__: haxe_ui_core_IScrollView
};
var haxe_ui_containers_ScrollView = function() {
	haxe_ui_core_InteractiveComponent.call(this);
};
$hxClasses["haxe.ui.containers.ScrollView"] = haxe_ui_containers_ScrollView;
haxe_ui_containers_ScrollView.__name__ = "haxe.ui.containers.ScrollView";
haxe_ui_containers_ScrollView.__interfaces__ = [haxe_ui_core_IScrollView];
haxe_ui_containers_ScrollView.__super__ = haxe_ui_core_InteractiveComponent;
haxe_ui_containers_ScrollView.prototype = $extend(haxe_ui_core_InteractiveComponent.prototype,{
	validateComponentInternal: function(nextFrame) {
		if(nextFrame == null) {
			nextFrame = true;
		}
		if(this.get_native() == true) {
			haxe_ui_core_InteractiveComponent.prototype.validateComponentInternal.call(this,nextFrame);
			return;
		}
		var scrollInvalid = this.isComponentInvalid("scroll");
		var layoutInvalid = this.isComponentInvalid("layout");
		haxe_ui_core_InteractiveComponent.prototype.validateComponentInternal.call(this,nextFrame);
		if(scrollInvalid || layoutInvalid) {
			(js_Boot.__cast(this._compositeBuilder , haxe_ui_containers_ScrollViewBuilder)).checkScrolls();
			(js_Boot.__cast(this._compositeBuilder , haxe_ui_containers_ScrollViewBuilder)).updateScrollRect();
		}
	}
	,ensureVisible: function(component) {
		return;
	}
	,get_isScroller: function() {
		return true;
	}
	,registerBehaviours: function() {
		haxe_ui_core_InteractiveComponent.prototype.registerBehaviours.call(this);
		this.behaviours.register("virtual",haxe_ui_containers__$ScrollView_Virtual);
		this.behaviours.register("contentLayoutName",haxe_ui_containers__$ScrollView_ContentLayoutName,haxe_ui_util_Variant.fromString("vertical"));
		this.behaviours.register("contentWidth",haxe_ui_containers__$ScrollView_ContentWidth);
		this.behaviours.register("percentContentWidth",haxe_ui_containers__$ScrollView_PercentContentWidth);
		this.behaviours.register("contentHeight",haxe_ui_containers__$ScrollView_ContentHeight);
		this.behaviours.register("percentContentHeight",haxe_ui_containers__$ScrollView_PercentContentHeight);
		this.behaviours.register("hscrollPos",haxe_ui_containers__$ScrollView_HScrollPos);
		this.behaviours.register("hscrollMax",haxe_ui_containers__$ScrollView_HScrollMax);
		this.behaviours.register("hscrollPageSize",haxe_ui_containers__$ScrollView_HScrollPageSize);
		this.behaviours.register("vscrollPos",haxe_ui_containers__$ScrollView_VScrollPos);
		this.behaviours.register("vscrollMax",haxe_ui_containers__$ScrollView_VScrollMax);
		this.behaviours.register("vscrollPageSize",haxe_ui_containers__$ScrollView_VScrollPageSize);
		this.behaviours.register("scrollMode",haxe_ui_containers__$ScrollView_ScrollModeBehaviour,haxe_ui_util_Variant.fromString("drag"));
		this.behaviours.register("contents",haxe_ui_containers__$ScrollView_GetContents);
		this.behaviours.register("autoHideScrolls",haxe_ui_behaviours_DefaultBehaviour);
	}
	,get_virtual: function() {
		return haxe_ui_util_Variant.toBool(this.behaviours.get("virtual"));
	}
	,set_virtual: function(value) {
		this.behaviours.set("virtual",haxe_ui_util_Variant.fromBool(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"virtual"));
		return value;
	}
	,get_contentLayoutName: function() {
		return haxe_ui_util_Variant.toString(this.behaviours.get("contentLayoutName"));
	}
	,set_contentLayoutName: function(value) {
		var _g = Type.typeof(value);
		if(_g._hx_index == 6) {
			if(_g.c == String) {
				if(value != null && value.indexOf("{{") != -1 && value.indexOf("}}") != -1) {
					haxe_ui_locale_LocaleManager.get_instance().registerComponent(this,"contentLayoutName",null,value);
					return value;
				}
			}
		}
		this.behaviours.set("contentLayoutName",haxe_ui_util_Variant.fromString(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"contentLayoutName"));
		return value;
	}
	,get_contentWidth: function() {
		return haxe_ui_util_Variant.toFloat(this.behaviours.get("contentWidth"));
	}
	,set_contentWidth: function(value) {
		this.behaviours.set("contentWidth",haxe_ui_util_Variant.fromFloat(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"contentWidth"));
		return value;
	}
	,get_percentContentWidth: function() {
		return haxe_ui_util_Variant.toFloat(this.behaviours.get("percentContentWidth"));
	}
	,set_percentContentWidth: function(value) {
		this.behaviours.set("percentContentWidth",haxe_ui_util_Variant.fromFloat(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"percentContentWidth"));
		return value;
	}
	,get_contentHeight: function() {
		return haxe_ui_util_Variant.toFloat(this.behaviours.get("contentHeight"));
	}
	,set_contentHeight: function(value) {
		this.behaviours.set("contentHeight",haxe_ui_util_Variant.fromFloat(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"contentHeight"));
		return value;
	}
	,get_percentContentHeight: function() {
		return haxe_ui_util_Variant.toFloat(this.behaviours.get("percentContentHeight"));
	}
	,set_percentContentHeight: function(value) {
		this.behaviours.set("percentContentHeight",haxe_ui_util_Variant.fromFloat(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"percentContentHeight"));
		return value;
	}
	,get_hscrollPos: function() {
		return haxe_ui_util_Variant.toFloat(this.behaviours.get("hscrollPos"));
	}
	,set_hscrollPos: function(value) {
		this.behaviours.set("hscrollPos",haxe_ui_util_Variant.fromFloat(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"hscrollPos"));
		return value;
	}
	,get_hscrollMax: function() {
		return haxe_ui_util_Variant.toFloat(this.behaviours.get("hscrollMax"));
	}
	,set_hscrollMax: function(value) {
		this.behaviours.set("hscrollMax",haxe_ui_util_Variant.fromFloat(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"hscrollMax"));
		return value;
	}
	,get_hscrollPageSize: function() {
		return haxe_ui_util_Variant.toFloat(this.behaviours.get("hscrollPageSize"));
	}
	,set_hscrollPageSize: function(value) {
		this.behaviours.set("hscrollPageSize",haxe_ui_util_Variant.fromFloat(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"hscrollPageSize"));
		return value;
	}
	,get_vscrollPos: function() {
		return haxe_ui_util_Variant.toFloat(this.behaviours.get("vscrollPos"));
	}
	,set_vscrollPos: function(value) {
		this.behaviours.set("vscrollPos",haxe_ui_util_Variant.fromFloat(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"vscrollPos"));
		return value;
	}
	,get_vscrollMax: function() {
		return haxe_ui_util_Variant.toFloat(this.behaviours.get("vscrollMax"));
	}
	,set_vscrollMax: function(value) {
		this.behaviours.set("vscrollMax",haxe_ui_util_Variant.fromFloat(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"vscrollMax"));
		return value;
	}
	,get_vscrollPageSize: function() {
		return haxe_ui_util_Variant.toFloat(this.behaviours.get("vscrollPageSize"));
	}
	,set_vscrollPageSize: function(value) {
		this.behaviours.set("vscrollPageSize",haxe_ui_util_Variant.fromFloat(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"vscrollPageSize"));
		return value;
	}
	,get_scrollMode: function() {
		return haxe_ui_util_Variant.toString(this.behaviours.get("scrollMode"));
	}
	,set_scrollMode: function(value) {
		this.behaviours.set("scrollMode",haxe_ui_util_Variant.fromString(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"scrollMode"));
		return value;
	}
	,get_contents: function() {
		return haxe_ui_util_Variant.toComponent(this.behaviours.get("contents"));
	}
	,set_contents: function(value) {
		this.behaviours.set("contents",haxe_ui_util_Variant.fromComponent(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"contents"));
		return value;
	}
	,get_autoHideScrolls: function() {
		return haxe_ui_util_Variant.toBool(this.behaviours.get("autoHideScrolls"));
	}
	,set_autoHideScrolls: function(value) {
		this.behaviours.set("autoHideScrolls",haxe_ui_util_Variant.fromBool(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"autoHideScrolls"));
		return value;
	}
	,cloneComponent: function() {
		var c = haxe_ui_core_InteractiveComponent.prototype.cloneComponent.call(this);
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_containers_ScrollView();
	}
	,registerComposite: function() {
		haxe_ui_core_InteractiveComponent.prototype.registerComposite.call(this);
		this._internalEventsClass = haxe_ui_containers_ScrollViewEvents;
		this._compositeBuilderClass = haxe_ui_containers_ScrollViewBuilder;
		this._defaultLayoutClass = haxe_ui_layouts_ScrollViewLayout;
	}
	,__class__: haxe_ui_containers_ScrollView
	,__properties__: $extend(haxe_ui_core_InteractiveComponent.prototype.__properties__,{set_autoHideScrolls:"set_autoHideScrolls",get_autoHideScrolls:"get_autoHideScrolls",set_contents:"set_contents",get_contents:"get_contents",set_scrollMode:"set_scrollMode",get_scrollMode:"get_scrollMode",set_vscrollPageSize:"set_vscrollPageSize",get_vscrollPageSize:"get_vscrollPageSize",set_vscrollMax:"set_vscrollMax",get_vscrollMax:"get_vscrollMax",set_vscrollPos:"set_vscrollPos",get_vscrollPos:"get_vscrollPos",set_hscrollPageSize:"set_hscrollPageSize",get_hscrollPageSize:"get_hscrollPageSize",set_hscrollMax:"set_hscrollMax",get_hscrollMax:"get_hscrollMax",set_hscrollPos:"set_hscrollPos",get_hscrollPos:"get_hscrollPos",set_percentContentHeight:"set_percentContentHeight",get_percentContentHeight:"get_percentContentHeight",set_contentHeight:"set_contentHeight",get_contentHeight:"get_contentHeight",set_percentContentWidth:"set_percentContentWidth",get_percentContentWidth:"get_percentContentWidth",set_contentWidth:"set_contentWidth",get_contentWidth:"get_contentWidth",set_contentLayoutName:"set_contentLayoutName",get_contentLayoutName:"get_contentLayoutName",set_virtual:"set_virtual",get_virtual:"get_virtual"})
});
var haxe_ui_containers__$ScrollView_Virtual = function(component) {
	haxe_ui_behaviours_DefaultBehaviour.call(this,component);
};
$hxClasses["haxe.ui.containers._ScrollView.Virtual"] = haxe_ui_containers__$ScrollView_Virtual;
haxe_ui_containers__$ScrollView_Virtual.__name__ = "haxe.ui.containers._ScrollView.Virtual";
haxe_ui_containers__$ScrollView_Virtual.__super__ = haxe_ui_behaviours_DefaultBehaviour;
haxe_ui_containers__$ScrollView_Virtual.prototype = $extend(haxe_ui_behaviours_DefaultBehaviour.prototype,{
	set: function(value) {
		haxe_ui_behaviours_DefaultBehaviour.prototype.set.call(this,value);
		if(this._component._compositeBuilder != null) {
			(js_Boot.__cast(this._component._compositeBuilder , haxe_ui_containers_ScrollViewBuilder)).onVirtualChanged();
		}
	}
	,__class__: haxe_ui_containers__$ScrollView_Virtual
});
var haxe_ui_containers__$ScrollView_ContentLayoutName = function(component) {
	haxe_ui_behaviours_DefaultBehaviour.call(this,component);
};
$hxClasses["haxe.ui.containers._ScrollView.ContentLayoutName"] = haxe_ui_containers__$ScrollView_ContentLayoutName;
haxe_ui_containers__$ScrollView_ContentLayoutName.__name__ = "haxe.ui.containers._ScrollView.ContentLayoutName";
haxe_ui_containers__$ScrollView_ContentLayoutName.__super__ = haxe_ui_behaviours_DefaultBehaviour;
haxe_ui_containers__$ScrollView_ContentLayoutName.prototype = $extend(haxe_ui_behaviours_DefaultBehaviour.prototype,{
	set: function(value) {
		haxe_ui_behaviours_DefaultBehaviour.prototype.set.call(this,value);
		var builder = js_Boot.__cast(this._component._compositeBuilder , haxe_ui_containers_ScrollViewBuilder);
		if(builder != null && haxe_ui_util_Variant.fromString(builder._contentsLayoutName) != value) {
			builder._contentsLayoutName = haxe_ui_util_Variant.toString(value);
			builder._contents.set_layout(haxe_ui_layouts_LayoutFactory.createFromName(haxe_ui_util_Variant.toString(value)));
		}
	}
	,__class__: haxe_ui_containers__$ScrollView_ContentLayoutName
});
var haxe_ui_containers__$ScrollView_ContentWidth = function(component) {
	haxe_ui_behaviours_Behaviour.call(this,component);
};
$hxClasses["haxe.ui.containers._ScrollView.ContentWidth"] = haxe_ui_containers__$ScrollView_ContentWidth;
haxe_ui_containers__$ScrollView_ContentWidth.__name__ = "haxe.ui.containers._ScrollView.ContentWidth";
haxe_ui_containers__$ScrollView_ContentWidth.__super__ = haxe_ui_behaviours_Behaviour;
haxe_ui_containers__$ScrollView_ContentWidth.prototype = $extend(haxe_ui_behaviours_Behaviour.prototype,{
	get: function() {
		var contents = this._component.findComponent("scrollview-contents",null,false,"css");
		if(contents == null) {
			return null;
		}
		return haxe_ui_util_Variant.fromFloat(contents.get_width());
	}
	,set: function(value) {
		var contents = this._component.findComponent("scrollview-contents",null,false,"css");
		if(contents != null) {
			contents.set_percentWidth(null);
			contents.set_width(haxe_ui_util_Variant.toFloat(value));
		}
	}
	,__class__: haxe_ui_containers__$ScrollView_ContentWidth
});
var haxe_ui_containers__$ScrollView_PercentContentWidth = function(component) {
	haxe_ui_behaviours_Behaviour.call(this,component);
};
$hxClasses["haxe.ui.containers._ScrollView.PercentContentWidth"] = haxe_ui_containers__$ScrollView_PercentContentWidth;
haxe_ui_containers__$ScrollView_PercentContentWidth.__name__ = "haxe.ui.containers._ScrollView.PercentContentWidth";
haxe_ui_containers__$ScrollView_PercentContentWidth.__super__ = haxe_ui_behaviours_Behaviour;
haxe_ui_containers__$ScrollView_PercentContentWidth.prototype = $extend(haxe_ui_behaviours_Behaviour.prototype,{
	get: function() {
		var contents = this._component.findComponent("scrollview-contents",null,false,"css");
		if(contents == null) {
			return null;
		}
		return haxe_ui_util_Variant.fromFloat(contents.get_percentWidth());
	}
	,set: function(value) {
		var contents = this._component.findComponent("scrollview-contents",null,false,"css");
		if(contents != null) {
			contents.set_componentWidth(null);
			contents.set_percentWidth(haxe_ui_util_Variant.toFloat(value));
		}
	}
	,__class__: haxe_ui_containers__$ScrollView_PercentContentWidth
});
var haxe_ui_containers__$ScrollView_ContentHeight = function(component) {
	haxe_ui_behaviours_Behaviour.call(this,component);
};
$hxClasses["haxe.ui.containers._ScrollView.ContentHeight"] = haxe_ui_containers__$ScrollView_ContentHeight;
haxe_ui_containers__$ScrollView_ContentHeight.__name__ = "haxe.ui.containers._ScrollView.ContentHeight";
haxe_ui_containers__$ScrollView_ContentHeight.__super__ = haxe_ui_behaviours_Behaviour;
haxe_ui_containers__$ScrollView_ContentHeight.prototype = $extend(haxe_ui_behaviours_Behaviour.prototype,{
	get: function() {
		var contents = this._component.findComponent("scrollview-contents",null,false,"css");
		if(contents == null) {
			return null;
		}
		return haxe_ui_util_Variant.fromFloat(contents.get_height());
	}
	,set: function(value) {
		var contents = this._component.findComponent("scrollview-contents",null,false,"css");
		if(contents != null) {
			contents.set_percentHeight(null);
			contents.set_height(haxe_ui_util_Variant.toFloat(value));
		}
	}
	,__class__: haxe_ui_containers__$ScrollView_ContentHeight
});
var haxe_ui_containers__$ScrollView_PercentContentHeight = function(component) {
	haxe_ui_behaviours_Behaviour.call(this,component);
};
$hxClasses["haxe.ui.containers._ScrollView.PercentContentHeight"] = haxe_ui_containers__$ScrollView_PercentContentHeight;
haxe_ui_containers__$ScrollView_PercentContentHeight.__name__ = "haxe.ui.containers._ScrollView.PercentContentHeight";
haxe_ui_containers__$ScrollView_PercentContentHeight.__super__ = haxe_ui_behaviours_Behaviour;
haxe_ui_containers__$ScrollView_PercentContentHeight.prototype = $extend(haxe_ui_behaviours_Behaviour.prototype,{
	get: function() {
		var contents = this._component.findComponent("scrollview-contents",null,false,"css");
		if(contents == null) {
			return null;
		}
		return haxe_ui_util_Variant.fromFloat(contents.get_percentHeight());
	}
	,set: function(value) {
		var contents = this._component.findComponent("scrollview-contents",null,false,"css");
		if(contents != null) {
			contents.set_componentHeight(null);
			contents.set_percentHeight(haxe_ui_util_Variant.toFloat(value));
		}
	}
	,__class__: haxe_ui_containers__$ScrollView_PercentContentHeight
});
var haxe_ui_containers__$ScrollView_HScrollPos = function(scrollview) {
	haxe_ui_behaviours_DataBehaviour.call(this,scrollview);
	this._scrollview = scrollview;
};
$hxClasses["haxe.ui.containers._ScrollView.HScrollPos"] = haxe_ui_containers__$ScrollView_HScrollPos;
haxe_ui_containers__$ScrollView_HScrollPos.__name__ = "haxe.ui.containers._ScrollView.HScrollPos";
haxe_ui_containers__$ScrollView_HScrollPos.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_containers__$ScrollView_HScrollPos.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	_scrollview: null
	,get: function() {
		var hscroll = this._scrollview.findComponent(null,haxe_ui_components_HorizontalScroll,false);
		if(hscroll == null) {
			return haxe_ui_util_Variant.fromInt(0);
		}
		return haxe_ui_util_Variant.fromFloat(hscroll.get_pos());
	}
	,validateData: function() {
		var hscroll = this._scrollview.findComponent(null,haxe_ui_components_HorizontalScroll,false);
		if(this._scrollview.get_virtual() == true) {
			if(hscroll == null) {
				hscroll = (js_Boot.__cast(this._scrollview._compositeBuilder , haxe_ui_containers_ScrollViewBuilder)).createHScroll();
			}
			if(hscroll != null) {
				hscroll.set_pos(haxe_ui_util_Variant.toFloat(this._value));
			}
		} else if(hscroll != null) {
			hscroll.set_pos(haxe_ui_util_Variant.toFloat(this._value));
		}
	}
	,__class__: haxe_ui_containers__$ScrollView_HScrollPos
});
var haxe_ui_containers__$ScrollView_VScrollPos = function(scrollview) {
	haxe_ui_behaviours_DataBehaviour.call(this,scrollview);
	this._scrollview = scrollview;
};
$hxClasses["haxe.ui.containers._ScrollView.VScrollPos"] = haxe_ui_containers__$ScrollView_VScrollPos;
haxe_ui_containers__$ScrollView_VScrollPos.__name__ = "haxe.ui.containers._ScrollView.VScrollPos";
haxe_ui_containers__$ScrollView_VScrollPos.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_containers__$ScrollView_VScrollPos.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	_scrollview: null
	,get: function() {
		var vscroll = this._scrollview.findComponent(null,haxe_ui_components_VerticalScroll,false);
		if(vscroll == null) {
			return haxe_ui_util_Variant.fromInt(0);
		}
		return haxe_ui_util_Variant.fromFloat(vscroll.get_pos());
	}
	,validateData: function() {
		var vscroll = this._scrollview.findComponent(null,haxe_ui_components_VerticalScroll,false);
		if(this._scrollview.get_virtual() == true) {
			if(vscroll == null) {
				vscroll = (js_Boot.__cast(this._scrollview._compositeBuilder , haxe_ui_containers_ScrollViewBuilder)).createVScroll();
			}
			if(vscroll != null) {
				vscroll.set_pos(haxe_ui_util_Variant.toFloat(this._value));
			}
		} else if(vscroll != null) {
			vscroll.set_pos(haxe_ui_util_Variant.toFloat(this._value));
		}
	}
	,__class__: haxe_ui_containers__$ScrollView_VScrollPos
});
var haxe_ui_containers__$ScrollView_HScrollMax = function(scrollview) {
	haxe_ui_behaviours_DataBehaviour.call(this,scrollview);
	this._scrollview = scrollview;
};
$hxClasses["haxe.ui.containers._ScrollView.HScrollMax"] = haxe_ui_containers__$ScrollView_HScrollMax;
haxe_ui_containers__$ScrollView_HScrollMax.__name__ = "haxe.ui.containers._ScrollView.HScrollMax";
haxe_ui_containers__$ScrollView_HScrollMax.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_containers__$ScrollView_HScrollMax.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	_scrollview: null
	,get: function() {
		var hscroll = this._scrollview.findComponent(null,haxe_ui_components_HorizontalScroll,false);
		if(hscroll == null) {
			return haxe_ui_util_Variant.fromInt(0);
		}
		return haxe_ui_util_Variant.fromFloat(hscroll.get_max());
	}
	,validateData: function() {
		if(this._scrollview.get_virtual() == true) {
			var hscroll = this._scrollview.findComponent(null,haxe_ui_components_HorizontalScroll,false);
			if(haxe_ui_util_Variant.gt(this._value,haxe_ui_util_Variant.fromInt(0))) {
				if(hscroll == null) {
					hscroll = (js_Boot.__cast(this._scrollview._compositeBuilder , haxe_ui_containers_ScrollViewBuilder)).createHScroll();
				}
			} else if(hscroll != null) {
				(js_Boot.__cast(this._scrollview._compositeBuilder , haxe_ui_containers_ScrollViewBuilder)).destroyHScroll();
			}
			if(hscroll != null) {
				hscroll.set_max(haxe_ui_util_Variant.toFloat(this._value));
			}
		}
	}
	,__class__: haxe_ui_containers__$ScrollView_HScrollMax
});
var haxe_ui_containers__$ScrollView_VScrollMax = function(scrollview) {
	haxe_ui_behaviours_DataBehaviour.call(this,scrollview);
	this._scrollview = scrollview;
};
$hxClasses["haxe.ui.containers._ScrollView.VScrollMax"] = haxe_ui_containers__$ScrollView_VScrollMax;
haxe_ui_containers__$ScrollView_VScrollMax.__name__ = "haxe.ui.containers._ScrollView.VScrollMax";
haxe_ui_containers__$ScrollView_VScrollMax.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_containers__$ScrollView_VScrollMax.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	_scrollview: null
	,get: function() {
		var vscroll = this._scrollview.findComponent(null,haxe_ui_components_VerticalScroll,false);
		if(vscroll == null) {
			return haxe_ui_util_Variant.fromInt(0);
		}
		return haxe_ui_util_Variant.fromFloat(vscroll.get_max());
	}
	,validateData: function() {
		if(this._scrollview.get_virtual() == true) {
			var vscroll = this._scrollview.findComponent(null,haxe_ui_components_VerticalScroll,false);
			if(haxe_ui_util_Variant.gt(this._value,haxe_ui_util_Variant.fromInt(0))) {
				if(vscroll == null) {
					vscroll = (js_Boot.__cast(this._scrollview._compositeBuilder , haxe_ui_containers_ScrollViewBuilder)).createVScroll();
				}
			} else if(vscroll != null) {
				(js_Boot.__cast(this._scrollview._compositeBuilder , haxe_ui_containers_ScrollViewBuilder)).destroyVScroll();
			}
			if(vscroll != null) {
				vscroll.set_max(haxe_ui_util_Variant.toFloat(this._value));
			}
		}
	}
	,__class__: haxe_ui_containers__$ScrollView_VScrollMax
});
var haxe_ui_containers__$ScrollView_HScrollPageSize = function(scrollview) {
	haxe_ui_behaviours_DataBehaviour.call(this,scrollview);
	this._scrollview = scrollview;
};
$hxClasses["haxe.ui.containers._ScrollView.HScrollPageSize"] = haxe_ui_containers__$ScrollView_HScrollPageSize;
haxe_ui_containers__$ScrollView_HScrollPageSize.__name__ = "haxe.ui.containers._ScrollView.HScrollPageSize";
haxe_ui_containers__$ScrollView_HScrollPageSize.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_containers__$ScrollView_HScrollPageSize.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	_scrollview: null
	,validateData: function() {
		if(this._scrollview.get_virtual() == true) {
			var hscroll = this._scrollview.findComponent(null,haxe_ui_components_HorizontalScroll,false);
			if(hscroll == null) {
				hscroll = (js_Boot.__cast(this._scrollview._compositeBuilder , haxe_ui_containers_ScrollViewBuilder)).createHScroll();
			}
			if(hscroll != null) {
				hscroll.set_pageSize(haxe_ui_util_Variant.toFloat(this._value));
			}
		}
	}
	,__class__: haxe_ui_containers__$ScrollView_HScrollPageSize
});
var haxe_ui_containers__$ScrollView_VScrollPageSize = function(scrollview) {
	haxe_ui_behaviours_DataBehaviour.call(this,scrollview);
	this._scrollview = scrollview;
};
$hxClasses["haxe.ui.containers._ScrollView.VScrollPageSize"] = haxe_ui_containers__$ScrollView_VScrollPageSize;
haxe_ui_containers__$ScrollView_VScrollPageSize.__name__ = "haxe.ui.containers._ScrollView.VScrollPageSize";
haxe_ui_containers__$ScrollView_VScrollPageSize.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_containers__$ScrollView_VScrollPageSize.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	_scrollview: null
	,validateData: function() {
		if(this._scrollview.get_virtual() == true) {
			var vscroll = this._scrollview.findComponent(null,haxe_ui_components_VerticalScroll,false);
			if(vscroll == null) {
				vscroll = (js_Boot.__cast(this._scrollview._compositeBuilder , haxe_ui_containers_ScrollViewBuilder)).createVScroll();
			}
			if(vscroll != null) {
				vscroll.set_pageSize(haxe_ui_util_Variant.toFloat(this._value));
			}
		}
	}
	,__class__: haxe_ui_containers__$ScrollView_VScrollPageSize
});
var haxe_ui_containers__$ScrollView_ScrollModeBehaviour = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.containers._ScrollView.ScrollModeBehaviour"] = haxe_ui_containers__$ScrollView_ScrollModeBehaviour;
haxe_ui_containers__$ScrollView_ScrollModeBehaviour.__name__ = "haxe.ui.containers._ScrollView.ScrollModeBehaviour";
haxe_ui_containers__$ScrollView_ScrollModeBehaviour.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_containers__$ScrollView_ScrollModeBehaviour.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	validateData: function() {
		this._component.registerInternalEvents(null,true);
	}
	,__class__: haxe_ui_containers__$ScrollView_ScrollModeBehaviour
});
var haxe_ui_containers__$ScrollView_GetContents = function(component) {
	haxe_ui_behaviours_DefaultBehaviour.call(this,component);
};
$hxClasses["haxe.ui.containers._ScrollView.GetContents"] = haxe_ui_containers__$ScrollView_GetContents;
haxe_ui_containers__$ScrollView_GetContents.__name__ = "haxe.ui.containers._ScrollView.GetContents";
haxe_ui_containers__$ScrollView_GetContents.__super__ = haxe_ui_behaviours_DefaultBehaviour;
haxe_ui_containers__$ScrollView_GetContents.prototype = $extend(haxe_ui_behaviours_DefaultBehaviour.prototype,{
	get: function() {
		var contents = this._component.findComponent("scrollview-contents",null,false,"css");
		return haxe_ui_util_Variant.fromComponent(contents);
	}
	,__class__: haxe_ui_containers__$ScrollView_GetContents
});
var haxe_ui_containers_ScrollViewEvents = function(scrollview) {
	this._fadeTimer = null;
	this._containerEventsPaused = false;
	this._lastMousePos = null;
	this._movementThreshold = 3;
	this._inertia = null;
	haxe_ui_events_Events.call(this,scrollview);
	this._scrollview = scrollview;
};
$hxClasses["haxe.ui.containers.ScrollViewEvents"] = haxe_ui_containers_ScrollViewEvents;
haxe_ui_containers_ScrollViewEvents.__name__ = "haxe.ui.containers.ScrollViewEvents";
haxe_ui_containers_ScrollViewEvents.__super__ = haxe_ui_events_Events;
haxe_ui_containers_ScrollViewEvents.prototype = $extend(haxe_ui_events_Events.prototype,{
	_scrollview: null
	,register: function() {
		var contents = this._scrollview.findComponent("scrollview-contents",null,false,"css");
		if(contents != null && contents.hasEvent("resize",$bind(this,this.onContentsResized)) == false) {
			contents.registerEvent("resize",$bind(this,this.onContentsResized));
		}
		var hscroll = this._scrollview.findComponent(null,haxe_ui_components_HorizontalScroll,false);
		if(hscroll != null && hscroll.hasEvent("change",$bind(this,this.onHScroll)) == false) {
			hscroll.registerEvent("change",$bind(this,this.onHScroll));
		}
		var vscroll = this._scrollview.findComponent(null,haxe_ui_components_VerticalScroll,false);
		if(vscroll != null && vscroll.hasEvent("change",$bind(this,this.onVScroll)) == false) {
			vscroll.registerEvent("change",$bind(this,this.onVScroll));
		}
		if(this._scrollview.get_scrollMode() == "drag" || this._scrollview.get_scrollMode() == "inertial") {
			this.registerEvent("mousedown",$bind(this,this.onMouseDown));
		} else if(this.hasEvent("mousedown",$bind(this,this.onMouseDown)) == false) {
			this.unregisterEvent("mousedown",$bind(this,this.onMouseDown));
		}
		if(this._scrollview.hasEvent("shown") == false) {
			this.registerEvent("shown",$bind(this,this.onShown));
		}
		this.registerEvent("mousewheel",$bind(this,this.onMouseWheel));
	}
	,unregister: function() {
		var contents = this._scrollview.findComponent("scrollview-contents",null,false,"css");
		if(contents != null) {
			contents.unregisterEvent("resize",$bind(this,this.onContentsResized));
		}
		var hscroll = this._scrollview.findComponent(null,haxe_ui_components_HorizontalScroll,false);
		if(hscroll != null) {
			hscroll.unregisterEvent("change",$bind(this,this.onHScroll));
		}
		var vscroll = this._scrollview.findComponent(null,haxe_ui_components_VerticalScroll,false);
		if(vscroll != null) {
			vscroll.unregisterEvent("change",$bind(this,this.onVScroll));
		}
		this.unregisterEvent("mousedown",$bind(this,this.onMouseDown));
		this.unregisterEvent("mousewheel",$bind(this,this.onMouseWheel));
		this.unregisterEvent("shown",$bind(this,this.onShown));
	}
	,onShown: function(event) {
		var _this = this._scrollview;
		if(!(_this._layout == null || _this._layoutLocked == true)) {
			_this.invalidateComponent("layout",false);
		}
		var hscroll = this._scrollview.findComponent(null,haxe_ui_components_HorizontalScroll,false);
		if(hscroll != null) {
			if(!(hscroll._layout == null || hscroll._layoutLocked == true)) {
				hscroll.invalidateComponent("layout",false);
			}
		}
		var vscroll = this._scrollview.findComponent(null,haxe_ui_components_VerticalScroll,false);
		if(vscroll != null) {
			if(!(vscroll._layout == null || vscroll._layoutLocked == true)) {
				vscroll.invalidateComponent("layout",false);
			}
		}
	}
	,onContentsResized: function(event) {
		this._scrollview.invalidateComponent("scroll");
	}
	,onHScroll: function(event) {
		this._scrollview.invalidateComponent("scroll");
		this._target.dispatch(new haxe_ui_events_ScrollEvent("scrollchange"));
	}
	,onVScroll: function(event) {
		this._scrollview.invalidateComponent("scroll");
		this._target.dispatch(new haxe_ui_events_ScrollEvent("scrollchange"));
	}
	,_offset: null
	,_inertia: null
	,onMouseDown: function(event) {
		var hscroll = this._scrollview.findComponent(null,haxe_ui_components_HorizontalScroll,false);
		var vscroll = this._scrollview.findComponent(null,haxe_ui_components_VerticalScroll,false);
		if(hscroll == null && vscroll == null) {
			return;
		}
		this._scrollview.addClass(":down");
		this._lastMousePos = new haxe_ui_geom_Point(event.screenX,event.screenY);
		var componentOffset = this._scrollview.getComponentOffset();
		if(hscroll != null && hscroll.hitTest(event.screenX - componentOffset.x,event.screenY - componentOffset.y) == true) {
			return;
		}
		if(vscroll != null && vscroll.hitTest(event.screenX - componentOffset.x,event.screenY - componentOffset.y) == true) {
			return;
		}
		var under = this._scrollview.findComponentsUnderPoint(event.screenX - componentOffset.x,event.screenY - componentOffset.y);
		var _g = 0;
		while(_g < under.length) {
			var c = under[_g];
			++_g;
			if(((c) instanceof haxe_ui_components_TextField)) {
				return;
			}
		}
		this._offset = new haxe_ui_geom_Point();
		if(hscroll != null) {
			var tmp = hscroll.get_pos();
			this._offset.x = tmp + event.screenX;
		}
		if(vscroll != null) {
			var tmp = vscroll.get_pos();
			this._offset.y = tmp + event.screenY;
		}
		if(this._scrollview.get_scrollMode() == "inertial") {
			if(this._inertia == null) {
				this._inertia = { screen : new haxe_ui_geom_Point(), target : new haxe_ui_geom_Point(), amplitude : new haxe_ui_geom_Point(), direction : new haxe_ui_geom_Point(), timestamp : 0};
			}
			this._inertia.target.x = this._scrollview.get_hscrollPos();
			this._inertia.target.y = this._scrollview.get_vscrollPos();
			this._inertia.amplitude.x = 0;
			this._inertia.amplitude.y = 0;
			this._inertia.screen.x = event.screenX;
			this._inertia.screen.y = event.screenY;
			this._inertia.timestamp = HxOverrides.now() / 1000;
		}
		haxe_ui_core_Screen.get_instance().registerEvent("mousemove",$bind(this,this.onMouseMove));
		haxe_ui_core_Screen.get_instance().registerEvent("mouseup",$bind(this,this.onMouseUp));
	}
	,_movementThreshold: null
	,_lastMousePos: null
	,onMouseMove: function(event) {
		var hscroll = this._scrollview.findComponent(null,haxe_ui_components_HorizontalScroll,false);
		if(hscroll != null) {
			hscroll.set_pos(this._offset.x - event.screenX);
			var distX = Math.abs(event.screenX - this._lastMousePos.x);
			if(distX > haxe_ui_Toolkit.get_scaleX()) {
				this.pauseContainerEvents();
			}
		}
		var vscroll = this._scrollview.findComponent(null,haxe_ui_components_VerticalScroll,false);
		if(vscroll != null) {
			vscroll.set_pos(this._offset.y - event.screenY);
			var distY = Math.abs(event.screenY - this._lastMousePos.y);
			if(distY > haxe_ui_Toolkit.get_scaleY()) {
				this.pauseContainerEvents();
			}
		}
		this._lastMousePos = new haxe_ui_geom_Point(event.screenX,event.screenY);
	}
	,_containerEventsPaused: null
	,pauseContainerEvents: function() {
		if(this._containerEventsPaused == true) {
			return;
		}
		this._containerEventsPaused = true;
		this.onContainerEventsStatusChanged();
	}
	,resumeContainerEvents: function() {
		if(this._containerEventsPaused == false) {
			return;
		}
		this._containerEventsPaused = false;
		this.onContainerEventsStatusChanged();
	}
	,onContainerEventsStatusChanged: function() {
		this._scrollview.findComponent("scrollview-contents",haxe_ui_core_Component,true,"css").disableInteractivity(this._containerEventsPaused);
		if(this._containerEventsPaused == true) {
			this._scrollview.findComponent("scrollview-contents",haxe_ui_core_Component,true,"css").removeClass(":hover",true,true);
		}
		var hscroll = this._scrollview.findComponent(null,haxe_ui_components_HorizontalScroll,false);
		var vscroll = this._scrollview.findComponent(null,haxe_ui_components_VerticalScroll,false);
		if(hscroll != null || vscroll != null) {
			if(this._scrollview.get_autoHideScrolls() == true) {
				if(this._containerEventsPaused == true) {
					if(hscroll != null) {
						hscroll.fadeIn();
					}
					if(vscroll != null) {
						vscroll.fadeIn();
					}
				} else {
					if(hscroll != null) {
						hscroll.fadeOut();
					}
					if(vscroll != null) {
						vscroll.fadeOut();
					}
				}
			}
		}
	}
	,onMouseUp: function(event) {
		haxe_ui_core_Screen.get_instance().unregisterEvent("mousemove",$bind(this,this.onMouseMove));
		haxe_ui_core_Screen.get_instance().unregisterEvent("mouseup",$bind(this,this.onMouseUp));
		if(this._scrollview.get_scrollMode() == "inertial") {
			var now = HxOverrides.now() / 1000;
			var elapsed = (now - this._inertia.timestamp) * 1000;
			var deltaX = Math.abs(this._inertia.screen.x - event.screenX);
			var deltaY = Math.abs(this._inertia.screen.y - event.screenY);
			this._inertia.direction.x = this._inertia.screen.x - event.screenX < 0 ? 0 : 1;
			var velocityX = deltaX / elapsed;
			var v = 1000 * deltaX / (1 + elapsed);
			velocityX = 0.8 * v + 0.2 * velocityX;
			this._inertia.direction.y = this._inertia.screen.y - event.screenY < 0 ? 0 : 1;
			var velocityY = deltaY / elapsed;
			var v = 1000 * deltaY / (1 + elapsed);
			velocityY = 0.8 * v + 0.2 * velocityY;
			if(velocityX <= 75 && velocityY <= 75) {
				this.dispatch(new haxe_ui_events_ScrollEvent("scrollstop"));
				haxe_ui_Toolkit.callLater($bind(this,this.resumeContainerEvents));
				return;
			}
			this._inertia.timestamp = HxOverrides.now() / 1000;
			var hscroll = this._scrollview.findComponent(null,haxe_ui_components_HorizontalScroll,false);
			if(hscroll != null) {
				this._inertia.amplitude.x = 0.8 * velocityX;
			}
			if(this._inertia.direction.x == 0) {
				var tmp = this._scrollview.get_hscrollPos() - this._inertia.amplitude.x;
				this._inertia.target.x = Math.round(tmp);
			} else {
				var tmp = this._scrollview.get_hscrollPos() + this._inertia.amplitude.x;
				this._inertia.target.x = Math.round(tmp);
			}
			var vscroll = this._scrollview.findComponent(null,haxe_ui_components_VerticalScroll,false);
			if(vscroll != null) {
				this._inertia.amplitude.y = 0.8 * velocityY;
			}
			if(this._inertia.direction.y == 0) {
				var tmp = this._scrollview.get_vscrollPos() - this._inertia.amplitude.y;
				this._inertia.target.y = Math.round(tmp);
			} else {
				var tmp = this._scrollview.get_vscrollPos() + this._inertia.amplitude.y;
				this._inertia.target.y = Math.round(tmp);
			}
			if(this._scrollview.get_hscrollPos() == this._inertia.target.x && this._scrollview.get_vscrollPos() == this._inertia.target.y) {
				this.dispatch(new haxe_ui_events_ScrollEvent("scrollstop"));
				haxe_ui_Toolkit.callLater($bind(this,this.resumeContainerEvents));
				return;
			}
			if(this._scrollview.get_hscrollPos() == this._inertia.target.x) {
				this._inertia.amplitude.x = 0;
			}
			if(this._scrollview.get_vscrollPos() == this._inertia.target.y) {
				this._inertia.amplitude.y = 0;
			}
			haxe_ui_Toolkit.callLater($bind(this,this.inertialScroll));
		} else {
			this._scrollview.removeClass(":down");
			this.dispatch(new haxe_ui_events_ScrollEvent("scrollstop"));
			haxe_ui_Toolkit.callLater($bind(this,this.resumeContainerEvents));
		}
	}
	,inertialScroll: function() {
		var elapsed = (HxOverrides.now() / 1000 - this._inertia.timestamp) * 1000;
		var finishedX = false;
		if(this._inertia.amplitude.x != 0) {
			var deltaX = -this._inertia.amplitude.x * Math.exp(-elapsed / 325);
			if(deltaX > 0.5 || deltaX < -0.5) {
				var oldPos = this._scrollview.get_hscrollPos();
				var newPos = 0;
				if(this._inertia.direction.x == 0) {
					newPos = this._inertia.target.x - deltaX;
				} else {
					newPos = this._inertia.target.x + deltaX;
				}
				if(newPos < 0) {
					newPos = 0;
				} else if(newPos > this._scrollview.get_hscrollMax()) {
					newPos = this._scrollview.get_hscrollMax();
				}
				this._scrollview.set_hscrollPos(newPos);
				finishedX = newPos == oldPos || newPos == 0 || newPos == this._scrollview.get_hscrollMax();
			} else {
				finishedX = true;
			}
		} else {
			finishedX = true;
		}
		var finishedY = false;
		if(this._inertia.amplitude.y != 0) {
			var deltaY = -this._inertia.amplitude.y * Math.exp(-elapsed / 325);
			if(deltaY > 0.5 || deltaY < -0.5) {
				var oldPos = this._scrollview.get_vscrollPos();
				var newPos = 0;
				if(this._inertia.direction.y == 0) {
					newPos = this._inertia.target.y - deltaY;
				} else {
					newPos = this._inertia.target.y + deltaY;
				}
				if(newPos < 0) {
					newPos = 0;
				} else if(newPos > this._scrollview.get_vscrollMax()) {
					newPos = this._scrollview.get_vscrollMax();
				}
				this._scrollview.set_vscrollPos(newPos);
				finishedY = newPos == oldPos || newPos == 0 || newPos == this._scrollview.get_vscrollMax();
			} else {
				finishedY = true;
			}
		} else {
			finishedY = true;
		}
		if(finishedX == true && finishedY == true) {
			this.dispatch(new haxe_ui_events_ScrollEvent("scrollstop"));
			haxe_ui_Toolkit.callLater($bind(this,this.resumeContainerEvents));
		} else {
			haxe_ui_Toolkit.callLater($bind(this,this.inertialScroll));
		}
	}
	,_fadeTimer: null
	,onMouseWheel: function(event) {
		var _gthis = this;
		var vscroll = this._scrollview.findComponent(null,haxe_ui_components_VerticalScroll,false);
		if(vscroll != null) {
			if(this._scrollview.get_autoHideScrolls() == true && this._fadeTimer == null) {
				vscroll.fadeIn();
			}
			event.cancel();
			var amount = 50;
			if(event.delta > 0) {
				vscroll.set_pos(vscroll.get_pos() - amount);
			} else if(event.delta < 0) {
				vscroll.set_pos(vscroll.get_pos() + amount);
			}
			if(this._scrollview.get_autoHideScrolls() == true) {
				if(this._fadeTimer != null) {
					this._fadeTimer.stop();
					this._fadeTimer = null;
				}
				this._fadeTimer = new haxe_ui_util_Timer(300,function() {
					vscroll.fadeOut();
					_gthis._fadeTimer.stop();
					_gthis._fadeTimer = null;
				});
			}
		}
	}
	,actionStart: function(action) {
		switch(action) {
		case "actionDown":
			return true;
		case "actionUp":
			return true;
		default:
			return false;
		}
	}
	,actionEnd: function(action) {
		return false;
	}
	,__class__: haxe_ui_containers_ScrollViewEvents
});
var haxe_ui_containers_ScrollViewBuilder = function(scrollview) {
	haxe_ui_core_CompositeBuilder.call(this,scrollview);
	this._scrollview = scrollview;
};
$hxClasses["haxe.ui.containers.ScrollViewBuilder"] = haxe_ui_containers_ScrollViewBuilder;
haxe_ui_containers_ScrollViewBuilder.__name__ = "haxe.ui.containers.ScrollViewBuilder";
haxe_ui_containers_ScrollViewBuilder.__super__ = haxe_ui_core_CompositeBuilder;
haxe_ui_containers_ScrollViewBuilder.prototype = $extend(haxe_ui_core_CompositeBuilder.prototype,{
	_scrollview: null
	,_contents: null
	,_contentsLayoutName: null
	,create: function() {
		var contentLayoutName = this._scrollview.get_contentLayoutName();
		if(contentLayoutName == null) {
			contentLayoutName = "vertical";
		}
		this.createContentContainer(contentLayoutName);
	}
	,destroy: function() {
	}
	,get_numComponents: function() {
		return this._contents.get_numComponents();
	}
	,addComponent: function(child) {
		if(((child) instanceof haxe_ui_components_HorizontalScroll) == false && ((child) instanceof haxe_ui_components_VerticalScroll) == false && child.classes.indexOf("scrollview-contents") != -1 == false) {
			return this._contents.addComponent(child);
		}
		return null;
	}
	,addComponentAt: function(child,index) {
		if(((child) instanceof haxe_ui_components_HorizontalScroll) == false && ((child) instanceof haxe_ui_components_VerticalScroll) == false && child.classes.indexOf("scrollview-contents") != -1 == false) {
			return this._contents.addComponentAt(child,index);
		}
		return null;
	}
	,removeComponent: function(child,dispose,invalidate) {
		if(invalidate == null) {
			invalidate = true;
		}
		if(dispose == null) {
			dispose = true;
		}
		if(((child) instanceof haxe_ui_components_HorizontalScroll) == false && ((child) instanceof haxe_ui_components_VerticalScroll) == false && child.classes.indexOf("scrollview-contents") != -1 == false) {
			return this._contents.removeComponent(child,dispose,invalidate);
		}
		return null;
	}
	,removeComponentAt: function(index,dispose,invalidate) {
		if(invalidate == null) {
			invalidate = true;
		}
		if(dispose == null) {
			dispose = true;
		}
		return this._contents.removeComponentAt(index,dispose,invalidate);
	}
	,getComponentIndex: function(child) {
		return this._contents.getComponentIndex(child);
	}
	,setComponentIndex: function(child,index) {
		if(((child) instanceof haxe_ui_components_HorizontalScroll) == false && ((child) instanceof haxe_ui_components_VerticalScroll) == false && child.classes.indexOf("scrollview-contents") != -1 == false) {
			return this._contents.setComponentIndex(child,index);
		}
		return null;
	}
	,getComponentAt: function(index) {
		return this._contents.getComponentAt(index);
	}
	,createContentContainer: function(layoutName) {
		if(this._contents == null) {
			this._contents = new haxe_ui_containers_Box();
			this._contents.addClass("scrollview-contents");
			this._contents.set_id("scrollview-contents");
			this._contents.set_layout(haxe_ui_layouts_LayoutFactory.createFromName(layoutName));
			this._component.addComponent(this._contents);
			this._contentsLayoutName = layoutName;
		}
	}
	,horizontalConstraintModifier: function() {
		return 0;
	}
	,verticalConstraintModifier: function() {
		return 0;
	}
	,checkScrolls: function() {
		if(this._component.get_isNativeScroller() == true) {
			return;
		}
		var usableSize = this._component.get_layout().get_usableSize();
		if(this.get_virtualHorizontal() == false && usableSize.width > 0) {
			var horizontalConstraint = this._contents;
			var hscroll = this._component.findComponent(null,haxe_ui_components_HorizontalScroll,false);
			var vcw = horizontalConstraint.get_width() + this.horizontalConstraintModifier();
			if(vcw > usableSize.width) {
				if(hscroll == null) {
					hscroll = this.createHScroll();
				}
				hscroll.set_max(vcw - usableSize.width);
				hscroll.set_pageSize(usableSize.width / vcw * hscroll.get_max());
				hscroll.syncComponentValidation();
			} else if(hscroll != null) {
				this.destroyHScroll();
			}
		}
		if(this.get_virtualVertical() == false && usableSize.height > 0) {
			var verticalConstraint = this._contents;
			var vscroll = this._component.findComponent(null,haxe_ui_components_VerticalScroll,false);
			var vch = verticalConstraint.get_height() + this.verticalConstraintModifier();
			if(vch > usableSize.height) {
				if(vscroll == null) {
					vscroll = this.createVScroll();
				}
				vscroll.set_max(vch - usableSize.height);
				vscroll.set_pageSize(usableSize.height / vch * vscroll.get_max());
				vscroll.syncComponentValidation();
			} else if(vscroll != null) {
				this.destroyVScroll();
			}
		}
	}
	,createHScroll: function() {
		if(this._component.get_isNativeScroller() == true) {
			return null;
		}
		var usableSize = this._component.get_layout().get_usableSize();
		var horizontalConstraint = this._contents;
		var hscroll = this._component.findComponent(null,haxe_ui_components_HorizontalScroll,false);
		var vcw = horizontalConstraint.get_width() + this.horizontalConstraintModifier();
		if(usableSize.width <= 0) {
			return hscroll;
		}
		if(vcw > usableSize.width && hscroll == null) {
			hscroll = new haxe_ui_components_HorizontalScroll();
			hscroll.set_scriptAccess(false);
			hscroll.set_includeInLayout(!this._scrollview.get_autoHideScrolls());
			hscroll.set_hidden(this._scrollview.get_autoHideScrolls());
			hscroll.set_percentWidth(100);
			hscroll.set_allowFocus(false);
			hscroll.set_id("scrollview-hscroll");
			this._component.addComponent(hscroll);
			this._component.registerInternalEvents(null,true);
		}
		return hscroll;
	}
	,createVScroll: function() {
		if(this._component.get_isNativeScroller() == true) {
			return null;
		}
		var usableSize = this._component.get_layout().get_usableSize();
		var verticalConstraint = this._contents;
		var vscroll = this._component.findComponent(null,haxe_ui_components_VerticalScroll,false);
		var vch = verticalConstraint.get_height() + this.verticalConstraintModifier();
		if(usableSize.height <= 0) {
			return vscroll;
		}
		if(vch > usableSize.height && vscroll == null) {
			vscroll = new haxe_ui_components_VerticalScroll();
			vscroll.set_scriptAccess(false);
			vscroll.set_includeInLayout(!this._scrollview.get_autoHideScrolls());
			vscroll.set_hidden(this._scrollview.get_autoHideScrolls());
			vscroll.set_percentHeight(100);
			vscroll.set_allowFocus(false);
			vscroll.set_id("scrollview-vscroll");
			this._component.addComponent(vscroll);
			this._component.registerInternalEvents(null,true);
		}
		return vscroll;
	}
	,destroyHScroll: function() {
		var hscroll = this._component.findComponent(null,haxe_ui_components_HorizontalScroll,false);
		if(hscroll != null) {
			this._component.removeComponent(hscroll);
		}
	}
	,destroyVScroll: function() {
		var vscroll = this._component.findComponent(null,haxe_ui_components_VerticalScroll,false);
		if(vscroll != null) {
			this._component.removeComponent(vscroll);
		}
	}
	,updateScrollRect: function() {
		if(this._contents == null) {
			return;
		}
		var usableSize = this._component.get_layout().get_usableSize();
		var clipCX = usableSize.width - this.horizontalConstraintModifier();
		if(clipCX > this._contents.get_width()) {
			clipCX = this._contents.get_width() + this.horizontalConstraintModifier();
		}
		var clipCY = usableSize.height - this.verticalConstraintModifier();
		if(clipCY > this._contents.get_height()) {
			clipCY = this._contents.get_height() + this.verticalConstraintModifier();
		}
		var xpos = 0;
		var ypos = 0;
		if(this.get_virtualHorizontal() == false) {
			var hscroll = this._component.findComponent(null,haxe_ui_components_HorizontalScroll,false);
			if(hscroll != null) {
				xpos = hscroll.get_pos();
			}
		} else if(this._contents.get_componentClipRect() != null) {
			clipCX = this._contents.get_componentClipRect().width;
		}
		if(this.get_virtualVertical() == false) {
			var vscroll = this._component.findComponent(null,haxe_ui_components_VerticalScroll,false);
			if(vscroll != null) {
				ypos = vscroll.get_pos();
			}
		} else if(this._contents.get_componentClipRect() != null) {
			clipCY = this._contents.get_componentClipRect().height;
		}
		var rc = new haxe_ui_geom_Rectangle(xpos + 1,ypos,Math.round(clipCX),Math.round(clipCY));
		this._contents.set_componentClipRect(rc);
	}
	,virtualHorizontal: null
	,get_virtualHorizontal: function() {
		return this._scrollview.get_virtual();
	}
	,virtualVertical: null
	,get_virtualVertical: function() {
		return this._scrollview.get_virtual();
	}
	,onVirtualChanged: function() {
	}
	,applyStyle: function(style) {
		haxe_ui_core_CompositeBuilder.prototype.applyStyle.call(this,style);
		if(style.mode != null && style.mode == "mobile") {
			this._scrollview.set_autoHideScrolls(true);
		} else {
			this._scrollview.set_autoHideScrolls(false);
		}
		if(style.contentWidth != null && style.contentWidth != this._scrollview.get_contentWidth()) {
			this._scrollview.set_contentWidth(style.contentWidth);
		} else if(style.contentWidthPercent != null && style.contentWidthPercent != this._scrollview.get_percentContentWidth()) {
			this._scrollview.set_percentContentWidth(style.contentWidthPercent);
		}
		if(style.contentHeight != null && style.contentHeight != this._scrollview.get_contentHeight()) {
			this._scrollview.set_contentHeight(style.contentHeight);
		} else if(style.contentHeightPercent != null && style.contentHeightPercent != this._scrollview.get_percentContentHeight()) {
			this._scrollview.set_percentContentHeight(style.contentHeightPercent);
		}
	}
	,__class__: haxe_ui_containers_ScrollViewBuilder
	,__properties__: $extend(haxe_ui_core_CompositeBuilder.prototype.__properties__,{get_virtualVertical:"get_virtualVertical",get_virtualHorizontal:"get_virtualHorizontal"})
});
var haxe_ui_core_IDataComponent = function() { };
$hxClasses["haxe.ui.core.IDataComponent"] = haxe_ui_core_IDataComponent;
haxe_ui_core_IDataComponent.__name__ = "haxe.ui.core.IDataComponent";
haxe_ui_core_IDataComponent.__isInterface__ = true;
haxe_ui_core_IDataComponent.prototype = {
	get_dataSource: null
	,set_dataSource: null
	,__class__: haxe_ui_core_IDataComponent
	,__properties__: {set_dataSource:"set_dataSource",get_dataSource:"get_dataSource"}
};
var haxe_ui_containers_TableView = function() {
	haxe_ui_containers_ScrollView.call(this);
};
$hxClasses["haxe.ui.containers.TableView"] = haxe_ui_containers_TableView;
haxe_ui_containers_TableView.__name__ = "haxe.ui.containers.TableView";
haxe_ui_containers_TableView.__interfaces__ = [haxe_ui_containers_IVirtualContainer,haxe_ui_core_IDataComponent];
haxe_ui_containers_TableView.__super__ = haxe_ui_containers_ScrollView;
haxe_ui_containers_TableView.prototype = $extend(haxe_ui_containers_ScrollView.prototype,{
	clearContents: function(clearHeader) {
		if(clearHeader == null) {
			clearHeader = false;
		}
		return this.behaviours.call("clearContents",clearHeader);
	}
	,addColumn: function(text) {
		return haxe_ui_util_Variant.toComponent(this.behaviours.call("addColumn",text));
	}
	,removeColumn: function(text) {
		return this.behaviours.call("removeColumn",text);
	}
	,_itemRendererClass: null
	,get_itemRendererClass: function() {
		return this._itemRendererClass;
	}
	,set_itemRendererClass: function(value) {
		if(this._itemRendererClass != value) {
			this._itemRendererClass = value;
			if(!(this._layout == null || this._layoutLocked == true)) {
				this.invalidateComponent("layout",false);
			}
		}
		return value;
	}
	,_itemRenderer: null
	,get_itemRenderer: function() {
		return this._itemRenderer;
	}
	,set_itemRenderer: function(value) {
		if(this._itemRenderer != value) {
			this._itemRenderer = value;
			if(!(this._layout == null || this._layoutLocked == true)) {
				this.invalidateComponent("layout",false);
			}
		}
		return value;
	}
	,registerComposite: function() {
		haxe_ui_containers_ScrollView.prototype.registerComposite.call(this);
		this._internalEventsClass = haxe_ui_containers__$TableView_Events;
		this._compositeBuilderClass = haxe_ui_containers__$TableView_Builder;
		this._defaultLayoutClass = haxe_ui_containers__$TableView_Layout;
	}
	,_internal__onComponentEvent: null
	,onComponentEvent: null
	,set_onComponentEvent: function(value) {
		if(this._internal__onComponentEvent != null) {
			this.unregisterEvent("itemComponentEvent",this._internal__onComponentEvent);
			this._internal__onComponentEvent = null;
		}
		if(value != null) {
			this._internal__onComponentEvent = value;
			this.registerEvent("itemComponentEvent",value);
		}
		return value;
	}
	,registerBehaviours: function() {
		haxe_ui_containers_ScrollView.prototype.registerBehaviours.call(this);
		this.behaviours.register("dataSource",haxe_ui_containers__$TableView_DataSourceBehaviour);
		this.behaviours.register("itemWidth",haxe_ui_behaviours_LayoutBehaviour,haxe_ui_util_Variant.fromInt(-1));
		this.behaviours.register("itemHeight",haxe_ui_behaviours_LayoutBehaviour,haxe_ui_util_Variant.fromInt(-1));
		this.behaviours.register("itemCount",haxe_ui_behaviours_LayoutBehaviour,haxe_ui_util_Variant.fromInt(-1));
		this.behaviours.register("variableItemSize",haxe_ui_behaviours_LayoutBehaviour,haxe_ui_util_Variant.fromBool(false));
		this.behaviours.register("selectedIndex",haxe_ui_containers__$TableView_SelectedIndexBehaviour,haxe_ui_util_Variant.fromInt(-1));
		this.behaviours.register("selectedItem",haxe_ui_containers__$TableView_SelectedItemBehaviour);
		this.behaviours.register("selectedIndices",haxe_ui_containers__$TableView_SelectedIndicesBehaviour);
		this.behaviours.register("selectedItems",haxe_ui_containers__$TableView_SelectedItemsBehaviour);
		this.behaviours.register("selectionMode",haxe_ui_containers__$TableView_SelectionModeBehaviour,haxe_ui_util_Variant.fromString("one-item"));
		this.behaviours.register("longPressSelectionTime",haxe_ui_behaviours_DefaultBehaviour,haxe_ui_util_Variant.fromInt(500));
		this.behaviours.register("header",haxe_ui_containers__$TableView_GetHeader);
		this.behaviours.register("clearContents",haxe_ui_containers__$TableView_ClearTable);
		this.behaviours.register("addColumn",haxe_ui_containers__$TableView_AddColumn);
		this.behaviours.register("removeColumn",haxe_ui_containers__$TableView_RemoveColumn);
	}
	,get_dataSource: function() {
		return haxe_ui_util_Variant.toDataSource(this.behaviours.get("dataSource"));
	}
	,set_dataSource: function(value) {
		this.behaviours.set("dataSource",haxe_ui_util_Variant.fromDataSource(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"dataSource"));
		return value;
	}
	,get_itemWidth: function() {
		return haxe_ui_util_Variant.toFloat(this.behaviours.get("itemWidth"));
	}
	,set_itemWidth: function(value) {
		this.behaviours.set("itemWidth",haxe_ui_util_Variant.fromFloat(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"itemWidth"));
		return value;
	}
	,get_itemHeight: function() {
		return haxe_ui_util_Variant.toFloat(this.behaviours.get("itemHeight"));
	}
	,set_itemHeight: function(value) {
		this.behaviours.set("itemHeight",haxe_ui_util_Variant.fromFloat(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"itemHeight"));
		return value;
	}
	,get_itemCount: function() {
		return haxe_ui_util_Variant.toInt(this.behaviours.get("itemCount"));
	}
	,set_itemCount: function(value) {
		this.behaviours.set("itemCount",haxe_ui_util_Variant.fromInt(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"itemCount"));
		return value;
	}
	,get_variableItemSize: function() {
		return haxe_ui_util_Variant.toBool(this.behaviours.get("variableItemSize"));
	}
	,set_variableItemSize: function(value) {
		this.behaviours.set("variableItemSize",haxe_ui_util_Variant.fromBool(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"variableItemSize"));
		return value;
	}
	,get_selectedIndex: function() {
		return haxe_ui_util_Variant.toInt(this.behaviours.get("selectedIndex"));
	}
	,set_selectedIndex: function(value) {
		this.behaviours.set("selectedIndex",haxe_ui_util_Variant.fromInt(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"selectedIndex"));
		return value;
	}
	,get_selectedItem: function() {
		return this.behaviours.getDynamic("selectedItem");
	}
	,set_selectedItem: function(value) {
		this.behaviours.setDynamic("selectedItem",value);
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"selectedItem"));
		return value;
	}
	,get_selectedIndices: function() {
		return haxe_ui_util_Variant.toArray(this.behaviours.get("selectedIndices"));
	}
	,set_selectedIndices: function(value) {
		this.behaviours.set("selectedIndices",haxe_ui_util_Variant.fromArray(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"selectedIndices"));
		return value;
	}
	,get_selectedItems: function() {
		return haxe_ui_util_Variant.toArray(this.behaviours.get("selectedItems"));
	}
	,set_selectedItems: function(value) {
		this.behaviours.set("selectedItems",haxe_ui_util_Variant.fromArray(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"selectedItems"));
		return value;
	}
	,get_selectionMode: function() {
		return haxe_ui_util_Variant.toString(this.behaviours.get("selectionMode"));
	}
	,set_selectionMode: function(value) {
		this.behaviours.set("selectionMode",haxe_ui_util_Variant.fromString(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"selectionMode"));
		return value;
	}
	,get_longPressSelectionTime: function() {
		return haxe_ui_util_Variant.toInt(this.behaviours.get("longPressSelectionTime"));
	}
	,set_longPressSelectionTime: function(value) {
		this.behaviours.set("longPressSelectionTime",haxe_ui_util_Variant.fromInt(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"longPressSelectionTime"));
		return value;
	}
	,get_header: function() {
		return haxe_ui_util_Variant.toComponent(this.behaviours.get("header"));
	}
	,set_header: function(value) {
		this.behaviours.set("header",haxe_ui_util_Variant.fromComponent(value));
		this.dispatch(new haxe_ui_events_UIEvent("propertyChange",null,"header"));
		return value;
	}
	,cloneComponent: function() {
		var c = haxe_ui_containers_ScrollView.prototype.cloneComponent.call(this);
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_containers_TableView();
	}
	,__class__: haxe_ui_containers_TableView
	,__properties__: $extend(haxe_ui_containers_ScrollView.prototype.__properties__,{set_header:"set_header",get_header:"get_header",set_longPressSelectionTime:"set_longPressSelectionTime",get_longPressSelectionTime:"get_longPressSelectionTime",set_selectionMode:"set_selectionMode",get_selectionMode:"get_selectionMode",set_selectedItems:"set_selectedItems",get_selectedItems:"get_selectedItems",set_selectedIndices:"set_selectedIndices",get_selectedIndices:"get_selectedIndices",set_selectedItem:"set_selectedItem",get_selectedItem:"get_selectedItem",set_selectedIndex:"set_selectedIndex",get_selectedIndex:"get_selectedIndex",set_variableItemSize:"set_variableItemSize",get_variableItemSize:"get_variableItemSize",set_itemCount:"set_itemCount",get_itemCount:"get_itemCount",set_itemHeight:"set_itemHeight",get_itemHeight:"get_itemHeight",set_itemWidth:"set_itemWidth",get_itemWidth:"get_itemWidth",set_dataSource:"set_dataSource",get_dataSource:"get_dataSource",set_onComponentEvent:"set_onComponentEvent",set_itemRenderer:"set_itemRenderer",get_itemRenderer:"get_itemRenderer",set_itemRendererClass:"set_itemRendererClass",get_itemRendererClass:"get_itemRendererClass"})
});
var haxe_ui_core_ItemRenderer = function() {
	this._fieldList = null;
	this.itemIndex = -1;
	this._allowHover = true;
	haxe_ui_containers_Box.call(this);
	this.registerEvent("mouseover",$bind(this,this._onItemMouseOver));
	this.registerEvent("mouseout",$bind(this,this._onItemMouseOut));
	this.registerEvent("mousedown",$bind(this,this._onItemMouseDown));
	this.registerEvent("mouseup",$bind(this,this._onItemMouseUp));
};
$hxClasses["haxe.ui.core.ItemRenderer"] = haxe_ui_core_ItemRenderer;
haxe_ui_core_ItemRenderer.__name__ = "haxe.ui.core.ItemRenderer";
haxe_ui_core_ItemRenderer.__super__ = haxe_ui_containers_Box;
haxe_ui_core_ItemRenderer.prototype = $extend(haxe_ui_containers_Box.prototype,{
	_onItemMouseOver: function(event) {
		this.addClass(":hover");
	}
	,_onItemMouseOut: function(event) {
		this.removeClass(":hover");
	}
	,_onItemMouseDown: function(event) {
		this.addClass(":down");
	}
	,_onItemMouseUp: function(event) {
		this.removeClass(":down");
	}
	,_allowHover: null
	,get_allowHover: function() {
		return this._allowHover;
	}
	,set_allowHover: function(value) {
		if(this._allowHover == value) {
			return value;
		}
		this._allowHover = value;
		if(this._allowHover == true) {
			this.registerEvent("mouseover",$bind(this,this._onItemMouseOver));
			this.registerEvent("mouseout",$bind(this,this._onItemMouseOut));
		} else {
			this.unregisterEvent("mouseover",$bind(this,this._onItemMouseOver));
			this.unregisterEvent("mouseout",$bind(this,this._onItemMouseOut));
		}
		return value;
	}
	,_data: null
	,get_data: function() {
		return this._data;
	}
	,set_data: function(value) {
		if(value == this._data) {
			return value;
		}
		this._data = value;
		this.invalidateComponent("data",false);
		return value;
	}
	,itemIndex: null
	,_fieldList: null
	,validateComponentData: function() {
		if(this._data != null && (this._fieldList == null || this._fieldList.length == 0)) {
			var _g = Type.typeof(this._data);
			switch(_g._hx_index) {
			case 4:
				if(typeof(this._data) == "string" == false) {
					var fieldList = Reflect.fields(this._data);
					if(js_Boot.getClass(this._data) != null) {
						var instanceFields = Type.getInstanceFields(js_Boot.getClass(this._data));
						var _g1 = 0;
						while(_g1 < instanceFields.length) {
							var i = instanceFields[_g1];
							++_g1;
							if(fieldList.indexOf(i) == -1 && Reflect.isFunction(Reflect.getProperty(this._data,i)) == false) {
								fieldList.push(i);
							} else if(StringTools.startsWith(i,"get_") && fieldList.indexOf(HxOverrides.substr(i,4,null)) == -1 && Reflect.isFunction(Reflect.getProperty(this._data,i)) == true) {
								fieldList.push(HxOverrides.substr(i,4,null));
							}
						}
						this._fieldList = fieldList;
					}
				} else {
					this._fieldList = ["text"];
				}
				break;
			case 6:
				var _g1 = _g.c;
				if(typeof(this._data) == "string" == false) {
					var fieldList = Reflect.fields(this._data);
					if(js_Boot.getClass(this._data) != null) {
						var instanceFields = Type.getInstanceFields(js_Boot.getClass(this._data));
						var _g = 0;
						while(_g < instanceFields.length) {
							var i = instanceFields[_g];
							++_g;
							if(fieldList.indexOf(i) == -1 && Reflect.isFunction(Reflect.getProperty(this._data,i)) == false) {
								fieldList.push(i);
							} else if(StringTools.startsWith(i,"get_") && fieldList.indexOf(HxOverrides.substr(i,4,null)) == -1 && Reflect.isFunction(Reflect.getProperty(this._data,i)) == true) {
								fieldList.push(HxOverrides.substr(i,4,null));
							}
						}
						this._fieldList = fieldList;
					}
				} else {
					this._fieldList = ["text"];
				}
				break;
			default:
				this._fieldList = ["text"];
			}
		}
		this.updateValues(this._data,this._fieldList);
		var components = this.findComponents(null,haxe_ui_core_InteractiveComponent);
		var _g = 0;
		while(_g < components.length) {
			var c = components[_g];
			++_g;
			if(((c) instanceof haxe_ui_components_Button)) {
				if(c.hasEvent("click",$bind(this,this.onItemClick)) == false) {
					c.registerEvent("click",$bind(this,this.onItemClick));
				}
			} else if(c.hasEvent("change",$bind(this,this.onItemChange)) == false) {
				c.registerEvent("change",$bind(this,this.onItemChange));
			}
		}
		this.onDataChanged(this._data);
	}
	,onDataChanged: function(data) {
	}
	,onItemChange: function(event) {
		if(this.itemIndex < 0) {
			return;
		}
		var v = event.target.get_value();
		if(this._data != null) {
			Reflect.setProperty(this._data,event.target.get_id(),v);
		}
		var e = new haxe_ui_events_ItemEvent("itemComponentEvent");
		e.bubble = true;
		e.source = event.target;
		e.sourceEvent = event;
		e.itemIndex = this.itemIndex;
		e.data = this._data;
		this.dispatch(e);
	}
	,onItemClick: function(event) {
		if(this.itemIndex < 0) {
			return;
		}
		var e = new haxe_ui_events_ItemEvent("itemComponentEvent");
		e.bubble = true;
		e.source = event.target;
		e.sourceEvent = event;
		e.itemIndex = this.itemIndex;
		e.data = this._data;
		this.dispatch(e);
	}
	,updateValues: function(value,fieldList) {
		if(fieldList == null) {
			fieldList = Reflect.fields(value);
		}
		var valueObject = null;
		var _g = Type.typeof(value);
		switch(_g._hx_index) {
		case 4:
			if(typeof(value) == "string" == false) {
				valueObject = value;
			} else {
				valueObject = { text : value};
			}
			break;
		case 6:
			var _g1 = _g.c;
			if(typeof(value) == "string" == false) {
				valueObject = value;
			} else {
				valueObject = { text : value};
			}
			break;
		default:
			valueObject = { text : value};
		}
		var _g = 0;
		while(_g < fieldList.length) {
			var f = fieldList[_g];
			++_g;
			var v = Reflect.getProperty(valueObject,f);
			var c = this.findComponent(f,null,true);
			if(c != null && v != null) {
				var propValue = haxe_ui_util_TypeConverter.convertTo(v,haxe_ui_core_TypeMap.getTypeInfo(c.get_className(),"value"));
				c.set_value(propValue);
				if(((c) instanceof haxe_ui_core_InteractiveComponent)) {
					if(c.hasEvent("change",$bind(this,this.onItemChange)) == false) {
						c.registerEvent("change",$bind(this,this.onItemChange));
					}
					if(c.hasEvent("click",$bind(this,this.onItemClick)) == false) {
						c.registerEvent("click",$bind(this,this.onItemClick));
					}
				}
				c.show();
			} else if(c != null) {
				c.hide();
			} else if(f != "id") {
				try {
					Reflect.setProperty(this,f,v);
				} catch( _g1 ) {
				}
			} else if(Type.typeof(v) == ValueType.TObject) {
				this.updateValues(v);
			}
		}
	}
	,registerBehaviours: function() {
		haxe_ui_containers_Box.prototype.registerBehaviours.call(this);
	}
	,cloneComponent: function() {
		var c = haxe_ui_containers_Box.prototype.cloneComponent.call(this);
		c.set_allowHover(this.get_allowHover());
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_core_ItemRenderer();
	}
	,__class__: haxe_ui_core_ItemRenderer
	,__properties__: $extend(haxe_ui_containers_Box.prototype.__properties__,{set_data:"set_data",get_data:"get_data",set_allowHover:"set_allowHover",get_allowHover:"get_allowHover"})
});
var haxe_ui_containers__$TableView_CompoundItemRenderer = function() {
	haxe_ui_core_ItemRenderer.call(this);
	this.set_layout(haxe_ui_layouts_LayoutFactory.createFromName("horizontal"));
	this.set_styleString("spacing: 2px;");
	this.removeClass("itemrenderer");
};
$hxClasses["haxe.ui.containers._TableView.CompoundItemRenderer"] = haxe_ui_containers__$TableView_CompoundItemRenderer;
haxe_ui_containers__$TableView_CompoundItemRenderer.__name__ = "haxe.ui.containers._TableView.CompoundItemRenderer";
haxe_ui_containers__$TableView_CompoundItemRenderer.__super__ = haxe_ui_core_ItemRenderer;
haxe_ui_containers__$TableView_CompoundItemRenderer.prototype = $extend(haxe_ui_core_ItemRenderer.prototype,{
	onDataChanged: function(data) {
		var renderers = this.findComponents(null,haxe_ui_core_ItemRenderer);
		var _g = 0;
		while(_g < renderers.length) {
			var r = renderers[_g];
			++_g;
			r.onDataChanged(data);
		}
	}
	,registerBehaviours: function() {
		haxe_ui_core_ItemRenderer.prototype.registerBehaviours.call(this);
	}
	,cloneComponent: function() {
		var c = haxe_ui_core_ItemRenderer.prototype.cloneComponent.call(this);
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_containers__$TableView_CompoundItemRenderer();
	}
	,__class__: haxe_ui_containers__$TableView_CompoundItemRenderer
});
var haxe_ui_containers__$TableView_Events = function(tableview) {
	haxe_ui_containers_ScrollViewEvents.call(this,tableview);
	this._tableview = tableview;
};
$hxClasses["haxe.ui.containers._TableView.Events"] = haxe_ui_containers__$TableView_Events;
haxe_ui_containers__$TableView_Events.__name__ = "haxe.ui.containers._TableView.Events";
haxe_ui_containers__$TableView_Events.__super__ = haxe_ui_containers_ScrollViewEvents;
haxe_ui_containers__$TableView_Events.prototype = $extend(haxe_ui_containers_ScrollViewEvents.prototype,{
	_tableview: null
	,register: function() {
		haxe_ui_containers_ScrollViewEvents.prototype.register.call(this);
		this.registerEvent("scrollchange",$bind(this,this.onScrollChange));
		this.registerEvent("rendererCreated",$bind(this,this.onRendererCreated));
		this.registerEvent("rendererDestroyed",$bind(this,this.onRendererDestroyed));
	}
	,unregister: function() {
		haxe_ui_containers_ScrollViewEvents.prototype.unregister.call(this);
		this.unregisterEvent("scrollchange",$bind(this,this.onScrollChange));
		this.unregisterEvent("rendererCreated",$bind(this,this.onRendererCreated));
		this.unregisterEvent("rendererDestroyed",$bind(this,this.onRendererDestroyed));
	}
	,onScrollChange: function(e) {
		var _this = this._tableview;
		if(!(_this._layout == null || _this._layoutLocked == true)) {
			_this.invalidateComponent("layout",false);
		}
	}
	,onRendererCreated: function(e) {
		var instance = js_Boot.__cast(e.data , haxe_ui_core_ItemRenderer);
		instance.registerEvent("mousedown",$bind(this,this.onRendererMouseDown));
		instance.registerEvent("click",$bind(this,this.onRendererClick));
		if(this._tableview.get_selectedIndices().indexOf(instance.itemIndex) != -1) {
			var builder = js_Boot.__cast(this._tableview._compositeBuilder , haxe_ui_containers__$TableView_Builder);
			builder.addItemRendererClass(instance,":selected");
		}
	}
	,onRendererDestroyed: function(e) {
		var instance = js_Boot.__cast(e.data , haxe_ui_core_ItemRenderer);
		instance.unregisterEvent("mousedown",$bind(this,this.onRendererMouseDown));
		instance.unregisterEvent("click",$bind(this,this.onRendererClick));
		if(this._tableview.get_selectedIndices().indexOf(instance.itemIndex) != -1) {
			var builder = js_Boot.__cast(this._tableview._compositeBuilder , haxe_ui_containers__$TableView_Builder);
			builder.addItemRendererClass(instance,":selected",false);
		}
	}
	,onRendererMouseDown: function(e) {
		if(this._tableview.get_selectionMode() == "multiple-long-press") {
			if(this._tableview.get_selectedIndices().length == 0) {
				this.startLongPressSelection(e);
			}
		}
	}
	,startLongPressSelection: function(e) {
		var _gthis = this;
		var timerClick = null;
		var currentMouseX = e.screenX;
		var currentMouseY = e.screenY;
		var renderer = js_Boot.__cast(e.target , haxe_ui_core_ItemRenderer);
		var __onMouseMove = null;
		var __onMouseUp = null;
		var __onMouseClick = null;
		__onMouseMove = function(_e) {
			currentMouseX = _e.screenX;
			currentMouseY = _e.screenY;
		};
		__onMouseUp = function(_e) {
			if(timerClick != null) {
				timerClick.stop();
				timerClick = null;
			}
			renderer.get_screen().unregisterEvent("mousemove",__onMouseMove);
			renderer.get_screen().unregisterEvent("mouseup",__onMouseUp);
		};
		__onMouseClick = function(_e) {
			_e.cancel();
			renderer.unregisterEvent("click",__onMouseClick);
		};
		renderer.get_screen().registerEvent("mousemove",__onMouseMove);
		renderer.get_screen().registerEvent("mouseup",__onMouseUp);
		timerClick = haxe_Timer.delay(function() {
			if(timerClick != null) {
				timerClick = null;
				var timerClick1;
				if(renderer.hitTest(currentMouseX,currentMouseY)) {
					var x1 = e.screenX;
					var y1 = e.screenY;
					timerClick1 = Math.sqrt((x1 - currentMouseX) * (x1 - currentMouseX) + (y1 - currentMouseY) * (y1 - currentMouseY)) < 2 * haxe_ui_Toolkit.pixelsPerRem;
				} else {
					timerClick1 = false;
				}
				if(timerClick1) {
					_gthis.toggleSelection(renderer);
					renderer.registerEvent("click",__onMouseClick,1);
				}
			}
		},this._tableview.get_longPressSelectionTime());
	}
	,onContainerEventsStatusChanged: function() {
		haxe_ui_containers_ScrollViewEvents.prototype.onContainerEventsStatusChanged.call(this);
		if(this._containerEventsPaused == true) {
			this._tableview.findComponent("tableview-contents",haxe_ui_core_Component,true,"css").removeClass(":hover",true,true);
		} else {
			var tmp = this._lastMousePos != null;
		}
	}
	,onRendererClick: function(e) {
		if(this._containerEventsPaused == true) {
			return;
		}
		var components = e.target.findComponentsUnderPoint(e.screenX,e.screenY);
		var _g = 0;
		while(_g < components.length) {
			var component = components[_g];
			++_g;
			if(((component) instanceof haxe_ui_core_InteractiveComponent) && (js_Boot.__cast(component , haxe_ui_core_InteractiveComponent)).get_allowInteraction() == true) {
				return;
			}
		}
		var renderer = js_Boot.__cast(e.target , haxe_ui_core_ItemRenderer);
		switch(this._tableview.get_selectionMode()) {
		case "disabled":
			break;
		case "multiple-click-modifier-key":case "multiple-modifier-key":
			if(e.ctrlKey == true) {
				this.toggleSelection(renderer);
			} else if(e.shiftKey == true) {
				var selectedIndices = this._tableview.get_selectedIndices();
				var fromIndex = selectedIndices.length > 0 ? selectedIndices[selectedIndices.length - 1] : 0;
				var toIndex = renderer.itemIndex;
				if(fromIndex < toIndex) {
					var _g = 0;
					while(_g < selectedIndices.length) {
						var i = selectedIndices[_g];
						++_g;
						if(i < fromIndex) {
							fromIndex = i;
						}
					}
				} else {
					var tmp = fromIndex;
					fromIndex = toIndex;
					toIndex = tmp;
				}
				this.selectRange(fromIndex,toIndex);
			} else if(this._tableview.get_selectionMode() == "multiple-click-modifier-key") {
				this._tableview.set_selectedIndex(renderer.itemIndex);
			}
			break;
		case "multiple-long-press":
			var selectedIndices = this._tableview.get_selectedIndices();
			if(selectedIndices.length > 0) {
				this.toggleSelection(renderer);
			}
			break;
		case "one-item":
			this._tableview.set_selectedIndex(renderer.itemIndex);
			break;
		case "one-item-repeated":
			this._tableview.set_selectedIndices([renderer.itemIndex]);
			break;
		default:
		}
	}
	,toggleSelection: function(renderer) {
		var itemIndex = renderer.itemIndex;
		var selectedIndices = this._tableview.get_selectedIndices().slice();
		var index = selectedIndices.indexOf(itemIndex);
		if(index == -1) {
			selectedIndices.push(itemIndex);
		} else {
			selectedIndices.splice(index,1);
		}
		this._tableview.set_selectedIndices(selectedIndices);
	}
	,selectRange: function(fromIndex,toIndex) {
		var tmp = this._tableview;
		var _g = [];
		var _g1 = fromIndex;
		var _g2 = toIndex + 1;
		while(_g1 < _g2) {
			var i = _g1++;
			_g.push(i);
		}
		tmp.set_selectedIndices(_g);
	}
	,__class__: haxe_ui_containers__$TableView_Events
});
var haxe_ui_containers__$TableView_Builder = function(tableview) {
	haxe_ui_containers_ScrollViewBuilder.call(this,tableview);
	this._tableview = tableview;
};
$hxClasses["haxe.ui.containers._TableView.Builder"] = haxe_ui_containers__$TableView_Builder;
haxe_ui_containers__$TableView_Builder.__name__ = "haxe.ui.containers._TableView.Builder";
haxe_ui_containers__$TableView_Builder.__super__ = haxe_ui_containers_ScrollViewBuilder;
haxe_ui_containers__$TableView_Builder.prototype = $extend(haxe_ui_containers_ScrollViewBuilder.prototype,{
	_tableview: null
	,_header: null
	,create: function() {
		this.createContentContainer(this._tableview.get_virtual() ? "absolute" : "vertical");
	}
	,onInitialize: function() {
		if(this._header == null) {
			return;
		}
		if(this._tableview.get_itemRenderer() == null) {
			this.buildDefaultRenderer();
		} else {
			this.fillExistingRenderer();
		}
	}
	,onReady: function() {
		if(this._header == null) {
			return;
		}
		if(this._tableview.get_itemRenderer() == null) {
			this.buildDefaultRenderer();
		} else {
			this.fillExistingRenderer();
		}
		var _this = this._component;
		if(!(_this._layout == null || _this._layoutLocked == true)) {
			_this.invalidateComponent("layout",false);
		}
	}
	,createContentContainer: function(layoutName) {
		if(this._contents == null) {
			haxe_ui_containers_ScrollViewBuilder.prototype.createContentContainer.call(this,layoutName);
			this._contents.addClass("tableview-contents");
		}
	}
	,addComponent: function(child) {
		var r = null;
		if(((child) instanceof haxe_ui_core_ItemRenderer)) {
			var itemRenderer = this._tableview.get_itemRenderer();
			if(itemRenderer == null) {
				itemRenderer = new haxe_ui_containers__$TableView_CompoundItemRenderer();
				this._tableview.set_itemRenderer(itemRenderer);
			}
			itemRenderer.addComponent(child);
			return child;
		} else if(((child) instanceof haxe_ui_containers_Header)) {
			this._header = js_Boot.__cast(child , haxe_ui_containers_Header);
			this._header.registerEvent("componentAdded",$bind(this,this.onColumnAdded));
			this._header.registerEvent("sortchanged",$bind(this,this.onSortChanged));
			r = null;
		} else {
			r = haxe_ui_containers_ScrollViewBuilder.prototype.addComponent.call(this,child);
		}
		return r;
	}
	,onColumnAdded: function(e) {
		if(this._tableview.get_itemRenderer() == null) {
			this.buildDefaultRenderer();
		} else {
			this.fillExistingRenderer();
		}
		var _this = this._component;
		if(!(_this._layout == null || _this._layoutLocked == true)) {
			_this.invalidateComponent("layout",false);
		}
	}
	,onSortChanged: function(e) {
		var column = js_Boot.__cast(e.target , haxe_ui_components_Column);
		var field = column.get_id();
		if(column.sortField != null) {
			field = column.sortField;
		}
		this._tableview.get_dataSource().sort(field,e.direction);
	}
	,removeComponent: function(child,dispose,invalidate) {
		if(invalidate == null) {
			invalidate = true;
		}
		if(dispose == null) {
			dispose = true;
		}
		if(((child) instanceof haxe_ui_containers_Header) == true) {
			this._header = null;
			return null;
		}
		return haxe_ui_containers_ScrollViewBuilder.prototype.removeComponent.call(this,child,dispose,invalidate);
	}
	,createRenderer: function(id) {
		var itemRenderer = null;
		if(this._tableview.get_itemRendererClass() == null) {
			itemRenderer = new haxe_ui_core_ItemRenderer();
		} else {
			itemRenderer = Type.createInstance(this._tableview.get_itemRendererClass(),[]);
		}
		if((itemRenderer._children == null ? [] : itemRenderer._children).length == 0) {
			var label = new haxe_ui_components_Label();
			label.set_id(id);
			label.set_percentWidth(100);
			label.set_verticalAlign("center");
			itemRenderer.addComponent(label);
		}
		return itemRenderer;
	}
	,buildDefaultRenderer: function() {
		var r = new haxe_ui_containers__$TableView_CompoundItemRenderer();
		if(this._header != null) {
			var _g = 0;
			var _this = this._header;
			var _g1 = _this._children == null ? [] : _this._children;
			while(_g < _g1.length) {
				var column = _g1[_g];
				++_g;
				var itemRenderer = this.createRenderer(column.get_id());
				r.addComponent(itemRenderer);
			}
		}
		this._tableview.set_itemRenderer(r);
	}
	,fillExistingRenderer: function() {
		var i = 0;
		var _g = 0;
		var _this = this._header;
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var column = _g1[_g];
			++_g;
			var existing = this._tableview.get_itemRenderer().findComponent(column.get_id(),haxe_ui_core_ItemRenderer,true);
			if(existing == null) {
				var temp = this._tableview.get_itemRenderer().findComponent(column.get_id(),haxe_ui_core_Component,true);
				if(temp != null) {
					if(((temp) instanceof haxe_ui_core_ItemRenderer)) {
						existing = js_Boot.__cast(temp , haxe_ui_core_ItemRenderer);
					} else {
						existing = temp.findAncestor(null,haxe_ui_core_ItemRenderer);
					}
					this._tableview.get_itemRenderer().setComponentIndex(existing,i);
				} else {
					var itemRenderer = this.createRenderer(column.get_id());
					this._tableview.get_itemRenderer().addComponentAt(itemRenderer,i);
				}
			} else {
				this._tableview.get_itemRenderer().setComponentIndex(existing,i);
			}
			++i;
		}
		var data = this._component.findComponent("tableview-contents",haxe_ui_containers_Box,true,"css");
		if(data != null) {
			var _g = 0;
			var _g1 = data._children == null ? [] : data._children;
			while(_g < _g1.length) {
				var item = _g1[_g];
				++_g;
				var _g2 = 0;
				var _this = this._header;
				var _g3 = _this._children == null ? [] : _this._children;
				while(_g2 < _g3.length) {
					var column = _g3[_g2];
					++_g2;
					var existing = item.findComponent(column.get_id(),haxe_ui_core_ItemRenderer,true);
					if(existing == null) {
						var temp = this._tableview.get_itemRenderer().findComponent(column.get_id(),haxe_ui_core_Component,true);
						var renderer = null;
						if(((temp) instanceof haxe_ui_core_ItemRenderer)) {
							renderer = js_Boot.__cast(temp , haxe_ui_core_ItemRenderer);
						} else {
							renderer = temp.findAncestor(null,haxe_ui_core_ItemRenderer);
						}
						var index = this._tableview.get_itemRenderer().getComponentIndex(renderer);
						var instance = renderer.cloneComponent();
						if(index < 0) {
							item.addComponent(instance);
						} else {
							item.addComponentAt(instance,index);
						}
					}
				}
			}
		}
	}
	,verticalConstraintModifier: function() {
		if(this._header == null) {
			return 0;
		}
		return this._header.get_height();
	}
	,onVirtualChanged: function() {
		this._contents.set_layoutName(this._tableview.get_virtual() ? "absolute" : "vertical");
	}
	,get_virtualHorizontal: function() {
		return false;
	}
	,addItemRendererClass: function(child,className,add) {
		if(add == null) {
			add = true;
		}
		child.walkComponents(function(c) {
			if(((c) instanceof haxe_ui_core_ItemRenderer)) {
				if(add == true) {
					c.addClass(className);
				} else {
					c.removeClass(className);
				}
			} else {
				c.invalidateComponent("style",false);
			}
			return true;
		});
	}
	,__class__: haxe_ui_containers__$TableView_Builder
});
var haxe_ui_layouts_ScrollViewLayout = function() {
	haxe_ui_layouts_DefaultLayout.call(this);
};
$hxClasses["haxe.ui.layouts.ScrollViewLayout"] = haxe_ui_layouts_ScrollViewLayout;
haxe_ui_layouts_ScrollViewLayout.__name__ = "haxe.ui.layouts.ScrollViewLayout";
haxe_ui_layouts_ScrollViewLayout.__super__ = haxe_ui_layouts_DefaultLayout;
haxe_ui_layouts_ScrollViewLayout.prototype = $extend(haxe_ui_layouts_DefaultLayout.prototype,{
	repositionChildren: function() {
		var contents = this.get_component().findComponent("scrollview-contents",null,false,"css");
		if(contents == null) {
			return;
		}
		var hscroll = this.get_component().findComponent(null,haxe_ui_components_HorizontalScroll,false);
		var vscroll = this.get_component().findComponent(null,haxe_ui_components_VerticalScroll,false);
		var borderSize = this.get_borderSize();
		if(hscroll != null && this.hidden(hscroll) == false) {
			hscroll.moveComponent(this.get_paddingLeft() + borderSize,Math.round(this.get_component().get_componentHeight() - hscroll.get_componentHeight() - this.get_paddingBottom() + this.marginTop(hscroll) - borderSize));
		}
		if(vscroll != null && this.hidden(vscroll) == false) {
			vscroll.moveComponent(Math.round(this.get_component().get_componentWidth() - vscroll.get_componentWidth() - this.get_paddingRight() + this.marginLeft(vscroll)) - borderSize,this.get_paddingTop() + borderSize);
		}
		var contents = this.get_component().findComponent("scrollview-contents",null,false,"css");
		if(contents != null) {
			contents.moveComponent(this.get_paddingLeft() + borderSize,this.get_paddingTop() + borderSize);
		}
	}
	,resizeChildren: function() {
		haxe_ui_layouts_DefaultLayout.prototype.resizeChildren.call(this);
		var scrollview = js_Boot.__cast(this._component , haxe_ui_containers_ScrollView);
		var hscroll = this.get_component().findComponent(null,haxe_ui_components_HorizontalScroll,false);
		var vscroll = this.get_component().findComponent(null,haxe_ui_components_VerticalScroll,false);
		var usableSize = this.get_usableSize();
		var percentWidth = 100;
		var percentHeight = 100;
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child != hscroll && child != vscroll) {
				continue;
			}
			var cx = null;
			var cy = null;
			if(child.get_percentWidth() != null) {
				cx = usableSize.width * child.get_percentWidth() / percentWidth - this.marginLeft(child) - this.marginRight(child);
			}
			if(child.get_percentHeight() != null) {
				cy = usableSize.height * child.get_percentHeight() / percentHeight - this.marginTop(child) - this.marginBottom(child);
			}
			if(this.fixedMinWidth(child) && child.get_percentWidth() != null) {
				percentWidth -= child.get_percentWidth();
			}
			if(this.fixedMinHeight(child) && child.get_percentHeight() != null) {
				percentHeight -= child.get_percentHeight();
			}
			if(scrollview.get_autoHideScrolls() == true) {
				if(child == hscroll && vscroll != null && vscroll.get_hidden() == false) {
					cx -= vscroll.get_width();
				} else if(child == vscroll && hscroll != null && hscroll.get_hidden() == false) {
					cy -= hscroll.get_height();
				}
			}
			child.resizeComponent(cx,cy);
		}
	}
	,get_usableSize: function() {
		var size = haxe_ui_layouts_DefaultLayout.prototype.get_usableSize.call(this);
		var hscroll = this.get_component().findComponent(null,haxe_ui_components_HorizontalScroll,false);
		var vscroll = this.get_component().findComponent(null,haxe_ui_components_VerticalScroll,false);
		if(hscroll != null && hscroll.get_includeInLayout() == true && this.hidden(hscroll) == false) {
			size.height -= hscroll.get_componentHeight() - this.marginTop(hscroll);
		}
		if(vscroll != null && vscroll.get_includeInLayout() == true && this.hidden(vscroll) == false) {
			size.width -= vscroll.get_componentWidth() - this.marginLeft(vscroll);
		}
		if((js_Boot.__cast(this.get_component() , haxe_ui_containers_ScrollView)).get_native() == true || this._component.get_isNativeScroller() == true) {
			var contents = this.get_component().findComponent("scrollview-contents",null,false,"css");
			if(contents != null) {
				if(contents.get_componentWidth() > size.width) {
					size.height -= haxe_ui_core_Platform.get_hscrollHeight();
				}
				if(contents.get_componentHeight() > size.height) {
					size.width -= haxe_ui_core_Platform.get_vscrollWidth();
				}
			}
		}
		size.width += 1;
		var borderSize = this.get_borderSize();
		size.width -= borderSize * 2;
		size.height -= borderSize * 2;
		return size;
	}
	,calcAutoSize: function(exclusions) {
		var hscroll = this.get_component().findComponent(null,haxe_ui_components_HorizontalScroll,false);
		var vscroll = this.get_component().findComponent(null,haxe_ui_components_VerticalScroll,false);
		var size = haxe_ui_layouts_DefaultLayout.prototype.calcAutoSize.call(this,[hscroll,vscroll]);
		if(hscroll != null && hscroll.get_hidden() == false) {
			size.height += hscroll.get_componentHeight();
		}
		if(vscroll != null && vscroll.get_hidden() == false) {
			size.width += vscroll.get_componentWidth();
		}
		if((js_Boot.__cast(this.get_component() , haxe_ui_containers_ScrollView)).get_native() == true || this._component.get_isNativeScroller() == true) {
			var contents = this.get_component().findComponent("scrollview-contents",null,false,"css");
			if(contents != null) {
				if(contents.get_width() > this.get_component().get_width()) {
					size.height += haxe_ui_core_Platform.get_hscrollHeight();
				}
				if(contents.get_height() > this.get_component().get_height()) {
					size.width += haxe_ui_core_Platform.get_vscrollWidth();
				}
			}
		}
		size.height += this.get_borderSize() * 2;
		return size;
	}
	,__class__: haxe_ui_layouts_ScrollViewLayout
});
var haxe_ui_layouts_VirtualLayout = function() {
	this._lastItemRenderer = null;
	this._firstPass = true;
	this._sizeCache = [];
	this._rendererPool = [];
	this._lastIndex = -1;
	this._firstIndex = -1;
	haxe_ui_layouts_ScrollViewLayout.call(this);
};
$hxClasses["haxe.ui.layouts.VirtualLayout"] = haxe_ui_layouts_VirtualLayout;
haxe_ui_layouts_VirtualLayout.__name__ = "haxe.ui.layouts.VirtualLayout";
haxe_ui_layouts_VirtualLayout.__super__ = haxe_ui_layouts_ScrollViewLayout;
haxe_ui_layouts_VirtualLayout.prototype = $extend(haxe_ui_layouts_ScrollViewLayout.prototype,{
	_firstIndex: null
	,_lastIndex: null
	,_rendererPool: null
	,_sizeCache: null
	,contents: null
	,get_contents: function() {
		if(this.contents == null) {
			this.contents = this.findComponent("scrollview-contents",null,false,"css");
		}
		return this.contents;
	}
	,get_dataSource: function() {
		return (js_Boot.__cast(this._component , haxe_ui_core_IDataComponent)).get_dataSource();
	}
	,itemWidth: null
	,get_itemWidth: function() {
		var comp = js_Boot.__cast(this._component , haxe_ui_containers_IVirtualContainer);
		if(comp.get_itemWidth() > 0) {
			return comp.get_itemWidth();
		}
		var _this = this.get_contents();
		var childComponents = _this._children == null ? [] : _this._children;
		var result = 0;
		if(childComponents.length > 0) {
			result = childComponents[0].get_width();
			if(result <= 0) {
				childComponents[0].syncComponentValidation();
				result = childComponents[0].get_width();
			}
		}
		if(result > 0) {
			comp.set_itemWidth(result);
		} else {
			result = 1;
		}
		return result;
	}
	,_firstPass: null
	,itemHeight: null
	,get_itemHeight: function() {
		var comp = js_Boot.__cast(this._component , haxe_ui_containers_IVirtualContainer);
		if(comp.get_itemHeight() > 0) {
			return comp.get_itemHeight();
		}
		var _this = this.get_contents();
		var childComponents = _this._children == null ? [] : _this._children;
		var result = 0;
		if(childComponents.length > 0) {
			result = childComponents[0].get_height();
			if(result <= 0) {
				childComponents[0].syncComponentValidation();
				result = childComponents[0].get_height();
			}
		}
		if(result <= 0) {
			result = 25;
		} else if(comp.get_virtual() == true) {
			if(this._firstPass == false) {
				comp.set_itemHeight(result);
				haxe_Log.trace("NOTE: since no itemHeight was not specified it was guessed as " + result + "px",{ fileName : "haxe/ui/layouts/VirtualLayout.hx", lineNumber : 87, className : "haxe.ui.layouts.VirtualLayout", methodName : "get_itemHeight"});
			}
			if(this._firstPass == true) {
				this._firstPass = false;
			}
		}
		return result;
	}
	,itemCount: null
	,get_itemCount: function() {
		var comp = js_Boot.__cast(this._component , haxe_ui_containers_IVirtualContainer);
		if(comp.get_itemCount() >= 0) {
			return comp.get_itemCount();
		} else {
			return 0;
		}
	}
	,refresh: function() {
		this.refreshData();
		haxe_ui_layouts_ScrollViewLayout.prototype.refresh.call(this);
	}
	,refreshData: function() {
		if(this.get_dataSource() == null) {
			return;
		}
		var comp = js_Boot.__cast(this._component , haxe_ui_containers_IVirtualContainer);
		if(comp.get_virtual() == false) {
			this.refreshNonVirtualData();
		} else {
			this.refreshVirtualData();
		}
	}
	,_lastItemRenderer: null
	,refreshNonVirtualData: function() {
		var comp = js_Boot.__cast(this._component , haxe_ui_containers_IVirtualContainer);
		if(comp.get_itemRenderer() != this._lastItemRenderer) {
			this._lastItemRenderer = comp.get_itemRenderer();
			this.get_contents().removeAllComponents();
		}
		var dataSource = this.get_dataSource();
		var contents = this.get_contents();
		var _g = 0;
		var _g1 = dataSource.get_size();
		while(_g < _g1) {
			var n = _g++;
			var data = dataSource.get(n);
			var item = null;
			if(n < (contents._children == null ? [] : contents._children).length) {
				item = js_Boot.__cast((contents._children == null ? [] : contents._children)[n] , haxe_ui_core_ItemRenderer);
				if(item.get_data() == data) {
					item.invalidateComponent("data",false);
					continue;
				}
				var cls = this.itemClass(n,data);
				if(!js_Boot.__instanceof(item,cls)) {
					this.removeRenderer(item);
					item = this.getRenderer(cls,n);
					contents.addComponentAt(item,n);
				}
			} else {
				var cls1 = this.itemClass(n,data);
				item = this.getRenderer(cls1,n);
				contents.addComponent(item);
			}
			var className = n % 2 == 0 ? "even" : "odd";
			if(item.classes.indexOf(className) == -1) {
				var inverseClassName = n % 2 == 0 ? "odd" : "even";
				item.removeClass(inverseClassName);
				item.addClass(className);
			}
			item.itemIndex = n;
			item.set_data(data);
		}
		while(dataSource.get_size() < (contents._children == null ? [] : contents._children).length) {
			var item = js_Boot.__cast((contents._children == null ? [] : contents._children)[(contents._children == null ? [] : contents._children).length - 1] , haxe_ui_core_ItemRenderer);
			this.removeRenderer(item);
		}
	}
	,refreshVirtualData: function() {
		var comp = js_Boot.__cast(this._component , haxe_ui_containers_IVirtualContainer);
		if(comp.get_itemRenderer() != this._lastItemRenderer) {
			this._lastItemRenderer = comp.get_itemRenderer();
			this.get_contents().removeAllComponents();
			this._rendererPool = [];
		}
		this.removeInvisibleRenderers();
		this.calculateRangeVisible();
		this.updateScroll();
		var dataSource = this.get_dataSource();
		var i = 0;
		var _g = this._firstIndex;
		var _g1 = this._lastIndex;
		while(_g < _g1) {
			var n = _g++;
			var data = dataSource.get(n);
			var item = null;
			var cls = this.itemClass(n,data);
			var _this = this.get_contents();
			if((_this._children == null ? [] : _this._children).length <= i) {
				item = this.getRenderer(cls,n);
				this.get_contents().addComponent(item);
			} else {
				var _this1 = this.get_contents();
				item = js_Boot.__cast((_this1._children == null ? [] : _this1._children)[i] , haxe_ui_core_ItemRenderer);
				if(!js_Boot.__instanceof(item,cls)) {
					item = this.getRenderer(cls,n);
					this.get_contents().addComponentAt(item,i);
				} else if(item.itemIndex != n) {
					if(this._component.hasEvent("rendererDestroyed")) {
						this._component.dispatch(new haxe_ui_events_UIEvent("rendererDestroyed",null,item));
					}
					this._component.setComponentIndex(item,i);
					item.itemIndex = n;
					if(this._component.hasEvent("rendererCreated")) {
						this._component.dispatch(new haxe_ui_events_UIEvent("rendererCreated",null,item));
					}
				}
			}
			var className = n % 2 == 0 ? "even" : "odd";
			if(item.classes.indexOf(className) == -1) {
				var inverseClassName = n % 2 == 0 ? "odd" : "even";
				item.removeClass(inverseClassName);
				item.addClass(className);
			}
			item.set_data(data);
			++i;
		}
		while(true) {
			var _this = this.get_contents();
			if(!((_this._children == null ? [] : _this._children).length > i)) {
				break;
			}
			var _this1 = this.get_contents();
			var tmp = _this1._children == null ? [] : _this1._children;
			var _this2 = this.get_contents();
			this.removeRenderer(js_Boot.__cast(tmp[(_this2._children == null ? [] : _this2._children).length - 1] , haxe_ui_core_ItemRenderer),false);
		}
	}
	,calculateRangeVisible: function() {
	}
	,updateScroll: function() {
	}
	,itemClass: function(index,data) {
		var comp = js_Boot.__cast(this._component , haxe_ui_containers_IVirtualContainer);
		if(comp.get_itemRendererClass() != null) {
			return comp.get_itemRendererClass();
		} else if(comp.get_itemRenderer() != null) {
			return js_Boot.getClass(comp.get_itemRenderer());
		} else {
			return haxe_ui_core_BasicItemRenderer;
		}
	}
	,getRenderer: function(cls,index) {
		var instance = null;
		var comp = js_Boot.__cast(this._component , haxe_ui_containers_IVirtualContainer);
		if(comp.get_virtual() == true) {
			var _g = 0;
			var _g1 = this._rendererPool.length;
			while(_g < _g1) {
				var i = _g++;
				var renderer = this._rendererPool[i];
				if(js_Boot.__instanceof(renderer,cls)) {
					this._rendererPool.splice(i,1);
					instance = renderer;
					break;
				}
			}
		}
		if(instance == null) {
			if(comp.get_itemRenderer() != null && js_Boot.getClass(comp.get_itemRenderer()) == cls) {
				instance = comp.get_itemRenderer().cloneComponent();
				instance.handleVisibility(true);
			} else {
				instance = Type.createInstance(cls,[]);
			}
		}
		instance.itemIndex = index;
		if(this._component.hasEvent("rendererCreated")) {
			this._component.dispatch(new haxe_ui_events_UIEvent("rendererCreated",null,instance));
		}
		if(this._component.get_hidden() == false) {
			instance.handleVisibility(true);
		}
		return js_Boot.__cast(instance , haxe_ui_core_ItemRenderer);
	}
	,removeRenderer: function(renderer,dispose) {
		if(dispose == null) {
			dispose = true;
		}
		this._component.removeComponent(renderer,dispose);
		var comp = js_Boot.__cast(this._component , haxe_ui_containers_IVirtualContainer);
		if(comp.get_virtual() == true) {
			this._rendererPool.push(js_Boot.__cast(renderer , haxe_ui_core_ItemRenderer));
		}
		if(this._component.hasEvent("rendererDestroyed")) {
			this._component.dispatch(new haxe_ui_events_UIEvent("rendererDestroyed",null,renderer));
		}
		renderer.itemIndex = -1;
	}
	,removeInvisibleRenderers: function() {
		var contents = this.get_contents();
		if(this._firstIndex >= 0) {
			while((contents._children == null ? [] : contents._children).length > 0 && !this.isRendererVisible((contents._children == null ? [] : contents._children)[0])) {
				this.removeRenderer(js_Boot.__cast((contents._children == null ? [] : contents._children)[0] , haxe_ui_core_ItemRenderer),false);
				++this._firstIndex;
			}
		}
		if(this._lastIndex >= 0) {
			while((contents._children == null ? [] : contents._children).length > 0 && !this.isRendererVisible((contents._children == null ? [] : contents._children)[(contents._children == null ? [] : contents._children).length - 1])) {
				this.removeRenderer(js_Boot.__cast((contents._children == null ? [] : contents._children)[(contents._children == null ? [] : contents._children).length - 1] , haxe_ui_core_ItemRenderer),false);
				--this._lastIndex;
			}
		}
	}
	,isRendererVisible: function(renderer) {
		if(renderer == null) {
			return false;
		}
		if(renderer.get_top() < this._component.get_componentHeight() && renderer.get_top() + renderer.get_componentHeight() >= 0 && renderer.get_left() < this._component.get_componentWidth()) {
			return renderer.get_left() + renderer.get_componentWidth() >= 0;
		} else {
			return false;
		}
	}
	,isIndexVisible: function(index) {
		if(index >= this._firstIndex) {
			return index <= this._lastIndex;
		} else {
			return false;
		}
	}
	,__class__: haxe_ui_layouts_VirtualLayout
	,__properties__: $extend(haxe_ui_layouts_ScrollViewLayout.prototype.__properties__,{get_itemCount:"get_itemCount",get_itemHeight:"get_itemHeight",get_itemWidth:"get_itemWidth",get_dataSource:"get_dataSource",get_contents:"get_contents"})
});
var haxe_ui_layouts_VerticalVirtualLayout = function() {
	haxe_ui_layouts_VirtualLayout.call(this);
};
$hxClasses["haxe.ui.layouts.VerticalVirtualLayout"] = haxe_ui_layouts_VerticalVirtualLayout;
haxe_ui_layouts_VerticalVirtualLayout.__name__ = "haxe.ui.layouts.VerticalVirtualLayout";
haxe_ui_layouts_VerticalVirtualLayout.__super__ = haxe_ui_layouts_VirtualLayout;
haxe_ui_layouts_VerticalVirtualLayout.prototype = $extend(haxe_ui_layouts_VirtualLayout.prototype,{
	repositionChildren: function() {
		haxe_ui_layouts_VirtualLayout.prototype.repositionChildren.call(this);
		var comp = js_Boot.__cast(this._component , haxe_ui_containers_IVirtualContainer);
		var itemHeight = this.get_itemHeight();
		var contents = this.get_contents();
		var verticalSpacing = contents.get_layout().get_verticalSpacing();
		if(comp.get_virtual() == true) {
			var n = this._firstIndex;
			if(comp.get_variableItemSize() == true) {
				var pos = -comp.get_vscrollPos();
				var _g = 0;
				var _g1 = this._lastIndex;
				while(_g < _g1) {
					var i = _g++;
					if(i >= this._firstIndex) {
						var c = contents.getComponentAt(i - this._firstIndex);
						c.set_top(pos);
					}
					var size = this._sizeCache[i];
					pos += (size != null && size != 0 ? size : itemHeight) + verticalSpacing;
				}
			} else {
				var _g = 0;
				var _g1 = contents._children == null ? [] : contents._children;
				while(_g < _g1.length) {
					var child = _g1[_g];
					++_g;
					child.set_top(n * (itemHeight + verticalSpacing) - comp.get_vscrollPos());
					++n;
				}
			}
		}
	}
	,verticalConstraintModifier: function() {
		return 0;
	}
	,calculateRangeVisible: function() {
		var comp = js_Boot.__cast(this._component , haxe_ui_containers_IVirtualContainer);
		var verticalSpacing = this.get_contents().get_layout().get_verticalSpacing();
		var itemHeight = this.get_itemHeight();
		var visibleItemsCount = 0;
		var contentsHeight = 0;
		if(this.get_contents().get_autoHeight() == true) {
			var itemCount = this.get_itemCount();
			if(itemCount > 0 || this._component.get_autoHeight() == true) {
				contentsHeight = itemCount * itemHeight - this.verticalConstraintModifier();
			} else {
				contentsHeight = this._component.get_height() - this.verticalConstraintModifier();
			}
		} else {
			contentsHeight = this.get_contents().get_height() - this.verticalConstraintModifier();
		}
		if(contentsHeight > this._component.get_height() - this.verticalConstraintModifier()) {
			contentsHeight = this._component.get_height() - this.verticalConstraintModifier();
		}
		if(comp.get_variableItemSize() == true) {
			var totalSize = 0;
			var requireInvalidation = false;
			var newFirstIndex = -1;
			var _g = 0;
			var _g1 = this.get_dataSource().get_size();
			while(_g < _g1) {
				var i = _g++;
				var size = this._sizeCache[i];
				if(size == null || size == 0) {
					if(i >= this._firstIndex && i <= this._lastIndex) {
						var c = this.get_contents().getComponentAt(i - this._firstIndex);
						if(c != null && c.get_componentHeight() > 0) {
							this._sizeCache[i] = c.get_componentHeight();
							size = c.get_componentHeight();
						} else {
							requireInvalidation = true;
							size = itemHeight;
						}
					} else {
						requireInvalidation = true;
						size = itemHeight;
					}
				}
				size += verticalSpacing;
				if(newFirstIndex == -1) {
					if(totalSize + size > comp.get_vscrollPos()) {
						newFirstIndex = i;
						totalSize += size - comp.get_vscrollPos();
						++visibleItemsCount;
					} else {
						totalSize += size;
					}
				} else if(totalSize + size > contentsHeight) {
					break;
				} else {
					++visibleItemsCount;
					totalSize += size;
				}
			}
			if(requireInvalidation == true) {
				var _this = this._component;
				if(!(_this._layout == null || _this._layoutLocked == true)) {
					_this.invalidateComponent("layout",false);
				}
			}
			this._firstIndex = newFirstIndex;
		} else {
			visibleItemsCount = Math.ceil(contentsHeight / (itemHeight + verticalSpacing));
			this._firstIndex = comp.get_vscrollPos() / (itemHeight + verticalSpacing) | 0;
		}
		if(this._firstIndex < 0) {
			this._firstIndex = 0;
		}
		var rc = new haxe_ui_geom_Rectangle(0,0,this.get_contents().get_width(),contentsHeight - (this.get_paddingTop() + this.get_paddingBottom()));
		this.get_contents().set_componentClipRect(rc);
		this._lastIndex = this._firstIndex + visibleItemsCount + 1;
		if(this._lastIndex > this.get_dataSource().get_size()) {
			this._lastIndex = this.get_dataSource().get_size();
		}
	}
	,updateScroll: function() {
		var comp = js_Boot.__cast(this._component , haxe_ui_containers_IVirtualContainer);
		var usableSize = this.get_usableSize();
		var dataSize = this.get_dataSource().get_size();
		var verticalSpacing = this.get_contents().get_layout().get_verticalSpacing();
		var scrollMax = 0;
		var itemHeight = this.get_itemHeight();
		if(comp.get_variableItemSize() == true) {
			scrollMax = -usableSize.height;
			var _g = 0;
			var _g1 = this.get_dataSource().get_size();
			while(_g < _g1) {
				var i = _g++;
				var size = this._sizeCache[i];
				if(size == null || size == 0) {
					size = itemHeight;
				}
				scrollMax += size + verticalSpacing + this.verticalConstraintModifier();
			}
		} else {
			scrollMax = dataSize * itemHeight + (dataSize - 1) * verticalSpacing - usableSize.height + this.verticalConstraintModifier();
		}
		if(scrollMax < 0) {
			scrollMax = 0;
		}
		comp.set_vscrollMax(scrollMax);
		comp.set_vscrollPageSize(usableSize.height / (scrollMax + usableSize.height) * scrollMax);
	}
	,calcAutoSize: function(exclusions) {
		var size = haxe_ui_layouts_VirtualLayout.prototype.calcAutoSize.call(this,exclusions);
		var comp = js_Boot.__cast(this._component , haxe_ui_containers_IVirtualContainer);
		if(comp.get_itemCount() > 0 && this._component.get_autoHeight() == true) {
			var contents = this._component.findComponent("scrollview-contents",null,false);
			var contentsPadding = 0;
			if(contents != null) {
				var layout = contents.get_layout();
				if(layout != null) {
					contentsPadding = layout.get_paddingTop() + layout.get_paddingBottom();
				}
			}
			size.height = this.get_itemHeight() * comp.get_itemCount() + this.get_paddingTop() + this.get_paddingBottom() + contentsPadding + this.get_borderSize() * 2;
		}
		return size;
	}
	,__class__: haxe_ui_layouts_VerticalVirtualLayout
});
var haxe_ui_containers__$TableView_Layout = function() {
	haxe_ui_layouts_VerticalVirtualLayout.call(this);
};
$hxClasses["haxe.ui.containers._TableView.Layout"] = haxe_ui_containers__$TableView_Layout;
haxe_ui_containers__$TableView_Layout.__name__ = "haxe.ui.containers._TableView.Layout";
haxe_ui_containers__$TableView_Layout.__super__ = haxe_ui_layouts_VerticalVirtualLayout;
haxe_ui_containers__$TableView_Layout.prototype = $extend(haxe_ui_layouts_VerticalVirtualLayout.prototype,{
	itemClass: function(index,data) {
		return haxe_ui_containers__$TableView_CompoundItemRenderer;
	}
	,repositionChildren: function() {
		var header = this.findComponent(null,haxe_ui_containers_Header,true);
		if(header == null) {
			return;
		}
		haxe_ui_layouts_VerticalVirtualLayout.prototype.repositionChildren.call(this);
		header.set_left(this.get_paddingLeft() + this.get_borderSize());
		header.set_top(this.get_paddingTop() + this.get_borderSize());
		var vscroll = this._component.findComponent(null,haxe_ui_components_VerticalScroll);
		if(vscroll != null && vscroll.get_hidden() == false) {
			header.addClass("scrolling");
			header.invalidateComponent(null,true);
		} else {
			header.removeClass("scrolling");
			header.invalidateComponent(null,true);
		}
		var rc = new haxe_ui_geom_Rectangle((js_Boot.__cast(this._component , haxe_ui_containers_ScrollView)).get_hscrollPos() + 1,1,this.get_usableWidth(),header.get_height());
		header.set_componentClipRect(rc);
		var data = this.findComponent("tableview-contents",haxe_ui_containers_Box,true,"css");
		if(data != null) {
			var _g = 0;
			var _g1 = data._children == null ? [] : data._children;
			while(_g < _g1.length) {
				var item = _g1[_g];
				++_g;
				var headerChildComponents = header._children == null ? [] : header._children;
				var _g2 = 0;
				while(_g2 < headerChildComponents.length) {
					var column = headerChildComponents[_g2];
					++_g2;
					var isLast = headerChildComponents.indexOf(column) == headerChildComponents.length - 1;
					var itemRenderer = item.findComponent(column.get_id(),haxe_ui_core_Component);
					if(itemRenderer != null && ((itemRenderer) instanceof haxe_ui_core_ItemRenderer) == false) {
						itemRenderer = itemRenderer.findAncestor(null,haxe_ui_core_ItemRenderer);
					}
					if(itemRenderer != null) {
						itemRenderer.set_percentWidth(null);
						if(isLast == false) {
							itemRenderer.set_width(column.get_width() - item.get_layout().get_horizontalSpacing());
						} else {
							itemRenderer.set_width(column.get_width());
						}
					}
				}
			}
			data.set_left(this.get_paddingLeft() + this.get_borderSize());
			data.set_top(header.get_top() + header.get_height() - 1);
			data.set_componentWidth(header.get_width());
		}
	}
	,resizeChildren: function() {
		var header = this.findComponent(null,haxe_ui_containers_Header,true);
		if(header == null) {
			return;
		}
		haxe_ui_layouts_VerticalVirtualLayout.prototype.resizeChildren.call(this);
	}
	,verticalConstraintModifier: function() {
		var header = this.findComponent(null,haxe_ui_containers_Header,true);
		if(header == null) {
			return 0;
		}
		return header.get_height();
	}
	,__class__: haxe_ui_containers__$TableView_Layout
});
var haxe_ui_containers__$TableView_DataSourceBehaviour = function(component) {
	this._firstPass = true;
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.containers._TableView.DataSourceBehaviour"] = haxe_ui_containers__$TableView_DataSourceBehaviour;
haxe_ui_containers__$TableView_DataSourceBehaviour.__name__ = "haxe.ui.containers._TableView.DataSourceBehaviour";
haxe_ui_containers__$TableView_DataSourceBehaviour.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_containers__$TableView_DataSourceBehaviour.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	_firstPass: null
	,set: function(value) {
		var _gthis = this;
		haxe_ui_behaviours_DataBehaviour.prototype.set.call(this,value);
		var dataSource = haxe_ui_util_Variant.toDataSource(this._value);
		if(dataSource != null) {
			dataSource.transformer = new haxe_ui_data_transformation_NativeTypeTransformer();
			dataSource.onChange = function() {
				var _this = _gthis._component;
				if(!(_this._layout == null || _this._layoutLocked == true)) {
					_this.invalidateComponent("layout",false);
				}
				if(_gthis._firstPass == true) {
					_gthis._component.syncComponentValidation();
					_gthis._firstPass = false;
					var _this = _gthis._component;
					if(!(_this._layout == null || _this._layoutLocked == true)) {
						_this.invalidateComponent("layout",false);
					}
				}
			};
			var _this = this._component;
			if(!(_this._layout == null || _this._layoutLocked == true)) {
				_this.invalidateComponent("layout",false);
			}
		} else {
			var _this = this._component;
			if(!(_this._layout == null || _this._layoutLocked == true)) {
				_this.invalidateComponent("layout",false);
			}
		}
	}
	,get: function() {
		if(this._value == null || haxe_ui_util_Variant.get_isNull(this._value)) {
			this._value = haxe_ui_util_Variant.fromDataSource(new haxe_ui_data_ArrayDataSource());
			this.set(this._value);
		}
		return this._value;
	}
	,__class__: haxe_ui_containers__$TableView_DataSourceBehaviour
});
var haxe_ui_containers__$TableView_SelectedIndexBehaviour = function(component) {
	haxe_ui_behaviours_Behaviour.call(this,component);
};
$hxClasses["haxe.ui.containers._TableView.SelectedIndexBehaviour"] = haxe_ui_containers__$TableView_SelectedIndexBehaviour;
haxe_ui_containers__$TableView_SelectedIndexBehaviour.__name__ = "haxe.ui.containers._TableView.SelectedIndexBehaviour";
haxe_ui_containers__$TableView_SelectedIndexBehaviour.__super__ = haxe_ui_behaviours_Behaviour;
haxe_ui_containers__$TableView_SelectedIndexBehaviour.prototype = $extend(haxe_ui_behaviours_Behaviour.prototype,{
	get: function() {
		var tableView = js_Boot.__cast(this._component , haxe_ui_containers_TableView);
		var selectedIndices = tableView.get_selectedIndices();
		if(selectedIndices != null && selectedIndices.length > 0) {
			return haxe_ui_util_Variant.fromInt(selectedIndices[selectedIndices.length - 1]);
		} else {
			return haxe_ui_util_Variant.fromInt(-1);
		}
	}
	,set: function(value) {
		var tableView = js_Boot.__cast(this._component , haxe_ui_containers_TableView);
		tableView.set_selectedIndices(haxe_ui_util_Variant.neq(value,haxe_ui_util_Variant.fromInt(-1)) ? [haxe_ui_util_Variant.toInt(value)] : null);
	}
	,__class__: haxe_ui_containers__$TableView_SelectedIndexBehaviour
});
var haxe_ui_containers__$TableView_SelectedItemBehaviour = function(component) {
	haxe_ui_behaviours_Behaviour.call(this,component);
};
$hxClasses["haxe.ui.containers._TableView.SelectedItemBehaviour"] = haxe_ui_containers__$TableView_SelectedItemBehaviour;
haxe_ui_containers__$TableView_SelectedItemBehaviour.__name__ = "haxe.ui.containers._TableView.SelectedItemBehaviour";
haxe_ui_containers__$TableView_SelectedItemBehaviour.__super__ = haxe_ui_behaviours_Behaviour;
haxe_ui_containers__$TableView_SelectedItemBehaviour.prototype = $extend(haxe_ui_behaviours_Behaviour.prototype,{
	getDynamic: function() {
		var tableView = js_Boot.__cast(this._component , haxe_ui_containers_TableView);
		var selectedIndices = tableView.get_selectedIndices();
		if(selectedIndices.length > 0) {
			return tableView.get_dataSource().get(selectedIndices[selectedIndices.length - 1]);
		} else {
			return null;
		}
	}
	,set: function(value) {
		var tableView = js_Boot.__cast(this._component , haxe_ui_containers_TableView);
		var index = tableView.get_dataSource().indexOf(value);
		if(index != -1 && tableView.get_selectedIndices().indexOf(index) == -1) {
			tableView.set_selectedIndices([index]);
		}
	}
	,__class__: haxe_ui_containers__$TableView_SelectedItemBehaviour
});
var haxe_ui_containers__$TableView_SelectedIndicesBehaviour = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.containers._TableView.SelectedIndicesBehaviour"] = haxe_ui_containers__$TableView_SelectedIndicesBehaviour;
haxe_ui_containers__$TableView_SelectedIndicesBehaviour.__name__ = "haxe.ui.containers._TableView.SelectedIndicesBehaviour";
haxe_ui_containers__$TableView_SelectedIndicesBehaviour.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_containers__$TableView_SelectedIndicesBehaviour.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	get: function() {
		if(haxe_ui_util_Variant.get_isNull(this._value)) {
			return haxe_ui_util_Variant.fromArray([]);
		} else {
			return this._value;
		}
	}
	,validateData: function() {
		var tableView = js_Boot.__cast(this._component , haxe_ui_containers_TableView);
		var selectedIndices = tableView.get_selectedIndices();
		var contents = this._component.findComponent("scrollview-contents",null,false,"css");
		var itemToEnsure = null;
		var builder = js_Boot.__cast(this._component._compositeBuilder , haxe_ui_containers__$TableView_Builder);
		var _g = 0;
		var _g1 = contents._children == null ? [] : contents._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(selectedIndices.indexOf((js_Boot.__cast(child , haxe_ui_core_ItemRenderer)).itemIndex) != -1) {
				itemToEnsure = js_Boot.__cast(child , haxe_ui_core_ItemRenderer);
				builder.addItemRendererClass(child,":selected");
			} else {
				builder.addItemRendererClass(child,":selected",false);
			}
		}
		if(itemToEnsure != null && tableView.get_virtual() == false) {
			var vscroll = tableView.findComponent(null,haxe_ui_components_VerticalScroll);
			if(vscroll != null) {
				var vpos = vscroll.get_pos();
				var contents = tableView.findComponent("tableview-contents",null,null,"css");
				if(itemToEnsure.get_top() + itemToEnsure.get_height() > vpos + contents.get_componentClipRect().height) {
					vscroll.set_pos(itemToEnsure.get_top() + itemToEnsure.get_height() - contents.get_componentClipRect().height);
				} else if(itemToEnsure.get_top() < vpos) {
					vscroll.set_pos(itemToEnsure.get_top());
				}
			}
		}
		if(tableView.get_selectedIndex() != -1 && tableView.get_selectedIndices().length != 0) {
			this._component.dispatch(new haxe_ui_events_UIEvent("change"));
		}
	}
	,__class__: haxe_ui_containers__$TableView_SelectedIndicesBehaviour
});
var haxe_ui_containers__$TableView_SelectedItemsBehaviour = function(component) {
	haxe_ui_behaviours_Behaviour.call(this,component);
};
$hxClasses["haxe.ui.containers._TableView.SelectedItemsBehaviour"] = haxe_ui_containers__$TableView_SelectedItemsBehaviour;
haxe_ui_containers__$TableView_SelectedItemsBehaviour.__name__ = "haxe.ui.containers._TableView.SelectedItemsBehaviour";
haxe_ui_containers__$TableView_SelectedItemsBehaviour.__super__ = haxe_ui_behaviours_Behaviour;
haxe_ui_containers__$TableView_SelectedItemsBehaviour.prototype = $extend(haxe_ui_behaviours_Behaviour.prototype,{
	get: function() {
		var tableView = js_Boot.__cast(this._component , haxe_ui_containers_TableView);
		var selectedIndices = tableView.get_selectedIndices();
		if(selectedIndices != null && selectedIndices.length > 0) {
			var selectedItems = [];
			var _g = 0;
			while(_g < selectedIndices.length) {
				var i = selectedIndices[_g];
				++_g;
				if(i < 0 || i >= tableView.get_dataSource().get_size()) {
					continue;
				}
				var data = tableView.get_dataSource().get(i);
				selectedItems.push(data);
			}
			return haxe_ui_util_Variant.fromArray(selectedItems);
		} else {
			return haxe_ui_util_Variant.fromArray([]);
		}
	}
	,set: function(value) {
		var tableView = js_Boot.__cast(this._component , haxe_ui_containers_TableView);
		var selectedItems = haxe_ui_util_Variant.toArray(value);
		if(selectedItems != null && selectedItems.length > 0) {
			var selectedIndices = [];
			var index;
			var _g = 0;
			while(_g < selectedItems.length) {
				var item = selectedItems[_g];
				++_g;
				index = tableView.get_dataSource().indexOf(item);
				if(index != -1) {
					selectedIndices.push(index);
				}
			}
			tableView.set_selectedIndices(selectedIndices);
		} else {
			tableView.set_selectedIndices([]);
		}
	}
	,__class__: haxe_ui_containers__$TableView_SelectedItemsBehaviour
});
var haxe_ui_containers__$TableView_SelectionModeBehaviour = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.containers._TableView.SelectionModeBehaviour"] = haxe_ui_containers__$TableView_SelectionModeBehaviour;
haxe_ui_containers__$TableView_SelectionModeBehaviour.__name__ = "haxe.ui.containers._TableView.SelectionModeBehaviour";
haxe_ui_containers__$TableView_SelectionModeBehaviour.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_containers__$TableView_SelectionModeBehaviour.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	validateData: function() {
		var tableView = js_Boot.__cast(this._component , haxe_ui_containers_TableView);
		var selectedIndices = tableView.get_selectedIndices();
		if(selectedIndices.length == 0) {
			return;
		}
		var selectionMode = this._value;
		switch(selectionMode) {
		case "disabled":
			tableView.set_selectedIndices(null);
			break;
		case "one-item":
			if(selectedIndices.length > 1) {
				tableView.set_selectedIndices([selectedIndices[0]]);
			}
			break;
		default:
		}
	}
	,__class__: haxe_ui_containers__$TableView_SelectionModeBehaviour
});
var haxe_ui_containers__$TableView_GetHeader = function(component) {
	haxe_ui_behaviours_DefaultBehaviour.call(this,component);
};
$hxClasses["haxe.ui.containers._TableView.GetHeader"] = haxe_ui_containers__$TableView_GetHeader;
haxe_ui_containers__$TableView_GetHeader.__name__ = "haxe.ui.containers._TableView.GetHeader";
haxe_ui_containers__$TableView_GetHeader.__super__ = haxe_ui_behaviours_DefaultBehaviour;
haxe_ui_containers__$TableView_GetHeader.prototype = $extend(haxe_ui_behaviours_DefaultBehaviour.prototype,{
	get: function() {
		var header = this._component.findComponent(null,haxe_ui_containers_Header);
		return haxe_ui_util_Variant.fromComponent(header);
	}
	,__class__: haxe_ui_containers__$TableView_GetHeader
});
var haxe_ui_containers__$TableView_ClearTable = function(component) {
	haxe_ui_behaviours_Behaviour.call(this,component);
};
$hxClasses["haxe.ui.containers._TableView.ClearTable"] = haxe_ui_containers__$TableView_ClearTable;
haxe_ui_containers__$TableView_ClearTable.__name__ = "haxe.ui.containers._TableView.ClearTable";
haxe_ui_containers__$TableView_ClearTable.__super__ = haxe_ui_behaviours_Behaviour;
haxe_ui_containers__$TableView_ClearTable.prototype = $extend(haxe_ui_behaviours_Behaviour.prototype,{
	call: function(param) {
		if(param == true) {
			if((js_Boot.__cast(this._component , haxe_ui_containers_TableView)).get_itemRenderer() != null) {
				(js_Boot.__cast(this._component , haxe_ui_containers_TableView)).get_itemRenderer().removeAllComponents();
			}
			var header = this._component.findComponent(null,haxe_ui_containers_Header);
			if(header != null) {
				header.removeAllComponents();
			}
		}
		var contents = this._component.findComponent("tableview-contents",haxe_ui_containers_Box,true,"css");
		if(contents != null) {
			contents.removeAllComponents();
		}
		return null;
	}
	,__class__: haxe_ui_containers__$TableView_ClearTable
});
var haxe_ui_containers__$TableView_AddColumn = function(component) {
	haxe_ui_behaviours_Behaviour.call(this,component);
};
$hxClasses["haxe.ui.containers._TableView.AddColumn"] = haxe_ui_containers__$TableView_AddColumn;
haxe_ui_containers__$TableView_AddColumn.__name__ = "haxe.ui.containers._TableView.AddColumn";
haxe_ui_containers__$TableView_AddColumn.__super__ = haxe_ui_behaviours_Behaviour;
haxe_ui_containers__$TableView_AddColumn.prototype = $extend(haxe_ui_behaviours_Behaviour.prototype,{
	call: function(param) {
		var header = this._component.findComponent(null,haxe_ui_containers_Header);
		if(header == null) {
			header = new haxe_ui_containers_Header();
			this._component.addComponent(header);
		}
		var column = new haxe_ui_components_Column();
		column.set_text(param);
		column.set_id(StringTools.replace(param," ","_"));
		header.addComponent(column);
		return haxe_ui_util_Variant.fromComponent(column);
	}
	,__class__: haxe_ui_containers__$TableView_AddColumn
});
var haxe_ui_containers__$TableView_RemoveColumn = function(component) {
	haxe_ui_behaviours_Behaviour.call(this,component);
};
$hxClasses["haxe.ui.containers._TableView.RemoveColumn"] = haxe_ui_containers__$TableView_RemoveColumn;
haxe_ui_containers__$TableView_RemoveColumn.__name__ = "haxe.ui.containers._TableView.RemoveColumn";
haxe_ui_containers__$TableView_RemoveColumn.__super__ = haxe_ui_behaviours_Behaviour;
haxe_ui_containers__$TableView_RemoveColumn.prototype = $extend(haxe_ui_behaviours_Behaviour.prototype,{
	call: function(param) {
		var header = this._component.findComponent(null,haxe_ui_containers_Header);
		if(header == null) {
			return null;
		}
		var _g = 0;
		var _g1 = header._children == null ? [] : header._children;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(c.get_text() == param) {
				header.removeComponent(c);
				break;
			}
		}
		return null;
	}
	,__class__: haxe_ui_containers__$TableView_RemoveColumn
});
var haxe_ui_core_BasicItemRenderer = function() {
	haxe_ui_core_ItemRenderer.call(this);
	var hbox = new haxe_ui_containers_HBox();
	hbox.addClass("basic-renderer-container");
	var icon = new haxe_ui_components_Image();
	icon.set_id("icon");
	icon.addClass("basic-renderer-icon");
	icon.set_verticalAlign("center");
	icon.hide();
	hbox.addComponent(icon);
	var label = new haxe_ui_components_Label();
	label.set_id("text");
	label.addClass("basic-renderer-label");
	label.set_verticalAlign("center");
	label.hide();
	hbox.addComponent(label);
	this.addComponent(hbox);
};
$hxClasses["haxe.ui.core.BasicItemRenderer"] = haxe_ui_core_BasicItemRenderer;
haxe_ui_core_BasicItemRenderer.__name__ = "haxe.ui.core.BasicItemRenderer";
haxe_ui_core_BasicItemRenderer.__super__ = haxe_ui_core_ItemRenderer;
haxe_ui_core_BasicItemRenderer.prototype = $extend(haxe_ui_core_ItemRenderer.prototype,{
	registerBehaviours: function() {
		haxe_ui_core_ItemRenderer.prototype.registerBehaviours.call(this);
	}
	,cloneComponent: function() {
		var c = haxe_ui_core_ItemRenderer.prototype.cloneComponent.call(this);
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_core_BasicItemRenderer();
	}
	,__class__: haxe_ui_core_BasicItemRenderer
});
var haxe_ui_core_ComponentClassMap = function() {
	this._map = new haxe_ds_StringMap();
};
$hxClasses["haxe.ui.core.ComponentClassMap"] = haxe_ui_core_ComponentClassMap;
haxe_ui_core_ComponentClassMap.__name__ = "haxe.ui.core.ComponentClassMap";
haxe_ui_core_ComponentClassMap.__properties__ = {get_instance:"get_instance"};
haxe_ui_core_ComponentClassMap.get_instance = function() {
	if(haxe_ui_core_ComponentClassMap._instance == null) {
		haxe_ui_core_ComponentClassMap._instance = new haxe_ui_core_ComponentClassMap();
	}
	return haxe_ui_core_ComponentClassMap._instance;
};
haxe_ui_core_ComponentClassMap.get = function(alias) {
	alias = StringTools.replace(alias,"-","").toLowerCase();
	return haxe_ui_core_ComponentClassMap.get_instance().getClassName(alias);
};
haxe_ui_core_ComponentClassMap.register = function(alias,className) {
	haxe_ui_core_ComponentClassMap.get_instance().registerClassName(alias.toLowerCase(),className);
};
haxe_ui_core_ComponentClassMap.list = function() {
	return new haxe_ds__$StringMap_StringMapKeyIterator(haxe_ui_core_ComponentClassMap.get_instance()._map.h);
};
haxe_ui_core_ComponentClassMap.clear = function() {
	haxe_ui_core_ComponentClassMap.get_instance()._map = new haxe_ds_StringMap();
};
haxe_ui_core_ComponentClassMap.hasClass = function(className) {
	return haxe_ui_core_ComponentClassMap.get_instance().hasClassName(className);
};
haxe_ui_core_ComponentClassMap.prototype = {
	_map: null
	,getClassName: function(alias) {
		return this._map.h[alias];
	}
	,registerClassName: function(alias,className) {
		this._map.h[alias] = className;
	}
	,hasClassName: function(className) {
		var h = this._map.h;
		var k_h = h;
		var k_keys = Object.keys(h);
		var k_length = k_keys.length;
		var k_current = 0;
		while(k_current < k_length) {
			var k = k_keys[k_current++];
			if(this._map.h[k] == className) {
				return true;
			}
		}
		return false;
	}
	,__class__: haxe_ui_core_ComponentClassMap
};
var haxe_ui_core_ComponentTextBehaviour = function(component) {
	haxe_ui_behaviours_DefaultBehaviour.call(this,component);
};
$hxClasses["haxe.ui.core.ComponentTextBehaviour"] = haxe_ui_core_ComponentTextBehaviour;
haxe_ui_core_ComponentTextBehaviour.__name__ = "haxe.ui.core.ComponentTextBehaviour";
haxe_ui_core_ComponentTextBehaviour.__super__ = haxe_ui_behaviours_DefaultBehaviour;
haxe_ui_core_ComponentTextBehaviour.prototype = $extend(haxe_ui_behaviours_DefaultBehaviour.prototype,{
	set: function(value) {
		if(haxe_ui_util_Variant.eq(value,this._value)) {
			return;
		}
		this._value = value;
		haxe_ui_behaviours_DefaultBehaviour.prototype.set.call(this,value);
	}
	,__class__: haxe_ui_core_ComponentTextBehaviour
});
var haxe_ui_core_ComponentDisabledBehaviour = function(component) {
	haxe_ui_behaviours_DefaultBehaviour.call(this,component);
	this._value = haxe_ui_util_Variant.fromBool(false);
};
$hxClasses["haxe.ui.core.ComponentDisabledBehaviour"] = haxe_ui_core_ComponentDisabledBehaviour;
haxe_ui_core_ComponentDisabledBehaviour.__name__ = "haxe.ui.core.ComponentDisabledBehaviour";
haxe_ui_core_ComponentDisabledBehaviour.__super__ = haxe_ui_behaviours_DefaultBehaviour;
haxe_ui_core_ComponentDisabledBehaviour.prototype = $extend(haxe_ui_behaviours_DefaultBehaviour.prototype,{
	set: function(value) {
		if(haxe_ui_util_Variant.eq(value,this._value)) {
			return;
		}
		this._value = value;
		if(value != null && haxe_ui_util_Variant.get_isNull(value) == false) {
			this._component.disableInteractivity(haxe_ui_util_Variant.toBool(value),true,true);
		}
	}
	,get: function() {
		return haxe_ui_util_Variant.fromBool(this._component.classes.indexOf(":disabled") != -1);
	}
	,__class__: haxe_ui_core_ComponentDisabledBehaviour
});
var haxe_ui_core_ComponentValueBehaviour = function(component) {
	haxe_ui_behaviours_ValueBehaviour.call(this,component);
};
$hxClasses["haxe.ui.core.ComponentValueBehaviour"] = haxe_ui_core_ComponentValueBehaviour;
haxe_ui_core_ComponentValueBehaviour.__name__ = "haxe.ui.core.ComponentValueBehaviour";
haxe_ui_core_ComponentValueBehaviour.__super__ = haxe_ui_behaviours_ValueBehaviour;
haxe_ui_core_ComponentValueBehaviour.prototype = $extend(haxe_ui_behaviours_ValueBehaviour.prototype,{
	set: function(value) {
		if(haxe_ui_util_Variant.eq(value,this._value)) {
			return;
		}
		this._value = value;
		this._component.set_text(haxe_ui_util_Variant.toString(value));
	}
	,get: function() {
		return this._value;
	}
	,getDynamic: function() {
		return haxe_ui_util_Variant.toDynamic(this._value);
	}
	,__class__: haxe_ui_core_ComponentValueBehaviour
});
var haxe_ui_core_ComponentToolTipBehaviour = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.core.ComponentToolTipBehaviour"] = haxe_ui_core_ComponentToolTipBehaviour;
haxe_ui_core_ComponentToolTipBehaviour.__name__ = "haxe.ui.core.ComponentToolTipBehaviour";
haxe_ui_core_ComponentToolTipBehaviour.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_core_ComponentToolTipBehaviour.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	validateData: function() {
		if(this._value == null || haxe_ui_util_Variant.get_isNull(this._value)) {
			haxe_ui_tooltips_ToolTipManager.get_instance().unregisterTooltip(this._component);
		} else {
			haxe_ui_tooltips_ToolTipManager.get_instance().registerTooltip(this._component,{ tipData : haxe_ui_util_Variant.toDynamic(this._value), renderer : this._component.get_tooltipRenderer()});
		}
	}
	,setDynamic: function(value) {
		if(value == null) {
			haxe_ui_tooltips_ToolTipManager.get_instance().unregisterTooltip(this._component);
		} else {
			haxe_ui_tooltips_ToolTipManager.get_instance().registerTooltip(this._component,{ tipData : value, renderer : this._component.get_tooltipRenderer()});
		}
	}
	,getDynamic: function() {
		var options = haxe_ui_tooltips_ToolTipManager.get_instance().getTooltipOptions(this._component);
		if(options == null) {
			return null;
		}
		return options.tipData;
	}
	,__class__: haxe_ui_core_ComponentToolTipBehaviour
});
var haxe_ui_core_ComponentToolTipRendererBehaviour = function(component) {
	haxe_ui_behaviours_DataBehaviour.call(this,component);
};
$hxClasses["haxe.ui.core.ComponentToolTipRendererBehaviour"] = haxe_ui_core_ComponentToolTipRendererBehaviour;
haxe_ui_core_ComponentToolTipRendererBehaviour.__name__ = "haxe.ui.core.ComponentToolTipRendererBehaviour";
haxe_ui_core_ComponentToolTipRendererBehaviour.__super__ = haxe_ui_behaviours_DataBehaviour;
haxe_ui_core_ComponentToolTipRendererBehaviour.prototype = $extend(haxe_ui_behaviours_DataBehaviour.prototype,{
	validateData: function() {
		if(this._value == null || haxe_ui_util_Variant.get_isNull(this._value)) {
			haxe_ui_tooltips_ToolTipManager.get_instance().updateTooltipRenderer(this._component,null);
		} else {
			haxe_ui_tooltips_ToolTipManager.get_instance().updateTooltipRenderer(this._component,haxe_ui_util_Variant.toComponent(this._value));
		}
	}
	,__class__: haxe_ui_core_ComponentToolTipRendererBehaviour
});
var haxe_ui_core_ImageDisplay = function() {
	this._isValidating = false;
	this._isAllInvalid = false;
	this._invalidationFlags = new haxe_ds_StringMap();
	haxe_ui_backend_ImageDisplayImpl.call(this);
};
$hxClasses["haxe.ui.core.ImageDisplay"] = haxe_ui_core_ImageDisplay;
haxe_ui_core_ImageDisplay.__name__ = "haxe.ui.core.ImageDisplay";
haxe_ui_core_ImageDisplay.__super__ = haxe_ui_backend_ImageDisplayImpl;
haxe_ui_core_ImageDisplay.prototype = $extend(haxe_ui_backend_ImageDisplayImpl.prototype,{
	_invalidationFlags: null
	,_isAllInvalid: null
	,_isValidating: null
	,get_left: function() {
		return this._left;
	}
	,set_left: function(value) {
		if(value == this._left) {
			return value;
		}
		this._left = value;
		this.invalidateComponent("position");
		return value;
	}
	,get_top: function() {
		return this._top;
	}
	,set_top: function(value) {
		if(value == this._top) {
			return value;
		}
		this._top = value;
		this.invalidateComponent("position");
		return value;
	}
	,set_imageWidth: function(value) {
		if(this._imageWidth == value || value <= 0) {
			return value;
		}
		this._imageWidth = value;
		this.invalidateComponent("display");
		return value;
	}
	,get_imageWidth: function() {
		return this._imageWidth;
	}
	,set_imageHeight: function(value) {
		if(this._imageHeight == value || value <= 0) {
			return value;
		}
		this._imageHeight = value;
		this.invalidateComponent("display");
		return value;
	}
	,get_imageHeight: function() {
		return this._imageHeight;
	}
	,get_imageInfo: function() {
		return this._imageInfo;
	}
	,set_imageInfo: function(value) {
		if(value == this._imageInfo) {
			return value;
		}
		this._imageInfo = value;
		this._imageWidth = this._imageInfo.width;
		this._imageHeight = this._imageInfo.height;
		this.invalidateComponent("data");
		this.invalidateComponent("display");
		return value;
	}
	,get_imageClipRect: function() {
		return this._imageClipRect;
	}
	,set_imageClipRect: function(value) {
		this._imageClipRect = value;
		this.invalidateComponent("display");
		return value;
	}
	,isComponentInvalid: function(flag) {
		if(flag == null) {
			flag = "all";
		}
		if(this._isAllInvalid == true) {
			return true;
		}
		if(flag == "all") {
			var h = this._invalidationFlags.h;
			var value_h = h;
			var value_keys = Object.keys(h);
			var value_length = value_keys.length;
			var value_current = 0;
			while(value_current < value_length) {
				var value = value_h[value_keys[value_current++]];
				return true;
			}
			return false;
		}
		return Object.prototype.hasOwnProperty.call(this._invalidationFlags.h,flag);
	}
	,invalidateComponent: function(flag) {
		if(flag == null) {
			flag = "all";
		}
		if(this.parentComponent == null) {
			return;
		}
		if(flag == "all") {
			this._isAllInvalid = true;
			this.parentComponent.invalidateComponent("imageDisplay");
		} else if(!Object.prototype.hasOwnProperty.call(this._invalidationFlags.h,flag)) {
			this._invalidationFlags.h[flag] = true;
			this.parentComponent.invalidateComponent("imageDisplay");
		}
	}
	,validateComponent: function() {
		if(this._isValidating == true || this.isComponentInvalid() == false) {
			return;
		}
		this._isValidating = true;
		this.handleValidate();
		var h = this._invalidationFlags.h;
		var flag_h = h;
		var flag_keys = Object.keys(h);
		var flag_length = flag_keys.length;
		var flag_current = 0;
		while(flag_current < flag_length) {
			var flag = flag_keys[flag_current++];
			var _this = this._invalidationFlags;
			if(Object.prototype.hasOwnProperty.call(_this.h,flag)) {
				delete(_this.h[flag]);
			}
		}
		this._isAllInvalid = false;
		this._isValidating = false;
	}
	,handleValidate: function() {
		var dataInvalid = this.isComponentInvalid("data");
		var positionInvalid = this.isComponentInvalid("position");
		var displayInvalid = this.isComponentInvalid("display");
		if(dataInvalid) {
			this.validateData();
		}
		if(positionInvalid) {
			this.validatePosition();
		}
		if(displayInvalid) {
			this.validateDisplay();
		}
	}
	,__class__: haxe_ui_core_ImageDisplay
	,__properties__: {set_imageClipRect:"set_imageClipRect",get_imageClipRect:"get_imageClipRect",set_imageInfo:"set_imageInfo",get_imageInfo:"get_imageInfo",set_imageHeight:"set_imageHeight",get_imageHeight:"get_imageHeight",set_imageWidth:"set_imageWidth",get_imageWidth:"get_imageWidth",set_top:"set_top",get_top:"get_top",set_left:"set_left",get_left:"get_left"}
});
var haxe_ui_core_Platform = function() {
	haxe_ui_backend_PlatformImpl.call(this);
};
$hxClasses["haxe.ui.core.Platform"] = haxe_ui_core_Platform;
haxe_ui_core_Platform.__name__ = "haxe.ui.core.Platform";
haxe_ui_core_Platform.__properties__ = {get_instance:"get_instance",get_hscrollHeight:"get_hscrollHeight",get_vscrollWidth:"get_vscrollWidth"};
haxe_ui_core_Platform.get_vscrollWidth = function() {
	return haxe_ui_core_Platform.get_instance().getMetric("patform.metrics.vscroll.width");
};
haxe_ui_core_Platform.get_hscrollHeight = function() {
	return haxe_ui_core_Platform.get_instance().getMetric("patform.metrics.hscroll.height");
};
haxe_ui_core_Platform.get_instance = function() {
	if(haxe_ui_core_Platform._instance == null) {
		haxe_ui_core_Platform._instance = new haxe_ui_core_Platform();
	}
	return haxe_ui_core_Platform._instance;
};
haxe_ui_core_Platform.__super__ = haxe_ui_backend_PlatformImpl;
haxe_ui_core_Platform.prototype = $extend(haxe_ui_backend_PlatformImpl.prototype,{
	getMetric: function(id) {
		return haxe_ui_backend_PlatformImpl.prototype.getMetric.call(this,id);
	}
	,__class__: haxe_ui_core_Platform
});
var haxe_ui_core_Screen = function() {
	haxe_ui_backend_ScreenImpl.call(this);
	this.rootComponents = [];
	this._eventMap = new haxe_ui_util_EventMap();
};
$hxClasses["haxe.ui.core.Screen"] = haxe_ui_core_Screen;
haxe_ui_core_Screen.__name__ = "haxe.ui.core.Screen";
haxe_ui_core_Screen.__properties__ = {get_instance:"get_instance"};
haxe_ui_core_Screen.get_instance = function() {
	if(haxe_ui_core_Screen._instance == null) {
		haxe_ui_core_Screen._instance = new haxe_ui_core_Screen();
	}
	return haxe_ui_core_Screen._instance;
};
haxe_ui_core_Screen.__super__ = haxe_ui_backend_ScreenImpl;
haxe_ui_core_Screen.prototype = $extend(haxe_ui_backend_ScreenImpl.prototype,{
	_eventMap: null
	,addComponent: function(component) {
		var wasReady = component.get_isReady();
		component._hasScreen = true;
		haxe_ui_backend_ScreenImpl.prototype.addComponent.call(this,component);
		component.ready();
		if(this.rootComponents.indexOf(component) == -1) {
			this.rootComponents.push(component);
		}
		if(haxe_ui_focus_FocusManager.get_instance().hasView(component) == false) {
			haxe_ui_focus_FocusManager.get_instance().pushView(component);
		}
		if(component.hasEvent("resize",$bind(this,this._onRootComponentResize)) == false) {
			component.registerEvent("resize",$bind(this,this._onRootComponentResize));
		}
		if(wasReady && component.get_hidden() == false) {
			component.dispatch(new haxe_ui_events_UIEvent("shown"));
		}
		return component;
	}
	,removeComponent: function(component,dispose) {
		if(dispose == null) {
			dispose = true;
		}
		if(this.rootComponents.indexOf(component) == -1) {
			return component;
		}
		component._hasScreen = false;
		haxe_ui_backend_ScreenImpl.prototype.removeComponent.call(this,component,dispose);
		component.set_depth(-1);
		HxOverrides.remove(this.rootComponents,component);
		haxe_ui_focus_FocusManager.get_instance().removeView(component);
		component.unregisterEvent("resize",$bind(this,this._onRootComponentResize));
		if(dispose == true) {
			component.disposeComponent();
		}
		return component;
	}
	,setComponentIndex: function(child,index) {
		if(index >= 0 && index <= this.rootComponents.length) {
			this.handleSetComponentIndex(child,index);
			HxOverrides.remove(this.rootComponents,child);
			this.rootComponents.splice(index,0,child);
		}
		return child;
	}
	,findComponentsUnderPoint: function(screenX,screenY,type) {
		var copy = this.rootComponents.slice();
		copy.reverse();
		var c = [];
		var _g = 0;
		while(_g < copy.length) {
			var r = copy[_g];
			++_g;
			if(r.hitTest(screenX,screenY)) {
				var match = true;
				if(type != null && js_Boot.__instanceof(r,type) == false) {
					match = false;
				}
				if(match == true) {
					c.push(r);
				}
			}
			c = c.concat(r.findComponentsUnderPoint(screenX,screenY,type));
		}
		return c;
	}
	,hasComponentUnderPoint: function(screenX,screenY,type) {
		var copy = this.rootComponents.slice();
		copy.reverse();
		var _g = 0;
		while(_g < copy.length) {
			var r = copy[_g];
			++_g;
			if(r.hasComponentUnderPoint(screenX,screenY,type) == true) {
				return true;
			}
		}
		return false;
	}
	,onThemeChanged: function() {
		var _g = 0;
		var _g1 = this.rootComponents;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			this.onThemeChangedChildren(c);
		}
	}
	,onThemeChangedChildren: function(c) {
		var _g = 0;
		var _g1 = c._children == null ? [] : c._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			this.onThemeChangedChildren(child);
		}
		c.onThemeChanged();
	}
	,registerEvent: function(type,listener,priority) {
		if(priority == null) {
			priority = 0;
		}
		if(this.supportsEvent(type) == true) {
			if(this._eventMap.add(type,listener,priority) == true) {
				this.mapEvent(type,$bind(this,this._onMappedEvent));
			}
		} else {
			haxe_Log.trace("WARNING: Screen event \"" + type + "\" not supported",{ fileName : "haxe/ui/core/Screen.hx", lineNumber : 140, className : "haxe.ui.core.Screen", methodName : "registerEvent"});
		}
	}
	,unregisterEvent: function(type,listener) {
		if(this._eventMap.remove(type,listener) == true) {
			this.unmapEvent(type,$bind(this,this._onMappedEvent));
		}
	}
	,_onMappedEvent: function(event) {
		this._eventMap.invoke(event.type,event);
	}
	,__class__: haxe_ui_core_Screen
});
var haxe_ui_core_TextDisplayData = function() {
	this.wordWrap = false;
	this.multiline = false;
};
$hxClasses["haxe.ui.core.TextDisplayData"] = haxe_ui_core_TextDisplayData;
haxe_ui_core_TextDisplayData.__name__ = "haxe.ui.core.TextDisplayData";
haxe_ui_core_TextDisplayData.prototype = {
	multiline: null
	,wordWrap: null
	,__class__: haxe_ui_core_TextDisplayData
};
var haxe_ui_core_TextDisplay = function() {
	this._depth = -1;
	this._isValidating = false;
	this._isAllInvalid = false;
	this._invalidationFlags = new haxe_ds_StringMap();
	haxe_ui_backend_TextDisplayImpl.call(this);
};
$hxClasses["haxe.ui.core.TextDisplay"] = haxe_ui_core_TextDisplay;
haxe_ui_core_TextDisplay.__name__ = "haxe.ui.core.TextDisplay";
haxe_ui_core_TextDisplay.__interfaces__ = [haxe_ui_validation_IValidating];
haxe_ui_core_TextDisplay.__super__ = haxe_ui_backend_TextDisplayImpl;
haxe_ui_core_TextDisplay.prototype = $extend(haxe_ui_backend_TextDisplayImpl.prototype,{
	_invalidationFlags: null
	,_isAllInvalid: null
	,_isValidating: null
	,get_id: function() {
		if(this.parentComponent == null) {
			return null;
		}
		return this.parentComponent.get_id() + "_textdisplay";
	}
	,set_id: function(value) {
		return value;
	}
	,isComponentOffscreen: null
	,get_isComponentOffscreen: function() {
		return false;
	}
	,get_textStyle: function() {
		return this._textStyle;
	}
	,set_textStyle: function(value) {
		var _gthis = this;
		if(value == null) {
			return value;
		}
		if(value.fontName != null && this._textStyle == null || this._textStyle != null && value.fontName != this._textStyle.fontName) {
			haxe_ui_ToolkitAssets.get_instance().getFont(value.fontName,function(fontInfo) {
				_gthis._fontInfo = fontInfo;
				_gthis.invalidateComponent("style");
				_gthis.parentComponent.invalidateComponent("style");
			});
		} else {
			this.invalidateComponent("style");
		}
		this._textStyle = value;
		return value;
	}
	,get_text: function() {
		return this._text;
	}
	,set_text: function(value) {
		if(value == this._text) {
			return value;
		}
		this._text = value;
		this._htmlText = null;
		this.invalidateComponent("data");
		return value;
	}
	,get_htmlText: function() {
		return this._htmlText;
	}
	,set_htmlText: function(value) {
		if(value == this._htmlText) {
			return value;
		}
		this._htmlText = value;
		this._text = null;
		this.invalidateComponent("data");
		return value;
	}
	,get_left: function() {
		return this._left;
	}
	,set_left: function(value) {
		if(value == this._left) {
			return value;
		}
		this.invalidateComponent("position");
		this._left = value;
		return value;
	}
	,get_top: function() {
		return this._top;
	}
	,set_top: function(value) {
		if(value == this._top) {
			return value;
		}
		this.invalidateComponent("position");
		this._top = value;
		return value;
	}
	,set_width: function(value) {
		if(this._width == value) {
			return value;
		}
		this.invalidateComponent("display");
		this._width = value;
		return value;
	}
	,get_width: function() {
		return this._width;
	}
	,set_height: function(value) {
		if(this._height == value) {
			return value;
		}
		this.invalidateComponent("display");
		this._height = value;
		return value;
	}
	,get_height: function() {
		return this._height;
	}
	,textWidth: null
	,get_textWidth: function() {
		if(this._text == null && this._htmlText == null) {
			return 0;
		}
		if(this._text != null && this._text.length == 0) {
			return 0;
		}
		if(this._htmlText != null && this._htmlText.length == 0) {
			return 0;
		}
		if(this.isComponentInvalid() == true) {
			this.validateComponent();
		}
		return this._textWidth;
	}
	,textHeight: null
	,get_textHeight: function() {
		if(this._text == null && this._htmlText == null) {
			return 0;
		}
		if(this._text != null && this._text.length == 0) {
			return 0;
		}
		if(this._htmlText != null && this._htmlText.length == 0) {
			return 0;
		}
		if(this.isComponentInvalid() == true) {
			this.validateComponent();
		}
		return this._textHeight;
	}
	,get_multiline: function() {
		return this._displayData.multiline;
	}
	,set_multiline: function(value) {
		if(value == this._displayData.multiline) {
			return value;
		}
		this.invalidateComponent("style");
		this._displayData.multiline = value;
		return value;
	}
	,get_wordWrap: function() {
		return this._displayData.wordWrap;
	}
	,set_wordWrap: function(value) {
		if(value == this._displayData.wordWrap) {
			return value;
		}
		this.invalidateComponent("style");
		this._displayData.wordWrap = value;
		return value;
	}
	,isComponentInvalid: function(flag) {
		if(flag == null) {
			flag = "all";
		}
		if(this._isAllInvalid == true) {
			return true;
		}
		if(flag == "all") {
			var h = this._invalidationFlags.h;
			var value_h = h;
			var value_keys = Object.keys(h);
			var value_length = value_keys.length;
			var value_current = 0;
			while(value_current < value_length) {
				var value = value_h[value_keys[value_current++]];
				return true;
			}
			return false;
		}
		return Object.prototype.hasOwnProperty.call(this._invalidationFlags.h,flag);
	}
	,invalidateComponent: function(flag) {
		if(flag == null) {
			flag = "all";
		}
		if(flag == "all") {
			this._isAllInvalid = true;
			this.parentComponent.invalidateComponent("textDisplay");
		} else if(!Object.prototype.hasOwnProperty.call(this._invalidationFlags.h,flag)) {
			this._invalidationFlags.h[flag] = true;
			this.parentComponent.invalidateComponent("textDisplay");
		}
	}
	,_depth: null
	,get_depth: function() {
		return this._depth;
	}
	,set_depth: function(value) {
		if(this._depth == value) {
			return value;
		}
		this._depth = value;
		return value;
	}
	,updateComponentDisplay: function() {
	}
	,validateComponent: function(nextFrame) {
		if(nextFrame == null) {
			nextFrame = true;
		}
		if(this._isValidating == true || this.isComponentInvalid() == false) {
			return;
		}
		this._isValidating = true;
		this.validateComponentInternal();
		this._invalidationFlags.h = Object.create(null);
		this._isAllInvalid = false;
		this._isValidating = false;
	}
	,validateComponentInternal: function() {
		var dataInvalid = this.isComponentInvalid("data");
		var styleInvalid = this.isComponentInvalid("style");
		var positionInvalid = this.isComponentInvalid("position");
		var displayInvalid = this.isComponentInvalid("display");
		var measureInvalid = this.isComponentInvalid("measure");
		if(dataInvalid) {
			this.validateData();
		}
		if(styleInvalid) {
			if(this.validateStyle()) {
				measureInvalid = true;
			}
		}
		if(positionInvalid || styleInvalid) {
			this.validatePosition();
		}
		if(displayInvalid) {
			this.validateDisplay();
		}
		if(dataInvalid || displayInvalid || measureInvalid) {
			var oldTextWidth = this.get_textWidth();
			var oldTextHeight = this.get_textHeight();
			this.measureText();
			if(this.get_textWidth() != oldTextWidth || this.get_textHeight() != oldTextHeight) {
				this.parentComponent.invalidateComponent("layout");
			}
		}
	}
	,__class__: haxe_ui_core_TextDisplay
	,__properties__: $extend(haxe_ui_backend_TextDisplayImpl.prototype.__properties__,{set_depth:"set_depth",get_depth:"get_depth",set_wordWrap:"set_wordWrap",get_wordWrap:"get_wordWrap",set_multiline:"set_multiline",get_multiline:"get_multiline",get_textHeight:"get_textHeight",get_textWidth:"get_textWidth",set_height:"set_height",get_height:"get_height",set_width:"set_width",get_width:"get_width",set_top:"set_top",get_top:"get_top",set_left:"set_left",get_left:"get_left",set_htmlText:"set_htmlText",get_htmlText:"get_htmlText",set_text:"set_text",get_text:"get_text",set_textStyle:"set_textStyle",get_textStyle:"get_textStyle",get_isComponentOffscreen:"get_isComponentOffscreen",set_id:"set_id",get_id:"get_id"})
});
var haxe_ui_core_TextInputData = function() {
	this.onChangedCallback = null;
	this.onScrollCallback = null;
	this.vscrollNativeWheel = false;
	this.vscrollPageStep = null;
	this.vscrollPageSize = 0;
	this.vscrollMax = 0;
	this.vscrollPos = 0;
	this.hscrollPageSize = 0;
	this.hscrollMax = 0;
	this.hscrollPos = 0;
	this.password = false;
};
$hxClasses["haxe.ui.core.TextInputData"] = haxe_ui_core_TextInputData;
haxe_ui_core_TextInputData.__name__ = "haxe.ui.core.TextInputData";
haxe_ui_core_TextInputData.prototype = {
	password: null
	,hscrollPos: null
	,hscrollMax: null
	,hscrollPageSize: null
	,vscrollPos: null
	,vscrollMax: null
	,vscrollPageSize: null
	,vscrollPageStep: null
	,vscrollNativeWheel: null
	,onScrollCallback: null
	,onChangedCallback: null
	,__class__: haxe_ui_core_TextInputData
};
var haxe_ui_core_TextInput = function() {
	this._depth = -1;
	this._isValidating = false;
	this._isAllInvalid = false;
	this._invalidationFlags = new haxe_ds_StringMap();
	haxe_ui_backend_TextInputImpl.call(this);
	this._isAllInvalid = true;
};
$hxClasses["haxe.ui.core.TextInput"] = haxe_ui_core_TextInput;
haxe_ui_core_TextInput.__name__ = "haxe.ui.core.TextInput";
haxe_ui_core_TextInput.__interfaces__ = [haxe_ui_validation_IValidating];
haxe_ui_core_TextInput.__super__ = haxe_ui_backend_TextInputImpl;
haxe_ui_core_TextInput.prototype = $extend(haxe_ui_backend_TextInputImpl.prototype,{
	_invalidationFlags: null
	,_isAllInvalid: null
	,_isValidating: null
	,get_id: function() {
		if(this.parentComponent == null) {
			return null;
		}
		return this.parentComponent.get_id() + "_textinput";
	}
	,set_id: function(value) {
		return value;
	}
	,isComponentOffscreen: null
	,get_isComponentOffscreen: function() {
		return false;
	}
	,focus: function() {
		haxe_ui_backend_TextInputImpl.prototype.focus.call(this);
	}
	,blur: function() {
		haxe_ui_backend_TextInputImpl.prototype.blur.call(this);
	}
	,get_textStyle: function() {
		return this._textStyle;
	}
	,set_textStyle: function(value) {
		var _gthis = this;
		if(value == null) {
			return value;
		}
		if(value.fontName != null && this._textStyle == null || this._textStyle != null && value.fontName != this._textStyle.fontName) {
			haxe_ui_ToolkitAssets.get_instance().getFont(value.fontName,function(fontInfo) {
				_gthis._fontInfo = fontInfo;
				_gthis.invalidateComponent("style");
			});
		} else {
			this.invalidateComponent("style");
		}
		this._textStyle = value;
		return value;
	}
	,data: null
	,get_data: function() {
		return this._inputData;
	}
	,get_text: function() {
		return this._text;
	}
	,set_text: function(value) {
		if(value == this._text) {
			return value;
		}
		this._text = value;
		this.invalidateComponent("data");
		return value;
	}
	,get_htmlText: function() {
		return this._htmlText;
	}
	,set_htmlText: function(value) {
		if(value == this._htmlText) {
			return value;
		}
		this._htmlText = value;
		this._text = null;
		this.invalidateComponent("data");
		return value;
	}
	,get_password: function() {
		return this._inputData.password;
	}
	,set_password: function(value) {
		if(value == this._inputData.password) {
			return value;
		}
		this._inputData.password = value;
		this.invalidateComponent("style");
		return value;
	}
	,get_left: function() {
		return this._left;
	}
	,set_left: function(value) {
		if(value == this._left) {
			return value;
		}
		this._left = value;
		this.invalidateComponent("position");
		return value;
	}
	,get_top: function() {
		return this._top;
	}
	,set_top: function(value) {
		if(value == this._top) {
			return value;
		}
		this._top = value;
		this.invalidateComponent("position");
		return value;
	}
	,set_width: function(value) {
		if(this._width == value) {
			return value;
		}
		this._width = value;
		this.invalidateComponent("display");
		return value;
	}
	,get_width: function() {
		return this._width;
	}
	,set_height: function(value) {
		if(this._height == value) {
			return value;
		}
		this._height = value;
		this.invalidateComponent("display");
		return value;
	}
	,get_height: function() {
		return this._height;
	}
	,textWidth: null
	,get_textWidth: function() {
		if(this._text == null || this._text.length == 0) {
			return 0;
		}
		if(this.isComponentInvalid() == true) {
			this.validateComponent();
		}
		return this._textWidth;
	}
	,textHeight: null
	,get_textHeight: function() {
		var tmp = this._text == null || this._text.length == 0;
		if(this.isComponentInvalid() == true) {
			this.validateComponent();
		}
		return this._textHeight;
	}
	,get_multiline: function() {
		return this._displayData.multiline;
	}
	,set_multiline: function(value) {
		if(value == this._displayData.multiline) {
			return value;
		}
		this._displayData.multiline = value;
		this.invalidateComponent("style");
		return value;
	}
	,get_wordWrap: function() {
		return this._displayData.wordWrap;
	}
	,set_wordWrap: function(value) {
		if(value == this._displayData.wordWrap) {
			return value;
		}
		this._displayData.wordWrap = value;
		this.invalidateComponent("style");
		return value;
	}
	,get_hscrollPos: function() {
		return this._inputData.hscrollPos;
	}
	,set_hscrollPos: function(value) {
		if(value == this._inputData.hscrollPos) {
			return value;
		}
		this._inputData.hscrollPos = value;
		this.invalidateComponent("data");
		return value;
	}
	,hscrollMax: null
	,get_hscrollMax: function() {
		return this._inputData.hscrollMax;
	}
	,hscrollPageSize: null
	,get_hscrollPageSize: function() {
		return this._inputData.hscrollPageSize;
	}
	,get_vscrollPos: function() {
		return this._inputData.vscrollPos;
	}
	,set_vscrollPos: function(value) {
		if(value == this._inputData.vscrollPos) {
			return value;
		}
		this._inputData.vscrollPos = value;
		this.invalidateComponent("data");
		return value;
	}
	,vscrollMax: null
	,get_vscrollMax: function() {
		return this._inputData.vscrollMax;
	}
	,vscrollPageSize: null
	,get_vscrollPageSize: function() {
		return this._inputData.vscrollPageSize;
	}
	,isComponentInvalid: function(flag) {
		if(flag == null) {
			flag = "all";
		}
		if(this._isAllInvalid == true) {
			return true;
		}
		if(flag == "all") {
			var h = this._invalidationFlags.h;
			var value_h = h;
			var value_keys = Object.keys(h);
			var value_length = value_keys.length;
			var value_current = 0;
			while(value_current < value_length) {
				var value = value_h[value_keys[value_current++]];
				return true;
			}
			return false;
		}
		return Object.prototype.hasOwnProperty.call(this._invalidationFlags.h,flag);
	}
	,invalidateComponent: function(flag) {
		if(flag == null) {
			flag = "all";
		}
		if(flag == "all") {
			this._isAllInvalid = true;
			this.parentComponent.invalidateComponent("textInput");
		} else if(!Object.prototype.hasOwnProperty.call(this._invalidationFlags.h,flag)) {
			this._invalidationFlags.h[flag] = true;
			this.parentComponent.invalidateComponent("textInput");
		}
	}
	,_depth: null
	,get_depth: function() {
		return this._depth;
	}
	,set_depth: function(value) {
		if(this._depth == value) {
			return value;
		}
		this._depth = value;
		return value;
	}
	,updateComponentDisplay: function() {
	}
	,validateComponent: function(nextFrame) {
		if(nextFrame == null) {
			nextFrame = true;
		}
		if(this._isValidating == true || this.isComponentInvalid() == false) {
			return;
		}
		this._isValidating = true;
		this.validateComponentInternal();
		var h = this._invalidationFlags.h;
		var flag_h = h;
		var flag_keys = Object.keys(h);
		var flag_length = flag_keys.length;
		var flag_current = 0;
		while(flag_current < flag_length) {
			var flag = flag_keys[flag_current++];
			var _this = this._invalidationFlags;
			if(Object.prototype.hasOwnProperty.call(_this.h,flag)) {
				delete(_this.h[flag]);
			}
		}
		this._isAllInvalid = false;
		this._isValidating = false;
	}
	,validateComponentInternal: function() {
		var dataInvalid = this.isComponentInvalid("data");
		var styleInvalid = this.isComponentInvalid("style");
		var positionInvalid = this.isComponentInvalid("position");
		var displayInvalid = this.isComponentInvalid("display");
		var measureInvalid = this.isComponentInvalid("measure");
		if(dataInvalid) {
			this.validateData();
		}
		if(styleInvalid) {
			if(this.validateStyle()) {
				measureInvalid = true;
			}
		}
		if(positionInvalid) {
			this.validatePosition();
		}
		if(displayInvalid) {
			this.validateDisplay();
		}
		if(dataInvalid || displayInvalid || measureInvalid) {
			this.measureText();
		}
		if(dataInvalid) {
			if(this._inputData.onChangedCallback != null) {
				this._inputData.onChangedCallback();
			}
		}
	}
	,__class__: haxe_ui_core_TextInput
	,__properties__: $extend(haxe_ui_backend_TextInputImpl.prototype.__properties__,{set_depth:"set_depth",get_depth:"get_depth",get_vscrollPageSize:"get_vscrollPageSize",get_vscrollMax:"get_vscrollMax",set_vscrollPos:"set_vscrollPos",get_vscrollPos:"get_vscrollPos",get_hscrollPageSize:"get_hscrollPageSize",get_hscrollMax:"get_hscrollMax",set_hscrollPos:"set_hscrollPos",get_hscrollPos:"get_hscrollPos",set_wordWrap:"set_wordWrap",get_wordWrap:"get_wordWrap",set_multiline:"set_multiline",get_multiline:"get_multiline",get_textHeight:"get_textHeight",get_textWidth:"get_textWidth",set_height:"set_height",get_height:"get_height",set_width:"set_width",get_width:"get_width",set_top:"set_top",get_top:"get_top",set_left:"set_left",get_left:"get_left",set_password:"set_password",get_password:"get_password",set_htmlText:"set_htmlText",get_htmlText:"get_htmlText",set_text:"set_text",get_text:"get_text",get_data:"get_data",set_textStyle:"set_textStyle",get_textStyle:"get_textStyle",get_isComponentOffscreen:"get_isComponentOffscreen",set_id:"set_id",get_id:"get_id"})
});
var haxe_ui_core_TypeMap = function() { };
$hxClasses["haxe.ui.core.TypeMap"] = haxe_ui_core_TypeMap;
haxe_ui_core_TypeMap.__name__ = "haxe.ui.core.TypeMap";
haxe_ui_core_TypeMap.getTypeInfo = function(className,property) {
	var entry = haxe_ui_util_RTTI.getClassInfo(className);
	if(entry == null) {
		return null;
	}
	if(entry.properties == null) {
		return null;
	}
	var propInfo = entry.properties.h[property.toLowerCase()];
	if(propInfo == null) {
		return null;
	}
	return propInfo.propertyType;
};
var haxe_ui_data_DataSource = function(transformer) {
	this.onClear = null;
	this.onRemove = null;
	this.onUpdate = null;
	this.onInsert = null;
	this.onAdd = null;
	this.transformer = transformer;
	this._allowCallbacks = true;
	this._changed = false;
};
$hxClasses["haxe.ui.data.DataSource"] = haxe_ui_data_DataSource;
haxe_ui_data_DataSource.__name__ = "haxe.ui.data.DataSource";
haxe_ui_data_DataSource.fromString = function(data,type) {
	return null;
};
haxe_ui_data_DataSource.prototype = {
	onChange: null
	,transformer: null
	,_changed: null
	,onAdd: null
	,onInsert: null
	,onUpdate: null
	,onRemove: null
	,onClear: null
	,_allowCallbacks: null
	,get_allowCallbacks: function() {
		return this._allowCallbacks;
	}
	,set_allowCallbacks: function(value) {
		this._allowCallbacks = value;
		if(this._allowCallbacks == true && this._changed == true) {
			this._changed = false;
			if(this.onChange != null) {
				this.onChange();
			}
		}
		return value;
	}
	,get_data: function() {
		return this.handleGetData();
	}
	,set_data: function(value) {
		this.handleSetData(value);
		this.handleChanged();
		return value;
	}
	,size: null
	,get_size: function() {
		return this.handleGetSize();
	}
	,get: function(index) {
		var r = this.handleGetItem(index);
		if(js_Boot.__implements(r,haxe_ui_data_IDataItem)) {
			(js_Boot.__cast(r , haxe_ui_data_IDataItem)).onDataSourceChanged = this.onChange;
		}
		if(this.transformer != null) {
			r = this.transformer.transformFrom(r);
		}
		return r;
	}
	,indexOf: function(item) {
		if(this.transformer != null) {
			item = this.transformer.transformFrom(item);
		}
		return this.handleIndexOf(item);
	}
	,add: function(item) {
		var r = this.handleAddItem(item);
		this.handleChanged();
		if(this._allowCallbacks == true && this.onAdd != null) {
			this.onAdd(r);
		}
		return r;
	}
	,insert: function(index,item) {
		var r = this.handleInsert(index,item);
		this.handleChanged();
		if(this._allowCallbacks == true && this.onInsert != null) {
			this.onInsert(index,r);
		}
		return r;
	}
	,remove: function(item) {
		var r = this.handleRemoveItem(item);
		this.handleChanged();
		if(this._allowCallbacks == true && this.onRemove != null) {
			this.onRemove(r);
		}
		return r;
	}
	,removeAt: function(index) {
		var item = this.get(index);
		return this.remove(item);
	}
	,update: function(index,item) {
		var r = this.handleUpdateItem(index,item);
		this.handleChanged();
		if(this._allowCallbacks == true && this.onUpdate != null) {
			this.onUpdate(index,r);
		}
		return r;
	}
	,clear: function() {
		var o = this._allowCallbacks;
		this._allowCallbacks = false;
		this.handleClear();
		this._allowCallbacks = o;
		this.handleChanged();
		if(this._allowCallbacks == true && this.onClear != null) {
			this.onClear();
		}
	}
	,clearFilter: function() {
	}
	,filter: function(fn) {
	}
	,handleChanged: function() {
		this._changed = true;
		if(this._allowCallbacks == true && this.onChange != null) {
			this._changed = false;
			this.onChange();
		}
	}
	,sortCustom: function(fn) {
	}
	,sort: function(field,direction) {
		var _g = $bind(this,this.sortByFn);
		var field1 = field;
		var direction1 = direction;
		this.sortCustom(function(o1,o2) {
			return _g(o1,o2,field1,direction1);
		});
	}
	,sortByFn: function(o1,o2,field,direction) {
		var f1 = o1;
		var f2 = o2;
		if(field != null) {
			f1 = Reflect.field(o1,field);
			f2 = Reflect.field(o2,field);
		}
		if(f1 == null || f2 == null) {
			return 0;
		}
		f1 = Std.string(f1);
		f2 = Std.string(f2);
		if(direction == null) {
			direction = "asc";
		}
		var high = 1;
		var low = -1;
		if(direction == "desc") {
			high = -1;
			low = 1;
		}
		var alpha1 = f1.replace(haxe_ui_data_DataSource.regexAlpha.r,"");
		var alpha2 = f2.replace(haxe_ui_data_DataSource.regexAlpha.r,"");
		if(alpha1 == alpha2) {
			var numeric1 = Std.parseInt(f1.replace(haxe_ui_data_DataSource.regexNumeric.r,""));
			var numeric2 = Std.parseInt(f2.replace(haxe_ui_data_DataSource.regexNumeric.r,""));
			if(numeric1 == numeric2) {
				return 0;
			} else if(numeric1 > numeric2) {
				return high;
			} else {
				return low;
			}
		}
		if(alpha1 > alpha2) {
			return high;
		} else {
			return low;
		}
	}
	,handleGetSize: function() {
		return 0;
	}
	,handleGetItem: function(index) {
		return null;
	}
	,handleIndexOf: function(item) {
		return 0;
	}
	,handleAddItem: function(item) {
		return null;
	}
	,handleInsert: function(index,item) {
		return null;
	}
	,handleRemoveItem: function(item) {
		return null;
	}
	,handleGetData: function() {
		return null;
	}
	,handleSetData: function(v) {
	}
	,handleClear: function() {
		var cachedTransformer = this.transformer;
		this.transformer = null;
		while(this.get_size() > 0) this.remove(this.get(0));
		this.transformer = cachedTransformer;
	}
	,handleUpdateItem: function(index,item) {
		return null;
	}
	,clone: function() {
		var c = new haxe_ui_data_DataSource();
		return c;
	}
	,__class__: haxe_ui_data_DataSource
	,__properties__: {get_size:"get_size",set_data:"set_data",get_data:"get_data",set_allowCallbacks:"set_allowCallbacks",get_allowCallbacks:"get_allowCallbacks"}
};
var haxe_ui_data_ArrayDataSource = function(transformer) {
	this._filterFn = null;
	this._filteredArray = null;
	haxe_ui_data_DataSource.call(this,transformer);
	this._array = [];
};
$hxClasses["haxe.ui.data.ArrayDataSource"] = haxe_ui_data_ArrayDataSource;
haxe_ui_data_ArrayDataSource.__name__ = "haxe.ui.data.ArrayDataSource";
haxe_ui_data_ArrayDataSource.fromArray = function(source,transformer) {
	var ds = new haxe_ui_data_ArrayDataSource(transformer);
	ds._array = source;
	return ds;
};
haxe_ui_data_ArrayDataSource.__super__ = haxe_ui_data_DataSource;
haxe_ui_data_ArrayDataSource.prototype = $extend(haxe_ui_data_DataSource.prototype,{
	_array: null
	,_filteredArray: null
	,clearFilter: function() {
		if(this._filteredArray == null) {
			return;
		}
		this._filterFn = null;
		this._filteredArray = null;
		this.handleChanged();
	}
	,_filterFn: null
	,filter: function(fn) {
		this._filterFn = fn;
		this._filteredArray = [];
		var index = 0;
		var _g = 0;
		var _g1 = this._array;
		while(_g < _g1.length) {
			var item = _g1[_g];
			++_g;
			if(fn(index,item) == true) {
				this._filteredArray.push(item);
			}
			++index;
		}
		this.handleChanged();
	}
	,sortCustom: function(fn) {
		this._array.sort(fn);
		this.handleChanged();
	}
	,handleGetSize: function() {
		if(this._filteredArray != null) {
			return this._filteredArray.length;
		}
		return this._array.length;
	}
	,handleGetItem: function(index) {
		if(this._filteredArray != null) {
			return this._filteredArray[index];
		}
		return this._array[index];
	}
	,handleIndexOf: function(item) {
		if(this._filteredArray != null) {
			return this._filteredArray.indexOf(item);
		}
		return this._array.indexOf(item);
	}
	,handleAddItem: function(item) {
		this._array.push(item);
		if(this._filteredArray != null && this._filterFn != null) {
			if(this._filterFn(this._array.length - 1,item) == true) {
				this._filteredArray.push(item);
			}
		}
		return item;
	}
	,handleInsert: function(index,item) {
		this._array.splice(index,0,item);
		if(this._filteredArray != null && this._filterFn != null) {
			if(this._filterFn(index,item) == true) {
				this._filteredArray.push(item);
			}
		}
		return item;
	}
	,handleRemoveItem: function(item) {
		HxOverrides.remove(this._array,item);
		if(this._filteredArray != null) {
			HxOverrides.remove(this._filteredArray,item);
		}
		return item;
	}
	,handleClear: function() {
		while(this._array.length > 0) this._array.pop();
		if(this._filteredArray != null) {
			while(this._filteredArray.length > 0) this._filteredArray.pop();
		}
	}
	,handleGetData: function() {
		if(this._filteredArray != null) {
			return this._filteredArray;
		}
		return this._array;
	}
	,handleSetData: function(v) {
		this._array = v;
		if(this._filterFn != null) {
			this.filter(this._filterFn);
		}
	}
	,handleUpdateItem: function(index,item) {
		if(this._filteredArray != null) {
			return this._filteredArray[index] = item;
		}
		return this._array[index] = item;
	}
	,clone: function() {
		var c = new haxe_ui_data_ArrayDataSource();
		c._array = this._array.slice();
		if(this._filteredArray != null) {
			c._filteredArray = this._filteredArray.slice();
		}
		if(this._filterFn != null) {
			c._filterFn = this._filterFn;
		}
		return c;
	}
	,__class__: haxe_ui_data_ArrayDataSource
});
var haxe_ui_data_IDataItem = function() { };
$hxClasses["haxe.ui.data.IDataItem"] = haxe_ui_data_IDataItem;
haxe_ui_data_IDataItem.__name__ = "haxe.ui.data.IDataItem";
haxe_ui_data_IDataItem.__isInterface__ = true;
haxe_ui_data_IDataItem.prototype = {
	onDataSourceChanged: null
	,__class__: haxe_ui_data_IDataItem
};
var haxe_ui_data_transformation_IItemTransformer = function() { };
$hxClasses["haxe.ui.data.transformation.IItemTransformer"] = haxe_ui_data_transformation_IItemTransformer;
haxe_ui_data_transformation_IItemTransformer.__name__ = "haxe.ui.data.transformation.IItemTransformer";
haxe_ui_data_transformation_IItemTransformer.__isInterface__ = true;
haxe_ui_data_transformation_IItemTransformer.prototype = {
	transformFrom: null
	,__class__: haxe_ui_data_transformation_IItemTransformer
};
var haxe_ui_data_transformation_NativeTypeTransformer = function() {
};
$hxClasses["haxe.ui.data.transformation.NativeTypeTransformer"] = haxe_ui_data_transformation_NativeTypeTransformer;
haxe_ui_data_transformation_NativeTypeTransformer.__name__ = "haxe.ui.data.transformation.NativeTypeTransformer";
haxe_ui_data_transformation_NativeTypeTransformer.__interfaces__ = [haxe_ui_data_transformation_IItemTransformer];
haxe_ui_data_transformation_NativeTypeTransformer.prototype = {
	transformFrom: function(i) {
		var o = null;
		if(typeof(i) == "string") {
			o = { text : i, value : i};
		} else if(typeof(i) == "number" && ((i | 0) === i) || typeof(i) == "number" || typeof(i) == "boolean") {
			o = { value : i};
		} else {
			o = i;
		}
		return o;
	}
	,__class__: haxe_ui_data_transformation_NativeTypeTransformer
};
var haxe_ui_dragdrop_DragManager = function() {
	this._dragComponents = new haxe_ds_ObjectMap();
	this._mouseTargetToDragTarget = new haxe_ds_ObjectMap();
};
$hxClasses["haxe.ui.dragdrop.DragManager"] = haxe_ui_dragdrop_DragManager;
haxe_ui_dragdrop_DragManager.__name__ = "haxe.ui.dragdrop.DragManager";
haxe_ui_dragdrop_DragManager.__properties__ = {get_instance:"get_instance"};
haxe_ui_dragdrop_DragManager.get_instance = function() {
	if(haxe_ui_dragdrop_DragManager._instance == null) {
		haxe_ui_dragdrop_DragManager._instance = new haxe_ui_dragdrop_DragManager();
	}
	return haxe_ui_dragdrop_DragManager._instance;
};
haxe_ui_dragdrop_DragManager.prototype = {
	_dragComponents: null
	,_mouseTargetToDragTarget: null
	,_currentComponent: null
	,_currentOptions: null
	,_mouseOffset: null
	,getDragOptions: function(component) {
		var dragOptions = this._dragComponents.h[component.__id__];
		return dragOptions;
	}
	,registerDraggable: function(component,dragOptions) {
		if(this.isRegisteredDraggable(component)) {
			return null;
		}
		if(dragOptions == null) {
			dragOptions = { };
		}
		if(dragOptions.mouseTarget == null) {
			dragOptions.mouseTarget = component;
		}
		if(dragOptions.dragOffsetX == null) {
			dragOptions.dragOffsetX = 0;
		}
		if(dragOptions.dragOffsetY == null) {
			dragOptions.dragOffsetY = 0;
		}
		if(dragOptions.dragTolerance == null) {
			dragOptions.dragTolerance = haxe_ui_Toolkit.get_scale() | 0;
		}
		if(dragOptions.draggableStyleName == null) {
			dragOptions.draggableStyleName = "draggable";
		}
		if(dragOptions.draggingStyleName == null) {
			dragOptions.draggingStyleName = "dragging";
		}
		this._dragComponents.set(component,dragOptions);
		this._mouseTargetToDragTarget.set(dragOptions.mouseTarget,component);
		if(!dragOptions.mouseTarget.hasEvent("mousedown",$bind(this,this.onMouseDown))) {
			dragOptions.mouseTarget.registerEvent("mousedown",$bind(this,this.onMouseDown));
		}
		if(dragOptions.draggableStyleName != null) {
			dragOptions.mouseTarget.addClass(dragOptions.draggableStyleName);
		}
		return dragOptions;
	}
	,unregisterDraggable: function(component) {
		if(!this.isRegisteredDraggable(component)) {
			return;
		}
		var dragOptions = this.getDragOptions(component);
		if(dragOptions != null && dragOptions.mouseTarget != null) {
			dragOptions.mouseTarget.unregisterEvent("mousedown",$bind(this,this.onMouseDown));
			this._mouseTargetToDragTarget.remove(dragOptions.mouseTarget);
		}
		haxe_ui_core_Screen.get_instance().unregisterEvent("mousemove",$bind(this,this.onScreenCheckForDrag));
		haxe_ui_core_Screen.get_instance().unregisterEvent("mousemove",$bind(this,this.onScreenDrag));
		haxe_ui_core_Screen.get_instance().unregisterEvent("mouseup",$bind(this,this.onScreenMouseUp));
		this._dragComponents.remove(component);
	}
	,isRegisteredDraggable: function(component) {
		return this._dragComponents.h.__keys__[component.__id__] != null;
	}
	,onMouseDown: function(e) {
		e.screenX *= haxe_ui_Toolkit.get_scaleX();
		e.screenY *= haxe_ui_Toolkit.get_scaleY();
		this._currentComponent = this._mouseTargetToDragTarget.h[e.target.__id__];
		this._currentOptions = this.getDragOptions(this._currentComponent);
		this._mouseOffset = new haxe_ui_geom_Point(e.screenX - this._currentComponent.get_left(),e.screenY - this._currentComponent.get_top());
		haxe_ui_core_Screen.get_instance().registerEvent("mouseup",$bind(this,this.onScreenMouseUp));
		haxe_ui_core_Screen.get_instance().registerEvent("mousemove",$bind(this,this.onScreenCheckForDrag));
	}
	,onScreenCheckForDrag: function(e) {
		e.screenX *= haxe_ui_Toolkit.get_scaleX();
		e.screenY *= haxe_ui_Toolkit.get_scaleY();
		var x1 = e.screenX - this._currentComponent.get_left();
		var y1 = e.screenY - this._currentComponent.get_top();
		var x2 = this._mouseOffset.x;
		var y2 = this._mouseOffset.y;
		if(Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) > this._currentOptions.dragTolerance) {
			haxe_ui_core_Screen.get_instance().unregisterEvent("mousemove",$bind(this,this.onScreenCheckForDrag));
			haxe_ui_core_Screen.get_instance().registerEvent("mousemove",$bind(this,this.onScreenDrag));
			this._mouseOffset.x -= this._currentOptions.dragOffsetX;
			this._mouseOffset.y -= this._currentOptions.dragOffsetY;
			if(this._currentOptions.draggingStyleName != null) {
				this._currentComponent.addClass(this._currentOptions.draggingStyleName);
			}
			this._currentComponent.dispatch(new haxe_ui_events_DragEvent("dragStart"));
		}
	}
	,onScreenDrag: function(e) {
		e.screenX *= haxe_ui_Toolkit.get_scaleX();
		e.screenY *= haxe_ui_Toolkit.get_scaleY();
		var event = new haxe_ui_events_DragEvent("drag");
		if(this._currentOptions.dragBounds != null) {
			var v = e.screenX;
			var min = this._currentOptions.dragBounds.left + this._mouseOffset.x;
			var max = this._currentOptions.dragBounds.get_right() - this._currentComponent.get_actualComponentWidth() + this._mouseOffset.x;
			var boundX;
			if(v == null || isNaN(v)) {
				boundX = min;
			} else {
				if(min != null && v < min) {
					v = min;
				} else if(max != null && v > max) {
					v = max;
				}
				boundX = v;
			}
			var v = e.screenY;
			var min = this._currentOptions.dragBounds.top + this._mouseOffset.y;
			var max = this._currentOptions.dragBounds.get_bottom() - this._currentComponent.get_actualComponentHeight() + this._mouseOffset.y;
			var boundY;
			if(v == null || isNaN(v)) {
				boundY = min;
			} else {
				if(min != null && v < min) {
					v = min;
				} else if(max != null && v > max) {
					v = max;
				}
				boundY = v;
			}
			event.left = boundX - this._mouseOffset.x;
			event.top = boundY - this._mouseOffset.y;
		} else {
			var xpos = e.screenX;
			var ypos = e.screenY;
			event.left = xpos - this._mouseOffset.x;
			event.top = ypos - this._mouseOffset.y;
		}
		this._currentComponent.dispatch(event);
		if(event.canceled == true) {
			return;
		}
		this._currentComponent.moveComponent(event.left,event.top);
	}
	,onScreenMouseUp: function(e) {
		if(this._currentOptions.draggingStyleName != null) {
			this._currentComponent.removeClass(this._currentOptions.draggingStyleName);
		}
		this._currentComponent.dispatch(new haxe_ui_events_DragEvent("dragEnd"));
		this._currentComponent = null;
		this._currentOptions = null;
		this._mouseOffset.x = 0;
		this._mouseOffset.y = 0;
		haxe_ui_core_Screen.get_instance().unregisterEvent("mouseup",$bind(this,this.onScreenMouseUp));
		haxe_ui_core_Screen.get_instance().unregisterEvent("mousemove",$bind(this,this.onScreenCheckForDrag));
		haxe_ui_core_Screen.get_instance().unregisterEvent("mousemove",$bind(this,this.onScreenDrag));
	}
	,__class__: haxe_ui_dragdrop_DragManager
};
var haxe_ui_events_UIEvent = function(type,bubble,data) {
	if(bubble == null) {
		bubble = false;
	}
	this.relatedEvent = null;
	this.type = type;
	this.bubble = bubble;
	this.data = data;
	this.canceled = false;
};
$hxClasses["haxe.ui.events.UIEvent"] = haxe_ui_events_UIEvent;
haxe_ui_events_UIEvent.__name__ = "haxe.ui.events.UIEvent";
haxe_ui_events_UIEvent.__super__ = haxe_ui_backend_EventImpl;
haxe_ui_events_UIEvent.prototype = $extend(haxe_ui_backend_EventImpl.prototype,{
	bubble: null
	,type: null
	,target: null
	,data: null
	,canceled: null
	,relatedEvent: null
	,cancel: function() {
		haxe_ui_backend_EventImpl.prototype.cancel.call(this);
		this.canceled = true;
	}
	,clone: function() {
		var c = new haxe_ui_events_UIEvent(this.type);
		c.type = this.type;
		c.bubble = this.bubble;
		c.target = this.target;
		c.data = this.data;
		c.canceled = this.canceled;
		c.relatedEvent = this.relatedEvent;
		this.postClone(c);
		return c;
	}
	,copyFrom: function(c) {
	}
	,__class__: haxe_ui_events_UIEvent
});
var haxe_ui_events_ActionEvent = function(type,action,bubble,data) {
	if(bubble == null) {
		bubble = false;
	}
	haxe_ui_events_UIEvent.call(this,type,bubble,data);
	this.action = action;
};
$hxClasses["haxe.ui.events.ActionEvent"] = haxe_ui_events_ActionEvent;
haxe_ui_events_ActionEvent.__name__ = "haxe.ui.events.ActionEvent";
haxe_ui_events_ActionEvent.__super__ = haxe_ui_events_UIEvent;
haxe_ui_events_ActionEvent.prototype = $extend(haxe_ui_events_UIEvent.prototype,{
	action: null
	,clone: function() {
		var c = new haxe_ui_events_ActionEvent(this.type,this.action);
		c.type = this.type;
		c.bubble = this.bubble;
		c.target = this.target;
		c.data = this.data;
		c.canceled = this.canceled;
		c.action = this.action;
		this.postClone(c);
		return c;
	}
	,__class__: haxe_ui_events_ActionEvent
});
var haxe_ui_events_AnimationEvent = function(type) {
	haxe_ui_events_UIEvent.call(this,type);
};
$hxClasses["haxe.ui.events.AnimationEvent"] = haxe_ui_events_AnimationEvent;
haxe_ui_events_AnimationEvent.__name__ = "haxe.ui.events.AnimationEvent";
haxe_ui_events_AnimationEvent.__super__ = haxe_ui_events_UIEvent;
haxe_ui_events_AnimationEvent.prototype = $extend(haxe_ui_events_UIEvent.prototype,{
	clone: function() {
		var c = new haxe_ui_events_AnimationEvent(this.type);
		return c;
	}
	,__class__: haxe_ui_events_AnimationEvent
});
var haxe_ui_events_DragEvent = function(type,bubble,data) {
	this.top = 0;
	this.left = 0;
	haxe_ui_events_UIEvent.call(this,type,bubble,data);
};
$hxClasses["haxe.ui.events.DragEvent"] = haxe_ui_events_DragEvent;
haxe_ui_events_DragEvent.__name__ = "haxe.ui.events.DragEvent";
haxe_ui_events_DragEvent.__super__ = haxe_ui_events_UIEvent;
haxe_ui_events_DragEvent.prototype = $extend(haxe_ui_events_UIEvent.prototype,{
	left: null
	,top: null
	,clone: function() {
		var c = new haxe_ui_events_DragEvent(this.type);
		c.type = this.type;
		c.bubble = this.bubble;
		c.target = this.target;
		c.data = this.data;
		c.canceled = this.canceled;
		c.left = this.left;
		c.top = this.top;
		this.postClone(c);
		return c;
	}
	,copyFrom: function(c) {
		var d = js_Boot.__cast(c , haxe_ui_events_DragEvent);
		this.left = d.left;
		this.top = d.top;
	}
	,__class__: haxe_ui_events_DragEvent
});
var haxe_ui_events_FocusEvent = function(type) {
	haxe_ui_events_UIEvent.call(this,type);
};
$hxClasses["haxe.ui.events.FocusEvent"] = haxe_ui_events_FocusEvent;
haxe_ui_events_FocusEvent.__name__ = "haxe.ui.events.FocusEvent";
haxe_ui_events_FocusEvent.__super__ = haxe_ui_events_UIEvent;
haxe_ui_events_FocusEvent.prototype = $extend(haxe_ui_events_UIEvent.prototype,{
	clone: function() {
		var c = new haxe_ui_events_FocusEvent(this.type);
		c.type = this.type;
		c.target = this.target;
		this.postClone(c);
		return c;
	}
	,__class__: haxe_ui_events_FocusEvent
});
var haxe_ui_events_ItemEvent = function(type,bubble,data) {
	this.itemIndex = -1;
	this.sourceEvent = null;
	this.source = null;
	haxe_ui_events_UIEvent.call(this,type,bubble,data);
};
$hxClasses["haxe.ui.events.ItemEvent"] = haxe_ui_events_ItemEvent;
haxe_ui_events_ItemEvent.__name__ = "haxe.ui.events.ItemEvent";
haxe_ui_events_ItemEvent.__super__ = haxe_ui_events_UIEvent;
haxe_ui_events_ItemEvent.prototype = $extend(haxe_ui_events_UIEvent.prototype,{
	source: null
	,sourceEvent: null
	,itemIndex: null
	,clone: function() {
		var c = new haxe_ui_events_ItemEvent(this.type);
		c.source = this.source;
		c.sourceEvent = this.sourceEvent;
		c.itemIndex = this.itemIndex;
		c.type = this.type;
		c.bubble = this.bubble;
		c.target = this.target;
		c.data = this.data;
		c.canceled = this.canceled;
		this.postClone(c);
		return c;
	}
	,__class__: haxe_ui_events_ItemEvent
});
var haxe_ui_events_KeyboardEvent = function(type) {
	haxe_ui_events_UIEvent.call(this,type);
};
$hxClasses["haxe.ui.events.KeyboardEvent"] = haxe_ui_events_KeyboardEvent;
haxe_ui_events_KeyboardEvent.__name__ = "haxe.ui.events.KeyboardEvent";
haxe_ui_events_KeyboardEvent.__super__ = haxe_ui_events_UIEvent;
haxe_ui_events_KeyboardEvent.prototype = $extend(haxe_ui_events_UIEvent.prototype,{
	keyCode: null
	,altKey: null
	,ctrlKey: null
	,shiftKey: null
	,clone: function() {
		var c = new haxe_ui_events_KeyboardEvent(this.type);
		c.type = this.type;
		c.target = this.target;
		c.keyCode = this.keyCode;
		c.altKey = this.altKey;
		c.ctrlKey = this.ctrlKey;
		c.shiftKey = this.shiftKey;
		return c;
	}
	,__class__: haxe_ui_events_KeyboardEvent
});
var haxe_ui_events_MouseEvent = function(type) {
	haxe_ui_events_UIEvent.call(this,type);
};
$hxClasses["haxe.ui.events.MouseEvent"] = haxe_ui_events_MouseEvent;
haxe_ui_events_MouseEvent.__name__ = "haxe.ui.events.MouseEvent";
haxe_ui_events_MouseEvent.__super__ = haxe_ui_events_UIEvent;
haxe_ui_events_MouseEvent.prototype = $extend(haxe_ui_events_UIEvent.prototype,{
	screenX: null
	,screenY: null
	,buttonDown: null
	,delta: null
	,touchEvent: null
	,ctrlKey: null
	,shiftKey: null
	,localX: null
	,get_localX: function() {
		if(this.target == null) {
			return null;
		}
		return (this.screenX * haxe_ui_Toolkit.get_scaleX() - this.target.get_screenLeft()) / haxe_ui_Toolkit.get_scaleX();
	}
	,localY: null
	,get_localY: function() {
		if(this.target == null) {
			return null;
		}
		return (this.screenY * haxe_ui_Toolkit.get_scaleY() - this.target.get_screenTop()) / haxe_ui_Toolkit.get_scaleY();
	}
	,clone: function() {
		var c = new haxe_ui_events_MouseEvent(this.type);
		c.type = this.type;
		c.target = this.target;
		c.screenX = this.screenX;
		c.screenY = this.screenY;
		c.buttonDown = this.buttonDown;
		c.delta = this.delta;
		c.touchEvent = this.touchEvent;
		c.ctrlKey = this.ctrlKey;
		c.shiftKey = this.shiftKey;
		this.postClone(c);
		return c;
	}
	,__class__: haxe_ui_events_MouseEvent
	,__properties__: {get_localY:"get_localY",get_localX:"get_localX"}
});
var haxe_ui_events_ScrollEvent = function(type) {
	haxe_ui_events_UIEvent.call(this,type);
};
$hxClasses["haxe.ui.events.ScrollEvent"] = haxe_ui_events_ScrollEvent;
haxe_ui_events_ScrollEvent.__name__ = "haxe.ui.events.ScrollEvent";
haxe_ui_events_ScrollEvent.__super__ = haxe_ui_events_UIEvent;
haxe_ui_events_ScrollEvent.prototype = $extend(haxe_ui_events_UIEvent.prototype,{
	clone: function() {
		var c = new haxe_ui_events_ScrollEvent(this.type);
		c.type = this.type;
		c.target = this.target;
		this.postClone(c);
		return c;
	}
	,__class__: haxe_ui_events_ScrollEvent
});
var haxe_ui_events_SortEvent = function(type,bubble,data) {
	haxe_ui_events_UIEvent.call(this,type,bubble,data);
};
$hxClasses["haxe.ui.events.SortEvent"] = haxe_ui_events_SortEvent;
haxe_ui_events_SortEvent.__name__ = "haxe.ui.events.SortEvent";
haxe_ui_events_SortEvent.__super__ = haxe_ui_events_UIEvent;
haxe_ui_events_SortEvent.prototype = $extend(haxe_ui_events_UIEvent.prototype,{
	direction: null
	,clone: function() {
		var c = new haxe_ui_events_SortEvent(this.type);
		c.type = this.type;
		c.bubble = this.bubble;
		c.target = this.target;
		c.data = this.data;
		c.canceled = this.canceled;
		c.direction = this.direction;
		this.postClone(c);
		return c;
	}
	,__class__: haxe_ui_events_SortEvent
});
var haxe_ui_events_ThemeEvent = function(type,bubble,data) {
	haxe_ui_events_UIEvent.call(this,type,bubble,data);
};
$hxClasses["haxe.ui.events.ThemeEvent"] = haxe_ui_events_ThemeEvent;
haxe_ui_events_ThemeEvent.__name__ = "haxe.ui.events.ThemeEvent";
haxe_ui_events_ThemeEvent.__super__ = haxe_ui_events_UIEvent;
haxe_ui_events_ThemeEvent.prototype = $extend(haxe_ui_events_UIEvent.prototype,{
	__class__: haxe_ui_events_ThemeEvent
});
var haxe_ui_events_ValidationEvent = function(type) {
	haxe_ui_events_UIEvent.call(this,type);
};
$hxClasses["haxe.ui.events.ValidationEvent"] = haxe_ui_events_ValidationEvent;
haxe_ui_events_ValidationEvent.__name__ = "haxe.ui.events.ValidationEvent";
haxe_ui_events_ValidationEvent.__super__ = haxe_ui_events_UIEvent;
haxe_ui_events_ValidationEvent.prototype = $extend(haxe_ui_events_UIEvent.prototype,{
	clone: function() {
		var c = new haxe_ui_events_ValidationEvent(this.type);
		c.type = this.type;
		c.target = this.target;
		this.postClone(c);
		return c;
	}
	,__class__: haxe_ui_events_ValidationEvent
});
var haxe_ui_filters_Filter = function() {
};
$hxClasses["haxe.ui.filters.Filter"] = haxe_ui_filters_Filter;
haxe_ui_filters_Filter.__name__ = "haxe.ui.filters.Filter";
haxe_ui_filters_Filter.prototype = {
	__class__: haxe_ui_filters_Filter
};
var haxe_ui_filters_Blur = function() {
	haxe_ui_filters_Filter.call(this);
};
$hxClasses["haxe.ui.filters.Blur"] = haxe_ui_filters_Blur;
haxe_ui_filters_Blur.__name__ = "haxe.ui.filters.Blur";
haxe_ui_filters_Blur.__super__ = haxe_ui_filters_Filter;
haxe_ui_filters_Blur.prototype = $extend(haxe_ui_filters_Filter.prototype,{
	amount: null
	,__class__: haxe_ui_filters_Blur
});
var haxe_ui_filters_DropShadow = function() {
	haxe_ui_filters_Filter.call(this);
};
$hxClasses["haxe.ui.filters.DropShadow"] = haxe_ui_filters_DropShadow;
haxe_ui_filters_DropShadow.__name__ = "haxe.ui.filters.DropShadow";
haxe_ui_filters_DropShadow.__super__ = haxe_ui_filters_Filter;
haxe_ui_filters_DropShadow.prototype = $extend(haxe_ui_filters_Filter.prototype,{
	distance: null
	,angle: null
	,color: null
	,alpha: null
	,blurX: null
	,blurY: null
	,strength: null
	,quality: null
	,inner: null
	,__class__: haxe_ui_filters_DropShadow
});
var haxe_ui_filters_FilterParser = function() { };
$hxClasses["haxe.ui.filters.FilterParser"] = haxe_ui_filters_FilterParser;
haxe_ui_filters_FilterParser.__name__ = "haxe.ui.filters.FilterParser";
haxe_ui_filters_FilterParser.parseFilter = function(filterDetails) {
	var filter = null;
	if(filterDetails[0] == "drop-shadow") {
		filter = haxe_ui_filters_FilterParser.parseDropShadow(filterDetails);
	} else if(filterDetails[0] == "blur") {
		filter = haxe_ui_filters_FilterParser.parseBlur(filterDetails);
	} else if(filterDetails[0] == "outline") {
		filter = haxe_ui_filters_FilterParser.parseOutline(filterDetails);
	} else if(filterDetails[0] == "grayscale") {
		filter = haxe_ui_filters_FilterParser.parseGrayscale(filterDetails);
	}
	return filter;
};
haxe_ui_filters_FilterParser.parseDropShadow = function(filterDetails) {
	if(filterDetails == null || filterDetails.length == 0) {
		return null;
	}
	var copy = filterDetails.slice();
	haxe_ui_filters_FilterParser.buildDefaults();
	var filterName = copy[0];
	HxOverrides.remove(copy,filterName);
	copy = haxe_ui_filters_FilterParser.copyFilterDefaults(filterName,copy);
	var dropShadow = new haxe_ui_filters_DropShadow();
	dropShadow.distance = copy[0];
	dropShadow.angle = copy[1];
	dropShadow.color = copy[2];
	dropShadow.alpha = copy[3];
	dropShadow.blurX = copy[4];
	dropShadow.blurY = copy[5];
	dropShadow.strength = copy[6];
	dropShadow.quality = copy[7];
	dropShadow.inner = copy[8];
	return dropShadow;
};
haxe_ui_filters_FilterParser.parseBlur = function(filterDetails) {
	if(filterDetails == null || filterDetails.length == 0) {
		return null;
	}
	var copy = filterDetails.slice();
	haxe_ui_filters_FilterParser.buildDefaults();
	var filterName = copy[0];
	HxOverrides.remove(copy,filterName);
	copy = haxe_ui_filters_FilterParser.copyFilterDefaults(filterName,copy);
	var blur = new haxe_ui_filters_Blur();
	blur.amount = copy[0];
	return blur;
};
haxe_ui_filters_FilterParser.parseOutline = function(filterDetails) {
	if(filterDetails == null || filterDetails.length == 0) {
		return null;
	}
	var copy = filterDetails.slice();
	haxe_ui_filters_FilterParser.buildDefaults();
	var filterName = copy[0];
	HxOverrides.remove(copy,filterName);
	copy = haxe_ui_filters_FilterParser.copyFilterDefaults(filterName,copy);
	var outline = new haxe_ui_filters_Outline();
	outline.color = copy[0];
	outline.size = copy[1];
	return outline;
};
haxe_ui_filters_FilterParser.copyFilterDefaults = function(filterName,params) {
	var copy = [];
	var defaultParams = haxe_ui_filters_FilterParser.filterParamDefaults.h[filterName];
	if(defaultParams != null) {
		var _g = 0;
		while(_g < defaultParams.length) {
			var p = defaultParams[_g];
			++_g;
			copy.push(p);
		}
	}
	if(params != null) {
		var n = 0;
		var _g = 0;
		while(_g < params.length) {
			var p = params[_g];
			++_g;
			copy[n] = p;
			++n;
		}
	}
	return copy;
};
haxe_ui_filters_FilterParser.parseGrayscale = function(filterDetails) {
	if(filterDetails == null || filterDetails.length == 0) {
		return null;
	}
	var copy = filterDetails.slice();
	haxe_ui_filters_FilterParser.buildDefaults();
	var filterName = copy[0];
	HxOverrides.remove(copy,filterName);
	copy = haxe_ui_filters_FilterParser.copyFilterDefaults(filterName,copy);
	var grayscale = new haxe_ui_filters_Grayscale();
	grayscale.amount = copy[0];
	return grayscale;
};
haxe_ui_filters_FilterParser.buildDefaults = function() {
	if(haxe_ui_filters_FilterParser.filterParamDefaults != null) {
		return;
	}
	haxe_ui_filters_FilterParser.filterParamDefaults = new haxe_ds_StringMap();
	var v = [];
	haxe_ui_filters_FilterParser.filterParamDefaults.h["drop-shadow"] = v;
	var this1 = haxe_ui_filters_FilterParser.filterParamDefaults;
	var v = haxe_ui_filters_FilterParser.filterParamDefaults.h["drop-shadow"].concat([4,45,0,1,4,4,1,1,false,false,false]);
	this1.h["drop-shadow"] = v;
	var v = [];
	haxe_ui_filters_FilterParser.filterParamDefaults.h["blur"] = v;
	var this1 = haxe_ui_filters_FilterParser.filterParamDefaults;
	var v = haxe_ui_filters_FilterParser.filterParamDefaults.h["blur"].concat([1]);
	this1.h["blur"] = v;
	var v = [];
	haxe_ui_filters_FilterParser.filterParamDefaults.h["outline"] = v;
	var this1 = haxe_ui_filters_FilterParser.filterParamDefaults;
	var v = haxe_ui_filters_FilterParser.filterParamDefaults.h["outline"].concat([0,1]);
	this1.h["outline"] = v;
	var v = [];
	haxe_ui_filters_FilterParser.filterParamDefaults.h["grayscale"] = v;
	var this1 = haxe_ui_filters_FilterParser.filterParamDefaults;
	var v = haxe_ui_filters_FilterParser.filterParamDefaults.h["grayscale"].concat([100]);
	this1.h["grayscale"] = v;
};
var haxe_ui_filters_Grayscale = function() {
	haxe_ui_filters_Filter.call(this);
};
$hxClasses["haxe.ui.filters.Grayscale"] = haxe_ui_filters_Grayscale;
haxe_ui_filters_Grayscale.__name__ = "haxe.ui.filters.Grayscale";
haxe_ui_filters_Grayscale.__super__ = haxe_ui_filters_Filter;
haxe_ui_filters_Grayscale.prototype = $extend(haxe_ui_filters_Filter.prototype,{
	amount: null
	,__class__: haxe_ui_filters_Grayscale
});
var haxe_ui_filters_Outline = function() {
	haxe_ui_filters_Filter.call(this);
};
$hxClasses["haxe.ui.filters.Outline"] = haxe_ui_filters_Outline;
haxe_ui_filters_Outline.__name__ = "haxe.ui.filters.Outline";
haxe_ui_filters_Outline.__super__ = haxe_ui_filters_Filter;
haxe_ui_filters_Outline.prototype = $extend(haxe_ui_filters_Filter.prototype,{
	color: null
	,size: null
	,__class__: haxe_ui_filters_Outline
});
var haxe_ui_focus_FocusManager = function() {
	this._views = [];
	this._focusInfo = new haxe_ds_ObjectMap();
	haxe_ui_core_Screen.get_instance().registerEvent("mousedown",$bind(this,this.onScreenMouseDown));
};
$hxClasses["haxe.ui.focus.FocusManager"] = haxe_ui_focus_FocusManager;
haxe_ui_focus_FocusManager.__name__ = "haxe.ui.focus.FocusManager";
haxe_ui_focus_FocusManager.__properties__ = {get_instance:"get_instance"};
haxe_ui_focus_FocusManager.get_instance = function() {
	if(haxe_ui_focus_FocusManager._instance == null) {
		haxe_ui_focus_FocusManager._instance = new haxe_ui_focus_FocusManager();
	}
	return haxe_ui_focus_FocusManager._instance;
};
haxe_ui_focus_FocusManager.prototype = {
	_views: null
	,_focusInfo: null
	,onScreenMouseDown: function(event) {
		var list = haxe_ui_core_Screen.get_instance().findComponentsUnderPoint(event.screenX,event.screenY);
		var _g = 0;
		while(_g < list.length) {
			var l = list[_g];
			++_g;
			if(js_Boot.__implements(l,haxe_ui_focus_IFocusable)) {
				return;
			}
		}
		this.set_focus(null);
	}
	,pushView: function(component) {
		this._views.push(component);
		var info = this._focusInfo.h[component.__id__];
		if(info == null) {
			this._focusInfo.set(component,{ view : component, currentFocus : null});
		}
	}
	,hasView: function(component) {
		return this._views.indexOf(component) != -1;
	}
	,popView: function() {
		var c = this._views.pop();
		this.removeView(c);
	}
	,removeView: function(component) {
		HxOverrides.remove(this._views,component);
		this._focusInfo.remove(component);
	}
	,focusInfo: null
	,get_focusInfo: function() {
		if(this._views.length == 0) {
			return null;
		}
		var c = this._views[this._views.length - 1];
		var info = this._focusInfo.h[c.__id__];
		return info;
	}
	,get_focus: function() {
		if(this.get_focusInfo() == null) {
			return null;
		}
		return this.get_focusInfo().currentFocus;
	}
	,set_focus: function(value) {
		if(value != null && js_Boot.__implements(value,haxe_ui_focus_IFocusable) == false) {
			throw haxe_Exception.thrown("Component does not implement IFocusable");
		}
		if(this.get_focusInfo() != null && this.get_focusInfo().currentFocus != null && this.get_focusInfo().currentFocus != value) {
			this.get_focusInfo().currentFocus.set_focus(false);
			this.get_focusInfo().currentFocus = null;
		}
		if(value != null) {
			this.get_focusInfo().currentFocus = value;
			this.get_focusInfo().currentFocus.set_focus(true);
		}
		haxe_ui_Toolkit.get_screen().set_focus(value);
		if(this.get_focusInfo() == null) {
			return value;
		}
		return this.get_focusInfo().currentFocus;
	}
	,focusNext: function() {
		if(this._views.length == 0) {
			return null;
		}
		var list = [];
		var info = this.get_focusInfo();
		var currentFocus = this.buildFocusableList(info.view,list);
		var index = -1;
		if(currentFocus != null) {
			index = list.indexOf(currentFocus);
		}
		var nextIndex = index + 1;
		if(nextIndex > list.length - 1) {
			nextIndex = 0;
		}
		var nextFocus = list[nextIndex];
		this.set_focus(nextFocus);
		return nextFocus;
	}
	,focusPrev: function() {
		if(this._views.length == 0) {
			return null;
		}
		var list = [];
		var info = this.get_focusInfo();
		var currentFocus = this.buildFocusableList(info.view,list);
		var index = -1;
		if(currentFocus != null) {
			index = list.indexOf(currentFocus);
		}
		var prevIndex = index - 1;
		if(prevIndex < 0) {
			prevIndex = list.length - 1;
		}
		var prevFocus = list[prevIndex];
		this.set_focus(prevFocus);
		return prevFocus;
	}
	,buildFocusableList: function(c,list) {
		var currentFocus = null;
		if(c.get_hidden() == true) {
			return null;
		}
		if(js_Boot.__implements(c,haxe_ui_focus_IFocusable)) {
			var f = c;
			if(f.get_allowFocus() == true) {
				if(f.get_focus() == true) {
					currentFocus = f;
				}
				list.push(f);
			}
		}
		var childList = c._children == null ? [] : c._children;
		childList.sort(function(c1,c2) {
			return c1.componentTabIndex - c2.componentTabIndex;
		});
		var _g = 0;
		while(_g < childList.length) {
			var child = childList[_g];
			++_g;
			var f = this.buildFocusableList(child,list);
			if(f != null) {
				currentFocus = f;
			}
		}
		return currentFocus;
	}
	,__class__: haxe_ui_focus_FocusManager
	,__properties__: {set_focus:"set_focus",get_focus:"get_focus",get_focusInfo:"get_focusInfo"}
};
var haxe_ui_geom_Point = function(x,y) {
	if(y == null) {
		y = 0;
	}
	if(x == null) {
		x = 0;
	}
	this.x = x;
	this.y = y;
};
$hxClasses["haxe.ui.geom.Point"] = haxe_ui_geom_Point;
haxe_ui_geom_Point.__name__ = "haxe.ui.geom.Point";
haxe_ui_geom_Point.prototype = {
	x: null
	,y: null
	,__class__: haxe_ui_geom_Point
};
var haxe_ui_geom_Rectangle = function(left,top,width,height) {
	if(height == null) {
		height = 0;
	}
	if(width == null) {
		width = 0;
	}
	if(top == null) {
		top = 0;
	}
	if(left == null) {
		left = 0;
	}
	this._intersectionCache = null;
	this.left = left;
	this.top = top;
	this.width = width;
	this.height = height;
};
$hxClasses["haxe.ui.geom.Rectangle"] = haxe_ui_geom_Rectangle;
haxe_ui_geom_Rectangle.__name__ = "haxe.ui.geom.Rectangle";
haxe_ui_geom_Rectangle.prototype = {
	left: null
	,top: null
	,width: null
	,height: null
	,set: function(left,top,width,height) {
		if(height == null) {
			height = 0;
		}
		if(width == null) {
			width = 0;
		}
		if(top == null) {
			top = 0;
		}
		if(left == null) {
			left = 0;
		}
		this.left = left;
		this.top = top;
		this.width = width;
		this.height = height;
	}
	,get_right: function() {
		return this.left + this.width;
	}
	,set_right: function(value) {
		this.width = value - this.left;
		return value;
	}
	,get_bottom: function() {
		return this.top + this.height;
	}
	,set_bottom: function(value) {
		this.height = value - this.top;
		return value;
	}
	,inflate: function(dx,dy) {
		this.left -= dx;
		this.width += dx * 2;
		this.top -= dy;
		this.height += dy * 2;
	}
	,containsPoint: function(x,y) {
		if(x >= this.left && x < this.left + this.width && y >= this.top && y < this.top + this.height) {
			return true;
		}
		return false;
	}
	,containsRect: function(rect) {
		if(rect.width <= 0 || rect.height <= 0) {
			if(rect.left > this.left && rect.top > this.top && rect.get_right() < this.get_right()) {
				return rect.get_bottom() < this.get_bottom();
			} else {
				return false;
			}
		} else if(rect.left >= this.left && rect.top >= this.top && rect.get_right() <= this.get_right()) {
			return rect.get_bottom() <= this.get_bottom();
		} else {
			return false;
		}
	}
	,intersects: function(rect) {
		var x0 = this.left < rect.left ? rect.left : this.left;
		var x1 = this.get_right() > rect.get_right() ? rect.get_right() : this.get_right();
		if(x1 <= x0) {
			return false;
		}
		var y0 = this.top < rect.top ? rect.top : this.top;
		var y1 = this.get_bottom() > rect.get_bottom() ? rect.get_bottom() : this.get_bottom();
		return y1 > y0;
	}
	,_intersectionCache: null
	,intersection: function(rect,noAlloc) {
		if(noAlloc == null) {
			noAlloc = true;
		}
		if(noAlloc == true && this._intersectionCache == null) {
			this._intersectionCache = new haxe_ui_geom_Rectangle();
		}
		var x0 = this.left < rect.left ? rect.left : this.left;
		var x1 = this.get_right() > rect.get_right() ? rect.get_right() : this.get_right();
		if(x1 <= x0) {
			if(noAlloc == true) {
				this._intersectionCache.set();
				return this._intersectionCache;
			} else {
				return new haxe_ui_geom_Rectangle();
			}
		}
		var y0 = this.top < rect.top ? rect.top : this.top;
		var y1 = this.get_bottom() > rect.get_bottom() ? rect.get_bottom() : this.get_bottom();
		if(y1 <= y0) {
			if(noAlloc == true) {
				this._intersectionCache.set();
				return this._intersectionCache;
			} else {
				return new haxe_ui_geom_Rectangle();
			}
		}
		var r = null;
		if(noAlloc == true) {
			r = this._intersectionCache;
		} else {
			r = new haxe_ui_geom_Rectangle();
		}
		r.set(x0,y0,x1 - x0,y1 - y0);
		return r;
	}
	,toInts: function() {
		this.left = this.left | 0;
		this.top = this.top | 0;
		this.width = this.width | 0;
		this.height = this.height | 0;
	}
	,copy: function() {
		return new haxe_ui_geom_Rectangle(this.left,this.top,this.width,this.height);
	}
	,toString: function() {
		return "{left: " + this.left + ", top: " + this.top + ", bottom: " + this.get_bottom() + ", right: " + this.get_right() + ", width: " + this.width + ", height: " + this.height + "}";
	}
	,__class__: haxe_ui_geom_Rectangle
	,__properties__: {set_bottom:"set_bottom",get_bottom:"get_bottom",set_right:"set_right",get_right:"get_right"}
};
var haxe_ui_geom_Size = function(width,height) {
	if(height == null) {
		height = 0;
	}
	if(width == null) {
		width = 0;
	}
	this.width = width;
	this.height = height;
};
$hxClasses["haxe.ui.geom.Size"] = haxe_ui_geom_Size;
haxe_ui_geom_Size.__name__ = "haxe.ui.geom.Size";
haxe_ui_geom_Size.prototype = {
	width: null
	,height: null
	,round: function() {
		this.width = Math.round(this.width);
		this.height = Math.round(this.height);
	}
	,toString: function() {
		return "[" + this.width + "x" + this.height + "]";
	}
	,__class__: haxe_ui_geom_Size
};
var haxe_ui_geom_Slice9 = function() { };
$hxClasses["haxe.ui.geom.Slice9"] = haxe_ui_geom_Slice9;
haxe_ui_geom_Slice9.__name__ = "haxe.ui.geom.Slice9";
haxe_ui_geom_Slice9.buildRects = function(w,h,bitmapWidth,bitmapHeight,slice) {
	var srcRects = haxe_ui_geom_Slice9.buildSrcRects(bitmapWidth,bitmapHeight,slice);
	var dstRects = haxe_ui_geom_Slice9.buildDstRects(w,h,srcRects);
	return { src : srcRects, dst : dstRects};
};
haxe_ui_geom_Slice9.buildSrcRects = function(bitmapWidth,bitmapHeight,slice) {
	var x1 = slice.left;
	var y1 = slice.top;
	var x2 = slice.get_right();
	var y2 = slice.get_bottom();
	var srcRects = [];
	srcRects.push(new haxe_ui_geom_Rectangle(0,0,x1,y1));
	srcRects.push(new haxe_ui_geom_Rectangle(x1,0,x2 - x1,y1));
	srcRects.push(new haxe_ui_geom_Rectangle(x2,0,bitmapWidth - x2,y1));
	srcRects.push(new haxe_ui_geom_Rectangle(0,y1,x1,y2 - y1));
	srcRects.push(new haxe_ui_geom_Rectangle(x1,y1,x2 - x1,y2 - y1));
	srcRects.push(new haxe_ui_geom_Rectangle(x2,y1,bitmapWidth - x2,y2 - y1));
	srcRects.push(new haxe_ui_geom_Rectangle(0,y2,x1,bitmapHeight - y2));
	srcRects.push(new haxe_ui_geom_Rectangle(x1,y2,x2 - x1,bitmapHeight - y2));
	srcRects.push(new haxe_ui_geom_Rectangle(x2,y2,bitmapWidth - x2,bitmapHeight - y2));
	return srcRects;
};
haxe_ui_geom_Slice9.buildDstRects = function(w,h,srcRects) {
	var dstRects = [];
	dstRects.push(new haxe_ui_geom_Rectangle(0,0,srcRects[0].width,srcRects[0].height));
	dstRects.push(new haxe_ui_geom_Rectangle(srcRects[0].width,0,w - srcRects[0].width - srcRects[2].width,srcRects[1].height));
	dstRects.push(new haxe_ui_geom_Rectangle(w - srcRects[2].width,0,srcRects[2].width,srcRects[2].height));
	dstRects.push(new haxe_ui_geom_Rectangle(0,srcRects[0].height,srcRects[3].width,h - srcRects[0].height - srcRects[6].height));
	dstRects.push(new haxe_ui_geom_Rectangle(srcRects[3].width,srcRects[0].height,w - srcRects[3].width - srcRects[5].width,h - srcRects[1].height - srcRects[7].height));
	dstRects.push(new haxe_ui_geom_Rectangle(w - srcRects[5].width,srcRects[2].height,srcRects[5].width,h - srcRects[2].height - srcRects[8].height));
	dstRects.push(new haxe_ui_geom_Rectangle(0,h - srcRects[6].height,srcRects[6].width,srcRects[6].height));
	dstRects.push(new haxe_ui_geom_Rectangle(srcRects[6].width,h - srcRects[7].height,w - srcRects[6].width - srcRects[8].width,srcRects[7].height));
	dstRects.push(new haxe_ui_geom_Rectangle(w - srcRects[8].width,h - srcRects[8].height,srcRects[8].width,srcRects[8].height));
	return dstRects;
};
var haxe_ui_layouts_AbsoluteLayout = function() {
	haxe_ui_layouts_DefaultLayout.call(this);
};
$hxClasses["haxe.ui.layouts.AbsoluteLayout"] = haxe_ui_layouts_AbsoluteLayout;
haxe_ui_layouts_AbsoluteLayout.__name__ = "haxe.ui.layouts.AbsoluteLayout";
haxe_ui_layouts_AbsoluteLayout.__super__ = haxe_ui_layouts_DefaultLayout;
haxe_ui_layouts_AbsoluteLayout.prototype = $extend(haxe_ui_layouts_DefaultLayout.prototype,{
	repositionChildren: function() {
	}
	,__class__: haxe_ui_layouts_AbsoluteLayout
});
var haxe_ui_layouts_DelegateLayout = function(size) {
	haxe_ui_layouts_DefaultLayout.call(this);
	this._size = size;
};
$hxClasses["haxe.ui.layouts.DelegateLayout"] = haxe_ui_layouts_DelegateLayout;
haxe_ui_layouts_DelegateLayout.__name__ = "haxe.ui.layouts.DelegateLayout";
haxe_ui_layouts_DelegateLayout.__super__ = haxe_ui_layouts_DefaultLayout;
haxe_ui_layouts_DelegateLayout.prototype = $extend(haxe_ui_layouts_DefaultLayout.prototype,{
	_size: null
	,calcAutoSize: function(exclusions) {
		this._size.component = this.get_component();
		var cx = this._size.get_width();
		var cy = this._size.get_height();
		if(this._size.getBool("includePadding",false) == true) {
			cx += this.get_paddingLeft() + this.get_paddingRight();
			cy += this.get_paddingTop() + this.get_paddingBottom();
		}
		var size = new haxe_ui_geom_Size(cx,cy);
		return size;
	}
	,get_usableSize: function() {
		var size = haxe_ui_layouts_DefaultLayout.prototype.get_usableSize.call(this);
		this._size.component = this.get_component();
		size.width -= this._size.get_usableWidthModifier();
		size.height -= this._size.get_usableHeightModifier();
		return size;
	}
	,__class__: haxe_ui_layouts_DelegateLayout
});
var haxe_ui_layouts_DelegateLayoutSize = function() {
};
$hxClasses["haxe.ui.layouts.DelegateLayoutSize"] = haxe_ui_layouts_DelegateLayoutSize;
haxe_ui_layouts_DelegateLayoutSize.__name__ = "haxe.ui.layouts.DelegateLayoutSize";
haxe_ui_layouts_DelegateLayoutSize.prototype = {
	component: null
	,config: null
	,width: null
	,get_width: function() {
		return 0;
	}
	,height: null
	,get_height: function() {
		return 0;
	}
	,usableWidthModifier: null
	,get_usableWidthModifier: function() {
		return 0;
	}
	,usableHeightModifier: null
	,get_usableHeightModifier: function() {
		return 0;
	}
	,getString: function(name,defaultValue) {
		if(this.config == null) {
			return defaultValue;
		}
		if(Object.prototype.hasOwnProperty.call(this.config.h,name) == false) {
			return defaultValue;
		}
		return this.config.h[name];
	}
	,getInt: function(name,defaultValue) {
		if(defaultValue == null) {
			defaultValue = 0;
		}
		var v = this.getString(name);
		if(v == null) {
			return defaultValue;
		}
		return Std.parseInt(v);
	}
	,getBool: function(name,defaultValue) {
		if(defaultValue == null) {
			defaultValue = false;
		}
		var v = this.getString(name);
		if(v == null) {
			return defaultValue;
		}
		return v == "true";
	}
	,__class__: haxe_ui_layouts_DelegateLayoutSize
	,__properties__: {get_usableHeightModifier:"get_usableHeightModifier",get_usableWidthModifier:"get_usableWidthModifier",get_height:"get_height",get_width:"get_width"}
};
var haxe_ui_layouts_HorizontalContinuousLayout = function() {
	haxe_ui_layouts_HorizontalLayout.call(this);
};
$hxClasses["haxe.ui.layouts.HorizontalContinuousLayout"] = haxe_ui_layouts_HorizontalContinuousLayout;
haxe_ui_layouts_HorizontalContinuousLayout.__name__ = "haxe.ui.layouts.HorizontalContinuousLayout";
haxe_ui_layouts_HorizontalContinuousLayout.__super__ = haxe_ui_layouts_HorizontalLayout;
haxe_ui_layouts_HorizontalContinuousLayout.prototype = $extend(haxe_ui_layouts_HorizontalLayout.prototype,{
	resizeChildren: function() {
	}
	,repositionChildren: function() {
		if(this.get_component().get_autoWidth() == true) {
			haxe_ui_layouts_HorizontalLayout.prototype.repositionChildren.call(this);
			return;
		}
		var ucx = this.get_usableWidth();
		if(ucx <= 0) {
			return;
		}
		var ucx = this.get_component().get_componentWidth() - (this.get_paddingLeft() + this.get_paddingRight());
		var ucy = this.get_component().get_componentHeight() - (this.get_paddingTop() + this.get_paddingBottom());
		var dimensions = [];
		var heights = [];
		var row = 0;
		var usedCX = 0;
		var xpos = this.get_paddingLeft();
		var ypos = this.get_paddingTop();
		var rowCY = 0;
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				continue;
			}
			var rc = new haxe_ui_layouts_ComponentRectangle(child.get_left(),child.get_top(),child.get_componentWidth(),child.get_componentHeight());
			if(child.get_percentWidth() != null) {
				rc.width = ucx * child.get_percentWidth() / 100;
			} else {
				usedCX += this.get_horizontalSpacing();
			}
			if(child.get_percentHeight() != null) {
				rc.height = ucy * child.get_percentHeight() / 100;
			}
			rc.component = child;
			usedCX += rc.width;
			if(usedCX > ucx) {
				heights.push(rowCY);
				ypos += rowCY + this.get_verticalSpacing();
				xpos = this.get_paddingLeft();
				usedCX = rc.width;
				rowCY = 0;
				++row;
			}
			if(dimensions.length <= row) {
				dimensions.push([]);
			}
			if(dimensions[row] == null) {
				ypos -= this.get_verticalSpacing();
				--row;
				dimensions[row].pop();
			}
			rc.left = xpos;
			rc.top = ypos;
			dimensions[row].push(rc);
			xpos += rc.width;
			if(rc.height > rowCY) {
				rowCY = rc.height;
			}
		}
		if(rowCY > 0) {
			heights.push(rowCY);
		}
		var x = 0;
		var _g = 0;
		while(_g < dimensions.length) {
			var r = dimensions[_g];
			++_g;
			var height = heights[x];
			var spaceX = (r.length - 1) / r.length * this.get_horizontalSpacing();
			var n = 0;
			var _g1 = 0;
			while(_g1 < r.length) {
				var c = r[_g1];
				++_g1;
				switch(this.verticalAlign(c.component)) {
				case "bottom":
					c.top += height - c.height;
					break;
				case "center":
					c.top += height / 2 - c.height / 2;
					break;
				default:
				}
				if(c.component.get_percentWidth() != null) {
					c.left += n * (this.get_horizontalSpacing() - spaceX);
					c.width -= spaceX;
				} else {
					c.left += n * this.get_horizontalSpacing();
				}
				c.apply();
				++n;
			}
			++x;
		}
	}
	,get_usableSize: function() {
		if(this.get_component().get_autoWidth() == true) {
			return haxe_ui_layouts_HorizontalLayout.prototype.get_usableSize.call(this);
		}
		var ucx = 0;
		if(this._component.get_componentWidth() != null) {
			ucx = this._component.get_componentWidth();
			ucx -= this.get_paddingLeft() + this.get_paddingRight();
		}
		var ucy = 0;
		if(this._component.get_componentHeight() != null) {
			ucy = this._component.get_componentHeight();
			ucy -= this.get_paddingTop() + this.get_paddingBottom();
		}
		return new haxe_ui_geom_Size(ucx,ucy);
	}
	,__class__: haxe_ui_layouts_HorizontalContinuousLayout
});
var haxe_ui_layouts_ComponentRectangle = function(left,top,width,height) {
	haxe_ui_geom_Rectangle.call(this,left,top,width,height);
};
$hxClasses["haxe.ui.layouts.ComponentRectangle"] = haxe_ui_layouts_ComponentRectangle;
haxe_ui_layouts_ComponentRectangle.__name__ = "haxe.ui.layouts.ComponentRectangle";
haxe_ui_layouts_ComponentRectangle.__super__ = haxe_ui_geom_Rectangle;
haxe_ui_layouts_ComponentRectangle.prototype = $extend(haxe_ui_geom_Rectangle.prototype,{
	component: null
	,apply: function() {
		this.component.moveComponent(this.left,this.top);
		this.component.resizeComponent(this.width,this.height);
	}
	,__class__: haxe_ui_layouts_ComponentRectangle
});
var haxe_ui_layouts_HorizontalGridLayout = function() {
	this._rows = 1;
	haxe_ui_layouts_Layout.call(this);
};
$hxClasses["haxe.ui.layouts.HorizontalGridLayout"] = haxe_ui_layouts_HorizontalGridLayout;
haxe_ui_layouts_HorizontalGridLayout.__name__ = "haxe.ui.layouts.HorizontalGridLayout";
haxe_ui_layouts_HorizontalGridLayout.__super__ = haxe_ui_layouts_Layout;
haxe_ui_layouts_HorizontalGridLayout.prototype = $extend(haxe_ui_layouts_Layout.prototype,{
	_rows: null
	,get_rows: function() {
		return this._rows;
	}
	,set_rows: function(value) {
		if(this._rows == value) {
			return value;
		}
		this._rows = value;
		if(this._component != null) {
			var _this = this._component;
			if(!(_this._layout == null || _this._layoutLocked == true)) {
				_this.invalidateComponent("layout",false);
			}
		}
		return value;
	}
	,get_usableSize: function() {
		var size = haxe_ui_layouts_Layout.prototype.get_usableSize.call(this);
		var columnWidths = this.calcColumnWidths(size,false);
		var rowHeights = this.calcRowHeights(size,false);
		var _g = 0;
		while(_g < columnWidths.length) {
			var columnWidth = columnWidths[_g];
			++_g;
			size.width -= columnWidth;
		}
		var _g = 0;
		while(_g < rowHeights.length) {
			var rowHeight = rowHeights[_g];
			++_g;
			size.height -= rowHeight;
		}
		var _this = this.get_component();
		if((_this._children == null ? [] : _this._children).length > 1) {
			var _this = this.get_component();
			var columns = Math.ceil((_this._children == null ? [] : _this._children).length / this._rows);
			size.width -= this.get_horizontalSpacing() * (columns - 1);
			size.height -= this.get_verticalSpacing() * (this.get_rows() - 1);
		}
		if(size.width < 0) {
			size.width = 0;
		}
		if(size.height < 0) {
			size.height = 0;
		}
		return size;
	}
	,resizeChildren: function() {
		var size = this.get_usableSize();
		var columnWidths = this.calcColumnWidths(size,true);
		var rowHeights = this.calcRowHeights(size,true);
		var explicitWidths = this.calcExplicitWidths();
		var explicitHeights = this.calcExplicitHeights();
		var rowIndex = 0;
		var columnIndex = 0;
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				continue;
			}
			var cx = null;
			var cy = null;
			if(child.get_percentWidth() != null) {
				var ucx = columnWidths[columnIndex];
				if(explicitWidths[columnIndex] == false) {
					cx = ucx;
				} else {
					cx = ucx * child.get_percentWidth() / 100;
				}
			}
			if(child.get_percentHeight() != null) {
				var ucy = rowHeights[rowIndex];
				if(explicitHeights[rowIndex] == false) {
					cy = ucy;
				} else {
					cy = ucy * child.get_percentHeight() / 100;
				}
			}
			child.resizeComponent(cx,cy);
			++rowIndex;
			if(rowIndex >= this._rows) {
				rowIndex = 0;
				++columnIndex;
			}
		}
	}
	,repositionChildren: function() {
		var size = this.get_usableSize();
		var columnWidths = this.calcColumnWidths(size,true);
		var rowHeights = this.calcRowHeights(size,true);
		var rowIndex = 0;
		var columnIndex = 0;
		var xpos = this.get_paddingLeft();
		var ypos = this.get_paddingTop();
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				continue;
			}
			var halign = this.horizontalAlign(child);
			var valign = this.verticalAlign(child);
			var xposChild = 0;
			var yposChild = 0;
			switch(halign) {
			case "center":
				xposChild = xpos + (columnWidths[columnIndex] - child.get_componentWidth()) * 0.5 + this.marginLeft(child) - this.marginRight(child);
				break;
			case "right":
				xposChild = xpos + (columnWidths[columnIndex] - child.get_componentWidth()) + this.marginLeft(child) - this.marginRight(child);
				break;
			default:
				xposChild = xpos + this.marginLeft(child) - this.marginRight(child);
			}
			switch(valign) {
			case "bottom":
				yposChild = ypos + (rowHeights[rowIndex] - child.get_componentHeight()) + this.marginTop(child) - this.marginBottom(child);
				break;
			case "center":
				yposChild = ypos + (rowHeights[rowIndex] - child.get_componentHeight()) * 0.5 + this.marginTop(child) - this.marginBottom(child);
				break;
			default:
				yposChild = ypos + this.marginTop(child) - this.marginBottom(child);
			}
			child.moveComponent(xposChild,yposChild);
			ypos += rowHeights[rowIndex] + this.get_verticalSpacing();
			++rowIndex;
			if(rowIndex >= this._rows) {
				ypos = this.get_paddingTop();
				xpos += columnWidths[columnIndex] + this.get_horizontalSpacing();
				rowIndex = 0;
				++columnIndex;
			}
		}
	}
	,calcColumnWidths: function(usableSize,includePercentage) {
		var _this = this.get_component();
		var visibleChildren = (_this._children == null ? [] : _this._children).length;
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				--visibleChildren;
			}
		}
		var columnCount = visibleChildren / this._rows | 0;
		if(visibleChildren % this._rows != 0) {
			++columnCount;
		}
		var columnWidths = [];
		var _g = 0;
		var _g1 = columnCount;
		while(_g < _g1) {
			var _ = _g++;
			columnWidths.push(0);
		}
		var rowIndex = 0;
		var columnIndex = 0;
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				continue;
			}
			if(child.get_percentWidth() == null) {
				if(child.get_componentWidth() > columnWidths[columnIndex]) {
					columnWidths[columnIndex] = child.get_componentWidth();
				}
			}
			++rowIndex;
			if(rowIndex >= this._rows) {
				rowIndex = 0;
				++columnIndex;
			}
		}
		if(includePercentage) {
			rowIndex = 0;
			columnIndex = 0;
			var _g = 0;
			var _this = this.get_component();
			var _g1 = _this._children == null ? [] : _this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				if(child.get_includeInLayout() == false) {
					continue;
				}
				if(child.get_percentWidth() != null) {
					var cx = usableSize.width * child.get_percentWidth() / 100;
					if(cx > columnWidths[rowIndex] && this._rows == 1) {
						columnWidths[columnIndex] = cx;
					} else if(usableSize.width > columnWidths[columnIndex]) {
						columnWidths[columnIndex] = usableSize.width;
					}
				}
				++rowIndex;
				if(rowIndex >= this._rows) {
					rowIndex = 0;
					++columnIndex;
				}
			}
		}
		return columnWidths;
	}
	,calcRowHeights: function(usableSize,includePercentage) {
		var rowHeights = [];
		var _g = 0;
		var _g1 = this._rows;
		while(_g < _g1) {
			var _ = _g++;
			rowHeights.push(0);
		}
		var rowIndex = 0;
		var columnIndex = 0;
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				continue;
			}
			if(child.get_percentHeight() == null) {
				if(child.get_componentHeight() > rowHeights[rowIndex]) {
					rowHeights[rowIndex] = child.get_componentHeight();
				}
			}
			++rowIndex;
			if(rowIndex >= this._rows) {
				rowIndex = 0;
				++columnIndex;
			}
		}
		if(includePercentage) {
			rowIndex = 0;
			columnIndex = 0;
			var _g = 0;
			var _this = this.get_component();
			var _g1 = _this._children == null ? [] : _this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				if(child.get_includeInLayout() == false) {
					continue;
				}
				if(child.get_percentHeight() != null) {
					var cy = usableSize.height * child.get_percentHeight() / 100;
					if(cy > rowHeights[rowIndex]) {
						rowHeights[rowIndex] = cy;
					}
				}
				++rowIndex;
				if(rowIndex >= this._rows) {
					rowIndex = 0;
					++columnIndex;
				}
			}
		}
		return rowHeights;
	}
	,calcExplicitWidths: function() {
		var _this = this.get_component();
		var visibleChildren = (_this._children == null ? [] : _this._children).length;
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				--visibleChildren;
			}
		}
		var columnCount = visibleChildren / this._rows | 0;
		if(visibleChildren % this._rows != 0) {
			++columnCount;
		}
		var explicitWidths = [];
		var _g = 0;
		var _g1 = columnCount;
		while(_g < _g1) {
			var _ = _g++;
			explicitWidths.push(false);
		}
		var rowIndex = 0;
		var columnIndex = 0;
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				continue;
			}
			if(child.get_percentWidth() == null && child.get_componentWidth() > 0) {
				explicitWidths[rowIndex % this._rows] = true;
			}
			++rowIndex;
			if(rowIndex >= this._rows) {
				rowIndex = 0;
				++columnIndex;
			}
		}
		return explicitWidths;
	}
	,calcExplicitHeights: function() {
		var explicitHeights = [];
		var _g = 0;
		var _g1 = this._rows;
		while(_g < _g1) {
			var _ = _g++;
			explicitHeights.push(false);
		}
		var rowIndex = 0;
		var columnIndex = 0;
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				continue;
			}
			if(child.get_percentHeight() == null && child.get_componentHeight() > 0) {
				explicitHeights[rowIndex] = true;
			}
			++rowIndex;
			if(rowIndex >= this._rows) {
				rowIndex = 0;
				++columnIndex;
			}
		}
		return explicitHeights;
	}
	,__class__: haxe_ui_layouts_HorizontalGridLayout
	,__properties__: $extend(haxe_ui_layouts_Layout.prototype.__properties__,{set_rows:"set_rows",get_rows:"get_rows"})
});
var haxe_ui_layouts_LayoutFactory = function() { };
$hxClasses["haxe.ui.layouts.LayoutFactory"] = haxe_ui_layouts_LayoutFactory;
haxe_ui_layouts_LayoutFactory.__name__ = "haxe.ui.layouts.LayoutFactory";
haxe_ui_layouts_LayoutFactory.createFromName = function(name) {
	switch(name) {
	case "absolute":
		return new haxe_ui_layouts_AbsoluteLayout();
	case "continuous horizontal":case "continuousHorizontal":
		return new haxe_ui_layouts_HorizontalContinuousLayout();
	case "horizontal":
		return new haxe_ui_layouts_HorizontalLayout();
	case "horizontal grid":case "horizontalgrid":
		return new haxe_ui_layouts_HorizontalGridLayout();
	case "vertical":
		return new haxe_ui_layouts_VerticalLayout();
	case "vertical grid":case "verticalgrid":
		return new haxe_ui_layouts_VerticalGridLayout();
	}
	return new haxe_ui_layouts_DefaultLayout();
};
var haxe_ui_layouts_VerticalGridLayout = function() {
	this._columns = 1;
	haxe_ui_layouts_Layout.call(this);
};
$hxClasses["haxe.ui.layouts.VerticalGridLayout"] = haxe_ui_layouts_VerticalGridLayout;
haxe_ui_layouts_VerticalGridLayout.__name__ = "haxe.ui.layouts.VerticalGridLayout";
haxe_ui_layouts_VerticalGridLayout.__super__ = haxe_ui_layouts_Layout;
haxe_ui_layouts_VerticalGridLayout.prototype = $extend(haxe_ui_layouts_Layout.prototype,{
	_columns: null
	,get_columns: function() {
		return this._columns;
	}
	,set_columns: function(value) {
		if(this._columns == value) {
			return value;
		}
		this._columns = value;
		if(this._component != null) {
			var _this = this._component;
			if(!(_this._layout == null || _this._layoutLocked == true)) {
				_this.invalidateComponent("layout",false);
			}
		}
		return value;
	}
	,get_usableSize: function() {
		var size = haxe_ui_layouts_Layout.prototype.get_usableSize.call(this);
		var columnWidths = this.calcColumnWidths(size,false);
		var rowHeights = this.calcRowHeights(size,false);
		var _g = 0;
		while(_g < columnWidths.length) {
			var columnWidth = columnWidths[_g];
			++_g;
			size.width -= columnWidth;
		}
		var _g = 0;
		while(_g < rowHeights.length) {
			var rowHeight = rowHeights[_g];
			++_g;
			size.height -= rowHeight;
		}
		var _this = this.get_component();
		if((_this._children == null ? [] : _this._children).length > 1) {
			var _this = this.get_component();
			var rows = Math.ceil((_this._children == null ? [] : _this._children).length / this.get_columns());
			var c = this.get_columns();
			var _this = this.get_component();
			var c1 = Math.min(c,(_this._children == null ? [] : _this._children).length);
			size.width -= this.get_horizontalSpacing() * (c1 - 1);
			size.height -= this.get_verticalSpacing() * (rows - 1);
		}
		if(size.width < 0) {
			size.width = 0;
		}
		if(size.height < 0) {
			size.height = 0;
		}
		return size;
	}
	,resizeChildren: function() {
		var size = this.get_usableSize();
		var columnWidths = this.calcColumnWidths(size,true);
		var rowHeights = this.calcRowHeights(size,true);
		var explicitWidths = this.calcExplicitWidths();
		var explicitHeights = this.calcExplicitHeights();
		var rowIndex = 0;
		var columnIndex = 0;
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				continue;
			}
			var cx = null;
			var cy = null;
			if(child.get_percentWidth() != null) {
				var ucx = columnWidths[columnIndex];
				if(explicitWidths[columnIndex] == false) {
					cx = ucx;
				} else {
					cx = ucx * child.get_percentWidth() / 100;
				}
			}
			if(child.get_percentHeight() != null) {
				var ucy = rowHeights[rowIndex];
				if(explicitHeights[rowIndex] == false) {
					cy = ucy;
				} else {
					cy = ucy * child.get_percentHeight() / 100;
				}
			}
			child.resizeComponent(cx,cy);
			++columnIndex;
			if(columnIndex >= this._columns) {
				columnIndex = 0;
				++rowIndex;
			}
		}
	}
	,repositionChildren: function() {
		var size = this.get_usableSize();
		var columnWidths = this.calcColumnWidths(size,true);
		var rowHeights = this.calcRowHeights(size,true);
		var rowIndex = 0;
		var columnIndex = 0;
		var xpos = this.get_paddingLeft();
		var ypos = this.get_paddingTop();
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				continue;
			}
			var halign = this.horizontalAlign(child);
			var valign = this.verticalAlign(child);
			var xposChild = 0;
			var yposChild = 0;
			switch(halign) {
			case "center":
				xposChild = xpos + (columnWidths[columnIndex] - child.get_componentWidth()) * 0.5 + this.marginLeft(child) - this.marginRight(child);
				break;
			case "right":
				xposChild = xpos + (columnWidths[columnIndex] - child.get_componentWidth()) + this.marginLeft(child) - this.marginRight(child);
				break;
			default:
				xposChild = xpos + this.marginLeft(child) - this.marginRight(child);
			}
			switch(valign) {
			case "bottom":
				yposChild = ypos + (rowHeights[rowIndex] - child.get_componentHeight()) + this.marginTop(child) - this.marginBottom(child);
				break;
			case "center":
				yposChild = ypos + (rowHeights[rowIndex] - child.get_componentHeight()) * 0.5 + this.marginTop(child) - this.marginBottom(child);
				break;
			default:
				yposChild = ypos + this.marginTop(child) - this.marginBottom(child);
			}
			child.moveComponent(xposChild,yposChild);
			xpos += columnWidths[columnIndex] + this.get_horizontalSpacing();
			++columnIndex;
			if(columnIndex >= this.get_columns()) {
				xpos = this.get_paddingLeft();
				ypos += rowHeights[rowIndex] + this.get_verticalSpacing();
				columnIndex = 0;
				++rowIndex;
			}
		}
	}
	,calcColumnWidths: function(usableSize,includePercentage) {
		var columnWidths = [];
		var _g = 0;
		var _g1 = this._columns;
		while(_g < _g1) {
			var _ = _g++;
			columnWidths.push(0);
		}
		var rowIndex = 0;
		var columnIndex = 0;
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				continue;
			}
			if(child.get_percentWidth() == null) {
				if(child.get_componentWidth() > columnWidths[columnIndex]) {
					columnWidths[columnIndex] = child.get_componentWidth();
				}
			}
			++columnIndex;
			if(columnIndex >= this._columns) {
				columnIndex = 0;
				++rowIndex;
			}
		}
		if(includePercentage) {
			rowIndex = 0;
			columnIndex = 0;
			var fullWidthsCounts = [0];
			var _g = 0;
			var _this = this.get_component();
			var _g1 = _this._children == null ? [] : _this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				if(child.get_includeInLayout() == false) {
					continue;
				}
				if(child.get_percentWidth() != null && child.get_percentWidth() == 100) {
					fullWidthsCounts[rowIndex]++;
				}
				++columnIndex;
				if(columnIndex >= this._columns) {
					columnIndex = 0;
					++rowIndex;
					fullWidthsCounts.push(0);
				}
			}
			rowIndex = 0;
			columnIndex = 0;
			var _g = 0;
			var _this = this.get_component();
			var _g1 = _this._children == null ? [] : _this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				if(child.get_includeInLayout() == false) {
					continue;
				}
				if(child.get_percentWidth() != null) {
					var childPercentWidth = child.get_percentWidth();
					if(childPercentWidth == 100 && fullWidthsCounts[rowIndex] != 0) {
						var f = fullWidthsCounts[rowIndex];
						if(rowIndex > 0 && fullWidthsCounts[rowIndex - 1] != 0) {
							f = fullWidthsCounts[rowIndex - 1];
						}
						childPercentWidth = 100 / f;
					}
					var cx = usableSize.width * childPercentWidth / 100;
					if(cx > columnWidths[columnIndex]) {
						columnWidths[columnIndex] = cx;
					}
				}
				++columnIndex;
				if(columnIndex >= this._columns) {
					columnIndex = 0;
					++rowIndex;
				}
			}
		}
		return columnWidths;
	}
	,calcRowHeights: function(usableSize,includePercentage) {
		var _this = this.get_component();
		var visibleChildren = (_this._children == null ? [] : _this._children).length;
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				--visibleChildren;
			}
		}
		var rowCount = visibleChildren / this._columns | 0;
		if(visibleChildren % this._columns != 0) {
			++rowCount;
		}
		var rowHeights = [];
		var _g = 0;
		var _g1 = rowCount;
		while(_g < _g1) {
			var _ = _g++;
			rowHeights.push(0);
		}
		var rowIndex = 0;
		var columnIndex = 0;
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				continue;
			}
			if(child.get_percentHeight() == null) {
				if(child.get_height() > rowHeights[rowIndex]) {
					rowHeights[rowIndex] = child.get_height();
				}
			}
			++columnIndex;
			if(columnIndex >= this._columns) {
				columnIndex = 0;
				++rowIndex;
			}
		}
		if(includePercentage) {
			rowIndex = 0;
			columnIndex = 0;
			var newRow = true;
			var fullHeightRowCount = 0;
			var _g = 0;
			var _this = this.get_component();
			var _g1 = _this._children == null ? [] : _this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				if(child.get_includeInLayout() == false) {
					continue;
				}
				if(child.get_percentHeight() != null && child.get_percentHeight() == 100) {
					if(newRow == true) {
						newRow = false;
						++fullHeightRowCount;
					}
				}
				++columnIndex;
				if(columnIndex >= this._columns) {
					columnIndex = 0;
					++rowIndex;
					newRow = true;
				}
			}
			rowIndex = 0;
			columnIndex = 0;
			var _g = 0;
			var _this = this.get_component();
			var _g1 = _this._children == null ? [] : _this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				if(child.get_includeInLayout() == false) {
					continue;
				}
				if(child.get_percentHeight() != null) {
					var childPercentHeight = child.get_percentHeight();
					if(childPercentHeight == 100 && fullHeightRowCount > 1) {
						childPercentHeight = 100 / fullHeightRowCount;
					}
					var cy = usableSize.height * childPercentHeight / 100;
					if(cy > rowHeights[rowIndex]) {
						rowHeights[rowIndex] = cy;
					} else {
						var tmp = usableSize.height > rowHeights[rowIndex];
					}
				}
				++columnIndex;
				if(columnIndex >= this._columns) {
					columnIndex = 0;
					++rowIndex;
				}
			}
		}
		return rowHeights;
	}
	,calcExplicitWidths: function() {
		var explicitWidths = [];
		var _g = 0;
		var _g1 = this._columns;
		while(_g < _g1) {
			var _ = _g++;
			explicitWidths.push(false);
		}
		var rowIndex = 0;
		var columnIndex = 0;
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				continue;
			}
			if(child.get_percentWidth() == null && child.get_componentWidth() > 0) {
				explicitWidths[columnIndex] = true;
			}
			++columnIndex;
			if(columnIndex >= this._columns) {
				columnIndex = 0;
				++rowIndex;
			}
		}
		return explicitWidths;
	}
	,calcExplicitHeights: function() {
		var _this = this.get_component();
		var visibleChildren = (_this._children == null ? [] : _this._children).length;
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				--visibleChildren;
			}
		}
		var rowCount = visibleChildren / this.get_columns() | 0;
		if(visibleChildren % this._columns != 0) {
			++rowCount;
		}
		var explicitHeights = [];
		var _g = 0;
		var _g1 = rowCount;
		while(_g < _g1) {
			var _ = _g++;
			explicitHeights.push(false);
		}
		var rowIndex = 0;
		var columnIndex = 0;
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				continue;
			}
			if(child.get_percentHeight() == null && child.get_componentHeight() > 0) {
				explicitHeights[columnIndex % this._columns] = true;
			}
			++columnIndex;
			if(columnIndex >= this._columns) {
				columnIndex = 0;
				++rowIndex;
			}
		}
		return explicitHeights;
	}
	,__class__: haxe_ui_layouts_VerticalGridLayout
	,__properties__: $extend(haxe_ui_layouts_Layout.prototype.__properties__,{set_columns:"set_columns",get_columns:"get_columns"})
});
var haxe_ui_layouts_VerticalLayout = function() {
	haxe_ui_layouts_DefaultLayout.call(this);
	this._calcFullHeights = true;
};
$hxClasses["haxe.ui.layouts.VerticalLayout"] = haxe_ui_layouts_VerticalLayout;
haxe_ui_layouts_VerticalLayout.__name__ = "haxe.ui.layouts.VerticalLayout";
haxe_ui_layouts_VerticalLayout.__super__ = haxe_ui_layouts_DefaultLayout;
haxe_ui_layouts_VerticalLayout.prototype = $extend(haxe_ui_layouts_DefaultLayout.prototype,{
	repositionChildren: function() {
		var ypos = this.get_paddingTop();
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				continue;
			}
			var xpos = 0;
			switch(this.horizontalAlign(child)) {
			case "center":
				xpos = (this.get_component().get_componentWidth() - child.get_componentWidth()) / 2 + this.marginLeft(child) - this.marginRight(child);
				break;
			case "right":
				if(child.get_componentWidth() < this.get_component().get_componentWidth()) {
					xpos = this.get_component().get_componentWidth() - (child.get_componentWidth() + this.get_paddingRight() + this.marginLeft(child));
				}
				break;
			default:
				xpos = this.get_paddingLeft() + this.marginLeft(child);
			}
			child.moveComponent(xpos,ypos + this.marginTop(child));
			ypos += child.get_componentHeight() + this.get_verticalSpacing();
		}
	}
	,get_usableSize: function() {
		var size = haxe_ui_layouts_DefaultLayout.prototype.get_usableSize.call(this);
		var _this = this.get_component();
		var visibleChildren = (_this._children == null ? [] : _this._children).length;
		var _g = 0;
		var _this = this.get_component();
		var _g1 = _this._children == null ? [] : _this._children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.get_includeInLayout() == false) {
				--visibleChildren;
				continue;
			}
			if(child.get_componentHeight() > 0 && (child.get_percentHeight() == null || this.fixedMinHeight(child) == true)) {
				size.height -= child.get_componentHeight() + this.marginTop(child) + this.marginBottom(child);
			}
		}
		if(visibleChildren > 1) {
			size.height -= this.get_verticalSpacing() * (visibleChildren - 1);
		}
		if(size.height < 0) {
			size.height = 0;
		}
		return size;
	}
	,__class__: haxe_ui_layouts_VerticalLayout
});
var haxe_ui_locale_LocaleEvent = function(type) {
	haxe_ui_events_UIEvent.call(this,type);
};
$hxClasses["haxe.ui.locale.LocaleEvent"] = haxe_ui_locale_LocaleEvent;
haxe_ui_locale_LocaleEvent.__name__ = "haxe.ui.locale.LocaleEvent";
haxe_ui_locale_LocaleEvent.__super__ = haxe_ui_events_UIEvent;
haxe_ui_locale_LocaleEvent.prototype = $extend(haxe_ui_events_UIEvent.prototype,{
	clone: function() {
		var c = new haxe_ui_locale_LocaleEvent(this.type);
		return c;
	}
	,__class__: haxe_ui_locale_LocaleEvent
});
var haxe_ui_locale_LocaleManager = function() {
	this._localeMap = new haxe_ds_StringMap();
	this._language = "en";
	this._eventMap = null;
};
$hxClasses["haxe.ui.locale.LocaleManager"] = haxe_ui_locale_LocaleManager;
haxe_ui_locale_LocaleManager.__name__ = "haxe.ui.locale.LocaleManager";
haxe_ui_locale_LocaleManager.__properties__ = {get_instance:"get_instance"};
haxe_ui_locale_LocaleManager.get_instance = function() {
	if(haxe_ui_locale_LocaleManager._instance == null) {
		haxe_ui_locale_LocaleManager._instance = new haxe_ui_locale_LocaleManager();
	}
	return haxe_ui_locale_LocaleManager._instance;
};
haxe_ui_locale_LocaleManager.prototype = {
	_eventMap: null
	,registerComponent: function(component,prop,callback,expr,fix) {
		if(fix == null) {
			fix = true;
		}
		if(callback == null && expr == null) {
			return;
		}
		var fixedExpr = null;
		if(fix == true) {
			if(expr != null) {
				fixedExpr = haxe_ui_util_ExpressionUtil.stringToLanguageExpression(expr,"LocaleManager");
				if(StringTools.endsWith(fixedExpr,";") == true) {
					fixedExpr = HxOverrides.substr(fixedExpr,0,fixedExpr.length - 1);
				}
			}
		} else {
			fixedExpr = expr;
		}
		var propMap = haxe_ui_locale_LocaleManager._registeredComponents.h[component.__id__];
		if(propMap == null) {
			propMap = new haxe_ds_StringMap();
			haxe_ui_locale_LocaleManager._registeredComponents.set(component,propMap);
		}
		propMap.h[prop] = { callback : callback, expr : fixedExpr};
		this.refreshFor(component);
	}
	,unregisterComponent: function(component) {
		haxe_ui_locale_LocaleManager._registeredComponents.remove(component);
	}
	,findBindingExpr: function(component,prop) {
		var propMap = haxe_ui_locale_LocaleManager._registeredComponents.h[component.__id__];
		if(propMap == null) {
			return null;
		}
		var entry = propMap.h[prop];
		return entry.expr;
	}
	,cloneForComponent: function(from,to) {
		var propMap = haxe_ui_locale_LocaleManager._registeredComponents.h[from.__id__];
		if(propMap == null) {
			return;
		}
		var h = propMap.h;
		var prop_h = h;
		var prop_keys = Object.keys(h);
		var prop_length = prop_keys.length;
		var prop_current = 0;
		while(prop_current < prop_length) {
			var prop = prop_keys[prop_current++];
			var entry = propMap.h[prop];
			this.registerComponent(to,prop,entry.callback,entry.expr,false);
		}
	}
	,onComponentReady: function(e) {
		e.target.unregisterEvent("initialize",$bind(this,this.onComponentReady));
		this.refreshFor(e.target);
	}
	,refreshFor: function(component) {
		if(component.get_isReady() == false) {
			component.registerEvent("initialize",$bind(this,this.onComponentReady));
			return;
		}
		var propMap = haxe_ui_locale_LocaleManager._registeredComponents.h[component.__id__];
		if(propMap == null) {
			return;
		}
		var context = { LocaleManager : haxe_ui_locale_LocaleManager, MathUtil : haxe_ui_util_MathUtil};
		var root = this.findRoot(component);
		var _g = 0;
		var _g1 = root.get_namedComponents();
		while(_g < _g1.length) {
			var k = _g1[_g];
			++_g;
			if(k.get_scriptAccess() == false) {
				continue;
			}
			context[k.get_id()] = k;
		}
		var h = propMap.h;
		var prop_h = h;
		var prop_keys = Object.keys(h);
		var prop_length = prop_keys.length;
		var prop_current = 0;
		while(prop_current < prop_length) {
			var prop = prop_keys[prop_current++];
			var entry = propMap.h[prop];
			if(entry.callback != null) {
				var value = entry.callback();
				Reflect.setProperty(component,prop,value);
			} else if(entry.expr != null) {
				var value1 = haxe_ui_util_SimpleExpressionEvaluator.eval(entry.expr,context);
				Reflect.setProperty(component,prop,value1);
			}
		}
	}
	,refreshAll: function() {
		var c = haxe_ui_locale_LocaleManager._registeredComponents.keys();
		while(c.hasNext()) {
			var c1 = c.next();
			this.refreshFor(c1);
		}
	}
	,_language: null
	,get_language: function() {
		return this._language;
	}
	,set_language: function(value) {
		if(value == null) {
			return value;
		}
		if(this._language == value) {
			return value;
		}
		if(this.getStrings(value) == null) {
			return value;
		}
		this._language = value;
		this.refreshAll();
		if(this._eventMap != null) {
			var event = new haxe_ui_locale_LocaleEvent("localeChanged");
			this._eventMap.invoke("localeChanged",event);
		}
		return value;
	}
	,registerEvent: function(type,listener,priority) {
		if(priority == null) {
			priority = 0;
		}
		if(this._eventMap == null) {
			this._eventMap = new haxe_ui_util_EventMap();
		}
		this._eventMap.add(type,listener,priority);
	}
	,hasEvent: function(type,listener) {
		if(this._eventMap == null) {
			return false;
		}
		return this._eventMap.contains(type,listener);
	}
	,unregisterEvent: function(type,listener) {
		if(this._eventMap != null) {
			this._eventMap.remove(type,listener);
		}
	}
	,parseResource: function(localeId,resourceId) {
		var content = haxe_ui_ToolkitAssets.get_instance().getText(resourceId);
		if(content != null) {
			var parts = resourceId.split(".");
			var extension = parts.pop();
			var filename = parts.join(".");
			var n = filename.lastIndexOf("/");
			if(n != -1) {
				filename = HxOverrides.substr(filename,n + 1,null);
			}
			var parser = haxe_ui_parsers_locale_LocaleParser.get(extension);
			var map = parser.parse(content);
			this.addStrings(localeId,map,filename);
		}
	}
	,_localeMap: null
	,addStrings: function(localeId,map,filename) {
		var stringMap = this._localeMap.h[localeId];
		if(stringMap == null) {
			stringMap = new haxe_ds_StringMap();
			this._localeMap.h[localeId] = stringMap;
		}
		var h = map.h;
		var k_h = h;
		var k_keys = Object.keys(h);
		var k_length = k_keys.length;
		var k_current = 0;
		while(k_current < k_length) {
			var k = k_keys[k_current++];
			var v = map.h[k];
			if(filename != null && filename != localeId && StringTools.startsWith(k,filename) == false) {
				var altKey = filename + "." + k;
				stringMap.h[altKey] = v;
			}
			stringMap.h[k] = v;
		}
		localeId = StringTools.replace(localeId,"-","_");
		var parts = localeId.split("_");
		if(parts.length > 1) {
			var parent = this._localeMap.h[parts[0]];
			if(parent != null) {
				var h = parent.h;
				var k_h = h;
				var k_keys = Object.keys(h);
				var k_length = k_keys.length;
				var k_current = 0;
				while(k_current < k_length) {
					var k = k_keys[k_current++];
					if(Object.prototype.hasOwnProperty.call(stringMap.h,k) == false) {
						stringMap.h[k] = parent.h[k];
					}
				}
			}
		}
	}
	,getStrings: function(localeId) {
		var strings = this._localeMap.h[localeId];
		if(strings != null) {
			return strings;
		}
		localeId = StringTools.replace(localeId,"-","_");
		var parts = localeId.split("_");
		return this._localeMap.h[parts[0]];
	}
	,hasString: function(id) {
		var strings = this.getStrings(this.get_language());
		if(strings == null) {
			return false;
		}
		return Object.prototype.hasOwnProperty.call(strings.h,id);
	}
	,lookupString: function(id,param0,param1,param2,param3) {
		var strings = this.getStrings(this.get_language());
		if(strings == null) {
			return id;
		}
		var value = strings.h[id];
		if(value == null) {
			return id;
		}
		if(param0 != null) {
			value = StringTools.replace(value,"{0}",param0);
		}
		if(param1 != null) {
			value = StringTools.replace(value,"{1}",param1);
		}
		if(param2 != null) {
			value = StringTools.replace(value,"{2}",param2);
		}
		if(param3 != null) {
			value = StringTools.replace(value,"{3}",param3);
		}
		return value;
	}
	,findRoot: function(c) {
		var root = c;
		var ref = c;
		while(ref != null) {
			root = ref;
			if(root.bindingRoot) {
				break;
			}
			ref = ref.parentComponent;
		}
		return root;
	}
	,__class__: haxe_ui_locale_LocaleManager
	,__properties__: {set_language:"set_language",get_language:"get_language"}
};
var haxe_ui_macros_BackendMacros = function() { };
$hxClasses["haxe.ui.macros.BackendMacros"] = haxe_ui_macros_BackendMacros;
haxe_ui_macros_BackendMacros.__name__ = "haxe.ui.macros.BackendMacros";
var haxe_ui_macros_ModuleMacros = function() { };
$hxClasses["haxe.ui.macros.ModuleMacros"] = haxe_ui_macros_ModuleMacros;
haxe_ui_macros_ModuleMacros.__name__ = "haxe.ui.macros.ModuleMacros";
var haxe_ui_macros_NativeMacros = function() { };
$hxClasses["haxe.ui.macros.NativeMacros"] = haxe_ui_macros_NativeMacros;
haxe_ui_macros_NativeMacros.__name__ = "haxe.ui.macros.NativeMacros";
var haxe_ui_parsers_locale_LocaleParser = function() {
};
$hxClasses["haxe.ui.parsers.locale.LocaleParser"] = haxe_ui_parsers_locale_LocaleParser;
haxe_ui_parsers_locale_LocaleParser.__name__ = "haxe.ui.parsers.locale.LocaleParser";
haxe_ui_parsers_locale_LocaleParser.get = function(extension) {
	haxe_ui_parsers_locale_LocaleParser.defaultParsers();
	var cls = haxe_ui_parsers_locale_LocaleParser._parsers.h[extension];
	if(cls == null) {
		throw haxe_Exception.thrown("No locale parser found for \"" + extension + "\"");
	}
	var instance = Type.createInstance(cls,[]);
	if(instance == null) {
		throw haxe_Exception.thrown("Could not create locale parser instance \"" + Std.string(cls) + "\"");
	}
	return instance;
};
haxe_ui_parsers_locale_LocaleParser.defaultParsers = function() {
	haxe_ui_parsers_locale_LocaleParser.register("properties",haxe_ui_parsers_locale_PropertiesParser);
	haxe_ui_parsers_locale_LocaleParser.register("po",haxe_ui_parsers_locale_PoParser);
};
haxe_ui_parsers_locale_LocaleParser.register = function(extension,cls) {
	if(haxe_ui_parsers_locale_LocaleParser._parsers == null) {
		haxe_ui_parsers_locale_LocaleParser._parsers = new haxe_ds_StringMap();
	}
	haxe_ui_parsers_locale_LocaleParser._parsers.h[extension] = cls;
};
haxe_ui_parsers_locale_LocaleParser.prototype = {
	parse: function(data) {
		throw haxe_Exception.thrown("Locale parser not implemented!");
	}
	,__class__: haxe_ui_parsers_locale_LocaleParser
};
var haxe_ui_parsers_locale_PoParser = function() {
	haxe_ui_parsers_locale_LocaleParser.call(this);
};
$hxClasses["haxe.ui.parsers.locale.PoParser"] = haxe_ui_parsers_locale_PoParser;
haxe_ui_parsers_locale_PoParser.__name__ = "haxe.ui.parsers.locale.PoParser";
haxe_ui_parsers_locale_PoParser.__super__ = haxe_ui_parsers_locale_LocaleParser;
haxe_ui_parsers_locale_PoParser.prototype = $extend(haxe_ui_parsers_locale_LocaleParser.prototype,{
	parse: function(data) {
		var msgidEReg = new EReg("msgid *= *\"(.*)\"","");
		var msgstrEReg = new EReg("msgstr *= *\"(.*)\"","");
		var result = new haxe_ds_StringMap();
		var lines = data.split("\n");
		var currentID = null;
		var _g = 0;
		while(_g < lines.length) {
			var line = lines[_g];
			++_g;
			line = StringTools.trim(line);
			if(line.length == 0 || StringTools.startsWith(line,"#")) {
				continue;
			}
			if(currentID == null) {
				if(msgidEReg.match(line)) {
					currentID = msgidEReg.matched(1);
				} else {
					throw haxe_Exception.thrown("Locale parser: Invalid line " + line);
				}
			} else if(msgstrEReg.match(line)) {
				var value = msgstrEReg.matched(1);
				result.h[currentID] = value;
				currentID = null;
			} else {
				throw haxe_Exception.thrown("Locale parser: Invalid line " + line);
			}
		}
		return result;
	}
	,__class__: haxe_ui_parsers_locale_PoParser
});
var haxe_ui_parsers_locale_PropertiesParser = function() {
	haxe_ui_parsers_locale_LocaleParser.call(this);
};
$hxClasses["haxe.ui.parsers.locale.PropertiesParser"] = haxe_ui_parsers_locale_PropertiesParser;
haxe_ui_parsers_locale_PropertiesParser.__name__ = "haxe.ui.parsers.locale.PropertiesParser";
haxe_ui_parsers_locale_PropertiesParser.__super__ = haxe_ui_parsers_locale_LocaleParser;
haxe_ui_parsers_locale_PropertiesParser.prototype = $extend(haxe_ui_parsers_locale_LocaleParser.prototype,{
	parse: function(data) {
		var result = new haxe_ds_StringMap();
		var lines = data.split("\n");
		var _g = 0;
		while(_g < lines.length) {
			var line = lines[_g];
			++_g;
			line = StringTools.trim(line);
			if(line.length == 0 || StringTools.startsWith(line,"#")) {
				continue;
			}
			var separator = line.indexOf("=");
			if(separator == -1) {
				throw haxe_Exception.thrown("Locale parser: Invalid line " + line);
			}
			var key = StringTools.trim(HxOverrides.substr(line,0,separator));
			var content = StringTools.trim(HxOverrides.substr(line,separator + 1,null));
			result.h[key] = content;
		}
		return result;
	}
	,__class__: haxe_ui_parsers_locale_PropertiesParser
});
var haxe_ui_styles_Dimension = $hxEnums["haxe.ui.styles.Dimension"] = { __ename__:true,__constructs__:null
	,PERCENT: ($_=function(value) { return {_hx_index:0,value:value,__enum__:"haxe.ui.styles.Dimension",toString:$estr}; },$_._hx_name="PERCENT",$_.__params__ = ["value"],$_)
	,PX: ($_=function(value) { return {_hx_index:1,value:value,__enum__:"haxe.ui.styles.Dimension",toString:$estr}; },$_._hx_name="PX",$_.__params__ = ["value"],$_)
	,VW: ($_=function(value) { return {_hx_index:2,value:value,__enum__:"haxe.ui.styles.Dimension",toString:$estr}; },$_._hx_name="VW",$_.__params__ = ["value"],$_)
	,VH: ($_=function(value) { return {_hx_index:3,value:value,__enum__:"haxe.ui.styles.Dimension",toString:$estr}; },$_._hx_name="VH",$_.__params__ = ["value"],$_)
	,REM: ($_=function(value) { return {_hx_index:4,value:value,__enum__:"haxe.ui.styles.Dimension",toString:$estr}; },$_._hx_name="REM",$_.__params__ = ["value"],$_)
	,CALC: ($_=function(s) { return {_hx_index:5,s:s,__enum__:"haxe.ui.styles.Dimension",toString:$estr}; },$_._hx_name="CALC",$_.__params__ = ["s"],$_)
};
haxe_ui_styles_Dimension.__constructs__ = [haxe_ui_styles_Dimension.PERCENT,haxe_ui_styles_Dimension.PX,haxe_ui_styles_Dimension.VW,haxe_ui_styles_Dimension.VH,haxe_ui_styles_Dimension.REM,haxe_ui_styles_Dimension.CALC];
var haxe_ui_styles_EasingFunction = $hxEnums["haxe.ui.styles.EasingFunction"] = { __ename__:true,__constructs__:null
	,LINEAR: {_hx_name:"LINEAR",_hx_index:0,__enum__:"haxe.ui.styles.EasingFunction",toString:$estr}
	,EASE: {_hx_name:"EASE",_hx_index:1,__enum__:"haxe.ui.styles.EasingFunction",toString:$estr}
	,EASE_IN: {_hx_name:"EASE_IN",_hx_index:2,__enum__:"haxe.ui.styles.EasingFunction",toString:$estr}
	,EASE_OUT: {_hx_name:"EASE_OUT",_hx_index:3,__enum__:"haxe.ui.styles.EasingFunction",toString:$estr}
	,EASE_IN_OUT: {_hx_name:"EASE_IN_OUT",_hx_index:4,__enum__:"haxe.ui.styles.EasingFunction",toString:$estr}
};
haxe_ui_styles_EasingFunction.__constructs__ = [haxe_ui_styles_EasingFunction.LINEAR,haxe_ui_styles_EasingFunction.EASE,haxe_ui_styles_EasingFunction.EASE_IN,haxe_ui_styles_EasingFunction.EASE_OUT,haxe_ui_styles_EasingFunction.EASE_IN_OUT];
var haxe_ui_styles_Parser = function() {
};
$hxClasses["haxe.ui.styles.Parser"] = haxe_ui_styles_Parser;
haxe_ui_styles_Parser.__name__ = "haxe.ui.styles.Parser";
haxe_ui_styles_Parser.prototype = {
	parse: function(source) {
		var _gthis = this;
		if(source.indexOf("$") != -1) {
			var h = haxe_ui_themes_ThemeManager.get_instance().currentThemeVars.h;
			var key_h = h;
			var key_keys = Object.keys(h);
			var key_length = key_keys.length;
			var key_current = 0;
			while(key_current < key_length) {
				var key = key_keys[key_current++];
				var value = haxe_ui_themes_ThemeManager.get_instance().currentThemeVars.h[key];
				source = StringTools.replace(source,"$" + key,value);
			}
		}
		source = source.replace(haxe_ui_styles_Parser.cssCommentsRegex.r,"");
		var styleSheet = new haxe_ui_styles_StyleSheet();
		source = haxe_ui_styles_Parser.cssImportStatementRegex.map(source,function(e) {
			var i = e.matched(0);
			i = HxOverrides.substr(i,7,null);
			var _this_r = new RegExp("\"|'|;","g".split("u").join(""));
			i = i.replace(_this_r,"");
			i = StringTools.trim(i);
			styleSheet.addImport(new haxe_ui_styles_elements_ImportElement(i));
			return "";
		});
		source = haxe_ui_styles_Parser.cssKeyframesRegex.map(source,function(e) {
			var id = e.matched(1);
			var data = e.matched(2);
			var keyframes = [];
			haxe_ui_styles_Parser.cssKeyframeSelectorRegex.map(data,function(e) {
				var selector = e.matched(1);
				var directives = e.matched(2);
				if(selector == "from") {
					selector = "0%";
				} else if(selector == "to") {
					selector = "100%";
				}
				var keyframe = new haxe_ui_styles_elements_AnimationKeyFrame();
				keyframe.time = haxe_ui_styles_ValueTools.parse(selector);
				keyframe.directives = _gthis.parseDirectives(directives);
				keyframes.push(keyframe);
				return null;
			});
			var animation = new haxe_ui_styles_elements_AnimationKeyFrames(id,keyframes);
			styleSheet.addAnimation(animation);
			return "";
		});
		haxe_ui_styles_Parser.combinedCSSMediaRegex.map(source,function(e) {
			var selector = "";
			if(e.matched(2) == null) {
				selector = StringTools.trim(e.matched(5).split("\r\n").join("\n"));
			} else {
				selector = StringTools.trim(e.matched(2).split("\r\n").join("\n"));
			}
			selector = selector.replace(haxe_ui_styles_Parser.newlineRegex.r,"\n");
			if(selector.indexOf("@media") != -1) {
				var n1 = selector.indexOf("(");
				var n2 = selector.lastIndexOf(")");
				var mediaQuery = selector.substring(n1 + 1,n2);
				var mediaStyleSheet = new haxe_ui_styles_Parser().parse(e.matched(3) + "\n}");
				var mq = new haxe_ui_styles_elements_MediaQuery(_gthis.parseDirectives(mediaQuery),mediaStyleSheet);
				styleSheet.addMediaQuery(mq);
			} else {
				var directives = _gthis.parseDirectives(e.matched(6));
				var selectors = selector.split(",");
				var _g = 0;
				while(_g < selectors.length) {
					var s = selectors[_g];
					++_g;
					s = StringTools.trim(s);
					if(s.length > 0) {
						styleSheet.addRule(new haxe_ui_styles_elements_RuleElement(s,directives));
					}
				}
			}
			return null;
		});
		return styleSheet;
	}
	,parseDirectives: function(rulesString) {
		rulesString = rulesString.split("\r\n").join("\n");
		var ret = [];
		var rules = rulesString.split(";");
		var _g = 0;
		while(_g < rules.length) {
			var line = rules[_g];
			++_g;
			var d = this.parseDirective(line);
			if(d != null) {
				ret.push(d);
			}
		}
		return ret;
	}
	,parseDirective: function(line) {
		var d = null;
		line = StringTools.trim(line);
		if(line.length == 0) {
			return null;
		}
		if(line.indexOf(":") != -1) {
			var parts = line.split(":");
			var cssDirective = StringTools.trim(parts[0]);
			var cssValue = StringTools.trim(parts.slice(1).join(":"));
			if(cssDirective.length < 1 || cssValue.length < 1) {
				return null;
			}
			d = new haxe_ui_styles_elements_Directive(cssDirective,haxe_ui_styles_ValueTools.parse(cssValue));
		} else {
			d = new haxe_ui_styles_elements_Directive("",haxe_ui_styles_ValueTools.parse(line),true);
		}
		return d;
	}
	,__class__: haxe_ui_styles_Parser
};
var haxe_ui_styles_StyleBorderType = $hxEnums["haxe.ui.styles.StyleBorderType"] = { __ename__:true,__constructs__:null
	,None: {_hx_name:"None",_hx_index:0,__enum__:"haxe.ui.styles.StyleBorderType",toString:$estr}
	,Full: {_hx_name:"Full",_hx_index:1,__enum__:"haxe.ui.styles.StyleBorderType",toString:$estr}
	,Compound: {_hx_name:"Compound",_hx_index:2,__enum__:"haxe.ui.styles.StyleBorderType",toString:$estr}
};
haxe_ui_styles_StyleBorderType.__constructs__ = [haxe_ui_styles_StyleBorderType.None,haxe_ui_styles_StyleBorderType.Full,haxe_ui_styles_StyleBorderType.Compound];
var haxe_ui_styles_Style = function(left,top,autoWidth,width,percentWidth,initialWidth,initialPercentWidth,minWidth,minPercentWidth,maxWidth,maxPercentWidth,autoHeight,height,percentHeight,initialHeight,initialPercentHeight,minHeight,minPercentHeight,maxHeight,maxPercentHeight,padding,paddingTop,paddingLeft,paddingRight,paddingBottom,marginTop,marginLeft,marginRight,marginBottom,horizontalSpacing,verticalSpacing,color,backgroundColor,backgroundColorEnd,backgroundGradientStyle,backgroundOpacity,backgroundImage,backgroundImageRepeat,backgroundImageClipTop,backgroundImageClipLeft,backgroundImageClipBottom,backgroundImageClipRight,backgroundImageSliceTop,backgroundImageSliceLeft,backgroundImageSliceBottom,backgroundImageSliceRight,borderColor,borderTopColor,borderLeftColor,borderBottomColor,borderRightColor,borderSize,borderTopSize,borderLeftSize,borderBottomSize,borderRightSize,borderRadius,borderRadiusTopLeft,borderRadiusTopRight,borderRadiusBottomLeft,borderRadiusBottomRight,borderOpacity,borderStyle,icon,iconPosition,horizontalAlign,verticalAlign,textAlign,opacity,clip,native,fontName,fontSize,fontBold,fontUnderline,fontItalic,cursor,hidden,filter,backdropFilter,resource,animationName,animationOptions,mode,pointerEvents,contentType,direction,contentWidth,contentWidthPercent,contentHeight,contentHeightPercent,wordWrap,imageRendering,layout,borderType,hasBorder,fullBorderSize) {
	this.left = left;
	this.top = top;
	this.autoWidth = autoWidth;
	this.width = width;
	this.percentWidth = percentWidth;
	this.initialWidth = initialWidth;
	this.initialPercentWidth = initialPercentWidth;
	this.minWidth = minWidth;
	this.minPercentWidth = minPercentWidth;
	this.maxWidth = maxWidth;
	this.maxPercentWidth = maxPercentWidth;
	this.autoHeight = autoHeight;
	this.height = height;
	this.percentHeight = percentHeight;
	this.initialHeight = initialHeight;
	this.initialPercentHeight = initialPercentHeight;
	this.minHeight = minHeight;
	this.minPercentHeight = minPercentHeight;
	this.maxHeight = maxHeight;
	this.maxPercentHeight = maxPercentHeight;
	this.padding = padding;
	this.paddingTop = paddingTop;
	this.paddingLeft = paddingLeft;
	this.paddingRight = paddingRight;
	this.paddingBottom = paddingBottom;
	this.marginTop = marginTop;
	this.marginLeft = marginLeft;
	this.marginRight = marginRight;
	this.marginBottom = marginBottom;
	this.horizontalSpacing = horizontalSpacing;
	this.verticalSpacing = verticalSpacing;
	this.color = color;
	this.backgroundColor = backgroundColor;
	this.backgroundColorEnd = backgroundColorEnd;
	this.backgroundGradientStyle = backgroundGradientStyle;
	this.backgroundOpacity = backgroundOpacity;
	this.backgroundImage = backgroundImage;
	this.backgroundImageRepeat = backgroundImageRepeat;
	this.backgroundImageClipTop = backgroundImageClipTop;
	this.backgroundImageClipLeft = backgroundImageClipLeft;
	this.backgroundImageClipBottom = backgroundImageClipBottom;
	this.backgroundImageClipRight = backgroundImageClipRight;
	this.backgroundImageSliceTop = backgroundImageSliceTop;
	this.backgroundImageSliceLeft = backgroundImageSliceLeft;
	this.backgroundImageSliceBottom = backgroundImageSliceBottom;
	this.backgroundImageSliceRight = backgroundImageSliceRight;
	this.borderColor = borderColor;
	this.borderTopColor = borderTopColor;
	this.borderLeftColor = borderLeftColor;
	this.borderBottomColor = borderBottomColor;
	this.borderRightColor = borderRightColor;
	this.borderSize = borderSize;
	this.borderTopSize = borderTopSize;
	this.borderLeftSize = borderLeftSize;
	this.borderBottomSize = borderBottomSize;
	this.borderRightSize = borderRightSize;
	this.borderRadius = borderRadius;
	this.borderRadiusTopLeft = borderRadiusTopLeft;
	this.borderRadiusTopRight = borderRadiusTopRight;
	this.borderRadiusBottomLeft = borderRadiusBottomLeft;
	this.borderRadiusBottomRight = borderRadiusBottomRight;
	this.borderOpacity = borderOpacity;
	this.borderStyle = borderStyle;
	this.icon = icon;
	this.iconPosition = iconPosition;
	this.horizontalAlign = horizontalAlign;
	this.verticalAlign = verticalAlign;
	this.textAlign = textAlign;
	this.opacity = opacity;
	this.clip = clip;
	this.native = native;
	this.fontName = fontName;
	this.fontSize = fontSize;
	this.fontBold = fontBold;
	this.fontUnderline = fontUnderline;
	this.fontItalic = fontItalic;
	this.cursor = cursor;
	this.hidden = hidden;
	this.filter = filter;
	this.backdropFilter = backdropFilter;
	this.resource = resource;
	this.animationName = animationName;
	this.animationOptions = animationOptions;
	this.mode = mode;
	this.pointerEvents = pointerEvents;
	this.contentType = contentType;
	this.direction = direction;
	this.contentWidth = contentWidth;
	this.contentWidthPercent = contentWidthPercent;
	this.contentHeight = contentHeight;
	this.contentHeightPercent = contentHeightPercent;
	this.wordWrap = wordWrap;
	this.imageRendering = imageRendering;
	this.layout = layout;
	this.borderType = borderType;
	this.hasBorder = hasBorder;
	this.fullBorderSize = fullBorderSize;
};
$hxClasses["haxe.ui.styles.Style"] = haxe_ui_styles_Style;
haxe_ui_styles_Style.__name__ = "haxe.ui.styles.Style";
haxe_ui_styles_Style.prototype = {
	left: null
	,top: null
	,autoWidth: null
	,width: null
	,percentWidth: null
	,initialWidth: null
	,initialPercentWidth: null
	,minWidth: null
	,minPercentWidth: null
	,maxWidth: null
	,maxPercentWidth: null
	,autoHeight: null
	,height: null
	,percentHeight: null
	,initialHeight: null
	,initialPercentHeight: null
	,minHeight: null
	,minPercentHeight: null
	,maxHeight: null
	,maxPercentHeight: null
	,padding: null
	,set_padding: function(value) {
		this.paddingTop = value;
		this.paddingLeft = value;
		this.paddingRight = value;
		this.paddingBottom = value;
		return value;
	}
	,paddingTop: null
	,paddingLeft: null
	,paddingRight: null
	,paddingBottom: null
	,marginTop: null
	,marginLeft: null
	,marginRight: null
	,marginBottom: null
	,horizontalSpacing: null
	,verticalSpacing: null
	,color: null
	,backgroundColor: null
	,backgroundColorEnd: null
	,backgroundGradientStyle: null
	,backgroundOpacity: null
	,backgroundImage: null
	,backgroundImageRepeat: null
	,backgroundImageClipTop: null
	,backgroundImageClipLeft: null
	,backgroundImageClipBottom: null
	,backgroundImageClipRight: null
	,backgroundImageSliceTop: null
	,backgroundImageSliceLeft: null
	,backgroundImageSliceBottom: null
	,backgroundImageSliceRight: null
	,borderColor: null
	,borderTopColor: null
	,borderLeftColor: null
	,borderBottomColor: null
	,borderRightColor: null
	,borderSize: null
	,borderTopSize: null
	,borderLeftSize: null
	,borderBottomSize: null
	,borderRightSize: null
	,borderRadius: null
	,borderRadiusTopLeft: null
	,borderRadiusTopRight: null
	,borderRadiusBottomLeft: null
	,borderRadiusBottomRight: null
	,borderOpacity: null
	,borderStyle: null
	,icon: null
	,iconPosition: null
	,horizontalAlign: null
	,verticalAlign: null
	,textAlign: null
	,opacity: null
	,clip: null
	,native: null
	,fontName: null
	,fontSize: null
	,fontBold: null
	,fontUnderline: null
	,fontItalic: null
	,cursor: null
	,hidden: null
	,filter: null
	,backdropFilter: null
	,resource: null
	,animationName: null
	,animationOptions: null
	,mode: null
	,pointerEvents: null
	,contentType: null
	,direction: null
	,contentWidth: null
	,contentWidthPercent: null
	,contentHeight: null
	,contentHeightPercent: null
	,wordWrap: null
	,imageRendering: null
	,layout: null
	,borderType: null
	,get_borderType: function() {
		var t = haxe_ui_styles_StyleBorderType.Compound;
		if(this.borderLeftSize != null && this.borderLeftSize > 0 && this.borderLeftSize == this.borderRightSize && this.borderLeftSize == this.borderBottomSize && this.borderLeftSize == this.borderTopSize) {
			t = haxe_ui_styles_StyleBorderType.Full;
		} else if((this.borderLeftSize == null || this.borderLeftSize <= 0) && (this.borderRightSize == null || this.borderRightSize <= 0) && (this.borderBottomSize == null || this.borderRightSize <= 0) && (this.borderTopSize == null || this.borderTopSize <= 0)) {
			t = haxe_ui_styles_StyleBorderType.None;
		}
		return t;
	}
	,hasBorder: null
	,get_hasBorder: function() {
		return this.get_borderType() != haxe_ui_styles_StyleBorderType.None;
	}
	,fullBorderSize: null
	,get_fullBorderSize: function() {
		if(this.get_borderType() == haxe_ui_styles_StyleBorderType.Full) {
			return this.borderLeftSize;
		}
		return 0;
	}
	,mergeDirectives: function(map) {
		var h = map.h;
		var key_h = h;
		var key_keys = Object.keys(h);
		var key_length = key_keys.length;
		var key_current = 0;
		while(key_current < key_length) {
			var key = key_keys[key_current++];
			var v = map.h[key];
			switch(key) {
			case "animation-delay":
				if(this.animationOptions == null) {
					this.animationOptions = new haxe_ui_styles_animation_AnimationOptions(null,null,null,null,null,null);
				}
				this.animationOptions.delay = haxe_ui_styles_ValueTools.time(v.value);
				break;
			case "animation-direction":
				if(this.animationOptions == null) {
					this.animationOptions = new haxe_ui_styles_animation_AnimationOptions(null,null,null,null,null,null);
				}
				this.animationOptions.direction = haxe_ui_styles_ValueTools.string(v.value);
				break;
			case "animation-duration":
				if(this.animationOptions == null) {
					this.animationOptions = new haxe_ui_styles_animation_AnimationOptions(null,null,null,null,null,null);
				}
				this.animationOptions.duration = haxe_ui_styles_ValueTools.time(v.value);
				break;
			case "animation-fill-mode":
				if(this.animationOptions == null) {
					this.animationOptions = new haxe_ui_styles_animation_AnimationOptions(null,null,null,null,null,null);
				}
				this.animationOptions.fillMode = haxe_ui_styles_ValueTools.string(v.value);
				break;
			case "animation-iteration-count":
				if(this.animationOptions == null) {
					this.animationOptions = new haxe_ui_styles_animation_AnimationOptions(null,null,null,null,null,null);
				}
				var _g = v.value;
				var tmp;
				if(_g._hx_index == 6) {
					var val = _g.v;
					tmp = val == "infinite" ? -1 : 0;
				} else {
					tmp = haxe_ui_styles_ValueTools.int(v.value);
				}
				this.animationOptions.iterationCount = tmp;
				break;
			case "animation-name":
				this.animationName = haxe_ui_styles_ValueTools.string(v.value);
				break;
			case "animation-timing-function":
				if(this.animationOptions == null) {
					this.animationOptions = new haxe_ui_styles_animation_AnimationOptions(null,null,null,null,null,null);
				}
				this.animationOptions.easingFunction = haxe_ui_styles_ValueTools.calcEasing(v.value);
				break;
			case "backdrop-filter":
				var _g1 = v.value;
				switch(_g1._hx_index) {
				case 5:
					var f = _g1.f;
					var vl = _g1.vl;
					var arr = haxe_ui_styles_ValueTools.array(vl);
					arr.splice(0,0,f);
					this.backdropFilter = [haxe_ui_filters_FilterParser.parseFilter(arr)];
					break;
				case 6:
					var f1 = _g1.v;
					this.backdropFilter = [haxe_ui_filters_FilterParser.parseFilter([f1])];
					break;
				case 9:
					this.backdropFilter = null;
					break;
				default:
				}
				break;
			case "background-color":
				var _g2 = v.value;
				this.backgroundColor = haxe_ui_styles_ValueTools.int(v.value);
				if(Object.prototype.hasOwnProperty.call(map.h,"background-color-end")) {
					this.backgroundColorEnd = haxe_ui_styles_ValueTools.int(map.h["background-color-end"].value);
				} else {
					this.backgroundColorEnd = null;
				}
				break;
			case "background-color-end":
				this.backgroundColorEnd = haxe_ui_styles_ValueTools.int(v.value);
				break;
			case "background-gradient-style":
				this.backgroundGradientStyle = haxe_ui_styles_ValueTools.string(v.value);
				break;
			case "background-image":
				this.backgroundImage = haxe_ui_styles_ValueTools.string(v.value);
				break;
			case "background-image-clip-bottom":
				this.backgroundImageClipBottom = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "background-image-clip-left":
				this.backgroundImageClipLeft = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "background-image-clip-right":
				this.backgroundImageClipRight = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "background-image-clip-top":
				this.backgroundImageClipTop = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "background-image-repeat":
				this.backgroundImageRepeat = haxe_ui_styles_ValueTools.string(v.value);
				break;
			case "background-image-slice-bottom":
				this.backgroundImageSliceBottom = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "background-image-slice-left":
				this.backgroundImageSliceLeft = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "background-image-slice-right":
				this.backgroundImageSliceRight = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "background-image-slice-top":
				this.backgroundImageSliceTop = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "background-opacity":
				this.backgroundOpacity = haxe_ui_styles_ValueTools.float(v.value);
				break;
			case "border-bottom-color":
				this.borderBottomColor = haxe_ui_styles_ValueTools.int(v.value);
				break;
			case "border-bottom-left-radius":
				this.borderRadiusBottomLeft = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "border-bottom-right-radius":
				this.borderRadiusBottomRight = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "border-bottom-size":case "border-bottom-width":
				if(v.value == haxe_ui_styles_Value.VNone) {
					this.borderBottomSize = 0;
				} else {
					this.borderBottomSize = haxe_ui_styles_ValueTools.calcDimension(v.value);
				}
				break;
			case "border-color":
				this.borderColor = haxe_ui_styles_ValueTools.int(v.value);
				break;
			case "border-left-color":
				this.borderLeftColor = haxe_ui_styles_ValueTools.int(v.value);
				break;
			case "border-left-size":case "border-left-width":
				if(v.value == haxe_ui_styles_Value.VNone) {
					this.borderLeftSize = 0;
				} else {
					this.borderLeftSize = haxe_ui_styles_ValueTools.calcDimension(v.value);
				}
				break;
			case "border-opacity":
				this.borderOpacity = haxe_ui_styles_ValueTools.float(v.value);
				break;
			case "border-radius":
				this.borderRadius = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "border-right-color":
				this.borderRightColor = haxe_ui_styles_ValueTools.int(v.value);
				break;
			case "border-right-size":case "border-right-width":
				if(v.value == haxe_ui_styles_Value.VNone) {
					this.borderRightSize = 0;
				} else {
					this.borderRightSize = haxe_ui_styles_ValueTools.calcDimension(v.value);
				}
				break;
			case "border-style":
				this.borderStyle = haxe_ui_styles_ValueTools.string(v.value);
				break;
			case "border-top-color":
				this.borderTopColor = haxe_ui_styles_ValueTools.int(v.value);
				break;
			case "border-top-left-radius":
				this.borderRadiusTopLeft = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "border-top-right-radius":
				this.borderRadiusTopRight = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "border-top-size":case "border-top-width":
				if(v.value == haxe_ui_styles_Value.VNone) {
					this.borderTopSize = 0;
				} else {
					this.borderTopSize = haxe_ui_styles_ValueTools.calcDimension(v.value);
				}
				break;
			case "clip":
				this.clip = haxe_ui_styles_ValueTools.bool(v.value);
				break;
			case "color":
				this.color = haxe_ui_styles_ValueTools.int(v.value);
				break;
			case "content-height":
				this.contentHeight = haxe_ui_styles_ValueTools.calcDimension(v.value);
				this.contentHeightPercent = haxe_ui_styles_ValueTools.percent(v.value);
				break;
			case "content-type":
				this.contentType = haxe_ui_styles_ValueTools.string(v.value);
				break;
			case "content-width":
				this.contentWidth = haxe_ui_styles_ValueTools.calcDimension(v.value);
				this.contentWidthPercent = haxe_ui_styles_ValueTools.percent(v.value);
				break;
			case "cursor":
				this.cursor = haxe_ui_styles_ValueTools.string(v.value);
				break;
			case "direction":
				this.direction = haxe_ui_styles_ValueTools.string(v.value);
				break;
			case "display":
				this.hidden = haxe_ui_styles_ValueTools.none(v.value);
				break;
			case "filter":
				var _g3 = v.value;
				switch(_g3._hx_index) {
				case 5:
					var f2 = _g3.f;
					var vl1 = _g3.vl;
					var arr1 = haxe_ui_styles_ValueTools.array(vl1);
					arr1.splice(0,0,f2);
					this.filter = [haxe_ui_filters_FilterParser.parseFilter(arr1)];
					break;
				case 6:
					var f3 = _g3.v;
					this.filter = [haxe_ui_filters_FilterParser.parseFilter([f3])];
					break;
				case 9:
					this.filter = null;
					break;
				default:
				}
				break;
			case "font-bold":
				this.fontBold = haxe_ui_styles_ValueTools.bool(v.value);
				break;
			case "font-family":case "font-name":
				this.fontName = haxe_ui_styles_ValueTools.string(v.value);
				break;
			case "font-italic":
				this.fontItalic = haxe_ui_styles_ValueTools.bool(v.value);
				break;
			case "font-size":
				this.fontSize = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "font-underline":
				this.fontUnderline = haxe_ui_styles_ValueTools.bool(v.value);
				break;
			case "height":
				this.autoHeight = haxe_ui_styles_ValueTools.constant(v.value,"auto");
				this.height = haxe_ui_styles_ValueTools.calcDimension(v.value);
				this.percentHeight = haxe_ui_styles_ValueTools.percent(v.value);
				break;
			case "hidden":
				this.hidden = haxe_ui_styles_ValueTools.bool(v.value);
				break;
			case "horizontal-align":
				this.horizontalAlign = haxe_ui_styles_ValueTools.string(v.value);
				break;
			case "horizontal-spacing":
				this.horizontalSpacing = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "icon":
				if(v.value._hx_index == 9) {
					this.icon = null;
				} else {
					this.icon = haxe_ui_styles_ValueTools.string(v.value);
				}
				break;
			case "icon-position":
				this.iconPosition = haxe_ui_styles_ValueTools.string(v.value);
				break;
			case "image-rendering":
				if(v.value._hx_index == 9) {
					this.imageRendering = null;
				} else {
					this.imageRendering = haxe_ui_styles_ValueTools.string(v.value);
				}
				break;
			case "initial-height":
				this.initialHeight = haxe_ui_styles_ValueTools.calcDimension(v.value);
				this.initialPercentHeight = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "initial-width":
				this.initialWidth = haxe_ui_styles_ValueTools.calcDimension(v.value);
				this.initialPercentWidth = haxe_ui_styles_ValueTools.percent(v.value);
				break;
			case "layout":
				if(v.value._hx_index == 9) {
					this.layout = null;
				} else {
					this.layout = haxe_ui_styles_ValueTools.string(v.value);
				}
				break;
			case "left":
				this.left = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "margin-bottom":
				this.marginBottom = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "margin-left":
				this.marginLeft = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "margin-right":
				this.marginRight = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "margin-top":
				this.marginTop = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "max-height":
				this.maxHeight = haxe_ui_styles_ValueTools.calcDimension(v.value);
				this.maxPercentHeight = haxe_ui_styles_ValueTools.percent(v.value);
				break;
			case "max-width":
				this.maxWidth = haxe_ui_styles_ValueTools.calcDimension(v.value);
				this.maxPercentWidth = haxe_ui_styles_ValueTools.percent(v.value);
				break;
			case "min-height":
				this.minHeight = haxe_ui_styles_ValueTools.calcDimension(v.value);
				this.minPercentHeight = haxe_ui_styles_ValueTools.percent(v.value);
				break;
			case "min-width":
				this.minWidth = haxe_ui_styles_ValueTools.calcDimension(v.value);
				this.minPercentWidth = haxe_ui_styles_ValueTools.percent(v.value);
				break;
			case "mode":
				this.mode = haxe_ui_styles_ValueTools.string(v.value);
				break;
			case "native":
				this.native = haxe_ui_styles_ValueTools.bool(v.value);
				break;
			case "opacity":
				this.opacity = haxe_ui_styles_ValueTools.float(v.value);
				break;
			case "padding-bottom":
				this.paddingBottom = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "padding-left":
				this.paddingLeft = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "padding-right":
				this.paddingRight = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "padding-top":
				this.paddingTop = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "pointer-events":
				if(v.value._hx_index == 9) {
					this.pointerEvents = "none";
				} else {
					this.pointerEvents = haxe_ui_styles_ValueTools.string(v.value);
				}
				break;
			case "resource":
				this.resource = haxe_ui_styles_ValueTools.string(v.value);
				break;
			case "text-align":
				this.textAlign = haxe_ui_styles_ValueTools.string(v.value);
				break;
			case "top":
				this.top = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "vertical-align":
				this.verticalAlign = haxe_ui_styles_ValueTools.string(v.value);
				break;
			case "vertical-spacing":
				this.verticalSpacing = haxe_ui_styles_ValueTools.calcDimension(v.value);
				break;
			case "width":
				this.autoWidth = haxe_ui_styles_ValueTools.constant(v.value,"auto");
				this.width = haxe_ui_styles_ValueTools.calcDimension(v.value);
				this.percentWidth = haxe_ui_styles_ValueTools.percent(v.value);
				break;
			case "word-wrap":
				this.wordWrap = haxe_ui_styles_ValueTools.bool(v.value);
				break;
			}
		}
	}
	,apply: function(s) {
		if(s.cursor != null) {
			this.cursor = s.cursor;
		}
		if(s.hidden != null) {
			this.hidden = s.hidden;
		}
		if(s.left != null) {
			this.left = s.left;
		}
		if(s.top != null) {
			this.top = s.top;
		}
		if(s.autoWidth != null) {
			this.autoWidth = s.autoWidth;
		}
		if(s.autoHeight != null) {
			this.autoHeight = s.autoHeight;
		}
		if(s.verticalSpacing != null) {
			this.verticalSpacing = s.verticalSpacing;
		}
		if(s.horizontalSpacing != null) {
			this.horizontalSpacing = s.horizontalSpacing;
		}
		if(s.width != null) {
			this.width = s.width;
			this.autoWidth = false;
		}
		if(s.initialWidth != null) {
			this.initialWidth = s.initialWidth;
		}
		if(s.initialPercentWidth != null) {
			this.initialPercentWidth = s.initialPercentWidth;
		}
		if(s.minWidth != null) {
			this.minWidth = s.minWidth;
		}
		if(s.minPercentWidth != null) {
			this.minPercentWidth = s.minPercentWidth;
		}
		if(s.maxWidth != null) {
			this.maxWidth = s.maxWidth;
		}
		if(s.maxPercentWidth != null) {
			this.maxPercentWidth = s.maxPercentWidth;
		}
		if(s.height != null) {
			this.height = s.height;
			this.autoHeight = false;
		}
		if(s.initialHeight != null) {
			this.initialHeight = s.initialHeight;
		}
		if(s.initialPercentHeight != null) {
			this.initialPercentHeight = s.initialPercentHeight;
		}
		if(s.minHeight != null) {
			this.minHeight = s.minHeight;
		}
		if(s.minPercentHeight != null) {
			this.minPercentHeight = s.minPercentHeight;
		}
		if(s.maxHeight != null) {
			this.maxHeight = s.maxHeight;
		}
		if(s.maxPercentHeight != null) {
			this.maxPercentHeight = s.maxPercentHeight;
		}
		if(s.percentWidth != null) {
			this.percentWidth = s.percentWidth;
			this.autoWidth = false;
		}
		if(s.percentHeight != null) {
			this.percentHeight = s.percentHeight;
			this.autoHeight = false;
		}
		if(s.paddingTop != null) {
			this.paddingTop = s.paddingTop;
		}
		if(s.paddingLeft != null) {
			this.paddingLeft = s.paddingLeft;
		}
		if(s.paddingRight != null) {
			this.paddingRight = s.paddingRight;
		}
		if(s.paddingBottom != null) {
			this.paddingBottom = s.paddingBottom;
		}
		if(s.marginTop != null) {
			this.marginTop = s.marginTop;
		}
		if(s.marginLeft != null) {
			this.marginLeft = s.marginLeft;
		}
		if(s.marginRight != null) {
			this.marginRight = s.marginRight;
		}
		if(s.marginBottom != null) {
			this.marginBottom = s.marginBottom;
		}
		if(s.color != null) {
			this.color = s.color;
		}
		if(s.backgroundColor != null) {
			this.backgroundColor = s.backgroundColor;
			this.backgroundColorEnd = null;
		}
		if(s.backgroundColorEnd != null) {
			this.backgroundColorEnd = s.backgroundColorEnd;
		}
		if(s.backgroundGradientStyle != null) {
			this.backgroundGradientStyle = s.backgroundGradientStyle;
		}
		if(s.backgroundOpacity != null) {
			this.backgroundOpacity = s.backgroundOpacity;
		}
		if(s.backgroundImage != null) {
			this.backgroundImage = s.backgroundImage;
		}
		if(s.backgroundImageRepeat != null) {
			this.backgroundImageRepeat = s.backgroundImageRepeat;
		}
		if(s.backgroundImageClipTop != null) {
			this.backgroundImageClipTop = s.backgroundImageClipTop;
		}
		if(s.backgroundImageClipLeft != null) {
			this.backgroundImageClipLeft = s.backgroundImageClipLeft;
		}
		if(s.backgroundImageClipBottom != null) {
			this.backgroundImageClipBottom = s.backgroundImageClipBottom;
		}
		if(s.backgroundImageClipRight != null) {
			this.backgroundImageClipRight = s.backgroundImageClipRight;
		}
		if(s.backgroundImageSliceTop != null) {
			this.backgroundImageSliceTop = s.backgroundImageSliceTop;
		}
		if(s.backgroundImageSliceLeft != null) {
			this.backgroundImageSliceLeft = s.backgroundImageSliceLeft;
		}
		if(s.backgroundImageSliceBottom != null) {
			this.backgroundImageSliceBottom = s.backgroundImageSliceBottom;
		}
		if(s.backgroundImageSliceRight != null) {
			this.backgroundImageSliceRight = s.backgroundImageSliceRight;
		}
		if(s.borderColor != null) {
			this.borderColor = s.borderColor;
		}
		if(s.borderTopColor != null) {
			this.borderTopColor = s.borderTopColor;
		}
		if(s.borderLeftColor != null) {
			this.borderLeftColor = s.borderLeftColor;
		}
		if(s.borderBottomColor != null) {
			this.borderBottomColor = s.borderBottomColor;
		}
		if(s.borderRightColor != null) {
			this.borderRightColor = s.borderRightColor;
		}
		if(s.borderSize != null) {
			this.borderSize = s.borderSize;
		}
		if(s.borderTopSize != null) {
			this.borderTopSize = s.borderTopSize;
		}
		if(s.borderLeftSize != null) {
			this.borderLeftSize = s.borderLeftSize;
		}
		if(s.borderBottomSize != null) {
			this.borderBottomSize = s.borderBottomSize;
		}
		if(s.borderRightSize != null) {
			this.borderRightSize = s.borderRightSize;
		}
		if(s.borderRadius != null) {
			this.borderRadius = s.borderRadius;
		}
		if(s.borderRadiusTopLeft != null) {
			this.borderRadiusTopLeft = s.borderRadiusTopLeft;
		}
		if(s.borderRadiusTopRight != null) {
			this.borderRadiusTopRight = s.borderRadiusTopRight;
		}
		if(s.borderRadiusBottomLeft != null) {
			this.borderRadiusBottomLeft = s.borderRadiusBottomLeft;
		}
		if(s.borderRadiusBottomRight != null) {
			this.borderRadiusBottomRight = s.borderRadiusBottomRight;
		}
		if(s.borderOpacity != null) {
			this.borderOpacity = s.borderOpacity;
		}
		if(s.borderStyle != null) {
			this.borderStyle = s.borderStyle;
		}
		if(s.filter != null) {
			this.filter = s.filter.slice();
		}
		if(s.backdropFilter != null) {
			this.backdropFilter = s.backdropFilter.slice();
		}
		if(s.resource != null) {
			this.resource = s.resource;
		}
		if(s.icon != null) {
			this.icon = s.icon;
		}
		if(s.iconPosition != null) {
			this.iconPosition = s.iconPosition;
		}
		if(s.horizontalAlign != null) {
			this.horizontalAlign = s.horizontalAlign;
		}
		if(s.verticalAlign != null) {
			this.verticalAlign = s.verticalAlign;
		}
		if(s.textAlign != null) {
			this.textAlign = s.textAlign;
		}
		if(s.opacity != null) {
			this.opacity = s.opacity;
		}
		if(s.clip != null) {
			this.clip = s.clip;
		}
		if(s.native != null) {
			this.native = s.native;
		}
		if(s.fontName != null) {
			this.fontName = s.fontName;
		}
		if(s.fontSize != null) {
			this.fontSize = s.fontSize;
		}
		if(s.fontBold != null) {
			this.fontBold = s.fontBold;
		}
		if(s.fontUnderline != null) {
			this.fontUnderline = s.fontUnderline;
		}
		if(s.fontItalic != null) {
			this.fontItalic = s.fontItalic;
		}
		if(s.animationName != null) {
			this.animationName = s.animationName;
		}
		if(s.animationOptions != null) {
			if(this.animationOptions == null) {
				this.animationOptions = new haxe_ui_styles_animation_AnimationOptions(null,null,null,null,null,null);
			}
			if(s.animationOptions.duration != null) {
				this.animationOptions.duration = s.animationOptions.duration;
			}
			if(s.animationOptions.delay != null) {
				this.animationOptions.delay = s.animationOptions.delay;
			}
			if(s.animationOptions.iterationCount != null) {
				this.animationOptions.iterationCount = s.animationOptions.iterationCount;
			}
			if(s.animationOptions.easingFunction != null) {
				this.animationOptions.easingFunction = s.animationOptions.easingFunction;
			}
			if(s.animationOptions.direction != null) {
				this.animationOptions.direction = s.animationOptions.direction;
			}
			if(s.animationOptions.fillMode != null) {
				this.animationOptions.fillMode = s.animationOptions.fillMode;
			}
		}
		if(s.mode != null) {
			this.mode = s.mode;
		}
		if(s.pointerEvents != null) {
			this.pointerEvents = s.pointerEvents;
		}
		if(s.contentType != null) {
			this.contentType = s.contentType;
		}
		if(s.direction != null) {
			this.direction = s.direction;
		}
		if(s.contentWidth != null) {
			this.contentWidth = s.contentWidth;
		}
		if(s.contentWidthPercent != null) {
			this.contentWidthPercent = s.contentWidthPercent;
		}
		if(s.contentHeight != null) {
			this.contentHeight = s.contentHeight;
		}
		if(s.contentHeightPercent != null) {
			this.contentHeightPercent = s.contentHeightPercent;
		}
		if(s.wordWrap != null) {
			this.wordWrap = s.wordWrap;
		}
		if(s.imageRendering != null) {
			this.imageRendering = s.imageRendering;
		}
		if(s.layout != null) {
			this.layout = s.layout;
		}
	}
	,equalTo: function(s) {
		if(s.backgroundColor != this.backgroundColor) {
			return false;
		}
		if(s.backgroundColorEnd != this.backgroundColorEnd) {
			return false;
		}
		if(s.backgroundGradientStyle != this.backgroundGradientStyle) {
			return false;
		}
		if(s.backgroundOpacity != this.backgroundOpacity) {
			return false;
		}
		if(s.borderColor != this.borderColor) {
			return false;
		}
		if(s.borderTopColor != this.borderTopColor) {
			return false;
		}
		if(s.borderLeftColor != this.borderLeftColor) {
			return false;
		}
		if(s.borderBottomColor != this.borderBottomColor) {
			return false;
		}
		if(s.borderRightColor != this.borderRightColor) {
			return false;
		}
		if(s.borderSize != this.borderSize) {
			return false;
		}
		if(s.borderTopSize != this.borderTopSize) {
			return false;
		}
		if(s.borderLeftSize != this.borderLeftSize) {
			return false;
		}
		if(s.borderBottomSize != this.borderBottomSize) {
			return false;
		}
		if(s.borderRightSize != this.borderRightSize) {
			return false;
		}
		if(s.borderRadius != this.borderRadius) {
			return false;
		}
		if(s.borderRadiusTopLeft != this.borderRadiusTopLeft) {
			return false;
		}
		if(s.borderRadiusTopRight != this.borderRadiusTopRight) {
			return false;
		}
		if(s.borderRadiusBottomLeft != this.borderRadiusBottomLeft) {
			return false;
		}
		if(s.borderRadiusBottomRight != this.borderRadiusBottomRight) {
			return false;
		}
		if(s.borderOpacity != this.borderOpacity) {
			return false;
		}
		if(s.borderStyle != this.borderStyle) {
			return false;
		}
		if(s.color != this.color) {
			return false;
		}
		if(s.cursor != this.cursor) {
			return false;
		}
		if(s.hidden != this.hidden) {
			return false;
		}
		if(s.left != this.left) {
			return false;
		}
		if(s.top != this.top) {
			return false;
		}
		if(s.autoWidth != this.autoWidth) {
			return false;
		}
		if(s.autoHeight != this.autoHeight) {
			return false;
		}
		if(s.verticalSpacing != this.verticalSpacing) {
			return false;
		}
		if(s.horizontalSpacing != this.horizontalSpacing) {
			return false;
		}
		if(s.width != this.width) {
			return false;
		}
		if(s.initialWidth != this.initialWidth) {
			return false;
		}
		if(s.initialPercentWidth != this.initialPercentWidth) {
			return false;
		}
		if(s.minWidth != this.minWidth) {
			return false;
		}
		if(s.minPercentWidth != this.minPercentWidth) {
			return false;
		}
		if(s.maxWidth != this.maxWidth) {
			return false;
		}
		if(s.maxPercentWidth != this.maxPercentWidth) {
			return false;
		}
		if(s.height != this.height) {
			return false;
		}
		if(s.initialHeight != this.initialHeight) {
			return false;
		}
		if(s.initialPercentHeight != this.initialPercentHeight) {
			return false;
		}
		if(s.minHeight != this.minHeight) {
			return false;
		}
		if(s.minPercentHeight != this.minPercentHeight) {
			return false;
		}
		if(s.maxHeight != this.maxHeight) {
			return false;
		}
		if(s.maxPercentHeight != this.maxPercentHeight) {
			return false;
		}
		if(s.percentWidth != this.percentWidth) {
			return false;
		}
		if(s.percentHeight != this.percentHeight) {
			return false;
		}
		if(s.paddingTop != this.paddingTop) {
			return false;
		}
		if(s.paddingLeft != this.paddingLeft) {
			return false;
		}
		if(s.paddingRight != this.paddingRight) {
			return false;
		}
		if(s.paddingBottom != this.paddingBottom) {
			return false;
		}
		if(s.marginTop != this.marginTop) {
			return false;
		}
		if(s.marginLeft != this.marginLeft) {
			return false;
		}
		if(s.marginRight != this.marginRight) {
			return false;
		}
		if(s.marginBottom != this.marginBottom) {
			return false;
		}
		if(s.backgroundImage != this.backgroundImage) {
			return false;
		}
		if(s.backgroundImageRepeat != this.backgroundImageRepeat) {
			return false;
		}
		if(s.backgroundImageClipTop != this.backgroundImageClipTop) {
			return false;
		}
		if(s.backgroundImageClipLeft != this.backgroundImageClipLeft) {
			return false;
		}
		if(s.backgroundImageClipBottom != this.backgroundImageClipBottom) {
			return false;
		}
		if(s.backgroundImageClipRight != this.backgroundImageClipRight) {
			return false;
		}
		if(s.backgroundImageSliceTop != this.backgroundImageSliceTop) {
			return false;
		}
		if(s.backgroundImageSliceLeft != this.backgroundImageSliceLeft) {
			return false;
		}
		if(s.backgroundImageSliceBottom != this.backgroundImageSliceBottom) {
			return false;
		}
		if(s.backgroundImageSliceRight != this.backgroundImageSliceRight) {
			return false;
		}
		if(s.filter != this.filter) {
			return false;
		}
		if(s.backdropFilter != this.backdropFilter) {
			return false;
		}
		if(s.resource != this.resource) {
			return false;
		}
		if(s.icon != this.icon) {
			return false;
		}
		if(s.iconPosition != this.iconPosition) {
			return false;
		}
		if(s.horizontalAlign != this.horizontalAlign) {
			return false;
		}
		if(s.verticalAlign != this.verticalAlign) {
			return false;
		}
		if(s.textAlign != this.textAlign) {
			return false;
		}
		if(s.opacity != this.opacity) {
			return false;
		}
		if(s.clip != this.clip) {
			return false;
		}
		if(s.native != this.native) {
			return false;
		}
		if(s.fontName != this.fontName) {
			return false;
		}
		if(s.fontSize != this.fontSize) {
			return false;
		}
		if(s.fontBold != this.fontBold) {
			return false;
		}
		if(s.fontUnderline != this.fontUnderline) {
			return false;
		}
		if(s.fontItalic != this.fontItalic) {
			return false;
		}
		if(s.resource != this.resource) {
			return false;
		}
		if(s.animationName != this.animationName) {
			return false;
		}
		if(this.animationOptions != null && this.animationOptions.compareTo(s.animationOptions) == false) {
			return false;
		}
		if(s.mode != this.mode) {
			return false;
		}
		if(s.pointerEvents != this.pointerEvents) {
			return false;
		}
		if(s.contentType != this.contentType) {
			return false;
		}
		if(s.direction != this.direction) {
			return false;
		}
		if(s.contentWidth != this.contentWidth) {
			return false;
		}
		if(s.contentWidthPercent != this.contentWidthPercent) {
			return false;
		}
		if(s.contentHeight != this.contentHeight) {
			return false;
		}
		if(s.contentHeightPercent != this.contentHeightPercent) {
			return false;
		}
		if(s.wordWrap != this.wordWrap) {
			return false;
		}
		if(s.imageRendering != this.imageRendering) {
			return false;
		}
		if(s.layout != this.layout) {
			return false;
		}
		return true;
	}
	,createAnimationOptions: function() {
		if(this.animationOptions == null) {
			this.animationOptions = new haxe_ui_styles_animation_AnimationOptions(null,null,null,null,null,null);
		}
	}
	,clone: function() {
		var c = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		c.apply(this);
		return c;
	}
	,__class__: haxe_ui_styles_Style
	,__properties__: {get_fullBorderSize:"get_fullBorderSize",get_hasBorder:"get_hasBorder",get_borderType:"get_borderType",set_padding:"set_padding"}
};
var haxe_ui_styles_StyleSheet = function() {
	this._animations = new haxe_ds_StringMap();
	this._mediaQueries = [];
	this._rules = [];
	this._imports = [];
};
$hxClasses["haxe.ui.styles.StyleSheet"] = haxe_ui_styles_StyleSheet;
haxe_ui_styles_StyleSheet.__name__ = "haxe.ui.styles.StyleSheet";
haxe_ui_styles_StyleSheet.prototype = {
	name: null
	,_imports: null
	,_rules: null
	,_mediaQueries: null
	,_animations: null
	,get_animations: function() {
		return this._animations;
	}
	,addImport: function(el) {
		this._imports.push(el);
	}
	,imports: null
	,get_imports: function() {
		return this._imports;
	}
	,rules: null
	,get_rules: function() {
		var r = this._rules.slice();
		var _g = 0;
		var _g1 = this._mediaQueries;
		while(_g < _g1.length) {
			var mq = _g1[_g];
			++_g;
			if(mq.get_relevant()) {
				r = r.concat(mq.get_styleSheet().get_rules());
			}
		}
		return r;
	}
	,hasMediaQueries: null
	,get_hasMediaQueries: function() {
		return this._mediaQueries.length > 0;
	}
	,findRule: function(selector) {
		var _g = 0;
		var _g1 = this.get_rules();
		while(_g < _g1.length) {
			var r = _g1[_g];
			++_g;
			if(r.selector.toString() == selector) {
				return r;
			}
		}
		return null;
	}
	,findMatchingRules: function(selector) {
		var m = [];
		var _g = 0;
		var _g1 = this.get_rules();
		while(_g < _g1.length) {
			var r = _g1[_g];
			++_g;
			if(r.selector.toString() == selector) {
				m.push(r);
			}
		}
		return m;
	}
	,removeRule: function(selector) {
		var r = this.findRule(selector);
		if(r != null) {
			HxOverrides.remove(this._rules,r);
		}
	}
	,removeAllRules: function() {
		this._rules = [];
	}
	,clear: function() {
		this.removeAllRules();
		this._imports = [];
		this._mediaQueries = [];
		this._animations = new haxe_ds_StringMap();
	}
	,addRule: function(el) {
		this._rules.push(el);
	}
	,addMediaQuery: function(el) {
		this._mediaQueries.push(el);
	}
	,addAnimation: function(el) {
		this._animations.h[el.id] = el;
	}
	,parse: function(css) {
		var parser = new haxe_ui_styles_Parser();
		var ss = parser.parse(css);
		var f = new haxe_ui_styles_StyleSheet();
		var _g = 0;
		var _g1 = ss.get_imports();
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			var importCss = haxe_ui_ToolkitAssets.get_instance().getText(i.url);
			var importStyleSheet = new haxe_ui_styles_Parser().parse(importCss);
			f.merge(importStyleSheet);
		}
		f.merge(ss);
		this.merge(f);
	}
	,merge: function(styleSheet) {
		this._imports = this._imports.concat(styleSheet._imports);
		this._rules = this._rules.concat(styleSheet._rules);
		this._mediaQueries = this._mediaQueries.concat(styleSheet._mediaQueries);
		var h = styleSheet._animations.h;
		var k_h = h;
		var k_keys = Object.keys(h);
		var k_length = k_keys.length;
		var k_current = 0;
		while(k_current < k_length) {
			var k = k_keys[k_current++];
			this._animations.h[k] = styleSheet._animations.h[k];
		}
	}
	,buildStyleFor: function(c,style) {
		if(style == null) {
			style = new haxe_ui_styles_Style(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
		}
		var _g = 0;
		var _g1 = this.get_rules();
		while(_g < _g1.length) {
			var r = _g1[_g];
			++_g;
			if(!r.match(c)) {
				continue;
			}
			style.mergeDirectives(r.directives);
		}
		return style;
	}
	,__class__: haxe_ui_styles_StyleSheet
	,__properties__: {get_hasMediaQueries:"get_hasMediaQueries",get_rules:"get_rules",get_imports:"get_imports",get_animations:"get_animations"}
};
var haxe_ui_styles_Value = $hxEnums["haxe.ui.styles.Value"] = { __ename__:true,__constructs__:null
	,VString: ($_=function(v) { return {_hx_index:0,v:v,__enum__:"haxe.ui.styles.Value",toString:$estr}; },$_._hx_name="VString",$_.__params__ = ["v"],$_)
	,VNumber: ($_=function(v) { return {_hx_index:1,v:v,__enum__:"haxe.ui.styles.Value",toString:$estr}; },$_._hx_name="VNumber",$_.__params__ = ["v"],$_)
	,VBool: ($_=function(v) { return {_hx_index:2,v:v,__enum__:"haxe.ui.styles.Value",toString:$estr}; },$_._hx_name="VBool",$_.__params__ = ["v"],$_)
	,VDimension: ($_=function(v) { return {_hx_index:3,v:v,__enum__:"haxe.ui.styles.Value",toString:$estr}; },$_._hx_name="VDimension",$_.__params__ = ["v"],$_)
	,VColor: ($_=function(v) { return {_hx_index:4,v:v,__enum__:"haxe.ui.styles.Value",toString:$estr}; },$_._hx_name="VColor",$_.__params__ = ["v"],$_)
	,VCall: ($_=function(f,vl) { return {_hx_index:5,f:f,vl:vl,__enum__:"haxe.ui.styles.Value",toString:$estr}; },$_._hx_name="VCall",$_.__params__ = ["f","vl"],$_)
	,VConstant: ($_=function(v) { return {_hx_index:6,v:v,__enum__:"haxe.ui.styles.Value",toString:$estr}; },$_._hx_name="VConstant",$_.__params__ = ["v"],$_)
	,VComposite: ($_=function(vl) { return {_hx_index:7,vl:vl,__enum__:"haxe.ui.styles.Value",toString:$estr}; },$_._hx_name="VComposite",$_.__params__ = ["vl"],$_)
	,VTime: ($_=function(v,unit) { return {_hx_index:8,v:v,unit:unit,__enum__:"haxe.ui.styles.Value",toString:$estr}; },$_._hx_name="VTime",$_.__params__ = ["v","unit"],$_)
	,VNone: {_hx_name:"VNone",_hx_index:9,__enum__:"haxe.ui.styles.Value",toString:$estr}
};
haxe_ui_styles_Value.__constructs__ = [haxe_ui_styles_Value.VString,haxe_ui_styles_Value.VNumber,haxe_ui_styles_Value.VBool,haxe_ui_styles_Value.VDimension,haxe_ui_styles_Value.VColor,haxe_ui_styles_Value.VCall,haxe_ui_styles_Value.VConstant,haxe_ui_styles_Value.VComposite,haxe_ui_styles_Value.VTime,haxe_ui_styles_Value.VNone];
var haxe_ui_styles_ValueTools = function() { };
$hxClasses["haxe.ui.styles.ValueTools"] = haxe_ui_styles_ValueTools;
haxe_ui_styles_ValueTools.__name__ = "haxe.ui.styles.ValueTools";
haxe_ui_styles_ValueTools.parse = function(s) {
	var v = null;
	var hasSpace = s.indexOf(" ") != -1;
	if(StringTools.endsWith(s,"%") == true && hasSpace == false) {
		v = haxe_ui_styles_Value.VDimension(haxe_ui_styles_Dimension.PERCENT(parseFloat(s)));
	} else if(StringTools.endsWith(s,"px") == true && hasSpace == false) {
		v = haxe_ui_styles_Value.VDimension(haxe_ui_styles_Dimension.PX(parseFloat(s)));
	} else if(StringTools.endsWith(s,"vw") == true && hasSpace == false) {
		v = haxe_ui_styles_Value.VDimension(haxe_ui_styles_Dimension.VW(parseFloat(s)));
	} else if(StringTools.endsWith(s,"vh") == true && hasSpace == false) {
		v = haxe_ui_styles_Value.VDimension(haxe_ui_styles_Dimension.VH(parseFloat(s)));
	} else if(StringTools.endsWith(s,"rem") == true && hasSpace == false) {
		v = haxe_ui_styles_Value.VDimension(haxe_ui_styles_Dimension.REM(parseFloat(s)));
	} else if(haxe_ui_styles_ValueTools.validColor(s)) {
		v = haxe_ui_styles_ValueTools.parseColor(s);
	} else if(s == "none") {
		v = haxe_ui_styles_Value.VNone;
	} else if(s.indexOf("(") != -1 && StringTools.endsWith(s,")")) {
		var n = s.indexOf("(");
		var f = HxOverrides.substr(s,0,n);
		var params = HxOverrides.substr(s,n + 1,s.length - n - 2);
		if(f == "calc") {
			params = "'" + params + "'";
		}
		var vl = [];
		var _g = 0;
		var _g1 = params.split(",");
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			p = StringTools.trim(p);
			vl.push(haxe_ui_styles_ValueTools.parse(p));
		}
		v = haxe_ui_styles_Value.VCall(f,vl);
	} else if(StringTools.startsWith(s,"\"") && StringTools.endsWith(s,"\"")) {
		v = haxe_ui_styles_Value.VString(HxOverrides.substr(s,1,s.length - 2));
	} else if(StringTools.startsWith(s,"'") && StringTools.endsWith(s,"'")) {
		v = haxe_ui_styles_Value.VString(HxOverrides.substr(s,1,s.length - 2));
	} else if(haxe_ui_styles_ValueTools.isNum(s) == true) {
		v = haxe_ui_styles_Value.VNumber(parseFloat(s));
	} else if(s == "true" || s == "false") {
		v = haxe_ui_styles_Value.VBool(s == "true");
	} else if(haxe_ui_styles_ValueTools.timeEReg.match(s)) {
		v = haxe_ui_styles_Value.VTime(parseFloat(haxe_ui_styles_ValueTools.timeEReg.matched(1)),haxe_ui_styles_ValueTools.timeEReg.matched(2));
	} else {
		var arr = s.split(" ");
		if(arr.length == 1) {
			v = haxe_ui_styles_Value.VConstant(s);
		} else {
			var vl = [];
			var _g = 0;
			while(_g < arr.length) {
				var a = arr[_g];
				++_g;
				a = StringTools.trim(a);
				vl.push(haxe_ui_styles_ValueTools.parse(a));
			}
			v = haxe_ui_styles_Value.VComposite(vl);
		}
	}
	return v;
};
haxe_ui_styles_ValueTools.compositeParts = function(value) {
	if(value == null) {
		return 0;
	}
	if(value._hx_index == 7) {
		var vl = value.vl;
		return vl.length;
	} else {
		return 0;
	}
};
haxe_ui_styles_ValueTools.composite = function(value) {
	if(value == null) {
		return null;
	}
	switch(value._hx_index) {
	case 1:
		var _g = value.v;
		return [value];
	case 3:
		var _g = value.v;
		return [value];
	case 7:
		var vl = value.vl;
		return vl;
	case 9:
		return [];
	default:
		return null;
	}
};
haxe_ui_styles_ValueTools.isNum = function(s) {
	var b = true;
	var _g = 0;
	var _g1 = s.length;
	while(_g < _g1) {
		var i = _g++;
		var c = HxOverrides.cca(s,i);
		if(!(c >= 48 && c <= 57 || c == 46 || c == 45)) {
			b = false;
			break;
		}
	}
	return b;
};
haxe_ui_styles_ValueTools.parseColor = function(s) {
	if(StringTools.startsWith(s,"#")) {
		s = s.substring(1);
		if(s.length == 6) {
			return haxe_ui_styles_Value.VColor(Std.parseInt("0x" + s));
		} else if(s.length == 3) {
			return haxe_ui_styles_Value.VColor(Std.parseInt("0x" + s.charAt(0) + s.charAt(0) + s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2)));
		}
	} else if(Object.prototype.hasOwnProperty.call(haxe_ui_styles_ValueTools.colors.h,s)) {
		return haxe_ui_styles_Value.VColor(haxe_ui_styles_ValueTools.colors.h[s]);
	}
	return null;
};
haxe_ui_styles_ValueTools.validColor = function(s) {
	if(StringTools.startsWith(s,"#") && (s.length == 7 || s.length == 4)) {
		return true;
	} else if(Object.prototype.hasOwnProperty.call(haxe_ui_styles_ValueTools.colors.h,s)) {
		return true;
	}
	return false;
};
haxe_ui_styles_ValueTools.time = function(value) {
	if(value == null) {
		return null;
	}
	if(value._hx_index == 8) {
		var v = value.v;
		var unit = value.unit;
		switch(unit) {
		case "ms":
			return v / 1000;
		case "s":
			return v;
		default:
			return null;
		}
	} else {
		return null;
	}
};
haxe_ui_styles_ValueTools.string = function(value) {
	if(value == null) {
		return null;
	}
	switch(value._hx_index) {
	case 0:
		var v = value.v;
		return v;
	case 2:
		var v = value.v;
		if(v == null) {
			return "null";
		} else {
			return "" + v;
		}
		break;
	case 5:
		var f = value.f;
		var vl = value.vl;
		return haxe_ui_styles_ValueTools.call(f,vl);
	case 6:
		var v = value.v;
		return v;
	default:
		return null;
	}
};
haxe_ui_styles_ValueTools.bool = function(value) {
	if(value == null) {
		return null;
	}
	if(value._hx_index == 2) {
		var v = value.v;
		return v;
	} else {
		return null;
	}
};
haxe_ui_styles_ValueTools.none = function(value) {
	if(value == null) {
		return null;
	}
	if(value._hx_index == 9) {
		return true;
	} else {
		return null;
	}
};
haxe_ui_styles_ValueTools.int = function(value) {
	if(value == null) {
		return null;
	}
	switch(value._hx_index) {
	case 1:
		var v = value.v;
		return v | 0;
	case 4:
		var v = value.v;
		return v;
	case 5:
		var f = value.f;
		var vl = value.vl;
		return haxe_ui_styles_ValueTools.call(f,vl);
	case 9:
		return null;
	default:
		return null;
	}
};
haxe_ui_styles_ValueTools.float = function(value) {
	if(value == null) {
		return null;
	}
	switch(value._hx_index) {
	case 1:
		var v = value.v;
		return v;
	case 4:
		var v = value.v;
		return v;
	case 9:
		return null;
	default:
		return null;
	}
};
haxe_ui_styles_ValueTools.any = function(v) {
	if(v == null) {
		return null;
	}
	switch(v._hx_index) {
	case 1:
		var v1 = v.v;
		return v1;
	case 2:
		var v1 = v.v;
		return v1;
	case 3:
		var _g = v.v;
		if(_g._hx_index == 1) {
			var v1 = _g.value;
			return v1;
		} else {
			return null;
		}
		break;
	case 4:
		var v1 = v.v;
		return v1;
	default:
		return null;
	}
};
haxe_ui_styles_ValueTools.array = function(vl) {
	var arr = [];
	var _g = 0;
	while(_g < vl.length) {
		var v = vl[_g];
		++_g;
		var a = haxe_ui_styles_ValueTools.any(v);
		if(a != null) {
			arr.push(a);
		}
	}
	return arr;
};
haxe_ui_styles_ValueTools.percent = function(value) {
	if(value == null) {
		return null;
	}
	if(value._hx_index == 3) {
		var v = value.v;
		if(v._hx_index == 0) {
			var d = v.value;
			return d;
		} else {
			return null;
		}
	} else {
		return null;
	}
};
haxe_ui_styles_ValueTools.constant = function(value,required) {
	if(value == null) {
		return false;
	}
	if(value._hx_index == 6) {
		var v = value.v;
		return v == required;
	} else {
		return false;
	}
};
haxe_ui_styles_ValueTools.calcDimension = function(value) {
	if(value == null) {
		return null;
	}
	switch(value._hx_index) {
	case 1:
		var v = value.v;
		return v;
	case 3:
		var v = value.v;
		switch(v._hx_index) {
		case 1:
			var d = v.value;
			return d;
		case 2:
			var d = v.value;
			return d / 100 * haxe_ui_core_Screen.get_instance().get_width();
		case 3:
			var d = v.value;
			return d / 100 * haxe_ui_core_Screen.get_instance().get_height();
		case 4:
			var d = v.value;
			return d * haxe_ui_Toolkit.pixelsPerRem;
		default:
			return null;
		}
		break;
	case 5:
		var f = value.f;
		var vl = value.vl;
		return haxe_ui_styles_ValueTools.call(f,vl);
	case 9:
		return null;
	default:
		return null;
	}
};
haxe_ui_styles_ValueTools.calcEasing = function(value) {
	switch(value._hx_index) {
	case 0:
		var v = value.v;
		switch(v) {
		case "ease":
			return haxe_ui_styles_EasingFunction.EASE;
		case "ease-in":
			return haxe_ui_styles_EasingFunction.EASE_IN;
		case "ease-in-out":
			return haxe_ui_styles_EasingFunction.EASE_IN_OUT;
		case "ease-out":
			return haxe_ui_styles_EasingFunction.EASE_OUT;
		case "linear":
			return haxe_ui_styles_EasingFunction.LINEAR;
		default:
			return null;
		}
		break;
	case 6:
		var v = value.v;
		switch(v) {
		case "ease":
			return haxe_ui_styles_EasingFunction.EASE;
		case "ease-in":
			return haxe_ui_styles_EasingFunction.EASE_IN;
		case "ease-in-out":
			return haxe_ui_styles_EasingFunction.EASE_IN_OUT;
		case "ease-out":
			return haxe_ui_styles_EasingFunction.EASE_OUT;
		case "linear":
			return haxe_ui_styles_EasingFunction.LINEAR;
		default:
			return null;
		}
		break;
	default:
		return null;
	}
};
haxe_ui_styles_ValueTools.call = function(f,vl) {
	switch(f) {
	case "calc":
		return null;
	case "platform-color":
		return haxe_ui_core_Platform.get_instance().getColor(haxe_ui_styles_ValueTools.string(vl[0]));
	case "rgb":
		return haxe_ui_util_Color.toInt(haxe_ui_util_Color.fromComponents(haxe_ui_styles_ValueTools.int(vl[0]),haxe_ui_styles_ValueTools.int(vl[1]),haxe_ui_styles_ValueTools.int(vl[2]),0));
	case "theme-icon":case "theme-image":
		return haxe_ui_themes_ThemeManager.get_instance().image(haxe_ui_styles_ValueTools.string(vl[0]));
	default:
		return null;
	}
};
var haxe_ui_styles_animation_AnimationOptions = function(duration,delay,iterationCount,easingFunction,direction,fillMode) {
	this.duration = duration;
	this.delay = delay;
	this.iterationCount = iterationCount;
	this.easingFunction = easingFunction;
	this.direction = direction;
	this.fillMode = fillMode;
};
$hxClasses["haxe.ui.styles.animation.AnimationOptions"] = haxe_ui_styles_animation_AnimationOptions;
haxe_ui_styles_animation_AnimationOptions.__name__ = "haxe.ui.styles.animation.AnimationOptions";
haxe_ui_styles_animation_AnimationOptions.prototype = {
	duration: null
	,delay: null
	,iterationCount: null
	,easingFunction: null
	,direction: null
	,fillMode: null
	,compareTo: function(op) {
		if(op != null && op.duration == this.duration && op.delay == this.delay && op.iterationCount == this.iterationCount && op.easingFunction == this.easingFunction && op.direction == this.direction) {
			return op.fillMode == this.fillMode;
		} else {
			return false;
		}
	}
	,compareToAnimation: function(anim) {
		if((this.duration == null && anim.duration == 0 || this.duration != null && anim.duration == this.duration) && (this.delay == null && anim.delay == 0 || this.delay != null && anim.delay == this.delay) && (this.iterationCount == null && anim.iterationCount == 1 || this.iterationCount != null && anim.iterationCount == this.iterationCount) && (this.easingFunction == null && anim.easingFunction == haxe_ui_styles_animation_AnimationOptions.DEFAULT_EASING_FUNCTION || this.easingFunction != null && anim.easingFunction == this.easingFunction) && (this.direction == null && anim.direction == "normal" || this.direction != null && anim.direction == this.direction)) {
			if(!(this.fillMode == null && anim.fillMode == "forwards")) {
				if(this.fillMode != null) {
					return anim.fillMode == this.fillMode;
				} else {
					return false;
				}
			} else {
				return true;
			}
		} else {
			return false;
		}
	}
	,__class__: haxe_ui_styles_animation_AnimationOptions
};
var haxe_ui_styles_animation_Animation = function(target,options) {
	this._initialized = false;
	this._currentIterationCount = -1;
	this._currentKeyFrameIndex = -1;
	this.iterationCount = 1;
	this.fillMode = "forwards";
	this.easingFunction = haxe_ui_styles_animation_AnimationOptions.DEFAULT_EASING_FUNCTION;
	this.duration = 0;
	this.direction = "normal";
	this.delay = 0;
	this.target = target;
	if(options != null) {
		if(options.duration != null) {
			this.duration = options.duration;
		}
		if(options.easingFunction != null) {
			this.easingFunction = options.easingFunction;
		}
		if(options.delay != null) {
			this.delay = options.delay;
		}
		if(options.iterationCount != null) {
			this.iterationCount = options.iterationCount;
		}
		if(options.direction != null) {
			this.direction = options.direction;
		}
		if(options.fillMode != null) {
			this.fillMode = options.fillMode;
		}
	}
};
$hxClasses["haxe.ui.styles.animation.Animation"] = haxe_ui_styles_animation_Animation;
haxe_ui_styles_animation_Animation.__name__ = "haxe.ui.styles.animation.Animation";
haxe_ui_styles_animation_Animation.createWithKeyFrames = function(animationKeyFrames,target,options) {
	var animation = new haxe_ui_styles_animation_Animation(target,options);
	animation.name = animationKeyFrames.id;
	if(animation._keyframes == null) {
		animation._keyframes = [];
	}
	var _g = 0;
	var _g1 = animationKeyFrames.get_keyFrames();
	while(_g < _g1.length) {
		var keyFrame = _g1[_g];
		++_g;
		var kf = new haxe_ui_styles_animation_KeyFrame();
		var _g2 = keyFrame.time;
		if(_g2._hx_index == 3) {
			var v = _g2.v;
			if(v._hx_index == 0) {
				var p = v.value;
				kf.time = p / 100;
				kf.easingFunction = animation.easingFunction;
				kf.directives = keyFrame.directives;
				animation._keyframes.push(kf);
			}
		}
	}
	return animation;
};
haxe_ui_styles_animation_Animation.prototype = {
	delay: null
	,direction: null
	,duration: null
	,easingFunction: null
	,fillMode: null
	,iterationCount: null
	,name: null
	,running: null
	,target: null
	,run: function(onFinish) {
		if(this.get_keyframeCount() == 0 || this.running) {
			return;
		}
		if(!this._initialized) {
			this._initialize();
		}
		this._currentKeyFrameIndex = -1;
		this._currentIterationCount = 0;
		this.running = true;
		this._saveState();
		this._runNextKeyframe(onFinish);
	}
	,stop: function() {
		if(this.running == false) {
			return;
		}
		this.running = false;
		var currentKF = this.get_currentKeyFrame();
		if(currentKF != null) {
			currentKF.stop();
			this._currentKeyFrameIndex = -1;
		}
		this._keyframes = null;
		this._restoreState();
	}
	,_currentKeyFrameIndex: null
	,_currentIterationCount: null
	,_initialState: null
	,_initialized: null
	,_keyframes: null
	,get_keyframeCount: function() {
		if(this._keyframes == null) {
			return 0;
		} else {
			return this._keyframes.length;
		}
	}
	,get_currentKeyFrame: function() {
		if(this._currentKeyFrameIndex >= 0) {
			return this._keyframes[this._currentKeyFrameIndex];
		} else {
			return null;
		}
	}
	,_initialize: function() {
		switch(this.direction) {
		case "alternate":
			this._addAlternateKeyframes();
			break;
		case "alternate-reverse":
			this._reverseCurrentKeyframes();
			this._addAlternateKeyframes();
			break;
		case "normal":
			break;
		case "reverse":
			this._reverseCurrentKeyframes();
			break;
		}
		var currentTime = 0;
		var _g = 0;
		var _g1 = this._keyframes;
		while(_g < _g1.length) {
			var keyframe = _g1[_g];
			++_g;
			switch(this.direction) {
			case "alternate-reverse":case "reverse":
				keyframe.time = 1 - keyframe.time;
				break;
			case "alternate":case "normal":
				break;
			}
			keyframe.time = this.duration * keyframe.time - currentTime;
			currentTime += keyframe.time;
		}
		if(this.delay > 0) {
			var keyframe = new haxe_ui_styles_animation_KeyFrame();
			keyframe.time = this.delay;
			keyframe.easingFunction = this.easingFunction;
			this._keyframes.unshift(keyframe);
		} else if(this.delay < 0) {
			currentTime = 0;
			var lastKeyframe = null;
			while(this._keyframes.length > 0) {
				var keyframe = this._keyframes[0];
				currentTime -= keyframe.time;
				if(currentTime >= this.delay) {
					lastKeyframe = keyframe;
					this._keyframes.splice(0,1);
				} else {
					keyframe.delay = -(currentTime - this.delay + keyframe.time);
					if(lastKeyframe != null) {
						lastKeyframe.time = 0;
						this._keyframes.unshift(lastKeyframe);
					}
					break;
				}
			}
		}
		this._initialized = true;
	}
	,_runNextKeyframe: function(onFinish) {
		if(this.running == false) {
			return;
		}
		if(++this._currentKeyFrameIndex >= this._keyframes.length) {
			this._currentKeyFrameIndex = -1;
			this._restoreState();
			if(this.iterationCount == -1 || ++this._currentIterationCount < this.iterationCount) {
				this._saveState();
				this._runNextKeyframe(onFinish);
			} else {
				this.running = false;
				if(onFinish != null) {
					onFinish();
				}
			}
			return;
		} else {
			var _g = $bind(this,this._runNextKeyframe);
			var onFinish1 = onFinish;
			var tmp = function() {
				_g(onFinish1);
			};
			this.get_currentKeyFrame().run(this.target,tmp);
		}
	}
	,_addAlternateKeyframes: function() {
		var i = this._keyframes.length;
		while(--i >= 0) {
			var keyframe = this._keyframes[i];
			var newKeyframe = new haxe_ui_styles_animation_KeyFrame();
			newKeyframe.time = 1 - keyframe.time;
			newKeyframe.easingFunction = this._getReverseEasingFunction(keyframe.easingFunction);
			newKeyframe.directives = keyframe.directives;
			this._keyframes.push(newKeyframe);
		}
	}
	,_reverseCurrentKeyframes: function() {
		this._keyframes.reverse();
		var func = this._getReverseEasingFunction(this.easingFunction);
		var _g = 0;
		var _g1 = this._keyframes;
		while(_g < _g1.length) {
			var keyframe = _g1[_g];
			++_g;
			keyframe.easingFunction = func;
		}
	}
	,_getReverseEasingFunction: function(easingFunction) {
		switch(easingFunction._hx_index) {
		case 2:
			return haxe_ui_styles_EasingFunction.EASE_OUT;
		case 3:
			return haxe_ui_styles_EasingFunction.EASE_IN;
		default:
			return easingFunction;
		}
	}
	,_saveState: function() {
		if(!this._shouldRestoreState()) {
			return;
		}
		if(this._initialState == null) {
			this._initialState = new haxe_ds_StringMap();
		}
		var _g = 0;
		var _g1 = this._keyframes;
		while(_g < _g1.length) {
			var keyframe = _g1[_g];
			++_g;
			var _g2 = 0;
			var _g3 = keyframe.directives;
			while(_g2 < _g3.length) {
				var directive = _g3[_g2];
				++_g2;
				var property = haxe_ui_util_StyleUtil.styleProperty2ComponentProperty(directive.directive);
				if(!Object.prototype.hasOwnProperty.call(this._initialState.h,property)) {
					var this1 = this._initialState;
					var value = Reflect.getProperty(this.target,property);
					this1.h[property] = value;
				}
			}
		}
	}
	,_restoreState: function() {
		if(!this._shouldRestoreState()) {
			return;
		}
		if(this._initialState != null) {
			var h = this._initialState.h;
			var property_h = h;
			var property_keys = Object.keys(h);
			var property_length = property_keys.length;
			var property_current = 0;
			while(property_current < property_length) {
				var property = property_keys[property_current++];
				Reflect.setProperty(this.target,property,this._initialState.h[property]);
			}
			this._initialState = null;
		}
	}
	,_shouldRestoreState: function() {
		if(!(this.fillMode == "none" || this.fillMode == "forwards" && this.direction != "normal" && this.direction != "alternate")) {
			if(this.fillMode == "backwards" && this.direction != "reverse") {
				return this.direction != "alternate-reverse";
			} else {
				return false;
			}
		} else {
			return true;
		}
	}
	,__class__: haxe_ui_styles_animation_Animation
	,__properties__: {get_keyframeCount:"get_keyframeCount",get_currentKeyFrame:"get_currentKeyFrame"}
};
var haxe_ui_styles_animation_KeyFrame = function() {
	this.delay = 0;
	this.time = 0;
	this.directives = [];
};
$hxClasses["haxe.ui.styles.animation.KeyFrame"] = haxe_ui_styles_animation_KeyFrame;
haxe_ui_styles_animation_KeyFrame.__name__ = "haxe.ui.styles.animation.KeyFrame";
haxe_ui_styles_animation_KeyFrame.prototype = {
	directives: null
	,time: null
	,delay: null
	,easingFunction: null
	,_actuator: null
	,stop: function() {
		if(this._actuator != null) {
			this._actuator.stop();
			this._actuator = null;
		}
	}
	,run: function(target,cb) {
		var _gthis = this;
		if(this._actuator != null) {
			return;
		}
		var properties = { };
		var _g = 0;
		var _g1 = this.directives;
		while(_g < _g1.length) {
			var d = _g1[_g];
			++_g;
			properties[d.directive] = d.value;
		}
		this._actuator = new haxe_ui_styles_animation_util_Actuator(target,properties,this.time,new haxe_ui_styles_animation_util_ActuatorOptions(this.delay,this.easingFunction,function() {
			_gthis._actuator = null;
			cb();
		},null));
		this._actuator.run();
	}
	,__class__: haxe_ui_styles_animation_KeyFrame
};
var haxe_ui_styles_animation_util_ActuatorOptions = function(delay,easingFunction,onComplete,onUpdate) {
	this.delay = delay;
	this.easingFunction = easingFunction;
	this.onComplete = onComplete;
	this.onUpdate = onUpdate;
};
$hxClasses["haxe.ui.styles.animation.util.ActuatorOptions"] = haxe_ui_styles_animation_util_ActuatorOptions;
haxe_ui_styles_animation_util_ActuatorOptions.__name__ = "haxe.ui.styles.animation.util.ActuatorOptions";
haxe_ui_styles_animation_util_ActuatorOptions.prototype = {
	delay: null
	,easingFunction: null
	,onComplete: null
	,onUpdate: null
	,__class__: haxe_ui_styles_animation_util_ActuatorOptions
};
var haxe_ui_styles_animation_util_Actuator = function(target,properties,duration,options) {
	this.delay = 0;
	this.duration = 0;
	this.target = target;
	this.properties = properties;
	this.duration = duration;
	if(options != null) {
		this._easeFunc = haxe_ui_styles_animation_util__$Actuator_Ease.get(options.easingFunction != null ? options.easingFunction : haxe_ui_styles_EasingFunction.EASE);
		if(options.delay != null) {
			this.delay = options.delay;
		}
		if(options.onComplete != null) {
			this._onComplete = options.onComplete;
		}
		if(options.onUpdate != null) {
			this._onUpdate = options.onUpdate;
		}
	}
};
$hxClasses["haxe.ui.styles.animation.util.Actuator"] = haxe_ui_styles_animation_util_Actuator;
haxe_ui_styles_animation_util_Actuator.__name__ = "haxe.ui.styles.animation.util.Actuator";
haxe_ui_styles_animation_util_Actuator.tween = function(target,properties,duration,options) {
	var actuator = new haxe_ui_styles_animation_util_Actuator(target,properties,duration,options);
	actuator.run();
	return actuator;
};
haxe_ui_styles_animation_util_Actuator.prototype = {
	target: null
	,properties: null
	,duration: null
	,delay: null
	,stop: function() {
		this._stopped = true;
		this.target = null;
	}
	,run: function() {
		this._initialize();
		this._stopped = false;
		if(this.duration == 0) {
			this._apply(1);
			this._finish();
		} else {
			this._currentTime = HxOverrides.now() / 1000;
			if(this.delay > 0) {
				haxe_ui_util_Timer.delay($bind(this,this._nextFrame),this.delay * 1000 | 0);
			} else {
				new haxe_ui_CallLater($bind(this,this._nextFrame));
			}
		}
	}
	,_currentTime: null
	,_easeFunc: null
	,_onComplete: null
	,_onUpdate: null
	,_stopped: null
	,_propertyDetails: null
	,_colorPropertyDetails: null
	,_stringPropertyDetails: null
	,_initialize: function() {
		if(this._isValid() == false) {
			this.stop();
			return;
		}
		this._propertyDetails = [];
		this._colorPropertyDetails = [];
		this._stringPropertyDetails = [];
		var _g = 0;
		var _g1 = Reflect.fields(this.properties);
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			var componentProperty = haxe_ui_util_StyleUtil.styleProperty2ComponentProperty(p);
			var end = Reflect.getProperty(this.properties,p);
			if(end._hx_index == 3) {
				var _g2 = end.v;
				if(_g2._hx_index == 0) {
					var v = _g2.value;
					componentProperty = "percent" + haxe_ui_util_StringUtil.capitalizeFirstLetter(componentProperty);
				}
			}
			var start = Reflect.getProperty(this.target,componentProperty);
			if(start == null) {
				switch(end._hx_index) {
				case 0:
					var v1 = end.v;
					start = v1;
					break;
				case 1:
					var v2 = end.v;
					start = 0;
					break;
				case 3:
					var _g3 = end.v;
					if(_g3._hx_index == 0) {
						var v3 = _g3.value;
						start = 0;
					}
					break;
				default:
				}
			}
			var isVariant = false;
			if(start != null) {
				try {
					if(start._hx_index == 2) {
						var v4 = start.s;
						start = v4;
						isVariant = true;
					}
				} catch( _g4 ) {
				}
			}
			if(end != null) {
				try {
					if(end._hx_index == 2) {
						var v5 = end.s;
						end = v5;
						isVariant = true;
					}
				} catch( _g5 ) {
				}
			}
			if(start == null || end == null) {
				continue;
			}
			switch(end._hx_index) {
			case 0:
				var v6 = end.v;
				var startVal = start;
				var endVal = haxe_ui_styles_ValueTools.string(end);
				if(endVal.indexOf("[[") != -1) {
					var n1 = endVal.indexOf("[[");
					var n2 = endVal.indexOf("]]") + 2;
					var before = HxOverrides.substr(endVal,0,n1);
					var after = HxOverrides.substr(endVal,n2,null);
					var s = StringTools.replace(startVal,before,"");
					s = StringTools.replace(s,after,"");
					var startInt = Std.parseInt(s);
					var s1 = StringTools.replace(endVal,before + "[[","");
					s1 = StringTools.replace(s1,"]]" + after,"");
					var endInt = Std.parseInt(s1);
					var details = new haxe_ui_styles_animation_util_StringPropertyDetails(this.target,componentProperty,startVal,endVal);
					details.pattern = before + "[[n]]" + after;
					details.startInt = startInt;
					details.changeInt = endInt - startInt;
					var c = js_Boot.getClass(this.target);
					var typeInfo = haxe_ui_core_TypeMap.getTypeInfo(c.__name__,componentProperty);
					if(typeInfo != null && isVariant == false && typeInfo == "Variant") {
						isVariant = true;
					}
					details.isVariant = isVariant;
					this._stringPropertyDetails.push(details);
				} else {
					var details1 = new haxe_ui_styles_animation_util_StringPropertyDetails(this.target,componentProperty,startVal,endVal);
					this._stringPropertyDetails.push(details1);
				}
				break;
			case 3:
				var _g6 = end.v;
				if(_g6._hx_index == 0) {
					var v7 = _g6.value;
					var val = v7;
					if(val != null) {
						var details2 = new haxe_ui_styles_animation_util_PropertyDetails(this.target,componentProperty,start,val - start);
						this._propertyDetails.push(details2);
					}
				} else {
					var val1 = haxe_ui_styles_ValueTools.calcDimension(end);
					if(val1 != null) {
						var details3 = new haxe_ui_styles_animation_util_PropertyDetails(this.target,componentProperty,start,val1 - start);
						this._propertyDetails.push(details3);
					} else {
						var details4 = new haxe_ui_styles_animation_util_PropertyDetails(this.target,componentProperty,start,end - start);
						this._propertyDetails.push(details4);
					}
				}
				break;
			case 4:
				var v8 = end.v;
				var startColor = js_Boot.__cast(start , Int);
				var endColor = v8;
				var details5 = new haxe_ui_styles_animation_util_ColorPropertyDetails(this.target,componentProperty,startColor,(endColor >> 16 & 255) - (startColor >> 16 & 255),(endColor >> 8 & 255) - (startColor >> 8 & 255),(endColor & 255) - (startColor & 255),(endColor >> 24 & 255) - (startColor >> 24 & 255));
				if(this._colorPropertyDetails == null) {
					this._colorPropertyDetails = [];
				}
				this._colorPropertyDetails.push(details5);
				break;
			default:
				var val2 = haxe_ui_styles_ValueTools.calcDimension(end);
				if(val2 != null) {
					var details6 = new haxe_ui_styles_animation_util_PropertyDetails(this.target,componentProperty,start,val2 - start);
					this._propertyDetails.push(details6);
				} else {
					var details7 = new haxe_ui_styles_animation_util_PropertyDetails(this.target,componentProperty,start,end - start);
					this._propertyDetails.push(details7);
				}
			}
		}
	}
	,_nextFrame: function() {
		if(this._stopped == true) {
			return;
		}
		var currentTime = HxOverrides.now() / 1000;
		var delta = currentTime - this._currentTime;
		if(this.delay < 0) {
			delta += -this.delay;
		}
		var tweenPosition = delta / this.duration;
		if(tweenPosition > 1) {
			tweenPosition = 1;
		}
		this._apply(tweenPosition);
		if(this._onUpdate != null) {
			this._onUpdate(currentTime);
		}
		if(delta >= this.duration) {
			this._finish();
		} else {
			new haxe_ui_CallLater($bind(this,this._nextFrame));
		}
	}
	,_isValid: function() {
		if(this.target == null) {
			return false;
		}
		if(((this.target) instanceof haxe_ui_core_Component)) {
			var c = this.target;
			if(c._isDisposed == true) {
				return false;
			}
		}
		return true;
	}
	,_apply: function(position) {
		if(this._isValid() == false) {
			this.stop();
			return;
		}
		position = this._easeFunc(position);
		var _g = 0;
		var _g1 = this._propertyDetails;
		while(_g < _g1.length) {
			var details = _g1[_g];
			++_g;
			Reflect.setProperty(this.target,details.propertyName,details.start + details.change * position);
		}
		var _g = 0;
		var _g1 = this._stringPropertyDetails;
		while(_g < _g1.length) {
			var details = _g1[_g];
			++_g;
			if(details.pattern != null) {
				var newInt = details.startInt + position * details.changeInt | 0;
				var newString = StringTools.replace(details.pattern,"[[n]]","" + newInt);
				if(details.isVariant) {
					var v = haxe_ui_util_Variant.fromString(newString);
					Reflect.setProperty(this.target,details.propertyName,v);
				} else {
					Reflect.setProperty(this.target,details.propertyName,newString);
				}
			} else if(position != 1) {
				Reflect.setProperty(this.target,details.propertyName,details.start);
			} else {
				Reflect.setProperty(this.target,details.propertyName,details.end);
			}
		}
		var _g = 0;
		var _g1 = this._colorPropertyDetails;
		while(_g < _g1.length) {
			var details = _g1[_g];
			++_g;
			var currentColor = haxe_ui_util_Color.fromComponents((details.start >> 16 & 255) + details.changeR * position | 0,(details.start >> 8 & 255) + details.changeG * position | 0,(details.start & 255) + details.changeB * position | 0,(details.start >> 24 & 255) + details.changeA * position | 0);
			Reflect.setProperty(details.target,details.propertyName,currentColor);
		}
	}
	,_finish: function() {
		this._stopped = true;
		this.target = null;
		if(this._onComplete != null) {
			this._onComplete();
		}
	}
	,__class__: haxe_ui_styles_animation_util_Actuator
};
var haxe_ui_styles_animation_util__$Actuator_Ease = function() { };
$hxClasses["haxe.ui.styles.animation.util._Actuator.Ease"] = haxe_ui_styles_animation_util__$Actuator_Ease;
haxe_ui_styles_animation_util__$Actuator_Ease.__name__ = "haxe.ui.styles.animation.util._Actuator.Ease";
haxe_ui_styles_animation_util__$Actuator_Ease.get = function(easingFunction) {
	switch(easingFunction._hx_index) {
	case 0:
		return haxe_ui_styles_animation_util__$Actuator_Ease.linear;
	case 2:
		return haxe_ui_styles_animation_util__$Actuator_Ease.easeIn;
	case 3:
		return haxe_ui_styles_animation_util__$Actuator_Ease.easeOut;
	case 1:case 4:
		return haxe_ui_styles_animation_util__$Actuator_Ease.easeInOut;
	}
};
haxe_ui_styles_animation_util__$Actuator_Ease.linear = function(k) {
	return k;
};
haxe_ui_styles_animation_util__$Actuator_Ease.easeIn = function(k) {
	return k * k * k;
};
haxe_ui_styles_animation_util__$Actuator_Ease.easeOut = function(k) {
	return --k * k * k + 1;
};
haxe_ui_styles_animation_util__$Actuator_Ease.easeInOut = function(k) {
	if((k /= 0.5) < 1) {
		return 0.5 * k * k * k;
	} else {
		return 0.5 * ((k -= 2) * k * k + 2);
	}
};
var haxe_ui_styles_animation_util_ColorPropertyDetails = function(target,propertyName,start,changeR,changeG,changeB,changeA) {
	this.target = target;
	this.propertyName = propertyName;
	this.start = start;
	this.changeR = changeR;
	this.changeG = changeG;
	this.changeB = changeB;
	this.changeA = changeA;
};
$hxClasses["haxe.ui.styles.animation.util.ColorPropertyDetails"] = haxe_ui_styles_animation_util_ColorPropertyDetails;
haxe_ui_styles_animation_util_ColorPropertyDetails.__name__ = "haxe.ui.styles.animation.util.ColorPropertyDetails";
haxe_ui_styles_animation_util_ColorPropertyDetails.prototype = {
	changeR: null
	,changeG: null
	,changeB: null
	,changeA: null
	,propertyName: null
	,start: null
	,target: null
	,__class__: haxe_ui_styles_animation_util_ColorPropertyDetails
};
var haxe_ui_styles_animation_util_PropertyDetails = function(target,propertyName,start,change) {
	this.target = target;
	this.propertyName = propertyName;
	this.start = start;
	this.change = change;
};
$hxClasses["haxe.ui.styles.animation.util.PropertyDetails"] = haxe_ui_styles_animation_util_PropertyDetails;
haxe_ui_styles_animation_util_PropertyDetails.__name__ = "haxe.ui.styles.animation.util.PropertyDetails";
haxe_ui_styles_animation_util_PropertyDetails.prototype = {
	change: null
	,propertyName: null
	,start: null
	,target: null
	,__class__: haxe_ui_styles_animation_util_PropertyDetails
};
var haxe_ui_styles_animation_util_StringPropertyDetails = function(target,propertyName,start,end) {
	this.isVariant = false;
	this.pattern = null;
	this.target = target;
	this.propertyName = propertyName;
	this.start = start;
	this.end = end;
};
$hxClasses["haxe.ui.styles.animation.util.StringPropertyDetails"] = haxe_ui_styles_animation_util_StringPropertyDetails;
haxe_ui_styles_animation_util_StringPropertyDetails.__name__ = "haxe.ui.styles.animation.util.StringPropertyDetails";
haxe_ui_styles_animation_util_StringPropertyDetails.prototype = {
	propertyName: null
	,start: null
	,end: null
	,target: null
	,startInt: null
	,changeInt: null
	,pattern: null
	,isVariant: null
	,__class__: haxe_ui_styles_animation_util_StringPropertyDetails
};
var haxe_ui_styles_elements_AnimationKeyFrame = function() {
};
$hxClasses["haxe.ui.styles.elements.AnimationKeyFrame"] = haxe_ui_styles_elements_AnimationKeyFrame;
haxe_ui_styles_elements_AnimationKeyFrame.__name__ = "haxe.ui.styles.elements.AnimationKeyFrame";
haxe_ui_styles_elements_AnimationKeyFrame.prototype = {
	time: null
	,directives: null
	,set: function(directive) {
		var found = false;
		var _g = 0;
		var _g1 = this.directives;
		while(_g < _g1.length) {
			var d = _g1[_g];
			++_g;
			if(d.directive == directive.directive) {
				d.value = directive.value;
				found = true;
			}
		}
		if(found == false) {
			this.directives.push(directive);
		}
	}
	,find: function(id) {
		var _g = 0;
		var _g1 = this.directives;
		while(_g < _g1.length) {
			var d = _g1[_g];
			++_g;
			if(d.directive == id) {
				return d;
			}
		}
		return null;
	}
	,clear: function() {
		this.directives = [];
	}
	,__class__: haxe_ui_styles_elements_AnimationKeyFrame
};
var haxe_ui_styles_elements_AnimationKeyFrames = function(id,keyframes) {
	this._keyframes = [];
	this.id = id;
	this._keyframes = keyframes;
};
$hxClasses["haxe.ui.styles.elements.AnimationKeyFrames"] = haxe_ui_styles_elements_AnimationKeyFrames;
haxe_ui_styles_elements_AnimationKeyFrames.__name__ = "haxe.ui.styles.elements.AnimationKeyFrames";
haxe_ui_styles_elements_AnimationKeyFrames.prototype = {
	id: null
	,_keyframes: null
	,keyFrames: null
	,get_keyFrames: function() {
		return this._keyframes;
	}
	,__class__: haxe_ui_styles_elements_AnimationKeyFrames
	,__properties__: {get_keyFrames:"get_keyFrames"}
};
var haxe_ui_styles_elements_Directive = function(directive,value,defective) {
	if(defective == null) {
		defective = false;
	}
	this.defective = false;
	this.value = null;
	this.directive = null;
	this.directive = directive;
	this.value = value;
	this.defective = defective;
};
$hxClasses["haxe.ui.styles.elements.Directive"] = haxe_ui_styles_elements_Directive;
haxe_ui_styles_elements_Directive.__name__ = "haxe.ui.styles.elements.Directive";
haxe_ui_styles_elements_Directive.prototype = {
	directive: null
	,value: null
	,defective: null
	,__class__: haxe_ui_styles_elements_Directive
};
var haxe_ui_styles_elements_ImportElement = function(url) {
	this.url = url;
};
$hxClasses["haxe.ui.styles.elements.ImportElement"] = haxe_ui_styles_elements_ImportElement;
haxe_ui_styles_elements_ImportElement.__name__ = "haxe.ui.styles.elements.ImportElement";
haxe_ui_styles_elements_ImportElement.prototype = {
	url: null
	,__class__: haxe_ui_styles_elements_ImportElement
};
var haxe_ui_styles_elements_MediaQuery = function(directives,styleSheet) {
	this._directives = [];
	this._directives = directives;
	this._styleSheet = styleSheet;
};
$hxClasses["haxe.ui.styles.elements.MediaQuery"] = haxe_ui_styles_elements_MediaQuery;
haxe_ui_styles_elements_MediaQuery.__name__ = "haxe.ui.styles.elements.MediaQuery";
haxe_ui_styles_elements_MediaQuery.prototype = {
	_directives: null
	,_styleSheet: null
	,addDirective: function(el) {
		this._directives.push(el);
	}
	,relevant: null
	,get_relevant: function() {
		var b = true;
		var _g = 0;
		var _g1 = this._directives;
		while(_g < _g1.length) {
			var d = _g1[_g];
			++_g;
			switch(d.directive) {
			case "backend":
				b = b && haxe_ui_Backend.get_id() == haxe_ui_styles_ValueTools.string(d.value);
				break;
			case "max-aspect-ratio":
				var sr = haxe_ui_core_Screen.get_instance().get_width() / haxe_ui_core_Screen.get_instance().get_height();
				b = b && sr < this.buildRatio(haxe_ui_styles_ValueTools.string(d.value));
				break;
			case "max-height":
				b = b && haxe_ui_core_Screen.get_instance().get_height() < haxe_ui_styles_ValueTools.calcDimension(d.value);
				break;
			case "max-width":
				b = b && haxe_ui_core_Screen.get_instance().get_width() < haxe_ui_styles_ValueTools.calcDimension(d.value);
				break;
			case "min-aspect-ratio":
				var sr1 = haxe_ui_core_Screen.get_instance().get_width() / haxe_ui_core_Screen.get_instance().get_height();
				b = b && sr1 > this.buildRatio(haxe_ui_styles_ValueTools.string(d.value));
				break;
			case "min-height":
				b = b && haxe_ui_core_Screen.get_instance().get_height() > haxe_ui_styles_ValueTools.calcDimension(d.value);
				break;
			case "min-width":
				b = b && haxe_ui_core_Screen.get_instance().get_width() > haxe_ui_styles_ValueTools.calcDimension(d.value);
				break;
			case "orientation":
				var v = haxe_ui_styles_ValueTools.string(d.value);
				if(v == "landscape") {
					b = b && haxe_ui_core_Screen.get_instance().get_width() > haxe_ui_core_Screen.get_instance().get_height();
				} else if(v == "portrait") {
					b = b && haxe_ui_core_Screen.get_instance().get_height() > haxe_ui_core_Screen.get_instance().get_width();
				}
				break;
			default:
				haxe_Log.trace("WARN: media query \"" + d.directive + "\" not recognized",{ fileName : "haxe/ui/styles/elements/MediaQuery.hx", lineNumber : 49, className : "haxe.ui.styles.elements.MediaQuery", methodName : "get_relevant"});
			}
		}
		return b;
	}
	,buildRatio: function(s) {
		var p = s.split("/");
		var w = Std.parseInt(StringTools.trim(p[0]));
		var h = Std.parseInt(StringTools.trim(p[1]));
		return w / h;
	}
	,styleSheet: null
	,get_styleSheet: function() {
		return this._styleSheet;
	}
	,__class__: haxe_ui_styles_elements_MediaQuery
	,__properties__: {get_styleSheet:"get_styleSheet",get_relevant:"get_relevant"}
};
var haxe_ui_styles_elements_RuleElement = function(selector,directives) {
	this.directives = new haxe_ds_StringMap();
	this.selector = new haxe_ui_styles_elements_Selector(selector);
	var _g = 0;
	while(_g < directives.length) {
		var d = directives[_g];
		++_g;
		this.processDirective(d);
	}
};
$hxClasses["haxe.ui.styles.elements.RuleElement"] = haxe_ui_styles_elements_RuleElement;
haxe_ui_styles_elements_RuleElement.__name__ = "haxe.ui.styles.elements.RuleElement";
haxe_ui_styles_elements_RuleElement.ruleMatch = function(c,d) {
	if(c.nodeName == "*") {
		return true;
	}
	if(c.pseudoClass != null) {
		var pc = ":" + c.pseudoClass;
		if(d.classes.indexOf(pc) != -1 == false) {
			return false;
		}
	}
	if(c.className != null) {
		var _g = 0;
		var _g1 = c.get_classNameParts();
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(d.classes.indexOf(p) != -1 == false) {
				return false;
			}
		}
	}
	if(c.id != null && c.id != d.get_id()) {
		return false;
	}
	if(c.parent != null) {
		if(c.direct == true) {
			var p = d.parentComponent;
			if(p == null) {
				return false;
			}
			if(!haxe_ui_styles_elements_RuleElement.ruleMatch(c.parent,p)) {
				return false;
			}
		} else {
			var p = d.parentComponent;
			while(p != null) {
				if(haxe_ui_styles_elements_RuleElement.ruleMatch(c.parent,p)) {
					break;
				}
				p = p.parentComponent;
			}
			if(p == null) {
				return false;
			}
		}
	}
	return true;
};
haxe_ui_styles_elements_RuleElement.prototype = {
	selector: null
	,directives: null
	,addDirective: function(directive,value) {
		var d = new haxe_ui_styles_elements_Directive(directive,value);
		this.processDirective(d);
	}
	,match: function(d) {
		return haxe_ui_styles_elements_RuleElement.ruleMatch(this.selector.parts[this.selector.parts.length - 1],d);
	}
	,processDirective: function(d) {
		switch(d.directive) {
		case "animation":
			this.processComposite(d,["animation-name","animation-duration","animation-timing-function","animation-delay","animation-iteration-count","animation-direction","animation-fill-mode"]);
			break;
		case "background":
			this.processComposite(d,["background-color","background-color-end","background-gradient-style"]);
			break;
		case "background-image-clip":
			this.processComposite(d,["background-image-clip-top","background-image-clip-left","background-image-clip-bottom","background-image-clip-right"]);
			break;
		case "background-image-slice":
			this.processComposite(d,["background-image-slice-top","background-image-slice-left","background-image-slice-bottom","background-image-slice-right"]);
			break;
		case "border":
			this.processComposite(d,["border-size","border-style","border-color"]);
			break;
		case "border-bottom":
			this.processComposite(d,["border-bottom-size","border-style","border-bottom-color"]);
			break;
		case "border-color":
			this.processComposite(d,["border-top-color","border-left-color","border-right-color","border-bottom-color"],true);
			break;
		case "border-left":
			this.processComposite(d,["border-left-size","border-style","border-left-color"]);
			break;
		case "border-right":
			this.processComposite(d,["border-right-size","border-style","border-right-color"]);
			break;
		case "border-size":
			this.processComposite(d,["border-top-size","border-left-size","border-right-size","border-bottom-size"]);
			break;
		case "border-top":
			this.processComposite(d,["border-top-size","border-style","border-top-color"]);
			break;
		case "font-style":
			var v1 = haxe_ui_styles_ValueTools.composite(d.value);
			if(v1 == null) {
				v1 = [d.value];
			}
			var _g = 0;
			while(_g < v1.length) {
				var v = v1[_g];
				++_g;
				var s = haxe_ui_styles_ValueTools.string(v).toLowerCase();
				if(s == "bold") {
					var this1 = this.directives;
					var value = new haxe_ui_styles_elements_Directive("font-bold",haxe_ui_styles_Value.VBool(true));
					this1.h["font-bold"] = value;
				} else if(s == "italic") {
					var this2 = this.directives;
					var value1 = new haxe_ui_styles_elements_Directive("font-italic",haxe_ui_styles_Value.VBool(true));
					this2.h["font-italic"] = value1;
				} else if(s == "underline") {
					var this3 = this.directives;
					var value2 = new haxe_ui_styles_elements_Directive("font-underline",haxe_ui_styles_Value.VBool(true));
					this3.h["font-underline"] = value2;
				}
			}
			break;
		case "margin":
			var vl = haxe_ui_styles_ValueTools.composite(d.value);
			if(vl.length == 4 || vl.length == 1) {
				this.processComposite(d,["margin-top","margin-left","margin-right","margin-bottom"]);
			} else if(vl.length == 2) {
				this.processComposite(new haxe_ui_styles_elements_Directive("",vl[0]),["margin-top","margin-bottom"]);
				this.processComposite(new haxe_ui_styles_elements_Directive("",vl[1]),["margin-left","margin-right"]);
			}
			break;
		case "padding":
			var vl = haxe_ui_styles_ValueTools.composite(d.value);
			if(vl.length == 4 || vl.length == 1) {
				this.processComposite(d,["padding-top","padding-left","padding-right","padding-bottom"]);
			} else if(vl.length == 2) {
				this.processComposite(new haxe_ui_styles_elements_Directive("",vl[0]),["padding-top","padding-bottom"]);
				this.processComposite(new haxe_ui_styles_elements_Directive("",vl[1]),["padding-left","padding-right"]);
			} else if(vl.length == 0) {
				this.processComposite(d,["padding-top","padding-left","padding-right","padding-bottom"]);
			}
			break;
		case "spacing":
			this.processComposite(d,["horizontal-spacing","vertical-spacing"]);
			break;
		default:
			this.directives.h[d.directive] = d;
		}
	}
	,processComposite: function(d,parts,duplicate) {
		if(duplicate == null) {
			duplicate = false;
		}
		var _g = 0;
		while(_g < parts.length) {
			var p = parts[_g];
			++_g;
			var _this = this.directives;
			if(Object.prototype.hasOwnProperty.call(_this.h,p)) {
				delete(_this.h[p]);
			}
		}
		var _g = d.value;
		switch(_g._hx_index) {
		case 1:
			var _g1 = _g.v;
			var _g1 = 0;
			while(_g1 < parts.length) {
				var p = parts[_g1];
				++_g1;
				var this1 = this.directives;
				var value = new haxe_ui_styles_elements_Directive(p,d.value);
				this1.h[p] = value;
			}
			break;
		case 3:
			var v = _g.v;
			var _g1 = 0;
			while(_g1 < parts.length) {
				var p = parts[_g1];
				++_g1;
				var this1 = this.directives;
				var value = new haxe_ui_styles_elements_Directive(p,haxe_ui_styles_Value.VDimension(v));
				this1.h[p] = value;
			}
			break;
		case 4:
			var _g1 = _g.v;
			if(duplicate == false) {
				var this1 = this.directives;
				var value = new haxe_ui_styles_elements_Directive(parts[0],d.value);
				this1.h[parts[0]] = value;
			} else {
				var _g1 = 0;
				while(_g1 < parts.length) {
					var p = parts[_g1];
					++_g1;
					var this1 = this.directives;
					var value = new haxe_ui_styles_elements_Directive(p,d.value);
					this1.h[p] = value;
				}
			}
			break;
		case 6:
			var _g1 = _g.v;
			break;
		case 7:
			var vl = _g.vl;
			var n = 0;
			var _g = 0;
			while(_g < parts.length) {
				var p = parts[_g];
				++_g;
				if(vl[n] != null) {
					var nd = new haxe_ui_styles_elements_Directive(p,vl[n]);
					this.processDirective(nd);
					this.directives.h[p] = nd;
				}
				++n;
			}
			break;
		case 9:
			var _g = 0;
			while(_g < parts.length) {
				var p = parts[_g];
				++_g;
				var nd = new haxe_ui_styles_elements_Directive(p,d.value);
				this.processDirective(nd);
				this.directives.h[p] = nd;
			}
			break;
		default:
		}
	}
	,__class__: haxe_ui_styles_elements_RuleElement
};
var haxe_ui_styles_elements_Selector = function(s) {
	this.parts = [];
	s = StringTools.replace(s,">"," > ");
	var p = s.split(" ");
	var parent = null;
	var nextDirect = false;
	var _g = 0;
	while(_g < p.length) {
		var i = p[_g];
		++_g;
		i = StringTools.trim(i);
		if(i.length == 0) {
			continue;
		}
		if(i == ">") {
			nextDirect = true;
			continue;
		}
		var current = new haxe_ui_styles_elements_SelectorPart();
		if(nextDirect == true) {
			current.direct = true;
			nextDirect = false;
		}
		current.parent = parent;
		var p1 = i.split(":");
		current.pseudoClass = p1[1];
		var main = p1[0];
		if(main.charAt(0) == ".") {
			current.className = main.substring(1);
		} else {
			var p2 = main.split(".");
			if(p2[0].charAt(0) == "#") {
				current.id = p2[0].substring(1);
			} else {
				current.nodeName = p2[0].toLowerCase();
			}
			current.className = p2[1];
		}
		this.parts.push(current);
		parent = current;
	}
};
$hxClasses["haxe.ui.styles.elements.Selector"] = haxe_ui_styles_elements_Selector;
haxe_ui_styles_elements_Selector.__name__ = "haxe.ui.styles.elements.Selector";
haxe_ui_styles_elements_Selector.prototype = {
	parts: null
	,toString: function() {
		return this.parts.join(" ");
	}
	,__class__: haxe_ui_styles_elements_Selector
};
var haxe_ui_styles_elements_SelectorPart = function() {
	this._parts = null;
	this.direct = false;
	this.nodeName = null;
	this.id = null;
	this.className = null;
	this.pseudoClass = null;
	this.parent = null;
};
$hxClasses["haxe.ui.styles.elements.SelectorPart"] = haxe_ui_styles_elements_SelectorPart;
haxe_ui_styles_elements_SelectorPart.__name__ = "haxe.ui.styles.elements.SelectorPart";
haxe_ui_styles_elements_SelectorPart.prototype = {
	parent: null
	,pseudoClass: null
	,className: null
	,id: null
	,nodeName: null
	,direct: null
	,_parts: null
	,classNameParts: null
	,get_classNameParts: function() {
		if(this.className == null) {
			return null;
		}
		if(this._parts == null) {
			this._parts = this.className.split(".");
		}
		return this._parts;
	}
	,toString: function() {
		var sb_b = "";
		if(this.id != null) {
			sb_b += Std.string("#" + this.id);
		}
		if(this.nodeName != null) {
			sb_b += Std.string(this.nodeName);
		}
		if(this.className != null) {
			sb_b += Std.string("." + this.className);
		}
		if(this.pseudoClass != null) {
			sb_b += Std.string(":" + this.pseudoClass);
		}
		return sb_b;
	}
	,__class__: haxe_ui_styles_elements_SelectorPart
	,__properties__: {get_classNameParts:"get_classNameParts"}
};
var haxe_ui_themes_Theme = function() {
	this.styles = [];
	this.images = [];
	this.vars = new haxe_ds_StringMap();
};
$hxClasses["haxe.ui.themes.Theme"] = haxe_ui_themes_Theme;
haxe_ui_themes_Theme.__name__ = "haxe.ui.themes.Theme";
haxe_ui_themes_Theme.prototype = {
	parent: null
	,styles: null
	,images: null
	,vars: null
	,__class__: haxe_ui_themes_Theme
};
var haxe_ui_themes_ThemeManager = function() {
	this.currentThemeVars = new haxe_ds_StringMap();
	this._eventMap = null;
	this._themes = new haxe_ds_StringMap();
};
$hxClasses["haxe.ui.themes.ThemeManager"] = haxe_ui_themes_ThemeManager;
haxe_ui_themes_ThemeManager.__name__ = "haxe.ui.themes.ThemeManager";
haxe_ui_themes_ThemeManager.__properties__ = {get_instance:"get_instance"};
haxe_ui_themes_ThemeManager.get_instance = function() {
	if(haxe_ui_themes_ThemeManager._instance == null) {
		haxe_ui_themes_ThemeManager._instance = new haxe_ui_themes_ThemeManager();
	}
	return haxe_ui_themes_ThemeManager._instance;
};
haxe_ui_themes_ThemeManager.prototype = {
	_themes: null
	,_themeImages: null
	,_eventMap: null
	,registerEvent: function(type,listener,priority) {
		if(priority == null) {
			priority = 0;
		}
		if(this._eventMap == null) {
			this._eventMap = new haxe_ui_util_EventMap();
		}
		this._eventMap.add(type,listener);
	}
	,unregisterEvent: function(type,listener) {
		if(this._eventMap == null) {
			return;
		}
		this._eventMap.remove(type,listener);
	}
	,dispatch: function(event) {
		if(this._eventMap == null) {
			return;
		}
		this._eventMap.invoke(event.type,new haxe_ui_events_ThemeEvent(haxe_ui_events_ThemeEvent.THEME_CHANGED));
	}
	,getTheme: function(themeName) {
		var theme = this._themes.h[themeName];
		if(theme == null) {
			theme = new haxe_ui_themes_Theme();
			this._themes.h[themeName] = theme;
		}
		return theme;
	}
	,addStyleResource: function(themeName,resourceId,priority) {
		if(priority == null) {
			priority = 0;
		}
		this.getTheme(themeName).styles.push({ resourceId : resourceId, priority : priority});
	}
	,setThemeVar: function(themeName,varName,varValue) {
		var theme = this.getTheme(themeName);
		if(theme == null) {
			return;
		}
		theme.vars.h[varName] = varValue;
	}
	,setCurrentThemeVar: function(varName,varValue) {
		this.setThemeVar(haxe_ui_Toolkit.get_theme(),varName,varValue);
	}
	,addImageResource: function(themeName,id,resourceId,priority) {
		if(priority == null) {
			priority = 0;
		}
		this.getTheme(themeName).images.push({ id : id, resourceId : resourceId, priority : priority});
	}
	,currentThemeVars: null
	,applyTheme: function(themeName) {
		haxe_ui_Toolkit.styleSheet.clear("default");
		var finalVars = new haxe_ds_StringMap();
		this.buildThemeVars("global",finalVars);
		this.buildThemeVars(themeName,finalVars);
		this.currentThemeVars = new haxe_ds_StringMap();
		var h = finalVars.h;
		var k_h = h;
		var k_keys = Object.keys(h);
		var k_length = k_keys.length;
		var k_current = 0;
		while(k_current < k_length) {
			var k = k_keys[k_current++];
			this.currentThemeVars.h[k] = finalVars.h[k];
		}
		var entries = [];
		this.buildThemeEntries("global",entries);
		this.buildThemeEntries(themeName,entries);
		haxe_ds_ArraySort.sort(entries,function(a,b) {
			if(a.priority < b.priority) {
				return -1;
			} else if(a.priority > b.priority) {
				return 1;
			}
			return 0;
		});
		var _g = 0;
		while(_g < entries.length) {
			var e = entries[_g];
			++_g;
			this.applyResource(e.resourceId);
		}
		var images = [];
		this.buildThemeImages("global",images);
		this.buildThemeImages(themeName,images);
		haxe_ds_ArraySort.sort(images,function(a,b) {
			if(a.priority < b.priority) {
				return -1;
			} else if(a.priority > b.priority) {
				return 1;
			}
			return 0;
		});
		var _g = 0;
		while(_g < images.length) {
			var i = images[_g];
			++_g;
			if(this._themeImages == null) {
				this._themeImages = new haxe_ds_StringMap();
			}
			this._themeImages.h[i.id] = i;
		}
		this.dispatch(new haxe_ui_events_ThemeEvent(haxe_ui_events_ThemeEvent.THEME_CHANGED));
	}
	,applyResource: function(resourceId) {
		var style = haxe_ui_Toolkit.get_assets().getText(resourceId);
		if(style != null) {
			this.addStyleString(style);
		} else {
			haxe_Log.trace("WARNING: could not find " + resourceId,{ fileName : "haxe/ui/themes/ThemeManager.hx", lineNumber : 145, className : "haxe.ui.themes.ThemeManager", methodName : "applyResource"});
		}
	}
	,addStyleString: function(style) {
		haxe_ui_Toolkit.styleSheet.parse(style);
	}
	,buildThemeVars: function(themeName,vars) {
		var theme = this._themes.h[themeName];
		if(theme == null) {
			return;
		}
		if(theme.parent != null) {
			this.buildThemeVars(theme.parent,vars);
		}
		var h = theme.vars.h;
		var k_h = h;
		var k_keys = Object.keys(h);
		var k_length = k_keys.length;
		var k_current = 0;
		while(k_current < k_length) {
			var k = k_keys[k_current++];
			var v = theme.vars.h[k];
			vars.h[k] = v;
		}
	}
	,buildThemeEntries: function(themeName,arr) {
		var theme = this._themes.h[themeName];
		if(theme == null) {
			return;
		}
		if(theme.parent != null) {
			this.buildThemeEntries(theme.parent,arr);
		}
		var _g = 0;
		var _g1 = theme.styles;
		while(_g < _g1.length) {
			var s = _g1[_g];
			++_g;
			arr.push(s);
		}
	}
	,buildThemeImages: function(themeName,arr) {
		var theme = this._themes.h[themeName];
		if(theme == null) {
			return;
		}
		if(theme.parent != null) {
			this.buildThemeImages(theme.parent,arr);
		}
		var _g = 0;
		var _g1 = theme.images;
		while(_g < _g1.length) {
			var s = _g1[_g];
			++_g;
			arr.push(s);
		}
	}
	,image: function(id) {
		var image = this._themeImages.h[id];
		if(image == null) {
			return null;
		}
		return image.resourceId;
	}
	,icon: function(id) {
		return this.image(id);
	}
	,__class__: haxe_ui_themes_ThemeManager
};
var haxe_ui_tooltips_ToolTip = function() {
	haxe_ui_containers_Box.call(this);
};
$hxClasses["haxe.ui.tooltips.ToolTip"] = haxe_ui_tooltips_ToolTip;
haxe_ui_tooltips_ToolTip.__name__ = "haxe.ui.tooltips.ToolTip";
haxe_ui_tooltips_ToolTip.__super__ = haxe_ui_containers_Box;
haxe_ui_tooltips_ToolTip.prototype = $extend(haxe_ui_containers_Box.prototype,{
	registerBehaviours: function() {
		haxe_ui_containers_Box.prototype.registerBehaviours.call(this);
	}
	,cloneComponent: function() {
		var c = haxe_ui_containers_Box.prototype.cloneComponent.call(this);
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new haxe_ui_tooltips_ToolTip();
	}
	,__class__: haxe_ui_tooltips_ToolTip
});
var haxe_ui_tooltips_ToolTipManager = function() {
	this._toolTipContents = null;
	this._toolTip = null;
	this._timer = null;
	this._currentComponent = null;
	this._lastMouseEvent = null;
	this._toolTipOptions = new haxe_ds_ObjectMap();
};
$hxClasses["haxe.ui.tooltips.ToolTipManager"] = haxe_ui_tooltips_ToolTipManager;
haxe_ui_tooltips_ToolTipManager.__name__ = "haxe.ui.tooltips.ToolTipManager";
haxe_ui_tooltips_ToolTipManager.__properties__ = {get_instance:"get_instance"};
haxe_ui_tooltips_ToolTipManager.get_instance = function() {
	if(haxe_ui_tooltips_ToolTipManager._instance == null) {
		haxe_ui_tooltips_ToolTipManager._instance = new haxe_ui_tooltips_ToolTipManager();
	}
	return haxe_ui_tooltips_ToolTipManager._instance;
};
haxe_ui_tooltips_ToolTipManager.prototype = {
	_lastMouseEvent: null
	,_toolTipOptions: null
	,registerTooltip: function(target,options) {
		if(this._toolTipOptions.h.__keys__[target.__id__] != null) {
			return;
		}
		if(options == null) {
			options = { };
		}
		if(options.tipData == null) {
			options.tipData = { text : target.get_tooltip()};
		}
		this._toolTipOptions.set(target,options);
		target.registerEvent("mouseover",$bind(this,this.onTargetMouseOver));
	}
	,unregisterTooltip: function(target) {
		target.unregisterEvent("mouseover",$bind(this,this.onTargetMouseOver));
		target.unregisterEvent("mouseout",$bind(this,this.onTargetMouseOut));
		target.unregisterEvent("mousemove",$bind(this,this.onTargetMouseMove));
		this._toolTipOptions.remove(target);
	}
	,getTooltipOptions: function(target) {
		return this._toolTipOptions.h[target.__id__];
	}
	,updateTooltipRenderer: function(target,renderer) {
		if(this._toolTipOptions.h.__keys__[target.__id__] == null) {
			return;
		}
		var options = this._toolTipOptions.h[target.__id__];
		options.renderer = renderer;
	}
	,_currentComponent: null
	,_timer: null
	,onTargetMouseOver: function(event) {
		this.stopCurrent();
		this._lastMouseEvent = event;
		this._currentComponent = event.target;
		event.target.registerEvent("mouseout",$bind(this,this.onTargetMouseOut));
		event.target.registerEvent("mousemove",$bind(this,this.onTargetMouseMove));
		haxe_ui_core_Screen.get_instance().registerEvent("mousemove",$bind(this,this.onScreenMouseMove));
		this.startTimer();
	}
	,onTargetMouseMove: function(event) {
		if(this._toolTip != null && this._toolTip.get_hidden() == false) {
			return;
		}
		this.stopTimer();
		this.startTimer();
	}
	,onTargetMouseOut: function(event) {
		this.stopCurrent();
		this.hideToolTip();
	}
	,onDelayTimer: function() {
		this._timer.stop();
		this._timer = null;
		this.showToolTip();
	}
	,onScreenMouseMove: function(event) {
		this._lastMouseEvent = event;
	}
	,onScreenMouseDown: function(event) {
		this.hideToolTip();
	}
	,startTimer: function() {
		this._timer = new haxe_ui_util_Timer(haxe_ui_tooltips_ToolTipManager.defaultDelay,$bind(this,this.onDelayTimer));
	}
	,stopTimer: function() {
		if(this._timer != null) {
			this._timer.stop();
			this._timer = null;
		}
	}
	,stopCurrent: function() {
		if(this._currentComponent != null) {
			this._currentComponent.unregisterEvent("mouseout",$bind(this,this.onTargetMouseOut));
			this._currentComponent = null;
		}
		this.stopTimer();
		haxe_ui_core_Screen.get_instance().unregisterEvent("mousemove",$bind(this,this.onScreenMouseMove));
	}
	,_toolTip: null
	,_toolTipContents: null
	,createToolTip: function() {
		if(this._toolTip != null) {
			return;
		}
		this._toolTip = new haxe_ui_tooltips_ToolTip();
	}
	,showToolTip: function() {
		var _gthis = this;
		if(this._currentComponent == null) {
			return;
		}
		if(this._currentComponent.get_disabled() == true || this._currentComponent.get_hidden() == true) {
			this.stopCurrent();
			return;
		}
		this.createToolTip();
		this._toolTip.hide();
		var options = this._toolTipOptions.h[this._currentComponent.__id__];
		var renderer = this.createToolTipRenderer(options);
		var _this = this._toolTip;
		if((_this._children == null ? [] : _this._children)[0] != renderer) {
			var _this = this._toolTip;
			if((_this._children == null ? [] : _this._children).length > 0) {
				this._toolTip.removeComponentAt(0,false);
			}
			this._toolTip.addComponent(renderer);
		}
		renderer.set_data(options.tipData);
		haxe_ui_core_Screen.get_instance().addComponent(this._toolTip);
		haxe_ui_core_Screen.get_instance().setComponentIndex(this._toolTip,haxe_ui_core_Screen.get_instance().rootComponents.length - 1);
		this._toolTip.validateNow();
		this.positionToolTip();
		haxe_ui_Toolkit.callLater(function() {
			if(haxe_ui_tooltips_ToolTipManager.fade == true) {
				_gthis._toolTip.fadeIn();
			} else {
				_gthis._toolTip.show();
			}
		});
		haxe_ui_core_Screen.get_instance().registerEvent("mousedown",$bind(this,this.onScreenMouseDown));
	}
	,positionToolTip: function() {
		var x = this._lastMouseEvent.screenX + this._toolTip.get_marginLeft();
		var y = this._lastMouseEvent.screenY + this._toolTip.get_marginTop();
		var w = this._toolTip.get_width();
		var h = this._toolTip.get_height();
		var maxX = haxe_ui_core_Screen.get_instance().get_width();
		var maxY = haxe_ui_core_Screen.get_instance().get_height();
		if(x + w > maxX) {
			x -= w;
		}
		if(y + h > maxY) {
			y = this._lastMouseEvent.screenY - h - this._toolTip.get_marginTop() / 2;
		}
		this._toolTip.set_left(x);
		this._toolTip.set_top(y);
	}
	,hideToolTip: function() {
		if(this._toolTip != null) {
			if(haxe_ui_tooltips_ToolTipManager.fade == true) {
				this._toolTip.fadeOut();
			} else {
				this._toolTip.hide();
			}
		}
		haxe_ui_core_Screen.get_instance().unregisterEvent("mousedown",$bind(this,this.onScreenMouseDown));
	}
	,createToolTipRenderer: function(options) {
		if(options.renderer != null) {
			return options.renderer;
		}
		if(haxe_ui_tooltips_ToolTipManager.defaultRenderer != null) {
			return haxe_ui_tooltips_ToolTipManager.defaultRenderer;
		}
		if(this._toolTipContents != null) {
			return this._toolTipContents;
		}
		this._toolTipContents = new haxe_ui_core_ItemRenderer();
		var label = new haxe_ui_components_Label();
		label.set_id("text");
		this._toolTipContents.addComponent(label);
		return this._toolTipContents;
	}
	,__class__: haxe_ui_tooltips_ToolTipManager
};
var haxe_ui_util_CallbackMap = function() {
	this._map = new haxe_ds_StringMap();
};
$hxClasses["haxe.ui.util.CallbackMap"] = haxe_ui_util_CallbackMap;
haxe_ui_util_CallbackMap.__name__ = "haxe.ui.util.CallbackMap";
haxe_ui_util_CallbackMap.prototype = {
	_map: null
	,add: function(key,callback,priority) {
		if(priority == null) {
			priority = 0;
		}
		if(callback == null) {
			return false;
		}
		var b = false;
		var arr = this._map.h[key];
		if(arr == null) {
			arr = new haxe_ui_util_FunctionArray();
			arr.push(callback,priority);
			this._map.h[key] = arr;
			b = true;
		} else if(arr.contains(callback) == false) {
			arr.push(callback,priority);
		}
		return b;
	}
	,remove: function(key,callback) {
		var b = false;
		var arr = this._map.h[key];
		if(arr != null) {
			arr.remove(callback);
			if(arr.get_length() == 0) {
				var _this = this._map;
				if(Object.prototype.hasOwnProperty.call(_this.h,key)) {
					delete(_this.h[key]);
				}
				b = true;
			}
		}
		return b;
	}
	,removeAll: function(key) {
		var arr = this._map.h[key];
		if(arr != null) {
			while(arr.get_length() > 0) arr.remove(arr.get(0));
			var _this = this._map;
			if(Object.prototype.hasOwnProperty.call(_this.h,key)) {
				delete(_this.h[key]);
			}
		}
	}
	,invoke: function(key,param) {
		var arr = this._map.h[key];
		if(arr != null) {
			arr = arr.copy();
			var listener = arr.iterator();
			while(listener.hasNext()) {
				var listener1 = listener.next();
				listener1.callback(param);
			}
		}
	}
	,invokeAndRemove: function(key,param) {
		var arr = this._map.h[key];
		if(arr != null) {
			arr = arr.copy();
			this.removeAll(key);
			var listener = arr.iterator();
			while(listener.hasNext()) {
				var listener1 = listener.next();
				listener1.callback(param);
			}
		}
	}
	,count: function(key) {
		var n = 0;
		var arr = this._map.h[key];
		if(arr != null) {
			n = arr.get_length();
		}
		return n;
	}
	,__class__: haxe_ui_util_CallbackMap
};
var haxe_ui_util_Color = {};
haxe_ui_util_Color.__properties__ = {set_a:"set_a",get_a:"get_a",set_b:"set_b",get_b:"get_b",set_g:"set_g",get_g:"get_g",set_r:"set_r",get_r:"get_r"};
haxe_ui_util_Color.fromString = function(s) {
	if(StringTools.startsWith(s,"0x") || StringTools.startsWith(s,"#")) {
		return Std.parseInt("0x" + s.substring(s.length - 6));
	}
	switch(s) {
	case "aliceblue":
		return 15792383;
	case "antiquewhite":
		return 16444375;
	case "aqua":
		return 65535;
	case "aquamarine":
		return 8388564;
	case "azure":
		return 15794175;
	case "beige":
		return 16119260;
	case "bisque":
		return 16770244;
	case "black":
		return 0;
	case "blanchedalmond":
		return 16772045;
	case "blue":
		return 255;
	case "blueviolet":
		return 9055202;
	case "brown":
		return 10824234;
	case "burlywood":
		return 14596231;
	case "cadetblue":
		return 6266528;
	case "chartreuse":
		return 8388352;
	case "chocolate":
		return 13789470;
	case "coral":
		return 16744272;
	case "cornflowerblue":
		return 6591981;
	case "cornsilk":
		return 16775388;
	case "crimson":
		return 14423100;
	case "cyan":
		return 65535;
	case "darkblue":
		return 139;
	case "darkcyan":
		return 35723;
	case "darkgoldenrod":
		return 12092939;
	case "darkgray":
		return 11119017;
	case "darkgreen":
		return 25600;
	case "darkkhaki":
		return 12433259;
	case "darkmagenta":
		return 9109643;
	case "darkolivegreen":
		return 5597999;
	case "darkorange":
		return 16747520;
	case "darkorchid":
		return 10040012;
	case "darkred":
		return 9109504;
	case "darksalmon":
		return 15308410;
	case "darkseagreen":
		return 9419919;
	case "darkslateblue":
		return 4734347;
	case "darkslategray":
		return 3100495;
	case "darkturquoise":
		return 52945;
	case "darkviolet":
		return 9699539;
	case "deeppink":
		return 16716947;
	case "deepskyblue":
		return 49151;
	case "dimgray":
		return 6908265;
	case "dodgerblue":
		return 2003199;
	case "firebrick":
		return 11674146;
	case "floralwhite":
		return 16775920;
	case "forestgreen":
		return 2263842;
	case "fuchsia":
		return 16711935;
	case "gainsboro":
		return 14474460;
	case "ghostwhite":
		return 16316671;
	case "gold":
		return 16766720;
	case "goldenrod":
		return 14329120;
	case "green":
		return 32768;
	case "greenyellow":
		return 11403055;
	case "gray":case "grey":
		return 8421504;
	case "honeydew":
		return 15794160;
	case "hotpink":
		return 16738740;
	case "indianred":
		return 13458524;
	case "indigo":
		return 4915330;
	case "ivory":
		return 16777200;
	case "khaki":
		return 15787660;
	case "lavender":
		return 15132410;
	case "lavenderblush":
		return 16773365;
	case "lawngreen":
		return 8190976;
	case "lemonchiffon":
		return 16775885;
	case "lightblue":
		return 11393254;
	case "lightcoral":
		return 15761536;
	case "lightcyan":
		return 14745599;
	case "lightgoldenrodyellow":
		return 16448210;
	case "lightgray":
		return 13882323;
	case "lightgreen":
		return 9498256;
	case "lightpink":
		return 16758465;
	case "lightsalmon":
		return 16752762;
	case "lightseagreen":
		return 2142890;
	case "lightskyblue":
		return 8900346;
	case "lightslategray":
		return 7833753;
	case "lightsteelblue":
		return 11584734;
	case "lightyellow":
		return 16777184;
	case "lime":
		return 65280;
	case "limegreen":
		return 3329330;
	case "linen":
		return 16445670;
	case "magenta":
		return 16711935;
	case "maroon":
		return 8388608;
	case "mediumaquamarine":
		return 6737322;
	case "mediumblue":
		return 205;
	case "mediumorchid":
		return 12211667;
	case "mediumpurple":
		return 9662683;
	case "mediumseagreen":
		return 3978097;
	case "mediumslateblue":
		return 8087790;
	case "mediumspringgreen":
		return 64154;
	case "mediumturquoise":
		return 4772300;
	case "mediumvioletred":
		return 13047173;
	case "midnightblue":
		return 1644912;
	case "mintcream":
		return 16121850;
	case "mistyrose":
		return 16770273;
	case "moccasin":
		return 16770229;
	case "navajowhite":
		return 16768685;
	case "navy":
		return 128;
	case "oldlace":
		return 16643558;
	case "olive":
		return 8421376;
	case "olivedrab":
		return 7048739;
	case "orange":
		return 16753920;
	case "orangered":
		return 16729344;
	case "orchid":
		return 14315734;
	case "palegoldenrod":
		return 15657130;
	case "palegreen":
		return 10025880;
	case "paleturquoise":
		return 11529966;
	case "palevioletred":
		return 14381203;
	case "papayawhip":
		return 16773077;
	case "peachpuff":
		return 16767673;
	case "peru":
		return 13468991;
	case "pink":
		return 16761035;
	case "plum":
		return 14524637;
	case "powderblue":
		return 11591910;
	case "purple":
		return 8388736;
	case "red":
		return 16711680;
	case "rosybrown":
		return 12357519;
	case "royalblue":
		return 4286945;
	case "saddlebrown":
		return 9127187;
	case "salmon":
		return 16416882;
	case "sandybrown":
		return 16032864;
	case "seagreen":
		return 3050327;
	case "seashell":
		return 16774638;
	case "sienna":
		return 10506797;
	case "silver":
		return 12632256;
	case "skyblue":
		return 8900331;
	case "slateblue":
		return 6970061;
	case "slategray":
		return 7372944;
	case "snow":
		return 16775930;
	case "springgreen":
		return 65407;
	case "steelblue":
		return 4620980;
	case "tan":
		return 13808780;
	case "teal":
		return 32896;
	case "thistle":
		return 14204888;
	case "tomato":
		return 16737095;
	case "turquoise":
		return 4251856;
	case "violet":
		return 15631086;
	case "wheat":
		return 16113331;
	case "white":
		return 16777215;
	case "whitesmoke":
		return 16119285;
	case "yellow":
		return 16776960;
	case "yellowgreen":
		return 10145074;
	default:
		return 0;
	}
};
haxe_ui_util_Color.fromComponents = function(r,g,b,a) {
	var result = (a & 255) << 24 | (r & 255) << 16 | (g & 255) << 8 | b & 255;
	return result;
};
haxe_ui_util_Color.get_r = function(this1) {
	return this1 >> 16 & 255;
};
haxe_ui_util_Color.set_r = function(this1,value) {
	this1 = (this1 >> 24 & 255 & 255) << 24 | (value & 255) << 16 | (this1 >> 8 & 255 & 255) << 8 | this1 & 255 & 255;
	return this1;
};
haxe_ui_util_Color.get_g = function(this1) {
	return this1 >> 8 & 255;
};
haxe_ui_util_Color.set_g = function(this1,value) {
	this1 = (this1 >> 24 & 255 & 255) << 24 | (this1 >> 16 & 255 & 255) << 16 | (value & 255) << 8 | this1 & 255 & 255;
	return this1;
};
haxe_ui_util_Color.get_b = function(this1) {
	return this1 & 255;
};
haxe_ui_util_Color.set_b = function(this1,value) {
	this1 = (this1 >> 24 & 255 & 255) << 24 | (this1 >> 16 & 255 & 255) << 16 | (this1 >> 8 & 255 & 255) << 8 | value & 255;
	return this1;
};
haxe_ui_util_Color.get_a = function(this1) {
	return this1 >> 24 & 255;
};
haxe_ui_util_Color.set_a = function(this1,value) {
	this1 = (value & 255) << 24 | (this1 >> 16 & 255 & 255) << 16 | (this1 >> 8 & 255 & 255) << 8 | this1 & 255 & 255;
	return this1;
};
haxe_ui_util_Color.set = function(this1,r,g,b,a) {
	this1 = (a & 255) << 24 | (r & 255) << 16 | (g & 255) << 8 | b & 255;
	return this1;
};
haxe_ui_util_Color.toInt = function(this1) {
	return this1;
};
haxe_ui_util_Color.or = function(a,b) {
	return haxe_ui_util_Color.toInt(a) | haxe_ui_util_Color.toInt(b);
};
haxe_ui_util_Color.sumColor = function(a,b) {
	return haxe_ui_util_Color.toInt(haxe_ui_util_Color.fromComponents((a >> 16 & 255) + (b >> 16 & 255),(a >> 8 & 255) + (b >> 8 & 255),(a & 255) + (b & 255),(a >> 24 & 255) + (b >> 24 & 255)));
};
haxe_ui_util_Color.restColor = function(a,b) {
	return haxe_ui_util_Color.toInt(haxe_ui_util_Color.fromComponents((a >> 16 & 255) - (b >> 16 & 255),(a >> 8 & 255) - (b >> 8 & 255),(a & 255) - (b & 255),(a >> 24 & 255) - (b >> 24 & 255)));
};
haxe_ui_util_Color.sumFloat = function(a,b) {
	var bInt = b | 0;
	return haxe_ui_util_Color.toInt(haxe_ui_util_Color.fromComponents((a >> 16 & 255) - bInt,(a >> 8 & 255) - bInt,(a & 255) - bInt,(a >> 24 & 255) - bInt));
};
haxe_ui_util_Color.mulFloat = function(a,b) {
	return haxe_ui_util_Color.toInt(haxe_ui_util_Color.fromComponents((a >> 16 & 255) * b | 0,(a >> 8 & 255) * b | 0,(a & 255) * b | 0,(a >> 24 & 255) * b | 0));
};
var haxe_ui_util_ColorUtil = function() { };
$hxClasses["haxe.ui.util.ColorUtil"] = haxe_ui_util_ColorUtil;
haxe_ui_util_ColorUtil.__name__ = "haxe.ui.util.ColorUtil";
haxe_ui_util_ColorUtil.buildColorArray = function(startColor,endColor,size) {
	var array = [];
	var r1 = startColor >> 16 & 255;
	var g1 = startColor >> 8 & 255;
	var b1 = startColor & 255;
	var r2 = endColor >> 16 & 255;
	var g2 = endColor >> 8 & 255;
	var b2 = endColor & 255;
	var rd = r2 - r1;
	var gd = g2 - g1;
	var bd = b2 - b1;
	var ri = rd / (size - 1);
	var gi = gd / (size - 1);
	var bi = bd / (size - 1);
	var r = r1;
	var g = g1;
	var b = b1;
	var c;
	var _g = 0;
	var _g1 = size;
	while(_g < _g1) {
		var n = _g++;
		c = 0 | (Math.round(r) & 255) << 16 | (Math.round(g) & 255) << 8 | Math.round(b) & 255;
		array.push(haxe_ui_util_Color.toInt(c));
		r += ri;
		g += gi;
		b += bi;
	}
	return array;
};
haxe_ui_util_ColorUtil.parseColor = function(s) {
	if(StringTools.startsWith(s,"#")) {
		s = s.substring(1,s.length);
	} else if(StringTools.startsWith(s,"0x")) {
		s = s.substring(2,s.length);
	}
	return Std.parseInt("0x" + s);
};
var haxe_ui_util_ComponentUtil = function() { };
$hxClasses["haxe.ui.util.ComponentUtil"] = haxe_ui_util_ComponentUtil;
haxe_ui_util_ComponentUtil.__name__ = "haxe.ui.util.ComponentUtil";
haxe_ui_util_ComponentUtil.getDepth = function(target) {
	var count = 0;
	while(target.parentComponent != null) {
		target = target.parentComponent;
		++count;
	}
	return count;
};
var haxe_ui_util_Defines = function() { };
$hxClasses["haxe.ui.util.Defines"] = haxe_ui_util_Defines;
haxe_ui_util_Defines.__name__ = "haxe.ui.util.Defines";
haxe_ui_util_Defines.getAll = function() {
	haxe_ui_util_Defines.popuplate();
	return haxe_ui_util_Defines._map;
};
haxe_ui_util_Defines.set = function(name,value,overwrite) {
	if(overwrite == null) {
		overwrite = false;
	}
	haxe_ui_util_Defines.popuplate();
	if(overwrite == false && Object.prototype.hasOwnProperty.call(haxe_ui_util_Defines._map.h,name)) {
		return;
	}
	haxe_ui_util_Defines._map.h[name] = value;
};
haxe_ui_util_Defines.popuplate = function() {
	if(haxe_ui_util_Defines._map != null) {
		return;
	}
	haxe_ui_util_Defines._map = new haxe_ds_StringMap();
	if(haxe_ui_core_Platform.get_instance().get_isWindows()) {
		haxe_ui_util_Defines.set("windows","1");
	} else if(haxe_ui_core_Platform.get_instance().get_isLinux()) {
		haxe_ui_util_Defines.set("linux","1");
	} else if(haxe_ui_core_Platform.get_instance().get_isMac()) {
		haxe_ui_util_Defines.set("mac","1");
	}
};
haxe_ui_util_Defines.toObject = function() {
	haxe_ui_util_Defines.popuplate();
	var o = { };
	var h = haxe_ui_util_Defines._map.h;
	var k_h = h;
	var k_keys = Object.keys(h);
	var k_length = k_keys.length;
	var k_current = 0;
	while(k_current < k_length) {
		var k = k_keys[k_current++];
		var v = haxe_ui_util_Defines._map.h[k];
		o[k] = v;
	}
	return o;
};
var haxe_ui_util_EventMap = function() {
	this._map = new haxe_ds_StringMap();
};
$hxClasses["haxe.ui.util.EventMap"] = haxe_ui_util_EventMap;
haxe_ui_util_EventMap.__name__ = "haxe.ui.util.EventMap";
haxe_ui_util_EventMap.prototype = {
	_map: null
	,keys: function() {
		return new haxe_ds__$StringMap_StringMapKeyIterator(this._map.h);
	}
	,add: function(type,listener,priority) {
		if(priority == null) {
			priority = 0;
		}
		if(listener == null) {
			return false;
		}
		var b = false;
		var arr = this._map.h[type];
		if(arr == null) {
			arr = new haxe_ui_util_FunctionArray();
			arr.push(listener,priority);
			this._map.h[type] = arr;
			b = true;
		} else if(arr.contains(listener) == false) {
			arr.push(listener,priority);
		}
		return b;
	}
	,remove: function(type,listener) {
		if(listener == null) {
			return false;
		}
		var b = false;
		var arr = this._map.h[type];
		if(arr != null) {
			arr.remove(listener);
			if(arr.get_length() == 0) {
				var _this = this._map;
				if(Object.prototype.hasOwnProperty.call(_this.h,type)) {
					delete(_this.h[type]);
				}
				b = true;
			}
		}
		return b;
	}
	,contains: function(type,listener) {
		var b = false;
		var arr = this._map.h[type];
		if(arr != null) {
			b = listener != null ? arr.contains(listener) : true;
		}
		return b;
	}
	,invoke: function(type,event,target) {
		if(event.bubble && event.target == null) {
			event.target = target;
		}
		var arr = this._map.h[type];
		if(arr != null && arr.get_length() > 0) {
			arr = arr.copy();
			var listener = arr.iterator();
			while(listener.hasNext()) {
				var listener1 = listener.next();
				if(event.canceled) {
					break;
				}
				var c = event.clone();
				if(c.target == null) {
					c.target = target;
				}
				listener1.callback(c);
				event.copyFrom(c);
				event.canceled = c.canceled;
			}
		}
	}
	,listenerCount: function(type) {
		var n = 0;
		var arr = this._map.h[type];
		if(arr != null) {
			n = arr.get_length();
		}
		return n;
	}
	,listeners: function(type) {
		var arr = this._map.h[type];
		if(arr == null) {
			return null;
		}
		return arr;
	}
	,__class__: haxe_ui_util_EventMap
};
var haxe_ui_util_ExpressionUtil = function() { };
$hxClasses["haxe.ui.util.ExpressionUtil"] = haxe_ui_util_ExpressionUtil;
haxe_ui_util_ExpressionUtil.__name__ = "haxe.ui.util.ExpressionUtil";
haxe_ui_util_ExpressionUtil.stringToLanguageExpression = function(s,localeManager) {
	if(localeManager == null) {
		localeManager = "haxe.ui.locale.LocaleManager";
	}
	var fixedParts = [];
	var beforePos = 0;
	var n1 = s.indexOf("{{");
	while(n1 != -1) {
		var before = s.substring(beforePos,n1);
		if(before.length > 0) {
			fixedParts.push("'" + before + "'");
		}
		var n2 = s.indexOf("}}",n1);
		var code = s.substring(n1 + 2,n2);
		var parts = code.split(",");
		var stringId = parts.shift();
		var callString = localeManager + ".instance.lookupString('";
		callString += stringId;
		callString += "'";
		if(parts.length > 0) {
			callString += ", ";
			callString += parts.join(", ");
		}
		callString += ")";
		fixedParts.push(callString);
		n1 = s.indexOf("{{",n2);
		beforePos = n2 + 2;
	}
	if(beforePos < s.length) {
		var before = s.substring(beforePos,s.length);
		if(before.length > 0) {
			fixedParts.push("'" + before + "'");
		}
	}
	var fixedCode = fixedParts.join(" + ");
	return fixedCode;
};
var haxe_ui_util_FunctionArray = function() {
	this._array = [];
};
$hxClasses["haxe.ui.util.FunctionArray"] = haxe_ui_util_FunctionArray;
haxe_ui_util_FunctionArray.__name__ = "haxe.ui.util.FunctionArray";
haxe_ui_util_FunctionArray.prototype = {
	_array: null
	,get: function(index) {
		return this._array[index].callback;
	}
	,length: null
	,get_length: function() {
		return this._array.length;
	}
	,push: function(x,priority) {
		if(priority == null) {
			priority = 0;
		}
		var this1 = new haxe_ui_util__$Listener_ListenerInternal(x,priority);
		var listener = this1;
		var _g = 0;
		var _g1 = this._array.length;
		while(_g < _g1) {
			var i = _g++;
			if(this._array[i].priority < priority) {
				this._array.splice(i,0,listener);
				return i;
			}
		}
		return this._array.push(listener);
	}
	,pop: function() {
		return this._array.pop().callback;
	}
	,indexOf: function(x,fromIndex) {
		if(fromIndex == null) {
			fromIndex = 0;
		}
		var _g = fromIndex;
		var _g1 = this._array.length;
		while(_g < _g1) {
			var i = _g++;
			if(this._array[i].callback == x) {
				return i;
			}
		}
		return -1;
	}
	,remove: function(x) {
		var index = this.indexOf(x);
		if(index != -1) {
			this._array.splice(index,1);
		}
		return index != -1;
	}
	,contains: function(x) {
		return this.indexOf(x) != -1;
	}
	,iterator: function() {
		return new haxe_iterators_ArrayIterator(this._array);
	}
	,copy: function() {
		var fa = new haxe_ui_util_FunctionArray();
		fa._array = this._array.slice();
		return fa;
	}
	,toString: function() {
		var s = "[";
		var iter = this.iterator();
		while(iter.hasNext()) {
			s += Std.string(iter.next());
			if(iter.hasNext()) {
				s += ", ";
			}
		}
		s += "]";
		return s;
	}
	,__class__: haxe_ui_util_FunctionArray
	,__properties__: {get_length:"get_length"}
};
var haxe_ui_util_ImageLoader = function(resource) {
	this._resource = resource;
};
$hxClasses["haxe.ui.util.ImageLoader"] = haxe_ui_util_ImageLoader;
haxe_ui_util_ImageLoader.__name__ = "haxe.ui.util.ImageLoader";
haxe_ui_util_ImageLoader.prototype = {
	_resource: null
	,load: function(callback) {
		if(haxe_ui_util_Variant.get_isString(this._resource)) {
			var stringResource = haxe_ui_util_Variant.toString(this._resource);
			stringResource = StringTools.trim(stringResource);
			if(StringTools.startsWith(stringResource,"http://") || StringTools.startsWith(stringResource,"https://")) {
				this.loadFromHttp(stringResource,callback);
			} else if(StringTools.startsWith(stringResource,"file://")) {
				var tmp = HxOverrides.substr(stringResource,7,null);
				haxe_ui_Toolkit.get_assets().imageFromFile(tmp,callback);
			} else {
				haxe_ui_Toolkit.get_assets().getImage(stringResource,callback);
			}
		} else if(haxe_ui_util_Variant.get_isImageData(this._resource)) {
			var imageData = haxe_ui_util_Variant.toImageData(this._resource);
			if(callback != null) {
				callback(haxe_ui_ToolkitAssets.get_instance().imageInfoFromImageData(imageData));
			}
		}
	}
	,loadFromHttp: function(url,callback) {
		var request = new XMLHttpRequest();
		request.open("GET",url);
		request.responseType = "arraybuffer";
		request.onreadystatechange = function(_) {
			if(request.readyState != 4) {
				return;
			}
			var s;
			try {
				s = request.status;
			} catch( _g ) {
				s = null;
			}
			if(s == undefined) {
				s = null;
			}
			if(s != null && s >= 200 && s < 400) {
				haxe_ui_Toolkit.get_assets().imageFromBytes(haxe_io_Bytes.ofData(request.response),callback);
			} else if(s == null) {
				callback(null);
			} else {
				var error = "Http Error #" + request.status;
				if(s != null) {
					switch(s) {
					case 12007:
						error = "Unknown host";
						break;
					case 12029:
						error = "Failed to connect to host";
						break;
					default:
					}
				}
				haxe_Log.trace(error,{ fileName : "haxe/ui/util/ImageLoader.hx", lineNumber : 77, className : "haxe.ui.util.ImageLoader", methodName : "loadFromHttp"});
				if(s == 0) {
					haxe_ui_Toolkit.get_assets().getImage(url,callback);
					return;
				}
				callback(null);
			}
		};
		request.onerror = function(x) {
		};
		request.send();
	}
	,__class__: haxe_ui_util_ImageLoader
};
var haxe_ui_util_Listener = {};
haxe_ui_util_Listener._new = function(callback,priority) {
	var this1 = new haxe_ui_util__$Listener_ListenerInternal(callback,priority);
	return this1;
};
haxe_ui_util_Listener.compareListener = function(a,b) {
	return a.callback == b.callback;
};
haxe_ui_util_Listener.compareFunction = function(a,b) {
	return a.callback == b;
};
haxe_ui_util_Listener.toFunc = function(this1) {
	return this1.callback;
};
var haxe_ui_util__$Listener_ListenerInternal = function(callback,priority) {
	this.callback = callback;
	this.priority = priority;
};
$hxClasses["haxe.ui.util._Listener.ListenerInternal"] = haxe_ui_util__$Listener_ListenerInternal;
haxe_ui_util__$Listener_ListenerInternal.__name__ = "haxe.ui.util._Listener.ListenerInternal";
haxe_ui_util__$Listener_ListenerInternal.prototype = {
	callback: null
	,priority: null
	,__class__: haxe_ui_util__$Listener_ListenerInternal
};
var haxe_ui_util_MathUtil = function() { };
$hxClasses["haxe.ui.util.MathUtil"] = haxe_ui_util_MathUtil;
haxe_ui_util_MathUtil.__name__ = "haxe.ui.util.MathUtil";
haxe_ui_util_MathUtil.distance = function(x1,y1,x2,y2) {
	return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
};
haxe_ui_util_MathUtil.round = function(v,precision) {
	if(precision == null) {
		precision = 0;
	}
	return Math.round(v * Math.pow(10,precision)) / Math.pow(10,precision);
};
haxe_ui_util_MathUtil.roundToNearest = function(v,n) {
	var r = v % n;
	if(r <= n / 2) {
		return Math.round(v - r);
	}
	return Math.round(v + n - r);
};
haxe_ui_util_MathUtil.clamp = function(v,min,max) {
	if(v == null || isNaN(v)) {
		return min;
	}
	if(min != null && v < min) {
		v = min;
	} else if(max != null && v > max) {
		v = max;
	}
	return v;
};
var haxe_ui_util_RTTI = function() { };
$hxClasses["haxe.ui.util.RTTI"] = haxe_ui_util_RTTI;
haxe_ui_util_RTTI.__name__ = "haxe.ui.util.RTTI";
haxe_ui_util_RTTI.addClassProperty = function(className,propertyName,propertyType) {
	className = className.toLowerCase();
	propertyName = propertyName.toLowerCase();
	propertyType = propertyType.toLowerCase();
	if(propertyType == "null<bool>") {
		propertyType = "bool";
	}
	if(propertyType == "null<int>") {
		propertyType = "int";
	}
	if(propertyType == "null<float>") {
		propertyType = "float";
	}
	if(haxe_ui_util_RTTI.classInfo == null) {
		haxe_ui_util_RTTI.classInfo = new haxe_ds_StringMap();
	}
	var entry = haxe_ui_util_RTTI.classInfo.h[className];
	if(entry == null) {
		entry = { };
		haxe_ui_util_RTTI.classInfo.h[className] = entry;
	}
	if(entry.properties == null) {
		entry.properties = new haxe_ds_StringMap();
	}
	entry.properties.h[propertyName] = { propertyName : propertyName, propertyType : propertyType};
};
haxe_ui_util_RTTI.load = function() {
	if(haxe_ui_util_RTTI.classInfo != null) {
		return;
	}
	var s = haxe_Resource.getString("haxeui_rtti");
	if(s == null) {
		return;
	}
	var unserializer = new haxe_Unserializer(s);
	haxe_ui_util_RTTI.classInfo = unserializer.unserialize();
};
haxe_ui_util_RTTI.getClassInfo = function(className) {
	haxe_ui_util_RTTI.load();
	className = className.toLowerCase();
	var entry = haxe_ui_util_RTTI.classInfo.h[className];
	return entry;
};
haxe_ui_util_RTTI.save = function() {
};
var haxe_ui_util_SimpleExpressionEvaluatorOperation = $hxEnums["haxe.ui.util.SimpleExpressionEvaluatorOperation"] = { __ename__:true,__constructs__:null
	,Add: {_hx_name:"Add",_hx_index:0,__enum__:"haxe.ui.util.SimpleExpressionEvaluatorOperation",toString:$estr}
	,Subtract: {_hx_name:"Subtract",_hx_index:1,__enum__:"haxe.ui.util.SimpleExpressionEvaluatorOperation",toString:$estr}
	,Multiply: {_hx_name:"Multiply",_hx_index:2,__enum__:"haxe.ui.util.SimpleExpressionEvaluatorOperation",toString:$estr}
	,Divide: {_hx_name:"Divide",_hx_index:3,__enum__:"haxe.ui.util.SimpleExpressionEvaluatorOperation",toString:$estr}
	,Equals: {_hx_name:"Equals",_hx_index:4,__enum__:"haxe.ui.util.SimpleExpressionEvaluatorOperation",toString:$estr}
	,NotEquals: {_hx_name:"NotEquals",_hx_index:5,__enum__:"haxe.ui.util.SimpleExpressionEvaluatorOperation",toString:$estr}
	,GreaterThan: {_hx_name:"GreaterThan",_hx_index:6,__enum__:"haxe.ui.util.SimpleExpressionEvaluatorOperation",toString:$estr}
	,GreaterThanOrEquals: {_hx_name:"GreaterThanOrEquals",_hx_index:7,__enum__:"haxe.ui.util.SimpleExpressionEvaluatorOperation",toString:$estr}
	,LessThan: {_hx_name:"LessThan",_hx_index:8,__enum__:"haxe.ui.util.SimpleExpressionEvaluatorOperation",toString:$estr}
	,LessThanOrEquals: {_hx_name:"LessThanOrEquals",_hx_index:9,__enum__:"haxe.ui.util.SimpleExpressionEvaluatorOperation",toString:$estr}
	,LogicalAnd: {_hx_name:"LogicalAnd",_hx_index:10,__enum__:"haxe.ui.util.SimpleExpressionEvaluatorOperation",toString:$estr}
	,LogicalOr: {_hx_name:"LogicalOr",_hx_index:11,__enum__:"haxe.ui.util.SimpleExpressionEvaluatorOperation",toString:$estr}
};
haxe_ui_util_SimpleExpressionEvaluatorOperation.__constructs__ = [haxe_ui_util_SimpleExpressionEvaluatorOperation.Add,haxe_ui_util_SimpleExpressionEvaluatorOperation.Subtract,haxe_ui_util_SimpleExpressionEvaluatorOperation.Multiply,haxe_ui_util_SimpleExpressionEvaluatorOperation.Divide,haxe_ui_util_SimpleExpressionEvaluatorOperation.Equals,haxe_ui_util_SimpleExpressionEvaluatorOperation.NotEquals,haxe_ui_util_SimpleExpressionEvaluatorOperation.GreaterThan,haxe_ui_util_SimpleExpressionEvaluatorOperation.GreaterThanOrEquals,haxe_ui_util_SimpleExpressionEvaluatorOperation.LessThan,haxe_ui_util_SimpleExpressionEvaluatorOperation.LessThanOrEquals,haxe_ui_util_SimpleExpressionEvaluatorOperation.LogicalAnd,haxe_ui_util_SimpleExpressionEvaluatorOperation.LogicalOr];
var haxe_ui_util_SimpleExpressionEvaluator = function() { };
$hxClasses["haxe.ui.util.SimpleExpressionEvaluator"] = haxe_ui_util_SimpleExpressionEvaluator;
haxe_ui_util_SimpleExpressionEvaluator.__name__ = "haxe.ui.util.SimpleExpressionEvaluator";
haxe_ui_util_SimpleExpressionEvaluator.evalCondition = function(condition) {
	return haxe_ui_util_SimpleExpressionEvaluator.eval(condition,{ Backend : haxe_ui_Backend, backend : haxe_ui_Backend.get_id(), defined : haxe_ui_util_SimpleExpressionEvaluator.defined});
};
haxe_ui_util_SimpleExpressionEvaluator.defined = function(key) {
	var this1 = haxe_ui_util_Defines.getAll();
	return Object.prototype.hasOwnProperty.call(this1.h,key);
};
haxe_ui_util_SimpleExpressionEvaluator.eval = function(s,context) {
	var r = null;
	if(s.indexOf("||") != -1) {
		var parts = s.split("||");
		var _g = 0;
		while(_g < parts.length) {
			var p = parts[_g];
			++_g;
			if(r == null) {
				r = haxe_ui_util_SimpleExpressionEvaluator.evalSingle(StringTools.trim(p),context);
			} else {
				r = r || haxe_ui_util_SimpleExpressionEvaluator.evalSingle(StringTools.trim(p),context);
			}
		}
	} else if(s.indexOf("&&") != -1) {
		var parts = s.split("&&");
		var _g = 0;
		while(_g < parts.length) {
			var p = parts[_g];
			++_g;
			if(r == null) {
				r = haxe_ui_util_SimpleExpressionEvaluator.evalSingle(StringTools.trim(p),context);
			} else {
				r = r && haxe_ui_util_SimpleExpressionEvaluator.evalSingle(StringTools.trim(p),context);
			}
		}
	} else {
		r = haxe_ui_util_SimpleExpressionEvaluator.evalSingle(s,context);
	}
	return r;
};
haxe_ui_util_SimpleExpressionEvaluator.evalSingle = function(s,context) {
	var result = null;
	var operation = null;
	var token = "";
	var inString = false;
	var _g = 0;
	var _g1 = s.length;
	while(_g < _g1) {
		var i = _g++;
		var ch = s.charAt(i);
		var next = s.charAt(i + 1);
		if(ch == "'" || ch == "\"") {
			inString = !inString;
		}
		if(inString == false) {
			if(ch == "+") {
				operation = haxe_ui_util_SimpleExpressionEvaluatorOperation.Add;
				s = HxOverrides.substr(s,i + 1,null);
				break;
			} else if(ch == "-") {
				operation = haxe_ui_util_SimpleExpressionEvaluatorOperation.Subtract;
				s = HxOverrides.substr(s,i + 1,null);
				break;
			} else if(ch == "*") {
				operation = haxe_ui_util_SimpleExpressionEvaluatorOperation.Multiply;
				s = HxOverrides.substr(s,i + 1,null);
				break;
			} else if(ch == "/") {
				operation = haxe_ui_util_SimpleExpressionEvaluatorOperation.Divide;
				s = HxOverrides.substr(s,i + 1,null);
				break;
			} else if(ch == ">" && next != "=") {
				operation = haxe_ui_util_SimpleExpressionEvaluatorOperation.GreaterThan;
				s = HxOverrides.substr(s,i + 1,null);
				break;
			} else if(ch == "<" && next != "=") {
				operation = haxe_ui_util_SimpleExpressionEvaluatorOperation.LessThan;
				s = HxOverrides.substr(s,i + 1,null);
				break;
			} else if(ch == "=" && next == "=") {
				operation = haxe_ui_util_SimpleExpressionEvaluatorOperation.Equals;
				s = HxOverrides.substr(s,i + 2,null);
				break;
			} else if(ch == "!" && next == "=") {
				operation = haxe_ui_util_SimpleExpressionEvaluatorOperation.NotEquals;
				s = HxOverrides.substr(s,i + 2,null);
				break;
			} else if(ch == ">" && next == "=") {
				operation = haxe_ui_util_SimpleExpressionEvaluatorOperation.GreaterThanOrEquals;
				s = HxOverrides.substr(s,i + 2,null);
				break;
			} else if(ch == "<" && next == "=") {
				operation = haxe_ui_util_SimpleExpressionEvaluatorOperation.LessThanOrEquals;
				s = HxOverrides.substr(s,i + 2,null);
				break;
			} else if(ch == "&" && next == "&") {
				operation = haxe_ui_util_SimpleExpressionEvaluatorOperation.LogicalAnd;
				s = HxOverrides.substr(s,i + 2,null);
				break;
			} else if(ch == "|" && next == "|") {
				operation = haxe_ui_util_SimpleExpressionEvaluatorOperation.LogicalOr;
				s = HxOverrides.substr(s,i + 2,null);
				break;
			}
		}
		token += ch;
		if(i == s.length - 1) {
			s = "";
			break;
		}
	}
	var r = null;
	if(s.length > 0) {
		r = haxe_ui_util_SimpleExpressionEvaluator.evalSingle(s,context);
	}
	var trimmedToken = StringTools.trim(token);
	var v = parseFloat(trimmedToken);
	if(!isNaN(v) && isFinite(v)) {
		result = parseFloat(trimmedToken);
	} else {
		var value = trimmedToken;
		value = value.toLowerCase();
		if(value == "true" || value == "false") {
			result = trimmedToken.toLowerCase() == "true";
		} else if(StringTools.startsWith(trimmedToken,"'") && StringTools.endsWith(trimmedToken,"'") ? true : StringTools.startsWith(trimmedToken,"\"") && StringTools.endsWith(trimmedToken,"\"")) {
			result = HxOverrides.substr(trimmedToken,1,trimmedToken.length - 2);
		} else {
			var token = "";
			var bracketsOpen = 0;
			var call = null;
			var callParams = null;
			var _g = 0;
			var _g1 = trimmedToken.length;
			while(_g < _g1) {
				var i = _g++;
				var ch = trimmedToken.charAt(i);
				if(ch == "(") {
					++bracketsOpen;
					if(bracketsOpen == 1) {
						call = token;
						token = "";
					} else {
						token += ch;
					}
				} else if(ch == ")") {
					--bracketsOpen;
					if(bracketsOpen == 0) {
						callParams = token;
					} else {
						token += ")";
					}
				} else {
					token += ch;
				}
			}
			var prop = null;
			if(call == null) {
				prop = token;
			}
			var parsedCallParams = [];
			if(callParams != null) {
				bracketsOpen = 0;
				token = "";
				var _g = 0;
				var _g1 = callParams.length;
				while(_g < _g1) {
					var i = _g++;
					var ch = callParams.charAt(i);
					if(ch == "(") {
						++bracketsOpen;
					} else if(ch == ")") {
						--bracketsOpen;
					}
					if(ch == ",") {
						if(bracketsOpen == 0) {
							parsedCallParams.push(token);
							token = "";
						} else {
							token += ch;
						}
					} else {
						token += ch;
					}
				}
				if(token.length != 0) {
					parsedCallParams.push(token);
				}
			}
			if(call != null) {
				var trimmedCall = StringTools.trim(call);
				if(trimmedCall.length > 0) {
					var callParts = trimmedCall.split(".");
					var ref = context;
					var prevRef = null;
					var _g = 0;
					while(_g < callParts.length) {
						var callPart = callParts[_g];
						++_g;
						prevRef = ref;
						if(Object.prototype.hasOwnProperty.call(ref,callPart)) {
							ref = Reflect.field(ref,callPart);
						} else {
							ref = Reflect.getProperty(ref,callPart);
						}
						if(ref == null) {
							throw haxe_Exception.thrown(callPart + " not found");
						}
					}
					if(ref != null && Reflect.isFunction(ref)) {
						var paramValues = [];
						var _g = 0;
						while(_g < parsedCallParams.length) {
							var param = parsedCallParams[_g];
							++_g;
							var paramResult = haxe_ui_util_SimpleExpressionEvaluator.evalSingle(param,context);
							paramValues.push(paramResult);
						}
						result = ref.apply(prevRef,paramValues);
					}
				}
			} else if(prop != null) {
				var trimmedProp = StringTools.trim(prop);
				if(trimmedProp.length > 0) {
					var propParts = trimmedProp.split(".");
					var propName = propParts.pop();
					var ref = context;
					var _g = 0;
					while(_g < propParts.length) {
						var propPart = propParts[_g];
						++_g;
						ref = Reflect.field(ref,propPart);
					}
					if(Object.prototype.hasOwnProperty.call(ref,propName)) {
						result = Reflect.field(ref,propName);
					} else {
						result = Reflect.getProperty(ref,propName);
					}
				}
			}
		}
	}
	if(r != null) {
		switch(operation._hx_index) {
		case 0:
			result += r;
			break;
		case 1:
			result -= r;
			break;
		case 2:
			result *= r;
			break;
		case 3:
			result /= r;
			break;
		case 4:
			result = result == r;
			break;
		case 5:
			result = result != r;
			break;
		case 6:
			result = result > r;
			break;
		case 7:
			result = result >= r;
			break;
		case 8:
			result = result < r;
			break;
		case 9:
			result = result <= r;
			break;
		case 10:
			result = result && r;
			break;
		case 11:
			result = result || r;
			break;
		}
	}
	return result;
};
haxe_ui_util_SimpleExpressionEvaluator.isNum = function(value) {
	var v = parseFloat(value);
	if(!isNaN(v)) {
		return isFinite(v);
	} else {
		return false;
	}
};
haxe_ui_util_SimpleExpressionEvaluator.isString = function(value) {
	if(StringTools.startsWith(value,"'") && StringTools.endsWith(value,"'")) {
		return true;
	}
	if(StringTools.startsWith(value,"\"") && StringTools.endsWith(value,"\"")) {
		return true;
	}
	return false;
};
haxe_ui_util_SimpleExpressionEvaluator.isBool = function(value) {
	value = value.toLowerCase();
	if(value != "true") {
		return value == "false";
	} else {
		return true;
	}
};
var haxe_ui_util_StringUtil = function() { };
$hxClasses["haxe.ui.util.StringUtil"] = haxe_ui_util_StringUtil;
haxe_ui_util_StringUtil.__name__ = "haxe.ui.util.StringUtil";
haxe_ui_util_StringUtil.uncapitalizeFirstLetter = function(s) {
	s = HxOverrides.substr(s,0,1).toLowerCase() + HxOverrides.substr(s,1,s.length);
	return s;
};
haxe_ui_util_StringUtil.capitalizeFirstLetter = function(s) {
	s = HxOverrides.substr(s,0,1).toUpperCase() + HxOverrides.substr(s,1,s.length);
	return s;
};
haxe_ui_util_StringUtil.capitalizeHyphens = function(s) {
	return haxe_ui_util_StringUtil.capitalizeDelim(s,"-");
};
haxe_ui_util_StringUtil.capitalizeDelim = function(s,d) {
	var r = s;
	var n = r.indexOf(d);
	while(n != -1) {
		var before = HxOverrides.substr(r,0,n);
		var after = HxOverrides.substr(r,n + 1,r.length);
		r = before + haxe_ui_util_StringUtil.capitalizeFirstLetter(after);
		n = r.indexOf(d,n + 1);
	}
	return r;
};
haxe_ui_util_StringUtil.toDashes = function(s,toLower) {
	if(toLower == null) {
		toLower = true;
	}
	var s1 = new EReg("([a-zA-Z])(?=[A-Z])","g").map(s,function(re) {
		return "" + re.matched(1) + "-";
	});
	if(toLower == true) {
		s1 = s1.toLowerCase();
	}
	return s1;
};
haxe_ui_util_StringUtil.replaceVars = function(s,params) {
	if(params != null) {
		var h = params.h;
		var k_h = h;
		var k_keys = Object.keys(h);
		var k_length = k_keys.length;
		var k_current = 0;
		while(k_current < k_length) {
			var k = k_keys[k_current++];
			s = StringTools.replace(s,"${" + k + "}",params.h[k]);
		}
	}
	return s;
};
haxe_ui_util_StringUtil.rpad = function(s,count,c) {
	if(c == null) {
		c = " ";
	}
	var _g = 0;
	var _g1 = count;
	while(_g < _g1) {
		var i = _g++;
		s += c;
	}
	return s;
};
haxe_ui_util_StringUtil.padDecimal = function(v,precision) {
	var s = v == null ? "null" : "" + v;
	if(precision == null || precision <= 0) {
		return s;
	}
	var n = s.indexOf(".");
	if(n == -1) {
		n = s.length;
		s += ".";
	}
	var delta = precision - (s.length - n - 1);
	return haxe_ui_util_StringUtil.rpad(s,delta,"0");
};
haxe_ui_util_StringUtil.countTokens = function(s,token) {
	if(s == null || s == "") {
		return 0;
	}
	return s.split(token).length - 1;
};
var haxe_ui_util_StyleUtil = function() { };
$hxClasses["haxe.ui.util.StyleUtil"] = haxe_ui_util_StyleUtil;
haxe_ui_util_StyleUtil.__name__ = "haxe.ui.util.StyleUtil";
haxe_ui_util_StyleUtil.styleProperty2ComponentProperty = function(property) {
	return haxe_ui_util_StyleUtil.style2ComponentEReg.map(property,function(re) {
		return re.matched(1).toUpperCase();
	});
};
haxe_ui_util_StyleUtil.componentProperty2StyleProperty = function(property) {
	return haxe_ui_util_StyleUtil.component2StyleEReg.map(property,function(re) {
		return "-" + re.matched(1).toLowerCase();
	});
};
var haxe_ui_util_Timer = function(delay,callback) {
	haxe_ui_backend_TimerImpl.call(this,delay,callback);
};
$hxClasses["haxe.ui.util.Timer"] = haxe_ui_util_Timer;
haxe_ui_util_Timer.__name__ = "haxe.ui.util.Timer";
haxe_ui_util_Timer.delay = function(f,timeMs) {
	var t = null;
	t = new haxe_ui_util_Timer(timeMs,function() {
		t.stop();
		f();
	});
	return t;
};
haxe_ui_util_Timer.__super__ = haxe_ui_backend_TimerImpl;
haxe_ui_util_Timer.prototype = $extend(haxe_ui_backend_TimerImpl.prototype,{
	stop: function() {
		haxe_ui_backend_TimerImpl.prototype.stop.call(this);
	}
	,__class__: haxe_ui_util_Timer
});
var haxe_ui_util_TypeConverter = function() { };
$hxClasses["haxe.ui.util.TypeConverter"] = haxe_ui_util_TypeConverter;
haxe_ui_util_TypeConverter.__name__ = "haxe.ui.util.TypeConverter";
haxe_ui_util_TypeConverter.convertFrom = function(input) {
	var output = input;
	var _g = Type.typeof(input);
	if(_g._hx_index == 6) {
		if(_g.c == String) {
			var s = Std.string(input);
			if(s == "true" || s == "false") {
				output = s == "true";
			} else if(new EReg("^-?[0-9]*$","i").match(s == null ? "null" : "" + s)) {
				output = Std.parseInt(s);
			} else if(new EReg("^-?[0-9]*\\.[0-9]*$","i").match(s == null ? "null" : "" + s)) {
				output = parseFloat(s);
			}
		}
	}
	return output;
};
haxe_ui_util_TypeConverter.convertTo = function(input,type) {
	if(type == null) {
		return input;
	}
	switch(type.toLowerCase()) {
	case "bool":
		return Std.string(input) == "true";
	case "string":
		return Std.string(input);
	}
	return input;
};
var haxe_ui_util_VariantType = $hxEnums["haxe.ui.util.VariantType"] = { __ename__:true,__constructs__:null
	,VT_Int: ($_=function(s) { return {_hx_index:0,s:s,__enum__:"haxe.ui.util.VariantType",toString:$estr}; },$_._hx_name="VT_Int",$_.__params__ = ["s"],$_)
	,VT_Float: ($_=function(s) { return {_hx_index:1,s:s,__enum__:"haxe.ui.util.VariantType",toString:$estr}; },$_._hx_name="VT_Float",$_.__params__ = ["s"],$_)
	,VT_String: ($_=function(s) { return {_hx_index:2,s:s,__enum__:"haxe.ui.util.VariantType",toString:$estr}; },$_._hx_name="VT_String",$_.__params__ = ["s"],$_)
	,VT_Bool: ($_=function(s) { return {_hx_index:3,s:s,__enum__:"haxe.ui.util.VariantType",toString:$estr}; },$_._hx_name="VT_Bool",$_.__params__ = ["s"],$_)
	,VT_Array: ($_=function(s) { return {_hx_index:4,s:s,__enum__:"haxe.ui.util.VariantType",toString:$estr}; },$_._hx_name="VT_Array",$_.__params__ = ["s"],$_)
	,VT_DataSource: ($_=function(s) { return {_hx_index:5,s:s,__enum__:"haxe.ui.util.VariantType",toString:$estr}; },$_._hx_name="VT_DataSource",$_.__params__ = ["s"],$_)
	,VT_Component: ($_=function(s) { return {_hx_index:6,s:s,__enum__:"haxe.ui.util.VariantType",toString:$estr}; },$_._hx_name="VT_Component",$_.__params__ = ["s"],$_)
	,VT_Date: ($_=function(s) { return {_hx_index:7,s:s,__enum__:"haxe.ui.util.VariantType",toString:$estr}; },$_._hx_name="VT_Date",$_.__params__ = ["s"],$_)
	,VT_ImageData: ($_=function(s) { return {_hx_index:8,s:s,__enum__:"haxe.ui.util.VariantType",toString:$estr}; },$_._hx_name="VT_ImageData",$_.__params__ = ["s"],$_)
};
haxe_ui_util_VariantType.__constructs__ = [haxe_ui_util_VariantType.VT_Int,haxe_ui_util_VariantType.VT_Float,haxe_ui_util_VariantType.VT_String,haxe_ui_util_VariantType.VT_Bool,haxe_ui_util_VariantType.VT_Array,haxe_ui_util_VariantType.VT_DataSource,haxe_ui_util_VariantType.VT_Component,haxe_ui_util_VariantType.VT_Date,haxe_ui_util_VariantType.VT_ImageData];
var haxe_ui_util_Variant = {};
haxe_ui_util_Variant.__properties__ = {get_isNull:"get_isNull",get_isDataSource:"get_isDataSource",get_isImageData:"get_isImageData",get_isComponent:"get_isComponent",get_isDate:"get_isDate",get_isArray:"get_isArray",get_isBool:"get_isBool",get_isNumber:"get_isNumber",get_isInt:"get_isInt",get_isFloat:"get_isFloat",get_isString:"get_isString"};
haxe_ui_util_Variant.fromString = function(s) {
	return haxe_ui_util_VariantType.VT_String(s);
};
haxe_ui_util_Variant.toString = function(this1) {
	if(this1 == null) {
		return null;
	}
	switch(this1._hx_index) {
	case 0:
		var s = this1.s;
		if(s == null) {
			return "null";
		} else {
			return "" + s;
		}
		break;
	case 1:
		var s = this1.s;
		if(s == null) {
			return "null";
		} else {
			return "" + s;
		}
		break;
	case 2:
		var s = this1.s;
		return s;
	case 3:
		var s = this1.s;
		if(s == null) {
			return "null";
		} else {
			return "" + s;
		}
		break;
	case 4:
		var s = this1.s;
		return Std.string(s);
	case 5:
		var _g = this1.s;
		return "";
	case 6:
		var s = this1.s;
		return Std.string(s);
	case 7:
		var s = this1.s;
		return Std.string(s);
	case 8:
		var s = this1.s;
		return "";
	}
};
haxe_ui_util_Variant.get_isString = function(this1) {
	if(this1._hx_index == 2) {
		var _g = this1.s;
		return true;
	} else {
		return false;
	}
};
haxe_ui_util_Variant.fromFloat = function(s) {
	return haxe_ui_util_VariantType.VT_Float(s);
};
haxe_ui_util_Variant.toFloat = function(this1) {
	if(haxe_ui_util_Variant.get_isNull(this1)) {
		return null;
	}
	switch(this1._hx_index) {
	case 0:
		var s = this1.s;
		return s;
	case 1:
		var s = this1.s;
		return s;
	default:
		throw haxe_Exception.thrown("Variant Type Error");
	}
};
haxe_ui_util_Variant.get_isFloat = function(this1) {
	if(this1._hx_index == 1) {
		var _g = this1.s;
		return true;
	} else {
		return false;
	}
};
haxe_ui_util_Variant.fromInt = function(s) {
	return haxe_ui_util_VariantType.VT_Int(s);
};
haxe_ui_util_Variant.toInt = function(this1) {
	if(haxe_ui_util_Variant.get_isNull(this1)) {
		return null;
	}
	switch(this1._hx_index) {
	case 0:
		var s = this1.s;
		return s;
	case 1:
		var s = this1.s;
		return s | 0;
	default:
		throw haxe_Exception.thrown("Variant Type Error " + Std.string(this1));
	}
};
haxe_ui_util_Variant.get_isInt = function(this1) {
	if(this1._hx_index == 0) {
		var _g = this1.s;
		return true;
	} else {
		return false;
	}
};
haxe_ui_util_Variant.get_isNumber = function(this1) {
	switch(this1._hx_index) {
	case 0:
		var _g = this1.s;
		return true;
	case 1:
		var _g = this1.s;
		return true;
	default:
		return false;
	}
};
haxe_ui_util_Variant.toNumber = function(this1) {
	switch(this1._hx_index) {
	case 0:
		var s = this1.s;
		return s;
	case 1:
		var s = this1.s;
		return s;
	default:
		throw haxe_Exception.thrown("Variant Type Error");
	}
};
haxe_ui_util_Variant.fromBool = function(s) {
	return haxe_ui_util_VariantType.VT_Bool(s);
};
haxe_ui_util_Variant.toBool = function(this1) {
	if(this1 == null) {
		return false;
	}
	switch(this1._hx_index) {
	case 2:
		var s = this1.s;
		return s == "true";
	case 3:
		var s = this1.s;
		return s;
	default:
		throw haxe_Exception.thrown("Variant Type Error");
	}
};
haxe_ui_util_Variant.get_isBool = function(this1) {
	if(this1._hx_index == 3) {
		var _g = this1.s;
		return true;
	}
	return false;
};
haxe_ui_util_Variant.fromArray = function(s) {
	if(s == null) {
		return null;
	} else {
		return haxe_ui_util_VariantType.VT_Array(s);
	}
};
haxe_ui_util_Variant.toArray = function(this1) {
	if(this1 == null) {
		return null;
	}
	if(this1._hx_index == 4) {
		var s = this1.s;
		return s;
	} else {
		throw haxe_Exception.thrown("Variant Type Error");
	}
};
haxe_ui_util_Variant.get_isArray = function(this1) {
	if(this1._hx_index == 4) {
		var _g = this1.s;
		return true;
	}
	return false;
};
haxe_ui_util_Variant.fromDate = function(s) {
	return haxe_ui_util_VariantType.VT_Date(s);
};
haxe_ui_util_Variant.toDate = function(this1) {
	if(this1 == null) {
		return null;
	}
	if(this1._hx_index == 7) {
		var s = this1.s;
		return s;
	} else {
		throw haxe_Exception.thrown("Variant Type Error");
	}
};
haxe_ui_util_Variant.get_isDate = function(this1) {
	if(this1._hx_index == 7) {
		var _g = this1.s;
		return true;
	}
	return false;
};
haxe_ui_util_Variant.fromComponent = function(s) {
	return haxe_ui_util_VariantType.VT_Component(s);
};
haxe_ui_util_Variant.toComponent = function(this1) {
	if(this1 == null) {
		return null;
	}
	if(this1._hx_index == 6) {
		var s = this1.s;
		return s;
	} else {
		throw haxe_Exception.thrown("Variant Type Error");
	}
};
haxe_ui_util_Variant.get_isComponent = function(this1) {
	if(this1._hx_index == 6) {
		var _g = this1.s;
		return true;
	}
	return false;
};
haxe_ui_util_Variant.fromImageData = function(s) {
	return haxe_ui_util_VariantType.VT_ImageData(s);
};
haxe_ui_util_Variant.toImageData = function(this1) {
	if(this1 == null) {
		return null;
	}
	if(this1._hx_index == 8) {
		var s = this1.s;
		return s;
	} else {
		throw haxe_Exception.thrown("Variant Type Error");
	}
};
haxe_ui_util_Variant.get_isImageData = function(this1) {
	if(this1._hx_index == 8) {
		var _g = this1.s;
		return true;
	}
	return false;
};
haxe_ui_util_Variant.fromDataSource = function(s) {
	return haxe_ui_util_VariantType.VT_DataSource(s);
};
haxe_ui_util_Variant.toDataSource = function(this1) {
	if(this1 == null) {
		return null;
	}
	if(this1._hx_index == 5) {
		var s = this1.s;
		return s;
	} else {
		throw haxe_Exception.thrown("Variant Type Error");
	}
};
haxe_ui_util_Variant.get_isDataSource = function(this1) {
	if(this1._hx_index == 5) {
		var _g = this1.s;
		return true;
	}
	return false;
};
haxe_ui_util_Variant.addFloat = function(lhs,rhs) {
	return lhs + haxe_ui_util_Variant.toNumber(rhs);
};
haxe_ui_util_Variant.addInt = function(lhs,rhs) {
	return lhs + haxe_ui_util_Variant.toInt(rhs);
};
haxe_ui_util_Variant.subtractFloat = function(lhs,rhs) {
	return lhs - haxe_ui_util_Variant.toNumber(rhs);
};
haxe_ui_util_Variant.subtractInt = function(lhs,rhs) {
	return lhs - haxe_ui_util_Variant.toInt(rhs);
};
haxe_ui_util_Variant.add = function(this1,rhs) {
	var tmp;
	var tmp1;
	switch(this1._hx_index) {
	case 0:
		var _g = this1.s;
		tmp1 = true;
		break;
	case 1:
		var _g = this1.s;
		tmp1 = true;
		break;
	default:
		tmp1 = false;
	}
	if(tmp1) {
		switch(rhs._hx_index) {
		case 0:
			var _g = rhs.s;
			tmp = true;
			break;
		case 1:
			var _g = rhs.s;
			tmp = true;
			break;
		default:
			tmp = false;
		}
	} else {
		tmp = false;
	}
	if(tmp) {
		return haxe_ui_util_Variant.fromFloat(haxe_ui_util_Variant.toNumber(this1) + haxe_ui_util_Variant.toNumber(rhs));
	} else if(haxe_ui_util_Variant.get_isString(this1) && haxe_ui_util_Variant.get_isString(rhs)) {
		return haxe_ui_util_Variant.fromString(haxe_ui_util_Variant.toString(this1) + haxe_ui_util_Variant.toString(rhs));
	}
	throw haxe_Exception.thrown("Variant operation error");
};
haxe_ui_util_Variant.postInc = function(this1) {
	var tmp;
	switch(this1._hx_index) {
	case 0:
		var _g = this1.s;
		tmp = true;
		break;
	case 1:
		var _g = this1.s;
		tmp = true;
		break;
	default:
		tmp = false;
	}
	if(tmp) {
		var old = this1;
		this1 = haxe_ui_util_VariantType.VT_Float(haxe_ui_util_Variant.toNumber(this1) + 1);
		return old;
	} else {
		throw haxe_Exception.thrown("Variant operation error");
	}
};
haxe_ui_util_Variant.preInc = function(this1) {
	var tmp;
	switch(this1._hx_index) {
	case 0:
		var _g = this1.s;
		tmp = true;
		break;
	case 1:
		var _g = this1.s;
		tmp = true;
		break;
	default:
		tmp = false;
	}
	if(tmp) {
		this1 = haxe_ui_util_VariantType.VT_Float(haxe_ui_util_Variant.toNumber(this1) + 1);
		return this1;
	} else {
		throw haxe_Exception.thrown("Variant operation error");
	}
};
haxe_ui_util_Variant.subtract = function(this1,rhs) {
	var tmp;
	var tmp1;
	switch(this1._hx_index) {
	case 0:
		var _g = this1.s;
		tmp1 = true;
		break;
	case 1:
		var _g = this1.s;
		tmp1 = true;
		break;
	default:
		tmp1 = false;
	}
	if(tmp1) {
		switch(rhs._hx_index) {
		case 0:
			var _g = rhs.s;
			tmp = true;
			break;
		case 1:
			var _g = rhs.s;
			tmp = true;
			break;
		default:
			tmp = false;
		}
	} else {
		tmp = false;
	}
	if(tmp) {
		return haxe_ui_util_Variant.fromFloat(haxe_ui_util_Variant.toNumber(this1) - haxe_ui_util_Variant.toNumber(rhs));
	} else if(haxe_ui_util_Variant.get_isString(this1) && haxe_ui_util_Variant.get_isString(rhs)) {
		return haxe_ui_util_Variant.fromString(StringTools.replace(haxe_ui_util_Variant.toString(this1),haxe_ui_util_Variant.toString(rhs),""));
	}
	throw haxe_Exception.thrown("Variant operation error");
};
haxe_ui_util_Variant.postDeinc = function(this1) {
	var tmp;
	switch(this1._hx_index) {
	case 0:
		var _g = this1.s;
		tmp = true;
		break;
	case 1:
		var _g = this1.s;
		tmp = true;
		break;
	default:
		tmp = false;
	}
	if(tmp) {
		var old = this1;
		this1 = haxe_ui_util_VariantType.VT_Float(haxe_ui_util_Variant.toNumber(this1) - 1);
		return old;
	} else {
		throw haxe_Exception.thrown("Variant operation error");
	}
};
haxe_ui_util_Variant.preDeinc = function(this1) {
	var tmp;
	switch(this1._hx_index) {
	case 0:
		var _g = this1.s;
		tmp = true;
		break;
	case 1:
		var _g = this1.s;
		tmp = true;
		break;
	default:
		tmp = false;
	}
	if(tmp) {
		this1 = haxe_ui_util_VariantType.VT_Float(haxe_ui_util_Variant.toNumber(this1) - 1);
		return this1;
	} else {
		throw haxe_Exception.thrown("Variant operation error");
	}
};
haxe_ui_util_Variant.multiply = function(this1,rhs) {
	var tmp;
	var tmp1;
	switch(this1._hx_index) {
	case 0:
		var _g = this1.s;
		tmp1 = true;
		break;
	case 1:
		var _g = this1.s;
		tmp1 = true;
		break;
	default:
		tmp1 = false;
	}
	if(tmp1) {
		switch(rhs._hx_index) {
		case 0:
			var _g = rhs.s;
			tmp = true;
			break;
		case 1:
			var _g = rhs.s;
			tmp = true;
			break;
		default:
			tmp = false;
		}
	} else {
		tmp = false;
	}
	if(tmp) {
		return haxe_ui_util_Variant.fromFloat(haxe_ui_util_Variant.toNumber(this1) * haxe_ui_util_Variant.toNumber(rhs));
	}
	throw haxe_Exception.thrown("Variant operation error");
};
haxe_ui_util_Variant.divide = function(this1,rhs) {
	var tmp;
	var tmp1;
	switch(this1._hx_index) {
	case 0:
		var _g = this1.s;
		tmp1 = true;
		break;
	case 1:
		var _g = this1.s;
		tmp1 = true;
		break;
	default:
		tmp1 = false;
	}
	if(tmp1) {
		switch(rhs._hx_index) {
		case 0:
			var _g = rhs.s;
			tmp = true;
			break;
		case 1:
			var _g = rhs.s;
			tmp = true;
			break;
		default:
			tmp = false;
		}
	} else {
		tmp = false;
	}
	if(tmp) {
		return haxe_ui_util_Variant.fromFloat(haxe_ui_util_Variant.toNumber(this1) / haxe_ui_util_Variant.toNumber(rhs));
	}
	throw haxe_Exception.thrown("Variant operation error");
};
haxe_ui_util_Variant.gt = function(this1,rhs) {
	var tmp;
	switch(this1._hx_index) {
	case 0:
		var _g = this1.s;
		tmp = true;
		break;
	case 1:
		var _g = this1.s;
		tmp = true;
		break;
	default:
		tmp = false;
	}
	if(tmp) {
		return haxe_ui_util_Variant.toNumber(this1) > haxe_ui_util_Variant.toNumber(rhs);
	} else if(haxe_ui_util_Variant.get_isString(this1)) {
		return haxe_ui_util_Variant.toString(this1) > haxe_ui_util_Variant.toString(rhs);
	}
	throw haxe_Exception.thrown("Variant operation error");
};
haxe_ui_util_Variant.gte = function(this1,rhs) {
	var tmp;
	switch(this1._hx_index) {
	case 0:
		var _g = this1.s;
		tmp = true;
		break;
	case 1:
		var _g = this1.s;
		tmp = true;
		break;
	default:
		tmp = false;
	}
	if(tmp) {
		return haxe_ui_util_Variant.toNumber(this1) >= haxe_ui_util_Variant.toNumber(rhs);
	} else if(haxe_ui_util_Variant.get_isString(this1)) {
		return haxe_ui_util_Variant.toString(this1) >= haxe_ui_util_Variant.toString(rhs);
	}
	throw haxe_Exception.thrown("Variant operation error");
};
haxe_ui_util_Variant.lt = function(this1,rhs) {
	var tmp;
	switch(this1._hx_index) {
	case 0:
		var _g = this1.s;
		tmp = true;
		break;
	case 1:
		var _g = this1.s;
		tmp = true;
		break;
	default:
		tmp = false;
	}
	if(tmp) {
		return haxe_ui_util_Variant.toNumber(this1) < haxe_ui_util_Variant.toNumber(rhs);
	} else if(haxe_ui_util_Variant.get_isString(this1)) {
		return haxe_ui_util_Variant.toString(this1) < haxe_ui_util_Variant.toString(rhs);
	}
	throw haxe_Exception.thrown("Variant operation error");
};
haxe_ui_util_Variant.lte = function(this1,rhs) {
	var tmp;
	switch(this1._hx_index) {
	case 0:
		var _g = this1.s;
		tmp = true;
		break;
	case 1:
		var _g = this1.s;
		tmp = true;
		break;
	default:
		tmp = false;
	}
	if(tmp) {
		return haxe_ui_util_Variant.toNumber(this1) <= haxe_ui_util_Variant.toNumber(rhs);
	} else if(haxe_ui_util_Variant.get_isString(this1)) {
		return haxe_ui_util_Variant.toString(this1) <= haxe_ui_util_Variant.toString(rhs);
	}
	throw haxe_Exception.thrown("Variant operation error");
};
haxe_ui_util_Variant.negate = function(this1) {
	var tmp;
	switch(this1._hx_index) {
	case 0:
		var _g = this1.s;
		tmp = true;
		break;
	case 1:
		var _g = this1.s;
		tmp = true;
		break;
	default:
		tmp = false;
	}
	if(tmp) {
		return haxe_ui_util_Variant.fromFloat(-haxe_ui_util_Variant.toNumber(this1));
	}
	throw haxe_Exception.thrown("Variant operation error");
};
haxe_ui_util_Variant.invert = function(this1) {
	if(haxe_ui_util_Variant.get_isBool(this1)) {
		var v = haxe_ui_util_Variant.toBool(this1);
		v = !v;
		return haxe_ui_util_Variant.fromBool(v);
	}
	throw haxe_Exception.thrown("Variant operation error");
};
haxe_ui_util_Variant.eq = function(this1,rhs) {
	if(haxe_ui_util_Variant.get_isNull(this1) && haxe_ui_util_Variant.get_isNull(rhs)) {
		return true;
	}
	if(haxe_ui_util_Variant.get_isNull(this1) && !haxe_ui_util_Variant.get_isNull(rhs)) {
		return false;
	}
	if(!haxe_ui_util_Variant.get_isNull(this1) && haxe_ui_util_Variant.get_isNull(rhs)) {
		return false;
	}
	var tmp;
	var tmp1;
	switch(this1._hx_index) {
	case 0:
		var _g = this1.s;
		tmp1 = true;
		break;
	case 1:
		var _g = this1.s;
		tmp1 = true;
		break;
	default:
		tmp1 = false;
	}
	if(tmp1) {
		switch(rhs._hx_index) {
		case 0:
			var _g = rhs.s;
			tmp = true;
			break;
		case 1:
			var _g = rhs.s;
			tmp = true;
			break;
		default:
			tmp = false;
		}
	} else {
		tmp = false;
	}
	if(tmp) {
		return haxe_ui_util_Variant.toNumber(this1) == haxe_ui_util_Variant.toNumber(rhs);
	} else if(haxe_ui_util_Variant.get_isBool(this1) && haxe_ui_util_Variant.get_isBool(rhs)) {
		return haxe_ui_util_Variant.toBool(this1) == haxe_ui_util_Variant.toBool(rhs);
	} else if(haxe_ui_util_Variant.get_isString(this1) && haxe_ui_util_Variant.get_isString(rhs)) {
		return haxe_ui_util_Variant.toString(this1) == haxe_ui_util_Variant.toString(rhs);
	}
	return false;
};
haxe_ui_util_Variant.neq = function(this1,rhs) {
	return !haxe_ui_util_Variant.eq(this1,rhs);
};
haxe_ui_util_Variant.get_isNull = function(this1) {
	if(this1 != null) {
		return haxe_ui_util_Variant.toString(this1) == null;
	} else {
		return true;
	}
};
haxe_ui_util_Variant.fromDynamic = function(r) {
	var v = null;
	if(r != null) {
		var tmp;
		if(haxe_ui_util_Variant.containsOnlyDigits(r)) {
			var f = parseFloat(("" + Std.string(r)));
			tmp = isNaN(f) == false;
		} else {
			tmp = false;
		}
		if(tmp) {
			if(Std.string(r).indexOf(".") != -1) {
				v = haxe_ui_util_Variant.fromFloat(parseFloat(("" + Std.string(r))));
			} else {
				v = haxe_ui_util_Variant.fromInt(Std.parseInt("" + Std.string(r)));
			}
		} else if("" + Std.string(r) == "true" || Std.string(r) + "" == "false") {
			v = haxe_ui_util_Variant.fromBool("" + Std.string(r) == "true");
		} else if(typeof(r) == "string") {
			v = haxe_ui_util_Variant.fromString(js_Boot.__cast(r , String));
		} else if(((r) instanceof haxe_ui_core_Component)) {
			v = haxe_ui_util_Variant.fromComponent(js_Boot.__cast(r , haxe_ui_core_Component));
		} else if(((r) instanceof haxe_ui_data_DataSource)) {
			v = r;
		} else if(((r) instanceof Array)) {
			v = r;
		} else if(((r) instanceof Date)) {
			v = haxe_ui_util_Variant.fromDate(js_Boot.__cast(r , Date));
		} else if(((r) instanceof HTMLImageElement)) {
			v = haxe_ui_util_Variant.fromImageData(js_Boot.__cast(r , HTMLImageElement));
		} else {
			v = r;
		}
	}
	return v;
};
haxe_ui_util_Variant.containsOnlyDigits = function(s) {
	if(typeof(s) == "number" && ((s | 0) === s) || typeof(s) == "number") {
		return true;
	}
	var t = Std.string(s);
	var _g = 0;
	var _g1 = t.length;
	while(_g < _g1) {
		var i = _g++;
		var c = t.charAt(i);
		if(c != "0" && c != "1" && c != "2" && c != "3" && c != "4" && c != "5" && c != "6" && c != "7" && c != "8" && c != "9" && c != "." && c != "-") {
			return false;
		}
	}
	return true;
};
haxe_ui_util_Variant.toDynamic = function(v) {
	var d = v;
	if(v != null) {
		switch(v._hx_index) {
		case 0:
			var y = v.s;
			d = y;
			break;
		case 1:
			var y = v.s;
			d = y;
			break;
		case 2:
			var y = v.s;
			d = y;
			break;
		case 3:
			var y = v.s;
			d = y;
			break;
		case 4:
			var y = v.s;
			d = y;
			break;
		case 5:
			var y = v.s;
			d = y;
			break;
		case 6:
			var y = v.s;
			d = y;
			break;
		case 7:
			var y = v.s;
			d = y;
			break;
		case 8:
			var y = v.s;
			d = y;
			break;
		}
	}
	return d;
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
js_Boot.__implements = function(o,iface) {
	return js_Boot.__interfLoop(js_Boot.getClass(o),iface);
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
var libnoise_ModuleBase = function(count) {
	if(count > 0) {
		var this1 = new Array(count);
		this.modules = this1;
	}
};
$hxClasses["libnoise.ModuleBase"] = libnoise_ModuleBase;
libnoise_ModuleBase.__name__ = "libnoise.ModuleBase";
libnoise_ModuleBase.prototype = {
	modules: null
	,get: function(index) {
		return this.modules[index];
	}
	,set: function(index,value) {
		return this.modules[index] = value;
	}
	,length: function() {
		return this.modules.length;
	}
	,getValue: function(x,y,z) {
		throw haxe_Exception.thrown("ModuleBase.getValue is an abstract method");
	}
	,__class__: libnoise_ModuleBase
};
var libnoise_QualityMode = $hxEnums["libnoise.QualityMode"] = { __ename__:true,__constructs__:null
	,LOW: {_hx_name:"LOW",_hx_index:0,__enum__:"libnoise.QualityMode",toString:$estr}
	,MEDIUM: {_hx_name:"MEDIUM",_hx_index:1,__enum__:"libnoise.QualityMode",toString:$estr}
	,HIGH: {_hx_name:"HIGH",_hx_index:2,__enum__:"libnoise.QualityMode",toString:$estr}
};
libnoise_QualityMode.__constructs__ = [libnoise_QualityMode.LOW,libnoise_QualityMode.MEDIUM,libnoise_QualityMode.HIGH];
var libnoise_Utils = function() { };
$hxClasses["libnoise.Utils"] = libnoise_Utils;
libnoise_Utils.__name__ = "libnoise.Utils";
libnoise_Utils.GradientCoherentNoise3D = function(x,y,z,seed,quality) {
	var x0 = x > 0.0 ? x | 0 : (x | 0) - 1;
	var x1 = x0 + 1;
	var y0 = y > 0.0 ? y | 0 : (y | 0) - 1;
	var y1 = y0 + 1;
	var z0 = z > 0.0 ? z | 0 : (z | 0) - 1;
	var z1 = z0 + 1;
	var xs = 0.0;
	var ys = 0.0;
	var zs = 0.0;
	switch(quality._hx_index) {
	case 0:
		xs = x - x0;
		ys = y - y0;
		zs = z - z0;
		break;
	case 1:
		var value = x - x0;
		xs = value * value * (3.0 - 2.0 * value);
		var value = y - y0;
		ys = value * value * (3.0 - 2.0 * value);
		var value = z - z0;
		zs = value * value * (3.0 - 2.0 * value);
		break;
	case 2:
		xs = libnoise_Utils.MapQuinticSCurve(x - x0);
		ys = libnoise_Utils.MapQuinticSCurve(y - y0);
		zs = libnoise_Utils.MapQuinticSCurve(z - z0);
		break;
	}
	var n0 = libnoise_Utils.GradientNoise3D(x,y,z,x0,y0,z0,seed);
	var n1 = libnoise_Utils.GradientNoise3D(x,y,z,x1,y0,z0,seed);
	var ix0 = libnoise_Utils.InterpolateLinear(n0,n1,xs);
	n0 = libnoise_Utils.GradientNoise3D(x,y,z,x0,y1,z0,seed);
	n1 = libnoise_Utils.GradientNoise3D(x,y,z,x1,y1,z0,seed);
	var ix1 = libnoise_Utils.InterpolateLinear(n0,n1,xs);
	var iy0 = libnoise_Utils.InterpolateLinear(ix0,ix1,ys);
	n0 = libnoise_Utils.GradientNoise3D(x,y,z,x0,y0,z1,seed);
	n1 = libnoise_Utils.GradientNoise3D(x,y,z,x1,y0,z1,seed);
	ix0 = libnoise_Utils.InterpolateLinear(n0,n1,xs);
	n0 = libnoise_Utils.GradientNoise3D(x,y,z,x0,y1,z1,seed);
	n1 = libnoise_Utils.GradientNoise3D(x,y,z,x1,y1,z1,seed);
	ix1 = libnoise_Utils.InterpolateLinear(n0,n1,xs);
	var iy1 = libnoise_Utils.InterpolateLinear(ix0,ix1,ys);
	return libnoise_Utils.InterpolateLinear(iy0,iy1,zs);
};
libnoise_Utils.GradientNoise3D = function(fx,fy,fz,ix,iy,iz,seed) {
	var i = libnoise_Utils.GeneratorNoiseX * ix + libnoise_Utils.GeneratorNoiseY * iy + libnoise_Utils.GeneratorNoiseZ * iz + libnoise_Utils.GeneratorSeed * seed & -1;
	i ^= i >> libnoise_Utils.GeneratorShift;
	i &= 255;
	var xvg = libnoise_Utils.Randoms[i << 2];
	var yvg = libnoise_Utils.Randoms[(i << 2) + 1];
	var zvg = libnoise_Utils.Randoms[(i << 2) + 2];
	var xvp = fx - ix;
	var yvp = fy - iy;
	var zvp = fz - iz;
	return (xvg * xvp + yvg * yvp + zvg * zvp) * 2.12;
};
libnoise_Utils.InterpolateCubic = function(a,b,c,d,position) {
	var p = d - c - (a - b);
	var q = a - b - p;
	var r = c - a;
	var s = b;
	return p * position * position * position + q * position * position + r * position + s;
};
libnoise_Utils.InterpolateLinear = function(a,b,position) {
	return (1.0 - position) * a + position * b;
};
libnoise_Utils.fmod = function(a,b) {
	return a - (a / b | 0) * b;
};
libnoise_Utils.MakeInt32Range = function(value) {
	if(value >= 1073741824.0) {
		return 2.0 * (value - (value / 1073741824.0 | 0) * 1073741824.0) - 1073741824.0;
	}
	if(value <= -1073741824.0) {
		return 2.0 * (value - (value / 1073741824.0 | 0) * 1073741824.0) + 1073741824.0;
	}
	return value;
};
libnoise_Utils.MapCubicSCurve = function(value) {
	return value * value * (3.0 - 2.0 * value);
};
libnoise_Utils.MapQuinticSCurve = function(value) {
	var a3 = value * value * value;
	var a4 = a3 * value;
	var a5 = a4 * value;
	return 6.0 * a5 - 15.0 * a4 + 10.0 * a3;
};
libnoise_Utils.ValueNoise3D = function(x,y,z,seed) {
	return 1.0 - libnoise_Utils.ValueNoise3DInt(x,y,z,seed) / 1073741824.0;
};
libnoise_Utils.ValueNoise3DInt = function(x,y,z,seed) {
	var n = libnoise_Utils.GeneratorNoiseX * x + libnoise_Utils.GeneratorNoiseY * y + libnoise_Utils.GeneratorNoiseZ * z + libnoise_Utils.GeneratorSeed * seed & 2147483647;
	n = n >> 13 ^ n;
	return n * (n * n * 60493 + 19990303) + 1376312589 & 2147483647;
};
libnoise_Utils.Clamp = function(value,min,max) {
	if(value < min) {
		return min;
	} else if(value > max) {
		return max;
	} else {
		return value;
	}
};
var libnoise_generator_Perlin = function(frequency,lacunarity,persistence,octaves,seed,quality) {
	this.frequency = frequency;
	this.lacunarity = lacunarity;
	this.persistence = persistence;
	this.octaves = octaves;
	this.seed = seed;
	this.quality = quality;
	libnoise_ModuleBase.call(this,0);
};
$hxClasses["libnoise.generator.Perlin"] = libnoise_generator_Perlin;
libnoise_generator_Perlin.__name__ = "libnoise.generator.Perlin";
libnoise_generator_Perlin.__super__ = libnoise_ModuleBase;
libnoise_generator_Perlin.prototype = $extend(libnoise_ModuleBase.prototype,{
	frequency: null
	,lacunarity: null
	,persistence: null
	,octaves: null
	,seed: null
	,quality: null
	,getValue: function(x,y,z) {
		var value = 0.0;
		var cp = 1.0;
		x *= this.frequency;
		y *= this.frequency;
		z *= this.frequency;
		var _g = 0;
		var _g1 = this.octaves;
		while(_g < _g1) {
			var i = _g++;
			var nx = libnoise_Utils.MakeInt32Range(x);
			var ny = libnoise_Utils.MakeInt32Range(y);
			var nz = libnoise_Utils.MakeInt32Range(z);
			var _seed = this.seed + i & -1;
			var signal = libnoise_Utils.GradientCoherentNoise3D(nx,ny,nz,_seed,this.quality);
			value += signal * cp;
			x *= this.lacunarity;
			y *= this.lacunarity;
			z *= this.lacunarity;
			cp *= this.persistence;
		}
		return value;
	}
	,__class__: libnoise_generator_Perlin
});
var model_GROWTYPE = $hxEnums["model.GROWTYPE"] = { __ename__:true,__constructs__:null
	,EMPTY: {_hx_name:"EMPTY",_hx_index:0,__enum__:"model.GROWTYPE",toString:$estr}
	,MARKET: {_hx_name:"MARKET",_hx_index:1,__enum__:"model.GROWTYPE",toString:$estr}
	,FARM: {_hx_name:"FARM",_hx_index:2,__enum__:"model.GROWTYPE",toString:$estr}
	,VILLAGE: {_hx_name:"VILLAGE",_hx_index:3,__enum__:"model.GROWTYPE",toString:$estr}
	,CITY: {_hx_name:"CITY",_hx_index:4,__enum__:"model.GROWTYPE",toString:$estr}
};
model_GROWTYPE.__constructs__ = [model_GROWTYPE.EMPTY,model_GROWTYPE.MARKET,model_GROWTYPE.FARM,model_GROWTYPE.VILLAGE,model_GROWTYPE.CITY];
var model_BUILDING = $hxEnums["model.BUILDING"] = { __ename__:true,__constructs__:null
	,MARKET: ($_=function(level) { return {_hx_index:0,level:level,__enum__:"model.BUILDING",toString:$estr}; },$_._hx_name="MARKET",$_.__params__ = ["level"],$_)
	,BANK: ($_=function(level) { return {_hx_index:1,level:level,__enum__:"model.BUILDING",toString:$estr}; },$_._hx_name="BANK",$_.__params__ = ["level"],$_)
	,FARM: ($_=function(level) { return {_hx_index:2,level:level,__enum__:"model.BUILDING",toString:$estr}; },$_._hx_name="FARM",$_.__params__ = ["level"],$_)
	,BARN: ($_=function(level) { return {_hx_index:3,level:level,__enum__:"model.BUILDING",toString:$estr}; },$_._hx_name="BARN",$_.__params__ = ["level"],$_)
	,BARRACKS: ($_=function(level) { return {_hx_index:4,level:level,__enum__:"model.BUILDING",toString:$estr}; },$_._hx_name="BARRACKS",$_.__params__ = ["level"],$_)
	,HOME: ($_=function(level) { return {_hx_index:5,level:level,__enum__:"model.BUILDING",toString:$estr}; },$_._hx_name="HOME",$_.__params__ = ["level"],$_)
	,WALL: ($_=function(level) { return {_hx_index:6,level:level,__enum__:"model.BUILDING",toString:$estr}; },$_._hx_name="WALL",$_.__params__ = ["level"],$_)
	,EXPLORE: ($_=function(level) { return {_hx_index:7,level:level,__enum__:"model.BUILDING",toString:$estr}; },$_._hx_name="EXPLORE",$_.__params__ = ["level"],$_)
};
model_BUILDING.__constructs__ = [model_BUILDING.MARKET,model_BUILDING.BANK,model_BUILDING.FARM,model_BUILDING.BARN,model_BUILDING.BARRACKS,model_BUILDING.HOME,model_BUILDING.WALL,model_BUILDING.EXPLORE];
var model_GridGenerator = function() {
	this.gridNames = ["滴島","通河","貸鄉","樹莊","商區","富州","翅坊","東鎮","蹄堡","雷省","扔山","握港","通鄉","佩府","乏坡","社觀","誕壩","鐮莊","綱莊","悠路","緒港","客湖","喚坊","啄山","組省","震村","山山","嫁河","寸壩","暢縣","鴉峰","乏州","壓村","灑島","忍崖","睬觀","斥城","波峰","溫郡","驟鎮","療省","喝省","生道","緞坊","半鄉","蒼崖","棵島","序巷","岔島","遙鎮","醬觀","拌鎮","殼湖","致谷","扇崖","信坊","竿島","徒鎮","務港","廳鄉"];
};
$hxClasses["model.GridGenerator"] = model_GridGenerator;
model_GridGenerator.__name__ = "model.GridGenerator";
model_GridGenerator.getInst = function() {
	return model_GridGenerator.inst;
};
model_GridGenerator.prototype = {
	getGrid: function() {
		return { id : 0, name : "", landType : 0, buildtype : model_GROWTYPE.EMPTY, height : 0, attachs : [], belongPlayerId : null, value : 0, money : 100, moneyGrow : 0.0, food : 100, foodGrow : 0.0, army : 100, armyGrow : 0.0, people : [], favor : [0,0,0,0], strategys : [[],[],[],[]], treasures : [], maxMoney : 0, maxFood : 0, maxArmy : 0};
	}
	,gridNames: null
	,getGrids: function(count,isLimitBuilding,type) {
		var getRandomRange = function(range,offset) {
			return Math.random() * range + offset;
		};
		var randomStart = Math.floor(Math.random() * 100);
		var grids = [];
		var _g = 0;
		var _g1 = count;
		while(_g < _g1) {
			var i = _g++;
			var height = this.getHeight(i);
			var g = this.getGrid();
			g.id = i;
			g.name = g.id + this.gridNames[(i + randomStart) % this.gridNames.length];
			g.landType = [0,0,1,1,1,1,2,2,3,3][Math.floor(height * 10)];
			var buildtype = [model_GROWTYPE.EMPTY,model_GROWTYPE.EMPTY,model_GROWTYPE.EMPTY,model_GROWTYPE.FARM,model_GROWTYPE.MARKET,model_GROWTYPE.VILLAGE,model_GROWTYPE.FARM,model_GROWTYPE.MARKET,model_GROWTYPE.VILLAGE,model_GROWTYPE.CITY][Math.floor(Math.random() * 10)];
			switch(buildtype._hx_index) {
			case 0:
				break;
			case 1:
				if(isLimitBuilding) {
					g.attachs = [model_BUILDING.MARKET(1),model_BUILDING.BANK(0),model_BUILDING.WALL(0)];
				} else {
					g.attachs = [model_BUILDING.MARKET(1),model_BUILDING.BANK(0),model_BUILDING.FARM(0),model_BUILDING.BARN(0),model_BUILDING.BARRACKS(0),model_BUILDING.HOME(0),model_BUILDING.EXPLORE(0),model_BUILDING.WALL(0)];
				}
				g.maxArmy = g.maxFood = g.maxMoney = 500;
				break;
			case 2:
				if(isLimitBuilding) {
					g.attachs = [model_BUILDING.FARM(1),model_BUILDING.BARN(0),model_BUILDING.WALL(0)];
				} else {
					g.attachs = [model_BUILDING.MARKET(0),model_BUILDING.BANK(0),model_BUILDING.FARM(1),model_BUILDING.BARN(0),model_BUILDING.BARRACKS(0),model_BUILDING.HOME(0),model_BUILDING.EXPLORE(0),model_BUILDING.WALL(0)];
				}
				g.maxArmy = g.maxFood = g.maxMoney = 500;
				break;
			case 3:
				if(isLimitBuilding) {
					g.attachs = [model_BUILDING.BARRACKS(1),model_BUILDING.HOME(0),model_BUILDING.WALL(0)];
				} else {
					g.attachs = [model_BUILDING.MARKET(0),model_BUILDING.BANK(0),model_BUILDING.FARM(0),model_BUILDING.BARN(0),model_BUILDING.BARRACKS(1),model_BUILDING.HOME(0),model_BUILDING.EXPLORE(0),model_BUILDING.WALL(0)];
				}
				g.maxArmy = g.maxFood = g.maxMoney = 500;
				break;
			case 4:
				g.attachs = [model_BUILDING.MARKET(1),model_BUILDING.BANK(0),model_BUILDING.FARM(1),model_BUILDING.BARN(0),model_BUILDING.BARRACKS(1),model_BUILDING.HOME(0),model_BUILDING.EXPLORE(0),model_BUILDING.WALL(0)];
				g.maxArmy = g.maxFood = g.maxMoney = 700;
				break;
			}
			var basicArmy = getRandomRange(180,80);
			g.moneyGrow = Math.random() * 0.01;
			g.foodGrow = Math.random() * 0.01;
			g.armyGrow = Math.random() * 0.01;
			g.army = basicArmy;
			switch(buildtype._hx_index) {
			case 0:
				g.money = 0;
				g.army = 0;
				g.food = 0;
				g.moneyGrow = 0;
				g.foodGrow = 0;
				g.armyGrow = 0;
				g.people.push(model_PeopleGenerator.getInst().generate(type));
				if(Math.random() < .3) {
					g.treasures.push(model_TreasureGenerator.getInst().generator());
				}
				if(Math.random() < .3) {
					g.treasures.push(model_TreasureGenerator.getInst().generator());
				}
				if(Math.random() < .3) {
					g.treasures.push(model_TreasureGenerator.getInst().generator());
				}
				if(Math.random() < .3) {
					g.treasures.push(model_TreasureGenerator.getInst().generator());
				}
				if(Math.random() < .3) {
					g.treasures.push(model_TreasureGenerator.getInst().generator());
				}
				break;
			case 1:
				g.money = getRandomRange(180,80);
				g.food = getRandomRange(180,80);
				g.money *= 1.5;
				g.people.push(model_PeopleGenerator.getInst().generate(type));
				break;
			case 2:
				g.money = getRandomRange(180,80);
				g.food = getRandomRange(180,80);
				g.food *= 1.5;
				g.people.push(model_PeopleGenerator.getInst().generate(type));
				break;
			case 3:
				g.money = getRandomRange(180,80);
				g.food = getRandomRange(180,80);
				g.army *= 1.5;
				g.people.push(model_PeopleGenerator.getInst().generate(type));
				break;
			case 4:
				g.money = getRandomRange(180,80);
				g.food = getRandomRange(180,80);
				g.money *= 1.5;
				g.food *= 1.5;
				g.army *= 1.5;
				g.people.push(model_PeopleGenerator.getInst().generate(type));
				break;
			}
			g.height = height;
			grids.push(g);
		}
		return grids;
	}
	,getHeight: function(x,y,z) {
		if(z == null) {
			z = 0;
		}
		if(y == null) {
			y = 0;
		}
		if(x == null) {
			x = 0;
		}
		var noise = new libnoise_generator_Perlin(.1,2,.5,16,0,libnoise_QualityMode.HIGH);
		return (noise.getValue(x,y,z) + 1) / 2;
	}
	,__class__: model_GridGenerator
};
var model_ActionInfoID = $hxEnums["model.ActionInfoID"] = { __ename__:true,__constructs__:null
	,MOVE: {_hx_name:"MOVE",_hx_index:0,__enum__:"model.ActionInfoID",toString:$estr}
	,STRATEGY: {_hx_name:"STRATEGY",_hx_index:1,__enum__:"model.ActionInfoID",toString:$estr}
	,TREASURE: {_hx_name:"TREASURE",_hx_index:2,__enum__:"model.ActionInfoID",toString:$estr}
	,TREASURE_TAKE: {_hx_name:"TREASURE_TAKE",_hx_index:3,__enum__:"model.ActionInfoID",toString:$estr}
	,FIRE: {_hx_name:"FIRE",_hx_index:4,__enum__:"model.ActionInfoID",toString:$estr}
	,BREAK: {_hx_name:"BREAK",_hx_index:5,__enum__:"model.ActionInfoID",toString:$estr}
	,CUTPATH: {_hx_name:"CUTPATH",_hx_index:6,__enum__:"model.ActionInfoID",toString:$estr}
	,NEGOTIATE: {_hx_name:"NEGOTIATE",_hx_index:7,__enum__:"model.ActionInfoID",toString:$estr}
	,PK: {_hx_name:"PK",_hx_index:8,__enum__:"model.ActionInfoID",toString:$estr}
	,SNATCH: {_hx_name:"SNATCH",_hx_index:9,__enum__:"model.ActionInfoID",toString:$estr}
	,OCCUPATION: {_hx_name:"OCCUPATION",_hx_index:10,__enum__:"model.ActionInfoID",toString:$estr}
	,SETTLE: {_hx_name:"SETTLE",_hx_index:11,__enum__:"model.ActionInfoID",toString:$estr}
	,CAMP: {_hx_name:"CAMP",_hx_index:12,__enum__:"model.ActionInfoID",toString:$estr}
	,PRACTICE: {_hx_name:"PRACTICE",_hx_index:13,__enum__:"model.ActionInfoID",toString:$estr}
	,HIRE: {_hx_name:"HIRE",_hx_index:14,__enum__:"model.ActionInfoID",toString:$estr}
	,EXPLORE: {_hx_name:"EXPLORE",_hx_index:15,__enum__:"model.ActionInfoID",toString:$estr}
	,PAY_FOR_FUN: {_hx_name:"PAY_FOR_FUN",_hx_index:16,__enum__:"model.ActionInfoID",toString:$estr}
	,EARN_MONEY: {_hx_name:"EARN_MONEY",_hx_index:17,__enum__:"model.ActionInfoID",toString:$estr}
	,BUY_FOOD: {_hx_name:"BUY_FOOD",_hx_index:18,__enum__:"model.ActionInfoID",toString:$estr}
	,SELL_FOOD: {_hx_name:"SELL_FOOD",_hx_index:19,__enum__:"model.ActionInfoID",toString:$estr}
	,BUY_ARMY: {_hx_name:"BUY_ARMY",_hx_index:20,__enum__:"model.ActionInfoID",toString:$estr}
	,SELL_ARMY: {_hx_name:"SELL_ARMY",_hx_index:21,__enum__:"model.ActionInfoID",toString:$estr}
	,TRANSFER: {_hx_name:"TRANSFER",_hx_index:22,__enum__:"model.ActionInfoID",toString:$estr}
	,BUILD: {_hx_name:"BUILD",_hx_index:23,__enum__:"model.ActionInfoID",toString:$estr}
	,END: {_hx_name:"END",_hx_index:24,__enum__:"model.ActionInfoID",toString:$estr}
};
model_ActionInfoID.__constructs__ = [model_ActionInfoID.MOVE,model_ActionInfoID.STRATEGY,model_ActionInfoID.TREASURE,model_ActionInfoID.TREASURE_TAKE,model_ActionInfoID.FIRE,model_ActionInfoID.BREAK,model_ActionInfoID.CUTPATH,model_ActionInfoID.NEGOTIATE,model_ActionInfoID.PK,model_ActionInfoID.SNATCH,model_ActionInfoID.OCCUPATION,model_ActionInfoID.SETTLE,model_ActionInfoID.CAMP,model_ActionInfoID.PRACTICE,model_ActionInfoID.HIRE,model_ActionInfoID.EXPLORE,model_ActionInfoID.PAY_FOR_FUN,model_ActionInfoID.EARN_MONEY,model_ActionInfoID.BUY_FOOD,model_ActionInfoID.SELL_FOOD,model_ActionInfoID.BUY_ARMY,model_ActionInfoID.SELL_ARMY,model_ActionInfoID.TRANSFER,model_ActionInfoID.BUILD,model_ActionInfoID.END];
var model_EventInfoID = $hxEnums["model.EventInfoID"] = { __ename__:true,__constructs__:null
	,WALK_STOP: {_hx_name:"WALK_STOP",_hx_index:0,__enum__:"model.EventInfoID",toString:$estr}
	,NEGOTIATE_RESULT: {_hx_name:"NEGOTIATE_RESULT",_hx_index:1,__enum__:"model.EventInfoID",toString:$estr}
	,EXPLORE_RESULT: {_hx_name:"EXPLORE_RESULT",_hx_index:2,__enum__:"model.EventInfoID",toString:$estr}
	,FIND_TREASURE_RESULT: {_hx_name:"FIND_TREASURE_RESULT",_hx_index:3,__enum__:"model.EventInfoID",toString:$estr}
	,HIRE_RESULT: {_hx_name:"HIRE_RESULT",_hx_index:4,__enum__:"model.EventInfoID",toString:$estr}
	,FIRE_RESULT: {_hx_name:"FIRE_RESULT",_hx_index:5,__enum__:"model.EventInfoID",toString:$estr}
	,WAR_RESULT: {_hx_name:"WAR_RESULT",_hx_index:6,__enum__:"model.EventInfoID",toString:$estr}
	,SNATCH_RESULT: {_hx_name:"SNATCH_RESULT",_hx_index:7,__enum__:"model.EventInfoID",toString:$estr}
	,RESOURCE_RESULT: {_hx_name:"RESOURCE_RESULT",_hx_index:8,__enum__:"model.EventInfoID",toString:$estr}
	,STRATEGY_RESULT: {_hx_name:"STRATEGY_RESULT",_hx_index:9,__enum__:"model.EventInfoID",toString:$estr}
	,BUILDING_RESULT: {_hx_name:"BUILDING_RESULT",_hx_index:10,__enum__:"model.EventInfoID",toString:$estr}
	,COST_FOR_BONUS_RESULT: {_hx_name:"COST_FOR_BONUS_RESULT",_hx_index:11,__enum__:"model.EventInfoID",toString:$estr}
	,PK_RESULT: {_hx_name:"PK_RESULT",_hx_index:12,__enum__:"model.EventInfoID",toString:$estr}
	,WORLD_EVENT: {_hx_name:"WORLD_EVENT",_hx_index:13,__enum__:"model.EventInfoID",toString:$estr}
	,GRID_BORN_EVENT: {_hx_name:"GRID_BORN_EVENT",_hx_index:14,__enum__:"model.EventInfoID",toString:$estr}
	,GRID_RESOURCE_EVENT: {_hx_name:"GRID_RESOURCE_EVENT",_hx_index:15,__enum__:"model.EventInfoID",toString:$estr}
	,PEOPLE_LEVEL_UP_EVENT: {_hx_name:"PEOPLE_LEVEL_UP_EVENT",_hx_index:16,__enum__:"model.EventInfoID",toString:$estr}
	,PAY_FOR_OVER_ENEMY_GRID: {_hx_name:"PAY_FOR_OVER_ENEMY_GRID",_hx_index:17,__enum__:"model.EventInfoID",toString:$estr}
	,ANIMATION_EVENT: {_hx_name:"ANIMATION_EVENT",_hx_index:18,__enum__:"model.EventInfoID",toString:$estr}
	,MESSAGE_EVENT: {_hx_name:"MESSAGE_EVENT",_hx_index:19,__enum__:"model.EventInfoID",toString:$estr}
	,PLAYER_LOSE: {_hx_name:"PLAYER_LOSE",_hx_index:20,__enum__:"model.EventInfoID",toString:$estr}
	,PLAYER_WIN: {_hx_name:"PLAYER_WIN",_hx_index:21,__enum__:"model.EventInfoID",toString:$estr}
	,SETTLE_RESULT: {_hx_name:"SETTLE_RESULT",_hx_index:22,__enum__:"model.EventInfoID",toString:$estr}
};
model_EventInfoID.__constructs__ = [model_EventInfoID.WALK_STOP,model_EventInfoID.NEGOTIATE_RESULT,model_EventInfoID.EXPLORE_RESULT,model_EventInfoID.FIND_TREASURE_RESULT,model_EventInfoID.HIRE_RESULT,model_EventInfoID.FIRE_RESULT,model_EventInfoID.WAR_RESULT,model_EventInfoID.SNATCH_RESULT,model_EventInfoID.RESOURCE_RESULT,model_EventInfoID.STRATEGY_RESULT,model_EventInfoID.BUILDING_RESULT,model_EventInfoID.COST_FOR_BONUS_RESULT,model_EventInfoID.PK_RESULT,model_EventInfoID.WORLD_EVENT,model_EventInfoID.GRID_BORN_EVENT,model_EventInfoID.GRID_RESOURCE_EVENT,model_EventInfoID.PEOPLE_LEVEL_UP_EVENT,model_EventInfoID.PAY_FOR_OVER_ENEMY_GRID,model_EventInfoID.ANIMATION_EVENT,model_EventInfoID.MESSAGE_EVENT,model_EventInfoID.PLAYER_LOSE,model_EventInfoID.PLAYER_WIN,model_EventInfoID.SETTLE_RESULT];
var model_MARKET = $hxEnums["model.MARKET"] = { __ename__:true,__constructs__:null
	,BUY: {_hx_name:"BUY",_hx_index:0,__enum__:"model.MARKET",toString:$estr}
	,SELL: {_hx_name:"SELL",_hx_index:1,__enum__:"model.MARKET",toString:$estr}
};
model_MARKET.__constructs__ = [model_MARKET.BUY,model_MARKET.SELL];
var model_RESOURCE = $hxEnums["model.RESOURCE"] = { __ename__:true,__constructs__:null
	,MONEY: {_hx_name:"MONEY",_hx_index:0,__enum__:"model.RESOURCE",toString:$estr}
	,FOOD: {_hx_name:"FOOD",_hx_index:1,__enum__:"model.RESOURCE",toString:$estr}
	,ARMY: {_hx_name:"ARMY",_hx_index:2,__enum__:"model.RESOURCE",toString:$estr}
	,STRETEGY: {_hx_name:"STRETEGY",_hx_index:3,__enum__:"model.RESOURCE",toString:$estr}
};
model_RESOURCE.__constructs__ = [model_RESOURCE.MONEY,model_RESOURCE.FOOD,model_RESOURCE.ARMY,model_RESOURCE.STRETEGY];
var model_StrategyTargetType = $hxEnums["model.StrategyTargetType"] = { __ename__:true,__constructs__:null
	,SELF_PLAYER: {_hx_name:"SELF_PLAYER",_hx_index:0,__enum__:"model.StrategyTargetType",toString:$estr}
	,TARGET_PLAYER: {_hx_name:"TARGET_PLAYER",_hx_index:1,__enum__:"model.StrategyTargetType",toString:$estr}
	,SELF_PEOPLE: {_hx_name:"SELF_PEOPLE",_hx_index:2,__enum__:"model.StrategyTargetType",toString:$estr}
	,TARGET_PEOPLE: {_hx_name:"TARGET_PEOPLE",_hx_index:3,__enum__:"model.StrategyTargetType",toString:$estr}
	,SELF_GRID: {_hx_name:"SELF_GRID",_hx_index:4,__enum__:"model.StrategyTargetType",toString:$estr}
	,TARGET_GRID: {_hx_name:"TARGET_GRID",_hx_index:5,__enum__:"model.StrategyTargetType",toString:$estr}
};
model_StrategyTargetType.__constructs__ = [model_StrategyTargetType.SELF_PLAYER,model_StrategyTargetType.TARGET_PLAYER,model_StrategyTargetType.SELF_PEOPLE,model_StrategyTargetType.TARGET_PEOPLE,model_StrategyTargetType.SELF_GRID,model_StrategyTargetType.TARGET_GRID];
var model_IModel = function() { };
$hxClasses["model.IModel"] = model_IModel;
model_IModel.__name__ = "model.IModel";
model_IModel.__isInterface__ = true;
model_IModel.prototype = {
	gameStart: null
	,gameInfo: null
	,getPeople: null
	,playerDice: null
	,playerEnd: null
	,getPreResultOfFire: null
	,takeFire: null
	,getTakeWarPreview: null
	,getPreResultOfWar: null
	,takeWarOn: null
	,getTakeSnatchPreview: null
	,getPreResultOfSnatch: null
	,takeSnatchOn: null
	,getTakeNegoPreview: null
	,getPreResultOfNego: null
	,takeNegoOn: null
	,getTakeHirePreview: null
	,getPreResultOfHire: null
	,takeHire: null
	,getTakeExplorePreview: null
	,getPreResultOfExplore: null
	,takeExplore: null
	,getTakeResourcePreview: null
	,getPreResultOfResource: null
	,takeResource: null
	,checkValidTransfer: null
	,takeTransfer: null
	,getStrategyRate: null
	,takeStrategy: null
	,takeBuilding: null
	,getResultOfCost: null
	,takeCostForBonus: null
	,save: null
	,load: null
	,getPreResultOfPk: null
	,takePk: null
	,getUnEquipResult: null
	,getEquipResult: null
	,takeEquip: null
	,takeUnEquip: null
	,getPeopleById: null
	,refresh: null
	,finishOneEvent: null
	,getPreResultOfSettle: null
	,takeSettle: null
	,__class__: model_IModel
};
var model_PeopleType = $hxEnums["model.PeopleType"] = { __ename__:true,__constructs__:null
	,WENGUAN: ($_=function(level) { return {_hx_index:0,level:level,__enum__:"model.PeopleType",toString:$estr}; },$_._hx_name="WENGUAN",$_.__params__ = ["level"],$_)
	,WUJIANG: ($_=function(level) { return {_hx_index:1,level:level,__enum__:"model.PeopleType",toString:$estr}; },$_._hx_name="WUJIANG",$_.__params__ = ["level"],$_)
	,PUTONG: {_hx_name:"PUTONG",_hx_index:2,__enum__:"model.PeopleType",toString:$estr}
	,QILIN: {_hx_name:"QILIN",_hx_index:3,__enum__:"model.PeopleType",toString:$estr}
};
model_PeopleType.__constructs__ = [model_PeopleType.WENGUAN,model_PeopleType.WUJIANG,model_PeopleType.PUTONG,model_PeopleType.QILIN];
var model_PeopleGenerator = function() {
	this.randomStart = Math.floor(Math.random() * 100);
	this.abiMaps = [[0,1,2,3,4,5,6,7,8,9,10,11,12],[0,1,2,6,8,9,10,11],[3,4,5,7,10,11,12],[0,1,2,3,4,5,6,7,8,9,10,11,12]];
	this.valuesName = { "command" : "統率", "force" : "武力", "intelligence" : "智力", "political" : "政治", "charm" : "魅力"};
	this.abilitiesName = ["0槍將","1弓將","2騎將","3妙計","4商才","5務農","6教導","7良官","8監視","9修補","10人脈","11徵兵","12鑒別"];
	this.valueMaps = [[[30,70],[30,70],[30,70],[30,70],[30,70]],[[60,95],[60,95],[30,70],[30,70],[60,95]],[[30,70],[30,70],[60,95],[60,95],[60,95]],[[60,95],[60,95],[60,95],[60,95],[60,95]]];
	this.names = ["白絲","傲萍","涵珍","訪蝶","映青","醉琴","涵萍","傲安","覓亦","向荷","曼桃","半南","思凡","新真","平凡","天彤","爾安","凌蕾","安春","訪雪","綺夏","香丹","問柳","懷嵐","曉海","雨荷","代桃","安秋","書蝶","向霜","雁青","靜曼","幻白","翠荷","依亦","雨天","靜曼","友藍","雁露","醉雲","寄曼","聽霜","丹芙","海曼","天竹","如夢","元曼","覓筠","飛芹","平雲","癡玉","盼青","依芙","紫凝","綠蘭","覓蓉","語凡","又筠","思寒","傲竹","冬蓉","尋風","翠南","凡珊","念筠","幻珍","覓霜","綺彤","雅露","平玉","幻雁","新絲","笑蘭","向琴","笑海","香卉","友陽","夢兒","冬蝶","以白","夏白","宛芹","癡露","初雙","夜春","元柏","妙雲","凌靈","涵翠","書旋","覓風","懷陽","曉荷","映筠","盼萱","沛真","巧薇","山翠","雪藍","醉露","慕易","靖風","憶晴","醉桃","凡旋","爾容","飛荷","香蕾","半雪","夜柏","千凡","靖煙","冰萱","寒安","映真","爾青","水藍","靜珊","冰玉","采陽","雪綠","綺晴","山晴","山丹","思波","傲煙","雅玉","綺藍","沛琴","如柔","醉梅","宛蝶","冷陽","懷柏","青寒","夏雲","翠珊","慕蕾","白柳","宛槐","醉云","元波","亦絲","青荷","寒雪","凝蘭","曉柳","香槐","綠梅","訪柏","詩波","小荷","巧容","幼海","幼山","友晴","丹菡","雁煙","爾安","爾玉","碧卉","凌松","初香","易竹","元易","之容","曼冬","懷之","笑瑤","綠楓","水波","妙松","丹秋","又旋","映竹","詩雙","飛蕾","千曼","笑蕊","千易","采萍","代陽","又竹","平瑤","寒嵐","南波","宛雪","雅蓮","夢霜","念芹","傲柔","雁霜","綠夏","訪曼","傲凡","映珍","夜竹","代柳","水南","翠巧"];
};
$hxClasses["model.PeopleGenerator"] = model_PeopleGenerator;
model_PeopleGenerator.__name__ = "model.PeopleGenerator";
model_PeopleGenerator.getInst = function() {
	if(model_PeopleGenerator.inst == null) {
		model_PeopleGenerator.inst = new model_PeopleGenerator();
	}
	return model_PeopleGenerator.inst;
};
model_PeopleGenerator.prototype = {
	names: null
	,valueMaps: null
	,abilitiesName: null
	,valuesName: null
	,abiMaps: null
	,getValue: function(map) {
		var low = map[0];
		var high = map[1];
		var diff = high - low;
		return Math.floor(Math.random() * diff + low);
	}
	,getAbiMap: function() {
		return this.abiMaps;
	}
	,getAbilityName: function(id) {
		return this.abilitiesName[id];
	}
	,getValueName: function(key) {
		return Reflect.field(this.valuesName,key);
	}
	,getPeopleTypeName: function(type) {
		switch(type._hx_index) {
		case 0:
			switch(type.level) {
			case 0:
				return "文官";
			case 1:
				return "尚書令*";
			case 2:
				return "少府*";
			case 3:
				return "廷尉*";
			case 4:
				return "衛尉*";
			case 5:
				return "太常*";
			case 6:
				return "丞相*";
			case 7:
				return "太尉*";
			case 8:
				return "大司馬*";
			case 9:
				return "太傅*";
			default:
				return "";
			}
			break;
		case 1:
			switch(type.level) {
			case 0:
				return "武將";
			case 1:
				return "都尉";
			case 2:
				return "中郎將";
			case 3:
				return "中領軍";
			case 4:
				return "偏將軍";
			case 5:
				return "四方將軍";
			case 6:
				return "衛將軍";
			case 7:
				return "車騎將軍";
			case 8:
				return "驃騎將軍";
			case 9:
				return "大將軍";
			default:
				return "";
			}
			break;
		case 2:
			return "普通";
		case 3:
			return "麒麟";
		}
	}
	,randomStart: null
	,generate: function(getType) {
		if(getType == null) {
			getType = -1;
		}
		var peopleId = Math.floor(new Date().getTime() + Math.random() * 9999);
		var name = this.names[(peopleId + this.randomStart) % this.names.length];
		var type = getType == -1 ? [0,0,0,0,0,1,1,2,2,3][Math.floor(Math.random() * 10)] : getType;
		var values = this.valueMaps[type];
		var genAbilitys = this.abiMaps[type];
		var skillCount = [1,2,2,3][type];
		skillCount = Math.ceil(Math.random() * skillCount);
		var abilities = new Set();
		while(abilities.length < skillCount) abilities.add(genAbilitys[Math.floor(Math.random() * genAbilitys.length)]);
		var abilitiesAry = [];
		var iter = abilities.iterator();
		while(iter.hasNext()) abilitiesAry.push(iter.next());
		var command = this.getValue(values[0]);
		var force = this.getValue(values[1]);
		var intelligence = this.getValue(values[2]);
		var political = this.getValue(values[3]);
		var charm = this.getValue(values[4]);
		var cost = Math.round(Math.pow(command + force + intelligence + political + charm + abilitiesAry.length * 30,3) / 100000);
		var tmp;
		switch(type) {
		case 0:
			tmp = model_PeopleType.PUTONG;
			break;
		case 1:
			tmp = model_PeopleType.WUJIANG(0);
			break;
		case 2:
			tmp = model_PeopleType.WENGUAN(0);
			break;
		case 3:
			tmp = model_PeopleType.QILIN;
			break;
		default:
			tmp = model_PeopleType.PUTONG;
		}
		return { id : peopleId, type : tmp, name : name, commandArmy : 100, command : command, force : force, intelligence : intelligence, political : political, charm : charm, cost : cost, abilities : abilitiesAry, energy : Math.floor(Math.random() * 15) + 80, gridId : null, exp : 0, sleep : false, treasures : []};
	}
	,__class__: model_PeopleGenerator
};
var model_TreasureGenerator = function() {
};
$hxClasses["model.TreasureGenerator"] = model_TreasureGenerator;
model_TreasureGenerator.__name__ = "model.TreasureGenerator";
model_TreasureGenerator.getInst = function() {
	return model_TreasureGenerator.inst;
};
model_TreasureGenerator.prototype = {
	generator: function() {
		var id = Math.floor(new Date().getTime() + Math.random() * 9999);
		var catelog = model_TreasureGenerator_treasureList[id % model_TreasureGenerator_treasureList.length];
		return { id : id, belongToPeopleId : 0, catelog : catelog};
	}
	,__class__: model_TreasureGenerator
};
var view_MainCalculatorView = function() {
	haxe_ui_containers_Box.call(this);
	haxe_ui_Toolkit.styleSheet.parse("\r\n        .button {\r\n            font-size: 14px;\r\n        }\r\n    ","user");
	var c0 = new haxe_ui_containers_Box();
	c0.set_width(1440.);
	c0.set_height(900.);
	c0.set_verticalAlign("center");
	c0.set_horizontalAlign("center");
	var c1 = new haxe_ui_containers_HBox();
	c1.set_percentWidth(100.);
	c1.set_percentHeight(100.);
	c1.set_padding(0);
	var c2 = new haxe_ui_containers_VBox();
	c2.set_percentWidth(100.);
	c2.set_percentHeight(100.);
	var c3 = new haxe_ui_components_Label();
	c3.set_id("lbl_gameInfo");
	c3.set_text("測試");
	c3.set_styleString("font-size:24");
	c2.addComponent(c3);
	var c4 = new haxe_ui_containers_HBox();
	c4.set_height(240.);
	c4.set_percentWidth(100.);
	var c5 = new haxe_ui_containers_Box();
	c5.set_id("stage");
	c5.set_width(800.);
	c5.set_percentHeight(100.);
	c5.set_styleString("background-color: white;border:1px solid grey;background-opacity: .3");
	var c6 = new haxe_ui_containers_Box();
	c6.set_id("box_grids");
	c6.set_percentWidth(100.);
	c6.set_percentHeight(100.);
	c5.addComponent(c6);
	var c7 = new haxe_ui_containers_Box();
	c7.set_id("box_stageFront");
	c7.set_percentWidth(100.);
	c7.set_percentHeight(100.);
	var c8 = new haxe_ui_containers_Box();
	c8.set_id("box_cursor");
	c8.set_width(80.);
	c8.set_height(80.);
	c8.set_styleString("background-color: purple;border:1px solid black;background-opacity: .5");
	c7.addComponent(c8);
	c5.addComponent(c7);
	var c9 = new haxe_ui_containers_Box();
	c9.set_id("box_players");
	c9.set_percentWidth(100.);
	c9.set_percentHeight(100.);
	c5.addComponent(c9);
	c4.addComponent(c5);
	var c10 = new haxe_ui_containers_VBox();
	c10.set_percentWidth(100.);
	c10.set_percentHeight(100.);
	var c11 = new haxe_ui_components_TabBar();
	c11.set_id("tab_whichInfo");
	c11.set_percentWidth(100.);
	var c12 = new haxe_ui_components_Button();
	c12.set_id("btn_totalInfo");
	c12.set_text("總資產");
	c12.set_icon(haxe_ui_util_Variant.fromString("haxeui-core/styles/default/haxeui_tiny.png"));
	c11.addComponent(c12);
	var c13 = new haxe_ui_components_Button();
	c13.set_id("btn_onlyPlayerInfo");
	c13.set_text("自身");
	c13.set_icon(haxe_ui_util_Variant.fromString("haxeui-core/styles/default/haxeui_tiny.png"));
	c11.addComponent(c13);
	var c14 = new haxe_ui_components_Button();
	c14.set_id("btn_onlyGridInfo");
	c14.set_text("城池");
	c14.set_icon(haxe_ui_util_Variant.fromString("haxeui-core/styles/default/haxeui_tiny.png"));
	c11.addComponent(c14);
	c10.addComponent(c11);
	var c15 = new haxe_ui_containers_TableView();
	c15.set_id("tab_allPlayers");
	c15.set_percentWidth(100.);
	c15.set_percentHeight(100.);
	var c16 = new haxe_ui_containers_Header();
	c16.set_percentWidth(100.);
	var c17 = new haxe_ui_components_Column();
	c17.set_id("score");
	c17.set_width(60.);
	c17.set_text("分");
	c16.addComponent(c17);
	var c18 = new haxe_ui_components_Column();
	c18.set_id("name");
	c18.set_percentWidth(100.);
	c18.set_text("名");
	c16.addComponent(c18);
	var c19 = new haxe_ui_components_Column();
	c19.set_id("money");
	c19.set_width(100.);
	c19.set_text("金");
	c16.addComponent(c19);
	var c20 = new haxe_ui_components_Column();
	c20.set_id("food");
	c20.set_width(100.);
	c20.set_text("糧");
	c16.addComponent(c20);
	var c21 = new haxe_ui_components_Column();
	c21.set_id("army");
	c21.set_width(100.);
	c21.set_text("兵");
	c16.addComponent(c21);
	var c22 = new haxe_ui_components_Column();
	c22.set_id("cityCount");
	c22.set_width(30.);
	c22.set_text("城");
	c16.addComponent(c22);
	var c23 = new haxe_ui_components_Column();
	c23.set_id("peopleCount");
	c23.set_width(30.);
	c23.set_text("將");
	c16.addComponent(c23);
	var c24 = new haxe_ui_components_Column();
	c24.set_id("treasureCount");
	c24.set_width(30.);
	c24.set_text("寶");
	c16.addComponent(c24);
	c15.addComponent(c16);
	c10.addComponent(c15);
	c4.addComponent(c10);
	c2.addComponent(c4);
	var c25 = new haxe_ui_containers_HBox();
	c25.set_percentWidth(100.);
	var c26 = new haxe_ui_containers_VBox();
	c26.set_percentWidth(100.);
	var c27 = new haxe_ui_containers_HBox();
	c27.set_percentWidth(100.);
	var c28 = new haxe_ui_containers_HBox();
	c28.set_id("box_playerView");
	c28.set_width(380.);
	c27.addComponent(c28);
	var c29 = new haxe_ui_containers_HBox();
	c29.set_id("box_playerPeopleList");
	c29.set_percentWidth(100.);
	c29.set_percentHeight(100.);
	c27.addComponent(c29);
	c26.addComponent(c27);
	var c30 = new haxe_ui_containers_HBox();
	c30.set_percentWidth(100.);
	var c31 = new haxe_ui_containers_HBox();
	c31.set_id("box_gridView");
	c31.set_width(380.);
	c30.addComponent(c31);
	var c32 = new haxe_ui_containers_HBox();
	c32.set_id("box_gridPeopleList");
	c32.set_percentWidth(100.);
	c32.set_percentHeight(100.);
	c30.addComponent(c32);
	c26.addComponent(c30);
	c25.addComponent(c26);
	c2.addComponent(c25);
	c1.addComponent(c2);
	var c33 = new haxe_ui_containers_VBox();
	c33.set_width(120.);
	c33.set_percentHeight(100.);
	var c34 = new haxe_ui_components_SectionHeader();
	c34.set_text("君主");
	c33.addComponent(c34);
	var c35 = new haxe_ui_components_Button();
	c35.set_id("btn_showStrategy");
	c35.set_percentWidth(100.);
	c35.set_text("計略");
	c33.addComponent(c35);
	var c36 = new haxe_ui_components_SectionHeader();
	c36.set_text("外交");
	c33.addComponent(c36);
	var c37 = new haxe_ui_components_Button();
	c37.set_id("btn_negotiate");
	c37.set_percentWidth(100.);
	c37.set_text("交涉");
	c33.addComponent(c37);
	var c38 = new haxe_ui_components_Button();
	c38.set_id("btn_pk");
	c38.set_percentWidth(100.);
	c38.set_text("號召");
	c33.addComponent(c38);
	var c39 = new haxe_ui_components_Button();
	c39.set_id("btn_snatch");
	c39.set_percentWidth(100.);
	c39.set_text("搶奪");
	c33.addComponent(c39);
	var c40 = new haxe_ui_components_Button();
	c40.set_id("btn_occupation");
	c40.set_percentWidth(100.);
	c40.set_text("攻城");
	c33.addComponent(c40);
	var c41 = new haxe_ui_components_SectionHeader();
	c41.set_text("交易");
	c33.addComponent(c41);
	var c42 = new haxe_ui_components_Button();
	c42.set_id("btn_earnMoney");
	c42.set_percentWidth(100.);
	c42.set_text("經商");
	c33.addComponent(c42);
	var c43 = new haxe_ui_components_Button();
	c43.set_id("btn_buyFood");
	c43.set_percentWidth(100.);
	c43.set_text("買糧");
	c33.addComponent(c43);
	var c44 = new haxe_ui_components_Button();
	c44.set_id("btn_sellFood");
	c44.set_percentWidth(100.);
	c44.set_text("賣糧");
	c33.addComponent(c44);
	var c45 = new haxe_ui_components_Button();
	c45.set_id("btn_buyArmy");
	c45.set_percentWidth(100.);
	c45.set_text("徵兵");
	c33.addComponent(c45);
	var c46 = new haxe_ui_components_Button();
	c46.set_id("btn_sellArmy");
	c46.set_percentWidth(100.);
	c46.set_text("裁兵");
	c33.addComponent(c46);
	var c47 = new haxe_ui_components_SectionHeader();
	c47.set_text("武將");
	c33.addComponent(c47);
	var c48 = new haxe_ui_components_Button();
	c48.set_id("btn_payForFun");
	c48.set_percentWidth(100.);
	c48.set_text("作樂");
	c33.addComponent(c48);
	var c49 = new haxe_ui_components_Button();
	c49.set_id("btn_camp");
	c49.set_percentWidth(100.);
	c49.set_text("札營");
	c33.addComponent(c49);
	var c50 = new haxe_ui_components_Button();
	c50.set_id("btn_practice");
	c50.set_percentWidth(100.);
	c50.set_text("練兵");
	c33.addComponent(c50);
	var c51 = new haxe_ui_components_Button();
	c51.set_id("btn_explore");
	c51.set_percentWidth(100.);
	c51.set_text("探索");
	c33.addComponent(c51);
	var c52 = new haxe_ui_components_Button();
	c52.set_id("btn_hire");
	c52.set_percentWidth(100.);
	c52.set_text("聘用");
	c33.addComponent(c52);
	c1.addComponent(c33);
	c0.addComponent(c1);
	var c53 = new haxe_ui_containers_Box();
	c53.set_id("box_popup");
	c53.set_percentWidth(100.);
	c53.set_percentHeight(100.);
	c53.set_styleString("background-color: grey;border:1px solid grey;background-opacity: .3");
	c0.addComponent(c53);
	this.addComponent(c0);
	this.set_percentWidth(100.);
	this.set_percentHeight(100.);
	this.bindingRoot = true;
	this.treasureCount = c24;
	this.tab_whichInfo = c11;
	this.tab_allPlayers = c15;
	this.stage = c5;
	this.score = c17;
	this.peopleCount = c23;
	this.name = c18;
	this.money = c19;
	this.lbl_gameInfo = c3;
	this.food = c20;
	this.cityCount = c22;
	this.btn_totalInfo = c12;
	this.btn_snatch = c39;
	this.btn_showStrategy = c35;
	this.btn_sellFood = c44;
	this.btn_sellArmy = c46;
	this.btn_practice = c50;
	this.btn_pk = c38;
	this.btn_payForFun = c48;
	this.btn_onlyPlayerInfo = c13;
	this.btn_onlyGridInfo = c14;
	this.btn_occupation = c40;
	this.btn_negotiate = c37;
	this.btn_hire = c52;
	this.btn_explore = c51;
	this.btn_earnMoney = c42;
	this.btn_camp = c49;
	this.btn_buyFood = c43;
	this.btn_buyArmy = c45;
	this.box_stageFront = c7;
	this.box_popup = c53;
	this.box_players = c9;
	this.box_playerView = c28;
	this.box_playerPeopleList = c29;
	this.box_grids = c6;
	this.box_gridView = c31;
	this.box_gridPeopleList = c32;
	this.box_cursor = c8;
	this.army = c21;
};
$hxClasses["view.MainCalculatorView"] = view_MainCalculatorView;
view_MainCalculatorView.__name__ = "view.MainCalculatorView";
view_MainCalculatorView.__super__ = haxe_ui_containers_Box;
view_MainCalculatorView.prototype = $extend(haxe_ui_containers_Box.prototype,{
	registerBehaviours: function() {
		haxe_ui_containers_Box.prototype.registerBehaviours.call(this);
	}
	,cloneComponent: function() {
		var c = haxe_ui_containers_Box.prototype.cloneComponent.call(this);
		if((this._children == null ? [] : this._children).length != (c._children == null ? [] : c._children).length) {
			var _g = 0;
			var _g1 = this._children == null ? [] : this._children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				c.addComponent(child.cloneComponent());
			}
		}
		return c;
	}
	,self: function() {
		return new view_MainCalculatorView();
	}
	,treasureCount: null
	,tab_whichInfo: null
	,tab_allPlayers: null
	,stage: null
	,score: null
	,peopleCount: null
	,name: null
	,money: null
	,lbl_gameInfo: null
	,food: null
	,cityCount: null
	,btn_totalInfo: null
	,btn_snatch: null
	,btn_showStrategy: null
	,btn_sellFood: null
	,btn_sellArmy: null
	,btn_practice: null
	,btn_pk: null
	,btn_payForFun: null
	,btn_onlyPlayerInfo: null
	,btn_onlyGridInfo: null
	,btn_occupation: null
	,btn_negotiate: null
	,btn_hire: null
	,btn_explore: null
	,btn_earnMoney: null
	,btn_camp: null
	,btn_buyFood: null
	,btn_buyArmy: null
	,box_stageFront: null
	,box_popup: null
	,box_players: null
	,box_playerView: null
	,box_playerPeopleList: null
	,box_grids: null
	,box_gridView: null
	,box_gridPeopleList: null
	,box_cursor: null
	,army: null
	,__class__: view_MainCalculatorView
});
function $getIterator(o) { if( o instanceof Array ) return new haxe_iterators_ArrayIterator(o); else return o.iterator(); }
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $global.$haxeUID++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = m.bind(o); o.hx__closures__[m.__id__] = f; } return f; }
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
haxe_ui_validation_ValidationManager.get_instance().registerEvent("ValidationStop",haxe_ui_backend_html5_HtmlUtils.onValidationStop);
js_Boot.__toStr = ({ }).toString;
haxe_Unserializer.DEFAULT_RESOLVER = new haxe__$Unserializer_DefaultResolver();
haxe_Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe_crypto_Base64.CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
haxe_crypto_Base64.BYTES = haxe_io_Bytes.ofString(haxe_crypto_Base64.CHARS);
haxe_ui_backend_BackendImpl.id = "html5";
haxe_ui_core_ComponentEvents.INTERACTIVE_EVENTS = ["mousemove","mouseover","mouseout","mousedown","mouseup","mousewheel","click","doubleclick","keydown","keyup"];
haxe_ui_core_ComponentBounds.__meta__ = { fields : { percentWidth : { clonable : null, bindable : null}, percentHeight : { clonable : null, bindable : null}, width : { bindable : null}, height : { bindable : null}}};
haxe_ui_backend_ComponentImpl.elementToComponent = new haxe_ds_ObjectMap();
haxe_ui_backend_ComponentImpl._stylesAdded = false;
haxe_ui_core_Component.__meta__ = { fields : { styleNames : { clonable : null}, styleString : { clonable : null}}};
haxe_ui_util_GenericConfig.cache = new haxe_ds_StringMap();
haxe_ui_Toolkit.styleSheet = new haxe_ui_styles_CompositeStyleSheet();
haxe_ui_Toolkit.properties = new haxe_ds_StringMap();
haxe_ui_Toolkit.nativeConfig = new haxe_ui_util_GenericConfig();
haxe_ui_Toolkit._theme = "default";
haxe_ui_Toolkit._backendProperties = new haxe_ui_util_Properties();
haxe_ui_Toolkit._built = false;
haxe_ui_Toolkit._backendBuilt = false;
haxe_ui_Toolkit._initialized = false;
haxe_ui_Toolkit.pixelsPerRem = 16;
haxe_ui_Toolkit.roundScale = true;
haxe_ui_Toolkit.autoScale = true;
haxe_ui_Toolkit._scaleX = 0;
haxe_ui_Toolkit._scaleY = 0;
haxe_ui_backend_PlatformBase.KEY_CODE_TAB = 9;
haxe_ui_backend_PlatformBase.KEY_CODE_UP = 38;
haxe_ui_backend_PlatformBase.KEY_CODE_DOWN = 40;
haxe_ui_backend_PlatformBase.KEY_CODE_LEFT = 37;
haxe_ui_backend_PlatformBase.KEY_CODE_RIGHT = 39;
haxe_ui_backend_PlatformBase.KEY_CODE_SPACE = 32;
haxe_ui_backend_PlatformBase.KEY_CODE_ENTER = 13;
haxe_ui_backend_PlatformBase.KEY_CODE_ESCAPE = 27;
haxe_ui_backend_PlatformImpl._vscrollWidth = -1;
haxe_ui_backend_PlatformImpl._hscrollHeight = -1;
haxe_ui_backend_html5_EventMapper.HAXEUI_TO_DOM = (function($this) {
	var $r;
	var _g = new haxe_ds_StringMap();
	_g.h["mousemove"] = "mousemove";
	_g.h["mouseover"] = "mouseover";
	_g.h["mouseout"] = "mouseout";
	_g.h["mousedown"] = "mousedown";
	_g.h["mouseup"] = "mouseup";
	_g.h["click"] = "click";
	_g.h["doubleclick"] = "dblclick";
	_g.h["rightmousedown"] = "mousedown";
	_g.h["rightmouseup"] = "mouseup";
	_g.h["rightclick"] = "contextmenu";
	_g.h["change"] = "change";
	_g.h["keydown"] = "keydown";
	_g.h["keyup"] = "keyup";
	_g.h["scrollchange"] = "scroll";
	$r = _g;
	return $r;
}(this));
haxe_ui_backend_html5_EventMapper.DOM_TO_HAXEUI = (function($this) {
	var $r;
	var _g = new haxe_ds_StringMap();
	_g.h["mousemove"] = "mousemove";
	_g.h["mouseover"] = "mouseover";
	_g.h["mouseout"] = "mouseout";
	_g.h["mousedown"] = "mousedown";
	_g.h["mouseup"] = "mouseup";
	_g.h["touchmove"] = "mousemove";
	_g.h["touchstart"] = "mousedown";
	_g.h["touchend"] = "mouseup";
	_g.h["click"] = "click";
	_g.h["contextmenu"] = "rightclick";
	_g.h["dblclick"] = "doubleclick";
	_g.h["change"] = "change";
	_g.h["keydown"] = "keydown";
	_g.h["keyup"] = "keyup";
	_g.h["scroll"] = "scrollchange";
	$r = _g;
	return $r;
}(this));
haxe_ui_backend_html5_EventMapper.MOUSE_TO_TOUCH = (function($this) {
	var $r;
	var _g = new haxe_ds_StringMap();
	_g.h["mousemove"] = "touchmove";
	_g.h["mousedown"] = "touchstart";
	_g.h["mouseup"] = "touchend";
	$r = _g;
	return $r;
}(this));
haxe_ui_backend_html5_EventMapper.TOUCH_TO_MOUSE = (function($this) {
	var $r;
	var _g = new haxe_ds_StringMap();
	_g.h["touchmove"] = "mousemove";
	_g.h["touchstart"] = "mouseout";
	_g.h["touchend"] = "mousedown";
	$r = _g;
	return $r;
}(this));
haxe_ui_backend_html5_HtmlUtils._dpi = 0;
haxe_ui_backend_html5_util_FontDetect._initialized = false;
haxe_ui_backend_html5_util_FontDetect._aFallbackFonts = ["serif","sans-serif","monospace","cursive","fantasy"];
haxe_ui_components__$TabBar_Builder.SCROLL_INCREMENT = 20;
haxe_ui_containers_ScrollViewEvents.INERTIAL_TIME_CONSTANT = 325;
haxe_ui_core_ItemRenderer.__meta__ = { fields : { allowHover : { clonable : null}}};
haxe_ui_core_Platform.METRIC_VSCROLL_WIDTH = "patform.metrics.vscroll.width";
haxe_ui_core_Platform.METRIC_HSCROLL_HEIGHT = "patform.metrics.hscroll.height";
haxe_ui_data_DataSource.regexAlpha = new EReg("[^a-zA-Z]","g");
haxe_ui_data_DataSource.regexNumeric = new EReg("[^0-9]","g");
haxe_ui_events_UIEvent.READY = "ready";
haxe_ui_events_UIEvent.DESTROY = "destroy";
haxe_ui_events_UIEvent.RESIZE = "resize";
haxe_ui_events_UIEvent.CHANGE = "change";
haxe_ui_events_UIEvent.BEFORE_CHANGE = "beforeChange";
haxe_ui_events_UIEvent.MOVE = "move";
haxe_ui_events_UIEvent.INITIALIZE = "initialize";
haxe_ui_events_UIEvent.RENDERER_CREATED = "rendererCreated";
haxe_ui_events_UIEvent.RENDERER_DESTROYED = "rendererDestroyed";
haxe_ui_events_UIEvent.HIDDEN = "hidden";
haxe_ui_events_UIEvent.SHOWN = "shown";
haxe_ui_events_UIEvent.ENABLED = "enabled";
haxe_ui_events_UIEvent.DISABLED = "disabled";
haxe_ui_events_UIEvent.BEFORE_CLOSE = "beforeClose";
haxe_ui_events_UIEvent.CLOSE = "close";
haxe_ui_events_UIEvent.PROPERTY_CHANGE = "propertyChange";
haxe_ui_events_UIEvent.COMPONENT_ADDED = "componentAdded";
haxe_ui_events_UIEvent.COMPONENT_REMOVED = "componentRemoved";
haxe_ui_events_ActionEvent.ACTION_START = "actionStart";
haxe_ui_events_ActionEvent.ACTION_END = "actionEnd";
haxe_ui_events_AnimationEvent.START = "animationstart";
haxe_ui_events_AnimationEvent.END = "animationend";
haxe_ui_events_DragEvent.DRAG_START = "dragStart";
haxe_ui_events_DragEvent.DRAG = "drag";
haxe_ui_events_DragEvent.DRAG_END = "dragEnd";
haxe_ui_events_FocusEvent.FOCUS_IN = "focusin";
haxe_ui_events_FocusEvent.FOCUS_OUT = "focusout";
haxe_ui_events_ItemEvent.COMPONENT_EVENT = "itemComponentEvent";
haxe_ui_events_KeyboardEvent.KEY_DOWN = "keydown";
haxe_ui_events_KeyboardEvent.KEY_PRESS = "keypress";
haxe_ui_events_KeyboardEvent.KEY_UP = "keyup";
haxe_ui_events_MouseEvent.MOUSE_MOVE = "mousemove";
haxe_ui_events_MouseEvent.MOUSE_OVER = "mouseover";
haxe_ui_events_MouseEvent.MOUSE_OUT = "mouseout";
haxe_ui_events_MouseEvent.MOUSE_DOWN = "mousedown";
haxe_ui_events_MouseEvent.MOUSE_UP = "mouseup";
haxe_ui_events_MouseEvent.MOUSE_WHEEL = "mousewheel";
haxe_ui_events_MouseEvent.CLICK = "click";
haxe_ui_events_MouseEvent.DBL_CLICK = "doubleclick";
haxe_ui_events_MouseEvent.RIGHT_CLICK = "rightclick";
haxe_ui_events_MouseEvent.RIGHT_MOUSE_DOWN = "rightmousedown";
haxe_ui_events_MouseEvent.RIGHT_MOUSE_UP = "rightmouseup";
haxe_ui_events_ScrollEvent.CHANGE = "scrollchange";
haxe_ui_events_ScrollEvent.START = "scrollstart";
haxe_ui_events_ScrollEvent.STOP = "scrollstop";
haxe_ui_events_SortEvent.SORT_CHANGED = "sortchanged";
haxe_ui_events_ThemeEvent.THEME_CHANGED = "themeChanged";
haxe_ui_events_ValidationEvent.START = "ValidationStart";
haxe_ui_events_ValidationEvent.STOP = "ValidationStop";
haxe_ui_locale_LocaleEvent.LOCALE_CHANGED = "localeChanged";
haxe_ui_locale_LocaleManager._registeredComponents = new haxe_ds_ObjectMap();
haxe_ui_styles_Parser.cssKeyframesRegex = new EReg("@keyframes\\s*(\\w+?)\\s*\\{([\\s\\S]*?\\}\\s*?)\\}","gi");
haxe_ui_styles_Parser.cssKeyframeSelectorRegex = new EReg("([\\w%]+)\\s*\\{\\s*([\\s\\S]*?)\\s*\\}","gi");
haxe_ui_styles_Parser.combinedCSSMediaRegex = new EReg("((\\s*?(?:/\\*[\\s\\S]*?\\*/)?\\s*?@media[\\s\\S]*?)\\{([\\s\\S]*?)\\}\\s*?\\})|(([\\s\\S]*?)\\{([\\s\\S]*?)\\})","gi");
haxe_ui_styles_Parser.cssCommentsRegex = new EReg("(/\\*[\\s\\S]*?\\*/)","gi");
haxe_ui_styles_Parser.cssImportStatementRegex = new EReg("@import .*?;","gi");
haxe_ui_styles_Parser.newlineRegex = new EReg("\n+","g");
haxe_ui_styles_ValueTools.timeEReg = new EReg("^(-?\\d+(?:\\.\\d+)?)(s|ms)$","gi");
haxe_ui_styles_ValueTools.colors = (function($this) {
	var $r;
	var _g = new haxe_ds_StringMap();
	_g.h["black"] = 0;
	_g.h["red"] = 16711680;
	_g.h["lime"] = 65280;
	_g.h["blue"] = 255;
	_g.h["white"] = 16777215;
	_g.h["aqua"] = 65535;
	_g.h["fuchsia"] = 16711935;
	_g.h["yellow"] = 16776960;
	_g.h["maroon"] = 8388608;
	_g.h["green"] = 32768;
	_g.h["navy"] = 128;
	_g.h["olive"] = 8421376;
	_g.h["purple"] = 8388736;
	_g.h["teal"] = 32896;
	_g.h["silver"] = 12632256;
	_g.h["gray"] = 8421504;
	_g.h["grey"] = 8421504;
	$r = _g;
	return $r;
}(this));
haxe_ui_styles_animation_AnimationOptions.DEFAULT_DURATION = 0;
haxe_ui_styles_animation_AnimationOptions.DEFAULT_DELAY = 0;
haxe_ui_styles_animation_AnimationOptions.DEFAULT_ITERATION_COUNT = 1;
haxe_ui_styles_animation_AnimationOptions.DEFAULT_EASING_FUNCTION = haxe_ui_styles_EasingFunction.EASE;
haxe_ui_styles_animation_AnimationOptions.DEFAULT_DIRECTION = "normal";
haxe_ui_styles_animation_AnimationOptions.DEFAULT_FILL_MODE = "forwards";
haxe_ui_themes_Theme.DEFAULT = "default";
haxe_ui_themes_Theme.DARK = "dark";
haxe_ui_tooltips_ToolTipManager.defaultDelay = 500;
haxe_ui_tooltips_ToolTipManager.fade = true;
haxe_ui_util_MathUtil.MAX_INT = 2147483647;
haxe_ui_util_MathUtil.MIN_INT = -2147483648;
haxe_ui_util_StyleUtil.style2ComponentEReg = new EReg("-(\\w)","g");
haxe_ui_util_StyleUtil.component2StyleEReg = new EReg("([A-Z])","g");
libnoise_Utils.SQRT3 = 1.7320508075688772935;
libnoise_Utils.OctavesMaximum = 30;
libnoise_Utils.Deg2Rad = 0.01745329251;
libnoise_Utils.GeneratorNoiseX = 1619;
libnoise_Utils.GeneratorNoiseY = 31337;
libnoise_Utils.GeneratorNoiseZ = 6971;
libnoise_Utils.GeneratorSeed = 1013;
libnoise_Utils.GeneratorShift = 8;
libnoise_Utils.Randoms = [-0.763874,-0.596439,-0.246489,0.0,0.396055,0.904518,-0.158073,0.0,-0.499004,-0.8665,-0.0131631,0.0,0.468724,-0.824756,0.316346,0.0,0.829598,0.43195,0.353816,0.0,-0.454473,0.629497,-0.630228,0.0,-0.162349,-0.869962,-0.465628,0.0,0.932805,0.253451,0.256198,0.0,-0.345419,0.927299,-0.144227,0.0,-0.715026,-0.293698,-0.634413,0.0,-0.245997,0.717467,-0.651711,0.0,-0.967409,-0.250435,-0.037451,0.0,0.901729,0.397108,-0.170852,0.0,0.892657,-0.0720622,-0.444938,0.0,0.0260084,-0.0361701,0.999007,0.0,0.949107,-0.19486,0.247439,0.0,0.471803,-0.807064,-0.355036,0.0,0.879737,0.141845,0.453809,0.0,0.570747,0.696415,0.435033,0.0,-0.141751,-0.988233,-0.0574584,0.0,-0.58219,-0.0303005,0.812488,0.0,-0.60922,0.239482,-0.755975,0.0,0.299394,-0.197066,-0.933557,0.0,-0.851615,-0.220702,-0.47544,0.0,0.848886,0.341829,-0.403169,0.0,-0.156129,-0.687241,0.709453,0.0,-0.665651,0.626724,0.405124,0.0,0.595914,-0.674582,0.43569,0.0,0.171025,-0.509292,0.843428,0.0,0.78605,0.536414,-0.307222,0.0,0.18905,-0.791613,0.581042,0.0,-0.294916,0.844994,0.446105,0.0,0.342031,-0.58736,-0.7335,0.0,0.57155,0.7869,0.232635,0.0,0.885026,-0.408223,0.223791,0.0,-0.789518,0.571645,0.223347,0.0,0.774571,0.31566,0.548087,0.0,-0.79695,-0.0433603,-0.602487,0.0,-0.142425,-0.473249,-0.869339,0.0,-0.0698838,0.170442,0.982886,0.0,0.687815,-0.484748,0.540306,0.0,0.543703,-0.534446,-0.647112,0.0,0.97186,0.184391,-0.146588,0.0,0.707084,0.485713,-0.513921,0.0,0.942302,0.331945,0.043348,0.0,0.499084,0.599922,0.625307,0.0,-0.289203,0.211107,0.9337,0.0,0.412433,-0.71667,-0.56239,0.0,0.87721,-0.082816,0.47291,0.0,-0.420685,-0.214278,0.881538,0.0,0.752558,-0.0391579,0.657361,0.0,0.0765725,-0.996789,0.0234082,0.0,-0.544312,-0.309435,-0.779727,0.0,-0.455358,-0.415572,0.787368,0.0,-0.874586,0.483746,0.0330131,0.0,0.245172,-0.0838623,0.965846,0.0,0.382293,-0.432813,0.81641,0.0,-0.287735,-0.905514,0.311853,0.0,-0.667704,0.704955,-0.239186,0.0,0.717885,-0.464002,-0.518983,0.0,0.976342,-0.214895,0.0240053,0.0,-0.0733096,-0.921136,0.382276,0.0,-0.986284,0.151224,-0.0661379,0.0,-0.899319,-0.429671,0.0812908,0.0,0.652102,-0.724625,0.222893,0.0,0.203761,0.458023,-0.865272,0.0,-0.030396,0.698724,-0.714745,0.0,-0.460232,0.839138,0.289887,0.0,-0.0898602,0.837894,0.538386,0.0,-0.731595,0.0793784,0.677102,0.0,-0.447236,-0.788397,0.422386,0.0,0.186481,0.645855,-0.740335,0.0,-0.259006,0.935463,0.240467,0.0,0.445839,0.819655,-0.359712,0.0,0.349962,0.755022,-0.554499,0.0,-0.997078,-0.0359577,0.0673977,0.0,-0.431163,-0.147516,-0.890133,0.0,0.299648,-0.63914,0.708316,0.0,0.397043,0.566526,-0.722084,0.0,-0.502489,0.438308,-0.745246,0.0,0.0687235,0.354097,0.93268,0.0,-0.0476651,-0.462597,0.885286,0.0,-0.221934,0.900739,-0.373383,0.0,-0.956107,-0.225676,0.186893,0.0,-0.187627,0.391487,-0.900852,0.0,-0.224209,-0.315405,0.92209,0.0,-0.730807,-0.537068,0.421283,0.0,-0.0353135,-0.816748,0.575913,0.0,-0.941391,0.176991,-0.287153,0.0,-0.154174,0.390458,0.90762,0.0,-0.283847,0.533842,0.796519,0.0,-0.482737,-0.850448,0.209052,0.0,-0.649175,0.477748,0.591886,0.0,0.885373,-0.405387,-0.227543,0.0,-0.147261,0.181623,-0.972279,0.0,0.0959236,-0.115847,-0.988624,0.0,-0.89724,-0.191348,0.397928,0.0,0.903553,-0.428461,-0.00350461,0.0,0.849072,-0.295807,-0.437693,0.0,0.65551,0.741754,-0.141804,0.0,0.61598,-0.178669,0.767232,0.0,0.0112967,0.932256,-0.361623,0.0,-0.793031,0.258012,0.551845,0.0,0.421933,0.454311,0.784585,0.0,-0.319993,0.0401618,-0.946568,0.0,-0.81571,0.551307,-0.175151,0.0,-0.377644,0.00322313,0.925945,0.0,0.129759,-0.666581,-0.734052,0.0,0.601901,-0.654237,-0.457919,0.0,-0.927463,-0.0343576,-0.372334,0.0,-0.438663,-0.868301,-0.231578,0.0,-0.648845,-0.749138,-0.133387,0.0,0.507393,-0.588294,0.629653,0.0,0.726958,0.623665,0.287358,0.0,0.411159,0.367614,-0.834151,0.0,0.806333,0.585117,-0.0864016,0.0,0.263935,-0.880876,0.392932,0.0,0.421546,-0.201336,0.884174,0.0,-0.683198,-0.569557,-0.456996,0.0,-0.117116,-0.0406654,-0.992285,0.0,-0.643679,-0.109196,-0.757465,0.0,-0.561559,-0.62989,0.536554,0.0,0.0628422,0.104677,-0.992519,0.0,0.480759,-0.2867,-0.828658,0.0,-0.228559,-0.228965,-0.946222,0.0,-0.10194,-0.65706,-0.746914,0.0,0.0689193,-0.678236,0.731605,0.0,0.401019,-0.754026,0.52022,0.0,-0.742141,0.547083,-0.387203,0.0,-0.00210603,-0.796417,-0.604745,0.0,0.296725,-0.409909,-0.862513,0.0,-0.260932,-0.798201,0.542945,0.0,-0.641628,0.742379,0.192838,0.0,-0.186009,-0.101514,0.97729,0.0,0.106711,-0.962067,0.251079,0.0,-0.743499,0.30988,-0.592607,0.0,-0.795853,-0.605066,-0.0226607,0.0,-0.828661,-0.419471,-0.370628,0.0,0.0847218,-0.489815,-0.8677,0.0,-0.381405,0.788019,-0.483276,0.0,0.282042,-0.953394,0.107205,0.0,0.530774,0.847413,0.0130696,0.0,0.0515397,0.922524,0.382484,0.0,-0.631467,-0.709046,0.313852,0.0,0.688248,0.517273,0.508668,0.0,0.646689,-0.333782,-0.685845,0.0,-0.932528,-0.247532,-0.262906,0.0,0.630609,0.68757,-0.359973,0.0,0.577805,-0.394189,0.714673,0.0,-0.887833,-0.437301,-0.14325,0.0,0.690982,0.174003,0.701617,0.0,-0.866701,0.0118182,0.498689,0.0,-0.482876,0.727143,0.487949,0.0,-0.577567,0.682593,-0.447752,0.0,0.373768,0.0982991,0.922299,0.0,0.170744,0.964243,-0.202687,0.0,0.993654,-0.035791,-0.106632,0.0,0.587065,0.4143,-0.695493,0.0,-0.396509,0.26509,-0.878924,0.0,-0.0866853,0.83553,-0.542563,0.0,0.923193,0.133398,-0.360443,0.0,0.00379108,-0.258618,0.965972,0.0,0.239144,0.245154,-0.939526,0.0,0.758731,-0.555871,0.33961,0.0,0.295355,0.309513,0.903862,0.0,0.0531222,-0.91003,-0.411124,0.0,0.270452,0.0229439,-0.96246,0.0,0.563634,0.0324352,0.825387,0.0,0.156326,0.147392,0.976646,0.0,-0.0410141,0.981824,0.185309,0.0,-0.385562,-0.576343,-0.720535,0.0,0.388281,0.904441,0.176702,0.0,0.945561,-0.192859,-0.262146,0.0,0.844504,0.520193,0.127325,0.0,0.0330893,0.999121,-0.0257505,0.0,-0.592616,-0.482475,-0.644999,0.0,0.539471,0.631024,-0.557476,0.0,0.655851,-0.027319,-0.754396,0.0,0.274465,0.887659,0.369772,0.0,-0.123419,0.975177,-0.183842,0.0,-0.223429,0.708045,0.66989,0.0,-0.908654,0.196302,0.368528,0.0,-0.95759,-0.00863708,0.288005,0.0,0.960535,0.030592,0.276472,0.0,-0.413146,0.907537,0.0754161,0.0,-0.847992,0.350849,-0.397259,0.0,0.614736,0.395841,0.68221,0.0,-0.503504,-0.666128,-0.550234,0.0,-0.268833,-0.738524,-0.618314,0.0,0.792737,-0.60001,-0.107502,0.0,-0.637582,0.508144,-0.579032,0.0,0.750105,0.282165,-0.598101,0.0,-0.351199,-0.392294,-0.850155,0.0,0.250126,-0.960993,-0.118025,0.0,-0.732341,0.680909,-0.0063274,0.0,-0.760674,-0.141009,0.633634,0.0,0.222823,-0.304012,0.926243,0.0,0.209178,0.505671,0.836984,0.0,0.757914,-0.56629,-0.323857,0.0,-0.782926,-0.339196,0.52151,0.0,-0.462952,0.585565,0.665424,0.0,0.61879,0.194119,-0.761194,0.0,0.741388,-0.276743,0.611357,0.0,0.707571,0.702621,0.0752872,0.0,0.156562,0.819977,0.550569,0.0,-0.793606,0.440216,0.42,0.0,0.234547,0.885309,-0.401517,0.0,0.132598,0.80115,-0.58359,0.0,-0.377899,-0.639179,0.669808,0.0,-0.865993,-0.396465,0.304748,0.0,-0.624815,-0.44283,0.643046,0.0,-0.485705,0.825614,-0.287146,0.0,-0.971788,0.175535,0.157529,0.0,-0.456027,0.392629,0.798675,0.0,-0.0104443,0.521623,-0.853112,0.0,-0.660575,-0.74519,0.091282,0.0,-0.0157698,-0.307475,-0.951425,0.0,-0.603467,-0.250192,0.757121,0.0,0.506876,0.25006,0.824952,0.0,0.255404,0.966794,0.00884498,0.0,0.466764,-0.874228,-0.133625,0.0,0.475077,-0.0682351,-0.877295,0.0,-0.224967,-0.938972,-0.260233,0.0,-0.377929,-0.814757,-0.439705,0.0,-0.305847,0.542333,-0.782517,0.0,0.26658,-0.902905,-0.337191,0.0,0.0275773,0.322158,-0.946284,0.0,0.0185422,0.716349,0.697496,0.0,-0.20483,0.978416,0.0273371,0.0,-0.898276,0.373969,0.230752,0.0,-0.00909378,0.546594,0.837349,0.0,0.6602,-0.751089,0.000959236,0.0,0.855301,-0.303056,0.420259,0.0,0.797138,0.0623013,-0.600574,0.0,0.48947,-0.866813,0.0951509,0.0,0.251142,0.674531,0.694216,0.0,-0.578422,-0.737373,-0.348867,0.0,-0.254689,-0.514807,0.818601,0.0,0.374972,0.761612,0.528529,0.0,0.640303,-0.734271,-0.225517,0.0,-0.638076,0.285527,0.715075,0.0,0.772956,-0.15984,-0.613995,0.0,0.798217,-0.590628,0.118356,0.0,-0.986276,-0.0578337,-0.154644,0.0,-0.312988,-0.94549,0.0899272,0.0,-0.497338,0.178325,0.849032,0.0,-0.101136,-0.981014,0.165477,0.0,-0.521688,0.0553434,-0.851339,0.0,-0.786182,-0.583814,0.202678,0.0,-0.565191,0.821858,-0.0714658,0.0,0.437895,0.152598,-0.885981,0.0,-0.92394,0.353436,-0.14635,0.0,0.212189,-0.815162,-0.538969,0.0,-0.859262,0.143405,-0.491024,0.0,0.991353,0.112814,0.0670273,0.0,0.0337884,-0.979891,-0.196654,0.0];
model_GridGenerator.inst = new model_GridGenerator();
var model_IModel_StrategyList = [{ id : 0, name : "暗渡陳艙", money : 5, intelligence : 70, describe : "可以指定移動1~3格數(無視路障)", targetType : model_StrategyTargetType.TARGET_GRID, value : { valid : [1,2,3], float : []}},{ id : 1, name : "步步為營", money : 30, intelligence : 30, describe : "指定武將回復30體力", targetType : model_StrategyTargetType.SELF_PEOPLE, value : { valid : [], float : [30]}},{ id : 2, name : "遠交近攻", money : 5, intelligence : 65, describe : "直接獲取該格子的10%資源。並且友好度上升1", targetType : model_StrategyTargetType.SELF_GRID, value : { valid : [], float : [0.1,1]}},{ id : 3, name : "緩兵之計", money : 40, intelligence : 30, describe : "指定自己前後3格當中的其中一格設置路障。走到那個格子的所以玩家會自動停下。然後路障消失", targetType : model_StrategyTargetType.TARGET_GRID, value : { valid : [-3,-2,-1,0,1,2,3], float : []}},{ id : 4, name : "火中取栗", money : 10, intelligence : 50, describe : "拆除指定自己後6格路障，如果那個路障是別的玩家，拿取那個玩家10金", targetType : model_StrategyTargetType.TARGET_GRID, value : { valid : [1,2,3,4,5,6], float : [10]}},{ id : 5, name : "趁虛而入", money : 40, intelligence : 50, describe : "指定武將體力-20", targetType : model_StrategyTargetType.TARGET_PEOPLE, value : { valid : [], float : [-20]}},{ id : 6, name : "按兵不動", money : 5, intelligence : 60, describe : "這回合不移動", targetType : model_StrategyTargetType.SELF_PLAYER, value : { valid : [], float : []}},{ id : 7, name : "急功近利", money : 30, intelligence : 40, describe : "指定玩家變賣50糧獲得50錢", targetType : model_StrategyTargetType.TARGET_PLAYER, value : { valid : [], float : [-50,50]}},{ id : 8, name : "五穀豐登", money : 5, intelligence : 90, describe : "所有自己城池的糧食+10%", targetType : model_StrategyTargetType.SELF_PLAYER, value : { valid : [], float : [0.1]}},{ id : 9, name : "無中生有", money : 5, intelligence : 75, describe : "金錢，糧草，士兵中較低的一個項目增加40~60", targetType : model_StrategyTargetType.SELF_PLAYER, value : { valid : [], float : [40,60]}},{ id : 10, name : "三顧茅廬", money : 400, intelligence : 50, describe : "需要有人脈的武將才可以使用這個計策。隨機獲得一個武將或者文官。", targetType : model_StrategyTargetType.SELF_PLAYER, value : { valid : [], float : [1]}},{ id : 11, name : "草船借箭", money : 400, intelligence : 50, describe : "需要有鑒別的武將才可以使用這個計策。隨機獲得一個寶物。", targetType : model_StrategyTargetType.SELF_PLAYER, value : { valid : [], float : [1]}},{ id : 12, name : "火計", money : 100, intelligence : 40, describe : "指定一個格子，那個格子的糧食資源-30%。", targetType : model_StrategyTargetType.TARGET_GRID, value : { valid : [-1,0,1], float : [-0.3]}},{ id : 13, name : "時來運轉", money : 5, intelligence : 80, describe : "指定一個格子，那個格子的所有資源+10%。", targetType : model_StrategyTargetType.TARGET_GRID, value : { valid : [-1,0,1], float : [0.1]}},{ id : 14, name : "攻其不備", money : 300, intelligence : 75, describe : "指定后三格中的有敵人城池的一個格子，角色會移動到那裏，并且獲得自己所有城池的20%資源。", targetType : model_StrategyTargetType.TARGET_GRID, value : { valid : [1,2,3], float : [0.2]}}];
var model_IModel_BuildingList = [{ id : 0, name : "農田(未建)", money : 70, describe : "糧食每回合+0", type : model_BUILDING.FARM(0), depends : []},{ id : 1, name : "農田(小)", money : 50, describe : "糧食每回合+3", type : model_BUILDING.FARM(1), depends : []},{ id : 2, name : "農田(中)", money : 50, describe : "糧食每回合+5", type : model_BUILDING.FARM(2), depends : []},{ id : 3, name : "農田(大)", money : 0, describe : "糧食每回合+7", type : model_BUILDING.FARM(3), depends : []},{ id : 4, name : "市集(未建)", money : 70, describe : "金錢每回合+0", type : model_BUILDING.MARKET(0), depends : []},{ id : 5, name : "市集(小)", money : 50, describe : "金錢每回合+3", type : model_BUILDING.MARKET(1), depends : []},{ id : 6, name : "市集(中)", money : 50, describe : "金錢每回合+5", type : model_BUILDING.MARKET(2), depends : []},{ id : 7, name : "市集(大)", money : 0, describe : "金錢每回合+7", type : model_BUILDING.MARKET(3), depends : []},{ id : 8, name : "兵營(未建)", money : 70, describe : "士兵每回合+0", type : model_BUILDING.BARRACKS(0), depends : []},{ id : 9, name : "兵營(小)", money : 50, describe : "士兵每回合+3", type : model_BUILDING.BARRACKS(1), depends : []},{ id : 10, name : "兵營(中)", money : 50, describe : "士兵每回合+5", type : model_BUILDING.BARRACKS(2), depends : []},{ id : 11, name : "兵營(大)", money : 0, describe : "士兵每回合+7", type : model_BUILDING.BARRACKS(3), depends : []},{ id : 12, name : "人材所(未建)", money : 50, describe : "提高武將在探索計算時的魅力(+0)及聘用計算時的魅力(+0)。所有武將的薪資不減少。並且聘用金錢不減少", type : model_BUILDING.EXPLORE(0), depends : []},{ id : 13, name : "人材所", money : 0, describe : "提高武將在探索計算時的魅力(+5)及聘用計算時的魅力(+5)。所有武將的薪資減為*0.8。並且聘用金錢減為*0.8", type : model_BUILDING.EXPLORE(1), depends : []},{ id : 14, name : "城墻(未建)", money : 50, describe : "此格子防禦方的加成提高。(+0%)", type : model_BUILDING.WALL(0), depends : []},{ id : 15, name : "城墻(弱)", money : 50, describe : "此格子防禦方的加成提高。(+20%)", type : model_BUILDING.WALL(1), depends : []},{ id : 16, name : "城墻(中)", money : 50, describe : "此格子防禦方的加成提高。(+35%)", type : model_BUILDING.WALL(2), depends : []},{ id : 17, name : "城墻(強)", money : 0, describe : "此格子防禦方的加成提高。(+50%)", type : model_BUILDING.WALL(3), depends : []},{ id : 18, name : "金庫(未建)", money : 200, describe : "金錢最大值+0。金錢每回合+0%", type : model_BUILDING.BANK(0), depends : []},{ id : 19, name : "金庫(小)", money : 100, describe : "金錢最大值+200。金錢每回合+1%", type : model_BUILDING.BANK(1), depends : []},{ id : 20, name : "金庫(中)", money : 100, describe : "金錢最大值+300。金錢每回合+2%", type : model_BUILDING.BANK(2), depends : []},{ id : 21, name : "金庫(大)", money : 0, describe : "金錢最大值+400。金錢每回合+3%", type : model_BUILDING.BANK(3), depends : []},{ id : 22, name : "穀倉(未建)", money : 200, describe : "糧草最大值+0。糧草每回合+0%", type : model_BUILDING.BARN(0), depends : []},{ id : 23, name : "穀倉(小)", money : 100, describe : "糧草最大值+200。糧草每回合+1%", type : model_BUILDING.BARN(1), depends : []},{ id : 24, name : "穀倉(中)", money : 100, describe : "糧草最大值+300。糧草每回合+2%", type : model_BUILDING.BARN(2), depends : []},{ id : 25, name : "穀倉(大)", money : 0, describe : "糧草最大值+400。糧草每回合+3%", type : model_BUILDING.BARN(3), depends : []},{ id : 26, name : "住房(未建)", money : 200, describe : "士兵最大值+0。士兵每回合+0%", type : model_BUILDING.HOME(0), depends : []},{ id : 27, name : "住房(小)", money : 100, describe : "士兵最大值+200。士兵每回合+1%", type : model_BUILDING.HOME(1), depends : []},{ id : 28, name : "住房(中)", money : 100, describe : "士兵最大值+300。士兵每回合+2%", type : model_BUILDING.HOME(2), depends : []},{ id : 29, name : "住房(大)", money : 0, describe : "士兵最大值+400。士兵每回合+3%", type : model_BUILDING.HOME(3), depends : []}];
model_TreasureGenerator.inst = new model_TreasureGenerator();
var model_TreasureGenerator_treasureList = [{ id : 0, name : "七星寶刀", command : 10, force : 5, intelligence : 0, political : 0, charm : 10, abilities : [], cost : 25},{ id : 1, name : "方天畫戟", command : 0, force : 10, intelligence : 0, political : 0, charm : 5, abilities : [0], cost : 25},{ id : 2, name : "青龍偃月刀", command : 0, force : 10, intelligence : 0, political : 0, charm : 5, abilities : [2], cost : 25},{ id : 3, name : "倚天之劍", command : 0, force : 10, intelligence : 0, political : 0, charm : 10, abilities : [], cost : 20},{ id : 4, name : "青釭之劍", command : 10, force : 0, intelligence : 0, political : 0, charm : 10, abilities : [], cost : 20},{ id : 5, name : "鐵脊蛇矛", command : 0, force : 10, intelligence : 0, political : 0, charm : 5, abilities : [], cost : 15},{ id : 6, name : "古錠刀", command : 5, force : 5, intelligence : 0, political : 0, charm : 5, abilities : [], cost : 15},{ id : 7, name : "鐵蒺藜骨朵", command : 0, force : 5, intelligence : 0, political : 0, charm : 5, abilities : [], cost : 10},{ id : 8, name : "眉尖刀", command : 5, force : 0, intelligence : 0, political : 0, charm : 5, abilities : [], cost : 10},{ id : 9, name : "飛刀", command : 0, force : 5, intelligence : 0, political : 0, charm : 0, abilities : [], cost : 5},{ id : 10, name : "袖箭", command : 5, force : 0, intelligence : 0, political : 0, charm : 0, abilities : [], cost : 5},{ id : 11, name : "西蜀地形圖", command : 0, force : 0, intelligence : 0, political : 0, charm : 15, abilities : [10], cost : 25},{ id : 12, name : "太平清領道", command : 5, force : 0, intelligence : 0, political : 0, charm : 10, abilities : [6], cost : 25},{ id : 13, name : "青囊書", command : 0, force : 0, intelligence : 5, political : 5, charm : 10, abilities : [], cost : 20},{ id : 14, name : "遁甲天書", command : 0, force : 0, intelligence : 10, political : 0, charm : 5, abilities : [3], cost : 25},{ id : 15, name : "孫子之兵法書", command : 10, force : 10, intelligence : 0, political : 0, charm : 5, abilities : [], cost : 25},{ id : 16, name : "兵法二十四編", command : 0, force : 0, intelligence : 5, political : 5, charm : 5, abilities : [0], cost : 25},{ id : 17, name : "詩經", command : 0, force : 0, intelligence : 5, political : 0, charm : 5, abilities : [], cost : 10},{ id : 18, name : "羅綺香囊", command : 0, force : 0, intelligence : 0, political : 0, charm : 15, abilities : [], cost : 15},{ id : 19, name : "青釉穀倉罐", command : 0, force : 0, intelligence : 5, political : 0, charm : 5, abilities : [5], cost : 20}];
MainCalculator.main();
})(typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);