package model.ver1.game.component;

using haxe.EnumTools.EnumValueTools;
import model.ver1.game.define.Timing;

interface ITimingComponent {
	var timing:Timing;
}

function setTimging(ctx:ITimingComponent, timing:Timing) {
	ctx.timing = timing;
}

function getTiming(ctx:ITimingComponent){
	return ctx.timing;
}

function isTiming(ctx: ITimingComponent, timing:Timing){
	return ctx.timing.equals(timing);
}