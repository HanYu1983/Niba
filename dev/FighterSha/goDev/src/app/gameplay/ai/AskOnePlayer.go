package ai

import (
	"app/gameplay"
)

// AskOnePlayer is
func AskOnePlayer(gameplayCtx gameplay.Gameplay, player gameplay.Player, players []gameplay.Player) (gameplay.Player, error) {
	if len(players) == 0 {
		return gameplay.Player{}, nil
	}
	return players[0], nil
}
