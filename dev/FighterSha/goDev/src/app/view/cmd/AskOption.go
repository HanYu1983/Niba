package cmd

import (
	"app/gameplay"
)

// AskOption is
func (v CmdView) AskOption(gameplayCtx gameplay.Gameplay, player gameplay.Player, title string, options []string) (string, error) {
	if player.GroupID != gameplay.GroupIDPlayer {
		if len(options) == 0 {
			return "", nil
		}
		return "", nil
	}
	return AskOneString(gameplayCtx, player, title, options, func(option string) bool {
		return true
	})
}
