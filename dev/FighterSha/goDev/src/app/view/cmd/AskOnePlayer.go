package cmd

import (
	"app/gameplay"
)

// AskOnePlayer is
func (view CmdView) AskOnePlayer(gameplayCtx gameplay.Gameplay, player gameplay.Player, players []gameplay.Player) (gameplay.Player, error) {
	return AskOneGameplayPlayer(gameplayCtx, player, "AskOnePlayer", players, func(player gameplay.Player) bool {
		return true
	})
}
