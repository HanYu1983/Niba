package gameplay

import (
	"fmt"
	"time"
)

func Start(ctx IView, origin Gameplay) (Gameplay, error) {
	var err error
	gameplayCtx := origin
Turn:
	for {
		time.Sleep(1 * time.Second)

		activePlayer, isActivePlayerExist := gameplayCtx.Players[gameplayCtx.ActivePlayerID]
		if isActivePlayerExist == false {
			return origin, fmt.Errorf("Active Player not found, gameplay init error")
		}

		gameplayCtx, err = PlayerTurn(ctx, gameplayCtx, activePlayer)
		if err != nil {
			return origin, err
		}

		if gameplayCtx.EndState.Completed {
			break Turn
		}
	}

	gameplayCtx, err = End(ctx, gameplayCtx)
	if err != nil {
		return origin, err
	}
	return gameplayCtx, nil
}
