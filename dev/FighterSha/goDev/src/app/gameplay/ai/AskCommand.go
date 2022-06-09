package ai

import (
	"app/gameplay"
	"app/view"
)

func AskCommand(gameplayCtx gameplay.Gameplay, player gameplay.Player) (interface{}, error) {
	cmds := []interface{}{
		view.CmdUseCard{},
		view.CmdBuyItem{},
		view.CmdSellCard{},
		view.CmdEndTurn{},
	}
	maxW := 0
	maxI := 0
	for i, cmd := range cmds {
		cmd, w := CmdWeight(gameplayCtx, player, cmd)
		if maxW < w {
			maxW = w
			maxI = i
		}
		cmds[i] = cmd
	}
	if maxW == 0 {
		return view.CmdEndTurn{}, nil
	}
	return cmds[maxI], nil
}
