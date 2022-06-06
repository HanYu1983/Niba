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
HxOverrides.now = function() {
	return Date.now();
};
var Main = function() { };
$hxClasses["Main"] = Main;
Main.__name__ = "Main";
Main.checkType = function(a) {
	var _g = Type.typeof(a);
	var tmp;
	switch(_g._hx_index) {
	case 1:
		tmp = "Int";
		break;
	case 3:
		tmp = "Bool";
		break;
	case 6:
		var cls = _g.c;
		tmp = Std.string(cls) + "";
		break;
	default:
		var other = _g;
		throw haxe_Exception.thrown("unhandled type " + Std.string(other));
	}
	console.log("src/Main.hx:10:",tmp);
};
Main.main = function() {
	var model = new han_Model();
	var robot1 = model.addRobot();
	var robot2 = model.addRobot();
	var pilot1 = model.addPilot();
	model.setPilot(robot1,pilot1);
	model.setPilot(robot2,pilot1);
	haxe_Serializer.USE_CACHE = true;
	var s = haxe_Serializer.run(model);
	console.log("src/Main.hx:29:",s);
	var model2 = haxe_Unserializer.run(s);
	console.log("src/Main.hx:31:",model2);
	var robot1 = model.getRobots()[0];
	var robot2 = model.getRobots()[1];
	var pilot1 = model.getPilots()[0];
	console.log("src/Main.hx:36:",robot1.getPilot() == robot2.getPilot());
	console.log("src/Main.hx:37:",robot1.getPilot() == pilot1);
	var robot1 = model2.addRobot();
	var robot2 = model2.addRobot();
	var pilot1 = model2.addPilot();
	model2.setPilot(robot1,pilot1);
	model2.setPilot(robot2,pilot1);
	console.log("src/Main.hx:46:",model2);
};
var Mat2 = {};
Mat2._new = function(a00,a01,a10,a11) {
	var this1 = new Mat2Data(a00,a01,a10,a11);
	return this1;
};
Mat2.set = function(this1,a00,a01,a10,a11) {
	var this2 = this1.c0;
	this2.x = a00;
	this2.y = a01;
	var this2 = this1.c1;
	this2.x = a10;
	this2.y = a11;
};
Mat2.copyFrom = function(this1,v) {
	var v1 = v;
	var self = this1.c0;
	var source = v1.c0;
	self.x = source.x;
	self.y = source.y;
	var self = this1.c1;
	var source = v1.c1;
	self.x = source.x;
	self.y = source.y;
	return this1;
};
Mat2.clone = function(this1) {
	var this2 = new Mat2Data(this1.c0.x,this1.c0.y,this1.c1.x,this1.c1.y);
	return this2;
};
Mat2.matrixCompMult = function(this1,n) {
	var n1 = n;
	var this2 = new Mat2Data(this1.c0.x * n1.c0.x,this1.c0.y * n1.c0.y,this1.c1.x * n1.c1.x,this1.c1.y * n1.c1.y);
	return this2;
};
Mat2.transpose = function(this1) {
	var this2 = new Mat2Data(this1.c0.x,this1.c1.x,this1.c0.y,this1.c1.y);
	return this2;
};
Mat2.determinant = function(this1) {
	var m = this1;
	return m.c0.x * m.c1.y - m.c1.x * m.c0.y;
};
Mat2.inverse = function(this1) {
	var m = this1;
	var m1 = this1;
	var f = 1.0 / (m1.c0.x * m1.c1.y - m1.c1.x * m1.c0.y);
	var this1 = new Mat2Data(m.c1.y * f,-m.c0.y * f,-m.c1.x * f,m.c0.x * f);
	return this1;
};
Mat2.adjoint = function(this1) {
	var m = this1;
	var this1 = new Mat2Data(m.c1.y,-m.c0.y,-m.c1.x,m.c0.x);
	return this1;
};
Mat2.toString = function(this1) {
	return "mat2(" + ("" + this1.c0.x + ", " + this1.c0.y + ", ") + ("" + this1.c1.x + ", " + this1.c1.y) + ")";
};
Mat2.arrayRead = function(this1,i) {
	switch(i) {
	case 0:
		return this1.c0;
	case 1:
		return this1.c1;
	default:
		return null;
	}
};
Mat2.arrayWrite = function(this1,i,v) {
	switch(i) {
	case 0:
		var self = this1.c0;
		var source = v;
		self.x = source.x;
		self.y = source.y;
		return self;
	case 1:
		var self = this1.c1;
		var source = v;
		self.x = source.x;
		self.y = source.y;
		return self;
	default:
		return null;
	}
};
Mat2.neg = function(m) {
	var m1 = m;
	var this1 = new Mat2Data(-m1.c0.x,-m1.c0.y,-m1.c1.x,-m1.c1.y);
	return this1;
};
Mat2.prefixIncrement = function(m) {
	var _m = m;
	_m.c0.x += 1;
	_m.c0.y += 1;
	_m.c1.x += 1;
	_m.c1.y += 1;
	var this1 = new Mat2Data(m.c0.x,m.c0.y,m.c1.x,m.c1.y);
	return this1;
};
Mat2.prefixDecrement = function(m) {
	var _m = m;
	_m.c0.x -= 1;
	_m.c0.y -= 1;
	_m.c1.x -= 1;
	_m.c1.y -= 1;
	var this1 = new Mat2Data(m.c0.x,m.c0.y,m.c1.x,m.c1.y);
	return this1;
};
Mat2.postfixIncrement = function(m) {
	var this1 = new Mat2Data(m.c0.x,m.c0.y,m.c1.x,m.c1.y);
	var ret = this1;
	var m1 = m;
	m1.c0.x += 1;
	m1.c0.y += 1;
	m1.c1.x += 1;
	m1.c1.y += 1;
	return ret;
};
Mat2.postfixDecrement = function(m) {
	var this1 = new Mat2Data(m.c0.x,m.c0.y,m.c1.x,m.c1.y);
	var ret = this1;
	var m1 = m;
	m1.c0.x -= 1;
	m1.c0.y -= 1;
	m1.c1.x -= 1;
	m1.c1.y -= 1;
	return ret;
};
Mat2.mulEq = function(a,b) {
	var m = a;
	var n = b;
	var source_x = m.c0.x * n.c0.x + m.c1.x * n.c0.y;
	var source_y = m.c0.y * n.c0.x + m.c1.y * n.c0.y;
	var source_x1 = m.c0.x * n.c1.x + m.c1.x * n.c1.y;
	var source_y1 = m.c0.y * n.c1.x + m.c1.y * n.c1.y;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	return a;
};
Mat2.mulEqScalar = function(a,f) {
	var m = a;
	var source_x = m.c0.x * f;
	var source_y = m.c0.y * f;
	var source_x1 = m.c1.x * f;
	var source_y1 = m.c1.y * f;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	return a;
};
Mat2.divEq = function(a,b) {
	var m = b;
	var n_c0_x = 1.0 / m.c0.x;
	var n_c0_y = 1.0 / m.c0.y;
	var n_c1_x = 1.0 / m.c1.x;
	var n_c1_y = 1.0 / m.c1.y;
	var source_x = a.c0.x * n_c0_x;
	var source_y = a.c0.y * n_c0_y;
	var source_x1 = a.c1.x * n_c1_x;
	var source_y1 = a.c1.y * n_c1_y;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	return a;
};
Mat2.divEqScalar = function(a,f) {
	var m = a;
	var source_x = m.c0.x / f;
	var source_y = m.c0.y / f;
	var source_x1 = m.c1.x / f;
	var source_y1 = m.c1.y / f;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	return a;
};
Mat2.addEq = function(a,b) {
	var m = a;
	var n = b;
	var source_x = m.c0.x + n.c0.x;
	var source_y = m.c0.y + n.c0.y;
	var source_x1 = m.c1.x + n.c1.x;
	var source_y1 = m.c1.y + n.c1.y;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	return a;
};
Mat2.addEqScalar = function(a,f) {
	var m = a;
	var source_x = m.c0.x + f;
	var source_y = m.c0.y + f;
	var source_x1 = m.c1.x + f;
	var source_y1 = m.c1.y + f;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	return a;
};
Mat2.subEq = function(a,b) {
	var m = a;
	var n = b;
	var source_x = m.c0.x - n.c0.x;
	var source_y = m.c0.y - n.c0.y;
	var source_x1 = m.c1.x - n.c1.x;
	var source_y1 = m.c1.y - n.c1.y;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	return a;
};
Mat2.subEqScalar = function(a,f) {
	var m = a;
	var source_x = m.c0.x - f;
	var source_y = m.c0.y - f;
	var source_x1 = m.c1.x - f;
	var source_y1 = m.c1.y - f;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	return a;
};
Mat2.add = function(m,n) {
	var m1 = m;
	var n1 = n;
	var this1 = new Mat2Data(m1.c0.x + n1.c0.x,m1.c0.y + n1.c0.y,m1.c1.x + n1.c1.x,m1.c1.y + n1.c1.y);
	return this1;
};
Mat2.addScalar = function(m,f) {
	var m1 = m;
	var this1 = new Mat2Data(m1.c0.x + f,m1.c0.y + f,m1.c1.x + f,m1.c1.y + f);
	return this1;
};
Mat2.sub = function(m,n) {
	var m1 = m;
	var n1 = n;
	var this1 = new Mat2Data(m1.c0.x - n1.c0.x,m1.c0.y - n1.c0.y,m1.c1.x - n1.c1.x,m1.c1.y - n1.c1.y);
	return this1;
};
Mat2.subScalar = function(m,f) {
	var m1 = m;
	var this1 = new Mat2Data(m1.c0.x - f,m1.c0.y - f,m1.c1.x - f,m1.c1.y - f);
	return this1;
};
Mat2.subScalarInv = function(f,m) {
	var m1 = m;
	var this1 = new Mat2Data(f - m1.c0.x,f - m1.c0.y,f - m1.c1.x,f - m1.c1.y);
	return this1;
};
Mat2.mul = function(m,n) {
	var m1 = m;
	var n1 = n;
	var this1 = new Mat2Data(m1.c0.x * n1.c0.x + m1.c1.x * n1.c0.y,m1.c0.y * n1.c0.x + m1.c1.y * n1.c0.y,m1.c0.x * n1.c1.x + m1.c1.x * n1.c1.y,m1.c0.y * n1.c1.x + m1.c1.y * n1.c1.y);
	return this1;
};
Mat2.postMulVec2 = function(m,v) {
	var m1 = m;
	var this1 = new Vec2Data(m1.c0.x * v.x + m1.c1.x * v.y,m1.c0.y * v.x + m1.c1.y * v.y);
	return this1;
};
Mat2.preMulVec2 = function(v,m) {
	var m1 = m;
	var b = m1.c0;
	var b1 = m1.c1;
	var this1 = new Vec2Data(v.x * b.x + v.y * b.y,v.x * b1.x + v.y * b1.y);
	return this1;
};
Mat2.mulScalar = function(m,f) {
	var m1 = m;
	var this1 = new Mat2Data(m1.c0.x * f,m1.c0.y * f,m1.c1.x * f,m1.c1.y * f);
	return this1;
};
Mat2.div = function(m,n) {
	var m1 = n;
	var n_c0_x = 1.0 / m1.c0.x;
	var n_c0_y = 1.0 / m1.c0.y;
	var n_c1_x = 1.0 / m1.c1.x;
	var n_c1_y = 1.0 / m1.c1.y;
	var this1 = new Mat2Data(m.c0.x * n_c0_x,m.c0.y * n_c0_y,m.c1.x * n_c1_x,m.c1.y * n_c1_y);
	return this1;
};
Mat2.divScalar = function(m,f) {
	var m1 = m;
	var this1 = new Mat2Data(m1.c0.x / f,m1.c0.y / f,m1.c1.x / f,m1.c1.y / f);
	return this1;
};
Mat2.divScalarInv = function(f,m) {
	var m1 = m;
	var this1 = new Mat2Data(f / m1.c0.x,f / m1.c0.y,f / m1.c1.x,f / m1.c1.y);
	return this1;
};
Mat2.equal = function(m,n) {
	var m1 = m;
	var n1 = n;
	var a = m1.c0;
	var b = n1.c0;
	if(a.x == b.x && a.y == b.y) {
		var a = m1.c1;
		var b = n1.c1;
		if(a.x == b.x) {
			return a.y == b.y;
		} else {
			return false;
		}
	} else {
		return false;
	}
};
Mat2.notEqual = function(m,n) {
	var m1 = m;
	var n1 = n;
	var tmp;
	var a = m1.c0;
	var b = n1.c0;
	if(a.x == b.x && a.y == b.y) {
		var a = m1.c1;
		var b = n1.c1;
		tmp = a.x == b.x && a.y == b.y;
	} else {
		tmp = false;
	}
	return !tmp;
};
var Mat2Data = function(a00,a01,a10,a11) {
	var this1 = new Vec2Data(a00,a01);
	this.c0 = this1;
	var this1 = new Vec2Data(a10,a11);
	this.c1 = this1;
};
$hxClasses["Mat2Data"] = Mat2Data;
Mat2Data.__name__ = "Mat2Data";
Mat2Data.prototype = {
	__class__: Mat2Data
};
var Mat3 = {};
Mat3._new = function(a00,a01,a02,a10,a11,a12,a20,a21,a22) {
	var this1 = new Mat3Data(a00,a01,a02,a10,a11,a12,a20,a21,a22);
	return this1;
};
Mat3.set = function(this1,a00,a01,a02,a10,a11,a12,a20,a21,a22) {
	var this2 = this1.c0;
	this2.x = a00;
	this2.y = a01;
	this2.z = a02;
	var this2 = this1.c1;
	this2.x = a10;
	this2.y = a11;
	this2.z = a12;
	var this2 = this1.c2;
	this2.x = a20;
	this2.y = a21;
	this2.z = a22;
};
Mat3.copyFrom = function(this1,v) {
	var v1 = v;
	var self = this1.c0;
	var source = v1.c0;
	self.x = source.x;
	self.y = source.y;
	self.z = source.z;
	var self = this1.c1;
	var source = v1.c1;
	self.x = source.x;
	self.y = source.y;
	self.z = source.z;
	var self = this1.c2;
	var source = v1.c2;
	self.x = source.x;
	self.y = source.y;
	self.z = source.z;
	return this1;
};
Mat3.clone = function(this1) {
	var this2 = new Mat3Data(this1.c0.x,this1.c0.y,this1.c0.z,this1.c1.x,this1.c1.y,this1.c1.z,this1.c2.x,this1.c2.y,this1.c2.z);
	return this2;
};
Mat3.matrixCompMult = function(this1,n) {
	var n1 = n;
	var this2 = new Mat3Data(this1.c0.x * n1.c0.x,this1.c0.y * n1.c0.y,this1.c0.z * n1.c0.z,this1.c1.x * n1.c1.x,this1.c1.y * n1.c1.y,this1.c1.z * n1.c1.z,this1.c2.x * n1.c2.x,this1.c2.y * n1.c2.y,this1.c2.z * n1.c2.z);
	return this2;
};
Mat3.transpose = function(this1) {
	var this2 = new Mat3Data(this1.c0.x,this1.c1.x,this1.c2.x,this1.c0.y,this1.c1.y,this1.c2.y,this1.c0.z,this1.c1.z,this1.c2.z);
	return this2;
};
Mat3.determinant = function(this1) {
	var m = this1;
	return m.c0.x * (m.c2.z * m.c1.y - m.c1.z * m.c2.y) + m.c0.y * (-m.c2.z * m.c1.x + m.c1.z * m.c2.x) + m.c0.z * (m.c2.y * m.c1.x - m.c1.y * m.c2.x);
};
Mat3.inverse = function(this1) {
	var m = this1;
	var b01 = m.c2.z * m.c1.y - m.c1.z * m.c2.y;
	var b11 = -m.c2.z * m.c1.x + m.c1.z * m.c2.x;
	var b21 = m.c2.y * m.c1.x - m.c1.y * m.c2.x;
	var det = m.c0.x * b01 + m.c0.y * b11 + m.c0.z * b21;
	var f = 1.0 / det;
	var this1 = new Mat3Data(b01 * f,(-m.c2.z * m.c0.y + m.c0.z * m.c2.y) * f,(m.c1.z * m.c0.y - m.c0.z * m.c1.y) * f,b11 * f,(m.c2.z * m.c0.x - m.c0.z * m.c2.x) * f,(-m.c1.z * m.c0.x + m.c0.z * m.c1.x) * f,b21 * f,(-m.c2.y * m.c0.x + m.c0.y * m.c2.x) * f,(m.c1.y * m.c0.x - m.c0.y * m.c1.x) * f);
	return this1;
};
Mat3.adjoint = function(this1) {
	var m = this1;
	var this1 = new Mat3Data(m.c1.y * m.c2.z - m.c1.z * m.c2.y,m.c0.z * m.c2.y - m.c0.y * m.c2.z,m.c0.y * m.c1.z - m.c0.z * m.c1.y,m.c1.z * m.c2.x - m.c1.x * m.c2.z,m.c0.x * m.c2.z - m.c0.z * m.c2.x,m.c0.z * m.c1.x - m.c0.x * m.c1.z,m.c1.x * m.c2.y - m.c1.y * m.c2.x,m.c0.y * m.c2.x - m.c0.x * m.c2.y,m.c0.x * m.c1.y - m.c0.y * m.c1.x);
	return this1;
};
Mat3.toString = function(this1) {
	return "mat3(" + ("" + this1.c0.x + ", " + this1.c0.y + ", " + this1.c0.z + ", ") + ("" + this1.c1.x + ", " + this1.c1.y + ", " + this1.c1.z + ", ") + ("" + this1.c2.x + ", " + this1.c2.y + ", " + this1.c2.z) + ")";
};
Mat3.arrayRead = function(this1,i) {
	switch(i) {
	case 0:
		return this1.c0;
	case 1:
		return this1.c1;
	case 2:
		return this1.c2;
	default:
		return null;
	}
};
Mat3.arrayWrite = function(this1,i,v) {
	switch(i) {
	case 0:
		var self = this1.c0;
		var source = v;
		self.x = source.x;
		self.y = source.y;
		self.z = source.z;
		return self;
	case 1:
		var self = this1.c1;
		var source = v;
		self.x = source.x;
		self.y = source.y;
		self.z = source.z;
		return self;
	case 2:
		var self = this1.c2;
		var source = v;
		self.x = source.x;
		self.y = source.y;
		self.z = source.z;
		return self;
	default:
		return null;
	}
};
Mat3.neg = function(m) {
	var m1 = m;
	var this1 = new Mat3Data(-m1.c0.x,-m1.c0.y,-m1.c0.z,-m1.c1.x,-m1.c1.y,-m1.c1.z,-m1.c2.x,-m1.c2.y,-m1.c2.z);
	return this1;
};
Mat3.prefixIncrement = function(m) {
	var _m = m;
	var a = _m.c0;
	a.x += 1;
	a.y += 1;
	a.z += 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var a = _m.c1;
	a.x += 1;
	a.y += 1;
	a.z += 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var a = _m.c2;
	a.x += 1;
	a.y += 1;
	a.z += 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var this1 = new Mat3Data(m.c0.x,m.c0.y,m.c0.z,m.c1.x,m.c1.y,m.c1.z,m.c2.x,m.c2.y,m.c2.z);
	return this1;
};
Mat3.prefixDecrement = function(m) {
	var _m = m;
	var a = _m.c0;
	a.x -= 1;
	a.y -= 1;
	a.z -= 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var a = _m.c1;
	a.x -= 1;
	a.y -= 1;
	a.z -= 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var a = _m.c2;
	a.x -= 1;
	a.y -= 1;
	a.z -= 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var this1 = new Mat3Data(m.c0.x,m.c0.y,m.c0.z,m.c1.x,m.c1.y,m.c1.z,m.c2.x,m.c2.y,m.c2.z);
	return this1;
};
Mat3.postfixIncrement = function(m) {
	var this1 = new Mat3Data(m.c0.x,m.c0.y,m.c0.z,m.c1.x,m.c1.y,m.c1.z,m.c2.x,m.c2.y,m.c2.z);
	var ret = this1;
	var m1 = m;
	var a = m1.c0;
	a.x += 1;
	a.y += 1;
	a.z += 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var a = m1.c1;
	a.x += 1;
	a.y += 1;
	a.z += 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var a = m1.c2;
	a.x += 1;
	a.y += 1;
	a.z += 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	return ret;
};
Mat3.postfixDecrement = function(m) {
	var this1 = new Mat3Data(m.c0.x,m.c0.y,m.c0.z,m.c1.x,m.c1.y,m.c1.z,m.c2.x,m.c2.y,m.c2.z);
	var ret = this1;
	var m1 = m;
	var a = m1.c0;
	a.x -= 1;
	a.y -= 1;
	a.z -= 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var a = m1.c1;
	a.x -= 1;
	a.y -= 1;
	a.z -= 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var a = m1.c2;
	a.x -= 1;
	a.y -= 1;
	a.z -= 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	return ret;
};
Mat3.mulEq = function(a,b) {
	var m = a;
	var n = b;
	var source_x = m.c0.x * n.c0.x + m.c1.x * n.c0.y + m.c2.x * n.c0.z;
	var source_y = m.c0.y * n.c0.x + m.c1.y * n.c0.y + m.c2.y * n.c0.z;
	var source_z = m.c0.z * n.c0.x + m.c1.z * n.c0.y + m.c2.z * n.c0.z;
	var source_x1 = m.c0.x * n.c1.x + m.c1.x * n.c1.y + m.c2.x * n.c1.z;
	var source_y1 = m.c0.y * n.c1.x + m.c1.y * n.c1.y + m.c2.y * n.c1.z;
	var source_z1 = m.c0.z * n.c1.x + m.c1.z * n.c1.y + m.c2.z * n.c1.z;
	var source_x2 = m.c0.x * n.c2.x + m.c1.x * n.c2.y + m.c2.x * n.c2.z;
	var source_y2 = m.c0.y * n.c2.x + m.c1.y * n.c2.y + m.c2.y * n.c2.z;
	var source_z2 = m.c0.z * n.c2.x + m.c1.z * n.c2.y + m.c2.z * n.c2.z;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	self.z = source_z1;
	var self = a.c2;
	self.x = source_x2;
	self.y = source_y2;
	self.z = source_z2;
	return a;
};
Mat3.mulEqScalar = function(a,f) {
	var m = a;
	var source_x = m.c0.x * f;
	var source_y = m.c0.y * f;
	var source_z = m.c0.z * f;
	var source_x1 = m.c1.x * f;
	var source_y1 = m.c1.y * f;
	var source_z1 = m.c1.z * f;
	var source_x2 = m.c2.x * f;
	var source_y2 = m.c2.y * f;
	var source_z2 = m.c2.z * f;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	self.z = source_z1;
	var self = a.c2;
	self.x = source_x2;
	self.y = source_y2;
	self.z = source_z2;
	return a;
};
Mat3.divEq = function(a,b) {
	var m = b;
	var n_c0_x = 1.0 / m.c0.x;
	var n_c0_y = 1.0 / m.c0.y;
	var n_c0_z = 1.0 / m.c0.z;
	var n_c1_x = 1.0 / m.c1.x;
	var n_c1_y = 1.0 / m.c1.y;
	var n_c1_z = 1.0 / m.c1.z;
	var n_c2_x = 1.0 / m.c2.x;
	var n_c2_y = 1.0 / m.c2.y;
	var n_c2_z = 1.0 / m.c2.z;
	var source_x = a.c0.x * n_c0_x;
	var source_y = a.c0.y * n_c0_y;
	var source_z = a.c0.z * n_c0_z;
	var source_x1 = a.c1.x * n_c1_x;
	var source_y1 = a.c1.y * n_c1_y;
	var source_z1 = a.c1.z * n_c1_z;
	var source_x2 = a.c2.x * n_c2_x;
	var source_y2 = a.c2.y * n_c2_y;
	var source_z2 = a.c2.z * n_c2_z;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	self.z = source_z1;
	var self = a.c2;
	self.x = source_x2;
	self.y = source_y2;
	self.z = source_z2;
	return a;
};
Mat3.divEqScalar = function(a,f) {
	var m = a;
	var source_x = m.c0.x / f;
	var source_y = m.c0.y / f;
	var source_z = m.c0.z / f;
	var source_x1 = m.c1.x / f;
	var source_y1 = m.c1.y / f;
	var source_z1 = m.c1.z / f;
	var source_x2 = m.c2.x / f;
	var source_y2 = m.c2.y / f;
	var source_z2 = m.c2.z / f;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	self.z = source_z1;
	var self = a.c2;
	self.x = source_x2;
	self.y = source_y2;
	self.z = source_z2;
	return a;
};
Mat3.addEq = function(a,b) {
	var m = a;
	var n = b;
	var source_x = m.c0.x + n.c0.x;
	var source_y = m.c0.y + n.c0.y;
	var source_z = m.c0.z + n.c0.z;
	var source_x1 = m.c1.x + n.c1.x;
	var source_y1 = m.c1.y + n.c1.y;
	var source_z1 = m.c1.z + n.c1.z;
	var source_x2 = m.c2.x + n.c2.x;
	var source_y2 = m.c2.y + n.c2.y;
	var source_z2 = m.c2.z + n.c2.z;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	self.z = source_z1;
	var self = a.c2;
	self.x = source_x2;
	self.y = source_y2;
	self.z = source_z2;
	return a;
};
Mat3.addEqScalar = function(a,f) {
	var m = a;
	var source_x = m.c0.x + f;
	var source_y = m.c0.y + f;
	var source_z = m.c0.z + f;
	var source_x1 = m.c1.x + f;
	var source_y1 = m.c1.y + f;
	var source_z1 = m.c1.z + f;
	var source_x2 = m.c2.x + f;
	var source_y2 = m.c2.y + f;
	var source_z2 = m.c2.z + f;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	self.z = source_z1;
	var self = a.c2;
	self.x = source_x2;
	self.y = source_y2;
	self.z = source_z2;
	return a;
};
Mat3.subEq = function(a,b) {
	var m = a;
	var n = b;
	var source_x = m.c0.x - n.c0.x;
	var source_y = m.c0.y - n.c0.y;
	var source_z = m.c0.z - n.c0.z;
	var source_x1 = m.c1.x - n.c1.x;
	var source_y1 = m.c1.y - n.c1.y;
	var source_z1 = m.c1.z - n.c1.z;
	var source_x2 = m.c2.x - n.c2.x;
	var source_y2 = m.c2.y - n.c2.y;
	var source_z2 = m.c2.z - n.c2.z;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	self.z = source_z1;
	var self = a.c2;
	self.x = source_x2;
	self.y = source_y2;
	self.z = source_z2;
	return a;
};
Mat3.subEqScalar = function(a,f) {
	var m = a;
	var source_x = m.c0.x - f;
	var source_y = m.c0.y - f;
	var source_z = m.c0.z - f;
	var source_x1 = m.c1.x - f;
	var source_y1 = m.c1.y - f;
	var source_z1 = m.c1.z - f;
	var source_x2 = m.c2.x - f;
	var source_y2 = m.c2.y - f;
	var source_z2 = m.c2.z - f;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	self.z = source_z1;
	var self = a.c2;
	self.x = source_x2;
	self.y = source_y2;
	self.z = source_z2;
	return a;
};
Mat3.add = function(m,n) {
	var m1 = m;
	var n1 = n;
	var this1 = new Mat3Data(m1.c0.x + n1.c0.x,m1.c0.y + n1.c0.y,m1.c0.z + n1.c0.z,m1.c1.x + n1.c1.x,m1.c1.y + n1.c1.y,m1.c1.z + n1.c1.z,m1.c2.x + n1.c2.x,m1.c2.y + n1.c2.y,m1.c2.z + n1.c2.z);
	return this1;
};
Mat3.addScalar = function(m,f) {
	var m1 = m;
	var this1 = new Mat3Data(m1.c0.x + f,m1.c0.y + f,m1.c0.z + f,m1.c1.x + f,m1.c1.y + f,m1.c1.z + f,m1.c2.x + f,m1.c2.y + f,m1.c2.z + f);
	return this1;
};
Mat3.sub = function(m,n) {
	var m1 = m;
	var n1 = n;
	var this1 = new Mat3Data(m1.c0.x - n1.c0.x,m1.c0.y - n1.c0.y,m1.c0.z - n1.c0.z,m1.c1.x - n1.c1.x,m1.c1.y - n1.c1.y,m1.c1.z - n1.c1.z,m1.c2.x - n1.c2.x,m1.c2.y - n1.c2.y,m1.c2.z - n1.c2.z);
	return this1;
};
Mat3.subScalar = function(m,f) {
	var m1 = m;
	var this1 = new Mat3Data(m1.c0.x - f,m1.c0.y - f,m1.c0.z - f,m1.c1.x - f,m1.c1.y - f,m1.c1.z - f,m1.c2.x - f,m1.c2.y - f,m1.c2.z - f);
	return this1;
};
Mat3.subScalarInv = function(f,m) {
	var m1 = m;
	var this1 = new Mat3Data(f - m1.c0.x,f - m1.c0.y,f - m1.c0.z,f - m1.c1.x,f - m1.c1.y,f - m1.c1.z,f - m1.c2.x,f - m1.c2.y,f - m1.c2.z);
	return this1;
};
Mat3.mul = function(m,n) {
	var m1 = m;
	var n1 = n;
	var this1 = new Mat3Data(m1.c0.x * n1.c0.x + m1.c1.x * n1.c0.y + m1.c2.x * n1.c0.z,m1.c0.y * n1.c0.x + m1.c1.y * n1.c0.y + m1.c2.y * n1.c0.z,m1.c0.z * n1.c0.x + m1.c1.z * n1.c0.y + m1.c2.z * n1.c0.z,m1.c0.x * n1.c1.x + m1.c1.x * n1.c1.y + m1.c2.x * n1.c1.z,m1.c0.y * n1.c1.x + m1.c1.y * n1.c1.y + m1.c2.y * n1.c1.z,m1.c0.z * n1.c1.x + m1.c1.z * n1.c1.y + m1.c2.z * n1.c1.z,m1.c0.x * n1.c2.x + m1.c1.x * n1.c2.y + m1.c2.x * n1.c2.z,m1.c0.y * n1.c2.x + m1.c1.y * n1.c2.y + m1.c2.y * n1.c2.z,m1.c0.z * n1.c2.x + m1.c1.z * n1.c2.y + m1.c2.z * n1.c2.z);
	return this1;
};
Mat3.postMulVec3 = function(m,v) {
	var m1 = m;
	var this1 = new Vec3Data(m1.c0.x * v.x + m1.c1.x * v.y + m1.c2.x * v.z,m1.c0.y * v.x + m1.c1.y * v.y + m1.c2.y * v.z,m1.c0.z * v.x + m1.c1.z * v.y + m1.c2.z * v.z);
	return this1;
};
Mat3.preMulVec3 = function(v,m) {
	var m1 = m;
	var b = m1.c0;
	var b1 = m1.c1;
	var b2 = m1.c2;
	var this1 = new Vec3Data(v.x * b.x + v.y * b.y + v.z * b.z,v.x * b1.x + v.y * b1.y + v.z * b1.z,v.x * b2.x + v.y * b2.y + v.z * b2.z);
	return this1;
};
Mat3.mulScalar = function(m,f) {
	var m1 = m;
	var this1 = new Mat3Data(m1.c0.x * f,m1.c0.y * f,m1.c0.z * f,m1.c1.x * f,m1.c1.y * f,m1.c1.z * f,m1.c2.x * f,m1.c2.y * f,m1.c2.z * f);
	return this1;
};
Mat3.div = function(m,n) {
	var m1 = n;
	var n_c0_x = 1.0 / m1.c0.x;
	var n_c0_y = 1.0 / m1.c0.y;
	var n_c0_z = 1.0 / m1.c0.z;
	var n_c1_x = 1.0 / m1.c1.x;
	var n_c1_y = 1.0 / m1.c1.y;
	var n_c1_z = 1.0 / m1.c1.z;
	var n_c2_x = 1.0 / m1.c2.x;
	var n_c2_y = 1.0 / m1.c2.y;
	var n_c2_z = 1.0 / m1.c2.z;
	var this1 = new Mat3Data(m.c0.x * n_c0_x,m.c0.y * n_c0_y,m.c0.z * n_c0_z,m.c1.x * n_c1_x,m.c1.y * n_c1_y,m.c1.z * n_c1_z,m.c2.x * n_c2_x,m.c2.y * n_c2_y,m.c2.z * n_c2_z);
	return this1;
};
Mat3.divScalar = function(m,f) {
	var m1 = m;
	var this1 = new Mat3Data(m1.c0.x / f,m1.c0.y / f,m1.c0.z / f,m1.c1.x / f,m1.c1.y / f,m1.c1.z / f,m1.c2.x / f,m1.c2.y / f,m1.c2.z / f);
	return this1;
};
Mat3.divScalarInv = function(f,m) {
	var m1 = m;
	var this1 = new Mat3Data(f / m1.c0.x,f / m1.c0.y,f / m1.c0.z,f / m1.c1.x,f / m1.c1.y,f / m1.c1.z,f / m1.c2.x,f / m1.c2.y,f / m1.c2.z);
	return this1;
};
Mat3.equal = function(m,n) {
	var m1 = m;
	var n1 = n;
	var tmp;
	var a = m1.c0;
	var b = n1.c0;
	if(a.x == b.x && a.y == b.y && a.z == b.z) {
		var a = m1.c1;
		var b = n1.c1;
		tmp = a.x == b.x && a.y == b.y && a.z == b.z;
	} else {
		tmp = false;
	}
	if(tmp) {
		var a = m1.c2;
		var b = n1.c2;
		if(a.x == b.x && a.y == b.y) {
			return a.z == b.z;
		} else {
			return false;
		}
	} else {
		return false;
	}
};
Mat3.notEqual = function(m,n) {
	var m1 = m;
	var n1 = n;
	var tmp;
	var tmp1;
	var a = m1.c0;
	var b = n1.c0;
	if(a.x == b.x && a.y == b.y && a.z == b.z) {
		var a = m1.c1;
		var b = n1.c1;
		tmp1 = a.x == b.x && a.y == b.y && a.z == b.z;
	} else {
		tmp1 = false;
	}
	if(tmp1) {
		var a = m1.c2;
		var b = n1.c2;
		tmp = a.x == b.x && a.y == b.y && a.z == b.z;
	} else {
		tmp = false;
	}
	return !tmp;
};
var Mat3Data = function(a00,a01,a02,a10,a11,a12,a20,a21,a22) {
	var this1 = new Vec3Data(a00,a01,a02);
	this.c0 = this1;
	var this1 = new Vec3Data(a10,a11,a12);
	this.c1 = this1;
	var this1 = new Vec3Data(a20,a21,a22);
	this.c2 = this1;
};
$hxClasses["Mat3Data"] = Mat3Data;
Mat3Data.__name__ = "Mat3Data";
Mat3Data.prototype = {
	__class__: Mat3Data
};
var Mat4 = {};
Mat4._new = function(a00,a01,a02,a03,a10,a11,a12,a13,a20,a21,a22,a23,a30,a31,a32,a33) {
	var this1 = new Mat4Data(a00,a01,a02,a03,a10,a11,a12,a13,a20,a21,a22,a23,a30,a31,a32,a33);
	return this1;
};
Mat4.set = function(this1,a00,a01,a02,a03,a10,a11,a12,a13,a20,a21,a22,a23,a30,a31,a32,a33) {
	var this2 = this1.c0;
	this2.x = a00;
	this2.y = a01;
	this2.z = a02;
	this2.w = a03;
	var this2 = this1.c1;
	this2.x = a10;
	this2.y = a11;
	this2.z = a12;
	this2.w = a13;
	var this2 = this1.c2;
	this2.x = a20;
	this2.y = a21;
	this2.z = a22;
	this2.w = a23;
	var this2 = this1.c3;
	this2.x = a30;
	this2.y = a31;
	this2.z = a32;
	this2.w = a33;
};
Mat4.copyFrom = function(this1,v) {
	var v1 = v;
	var self = this1.c0;
	var source = v1.c0;
	self.x = source.x;
	self.y = source.y;
	self.z = source.z;
	self.w = source.w;
	var self = this1.c1;
	var source = v1.c1;
	self.x = source.x;
	self.y = source.y;
	self.z = source.z;
	self.w = source.w;
	var self = this1.c2;
	var source = v1.c2;
	self.x = source.x;
	self.y = source.y;
	self.z = source.z;
	self.w = source.w;
	var self = this1.c3;
	var source = v1.c3;
	self.x = source.x;
	self.y = source.y;
	self.z = source.z;
	self.w = source.w;
	return this1;
};
Mat4.clone = function(this1) {
	var this2 = new Mat4Data(this1.c0.x,this1.c0.y,this1.c0.z,this1.c0.w,this1.c1.x,this1.c1.y,this1.c1.z,this1.c1.w,this1.c2.x,this1.c2.y,this1.c2.z,this1.c2.w,this1.c3.x,this1.c3.y,this1.c3.z,this1.c3.w);
	return this2;
};
Mat4.matrixCompMult = function(this1,n) {
	var m = this1;
	var n1 = n;
	var this1 = new Mat4Data(m.c0.x * n1.c0.x,m.c0.y * n1.c0.y,m.c0.z * n1.c0.z,m.c0.w * n1.c0.w,m.c1.x * n1.c1.x,m.c1.y * n1.c1.y,m.c1.z * n1.c1.z,m.c1.w * n1.c1.w,m.c2.x * n1.c2.x,m.c2.y * n1.c2.y,m.c2.z * n1.c2.z,m.c2.w * n1.c2.w,m.c3.x * n1.c3.x,m.c3.y * n1.c3.y,m.c3.z * n1.c3.z,m.c3.w * n1.c3.w);
	return this1;
};
Mat4.transpose = function(this1) {
	var m = this1;
	var this1 = new Mat4Data(m.c0.x,m.c1.x,m.c2.x,m.c3.x,m.c0.y,m.c1.y,m.c2.y,m.c3.y,m.c0.z,m.c1.z,m.c2.z,m.c3.z,m.c0.w,m.c1.w,m.c2.w,m.c3.w);
	return this1;
};
Mat4.determinant = function(this1) {
	var m = this1;
	var b0 = m.c0.x * m.c1.y - m.c0.y * m.c1.x;
	var b1 = m.c0.x * m.c1.z - m.c0.z * m.c1.x;
	var b2 = m.c0.y * m.c1.z - m.c0.z * m.c1.y;
	var b3 = m.c2.x * m.c3.y - m.c2.y * m.c3.x;
	var b4 = m.c2.x * m.c3.z - m.c2.z * m.c3.x;
	var b5 = m.c2.y * m.c3.z - m.c2.z * m.c3.y;
	var b6 = m.c0.x * b5 - m.c0.y * b4 + m.c0.z * b3;
	var b7 = m.c1.x * b5 - m.c1.y * b4 + m.c1.z * b3;
	var b8 = m.c2.x * b2 - m.c2.y * b1 + m.c2.z * b0;
	var b9 = m.c3.x * b2 - m.c3.y * b1 + m.c3.z * b0;
	return m.c1.w * b6 - m.c0.w * b7 + m.c3.w * b8 - m.c2.w * b9;
};
Mat4.inverse = function(this1) {
	var m = this1;
	var b00 = m.c0.x * m.c1.y - m.c0.y * m.c1.x;
	var b01 = m.c0.x * m.c1.z - m.c0.z * m.c1.x;
	var b02 = m.c0.x * m.c1.w - m.c0.w * m.c1.x;
	var b03 = m.c0.y * m.c1.z - m.c0.z * m.c1.y;
	var b04 = m.c0.y * m.c1.w - m.c0.w * m.c1.y;
	var b05 = m.c0.z * m.c1.w - m.c0.w * m.c1.z;
	var b06 = m.c2.x * m.c3.y - m.c2.y * m.c3.x;
	var b07 = m.c2.x * m.c3.z - m.c2.z * m.c3.x;
	var b08 = m.c2.x * m.c3.w - m.c2.w * m.c3.x;
	var b09 = m.c2.y * m.c3.z - m.c2.z * m.c3.y;
	var b10 = m.c2.y * m.c3.w - m.c2.w * m.c3.y;
	var b11 = m.c2.z * m.c3.w - m.c2.w * m.c3.z;
	var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
	var f = 1.0 / det;
	var this1 = new Mat4Data((m.c1.y * b11 - m.c1.z * b10 + m.c1.w * b09) * f,(m.c0.z * b10 - m.c0.y * b11 - m.c0.w * b09) * f,(m.c3.y * b05 - m.c3.z * b04 + m.c3.w * b03) * f,(m.c2.z * b04 - m.c2.y * b05 - m.c2.w * b03) * f,(m.c1.z * b08 - m.c1.x * b11 - m.c1.w * b07) * f,(m.c0.x * b11 - m.c0.z * b08 + m.c0.w * b07) * f,(m.c3.z * b02 - m.c3.x * b05 - m.c3.w * b01) * f,(m.c2.x * b05 - m.c2.z * b02 + m.c2.w * b01) * f,(m.c1.x * b10 - m.c1.y * b08 + m.c1.w * b06) * f,(m.c0.y * b08 - m.c0.x * b10 - m.c0.w * b06) * f,(m.c3.x * b04 - m.c3.y * b02 + m.c3.w * b00) * f,(m.c2.y * b02 - m.c2.x * b04 - m.c2.w * b00) * f,(m.c1.y * b07 - m.c1.x * b09 - m.c1.z * b06) * f,(m.c0.x * b09 - m.c0.y * b07 + m.c0.z * b06) * f,(m.c3.y * b01 - m.c3.x * b03 - m.c3.z * b00) * f,(m.c2.x * b03 - m.c2.y * b01 + m.c2.z * b00) * f);
	return this1;
};
Mat4.adjoint = function(this1) {
	var m = this1;
	var b00 = m.c0.x * m.c1.y - m.c0.y * m.c1.x;
	var b01 = m.c0.x * m.c1.z - m.c0.z * m.c1.x;
	var b02 = m.c0.x * m.c1.w - m.c0.w * m.c1.x;
	var b03 = m.c0.y * m.c1.z - m.c0.z * m.c1.y;
	var b04 = m.c0.y * m.c1.w - m.c0.w * m.c1.y;
	var b05 = m.c0.z * m.c1.w - m.c0.w * m.c1.z;
	var b06 = m.c2.x * m.c3.y - m.c2.y * m.c3.x;
	var b07 = m.c2.x * m.c3.z - m.c2.z * m.c3.x;
	var b08 = m.c2.x * m.c3.w - m.c2.w * m.c3.x;
	var b09 = m.c2.y * m.c3.z - m.c2.z * m.c3.y;
	var b10 = m.c2.y * m.c3.w - m.c2.w * m.c3.y;
	var b11 = m.c2.z * m.c3.w - m.c2.w * m.c3.z;
	var this1 = new Mat4Data(m.c1.y * b11 - m.c1.z * b10 + m.c1.w * b09,m.c0.z * b10 - m.c0.y * b11 - m.c0.w * b09,m.c3.y * b05 - m.c3.z * b04 + m.c3.w * b03,m.c2.z * b04 - m.c2.y * b05 - m.c2.w * b03,m.c1.z * b08 - m.c1.x * b11 - m.c1.w * b07,m.c0.x * b11 - m.c0.z * b08 + m.c0.w * b07,m.c3.z * b02 - m.c3.x * b05 - m.c3.w * b01,m.c2.x * b05 - m.c2.z * b02 + m.c2.w * b01,m.c1.x * b10 - m.c1.y * b08 + m.c1.w * b06,m.c0.y * b08 - m.c0.x * b10 - m.c0.w * b06,m.c3.x * b04 - m.c3.y * b02 + m.c3.w * b00,m.c2.y * b02 - m.c2.x * b04 - m.c2.w * b00,m.c1.y * b07 - m.c1.x * b09 - m.c1.z * b06,m.c0.x * b09 - m.c0.y * b07 + m.c0.z * b06,m.c3.y * b01 - m.c3.x * b03 - m.c3.z * b00,m.c2.x * b03 - m.c2.y * b01 + m.c2.z * b00);
	return this1;
};
Mat4.toString = function(this1) {
	return "mat4(" + ("" + this1.c0.x + ", " + this1.c0.y + ", " + this1.c0.z + ", " + this1.c0.w + ", ") + ("" + this1.c1.x + ", " + this1.c1.y + ", " + this1.c1.z + ", " + this1.c1.w + ", ") + ("" + this1.c2.x + ", " + this1.c2.y + ", " + this1.c2.z + ", " + this1.c2.w + ", ") + ("" + this1.c3.x + ", " + this1.c3.y + ", " + this1.c3.z + ", " + this1.c3.w) + ")";
};
Mat4.arrayRead = function(this1,i) {
	switch(i) {
	case 0:
		return this1.c0;
	case 1:
		return this1.c1;
	case 2:
		return this1.c2;
	case 3:
		return this1.c3;
	default:
		return null;
	}
};
Mat4.arrayWrite = function(this1,i,v) {
	switch(i) {
	case 0:
		var self = this1.c0;
		var source = v;
		self.x = source.x;
		self.y = source.y;
		self.z = source.z;
		self.w = source.w;
		return self;
	case 1:
		var self = this1.c1;
		var source = v;
		self.x = source.x;
		self.y = source.y;
		self.z = source.z;
		self.w = source.w;
		return self;
	case 2:
		var self = this1.c2;
		var source = v;
		self.x = source.x;
		self.y = source.y;
		self.z = source.z;
		self.w = source.w;
		return self;
	case 3:
		var self = this1.c3;
		var source = v;
		self.x = source.x;
		self.y = source.y;
		self.z = source.z;
		self.w = source.w;
		return self;
	default:
		return null;
	}
};
Mat4.neg = function(m) {
	var m1 = m;
	var this1 = new Mat4Data(-m1.c0.x,-m1.c0.y,-m1.c0.z,-m1.c0.w,-m1.c1.x,-m1.c1.y,-m1.c1.z,-m1.c1.w,-m1.c2.x,-m1.c2.y,-m1.c2.z,-m1.c2.w,-m1.c3.x,-m1.c3.y,-m1.c3.z,-m1.c3.w);
	return this1;
};
Mat4.prefixIncrement = function(m) {
	var _m = m;
	var a = _m.c0;
	a.x += 1;
	a.y += 1;
	a.z += 1;
	a.w += 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var this_w = a.w;
	var a = _m.c1;
	a.x += 1;
	a.y += 1;
	a.z += 1;
	a.w += 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var this_w = a.w;
	var a = _m.c2;
	a.x += 1;
	a.y += 1;
	a.z += 1;
	a.w += 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var this_w = a.w;
	var a = _m.c3;
	a.x += 1;
	a.y += 1;
	a.z += 1;
	a.w += 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var this_w = a.w;
	var this1 = new Mat4Data(m.c0.x,m.c0.y,m.c0.z,m.c0.w,m.c1.x,m.c1.y,m.c1.z,m.c1.w,m.c2.x,m.c2.y,m.c2.z,m.c2.w,m.c3.x,m.c3.y,m.c3.z,m.c3.w);
	return this1;
};
Mat4.prefixDecrement = function(m) {
	var _m = m;
	var a = _m.c0;
	a.x -= 1;
	a.y -= 1;
	a.z -= 1;
	a.w -= 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var this_w = a.w;
	var a = _m.c1;
	a.x -= 1;
	a.y -= 1;
	a.z -= 1;
	a.w -= 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var this_w = a.w;
	var a = _m.c2;
	a.x -= 1;
	a.y -= 1;
	a.z -= 1;
	a.w -= 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var this_w = a.w;
	var a = _m.c3;
	a.x -= 1;
	a.y -= 1;
	a.z -= 1;
	a.w -= 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var this_w = a.w;
	var this1 = new Mat4Data(m.c0.x,m.c0.y,m.c0.z,m.c0.w,m.c1.x,m.c1.y,m.c1.z,m.c1.w,m.c2.x,m.c2.y,m.c2.z,m.c2.w,m.c3.x,m.c3.y,m.c3.z,m.c3.w);
	return this1;
};
Mat4.postfixIncrement = function(m) {
	var this1 = new Mat4Data(m.c0.x,m.c0.y,m.c0.z,m.c0.w,m.c1.x,m.c1.y,m.c1.z,m.c1.w,m.c2.x,m.c2.y,m.c2.z,m.c2.w,m.c3.x,m.c3.y,m.c3.z,m.c3.w);
	var ret = this1;
	var m1 = m;
	var a = m1.c0;
	a.x += 1;
	a.y += 1;
	a.z += 1;
	a.w += 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var this_w = a.w;
	var a = m1.c1;
	a.x += 1;
	a.y += 1;
	a.z += 1;
	a.w += 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var this_w = a.w;
	var a = m1.c2;
	a.x += 1;
	a.y += 1;
	a.z += 1;
	a.w += 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var this_w = a.w;
	var a = m1.c3;
	a.x += 1;
	a.y += 1;
	a.z += 1;
	a.w += 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var this_w = a.w;
	return ret;
};
Mat4.postfixDecrement = function(m) {
	var this1 = new Mat4Data(m.c0.x,m.c0.y,m.c0.z,m.c0.w,m.c1.x,m.c1.y,m.c1.z,m.c1.w,m.c2.x,m.c2.y,m.c2.z,m.c2.w,m.c3.x,m.c3.y,m.c3.z,m.c3.w);
	var ret = this1;
	var m1 = m;
	var a = m1.c0;
	a.x -= 1;
	a.y -= 1;
	a.z -= 1;
	a.w -= 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var this_w = a.w;
	var a = m1.c1;
	a.x -= 1;
	a.y -= 1;
	a.z -= 1;
	a.w -= 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var this_w = a.w;
	var a = m1.c2;
	a.x -= 1;
	a.y -= 1;
	a.z -= 1;
	a.w -= 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var this_w = a.w;
	var a = m1.c3;
	a.x -= 1;
	a.y -= 1;
	a.z -= 1;
	a.w -= 1;
	var this_x = a.x;
	var this_y = a.y;
	var this_z = a.z;
	var this_w = a.w;
	return ret;
};
Mat4.mulEq = function(a,b) {
	var m = a;
	var n = b;
	var source_x = m.c0.x * n.c0.x + m.c1.x * n.c0.y + m.c2.x * n.c0.z + m.c3.x * n.c0.w;
	var source_y = m.c0.y * n.c0.x + m.c1.y * n.c0.y + m.c2.y * n.c0.z + m.c3.y * n.c0.w;
	var source_z = m.c0.z * n.c0.x + m.c1.z * n.c0.y + m.c2.z * n.c0.z + m.c3.z * n.c0.w;
	var source_w = m.c0.w * n.c0.x + m.c1.w * n.c0.y + m.c2.w * n.c0.z + m.c3.w * n.c0.w;
	var source_x1 = m.c0.x * n.c1.x + m.c1.x * n.c1.y + m.c2.x * n.c1.z + m.c3.x * n.c1.w;
	var source_y1 = m.c0.y * n.c1.x + m.c1.y * n.c1.y + m.c2.y * n.c1.z + m.c3.y * n.c1.w;
	var source_z1 = m.c0.z * n.c1.x + m.c1.z * n.c1.y + m.c2.z * n.c1.z + m.c3.z * n.c1.w;
	var source_w1 = m.c0.w * n.c1.x + m.c1.w * n.c1.y + m.c2.w * n.c1.z + m.c3.w * n.c1.w;
	var source_x2 = m.c0.x * n.c2.x + m.c1.x * n.c2.y + m.c2.x * n.c2.z + m.c3.x * n.c2.w;
	var source_y2 = m.c0.y * n.c2.x + m.c1.y * n.c2.y + m.c2.y * n.c2.z + m.c3.y * n.c2.w;
	var source_z2 = m.c0.z * n.c2.x + m.c1.z * n.c2.y + m.c2.z * n.c2.z + m.c3.z * n.c2.w;
	var source_w2 = m.c0.w * n.c2.x + m.c1.w * n.c2.y + m.c2.w * n.c2.z + m.c3.w * n.c2.w;
	var source_x3 = m.c0.x * n.c3.x + m.c1.x * n.c3.y + m.c2.x * n.c3.z + m.c3.x * n.c3.w;
	var source_y3 = m.c0.y * n.c3.x + m.c1.y * n.c3.y + m.c2.y * n.c3.z + m.c3.y * n.c3.w;
	var source_z3 = m.c0.z * n.c3.x + m.c1.z * n.c3.y + m.c2.z * n.c3.z + m.c3.z * n.c3.w;
	var source_w3 = m.c0.w * n.c3.x + m.c1.w * n.c3.y + m.c2.w * n.c3.z + m.c3.w * n.c3.w;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	self.w = source_w;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	self.z = source_z1;
	self.w = source_w1;
	var self = a.c2;
	self.x = source_x2;
	self.y = source_y2;
	self.z = source_z2;
	self.w = source_w2;
	var self = a.c3;
	self.x = source_x3;
	self.y = source_y3;
	self.z = source_z3;
	self.w = source_w3;
	return a;
};
Mat4.mulEqScalar = function(a,f) {
	var m = a;
	var source_x = m.c0.x * f;
	var source_y = m.c0.y * f;
	var source_z = m.c0.z * f;
	var source_w = m.c0.w * f;
	var source_x1 = m.c1.x * f;
	var source_y1 = m.c1.y * f;
	var source_z1 = m.c1.z * f;
	var source_w1 = m.c1.w * f;
	var source_x2 = m.c2.x * f;
	var source_y2 = m.c2.y * f;
	var source_z2 = m.c2.z * f;
	var source_w2 = m.c2.w * f;
	var source_x3 = m.c3.x * f;
	var source_y3 = m.c3.y * f;
	var source_z3 = m.c3.z * f;
	var source_w3 = m.c3.w * f;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	self.w = source_w;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	self.z = source_z1;
	self.w = source_w1;
	var self = a.c2;
	self.x = source_x2;
	self.y = source_y2;
	self.z = source_z2;
	self.w = source_w2;
	var self = a.c3;
	self.x = source_x3;
	self.y = source_y3;
	self.z = source_z3;
	self.w = source_w3;
	return a;
};
Mat4.divEq = function(a,b) {
	var m = b;
	var n_c0_x = 1.0 / m.c0.x;
	var n_c0_y = 1.0 / m.c0.y;
	var n_c0_z = 1.0 / m.c0.z;
	var n_c0_w = 1.0 / m.c0.w;
	var n_c1_x = 1.0 / m.c1.x;
	var n_c1_y = 1.0 / m.c1.y;
	var n_c1_z = 1.0 / m.c1.z;
	var n_c1_w = 1.0 / m.c1.w;
	var n_c2_x = 1.0 / m.c2.x;
	var n_c2_y = 1.0 / m.c2.y;
	var n_c2_z = 1.0 / m.c2.z;
	var n_c2_w = 1.0 / m.c2.w;
	var n_c3_x = 1.0 / m.c3.x;
	var n_c3_y = 1.0 / m.c3.y;
	var n_c3_z = 1.0 / m.c3.z;
	var n_c3_w = 1.0 / m.c3.w;
	var m = a;
	var source_x = m.c0.x * n_c0_x;
	var source_y = m.c0.y * n_c0_y;
	var source_z = m.c0.z * n_c0_z;
	var source_w = m.c0.w * n_c0_w;
	var source_x1 = m.c1.x * n_c1_x;
	var source_y1 = m.c1.y * n_c1_y;
	var source_z1 = m.c1.z * n_c1_z;
	var source_w1 = m.c1.w * n_c1_w;
	var source_x2 = m.c2.x * n_c2_x;
	var source_y2 = m.c2.y * n_c2_y;
	var source_z2 = m.c2.z * n_c2_z;
	var source_w2 = m.c2.w * n_c2_w;
	var source_x3 = m.c3.x * n_c3_x;
	var source_y3 = m.c3.y * n_c3_y;
	var source_z3 = m.c3.z * n_c3_z;
	var source_w3 = m.c3.w * n_c3_w;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	self.w = source_w;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	self.z = source_z1;
	self.w = source_w1;
	var self = a.c2;
	self.x = source_x2;
	self.y = source_y2;
	self.z = source_z2;
	self.w = source_w2;
	var self = a.c3;
	self.x = source_x3;
	self.y = source_y3;
	self.z = source_z3;
	self.w = source_w3;
	return a;
};
Mat4.divEqScalar = function(a,f) {
	var m = a;
	var source_x = m.c0.x / f;
	var source_y = m.c0.y / f;
	var source_z = m.c0.z / f;
	var source_w = m.c0.w / f;
	var source_x1 = m.c1.x / f;
	var source_y1 = m.c1.y / f;
	var source_z1 = m.c1.z / f;
	var source_w1 = m.c1.w / f;
	var source_x2 = m.c2.x / f;
	var source_y2 = m.c2.y / f;
	var source_z2 = m.c2.z / f;
	var source_w2 = m.c2.w / f;
	var source_x3 = m.c3.x / f;
	var source_y3 = m.c3.y / f;
	var source_z3 = m.c3.z / f;
	var source_w3 = m.c3.w / f;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	self.w = source_w;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	self.z = source_z1;
	self.w = source_w1;
	var self = a.c2;
	self.x = source_x2;
	self.y = source_y2;
	self.z = source_z2;
	self.w = source_w2;
	var self = a.c3;
	self.x = source_x3;
	self.y = source_y3;
	self.z = source_z3;
	self.w = source_w3;
	return a;
};
Mat4.addEq = function(a,b) {
	var m = a;
	var n = b;
	var source_x = m.c0.x + n.c0.x;
	var source_y = m.c0.y + n.c0.y;
	var source_z = m.c0.z + n.c0.z;
	var source_w = m.c0.w + n.c0.w;
	var source_x1 = m.c1.x + n.c1.x;
	var source_y1 = m.c1.y + n.c1.y;
	var source_z1 = m.c1.z + n.c1.z;
	var source_w1 = m.c1.w + n.c1.w;
	var source_x2 = m.c2.x + n.c2.x;
	var source_y2 = m.c2.y + n.c2.y;
	var source_z2 = m.c2.z + n.c2.z;
	var source_w2 = m.c2.w + n.c2.w;
	var source_x3 = m.c3.x + n.c3.x;
	var source_y3 = m.c3.y + n.c3.y;
	var source_z3 = m.c3.z + n.c3.z;
	var source_w3 = m.c3.w + n.c3.w;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	self.w = source_w;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	self.z = source_z1;
	self.w = source_w1;
	var self = a.c2;
	self.x = source_x2;
	self.y = source_y2;
	self.z = source_z2;
	self.w = source_w2;
	var self = a.c3;
	self.x = source_x3;
	self.y = source_y3;
	self.z = source_z3;
	self.w = source_w3;
	return a;
};
Mat4.addEqScalar = function(a,f) {
	var m = a;
	var source_x = m.c0.x + f;
	var source_y = m.c0.y + f;
	var source_z = m.c0.z + f;
	var source_w = m.c0.w + f;
	var source_x1 = m.c1.x + f;
	var source_y1 = m.c1.y + f;
	var source_z1 = m.c1.z + f;
	var source_w1 = m.c1.w + f;
	var source_x2 = m.c2.x + f;
	var source_y2 = m.c2.y + f;
	var source_z2 = m.c2.z + f;
	var source_w2 = m.c2.w + f;
	var source_x3 = m.c3.x + f;
	var source_y3 = m.c3.y + f;
	var source_z3 = m.c3.z + f;
	var source_w3 = m.c3.w + f;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	self.w = source_w;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	self.z = source_z1;
	self.w = source_w1;
	var self = a.c2;
	self.x = source_x2;
	self.y = source_y2;
	self.z = source_z2;
	self.w = source_w2;
	var self = a.c3;
	self.x = source_x3;
	self.y = source_y3;
	self.z = source_z3;
	self.w = source_w3;
	return a;
};
Mat4.subEq = function(a,b) {
	var m = a;
	var n = b;
	var source_x = m.c0.x - n.c0.x;
	var source_y = m.c0.y - n.c0.y;
	var source_z = m.c0.z - n.c0.z;
	var source_w = m.c0.w - n.c0.w;
	var source_x1 = m.c1.x - n.c1.x;
	var source_y1 = m.c1.y - n.c1.y;
	var source_z1 = m.c1.z - n.c1.z;
	var source_w1 = m.c1.w - n.c1.w;
	var source_x2 = m.c2.x - n.c2.x;
	var source_y2 = m.c2.y - n.c2.y;
	var source_z2 = m.c2.z - n.c2.z;
	var source_w2 = m.c2.w - n.c2.w;
	var source_x3 = m.c3.x - n.c3.x;
	var source_y3 = m.c3.y - n.c3.y;
	var source_z3 = m.c3.z - n.c3.z;
	var source_w3 = m.c3.w - n.c3.w;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	self.w = source_w;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	self.z = source_z1;
	self.w = source_w1;
	var self = a.c2;
	self.x = source_x2;
	self.y = source_y2;
	self.z = source_z2;
	self.w = source_w2;
	var self = a.c3;
	self.x = source_x3;
	self.y = source_y3;
	self.z = source_z3;
	self.w = source_w3;
	return a;
};
Mat4.subEqScalar = function(a,f) {
	var m = a;
	var source_x = m.c0.x - f;
	var source_y = m.c0.y - f;
	var source_z = m.c0.z - f;
	var source_w = m.c0.w - f;
	var source_x1 = m.c1.x - f;
	var source_y1 = m.c1.y - f;
	var source_z1 = m.c1.z - f;
	var source_w1 = m.c1.w - f;
	var source_x2 = m.c2.x - f;
	var source_y2 = m.c2.y - f;
	var source_z2 = m.c2.z - f;
	var source_w2 = m.c2.w - f;
	var source_x3 = m.c3.x - f;
	var source_y3 = m.c3.y - f;
	var source_z3 = m.c3.z - f;
	var source_w3 = m.c3.w - f;
	var self = a.c0;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	self.w = source_w;
	var self = a.c1;
	self.x = source_x1;
	self.y = source_y1;
	self.z = source_z1;
	self.w = source_w1;
	var self = a.c2;
	self.x = source_x2;
	self.y = source_y2;
	self.z = source_z2;
	self.w = source_w2;
	var self = a.c3;
	self.x = source_x3;
	self.y = source_y3;
	self.z = source_z3;
	self.w = source_w3;
	return a;
};
Mat4.add = function(m,n) {
	var m1 = m;
	var n1 = n;
	var this1 = new Mat4Data(m1.c0.x + n1.c0.x,m1.c0.y + n1.c0.y,m1.c0.z + n1.c0.z,m1.c0.w + n1.c0.w,m1.c1.x + n1.c1.x,m1.c1.y + n1.c1.y,m1.c1.z + n1.c1.z,m1.c1.w + n1.c1.w,m1.c2.x + n1.c2.x,m1.c2.y + n1.c2.y,m1.c2.z + n1.c2.z,m1.c2.w + n1.c2.w,m1.c3.x + n1.c3.x,m1.c3.y + n1.c3.y,m1.c3.z + n1.c3.z,m1.c3.w + n1.c3.w);
	return this1;
};
Mat4.addScalar = function(m,f) {
	var m1 = m;
	var this1 = new Mat4Data(m1.c0.x + f,m1.c0.y + f,m1.c0.z + f,m1.c0.w + f,m1.c1.x + f,m1.c1.y + f,m1.c1.z + f,m1.c1.w + f,m1.c2.x + f,m1.c2.y + f,m1.c2.z + f,m1.c2.w + f,m1.c3.x + f,m1.c3.y + f,m1.c3.z + f,m1.c3.w + f);
	return this1;
};
Mat4.sub = function(m,n) {
	var m1 = m;
	var n1 = n;
	var this1 = new Mat4Data(m1.c0.x - n1.c0.x,m1.c0.y - n1.c0.y,m1.c0.z - n1.c0.z,m1.c0.w - n1.c0.w,m1.c1.x - n1.c1.x,m1.c1.y - n1.c1.y,m1.c1.z - n1.c1.z,m1.c1.w - n1.c1.w,m1.c2.x - n1.c2.x,m1.c2.y - n1.c2.y,m1.c2.z - n1.c2.z,m1.c2.w - n1.c2.w,m1.c3.x - n1.c3.x,m1.c3.y - n1.c3.y,m1.c3.z - n1.c3.z,m1.c3.w - n1.c3.w);
	return this1;
};
Mat4.subScalar = function(m,f) {
	var m1 = m;
	var this1 = new Mat4Data(m1.c0.x - f,m1.c0.y - f,m1.c0.z - f,m1.c0.w - f,m1.c1.x - f,m1.c1.y - f,m1.c1.z - f,m1.c1.w - f,m1.c2.x - f,m1.c2.y - f,m1.c2.z - f,m1.c2.w - f,m1.c3.x - f,m1.c3.y - f,m1.c3.z - f,m1.c3.w - f);
	return this1;
};
Mat4.subScalarInv = function(f,m) {
	var m1 = m;
	var this1 = new Mat4Data(f - m1.c0.x,f - m1.c0.y,f - m1.c0.z,f - m1.c0.w,f - m1.c1.x,f - m1.c1.y,f - m1.c1.z,f - m1.c1.w,f - m1.c2.x,f - m1.c2.y,f - m1.c2.z,f - m1.c2.w,f - m1.c3.x,f - m1.c3.y,f - m1.c3.z,f - m1.c3.w);
	return this1;
};
Mat4.mul = function(m,n) {
	var m1 = m;
	var n1 = n;
	var this1 = new Mat4Data(m1.c0.x * n1.c0.x + m1.c1.x * n1.c0.y + m1.c2.x * n1.c0.z + m1.c3.x * n1.c0.w,m1.c0.y * n1.c0.x + m1.c1.y * n1.c0.y + m1.c2.y * n1.c0.z + m1.c3.y * n1.c0.w,m1.c0.z * n1.c0.x + m1.c1.z * n1.c0.y + m1.c2.z * n1.c0.z + m1.c3.z * n1.c0.w,m1.c0.w * n1.c0.x + m1.c1.w * n1.c0.y + m1.c2.w * n1.c0.z + m1.c3.w * n1.c0.w,m1.c0.x * n1.c1.x + m1.c1.x * n1.c1.y + m1.c2.x * n1.c1.z + m1.c3.x * n1.c1.w,m1.c0.y * n1.c1.x + m1.c1.y * n1.c1.y + m1.c2.y * n1.c1.z + m1.c3.y * n1.c1.w,m1.c0.z * n1.c1.x + m1.c1.z * n1.c1.y + m1.c2.z * n1.c1.z + m1.c3.z * n1.c1.w,m1.c0.w * n1.c1.x + m1.c1.w * n1.c1.y + m1.c2.w * n1.c1.z + m1.c3.w * n1.c1.w,m1.c0.x * n1.c2.x + m1.c1.x * n1.c2.y + m1.c2.x * n1.c2.z + m1.c3.x * n1.c2.w,m1.c0.y * n1.c2.x + m1.c1.y * n1.c2.y + m1.c2.y * n1.c2.z + m1.c3.y * n1.c2.w,m1.c0.z * n1.c2.x + m1.c1.z * n1.c2.y + m1.c2.z * n1.c2.z + m1.c3.z * n1.c2.w,m1.c0.w * n1.c2.x + m1.c1.w * n1.c2.y + m1.c2.w * n1.c2.z + m1.c3.w * n1.c2.w,m1.c0.x * n1.c3.x + m1.c1.x * n1.c3.y + m1.c2.x * n1.c3.z + m1.c3.x * n1.c3.w,m1.c0.y * n1.c3.x + m1.c1.y * n1.c3.y + m1.c2.y * n1.c3.z + m1.c3.y * n1.c3.w,m1.c0.z * n1.c3.x + m1.c1.z * n1.c3.y + m1.c2.z * n1.c3.z + m1.c3.z * n1.c3.w,m1.c0.w * n1.c3.x + m1.c1.w * n1.c3.y + m1.c2.w * n1.c3.z + m1.c3.w * n1.c3.w);
	return this1;
};
Mat4.postMulVec4 = function(m,v) {
	var m1 = m;
	var this1 = new Vec4Data(m1.c0.x * v.x + m1.c1.x * v.y + m1.c2.x * v.z + m1.c3.x * v.w,m1.c0.y * v.x + m1.c1.y * v.y + m1.c2.y * v.z + m1.c3.y * v.w,m1.c0.z * v.x + m1.c1.z * v.y + m1.c2.z * v.z + m1.c3.z * v.w,m1.c0.w * v.x + m1.c1.w * v.y + m1.c2.w * v.z + m1.c3.w * v.w);
	return this1;
};
Mat4.preMulVec4 = function(v,m) {
	var m1 = m;
	var b = m1.c0;
	var b1 = m1.c1;
	var b2 = m1.c2;
	var b3 = m1.c3;
	var this1 = new Vec4Data(v.x * b.x + v.y * b.y + v.z * b.z + v.w * b.w,v.x * b1.x + v.y * b1.y + v.z * b1.z + v.w * b1.w,v.x * b2.x + v.y * b2.y + v.z * b2.z + v.w * b2.w,v.x * b3.x + v.y * b3.y + v.z * b3.z + v.w * b3.w);
	return this1;
};
Mat4.mulScalar = function(m,f) {
	var m1 = m;
	var this1 = new Mat4Data(m1.c0.x * f,m1.c0.y * f,m1.c0.z * f,m1.c0.w * f,m1.c1.x * f,m1.c1.y * f,m1.c1.z * f,m1.c1.w * f,m1.c2.x * f,m1.c2.y * f,m1.c2.z * f,m1.c2.w * f,m1.c3.x * f,m1.c3.y * f,m1.c3.z * f,m1.c3.w * f);
	return this1;
};
Mat4.div = function(m,n) {
	var m1 = n;
	var n_c0_x = 1.0 / m1.c0.x;
	var n_c0_y = 1.0 / m1.c0.y;
	var n_c0_z = 1.0 / m1.c0.z;
	var n_c0_w = 1.0 / m1.c0.w;
	var n_c1_x = 1.0 / m1.c1.x;
	var n_c1_y = 1.0 / m1.c1.y;
	var n_c1_z = 1.0 / m1.c1.z;
	var n_c1_w = 1.0 / m1.c1.w;
	var n_c2_x = 1.0 / m1.c2.x;
	var n_c2_y = 1.0 / m1.c2.y;
	var n_c2_z = 1.0 / m1.c2.z;
	var n_c2_w = 1.0 / m1.c2.w;
	var n_c3_x = 1.0 / m1.c3.x;
	var n_c3_y = 1.0 / m1.c3.y;
	var n_c3_z = 1.0 / m1.c3.z;
	var n_c3_w = 1.0 / m1.c3.w;
	var m1 = m;
	var this1 = new Mat4Data(m1.c0.x * n_c0_x,m1.c0.y * n_c0_y,m1.c0.z * n_c0_z,m1.c0.w * n_c0_w,m1.c1.x * n_c1_x,m1.c1.y * n_c1_y,m1.c1.z * n_c1_z,m1.c1.w * n_c1_w,m1.c2.x * n_c2_x,m1.c2.y * n_c2_y,m1.c2.z * n_c2_z,m1.c2.w * n_c2_w,m1.c3.x * n_c3_x,m1.c3.y * n_c3_y,m1.c3.z * n_c3_z,m1.c3.w * n_c3_w);
	return this1;
};
Mat4.divScalar = function(m,f) {
	var m1 = m;
	var this1 = new Mat4Data(m1.c0.x / f,m1.c0.y / f,m1.c0.z / f,m1.c0.w / f,m1.c1.x / f,m1.c1.y / f,m1.c1.z / f,m1.c1.w / f,m1.c2.x / f,m1.c2.y / f,m1.c2.z / f,m1.c2.w / f,m1.c3.x / f,m1.c3.y / f,m1.c3.z / f,m1.c3.w / f);
	return this1;
};
Mat4.divScalarInv = function(f,m) {
	var m1 = m;
	var this1 = new Mat4Data(f / m1.c0.x,f / m1.c0.y,f / m1.c0.z,f / m1.c0.w,f / m1.c1.x,f / m1.c1.y,f / m1.c1.z,f / m1.c1.w,f / m1.c2.x,f / m1.c2.y,f / m1.c2.z,f / m1.c2.w,f / m1.c3.x,f / m1.c3.y,f / m1.c3.z,f / m1.c3.w);
	return this1;
};
Mat4.equal = function(m,n) {
	var m1 = m;
	var n1 = n;
	var tmp;
	var tmp1;
	var a = m1.c0;
	var b = n1.c0;
	if(a.x == b.x && a.y == b.y && a.z == b.z && a.w == b.w) {
		var a = m1.c1;
		var b = n1.c1;
		tmp1 = a.x == b.x && a.y == b.y && a.z == b.z && a.w == b.w;
	} else {
		tmp1 = false;
	}
	if(tmp1) {
		var a = m1.c2;
		var b = n1.c2;
		tmp = a.x == b.x && a.y == b.y && a.z == b.z && a.w == b.w;
	} else {
		tmp = false;
	}
	if(tmp) {
		var a = m1.c3;
		var b = n1.c3;
		if(a.x == b.x && a.y == b.y && a.z == b.z) {
			return a.w == b.w;
		} else {
			return false;
		}
	} else {
		return false;
	}
};
Mat4.notEqual = function(m,n) {
	var m1 = m;
	var n1 = n;
	var tmp;
	var tmp1;
	var tmp2;
	var a = m1.c0;
	var b = n1.c0;
	if(a.x == b.x && a.y == b.y && a.z == b.z && a.w == b.w) {
		var a = m1.c1;
		var b = n1.c1;
		tmp2 = a.x == b.x && a.y == b.y && a.z == b.z && a.w == b.w;
	} else {
		tmp2 = false;
	}
	if(tmp2) {
		var a = m1.c2;
		var b = n1.c2;
		tmp1 = a.x == b.x && a.y == b.y && a.z == b.z && a.w == b.w;
	} else {
		tmp1 = false;
	}
	if(tmp1) {
		var a = m1.c3;
		var b = n1.c3;
		tmp = a.x == b.x && a.y == b.y && a.z == b.z && a.w == b.w;
	} else {
		tmp = false;
	}
	return !tmp;
};
var Mat4Data = function(a00,a01,a02,a03,a10,a11,a12,a13,a20,a21,a22,a23,a30,a31,a32,a33) {
	var this1 = new Vec4Data(a00,a01,a02,a03);
	this.c0 = this1;
	var this1 = new Vec4Data(a10,a11,a12,a13);
	this.c1 = this1;
	var this1 = new Vec4Data(a20,a21,a22,a23);
	this.c2 = this1;
	var this1 = new Vec4Data(a30,a31,a32,a33);
	this.c3 = this1;
};
$hxClasses["Mat4Data"] = Mat4Data;
Mat4Data.__name__ = "Mat4Data";
Mat4Data.prototype = {
	__class__: Mat4Data
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
var Vec2 = {};
Vec2.get_x = function(this1) {
	return this1.x;
};
Vec2.set_x = function(this1,v) {
	return this1.x = v;
};
Vec2.get_y = function(this1) {
	return this1.y;
};
Vec2.set_y = function(this1,v) {
	return this1.y = v;
};
Vec2._new = function(x,y) {
	var this1 = new Vec2Data(x,y);
	return this1;
};
Vec2.set = function(this1,x,y) {
	this1.x = x;
	this1.y = y;
};
Vec2.clone = function(this1) {
	var this2 = new Vec2Data(this1.x,this1.y);
	return this2;
};
Vec2.radians = function(this1) {
	var a = this1;
	var b = Math.PI;
	var a_x = a.x * b;
	var a_y = a.y * b;
	var this1 = new Vec2Data(a_x / 180,a_y / 180);
	return this1;
};
Vec2.degrees = function(this1) {
	var a = this1;
	var a_x = a.x * 180;
	var a_y = a.y * 180;
	var b = Math.PI;
	var this1 = new Vec2Data(a_x / b,a_y / b);
	return this1;
};
Vec2.sin = function(this1) {
	var this2 = new Vec2Data(Math.sin(this1.x),Math.sin(this1.y));
	return this2;
};
Vec2.cos = function(this1) {
	var this2 = new Vec2Data(Math.cos(this1.x),Math.cos(this1.y));
	return this2;
};
Vec2.tan = function(this1) {
	var this2 = new Vec2Data(Math.tan(this1.x),Math.tan(this1.y));
	return this2;
};
Vec2.asin = function(this1) {
	var this2 = new Vec2Data(Math.asin(this1.x),Math.asin(this1.y));
	return this2;
};
Vec2.acos = function(this1) {
	var this2 = new Vec2Data(Math.acos(this1.x),Math.acos(this1.y));
	return this2;
};
Vec2.atan = function(this1) {
	var this2 = new Vec2Data(Math.atan(this1.x),Math.atan(this1.y));
	return this2;
};
Vec2.atan2 = function(this1,b) {
	var this2 = new Vec2Data(Math.atan2(this1.x,b.x),Math.atan2(this1.y,b.y));
	return this2;
};
Vec2.pow = function(this1,e) {
	var this2 = new Vec2Data(Math.pow(this1.x,e.x),Math.pow(this1.y,e.y));
	return this2;
};
Vec2.exp = function(this1) {
	var this2 = new Vec2Data(Math.exp(this1.x),Math.exp(this1.y));
	return this2;
};
Vec2.log = function(this1) {
	var this2 = new Vec2Data(Math.log(this1.x),Math.log(this1.y));
	return this2;
};
Vec2.exp2 = function(this1) {
	var this2 = new Vec2Data(Math.pow(2,this1.x),Math.pow(2,this1.y));
	return this2;
};
Vec2.log2 = function(this1) {
	var v = this1.x;
	var l2 = Math.log(v) * 1.4426950408889634;
	var isPot;
	if(v % 1 == 0) {
		var i = v | 0;
		isPot = (i & i - 1) == 0;
	} else {
		isPot = false;
	}
	var v = this1.y;
	var l21 = Math.log(v) * 1.4426950408889634;
	var isPot1;
	if(v % 1 == 0) {
		var i = v | 0;
		isPot1 = (i & i - 1) == 0;
	} else {
		isPot1 = false;
	}
	var this1 = new Vec2Data(isPot ? Math.round(l2) : l2,isPot1 ? Math.round(l21) : l21);
	return this1;
};
Vec2.sqrt = function(this1) {
	var this2 = new Vec2Data(Math.sqrt(this1.x),Math.sqrt(this1.y));
	return this2;
};
Vec2.inverseSqrt = function(this1) {
	var b_x = Math.sqrt(this1.x);
	var b_y = Math.sqrt(this1.y);
	var this1 = new Vec2Data(1.0 / b_x,1.0 / b_y);
	return this1;
};
Vec2.abs = function(this1) {
	var this2 = new Vec2Data(Math.abs(this1.x),Math.abs(this1.y));
	return this2;
};
Vec2.sign = function(this1) {
	var this2 = new Vec2Data(this1.x > 0. ? 1. : this1.x < 0. ? -1. : 0.,this1.y > 0. ? 1. : this1.y < 0. ? -1. : 0.);
	return this2;
};
Vec2.floor = function(this1) {
	var this2 = new Vec2Data(Math.floor(this1.x),Math.floor(this1.y));
	return this2;
};
Vec2.ceil = function(this1) {
	var this2 = new Vec2Data(Math.ceil(this1.x),Math.ceil(this1.y));
	return this2;
};
Vec2.fract = function(this1) {
	var a = this1;
	var b_x = Math.floor(this1.x);
	var b_y = Math.floor(this1.y);
	var this1 = new Vec2Data(a.x - b_x,a.y - b_y);
	return this1;
};
Vec2.$length = function(this1) {
	return Math.sqrt(this1.x * this1.x + this1.y * this1.y);
};
Vec2.distance = function(this1,b) {
	var this_x = b.x - this1.x;
	var this_y = b.y - this1.y;
	return Math.sqrt(this_x * this_x + this_y * this_y);
};
Vec2.dot = function(this1,b) {
	return this1.x * b.x + this1.y * b.y;
};
Vec2.normalize = function(this1) {
	var v = this1;
	var lenSq = v.x * this1.x + v.y * this1.y;
	var denominator = lenSq == 0.0 ? 1.0 : Math.sqrt(lenSq);
	var this1 = new Vec2Data(v.x / denominator,v.y / denominator);
	return this1;
};
Vec2.faceforward = function(this1,I,Nref) {
	var a_x = this1.x;
	var a_y = this1.y;
	var b = Nref.x * I.x + Nref.y * I.y < 0 ? 1 : -1;
	var this1 = new Vec2Data(a_x * b,a_y * b);
	return this1;
};
Vec2.reflect = function(this1,N) {
	var I = this1;
	var lhs = 2 * (N.x * I.x + N.y * I.y);
	var rhs = N;
	var b_x = rhs.x * lhs;
	var b_y = rhs.y * lhs;
	var this1 = new Vec2Data(I.x - b_x,I.y - b_y);
	return this1;
};
Vec2.refract = function(this1,N,eta) {
	var I = this1;
	var nDotI = N.x * I.x + N.y * I.y;
	var k = 1.0 - eta * eta * (1.0 - nDotI * nDotI);
	var lhs = eta;
	var rhs = I;
	var a_x = rhs.x * lhs;
	var a_y = rhs.y * lhs;
	var lhs = eta * nDotI + Math.sqrt(k);
	var rhs = N;
	var b_x = rhs.x * lhs;
	var b_y = rhs.y * lhs;
	var a_x1 = a_x - b_x;
	var a_y1 = a_y - b_y;
	var b = k < 0.0 ? 0.0 : 1.0;
	var this1 = new Vec2Data(a_x1 * b,a_y1 * b);
	return this1;
};
Vec2.toString = function(this1) {
	return "vec2(" + this1.x + ", " + this1.y + ")";
};
Vec2.arrayRead = function(this1,i) {
	switch(i) {
	case 0:
		return this1.x;
	case 1:
		return this1.y;
	default:
		return null;
	}
};
Vec2.arrayWrite = function(this1,i,v) {
	switch(i) {
	case 0:
		return this1.x = v;
	case 1:
		return this1.y = v;
	default:
		return null;
	}
};
Vec2.neg = function(a) {
	var this1 = new Vec2Data(-a.x,-a.y);
	return this1;
};
Vec2.prefixIncrement = function(a) {
	a.x += 1;
	a.y += 1;
	var this1 = new Vec2Data(a.x,a.y);
	return this1;
};
Vec2.prefixDecrement = function(a) {
	a.x -= 1;
	a.y -= 1;
	var this1 = new Vec2Data(a.x,a.y);
	return this1;
};
Vec2.postfixIncrement = function(a) {
	var this1 = new Vec2Data(a.x,a.y);
	var ret = this1;
	a.x += 1;
	a.y += 1;
	return ret;
};
Vec2.postfixDecrement = function(a) {
	var this1 = new Vec2Data(a.x,a.y);
	var ret = this1;
	a.x -= 1;
	a.y -= 1;
	return ret;
};
Vec2.mulEq = function(a,b) {
	var self = a;
	var source_x = a.x * b.x;
	var source_y = a.y * b.y;
	self.x = source_x;
	self.y = source_y;
	return self;
};
Vec2.mulEqMat = function(a,b) {
	var self = a;
	var m = b;
	var b = m.c0;
	var b1 = m.c1;
	var source_x = a.x * b.x + a.y * b.y;
	var source_y = a.x * b1.x + a.y * b1.y;
	self.x = source_x;
	self.y = source_y;
	return self;
};
Vec2.mulEqScalar = function(a,f) {
	var self = a;
	var source_x = a.x * f;
	var source_y = a.y * f;
	self.x = source_x;
	self.y = source_y;
	return self;
};
Vec2.divEq = function(a,b) {
	var self = a;
	var source_x = a.x / b.x;
	var source_y = a.y / b.y;
	self.x = source_x;
	self.y = source_y;
	return self;
};
Vec2.divEqScalar = function(a,f) {
	var self = a;
	var source_x = a.x / f;
	var source_y = a.y / f;
	self.x = source_x;
	self.y = source_y;
	return self;
};
Vec2.addEq = function(a,b) {
	var self = a;
	var source_x = a.x + b.x;
	var source_y = a.y + b.y;
	self.x = source_x;
	self.y = source_y;
	return self;
};
Vec2.addEqScalar = function(a,f) {
	var self = a;
	var source_x = a.x + f;
	var source_y = a.y + f;
	self.x = source_x;
	self.y = source_y;
	return self;
};
Vec2.subEq = function(a,b) {
	var self = a;
	var source_x = a.x - b.x;
	var source_y = a.y - b.y;
	self.x = source_x;
	self.y = source_y;
	return self;
};
Vec2.subEqScalar = function(a,f) {
	var self = a;
	var source_x = a.x - f;
	var source_y = a.y - f;
	self.x = source_x;
	self.y = source_y;
	return self;
};
Vec2.mul = function(a,b) {
	var this1 = new Vec2Data(a.x * b.x,a.y * b.y);
	return this1;
};
Vec2.mulScalar = function(a,b) {
	var this1 = new Vec2Data(a.x * b,a.y * b);
	return this1;
};
Vec2.div = function(a,b) {
	var this1 = new Vec2Data(a.x / b.x,a.y / b.y);
	return this1;
};
Vec2.divScalar = function(a,b) {
	var this1 = new Vec2Data(a.x / b,a.y / b);
	return this1;
};
Vec2.divScalarInv = function(a,b) {
	var this1 = new Vec2Data(a / b.x,a / b.y);
	return this1;
};
Vec2.add = function(a,b) {
	var this1 = new Vec2Data(a.x + b.x,a.y + b.y);
	return this1;
};
Vec2.addScalar = function(a,b) {
	var this1 = new Vec2Data(a.x + b,a.y + b);
	return this1;
};
Vec2.sub = function(a,b) {
	var this1 = new Vec2Data(a.x - b.x,a.y - b.y);
	return this1;
};
Vec2.subScalar = function(a,b) {
	var this1 = new Vec2Data(a.x - b,a.y - b);
	return this1;
};
Vec2.subScalarInv = function(a,b) {
	var this1 = new Vec2Data(a - b.x,a - b.y);
	return this1;
};
Vec2.equal = function(a,b) {
	if(a.x == b.x) {
		return a.y == b.y;
	} else {
		return false;
	}
};
Vec2.notEqual = function(a,b) {
	return !(a.x == b.x && a.y == b.y);
};
var Vec2Data = function(x,y) {
	this.x = x;
	this.y = y;
};
$hxClasses["Vec2Data"] = Vec2Data;
Vec2Data.__name__ = "Vec2Data";
Vec2Data.prototype = {
	__class__: Vec2Data
};
var Vec3 = {};
Vec3.get_x = function(this1) {
	return this1.x;
};
Vec3.set_x = function(this1,v) {
	return this1.x = v;
};
Vec3.get_y = function(this1) {
	return this1.y;
};
Vec3.set_y = function(this1,v) {
	return this1.y = v;
};
Vec3.get_z = function(this1) {
	return this1.z;
};
Vec3.set_z = function(this1,v) {
	return this1.z = v;
};
Vec3._new = function(x,y,z) {
	var this1 = new Vec3Data(x,y,z);
	return this1;
};
Vec3.set = function(this1,x,y,z) {
	this1.x = x;
	this1.y = y;
	this1.z = z;
};
Vec3.clone = function(this1) {
	var this2 = new Vec3Data(this1.x,this1.y,this1.z);
	return this2;
};
Vec3.cross = function(this1,b) {
	var this2 = new Vec3Data(this1.y * b.z - this1.z * b.y,this1.z * b.x - this1.x * b.z,this1.x * b.y - this1.y * b.x);
	return this2;
};
Vec3.radians = function(this1) {
	var a = this1;
	var b = Math.PI;
	var a_x = a.x * b;
	var a_y = a.y * b;
	var a_z = a.z * b;
	var this1 = new Vec3Data(a_x / 180,a_y / 180,a_z / 180);
	return this1;
};
Vec3.degrees = function(this1) {
	var a = this1;
	var a_x = a.x * 180;
	var a_y = a.y * 180;
	var a_z = a.z * 180;
	var b = Math.PI;
	var this1 = new Vec3Data(a_x / b,a_y / b,a_z / b);
	return this1;
};
Vec3.sin = function(this1) {
	var this2 = new Vec3Data(Math.sin(this1.x),Math.sin(this1.y),Math.sin(this1.z));
	return this2;
};
Vec3.cos = function(this1) {
	var this2 = new Vec3Data(Math.cos(this1.x),Math.cos(this1.y),Math.cos(this1.z));
	return this2;
};
Vec3.tan = function(this1) {
	var this2 = new Vec3Data(Math.tan(this1.x),Math.tan(this1.y),Math.tan(this1.z));
	return this2;
};
Vec3.asin = function(this1) {
	var this2 = new Vec3Data(Math.asin(this1.x),Math.asin(this1.y),Math.asin(this1.z));
	return this2;
};
Vec3.acos = function(this1) {
	var this2 = new Vec3Data(Math.acos(this1.x),Math.acos(this1.y),Math.acos(this1.z));
	return this2;
};
Vec3.atan = function(this1) {
	var this2 = new Vec3Data(Math.atan(this1.x),Math.atan(this1.y),Math.atan(this1.z));
	return this2;
};
Vec3.atan2 = function(this1,b) {
	var this2 = new Vec3Data(Math.atan2(this1.x,b.x),Math.atan2(this1.y,b.y),Math.atan2(this1.z,b.z));
	return this2;
};
Vec3.pow = function(this1,e) {
	var this2 = new Vec3Data(Math.pow(this1.x,e.x),Math.pow(this1.y,e.y),Math.pow(this1.z,e.z));
	return this2;
};
Vec3.exp = function(this1) {
	var this2 = new Vec3Data(Math.exp(this1.x),Math.exp(this1.y),Math.exp(this1.z));
	return this2;
};
Vec3.log = function(this1) {
	var this2 = new Vec3Data(Math.log(this1.x),Math.log(this1.y),Math.log(this1.z));
	return this2;
};
Vec3.exp2 = function(this1) {
	var this2 = new Vec3Data(Math.pow(2,this1.x),Math.pow(2,this1.y),Math.pow(2,this1.z));
	return this2;
};
Vec3.log2 = function(this1) {
	var v = this1.x;
	var l2 = Math.log(v) * 1.4426950408889634;
	var isPot;
	if(v % 1 == 0) {
		var i = v | 0;
		isPot = (i & i - 1) == 0;
	} else {
		isPot = false;
	}
	var v = this1.y;
	var l21 = Math.log(v) * 1.4426950408889634;
	var isPot1;
	if(v % 1 == 0) {
		var i = v | 0;
		isPot1 = (i & i - 1) == 0;
	} else {
		isPot1 = false;
	}
	var v = this1.z;
	var l22 = Math.log(v) * 1.4426950408889634;
	var isPot2;
	if(v % 1 == 0) {
		var i = v | 0;
		isPot2 = (i & i - 1) == 0;
	} else {
		isPot2 = false;
	}
	var this1 = new Vec3Data(isPot ? Math.round(l2) : l2,isPot1 ? Math.round(l21) : l21,isPot2 ? Math.round(l22) : l22);
	return this1;
};
Vec3.sqrt = function(this1) {
	var this2 = new Vec3Data(Math.sqrt(this1.x),Math.sqrt(this1.y),Math.sqrt(this1.z));
	return this2;
};
Vec3.inverseSqrt = function(this1) {
	var b_x = Math.sqrt(this1.x);
	var b_y = Math.sqrt(this1.y);
	var b_z = Math.sqrt(this1.z);
	var this1 = new Vec3Data(1.0 / b_x,1.0 / b_y,1.0 / b_z);
	return this1;
};
Vec3.abs = function(this1) {
	var this2 = new Vec3Data(Math.abs(this1.x),Math.abs(this1.y),Math.abs(this1.z));
	return this2;
};
Vec3.sign = function(this1) {
	var this2 = new Vec3Data(this1.x > 0. ? 1. : this1.x < 0. ? -1. : 0.,this1.y > 0. ? 1. : this1.y < 0. ? -1. : 0.,this1.z > 0. ? 1. : this1.z < 0. ? -1. : 0.);
	return this2;
};
Vec3.floor = function(this1) {
	var this2 = new Vec3Data(Math.floor(this1.x),Math.floor(this1.y),Math.floor(this1.z));
	return this2;
};
Vec3.ceil = function(this1) {
	var this2 = new Vec3Data(Math.ceil(this1.x),Math.ceil(this1.y),Math.ceil(this1.z));
	return this2;
};
Vec3.fract = function(this1) {
	var a = this1;
	var b_x = Math.floor(this1.x);
	var b_y = Math.floor(this1.y);
	var b_z = Math.floor(this1.z);
	var this1 = new Vec3Data(a.x - b_x,a.y - b_y,a.z - b_z);
	return this1;
};
Vec3.$length = function(this1) {
	return Math.sqrt(this1.x * this1.x + this1.y * this1.y + this1.z * this1.z);
};
Vec3.distance = function(this1,b) {
	var this_x = b.x - this1.x;
	var this_y = b.y - this1.y;
	var this_z = b.z - this1.z;
	return Math.sqrt(this_x * this_x + this_y * this_y + this_z * this_z);
};
Vec3.dot = function(this1,b) {
	return this1.x * b.x + this1.y * b.y + this1.z * b.z;
};
Vec3.normalize = function(this1) {
	var v = this1;
	var lenSq = v.x * this1.x + v.y * this1.y + v.z * this1.z;
	var denominator = lenSq == 0.0 ? 1.0 : Math.sqrt(lenSq);
	var this1 = new Vec3Data(v.x / denominator,v.y / denominator,v.z / denominator);
	return this1;
};
Vec3.faceforward = function(this1,I,Nref) {
	var a_x = this1.x;
	var a_y = this1.y;
	var a_z = this1.z;
	var b = Nref.x * I.x + Nref.y * I.y + Nref.z * I.z < 0 ? 1 : -1;
	var this1 = new Vec3Data(a_x * b,a_y * b,a_z * b);
	return this1;
};
Vec3.reflect = function(this1,N) {
	var I = this1;
	var lhs = 2 * (N.x * I.x + N.y * I.y + N.z * I.z);
	var rhs = N;
	var b_x = rhs.x * lhs;
	var b_y = rhs.y * lhs;
	var b_z = rhs.z * lhs;
	var this1 = new Vec3Data(I.x - b_x,I.y - b_y,I.z - b_z);
	return this1;
};
Vec3.refract = function(this1,N,eta) {
	var I = this1;
	var nDotI = N.x * I.x + N.y * I.y + N.z * I.z;
	var k = 1.0 - eta * eta * (1.0 - nDotI * nDotI);
	var lhs = eta;
	var rhs = I;
	var a_x = rhs.x * lhs;
	var a_y = rhs.y * lhs;
	var a_z = rhs.z * lhs;
	var lhs = eta * nDotI + Math.sqrt(k);
	var rhs = N;
	var b_x = rhs.x * lhs;
	var b_y = rhs.y * lhs;
	var b_z = rhs.z * lhs;
	var a_x1 = a_x - b_x;
	var a_y1 = a_y - b_y;
	var a_z1 = a_z - b_z;
	var b = k < 0.0 ? 0.0 : 1.0;
	var this1 = new Vec3Data(a_x1 * b,a_y1 * b,a_z1 * b);
	return this1;
};
Vec3.toString = function(this1) {
	return "vec3(" + this1.x + ", " + this1.y + ", " + this1.z + ")";
};
Vec3.arrayRead = function(this1,i) {
	switch(i) {
	case 0:
		return this1.x;
	case 1:
		return this1.y;
	case 2:
		return this1.z;
	default:
		return null;
	}
};
Vec3.arrayWrite = function(this1,i,v) {
	switch(i) {
	case 0:
		return this1.x = v;
	case 1:
		return this1.y = v;
	case 2:
		return this1.z = v;
	default:
		return null;
	}
};
Vec3.neg = function(a) {
	var this1 = new Vec3Data(-a.x,-a.y,-a.z);
	return this1;
};
Vec3.prefixIncrement = function(a) {
	a.x += 1;
	a.y += 1;
	a.z += 1;
	var this1 = new Vec3Data(a.x,a.y,a.z);
	return this1;
};
Vec3.prefixDecrement = function(a) {
	a.x -= 1;
	a.y -= 1;
	a.z -= 1;
	var this1 = new Vec3Data(a.x,a.y,a.z);
	return this1;
};
Vec3.postfixIncrement = function(a) {
	var this1 = new Vec3Data(a.x,a.y,a.z);
	var ret = this1;
	a.x += 1;
	a.y += 1;
	a.z += 1;
	return ret;
};
Vec3.postfixDecrement = function(a) {
	var this1 = new Vec3Data(a.x,a.y,a.z);
	var ret = this1;
	a.x -= 1;
	a.y -= 1;
	a.z -= 1;
	return ret;
};
Vec3.mulEq = function(a,b) {
	var self = a;
	var source_x = a.x * b.x;
	var source_y = a.y * b.y;
	var source_z = a.z * b.z;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	return self;
};
Vec3.mulEqMat = function(a,b) {
	var self = a;
	var m = b;
	var b = m.c0;
	var b1 = m.c1;
	var b2 = m.c2;
	var source_x = a.x * b.x + a.y * b.y + a.z * b.z;
	var source_y = a.x * b1.x + a.y * b1.y + a.z * b1.z;
	var source_z = a.x * b2.x + a.y * b2.y + a.z * b2.z;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	return self;
};
Vec3.mulEqScalar = function(a,f) {
	var self = a;
	var source_x = a.x * f;
	var source_y = a.y * f;
	var source_z = a.z * f;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	return self;
};
Vec3.divEq = function(a,b) {
	var self = a;
	var source_x = a.x / b.x;
	var source_y = a.y / b.y;
	var source_z = a.z / b.z;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	return self;
};
Vec3.divEqScalar = function(a,f) {
	var self = a;
	var source_x = a.x / f;
	var source_y = a.y / f;
	var source_z = a.z / f;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	return self;
};
Vec3.addEq = function(a,b) {
	var self = a;
	var source_x = a.x + b.x;
	var source_y = a.y + b.y;
	var source_z = a.z + b.z;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	return self;
};
Vec3.addEqScalar = function(a,f) {
	var self = a;
	var source_x = a.x + f;
	var source_y = a.y + f;
	var source_z = a.z + f;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	return self;
};
Vec3.subEq = function(a,b) {
	var self = a;
	var source_x = a.x - b.x;
	var source_y = a.y - b.y;
	var source_z = a.z - b.z;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	return self;
};
Vec3.subEqScalar = function(a,f) {
	var self = a;
	var source_x = a.x - f;
	var source_y = a.y - f;
	var source_z = a.z - f;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	return self;
};
Vec3.mul = function(a,b) {
	var this1 = new Vec3Data(a.x * b.x,a.y * b.y,a.z * b.z);
	return this1;
};
Vec3.mulScalar = function(a,b) {
	var this1 = new Vec3Data(a.x * b,a.y * b,a.z * b);
	return this1;
};
Vec3.div = function(a,b) {
	var this1 = new Vec3Data(a.x / b.x,a.y / b.y,a.z / b.z);
	return this1;
};
Vec3.divScalar = function(a,b) {
	var this1 = new Vec3Data(a.x / b,a.y / b,a.z / b);
	return this1;
};
Vec3.divScalarInv = function(a,b) {
	var this1 = new Vec3Data(a / b.x,a / b.y,a / b.z);
	return this1;
};
Vec3.add = function(a,b) {
	var this1 = new Vec3Data(a.x + b.x,a.y + b.y,a.z + b.z);
	return this1;
};
Vec3.addScalar = function(a,b) {
	var this1 = new Vec3Data(a.x + b,a.y + b,a.z + b);
	return this1;
};
Vec3.sub = function(a,b) {
	var this1 = new Vec3Data(a.x - b.x,a.y - b.y,a.z - b.z);
	return this1;
};
Vec3.subScalar = function(a,b) {
	var this1 = new Vec3Data(a.x - b,a.y - b,a.z - b);
	return this1;
};
Vec3.subScalarInv = function(a,b) {
	var this1 = new Vec3Data(a - b.x,a - b.y,a - b.z);
	return this1;
};
Vec3.equal = function(a,b) {
	if(a.x == b.x && a.y == b.y) {
		return a.z == b.z;
	} else {
		return false;
	}
};
Vec3.notEqual = function(a,b) {
	return !(a.x == b.x && a.y == b.y && a.z == b.z);
};
var Vec3Data = function(x,y,z) {
	this.x = x;
	this.y = y;
	this.z = z;
};
$hxClasses["Vec3Data"] = Vec3Data;
Vec3Data.__name__ = "Vec3Data";
Vec3Data.prototype = {
	__class__: Vec3Data
};
var Vec4 = {};
Vec4.get_x = function(this1) {
	return this1.x;
};
Vec4.set_x = function(this1,v) {
	return this1.x = v;
};
Vec4.get_y = function(this1) {
	return this1.y;
};
Vec4.set_y = function(this1,v) {
	return this1.y = v;
};
Vec4.get_z = function(this1) {
	return this1.z;
};
Vec4.set_z = function(this1,v) {
	return this1.z = v;
};
Vec4.get_w = function(this1) {
	return this1.w;
};
Vec4.set_w = function(this1,v) {
	return this1.w = v;
};
Vec4._new = function(x,y,z,w) {
	var this1 = new Vec4Data(x,y,z,w);
	return this1;
};
Vec4.set = function(this1,x,y,z,w) {
	this1.x = x;
	this1.y = y;
	this1.z = z;
	this1.w = w;
};
Vec4.clone = function(this1) {
	var this2 = new Vec4Data(this1.x,this1.y,this1.z,this1.w);
	return this2;
};
Vec4.radians = function(this1) {
	var a = this1;
	var b = Math.PI;
	var a_x = a.x * b;
	var a_y = a.y * b;
	var a_z = a.z * b;
	var a_w = a.w * b;
	var this1 = new Vec4Data(a_x / 180,a_y / 180,a_z / 180,a_w / 180);
	return this1;
};
Vec4.degrees = function(this1) {
	var a = this1;
	var a_x = a.x * 180;
	var a_y = a.y * 180;
	var a_z = a.z * 180;
	var a_w = a.w * 180;
	var b = Math.PI;
	var this1 = new Vec4Data(a_x / b,a_y / b,a_z / b,a_w / b);
	return this1;
};
Vec4.sin = function(this1) {
	var this2 = new Vec4Data(Math.sin(this1.x),Math.sin(this1.y),Math.sin(this1.z),Math.sin(this1.w));
	return this2;
};
Vec4.cos = function(this1) {
	var this2 = new Vec4Data(Math.cos(this1.x),Math.cos(this1.y),Math.cos(this1.z),Math.cos(this1.w));
	return this2;
};
Vec4.tan = function(this1) {
	var this2 = new Vec4Data(Math.tan(this1.x),Math.tan(this1.y),Math.tan(this1.z),Math.tan(this1.w));
	return this2;
};
Vec4.asin = function(this1) {
	var this2 = new Vec4Data(Math.asin(this1.x),Math.asin(this1.y),Math.asin(this1.z),Math.asin(this1.w));
	return this2;
};
Vec4.acos = function(this1) {
	var this2 = new Vec4Data(Math.acos(this1.x),Math.acos(this1.y),Math.acos(this1.z),Math.acos(this1.w));
	return this2;
};
Vec4.atan = function(this1) {
	var this2 = new Vec4Data(Math.atan(this1.x),Math.atan(this1.y),Math.atan(this1.z),Math.atan(this1.w));
	return this2;
};
Vec4.atan2 = function(this1,b) {
	var this2 = new Vec4Data(Math.atan2(this1.x,b.x),Math.atan2(this1.y,b.y),Math.atan2(this1.z,b.z),Math.atan2(this1.w,b.w));
	return this2;
};
Vec4.pow = function(this1,e) {
	var this2 = new Vec4Data(Math.pow(this1.x,e.x),Math.pow(this1.y,e.y),Math.pow(this1.z,e.z),Math.pow(this1.w,e.w));
	return this2;
};
Vec4.exp = function(this1) {
	var this2 = new Vec4Data(Math.exp(this1.x),Math.exp(this1.y),Math.exp(this1.z),Math.exp(this1.w));
	return this2;
};
Vec4.log = function(this1) {
	var this2 = new Vec4Data(Math.log(this1.x),Math.log(this1.y),Math.log(this1.z),Math.log(this1.w));
	return this2;
};
Vec4.exp2 = function(this1) {
	var this2 = new Vec4Data(Math.pow(2,this1.x),Math.pow(2,this1.y),Math.pow(2,this1.z),Math.pow(2,this1.w));
	return this2;
};
Vec4.log2 = function(this1) {
	var v = this1.x;
	var l2 = Math.log(v) * 1.4426950408889634;
	var isPot;
	if(v % 1 == 0) {
		var i = v | 0;
		isPot = (i & i - 1) == 0;
	} else {
		isPot = false;
	}
	var v = this1.y;
	var l21 = Math.log(v) * 1.4426950408889634;
	var isPot1;
	if(v % 1 == 0) {
		var i = v | 0;
		isPot1 = (i & i - 1) == 0;
	} else {
		isPot1 = false;
	}
	var v = this1.z;
	var l22 = Math.log(v) * 1.4426950408889634;
	var isPot2;
	if(v % 1 == 0) {
		var i = v | 0;
		isPot2 = (i & i - 1) == 0;
	} else {
		isPot2 = false;
	}
	var v = this1.w;
	var l23 = Math.log(v) * 1.4426950408889634;
	var isPot3;
	if(v % 1 == 0) {
		var i = v | 0;
		isPot3 = (i & i - 1) == 0;
	} else {
		isPot3 = false;
	}
	var this1 = new Vec4Data(isPot ? Math.round(l2) : l2,isPot1 ? Math.round(l21) : l21,isPot2 ? Math.round(l22) : l22,isPot3 ? Math.round(l23) : l23);
	return this1;
};
Vec4.sqrt = function(this1) {
	var this2 = new Vec4Data(Math.sqrt(this1.x),Math.sqrt(this1.y),Math.sqrt(this1.z),Math.sqrt(this1.w));
	return this2;
};
Vec4.inverseSqrt = function(this1) {
	var b_x = Math.sqrt(this1.x);
	var b_y = Math.sqrt(this1.y);
	var b_z = Math.sqrt(this1.z);
	var b_w = Math.sqrt(this1.w);
	var this1 = new Vec4Data(1.0 / b_x,1.0 / b_y,1.0 / b_z,1.0 / b_w);
	return this1;
};
Vec4.abs = function(this1) {
	var this2 = new Vec4Data(Math.abs(this1.x),Math.abs(this1.y),Math.abs(this1.z),Math.abs(this1.w));
	return this2;
};
Vec4.sign = function(this1) {
	var this2 = new Vec4Data(this1.x > 0. ? 1. : this1.x < 0. ? -1. : 0.,this1.y > 0. ? 1. : this1.y < 0. ? -1. : 0.,this1.z > 0. ? 1. : this1.z < 0. ? -1. : 0.,this1.w > 0. ? 1. : this1.w < 0. ? -1. : 0.);
	return this2;
};
Vec4.floor = function(this1) {
	var this2 = new Vec4Data(Math.floor(this1.x),Math.floor(this1.y),Math.floor(this1.z),Math.floor(this1.w));
	return this2;
};
Vec4.ceil = function(this1) {
	var this2 = new Vec4Data(Math.ceil(this1.x),Math.ceil(this1.y),Math.ceil(this1.z),Math.ceil(this1.w));
	return this2;
};
Vec4.fract = function(this1) {
	var a = this1;
	var b_x = Math.floor(this1.x);
	var b_y = Math.floor(this1.y);
	var b_z = Math.floor(this1.z);
	var b_w = Math.floor(this1.w);
	var this1 = new Vec4Data(a.x - b_x,a.y - b_y,a.z - b_z,a.w - b_w);
	return this1;
};
Vec4.$length = function(this1) {
	return Math.sqrt(this1.x * this1.x + this1.y * this1.y + this1.z * this1.z + this1.w * this1.w);
};
Vec4.distance = function(this1,b) {
	var this_x = b.x - this1.x;
	var this_y = b.y - this1.y;
	var this_z = b.z - this1.z;
	var this_w = b.w - this1.w;
	return Math.sqrt(this_x * this_x + this_y * this_y + this_z * this_z + this_w * this_w);
};
Vec4.dot = function(this1,b) {
	return this1.x * b.x + this1.y * b.y + this1.z * b.z + this1.w * b.w;
};
Vec4.normalize = function(this1) {
	var v = this1;
	var lenSq = v.x * this1.x + v.y * this1.y + v.z * this1.z + v.w * this1.w;
	var denominator = lenSq == 0.0 ? 1.0 : Math.sqrt(lenSq);
	var this1 = new Vec4Data(v.x / denominator,v.y / denominator,v.z / denominator,v.w / denominator);
	return this1;
};
Vec4.faceforward = function(this1,I,Nref) {
	var a_x = this1.x;
	var a_y = this1.y;
	var a_z = this1.z;
	var a_w = this1.w;
	var b = Nref.x * I.x + Nref.y * I.y + Nref.z * I.z + Nref.w * I.w < 0 ? 1 : -1;
	var this1 = new Vec4Data(a_x * b,a_y * b,a_z * b,a_w * b);
	return this1;
};
Vec4.reflect = function(this1,N) {
	var I = this1;
	var lhs = 2 * (N.x * I.x + N.y * I.y + N.z * I.z + N.w * I.w);
	var rhs = N;
	var b_x = rhs.x * lhs;
	var b_y = rhs.y * lhs;
	var b_z = rhs.z * lhs;
	var b_w = rhs.w * lhs;
	var this1 = new Vec4Data(I.x - b_x,I.y - b_y,I.z - b_z,I.w - b_w);
	return this1;
};
Vec4.refract = function(this1,N,eta) {
	var I = this1;
	var nDotI = N.x * I.x + N.y * I.y + N.z * I.z + N.w * I.w;
	var k = 1.0 - eta * eta * (1.0 - nDotI * nDotI);
	var lhs = eta;
	var rhs = I;
	var a_x = rhs.x * lhs;
	var a_y = rhs.y * lhs;
	var a_z = rhs.z * lhs;
	var a_w = rhs.w * lhs;
	var lhs = eta * nDotI + Math.sqrt(k);
	var rhs = N;
	var b_x = rhs.x * lhs;
	var b_y = rhs.y * lhs;
	var b_z = rhs.z * lhs;
	var b_w = rhs.w * lhs;
	var a_x1 = a_x - b_x;
	var a_y1 = a_y - b_y;
	var a_z1 = a_z - b_z;
	var a_w1 = a_w - b_w;
	var b = k < 0.0 ? 0.0 : 1.0;
	var this1 = new Vec4Data(a_x1 * b,a_y1 * b,a_z1 * b,a_w1 * b);
	return this1;
};
Vec4.toString = function(this1) {
	return "vec4(" + this1.x + ", " + this1.y + ", " + this1.z + ", " + this1.w + ")";
};
Vec4.arrayRead = function(this1,i) {
	switch(i) {
	case 0:
		return this1.x;
	case 1:
		return this1.y;
	case 2:
		return this1.z;
	case 3:
		return this1.w;
	default:
		return null;
	}
};
Vec4.arrayWrite = function(this1,i,v) {
	switch(i) {
	case 0:
		return this1.x = v;
	case 1:
		return this1.y = v;
	case 2:
		return this1.z = v;
	case 3:
		return this1.w = v;
	default:
		return null;
	}
};
Vec4.neg = function(a) {
	var this1 = new Vec4Data(-a.x,-a.y,-a.z,-a.w);
	return this1;
};
Vec4.prefixIncrement = function(a) {
	a.x += 1;
	a.y += 1;
	a.z += 1;
	a.w += 1;
	var this1 = new Vec4Data(a.x,a.y,a.z,a.w);
	return this1;
};
Vec4.prefixDecrement = function(a) {
	a.x -= 1;
	a.y -= 1;
	a.z -= 1;
	a.w -= 1;
	var this1 = new Vec4Data(a.x,a.y,a.z,a.w);
	return this1;
};
Vec4.postfixIncrement = function(a) {
	var this1 = new Vec4Data(a.x,a.y,a.z,a.w);
	var ret = this1;
	a.x += 1;
	a.y += 1;
	a.z += 1;
	a.w += 1;
	return ret;
};
Vec4.postfixDecrement = function(a) {
	var this1 = new Vec4Data(a.x,a.y,a.z,a.w);
	var ret = this1;
	a.x -= 1;
	a.y -= 1;
	a.z -= 1;
	a.w -= 1;
	return ret;
};
Vec4.mulEq = function(a,b) {
	var self = a;
	var source_x = a.x * b.x;
	var source_y = a.y * b.y;
	var source_z = a.z * b.z;
	var source_w = a.w * b.w;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	self.w = source_w;
	return self;
};
Vec4.mulEqMat = function(a,b) {
	var self = a;
	var m = b;
	var b = m.c0;
	var b1 = m.c1;
	var b2 = m.c2;
	var b3 = m.c3;
	var source_x = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
	var source_y = a.x * b1.x + a.y * b1.y + a.z * b1.z + a.w * b1.w;
	var source_z = a.x * b2.x + a.y * b2.y + a.z * b2.z + a.w * b2.w;
	var source_w = a.x * b3.x + a.y * b3.y + a.z * b3.z + a.w * b3.w;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	self.w = source_w;
	return self;
};
Vec4.mulEqScalar = function(a,f) {
	var self = a;
	var source_x = a.x * f;
	var source_y = a.y * f;
	var source_z = a.z * f;
	var source_w = a.w * f;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	self.w = source_w;
	return self;
};
Vec4.divEq = function(a,b) {
	var self = a;
	var source_x = a.x / b.x;
	var source_y = a.y / b.y;
	var source_z = a.z / b.z;
	var source_w = a.w / b.w;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	self.w = source_w;
	return self;
};
Vec4.divEqScalar = function(a,f) {
	var self = a;
	var source_x = a.x / f;
	var source_y = a.y / f;
	var source_z = a.z / f;
	var source_w = a.w / f;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	self.w = source_w;
	return self;
};
Vec4.addEq = function(a,b) {
	var self = a;
	var source_x = a.x + b.x;
	var source_y = a.y + b.y;
	var source_z = a.z + b.z;
	var source_w = a.w + b.w;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	self.w = source_w;
	return self;
};
Vec4.addEqScalar = function(a,f) {
	var self = a;
	var source_x = a.x + f;
	var source_y = a.y + f;
	var source_z = a.z + f;
	var source_w = a.w + f;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	self.w = source_w;
	return self;
};
Vec4.subEq = function(a,b) {
	var self = a;
	var source_x = a.x - b.x;
	var source_y = a.y - b.y;
	var source_z = a.z - b.z;
	var source_w = a.w - b.w;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	self.w = source_w;
	return self;
};
Vec4.subEqScalar = function(a,f) {
	var self = a;
	var source_x = a.x - f;
	var source_y = a.y - f;
	var source_z = a.z - f;
	var source_w = a.w - f;
	self.x = source_x;
	self.y = source_y;
	self.z = source_z;
	self.w = source_w;
	return self;
};
Vec4.mul = function(a,b) {
	var this1 = new Vec4Data(a.x * b.x,a.y * b.y,a.z * b.z,a.w * b.w);
	return this1;
};
Vec4.mulScalar = function(a,b) {
	var this1 = new Vec4Data(a.x * b,a.y * b,a.z * b,a.w * b);
	return this1;
};
Vec4.div = function(a,b) {
	var this1 = new Vec4Data(a.x / b.x,a.y / b.y,a.z / b.z,a.w / b.w);
	return this1;
};
Vec4.divScalar = function(a,b) {
	var this1 = new Vec4Data(a.x / b,a.y / b,a.z / b,a.w / b);
	return this1;
};
Vec4.divScalarInv = function(a,b) {
	var this1 = new Vec4Data(a / b.x,a / b.y,a / b.z,a / b.w);
	return this1;
};
Vec4.add = function(a,b) {
	var this1 = new Vec4Data(a.x + b.x,a.y + b.y,a.z + b.z,a.w + b.w);
	return this1;
};
Vec4.addScalar = function(a,b) {
	var this1 = new Vec4Data(a.x + b,a.y + b,a.z + b,a.w + b);
	return this1;
};
Vec4.sub = function(a,b) {
	var this1 = new Vec4Data(a.x - b.x,a.y - b.y,a.z - b.z,a.w - b.w);
	return this1;
};
Vec4.subScalar = function(a,b) {
	var this1 = new Vec4Data(a.x - b,a.y - b,a.z - b,a.w - b);
	return this1;
};
Vec4.subScalarInv = function(a,b) {
	var this1 = new Vec4Data(a - b.x,a - b.y,a - b.z,a - b.w);
	return this1;
};
Vec4.equal = function(a,b) {
	if(a.x == b.x && a.y == b.y && a.z == b.z) {
		return a.w == b.w;
	} else {
		return false;
	}
};
Vec4.notEqual = function(a,b) {
	return !(a.x == b.x && a.y == b.y && a.z == b.z && a.w == b.w);
};
var Vec4Data = function(x,y,z,w) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
};
$hxClasses["Vec4Data"] = Vec4Data;
Vec4Data.__name__ = "Vec4Data";
Vec4Data.prototype = {
	__class__: Vec4Data
};
function VectorMath_cross(a,b) {
	var this1 = new Vec3Data(a.y * b.z - a.z * b.y,a.z * b.x - a.x * b.z,a.x * b.y - a.y * b.x);
	return this1;
}
function VectorMath_log2f(v) {
	var l2 = Math.log(v) * 1.4426950408889634;
	var isPot;
	if(v % 1 == 0) {
		var i = v | 0;
		isPot = (i & i - 1) == 0;
	} else {
		isPot = false;
	}
	if(isPot) {
		return Math.round(l2);
	} else {
		return l2;
	}
}
var common_IRobotGetter = function() { };
$hxClasses["common.IRobotGetter"] = common_IRobotGetter;
common_IRobotGetter.__name__ = "common.IRobotGetter";
common_IRobotGetter.__isInterface__ = true;
common_IRobotGetter.prototype = {
	__class__: common_IRobotGetter
};
var common_IRobot = function() { };
$hxClasses["common.IRobot"] = common_IRobot;
common_IRobot.__name__ = "common.IRobot";
common_IRobot.__isInterface__ = true;
common_IRobot.__interfaces__ = [common_IRobotGetter];
common_IRobot.prototype = {
	__class__: common_IRobot
};
var common_DefaultRobot = function() {
	var this1 = new Vec2Data(0,0);
	this._pos = this1;
};
$hxClasses["common.DefaultRobot"] = common_DefaultRobot;
common_DefaultRobot.__name__ = "common.DefaultRobot";
common_DefaultRobot.__interfaces__ = [common_IRobot];
common_DefaultRobot.prototype = {
	getPilot: function() {
		return this._pilot;
	}
	,setPilot: function(pilot) {
		this._pilot = pilot;
	}
	,getPosition: function() {
		return this._pos;
	}
	,setPosition: function(v) {
		this._pos = v;
	}
	,__class__: common_DefaultRobot
};
var common_IPilotGetter = function() { };
$hxClasses["common.IPilotGetter"] = common_IPilotGetter;
common_IPilotGetter.__name__ = "common.IPilotGetter";
common_IPilotGetter.__isInterface__ = true;
common_IPilotGetter.prototype = {
	__class__: common_IPilotGetter
};
var common_IPilot = function() { };
$hxClasses["common.IPilot"] = common_IPilot;
common_IPilot.__name__ = "common.IPilot";
common_IPilot.__isInterface__ = true;
common_IPilot.__interfaces__ = [common_IPilotGetter];
common_IPilot.prototype = {
	__class__: common_IPilot
};
var common_DefaultPilot = function() { };
$hxClasses["common.DefaultPilot"] = common_DefaultPilot;
common_DefaultPilot.__name__ = "common.DefaultPilot";
common_DefaultPilot.__interfaces__ = [common_IPilot];
common_DefaultPilot.prototype = {
	getRobot: function() {
		return this._robot;
	}
	,setRobot: function(robot) {
		this._robot = robot;
	}
	,__class__: common_DefaultPilot
};
var common_IMapGridGetter = function() { };
$hxClasses["common.IMapGridGetter"] = common_IMapGridGetter;
common_IMapGridGetter.__name__ = "common.IMapGridGetter";
common_IMapGridGetter.__isInterface__ = true;
var common_IMapGetter = function() { };
$hxClasses["common.IMapGetter"] = common_IMapGetter;
common_IMapGetter.__name__ = "common.IMapGetter";
common_IMapGetter.__isInterface__ = true;
common_IMapGetter.prototype = {
	__class__: common_IMapGetter
};
var common_IMap = function() { };
$hxClasses["common.IMap"] = common_IMap;
common_IMap.__name__ = "common.IMap";
common_IMap.__isInterface__ = true;
common_IMap.__interfaces__ = [common_IMapGetter];
var common_DefaultMap = function() {
	this._grids = [];
};
$hxClasses["common.DefaultMap"] = common_DefaultMap;
common_DefaultMap.__name__ = "common.DefaultMap";
common_DefaultMap.__interfaces__ = [common_IMap];
common_DefaultMap.prototype = {
	getGrid: function(pos) {
		return this._grids[0];
	}
	,getPath: function(s,e) {
		return [];
	}
	,__class__: common_DefaultMap
};
var common_IModelGetter = function() { };
$hxClasses["common.IModelGetter"] = common_IModelGetter;
common_IModelGetter.__name__ = "common.IModelGetter";
common_IModelGetter.__isInterface__ = true;
common_IModelGetter.prototype = {
	__class__: common_IModelGetter
};
var common_IModel = function() { };
$hxClasses["common.IModel"] = common_IModel;
common_IModel.__name__ = "common.IModel";
common_IModel.__isInterface__ = true;
common_IModel.__interfaces__ = [common_IModelGetter];
common_IModel.prototype = {
	__class__: common_IModel
};
var common_DefaultModel = function() {
	this._pilots = [];
	this._robots = [];
};
$hxClasses["common.DefaultModel"] = common_DefaultModel;
common_DefaultModel.__name__ = "common.DefaultModel";
common_DefaultModel.__interfaces__ = [common_IModel];
common_DefaultModel.prototype = {
	getRobots: function() {
		return this._robots;
	}
	,getPilots: function() {
		return this._pilots;
	}
	,setPilot: function(robot,pilot) {
		var robotWriter = js_Boot.__cast(robot , common_IRobot);
		var originPilot = robotWriter.getPilot();
		if(originPilot != null) {
			(js_Boot.__cast(originPilot , common_IPilot)).setRobot(null);
		}
		robotWriter.setPilot(pilot);
		if(pilot != null) {
			(js_Boot.__cast(pilot , common_IPilot)).setRobot(robot);
		}
		return robotWriter;
	}
	,__class__: common_DefaultModel
};
var han_Robot = function(model,id) {
	common_DefaultRobot.call(this);
	this._model = model;
	this._id = id;
};
$hxClasses["han.Robot"] = han_Robot;
han_Robot.__name__ = "han.Robot";
han_Robot.__super__ = common_DefaultRobot;
han_Robot.prototype = $extend(common_DefaultRobot.prototype,{
	__class__: han_Robot
});
var han_Pilot = function(model,id) {
	this._model = model;
	this._id = id;
};
$hxClasses["han.Pilot"] = han_Pilot;
han_Pilot.__name__ = "han.Pilot";
han_Pilot.__super__ = common_DefaultPilot;
han_Pilot.prototype = $extend(common_DefaultPilot.prototype,{
	__class__: han_Pilot
});
var han_Map = function() {
	common_DefaultMap.call(this);
};
$hxClasses["han.Map"] = han_Map;
han_Map.__name__ = "han.Map";
han_Map.__super__ = common_DefaultMap;
han_Map.prototype = $extend(common_DefaultMap.prototype,{
	__class__: han_Map
});
var han_Model = function() {
	this._map = new han_Map();
	this._id = 0;
	common_DefaultModel.call(this);
};
$hxClasses["han.Model"] = han_Model;
han_Model.__name__ = "han.Model";
han_Model.__super__ = common_DefaultModel;
han_Model.prototype = $extend(common_DefaultModel.prototype,{
	addRobot: function() {
		var tmp = new han_Robot(this,"" + this._id++);
		this._robots.push(tmp);
		return tmp;
	}
	,addPilot: function() {
		var tmp = new han_Pilot(this,"" + this._id++);
		this._pilots.push(tmp);
		return tmp;
	}
	,getMap: function() {
		return this._map;
	}
	,__class__: han_Model
});
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
	get_native: function() {
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
Main.main();
})(typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
