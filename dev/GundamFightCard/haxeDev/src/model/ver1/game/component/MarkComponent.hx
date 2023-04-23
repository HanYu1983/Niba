package model.ver1.game.component;

import model.ver1.game.define.Mark;

interface IMarkComponent {
	var marks:Map<String, Mark>;
}

function addMark(ctx:IMarkComponent, mark:Mark) {
	if (ctx.marks.exists(mark.id)) {
		throw new haxe.Exception('mark exists: ${mark.id}');
	}
	ctx.marks[mark.id] = mark;
}

function removeMark(ctx:IMarkComponent, id:String) {
	ctx.marks.remove(id);
}

function getMarks(ctx:IMarkComponent):Array<Mark> {
	return [for (mark in ctx.marks) mark];
}