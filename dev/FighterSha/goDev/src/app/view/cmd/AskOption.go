package cmd

import (
	"app/gameplay"
	"app/gameplay/ai"
)

// AskOption is
func (v CmdView) AskOption(gameplayCtx gameplay.Gameplay, player gameplay.Player, title string, options []string) (string, error) {
	if player.GroupID != gameplay.GroupIDPlayer {
		return ai.AskOption(gameplayCtx, player, title, options)
	}
	return AskOneString(gameplayCtx, player, title, options, func(option string) bool {
		return true
	})
}
