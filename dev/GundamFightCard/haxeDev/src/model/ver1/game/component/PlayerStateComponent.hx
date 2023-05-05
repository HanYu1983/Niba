package model.ver1.game.component;

typedef PlayerState = {
	hasPlayG:Bool
}

interface IPlayerStateComponent {
	var playerStates:Map<String, PlayerState>;
}

function getPlayerState(ctx:IPlayerStateComponent, playerId:String):PlayerState {
	final playerState = ctx.playerStates[playerId];
	if (playerState == null) {
		return {
			hasPlayG: false
		}
	}
	return playerState;
}

function setCardState(ctx:IPlayerStateComponent, playerId:String, playerState:PlayerState) {
	ctx.playerStates[playerId] = playerState;
}
