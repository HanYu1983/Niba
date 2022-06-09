package p5

import (
	"app/gameplay"
	"app/gameplay/ai"
)

// AskCommand is
func (v *P5View) AskCommand(gameplayCtx gameplay.Gameplay, player gameplay.Player) (interface{}, error) {
	return ai.AskCommand(gameplayCtx, player)
}
