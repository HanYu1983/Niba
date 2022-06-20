package vic.widgets;

import common.IViewModel.RobotView;

@:build(haxe.ui.ComponentBuilder.build('vic/widgets/WeaponListWidget.xml'))
class WeaponListWidget extends BasicListWidget {
	public function new() {
		super();
	}

	override public function setInfo(info:Dynamic) {
		super.setInfo(info);

		final weapons = Main.getLobbyController().getWeapons();
		final weaponIds:Array<String> = info;

		dataSource.clear();
		for (wid in weaponIds) {
			final weapon = weapons.get(wid);
			dataSource.add(weapon);
		}
	}
}
