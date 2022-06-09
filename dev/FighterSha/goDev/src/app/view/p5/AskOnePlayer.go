package p5

import (
	"app/gameplay"
	"app/gameplay/ai"
)

// AskOnePlayer is
func (view *P5View) AskOnePlayer(gameplayCtx gameplay.Gameplay, player gameplay.Player, players []gameplay.Player) (gameplay.Player, error) {
	return ai.AskOnePlayer(gameplayCtx, player, players)
}
