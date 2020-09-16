package p5

import (
	"app/gameplay"
	"app/gameplay/ai"
)

// AskOption is
func (v *P5View) AskOption(gameplayCtx gameplay.Gameplay, player gameplay.Player, title string, options []string) (string, error) {
	return ai.AskOption(gameplayCtx, player, title, options)
}
