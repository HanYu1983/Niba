package gameplay

import "app/tool/data"

func GameLoop(origin data.Gameplay) (data.Gameplay, error) {
	var err error
	gameplayCtx := origin
	for {
		Render(gameplayCtx)
		gameplayCtx.ActivePlayerID = protocol.PlayerIDPlayer
		gameplayCtx, err = PlayerTurn(gameplayCtx)
		if err != nil {
			return origin, err
		}
		if gameplayCtx.Done != nil {
			break
		}
		for _, enemy := range gameplayCtx.Players {
			if enemy.ID == protocol.PlayerIDPlayer {
				continue
			}
			gameplayCtx.ActivePlayerID = enemy.ID
			gameplayCtx, err = EnemyTurn(gameplayCtx, enemy.ID)
			if err != nil {
				return origin, err
			}
			if gameplayCtx.Done != nil {
				break
			}
		}
	}
	return gameplayCtx, nil
}
