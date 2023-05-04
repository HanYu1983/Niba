package model.ver1.game.component;

using haxe.ds.Option;

import model.ver1.game.define.Effect;

interface IActiveEffectComponent {
	var activeEffect:Option<Effect>;
}

function setActiveEffect(ctx:IActiveEffectComponent, effect:Option<Effect>):Void {
	ctx.activeEffect = effect;
}

function getActiveEffect(ctx:IActiveEffectComponent):Option<Effect> {
	return ctx.activeEffect;
}
