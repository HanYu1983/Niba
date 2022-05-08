package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;
import model.ver2.Mock;
import model.ver2.alg.Alg;

using Lambda;

function _getUnEquipResult(ctx:Context, p1:model.PeopleGenerator.People,
		unequipId:Int):{peopleBefore:model.PeopleGenerator.People, peopleAfter:model.PeopleGenerator.People} {
	return {
		peopleAfter: PeopleGenerator.getInst().generate(),
		peopleBefore: PeopleGenerator.getInst().generate(),
	};
}

function _getEquipResult(ctx:Context, p1:model.PeopleGenerator.People,
		equipId:Int):{peopleBefore:model.PeopleGenerator.People, peopleAfter:model.PeopleGenerator.People} {
	return {
		peopleAfter: PeopleGenerator.getInst().generate(),
		peopleBefore: PeopleGenerator.getInst().generate(),
	};
}

function _takeEquip(ctx:Context, p1:model.PeopleGenerator.People, equipId:Int) {}
function _takeUnEquip(ctx:Context, p1:model.PeopleGenerator.People, unequipId:Int) {}
