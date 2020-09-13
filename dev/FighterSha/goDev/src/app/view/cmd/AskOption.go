package cmd

import (
	"app/gameplay"
)

// AskOption is
func (v CmdView) AskOption(gameplayCtx gameplay.Gameplay, player gameplay.Player, title string, options []string) (string, error) {
	return AskOneString(gameplayCtx, player, title, options, func(option string) bool {
		return true
	})
}
