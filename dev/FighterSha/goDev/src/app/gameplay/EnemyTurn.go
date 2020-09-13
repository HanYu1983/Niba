package gameplay

func EnemyTurn(ctx IView, origin Gameplay, activePlayer Player) (Gameplay, error) {
	var err error
	gameplayCtx := origin
	// 清空狀態
	gameplayCtx.PlayerBasicComs = AssocStringPlayerBasicCom(gameplayCtx.PlayerBasicComs, activePlayer.ID, PlayerBasicCom{})
	// 下個玩家
	gameplayCtx, err = NextPlayer(ctx, gameplayCtx, activePlayer)
	if err != nil {
		return origin, err
	}
	return gameplayCtx, nil
}
