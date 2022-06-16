package vic.widgets;

import common.IDefine.WeaponAttackView;

@:build(haxe.ui.ComponentBuilder.build('vic/widgets/BattleWeaponListWidget.xml'))
class BattleWeaponListWidget extends BasicListWidget {
	public function new() {
		super();
	}

	override public function setInfo(info:Dynamic) {
		super.setInfo(info);

		final weapons:Array<WeaponAttackView> = info;
		dataSource.clear();
		for (weapon in weapons) {
			final clone:Dynamic = Reflect.copy(weapon);
			clone.hitRate = Main.getRateString(weapon.hitRate);
			dataSource.add(clone);
		}
	}
}
