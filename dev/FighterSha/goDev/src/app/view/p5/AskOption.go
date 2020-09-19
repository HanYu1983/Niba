package p5

import (
	"app/gameplay"
	"app/gameplay/ai"
	"fmt"
)

// AskOption is
func (v *P5View) AskOption(gameplayCtx gameplay.Gameplay, player gameplay.Player, title string, options []string) (string, error) {
	v.Alert(title)
	ret, err := ai.AskOption(gameplayCtx, player, title, options)
	v.Alert(fmt.Sprintf("%v回答[%v]", player.ID, ret))
	return ret, err
}
