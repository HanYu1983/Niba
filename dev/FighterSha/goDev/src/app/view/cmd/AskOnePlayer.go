package cmd

import (
	"app/gameplay"
)

// AskOnePlayer is
func (view CmdView) AskOnePlayer(gameplayCtx gameplay.Gameplay, player gameplay.Player, players map[string]gameplay.Player) (gameplay.Player, error) {
	return player, nil
}
