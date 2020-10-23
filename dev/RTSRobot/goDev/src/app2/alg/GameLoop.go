package alg

import "app2/data"

func GameLoop(origin data.Gameplay) (data.Gameplay, error) {
	var err error
	gameplayCtx := origin
	for {
		gameplayCtx, err = PlayerTurn(gameplayCtx)
		if err != nil {
			return origin, err
		}
		if gameplayCtx.Done != nil {
			break
		}
		gameplayCtx, err = EnemyTurn(gameplayCtx)
		if err != nil {
			return origin, err
		}
		if gameplayCtx.Done != nil {
			break
		}
	}
	return gameplayCtx, nil
}
