package cmd

import (
	"app/gameplay"
	"app/gameplay/ai"
)

// AskOnePlayer is
func (view CmdView) AskOnePlayer(gameplayCtx gameplay.Gameplay, player gameplay.Player, players []gameplay.Player) (gameplay.Player, error) {
	if player.GroupID != gameplay.GroupIDPlayer {
		return ai.AskOnePlayer(gameplayCtx, player, players)
	}
	return AskOneGameplayPlayer(gameplayCtx, player, "AskOnePlayer", players, func(player gameplay.Player) bool {
		return true
	})
}
