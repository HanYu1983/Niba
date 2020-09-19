package ai

import (
	"app/gameplay"
)

// AskOption is
func AskOption(gameplayCtx gameplay.Gameplay, player gameplay.Player, title string, options []string) (string, error) {
	if len(options) == 0 {
		return "", nil
	}
	return options[0], nil
}
