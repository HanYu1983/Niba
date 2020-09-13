package gameplay

func End(ctx IView, gameplayCtx Gameplay) (Gameplay, error) {
	ctx.Alert("Game End")
	ctx.Alert(gameplayCtx.EndState.Reason)
	return gameplayCtx, nil
}
