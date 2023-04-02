(function ($global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
Math.__name__ = true;
var TestVer2 = function() { };
TestVer2.__name__ = true;
TestVer2.main = function() {
	console.log("src/TestVer2.hx:5:","==== Test Start ====");
	var game = new model_ver2_design_DefaultGame();
	model_ver2_design_Default_test(game);
	console.log("src/TestVer2.hx:8:","==== Test Pass ====");
};
var haxe_ds_Option = $hxEnums["haxe.ds.Option"] = { __ename__:true,__constructs__:null
	,Some: ($_=function(v) { return {_hx_index:0,v:v,__enum__:"haxe.ds.Option",toString:$estr}; },$_._hx_name="Some",$_.__params__ = ["v"],$_)
	,None: {_hx_name:"None",_hx_index:1,__enum__:"haxe.ds.Option",toString:$estr}
};
haxe_ds_Option.__constructs__ = [haxe_ds_Option.Some,haxe_ds_Option.None];
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
haxe_iterators_ArrayIterator.__name__ = true;
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
};
var js_Boot = function() { };
js_Boot.__name__ = true;
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
var model_ver2_design_PlayerId = $hxEnums["model.ver2.design.PlayerId"] = { __ename__:true,__constructs__:null
	,A: {_hx_name:"A",_hx_index:0,__enum__:"model.ver2.design.PlayerId",toString:$estr}
	,B: {_hx_name:"B",_hx_index:1,__enum__:"model.ver2.design.PlayerId",toString:$estr}
};
model_ver2_design_PlayerId.__constructs__ = [model_ver2_design_PlayerId.A,model_ver2_design_PlayerId.B];
var model_ver2_design_BaSyou = $hxEnums["model.ver2.design.BaSyou"] = { __ename__:true,__constructs__:null
};
model_ver2_design_BaSyou.__constructs__ = [];
var model_ver2_design_DefaultTable = function() {
};
model_ver2_design_DefaultTable.__name__ = true;
model_ver2_design_DefaultTable.prototype = {
	getCards: function() {
		return [];
	}
	,getCardStacks: function() {
		return [];
	}
};
var model_ver2_design_CommandOwner = $hxEnums["model.ver2.design.CommandOwner"] = { __ename__:true,__constructs__:null
	,System: {_hx_name:"System",_hx_index:0,__enum__:"model.ver2.design.CommandOwner",toString:$estr}
	,Player: ($_=function(playerId) { return {_hx_index:1,playerId:playerId,__enum__:"model.ver2.design.CommandOwner",toString:$estr}; },$_._hx_name="Player",$_.__params__ = ["playerId"],$_)
};
model_ver2_design_CommandOwner.__constructs__ = [model_ver2_design_CommandOwner.System,model_ver2_design_CommandOwner.Player];
var model_ver2_design_CommandType = $hxEnums["model.ver2.design.CommandType"] = { __ename__:true,__constructs__:null
};
model_ver2_design_CommandType.__constructs__ = [];
var model_ver2_design_Timing = $hxEnums["model.ver2.design.Timing"] = { __ename__:true,__constructs__:null
	,Default: {_hx_name:"Default",_hx_index:0,__enum__:"model.ver2.design.Timing",toString:$estr}
};
model_ver2_design_Timing.__constructs__ = [model_ver2_design_Timing.Default];
var model_ver2_design_DefaultBattleController = function() {
};
model_ver2_design_DefaultBattleController.__name__ = true;
model_ver2_design_DefaultBattleController.prototype = {
	getTable: function() {
		return new model_ver2_design_DefaultTable();
	}
	,getTiming: function() {
		return model_ver2_design_Timing.Default;
	}
	,setTiming: function(timing,force) {
	}
	,getCommands: function(playerId) {
		return [];
	}
	,getCutController: function() {
		return null;
	}
};
var model_ver2_design_DefaultLobbyController = function() {
};
model_ver2_design_DefaultLobbyController.__name__ = true;
var model_ver2_design_CreateCardConfig = $hxEnums["model.ver2.design.CreateCardConfig"] = { __ename__:true,__constructs__:null
	,One: ($_=function(id,protoId,cardStackId) { return {_hx_index:0,id:id,protoId:protoId,cardStackId:cardStackId,__enum__:"model.ver2.design.CreateCardConfig",toString:$estr}; },$_._hx_name="One",$_.__params__ = ["id","protoId","cardStackId"],$_)
};
model_ver2_design_CreateCardConfig.__constructs__ = [model_ver2_design_CreateCardConfig.One];
var model_ver2_design_DefaultGame = function() {
};
model_ver2_design_DefaultGame.__name__ = true;
model_ver2_design_DefaultGame.prototype = {
	clear: function() {
	}
	,createCard: function(config) {
	}
	,getLobbyController: function() {
		return new model_ver2_design_DefaultLobbyController();
	}
	,getBattleController: function() {
		return new model_ver2_design_DefaultBattleController();
	}
};
function model_ver2_design_Default_testTable(game) {
	game.createCard(model_ver2_design_CreateCardConfig.One("","",""));
	var table = game.getBattleController().getTable();
}
function model_ver2_design_Default_testFlow(game) {
	var ctl = game.getBattleController();
	ctl.setTiming(model_ver2_design_Timing.Default,true);
	var cmds = ctl.getCommands(model_ver2_design_PlayerId.A);
}
function model_ver2_design_Default_testCut(game) {
	var ctr = game.getBattleController().getCutController();
	ctr.cutIn(null,false);
	ctr.getTop();
}
function model_ver2_design_Default_test(game) {
	var fn = model_ver2_design_Default_testTable;
	game.clear();
	fn(game);
	var fn = model_ver2_design_Default_testFlow;
	game.clear();
	fn(game);
	var fn = model_ver2_design_Default_testCut;
	game.clear();
	fn(game);
}
String.__name__ = true;
Array.__name__ = true;
js_Boot.__toStr = ({ }).toString;
TestVer2.main();
})({});
