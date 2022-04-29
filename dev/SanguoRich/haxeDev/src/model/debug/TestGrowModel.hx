package model.debug;

import model.IModel.PreResultOnExplore;
import model.IModel.ExplorePreview;
import model.IModel.PreResultOnHire;
import model.IModel.HirePreview;
import model.GridGenerator.BUILDING;
import model.IModel.NegoPreview;
import model.IModel.WarPreview;
import model.IModel.ActionInfoID;
import model.IModel.EventInfoID;
import model.IModel.PlayerInfo;
import model.IModel.GameInfo;
import model.GridGenerator.Grid;
import model.PeopleGenerator.People;

class TestGrowModel extends DebugModel {
	override function gameInfo():GameInfo {
		trace(info.events);
		return info;
	}

	override function playerEnd(cb:() -> Void) {
		info.events = [
			{
				id: EventInfoID.WORLD_EVENT,
				value: {
					playerBefore: info.players,
					playerAfter: info.players,
					gridBefore: info.grids,
					gridAfter: info.grids,
				}
			}
		];
		cb();
	}
}
