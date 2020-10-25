package alg

import "app2/data"

func GameLoop(origin data.Gameplay, inputCh <-chan interface{}) (data.Gameplay, error) {
	var err error
	gameplayCtx := origin
	for {
		gameplayCtx.ActivePlayerID = data.PlayerIDPlayer
		gameplayCtx, err = PlayerTurn(gameplayCtx, inputCh)
		if err != nil {
			return origin, err
		}
		if gameplayCtx.Done != nil {
			break
		}
		for _, enemy := range gameplayCtx.Players {
			if enemy.ID == data.PlayerIDPlayer {
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
