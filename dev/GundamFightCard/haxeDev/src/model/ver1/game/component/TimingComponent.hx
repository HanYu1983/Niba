package model.ver1.game.component;

import model.ver1.game.define.Timing;

interface ITimingComponent {
	var timing:Timing;
}

function setTiming(ctx:ITimingComponent, timing:Timing) {
	ctx.timing = timing;
}

function getTiming(ctx:ITimingComponent){
	return ctx.timing;
}

function isTiming(ctx: ITimingComponent, timing:Timing){
	return ctx.timing.equals(timing);
}