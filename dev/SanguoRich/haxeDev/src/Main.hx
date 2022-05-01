package;

import model.GridGenerator.BUILDING;
import model.PeopleGenerator;
import js.Syntax;
import model.IModel;
import view.MainView;
import haxe.ui.HaxeUIApp;
import model.ver2.ModelVer2;
import model.CacheModel;
import model.DebugModel;

private function runTest() {
	model.ver2.TestCase.test();
}

class Main {
	public static var model:IModel;
	public static var view:MainView;

	public static function main() {
		// 跑測試
		// 只開發前台時可以關掉
		if (false) {
			runTest();
		}

		// model = new TestResourceModel();
		model = new CacheModel(new ModelVer2());

		var app = new HaxeUIApp();
		app.ready(function() {
			view = new MainView();
			app.addComponent(view);

			// ThemeManager.instance.applyTheme(Theme.DARK);
		});
	}

	public static function getFixNumber(number:Float, count:Int = 2):Float {
		var round = Syntax.code('Number.prototype.toFixed');
		return round.call(number, count);
	}

	public static function getRateString(rate:Float):String {
		rate = rate > 1 ? 1 : rate;
		return getFixNumber(rate * 100, 2) + '%';
	}

	public static function getAbilityString(p:People, abilitys:Array<Int>) {
		var abiString = '';
		for (ability in abilitys) {
			if (p.abilities.indexOf(ability) > -1) {
				abiString += PeopleGenerator.getInst().getAbilityName(ability) + ' ';
			}
		}
		return abiString;
	}

	public static function clamp(value:Float, min:Float = 0, max:Float = 1):Float {
		value = Math.min(value, 1);
		value = Math.max(value, 0);
		return value;
	}

	public static function getVSString(p1Value:Float, p2Value:Float):String {
		final symbol:String = if (p1Value / p2Value > 2.0) {
			"OOO";
		} else if (p1Value / p2Value > 1.5) {
			"OO";
		} else if (p1Value / p2Value > 1.0) {
			"O";
		} else if (p1Value / p2Value > 0.7) {
			"X";
		} else {
			"XX";
		}
		return '${p1Value} vs ${p2Value} (${symbol})';
	}

	public static function getEnergyString(before:Float, after:Float, max:Float):String {
		return '${before} => ${after} (${getRateString((before - after) / max)})';
	}

	// public static function getFavorString(favor:Int):String {
	// 	return if(favor <= -2){
	// 		'厭惡';
	// 	}else if(favor <= -1){
	// 		'不悅';
	// 	}else if(favor <= 0){
	// 		'陌生';
	// 	}else if(favor <= 1){
	// 		'熟悉';
	// 	}else{
	// 		'友好';
	// 	}
	// }

	public static function getFavorString(favor:Int):String {
		return if (favor <= -2) {
			'(ﾟ皿ﾟﾒ)';
		} else if (favor <= -1) {
			'(`д´)/';
		} else if (favor <= 0) {
			'(⁰▿⁰)';
		} else if (favor <= 1) {
			'\\(^u^)/';
		} else {
			'(*´∀`)~♥';
		}
	}

	public static function cloneObject(obj:Dynamic):Dynamic {
		final clone = {};
		for (key in Reflect.fields(obj)) {
			Reflect.setField(clone, key, Reflect.field(obj, key));
		}
		return clone;
	}

	public static function getBuildingCatelog(b:BUILDING) {
		final catelog = BuildingList.filter((catelog) -> Type.enumEq(catelog.type, b));
		return catelog[0];
	}
}
