package vic.widgets;

import common.Define.RobotView;

@:build(haxe.ui.ComponentBuilder.build('vic/widgets/WeaponListWidget.xml'))
class WeaponListWidget extends BasicListWidget {
	public function new() {
		super();
	}

	override public function setInfo(info:Dynamic) {
		super.setInfo(info);

        final weapons = Main.view.getLobbyController().getWeapons();
		final robot:RobotView = info;

        dataSource.clear();
        for(wid in robot.weaponIds){
            final weapon = weapons.get(wid);
            dataSource.add(weapon);

            trace(weapon);
        }
	}
}
