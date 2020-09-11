package cmd

import (
	"app/gameplay"
	"fmt"
)

// Render is
func (v CmdView) Render(gameplayCtx gameplay.Gameplay) {
	fmt.Printf("%+v\n", gameplayCtx)
}
