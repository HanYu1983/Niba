package;

import model.TestResourceModel;
import model.PeopleGenerator;
import model.TestNegoModel;
import js.Syntax;
import model.ModelWisp.NativeModule;
import haxe.ui.themes.Theme;
import haxe.ui.themes.ThemeManager;
import model.DebugModel;
import model.IModel;
import view.MainView;
import haxe.ui.HaxeUIApp;
import model.ModelVer1;
import model.ModelVer2;
import model.ModelWisp;
import model.TestExploreModel;

class Main {
	public static var model:IModel;
	public static var view:MainView;

	public static function main() {
		// model = new TestResourceModel();
		model = new ModelVer2();

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
		for(ability in abilitys){
			if(p.abilities.indexOf(ability) > -1){
				abiString += PeopleGenerator.getInst().getAbilityName(ability) + ' ';
			}
		}
		return abiString;
	}

	public static function clamp(value:Float, min:Float = 0, max:Float = 1):Float{
		value = Math.min(value, 1);
		value = Math.max(value, 0);
		return value;
	}

	public static function getVSString(p1Value:Float, p2Value:Float):String {
		final symbol:String = if(p1Value / p2Value > 2.0){
			"OOO";
		}else if(p1Value / p2Value > 1.5){
			"OO";
		}else if(p1Value / p2Value > 1.0){
			"O";
		}else if(p1Value / p2Value > 0.7){
			"X";
		}else {
			"XX";
		}
		return '${p1Value} vs ${p2Value} (${ symbol })';
	}
	
	public static function getEnergyString(before:Float, after:Float, max:Float):String {
		return'${before} => ${after} (${getRateString((before-after)/max)})';
	}
}
