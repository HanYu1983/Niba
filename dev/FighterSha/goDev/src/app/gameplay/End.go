package gameplay

import "fmt"

func End(ctx IView, gameplayCtx Gameplay) (Gameplay, error) {
	ctx.Alert(fmt.Sprintf("因為%v, 遊戲結束", gameplayCtx.EndState.Reason))
	return gameplayCtx, nil
}
